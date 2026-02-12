/* Gestion du menu latéral et navigation entre les pages */
(function() {
    'use strict';

    /* Ouvre ou ferme le menu latéral sur mobile */
    function toggleSidebar() {
        var s = document.querySelector('.sidebar'), o = document.querySelector('.sidebar-overlay');
        if (s && o) { s.classList.toggle('open'); o.classList.toggle('active'); }
    }

    /* Ferme le menu latéral */
    function closeSidebar() {
        var s = document.querySelector('.sidebar'), o = document.querySelector('.sidebar-overlay');
        if (s && o) { s.classList.remove('open'); o.classList.remove('active'); }
    }

    /* Met en surbrillance l'élément du menu correspondant à la page active */
    function setActive(page) {
        var sidebar = document.querySelector('.sidebar');
        if (!sidebar) return;
        sidebar.querySelectorAll('.nav-item').forEach(function(item) { item.classList.remove('active'); });
        var el = sidebar.querySelector('[data-page="' + page + '"]');
        if (el) el.classList.add('active');
    }

    /* Initialise : toggle mobile + surbrillance page active (navigation classique, pas SPA) */
    function init() {
        var menu = document.querySelector('.menu-toggle');
        if (menu) menu.addEventListener('click', toggleSidebar);
        var overlay = document.querySelector('.sidebar-overlay');
        if (overlay) overlay.addEventListener('click', closeSidebar);
        var page = document.body.getAttribute('data-page');
        if (page) setActive(page);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
    window.addEventListener('systicket:contentLoaded', init);
})();
