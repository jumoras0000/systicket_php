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
        if (!window.AppData || !window.Storage) {
            setTimeout(init, 100);
            return;
        }
        
        var cards = document.querySelectorAll('.project-card[data-ticket-id]');
        var tickets = AppData.get('tickets') || [];
        var validations = AppData.get('validations') || [];
        
        /* Rend gris les tickets déjà validés ou refusés et désactive les boutons */
        cards.forEach(function(card) {
            var ticketId = card.getAttribute('data-ticket-id');
            if (!ticketId) return;
            
            var ticket = tickets.find(function(t) { return String(t._id) === String(ticketId); });
            if (!ticket) return;
            
            var ticketIndex = tickets.indexOf(ticket);
            var validationStatus = validations[ticketIndex] || ticket.status;
            
            if (validationStatus === 'validated' || validationStatus === 'refused' || ticket.status === 'validated' || ticket.status === 'refused') {
                card.style.opacity = '0.5';
                var buttons = card.querySelectorAll('.btn-success, .btn-danger');
                buttons.forEach(function(btn) {
                    btn.disabled = true;
                    btn.style.opacity = '0.5';
                    btn.style.cursor = 'not-allowed';
                });
            }
        });

        /* Trouve tous les boutons Valider et Refuser (éviter double écoute après contentLoaded) */
        var buttons = document.querySelectorAll('.project-card-footer .btn.btn-success, .project-card-footer .btn.btn-danger');
        
        buttons.forEach(function(btn) {
            if (btn.hasAttribute('data-validation-handler') || btn.disabled) return;
            btn.setAttribute('data-validation-handler', 'true');

            var card = btn.closest('.project-card');
            if (!card) return;
            
            var ticketId = card.getAttribute('data-ticket-id');
            if (!ticketId) return;

            /* Bouton Valider */
            if (btn.textContent.indexOf('Valider') !== -1 || btn.textContent.indexOf('✅') !== -1) {
                btn.addEventListener('click', function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    if (btn.disabled) return;
                    
                    var Store = window.Storage || window.AppData;
                    if (!Store) {
                        showMessage('Erreur : Storage non disponible.', 'error');
                        return;
                    }
                    
                    var tickets = AppData.get('tickets') || [];
                    var ticket = tickets.find(function(t) { return String(t._id) === String(ticketId); });
                    if (!ticket) {
                        showMessage('Erreur : Ticket introuvable.', 'error');
                        return;
                    }
                    
                    var ticketIndex = tickets.indexOf(ticket);
                    Store.update('tickets', ticketId, { status: 'validated' });
                    
                    var v = AppData.get('validations') || [];
                    while (v.length <= ticketIndex) v.push(null);
                    v[ticketIndex] = 'validated';
                    AppData.set('validations', v);
                    
                    showMessage('Ticket validé avec succès.', 'success');
                    card.style.opacity = '0.5';
                    btn.disabled = true;
                    btn.style.opacity = '0.5';
                    btn.style.cursor = 'not-allowed';
                    
                    var refuseBtn = card.querySelector('.btn-danger');
                    if (refuseBtn) {
                        refuseBtn.disabled = true;
                        refuseBtn.style.opacity = '0.5';
                        refuseBtn.style.cursor = 'not-allowed';
                    }
                    
                    setTimeout(function() {
                        if (window.updateValidationPage) {
                            window.updateValidationPage();
                        }
                        setTimeout(function() {
                            document.dispatchEvent(new CustomEvent('systicket:contentLoaded'));
                        }, 100);
                    }, 500);
                });
            }

            /* Bouton Refuser */
            if (btn.textContent.indexOf('Refuser') !== -1 || btn.textContent.indexOf('❌') !== -1) {
                btn.addEventListener('click', function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    if (btn.disabled) return;
                    
                    var Store = window.Storage || window.AppData;
                    if (!Store) {
                        showMessage('Erreur : Storage non disponible.', 'error');
                        return;
                    }
                    
                    var tickets = AppData.get('tickets') || [];
                    var ticket = tickets.find(function(t) { return String(t._id) === String(ticketId); });
                    if (!ticket) {
                        showMessage('Erreur : Ticket introuvable.', 'error');
                        return;
                    }
                    
                    var ticketIndex = tickets.indexOf(ticket);
                    Store.update('tickets', ticketId, { status: 'refused' });
                    
                    var v = AppData.get('validations') || [];
                    while (v.length <= ticketIndex) v.push(null);
                    v[ticketIndex] = 'refused';
                    AppData.set('validations', v);
                    
                    showMessage('Ticket refusé.', 'error');
                    card.style.opacity = '0.5';
                    btn.disabled = true;
                    btn.style.opacity = '0.5';
                    btn.style.cursor = 'not-allowed';
                    
                    var validateBtn = card.querySelector('.btn-success');
                    if (validateBtn) {
                        validateBtn.disabled = true;
                        validateBtn.style.opacity = '0.5';
                        validateBtn.style.cursor = 'not-allowed';
                    }
                    
                    setTimeout(function() {
                        if (window.updateValidationPage) {
                            window.updateValidationPage();
                        }
                        setTimeout(function() {
                            document.dispatchEvent(new CustomEvent('systicket:contentLoaded'));
                        }, 100);
                    }, 500);
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
