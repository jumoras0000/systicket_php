<?php
/**
 * Liste des tickets
 */
$role = Auth::role();
?>
<div class="page-header">
    <div class="page-header-left">
        <h1>Tickets</h1>
        <p class="page-subtitle">Gérez tous vos tickets</p>
    </div>
    <div class="page-header-right">
        <a href="<?= url('ticket-form') ?>" class="btn btn-primary btn-create-ticket role-admin-collaborateur">+ Créer un ticket</a>
    </div>
</div>

<!-- Barre d'outils -->
<section class="list-toolbar" aria-label="Barre d'outils liste">
    <div class="list-toolbar-left">
        <span class="list-results-count"><strong id="tickets-count">0</strong> ticket(s) affiché(s)</span>
    </div>
    <div class="list-toolbar-right">
        <button type="button" class="btn btn-text btn-small" onclick="window.print();" aria-label="Exporter / imprimer">📥 Exporter</button>
    </div>
</section>

<!-- Section validation client (cartes) -->
<section class="content-section" id="client-validation-section" style="display:none;">
    <div class="page-header">
        <div class="page-header-left">
            <h2>Tickets à valider</h2>
            <p class="page-subtitle">Validez ou refusez les tickets facturables pour confirmer les heures</p>
        </div>
    </div>
    <section class="list-summary-cards" aria-label="Résumé validation">
        <article class="list-summary-card list-summary-card-warning">
            <span class="list-summary-value" id="tickets-validation-count">0</span>
            <span class="list-summary-label">À valider</span>
        </article>
        <article class="list-summary-card list-summary-card-primary">
            <span class="list-summary-value" id="tickets-validation-total">0.00 €</span>
            <span class="list-summary-label">Montant total</span>
        </article>
    </section>
    <div class="projects-grid" id="tickets-validation-cards">
        <p class="text-secondary">Chargement...</p>
    </div>
</section>

<!-- Filtres -->
<section class="filters-section">
    <div class="filters-bar">
        <input type="search" placeholder="Rechercher un ticket..." class="search-input" id="ticket-search" aria-label="Recherche">
        <select class="filter-select" id="filter-status" aria-label="Filtrer par statut">
            <option value="">Tous les statuts</option>
            <option value="new">Nouveau</option>
            <option value="in-progress">En cours</option>
            <option value="waiting-client">En attente client</option>
            <option value="done">Terminé</option>
            <option value="to-validate">À valider</option>
            <option value="validated">Validé</option>
            <option value="refused">Refusé</option>
        </select>
        <select class="filter-select" id="filter-priority" aria-label="Filtrer par priorité">
            <option value="">Toutes les priorités</option>
            <option value="low">Faible</option>
            <option value="normal">Normale</option>
            <option value="high">Élevée</option>
            <option value="critical">Critique</option>
        </select>
        <select id="filter-type" class="filter-select" data-filter="type" aria-label="Filtrer par type">
            <option value="">Tous les types</option>
            <option value="included">Inclus</option>
            <option value="billable">Facturable</option>
        </select>
        <select class="filter-select" id="filter-project" aria-label="Filtrer par projet">
            <option value="">Tous les projets</option>
        </select>
    </div>
</section>

<!-- Tableau tickets -->
<section class="content-section">
    <div class="table-container">
        <table class="table" id="tickets-table">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Titre</th>
                    <th>Projet</th>
                    <th>Client</th>
                    <th>Statut</th>
                    <th>Priorité</th>
                    <th>Type</th>
                    <th>Assigné</th>
                    <th>Temps</th>
                    <th>Date</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody id="tickets-tbody">
                <tr class="table-empty table-empty-row">
                    <td colspan="11">Chargement des tickets...</td>
                </tr>
            </tbody>
        </table>
    </div>

    <div class="pagination" id="tickets-pagination">
        <button type="button" class="btn btn-text pagination-prev" disabled>Précédent</button>
        <span class="pagination-info">Page 1 sur 1</span>
        <button type="button" class="btn btn-text pagination-next" disabled>Suivant</button>
    </div>
</section>
