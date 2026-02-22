/* Gestion des boutons Valider et Refuser pour les tickets - version PHP/API */
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

    /* Les boutons de validation sont maintenant gérés via onclick dans app.js
       (window.validateTicket et window.refuseTicket).
       Ce fichier fournit uniquement le toast de feedback. */
    window.showValidationMessage = showMessage;

    /* Démarre quand la page est chargée */
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {});
    }
})();
