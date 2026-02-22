<?php
/**
 * Page mot de passe oublié (standalone)
 */
$error = getFlash('error');
$success = getFlash('success');
?>
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Mot de passe oublié - Systicket</title>
    <link rel="stylesheet" href="<?= asset('css/style.css') ?>">
</head>
<body class="auth-page auth-page-connexion">
    <a href="#reset-form" class="skip-link">Aller au formulaire</a>

    <div class="auth-layout">
        <aside class="auth-brand">
            <div class="auth-brand-inner">
                <a href="<?= url('') ?>" class="auth-logo">
                    <span class="auth-logo-icon">ST</span>
                    <span class="auth-logo-text">Systicket</span>
                </a>
                <p class="auth-tagline">Réinitialisez votre mot de passe en quelques clics</p>
            </div>
        </aside>

        <main class="auth-form-panel">
            <div class="auth-form-wrapper auth-form-connexion">
                <header class="auth-form-header">
                    <h1>Mot de passe oublié</h1>
                    <p>Indiquez votre adresse email pour recevoir un lien de réinitialisation</p>
                </header>

                <?php if ($error): ?>
                    <div class="alert alert-danger"><?= e($error) ?></div>
                <?php endif; ?>
                <?php if ($success): ?>
                    <div class="alert alert-success"><?= e($success) ?></div>
                <?php endif; ?>

                <form id="reset-form" class="auth-form" action="<?= url('mot-de-passe-oublie') ?>" method="post">
                    <?= csrfField() ?>
                    <div class="auth-form-group">
                        <label for="email" class="auth-label">Email</label>
                        <div class="auth-input-wrap">
                            <span class="auth-input-icon" aria-hidden="true">✉</span>
                            <input type="email" id="email" name="email" class="auth-input" placeholder="Email" required autocomplete="email">
                        </div>
                    </div>

                    <div class="auth-btn-flee-wrapper">
                        <button type="submit" class="auth-btn auth-btn-primary">
                            Envoyer le lien
                        </button>
                    </div>
                </form>

                <footer class="auth-form-footer">
                    <p><a href="<?= url('connexion') ?>" class="auth-link auth-link-strong">← Retour à la connexion</a></p>
                </footer>
            </div>
        </main>
    </div>
    <script src="<?= asset('js/forms-validation.js') ?>"></script>
</body>
</html>
