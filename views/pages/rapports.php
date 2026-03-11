<?php
/**
 * Page rapports (admin)
 */
?>
<div class="page-header">
    <div class="page-header-left">
        <h1>Rapports</h1>
        <p class="page-subtitle">Statistiques, analyses et export de données</p>
    </div>
    <div class="page-header-right page-header-actions">
        <button type="button" class="btn btn-primary" id="export-btn" aria-label="Exporter">Exporter ▾</button>
    </div>
</div>

<!-- Sommaire -->
<nav class="reports-toc card" aria-label="Sommaire du rapport">
    <h2 class="reports-toc-title">Sommaire</h2>
    <ul class="reports-toc-list">
        <li><a href="#report-summary">Synthèse</a></li>
        <li><a href="#report-hours-project">Heures par projet</a></li>
        <li><a href="#report-tickets-status">Tickets par statut</a></li>
        <li><a href="#report-hours-user">Heures par collaborateur</a></li>
        <li><a href="#report-billing">Facturation par client</a></li>
        <li><a href="#report-detail">Détail des heures</a></li>
    </ul>
</nav>

<!-- Filtres -->
<section class="reports-filters card" aria-label="Filtres du rapport">
    <h2 class="reports-filters-title">Options du rapport</h2>
    <div class="reports-filters-grid">
        <div class="form-group">
            <label for="report-period" class="form-label">Période</label>
            <select id="report-period" class="form-select" aria-label="Période">
                <option>Mois</option>
                <option>Trimestre</option>
                <option>Année</option>
                <option value="custom">Personnalisé</option>
            </select>
        </div>
        <div class="form-group reports-date-range">
            <label for="report-date-from" class="form-label">Du</label>
            <input type="date" id="report-date-from" class="form-input" value="<?= date('Y-m-01') ?>" aria-label="Date de début">
        </div>
        <div class="form-group reports-date-range">
            <label for="report-date-to" class="form-label">Au</label>
            <input type="date" id="report-date-to" class="form-input" value="<?= date('Y-m-d') ?>" aria-label="Date de fin">
        </div>
        <div class="form-group">
            <label for="report-project" class="form-label">Projet</label>
            <select id="report-project" class="form-select" aria-label="Filtrer par projet">
                <option value="">Tous les projets</option>
            </select>
        </div>
        <div class="form-group">
            <label for="report-client" class="form-label">Client</label>
            <select id="report-client" class="form-select" aria-label="Filtrer par client">
                <option value="">Tous les clients</option>
            </select>
        </div>
        <div class="form-group reports-apply">
            <label class="form-label">&nbsp;</label>
            <div class="reports-filter-buttons">
                <button type="button" class="btn btn-primary" id="report-apply">Appliquer</button>
                <button type="button" class="btn btn-text" id="report-reset">Réinitialiser</button>
            </div>
        </div>
    </div>
    <div class="reports-compare-wrap">
        <label class="reports-compare-label">
            <input type="checkbox" id="report-compare" class="form-checkbox" aria-label="Comparer avec la période précédente">
            <span>Comparer avec la période précédente</span>
        </label>
    </div>
    <p class="reports-period-info" id="report-period-info">
        <strong>Période affichée :</strong> —
    </p>
</section>

<script src="<?= asset('js/rapports-export.js') ?>"></script>

<!-- Résumé exécutif -->
<section class="reports-executive card" aria-label="Résumé du rapport">
    <h2 class="visually-hidden">Résumé</h2>
    <p class="reports-executive-text" id="report-executive">
        Sur la période sélectionnée : <strong>—</strong> tickets traités, <strong>—</strong> heures enregistrées, taux de validation <strong>—</strong>, chiffre d'affaires <strong>—</strong>.
    </p>
</section>

<!-- Synthèse KPIs -->
<section id="report-summary" class="reports-section" aria-labelledby="report-summary-title">
    <header class="reports-section-header">
        <h2 id="report-summary-title" class="section-title">Synthèse</h2>
        <button type="button" class="btn btn-text btn-small">Exporter cette section</button>
    </header>
    <div class="stats-grid stats-grid-reports" id="report-kpis">
        <a href="<?= url('tickets') ?>" class="stat-card stat-card-blue stat-card-link" title="Voir les tickets">
            <span class="stat-icon" aria-hidden="true">🎫</span>
            <div class="stat-content">
                <div class="stat-value-wrap">
                    <span class="stat-value" id="kpi-tickets">—</span>
                    <span class="stat-trend stat-trend-neutral" id="kpi-tickets-trend">—</span>
                </div>
                <div class="stat-label">Tickets traités</div>
            </div>
        </a>
        <a href="<?= url('temps') ?>" class="stat-card stat-card-orange stat-card-link" title="Voir le suivi du temps">
            <span class="stat-icon" aria-hidden="true">⏱️</span>
            <div class="stat-content">
                <div class="stat-value-wrap">
                    <span class="stat-value" id="kpi-hours">—</span>
                    <span class="stat-trend stat-trend-neutral" id="kpi-hours-trend">—</span>
                </div>
                <div class="stat-label">Heures enregistrées</div>
            </div>
        </a>
        <div class="stat-card stat-card-green">
            <span class="stat-icon" aria-hidden="true">✅</span>
            <div class="stat-content">
                <div class="stat-value-wrap">
                    <span class="stat-value" id="kpi-validation">—</span>
                    <span class="stat-trend stat-trend-neutral" id="kpi-validation-trend">—</span>
                </div>
                <div class="stat-label">Taux de validation</div>
            </div>
        </div>
        <div class="stat-card stat-card-purple">
            <span class="stat-icon" aria-hidden="true">💰</span>
            <div class="stat-content">
                <div class="stat-value-wrap">
                    <span class="stat-value" id="kpi-revenue">—</span>
                    <span class="stat-trend stat-trend-neutral" id="kpi-revenue-trend">—</span>
                </div>
                <div class="stat-label">Chiffre d'affaires</div>
            </div>
        </div>
        <a href="<?= url('projets') ?>" class="stat-card stat-card-muted stat-card-link" title="Voir les projets">
            <span class="stat-icon" aria-hidden="true">📁</span>
            <div class="stat-content">
                <div class="stat-value-wrap">
                    <span class="stat-value" id="kpi-projects">—</span>
                    <span class="stat-trend stat-trend-neutral" id="kpi-projects-trend">—</span>
                </div>
                <div class="stat-label">Projets actifs</div>
            </div>
        </a>
    </div>
