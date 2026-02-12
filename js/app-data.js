/* Injection des données dans les tableaux et mises à jour des pages
   Dépend de storage.js (localStorage) - AppData est fourni par storage.js */
(function() {
    'use strict';

    if (!window.AppData) {
        console.warn('storage.js doit être chargé avant app-data.js');
        return;
    }

    /* Ajoute les données sauvegardées dans les tableaux de la page */
    function injectStoredRows() {
        var page = document.body.getAttribute('data-page');
        if (!page) return;
        
        /* Ne pas injecter sur les pages détail (gérées par updateXxxDetail) */
        var isDetailPage = document.querySelector('.ticket-header') !== null;
        if (isDetailPage) return;
        
        var tbody = document.querySelector('.table tbody');
        if (!tbody) {
            console.log('Tableau non trouvé pour la page:', page);
            return;
        }

        /* Supprimer les lignes statiques ou déjà injectées avant de réinjecter (source unique: localStorage) */
        var rowsToRemove = tbody.querySelectorAll('tr.ticket-row, tr.project-row, tr.client-row, tr.contrat-row, tr.time-row, tr.user-row');
        rowsToRemove.forEach(function(r) { r.remove(); });

        var emptyMarker = tbody.querySelector('.table-empty-row, .table-empty');
        var insertBefore = emptyMarker ? (emptyMarker.tagName === 'TR' ? emptyMarker : emptyMarker.closest('tr')) : null;

        /* Remplit le tableau des tickets */
        if (page === 'tickets') {
            var tickets = AppData.get('tickets') || [];
            var projets = AppData.get('projets') || [];
            var clients = AppData.get('clients') || [];
            var temps = AppData.get('temps') || [];
            var validations = AppData.get('validations') || [];
            
            // Mettre à jour le compteur de tickets
            var resultsCount = document.querySelector('.list-results-count strong');
            if (resultsCount) resultsCount.textContent = String(tickets.length || 0);
            
            tickets.forEach(function(t, idx) {
                var type = (t.type || 'included');
                var tr = document.createElement('tr');
                tr.className = 'ticket-row';
                tr.setAttribute('data-type', type);
                tr.setAttribute('data-row-index', String(idx));
                tr.setAttribute('data-systicket-injected', '1');
                var id = t._id || '';
                
                // Récupérer le nom du projet
                var projetName = '—';
                var clientName = '—';
                if (t.project) {
                    var projet = projets.find(function(p) { return p._id == t.project || p.name === t.project; });
                    if (projet) {
                        projetName = projet.name || '—';
                        // Récupérer le client à partir du projet (chercher d'abord dans les clients dynamiques)
                        if (projet.client) {
                            var client = clients.find(function(c) { 
                                return String(c._id) === String(projet.client) || String(c.name) === String(projet.client);
                            });
                            if (client) {
                                clientName = client.name || '—';
                            } else {
                                // Fallback sur les clients statiques
                                if (projet.client === '1') clientName = 'Acme Corp';
                                else if (projet.client === '2') clientName = 'Tech Solutions';
                                else if (projet.client === '3') clientName = 'Design Studio';
                            }
                        }
                    } else if (t.project === '1') {
                        projetName = 'Site e-commerce';
                        clientName = 'Acme Corp';
                    } else if (t.project === '2') {
                        projetName = 'Application mobile';
                        clientName = 'Tech Solutions';
                    } else if (t.project === '3') {
                        projetName = 'Refonte site vitrine';
                        clientName = 'Design Studio';
                    }
                }
                
                // Déterminer le statut 
                var status = t.status || 'new';
                var ticketIndex = tickets.indexOf(t);
                if (validations && validations[ticketIndex]) {
                    var validationStatus = validations[ticketIndex];
                    if (validationStatus === 'validated') status = 'validated';
                    else if (validationStatus === 'refused') status = 'refused';
                    else if (validationStatus === 'to-validate' || validationStatus === 'waiting') status = 'to-validate';
                }
                var statusText = status === 'new' ? 'Nouveau' : (status === 'in-progress' ? 'En cours' : (status === 'done' ? 'Terminé' : (status === 'to-validate' ? 'À valider' : (status === 'validated' ? 'Validé' : (status === 'refused' ? 'Refusé' : 'Nouveau')))));
                var statusClass = status === 'new' ? 'badge-status-new' : (status === 'in-progress' ? 'badge-status-in-progress' : (status === 'done' ? 'badge-status-done' : (status === 'to-validate' ? 'badge-status-to-validate' : (status === 'validated' ? 'badge-success' : (status === 'refused' ? 'badge-danger' : 'badge-status-new')))));
                
                // Déterminer la priorité
                var priority = t.priority || 'normal';
                var priorityText = priority === 'low' ? 'Faible' : (priority === 'high' ? 'Élevée' : (priority === 'critical' ? 'Critique' : 'Normale'));
                var priorityClass = priority === 'low' ? 'badge-priority-low' : (priority === 'high' ? 'badge-priority-high' : (priority === 'critical' ? 'badge-priority-critical' : 'badge-priority-normal'));
                
                // Calculer le temps réel (depuis les entrées de temps)
                var realTime = 0;
                temps.forEach(function(timeEntry) {
                    if (timeEntry.ticket && String(timeEntry.ticket) === String(id)) {
                        realTime += parseFloat(timeEntry.hours) || 0;
                    }
                });
                var timeDisplay = realTime > 0 ? realTime + 'h' : (t.estimated_hours != null ? (parseFloat(t.estimated_hours) || 0) + 'h (est.)' : '0h');
                
                // Récupérer les assignés
                var assigneesDisplay = '—';
                var assigneesList = [];
                
                // Vérifier différentes façons dont les assignés peuvent être stockés
                if (t.assignees) {
                    if (Array.isArray(t.assignees)) {
                        assigneesList = t.assignees;
                    } else if (typeof t.assignees === 'string' && t.assignees.trim() !== '') {
                        assigneesList = [t.assignees];
                    }
                } else if (t['assignees[]']) {
                    if (Array.isArray(t['assignees[]'])) {
                        assigneesList = t['assignees[]'];
                    } else if (typeof t['assignees[]'] === 'string' && t['assignees[]'].trim() !== '') {
                        assigneesList = [t['assignees[]']];
                    }
                }
                
                // Vérifier aussi les clés avec des indices (assignees[0], assignees[1], etc.)
                if (assigneesList.length === 0) {
                    var keys = Object.keys(t);
                    keys.forEach(function(key) {
                        if (key.indexOf('assignees') !== -1 && t[key] && t[key].trim() !== '') {
                            assigneesList.push(t[key]);
                        }
                    });
                }
                
                if (assigneesList.length > 0) {
                    var assigneeNames = assigneesList.map(function(a) {
                        var val = String(a).trim();
                        if (val === '1') return 'Jean Dupont';
                        if (val === '2') return 'Marie Martin';
                        if (val === '3') return 'Pierre Durand';
                        return val;
                    }).filter(function(name) { return name && name.trim() !== ''; });
                    
                    if (assigneeNames.length > 0) {
                        assigneesDisplay = assigneeNames.join(', ');
                    }
                }
                
                // Date de création
                var dateDisplay = t._id ? new Date(parseInt(t._id)).toLocaleDateString('fr-FR') : new Date().toLocaleDateString('fr-FR');
                
                tr.innerHTML = '<td>' + id + '</td><td><a href="ticket-detail.html?id=' + id + '">' + (t.title || '—') + '</a></td><td>' + projetName + '</td><td>' + clientName + '</td><td><span class="badge ' + statusClass + '">' + statusText + '</span></td><td><span class="badge ' + priorityClass + '">' + priorityText + '</span></td><td><span class="badge badge-' + (type === 'billable' ? 'warning' : 'info') + '">' + (type === 'billable' ? 'Facturable' : 'Inclus') + '</span></td><td>' + assigneesDisplay + '</td><td>' + timeDisplay + '</td><td>' + dateDisplay + '</td><td><a href="ticket-detail.html?id=' + id + '">Voir</a></td>';
                if (insertBefore) insertBefore.before(tr);
                else tbody.appendChild(tr);
            });
        /* Remplit le tableau des clients */
        } else if (page === 'clients') {
            var clients = AppData.get('clients') || [];
            var projets = AppData.get('projets') || [];
            clients.forEach(function(c) {
                var tr = document.createElement('tr');
                tr.className = 'client-row';
                tr.setAttribute('data-status', c.status || 'active');
                tr.setAttribute('data-client-id', String(c._id || ''));
                tr.setAttribute('data-systicket-injected', '1');
                var projectCount = projets.filter(function(p) { return String(p.client) === String(c._id); }).length;
                var statusClass = (c.status === 'inactive') ? 'badge-warning' : 'badge-success';
                var statusText = (c.status === 'inactive') ? 'Inactif' : 'Actif';
                tr.innerHTML = '<td>' + (c.name || '—') + '</td><td>' + (c.contact || '—') + '</td><td>' + (c.email || '—') + '</td><td>' + (c.phone || '—') + '</td><td>' + (projectCount || 0) + '</td><td><span class="badge ' + statusClass + '">' + statusText + '</span></td><td><a href="client-detail.html?id=' + encodeURIComponent(c._id) + '">Voir</a></td>';
                if (insertBefore) insertBefore.before(tr);
                else tbody.appendChild(tr);
            });
            var resultsCount = document.querySelector('.list-results-count strong');
            if (resultsCount) resultsCount.textContent = String(clients.length);
        /* Remplit le tableau des projets */
        } else if (page === 'projets') {
            var projets = AppData.get('projets') || [];
            var clients = AppData.get('clients') || [];
            var tickets = AppData.get('tickets') || [];
            var temps = AppData.get('temps') || [];
            var contrats = AppData.get('contrats') || [];
            
            console.log('Projets à afficher:', projets.length);
            
            projets.forEach(function(p, idx) {
                var tr = document.createElement('tr');
                tr.className = 'project-row';
                tr.setAttribute('data-row-index', String(idx));
                tr.setAttribute('data-project-id', String(p._id != null ? p._id : ''));
                tr.setAttribute('data-client', p.client || '');
                tr.setAttribute('data-status', p.status || 'active');
                tr.setAttribute('data-systicket-injected', '1');
                var statusClass = p.status === 'paused' ? 'badge-warning' : (p.status === 'completed' ? 'badge-info' : 'badge-success');
                var statusText = p.status === 'paused' ? 'En pause' : (p.status === 'completed' ? 'Terminé' : 'Actif');
                
                // Récupérer le nom du client (chercher d'abord dans les clients dynamiques)
                var clientName = '—';
                if (p.client) {
                    // Chercher dans les clients dynamiques
                    var client = clients.find(function(c) {
                        return String(c._id) === String(p.client) || String(c.name) === String(p.client);
                    });
                    if (client) {
                        clientName = client.name || '—';
                    } else {
                        // Fallback sur les clients statiques
                        if (p.client === '1') clientName = 'Acme Corp';
                        else if (p.client === '2') clientName = 'Tech Solutions';
                        else if (p.client === '3') clientName = 'Design Studio';
                    }
                }
                
                // Compter les tickets du projet
                var projectTickets = tickets.filter(function(t) {
                    return String(t.project) === String(p._id) || String(t.project) === p.name;
                }).length;
                
                // Calculer les heures du projet
                var projectHours = 0;
                temps.forEach(function(t) {
                    if (String(t.project) === String(p._id) || String(t.project) === p.name) {
                        projectHours += parseFloat(t.hours) || 0;
                    }
                });
                
                // Trouver le contrat associé pour les heures totales
                var contract = contrats.find(function(c) {
                    return String(c.project) === String(p._id) || String(c.project) === p.name;
                });
                var totalHours = contract ? (parseFloat(contract.hours) || 0) : 0;
                var hoursDisplay = totalHours > 0 ? projectHours + 'h / ' + totalHours + 'h' : (projectHours > 0 ? projectHours + 'h' : '0h / 0h');
                
                // Calculer le pourcentage de progression
                var progressPercent = totalHours > 0 ? Math.round((projectHours / totalHours) * 100) : 0;
                
                tr.innerHTML = '<td><a href="projet-detail.html?id=' + p._id + '">' + (p.name || '—') + '</a></td><td>' + clientName + '</td><td><span class="badge ' + statusClass + '">' + statusText + '</span></td><td>' + (projectTickets || 0) + '</td><td>' + hoursDisplay + '</td><td>' + (progressPercent || 0) + '%</td><td><a href="projet-detail.html?id=' + p._id + '">Voir</a></td>';
                if (insertBefore) insertBefore.before(tr);
                else tbody.appendChild(tr);
            });
            
            /* Si aucun projet, affiche un message vide */
            if (projets.length === 0) {
                var emptyTr = document.createElement('tr');
                emptyTr.className = 'table-empty-row';
                emptyTr.innerHTML = '<td colspan="7">Aucun projet pour le moment.</td>';
                tbody.appendChild(emptyTr);
            }
        /* Remplit le tableau des contrats */
        } else if (page === 'contrats') {
            var contrats = AppData.get('contrats') || [];
            var projets = AppData.get('projets') || [];
            var clients = AppData.get('clients') || [];
            var temps = AppData.get('temps') || [];
            
            contrats.forEach(function(c) {
                var tr = document.createElement('tr');
                tr.className = 'contrat-row';
                tr.setAttribute('data-systicket-injected', '1');
                
                // Trouver le nom du projet
                var projetName = '—';
                if (c.project) {
                    var projet = projets.find(function(p) { return p._id == c.project || p.name === c.project; });
                    if (projet) projetName = projet.name || '—';
                    else if (c.project === '1') projetName = 'Site e-commerce';
                    else if (c.project === '2') projetName = 'Application mobile';
                    else if (c.project === '3') projetName = 'Refonte site vitrine';
                }
                
                // Trouver le nom du client
                var clientName = '—';
                if (c.client) {
                    var client = clients.find(function(cl) { return cl._id == c.client || cl.name === c.client; });
                    if (client) clientName = client.name || '—';
                    else if (c.client === '1') clientName = 'Acme Corp';
                    else if (c.client === '2') clientName = 'Tech Solutions';
                    else if (c.client === '3') clientName = 'Design Studio';
                }
                
                // Calculer les heures consommées (depuis les entrées de temps liées à ce contrat/projet)
                var consumedHours = 0;
                if (c.project) {
                    temps.forEach(function(t) {
                        if (String(t.project) === String(c.project)) {
                            consumedHours += parseFloat(t.hours) || 0;
                        }
                    });
                }
                
                var totalHours = parseFloat(c.hours) || 0;
                var remainingHours = Math.max(0, totalHours - consumedHours);
                
                tr.innerHTML = '<td>' + projetName + '</td><td>' + clientName + '</td><td>' + totalHours + 'h</td><td>' + consumedHours + 'h</td><td>' + remainingHours + 'h</td><td>' + (parseFloat(c.rate) || 0) + ' €/h</td><td>' + (c.start || '—') + ' — ' + (c.end || '—') + '</td><td><a href="contrat-detail.html?id=' + c._id + '">Voir</a></td>';
                if (insertBefore) insertBefore.before(tr);
                else tbody.appendChild(tr);
            });
        } else if (page === 'temps') {
            var temps = AppData.get('temps') || [];
            var projets = AppData.get('projets') || [];
            var tickets = AppData.get('tickets') || [];
            temps.forEach(function(t) {
                var tr = document.createElement('tr');
                tr.className = 'time-row';
                tr.setAttribute('data-project', String(t.project || ''));
                tr.setAttribute('data-systicket-injected', '1');
                var projetName = '—';
                var ticketLabel = '—';
                if (t.project) {
                    var proj = projets.find(function(p) { return String(p._id) === String(t.project); });
                    if (proj) projetName = proj.name || '—';
                }
                if (t.ticket) {
                    var tick = tickets.find(function(tk) { return String(tk._id) === String(t.ticket); });
                    ticketLabel = tick ? ('#' + tick._id + ' - ' + (tick.title || '—')) : ('#' + t.ticket);
                }
                var actionsLink = (t.ticket) ? '<a href="ticket-detail.html?id=' + t.ticket + '">Voir</a>' : '—';
                tr.innerHTML = '<td>' + (t.date || '—') + '</td><td>' + ticketLabel + '</td><td>' + projetName + '</td><td>' + (parseFloat(t.hours) || 0) + 'h</td><td>' + (t.description || '—') + '</td><td>' + actionsLink + '</td>';
                if (insertBefore) insertBefore.before(tr);
                else tbody.appendChild(tr);
            });
            updateTempsPage();
        } else if (page === 'utilisateurs') {
            var users = getUtilisateurs();
            var emptyRow = tbody.querySelector('.table-empty-row, .table-empty');
            if (users.length > 0 && emptyRow) emptyRow.remove();
            if (emptyRow && emptyRow.tagName === 'TR') insertBefore = emptyRow;
            users.forEach(function(u) {
                var tr = document.createElement('tr');
                tr.className = 'user-row';
                tr.setAttribute('data-user-id', String(u._id));
                tr.setAttribute('data-role', u.role || '');
                tr.setAttribute('data-status', u.status || 'active');
                tr.setAttribute('data-systicket-injected', '1');
                var roleClass = u.role === 'admin' ? 'badge-info' : (u.role === 'collaborateur' ? 'badge-warning' : '');
                var roleText = u.role === 'admin' ? 'Admin' : (u.role === 'collaborateur' ? 'Collaborateur' : 'Client');
                var statusClass = u.status === 'inactive' ? 'badge-info' : 'badge-success';
                var statusText = u.status === 'inactive' ? 'Inactif' : 'Actif';
                var lastLogin = u.last_login ? new Date(u.last_login).toLocaleDateString('fr-FR') : '—';
                var name = ((u.prenom || '') + ' ' + (u.nom || '')).trim() || '—';
                tr.innerHTML = '<td>' + name + '</td><td>' + (u.email || '—') + '</td><td><span class="badge ' + roleClass + '">' + roleText + '</span></td><td><span class="badge ' + statusClass + '">' + statusText + '</span></td><td>' + lastLogin + '</td><td><a href="profil.html?id=' + u._id + '">Voir</a></td>';
                if (insertBefore) insertBefore.before(tr);
                else tbody.appendChild(tr);
            });
        }

        document.dispatchEvent(new CustomEvent('systicket:listDataInjected'));
    }

    /* Met à jour la liste des projets sur le tableau de bord */
    function updateDashboardProjects() {
        var dashboardProjects = document.querySelector('.dashboard-projects');
        if (!dashboardProjects) return;
        
        var projets = AppData.get('projets') || [];
        var clients = AppData.get('clients') || [];
        var existingItems = dashboardProjects.querySelectorAll('[data-systicket-injected="1"]');
        existingItems.forEach(function(item) { item.remove(); });
        
        // Supprimer aussi les éléments placeholder
        var placeholders = dashboardProjects.querySelectorAll('li:not([data-systicket-injected])');
        placeholders.forEach(function(p) { p.remove(); });
        
        // Filtrer les projets actifs
        var activeProjects = projets.filter(function(p) {
            return !p.status || p.status === 'active';
        }).slice(0, 5);
        
        if (activeProjects.length > 0) {
            var emptyMsg = dashboardProjects.parentElement.querySelector('.text-secondary.text-sm');
            if (emptyMsg) emptyMsg.style.display = 'none';
            
            activeProjects.forEach(function(p) {
                var li = document.createElement('li');
                li.className = 'dashboard-project-item';
                li.setAttribute('data-systicket-injected', '1');
                var clientName = '—';
                if (p.client) {
                    var client = clients.find(function(c) {
                        return String(c._id) === String(p.client) || String(c.name) === String(p.client);
                    });
                    if (client) clientName = client.name || '—';
                    else if (p.client === '1') clientName = 'Acme Corp';
                    else if (p.client === '2') clientName = 'Tech Solutions';
                    else if (p.client === '3') clientName = 'Design Studio';
                }
                var contrats = AppData.get('contrats') || [];
                var temps = AppData.get('temps') || [];
                var contract = contrats.find(function(c) { return String(c.project) === String(p._id); });
                var totalH = contract ? (parseFloat(contract.hours) || 0) : 0;
                var consumedH = 0;
                temps.forEach(function(t) {
                    if (String(t.project) === String(p._id)) consumedH += parseFloat(t.hours) || 0;
                });
                var pct = totalH > 0 ? Math.round((consumedH / totalH) * 100) : 0;
                li.innerHTML = '<div class="dashboard-project-info"><a href="projet-detail.html?id=' + p._id + '" class="dashboard-project-name">' + (p.name || 'Projet sans nom') + '</a><span class="dashboard-project-meta">' + clientName + '</span></div><div class="dashboard-project-progress"><span class="dashboard-project-percent">' + pct + '%</span><div class="progress-bar"><div class="progress-fill" style="width: ' + pct + '%;"></div></div></div>';
                dashboardProjects.appendChild(li);
            });
        } else {
            var emptyMsg = dashboardProjects.parentElement.querySelector('.text-secondary.text-sm');
            if (emptyMsg) emptyMsg.style.display = 'block';
        }
    }

    /* Calcule et affiche les statistiques des projets */
    function updateProjectStats() {
        var page = document.body.getAttribute('data-page');
        var projets = AppData.get('projets') || [];
        
        // Compter les projets par statut
        var active = 0;
        var paused = 0;
        var completed = 0;
        
        projets.forEach(function(p) {
            // Normaliser le statut (tolowercase et trim)
            var status = (p.status || 'active').toString().toLowerCase().trim();
            if (status === 'paused' || status === 'en pause') {
                paused++;
            } else if (status === 'completed' || status === 'terminé' || status === 'done' || status === 'terminated') {
                completed++;
            } else {
                active++;
            }
        });
        
        console.log('Statistiques projets:', { active: active, paused: paused, completed: completed, total: projets.length });
        
        // Mise à jour des cartes de résumé dans projets.html
        if (page === 'projets') {
            // Utiliser des sélecteurs plus spécifiques pour éviter les conflits avec d'autres pages
            var summarySection = document.querySelector('section[aria-label="Résumé des projets"]');
            if (summarySection) {
                var activeCard = summarySection.querySelector('.list-summary-card-success .list-summary-value');
                var pausedCard = summarySection.querySelector('.list-summary-card-warning .list-summary-value');
                var completedCard = summarySection.querySelector('.list-summary-card-muted .list-summary-value');
                
                if (activeCard) {
                    activeCard.textContent = String(active);
                    console.log('Carte Actifs mise à jour:', active);
                }
                if (pausedCard) {
                    pausedCard.textContent = String(paused);
                    console.log('Carte En pause mise à jour:', paused);
                }
                if (completedCard) {
                    completedCard.textContent = String(completed);
                    console.log('Carte Terminés mise à jour:', completed);
                } else {
                    console.log('Carte Terminés non trouvée');
                }
            } else {
                console.log('Section résumé des projets non trouvée');
            }
            
            var resultsCount = document.querySelector('.list-results-count strong');
            if (resultsCount) resultsCount.textContent = String(projets.length || 0);
        }
        
        // Mise à jour de la carte "Projets actifs" dans le dashboard
        // Cette mise à jour est aussi faite dans updateDashboard(), donc on évite la duplication
        // Mais on la garde pour s'assurer que la valeur est toujours à jour
        var dashboardActiveProjects = document.querySelector('a[href="projets.html"] .stat-value');
        if (dashboardActiveProjects && document.body.getAttribute('data-page') === 'dashboard') {
            dashboardActiveProjects.textContent = String(active);
        }
    }

    /* Calcule et affiche les statistiques des contrats */
    function updateContractStats() {
        var contrats = AppData.get('contrats') || [];
        var temps = AppData.get('temps') || [];
        
        // Calculer les heures totales, consommées et restantes (tous contrats confondus)
        var totalHours = 0;
        var consumedHours = 0;
        
        contrats.forEach(function(c) {
            var contractHours = parseFloat(c.hours) || 0;
            totalHours += contractHours;
            
            // Calculer les heures consommées pour ce contrat
            if (c.project) {
                temps.forEach(function(t) {
                    if (String(t.project) === String(c.project)) {
                        consumedHours += parseFloat(t.hours) || 0;
                    }
                });
            }
        });
        
        var remainingHours = Math.max(0, totalHours - consumedHours);
        
        // Mise à jour des cartes de résumé dans contrats.html
        var page = document.body.getAttribute('data-page');
        if (page === 'contrats') {
            var summarySection = document.querySelector('section[aria-label="Résumé des contrats"]');
            if (summarySection) {
                var totalCard = summarySection.querySelector('.list-summary-card-primary .list-summary-value');
                var consumedCard = summarySection.querySelector('.list-summary-card-warning .list-summary-value');
                var remainingCard = summarySection.querySelector('.list-summary-card-success .list-summary-value');
                
                if (totalCard) totalCard.textContent = (totalHours || 0) + 'h';
                if (consumedCard) consumedCard.textContent = (consumedHours || 0) + 'h';
                if (remainingCard) remainingCard.textContent = (remainingHours || 0) + 'h';
            }
        }
        
        var resultsCount = document.querySelector('.list-results-count strong');
        if (resultsCount) resultsCount.textContent = String(contrats.length || 0);
    }

    /* Met à jour tous les éléments du tableau de bord */
    function updateDashboard() {
        var page = document.body.getAttribute('data-page');
        if (page !== 'dashboard') return;
        
        var tickets = AppData.get('tickets') || [];
        var projets = AppData.get('projets') || [];
        var temps = AppData.get('temps') || [];
        var validations = AppData.get('validations') || [];
        var contrats = AppData.get('contrats') || [];
        
        // Calculer les statistiques des tickets
        var openTickets = tickets.filter(function(t) {
            return !t.status || t.status === 'new' || t.status === 'in-progress';
        }).length;
        
        // Compter les projets par statut
        var activeProjects = 0;
        var pausedProjects = 0;
        var completedProjects = 0;
        projets.forEach(function(p) {
            var status = p.status || 'active';
            if (status === 'paused') {
                pausedProjects++;
            } else if (status === 'completed') {
                completedProjects++;
            } else {
                activeProjects++;
            }
        });
        
        // Compter les tickets à valider (depuis les validations et les tickets avec statut to-validate)
        var ticketsToValidate = 0;
        validations.forEach(function(v) {
            if (v === 'to-validate' || v === 'waiting') {
                ticketsToValidate++;
            }
        });
        tickets.forEach(function(t) {
            if (t.status === 'to-validate' || t.status === 'waiting') {
                ticketsToValidate++;
            }
        });
        
        // Calculer les heures du mois en cours
        var currentMonth = new Date().getMonth();
        var currentYear = new Date().getFullYear();
        var monthHours = 0;
        temps.forEach(function(t) {
            if (t.date) {
                var date = new Date(t.date);
                if (date.getMonth() === currentMonth && date.getFullYear() === currentYear) {
                    monthHours += parseFloat(t.hours) || 0;
                }
            }
        });
        
        // Mettre à jour les cartes de statistiques
        var openTicketsCard = document.querySelector('a[href="tickets.html"] .stat-value');
        if (openTicketsCard) openTicketsCard.textContent = String(openTickets || 0);
        
        var activeProjectsCard = document.querySelector('a[href="projets.html"] .stat-value');
        if (activeProjectsCard) {
            // S'assurer que c'est bien un nombre sans "h"
            activeProjectsCard.textContent = String(activeProjects);
        }
        
        var validateCard = document.querySelector('a[href="ticket-validation.html"] .stat-value');
        if (validateCard) validateCard.textContent = String(ticketsToValidate || 0);
        
        var hoursCard = document.querySelector('a[href="temps.html"] .stat-value');
        if (hoursCard) {
            hoursCard.textContent = (monthHours || 0) + 'h';
        }
        
        // Mettre à jour le graphique de répartition des tickets par statut
        var statusCounts = {
            'new': 0,
            'in-progress': 0,
            'done': 0,
            'to-validate': 0,
            'validated': 0
        };
        
        tickets.forEach(function(t) {
            var status = t.status || 'new';
            if (statusCounts.hasOwnProperty(status)) {
                statusCounts[status]++;
            }
        });
        
        // Ajouter les validations
        validations.forEach(function(v) {
            if (v === 'validated' || v === 'refused') {
                statusCounts['validated']++;
            } else if (v === 'to-validate' || v === 'waiting') {
                statusCounts['to-validate']++;
            }
        });
        
        var totalTickets = tickets.length || 1;
        var maxCount = Math.max(statusCounts['new'], statusCounts['in-progress'], statusCounts['done'], statusCounts['to-validate'], statusCounts['validated'], 1);
        
        var chartRows = document.querySelectorAll('.dashboard-chart-bars .dashboard-chart-row');
        if (chartRows.length >= 5) {
            // Nouveau
            var newBar = chartRows[0].querySelector('.dashboard-chart-bar');
            var newValue = chartRows[0].querySelector('.dashboard-chart-value');
            if (newBar && newValue) {
                var newPercent = (statusCounts['new'] / maxCount) * 100;
                newBar.style.width = newPercent + '%';
                newValue.textContent = statusCounts['new'];
            }
            
            // En cours
            var progressBar = chartRows[1].querySelector('.dashboard-chart-bar');
            var progressValue = chartRows[1].querySelector('.dashboard-chart-value');
            if (progressBar && progressValue) {
                var progressPercent = (statusCounts['in-progress'] / maxCount) * 100;
                progressBar.style.width = progressPercent + '%';
                progressValue.textContent = statusCounts['in-progress'];
            }
            
            // Terminé
            var doneBar = chartRows[2].querySelector('.dashboard-chart-bar');
            var doneValue = chartRows[2].querySelector('.dashboard-chart-value');
            if (doneBar && doneValue) {
                var donePercent = (statusCounts['done'] / maxCount) * 100;
                doneBar.style.width = donePercent + '%';
                doneValue.textContent = statusCounts['done'];
            }
            
            // À valider
            var validateBar = chartRows[3].querySelector('.dashboard-chart-bar');
            var validateValue = chartRows[3].querySelector('.dashboard-chart-value');
            if (validateBar && validateValue) {
                var validatePercent = (statusCounts['to-validate'] / maxCount) * 100;
                validateBar.style.width = validatePercent + '%';
                validateValue.textContent = statusCounts['to-validate'];
            }
            
            // Validé / Refusé
            var validatedBar = chartRows[4].querySelector('.dashboard-chart-bar');
            var validatedValue = chartRows[4].querySelector('.dashboard-chart-value');
            if (validatedBar && validatedValue) {
                var validatedPercent = (statusCounts['validated'] / maxCount) * 100;
                validatedBar.style.width = validatedPercent + '%';
                validatedValue.textContent = statusCounts['validated'];
            }
        }
        
        // Mettre à jour le graphique des heures par projet
        var projectHoursChart = null;
        var hoursWidget = Array.from(document.querySelectorAll('.widget-card')).find(function(w) {
            var h2 = w.querySelector('h2');
            return h2 && h2.textContent.indexOf('Heures par projet') !== -1;
        });
        if (hoursWidget) {
            projectHoursChart = hoursWidget.querySelector('.dashboard-chart-bars');
        }
        
        if (projectHoursChart) {
            var projectHours = {};
            var currentMonthStart = new Date(currentYear, currentMonth, 1);
            
            temps.forEach(function(t) {
                if (t.date && t.project) {
                    var date = new Date(t.date);
                    if (date >= currentMonthStart) {
                        var projectId = String(t.project);
                        if (!projectHours[projectId]) {
                            projectHours[projectId] = 0;
                        }
                        projectHours[projectId] += parseFloat(t.hours) || 0;
                    }
                }
            });
            
            var projectHoursArray = [];
            projets.forEach(function(p) {
                var hours = projectHours[String(p._id)] || projectHours[p.name] || 0;
                if (hours > 0 || p.status === 'active') {
                    projectHoursArray.push({
                        name: p.name || 'Projet sans nom',
                        id: p._id,
                        hours: hours
                    });
                }
            });
            
            projectHoursArray.sort(function(a, b) { return b.hours - a.hours; });
            projectHoursArray = projectHoursArray.slice(0, 3);
            
            var maxProjectHours = Math.max.apply(Math, projectHoursArray.map(function(p) { return p.hours; })) || 1;
            var totalProjectHours = projectHoursArray.reduce(function(sum, p) { return sum + p.hours; }, 0);
            
            var projectRows = projectHoursChart.querySelectorAll('.dashboard-chart-row');
            projectRows.forEach(function(row, idx) {
                if (idx < projectHoursArray.length) {
                    var project = projectHoursArray[idx];
                    var label = row.querySelector('.dashboard-chart-label');
                    var bar = row.querySelector('.dashboard-chart-bar');
                    var value = row.querySelector('.dashboard-chart-value');
                    
                    if (label) {
                        var link = label.querySelector('a') || label;
                        link.textContent = project.name;
                        if (link.tagName === 'A') link.href = 'projet-detail.html?id=' + project.id;
                    }
                    if (bar) {
                        var percent = (project.hours / maxProjectHours) * 100;
                        bar.style.width = percent + '%';
                        bar.className = 'dashboard-chart-bar ' + (idx === 0 ? 'dashboard-chart-bar-primary' : (idx === 1 ? 'dashboard-chart-bar-blue' : 'dashboard-chart-bar-green'));
                    }
                    if (value) value.textContent = project.hours + 'h';
                } else {
                    row.style.display = 'none';
                }
            });
            
            var totalText = projectHoursChart.parentElement.querySelector('.dashboard-chart-total');
            if (totalText) {
                var totalContractHours = contrats.reduce(function(sum, c) { return sum + (parseFloat(c.hours) || 0); }, 0);
                totalText.innerHTML = '<strong>Total : ' + (totalProjectHours || 0) + 'h</strong> sur ' + (totalContractHours || 0) + 'h prévus';
            }
        }
        
        // Mettre à jour l'enveloppe d'heures
        var gaugeValue = document.querySelector('.dashboard-gauge-value');
        var gaugeProgress = document.querySelector('.dashboard-gauge .progress-fill');
        var gaugeText = document.querySelector('.dashboard-gauge .progress-text');
        
        if (gaugeValue && gaugeProgress && gaugeText) {
            var totalContractHours = contrats.reduce(function(sum, c) { return sum + (parseFloat(c.hours) || 0); }, 0);
            var consumedContractHours = 0;
            
            temps.forEach(function(t) {
                if (t.project) {
                    contrats.forEach(function(c) {
                        if (String(c.project) === String(t.project)) {
                            consumedContractHours += parseFloat(t.hours) || 0;
                        }
                    });
                }
            });
            
            var percent = totalContractHours > 0 ? (consumedContractHours / totalContractHours) * 100 : 0;
            gaugeValue.innerHTML = (consumedContractHours || 0) + 'h <span class="text-secondary">/ ' + (totalContractHours || 0) + 'h</span>';
            gaugeProgress.style.width = percent + '%';
            gaugeText.textContent = Math.round(percent) + '% consommées';
        }
        
        // Mettre à jour les tickets récents
        var recentTicketsTable = document.querySelector('.table-compact tbody');
        if (recentTicketsTable) {
            var existingRows = recentTicketsTable.querySelectorAll('[data-systicket-injected="1"]');
            existingRows.forEach(function(r) { r.remove(); });
            
            var recentTickets = tickets.slice().sort(function(a, b) {
                return (b._id || 0) - (a._id || 0);
            }).slice(0, 5);
            
            if (recentTickets.length > 0) {
                var emptyRow = recentTicketsTable.querySelector('.table-empty');
                if (emptyRow) emptyRow.remove();
                
                recentTickets.forEach(function(t) {
                    var tr = document.createElement('tr');
                    tr.setAttribute('data-systicket-injected', '1');
                    var status = t.status || 'new';
                    var statusText = status === 'new' ? 'Nouveau' : (status === 'in-progress' ? 'En cours' : (status === 'done' ? 'Terminé' : (status === 'to-validate' ? 'À valider' : '—')));
                    var statusClass = status === 'new' ? 'badge-status-new' : (status === 'in-progress' ? 'badge-status-in-progress' : (status === 'done' ? 'badge-status-done' : (status === 'to-validate' ? 'badge-status-to-validate' : 'badge-status-new')));
                    var date = t._id ? new Date(parseInt(t._id)).toLocaleDateString('fr-FR') : '—';
                    tr.innerHTML = '<td>' + (t._id || '—') + '</td><td><a href="ticket-detail.html?id=' + t._id + '">' + (t.title || '—') + '</a></td><td><span class="badge ' + statusClass + '">' + statusText + '</span></td><td>' + (date || '—') + '</td>';
                    recentTicketsTable.appendChild(tr);
                });
            }
        }
        
        // Mettre à jour les activités récentes
        var activityList = document.querySelector('.dashboard-activity');
        if (activityList) {
            var existingActivities = activityList.querySelectorAll('[data-systicket-injected="1"]');
            existingActivities.forEach(function(a) { a.remove(); });
            
            var activities = [];
            
            // Ajouter les tickets récents
            tickets.slice().sort(function(a, b) {
                return (b._id || 0) - (a._id || 0);
            }).slice(0, 3).forEach(function(t) {
                activities.push({
                    type: 'ticket',
                    text: 'Ticket créé : ' + (t.title || 'Sans titre'),
                    date: t._id ? new Date(parseInt(t._id)) : new Date(),
                    icon: 'dashboard-activity-icon-ticket'
                });
            });
            
            // Ajouter les entrées de temps récentes
            temps.slice().sort(function(a, b) {
                var dateA = a.date ? new Date(a.date) : new Date(0);
                var dateB = b.date ? new Date(b.date) : new Date(0);
                return dateB - dateA;
            }).slice(0, 3).forEach(function(t) {
                activities.push({
                    type: 'time',
                    text: (t.hours || 0) + 'h enregistrées',
                    date: t.date ? new Date(t.date) : new Date(),
                    icon: 'dashboard-activity-icon-time'
                });
            });
            
            // Trier toutes les activités par date
            activities.sort(function(a, b) {
                return b.date - a.date;
            });
            
            // Afficher les 5 plus récentes
            if (activities.length > 0) {
                var emptyMsg = activityList.parentElement.querySelector('.text-secondary.text-sm');
                if (emptyMsg) emptyMsg.style.display = 'none';
                
                // Supprimer l'élément de placeholder s'il existe
                var placeholder = activityList.querySelector('li:not([data-systicket-injected])');
                if (placeholder) placeholder.remove();
                
                activities.slice(0, 5).forEach(function(act) {
                    var li = document.createElement('li');
                    li.className = 'dashboard-activity-item';
                    li.setAttribute('data-systicket-injected', '1');
                    var dateStr = act.date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
                    li.innerHTML = '<span class="dashboard-activity-icon ' + act.icon + '" aria-hidden="true">' + (act.type === 'ticket' ? '🎫' : '⏱️') + '</span><div class="dashboard-activity-content"><p>' + act.text + '</p><time class="dashboard-activity-time">' + dateStr + '</time></div>';
                    activityList.appendChild(li);
                });
            } else {
                var emptyMsg = activityList.parentElement.querySelector('.text-secondary.text-sm');
                if (emptyMsg) emptyMsg.style.display = 'block';
            }
        }
        
        // Mettre à jour les projets à la une (déjà fait par updateDashboardProjects mais s'assurer qu'il est appelé)
        updateDashboardProjects();
    }

    /* Remplit la page de détail d'un client avec ses informations */
    function updateClientDetail() {
        var page = document.body.getAttribute('data-page');
        if (page !== 'clients') return;
        
        // Vérifier si on est sur la page de détails (présence de .ticket-header)
        var isDetailPage = document.querySelector('.ticket-header') !== null;
        if (!isDetailPage) return;
        
        // Récupérer l'ID du client depuis l'URL
        var urlParams = new URLSearchParams(window.location.search);
        var clientId = urlParams.get('id');
        if (!clientId) {
            // Essayer de récupérer depuis le lien d'édition
            var editLink = document.querySelector('.btn-edit-client');
            if (editLink && editLink.href) {
                var match = editLink.href.match(/[?&]id=([^&]+)/);
                if (match) clientId = match[1];
            }
        }
        
        if (!clientId) return;
        
        var clients = AppData.get('clients') || [];
        var projets = AppData.get('projets') || [];
        var tickets = AppData.get('tickets') || [];
        var temps = AppData.get('temps') || [];
        var contrats = AppData.get('contrats') || [];
        
        // Trouver le client
        var client = null;
        if (clientId) {
            // Essayer de trouver par ID exact
            client = clients.find(function(c) {
                return String(c._id) === String(clientId) || String(c.name) === String(clientId);
            });
            
            // Si l'ID est un nombre simple (1, 2, 3...) et qu'aucun client n'est trouvé,
            // essayer de trouver par index (pour compatibilité avec les anciens liens)
            if (!client && /^\d+$/.test(String(clientId))) {
                var index = parseInt(clientId, 10) - 1;
                if (index >= 0 && index < clients.length) {
                    client = clients[index];
                }
            }
        }
        
        // Fallback sur les clients statiques
        if (!client) {
            if (clientId === '1') {
                client = { _id: '1', name: 'Acme Corp', contact: 'Jean Dupont', email: 'contact@acme.com', phone: '01 23 45 67 89', address: '123 Rue Example, Paris' };
            } else if (clientId === '2') {
                client = { _id: '2', name: 'Tech Solutions', contact: 'Marie Martin', email: 'contact@tech.com', phone: '01 98 76 54 32', address: '456 Avenue Test, Lyon' };
            } else if (clientId === '3') {
                client = { _id: '3', name: 'Design Studio', contact: 'Pierre Durand', email: 'contact@design.com', phone: '01 11 22 33 44', address: '789 Boulevard Demo, Marseille' };
            }
        }
        
        if (!client) return;
        
        // Mettre à jour l'ID du client pour les liens
        clientId = client._id;
        
        // Mettre à jour le lien d'édition
        var editLink = document.querySelector('.btn-edit-client');
        if (editLink) editLink.setAttribute('href', 'client-form.html?id=' + encodeURIComponent(clientId));
        
        // Lien Créer un projet (pré-remplit le client)
        var createProjectLink = document.querySelector('.btn-create-project');
        if (createProjectLink) createProjectLink.setAttribute('href', 'projet-form.html?client=' + encodeURIComponent(clientId));
        
        // Mettre à jour le titre et le breadcrumb
        var title = document.querySelector('.ticket-header-left h1');
        if (title) title.textContent = client.name || '—';
        var breadcrumb = document.querySelector('.breadcrumb span:last-child');
        if (breadcrumb) breadcrumb.textContent = client.name || '—';
        
        // Mettre à jour les informations client
        var infoList = document.querySelector('.info-list');
        if (infoList) {
            var dt = infoList.querySelectorAll('dt');
            var dd = infoList.querySelectorAll('dd');
            dt.forEach(function(dtEl, idx) {
                if (dd[idx]) {
                    var label = dtEl.textContent.trim();
                    if (label === 'Raison sociale') {
                        dd[idx].textContent = client.name || '—';
                    } else if (label === 'Contact principal') {
                        dd[idx].textContent = client.contact || '—';
                    } else if (label === 'Téléphone') {
                        dd[idx].textContent = client.phone || '—';
                    } else if (label === 'Adresse') {
                        dd[idx].textContent = client.address || '—';
                    }
                }
            });
        }
        
        // Filtrer les projets du client
        var clientProjects = projets.filter(function(p) {
            return String(p.client) === String(clientId) || String(p.client) === String(client._id);
        });
        
        // Mettre à jour le tableau des projets
        var projectsTable = document.querySelector('.ticket-section .table tbody');
        if (projectsTable) {
            var existingRows = projectsTable.querySelectorAll('[data-systicket-injected="1"]');
            existingRows.forEach(function(r) { r.remove(); });
            var emptyRow = projectsTable.querySelector('.table-empty');
            
            if (clientProjects.length > 0) {
                if (emptyRow) emptyRow.remove();
                
                clientProjects.forEach(function(p) {
                    var tr = document.createElement('tr');
                    tr.setAttribute('data-systicket-injected', '1');
                    
                    // Compter les tickets du projet
                    var projectTickets = tickets.filter(function(t) {
                        return String(t.project) === String(p._id) || String(t.project) === p.name;
                    }).length;
                    
                    // Calculer les heures du projet
                    var projectHours = 0;
                    temps.forEach(function(t) {
                        if (String(t.project) === String(p._id) || String(t.project) === p.name) {
                            projectHours += parseFloat(t.hours) || 0;
                        }
                    });
                    
                    var statusClass = p.status === 'paused' ? 'badge-warning' : (p.status === 'completed' ? 'badge-info' : 'badge-success');
                    var statusText = p.status === 'paused' ? 'En pause' : (p.status === 'completed' ? 'Terminé' : 'Actif');
                    
                    tr.innerHTML = '<td><a href="projet-detail.html?id=' + p._id + '">' + (p.name || '—') + '</a></td><td><span class="badge ' + statusClass + '">' + statusText + '</span></td><td>' + (projectTickets || 0) + '</td><td>' + (projectHours || 0) + 'h</td><td><a href="projet-detail.html?id=' + p._id + '">Voir</a></td>';
                    projectsTable.appendChild(tr);
                });
            } else {
                if (!emptyRow) {
                    var emptyTr = document.createElement('tr');
                    emptyTr.innerHTML = '<td colspan="5" class="table-empty">Aucun projet.</td>';
                    projectsTable.appendChild(emptyTr);
                }
            }
        }
        
        // Filtrer les tickets du client (via les projets)
        var clientTickets = tickets.filter(function(t) {
            if (!t.project) return false;
            return clientProjects.some(function(p) {
                return String(t.project) === String(p._id) || String(t.project) === p.name;
            });
        }).sort(function(a, b) {
            return (b._id || 0) - (a._id || 0);
        }).slice(0, 5);
        
        // Mettre à jour le tableau des tickets récents
        var ticketsTable = document.querySelectorAll('.ticket-section .table tbody')[1];
        if (ticketsTable) {
            var existingTicketRows = ticketsTable.querySelectorAll('[data-systicket-injected="1"]');
            existingTicketRows.forEach(function(r) { r.remove(); });
            var emptyTicketRow = ticketsTable.querySelector('.table-empty');
            
            if (clientTickets.length > 0) {
                if (emptyTicketRow) emptyTicketRow.remove();
                
                clientTickets.forEach(function(t) {
                    var tr = document.createElement('tr');
                    tr.setAttribute('data-systicket-injected', '1');
                    var status = t.status || 'new';
                    var statusText = status === 'new' ? 'Nouveau' : (status === 'in-progress' ? 'En cours' : (status === 'done' ? 'Terminé' : (status === 'to-validate' ? 'À valider' : '—')));
                    var statusClass = status === 'new' ? 'badge-status-new' : (status === 'in-progress' ? 'badge-status-in-progress' : (status === 'done' ? 'badge-status-done' : (status === 'to-validate' ? 'badge-status-to-validate' : 'badge-status-new')));
                    var date = t._id ? new Date(parseInt(t._id)).toLocaleDateString('fr-FR') : '—';
                    tr.innerHTML = '<td>' + (t._id || '—') + '</td><td><a href="ticket-detail.html?id=' + t._id + '">' + (t.title || '—') + '</a></td><td><span class="badge ' + statusClass + '">' + statusText + '</span></td><td>' + date + '</td><td><a href="ticket-detail.html?id=' + t._id + '">Voir</a></td>';
                    ticketsTable.appendChild(tr);
                });
            } else {
                if (!emptyTicketRow) {
                    var emptyTr = document.createElement('tr');
                    emptyTr.innerHTML = '<td colspan="5" class="table-empty">Aucun ticket récent.</td>';
                    ticketsTable.appendChild(emptyTr);
                }
            }
        }
        
        // Calculer les statistiques
        var activeProjectsCount = clientProjects.filter(function(p) {
            return !p.status || p.status === 'active';
        }).length;
        
        var openTicketsCount = clientTickets.filter(function(t) {
            return !t.status || t.status === 'new' || t.status === 'in-progress';
        }).length;
        
        // Calculer les heures consommées et restantes
        var consumedHours = 0;
        var totalHours = 0;
        clientProjects.forEach(function(p) {
            temps.forEach(function(t) {
                if (String(t.project) === String(p._id) || String(t.project) === p.name) {
                    consumedHours += parseFloat(t.hours) || 0;
                }
            });
            
            // Trouver le contrat associé au projet
            var contract = contrats.find(function(c) {
                return String(c.project) === String(p._id) || String(c.project) === p.name;
            });
            if (contract) {
                totalHours += parseFloat(contract.hours) || 0;
            }
        });
        var remainingHours = Math.max(0, totalHours - consumedHours);
        
        // Mettre à jour les statistiques dans la sidebar
        var statsList = document.querySelector('.ticket-sidebar .info-list');
        if (statsList) {
            var statsDt = statsList.querySelectorAll('dt');
            var statsDd = statsList.querySelectorAll('dd');
            statsDt.forEach(function(dtEl, idx) {
                if (statsDd[idx]) {
                    var label = dtEl.textContent.trim();
                    if (label === 'Projets actifs') {
                        statsDd[idx].textContent = String(activeProjectsCount);
                    } else if (label === 'Tickets ouverts') {
                        statsDd[idx].textContent = String(openTicketsCount);
                    } else if (label === 'Heures consommées') {
                        statsDd[idx].textContent = (consumedHours || 0) + 'h';
                    } else if (label === 'Heures restantes') {
                        statsDd[idx].textContent = (remainingHours || 0) + 'h';
                    }
                }
            });
        }
        
        // Mettre à jour l'activité récente
        var activityList = document.querySelector('.dashboard-activity[aria-label="Activité du client"]');
        if (activityList) {
            var existingActivities = activityList.querySelectorAll('[data-systicket-injected="1"]');
            existingActivities.forEach(function(a) { a.remove(); });
            var placeholder = activityList.querySelector('li:not([data-systicket-injected])');
            if (placeholder) placeholder.remove();
            
            var activities = [];
            clientTickets.slice(0, 3).forEach(function(t) {
                activities.push({
                    type: 'ticket',
                    text: 'Ticket créé : ' + (t.title || 'Sans titre'),
                    date: t._id ? new Date(parseInt(t._id)) : new Date(),
                    icon: 'dashboard-activity-icon-ticket'
                });
            });
            
            if (activities.length > 0) {
                var emptyMsg = activityList.parentElement.querySelector('.text-secondary.text-sm');
                if (emptyMsg) emptyMsg.style.display = 'none';
                
                activities.forEach(function(act) {
                    var li = document.createElement('li');
                    li.className = 'dashboard-activity-item';
                    li.setAttribute('data-systicket-injected', '1');
                    var dateStr = act.date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
                    li.innerHTML = '<span class="dashboard-activity-icon ' + act.icon + '" aria-hidden="true">🎫</span><div class="dashboard-activity-content"><p>' + act.text + '</p><time class="dashboard-activity-time">' + dateStr + '</time></div>';
                    activityList.appendChild(li);
                });
            } else {
                var emptyMsg = activityList.parentElement.querySelector('.text-secondary.text-sm');
                if (emptyMsg) emptyMsg.style.display = 'block';
            }
        }
    }

    /* Met à jour les menus déroulants de sélection de clients */
    function updateClientSelects() {
        var clients = AppData.get('clients') || [];
        var clientSelects = document.querySelectorAll('#project-client, #contrat-client');
        
        clientSelects.forEach(function(select) {
            if (!select) return;
            
            // Garder la première option (placeholder)
            var firstOption = select.querySelector('option[value=""]');
            var selectedValue = select.value;
            
            // Supprimer toutes les options sauf la première
            while (select.options.length > 1) {
                select.remove(1);
            }
            
            // Ajouter les clients statiques
            var staticClients = [
                { value: '1', name: 'Acme Corp' },
                { value: '2', name: 'Tech Solutions' },
                { value: '3', name: 'Design Studio' }
            ];
            
            staticClients.forEach(function(sc) {
                var option = document.createElement('option');
                option.value = sc.value;
                option.textContent = sc.name;
                select.appendChild(option);
            });
            
            // Ajouter les clients dynamiques
            clients.forEach(function(client) {
                // Vérifier si le client n'est pas déjà dans les clients statiques
                var isStatic = staticClients.some(function(sc) {
                    return String(sc.value) === String(client._id) || sc.name === client.name;
                });
                
                if (!isStatic) {
                    var option = document.createElement('option');
                    option.value = client._id || client.name;
                    option.textContent = client.name || '—';
                    select.appendChild(option);
                }
            });
            
            // Restaurer la valeur sélectionnée si elle existe toujours
            if (selectedValue) {
                select.value = selectedValue;
            }
        });
    }

    /* Met à jour la page temps : résumés, total, formulaire, filtres */
    function updateTempsPage() {
        if (document.body.getAttribute('data-page') !== 'temps') return;
        var temps = AppData.get('temps') || [];
        var contrats = AppData.get('contrats') || [];
        var projets = AppData.get('projets') || [];
        var tickets = AppData.get('tickets') || [];

        var now = new Date();
        var currentMonth = now.getMonth();
        var currentYear = now.getFullYear();
        var dayOfWeek = now.getDay();
        var mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
        var weekStart = new Date(now);
        weekStart.setDate(now.getDate() + mondayOffset);
        weekStart.setHours(0, 0, 0, 0);
        var weekEnd = new Date(weekStart);
        weekEnd.setDate(weekStart.getDate() + 6);
        weekEnd.setHours(23, 59, 59, 999);

        var totalMonth = 0, totalWeek = 0;
        temps.forEach(function(t) {
            var h = parseFloat(t.hours) || 0;
            if (t.date) {
                var d = new Date(t.date);
                if (d.getMonth() === currentMonth && d.getFullYear() === currentYear) totalMonth += h;
                if (d >= weekStart && d <= weekEnd) totalWeek += h;
            }
        });

        var summarySection = document.querySelector('section[aria-label="Résumé des heures"]');
        if (summarySection) {
            var monthCard = summarySection.querySelector('.list-summary-card-primary .list-summary-value');
            if (monthCard) monthCard.textContent = (totalMonth || 0) + 'h';
            var weekCard = summarySection.querySelector('.list-summary-card-success .list-summary-value');
            if (weekCard) weekCard.textContent = (totalWeek || 0) + 'h';
            var restantesCard = summarySection.querySelector('.list-summary-card-muted .list-summary-value');
            if (restantesCard) {
                var totalEnveloppe = 0, consumedEnveloppe = 0;
                contrats.forEach(function(c) { totalEnveloppe += parseFloat(c.hours) || 0; });
                temps.forEach(function(t) { consumedEnveloppe += parseFloat(t.hours) || 0; });
                var restantes = Math.max(0, totalEnveloppe - consumedEnveloppe);
                restantesCard.textContent = (restantes || 0) + 'h';
            }
        }

        var footerTotal = document.querySelector('.table-footer .text-hours-total');
        if (footerTotal) footerTotal.textContent = (totalMonth || 0) + 'h';

        var timeTicketSelect = document.getElementById('time-ticket');
        if (timeTicketSelect) {
            var selVal = timeTicketSelect.value;
            while (timeTicketSelect.options.length > 1) timeTicketSelect.remove(1);
            tickets.forEach(function(tk) {
                var opt = document.createElement('option');
                opt.value = tk._id;
                opt.textContent = '#' + tk._id + ' - ' + (tk.title || '—');
                timeTicketSelect.appendChild(opt);
            });
            if (selVal) timeTicketSelect.value = selVal;
        }

        var projectFilter = document.querySelector('.content-section .filters-section select[data-filter="project"]');
        if (projectFilter) {
            var filterVal = projectFilter.value;
            while (projectFilter.options.length > 1) projectFilter.remove(1);
            projets.forEach(function(p) {
                var opt = document.createElement('option');
                opt.value = p._id;
                opt.textContent = (p.name || '—');
                projectFilter.appendChild(opt);
            });
            if (filterVal) projectFilter.value = filterVal;
        }

        var periodLabel = document.querySelector('.time-period-label strong');
        var prevLink = document.getElementById('week-prev');
        var nextLink = document.getElementById('week-next');
        if (periodLabel || prevLink || nextLink) {
            var params = new URLSearchParams(window.location.search);
            var weekOffset = 0;
            var weekParam = params.get('week');
            if (weekParam === 'prev') weekOffset = -1;
            else if (weekParam === 'next') weekOffset = 1;
            else if (weekParam !== null && weekParam !== '') {
                var n = parseInt(weekParam, 10);
                if (!isNaN(n)) weekOffset = n;
            }
            var refDate = new Date();
            refDate.setDate(refDate.getDate() + weekOffset * 7);
            var dow = refDate.getDay();
            var monOffset = dow === 0 ? -6 : 1 - dow;
            var mon = new Date(refDate);
            mon.setDate(refDate.getDate() + monOffset);
            var sun = new Date(mon);
            sun.setDate(mon.getDate() + 6);
            var fmt = function(d) { return d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' }); };
            if (periodLabel) periodLabel.textContent = 'Semaine du ' + fmt(mon) + ' — ' + fmt(sun);
            /* Liens Précédent/Suivant avec offset cumulé */
            var baseUrl = 'temps.html';
            if (prevLink) prevLink.href = baseUrl + '?week=' + (weekOffset - 1);
            if (nextLink) nextLink.href = baseUrl + '?week=' + (weekOffset + 1);
        }
    }

    /* Pagination Précédent/Suivant pour tickets et projets */
    function updatePagination() {
        var pageKey = document.body.getAttribute('data-page');
        if (pageKey !== 'tickets' && pageKey !== 'projets') return;
        var pageBase = pageKey + '.html';
        var pagination = document.querySelector('.pagination');
        if (!pagination) return;
        var rows = document.querySelectorAll('.ticket-row[data-row-index], .project-row[data-row-index]');
        var perPage = 10;
        var totalRows = rows.length;
        var totalPages = Math.max(1, Math.ceil(totalRows / perPage));
        var params = new URLSearchParams(window.location.search);
        var page = parseInt(params.get('page'), 10) || 1;
        if (page < 1) page = 1;
        if (page > totalPages) page = totalPages;
        var startIdx = (page - 1) * perPage;
        var endIdx = Math.min(startIdx + perPage, totalRows);
        rows.forEach(function(row) {
            var idx = parseInt(row.getAttribute('data-row-index'), 10);
            row.style.display = (idx >= startIdx && idx < endIdx) ? '' : 'none';
        });
        var infoEl = pagination.querySelector('.pagination-info');
        if (infoEl) infoEl.textContent = 'Page ' + page + ' sur ' + totalPages;
        var prevBtn = pagination.querySelector('.pagination-prev');
        var nextBtn = pagination.querySelector('.pagination-next');
        if (prevBtn) {
            prevBtn.disabled = page <= 1;
            prevBtn.onclick = page > 1 ? function() { location.href = pageBase + '?page=' + (page - 1); } : null;
        }
        if (nextBtn) {
            nextBtn.disabled = page >= totalPages;
            nextBtn.onclick = page < totalPages ? function() { location.href = pageBase + '?page=' + (page + 1); } : null;
        }
    }

    /* Met à jour les menus déroulants de sélection de projets */
    function updateProjectSelects() {
        var projets = AppData.get('projets') || [];
        var projectSelects = document.querySelectorAll('#ticket-project, #contrat-project');
        projectSelects.forEach(function(select) {
            if (!select || !select.id) return;
            var selectedValue = select.value;
            while (select.options.length > 1) select.remove(1);
            projets.forEach(function(p) {
                var opt = document.createElement('option');
                opt.value = p._id;
                opt.textContent = (p.name || '—');
                select.appendChild(opt);
            });
            if (selectedValue) select.value = selectedValue;
        });
    }

    /* Remplit la page de détail d'un projet avec ses informations */
    function updateProjectDetail() {
        var page = document.body.getAttribute('data-page');
        if (page !== 'projets') return;
        
        // Vérifier si on est sur la page de détails (présence de .ticket-header)
        var isDetailPage = document.querySelector('.ticket-header') !== null;
        if (!isDetailPage) return;
        
        // Récupérer l'ID du projet depuis l'URL
        var urlParams = new URLSearchParams(window.location.search);
        var projectId = urlParams.get('id');
        if (!projectId) {
            // Essayer de récupérer depuis le lien d'édition
            var editLink = document.querySelector('.btn-edit-project');
            if (editLink && editLink.href) {
                var match = editLink.href.match(/[?&]id=([^&]+)/);
                if (match) projectId = match[1];
            }
        }
        
        if (!projectId) return;
        
        var projets = AppData.get('projets') || [];
        var clients = AppData.get('clients') || [];
        var tickets = AppData.get('tickets') || [];
        var temps = AppData.get('temps') || [];
        var contrats = AppData.get('contrats') || [];
        var validations = AppData.get('validations') || [];
        
        // Trouver le projet
        var projet = null;
        if (projectId) {
            // Essayer de trouver par ID exact
            projet = projets.find(function(p) {
                return String(p._id) === String(projectId) || String(p.name) === String(projectId);
            });
            
            // Si l'ID est un nombre simple (1, 2, 3...) et qu'aucun projet n'est trouvé,
            // essayer de trouver par index (pour compatibilité avec les anciens liens)
            if (!projet && /^\d+$/.test(String(projectId))) {
                var index = parseInt(projectId, 10) - 1;
                if (index >= 0 && index < projets.length) {
                    projet = projets[index];
                }
            }
        }
        
        // Fallback sur les projets statiques
        if (!projet) {
            if (projectId === '1') {
                projet = { _id: '1', name: 'Site e-commerce', client: '1', status: 'active', description: 'Développement d\'un site e-commerce', start_date: '2024-01-01', end_date: '2024-06-30', manager: '1' };
            } else if (projectId === '2') {
                projet = { _id: '2', name: 'Application mobile', client: '2', status: 'paused', description: 'Application mobile iOS et Android', start_date: '2024-02-01', end_date: '2024-08-31', manager: '2' };
            } else if (projectId === '3') {
                projet = { _id: '3', name: 'Refonte site vitrine', client: '1', status: 'completed', description: 'Refonte complète du site vitrine', start_date: '2023-10-01', end_date: '2024-01-31', manager: '1' };
            }
        }
        
        if (!projet) return;
        
        // Mettre à jour l'ID du projet pour les liens
        projectId = projet._id;
        
        // Récupérer le nom du client
        var clientName = '—';
        if (projet.client) {
            var client = clients.find(function(c) {
                return String(c._id) === String(projet.client) || String(c.name) === String(projet.client);
            });
            if (client) {
                clientName = client.name || '—';
            } else {
                if (projet.client === '1') clientName = 'Acme Corp';
                else if (projet.client === '2') clientName = 'Tech Solutions';
                else if (projet.client === '3') clientName = 'Design Studio';
            }
        }
        
        // Mettre à jour le titre et le breadcrumb
        var title = document.querySelector('.ticket-header-left h1');
        if (title) title.textContent = projet.name || '—';
        var breadcrumb = document.querySelector('.breadcrumb span:last-child');
        if (breadcrumb) breadcrumb.textContent = projet.name || '—';
        
        // Mettre à jour le statut et le client dans l'en-tête
        var statusBadge = document.querySelector('.ticket-header-left .badge');
        if (statusBadge) {
            var status = projet.status || 'active';
            var statusClass = status === 'paused' ? 'badge-warning' : (status === 'completed' ? 'badge-info' : 'badge-success');
            var statusText = status === 'paused' ? 'En pause' : (status === 'completed' ? 'Terminé' : 'Actif');
            statusBadge.className = 'badge ' + statusClass;
            statusBadge.textContent = statusText;
        }
        var clientSpan = document.querySelector('.ticket-header-left .ticket-meta span:last-child');
        if (clientSpan && clientSpan.textContent.indexOf('Client :') !== -1) {
            clientSpan.textContent = 'Client : ' + clientName;
        }
        
        // Mettre à jour les informations générales
        var description = document.querySelector('.ticket-description p:first-child');
        if (description) description.textContent = projet.description || '—';
        
        var dateCreation = document.querySelector('.ticket-description p:nth-child(2)');
        if (dateCreation) {
            var createdDate = projet._id ? new Date(parseInt(projet._id)).toLocaleDateString('fr-FR') : (projet.start_date || '—');
            dateCreation.innerHTML = '<strong>Date de création :</strong> ' + createdDate;
        }
        
        var dateFin = document.querySelector('.ticket-description p:nth-child(3)');
        if (dateFin) {
            dateFin.innerHTML = '<strong>Date de fin prévue :</strong> ' + (projet.end_date || '—');
        }
        
        var responsable = document.querySelector('.ticket-description p:nth-child(4)');
        if (responsable) {
            var managerName = '—';
            if (projet.manager) {
                if (projet.manager === '1') managerName = 'Jean Dupont';
                else if (projet.manager === '2') managerName = 'Marie Martin';
                else if (projet.manager === '3') managerName = 'Pierre Durand';
            }
            responsable.innerHTML = '<strong>Responsable projet :</strong> ' + managerName;
        }
        
        // Trouver le contrat associé
        var contract = contrats.find(function(c) {
            return String(c.project) === String(projet._id) || String(c.project) === projet.name;
        });
        
        // Calculer les heures consommées
        var consumedHours = 0;
        temps.forEach(function(t) {
            if (String(t.project) === String(projet._id) || String(t.project) === projet.name) {
                consumedHours += parseFloat(t.hours) || 0;
            }
        });
        
        var totalHours = contract ? (parseFloat(contract.hours) || 0) : 0;
        var remainingHours = Math.max(0, totalHours - consumedHours);
        var progressPercent = totalHours > 0 ? Math.round((consumedHours / totalHours) * 100) : 0;
        
        // Mettre à jour les informations du contrat
        var infoList = document.querySelector('.info-list');
        if (infoList) {
            var dt = infoList.querySelectorAll('dt');
            var dd = infoList.querySelectorAll('dd');
            dt.forEach(function(dtEl, idx) {
                if (dd[idx]) {
                    var label = dtEl.textContent.trim();
                    if (label === 'Heures incluses') {
                        dd[idx].textContent = (totalHours || 0) + 'h';
                    } else if (label === 'Heures consommées') {
                        dd[idx].textContent = (consumedHours || 0) + 'h';
                    } else if (label === 'Heures restantes') {
                        dd[idx].textContent = (remainingHours || 0) + 'h';
                    } else if (label === 'Taux horaire supplémentaire') {
                        dd[idx].textContent = (contract && contract.rate) ? (parseFloat(contract.rate) || 0) + ' €/h' : '—';
                    } else if (label === 'Période de validité') {
                        var period = '—';
                        if (contract && (contract.start || contract.end)) {
                            period = (contract.start || '—') + ' — ' + (contract.end || '—');
                        }
                        dd[idx].textContent = period;
                    }
                }
            });
        }
        
        // Mettre à jour la barre de progression
        var progressFill = document.querySelector('.project-progress .progress-fill');
        var progressText = document.querySelector('.project-progress .progress-text');
        if (progressFill) progressFill.style.width = (progressPercent || 0) + '%';
        if (progressText) progressText.textContent = (progressPercent || 0) + '% consommées';
        
        // Mettre à jour les collaborateurs assignés
        var assigneesList = document.querySelector('.assignees-list');
        if (assigneesList) {
            var existingAssignees = assigneesList.querySelectorAll('[data-systicket-injected="1"]');
            existingAssignees.forEach(function(a) { a.remove(); });
            
            var assignees = projet.assignees || projet['assignees[]'] || [];
            if (!Array.isArray(assignees) && assignees) {
                assignees = [assignees];
            }
            
            if (assignees.length > 0) {
                var emptyMsg = assigneesList.querySelector('.text-secondary.text-sm');
                if (emptyMsg) emptyMsg.remove();
                
                assignees.forEach(function(a) {
                    var assigneeName = '—';
                    if (a === '1' || a === 1) assigneeName = 'Jean Dupont';
                    else if (a === '2' || a === 2) assigneeName = 'Marie Martin';
                    else if (a === '3' || a === 3) assigneeName = 'Pierre Durand';
                    
                    var assigneeItem = document.createElement('div');
                    assigneeItem.className = 'assignee-item';
                    assigneeItem.setAttribute('data-systicket-injected', '1');
                    assigneeItem.textContent = assigneeName;
                    assigneesList.appendChild(assigneeItem);
                });
            } else {
                var emptyMsg = assigneesList.querySelector('.text-secondary.text-sm');
                if (!emptyMsg) {
                    var emptyP = document.createElement('p');
                    emptyP.className = 'text-secondary text-sm';
                    emptyP.textContent = 'Aucun collaborateur assigné.';
                    assigneesList.appendChild(emptyP);
                }
            }
        }
        
        // Filtrer les tickets du projet
        var projectTickets = tickets.filter(function(t) {
            return String(t.project) === String(projet._id) || String(t.project) === projet.name;
        }).sort(function(a, b) {
            return (b._id || 0) - (a._id || 0);
        });
        
        // Mettre à jour le tableau des tickets
        var ticketsTable = document.querySelector('.ticket-section .table tbody');
        if (ticketsTable) {
            var existingTicketRows = ticketsTable.querySelectorAll('[data-systicket-injected="1"]');
            existingTicketRows.forEach(function(r) { r.remove(); });
            var emptyTicketRow = ticketsTable.querySelector('.table-empty');
            
            if (projectTickets.length > 0) {
                if (emptyTicketRow) emptyTicketRow.remove();
                
                projectTickets.forEach(function(t) {
                    var tr = document.createElement('tr');
                    tr.setAttribute('data-systicket-injected', '1');
                    
                    var status = t.status || 'new';
                    var ticketIndex = tickets.indexOf(t);
                    if (validations && validations[ticketIndex]) {
                        var validationStatus = validations[ticketIndex];
                        if (validationStatus === 'validated') status = 'validated';
                        else if (validationStatus === 'refused') status = 'refused';
                        else if (validationStatus === 'to-validate' || validationStatus === 'waiting') status = 'to-validate';
                    }
                    var statusText = status === 'new' ? 'Nouveau' : (status === 'in-progress' ? 'En cours' : (status === 'done' ? 'Terminé' : (status === 'to-validate' ? 'À valider' : (status === 'validated' ? 'Validé' : (status === 'refused' ? 'Refusé' : 'Nouveau')))));
                    var statusClass = status === 'new' ? 'badge-status-new' : (status === 'in-progress' ? 'badge-status-in-progress' : (status === 'done' ? 'badge-status-done' : (status === 'to-validate' ? 'badge-status-to-validate' : (status === 'validated' ? 'badge-success' : (status === 'refused' ? 'badge-danger' : 'badge-status-new')))));
                    
                    var priority = t.priority || 'normal';
                    var priorityText = priority === 'low' ? 'Faible' : (priority === 'high' ? 'Élevée' : (priority === 'critical' ? 'Critique' : 'Normale'));
                    var priorityClass = priority === 'low' ? 'badge-priority-low' : (priority === 'high' ? 'badge-priority-high' : (priority === 'critical' ? 'badge-priority-critical' : 'badge-priority-normal'));
                    
                    var type = t.type || 'included';
                    var typeText = type === 'billable' ? 'Facturable' : 'Inclus';
                    var typeClass = type === 'billable' ? 'badge-warning' : 'badge-info';
                    
                    // Récupérer les assignés
                    var assigneesDisplay = '—';
                    var assigneesList = t.assignees || t['assignees[]'] || [];
                    if (!Array.isArray(assigneesList) && assigneesList) {
                        assigneesList = [assigneesList];
                    }
                    if (assigneesList.length > 0) {
                        var assigneeNames = assigneesList.map(function(a) {
                            if (a === '1' || a === 1) return 'Jean Dupont';
                            if (a === '2' || a === 2) return 'Marie Martin';
                            if (a === '3' || a === 3) return 'Pierre Durand';
                            return a;
                        }).filter(function(name) { return name && name.trim() !== ''; });
                        if (assigneeNames.length > 0) {
                            assigneesDisplay = assigneeNames.join(', ');
                        }
                    }
                    
                    // Calculer le temps
                    var realTime = 0;
                    temps.forEach(function(timeEntry) {
                        if (timeEntry.ticket && String(timeEntry.ticket) === String(t._id)) {
                            realTime += parseFloat(timeEntry.hours) || 0;
                        }
                    });
                    var timeDisplay = realTime > 0 ? realTime + 'h' : (t.estimated_hours != null ? (parseFloat(t.estimated_hours) || 0) + 'h (est.)' : '0h');
                    
                    tr.innerHTML = '<td>' + (t._id || '—') + '</td><td><a href="ticket-detail.html?id=' + t._id + '">' + (t.title || '—') + '</a></td><td><span class="badge ' + statusClass + '">' + statusText + '</span></td><td><span class="badge ' + priorityClass + '">' + priorityText + '</span></td><td><span class="badge ' + typeClass + '">' + typeText + '</span></td><td>' + assigneesDisplay + '</td><td>' + timeDisplay + '</td><td><a href="ticket-detail.html?id=' + t._id + '">Voir</a></td>';
                    ticketsTable.appendChild(tr);
                });
            } else {
                if (!emptyTicketRow) {
                    var emptyTr = document.createElement('tr');
                    emptyTr.innerHTML = '<td colspan="8" class="table-empty">Aucun ticket pour ce projet.</td>';
                    ticketsTable.appendChild(emptyTr);
                }
            }
        }
        
        // Mettre à jour le lien d'édition
        var editLink = document.querySelector('.btn-edit-project');
        if (editLink) editLink.setAttribute('href', 'projet-form.html?id=' + encodeURIComponent(projectId));
        
        // Liens Créer un ticket (pré-remplit le projet)
        document.querySelectorAll('.btn-create-ticket').forEach(function(link) {
            link.setAttribute('href', 'ticket-form.html?project=' + encodeURIComponent(projectId));
        });
    }

    /* Remplit la page des rapports avec les statistiques */
    function updateReports() {
        var page = document.body.getAttribute('data-page');
        if (page !== 'rapports') return;
        
        var tickets = AppData.get('tickets') || [];
        var projets = AppData.get('projets') || [];
        var clients = AppData.get('clients') || [];
        var temps = AppData.get('temps') || [];
        var contrats = AppData.get('contrats') || [];
        var validations = AppData.get('validations') || [];
        
        // Récupérer les filtres de période
        var periodFilter = AppData.getSession('rapports_filters') || {};
        var dateFrom = periodFilter.from ? new Date(periodFilter.from) : new Date(new Date().getFullYear(), new Date().getMonth(), 1);
        var dateTo = periodFilter.to ? new Date(periodFilter.to) : new Date();
        
        // Filtrer les données par période
        var filteredTickets = tickets.filter(function(t) {
            if (!t._id) return false;
            var ticketDate = new Date(parseInt(t._id));
            return ticketDate >= dateFrom && ticketDate <= dateTo;
        });
        
        var filteredTemps = temps.filter(function(t) {
            if (!t.date) return false;
            var timeDate = new Date(t.date);
            return timeDate >= dateFrom && timeDate <= dateTo;
        });
        
        // Calculer les statistiques
        var ticketsTraites = filteredTickets.filter(function(t) {
            var status = t.status || 'new';
            return status === 'done' || status === 'validated';
        }).length;
        
        var totalHours = 0;
        filteredTemps.forEach(function(t) {
            totalHours += parseFloat(t.hours) || 0;
        });
        
        var ticketsValides = 0;
        validations.forEach(function(v) {
            if (v === 'validated') ticketsValides++;
        });
        var tauxValidation = filteredTickets.length > 0 ? Math.round((ticketsValides / filteredTickets.length) * 100) : 0;
        
        // Calculer le chiffre d'affaires (heures facturables * taux)
        var ca = 0;
        filteredTemps.forEach(function(t) {
            var ticket = tickets.find(function(tk) { return String(tk._id) === String(t.ticket); });
            if (ticket && ticket.type === 'billable') {
                var contract = contrats.find(function(c) {
                    return String(c.project) === String(ticket.project);
                });
                var rate = contract ? (parseFloat(contract.rate) || 0) : 0;
                ca += (parseFloat(t.hours) || 0) * rate;
            }
        });
        
        var projetsActifs = projets.filter(function(p) {
            return filteredTemps.some(function(t) {
                return String(t.project) === String(p._id) || String(t.project) === p.name;
            });
        }).length;
        
        // Mettre à jour le résumé exécutif
        var executiveText = document.querySelector('.reports-executive-text');
        if (executiveText) {
            executiveText.innerHTML = 'Sur la période sélectionnée : <strong>' + ticketsTraites + '</strong> tickets traités, <strong>' + totalHours + 'h</strong> heures enregistrées, taux de validation s\'élève à <strong>' + tauxValidation + '%</strong>, chiffre d\'affaires généré est de <strong>' + ca.toFixed(2) + ' €</strong>.';
        }
        
        // Mettre à jour les cartes de statistiques
        var ticketsTraitesCard = document.querySelector('.stat-card-blue .stat-value');
        if (ticketsTraitesCard) ticketsTraitesCard.textContent = ticketsTraites;
        
        var heuresCard = document.querySelector('.stat-card-orange .stat-value');
        if (heuresCard) heuresCard.textContent = (totalHours || 0) + 'h';
        
        var tauxCard = document.querySelector('.stat-card-green .stat-value');
        if (tauxCard) tauxCard.textContent = String(tauxValidation || 0) + ' %';
        
        var caCard = document.querySelector('.stat-card-purple .stat-value');
        if (caCard) caCard.textContent = (ca || 0).toFixed(2) + ' €';
        
        var projetsActifsCard = document.querySelector('.stat-card-muted .stat-value');
        if (projetsActifsCard) projetsActifsCard.textContent = String(projetsActifs || 0);
        
        // Calculer les heures par projet
        var hoursByProject = {};
        filteredTemps.forEach(function(t) {
            var projectId = t.project || '';
            if (projectId) {
                if (!hoursByProject[projectId]) {
                    hoursByProject[projectId] = 0;
                }
                hoursByProject[projectId] += parseFloat(t.hours) || 0;
            }
        });
        
        var projectHoursArray = Object.keys(hoursByProject).map(function(projectId) {
            var projet = projets.find(function(p) {
                return String(p._id) === String(projectId) || String(p.name) === String(projectId);
            });
            var projetName = '—';
            if (projet) {
                projetName = projet.name || '—';
            } else if (projectId && projectId !== '—' && projectId !== '') {
                // Si le projet n'est pas trouvé, essayer de trouver par index si c'est un nombre
                if (/^\d+$/.test(String(projectId))) {
                    var index = parseInt(projectId, 10) - 1;
                    if (index >= 0 && index < projets.length) {
                        projet = projets[index];
                        projetName = projet ? (projet.name || '—') : projectId;
                    } else {
                        projetName = projectId;
                    }
                } else {
                    projetName = projectId;
                }
            }
            return {
                id: projectId,
                name: projetName,
                hours: hoursByProject[projectId]
            };
        }).sort(function(a, b) { return b.hours - a.hours; });
        
        var totalProjectHours = projectHoursArray.reduce(function(sum, p) { return sum + p.hours; }, 0);
        
        // Mettre à jour le graphique heures par projet
        var chartContainer = document.querySelector('#report-hours-project .chart-container');
        if (chartContainer) {
            var existingItems = chartContainer.querySelectorAll('[data-systicket-injected="1"]');
            existingItems.forEach(function(item) { item.remove(); });
            
            var validProjects = projectHoursArray.filter(function(p) {
                return p.name && p.name !== '—' && p.name !== '' && p.hours > 0;
            });
            
            if (validProjects.length > 0) {
                validProjects.slice(0, 5).forEach(function(p) {
                    var percent = totalProjectHours > 0 ? (p.hours / totalProjectHours) * 100 : 0;
                    var chartItem = document.createElement('div');
                    chartItem.className = 'chart-item';
                    chartItem.setAttribute('data-systicket-injected', '1');
                    chartItem.innerHTML = '<div class="chart-item-header"><span>' + p.name + '</span><strong>' + p.hours + 'h</strong></div><div class="chart-bar-container"><div class="progress-bar"><div class="progress-fill progress-fill-primary" style="width: ' + percent + '%;"></div></div></div>';
                    chartContainer.appendChild(chartItem);
                });
            }
        }
        
        var totalHoursLegend = document.querySelector('#report-hours-project .reports-chart-legend');
        if (totalHoursLegend) totalHoursLegend.textContent = 'Total : ' + totalProjectHours + 'h';
        
        // Calculer les tickets par statut
        var ticketsByStatus = {
            'new': 0,
            'in-progress': 0,
            'done': 0,
            'to-validate': 0,
            'validated': 0
        };
        filteredTickets.forEach(function(t) {
            var status = t.status || 'new';
            if (ticketsByStatus.hasOwnProperty(status)) {
                ticketsByStatus[status]++;
            }
        });
        validations.forEach(function(v) {
            if (v === 'validated') ticketsByStatus['validated']++;
            else if (v === 'to-validate' || v === 'waiting') ticketsByStatus['to-validate']++;
        });
        
        var totalTickets = filteredTickets.length;
        var totalStatusTickets = ticketsByStatus['new'] + ticketsByStatus['in-progress'] + ticketsByStatus['done'] + ticketsByStatus['validated'];
        
        // Mettre à jour le graphique tickets par statut
        var statusChart = document.querySelector('#report-tickets-status .chart-container');
        if (statusChart) {
            var statusRows = statusChart.querySelectorAll('.chart-row');
            if (statusRows.length >= 4) {
                var newPercent = totalStatusTickets > 0 ? (ticketsByStatus['new'] / totalStatusTickets) * 100 : 0;
                var inProgressPercent = totalStatusTickets > 0 ? (ticketsByStatus['in-progress'] / totalStatusTickets) * 100 : 0;
                var donePercent = totalStatusTickets > 0 ? ((ticketsByStatus['done'] + ticketsByStatus['validated']) / totalStatusTickets) * 100 : 0;
                var toValidatePercent = totalStatusTickets > 0 ? (ticketsByStatus['to-validate'] / totalStatusTickets) * 100 : 0;
                
                if (statusRows[0]) {
                    statusRows[0].querySelector('.progress-fill').style.width = newPercent + '%';
                    statusRows[0].querySelector('strong').textContent = ticketsByStatus['new'];
                }
                if (statusRows[1]) {
                    statusRows[1].querySelector('.progress-fill').style.width = inProgressPercent + '%';
                    statusRows[1].querySelector('strong').textContent = ticketsByStatus['in-progress'];
                }
                if (statusRows[2]) {
                    statusRows[2].querySelector('.progress-fill').style.width = donePercent + '%';
                    statusRows[2].querySelector('strong').textContent = ticketsByStatus['done'] + ticketsByStatus['validated'];
                }
                if (statusRows[3]) {
                    statusRows[3].querySelector('.progress-fill').style.width = toValidatePercent + '%';
                    statusRows[3].querySelector('strong').textContent = ticketsByStatus['to-validate'];
                }
            }
        }
        
        // Calculer les heures par collaborateur
        var hoursByUser = {};
        filteredTemps.forEach(function(t) {
            var userId = t.user || t.assignee;
            if (!userId || userId === '—' || userId === '') {
                userId = '—';
            }
            if (!hoursByUser[userId]) {
                hoursByUser[userId] = 0;
            }
            hoursByUser[userId] += parseFloat(t.hours) || 0;
        });
        
        var userHoursArray = Object.keys(hoursByUser).map(function(userId) {
            var userName = '—';
            if (userId && userId !== '—' && userId !== '') {
                if (userId === '1' || userId === 1) userName = 'Jean Dupont';
                else if (userId === '2' || userId === 2) userName = 'Marie Martin';
                else if (userId === '3' || userId === 3) userName = 'Pierre Durand';
                else if (typeof userId === 'string' && userId.trim() !== '') {
                    userName = userId;
                }
            }
            return {
                id: userId,
                name: userName,
                hours: hoursByUser[userId]
            };
        }).filter(function(u) { return u.hours > 0; }).sort(function(a, b) { return b.hours - a.hours; });
        
        var totalUserHours = userHoursArray.reduce(function(sum, u) { return sum + u.hours; }, 0);
        
        // Mettre à jour le graphique heures par collaborateur
        var userChart = document.querySelector('#report-hours-user .dashboard-chart-bars');
        if (userChart) {
            var existingUserRows = userChart.querySelectorAll('[data-systicket-injected="1"]');
            existingUserRows.forEach(function(row) { row.remove(); });
            
            var validUsers = userHoursArray.filter(function(u) {
                return u.name && u.name !== '—' && u.name !== '' && u.hours > 0;
            });
            
            if (validUsers.length > 0) {
                validUsers.slice(0, 5).forEach(function(u) {
                    var percent = totalUserHours > 0 ? (u.hours / totalUserHours) * 100 : 0;
                    var chartRow = document.createElement('div');
                    chartRow.className = 'dashboard-chart-row';
                    chartRow.setAttribute('data-systicket-injected', '1');
                    chartRow.innerHTML = '<span class="dashboard-chart-label">' + u.name + '</span><div class="dashboard-chart-bar-wrap"><div class="dashboard-chart-bar dashboard-chart-bar-gray" style="width: ' + percent + '%;"></div></div><span class="dashboard-chart-value">' + u.hours + 'h</span>';
                    userChart.appendChild(chartRow);
                });
            }
        }
        
        var totalUserHoursLegend = document.querySelector('#report-hours-user .reports-chart-legend');
        if (totalUserHoursLegend) totalUserHoursLegend.textContent = 'Total : ' + totalUserHours + 'h';
        
        // Calculer la facturation par client
        var billingByClient = {};
        filteredTemps.forEach(function(t) {
            var ticket = tickets.find(function(tk) { return String(tk._id) === String(t.ticket); });
            if (ticket && ticket.type === 'billable' && ticket.project) {
                var projet = projets.find(function(p) {
                    return String(p._id) === String(ticket.project) || String(p.name) === String(ticket.project);
                });
                if (projet && projet.client) {
                    var clientId = projet.client;
                    var client = clients.find(function(c) {
                        return String(c._id) === String(clientId) || String(c.name) === String(clientId);
                    });
                    var clientName = client ? client.name : (clientId === '1' ? 'Acme Corp' : (clientId === '2' ? 'Tech Solutions' : (clientId === '3' ? 'Design Studio' : '—')));
                    
                    var contract = contrats.find(function(c) {
                        return String(c.project) === String(ticket.project);
                    });
                    var rate = contract ? (parseFloat(contract.rate) || 0) : 0;
                    var amount = (parseFloat(t.hours) || 0) * rate;
                    
                    var key = clientName + '|' + (projet.name || '—');
                    if (!billingByClient[key]) {
                        billingByClient[key] = {
                            client: clientName,
                            project: projet.name || '—',
                            hours: 0,
                            rate: rate,
                            amount: 0
                        };
                    }
                    billingByClient[key].hours += parseFloat(t.hours) || 0;
                    billingByClient[key].amount += amount;
                }
            }
        });
        
        var billingArray = Object.keys(billingByClient).map(function(key) {
            return billingByClient[key];
        });
        
        // Mettre à jour le tableau de facturation
        var billingTable = document.querySelector('#report-billing-title').closest('section').querySelector('.table tbody');
        if (billingTable) {
            var existingBillingRows = billingTable.querySelectorAll('[data-systicket-injected="1"]');
            existingBillingRows.forEach(function(row) { row.remove(); });
            var emptyRow = billingTable.querySelector('.table-empty');
            
            if (billingArray.length > 0) {
                if (emptyRow) emptyRow.remove();
                
                billingArray.forEach(function(b) {
                    var tr = document.createElement('tr');
                    tr.setAttribute('data-systicket-injected', '1');
                    tr.innerHTML = '<td>' + (b.client || '—') + '</td><td>' + (b.project || '—') + '</td><td>' + (b.hours || 0) + 'h</td><td>' + (b.rate || 0) + ' €/h</td><td>' + (b.amount || 0).toFixed(2) + ' €</td>';
                    billingTable.appendChild(tr);
                });
            } else {
                if (!emptyRow) {
                    var emptyTr = document.createElement('tr');
                    emptyTr.innerHTML = '<td colspan="5" class="table-empty">Aucune donnée de facturation pour la période.</td>';
                    billingTable.appendChild(emptyTr);
                }
            }
        }
        
        // Calculer le total de facturation
        var totalBillingHours = billingArray.reduce(function(sum, b) { return sum + b.hours; }, 0);
        var totalBillingAmount = billingArray.reduce(function(sum, b) { return sum + b.amount; }, 0);
        
        var billingFooter = document.querySelector('#report-billing-title').closest('section').querySelector('.table-footer');
        if (billingFooter) {
            var footerCells = billingFooter.querySelectorAll('td');
            if (footerCells.length >= 5) {
                footerCells[2].querySelector('strong').textContent = (totalBillingHours || 0) + 'h';
                footerCells[4].querySelector('strong').textContent = (totalBillingAmount || 0).toFixed(2) + ' €';
            }
        }
        
        // Mettre à jour le détail des heures
        var detailTable = document.querySelector('#report-detail-title').closest('section').querySelector('.table tbody');
        if (detailTable) {
            var existingDetailRows = detailTable.querySelectorAll('[data-systicket-injected="1"]');
            existingDetailRows.forEach(function(row) { row.remove(); });
            var emptyDetailRow = detailTable.querySelector('.table-empty');
            
            var sortedTemps = filteredTemps.slice().sort(function(a, b) {
                var dateA = a.date ? new Date(a.date) : new Date(0);
                var dateB = b.date ? new Date(b.date) : new Date(0);
                return dateB - dateA;
            }).slice(0, 4);
            
            if (sortedTemps.length > 0) {
                if (emptyDetailRow) emptyDetailRow.remove();
                
                sortedTemps.forEach(function(t) {
                    var tr = document.createElement('tr');
                    tr.setAttribute('data-systicket-injected', '1');
                    
                    // Trouver le projet
                    var projet = null;
                    var projetName = '—';
                    if (t.project) {
                        projet = projets.find(function(p) {
                            return String(p._id) === String(t.project) || String(p.name) === String(t.project);
                        });
                        if (projet) {
                            projetName = projet.name || '—';
                        } else if (/^\d+$/.test(String(t.project))) {
                            // Essayer par index si c'est un nombre
                            var index = parseInt(t.project, 10) - 1;
                            if (index >= 0 && index < projets.length) {
                                projet = projets[index];
                                projetName = projet ? (projet.name || '—') : '—';
                            }
                        }
                    }
                    
                    // Trouver le ticket
                    var ticket = null;
                    var ticketTitle = '—';
                    if (t.ticket) {
                        ticket = tickets.find(function(tk) {
                            return String(tk._id) === String(t.ticket);
                        });
                        if (ticket) {
                            ticketTitle = ticket.title || '—';
                        }
                    }
                    
                    // Trouver le collaborateur
                    var userName = '—';
                    var userId = t.user || t.assignee;
                    if (userId) {
                        if (userId === '1' || userId === 1) userName = 'Jean Dupont';
                        else if (userId === '2' || userId === 2) userName = 'Marie Martin';
                        else if (userId === '3' || userId === 3) userName = 'Pierre Durand';
                        else if (typeof userId === 'string' && userId.trim() !== '') {
                            userName = userId;
                        }
                    }
                    
                    var dateStr = t.date ? new Date(t.date).toLocaleDateString('fr-FR') : '—';
                    
                    tr.innerHTML = '<td>' + (dateStr || '—') + '</td><td>' + projetName + '</td><td>' + ticketTitle + '</td><td>' + userName + '</td><td>' + (parseFloat(t.hours) || 0) + 'h</td><td>' + (t.description || '—') + '</td>';
                    detailTable.appendChild(tr);
                });
            } else {
                if (!emptyDetailRow) {
                    var emptyTr = document.createElement('tr');
                    emptyTr.innerHTML = '<td colspan="6" class="table-empty">Aucune entrée de temps pour la période.</td>';
                    detailTable.appendChild(emptyTr);
                }
            }
        }
        
        // Mettre à jour la date de génération du rapport
        var reportMeta = document.querySelector('.reports-meta-text time');
        if (reportMeta) {
            reportMeta.textContent = new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' });
            reportMeta.setAttribute('datetime', new Date().toISOString());
        }
    }

    /* Remplit la page de détail d'un contrat avec ses informations */
    function updateContractDetail() {
        var page = document.body.getAttribute('data-page');
        if (page !== 'contrats') return;
        
        // Vérifier si on est sur la page de détails (présence de .ticket-header)
        var isDetailPage = document.querySelector('.ticket-header') !== null;
        if (!isDetailPage) return;
        
        // Récupérer l'ID du contrat depuis l'URL
        var urlParams = new URLSearchParams(window.location.search);
        var contractId = urlParams.get('id');
        if (!contractId) {
            // Essayer de récupérer depuis le lien d'édition
            var editLink = document.querySelector('.btn-edit-contract');
            if (editLink && editLink.href) {
                var match = editLink.href.match(/[?&]id=([^&]+)/);
                if (match) contractId = match[1];
            }
        }
        
        var contrats = AppData.get('contrats') || [];
        var projets = AppData.get('projets') || [];
        var clients = AppData.get('clients') || [];
        var tickets = AppData.get('tickets') || [];
        var temps = AppData.get('temps') || [];
        var validations = AppData.get('validations') || [];
        
        // Trouver le contrat
        var contract = null;
        if (contractId) {
            // Essayer de trouver par ID exact
            contract = contrats.find(function(c) {
                return String(c._id) === String(contractId);
            });
            
            // Si l'ID est un nombre simple (1, 2, 3...) et qu'aucun contrat n'est trouvé,
            // essayer de trouver par index (pour compatibilité avec les anciens liens)
            if (!contract && /^\d+$/.test(String(contractId))) {
                var index = parseInt(contractId, 10) - 1;
                if (index >= 0 && index < contrats.length) {
                    contract = contrats[index];
                    console.log('Contrat trouvé par index:', index, contract);
                }
            }
        }
        
        // Si toujours pas trouvé, prendre le premier contrat disponible
        if (!contract && contrats.length > 0) {
            contract = contrats[0];
            console.log('Aucun contrat trouvé avec l\'ID, utilisation du premier contrat:', contract);
        }
        
        if (!contract) {
            console.log('Aucun contrat disponible');
            return;
        }
        
        // Mettre à jour l'ID du contrat pour les liens
        contractId = contract._id;
        console.log('Contrat trouvé:', contract);
        
        // Trouver le projet associé
        var projet = null;
        if (contract.project) {
            projet = projets.find(function(p) {
                return String(p._id) === String(contract.project) || String(p.name) === String(contract.project);
            });
        }
        
        // Récupérer le nom du client
        var clientName = '—';
        var projetName = '—';
        if (projet) {
            projetName = projet.name || '—';
            if (projet.client) {
                var client = clients.find(function(c) {
                    return String(c._id) === String(projet.client) || String(c.name) === String(projet.client);
                });
                if (client) {
                    clientName = client.name || '—';
                } else {
                    if (projet.client === '1') clientName = 'Acme Corp';
                    else if (projet.client === '2') clientName = 'Tech Solutions';
                    else if (projet.client === '3') clientName = 'Design Studio';
                }
            }
        } else if (contract.client) {
            // Si le contrat a directement un client (fallback)
            var directClient = clients.find(function(c) {
                return String(c._id) === String(contract.client) || String(c.name) === String(contract.client);
            });
            if (directClient) {
                clientName = directClient.name || '—';
            } else {
                if (contract.client === '1') clientName = 'Acme Corp';
                else if (contract.client === '2') clientName = 'Tech Solutions';
                else if (contract.client === '3') clientName = 'Design Studio';
            }
        }
        
        // Calculer les heures consommées
        var consumedHours = 0;
        if (contract.project) {
            temps.forEach(function(t) {
                if (String(t.project) === String(contract.project)) {
                    consumedHours += parseFloat(t.hours) || 0;
                }
            });
        }
        
        var totalHours = parseFloat(contract.hours) || 0;
        var remainingHours = Math.max(0, totalHours - consumedHours);
        var progressPercent = totalHours > 0 ? Math.round((consumedHours / totalHours) * 100) : 0;
        
        console.log('Données du contrat:', {
            contractId: contractId,
            contract: contract,
            totalHours: totalHours,
            consumedHours: consumedHours,
            remainingHours: remainingHours,
            progressPercent: progressPercent
        });
        
        // Mettre à jour le titre et le breadcrumb
        var title = document.querySelector('.ticket-header-left h1');
        if (title) title.textContent = 'Contrat ' + projetName + ' — ' + clientName;
        var breadcrumb = document.querySelector('.breadcrumb span:last-child');
        if (breadcrumb) breadcrumb.textContent = projetName || '—';
        
        // Mettre à jour les métadonnées dans l'en-tête
        var metaContainer = document.querySelector('.ticket-header-left .ticket-meta');
        if (metaContainer) {
            var metaSpans = metaContainer.querySelectorAll('span');
            metaSpans.forEach(function(span) {
                var text = span.textContent.trim();
                if (text.indexOf('Client :') !== -1) {
                    span.textContent = 'Client : ' + clientName;
                } else if (text.indexOf('Projet :') !== -1) {
                    span.textContent = 'Projet : ' + projetName;
                } else if (span.classList.contains('badge')) {
                    // Mettre à jour le statut
                    var status = remainingHours > 0 ? 'En cours' : 'Terminé';
                    var statusClass = remainingHours > 0 ? 'badge-success' : 'badge-info';
                    span.className = 'badge ' + statusClass;
                    span.textContent = status;
                }
            });
        }
        
        // Mettre à jour les informations du contrat (cibler spécifiquement la section "Détail du contrat")
        var detailSection = Array.from(document.querySelectorAll('.ticket-section')).find(function(section) {
            var h2 = section.querySelector('h2');
            return h2 && h2.textContent.indexOf('Détail du contrat') !== -1;
        });
        var infoList = detailSection ? detailSection.querySelector('.info-list') : null;
        if (infoList) {
            var dt = infoList.querySelectorAll('dt');
            var dd = infoList.querySelectorAll('dd');
            dt.forEach(function(dtEl, idx) {
                if (dd[idx]) {
                    var label = dtEl.textContent.trim();
                    if (label === 'Heures incluses') {
                        dd[idx].textContent = (totalHours || 0) + 'h';
                    } else if (label === 'Heures consommées') {
                        dd[idx].textContent = (consumedHours || 0) + 'h';
                    } else if (label === 'Heures restantes') {
                        dd[idx].textContent = (remainingHours || 0) + 'h';
                    } else if (label === 'Taux horaire') {
                        dd[idx].textContent = (parseFloat(contract.rate) || 0) + ' €/h';
                    } else if (label === 'Période de validité') {
                        var period = '—';
                        if (contract.start && contract.end) {
                            period = contract.start + ' — ' + contract.end;
                        } else if (contract.start) {
                            period = contract.start + ' — —';
                        } else if (contract.end) {
                            period = '— — ' + contract.end;
                        }
                        dd[idx].textContent = period;
                    }
                }
            });
        } else {
            console.log('Section "Détail du contrat" non trouvée. Sections trouvées:', 
                Array.from(document.querySelectorAll('.ticket-section')).map(function(s) {
                    var h2 = s.querySelector('h2');
                    return h2 ? h2.textContent : 'sans titre';
                })
            );
        }
        
        // Mettre à jour la barre de progression (dans la section "Détail du contrat")
        var progressFill = detailSection ? detailSection.querySelector('.progress-fill') : null;
        var progressText = detailSection ? detailSection.querySelector('.progress-text') : null;
        if (progressFill) progressFill.style.width = (progressPercent || 0) + '%';
        if (progressText) progressText.textContent = (progressPercent || 0) + '% consommées';
        
        // Filtrer les tickets liés au contrat (via le projet)
        var contractTickets = tickets.filter(function(t) {
            return String(t.project) === String(contract.project);
        }).sort(function(a, b) {
            return (b._id || 0) - (a._id || 0);
        });
        
        // Mettre à jour le tableau des tickets liés (cibler spécifiquement la section "Tickets liés au contrat")
        var ticketsSection = Array.from(document.querySelectorAll('.ticket-section')).find(function(section) {
            var h2 = section.querySelector('h2');
            return h2 && h2.textContent.indexOf('Tickets liés') !== -1;
        });
        var ticketsTable = ticketsSection ? ticketsSection.querySelector('.table tbody') : null;
        if (ticketsTable) {
            var existingTicketRows = ticketsTable.querySelectorAll('[data-systicket-injected="1"]');
            existingTicketRows.forEach(function(r) { r.remove(); });
            var emptyTicketRow = ticketsTable.querySelector('.table-empty');
            
            if (contractTickets.length > 0) {
                if (emptyTicketRow) emptyTicketRow.remove();
                
                contractTickets.forEach(function(t) {
                    var tr = document.createElement('tr');
                    tr.setAttribute('data-systicket-injected', '1');
                    
                    var status = t.status || 'new';
                    var ticketIndex = tickets.indexOf(t);
                    if (validations && validations[ticketIndex]) {
                        var validationStatus = validations[ticketIndex];
                        if (validationStatus === 'validated') status = 'validated';
                        else if (validationStatus === 'refused') status = 'refused';
                        else if (validationStatus === 'to-validate' || validationStatus === 'waiting') status = 'to-validate';
                    }
                    var statusText = status === 'new' ? 'Nouveau' : (status === 'in-progress' ? 'En cours' : (status === 'done' ? 'Terminé' : (status === 'to-validate' ? 'À valider' : (status === 'validated' ? 'Validé' : (status === 'refused' ? 'Refusé' : 'Nouveau')))));
                    var statusClass = status === 'new' ? 'badge-status-new' : (status === 'in-progress' ? 'badge-status-in-progress' : (status === 'done' ? 'badge-status-done' : (status === 'to-validate' ? 'badge-status-to-validate' : (status === 'validated' ? 'badge-success' : (status === 'refused' ? 'badge-danger' : 'badge-status-new')))));
                    
                    // Calculer les heures du ticket
                    var ticketHours = 0;
                    temps.forEach(function(timeEntry) {
                        if (timeEntry.ticket && String(timeEntry.ticket) === String(t._id)) {
                            ticketHours += parseFloat(timeEntry.hours) || 0;
                        }
                    });
                    var hoursDisplay = ticketHours > 0 ? ticketHours + 'h' : (t.estimated_hours != null ? (parseFloat(t.estimated_hours) || 0) + 'h (est.)' : '0h');
                    
                    tr.innerHTML = '<td>' + (t._id || '—') + '</td><td><a href="ticket-detail.html?id=' + t._id + '">' + (t.title || '—') + '</a></td><td><span class="badge ' + statusClass + '">' + statusText + '</span></td><td>' + hoursDisplay + '</td><td><a href="ticket-detail.html?id=' + t._id + '">Voir</a></td>';
                    ticketsTable.appendChild(tr);
                });
            } else {
                if (!emptyTicketRow) {
                    var emptyTr = document.createElement('tr');
                    emptyTr.innerHTML = '<td colspan="5" class="table-empty">Aucun ticket lié.</td>';
                    ticketsTable.appendChild(emptyTr);
                }
            }
        }
        
        // Mettre à jour la sidebar (résumé)
        var sidebarList = document.querySelector('.ticket-sidebar .info-list');
        if (sidebarList) {
            var sidebarDt = sidebarList.querySelectorAll('dt');
            var sidebarDd = sidebarList.querySelectorAll('dd');
            sidebarDt.forEach(function(dtEl, idx) {
                if (sidebarDd[idx]) {
                    var label = dtEl.textContent.trim();
                    if (label === 'Projet') {
                        sidebarDd[idx].textContent = projetName;
                    } else if (label === 'Client') {
                        sidebarDd[idx].textContent = clientName;
                    } else if (label === 'Début') {
                        sidebarDd[idx].textContent = contract.start || '—';
                    } else if (label === 'Fin') {
                        sidebarDd[idx].textContent = contract.end || '—';
                    }
                }
            });
        }
        
        // Mettre à jour le lien d'édition
        var editLink = document.querySelector('.btn-edit-contract');
        if (editLink) {
            editLink.setAttribute('href', 'contrat-form.html?id=' + encodeURIComponent(contractId));
        }
    }

    /* Met à jour la page de détail d'un ticket avec toutes les informations */
    function updateTicketDetail() {
        var page = document.body.getAttribute('data-page');
        if (page !== 'tickets') return;
        
        var isDetailPage = document.querySelector('.ticket-header') !== null;
        if (!isDetailPage) return;
        
        var urlParams = new URLSearchParams(window.location.search);
        var ticketId = urlParams.get('id');
        if (!ticketId) {
            var editLink = document.querySelector('.btn-edit-ticket');
            if (editLink && editLink.href) {
                var match = editLink.href.match(/[?&]id=([^&]+)/);
                if (match) ticketId = match[1];
            }
        }
        
        if (!ticketId) return;
        
        var tickets = AppData.get('tickets') || [];
        var projets = AppData.get('projets') || [];
        var clients = AppData.get('clients') || [];
        var temps = AppData.get('temps') || [];
        var validations = AppData.get('validations') || [];
        
        var ticket = tickets.find(function(t) { return String(t._id) === String(ticketId); });
        if (!ticket) return;
        
        /* Liens Éditer, Ajouter du temps, Dupliquer */
        var editLink = document.querySelector('.btn-edit-ticket');
        if (editLink) editLink.setAttribute('href', 'ticket-form.html?id=' + encodeURIComponent(ticketId));
        var addTimeLink = document.querySelector('.ticket-header-right a[href*="temps.html"]');
        if (addTimeLink) addTimeLink.setAttribute('href', 'temps.html?ticket=' + encodeURIComponent(ticketId));
        var duplicateLink = document.querySelector('a[href*="duplicate="]');
        if (duplicateLink) duplicateLink.setAttribute('href', 'ticket-form.html?duplicate=' + encodeURIComponent(ticketId));
        
        /* Titre et breadcrumb */
        var title = document.querySelector('.ticket-header-left h1');
        if (title) title.textContent = ticket.title || '—';
        var breadcrumb = document.querySelector('.breadcrumb span:last-child');
        if (breadcrumb) breadcrumb.textContent = ticket.title || 'Ticket #' + ticketId;
        
        /* Mise à jour du titre de la page */
        var pageTitle = document.querySelector('title');
        if (pageTitle) pageTitle.textContent = (ticket.title || 'Ticket') + ' #' + ticketId + ' - Systicket';
        
        /* ID du ticket */
        var ticketIdEl = document.querySelector('.ticket-id');
        if (ticketIdEl) ticketIdEl.textContent = '#' + ticketId;
        
        /* Badges statut, priorité, type */
        var status = ticket.status || 'new';
        var ticketIndex = tickets.indexOf(ticket);
        if (validations && validations[ticketIndex]) {
            var v = validations[ticketIndex];
            if (v === 'validated') status = 'validated';
            else if (v === 'refused') status = 'refused';
            else if (v === 'to-validate' || v === 'waiting') status = 'to-validate';
        }
        var statusClass = status === 'new' ? 'badge-status-new' : (status === 'in-progress' ? 'badge-status-in-progress' : (status === 'done' ? 'badge-status-done' : (status === 'to-validate' ? 'badge-status-to-validate' : (status === 'validated' ? 'badge-success' : (status === 'refused' ? 'badge-danger' : 'badge-status-new')))));
        var statusText = status === 'new' ? 'Nouveau' : (status === 'in-progress' ? 'En cours' : (status === 'done' ? 'Terminé' : (status === 'to-validate' ? 'À valider' : (status === 'validated' ? 'Validé' : (status === 'refused' ? 'Refusé' : 'Nouveau')))));
        
        var priority = ticket.priority || 'normal';
        var priorityClass = priority === 'low' ? 'badge-priority-low' : (priority === 'high' ? 'badge-priority-high' : (priority === 'critical' ? 'badge-priority-critical' : 'badge-priority-normal'));
        var priorityText = priority === 'low' ? 'Faible' : (priority === 'high' ? 'Élevée' : (priority === 'critical' ? 'Critique' : 'Normale'));
        
        var type = ticket.type || 'included';
        var typeClass = type === 'billable' ? 'badge-warning' : 'badge-success';
        var typeText = type === 'billable' ? 'Facturable' : 'Inclus';
        
        var metaContainer = document.querySelector('.ticket-header-left .ticket-meta');
        if (metaContainer) {
            metaContainer.innerHTML = '<span class="ticket-id">#' + ticketId + '</span><span class="badge ' + statusClass + '">' + statusText + '</span><span class="badge ' + priorityClass + '">' + priorityText + '</span><span class="badge ' + typeClass + '">' + typeText + '</span>';
        }
        
        /* Description */
        var descEl = document.querySelector('.ticket-description p');
        if (descEl) descEl.textContent = ticket.description || (ticket.title ? ticket.title : '—');
        
        /* Projet et Client pour la sidebar */
        var projetName = '—';
        var clientName = '—';
        var projet = null;
        if (ticket.project) {
            projet = projets.find(function(p) { return String(p._id) === String(ticket.project) || String(p.name) === String(ticket.project); });
            if (projet) {
                projetName = projet.name || '—';
                var clientId = projet.client;
                var client = clients.find(function(c) { return String(c._id) === String(clientId) || String(c.name) === String(clientId); });
                if (client) clientName = client.name || '—';
            }
        }
        if (!clientName && projet && ticket.project) {
            var contrats = AppData.get('contrats') || [];
            var contrat = contrats.find(function(c) { return String(c.project) === String(ticket.project) || String(c.project) === String(projet._id); });
            if (contrat && contrat.client) {
                var clientFromContrat = clients.find(function(c) { return String(c._id) === String(contrat.client) || String(c.name) === String(contrat.client); });
                if (clientFromContrat) clientName = clientFromContrat.name || '—';
            }
        }
        
        /* Temps passé - entrées de temps */
        var ticketTimeEntries = temps.filter(function(t) { return String(t.ticket) === String(ticketId); });
        var totalTicketHours = 0;
        ticketTimeEntries.forEach(function(te) { totalTicketHours += parseFloat(te.hours) || 0; });
        
        var timeTotalEl = document.querySelector('.time-total');
        if (timeTotalEl) timeTotalEl.textContent = 'Total : ' + (totalTicketHours > 0 ? totalTicketHours + 'h' : '0h');
        
        var timeEntriesContainer = document.querySelector('.time-entries');
        if (timeEntriesContainer) {
            var existingP = timeEntriesContainer.querySelector('p.text-secondary');
            var existingEntries = timeEntriesContainer.querySelectorAll('.time-entry');
            existingEntries.forEach(function(e) { e.remove(); });
            if (ticketTimeEntries.length > 0 && existingP) existingP.remove();
            
            if (ticketTimeEntries.length > 0) {
                ticketTimeEntries.forEach(function(te) {
                    var div = document.createElement('div');
                    div.className = 'time-entry';
                    var userStr = te.user === '1' ? 'Jean Dupont' : (te.user === '2' ? 'Marie Martin' : (te.user === '3' ? 'Pierre Durand' : te.user || '—'));
                    div.innerHTML = '<div class="time-entry-header"><span class="time-date">' + (te.date || '—') + '</span><span class="time-duration">' + (parseFloat(te.hours) || 0) + 'h</span></div><p class="time-user">' + userStr + '</p><p>' + (te.description || '—') + '</p>';
                    timeEntriesContainer.appendChild(div);
                });
            } else if (existingP) {
                timeEntriesContainer.appendChild(existingP);
            }
        }
        
        var estimatedEl = document.querySelector('.time-estimated strong');
        if (estimatedEl) estimatedEl.parentElement.innerHTML = '<strong>Temps estimé :</strong> ' + (ticket.estimated_hours != null ? (parseFloat(ticket.estimated_hours) || 0) + 'h' : '—');
        
        /* Sidebar - Informations */
        var createdDateStr = '—';
        if (ticket.created_at) {
            createdDateStr = new Date(ticket.created_at).toLocaleDateString('fr-FR');
        } else if (ticket._id && parseInt(ticket._id, 10) > 1000000000000) {
            createdDateStr = new Date(parseInt(ticket._id, 10)).toLocaleDateString('fr-FR');
        }
        var modifiedDateStr = (ticket.modified_at || ticket.updated_at) ? new Date(ticket.modified_at || ticket.updated_at).toLocaleDateString('fr-FR') : '—';
        var createdByStr = ticket.created_by || '—';
        if (createdByStr === '—' && ticket.assignees && (Array.isArray(ticket.assignees) ? ticket.assignees[0] : ticket.assignees)) {
            var firstAssignee = Array.isArray(ticket.assignees) ? ticket.assignees[0] : ticket.assignees;
            createdByStr = (firstAssignee === '1' || firstAssignee === 1) ? 'Jean Dupont' : ((firstAssignee === '2' || firstAssignee === 2) ? 'Marie Martin' : ((firstAssignee === '3' || firstAssignee === 3) ? 'Pierre Durand' : firstAssignee));
        }
        var sidebarInfo = document.querySelector('.ticket-sidebar .info-list');
        if (sidebarInfo) {
            var dt = sidebarInfo.querySelectorAll('dt');
            var dd = sidebarInfo.querySelectorAll('dd');
            dt.forEach(function(dtEl, idx) {
                if (dd[idx]) {
                    var label = dtEl.textContent.trim();
                    if (label === 'Projet') dd[idx].innerHTML = projetName ? '<a href="projet-detail.html?id=' + encodeURIComponent(ticket.project || projet ? projet._id : '') + '">' + projetName + '</a>' : '—';
                    else if (label === 'Client') dd[idx].textContent = clientName || '—';
                    else if (label === 'Créé le') dd[idx].textContent = createdDateStr;
                    else if (label === 'Modifié le') dd[idx].textContent = modifiedDateStr;
                    else if (label === 'Créé par') dd[idx].textContent = createdByStr;
                    else if (label === 'Temps écoulé') dd[idx].innerHTML = '<span class="text-primary">' + (totalTicketHours || 0) + 'h</span> / ' + (ticket.estimated_hours != null ? (parseFloat(ticket.estimated_hours) || 0) + 'h' : '—');
                }
            });
        }
        
        /* Assignés */
        var assigneesList = document.querySelector('.ticket-sidebar .assignees-list');
        if (assigneesList) {
            var assignees = ticket.assignees || ticket['assignees[]'] || [];
            if (!Array.isArray(assignees) && assignees) assignees = [assignees];
            var existingItems = assigneesList.querySelectorAll('.assignee-item');
            var emptyMsg = assigneesList.querySelector('.text-secondary');
            existingItems.forEach(function(i) { i.remove(); });
            
            if (assignees.length > 0) {
                if (emptyMsg) emptyMsg.remove();
                assignees.forEach(function(a) {
                    var name = (a === '1' || a === 1) ? 'Jean Dupont' : ((a === '2' || a === 2) ? 'Marie Martin' : ((a === '3' || a === 3) ? 'Pierre Durand' : a));
                    var div = document.createElement('div');
                    div.className = 'assignee-item';
                    div.innerHTML = '<span>' + name + '</span>';
                    assigneesList.appendChild(div);
                });
            }
        }
        
        /* Historique / Timeline */
        var timeline = document.querySelector('.ticket-timeline-section .timeline');
        if (timeline) {
            var items = timeline.querySelectorAll('.timeline-item');
            if (items.length > 0) {
                var firstItem = items[0];
                firstItem.querySelector('.timeline-content p').textContent = 'Ticket créé le ' + (ticket._id ? new Date(parseInt(ticket._id)).toLocaleDateString('fr-FR') : '—');
                firstItem.querySelector('.timeline-time').textContent = ticket._id ? new Date(parseInt(ticket._id)).toLocaleDateString('fr-FR') : '—';
            }
        }
    }

    /* Met à jour la page ticket-validation (cartes à valider + historique) */
    function updateValidationPage() {
        var page = document.body.getAttribute('data-page');
        if (page !== 'validation') return;
        
        var tickets = AppData.get('tickets') || [];
        var projets = AppData.get('projets') || [];
        var clients = AppData.get('clients') || [];
        var temps = AppData.get('temps') || [];
        var contrats = AppData.get('contrats') || [];
        var validations = AppData.get('validations') || [];
        
        var toValidate = [];
        tickets.forEach(function(t, idx) {
            var v = validations[idx];
            var status = t.status || 'new';
            if (v === 'validated' || v === 'refused') return;
            if (v === 'to-validate' || v === 'waiting' || status === 'to-validate' || status === 'done') {
                if ((t.type || '') === 'billable') toValidate.push({ ticket: t, index: idx });
            }
        });
        
        var totalAmount = 0;
        toValidate.forEach(function(item) {
            var t = item.ticket;
            var ticketHours = 0;
            temps.forEach(function(te) {
                if (String(te.ticket) === String(t._id)) ticketHours += parseFloat(te.hours) || 0;
            });
            var contract = contrats.find(function(c) { return String(c.project) === String(t.project); });
            var rate = contract ? (parseFloat(contract.rate) || 0) : 0;
            totalAmount += ticketHours * rate;
        });
        
        var summaryCards = document.querySelectorAll('.list-summary-cards [class*="list-summary-card"] .list-summary-value');
        if (summaryCards.length >= 2) {
            summaryCards[0].textContent = String(toValidate.length || 0);
            summaryCards[1].textContent = (totalAmount || 0).toFixed(2) + ' €';
        }
        
        var grid = document.querySelector('.content-section .projects-grid');
        if (grid) {
            var existing = grid.querySelectorAll('.project-card');
            existing.forEach(function(c) { c.remove(); });
            
            if (toValidate.length > 0) {
                toValidate.forEach(function(item) {
                    var t = item.ticket;
                    var projetName = '—';
                    var projet = projets.find(function(p) { return String(p._id) === String(t.project); });
                    if (projet) projetName = projet.name || '—';
                    var ticketHours = 0;
                    temps.forEach(function(te) {
                        if (String(te.ticket) === String(t._id)) ticketHours += parseFloat(te.hours) || 0;
                    });
                    var contract = contrats.find(function(c) { return String(c.project) === String(t.project); });
                    var rate = contract ? (parseFloat(contract.rate) || 0) : 0;
                    var amount = ticketHours * rate;
                    var card = document.createElement('article');
                    card.className = 'project-card';
                    card.setAttribute('data-ticket-id', t._id);
                    card.setAttribute('data-systicket-injected', '1');
                    card.innerHTML = '<header class="project-card-header"><h3>' + (t.title || '—') + '</h3><span class="badge badge-warning">À valider</span></header><div class="project-card-body"><p><strong>Projet :</strong> ' + projetName + '</p><p><strong>Description :</strong> ' + (t.description || t.title || '—') + '</p><div class="card-body-spacing"><p><strong>Temps passé :</strong> ' + (ticketHours || 0) + 'h</p><p><strong>Montant à facturer :</strong> <span class="text-amount">' + (amount || 0).toFixed(2) + ' €</span></p></div></div><footer class="project-card-footer card-footer-flex"><button class="btn btn-success flex-1">✅ Valider</button><button class="btn btn-danger flex-1">❌ Refuser</button><a href="ticket-detail.html?id=' + t._id + '" class="btn btn-text">Voir détails</a></footer>';
                    grid.appendChild(card);
                });
                window.setTimeout(function() {
                    document.dispatchEvent(new CustomEvent('systicket:contentLoaded'));
                }, 0);
            } else {
                var emptyMsg = document.createElement('p');
                emptyMsg.className = 'text-secondary text-sm';
                emptyMsg.textContent = 'Aucun ticket en attente de validation.';
                grid.appendChild(emptyMsg);
            }
        }
        
        var histTable = document.querySelector('section .table-container .table tbody');
        if (histTable && histTable.closest('section').querySelector('h2') && histTable.closest('section').querySelector('h2').textContent.indexOf('Historique') !== -1) {
            var existingRows = histTable.querySelectorAll('tr');
            existingRows.forEach(function(r) { r.remove(); });
            var validated = [];
            tickets.forEach(function(t, idx) {
                var v = validations[idx];
                if (v === 'validated' || v === 'refused' || t.status === 'validated' || t.status === 'refused') {
                    validated.push({ ticket: t, status: v || t.status });
                }
            });
            if (validated.length > 0) {
                validated.forEach(function(item) {
                    var t = item.ticket;
                    var projetName = '—';
                    var projet = projets.find(function(p) { return String(p._id) === String(t.project); });
                    if (projet) projetName = projet.name || '—';
                    var ticketHours = 0;
                    temps.forEach(function(te) {
                        if (String(te.ticket) === String(t._id)) ticketHours += parseFloat(te.hours) || 0;
                    });
                    var contract = contrats.find(function(c) { return String(c.project) === String(t.project); });
                    var rate = contract ? (parseFloat(contract.rate) || 0) : 0;
                    var amount = ticketHours * rate;
                    var statusText = (item.status === 'validated') ? 'Validé' : 'Refusé';
                    var statusClass = (item.status === 'validated') ? 'badge-success' : 'badge-danger';
                    var tr = document.createElement('tr');
                    tr.setAttribute('data-systicket-injected', '1');
                    tr.innerHTML = '<td><a href="ticket-detail.html?id=' + t._id + '">' + (t.title || '—') + '</a></td><td>' + projetName + '</td><td>' + (ticketHours || 0) + 'h</td><td>' + (amount || 0).toFixed(2) + ' €</td><td><span class="badge ' + statusClass + '">' + statusText + '</span></td><td>' + (t._id ? new Date(parseInt(t._id)).toLocaleDateString('fr-FR') : '—') + '</td><td><a href="ticket-detail.html?id=' + t._id + '">Voir</a></td>';
                    histTable.appendChild(tr);
                });
            } else {
                var emptyTr = document.createElement('tr');
                emptyTr.innerHTML = '<td colspan="7" class="table-empty">Aucune validation enregistrée.</td>';
                histTable.appendChild(emptyTr);
            }
        }
    }

    /* Pré-remplit les formulaires en mode édition (?id=) ou création avec contexte (?client=, ?project=) */
    function populateFormsForEdit() {
        var urlParams = new URLSearchParams(window.location.search);
        var id = urlParams.get('id');
        var clientId = urlParams.get('client');
        var projectId = urlParams.get('project');
        
        if (id) {
        
        var clientForm = document.getElementById('client-form');
        if (clientForm) {
            var clients = AppData.get('clients') || [];
            var client = clients.find(function(c) { return String(c._id) === String(id); });
            if (client) {
                var nameEl = document.getElementById('client-name');
                var contactEl = document.getElementById('client-contact');
                var emailEl = document.getElementById('client-email');
                var phoneEl = document.getElementById('client-phone');
                var statusEl = document.getElementById('client-status');
                var addressEl = document.getElementById('client-address');
                var title = clientForm.closest('main') && clientForm.closest('main').querySelector('h1');
                if (nameEl) nameEl.value = client.name || '';
                if (contactEl) contactEl.value = client.contact || '';
                if (emailEl) emailEl.value = client.email || '';
                if (phoneEl) phoneEl.value = client.phone || '';
                if (statusEl) statusEl.value = client.status || 'active';
                if (addressEl) addressEl.value = client.address || '';
                if (title) title.textContent = 'Modifier un client';
            }
            return;
        }
        
        var projectForm = document.getElementById('project-form');
        if (projectForm) {
            var projets = AppData.get('projets') || [];
            var projet = projets.find(function(p) { return String(p._id) === String(id); });
            if (projet) {
                var nameEl = document.getElementById('project-name');
                var descEl = document.getElementById('project-description');
                var clientEl = document.getElementById('project-client');
                var statusEl = document.getElementById('project-status');
                var startEl = document.getElementById('project-start');
                var endEl = document.getElementById('project-end');
                var title = projectForm.closest('main') && projectForm.closest('main').querySelector('h1');
                if (nameEl) nameEl.value = projet.name || '';
                if (descEl) descEl.value = projet.description || '';
                if (clientEl) clientEl.value = projet.client || '';
                if (statusEl) statusEl.value = projet.status || 'active';
                if (startEl) startEl.value = projet.start_date || '';
                if (endEl) endEl.value = projet.end_date || '';
                if (title) title.textContent = 'Modifier le projet';
            }
            return;
        }
        
        var contratForm = document.getElementById('contrat-form');
        if (contratForm) {
            var contrats = AppData.get('contrats') || [];
            var contrat = contrats.find(function(c) { return String(c._id) === String(id); });
            if (contrat) {
                var projectEl = document.querySelector('#contrat-form [name="project"]');
                var clientEl = document.querySelector('#contrat-form [name="client"]');
                var hoursEl = document.querySelector('#contrat-form [name="hours"]');
                var rateEl = document.querySelector('#contrat-form [name="rate"]');
                var startEl = document.querySelector('#contrat-form [name="start"]');
                var endEl = document.querySelector('#contrat-form [name="end"]');
                var title = contratForm.closest('main') && contratForm.closest('main').querySelector('h1');
                if (projectEl) projectEl.value = contrat.project || '';
                if (clientEl) clientEl.value = contrat.client || '';
                if (hoursEl) hoursEl.value = contrat.hours || '';
                if (rateEl) rateEl.value = contrat.rate || '';
                if (startEl) startEl.value = contrat.start || '';
                if (endEl) endEl.value = contrat.end || '';
                if (title) title.textContent = 'Modifier le contrat';
            }
            return;
        }
        
        var ticketForm = document.getElementById('ticket-form');
        if (ticketForm) {
            var tickets = AppData.get('tickets') || [];
            var ticket = tickets.find(function(t) { return String(t._id) === String(id); });
            if (ticket) {
                var titleEl = document.querySelector('#ticket-form [name="title"]');
                var projectEl = document.querySelector('#ticket-form [name="project"]');
                var statusEl = document.querySelector('#ticket-form [name="status"]');
                var priorityEl = document.querySelector('#ticket-form [name="priority"]');
                var typeEl = document.querySelector('#ticket-form [name="type"]');
                var hoursEl = document.querySelector('#ticket-form [name="estimated_hours"]');
                var titleH1 = ticketForm.closest('main') && ticketForm.closest('main').querySelector('h1');
                if (titleEl) titleEl.value = ticket.title || '';
                if (projectEl) projectEl.value = ticket.project || '';
                if (statusEl) statusEl.value = ticket.status || 'new';
                if (priorityEl) priorityEl.value = ticket.priority || 'normal';
                if (typeEl) typeEl.value = ticket.type || 'included';
                if (hoursEl) hoursEl.value = ticket.estimated_hours || '';
                if (titleH1) titleH1.textContent = 'Modifier le ticket';
            }
        }

        var userForm = document.getElementById('user-form');
        if (userForm) {
            var users = getUtilisateurs();
            var user = users.find(function(u) { return String(u._id) === String(id); });
            if (user) {
                var nomEl = document.getElementById('user-nom');
                var prenomEl = document.getElementById('user-prenom');
                var emailEl = document.getElementById('user-email');
                var roleEl = document.getElementById('user-role');
                var statusEl = document.getElementById('user-status');
                var telEl = document.getElementById('user-telephone');
                var titleEl = document.getElementById('user-form-title');
                var breadcrumbEl = document.getElementById('breadcrumb-action');
                if (nomEl) nomEl.value = user.nom || '';
                if (prenomEl) prenomEl.value = user.prenom || '';
                if (emailEl) emailEl.value = user.email || '';
                if (roleEl) roleEl.value = user.role || 'collaborateur';
                if (statusEl) statusEl.value = user.status || 'active';
                if (telEl) telEl.value = user.telephone || '';
                if (titleEl) titleEl.textContent = 'Modifier l\'utilisateur';
                if (breadcrumbEl) breadcrumbEl.textContent = 'Modifier';
                var deleteBtn = document.getElementById('user-delete-btn');
                if (deleteBtn) {
                    deleteBtn.style.display = 'inline-block';
                    deleteBtn.onclick = function() {
                        var currentRole = (typeof localStorage !== 'undefined' ? localStorage.getItem('systicket_role') : null) || 'client';
                        if (currentRole !== 'admin') {
                            alert('Seul un administrateur peut supprimer un utilisateur.');
                            return;
                        }
                        if (confirm('Supprimer cet utilisateur ?')) {
                            if (window.Storage) {
                                var users = getUtilisateurs();
                                if (users.length <= 1) {
                                    alert('Impossible de supprimer le dernier utilisateur.');
                                    return;
                                }
                                Storage.remove('utilisateurs', id);
                                window.location.href = 'utilisateurs.html?deleted=1';
                            }
                        }
                    };
                }
            }
            return;
        }
        } else if (clientId) {
            /* Pré-remplir le projet avec le client sélectionné (depuis client-detail) */
            var projectForm = document.getElementById('project-form');
            if (projectForm) {
                var clientEl = document.getElementById('project-client');
                if (clientEl) clientEl.value = clientId;
            }
        } else if (projectId) {
            /* Pré-remplir le ticket avec le projet sélectionné (depuis projet-detail) */
            var ticketForm = document.getElementById('ticket-form');
            if (ticketForm) {
                var projectEl = document.getElementById('ticket-project') || document.querySelector('#ticket-form [name="project"]');
                if (projectEl) projectEl.value = projectId;
            }
        }
    }

    /* Utilisateurs par défaut (fallback si non enregistrés) */
    function getUtilisateurs() {
        var u = AppData.get('utilisateurs');
        if (u && u.length > 0) return u;
        return [
            { _id: 1, nom: 'Dupont', prenom: 'Jean', email: 'jean@exemple.fr', telephone: '01 23 45 67 89', role: 'admin', status: 'active', last_login: '2026-02-08' },
            { _id: 2, nom: 'Martin', prenom: 'Marie', email: 'marie@exemple.fr', telephone: '', role: 'collaborateur', status: 'active', last_login: '2026-02-07' },
            { _id: 3, nom: 'Client', prenom: 'Pierre', email: 'pierre@client.fr', telephone: '', role: 'client', status: 'inactive', last_login: null }
        ];
    }

    /* Met à jour la page formulaire utilisateur (titre, breadcrumb, restriction rôle admin) */
    function updateUserFormPage() {
        var page = document.body.getAttribute('data-page');
        if (page !== 'utilisateurs') return;
        var userForm = document.getElementById('user-form');
        if (!userForm) return;
        var urlParams = new URLSearchParams(window.location.search);
        var id = urlParams.get('id');
        var titleEl = document.getElementById('user-form-title');
        var breadcrumbEl = document.getElementById('breadcrumb-action');
        if (!id && titleEl) {
            titleEl.textContent = 'Ajouter un utilisateur';
            if (breadcrumbEl) breadcrumbEl.textContent = 'Nouvel utilisateur';
        }
        var currentRole = (typeof localStorage !== 'undefined' ? localStorage.getItem('systicket_role') : null) || 'client';
        var roleSelect = document.getElementById('user-role');
        if (roleSelect && currentRole !== 'admin') {
            var adminOpt = roleSelect.querySelector('option[value="admin"]');
            if (adminOpt) adminOpt.remove();
        }
    }

    /* Affiche et gère les modifications de profil en attente de validation (admin) */
    function updatePendingProfiles() {
        var section = document.getElementById('pending-profiles');
        var listEl = document.getElementById('pending-profiles-list');
        var emptyEl = document.getElementById('pending-profiles-empty');
        if (!section || !listEl) return;
        var currentRole = (typeof localStorage !== 'undefined' ? localStorage.getItem('systicket_role') : null) || 'client';
        if (currentRole !== 'admin') { section.style.display = 'none'; return; }
        var pending = AppData.get('profil_pending');
        if (!Array.isArray(pending) || pending.length === 0) {
            section.style.display = 'block';
            listEl.innerHTML = '';
            if (emptyEl) emptyEl.style.display = 'block';
            return;
        }
        section.style.display = 'block';
        if (emptyEl) emptyEl.style.display = 'none';
        listEl.innerHTML = '';
        pending.forEach(function(p, idx) {
            var div = document.createElement('div');
            div.className = 'card card-spacing';
            div.innerHTML = '<p><strong>' + (p.prenom || '') + ' ' + (p.nom || '') + '</strong> (' + (p.email || '—') + ')</p><p class="text-sm">Nom: ' + (p.nom || '—') + ', Prénom: ' + (p.prenom || '—') + ', Tél: ' + (p.telephone || '—') + '</p><div class="form-actions"><button type="button" class="btn btn-success btn-validate-pending">Valider</button><button type="button" class="btn btn-danger btn-refuse-pending">Refuser</button></div>';
            var validateBtn = div.querySelector('.btn-validate-pending');
            var refuseBtn = div.querySelector('.btn-refuse-pending');
            if (validateBtn) {
                validateBtn.onclick = function() {
                    var users = getUtilisateurs();
                    var u = users.find(function(us) { return String(us.email) === String(p.email); });
                    if (u) {
                        u.nom = p.nom; u.prenom = p.prenom; u.telephone = p.telephone;
                        if (window.Storage) Storage.set('utilisateurs', users);
                    }
                    var profil = AppData.get('profil');
                    if (profil && String(profil.email) === String(p.email)) {
                        profil.nom = p.nom; profil.prenom = p.prenom; profil.telephone = p.telephone;
                        if (window.Storage) Storage.set('profil', profil);
                    }
                    var newPending = pending.filter(function(_, i) { return i !== idx; });
                    if (window.Storage) Storage.set('profil_pending', newPending);
                    updatePendingProfiles();
                    injectStoredRows();
                };
            }
            if (refuseBtn) {
                refuseBtn.onclick = function() {
                    var newPending = pending.filter(function(_, i) { return i !== idx; });
                    if (window.Storage) Storage.set('profil_pending', newPending);
                    updatePendingProfiles();
                };
            }
            listEl.appendChild(div);
        });
    }

    /* Met à jour la page profil : titre, en-tête et formulaire selon ?id= (vue détail utilisateur) */
    function updateProfilDetail() {
        var page = document.body.getAttribute('data-page');
        if (page !== 'profil') return;
        var urlParams = new URLSearchParams(window.location.search);
        var userId = urlParams.get('id');
        if (!userId) return;
        var users = getUtilisateurs();
        var user = users.find(function(u) { return String(u._id) === String(userId); });
        if (!user) return;
        var fullName = ((user.prenom || '') + ' ' + (user.nom || '')).trim() || '—';
        var h1 = document.querySelector('.page-header h1');
        if (h1) h1.textContent = 'Profil de ' + fullName;
        var subtitle = document.querySelector('.page-header .page-subtitle');
        if (subtitle) subtitle.textContent = 'Informations de l\'utilisateur';
        var pageTitle = document.querySelector('title');
        if (pageTitle) pageTitle.textContent = fullName + ' - Profil - Systicket';
        var headerRight = document.querySelector('.page-header .page-header-right');
        if (!headerRight) {
            var headerLeft = document.querySelector('.page-header .page-header-left');
            if (headerLeft && headerLeft.parentElement) {
                headerRight = document.createElement('div');
                headerRight.className = 'page-header-right';
                headerLeft.parentElement.appendChild(headerRight);
            }
        }
        if (headerRight) {
            headerRight.innerHTML = '<a href="user-form.html?id=' + encodeURIComponent(userId) + '" class="btn btn-primary role-admin-only">✏️ Éditer</a> <a href="utilisateurs.html" class="btn btn-secondary">← Retour aux utilisateurs</a>';
        }
        var profileForm = document.getElementById('profile-form');
        if (profileForm) {
            profileForm.setAttribute('data-no-validate', '1');
            var submitBtn = profileForm.querySelector('button[type="submit"]');
            if (submitBtn) submitBtn.style.display = 'none';
        }
        var passwordCard = document.querySelector('#password-form') && document.querySelector('#password-form').closest('.card');
        if (passwordCard) passwordCard.style.display = 'none';
    }

    function init() {
        injectStoredRows();
        updateDashboardProjects();
        updateProjectStats();
        updateContractStats();
        updateDashboard();
        updateClientDetail();
        updateProjectDetail();
        updateContractDetail();
        updateTicketDetail();
        updateValidationPage();
        updateReports();
        updateClientSelects();
        updateProjectSelects();
        updateTempsPage();
        updatePagination();
        populateFormsForEdit();
        updateUserFormPage();
        updatePendingProfiles();
        updateProfilDetail();
        var profileForm = document.getElementById('profile-form');
        if (profileForm) {
            var urlParams = new URLSearchParams(window.location.search);
            var userId = urlParams.get('id');
            var p = userId ? null : AppData.get('profil');
            if (userId) {
                var users = getUtilisateurs();
                p = users.find(function(u) { return String(u._id) === String(userId); });
            }
            if (p) {
                var nom = document.getElementById('profile-nom');
                var prenom = document.getElementById('profile-prenom');
                var email = document.getElementById('profile-email');
                var tel = document.getElementById('profile-telephone');
                if (nom && p.nom) nom.value = p.nom;
                if (prenom && p.prenom) prenom.value = p.prenom;
                if (email && p.email) email.value = p.email;
                if (tel) tel.value = p.telephone || '';
            }
            if (!userId) {
                var pendingList = AppData.get('profil_pending');
                var profilData = AppData.get('profil');
                var hasPending = Array.isArray(pendingList) && profilData && pendingList.some(function(x) { return String(x.email) === String(profilData.email); });
                var notice = document.getElementById('profile-pending-notice');
                if (notice) notice.style.display = hasPending ? 'block' : 'none';
            }
        }

        /* Notification ?added= après redirection depuis un formulaire */
        var urlParams = new URLSearchParams(window.location.search);
        var addedId = urlParams.get('added');
        if (addedId) {
            var toast = document.getElementById('systicket-toast');
            if (!toast) {
                toast = document.createElement('div');
                toast.id = 'systicket-toast';
                toast.className = 'validation-toast';
                document.body.appendChild(toast);
            }
            toast.textContent = 'Enregistrement effectué avec succès.';
            toast.className = 'validation-toast validation-toast-success';
            toast.style.display = 'block';
            setTimeout(function() { toast.style.display = 'none'; }, 3000);
            window.history.replaceState({}, '', window.location.pathname);
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
    window.addEventListener('systicket:contentLoaded', init);
    window.addEventListener('systicket:projectAdded', function(e) {
        setTimeout(function() {
            var page = document.body.getAttribute('data-page');
            /* Met à jour les statistiques et le dashboard */
            if (page === 'projets') {
                /* Réaffiche tout le tableau si nécessaire */
                injectStoredRows();
            }
            updateDashboardProjects();
            updateProjectStats();
            updateDashboard();
        }, 100);
    });
    window.addEventListener('systicket:contractAdded', function() {
        injectStoredRows();
        updateContractStats();
        updateDashboard();
    });
    window.addEventListener('systicket:timeAdded', function() {
        injectStoredRows();
        updateTempsPage();
        updateContractStats();
        updateDashboard();
    });
    window.addEventListener('systicket:ticketAdded', function() {
        injectStoredRows();
        updatePagination();
        updateDashboard();
    });
    window.addEventListener('systicket:clientAdded', function() {
        injectStoredRows();
        updateClientSelects();
    });
    window.addEventListener('systicket:reportsUpdate', function() {
        updateReports();
    });
})();
