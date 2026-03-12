<?php
/**
 * Liste des contrats
 */
?>
<div class="page-header">
    <div class="page-header-left">
        <h1>Contrats</h1>
        <p class="page-subtitle">Enveloppes d'heures, suivi consommation et facturation</p>
    </div>
    <div class="page-header-right">
        <a href="<?= url('contrat-form') ?>" class="btn btn-primary btn-create-contract role-admin-only">+ Créer un contrat</a>
    </div>
</div>

<!-- Résumé -->
<section class="list-summary-cards" aria-label="Résumé des contrats">
    <article class="list-summary-card list-summary-card-primary">
        <span class="list-summary-value" id="contrats-total-hours">—</span>
        <span class="list-summary-label">Heures totales</span>
    </article>
    <article class="list-summary-card list-summary-card-warning">
        <span class="list-summary-value" id="contrats-used-hours">—</span>
        <span class="list-summary-label">Consommées</span>
    </article>
    <article class="list-summary-card list-summary-card-success">
        <span class="list-summary-value" id="contrats-remaining-hours">—</span>
        <span class="list-summary-label">Restantes</span>
    </article>
</section>

<!-- Filtres -->
<section class="filters-section" data-server-filter>
    <div class="filters-bar">
        <input type="search" placeholder="Rechercher un contrat..." class="search-input" id="contrat-search" aria-label="Recherche">
        <select class="filter-select" id="filter-status" data-filter="status" aria-label="Filtrer par statut">
            <option value="">Tous les statuts</option>
            <option value="active">Actif</option>
            <option value="expired">Expiré</option>
            <option value="cancelled">Annulé</option>
        </select>
    </div>
</section>

<!-- Barre d'outils -->
<section class="list-toolbar" aria-label="Barre d'outils">
    <div class="list-toolbar-left">
        <span class="list-results-count"><strong id="contrats-count">0</strong> contrat(s)</span>
    </div>
    <div class="list-toolbar-right">
        <button type="button" class="btn btn-text btn-small section-export-btn" data-target="contrats-table" aria-label="Exporter">📥 Exporter</button>
    </div>
</section>

<!-- Tableau contrats -->
<section class="content-section">
    <div class="table-container">
        <table class="table" id="contrats-table">
            <thead>
                <tr>
                    <th>Référence</th>
                    <th>Projet</th>
                    <th>Client</th>
                    <th>Statut</th>
                    <th>Heures incluses</th>
                    <th>Heures consommées</th>
                    <th>Heures restantes</th>
                    <th>Taux horaire</th>
                    <th>Période</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody id="contrats-tbody">
                <tr class="table-empty-row">
                    <td colspan="10" class="table-empty">Chargement...</td>
                </tr>
            </tbody>
        </table>
    </div>
    <div class="pagination" id="contrats-pagination">
        <button type="button" class="btn btn-text pagination-prev" disabled>Précédent</button>
        <span class="pagination-info">Page 1 sur 1</span>
        <button type="button" class="btn btn-text pagination-next" disabled>Suivant</button>
    </div>
</section>
