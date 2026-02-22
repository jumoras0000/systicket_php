<?php
/**
 * Dashboard - Page principale
 * Les données sont chargées via API JS côté client
 */
$user = Auth::user();
$role = Auth::role();
?>
<!-- En-tête -->
<div class="page-header page-header-dashboard">
    <div class="page-header-left">
        <h1>Tableau de bord</h1>
    </div>
    <div class="page-header-right">
        <div class="dashboard-period" role="group" aria-label="Période affichée">
            <a href="<?= url('dashboard?period=day') ?>" class="btn btn-text btn-period">Aujourd'hui</a>
            <a href="<?= url('dashboard?period=week') ?>" class="btn btn-text btn-period">Cette semaine</a>
            <a href="<?= url('dashboard?period=month') ?>" class="btn btn-primary btn-period btn-period-active">Ce mois</a>
        </div>
    </div>
</div>

<!-- Indicateurs -->
<section class="stats-grid stats-grid-dashboard" aria-label="Indicateurs">
    <a href="<?= url('tickets') ?>" class="stat-card stat-card-blue stat-card-link role-admin-collaborateur" title="Voir la liste des tickets ouverts">
        <span class="stat-icon" aria-hidden="true">🎫</span>
        <div class="stat-content">
            <div class="stat-value-wrap">
                <span class="stat-value" id="dash-tickets-open">—</span>
                <span class="stat-trend stat-trend-neutral" id="dash-tickets-trend">—</span>
            </div>
            <div class="stat-label">Tickets ouverts</div>
            <span class="stat-card-detail">Voir le détail →</span>
        </div>
    </a>
    <a href="<?= url('projets') ?>" class="stat-card stat-card-orange stat-card-link" title="Voir les projets actifs">
        <span class="stat-icon" aria-hidden="true">📁</span>
        <div class="stat-content">
            <div class="stat-value-wrap">
                <span class="stat-value" id="dash-projets-active">—</span>
                <span class="stat-trend stat-trend-neutral" id="dash-projets-trend">—</span>
            </div>
            <div class="stat-label">Projets actifs</div>
            <span class="stat-card-detail">Voir le détail →</span>
        </div>
    </a>
    <a href="<?= url('ticket-validation') ?>" class="stat-card stat-card-green stat-card-link" title="Voir les tickets à valider">
        <span class="stat-icon" aria-hidden="true">✅</span>
        <div class="stat-content">
            <div class="stat-value-wrap">
                <span class="stat-value" id="dash-validation-count">—</span>
                <span class="stat-trend stat-trend-up" id="dash-validation-trend">—</span>
            </div>
            <div class="stat-label">À valider ce mois</div>
            <span class="stat-card-detail">Voir le détail →</span>
        </div>
    </a>
    <a href="<?= url('temps') ?>" class="stat-card stat-card-purple stat-card-link role-admin-collaborateur" title="Voir le suivi des heures">
        <span class="stat-icon" aria-hidden="true">⏱️</span>
        <div class="stat-content">
            <div class="stat-value-wrap">
                <span class="stat-value" id="dash-hours-month">—</span>
                <span class="stat-trend stat-trend-neutral" id="dash-hours-trend">—</span>
            </div>
            <div class="stat-label">Heures ce mois</div>
            <span class="stat-card-detail">Voir le détail →</span>
        </div>
    </a>
</section>

