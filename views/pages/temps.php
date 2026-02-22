<?php
/**
 * Suivi du temps
 */
?>
<div class="page-header page-header-flex">
    <div class="page-header-left">
        <h1>Suivi du temps</h1>
        <p class="page-subtitle">Enregistrez et consultez le temps passé (vue Jour / Semaine)</p>
    </div>
    <div class="page-header-right">
        <div class="time-period-nav" role="group" aria-label="Période">
            <button type="button" class="btn btn-text btn-small" id="week-prev">← Semaine préc.</button>
            <span class="time-period-label" id="week-label"><strong>—</strong></span>
            <button type="button" class="btn btn-text btn-small" id="week-next">Semaine suiv. →</button>
        </div>
        <button type="button" class="btn btn-secondary btn-small" onclick="window.print();" aria-label="Exporter / imprimer">📥 Exporter</button>
    </div>
</div>

<!-- Résumé -->
<section class="list-summary-cards" aria-label="Résumé des heures">
    <article class="list-summary-card list-summary-card-primary">
        <span class="list-summary-value" id="temps-month">—</span>
        <span class="list-summary-label">Ce mois</span>
    </article>
    <article class="list-summary-card list-summary-card-success">
        <span class="list-summary-value" id="temps-week">—</span>
        <span class="list-summary-label">Cette semaine</span>
    </article>
    <article class="list-summary-card list-summary-card-muted">
        <span class="list-summary-value" id="temps-remaining">—</span>
        <span class="list-summary-label">Restantes (enveloppe)</span>
    </article>
</section>

<!-- Formulaire saisie temps -->
<section id="saisie" class="form-section">
    <div class="card">
        <h2 class="card-title">Ajouter une entrée de temps</h2>
        <form id="time-form" class="ticket-form" data-entity="temps">
            <div class="form-messages" role="alert" aria-live="polite"></div>
            <div class="form-row form-row-2">
                <div class="form-group">
                    <label for="time-ticket" class="form-label">Ticket <span class="required">*</span></label>
                    <select id="time-ticket" name="ticket_id" class="form-select" required>
                        <option value="">Sélectionner un ticket</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="time-date" class="form-label">Date <span class="required">*</span></label>
                    <input type="date" id="time-date" name="date_saisie" class="form-input" required value="<?= date('Y-m-d') ?>">
                </div>
            </div>

            <div class="form-row form-row-2">
                <div class="form-group">
                    <label for="time-hours" class="form-label">Heures <span class="required">*</span></label>
                    <input type="number" id="time-hours" name="heures" class="form-input" min="0" max="24" step="0.5" placeholder="" required>
                </div>
                <div class="form-group">
                    <label for="time-minutes" class="form-label">Minutes</label>
                    <input type="number" id="time-minutes" name="minutes" class="form-input" min="0" max="59" step="15" placeholder="30">
                </div>
            </div>

            <div class="form-row">
                <div class="form-group">
                    <label for="time-description" class="form-label">Description du travail</label>
                    <textarea id="time-description" name="description" class="form-textarea" rows="3" placeholder="Description"></textarea>
                </div>
            </div>

            <div class="form-actions">
                <button type="submit" class="btn btn-primary">Enregistrer</button>
                <button type="reset" class="btn btn-secondary">Réinitialiser</button>
            </div>
        </form>
    </div>
</section>

<!-- Historique -->
<section class="content-section section-spacing">
    <div class="page-header">
        <h2>Historique des entrées</h2>
    </div>

    <section class="filters-section">
        <div class="filters-bar">
            <input type="search" placeholder="Rechercher..." class="search-input" id="temps-search">
            <select class="filter-select" id="filter-project" data-filter="project">
                <option value="">Tous les projets</option>
            </select>
        </div>
    </section>

    <div class="table-container">
        <table class="table" id="temps-table">
            <thead>
                <tr>
                    <th>Date</th>
                    <th>Utilisateur</th>
                    <th>Ticket</th>
                    <th>Projet</th>
                    <th>Durée</th>
                    <th>Description</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody id="temps-tbody">
                <tr class="table-empty-row">
                    <td colspan="7">Chargement...</td>
                </tr>
            </tbody>
            <tfoot>
                <tr class="table-footer">
                    <td colspan="4"><strong>Total ce mois</strong></td>
                    <td><strong class="text-hours-total" id="temps-total-month">—</strong></td>
                    <td colspan="2"></td>
                </tr>
            </tfoot>
        </table>
    </div>
</section>
