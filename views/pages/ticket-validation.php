<?php
/**
 * Page de validation des tickets (vue client)
 */
?>
<!-- En-tête -->
<div class="page-header">
    <div class="page-header-left">
        <h1>Tickets en attente de validation</h1>
        <p class="page-subtitle">Validez ou refusez les tickets facturables (vue client)</p>
    </div>
</div>

<!-- Résumé -->
<section class="list-summary-cards" aria-label="Résumé à valider">
    <article class="list-summary-card list-summary-card-warning">
        <span class="list-summary-value" id="validation-count">—</span>
        <span class="list-summary-label">Tickets à valider</span>
    </article>
    <article class="list-summary-card list-summary-card-primary">
        <span class="list-summary-value" id="validation-total">—</span>
        <span class="list-summary-label">Montant total</span>
    </article>
</section>

<!-- Tickets à valider -->
<section class="content-section">
    <div class="projects-grid" id="validation-cards">
        <p class="text-secondary text-sm">Chargement...</p>
    </div>
</section>

<!-- Section historique -->
<section class="content-section section-spacing-lg">
    <h2 class="card-title">Historique des validations</h2>
    <div class="table-container">
        <table class="table">
            <thead>
                <tr>
                    <th>Ticket</th>
                    <th>Projet</th>
                    <th>Temps</th>
                    <th>Montant</th>
                    <th>Statut</th>
                    <th>Date</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody id="validation-history">
                <tr>
                    <td colspan="7" class="table-empty">Aucune validation enregistrée.</td>
                </tr>
            </tbody>
        </table>
    </div>
</section>
