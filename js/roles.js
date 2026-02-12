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
            menuItems: ['dashboard', 'projets', 'validation', 'profil'],
            allowedActions: ['validate-ticket', 'refuse-ticket']
        }
    };
    
    /* Applique le rôle à la page et cache les éléments non autorisés */
    function applyRole(role) {
        if (!role || !rolesConfig[role]) {
            role = 'admin'; 
        }
        
        const config = rolesConfig[role];
        const body = document.body;
        
        // Ajouter la classe de rôle sur le body
        body.className = body.className.replace(/role-\w+/g, '');
        body.classList.add('role-' + role);
        body.setAttribute('data-role', role);
        

        const userName = document.querySelector('.user-name');
        if (userName && !userName.querySelector('.user-role-badge')) {
            const badge = document.createElement('span');
            badge.className = 'user-role-badge ' + config.badge;
            badge.textContent = config.name;
            userName.appendChild(badge);
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
                    el.style.display = 'none';
                });
            }
        });
    }
    
    // Matrice des permissions : page (data-page) -> rôles autorisés (conformément au guide)
    const pageAccess = {
        dashboard: ['admin', 'collaborateur', 'client'],
        projets: ['admin', 'collaborateur', 'client'],
        tickets: ['admin', 'collaborateur'],
        temps: ['admin', 'collaborateur'],
        clients: ['admin'],
        contrats: ['admin'],
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

    document.addEventListener('DOMContentLoaded', initRole);
    window.addEventListener('systicket:contentLoaded', initRole);
})();
