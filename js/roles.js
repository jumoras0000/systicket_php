/* Gestion des rôles utilisateurs et permissions */
(function() {
    'use strict';
    
    /* Configuration des différents rôles et leurs permissions */
    const rolesConfig = {
        admin: {
            name: 'Administrateur',
            badge: 'admin',
            menuItems: ['dashboard', 'projets', 'tickets', 'clients', 'contrats', 'temps', 'rapports', 'utilisateurs', 'profil'],
            allowedActions: ['create-ticket', 'edit-ticket', 'create-project', 'edit-project', 'create-client', 'edit-client', 'create-contract', 'edit-contract', 'manage-users', 'add-time']
        },
        collaborateur: {
            name: 'Collaborateur',
            badge: 'collaborateur',
            menuItems: ['dashboard', 'projets', 'tickets', 'temps', 'profil'],
            allowedActions: ['create-ticket', 'edit-ticket', 'create-project', 'edit-project', 'add-time']
        },
        client: {
            name: 'Client',
            badge: 'client',
            menuItems: ['dashboard', 'projets', 'tickets', 'contrats', 'validation', 'profil'],
            allowedActions: ['validate-ticket', 'refuse-ticket']
        }
    };
    
    /* Applique le rôle à la page et cache les éléments non autorisés */
    function applyRole(role) {
        if (!role || !rolesConfig[role]) {
            role = 'client';
        }
        
        const config = rolesConfig[role];
        const body = document.body;
        
        // Ajouter la classe de rôle sur le body
        body.className = body.className.replace(/role-\w+/g, '');
        body.classList.add('role-' + role);
        body.setAttribute('data-role', role);
        

        const userName = document.querySelector('.user-name');
        if (userName) {
            let badge = userName.querySelector('.user-role-badge');
            if (badge) {
                badge.className = 'user-role-badge ' + config.badge;
                badge.textContent = config.name;
            } else {
                badge = document.createElement('span');
                badge.className = 'user-role-badge ' + config.badge;
                badge.textContent = config.name;
                userName.appendChild(badge);
            }
        }
        
        // Masquer les éléments du menu selon le rôle
        const menuItems = {
            'clients': '.nav-item-clients, a[href*="clients.html"]',
            'contrats': '.nav-item-contrats, a[href*="contrats.html"]',
            'tickets': '.nav-item-tickets, a[href*="tickets.html"]',
            'temps': '.nav-item-temps, a[href*="temps.html"]',
            'rapports': '.nav-item-rapports, a[href*="rapports.html"]',
            'utilisateurs': '.nav-item-utilisateurs, a[href*="utilisateurs.html"]',
            'validation': '.nav-item-validation, a[href*="ticket-validation.html"]'
        };
        
        // Masquer les éléments non autorisés
        Object.keys(menuItems).forEach(function(item) {
            if (!config.menuItems.includes(item)) {
                const elements = document.querySelectorAll(menuItems[item]);
                elements.forEach(function(el) {
                    const navItem = el.closest('.nav-item');
                    if (navItem) {
                        navItem.style.display = 'none';
                    }
                });
            }
        });
        
        // Masquer les boutons d'action non autorisés
        const actionButtons = {
            'create-ticket': 'a[href*="ticket-form.html"], .btn-create-ticket',
            'edit-ticket': 'a[href*="ticket-form.html?id"], .btn-edit-ticket',
            'create-project': 'a[href*="projet-form.html"], .btn-create-project',
            'edit-project': 'a[href*="projet-form.html?id"], .btn-edit-project',
            'create-client': 'a[href*="client-form.html"], .btn-create-client',
            'edit-client': 'a[href*="client-form.html?id"], .btn-edit-client',
            'create-contract': 'a[href*="contrat-form.html"], .btn-create-contract',
            'edit-contract': 'a[href*="contrat-form.html?id"], .btn-edit-contract',
            'manage-users': 'a[href*="utilisateurs.html"], a[href*="user-form.html"], .btn-manage-users',
            'add-time': 'a[href*="temps.html"]'
        };
        
        Object.keys(actionButtons).forEach(function(action) {
            if (!config.allowedActions.includes(action)) {
                const elements = document.querySelectorAll(actionButtons[action]);
                elements.forEach(function(el) {
                    // Exception : boutons Assigner et Dupliquer sont grisés au lieu de masqués
                    if (el.classList.contains('btn-manage-users') || el.getAttribute('href') && el.getAttribute('href').indexOf('duplicate') !== -1) {
                        el.style.pointerEvents = 'none';
                        el.style.cursor = 'not-allowed';
                        el.style.opacity = '0.5';
                        el.style.filter = 'grayscale(100%)';
                        el.setAttribute('data-disabled', 'true');
                        el.removeAttribute('href');
                        el.onclick = function(e) { e.preventDefault(); return false; };
                    } else {
                        el.style.display = 'none';
                    }
                });
            }
        });
        
        // Désactiver spécifiquement les boutons Assigner et Dupliquer selon le rôle
        if (role === 'client') {
            const duplicateLinks = document.querySelectorAll('a[href*="duplicate"]');
            duplicateLinks.forEach(function(link) {
                link.style.pointerEvents = 'none';
                link.style.cursor = 'not-allowed';
                link.style.opacity = '0.5';
                link.style.filter = 'grayscale(100%)';
                link.setAttribute('data-disabled', 'true');
                link.removeAttribute('href');
                link.onclick = function(e) { e.preventDefault(); return false; };
            });
        }
        
        if (role === 'collaborateur' || role === 'client') {
            const assignLinks = document.querySelectorAll('.btn-manage-users');
            assignLinks.forEach(function(link) {
                link.style.pointerEvents = 'none';
                link.style.cursor = 'not-allowed';
                link.style.opacity = '0.5';
                link.style.filter = 'grayscale(100%)';
                link.setAttribute('data-disabled', 'true');
                link.removeAttribute('href');
                link.onclick = function(e) { e.preventDefault(); return false; };
            });
        }
    }
    
    // Matrice des permissions : page (data-page) -> rôles autorisés (conformément au guide)
    const pageAccess = {
        dashboard: ['admin', 'collaborateur', 'client'],
        projets: ['admin', 'collaborateur', 'client'],
        tickets: ['admin', 'collaborateur', 'client'],
        temps: ['admin', 'collaborateur'],
        clients: ['admin'],
        contrats: ['admin', 'client'],
        rapports: ['admin'],
        utilisateurs: ['admin'],
        profil: ['admin', 'collaborateur', 'client'],
        validation: ['client']
    };

    function checkPageAccess(role) {
        const page = document.body.getAttribute('data-page');
        if (!page) return;
        var allowed = pageAccess[page];
        if (!allowed) return;
        // Profil avec ?id= (vue détail d'un autre utilisateur) : admin uniquement
        if (page === 'profil') {
            var urlParams = new URLSearchParams(window.location.search);
            if (urlParams.get('id')) allowed = ['admin'];
        }
        // Client : pas d'accès aux formulaires de création/édition projet, ticket et contrat
        if (role === 'client') {
            if (document.getElementById('project-form')) allowed = ['admin', 'collaborateur'];
            if (document.getElementById('ticket-form')) allowed = ['admin', 'collaborateur'];
            if (document.getElementById('contrat-form')) allowed = ['admin'];
        }
        if (allowed.indexOf(role) === -1) {
            var redirect = 'dashboard.html';
            if (role === 'client') redirect = 'ticket-validation.html';
            window.location.href = redirect + '?role=' + encodeURIComponent(role);
        }
    }

    function initRole() {
        /* Lire le rôle depuis URL, localStorage (inscription) ou défaut */
        const urlParams = new URLSearchParams(window.location.search);
        const roleFromUrl = urlParams.get('role');
        const roleFromStorage = (typeof localStorage !== 'undefined') ? localStorage.getItem('systicket_role') : null;
        const role = roleFromUrl || roleFromStorage || 'client';
        if (roleFromUrl && typeof localStorage !== 'undefined') localStorage.setItem('systicket_role', role);
        applyRole(role);
        checkPageAccess(role);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initRole);
    } else {
        initRole();
    }
    window.addEventListener('systicket:contentLoaded', initRole);
})();