</section>

<!-- Heures par projet -->
<section id="report-hours-project" class="reports-section card" aria-labelledby="report-hours-project-title">
    <header class="reports-section-header">
        <h2 id="report-hours-project-title" class="section-title">Répartition des heures par projet</h2>
        <button type="button" class="btn btn-text btn-small section-export-btn" data-target="report-hours-project">Exporter ce graphique</button>
    </header>
    <div class="chart-container" id="chart-hours-project"></div>
    <p class="reports-chart-legend" id="chart-hours-project-total">Total : —</p>
</section>

<!-- Graphiques 2 colonnes -->
<section class="reports-grid-2">
    <article id="report-tickets-status" class="reports-section card" aria-labelledby="report-tickets-status-title">
        <header class="reports-section-header">
            <h2 id="report-tickets-status-title" class="section-title">Tickets par statut</h2>
            <button type="button" class="btn btn-text btn-small section-export-btn" data-target="report-tickets-status">Exporter</button>
        </header>
        <div class="chart-container" id="chart-tickets-status"></div>
    </article>

    <article id="report-hours-user" class="reports-section card" aria-labelledby="report-hours-user-title">
        <header class="reports-section-header">
            <h2 id="report-hours-user-title" class="section-title">Heures par collaborateur</h2>
            <button type="button" class="btn btn-text btn-small section-export-btn" data-target="report-hours-user">Exporter</button>
        </header>
        <div class="dashboard-chart-bars" id="chart-hours-user"></div>
        <p class="reports-chart-legend" id="chart-hours-user-total">Total : —</p>
    </article>
</section>

<!-- Facturation par client -->
<section id="report-billing" class="reports-section card" aria-labelledby="report-billing-title">
    <header class="reports-section-header">
        <h2 id="report-billing-title" class="section-title">Facturation par client</h2>
        <button type="button" class="btn btn-text btn-small section-export-btn" data-target="report-billing">Exporter ce rapport</button>
    </header>
    <div class="table-container">
        <table class="table">
            <thead>
                <tr>
                    <th>Client</th>
                    <th>Projet</th>
                    <th>Heures</th>
                    <th>Taux horaire</th>
                    <th>Montant HT</th>
                </tr>
            </thead>
            <tbody id="report-billing-tbody">
                <tr><td colspan="5" class="table-empty">Chargement...</td></tr>
            </tbody>
            <tfoot>
                <tr class="table-footer">
                    <td colspan="2"><strong>Total</strong></td>
                    <td><strong id="report-billing-hours">—</strong></td>
                    <td>—</td>
                    <td><strong id="report-billing-total">—</strong></td>
                </tr>
            </tfoot>
        </table>
    </div>
</section>

<!-- Détail des heures -->
<section id="report-detail" class="reports-section card" aria-labelledby="report-detail-title">
    <header class="reports-section-header">
        <h2 id="report-detail-title" class="section-title">Détail des heures (extrait)</h2>
        <a href="<?= url('temps') ?>" class="link">Voir tout le suivi du temps →</a>
    </header>
    <div class="table-container">
        <table class="table table-compact">
            <thead>
                <tr>
                    <th>Date</th>
                    <th>Projet</th>
                    <th>Ticket</th>
                    <th>Collaborateur</th>
                    <th>Heures</th>
                    <th>Description</th>
                </tr>
            </thead>
            <tbody id="report-detail-tbody">
                <tr><td colspan="6" class="table-empty">Chargement...</td></tr>
            </tbody>
        </table>
    </div>
    <p class="reports-chart-legend">Affichage des dernières entrées. Exportez pour voir l'ensemble des données.</p>
</section>

<!-- Métadonnées -->
<footer class="reports-meta card" aria-label="Informations sur le rapport">
    <p class="reports-meta-text">
        Rapport généré le <time datetime="<?= date('c') ?>"><?= date('d/m/Y à H:i') ?></time> — Systicket · Données basées sur les filtres appliqués.
    </p>
</footer>
