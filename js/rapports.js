/* Gestion des filtres et export pour les rapports */
(function() {
    'use strict';

    var _rapportsBound = new WeakSet();

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

    /* Auto-set date ranges based on period selection */
    function setDateRange(periodValue) {
        var from = document.getElementById('report-date-from');
        var to = document.getElementById('report-date-to');
        if (!from || !to) return;
        var now = new Date();
        var y = now.getFullYear();
        var m = now.getMonth();
        switch (periodValue) {
            case 'Mois':
                from.value = y + '-' + String(m + 1).padStart(2, '0') + '-01';
                to.value = now.toISOString().split('T')[0];
                break;
            case 'Trimestre':
                var qStart = m - (m % 3);
                from.value = y + '-' + String(qStart + 1).padStart(2, '0') + '-01';
                to.value = now.toISOString().split('T')[0];
                break;
            case 'Année':
                from.value = y + '-01-01';
                to.value = now.toISOString().split('T')[0];
                break;
            case 'custom':
                // Don't change dates, let user choose
                break;
        }
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
                    if (period.options[i].value === saved.period || period.options[i].text === saved.period) {
                        period.selectedIndex = i;
                        break;
                    }
                }
            }
        }

        // Period selector auto-date
        var periodSel = document.getElementById('report-period');
        if (periodSel && !_rapportsBound.has(periodSel)) {
            _rapportsBound.add(periodSel);
            periodSel.addEventListener('change', function() {
                setDateRange(periodSel.value || periodSel.options[periodSel.selectedIndex].text);
            });
        }

        var applyBtn = document.getElementById('report-apply');
        var resetBtn = document.getElementById('report-reset');

        if (applyBtn && !_rapportsBound.has(applyBtn)) {
            _rapportsBound.add(applyBtn);
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
                    period: period ? (period.value || periodText) : ''
                }));
                showReportFeedback(range || periodText || 'Filtres appliqués', 'success');
                if (window.updateReports) {
                    window.updateReports();
                }
            });
        }

        if (resetBtn && !_rapportsBound.has(resetBtn)) {
            _rapportsBound.add(resetBtn);
            resetBtn.addEventListener('click', function() {
                var from = document.getElementById('report-date-from');
                var to = document.getElementById('report-date-to');
                var period = document.getElementById('report-period');
                if (period) period.selectedIndex = 0;
                // Reset to current month
                setDateRange('Mois');
                sessionStorage.removeItem('rapports_filters');
                showReportFeedback('Filtres réinitialisés — Période du mois en cours.', 'success');
                if (window.updateReports) {
                    window.updateReports();
                }
            });
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
    document.addEventListener('systicket:contentLoaded', init);
})();
