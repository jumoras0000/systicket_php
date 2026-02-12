/* Gestion du bouton de soumission des formulaires de connexion */
(function() {
    'use strict';

    /* Initialise les événements sur les formulaires d'authentification */
    function init() {
        var forms = document.querySelectorAll('.auth-form');
        forms.forEach(function(form) {
            /* Change le texte du bouton pendant l'envoi */
            form.addEventListener('submit', function() {
                var btn = form.querySelector('.auth-btn-primary, #auth-submit-btn');
                if (btn) {
                    btn.disabled = true;
                    btn.textContent = btn.textContent.replace(/Se connecter|Créer mon compte|Envoyer le lien/, 'Envoi en cours...');
                    setTimeout(function() {
                        btn.disabled = false;
                        if (form.id === 'login-form') btn.textContent = 'Se connecter';
                        else if (form.id === 'register-form') btn.textContent = 'Créer mon compte';
                        else if (form.id === 'reset-form') btn.textContent = 'Envoyer le lien';
                    }, 1500);
                }
            });
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
