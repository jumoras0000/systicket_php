<?php
/**
 * Liste des projets
 */
?>
<!-- En-tête -->
<div class="page-header">
    <div class="page-header-left">
        <h1>Projets</h1>
        <p class="page-subtitle">Gérez vos projets, jalons et livrables</p>
    </div>
    <div class="page-header-right">
        <a href="<?= url('projet-form') ?>" class="btn btn-primary btn-create-project role-admin-collaborateur">+ Créer un projet</a>
    </div>
</div>

<!-- Résumé -->
<section class="list-summary-cards" aria-label="Résumé des projets">
    <article class="list-summary-card list-summary-card-success">
        <span class="list-summary-value" id="projets-active">—</span>
        <span class="list-summary-label">Actifs</span>
    </article>
    <article class="list-summary-card list-summary-card-warning">
        <span class="list-summary-value" id="projets-paused">—</span>
        <span class="list-summary-label">En pause</span>
    </article>
    <article class="list-summary-card list-summary-card-muted">
        <span class="list-summary-value" id="projets-completed">—</span>
        <span class="list-summary-label">Terminés</span>
    </article>
</section>

<!-- Barre d'outils -->
<section class="list-toolbar" aria-label="Barre d'outils">
    <div class="list-toolbar-left">
        <span class="list-results-count"><strong id="projets-count">0</strong> projet(s) affiché(s)</span>
    </div>
    <div class="list-toolbar-right">
        <button type="button" class="btn btn-text btn-small" onclick="window.print();" aria-label="Exporter / imprimer">📥 Exporter</button>
    </div>
</section>

<!-- Filtres -->
<section class="filters-section">
    <div class="filters-bar">
        <input type="search" placeholder="Rechercher un projet..." class="search-input" id="projet-search">
        <select class="filter-select" id="filter-client" data-filter="client">
            <option value="">Tous les clients</option>
        </select>
        <select class="filter-select" id="filter-status" data-filter="status">
            <option value="">Tous les statuts</option>
            <option value="active">Actif</option>
            <option value="paused">En pause</option>
            <option value="completed">Terminé</option>
        </select>
    </div>
</section>

<!-- Tableau projets -->
<section class="content-section">
    <div class="table-container">
        <table class="table" id="projets-table">
            <thead>
                <tr>
                    <th>Projet</th>
                    <th>Client</th>
                    <th>Statut</th>
                    <th>Tickets</th>
                    <th>Heures</th>
                    <th>Progression</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody id="projets-tbody">
                <tr class="table-empty-row">
                    <td colspan="7">Chargement des projets...</td>
                </tr>
            </tbody>
        </table>
    </div>
    <div class="pagination" id="projets-pagination">
        <button type="button" class="btn btn-text pagination-prev" disabled>Précédent</button>
        <span class="pagination-info">Page 1 sur 1</span>
        <button type="button" class="btn btn-text pagination-next" disabled>Suivant</button>
    </div>
</section>
