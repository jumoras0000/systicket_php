<?php
/**
 * Formulaire utilisateur (admin)
 */
$userId = input('id', 0);
$isEdit = $userId > 0;
$title = $isEdit ? 'Modifier l\'utilisateur' : 'Ajouter un utilisateur';
?>
<nav class="breadcrumb">
    <a href="<?= url('dashboard') ?>">Accueil</a>
    <span class="breadcrumb-separator">/</span>
    <a href="<?= url('utilisateurs') ?>">Utilisateurs</a>
    <span class="breadcrumb-separator">/</span>
    <span id="breadcrumb-action"><?= e($title) ?></span>
</nav>

<div class="page-header">
    <h1 id="user-form-title"><?= e($title) ?></h1>
    <p class="page-subtitle" id="user-form-subtitle">Gestion des utilisateurs (administrateur uniquement)</p>
</div>

<section class="form-section card">
    <form id="user-form" class="ticket-form" data-entity="user" data-id="<?= (int)$userId ?>">
        <div class="form-messages" role="alert" aria-live="polite"></div>
        <div class="form-row form-row-2">
            <div class="form-group">
                <label for="user-nom" class="form-label">Nom <span class="required">*</span></label>
                <input type="text" id="user-nom" name="last_name" class="form-input" required>
            </div>
            <div class="form-group">
                <label for="user-prenom" class="form-label">Prénom <span class="required">*</span></label>
                <input type="text" id="user-prenom" name="first_name" class="form-input" required>
            </div>
        </div>
        <div class="form-row">
            <div class="form-group">
                <label for="user-email" class="form-label">Email <span class="required">*</span></label>
                <input type="email" id="user-email" name="email" class="form-input" required>
            </div>
        </div>
        <?php if (!$isEdit): ?>
        <div class="form-row">
            <div class="form-group">
                <label for="user-password" class="form-label">Mot de passe <span class="required">*</span></label>
                <input type="password" id="user-password" name="password" class="form-input" minlength="8" required>
                <small class="form-help">Minimum 8 caractères</small>
            </div>
        </div>
        <?php endif; ?>
        <div class="form-row form-row-2">
            <div class="form-group">
                <label for="user-role" class="form-label">Rôle <span class="required">*</span></label>
                <select id="user-role" name="role" class="form-select" required>
                    <option value="">Sélectionner un rôle</option>
                    <option value="admin">Administrateur</option>
                    <option value="collaborateur">Collaborateur</option>
                    <option value="client">Client</option>
                </select>
            </div>
            <div class="form-group">
                <label for="user-status" class="form-label">Statut</label>
                <select id="user-status" name="status" class="form-select">
                    <option value="active">Actif</option>
                    <option value="inactive">Inactif</option>
                </select>
            </div>
        </div>
        <div class="form-row">
            <div class="form-group">
                <label for="user-telephone" class="form-label">Téléphone</label>
                <input type="tel" id="user-telephone" name="phone" class="form-input">
            </div>
        </div>
        <div class="form-actions">
            <button type="submit" class="btn btn-primary">Enregistrer</button>
            <a href="<?= url('utilisateurs') ?>" class="btn btn-secondary">Annuler</a>
            <?php if ($isEdit): ?>
            <button type="button" id="user-delete-btn" class="btn btn-danger btn-outline">Supprimer</button>
            <?php endif; ?>
        </div>
    </form>
</section>
