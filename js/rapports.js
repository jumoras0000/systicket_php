/* Gestion des filtres et export pour les rapports */
(function() {
    'use strict';

    /* Affiche un message de confirmation pour les filtres */
    function showReportFeedback(msg, type) {
        var el = document.querySelector('.reports-period-info');
        if (el) {
            el.innerHTML = '<strong>Période affichée :</strong> ' + msg;
        }
        var toast = document.getElementById('reports-toast');
        if (!toast) {
            toast = document.createElement('div');
            toast.id = 'reports-toast';
            toast.className = 'validation-toast';
            document.body.appendChild(toast);
        }
        toast.textContent = msg;
        toast.className = 'validation-toast validation-toast-' + (type || 'success');
        toast.style.display = 'block';
        setTimeout(function() { toast.style.display = 'none'; }, 2000);
    }

    /* Initialise les filtres et les boutons au chargement de la page */
    function init() {
        /* Restaure les filtres sauvegardés depuis sessionStorage */
        var savedStr = sessionStorage.getItem('rapports_filters');
        var saved = savedStr ? JSON.parse(savedStr) : null;
        if (saved) {
            var from = document.getElementById('report-date-from');
            var to = document.getElementById('report-date-to');
            var period = document.getElementById('report-period');
            if (from && saved.from) from.value = saved.from;
            if (to && saved.to) to.value = saved.to;
            if (period && saved.period) {
                for (var i = 0; i < period.options.length; i++) {
                    if (period.options[i].value === saved.period) {
                        period.selectedIndex = i;
                        break;
                    }
                }
            }
        }
        var applyBtn = document.querySelector('.reports-filter-buttons .btn-primary');
        var resetBtn = document.querySelector('.reports-filter-buttons .btn-text');

        if (applyBtn) {
            applyBtn.addEventListener('click', function() {
                var from = document.getElementById('report-date-from');
                var to = document.getElementById('report-date-to');
                var period = document.getElementById('report-period');
                var periodText = period ? period.options[period.selectedIndex].text : '';
                var range = (from && from.value) ? from.value : '';
                if (to && to.value) range += ' — ' + to.value;
                range = range.trim();
                sessionStorage.setItem('rapports_filters', JSON.stringify({
                    from: from ? from.value : '',
                    to: to ? to.value : '',
                    period: period ? period.value : ''
                }));
                showReportFeedback(range || periodText || 'Filtres appliqués', 'success');
                if (window.updateReports) {
                    window.updateReports();
                } else {
                    window.dispatchEvent(new CustomEvent('systicket:reportsUpdate'));
                }
            });
        }

        if (resetBtn) {
            resetBtn.addEventListener('click', function() {
                var from = document.getElementById('report-date-from');
                var to = document.getElementById('report-date-to');
                var period = document.getElementById('report-period');
                if (from) from.value = '';
                if (to) to.value = '';
                if (period) period.selectedIndex = 0;
                sessionStorage.removeItem('rapports_filters');
                showReportFeedback('Tous les filtres réinitialisés.', 'success');
                if (window.updateReports) {
                    window.updateReports();
                } else {
                    window.dispatchEvent(new CustomEvent('systicket:reportsUpdate'));
                }
            });
        }

        document.querySelectorAll('.reports-section .btn-text.btn-small, .reports-section-header .btn-text').forEach(function(btn) {
            if (!btn.onclick && btn.textContent.indexOf('Exporter') !== -1) {
                btn.addEventListener('click', function() {
                    window.print();
                });
            }
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
    window.addEventListener('systicket:contentLoaded', init);
})();
