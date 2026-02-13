/* Validation et sauvegarde des formulaires - persistance localStorage, redirection unifiée */
(function() {
    'use strict';

    function showError(input, message) {
        var group = input.closest('.form-group') || input.closest('.auth-form-group');
        if (!group) return;
        var oldError = group.querySelector('.form-error, .auth-error');
        if (oldError) oldError.remove();
        var error = document.createElement('span');
        error.className = 'form-error';
        error.textContent = message;
        group.appendChild(error);
        input.classList.add('form-input-error');
    }

    function clearErrors(form) {
        form.querySelectorAll('.form-error, .auth-error').forEach(function(el) { el.remove(); });
        form.querySelectorAll('.form-input-error').forEach(function(el) { el.classList.remove('form-input-error'); });
    }

    function validate(form) {
        clearErrors(form);
        var ok = true;
        form.querySelectorAll('[required]').forEach(function(field) {
            if (!field.value || field.value.trim() === '') {
                showError(field, 'Ce champ est obligatoire.');
                ok = false;
            }
        });
        form.querySelectorAll('input[type="email"]').forEach(function(field) {
            if (field.value && field.value.indexOf('@') === -1) {
                showError(field, 'L\'email n\'est pas valide.');
                ok = false;
            }
        });
        var password = form.querySelector('#new-password') || form.querySelector('#password');
        var confirm = form.querySelector('#password-confirm');
        if (password && confirm && password.value !== confirm.value) {
            showError(confirm, 'Les mots de passe ne correspondent pas.');
            ok = false;
        }
        return ok;
    }

    function showToast(message, type) {
        var toast = document.getElementById('systicket-toast');
        if (!toast) {
            toast = document.createElement('div');
            toast.id = 'systicket-toast';
            toast.className = 'validation-toast';
            document.body.appendChild(toast);
        }
        toast.textContent = message;
        toast.className = 'validation-toast validation-toast-' + (type || 'success');
        toast.style.display = 'block';
        setTimeout(function() { toast.style.display = 'none'; }, 3000);
    }

    function handleFormSubmit(e) {
        e.preventDefault();
        var form = e.target;
        if (!validate(form)) return;

        var formData = new FormData(form);
        var data = {};
        var assignees = [];
        formData.forEach(function(value, key) {
            if (key.indexOf('assignees') !== -1 && value) {
                assignees.push(value);
            } else {
                data[key] = value;
            }
        });
        if (assignees.length > 0) data.assignees = assignees;

        var urlParams = new URLSearchParams(window.location.search);
        var isEdit = urlParams.has('id');
        var itemId;

        /* Formulaire inscription : rôle collaborateur ou client uniquement */
        if (form.id === 'register-form' || form.classList.contains('auth-form-register')) {
            var role = data.role || (form.querySelector('[name="role"]') && form.querySelector('[name="role"]').value);
            if (role === 'admin') {
                var roleGroup = form.querySelector('.auth-radio-group');
                showError(roleGroup || form.querySelector('[name="role"]') || form, 'Seuls les collaborateurs et clients peuvent s\'inscrire.');
                return;
            }
            if (role === 'client' && (!data.client_id || !String(data.client_id).trim())) {
                var clientEl = form.querySelector('select[name="client_id"]');
                showError(clientEl || form, 'Veuillez sélectionner votre entreprise.');
                return;
            }
            if (window.Storage && data.email) {
                var users = window.Storage.get('utilisateurs') || [];
                var existing = users.find(function(x) { return String(x.email).toLowerCase() === String(data.email).toLowerCase(); });
                if (existing) {
                    showError(form.querySelector('input[name="email"]') || form, 'Un compte existe déjà avec cet email.');
                    return;
                }
                var clientId = (role === 'client' && data.client_id) ? String(data.client_id) : null;
                var newUser = {
                    nom: data.nom || '',
                    prenom: data.prenom || '',
                    email: data.email,
                    telephone: '',
                    role: role || 'collaborateur',
                    status: 'active',
                    last_login: null,
                    password: data.password || null
                };
                if (clientId) newUser.client_id = clientId;
                if (window.Storage.add) window.Storage.add('utilisateurs', newUser);
                var p = { nom: data.nom, prenom: data.prenom, email: data.email, telephone: '', password: data.password || '' };
                try { window.Storage.set('profil', p); } catch (e) {}
            }
            if (role) localStorage.setItem('systicket_role', role);
            if (data.email) localStorage.setItem('systicket_user_email', data.email);
            if (data.nom) localStorage.setItem('systicket_user_nom', data.nom);
            if (data.prenom) localStorage.setItem('systicket_user_prenom', data.prenom);
            window.location.href = 'dashboard.html';
            return;
        }

        /* Connexion : retrouver l'utilisateur par email et définir rôle/profil */
        if (form.id === 'login-form') {
            var email = (data.email || '').trim();
            var password = (data.password || '').trim();
            if (!email || !window.Storage || !window.Storage.get) {
                window.location.href = form.getAttribute('action') || 'dashboard.html';
                return;
            }
            var users = window.Storage.get('utilisateurs') || [];
            var u = users.find(function(x) { return String(x.email).toLowerCase() === String(email).toLowerCase(); });
            if (!u) {
                var emailInput = form.querySelector('input[name="email"]');
                showError(emailInput || form, 'Aucun compte associé à cet email.');
                return;
            }
            if (u.password && u.password !== password) {
                var pwdInput = form.querySelector('input[name="password"]');
                showError(pwdInput || form, 'Mot de passe incorrect.');
                return;
            }
            if (typeof localStorage !== 'undefined') {
                localStorage.setItem('systicket_role', u.role || 'client');
                localStorage.setItem('systicket_user_email', u.email || '');
            }
            if (window.Storage.set) {
                try {
                    window.Storage.set('profil', {
                        nom: u.nom,
                        prenom: u.prenom,
                        email: u.email,
                        telephone: u.telephone || ''
                    });
                } catch (e) {}
            }
            window.location.href = form.getAttribute('action') || 'dashboard.html';
            return;
        }
        if (form.id === 'reset-form') {
            form.submit();
            return;
        }

        /* Formulaires métier */
        var collection, redirectUrl, toastMsg;
        if (form.querySelector('#ticket-title') || form.querySelector('[name="title"]') && form.id === 'ticket-form') {
            collection = 'tickets';
            redirectUrl = 'tickets.html';
            toastMsg = 'Ticket ajouté';
        } else if (form.querySelector('#client-name') || form.querySelector('[name="name"]') && form.id === 'client-form') {
            collection = 'clients';
            redirectUrl = 'clients.html';
            toastMsg = 'Client ajouté';
        } else if (form.querySelector('#project-name') || form.querySelector('[name="name"]') && form.id === 'project-form') {
            collection = 'projets';
            redirectUrl = 'projets.html';
            toastMsg = 'Projet ajouté';
        } else if (form.querySelector('#contrat-project') || form.querySelector('[name="project"]') && form.id === 'contrat-form') {
            collection = 'contrats';
            redirectUrl = 'contrats.html';
            toastMsg = 'Contrat ajouté';
        } else if (form.querySelector('#time-ticket') || form.querySelector('[name="ticket"]') && form.id === 'time-form') {
            collection = 'temps';
            redirectUrl = 'temps.html';
            toastMsg = 'Temps enregistré';
        } else if (form.querySelector('#user-nom') || form.id === 'user-form') {
            var currentRole = (typeof localStorage !== 'undefined' ? localStorage.getItem('systicket_role') : null) || 'client';
            if (currentRole !== 'admin') {
                showToast('Seul un administrateur peut créer ou modifier des utilisateurs.', 'error');
                return;
            }
            if ((data.role || '') === 'admin') {
                if (currentRole !== 'admin') {
                    showToast('Seul un administrateur peut créer un autre administrateur.', 'error');
                    return;
                }
            }
            if (data.role !== 'client') data.client_id = null;
            if (data.role === 'client' && (!data.client_id || !String(data.client_id).trim())) {
                data.client_id = null;
            }
            if (window.Storage && window.Storage.get) {
                var users = window.Storage.get('utilisateurs') || [];
                var dup = users.find(function(x) {
                    return String(x.email).toLowerCase() === String(data.email || '').toLowerCase() && String(x._id) !== String(urlParams.get('id') || '');
                });
                if (dup) {
                    showError(form.querySelector('input[name="email"]') || form, 'Un utilisateur avec cet email existe déjà.');
                    return;
                }
            }
            collection = 'utilisateurs';
            redirectUrl = 'utilisateurs.html';
            toastMsg = isEdit ? 'Utilisateur modifié' : 'Utilisateur ajouté';
        } else if (form.id === 'password-form') {
            if (!window.Storage) return;
            var profil = Storage.get && Storage.get('profil');
            if (!profil) profil = {};
            profil.password = data.new_password || data['new_password'];
            Storage.set('profil', profil);
            showToast('Mot de passe modifié avec succès.', 'success');
            form.reset();
            return;
        } else if (form.querySelector('#profile-nom') || form.querySelector('[name="nom"]') && form.id === 'profile-form') {
            if (!window.Storage) return;
            var currentRole = (typeof localStorage !== 'undefined' ? localStorage.getItem('systicket_role') : null) || 'client';
            if (currentRole === 'admin') {
                Storage.set('profil', data);
                showToast('Profil mis à jour', 'success');
                window.history.replaceState({}, '', 'profil.html');
                return;
            }
            var profil = Storage.get && Storage.get('profil');
            var userEmail = data.email || (profil && profil.email) || (typeof localStorage !== 'undefined' ? localStorage.getItem('systicket_user_email') : null);
            var pending = { email: userEmail, nom: data.nom, prenom: data.prenom, telephone: data.telephone || '' };
            var list = Storage.get && Storage.get('profil_pending');
            if (!Array.isArray(list)) list = [];
            var idx = list.findIndex(function(p) { return p.email === pending.email; });
            if (idx >= 0) list[idx] = pending; else list.push(pending);
            Storage.set('profil_pending', list);
            showToast('Modifications en attente de validation par l\'administrateur.', 'success');
            return;
        } else {
            /* Fallback : utiliser l'action du form */
            var action = form.getAttribute('action');
            if (action) window.location.href = action;
            return;
        }

        if (!window.Storage && !window.AppData) {
            console.error('Storage non disponible');
            return;
        }
        var Store = window.Storage || window.AppData;

        if (collection === 'temps' && data.ticket && Store.get) {
            var tickets = Store.get('tickets') || [];
            var tick = tickets.find(function(t) { return String(t._id) === String(data.ticket); });
            if (tick && tick.project) data.project = tick.project;
            var totalHours = parseFloat(data.hours) || 0;
            if (data.minutes) totalHours += (parseFloat(data.minutes) || 0) / 60;
            data.hours = totalHours;
        }
        if (collection === 'tickets') {
            if (isEdit) data.modified_at = new Date().toISOString();
            else {
                data.created_at = new Date().toISOString();
                var profil = (Store.get && Store.get('profil')) || null;
                if (profil && (profil.prenom || profil.nom)) data.created_by = ((profil.prenom || '') + ' ' + (profil.nom || '')).trim();
            }
        }

        if (isEdit) {
            var id = urlParams.get('id');
            Store.update(collection, id, data);
            itemId = id;
            toastMsg = 'Modification enregistrée';
            if (collection === 'utilisateurs' && Store.set) {
                var loggedEmail = (typeof localStorage !== 'undefined' ? localStorage.getItem('systicket_user_email') : null) || '';
                if (String(data.email || '').toLowerCase() === String(loggedEmail).toLowerCase()) {
                    try {
                        Store.set('profil', { nom: data.nom, prenom: data.prenom, email: data.email, telephone: data.telephone || '' });
                    } catch (e) {}
                    if (typeof localStorage !== 'undefined' && data.role) localStorage.setItem('systicket_role', data.role);
                }
            }
        } else {
            var newItem = Store.add(collection, data);
            itemId = newItem._id;
        }

        /* Redirection vers la liste avec paramètre */
        window.location.href = redirectUrl + '?added=' + encodeURIComponent(itemId);
    }

    function initInscriptionClientSelect() {
        var form = document.getElementById('register-form');
        if (!form) return;
        var clientGroup = document.getElementById('inscription-client-group');
        var clientSelect = form.querySelector('select[name="client_id"]');
        var roleRadios = form.querySelectorAll('input[name="role"]');
        if (!clientGroup || !clientSelect || !roleRadios.length) return;

        function toggleClientGroup() {
            var role = form.querySelector('input[name="role"]:checked');
            var isClient = role && role.value === 'client';
            clientGroup.style.display = isClient ? 'block' : 'none';
            clientSelect.required = isClient;
            if (!isClient) clientSelect.value = '';
        }

        function populateClients() {
            if (!window.Storage || !window.Storage.get) return;
            var clients = window.Storage.get('clients') || [];
            clientSelect.innerHTML = '<option value="">— Choisir une entreprise —</option>';
            clients.forEach(function(c) {
                if (c.status === 'active' || !c.status) {
                    var opt = document.createElement('option');
                    opt.value = String(c._id);
                    opt.textContent = c.name || 'Entreprise #' + c._id;
                    clientSelect.appendChild(opt);
                }
            });
        }

        populateClients();
        toggleClientGroup();
        roleRadios.forEach(function(r) {
            r.removeEventListener('change', toggleClientGroup);
            r.addEventListener('change', toggleClientGroup);
        });
    }

    function init() {
        document.querySelectorAll('form:not([data-no-validate])').forEach(function(form) {
            form.removeEventListener('submit', handleFormSubmit);
            form.addEventListener('submit', handleFormSubmit);
        });
        initInscriptionClientSelect();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
    window.addEventListener('systicket:contentLoaded', init);
})();
