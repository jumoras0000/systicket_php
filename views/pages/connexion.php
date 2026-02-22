<?php
/**
 * Page de connexion (standalone, pas de layout)
 */
// $loginError peut être défini par index.php lors d'un POST échoué
$error = ($loginError ?? null) ?: getFlash('error');
$success = getFlash('success');
?>
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Connexion - Systicket</title>
    <link rel="stylesheet" href="<?= asset('css/style.css') ?>">
</head>
<body class="auth-page auth-page-connexion">
    <a href="#login-form" class="skip-link">Aller au formulaire de connexion</a>

    <div class="auth-layout">
        <!-- Panneau gauche -->
        <aside class="auth-brand">
            <div class="auth-brand-inner">
                <a href="<?= url('') ?>" class="auth-logo">
                    <span class="auth-logo-icon">ST</span>
                    <span class="auth-logo-text">Systicket</span>
                </a>
                <p class="auth-tagline">Gestion de tickets et suivi du temps pour les équipes</p>
                <ul class="auth-features" aria-hidden="true">
                    <li class="auth-feature">
                        <span class="auth-feature-icon" aria-hidden="true">🎫</span>
                        <span>Gérez vos tickets et projets</span>
                    </li>
                    <li class="auth-feature">
                        <span class="auth-feature-icon" aria-hidden="true">⏱️</span>
                        <span>Suivi du temps et rapports</span>
                    </li>
                    <li class="auth-feature">
                        <span class="auth-feature-icon" aria-hidden="true">✅</span>
                        <span>Validation et facturation</span>
                    </li>
                </ul>
            </div>
        </aside>

        <!-- Formulaire -->
        <main class="auth-form-panel">
            <div class="auth-form-wrapper auth-form-connexion">
            
                <header class="auth-form-header">
                    <h1>Connexion</h1>
                    <p>Entrez vos identifiants pour accéder à votre espace</p>
                </header>

                <?php if ($error): ?>
                    <div class="alert alert-danger"><?= e($error) ?></div>
                <?php endif; ?>
                <?php if ($success): ?>
                    <div class="alert alert-success"><?= e($success) ?></div>
                <?php endif; ?>

                <form id="login-form" class="auth-form" action="<?= url('connexion') ?>" method="post">
                    <?= csrfField() ?>
                 
                    <div class="auth-form-group">
                        <label for="email" class="auth-label">Email ou identifiant</label>
                        <div class="auth-input-wrap">
                            <span class="auth-input-icon" aria-hidden="true">✉</span>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                class="auth-input"
                                placeholder="Email"
                                required
                                autocomplete="email"
                                value="<?= e(input('email', '')) ?>"
                            >
                        </div>
                    </div>

                    <div class="auth-form-group">
                        <label for="password" class="auth-label">Mot de passe</label>
                        <div class="auth-input-wrap">
                            <span class="auth-input-icon" aria-hidden="true">🔒</span>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                class="auth-input"
                                placeholder="Mot de passe"
                                required
                                autocomplete="current-password"
                            >
                        </div>
                    </div>

                    <div class="auth-form-row">
                        <label class="auth-checkbox">
                            <input type="checkbox" name="remember" id="remember">
                            <span class="auth-checkbox-box"></span>
                            <span class="auth-checkbox-label">Se souvenir de moi</span>
                        </label>
                        <a href="<?= url('mot-de-passe-oublie') ?>" class="auth-link">Mot de passe oublié ?</a>
                    </div>

                    <div class="auth-btn-flee-wrapper">
                        <button type="submit" class="auth-btn auth-btn-primary" id="auth-submit-btn">
                            Se connecter
                        </button>
                    </div>
                </form>

                <footer class="auth-form-footer">
                    <p>Vous n'avez pas de compte ? <a href="<?= url('inscription') ?>" class="auth-link auth-link-strong">Créer un compte</a></p>
                </footer>

            </div>
        </main>
    </div>
    
    <script src="<?= asset('js/auth-button.js') ?>"></script>
    <script src="<?= asset('js/forms-validation.js') ?>"></script>
    
</body>
</html>