<!-- Graphiques -->
<section class="dashboard-widgets">
    <div class="widget-grid widget-grid-2">
        <article class="widget-card role-admin-collaborateur">
            <header class="widget-header">
                <h2>Répartition des tickets par statut</h2>
                <a href="<?= url('tickets') ?>" class="link">Voir tout</a>
            </header>
            <div class="widget-content" id="dash-tickets-by-status">
                <div class="dashboard-chart-bars">
                    <div class="dashboard-chart-row">
                        <span class="dashboard-chart-label">Nouveau</span>
                        <div class="dashboard-chart-bar-wrap">
                            <div class="dashboard-chart-bar dashboard-chart-bar-gray" style="width: 0%;"></div>
                        </div>
                        <span class="dashboard-chart-value">—</span>
                    </div>
                    <div class="dashboard-chart-row">
                        <span class="dashboard-chart-label">En cours</span>
                        <div class="dashboard-chart-bar-wrap">
                            <div class="dashboard-chart-bar dashboard-chart-bar-gray" style="width: 0%;"></div>
                        </div>
                        <span class="dashboard-chart-value">—</span>
                    </div>
                    <div class="dashboard-chart-row">
                        <span class="dashboard-chart-label">Terminé</span>
                        <div class="dashboard-chart-bar-wrap">
                            <div class="dashboard-chart-bar dashboard-chart-bar-gray" style="width: 0%;"></div>
                        </div>
                        <span class="dashboard-chart-value">—</span>
                    </div>
                    <div class="dashboard-chart-row">
                        <span class="dashboard-chart-label">À valider</span>
                        <div class="dashboard-chart-bar-wrap">
                            <div class="dashboard-chart-bar dashboard-chart-bar-gray" style="width: 0%;"></div>
                        </div>
                        <span class="dashboard-chart-value">—</span>
                    </div>
                    <div class="dashboard-chart-row">
                        <span class="dashboard-chart-label">Validé / Refusé</span>
                        <div class="dashboard-chart-bar-wrap">
                            <div class="dashboard-chart-bar dashboard-chart-bar-gray" style="width: 0%;"></div>
                        </div>
                        <span class="dashboard-chart-value">—</span>
                    </div>
                </div>
            </div>
        </article>

        <article class="widget-card role-admin-collaborateur">
            <header class="widget-header">
                <h2>Heures par projet (ce mois)</h2>
                <a href="<?= url('rapports') ?>" class="link role-admin-only">Rapports</a>
            </header>
            <div class="widget-content" id="dash-hours-by-project">
                <div class="dashboard-chart-bars"></div>
                <p class="dashboard-chart-total"><strong>Total : —</strong></p>
            </div>
        </article>
    </div>
</section>

<!-- Tickets récents -->
<section class="dashboard-widgets">
    <div class="widget-grid widget-grid-2">
        <article class="widget-card role-admin-collaborateur">
            <header class="widget-header">
                <h2>Tickets récents</h2>
                <a href="<?= url('tickets') ?>" class="link" data-tooltip="Voir tous les tickets">Voir tout</a>
            </header>
            <div class="widget-content">
                <table class="table table-compact">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Titre</th>
                            <th>Statut</th>
                            <th>Date</th>
                        </tr>
                    </thead>
                    <tbody id="dash-recent-tickets">
                        <tr>
                            <td colspan="4" class="table-empty">Aucun ticket récent.</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </article>

        <article class="widget-card role-admin-collaborateur">
            <header class="widget-header">
                <h2>Enveloppe heures (ce mois)</h2>
            </header>
            <div class="widget-content" id="dash-hours-gauge">
                <div class="dashboard-gauge">
                    <div class="dashboard-gauge-value">— <span class="text-secondary">/ —</span></div>
                    <div class="progress-bar progress-bar-lg mt-md">
                        <div class="progress-fill progress-fill-primary" style="width: 0%;"></div>
                    </div>
                    <p class="progress-text mt-sm">—</p>
                </div>
                <div class="dashboard-gauge-legend">
                    <span class="dashboard-gauge-legend-item"><em class="legend-dot legend-primary"></em> Consommées</span>
                    <span class="dashboard-gauge-legend-item"><em class="legend-dot legend-bg"></em> Disponibles</span>
                </div>
            </div>
        </article>
    </div>
</section>

<!-- Activité -->
<section class="dashboard-widgets">
    <div class="widget-grid widget-grid-2">
        <article class="widget-card">
            <header class="widget-header">
                <h2>Activité récente</h2>
                <a href="<?= url('rapports') ?>" class="link role-admin-only">Voir tout</a>
            </header>
            <div class="widget-content" id="dash-recent-activity">
                <p class="text-secondary text-sm">Aucune activité récente.</p>
            </div>
        </article>

        <article class="widget-card">
            <header class="widget-header">
                <h2>Projets à la une</h2>
                <a href="<?= url('projets') ?>" class="link">Tous les projets</a>
            </header>
            <div class="widget-content" id="dash-featured-projects">
                <p class="text-secondary text-sm">Aucun projet.</p>
            </div>
        </article>
    </div>
</section>
