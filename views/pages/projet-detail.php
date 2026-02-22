<?php
/**
 * Détail d'un projet
 */
$projetId = input('id', 0);
?>
<!-- Navigation -->
<nav class="breadcrumb">
    <a href="<?= url('dashboard') ?>">Accueil</a>
    <span class="breadcrumb-separator">/</span>
    <a href="<?= url('projets') ?>">Projets</a>
    <span class="breadcrumb-separator">/</span>
    <span id="breadcrumb-projet">—</span>
</nav>

<!-- En-tête projet -->
<header class="ticket-header">
    <div class="ticket-header-left">
        <h1 id="projet-name">—</h1>
        <div class="ticket-meta" id="projet-meta">
            <span class="badge badge-success" id="projet-status-badge">—</span>
            <span id="projet-client-name">Client : —</span>
        </div>
    </div>
    <div class="ticket-header-right">
        <a href="<?= url('projet-form?id=' . $projetId) ?>" class="btn btn-secondary btn-edit-project role-admin-collaborateur">✏️ Éditer</a>
        <a href="<?= url('ticket-form?projet_id=' . $projetId) ?>" class="btn btn-primary btn-create-ticket role-admin-collaborateur">+ Créer un ticket</a>
    </div>
</header>

<div class="ticket-layout">
    <div class="ticket-main">
        <!-- Informations générales -->
        <section id="editer" class="ticket-section">
            <h2>Informations générales</h2>
            <div class="ticket-description" id="projet-info">
                <p id="projet-description">—</p>
                <p><strong>Date de début :</strong> <span id="projet-start">—</span></p>
                <p><strong>Date de fin prévue :</strong> <span id="projet-end">—</span></p>
                <p><strong>Responsable projet :</strong> <span id="projet-manager">—</span></p>
                <p><strong>Créé le :</strong> <span id="projet-created">—</span></p>
            </div>
        </section>

        <!-- Contrat -->
        <section class="ticket-section" id="projet-contrat-section">
            <h2>Contrat</h2>
            <div class="info-card">
                <dl class="info-list">
                    <dt>Heures incluses</dt>
                    <dd class="info-list-large" id="projet-contrat-hours">—</dd>
                    <dt>Heures consommées</dt>
                    <dd class="info-list-xlarge" id="projet-contrat-used">—</dd>
                    <dt>Heures restantes</dt>
                    <dd class="info-list-success" id="projet-contrat-remaining">—</dd>
                    <dt>Taux horaire supplémentaire</dt>
                    <dd id="projet-contrat-rate">—</dd>
                    <dt>Montant à payer</dt>
                    <dd class="info-list-xlarge" id="projet-contrat-amount">—</dd>
                    <dt>Période de validité</dt>
                    <dd id="projet-contrat-period">—</dd>
                </dl>
                <div class="project-progress project-progress-spacing">
                    <div class="progress-bar">
                        <div class="progress-fill" id="projet-contrat-progress" style="width: 0%;"></div>
                    </div>
                    <span class="progress-text" id="projet-contrat-progress-text">—</span>
                </div>
            </div>
        </section>

        <!-- Collaborateurs -->
        <section class="ticket-section">
            <h2>Collaborateurs assignés</h2>
            <div class="assignees-list" id="projet-assignees">
                <p class="text-secondary text-sm">Aucun collaborateur assigné.</p>
            </div>
            <a href="<?= url('utilisateurs') ?>" class="btn btn-text btn-small btn-manage-users role-admin-only">+ Ajouter un collaborateur</a>
        </section>

        <!-- Tickets du projet -->
        <section class="ticket-section">
            <div class="section-header">
                <h2>Tickets du projet</h2>
                <a href="<?= url('ticket-form?projet_id=' . $projetId) ?>" class="btn btn-primary btn-small btn-create-ticket role-admin-collaborateur">+ Créer un ticket</a>
            </div>
            <div class="table-container">
                <table class="table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Titre</th>
                            <th>Statut</th>
                            <th>Priorité</th>
                            <th>Type</th>
                            <th>Assigné</th>
                            <th>Temps</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody id="projet-tickets-tbody">
                        <tr>
                            <td colspan="8" class="table-empty">Chargement...</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </section>
    </div>
</div>

<script>
    window.PROJET_ID = <?= (int)$projetId ?>;
</script>
