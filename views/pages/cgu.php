<?php
/**
 * Conditions générales d'utilisation (standalone)
 */
?>
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Conditions générales d'utilisation - Systicket</title>
    <link rel="stylesheet" href="<?= asset('css/style.css') ?>">
</head>
<body>
    <a href="#main-content" class="skip-link">Aller au contenu</a>
    <header class="header">
        <div class="header-left">
            <a href="<?= url('') ?>" class="header-logo">
                <span class="header-logo-icon">ST</span>
                <span class="header-logo-text">Systicket</span>
            </a>
        </div>
        <div class="header-right">
            <a href="<?= url('inscription') ?>" class="btn btn-text">← Retour à l'inscription</a>
        </div>
    </header>

    <main id="main-content" class="main-content" style="max-width: 720px; margin: 0 auto; padding: var(--spacing-xl);">
        <div class="page-header">
            <h1>Conditions générales d'utilisation</h1>
            <p class="page-subtitle">Dernière mise à jour : février 2026</p>
        </div>

        <section class="card">
            <h2>1. Objet</h2>
            <p>Les présentes conditions générales d'utilisation (CGU) ont pour objet de définir les modalités d'utilisation du service Systicket, application de gestion de ticketing et de suivi du temps.</p>

            <h2>2. Acceptation</h2>
            <p>L'accès et l'utilisation du service sont subordonnés à l'acceptation et au respect des présentes CGU. En créant un compte, l'utilisateur accepte sans réserve les présentes conditions.</p>

            <h2>3. Description du service</h2>
            <p>Systicket permet la gestion de projets, tickets, clients, contrats et du suivi du temps. Les fonctionnalités accessibles dépendent du profil et des droits attribués à l'utilisateur.</p>

            <h2>4. Compte utilisateur</h2>
            <p>L'utilisateur s'engage à fournir des informations exactes et à maintenir la confidentialité de ses identifiants. Il est responsable de toute activité réalisée depuis son compte.</p>

            <h2>5. Données et confidentialité</h2>
            <p>Les données saisies dans l'application sont traitées conformément à la réglementation en vigueur. L'utilisateur conserve la propriété de ses données et peut les exporter selon les fonctionnalités proposées.</p>

            <h2>6. Contact</h2>
            <p>Pour toute question relative aux présentes CGU : contact@systicket.example.com</p>
        </section>

        <p style="margin-top: var(--spacing-lg);">
            <a href="<?= url('inscription') ?>" class="btn btn-primary">Retour à l'inscription</a>
        </p>
    </main>
</body>
</html>
