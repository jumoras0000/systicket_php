/**
 * Systicket 2.0 - Application principale
 * Gère toutes les communications API et le rendu dynamique
 */
(function() {
    'use strict';

    var CFG = window.SYSTICKET || {};
    var API = CFG.apiUrl || '/systicket2/api';
    var BASE = CFG.baseUrl || '/systicket2';
    var CSRF = CFG.csrfToken || '';

    // ========================================
    // UTILITAIRES API
    // ========================================

    function apiUrl(endpoint) {
        return API + '/' + endpoint;
    }

    function appUrl(path) {
        return BASE + '/' + path;
    }

    function fetchApi(endpoint, options) {
        options = options || {};
        var headers = options.headers || {};
        headers['X-Requested-With'] = 'XMLHttpRequest';
        if (CSRF) {
            headers['X-CSRF-TOKEN'] = CSRF;
        }
        if (!headers['Content-Type'] && options.body && typeof options.body === 'string') {
            headers['Content-Type'] = 'application/json';
        }
        options.headers = headers;
        return fetch(apiUrl(endpoint), options)
            .then(function(r) {
                if (!r.ok) {
                    return r.json().then(function(data) {
                        throw new Error(data.error || data.message || 'Erreur ' + r.status);
                    }).catch(function(err) {
                        if (err.message) throw err;
                        throw new Error('Erreur ' + r.status);
                    });
                }
                return r.json();
            });
    }

    // Auto-unwrap {success: true, data: ...} responses
    function unwrap(response) {
        if (response && response.data !== undefined) {
            return response.data;
        }
        return response;
    }

    function apiGet(endpoint) {
        return fetchApi(endpoint, { method: 'GET' }).then(unwrap);
    }

    function apiPost(endpoint, data) {
        data = data || {};
        data._token = CSRF;
        return fetchApi(endpoint, {
            method: 'POST',
            body: JSON.stringify(data)
        });
    }

    function apiPut(endpoint, data) {
        data = data || {};
        data._token = CSRF;
        return fetchApi(endpoint, {
            method: 'PUT',
            body: JSON.stringify(data)
        });
    }

    function apiDelete(endpoint) {
        return fetchApi(endpoint, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ _token: CSRF })
        });
    }

    // ========================================
    // UTILITAIRES GÉNÉRAUX
    // ========================================

    function esc(str) {
        if (str === null || str === undefined) return '';
        var div = document.createElement('div');
        div.textContent = String(str);
        return div.innerHTML;
    }

    function formatDate(dateStr) {
        if (!dateStr) return '—';
        var d = new Date(dateStr);
        if (isNaN(d.getTime())) return dateStr;
        return d.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' });
    }

    function formatHours(h) {
        if (h === null || h === undefined) return '—';
        return parseFloat(h).toFixed(1) + 'h';
    }

    // Map French form field names to English API field names
    function mapFormData(entity, data) {
        // Form field names now use English directly.
        // This map only handles any remaining legacy French form fields.
        var maps = {
            ticket: {},
            projet: {},
            contrat: {},
            user: {},
            temps: {
                'date_saisie': 'date',
                'heures': 'hours'
            }
        };
        var map = maps[entity] || {};
        var mapped = {};
        Object.keys(data).forEach(function(key) {
            mapped[map[key] || key] = data[key];
        });
        return mapped;
    }

    // ========================================
    // BADGES
    // ========================================

    function statusBadge(status) {
        var map = {
            'new':            '<span class="badge badge-info">Nouveau</span>',
            'in-progress':    '<span class="badge badge-warning">En cours</span>',
            'waiting-client': '<span class="badge badge-secondary">En attente client</span>',
            'done':           '<span class="badge badge-success">Terminé</span>',
            'to-validate':    '<span class="badge badge-primary">À valider</span>',
            'validated':      '<span class="badge badge-success">Validé</span>',
            'refused':        '<span class="badge badge-danger">Refusé</span>'
        };
        return map[status] || '<span class="badge">' + esc(status) + '</span>';
    }

    function statusLabel(status) {
        var map = {
            'new': 'Nouveau', 'in-progress': 'En cours', 'waiting-client': 'En attente client',
            'done': 'Terminé', 'to-validate': 'À valider', 'validated': 'Validé', 'refused': 'Refusé'
        };
        return map[status] || status;
    }

    function priorityBadge(priority) {
        var map = {
            'low':      '<span class="badge badge-info">Faible</span>',
            'normal':   '<span class="badge">Normale</span>',
            'high':     '<span class="badge badge-warning">Élevée</span>',
            'critical': '<span class="badge badge-danger">Critique</span>'
        };
        return map[priority] || '<span class="badge">' + esc(priority) + '</span>';
    }

    function typeBadge(type) {
        return type === 'billable'
            ? '<span class="badge badge-warning">Facturable</span>'
            : '<span class="badge badge-success">Inclus</span>';
    }

    function projetStatusBadge(status) {
        var map = {
            'active':    '<span class="badge badge-success">Actif</span>',
            'paused':    '<span class="badge badge-warning">En pause</span>',
            'completed': '<span class="badge badge-secondary">Terminé</span>'
        };
        return map[status] || '<span class="badge">' + esc(status) + '</span>';
    }

    // ========================================
    // MESSAGES FORMULAIRE
    // ========================================

    function showFormMessage(formEl, msg, type) {
        var msgEl = formEl.querySelector('.form-messages');
        if (!msgEl) return;
        msgEl.innerHTML = '<div class="alert alert-' + (type || 'danger') + '">' + esc(msg) + '</div>';
        msgEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    function clearFormMessage(formEl) {
        var msgEl = formEl.querySelector('.form-messages');
        if (msgEl) msgEl.innerHTML = '';
    }

    // ========================================
    // PAGE: DASHBOARD
    // ========================================

    function initDashboard() {
        if (document.body.getAttribute('data-page') !== 'dashboard') return;

        apiGet('dashboard.php?action=stats').then(function(data) {
            if (!data) return;
            setTextById('dash-tickets-open', data.tickets_open || 0);
            setTextById('dash-projets-active', data.projets_active || 0);
            setTextById('dash-validation-count', data.to_validate || 0);
            setTextById('dash-hours-month', formatHours(data.hours_month || 0));

            // Populate hours gauge
            var gaugeEl = document.getElementById('dash-hours-gauge');
            if (gaugeEl) {
                var budget = parseFloat(data.hours_budget) || 0;
                var consumed = parseFloat(data.hours_consumed) || 0;
                var remaining = Math.max(0, budget - consumed);
                var pct = budget > 0 ? Math.round((consumed / budget) * 100) : 0;
                var gaugeValue = gaugeEl.querySelector('.dashboard-gauge-value');
                if (gaugeValue) gaugeValue.innerHTML = formatHours(consumed) + ' <span class="text-secondary">/ ' + formatHours(budget) + '</span>';
                var progressFill = gaugeEl.querySelector('.progress-fill');
                if (progressFill) progressFill.style.width = Math.min(pct, 100) + '%';
                var progressText = gaugeEl.querySelector('.progress-text');
                if (progressText) progressText.textContent = pct + '% consommé — ' + formatHours(remaining) + ' restantes';
            }
        }).catch(function() {});

        apiGet('dashboard.php?action=tickets-by-status').then(function(data) {
            var container = document.getElementById('dash-tickets-by-status');
            if (!container || !data || !data.length) return;
            var total = data.reduce(function(s, d) { return s + parseInt(d.count || 0); }, 0);
            var colors = ['dashboard-chart-bar-blue', 'dashboard-chart-bar-primary', 'dashboard-chart-bar-green', 'dashboard-chart-bar-amber', 'dashboard-chart-bar-gray'];
            var html = '<div class="dashboard-chart-bars">';
            data.forEach(function(item, i) {
                var pct = total > 0 ? Math.round((item.count / total) * 100) : 0;
                html += '<div class="dashboard-chart-row">';
                html += '<span class="dashboard-chart-label">' + esc(statusLabel(item.status)) + '</span>';
                html += '<div class="dashboard-chart-bar-wrap">';
                html += '<div class="dashboard-chart-bar ' + (colors[i % colors.length]) + '" style="width: ' + pct + '%;"></div>';
                html += '</div>';
                html += '<span class="dashboard-chart-value">' + item.count + '</span>';
                html += '</div>';
            });
            html += '</div>';
            container.innerHTML = html;
        }).catch(function() {});

        apiGet('dashboard.php?action=hours-by-project').then(function(data) {
            var container = document.getElementById('dash-hours-by-project');
            if (!container || !data || !data.length) return;
            var total = data.reduce(function(s, d) { return s + parseFloat(d.total || 0); }, 0);
            var max = Math.max.apply(null, data.map(function(d) { return parseFloat(d.total || 0); }));
            var colors = ['dashboard-chart-bar-primary', 'dashboard-chart-bar-blue', 'dashboard-chart-bar-green'];
            var html = '<div class="dashboard-chart-bars">';
            data.forEach(function(item, i) {
                var pct = max > 0 ? Math.round((parseFloat(item.total || 0) / max) * 100) : 0;
                html += '<div class="dashboard-chart-row">';
                html += '<span class="dashboard-chart-label">' + esc(item.name) + '</span>';
                html += '<div class="dashboard-chart-bar-wrap">';
                html += '<div class="dashboard-chart-bar ' + (colors[i % colors.length]) + '" style="width: ' + pct + '%;"></div>';
                html += '</div>';
                html += '<span class="dashboard-chart-value">' + formatHours(item.total) + '</span>';
                html += '</div>';
            });
            html += '</div>';
            html += '<p class="dashboard-chart-total"><strong>Total : ' + formatHours(total) + '</strong></p>';
            container.innerHTML = html;
        }).catch(function() {});

        apiGet('dashboard.php?action=recent-tickets').then(function(data) {
            var tbody = document.getElementById('dash-recent-tickets');
            if (!tbody || !data || !data.length) return;
            var html = '';
            data.forEach(function(t) {
                html += '<tr>';
                html += '<td><a href="' + appUrl('ticket-detail?id=' + t.id) + '">#' + t.id + '</a></td>';
                html += '<td>' + esc(t.title) + '</td>';
                html += '<td>' + statusBadge(t.status) + '</td>';
                html += '<td>' + formatDate(t.created_at) + '</td>';
                html += '</tr>';
            });
            tbody.innerHTML = html;
        }).catch(function() {});

        apiGet('dashboard.php?action=recent-activity').then(function(data) {
            var container = document.getElementById('dash-recent-activity');
            if (!container || !data || !data.length) return;
            var html = '<ul class="dashboard-activity" aria-label="Dernières activités">';
            data.forEach(function(a) {
                var icon = a.type === 'temps' ? '⏱️' : '🎫';
                var desc = a.type === 'temps'
                    ? (a.user_name || '') + ' — ' + formatHours(a.hours) + ' sur ' + (a.project_name || '')
                    : (a.user_name || '') + ' — ' + (a.label || '');
                html += '<li class="dashboard-activity-item">';
                html += '<span class="dashboard-activity-icon" aria-hidden="true">' + icon + '</span>';
                html += '<div class="dashboard-activity-content">';
                html += '<p>' + esc(desc) + '</p>';
                html += '<time class="dashboard-activity-time">' + formatDate(a.activity_date) + '</time>';
                html += '</div></li>';
            });
            html += '</ul>';
            container.innerHTML = html;
        }).catch(function() {});

        apiGet('dashboard.php?action=featured-projects').then(function(data) {
            var container = document.getElementById('dash-featured-projects');
            if (!container || !data || !data.length) return;
            var html = '<ul class="dashboard-projects">';
            data.forEach(function(p) {
                html += '<li class="dashboard-project-item">';
                html += '<div class="dashboard-project-info">';
                html += '<span class="dashboard-project-name"><a href="' + appUrl('projet-detail?id=' + p.id) + '">' + esc(p.name) + '</a></span>';
                html += '<span class="dashboard-project-meta">' + esc(p.client_name || '') + ' · ' + (p.tickets_count || 0) + ' tickets</span>';
                html += '</div></li>';
            });
            html += '</ul>';
            container.innerHTML = html;
        }).catch(function() {});
    }

    // ========================================
    // PAGE: TICKETS
    // ========================================

    function initTicketsList() {
        if (document.body.getAttribute('data-page') !== 'tickets') return;
        if (document.getElementById('ticket-form')) return;

        // Charger les projets dans le filtre
        apiGet('projets.php').then(function(data) {
            var sel = document.getElementById('filter-project');
            if (sel && data && data.length) {
                data.forEach(function(p) {
                    var opt = document.createElement('option');
                    opt.value = p.id;
                    opt.textContent = p.name;
                    sel.appendChild(opt);
                });
            }
        }).catch(function() {});

        loadTickets();

        // Client : charger les cartes de validation
        if (CFG.user && CFG.user.role === 'client') {
            loadClientValidationCards();
        }

        // Filtres
        var search = document.getElementById('ticket-search');
        if (search) search.addEventListener('input', debounce(loadTickets, 300));
        ['filter-status', 'filter-priority', 'filter-type', 'filter-project'].forEach(function(id) {
            var el = document.getElementById(id);
            if (el) el.addEventListener('change', loadTickets);
        });
    }

    function loadTickets() {
        var params = [];
        var search = document.getElementById('ticket-search');
        if (search && search.value) params.push('search=' + encodeURIComponent(search.value));
        var status = document.getElementById('filter-status');
        if (status && status.value) params.push('status=' + encodeURIComponent(status.value));
        var priority = document.getElementById('filter-priority');
        if (priority && priority.value) params.push('priority=' + encodeURIComponent(priority.value));
        var type = document.getElementById('filter-type');
        if (type && type.value) params.push('type=' + encodeURIComponent(type.value));
        var project = document.getElementById('filter-project');
        if (project && project.value) params.push('project_id=' + encodeURIComponent(project.value));

        var url = 'tickets.php' + (params.length ? '?' + params.join('&') : '');

        apiGet(url).then(function(tickets) {
            var tbody = document.getElementById('tickets-tbody');
            var countEl = document.getElementById('tickets-count');
            if (!tbody) return;

            if (!tickets || !tickets.length) {
                tbody.innerHTML = '<tr class="table-empty table-empty-row"><td colspan="11">Aucun ticket pour le moment.</td></tr>';
                if (countEl) countEl.textContent = '0';
                return;
            }
            if (countEl) countEl.textContent = tickets.length;

            var html = '';
            tickets.forEach(function(t) {
                html += '<tr class="ticket-row" data-status="' + esc(t.status) + '" data-priority="' + esc(t.priority) + '" data-type="' + esc(t.type) + '">';
                html += '<td><a href="' + appUrl('ticket-detail?id=' + t.id) + '">#' + t.id + '</a></td>';
                html += '<td><a href="' + appUrl('ticket-detail?id=' + t.id) + '">' + esc(t.title) + '</a></td>';
                html += '<td>' + esc(t.project_name || '—') + '</td>';
                html += '<td>' + esc(t.client_name || '—') + '</td>';
                html += '<td>' + statusBadge(t.status) + '</td>';
                html += '<td>' + priorityBadge(t.priority) + '</td>';
                html += '<td>' + typeBadge(t.type) + '</td>';
                html += '<td>' + esc(t.assignee_names || '—') + '</td>';
                html += '<td>' + formatHours(t.spent_hours) + '</td>';
                html += '<td>' + formatDate(t.created_at) + '</td>';
                html += '<td>';
                html += '<a href="' + appUrl('ticket-detail?id=' + t.id) + '" class="btn btn-text btn-small">Voir</a>';
                html += '<a href="' + appUrl('ticket-form?id=' + t.id) + '" class="btn btn-text btn-small role-admin-collaborateur">Éditer</a>';
                html += '</td>';
                html += '</tr>';
            });
            tbody.innerHTML = html;
        }).catch(function(err) {
            var tbody = document.getElementById('tickets-tbody');
            if (tbody) tbody.innerHTML = '<tr><td colspan="11" class="table-empty">Erreur de chargement.</td></tr>';
        });
    }

    // ========================================
    // PAGE: TICKET DETAIL
    // ========================================

    function initTicketDetail() {
        if (typeof window.TICKET_ID === 'undefined' || !window.TICKET_ID) return;

        var id = window.TICKET_ID;

        apiGet('tickets.php?id=' + id).then(function(t) {
            if (!t) return;
            setTextById('breadcrumb-ticket', '#' + t.id + ' - ' + (t.title || ''));
            setTextById('ticket-title', t.title);
            setHtmlById('ticket-id', '#' + t.id);
            setHtmlById('ticket-status-badge', statusBadge(t.status));
            setHtmlById('ticket-priority-badge', priorityBadge(t.priority));
            setHtmlById('ticket-type-badge', typeBadge(t.type));
            setHtmlById('ticket-description', '<p>' + esc(t.description || '—') + '</p>');
            setTextById('ticket-project', t.project_name || '—');
            setTextById('ticket-client', t.client_name || '—');
            setTextById('ticket-created', formatDate(t.created_at));
            setTextById('ticket-updated', formatDate(t.updated_at));
            setTextById('ticket-author', t.creator_name || '—');
            setTextById('ticket-time-spent', formatHours(t.spent_hours || 0));
            setTextById('ticket-time-est', formatHours(t.estimated_hours || 0));
            setHtmlById('ticket-time-estimated', '<strong>Temps estimé :</strong> ' + formatHours(t.estimated_hours || 0));
            document.title = 'Ticket #' + t.id + ' - Systicket';

            // Assignées inline
            if (t.assignees && t.assignees.length) {
                var container = document.getElementById('ticket-assignees');
                if (container) {
                    var ahtml = '';
                    t.assignees.forEach(function(u) {
                        ahtml += '<div class="assignee-item"><span>' + esc(u.first_name + ' ' + u.last_name) + '</span></div>';
                    });
                    container.innerHTML = ahtml;
                }
            }

            // Comments inline
            if (t.comments) {
                renderComments(t.comments);
            }

            // Time entries inline
            if (t.time_entries) {
                renderTimeEntries(t.time_entries);
            }
        }).catch(function() {});

        // Formulaire commentaire
        var commentForm = document.getElementById('comment-form');
        if (commentForm) {
            commentForm.addEventListener('submit', function(e) {
                e.preventDefault();
                var textarea = commentForm.querySelector('textarea');
                var contenu = textarea ? textarea.value.trim() : '';
                if (!contenu) return;
                apiPost('tickets.php?id=' + id + '&action=comment', { content: contenu })
                    .then(function() {
                        if (textarea) textarea.value = '';
                        // Reload comments
                        apiGet('tickets.php?id=' + id + '&action=comments').then(function(data) {
                            renderComments(data || []);
                        });
                    })
                    .catch(function(err) { alert(err.message); });
            });
        }

        // Changement de statut
        var statusSelect = document.getElementById('ticket-status-change');
        if (statusSelect) {
            statusSelect.addEventListener('change', function() {
                var newStatus = this.value;
                if (!newStatus) return;
                apiPut('tickets.php?id=' + id, { status: newStatus })
                    .then(function() { location.reload(); })
                    .catch(function(err) { alert(err.message); });
            });
        }
    }

    function renderComments(comments) {
        var container = document.getElementById('ticket-comments');
        if (!container) return;
        if (!comments || !comments.length) {
            container.innerHTML = '<p class="text-secondary text-sm">Aucun commentaire.</p>';
            return;
        }
        var html = '';
        comments.forEach(function(c) {
            html += '<div class="comment">';
            html += '<div class="comment-header">';
            html += '<strong>' + esc(c.author_name || 'Utilisateur') + '</strong>';
            html += '<time>' + formatDate(c.created_at) + '</time>';
            html += '</div>';
            html += '<p>' + esc(c.content) + '</p>';
            html += '</div>';
        });
        container.innerHTML = html;
    }

    function renderTimeEntries(entries) {
        var container = document.getElementById('ticket-time-entries');
        if (!container) return;
        if (!entries || !entries.length) {
            container.innerHTML = '<p class="text-secondary text-sm">Aucune entrée de temps.</p>';
            return;
        }
        var total = entries.reduce(function(s, e) { return s + parseFloat(e.hours || 0); }, 0);
        setTextById('ticket-time-total', 'Total : ' + formatHours(total));
        var html = '';
        entries.forEach(function(e) {
            html += '<div class="time-entry">';
            html += '<span class="time-entry-date">' + formatDate(e.date) + '</span>';
            html += '<span class="time-entry-user">' + esc(e.user_name || '') + '</span>';
            html += '<span class="time-entry-hours">' + formatHours(e.hours) + '</span>';
            html += '<span class="time-entry-desc">' + esc(e.description || '') + '</span>';
            html += '</div>';
        });
        container.innerHTML = html;
    }

    // ========================================
    // PAGE: TICKET FORM
    // ========================================

    function initTicketForm() {
        var form = document.getElementById('ticket-form');
        if (!form) return;

        var entityId = parseInt(form.getAttribute('data-id') || 0);
        var duplicateId = parseInt(form.getAttribute('data-duplicate') || 0);

        // Charger projets et collaborateurs
        var projetsLoaded = apiGet('projets.php').then(function(data) {
            var sel = document.getElementById('ticket-project');
            if (sel && data) {
                var projets = Array.isArray(data) ? data : [];
                projets.forEach(function(p) {
                    var opt = document.createElement('option');
                    opt.value = p.id;
                    opt.textContent = p.name;
                    sel.appendChild(opt);
                });
            }
        });

        var collabsLoaded = apiGet('users.php?action=collaborateurs').then(function(data) {
            var sel = document.getElementById('ticket-assignees');
            if (sel && data) {
                sel.innerHTML = '';
                var users = Array.isArray(data) ? data : [];
                users.forEach(function(u) {
                    var opt = document.createElement('option');
                    opt.value = u.id;
                    opt.textContent = u.first_name + ' ' + u.last_name;
                    sel.appendChild(opt);
                });
            }
        });

        // Si édition ou duplication, attendre que les selects soient remplis AVANT de sélectionner les valeurs
        var loadId = entityId || duplicateId;
        if (loadId) {
            Promise.all([projetsLoaded, collabsLoaded]).then(function() {
                return apiGet('tickets.php?id=' + loadId);
            }).then(function(t) {
                if (!t) return;
                setFieldValue('ticket-title', t.title);
                setFieldValue('ticket-description', t.description);
                setFieldValue('ticket-priority', t.priority);
                setFieldValue('ticket-estimated-hours', t.estimated_hours);
                // Status (edit mode only)
                setFieldValue('ticket-status', t.status);
                // Projet (les options sont déjà chargées grâce à Promise.all)
                setFieldValue('ticket-project', t.project_id);
                // Type radio
                var radios = form.querySelectorAll('input[name="type"]');
                radios.forEach(function(r) { r.checked = (r.value === t.type); });
                // Assignees (les options sont déjà chargées grâce à Promise.all)
                if (t.assignees) {
                    var sel = document.getElementById('ticket-assignees');
                    if (sel) {
                        t.assignees.forEach(function(a) {
                            var opt = sel.querySelector('option[value="' + a.id + '"]');
                            if (opt) opt.selected = true;
                        });
                    }
                }
            });
        }

        form.addEventListener('submit', function(e) {
            e.preventDefault();
            clearFormMessage(form);

            var formData = new FormData(form);
            var data = {};
            formData.forEach(function(val, key) {
                if (key === 'assignees[]') {
                    if (!data.assignees) data.assignees = [];
                    data.assignees.push(val);
                } else {
                    data[key] = val;
                }
            });

            // Map French form field names to English API names
            data = mapFormData('ticket', data);

            var promise;
            if (entityId) {
                promise = apiPut('tickets.php?id=' + entityId, data);
            } else {
                promise = apiPost('tickets.php', data);
            }

            promise.then(function(result) {
                var newId = result.id || entityId;
                window.location.href = appUrl('ticket-detail?id=' + newId);
            }).catch(function(err) {
                showFormMessage(form, err.message);
            });
        });
    }

    // ========================================
    // PAGE: PROJETS
    // ========================================

    function initProjetsList() {
        if (document.body.getAttribute('data-page') !== 'projets') return;
        if (document.getElementById('project-form')) return;

        // Charger clients dans filtre
        apiGet('users.php?action=clients').then(function(data) {
            var sel = document.getElementById('filter-client');
            if (sel && data) {
                var clients = Array.isArray(data) ? data : [];
                clients.forEach(function(c) {
                    var opt = document.createElement('option');
                    opt.value = c.id;
                    opt.textContent = c.first_name + ' ' + c.last_name;
                    sel.appendChild(opt);
                });
            }
        }).catch(function() {});

        loadProjets();

        // Filtres
        var search = document.getElementById('projet-search');
        if (search) search.addEventListener('input', debounce(loadProjets, 300));
        ['filter-status', 'filter-client'].forEach(function(id) {
            var el = document.getElementById(id);
            if (el) el.addEventListener('change', loadProjets);
        });
    }

    function loadProjets() {
        var params = [];
        var search = document.getElementById('projet-search');
        if (search && search.value) params.push('search=' + encodeURIComponent(search.value));
        var status = document.getElementById('filter-status');
        if (status && status.value) params.push('status=' + encodeURIComponent(status.value));
        var client = document.getElementById('filter-client');
        if (client && client.value) params.push('client_id=' + encodeURIComponent(client.value));

        var url = 'projets.php' + (params.length ? '?' + params.join('&') : '');

        apiGet(url).then(function(projets) {
            var tbody = document.getElementById('projets-tbody');
            var countEl = document.getElementById('projets-count');
            if (!tbody) return;

            if (!projets || !projets.length) {
                tbody.innerHTML = '<tr class="table-empty-row"><td colspan="7">Aucun projet pour le moment.</td></tr>';
                if (countEl) countEl.textContent = '0';
                return;
            }
            if (countEl) countEl.textContent = projets.length;

            // Compteurs
            var active = 0, paused = 0, completed = 0;
            var html = '';
            projets.forEach(function(p) {
                if (p.status === 'active') active++;
                else if (p.status === 'paused') paused++;
                else if (p.status === 'completed') completed++;

                html += '<tr class="project-row" data-status="' + esc(p.status) + '" data-client="' + (p.client_id || '') + '">';
                html += '<td><a href="' + appUrl('projet-detail?id=' + p.id) + '">' + esc(p.name) + '</a></td>';
                html += '<td>' + esc(p.client_name || '—') + '</td>';
                html += '<td>' + projetStatusBadge(p.status) + '</td>';
                html += '<td>' + (p.tickets_count || 0) + '</td>';
                html += '<td>' + formatHours(p.total_hours || 0) + '</td>';
                html += '<td>';
                var progPct = 0;
                if (p.contract_hours && parseFloat(p.contract_hours) > 0) {
                    progPct = Math.round((parseFloat(p.total_hours) || 0) / parseFloat(p.contract_hours) * 100);
                }
                var progColor = progPct > 100 ? ' progress-fill-danger' : (progPct > 80 ? ' progress-fill-warning' : '');
                html += '<div class="progress-bar"><div class="progress-fill' + progColor + '" style="width: ' + Math.min(progPct, 100) + '%;"></div></div>';
                html += '<span class="progress-text-small">' + progPct + '%</span>';
                html += '</td>';
                html += '<td>';
                html += '<a href="' + appUrl('projet-detail?id=' + p.id) + '" class="btn btn-text btn-small">Voir</a>';
                html += '<a href="' + appUrl('projet-form?id=' + p.id) + '" class="btn btn-text btn-small role-admin-collaborateur">Éditer</a>';
                html += '</td>';
                html += '</tr>';
            });
            tbody.innerHTML = html;

            setTextById('projets-active', active);
            setTextById('projets-paused', paused);
            setTextById('projets-completed', completed);
        }).catch(function() {
            var tbody = document.getElementById('projets-tbody');
            if (tbody) tbody.innerHTML = '<tr><td colspan="7" class="table-empty">Erreur de chargement.</td></tr>';
        });
    }

    // ========================================
    // PAGE: PROJET DETAIL
    // ========================================

    function initProjetDetail() {
        if (typeof window.PROJET_ID === 'undefined' || !window.PROJET_ID) return;
        var id = window.PROJET_ID;

        apiGet('projets.php?id=' + id).then(function(p) {
            if (!p) return;
            setTextById('breadcrumb-projet', p.name);
            setTextById('projet-name', p.name);
            setHtmlById('projet-status-badge', projetStatusBadge(p.status));
            setTextById('projet-client-name', 'Client : ' + (p.client_name || '—'));
            setTextById('projet-description', p.description || '—');
            setTextById('projet-start', formatDate(p.start_date));
            setTextById('projet-end', formatDate(p.end_date));
            setTextById('projet-manager', p.manager_name || '—');
            setTextById('projet-created', formatDate(p.created_at));
            document.title = (p.name || 'Projet') + ' - Systicket';

            // Assignées inline
            if (p.assignees && p.assignees.length) {
                var container = document.getElementById('projet-assignees');
                if (container) {
                    var ahtml = '';
                    p.assignees.forEach(function(u) {
                        ahtml += '<div class="assignee-item"><span>' + esc(u.first_name + ' ' + u.last_name) + '</span></div>';
                    });
                    container.innerHTML = ahtml;
                }
            }

            // Tickets inline
            if (p.tickets && p.tickets.length) {
                var tbody = document.getElementById('projet-tickets-tbody');
                if (tbody) {
                    var thtml = '';
                    p.tickets.forEach(function(t) {
                        thtml += '<tr>';
                        thtml += '<td><a href="' + appUrl('ticket-detail?id=' + t.id) + '">#' + t.id + '</a></td>';
                        thtml += '<td>' + esc(t.title) + '</td>';
                        thtml += '<td>' + statusBadge(t.status) + '</td>';
                        thtml += '<td>' + priorityBadge(t.priority) + '</td>';
                        thtml += '<td>' + typeBadge(t.type) + '</td>';
                        thtml += '<td>—</td>';
                        thtml += '<td>' + formatHours(t.spent_hours) + '</td>';
                        thtml += '<td><a href="' + appUrl('ticket-detail?id=' + t.id) + '" class="btn btn-text btn-small">Voir</a></td>';
                        thtml += '</tr>';
                    });
                    tbody.innerHTML = thtml;
                }
            } else {
                var tbody2 = document.getElementById('projet-tickets-tbody');
                if (tbody2) tbody2.innerHTML = '<tr><td colspan="8" class="table-empty">Aucun ticket pour ce projet.</td></tr>';
            }

            // Contrat inline
            if (p.contrat) {
                var c = p.contrat;
                setTextById('projet-contrat-hours', formatHours(c.hours));
                setTextById('projet-contrat-used', formatHours(c.consumed_hours || 0));
                var remaining = (parseFloat(c.hours) || 0) - (parseFloat(c.consumed_hours) || 0);
                setTextById('projet-contrat-remaining', formatHours(Math.max(0, remaining)));
                setTextById('projet-contrat-rate', (c.rate || 0) + ' €/h');
                // Calcul montant à payer
                var consumed = parseFloat(c.consumed_hours) || 0;
                var contractH = parseFloat(c.hours) || 0;
                var rate = parseFloat(c.rate) || 0;
                var supplementary = Math.max(0, consumed - contractH);
                var amount = supplementary * rate;
                var amountText = amount.toFixed(2) + ' €';
                if (supplementary > 0) {
                    amountText += ' (' + formatHours(supplementary) + ' suppl.)';
                } else {
                    amountText = '0.00 € (dans l\'enveloppe)';
                }
                setTextById('projet-contrat-amount', amountText);
                setTextById('projet-contrat-period', formatDate(c.start_date) + ' — ' + formatDate(c.end_date));
                var pct = c.hours > 0 ? Math.round((parseFloat(c.consumed_hours) || 0) / c.hours * 100) : 0;
                var bar = document.getElementById('projet-contrat-progress');
                if (bar) bar.style.width = Math.min(pct, 100) + '%';
                setTextById('projet-contrat-progress-text', pct + '% consommé');
            }
        }).catch(function() {});
    }

    // ========================================
    // PAGE: PROJET FORM
    // ========================================

    function initProjetForm() {
        var form = document.getElementById('project-form');
        if (!form) return;

        var entityId = parseInt(form.getAttribute('data-id') || 0);

        var clientsLoaded = apiGet('users.php?action=clients').then(function(data) {
            var sel = document.getElementById('project-client');
            if (sel && data) {
                var clients = Array.isArray(data) ? data : [];
                clients.forEach(function(c) {
                    var opt = document.createElement('option');
                    opt.value = c.id;
                    opt.textContent = c.first_name + ' ' + c.last_name;
                    sel.appendChild(opt);
                });
            }
        });

        var collabsLoaded = apiGet('users.php?action=collaborateurs').then(function(data) {
            var sel = document.getElementById('project-assignees');
            var mgrSel = document.getElementById('project-manager');
            if (data) {
                var users = Array.isArray(data) ? data : [];
                users.forEach(function(u) {
                    var opt = document.createElement('option');
                    opt.value = u.id;
                    opt.textContent = u.first_name + ' ' + u.last_name;
                    if (sel) sel.appendChild(opt);
                    if (mgrSel) mgrSel.appendChild(opt.cloneNode(true));
                });
            }
        });

        if (entityId) {
            Promise.all([clientsLoaded, collabsLoaded]).then(function() {
                return apiGet('projets.php?id=' + entityId);
            }).then(function(p) {
                if (!p) return;
                setFieldValue('project-name', p.name);
                setFieldValue('project-description', p.description);
                setFieldValue('project-start', p.start_date);
                setFieldValue('project-end', p.end_date);
                setFieldValue('project-client', p.client_id);
                setFieldValue('project-status', p.status);
                setFieldValue('project-manager', p.manager_id);

                // Assignees
                if (p.assignees && p.assignees.length) {
                    var sel = document.getElementById('project-assignees');
                    if (sel) {
                        p.assignees.forEach(function(a) {
                            var opt = sel.querySelector('option[value="' + a.id + '"]');
                            if (opt) opt.selected = true;
                        });
                    }
                }
            });
        }

        form.addEventListener('submit', function(e) {
            e.preventDefault();
            clearFormMessage(form);

            var formData = new FormData(form);
            var data = {};
            formData.forEach(function(val, key) {
                if (key === 'assignees[]') {
                    if (!data.assignees) data.assignees = [];
                    data.assignees.push(val);
                } else {
                    data[key] = val;
                }
            });

            // Map French form field names to English API names
            data = mapFormData('projet', data);

            var promise = entityId
                ? apiPut('projets.php?id=' + entityId, data)
                : apiPost('projets.php', data);

            promise.then(function(result) {
                window.location.href = appUrl('projet-detail?id=' + (result.id || entityId));
            }).catch(function(err) {
                showFormMessage(form, err.message);
            });
        });
    }

    // ========================================
    // PAGE: CONTRATS
    // ========================================

    function initContratsList() {
        if (document.body.getAttribute('data-page') !== 'contrats') return;
        if (document.getElementById('contrat-form')) return;

        apiGet('contrats.php').then(function(contrats) {
            var tbody = document.getElementById('contrats-tbody');
            var countEl = document.getElementById('contrats-count');
            if (!tbody) return;

            if (!contrats || !contrats.length) {
                tbody.innerHTML = '<tr class="table-empty-row"><td colspan="10" class="table-empty">Aucun contrat pour le moment.</td></tr>';
                return;
            }
            if (countEl) countEl.textContent = contrats.length;

            var contratStatusMap = {
                'active': '<span class="badge badge-success">Actif</span>',
                'expired': '<span class="badge badge-warning">Expiré</span>',
                'cancelled': '<span class="badge badge-danger">Annulé</span>'
            };

            var totalH = 0, usedH = 0;
            var html = '';
            contrats.forEach(function(c) {
                totalH += parseFloat(c.hours || 0);
                usedH += parseFloat(c.consumed_hours || 0);
                var remaining = (parseFloat(c.hours) || 0) - (parseFloat(c.consumed_hours) || 0);

                html += '<tr class="contrat-row">';
                html += '<td>' + esc(c.reference || '—') + '</td>';
                html += '<td><a href="' + appUrl('contrat-detail?id=' + c.id) + '">' + esc(c.project_name || '—') + '</a></td>';
                html += '<td>' + esc(c.client_name || '—') + '</td>';
                html += '<td>' + (contratStatusMap[c.status] || esc(c.status)) + '</td>';
                html += '<td>' + formatHours(c.hours) + '</td>';
                html += '<td>' + formatHours(c.consumed_hours || 0) + '</td>';
                html += '<td>' + formatHours(Math.max(0, remaining)) + '</td>';
                html += '<td>' + (c.rate || 0) + ' €/h</td>';
                html += '<td>' + formatDate(c.start_date) + ' — ' + formatDate(c.end_date) + '</td>';
                html += '<td>';
                html += '<a href="' + appUrl('contrat-detail?id=' + c.id) + '" class="btn btn-text btn-small">Voir</a>';
                html += '<a href="' + appUrl('contrat-form?id=' + c.id) + '" class="btn btn-text btn-small role-admin-only">Éditer</a>';
                html += '</td>';
                html += '</tr>';
            });
            tbody.innerHTML = html;

            setTextById('contrats-total-hours', formatHours(totalH));
            setTextById('contrats-used-hours', formatHours(usedH));
            setTextById('contrats-remaining-hours', formatHours(Math.max(0, totalH - usedH)));
        }).catch(function(err) {
            var tbody = document.getElementById('contrats-tbody');
            if (tbody) tbody.innerHTML = '<tr><td colspan="10" class="table-empty">Erreur de chargement.</td></tr>';
        });
    }

    function initContratDetail() {
        if (typeof window.CONTRAT_ID === 'undefined' || !window.CONTRAT_ID) return;
        var id = window.CONTRAT_ID;

        apiGet('contrats.php?id=' + id).then(function(c) {
            if (!c) return;
            setTextById('breadcrumb-contrat', 'Contrat ' + (c.project_name || ''));
            setTextById('contrat-title', 'Contrat — ' + (c.project_name || ''));
            setTextById('contrat-client', 'Client : ' + (c.client_name || '—'));
            setTextById('contrat-projet', 'Projet : ' + (c.project_name || '—'));
            setTextById('contrat-reference', c.reference || '—');
            // Format contrat status as badge
            var contratStatusMap = {
                'active': '<span class="badge badge-success">Actif</span>',
                'expired': '<span class="badge badge-warning">Expiré</span>',
                'cancelled': '<span class="badge badge-danger">Annulé</span>'
            };
            setHtmlById('contrat-contract-status', contratStatusMap[c.status] || esc(c.status));
            setHtmlById('contrat-status-badge', contratStatusMap[c.status] || esc(c.status));
            setTextById('contrat-hours', formatHours(c.hours));
            setTextById('contrat-used', formatHours(c.consumed_hours || 0));
            var remaining = (parseFloat(c.hours) || 0) - (parseFloat(c.consumed_hours) || 0);
            setTextById('contrat-remaining', formatHours(Math.max(0, remaining)));
            setTextById('contrat-rate', (c.rate || 0) + ' €/h');
            setTextById('contrat-period', formatDate(c.start_date) + ' — ' + formatDate(c.end_date));
            var pct = c.hours > 0 ? Math.round((parseFloat(c.consumed_hours) || 0) / c.hours * 100) : 0;
            var bar = document.getElementById('contrat-progress');
            if (bar) bar.style.width = Math.min(pct, 100) + '%';
            setTextById('contrat-progress-text', pct + '% consommé');
            setTextById('contrat-sidebar-projet', c.project_name || '—');
            setTextById('contrat-sidebar-client', c.client_name || '—');
            setTextById('contrat-sidebar-start', formatDate(c.start_date));
            setTextById('contrat-sidebar-end', formatDate(c.end_date));
            setTextById('contrat-notes', c.notes || '—');

            // Linked tickets
            if (c.linked_tickets && c.linked_tickets.length) {
                var tbody = document.getElementById('contrat-tickets-tbody');
                if (tbody) {
                    var html = '';
                    c.linked_tickets.forEach(function(t) {
                        html += '<tr>';
                        html += '<td><a href="' + appUrl('ticket-detail?id=' + t.id) + '">#' + t.id + '</a></td>';
                        html += '<td>' + esc(t.title) + '</td>';
                        html += '<td>' + statusBadge(t.status) + '</td>';
                        html += '<td>' + formatHours(t.spent_hours || 0) + '</td>';
                        html += '<td><a href="' + appUrl('ticket-detail?id=' + t.id) + '" class="btn btn-text btn-small">Voir</a></td>';
                        html += '</tr>';
                    });
                    tbody.innerHTML = html;
                }
            }
        }).catch(function() {});
    }

    function initContratForm() {
        var form = document.getElementById('contrat-form');
        if (!form) return;

        var entityId = parseInt(form.getAttribute('data-id') || 0);

        var projetsLoaded = apiGet('projets.php').then(function(data) {
            var sel = document.getElementById('contrat-project');
            if (sel && data) {
                var projets = Array.isArray(data) ? data : [];
                projets.forEach(function(p) {
                    var opt = document.createElement('option');
                    opt.value = p.id;
                    opt.textContent = p.name;
                    sel.appendChild(opt);
                });
            }
        });

        var clientsLoaded = apiGet('users.php?action=clients').then(function(data) {
            var sel = document.getElementById('contrat-client');
            if (sel && data) {
                var clients = Array.isArray(data) ? data : [];
                clients.forEach(function(c) {
                    var opt = document.createElement('option');
                    opt.value = c.id;
                    opt.textContent = c.first_name + ' ' + c.last_name;
                    sel.appendChild(opt);
                });
            }
        });

        if (entityId) {
            Promise.all([projetsLoaded, clientsLoaded]).then(function() {
                return apiGet('contrats.php?id=' + entityId);
            }).then(function(c) {
                if (!c) return;
                setFieldValue('contrat-hours', c.hours);
                setFieldValue('contrat-rate', c.rate);
                setFieldValue('contrat-start', c.start_date);
                setFieldValue('contrat-end', c.end_date);
                setFieldValue('contrat-reference', c.reference || '');
                setFieldValue('contrat-status', c.status || 'active');
                setFieldValue('contrat-notes', c.notes || '');
                setFieldValue('contrat-project', c.project_id);
                setFieldValue('contrat-client', c.client_id);
            });
        }

        form.addEventListener('submit', function(e) {
            e.preventDefault();
            clearFormMessage(form);
            var formData = new FormData(form);
            var data = {};
            formData.forEach(function(val, key) { data[key] = val; });

            // Map French form field names to English API names
            data = mapFormData('contrat', data);

            var promise = entityId
                ? apiPut('contrats.php?id=' + entityId, data)
                : apiPost('contrats.php', data);

            promise.then(function(result) {
                window.location.href = appUrl('contrat-detail?id=' + (result.id || entityId));
            }).catch(function(err) {
                showFormMessage(form, err.message);
            });
        });
    }

    // ========================================
    // PAGE: UTILISATEURS
    // ========================================

    function initUsersList() {
        if (document.body.getAttribute('data-page') !== 'utilisateurs') return;
        if (document.getElementById('user-form')) return;

        apiGet('users.php').then(function(users) {
            var tbody = document.getElementById('users-tbody');
            if (!tbody) return;
            if (!users || !users.length) {
                tbody.innerHTML = '<tr class="table-empty-row"><td colspan="7">Aucun utilisateur.</td></tr>';
                return;
            }
            var html = '';
            users.forEach(function(u) {
                var roleBadge = u.role === 'admin' ? '<span class="badge badge-info">Admin</span>'
                    : u.role === 'collaborateur' ? '<span class="badge badge-warning">Collaborateur</span>'
                    : '<span class="badge">Client</span>';
                var sBadge = u.status === 'active' ? '<span class="badge badge-success">Actif</span>' : '<span class="badge badge-info">Inactif</span>';

                html += '<tr class="user-row" data-user-id="' + u.id + '" data-role="' + esc(u.role) + '" data-status="' + esc(u.status) + '">';
                html += '<td>' + esc(u.first_name + ' ' + u.last_name) + '</td>';
                html += '<td>' + esc(u.email) + '</td>';
                html += '<td>' + esc(u.phone || '—') + '</td>';
                html += '<td>' + roleBadge + '</td>';
                html += '<td>' + sBadge + '</td>';
                html += '<td>' + formatDate(u.last_login || u.last_activity) + '</td>';
                html += '<td>';
                html += '<a href="' + appUrl('user-form?id=' + u.id) + '" class="btn btn-text btn-small">Voir</a>';
                html += '</td>';
                html += '</tr>';
            });
            tbody.innerHTML = html;
        }).catch(function(err) {
            var tbody = document.getElementById('users-tbody');
            if (tbody) tbody.innerHTML = '<tr><td colspan="7" class="table-empty">Erreur de chargement.</td></tr>';
        });

        // Profils en attente
        apiGet('users.php?action=pending-profiles').then(function(data) {
            var section = document.getElementById('pending-profiles');
            var list = document.getElementById('pending-profiles-list');
            var empty = document.getElementById('pending-profiles-empty');
            if (!section || !list) return;

            if (!data || !data.length) {
                if (empty) empty.style.display = '';
                return;
            }
            section.style.display = '';
            var html = '';
            data.forEach(function(p) {
                html += '<div class="card card-spacing">';
                html += '<p><strong>' + esc(p.current_name || '') + '</strong> demande des modifications.</p>';
                html += '<p>Nom : ' + esc(p.last_name) + ', Prénom : ' + esc(p.first_name) + ', Tél : ' + esc(p.phone || '—') + '</p>';
                html += '<button class="btn btn-success btn-small" onclick="approveProfile(' + p.id + ')">✅ Approuver</button> ';
                html += '<button class="btn btn-danger btn-small" onclick="rejectProfile(' + p.id + ')">❌ Refuser</button>';
                html += '</div>';
            });
            list.innerHTML = html;
        }).catch(function() {});
    }

    // Profil approval/rejection globals
    window.approveProfile = function(id) {
        apiPost('users.php?action=approve-profile', { id: id }).then(function() { location.reload(); });
    };
    window.rejectProfile = function(id) {
        apiPost('users.php?action=reject-profile', { id: id }).then(function() { location.reload(); });
    };

    function initUserForm() {
        var form = document.getElementById('user-form');
        if (!form) return;

        var entityId = parseInt(form.getAttribute('data-id') || 0);

        if (entityId) {
            apiGet('users.php?id=' + entityId).then(function(u) {
                if (!u) return;
                setFieldValue('user-nom', u.last_name);
                setFieldValue('user-prenom', u.first_name);
                setFieldValue('user-email', u.email);
                setFieldValue('user-telephone', u.phone);
                setFieldValue('user-role', u.role);
                setFieldValue('user-status', u.status);
            });
        }

        form.addEventListener('submit', function(e) {
            e.preventDefault();
            clearFormMessage(form);
            var formData = new FormData(form);
            var data = {};
            formData.forEach(function(val, key) { data[key] = val; });

            // Map French form field names to English API names
            data = mapFormData('user', data);

            var promise = entityId
                ? apiPut('users.php?id=' + entityId, data)
                : apiPost('users.php', data);

            promise.then(function() {
                window.location.href = appUrl('utilisateurs');
            }).catch(function(err) {
                showFormMessage(form, err.message);
            });
        });

        // Delete button
        var deleteBtn = document.getElementById('user-delete-btn');
        if (deleteBtn && entityId) {
            deleteBtn.addEventListener('click', function() {
                if (confirm('Supprimer cet utilisateur ?')) {
                    apiDelete('users.php?id=' + entityId).then(function() {
                        window.location.href = appUrl('utilisateurs');
                    }).catch(function(err) { alert(err.message); });
                }
            });
        }
    }

    // ========================================
    // PAGE: TEMPS
    // ========================================

    function initTemps() {
        if (document.body.getAttribute('data-page') !== 'temps') return;

        // Charger tickets
        apiGet('tickets.php').then(function(tickets) {
            var sel = document.getElementById('time-ticket');
            if (!sel) return;
            if (tickets && tickets.length) {
                tickets.forEach(function(t) {
                    var opt = document.createElement('option');
                    opt.value = t.id;
                    opt.textContent = '#' + t.id + ' - ' + (t.title || '');
                    sel.appendChild(opt);
                });
            }
        });

        // Charger projets dans filtre
        apiGet('projets.php').then(function(data) {
            var sel = document.getElementById('filter-project');
            if (sel && data) {
                var projets = Array.isArray(data) ? data : [];
                projets.forEach(function(p) {
                    var opt = document.createElement('option');
                    opt.value = p.id;
                    opt.textContent = p.name;
                    sel.appendChild(opt);
                });
            }
        });

        loadTemps();

        // Résumé
        apiGet('temps.php?action=month-total').then(function(data) {
            if (!data) return;
            setTextById('temps-month', formatHours(data.total || 0));
            setTextById('temps-total-month', formatHours(data.total || 0));
        }).catch(function() {});

        apiGet('temps.php?action=week-summary').then(function(data) {
            if (!data) return;
            setTextById('temps-week', formatHours(data.total_hours || 0));
            if (data.week_start && data.week_end) {
                setTextById('week-label', formatDate(data.week_start) + ' — ' + formatDate(data.week_end));
            }
        }).catch(function() {});

        // Calculer les heures restantes (enveloppe contrat)
        apiGet('projets.php').then(function(projets) {
            if (!projets || !projets.length) return;
            var totalContract = 0;
            var totalConsumed = 0;
            projets.forEach(function(p) {
                totalContract += parseFloat(p.contract_hours) || 0;
                totalConsumed += parseFloat(p.total_hours) || 0;
            });
            var remaining = Math.max(0, totalContract - totalConsumed);
            setTextById('temps-remaining', formatHours(remaining));
        }).catch(function() {});

        // Week navigation
        var currentWeekStart = null;
        var prevBtn = document.getElementById('week-prev');
        var nextBtn = document.getElementById('week-next');
        if (prevBtn) {
            prevBtn.addEventListener('click', function() {
                // Navigate previous week (simplified)
            });
        }
        if (nextBtn) {
            nextBtn.addEventListener('click', function() {
                // Navigate next week (simplified)
            });
        }

        // Formulaire saisie temps
        var form = document.getElementById('time-form');
        if (form) {
            form.addEventListener('submit', function(e) {
                e.preventDefault();
                clearFormMessage(form);
                var formData = new FormData(form);
                var data = {};
                formData.forEach(function(val, key) { data[key] = val; });

                // Combiner heures + minutes
                var h = parseFloat(data.heures || data.hours || 0);
                var m = parseFloat(data.minutes || 0);
                data.heures = h + (m / 60);
                delete data.minutes;

                // Map French form field names to English API names
                data = mapFormData('temps', data);

                // Get project_id from ticket if available
                var ticketSel = document.getElementById('time-ticket');
                if (ticketSel && ticketSel.value) {
                    // Try to find project_id from ticket's data attribute or just send ticket_id
                    data.ticket_id = ticketSel.value;
                }

                apiPost('temps.php', data).then(function() {
                    form.reset();
                    // Reset date to today
                    var dateField = document.getElementById('time-date');
                    if (dateField) dateField.value = new Date().toISOString().split('T')[0];
                    loadTemps();
                    showFormMessage(form, 'Entrée de temps enregistrée.', 'success');
                    // Refresh summaries
                    apiGet('temps.php?action=month-total').then(function(data) {
                        if (data) {
                            setTextById('temps-month', formatHours(data.total || 0));
                            setTextById('temps-total-month', formatHours(data.total || 0));
                        }
                    });
                }).catch(function(err) {
                    showFormMessage(form, err.message);
                });
            });
        }
    }

    function loadTemps() {
        apiGet('temps.php').then(function(entries) {
            var tbody = document.getElementById('temps-tbody');
            if (!tbody) return;
            if (!entries || !entries.length) {
                tbody.innerHTML = '<tr class="table-empty-row"><td colspan="7">Aucune entrée de temps.</td></tr>';
                return;
            }
            var html = '';
            entries.forEach(function(e) {
                html += '<tr class="time-row">';
                html += '<td>' + formatDate(e.date) + '</td>';
                html += '<td>' + esc(e.user_name || '—') + '</td>';
                html += '<td><a href="' + appUrl('ticket-detail?id=' + e.ticket_id) + '">' + esc(e.ticket_title || ('#' + e.ticket_id)) + '</a></td>';
                html += '<td>' + esc(e.project_name || '—') + '</td>';
                html += '<td>' + formatHours(e.hours) + '</td>';
                html += '<td>' + esc(e.description || '—') + '</td>';
                html += '<td>';
                html += '<button class="btn btn-text btn-small btn-danger" onclick="deleteTemps(' + e.id + ')">Supprimer</button>';
                html += '</td>';
                html += '</tr>';
            });
            tbody.innerHTML = html;
        }).catch(function() {
            var tbody = document.getElementById('temps-tbody');
            if (tbody) tbody.innerHTML = '<tr><td colspan="7" class="table-empty">Erreur de chargement.</td></tr>';
        });
    }

    window.deleteTemps = function(id) {
        if (confirm('Supprimer cette entrée ?')) {
            apiDelete('temps.php?id=' + id).then(function() { loadTemps(); });
        }
    };

    // ========================================
    // PAGE: VALIDATION
    // ========================================

    function initValidation() {
        if (document.body.getAttribute('data-page') !== 'ticket-validation') return;

        // Load tickets to validate (pending)
        apiGet('tickets.php?action=to-validate').then(function(tickets) {
            var container = document.getElementById('validation-cards');
            var countEl = document.getElementById('validation-count');
            if (!container) return;

            var pending = (tickets || []).filter(function(t) { return t.status === 'to-validate'; });
            var validated = (tickets || []).filter(function(t) { return t.status === 'validated' || t.status === 'refused'; });

            if (countEl) countEl.textContent = pending.length;

            if (!pending.length) {
                container.innerHTML = '<p class="text-secondary">Aucun ticket en attente de validation.</p>';
            } else {
                var totalAmount = 0;
                var html = '';
                pending.forEach(function(t) {
                    var rate = parseFloat(t.contract_rate) || 0;
                    var amount = (parseFloat(t.spent_hours) || 0) * rate;
                    totalAmount += amount;
                    html += '<article class="project-card">';
                    html += '<header class="project-card-header">';
                    html += '<h3>' + esc(t.title) + '</h3>';
                    html += '<span class="badge badge-warning">À valider</span>';
                    html += '</header>';
                    html += '<div class="project-card-body">';
                    html += '<p><strong>Projet :</strong> ' + esc(t.project_name || '—') + '</p>';
                    html += '<p><strong>Description :</strong> ' + esc(t.description || '—') + '</p>';
                    html += '<div class="card-body-spacing">';
                    html += '<p><strong>Temps passé :</strong> ' + formatHours(t.spent_hours) + '</p>';
                    html += '<p><strong>Montant estimé :</strong> <span class="text-amount">' + amount.toFixed(2) + ' €</span></p>';
                    html += '</div></div>';
                    html += '<footer class="project-card-footer card-footer-flex">';
                    html += '<button class="btn btn-success flex-1" onclick="validateTicket(' + t.id + ')">✅ Valider</button>';
                    html += '<button class="btn btn-danger flex-1" onclick="refuseTicket(' + t.id + ')">❌ Refuser</button>';
                    html += '<a href="' + appUrl('ticket-detail?id=' + t.id) + '" class="btn btn-text">Voir détails</a>';
                    html += '</footer></article>';
                });
                container.innerHTML = html;
                setTextById('validation-total', totalAmount.toFixed(2) + ' €');
            }

            // History (validated / refused)
            var historyTbody = document.getElementById('validation-history');
            if (historyTbody && validated.length) {
                var hhtml = '';
                validated.forEach(function(t) {
                    var rate = parseFloat(t.contract_rate) || 0;
                    var amount = (parseFloat(t.spent_hours) || 0) * rate;
                    hhtml += '<tr>';
                    hhtml += '<td><a href="' + appUrl('ticket-detail?id=' + t.id) + '">' + esc(t.title) + '</a></td>';
                    hhtml += '<td>' + esc(t.project_name || '—') + '</td>';
                    hhtml += '<td>' + formatHours(t.spent_hours) + '</td>';
                    hhtml += '<td>' + amount.toFixed(2) + ' €</td>';
                    hhtml += '<td>' + statusBadge(t.status) + '</td>';
                    hhtml += '<td>' + formatDate(t.created_at) + '</td>';
                    hhtml += '<td><a href="' + appUrl('ticket-detail?id=' + t.id) + '" class="btn btn-text btn-small">Voir</a></td>';
                    hhtml += '</tr>';
                });
                historyTbody.innerHTML = hhtml;
            }
        }).catch(function(err) {
            var container = document.getElementById('validation-cards');
            if (container) container.innerHTML = '<p class="text-secondary">Erreur de chargement.</p>';
        });
    }

    function loadClientValidationCards() {
        var section = document.getElementById('client-validation-section');
        var container = document.getElementById('tickets-validation-cards');
        if (!container) return;

        apiGet('tickets.php?action=to-validate').then(function(tickets) {
            var pending = (tickets || []).filter(function(t) { return t.status === 'to-validate'; });
            var countEl = document.getElementById('tickets-validation-count');
            if (countEl) countEl.textContent = pending.length;

            if (!pending.length) {
                container.innerHTML = '<p class="text-secondary">Aucun ticket en attente de validation.</p>';
                if (section) section.style.display = 'block';
                return;
            }

            var totalAmount = 0;
            var html = '';
            pending.forEach(function(t) {
                var rate = parseFloat(t.contract_rate) || 0;
                var amount = (parseFloat(t.spent_hours) || 0) * rate;
                totalAmount += amount;
                html += '<article class="project-card">';
                html += '<header class="project-card-header">';
                html += '<h3>' + esc(t.title) + '</h3>';
                html += '<span class="badge badge-warning">À valider</span>';
                html += '</header>';
                html += '<div class="project-card-body">';
                html += '<p><strong>Projet :</strong> ' + esc(t.project_name || '—') + '</p>';
                html += '<p><strong>Description :</strong> ' + esc(t.description || '—') + '</p>';
                html += '<div class="card-body-spacing">';
                html += '<p><strong>Temps passé :</strong> ' + formatHours(t.spent_hours) + '</p>';
                html += '<p><strong>Montant estimé :</strong> <span class="text-amount">' + amount.toFixed(2) + ' €</span></p>';
                html += '</div></div>';
                html += '<footer class="project-card-footer card-footer-flex">';
                html += '<button class="btn btn-success flex-1" onclick="validateTicket(' + t.id + ')">✅ Valider</button>';
                html += '<button class="btn btn-danger flex-1" onclick="refuseTicket(' + t.id + ')">❌ Refuser</button>';
                html += '<a href="' + appUrl('ticket-detail?id=' + t.id) + '" class="btn btn-text">Voir détails</a>';
                html += '</footer></article>';
            });
            container.innerHTML = html;
            setTextById('tickets-validation-total', totalAmount.toFixed(2) + ' €');
            if (section) section.style.display = 'block';
        }).catch(function() {
            container.innerHTML = '<p class="text-secondary">Erreur de chargement.</p>';
            if (section) section.style.display = 'block';
        });
    }

    window.validateTicket = function(id) {
        apiPost('validations.php?action=validate', { ticket_id: id })
            .then(function() {
                // Rafraîchir les cartes de validation si on est sur la page tickets
                if (document.body.getAttribute('data-page') === 'tickets') {
                    loadClientValidationCards();
                    loadTickets();
                } else {
                    location.reload();
                }
            })
            .catch(function(err) { alert(err.message); });
    };

    window.refuseTicket = function(id) {
        var motif = prompt('Motif du refus :');
        if (motif === null) return;
        apiPost('validations.php?action=refuse', { ticket_id: id, comment: motif })
            .then(function() {
                // Rafraîchir les cartes de validation si on est sur la page tickets
                if (document.body.getAttribute('data-page') === 'tickets') {
                    loadClientValidationCards();
                    loadTickets();
                } else {
                    location.reload();
                }
            })
            .catch(function(err) { alert(err.message); });
    };

    // ========================================
    // PAGE: PROFIL
    // ========================================

    function initProfil() {
        if (document.body.getAttribute('data-page') !== 'profil') return;

        var userId = CFG.user ? CFG.user.id : 0;

        var profileForm = document.getElementById('profile-form');
        if (profileForm) {
            profileForm.addEventListener('submit', function(e) {
                e.preventDefault();
                clearFormMessage(profileForm);
                var formData = new FormData(profileForm);
                var data = {};
                formData.forEach(function(val, key) {
                    if (key !== 'photo') data[key] = val;
                });

                apiPut('users.php?id=' + userId, data).then(function(result) {
                    showFormMessage(profileForm, result.message || 'Profil mis à jour.', 'success');
                }).catch(function(err) {
                    showFormMessage(profileForm, err.message);
                });
            });
        }

        var passwordForm = document.getElementById('password-form');
        if (passwordForm) {
            passwordForm.addEventListener('submit', function(e) {
                e.preventDefault();
                clearFormMessage(passwordForm);
                var formData = new FormData(passwordForm);
                var data = {};
                formData.forEach(function(val, key) { data[key] = val; });

                if (data.new_password !== data.confirm_password) {
                    showFormMessage(passwordForm, 'Les mots de passe ne correspondent pas.');
                    return;
                }

                apiPost('auth.php?action=change-password', data).then(function(result) {
                    showFormMessage(passwordForm, result.message || 'Mot de passe modifié.', 'success');
                    passwordForm.reset();
                }).catch(function(err) {
                    showFormMessage(passwordForm, err.message);
                });
            });
        }
    }

    // ========================================
    // HELPERS
    // ========================================

    function setTextById(id, text) {
        var el = document.getElementById(id);
        if (el) el.textContent = text;
    }

    function setHtmlById(id, html) {
        var el = document.getElementById(id);
        if (el) el.innerHTML = html;
    }

    function setFieldValue(id, value) {
        var el = document.getElementById(id);
        if (el) el.value = value || '';
    }

    function debounce(fn, delay) {
        var timer;
        return function() {
            var args = arguments;
            var ctx = this;
            clearTimeout(timer);
            timer = setTimeout(function() { fn.apply(ctx, args); }, delay);
        };
    }

    // ========================================
    // PAGE: RAPPORTS
    // ========================================

    function initRapports() {
        if (document.body.getAttribute('data-page') !== 'rapports') return;

        // Load filter selects
        apiGet('projets.php').then(function(data) {
            var sel = document.getElementById('report-project');
            if (sel && data) {
                (Array.isArray(data) ? data : []).forEach(function(p) {
                    var opt = document.createElement('option');
                    opt.value = p.id;
                    opt.textContent = p.name;
                    sel.appendChild(opt);
                });
            }
        });
        apiGet('users.php?action=clients').then(function(data) {
            var sel = document.getElementById('report-client');
            if (sel && data) {
                (Array.isArray(data) ? data : []).forEach(function(c) {
                    var opt = document.createElement('option');
                    opt.value = c.id;
                    opt.textContent = c.first_name + ' ' + c.last_name;
                    sel.appendChild(opt);
                });
            }
        });

        // Load report data
        loadReportData();

        // Expose globally for rapports.js filter buttons
        window.updateReports = loadReportData;
    }

    function loadReportData() {
        var params = [];
        var dateFrom = document.getElementById('report-date-from');
        var dateTo = document.getElementById('report-date-to');
        var projectSel = document.getElementById('report-project');
        var clientSel = document.getElementById('report-client');

        if (dateFrom && dateFrom.value) params.push('date_from=' + encodeURIComponent(dateFrom.value));
        if (dateTo && dateTo.value) params.push('date_to=' + encodeURIComponent(dateTo.value));
        if (projectSel && projectSel.value) params.push('project_id=' + encodeURIComponent(projectSel.value));
        if (clientSel && clientSel.value) params.push('client_id=' + encodeURIComponent(clientSel.value));

        var url = 'dashboard.php?action=reports' + (params.length ? '&' + params.join('&') : '');

        apiGet(url).then(function(data) {
            if (!data) return;

            // KPIs
            setTextById('kpi-tickets', data.total_tickets || 0);
            setTextById('kpi-hours', formatHours(data.total_hours || 0));
            setTextById('kpi-projects', data.total_projects || 0);

            // Validation rate
            var totalTickets = 0, validatedTickets = 0;
            if (data.tickets_by_status) {
                data.tickets_by_status.forEach(function(s) {
                    totalTickets += parseInt(s.count || 0);
                    if (s.status === 'validated' || s.status === 'done') validatedTickets += parseInt(s.count || 0);
                });
            }
            var validRate = totalTickets > 0 ? Math.round((validatedTickets / totalTickets) * 100) : 0;
            setTextById('kpi-validation', validRate + '%');

            // Revenue
            var totalRevenue = 0;
            if (data.billing) {
                data.billing.forEach(function(b) {
                    totalRevenue += parseFloat(b.consumed_hours || 0) * parseFloat(b.rate || 0);
                });
            }
            setTextById('kpi-revenue', totalRevenue.toLocaleString('fr-FR', { minimumFractionDigits: 0 }) + ' €');

            // Executive summary
            var execEl = document.getElementById('report-executive');
            if (execEl) {
                execEl.innerHTML = 'Sur la période sélectionnée : <strong>' + (data.total_tickets || 0) + '</strong> tickets traités, <strong>' + formatHours(data.total_hours || 0) + '</strong> heures enregistrées, taux de validation <strong>' + validRate + '%</strong>, chiffre d\'affaires <strong>' + totalRevenue.toLocaleString('fr-FR', { minimumFractionDigits: 0 }) + ' €</strong>.';
            }

            // Hours by project chart
            var chartHP = document.getElementById('chart-hours-project');
            if (chartHP && data.hours_by_project) {
                if (!data.hours_by_project.length) {
                    chartHP.innerHTML = '<p class="text-secondary">Aucune donnée pour cette période.</p>';
                } else {
                    var maxHP = Math.max.apply(null, data.hours_by_project.map(function(d) { return parseFloat(d.total || 0); }));
                    var totalHP = data.hours_by_project.reduce(function(s, d) { return s + parseFloat(d.total || 0); }, 0);
                    var colorsHP = ['dashboard-chart-bar-primary', 'dashboard-chart-bar-blue', 'dashboard-chart-bar-green', 'dashboard-chart-bar-amber', 'dashboard-chart-bar-gray'];
                    var hpHtml = '<div class="dashboard-chart-bars">';
                    data.hours_by_project.forEach(function(item, i) {
                        var pct = maxHP > 0 ? Math.round((parseFloat(item.total || 0) / maxHP) * 100) : 0;
                        hpHtml += '<div class="dashboard-chart-row">';
                        hpHtml += '<span class="dashboard-chart-label">' + esc(item.name) + '</span>';
                        hpHtml += '<div class="dashboard-chart-bar-wrap">';
                        hpHtml += '<div class="dashboard-chart-bar ' + (colorsHP[i % colorsHP.length]) + '" style="width:' + pct + '%;"></div>';
                        hpHtml += '</div>';
                        hpHtml += '<span class="dashboard-chart-value">' + formatHours(item.total) + '</span>';
                        hpHtml += '</div>';
                    });
                    hpHtml += '</div>';
                    chartHP.innerHTML = hpHtml;
                    setTextById('chart-hours-project-total', 'Total : ' + formatHours(totalHP));
                }
            }

            // Tickets by status chart
            var chartTS = document.getElementById('chart-tickets-status');
            if (chartTS && data.tickets_by_status) {
                if (!data.tickets_by_status.length) {
                    chartTS.innerHTML = '<p class="text-secondary">Aucune donnée.</p>';
                } else {
                    var totalTS = data.tickets_by_status.reduce(function(s, d) { return s + parseInt(d.count || 0); }, 0);
                    var colorsTS = ['dashboard-chart-bar-blue', 'dashboard-chart-bar-primary', 'dashboard-chart-bar-green', 'dashboard-chart-bar-amber', 'dashboard-chart-bar-gray'];
                    var tsHtml = '<div class="dashboard-chart-bars">';
                    data.tickets_by_status.forEach(function(item, i) {
                        var pct = totalTS > 0 ? Math.round((parseInt(item.count || 0) / totalTS) * 100) : 0;
                        tsHtml += '<div class="dashboard-chart-row">';
                        tsHtml += '<span class="dashboard-chart-label">' + statusLabel(item.status) + '</span>';
                        tsHtml += '<div class="dashboard-chart-bar-wrap">';
                        tsHtml += '<div class="dashboard-chart-bar ' + (colorsTS[i % colorsTS.length]) + '" style="width:' + pct + '%;"></div>';
                        tsHtml += '</div>';
                        tsHtml += '<span class="dashboard-chart-value">' + item.count + '</span>';
                        tsHtml += '</div>';
                    });
                    tsHtml += '</div>';
                    chartTS.innerHTML = tsHtml;
                }
            }

            // Hours by user chart
            var chartHU = document.getElementById('chart-hours-user');
            if (chartHU && data.hours_by_user) {
                if (!data.hours_by_user.length) {
                    chartHU.innerHTML = '<p class="text-secondary">Aucune donnée.</p>';
                } else {
                    var maxHU = Math.max.apply(null, data.hours_by_user.map(function(d) { return parseFloat(d.total || 0); }));
                    var totalHU = data.hours_by_user.reduce(function(s, d) { return s + parseFloat(d.total || 0); }, 0);
                    var colorsHU = ['dashboard-chart-bar-primary', 'dashboard-chart-bar-blue', 'dashboard-chart-bar-green'];
                    var huHtml = '';
                    data.hours_by_user.forEach(function(item, i) {
                        var pct = maxHU > 0 ? Math.round((parseFloat(item.total || 0) / maxHU) * 100) : 0;
                        huHtml += '<div class="dashboard-chart-row">';
                        huHtml += '<span class="dashboard-chart-label">' + esc(item.name) + '</span>';
                        huHtml += '<div class="dashboard-chart-bar-wrap">';
                        huHtml += '<div class="dashboard-chart-bar ' + (colorsHU[i % colorsHU.length]) + '" style="width:' + pct + '%;"></div>';
                        huHtml += '</div>';
                        huHtml += '<span class="dashboard-chart-value">' + formatHours(item.total) + '</span>';
                        huHtml += '</div>';
                    });
                    chartHU.innerHTML = huHtml;
                    setTextById('chart-hours-user-total', 'Total : ' + formatHours(totalHU));
                }
            }

            // Billing table
            var billingTbody = document.getElementById('report-billing-tbody');
            if (billingTbody && data.billing) {
                if (!data.billing.length) {
                    billingTbody.innerHTML = '<tr><td colspan="5" class="table-empty">Aucune donnée de facturation.</td></tr>';
                } else {
                    var bHtml = '';
                    var totalBillingHours = 0, totalBillingAmount = 0;
                    data.billing.forEach(function(b) {
                        var consumed = parseFloat(b.consumed_hours || 0);
                        var rate = parseFloat(b.rate || 0);
                        var amount = consumed * rate;
                        totalBillingHours += consumed;
                        totalBillingAmount += amount;
                        bHtml += '<tr>';
                        bHtml += '<td>' + esc(b.client_name || '—') + '</td>';
                        bHtml += '<td>' + esc(b.project_name || '—') + '</td>';
                        bHtml += '<td>' + formatHours(consumed) + '</td>';
                        bHtml += '<td>' + rate.toFixed(0) + ' €/h</td>';
                        bHtml += '<td>' + amount.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' €</td>';
                        bHtml += '</tr>';
                    });
                    billingTbody.innerHTML = bHtml;
                    setTextById('report-billing-hours', formatHours(totalBillingHours));
                    setTextById('report-billing-total', totalBillingAmount.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' €');
                }
            }

            // Detail time entries table (latest 20)
            var detailTbody = document.getElementById('report-detail-tbody');
            if (detailTbody) {
                // Fetch recent time entries for the detail table
                var tempsParams = [];
                if (dateFrom && dateFrom.value) tempsParams.push('date_from=' + encodeURIComponent(dateFrom.value));
                if (dateTo && dateTo.value) tempsParams.push('date_to=' + encodeURIComponent(dateTo.value));
                var tempsUrl = 'temps.php' + (tempsParams.length ? '?' + tempsParams.join('&') : '');
                apiGet(tempsUrl).then(function(entries) {
                    if (!entries || !entries.length) {
                        detailTbody.innerHTML = '<tr><td colspan="6" class="table-empty">Aucune entrée de temps.</td></tr>';
                        return;
                    }
                    var dHtml = '';
                    entries.slice(0, 20).forEach(function(e) {
                        dHtml += '<tr>';
                        dHtml += '<td>' + formatDate(e.date) + '</td>';
                        dHtml += '<td>' + esc(e.project_name || '—') + '</td>';
                        dHtml += '<td>' + esc(e.ticket_title || '—') + '</td>';
                        dHtml += '<td>' + esc(e.user_name || '—') + '</td>';
                        dHtml += '<td>' + formatHours(e.hours) + '</td>';
                        dHtml += '<td>' + esc(e.description || '—') + '</td>';
                        dHtml += '</tr>';
                    });
                    detailTbody.innerHTML = dHtml;
                }).catch(function() {
                    detailTbody.innerHTML = '<tr><td colspan="6" class="table-empty">Erreur de chargement.</td></tr>';
                });
            }

            // Update period info
            var periodInfo = document.getElementById('report-period-info');
            if (periodInfo) {
                var fromVal = dateFrom ? dateFrom.value : '';
                var toVal = dateTo ? dateTo.value : '';
                periodInfo.innerHTML = '<strong>Période affichée :</strong> ' + (fromVal ? formatDate(fromVal) : 'Début') + ' — ' + (toVal ? formatDate(toVal) : 'Aujourd\'hui');
            }
        }).catch(function(err) {
            var execEl = document.getElementById('report-executive');
            if (execEl) execEl.textContent = 'Erreur de chargement des données du rapport.';
        });
    }

    // ========================================
    // INITIALISATION GLOBALE
    // ========================================

    function initAll() {
        initDashboard();
        initTicketsList();
        initTicketDetail();
        initTicketForm();
        initProjetsList();
        initProjetDetail();
        initProjetForm();
        initContratsList();
        initContratDetail();
        initContratForm();
        initUsersList();
        initUserForm();
        initTemps();
        initValidation();
        initProfil();
        initRapports();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initAll);
    } else {
        initAll();
    }

    // Re-init after SPA navigation
    document.addEventListener('systicket:contentLoaded', initAll);

    // Handle bfcache (back/forward navigation)
    window.addEventListener('pageshow', function(event) {
        if (event.persisted) {
            initAll();
        }
    });

})();
