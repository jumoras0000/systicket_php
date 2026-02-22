/* Validation côté client des formulaires - version PHP (pas de persistance localStorage) */
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

    /* Validation avant soumission - empêche l'envoi si invalide */
    function handleFormValidation(e) {
        var form = e.target;
        // Ne pas interférer avec les formulaires gérés par app.js (ceux avec data-entity ou des IDs spécifiques)
        if (form.getAttribute('data-no-validate')) return;
        if (!validate(form)) {
            e.preventDefault();
            e.stopImmediatePropagation();
        }
    }

    function init() {
        document.querySelectorAll('form:not([data-no-validate])').forEach(function(form) {
            form.removeEventListener('submit', handleFormValidation);
            form.addEventListener('submit', handleFormValidation);
        });
    }

    // Export pour usage externe
    window.SysticketValidation = {
        validate: validate,
        showError: showError,
        clearErrors: clearErrors,
        showToast: showToast
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
    document.addEventListener('systicket:contentLoaded', init);
})();
