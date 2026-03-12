<?php
/**
 * Page d'accueil (landing)
 */
?>
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Systicket - Gestion de tickets</title>
    <link rel="stylesheet" href="<?= asset('css/style.css') ?>">
</head>
<body class="home-page">
    <header class="home-header">
        <div class="home-header-inner">
            <a href="<?= url('') ?>" class="home-logo">
                <span class="header-logo-icon">ST</span>
                <span class="header-logo-text">Systicket</span>
            </a>
            <nav class="home-nav">
                <?php if (Auth::check()): ?>
                    <a href="<?= url('dashboard') ?>" class="btn btn-primary">Tableau de bord</a>
                <?php else: ?>
                    <a href="<?= url('connexion') ?>" class="btn btn-text">Connexion</a>
                    <a href="<?= url('inscription') ?>" class="btn btn-primary">Inscription</a>
                <?php endif; ?>
            </nav>
        </div>
    </header>

    <main class="home-main">
        <section class="home-hero">
            <div class="home-hero-inner">
                <h1>Gérez vos tickets et projets en toute simplicité</h1>
                <p class="home-hero-subtitle">Systicket est la plateforme de gestion de tickets, suivi du temps</p>
                <div class="home-hero-actions">
                    <?php if (Auth::check()): ?>
                        <a href="<?= url('dashboard') ?>" class="btn btn-primary btn-lg">Accéder au tableau de bord</a>
                    <?php else: ?>
                        <a href="<?= url('inscription') ?>" class="btn btn-primary btn-lg">Commencer </a>
                        <a href="<?= url('connexion') ?>" class="btn btn-secondary btn-lg">Se connecter</a>
                    <?php endif; ?>
                </div>
            </div>
        </section>

        <section class="home-features">
            <div class="home-features-grid">
                <div class="home-feature-card">
                    <span class="home-feature-icon">🎫</span>
                    <h3>Gestion des tickets</h3>
                    <p>Créez, assignez et suivez vos tickets avec priorités et statuts.</p>
                </div>
                <div class="home-feature-card">
                    <span class="home-feature-icon">⏱️</span>
                    <h3>Suivi du temps</h3>
                    <p>Enregistrez le temps passé sur chaque ticket et projet.</p>
                </div>
                <div class="home-feature-card">
                    <span class="home-feature-icon">📊</span>
                    <h3>Rapports détaillés</h3>
                    <p>Analysez vos performances avec des tableaux de bord et rapports.</p>
                </div>
                <div class="home-feature-card">
                    <span class="home-feature-icon">✅</span>
                    <h3>Validation client</h3>
                    <p>Vos clients valident ou refusent les tickets facturables.</p>
                </div>
            </div>
        </section>
    </main>
</body>
</html>
