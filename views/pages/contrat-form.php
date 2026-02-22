<?php
/**
 * Formulaire contrat
 */
$contratId = input('id', 0);
$isEdit = $contratId > 0;
$title = $isEdit ? 'Modifier le contrat' : 'Créer un contrat';
?>
<nav class="breadcrumb">
    <a href="<?= url('dashboard') ?>">Accueil</a>
    <span class="breadcrumb-separator">/</span>
    <a href="<?= url('contrats') ?>">Contrats</a>
    <span class="breadcrumb-separator">/</span>
    <span><?= e($title) ?></span>
</nav>

<div class="page-header">
    <h1><?= e($title) ?></h1>
    <p class="page-subtitle">Définir l'enveloppe d'heures et le taux horaire pour un projet</p>
</div>

<section class="form-section card">
    <form id="contrat-form" class="ticket-form" data-entity="contrat" data-id="<?= (int)$contratId ?>">
        <div class="form-messages" role="alert" aria-live="polite"></div>
        <div class="form-row form-row-2">
            <div class="form-group">
                <label for="contrat-reference" class="form-label">Référence</label>
                <input type="text" id="contrat-reference" name="reference" class="form-input" placeholder="Ex: CTR-2024-001">
            </div>
            <div class="form-group">
                <label for="contrat-status" class="form-label">Statut</label>
                <select id="contrat-status" name="status" class="form-select">
                    <option value="active">Actif</option>
                    <option value="expired">Expiré</option>
                    <option value="cancelled">Annulé</option>
                </select>
            </div>
        </div>
        <div class="form-row form-row-2">
            <div class="form-group">
                <label for="contrat-project" class="form-label">Projet <span class="required">*</span></label>
                <select id="contrat-project" name="project_id" class="form-select" required>
                    <option value="">Sélectionner un projet</option>
                </select>
            </div>
            <div class="form-group">
                <label for="contrat-client" class="form-label">Client <span class="required">*</span></label>
                <select id="contrat-client" name="client_id" class="form-select" required>
                    <option value="">Sélectionner un client</option>
                </select>
            </div>
        </div>
        <div class="form-row form-row-2">
            <div class="form-group">
                <label for="contrat-hours" class="form-label">Heures incluses <span class="required">*</span></label>
                <input type="number" id="contrat-hours" name="hours" class="form-input" min="1" placeholder="" required>
            </div>
            <div class="form-group">
                <label for="contrat-rate" class="form-label">Taux horaire (€/h) <span class="required">*</span></label>
                <input type="number" id="contrat-rate" name="rate" class="form-input" min="0" step="0.01" placeholder="" required>
            </div>
        </div>
        <div class="form-row form-row-2">
            <div class="form-group">
                <label for="contrat-start" class="form-label">Date de début <span class="required">*</span></label>
                <input type="date" id="contrat-start" name="start_date" class="form-input" required>
            </div>
            <div class="form-group">
                <label for="contrat-end" class="form-label">Date de fin <span class="required">*</span></label>
                <input type="date" id="contrat-end" name="end_date" class="form-input" required>
            </div>
        </div>
        <div class="form-row">
            <div class="form-group">
                <label for="contrat-notes" class="form-label">Notes</label>
                <textarea id="contrat-notes" name="notes" class="form-textarea" rows="3" placeholder="Notes sur ce contrat..."></textarea>
            </div>
        </div>
        <div class="form-actions">
            <button type="submit" class="btn btn-primary"><?= $isEdit ? 'Enregistrer' : 'Créer le contrat' ?></button>
            <a href="<?= url('contrats') ?>" class="btn btn-secondary">Annuler</a>
        </div>
    </form>
</section>
