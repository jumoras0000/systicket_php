<?php
/**
 * Formulaire de création/édition de projet
 */
$projetId = input('id', 0);
$isEdit = $projetId > 0;
$title = $isEdit ? 'Modifier le projet' : 'Créer un nouveau projet';
?>
<!-- Navigation -->
<nav class="breadcrumb">
    <a href="<?= url('dashboard') ?>">Accueil</a>
    <span class="breadcrumb-separator">/</span>
    <a href="<?= url('projets') ?>">Projets</a>
    <span class="breadcrumb-separator">/</span>
    <span><?= e($title) ?></span>
</nav>

<!-- En-tête -->
<div class="page-header">
    <h1><?= e($title) ?></h1>
    <p class="page-subtitle">Définissez les informations du projet et associez-le à un client</p>
</div>

<!-- Formulaire -->
<section class="form-section">
    <form id="project-form" class="ticket-form" data-entity="projet" data-id="<?= (int)$projetId ?>" novalidate>
        <div class="form-messages" role="alert" aria-live="polite"></div>
        <div class="form-row">
            <div class="form-group">
                <label for="project-name" class="form-label">Nom du projet <span class="required">*</span></label>
                <input type="text" id="project-name" name="name" class="form-input" placeholder="Ex: Site e-commerce" required>
            </div>
        </div>

        <div class="form-row">
            <div class="form-group">
                <label for="project-description" class="form-label">Description</label>
                <textarea id="project-description" name="description" class="form-textarea" rows="4" placeholder="Décrivez le projet..."></textarea>
            </div>
        </div>

        <div class="form-row form-row-2">
            <div class="form-group">
                <label for="project-client" class="form-label">Client</label>
                <select id="project-client" name="client_id" class="form-select">
                    <option value="">Sélectionner un client (optionnel)</option>
                </select>
            </div>
            <div class="form-group">
                <label for="project-status" class="form-label">Statut</label>
                <select id="project-status" name="status" class="form-select">
                    <option value="active">Actif</option>
                    <option value="paused">En pause</option>
                    <option value="completed">Terminé</option>
                </select>
            </div>
        </div>

        <div class="form-row form-row-2">
            <div class="form-group">
                <label for="project-manager" class="form-label">Chef de projet</label>
                <select id="project-manager" name="manager_id" class="form-select">
                    <option value="">Sélectionner un responsable (optionnel)</option>
                </select>
            </div>
            <div class="form-group"></div>
        </div>

        <div class="form-row form-row-2">
            <div class="form-group">
                <label for="project-start" class="form-label">Date de début</label>
                <input type="date" id="project-start" name="start_date" class="form-input">
            </div>
            <div class="form-group">
                <label for="project-end" class="form-label">Date de fin prévue</label>
                <input type="date" id="project-end" name="end_date" class="form-input">
            </div>
        </div>

        <div class="form-row">
            <div class="form-group">
                <label for="project-assignees" class="form-label">Collaborateurs assignés</label>
                <select id="project-assignees" name="assignees[]" class="form-select" multiple>
                </select>
                <small class="form-help">Maintenez Ctrl (Cmd sur Mac) pour sélectionner plusieurs</small>
            </div>
        </div>

        <!-- Actions -->
        <div class="form-actions">
            <button type="submit" class="btn btn-primary"><?= $isEdit ? 'Enregistrer' : 'Créer le projet' ?></button>
            <a href="<?= url('projets') ?>" class="btn btn-secondary">Annuler</a>
        </div>
    </form>
</section>
