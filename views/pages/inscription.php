<?php
/**
 * Page d'inscription (standalone, pas de layout)
 */
// $registerError peut être défini par index.php lors d'un POST échoué
$error = ($registerError ?? null) ?: getFlash('error');
$success = getFlash('success');
?>
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Inscription - Systicket</title>
    <link rel="stylesheet" href="<?= asset('css/style.css') ?>">
</head>
<body class="auth-page">
    <a href="#register-form" class="skip-link">Aller au formulaire d'inscription</a>

    <div class="auth-layout">
        <aside class="auth-brand">
            <div class="auth-brand-inner">
                <a href="<?= url('') ?>" class="auth-logo">
                    <span class="auth-logo-icon">ST</span>
                    <span class="auth-logo-text">Systicket</span>
                </a>
                <p class="auth-tagline">Rejoignez la plateforme de gestion de tickets</p>
                <ul class="auth-features" aria-hidden="true">
                    <li class="auth-feature">
                        <span class="auth-feature-icon" aria-hidden="true">📁</span>
                        <span>Projets et clients centralisés</span>
                    </li>
                    <li class="auth-feature">
                        <span class="auth-feature-icon" aria-hidden="true">📊</span>
                        <span>Tableaux de bord et statistiques</span>
                    </li>
                    <li class="auth-feature">
                        <span class="auth-feature-icon" aria-hidden="true">🔐</span>
                        <span>Accès sécurisé par rôle</span>
                    </li>
                </ul>
            </div>
        </aside>

        <!-- Formulaire -->
        <main class="auth-form-panel auth-form-panel-scroll">
            <div class="auth-form-wrapper">
                <header class="auth-form-header">
                    <h1>Créer un compte</h1>
                    <p>Remplissez le formulaire pour vous inscrire</p>
                </header>

                <?php if ($error): ?>
                    <div class="alert alert-danger"><?= e($error) ?></div>
                <?php endif; ?>
                <?php if ($success): ?>
                    <div class="alert alert-success"><?= e($success) ?></div>
                <?php endif; ?>

                <form id="register-form" class="auth-form" action="<?= url('inscription') ?>" method="post">
                    <?= csrfField() ?>

                    <div class="auth-form-row auth-form-row-2">
                        <div class="auth-form-group">
                            <label for="nom" class="auth-label">Nom <span class="auth-required">*</span></label>
                            <div class="auth-input-wrap auth-input-wrap-no-icon">
                                <input type="text" id="nom" name="last_name" class="auth-input" placeholder="Nom" required autocomplete="family-name" value="<?= e(post('last_name', '')) ?>">
                            </div>
                        </div>
                        <div class="auth-form-group">
                            <label for="prenom" class="auth-label">Prénom <span class="auth-required">*</span></label>
                            <div class="auth-input-wrap auth-input-wrap-no-icon">
                                <input type="text" id="prenom" name="first_name" class="auth-input" placeholder="Prénom" required autocomplete="given-name" value="<?= e(post('first_name', '')) ?>">
                            </div>
                        </div>
                    </div>

                    <div class="auth-form-group">
                        <label for="email" class="auth-label">Email <span class="auth-required">*</span></label>
                        <div class="auth-input-wrap">
                            <span class="auth-input-icon" aria-hidden="true">✉</span>
                            <input type="email" id="email" name="email" class="auth-input" placeholder="Email" required autocomplete="email" value="<?= e(post('email', '')) ?>">
                        </div>
                    </div>

                    <div class="auth-form-group">
                        <label for="password" class="auth-label">Mot de passe <span class="auth-required">*</span></label>
                        <div class="auth-input-wrap">
                            <span class="auth-input-icon" aria-hidden="true">🔒</span>
                            <input type="password" id="password" name="password" class="auth-input" placeholder="Mot de passe" minlength="8" required autocomplete="new-password">
                        </div>
                        <span class="auth-help">Minimum 8 caractères</span>
                    </div>

                    <div class="auth-form-group">
                        <label for="password-confirm" class="auth-label">Confirmer le mot de passe <span class="auth-required">*</span></label>
                        <div class="auth-input-wrap">
                            <span class="auth-input-icon" aria-hidden="true">🔒</span>
                            <input type="password" id="password-confirm" name="password_confirm" class="auth-input" placeholder="Confirmer le mot de passe" required autocomplete="new-password">
                        </div>
                    </div>

                    <div class="auth-form-group">
                        <span class="auth-label">Rôle <span class="auth-required">*</span></span>
                        <div class="auth-radio-group">
                            <label class="auth-radio">
                                <input type="radio" name="role" value="collaborateur" required <?= post('role') === 'collaborateur' ? 'checked' : '' ?>>
                                <span class="auth-radio-dot"></span>
                                <span>Collaborateur</span>
                            </label>
                            <label class="auth-radio">
                                <input type="radio" name="role" value="client" required <?= post('role') === 'client' ? 'checked' : '' ?>>
                                <span class="auth-radio-dot"></span>
                                <span>Client</span>
                            </label>
                        </div>
                        <span class="auth-help">Seuls les collaborateurs et clients peuvent s'inscrire.</span>
                    </div>

                    <div class="auth-form-group">
                        <label class="auth-checkbox">
                            <input type="checkbox" name="cgv" id="cgv" required>
                            <span class="auth-checkbox-box"></span>
                            <span class="auth-checkbox-label">J'accepte les <a href="<?= url('cgu') ?>" class="auth-link" target="_blank" rel="noopener">conditions générales d'utilisation</a> <span class="auth-required">*</span></span>
                        </label>
                    </div>

                    <div class="auth-form-footer auth-form-footer-before-submit">
                        <p>Vous avez déjà un compte ? <a href="<?= url('connexion') ?>" class="auth-link auth-link-strong">Se connecter</a></p>
                    </div>

                    <div class="auth-btn-flee-wrapper">
                        <button type="submit" class="auth-btn auth-btn-primary" id="auth-submit-btn">
                            Créer mon compte
                        </button>
                    </div>
                </form>
            </div>
        </main>
    </div>
    <script src="<?= asset('js/auth-button.js') ?>"></script>
    <script src="<?= asset('js/forms-validation.js') ?>"></script>
</body>
</html>
