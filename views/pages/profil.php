<?php
/**
 * Page profil utilisateur
 */
$user = Auth::user();
?>
<div class="page-header page-header-flex">
    <div class="page-header-left">
        <h1>Mon profil</h1>
        <p class="page-subtitle">Informations personnelles, sécurité et préférences</p>
    </div>
</div>

<!-- Informations personnelles -->
<section class="form-section">
    <div class="card">
        <h2 class="card-title">Informations personnelles</h2>
        <p id="profile-pending-notice" class="text-secondary text-sm" style="display:none;">Vos modifications sont en attente de validation par l'administrateur.</p>
        <form id="profile-form" class="ticket-form">
            <div class="form-messages" role="alert" aria-live="polite"></div>
            <div class="form-row form-row-2">
                <div class="form-group">
                    <label for="profile-nom" class="form-label">Nom</label>
                    <input type="text" id="profile-nom" name="last_name" class="form-input" value="<?= e($user['last_name']) ?>" required>
                </div>
                <div class="form-group">
                    <label for="profile-prenom" class="form-label">Prénom</label>
                    <input type="text" id="profile-prenom" name="first_name" class="form-input" value="<?= e($user['first_name']) ?>" required>
                </div>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label for="profile-email" class="form-label">Email</label>
                    <input type="email" id="profile-email" name="email" class="form-input form-input-readonly" value="<?= e($user['email']) ?>" readonly>
                    <small class="form-help">L'email ne peut pas être modifié</small>
                </div>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label for="profile-telephone" class="form-label">Téléphone</label>
                    <input type="tel" id="profile-telephone" name="phone" class="form-input" value="<?= e($user['phone'] ?? '') ?>">
                </div>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label for="profile-photo" class="form-label">Photo de profil</label>
                    <div class="form-photo-container">
                        <div class="avatar avatar-large"><?= strtoupper(substr($user['first_name'], 0, 1) . substr($user['last_name'], 0, 1)) ?></div>
                        <input type="file" id="profile-photo" name="photo" class="form-input" accept="image/*">
                    </div>
                    <small class="form-help">Formats acceptés : JPG, PNG (max 2MB)</small>
                </div>
            </div>
            <div class="form-actions">
                <button type="submit" class="btn btn-primary">Enregistrer les modifications</button>
            </div>
        </form>
    </div>

    <!-- Changement de mot de passe -->
    <div class="card card-spacing">
        <h2 class="card-title">Changer le mot de passe</h2>
        <form id="password-form" class="ticket-form">
            <div class="form-messages" role="alert" aria-live="polite"></div>
            <div class="form-row">
                <div class="form-group">
                    <label for="old-password" class="form-label">Ancien mot de passe</label>
                    <input type="password" id="old-password" name="old_password" class="form-input" required>
                </div>
            </div>
            <div class="form-row form-row-2">
                <div class="form-group">
                    <label for="new-password" class="form-label">Nouveau mot de passe</label>
                    <input type="password" id="new-password" name="new_password" class="form-input" minlength="8" required>
                    <small class="form-help">Minimum 8 caractères</small>
                </div>
                <div class="form-group">
                    <label for="confirm-password" class="form-label">Confirmer le mot de passe</label>
                    <input type="password" id="confirm-password" name="confirm_password" class="form-input" required>
                </div>
            </div>
            <div class="form-actions">
                <button type="submit" class="btn btn-primary">Changer le mot de passe</button>
            </div>
        </form>
    </div>
</section>
