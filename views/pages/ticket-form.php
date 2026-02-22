<?php
/**
 * Formulaire de création/édition de ticket
 */
$ticketId = input('id', 0);
$duplicate = input('duplicate', 0);
$isEdit = $ticketId > 0;
$title = $isEdit ? 'Éditer le ticket' : 'Créer un nouveau ticket';
?>
<!-- Navigation -->
<nav class="breadcrumb">
    <a href="<?= url('dashboard') ?>">Accueil</a>
    <span class="breadcrumb-separator">/</span>
    <a href="<?= url('tickets') ?>">Tickets</a>
    <span class="breadcrumb-separator">/</span>
    <span><?= e($title) ?></span>
</nav>

<!-- En-tête -->
<div class="page-header">
    <h1><?= e($title) ?></h1>
</div>

<!-- Formulaire -->
<section class="form-section">
    <form class="ticket-form" id="ticket-form" data-entity="ticket" data-id="<?= (int)$ticketId ?>" data-duplicate="<?= (int)$duplicate ?>">
        <div id="ticket-form-messages" class="form-messages" role="alert" aria-live="polite"></div>
        <div class="form-row">
            <div class="form-group">
                <label for="ticket-title" class="form-label">
                    Titre du ticket <span class="required">*</span>
                </label>
                <input type="text" id="ticket-title" name="title" class="form-input" placeholder="Titre du ticket" required>
            </div>
        </div>

        <div class="form-row">
            <div class="form-group">
                <label for="ticket-description" class="form-label">
                    Description <span class="required">*</span>
                </label>
                <textarea id="ticket-description" name="description" class="form-textarea" rows="6" placeholder="Décrivez en détail le problème ou la demande..." required minlength="10"></textarea>
                <small class="form-help">Minimum 10 caractères</small>
            </div>
        </div>

        <div class="form-row form-row-2">
            <div class="form-group">
                <label for="ticket-project" class="form-label">
                    Projet <span class="required">*</span>
                </label>
                <select id="ticket-project" name="project_id" class="form-select" required>
                    <option value="">Sélectionner un projet</option>
                </select>
            </div>

            <div class="form-group">
                <label for="ticket-priority" class="form-label">Priorité</label>
                <select id="ticket-priority" name="priority" class="form-select">
                    <option value="normal">Normale</option>
                    <option value="low">Faible</option>
                    <option value="high">Élevée</option>
                    <option value="critical">Critique</option>
                </select>
            </div>
        </div>

        <div class="form-row">
            <div class="form-group">
                <label class="form-label">Type de ticket <span class="required">*</span></label>
                <div class="radio-group">
                    <label class="radio-label">
                        <input type="radio" name="type" value="included" checked required>
                        <span>Inclus dans le contrat</span>
                    </label>
                    <label class="radio-label">
                        <input type="radio" name="type" value="billable" required>
                        <span>Facturable en supplément</span>
                    </label>
                </div>
            </div>
        </div>

        <div class="form-row form-row-2">
            <div class="form-group">
                <label for="ticket-estimated-hours" class="form-label">Temps estimé (heures)</label>
                <input type="number" id="ticket-estimated-hours" name="estimated_hours" class="form-input" min="0" step="0.5" placeholder="">
            </div>

            <div class="form-group">
                <label for="ticket-assignees" class="form-label">Assigner à</label>
                <select id="ticket-assignees" name="assignees[]" class="form-select" multiple>
                    <option value="">Sélectionner un collaborateur</option>
                </select>
                <small class="form-help">Maintenez Ctrl (Cmd sur Mac) pour sélectionner plusieurs</small>
            </div>
        </div>

        <?php if ($isEdit): ?>
        <div class="form-row form-row-2">
            <div class="form-group">
                <label for="ticket-status" class="form-label">Statut</label>
                <select id="ticket-status" name="status" class="form-select">
                    <option value="new">Nouveau</option>
                    <option value="in-progress">En cours</option>
                    <option value="waiting-client">En attente client</option>
                    <option value="done">Terminé</option>
                    <option value="to-validate">À valider</option>
                    <option value="validated">Validé</option>
                    <option value="refused">Refusé</option>
                </select>
            </div>
            <div class="form-group"></div>
        </div>
        <?php endif; ?>

        <!-- Actions -->
        <div class="form-actions">
            <button type="submit" class="btn btn-primary">
                <?= $isEdit ? 'Enregistrer les modifications' : 'Créer le ticket' ?>
            </button>
            <a href="<?= url('tickets') ?>" class="btn btn-secondary">Annuler</a>
            <?php if (!$isEdit): ?>
            <button type="submit" name="draft" value="1" class="btn btn-text">Enregistrer comme brouillon</button>
            <?php endif; ?>
        </div>
    </form>
</section>
