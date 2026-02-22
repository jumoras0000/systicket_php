/* Gestion des rôles utilisateurs et permissions - version PHP */
(function() {
    'use strict';
    
    var BASE = (window.SYSTICKET && window.SYSTICKET.baseUrl) || '/systicket_php';
    
    /* Configuration des différents rôles et leurs permissions */
    var rolesConfig = {
        admin: {
            name: 'Administrateur',
            badge: 'admin',
            menuItems: ['dashboard', 'projets', 'tickets', 'contrats', 'temps', 'rapports', 'utilisateurs', 'profil'],
            allowedActions: ['create-ticket', 'edit-ticket', 'create-project', 'edit-project', 'create-contract', 'edit-contract', 'manage-users', 'add-time']
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
        
        var config = rolesConfig[role];
        var body = document.body;
        
        // Ajouter la classe de rôle sur le body
        body.className = body.className.replace(/role-\w+/g, '');
        body.classList.add('role-' + role);
        body.setAttribute('data-role', role);
        
        var userName = document.querySelector('.user-name');
        if (userName) {
            var badge = userName.querySelector('.user-role-badge');
            if (badge) {
                badge.className = 'user-role-badge ' + config.badge;
                badge.textContent = config.name;
            }
        }
        
        // Masquer les éléments du menu selon le rôle
        var menuItems = {
            'contrats': '.nav-item-contrats',
            'tickets': '.nav-item-tickets',
            'temps': '.nav-item-temps',
            'rapports': '.nav-item-rapports',
            'utilisateurs': '.nav-item-utilisateurs',
            'validation': '.nav-item-validation'
        };
        
        Object.keys(menuItems).forEach(function(item) {
            if (!config.menuItems.includes(item)) {
                var elements = document.querySelectorAll(menuItems[item]);
                elements.forEach(function(el) {
                    var navItem = el.closest('.nav-item') || el;
                    navItem.style.display = 'none';
                });
            }
        });
        
        // Masquer les boutons d'action non autorisés via classes CSS role-*
        document.querySelectorAll('.role-admin-only').forEach(function(el) {
            if (role !== 'admin') el.style.display = 'none';
        });
        document.querySelectorAll('.role-admin-collaborateur').forEach(function(el) {
            if (role !== 'admin' && role !== 'collaborateur') el.style.display = 'none';
        });
        document.querySelectorAll('.role-client-only').forEach(function(el) {
            if (role !== 'client') el.style.display = 'none';
        });
        
        // Désactiver boutons Assigner et Dupliquer si non admin
        if (role === 'client') {
            document.querySelectorAll('a[href*="duplicate"]').forEach(function(link) {
                link.style.pointerEvents = 'none';
                link.style.cursor = 'not-allowed';
                link.style.opacity = '0.5';
                link.style.filter = 'grayscale(100%)';
                link.onclick = function(e) { e.preventDefault(); return false; };
            });
        }
        
        if (role === 'collaborateur' || role === 'client') {
            document.querySelectorAll('.btn-manage-users').forEach(function(link) {
                link.style.pointerEvents = 'none';
                link.style.cursor = 'not-allowed';
                link.style.opacity = '0.5';
                link.style.filter = 'grayscale(100%)';
                link.onclick = function(e) { e.preventDefault(); return false; };
            });
        }
    }
    
    // Matrice des permissions : page (data-page) -> rôles autorisés
    var pageAccess = {
        dashboard: ['admin', 'collaborateur', 'client'],
        projets: ['admin', 'collaborateur', 'client'],
        tickets: ['admin', 'collaborateur', 'client'],
        temps: ['admin', 'collaborateur'],
        contrats: ['admin', 'client'],
        rapports: ['admin'],
        utilisateurs: ['admin'],
        profil: ['admin', 'collaborateur', 'client'],
        validation: ['client']
    };

    function checkPageAccess(role) {
        var page = document.body.getAttribute('data-page');
        if (!page) return;
        var allowed = pageAccess[page];
        if (!allowed) return;
        if (page === 'profil') {
            var urlParams = new URLSearchParams(window.location.search);
            if (urlParams.get('id')) allowed = ['admin'];
        }
        if (role === 'client') {
            if (document.getElementById('project-form')) allowed = ['admin', 'collaborateur'];
            if (document.getElementById('ticket-form')) allowed = ['admin', 'collaborateur'];
            if (document.getElementById('contrat-form')) allowed = ['admin'];
        }
        if (allowed.indexOf(role) === -1) {
            var redirect = BASE + '/dashboard';
            if (role === 'client') redirect = BASE + '/ticket-validation';
            window.location.href = redirect;
        }
    }

    function initRole() {
        var role = (window.SYSTICKET && window.SYSTICKET.role) || 'client';
        applyRole(role);
        checkPageAccess(role);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initRole);
    } else {
        initRole();
    }
    document.addEventListener('systicket:contentLoaded', initRole);
})();
