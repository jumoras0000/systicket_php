<?php
/**
 * Détail d'un contrat
 */
$contratId = input('id', 0);
?>
<nav class="breadcrumb">
    <a href="<?= url('dashboard') ?>">Accueil</a>
    <span class="breadcrumb-separator">/</span>
    <a href="<?= url('contrats') ?>">Contrats</a>
    <span class="breadcrumb-separator">/</span>
    <span id="breadcrumb-contrat">—</span>
</nav>

<header class="ticket-header">
    <div class="ticket-header-left">
        <h1 id="contrat-title">Contrat — —</h1>
        <div class="ticket-meta">
            <span id="contrat-client">Client : —</span>
            <span id="contrat-projet">Projet : —</span>
            <span class="badge badge-success" id="contrat-status-badge">En cours</span>
        </div>
    </div>
    <div class="ticket-header-right">
        <a href="<?= url('contrat-form?id=' . $contratId) ?>" class="btn btn-secondary btn-edit-contract role-admin-only">✏️ Éditer</a>
    </div>
</header>

<div class="ticket-layout">
    <div class="ticket-main">
        <section class="ticket-section">
            <h2>Détail du contrat</h2>
            <div class="info-card">
                <dl class="info-list">
                    <dt>Référence</dt>
                    <dd id="contrat-reference">—</dd>
                    <dt>Statut</dt>
                    <dd id="contrat-contract-status">—</dd>
                    <dt>Heures incluses</dt>
                    <dd class="info-list-large" id="contrat-hours">—</dd>
                    <dt>Heures consommées</dt>
                    <dd class="info-list-xlarge" id="contrat-used">—</dd>
                    <dt>Heures restantes</dt>
                    <dd class="info-list-success" id="contrat-remaining">—</dd>
                    <dt>Taux horaire</dt>
                    <dd id="contrat-rate">—</dd>
                    <dt>Période de validité</dt>
                    <dd id="contrat-period">—</dd>
                </dl>
                <div class="project-progress project-progress-spacing">
                    <div class="progress-bar">
                        <div class="progress-fill" id="contrat-progress" style="min-width: 0%;"></div>
                    </div>
                    <span class="progress-text" id="contrat-progress-text">—</span>
                </div>
            </div>
        </section>

        <section class="ticket-section">
            <h2>Notes</h2>
            <div class="ticket-description" id="contrat-notes-section">
                <p id="contrat-notes">—</p>
            </div>
        </section>

        <section class="ticket-section">
            <h2>Tickets liés au contrat</h2>
            <div class="table-container">
                <table class="table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Titre</th>
                            <th>Statut</th>
                            <th>Heures</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody id="contrat-tickets-tbody">
                        <tr><td colspan="5" class="table-empty">Chargement...</td></tr>
                    </tbody>
                </table>
            </div>
        </section>
    </div>

    <aside class="ticket-sidebar">
        <div class="info-card">
            <h3>Résumé</h3>
            <dl class="info-list">
                <dt>Projet</dt>
                <dd id="contrat-sidebar-projet">—</dd>
                <dt>Client</dt>
                <dd id="contrat-sidebar-client">—</dd>
                <dt>Début</dt>
                <dd id="contrat-sidebar-start">—</dd>
                <dt>Fin</dt>
                <dd id="contrat-sidebar-end">—</dd>
            </dl>
        </div>
    </aside>
</div>

<script>
    window.CONTRAT_ID = <?= (int)$contratId ?>;
</script>
