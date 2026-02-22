/* Gestion du menu latéral et navigation SPA globale - tous les liens internes sans rechargement */
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

    /* Charge une page sans rechargement (navigation SPA) - pushHistory=false pour le bouton Retour */
    function loadPage(href, pushHistory) {
        var url = typeof href === 'string' ? href : (href && href.href);
        if (!url) return;
        if (url.indexOf('connexion') !== -1 || url.indexOf('inscription') !== -1) {
            window.location.href = url;
            return;
        }
        var doPush = pushHistory !== false;
        fetch(url, { headers: { 'X-Requested-With': 'XMLHttpRequest' } })
            .then(function(r) { return r.ok ? r.text() : Promise.reject(new Error('Erreur ' + r.status)); })
            .then(function(html) {
                var parser = new DOMParser();
                var doc = parser.parseFromString(html, 'text/html');
                var newMain = doc.getElementById('main-content');
                var main = document.getElementById('main-content');
                if (!newMain || !main) { window.location.href = url; return; }
                main.innerHTML = newMain.innerHTML;

                // Exécuter les scripts inline du nouveau contenu (window.CLIENT_ID, etc.)
                var scripts = main.querySelectorAll('script');
                for (var i = 0; i < scripts.length; i++) {
                    var oldScript = scripts[i];
                    var newScript = document.createElement('script');
                    if (oldScript.src) {
                        newScript.src = oldScript.src;
                    } else {
                        newScript.textContent = oldScript.textContent;
                    }
                    oldScript.parentNode.replaceChild(newScript, oldScript);
                }

                var newBody = doc.body;
                if (newBody) {
                    var title = doc.querySelector('title');
                    if (title) document.title = title.textContent;
                    var page = newBody.getAttribute('data-page');
                    var role = newBody.getAttribute('data-role');
                    var bodyClass = newBody.className || '';
                    document.body.setAttribute('data-page', page || '');
                    document.body.setAttribute('data-role', role || '');
                    document.body.className = bodyClass;
                }
                var u = new URL(url, window.location.origin);
                if (doPush) window.history.pushState({ url: url }, '', u.pathname + u.search + u.hash);
                setActive((doc.body && doc.body.getAttribute('data-page')) || '');
                closeSidebar();
                document.dispatchEvent(new CustomEvent('systicket:contentLoaded'));
                if (u.hash) {
                    setTimeout(function() {
                        var target = document.querySelector(u.hash);
                        if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }, 100);
                }
            })
            .catch(function() { window.location.href = url; });
    }

    /* Vérifie si un lien doit être intercepté pour navigation SPA */
    function shouldInterceptLink(link) {
        if (!link || !link.href) return false;
        if (link.target === '_blank') return false;
        if (link.hasAttribute('data-no-spa')) return false;
        var href = link.getAttribute('href') || '';
        if (href.indexOf('#') === 0) return false;
        try {
            var base = (window.SYSTICKET && window.SYSTICKET.baseUrl) || '/systicket_php';
            var fullUrl = new URL(link.href, window.location.origin);
            var curUrl = new URL(window.location.href);
            if (fullUrl.origin !== curUrl.origin) return false;
            // Ne pas intercepter les pages auth (connexion, inscription, etc.)
            if (fullUrl.pathname.indexOf('connexion') !== -1 || fullUrl.pathname.indexOf('inscription') !== -1) return false;
            if (fullUrl.pathname.indexOf('mot-de-passe') !== -1) return false;
            // Ne pas intercepter la home
            if (fullUrl.pathname === base || fullUrl.pathname === base + '/') return false;
            // Ne pas intercepter les fichiers statiques (.css, .js, .png, etc.)
            if (/\.(css|js|png|jpg|jpeg|gif|svg|ico|pdf|zip)$/i.test(fullUrl.pathname)) return false;
            // Ne pas intercepter les appels API
            if (fullUrl.pathname.indexOf('/api/') !== -1) return false;
            // Intercepter les liens internes du même base path
            if (fullUrl.pathname.indexOf(base + '/') === 0) return true;
            return false;
        } catch (err) { return false; }
    }

    /* Gestion du clic sur tous les liens internes (navigation SPA) */
    function handleLinkClick(e) {
        var link = e.target && e.target.closest ? e.target.closest('a[href]') : null;
        if (!shouldInterceptLink(link)) return;
        try {
            var fullUrl = new URL(link.href, window.location.origin);
            var curUrl = new URL(window.location.href);
            if (fullUrl.pathname === curUrl.pathname && fullUrl.search === curUrl.search && fullUrl.hash === curUrl.hash) return;
        } catch (err) { return; }
        e.preventDefault();
        loadPage(link.href);
    }

    /* Initialise : toggle mobile, surbrillance, navigation SPA */
    function init() {
        var menu = document.querySelector('.menu-toggle');
        if (menu) menu.addEventListener('click', toggleSidebar);
        var overlay = document.querySelector('.sidebar-overlay');
        if (overlay) overlay.addEventListener('click', closeSidebar);
        var page = document.body.getAttribute('data-page');
        if (page) setActive(page);
        document.removeEventListener('click', handleLinkClick);
        document.addEventListener('click', handleLinkClick);
    }

    /* Bouton Retour du navigateur */
    window.addEventListener('popstate', function(e) {
        var url = (e.state && e.state.url) ? e.state.url : window.location.href;
        loadPage(url, false);
    });

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
    window.addEventListener('systicket:contentLoaded', init);
})();
