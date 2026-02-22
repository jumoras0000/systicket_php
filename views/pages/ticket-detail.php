<?php
/**
 * Détail d'un ticket
 */
$ticketId = input('id', 0);
$role = Auth::role();
?>
<!-- Navigation -->
<nav class="breadcrumb">
    <a href="<?= url('dashboard') ?>">Accueil</a>
    <span class="breadcrumb-separator">/</span>
    <a href="<?= url('tickets') ?>">Tickets</a>
    <span class="breadcrumb-separator">/</span>
    <span id="breadcrumb-ticket">—</span>
</nav>

<!-- En-tête ticket -->
<header class="ticket-header">
    <div class="ticket-header-left">
        <h1 id="ticket-title">—</h1>
        <div class="ticket-meta" id="ticket-meta">
            <span class="ticket-id" id="ticket-id">—</span>
            <span class="badge badge-warning" id="ticket-status-badge">—</span>
            <span class="badge badge-danger" id="ticket-priority-badge">—</span>
            <span class="badge badge-success" id="ticket-type-badge">—</span>
        </div>
    </div>
    <div class="ticket-header-right">
        <a href="<?= url('ticket-form?id=' . $ticketId) ?>" class="btn btn-secondary btn-edit-ticket role-admin-collaborateur">✏️ Éditer</a>
        <a href="<?= url('temps?ticket=' . $ticketId) ?>" class="btn btn-primary role-admin-collaborateur">⏱️ Ajouter du temps</a>
    </div>
</header>

<div class="ticket-layout">
    <div class="ticket-main">
        <!-- Description -->
        <section class="ticket-section">
            <h2>Description</h2>
            <div class="ticket-description" id="ticket-description">
                <p>—</p>
            </div>
        </section>

        <!-- Temps passé -->
        <section class="ticket-section">
            <div class="section-header">
                <h2>Temps passé</h2>
                <span class="time-total" id="ticket-time-total">Total : —</span>
            </div>
            <div class="time-entries" id="ticket-time-entries">
                <p class="text-secondary text-sm">Aucune entrée de temps.</p>
            </div>
            <div class="time-estimated time-estimated-border" id="ticket-time-estimated">
                <strong>Temps estimé :</strong> —
            </div>
        </section>

        <!-- Commentaires -->
        <section class="ticket-section">
            <h2>Commentaires</h2>
            <div class="comments-list" id="ticket-comments">
                <p class="text-secondary text-sm">Aucun commentaire.</p>
            </div>
            <form class="comment-form" id="comment-form" data-no-validate>
                <input type="hidden" name="ticket_id" value="<?= (int)$ticketId ?>">
                <textarea 
                    class="form-textarea" 
                    name="contenu"
                    placeholder="Ajouter un commentaire..."
                    rows="3"
                ></textarea>
                <button type="submit" class="btn btn-primary">Publier</button>
            </form>
        </section>

        <!-- Historique -->
        <section class="ticket-section ticket-timeline-section" id="ticket-timeline-section" style="display:none;">
            <h2>Historique &amp; activité</h2>
            <ul class="timeline" aria-label="Historique du ticket" id="ticket-timeline">
            </ul>
        </section>
    </div>

    <!-- Sidebar -->
    <aside class="ticket-sidebar">
        <div class="info-card">
            <h3>Informations</h3>
            <dl class="info-list" id="ticket-info">
                <dt>Projet</dt>
                <dd id="ticket-project">—</dd>
                <dt>Client</dt>
                <dd id="ticket-client">—</dd>
                <dt>Créé le</dt>
                <dd id="ticket-created">—</dd>
                <dt>Modifié le</dt>
                <dd id="ticket-updated">—</dd>
                <dt>Créé par</dt>
                <dd id="ticket-author">—</dd>
                <dt>Temps écoulé</dt>
                <dd><span class="text-primary" id="ticket-time-spent">—</span> / <span id="ticket-time-est">—</span></dd>
            </dl>
        </div>

        <div class="info-card">
            <h3>Assignation</h3>
            <div class="assignees-list" id="ticket-assignees">
                <div class="assignee-item">
                    <span>—</span>
                </div>
            </div>
            <a href="<?= url('utilisateurs') ?>" class="btn btn-text btn-small btn-manage-users role-admin-only">+ Assigner</a>
        </div>

        <div class="info-card role-admin-collaborateur">
            <h3>Actions rapides</h3>
            <div class="action-list">
                <select class="form-select form-select-spacing" id="ticket-status-change">
                    <option value="">Changer le statut</option>
                    <option value="new">Nouveau</option>
                    <option value="in-progress">En cours</option>
                    <option value="waiting-client">En attente client</option>
                    <option value="done">Terminé</option>
                    <option value="to-validate">À valider</option>
                </select>
                <a href="<?= url('ticket-form?duplicate=' . $ticketId) ?>" class="btn btn-text btn-small btn-block mt-sm role-admin-collaborateur">📋 Dupliquer</a>
            </div>
        </div>
    </aside>
</div>

<script>
    window.TICKET_ID = <?= (int)$ticketId ?>;
</script>
