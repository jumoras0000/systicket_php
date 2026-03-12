/* Filtrage côté client des tableaux + persistance sessionStorage
   CORRIGÉ - Version 2.0
   - Recherche correcte du tableau associé par ID
   - Sélecteurs de lignes précis
   - Synchronisation avec le filtrage serveur
   - Compteur de résultats mis à jour
*/
(function() {
    'use strict';

    var STORAGE_KEY = 'systicket:filters';
    var DEBUG = false; // Mettre à true pour voir les logs

    function log(msg, data) {
        if (DEBUG) console.log('[ListFilters]', msg, data || '');
    }

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
        } catch (e) { 
            log('Erreur sauvegarde filtres', e);
        }
    }

    function makeKeyForTable(table) {
        var page = getPageKey();
        var id = table && table.id ? table.id : (table && table.dataset && table.dataset.name ? table.dataset.name : 'table');
        return page + '::' + id;
    }

    /**
     * CORRECTION: Recherche améliorée du tableau associé aux filtres
     * Utilise l'ID du tableau pour une correspondance exacte
     */
    function findTableForFiltersContainer(container) {
        if (!container) return null;

        // 1. Chercher par attribut data-table-target sur le container de filtres
        var tableId = container.getAttribute('data-table-target');
        if (tableId) {
            var targetTable = document.getElementById(tableId);
            if (targetTable) {
                log('Tableau trouvé par data-table-target', tableId);
                return targetTable;
            }
        }

        // 2. Chercher le tableau directement dans le container
        var table = container.querySelector('table.table');
        if (table) {
            log('Tableau trouvé dans container');
            return table;
        }

        // 3. Chercher dans la section suivante (structure commune)
        var nextSection = container.nextElementSibling;
        while (nextSection) {
            if (nextSection.classList && nextSection.classList.contains('content-section')) {
                table = nextSection.querySelector('table.table');
                if (table) {
                    log('Tableau trouvé dans section suivante');
                    return table;
                }
            }
            // Chercher aussi dans table-container directement
            if (nextSection.classList && nextSection.classList.contains('table-container')) {
                table = nextSection.querySelector('table.table');
                if (table) {
                    log('Tableau trouvé dans table-container suivant');
                    return table;
                }
            }
            nextSection = nextSection.nextElementSibling;
        }

        // 4. Chercher dans le parent content-section
        var section = container.closest('.content-section');
        if (section) {
            table = section.querySelector('table.table');
            if (table) {
                log('Tableau trouvé dans section parente');
                return table;
            }
        }

        // 5. Utiliser un mapping spécifique par page pour plus de précision
        var page = document.body.getAttribute('data-page');
        var tableMapping = {
            'tickets': 'tickets-table',
            'projets': 'projets-table',
            'temps': 'temps-table',
            'utilisateurs': 'users-table',
            'contrats': 'contrats-table'
        };

        if (page && tableMapping[page]) {
            table = document.getElementById(tableMapping[page]);
            if (table) {
                log('Tableau trouvé par mapping page', tableMapping[page]);
                return table;
            }
        }

        // 6. Fallback: premier .table sur la page
        log('ATTENTION: Utilisation du fallback - premier tableau trouvé');
        return document.querySelector('table.table');
    }

    /**
     * CORRECTION: Sélecteurs de lignes précis par type
     */
    function getRowsForTable(table) {
        if (!table) return [];
        var tbody = table.querySelector('tbody');
        if (!tbody) return [];

        // CORRIGÉ: Sélecteurs plus précis sans le 'tr' générique
        var rows = tbody.querySelectorAll(
            'tr.ticket-row, tr.project-row, tr.client-row, tr.contrat-row, tr.time-row, tr.user-row'
        );

        // Si aucune ligne avec classe spécifique, prendre toutes les lignes sauf .table-empty
        if (rows.length === 0) {
            rows = tbody.querySelectorAll('tr:not(.table-empty):not(.table-empty-row):not(.table-footer)');
        }

        return Array.prototype.slice.call(rows);
    }

    /**
     * CORRECTION: Extraction du texte complet incluant tous les attributs data-*
     */
    function getRowText(row) {
        var text = row.textContent || '';
        
        // Ajouter les valeurs des attributs data-* pour un filtrage plus précis
        var attrs = ['status', 'priority', 'type', 'role', 'project', 'client', 'project_id', 'client_id'];
        attrs.forEach(function(attr) {
            var val = row.getAttribute('data-' + attr);
            if (val) text += ' ' + val;
        });

        return text.toLowerCase().trim();
    }

    /**
     * Fonction principale de filtrage
     */
    function filterRowsForTable(table, searchInput, selects, countEl) {
        if (!table) {
            log('ERREUR: Tableau non trouvé pour le filtrage');
            return;
        }

        var tbody = table.querySelector('tbody');
        if (!tbody) return;

        var rows = getRowsForTable(table);
        var emptyRow = tbody.querySelector('.table-empty-row, tr.table-empty');

        // CORRIGÉ: Récupération correcte du texte de recherche
        var searchText = (searchInput && searchInput.value) ? searchInput.value.toLowerCase().trim() : '';

        // Collecter les filtres des selects
        var filters = {};
        if (selects && selects.length) {
            selects.forEach(function(sel) {
                var filterKey = sel.getAttribute('data-filter') || sel.id.replace('filter-', '');
                var filterValue = sel.value;
                if (filterValue) {
                    filters[filterKey] = filterValue;
                }
            });
        }

        log('Filtrage avec recherche:', searchText);
        log('Filtres actifs:', filters);

        var visibleCount = 0;
        rows.forEach(function(row) {
            var show = true;

            // Filtrage par texte de recherche
            if (searchText && show) {
                var rowText = getRowText(row);
                show = rowText.indexOf(searchText) !== -1;
            }

            // Filtrage par selects
            if (show && Object.keys(filters).length > 0) {
                Object.keys(filters).forEach(function(key) {
                    if (!show) return;
                    var rowValue = row.getAttribute('data-' + key);
                    if (rowValue !== filters[key]) {
                        show = false;
                    }
                });
            }

            // Afficher ou masquer la ligne
            if (show) {
                row.style.display = '';
                visibleCount++;
            } else {
                row.style.display = 'none';
            }
        });

        // CORRIGÉ: Mise à jour du compteur de résultats
        if (countEl) {
            countEl.textContent = visibleCount;
        }

        // Afficher/masquer la ligne "vide"
        if (emptyRow) {
            if (visibleCount === 0 && (searchText || Object.keys(filters).length > 0)) {
                emptyRow.style.display = '';
                var td = emptyRow.querySelector('td');
                if (td) td.textContent = 'Aucun résultat trouvé.';
            } else if (visibleCount === 0) {
                emptyRow.style.display = '';
            } else {
                emptyRow.style.display = 'none';
            }
        }

        log('Lignes visibles:', visibleCount + '/' + rows.length);

        // Sauvegarder les filtres
        var key = makeKeyForTable(table);
        var stored = loadStoredFilters();
        stored[key] = {
            search: searchText,
            filters: filters
        };
        saveStoredFilters(stored);
    }

    /**
     * Initialisation des filtres pour un container donné
     */
    function initFiltersForContainer(container) {
        if (!container) return;

        // Skip containers handled by server-side filtering in app.js
        if (container.hasAttribute('data-server-filter') || container.closest('[data-server-filter]')) {
            log('Container a data-server-filter, filtrage client-side ignoré');
            return;
        }

        var table = findTableForFiltersContainer(container);
        if (!table) {
            log('ERREUR: Impossible de trouver le tableau pour ce container de filtres');
            return;
        }

        log('Initialisation des filtres pour tableau:', table.id || 'sans-id');

        // Trouver les éléments de filtrage
        var searchInput = container.querySelector('input[type="search"], .search-input');
        var selects = container.querySelectorAll('select.filter-select, select[data-filter]');
        
        // Trouver le compteur (peut être dans le container ou dans la page)
        var page = document.body.getAttribute('data-page');
        var counterId = page ? page + 's-count' : null;
        var countEl = counterId ? document.getElementById(counterId) : null;
        
        if (!countEl) {
            // Chercher dans le container ou à proximité
            countEl = container.querySelector('.list-results-count strong');
            if (!countEl) {
                var toolbar = document.querySelector('.list-toolbar');
                if (toolbar) countEl = toolbar.querySelector('.list-results-count strong');
            }
        }

        // Charger les filtres sauvegardés
        var key = makeKeyForTable(table);
        var stored = loadStoredFilters();
        var savedFilters = stored[key];

        if (savedFilters) {
            if (searchInput && savedFilters.search) {
                searchInput.value = savedFilters.search;
            }
            if (savedFilters.filters && selects.length) {
                selects.forEach(function(sel) {
                    var filterKey = sel.getAttribute('data-filter') || sel.id.replace('filter-', '');
                    if (savedFilters.filters[filterKey]) {
                        sel.value = savedFilters.filters[filterKey];
                    }
                });
            }
        }

        // Fonction de filtrage
        function applyFilters() {
            filterRowsForTable(table, searchInput, selects, countEl);
        }

        // Attacher les événements
        if (searchInput) {
            // Utiliser debounce pour la recherche
            var debounceTimer;
            searchInput.addEventListener('input', function() {
                clearTimeout(debounceTimer);
                debounceTimer = setTimeout(applyFilters, 300);
            });
            log('Événement attaché: input sur recherche');
        }

        if (selects.length) {
            selects.forEach(function(sel) {
                sel.addEventListener('change', applyFilters);
            });
            log('Événements attachés: change sur', selects.length, 'selects');
        }

        // Appliquer les filtres sauvegardés au chargement
        if (savedFilters && (savedFilters.search || Object.keys(savedFilters.filters || {}).length > 0)) {
            setTimeout(applyFilters, 100); // Petit délai pour que le DOM soit prêt
        }
    }

    /**
     * Initialisation globale
     */
    function init() {
        log('=== Initialisation des filtres ===');
        
        // Trouver tous les containers de filtres
        var containers = document.querySelectorAll('.filters-section, .filters-bar, [data-filters]');
        
        if (containers.length === 0) {
            log('Aucun container de filtres trouvé');
            return;
        }

        log('Containers de filtres trouvés:', containers.length);

        containers.forEach(function(container, index) {
            log('Initialisation container', index + 1);
            initFiltersForContainer(container);
        });

        // Bouton de réinitialisation (si présent)
        var resetBtn = document.querySelector('.filters-reset, [data-filter-reset]');
        if (resetBtn) {
            resetBtn.addEventListener('click', function() {
                // Réinitialiser tous les champs
                containers.forEach(function(container) {
                    var searchInput = container.querySelector('input[type="search"], .search-input');
                    var selects = container.querySelectorAll('select.filter-select, select[data-filter]');
                    
                    if (searchInput) searchInput.value = '';
                    selects.forEach(function(sel) { sel.selectedIndex = 0; });
                    
                    // Réappliquer le filtrage (tout afficher)
                    initFiltersForContainer(container);
                });

                // Effacer le storage
                sessionStorage.removeItem(STORAGE_KEY);
                log('Filtres réinitialisés');
            });
        }
    }

    // Initialiser au chargement du DOM
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Ré-initialiser après le chargement de contenu dynamique
    document.addEventListener('systicket:contentLoaded', function() {
        log('=== Ré-initialisation après chargement contenu ===');
        init();
    });

    // Exposer une fonction publique pour forcer la ré-initialisation
    window.SysticketFilters = {
        reinit: init,
        debug: function(enabled) {
            DEBUG = enabled;
            log('Mode debug:', DEBUG ? 'activé' : 'désactivé');
        }
    };

})();