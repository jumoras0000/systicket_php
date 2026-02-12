/* Filtrage simple des tableaux + persistance sessionStorage */
(function() {
    'use strict';

    var STORAGE_KEY = 'systicket:filters';

    function getPageKey() {
        return (window.location.pathname || 'default') + (window.location.search || '');
    }

    function loadStoredFilters() {
        try {
            var raw = sessionStorage.getItem(STORAGE_KEY);
            if (!raw) return null;
            var data = JSON.parse(raw);
            return data[getPageKey()] || null;
        } catch (e) {
            return null;
        }
    }

    function saveFilters(searchText, filterValues) {
        try {
            var raw = sessionStorage.getItem(STORAGE_KEY);
            var data = raw ? JSON.parse(raw) : {};
            data[getPageKey()] = { search: searchText || '', filters: filterValues || {} };
            sessionStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        } catch (e) { /* ignore */ }
    }

    /* Filtre les lignes du tableau */
    function filterTable() {
        var table = document.querySelector('.table');
        if (!table) return;

        var tbody = table.querySelector('tbody');
        if (!tbody) return;

        var rows = tbody.querySelectorAll('tr.ticket-row, tr.project-row, tr.client-row, tr.contrat-row, tr.time-row, tr.user-row');
        var searchInput = document.querySelector('.search-input');
        var selects = document.querySelectorAll('select[data-filter]');
        var emptyRow = tbody.querySelector('.table-empty-row, tr.table-empty');
        var countEl = document.querySelector('.list-results-count strong');

        /* Récupère le texte de recherche */
        var searchText = '';
        if (searchInput) {
            searchText = searchInput.value.toLowerCase().trim();
        }

        /* Récupère les valeurs des sélecteurs */
        var filterValues = {};
        selects.forEach(function(sel) {
            var key = sel.getAttribute('data-filter');
            if (key && sel.value) {
                filterValues[key] = sel.value;
            }
        });

        /* Compte les lignes visibles */
        var visibleCount = 0;

        /* Pagination (tickets, projets) : page courante depuis l'URL */
        var perPage = 10;
        var params = new URLSearchParams(window.location.search);
        var currentPage = parseInt(params.get('page'), 10) || 1;
        if (currentPage < 1) currentPage = 1;

        /* Parcourt toutes les lignes */
        rows.forEach(function(row) {
            var show = true;

            /* Vérifie la recherche */
            if (searchText) {
                var rowText = row.textContent.toLowerCase();
                if (rowText.indexOf(searchText) === -1) {
                    show = false;
                }
            }

            /* Vérifie les filtres */
            for (var key in filterValues) {
                if (!Object.prototype.hasOwnProperty.call(filterValues, key)) continue;
                var rowValue = row.getAttribute('data-' + key);
                if (rowValue !== filterValues[key]) {
                    show = false;
                }
            }

            /* Pagination : n'afficher que les lignes de la page courante */
            var rowIdx = row.getAttribute('data-row-index');
            if (rowIdx !== null && rowIdx !== undefined) {
                var idx = parseInt(rowIdx, 10);
                var pageOfRow = Math.floor(idx / perPage) + 1;
                if (pageOfRow !== currentPage) show = false;
            }

            /* Affiche ou cache la ligne */
            if (show) {
                row.style.display = '';
                visibleCount++;
            } else {
                row.style.display = 'none';
            }
        });

        /* Affiche ou cache le message "aucun résultat" */
        if (emptyRow) {
            if (visibleCount === 0) {
                emptyRow.style.display = '';
            } else {
                emptyRow.style.display = 'none';
            }
        }

        /* Met à jour le compteur */
        if (countEl) {
            countEl.textContent = String(visibleCount);
        }

        /* Persiste en sessionStorage */
        saveFilters(searchText, filterValues);
    }

    /* Initialise les filtres */
    function init() {
        var searchInput = document.querySelector('.search-input');
        var selects = document.querySelectorAll('select[data-filter]');

        /* Restaure les filtres depuis sessionStorage */
        var stored = loadStoredFilters();
        if (stored) {
            if (searchInput && stored.search !== undefined && stored.search !== '') {
                searchInput.value = stored.search;
            }
            if (stored.filters && Object.keys(stored.filters).length) {
                selects.forEach(function(sel) {
                    var key = sel.getAttribute('data-filter');
                    if (key && stored.filters[key]) {
                        sel.value = stored.filters[key];
                    }
                });
            }
        }

        /* Écoute la recherche */
        if (searchInput) {
            searchInput.addEventListener('input', filterTable);
        }

        /* Écoute les sélecteurs */
        selects.forEach(function(sel) {
            sel.addEventListener('change', filterTable);
        });

        /* Applique les filtres au chargement */
        filterTable();
    }

    /* Démarre quand la page est chargée */
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    window.addEventListener('systicket:contentLoaded', init);
})();
