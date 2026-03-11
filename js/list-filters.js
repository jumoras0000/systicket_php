/* Filtrage simple des tableaux + persistance sessionStorage
   - Scope: supporte plusieurs blocs de filtres sur une même page
   - Trouve la table associée à un bloc de filtres et applique le filtrage localement
*/
(function() {
    'use strict';

    var STORAGE_KEY = 'systicket:filters';

    function getPageKey() {
        return (window.location.pathname || 'default') + (window.location.search || '');
    }

    function loadStoredFilters() {
        try {
            var raw = sessionStorage.getItem(STORAGE_KEY);
            if (!raw) return {};
            return JSON.parse(raw) || {};
        } catch (e) {
            return {};
        }
    }

    function saveStoredFilters(data) {
        try {
            sessionStorage.setItem(STORAGE_KEY, JSON.stringify(data || {}));
        } catch (e) { /* ignore */ }
    }

    function makeKeyForTable(table) {
        var page = getPageKey();
        var id = table && table.id ? table.id : (table && table.dataset && table.dataset.name ? table.dataset.name : 'table');
        return page + '::' + id;
    }

    function findTableForFiltersContainer(container) {
        if (!container) return null;
        // Try direct table inside the same container
        var table = container.querySelector('table.table');
        if (table) return table;
        // Try to find the nearest content-section sibling (filters often sit before the section)
        var sibling = container.nextElementSibling;
        while (sibling) {
            if (sibling.classList && sibling.classList.contains('content-section')) {
                table = sibling.querySelector('table.table');
                if (table) return table;
            }
            sibling = sibling.nextElementSibling;
        }
        // Also try to look upward for a parent content-section (if filters are inside it)
        var section = container.closest('.content-section');
        if (section) {
            table = section.querySelector('table.table');
            if (table) return table;
        }
        // Fallback: first .table on page
        return document.querySelector('table.table');
    }

    function filterRowsForTable(table, searchInput, selects, countEl) {
        if (!table) return;
        var tbody = table.querySelector('tbody');
        if (!tbody) return;

        var rows = tbody.querySelectorAll('tr.ticket-row, tr.project-row, tr.client-row, tr.contrat-row, tr.time-row, tr.user-row, tr');
        var emptyRow = tbody.querySelector('.table-empty-row, tr.table-empty');

        var searchText = (searchInput && searchInput.value) ? searchInput.value.toLowerCase().trim() : '';

        var filterValues = {};
        selects.forEach(function(sel) {
            var key = sel.getAttribute('data-filter');
            if (key && sel.value) {
                filterValues[key] = sel.value;
            }
        });

        var visibleCount = 0;

        // Pagination: try to detect per-page from URL param only when data-row-index present
        var perPage = 10;
        var params = new URLSearchParams(window.location.search);
        var currentPage = parseInt(params.get('page'), 10) || 1;
        if (currentPage < 1) currentPage = 1;

        rows.forEach(function(row) {
            // skip header/footer rows
            if (row.classList.contains('table-footer') || row.classList.contains('table-empty-row')) return;
            var show = true;

            if (searchText) {
                var rowText = row.textContent.toLowerCase();
                if (rowText.indexOf(searchText) === -1) show = false;
            }

            if (show) {
                for (var key in filterValues) {
                    if (!Object.prototype.hasOwnProperty.call(filterValues, key)) continue;
                    var rowValue = row.getAttribute('data-' + key) || '';
                    if (String(rowValue) !== String(filterValues[key])) {
                        show = false; break;
                    }
                }
            }

            // Pagination based on data-row-index when present
            if (show) {
                var rowIdx = row.getAttribute('data-row-index');
                if (rowIdx !== null && rowIdx !== undefined && rowIdx !== '') {
                    var idx = parseInt(rowIdx, 10);
                    if (!isNaN(idx)) {
                        var pageOfRow = Math.floor(idx / perPage) + 1;
                        if (pageOfRow !== currentPage) show = false;
                    }
                }
            }

            row.style.display = show ? '' : 'none';
            if (show) visibleCount++;
        });

        if (emptyRow) {
            emptyRow.style.display = (visibleCount === 0) ? '' : 'none';
        }
        if (countEl) countEl.textContent = String(visibleCount);
    }

    function initFiltersBlock(container) {
        if (!container) return;

        var searchInput = container.querySelector('.search-input');
        var selects = container.querySelectorAll('select[data-filter]');
        var countEl = container.querySelector('.list-results-count strong') || document.querySelector('.list-results-count strong');
        var table = findTableForFiltersContainer(container);
        if (!table) return;

        // If already initialized, re-apply filters to new table rows (content may have been replaced)
        if (container.dataset.filtersInitialized === '1') {
            filterRowsForTable(table, searchInput, selects, countEl);
            return;
        }
        // Mark initialized to avoid double event bindings
        container.dataset.filtersInitialized = '1';

        // Restore stored filters for this table
        try {
            var storedAll = loadStoredFilters();
            var key = makeKeyForTable(table);
            var stored = storedAll[key] || null;
            if (stored) {
                if (searchInput && stored.search !== undefined) searchInput.value = stored.search;
                if (stored.filters) {
                    selects.forEach(function(sel) {
                        var k = sel.getAttribute('data-filter');
                        if (k && stored.filters[k] !== undefined) sel.value = stored.filters[k];
                    });
                }
            }
        } catch (e) { /* ignore */ }

        var apply = function() {
            filterRowsForTable(table, searchInput, selects, countEl);
            // Persist per-table
            try {
                var raw = loadStoredFilters();
                var key = makeKeyForTable(table);
                raw[key] = { search: searchInput ? searchInput.value : '', filters: {} };
                selects.forEach(function(sel) { var k = sel.getAttribute('data-filter'); if (k) raw[key].filters[k] = sel.value; });
                saveStoredFilters(raw);
            } catch (e) {}
        };

        if (searchInput) searchInput.addEventListener('input', apply);
        selects.forEach(function(sel) { sel.addEventListener('change', apply); });

        // initial apply
        apply();
    }

    function initAll() {
        // Find all filters bars/sections on the page
        var blocks = document.querySelectorAll('.filters-section, .filters-bar');
        if (blocks && blocks.length) {
            blocks.forEach(function(b) { initFiltersBlock(b); });
            return;
        }
        // Fallback: single global filters (legacy)
        var globalContainer = document.body;
        initFiltersBlock(globalContainer);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initAll);
    } else {
        initAll();
    }

    window.addEventListener('systicket:contentLoaded', initAll);

})();
