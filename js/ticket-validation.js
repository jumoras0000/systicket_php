/* Gestion des boutons Valider et Refuser pour les tickets */
(function() {
    'use strict';

    /* Affiche un message en bas de l'écran */
    function showMessage(message, type) {
        var toast = document.getElementById('validation-toast');
        if (!toast) {
            toast = document.createElement('div');
            toast.id = 'validation-toast';
            toast.className = 'validation-toast';
            document.body.appendChild(toast);
        }
        toast.textContent = message;
        toast.className = 'validation-toast validation-toast-' + (type || 'success');
        toast.style.display = 'block';
        setTimeout(function() {
            toast.style.display = 'none';
        }, 3000);
    }

    /* Initialise les boutons au chargement de la page */
    function init() {
        var cards = document.querySelectorAll('.project-card');
        
        /* Rend gris les tickets déjà validés ou refusés */
        cards.forEach(function(card, idx) {
            var validations = window.AppData && AppData.get('validations');
            if (validations && validations[idx]) {
                card.style.opacity = '0.5';
            }
        });

        /* Trouve tous les boutons Valider et Refuser (éviter double écoute après contentLoaded) */
        var buttons = document.querySelectorAll('.project-card-footer .btn.btn-success, .project-card-footer .btn.btn-danger');
        
        buttons.forEach(function(btn) {
            if (btn.hasAttribute('data-validation-handler')) return;
            btn.setAttribute('data-validation-handler', 'true');

            var card = btn.closest('.project-card');
            var allCards = document.querySelectorAll('.project-card');
            var cardIndex = Array.prototype.indexOf.call(allCards, card);

            /* Bouton Valider */
            if (btn.textContent.indexOf('Valider') !== -1) {
                btn.addEventListener('click', function(e) {
                    e.preventDefault();
                    var ticketId = card && card.getAttribute('data-ticket-id');
                    var Store = window.Storage || window.AppData;
                    if (Store && ticketId) Store.update('tickets', ticketId, { status: 'validated' });
                    if (window.AppData) {
                        var v = AppData.get('validations') || [];
                        v[cardIndex] = 'validated';
                        AppData.set('validations', v);
                    }
                    showMessage('Ticket validé avec succès.', 'success');
                    if (card) card.style.opacity = '0.5';
                });
            }

            /* Bouton Refuser */
            if (btn.textContent.indexOf('Refuser') !== -1) {
                btn.addEventListener('click', function(e) {
                    e.preventDefault();
                    var ticketId = card && card.getAttribute('data-ticket-id');
                    var Store = window.Storage || window.AppData;
                    if (Store && ticketId) Store.update('tickets', ticketId, { status: 'refused' });
                    if (window.AppData) {
                        var v = AppData.get('validations') || [];
                        v[cardIndex] = 'refused';
                        AppData.set('validations', v);
                    }
                    showMessage('Ticket refusé.', 'error');
                    if (card) card.style.opacity = '0.5';
                });
            }
        });
    }

    /* Démarre quand la page est chargée */
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    window.addEventListener('systicket:contentLoaded', init);
})();
