<?php
/**
 * Page 404 (standalone)
 */
?>
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Page introuvable - Systicket</title>
    <link rel="stylesheet" href="<?= asset('css/style.css') ?>">
</head>
<body class="auth-page">
    <a href="#main-404" class="skip-link">Aller au contenu</a>

    <div class="auth-layout">
        <aside class="auth-brand">
            <div class="auth-brand-inner">
                <a href="<?= url('') ?>" class="auth-logo">
                    <span class="auth-logo-icon">ST</span>
                    <span class="auth-logo-text">Systicket</span>
                </a>
                <p class="auth-tagline">Page introuvable</p>
            </div>
        </aside>

        <main id="main-404" class="auth-form-panel">
            <div class="auth-form-wrapper">
                <div class="error-page-inner">
                    <p class="error-404-number">404</p>
                    <h1 class="error-404-title">Page introuvable</h1>
                    <p class="error-404-text">
                        La page que vous recherchez n'existe pas ou a été déplacée.
                    </p>
                    <div class="error-actions">
                        <a href="<?= url('') ?>" class="btn btn-primary">Accueil</a>
                        <a href="javascript:history.back()" class="btn btn-secondary">Retour</a>
                    </div>
                </div>
            </div>
        </main>
    </div>
</body>
</html>
