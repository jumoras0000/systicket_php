<?php
/**
 * Systicket 2.0 - Layout principal (pages authentifiées)
 * Variables attendues: $pageContent (chemin vers la vue), $pageName (slug de page)
 */
$flash = getFlash();
$currentUser = Auth::user();
$userRole = Auth::role();
?>
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?= e(ucfirst(str_replace('-', ' ', $pageName))) ?> - Systicket</title>
    <link rel="stylesheet" href="<?= asset('css/style.css') ?>">
    <link rel="stylesheet" href="<?= asset('css/roles.css') ?>">
    <meta name="csrf-token" content="<?= csrfToken() ?>">
</head>
<body class="role-<?= e($userRole) ?>" data-role="<?= e($userRole) ?>" data-page="<?= e($pageName) ?>">
    <!-- Skip link -->
    <a href="#main-content" class="skip-link">Aller au contenu principal</a>

    <!-- Header -->
    <?php require __DIR__ . '/components/header.php'; ?>

    <!-- Overlay mobile -->
    <div class="sidebar-overlay"></div>

    <div class="container">
        <!-- Sidebar -->
        <?php 
        if ($userRole === 'client') {
            require __DIR__ . '/components/sidebar-client.php';
        } else {
            require __DIR__ . '/components/sidebar.php';
        }
        ?>

        <!-- Contenu principal -->
        <main id="main-content" class="main-content">
            <?php if ($flash): ?>
            <div class="validation-toast validation-toast-<?= e($flash['type']) ?>" style="display:block;" id="flash-toast">
                <?= e($flash['message']) ?>
            </div>
            <script>setTimeout(function(){ document.getElementById('flash-toast').style.display='none'; }, 3000);</script>
            <?php endif; ?>

            <?php require $pageContent; ?>
        </main>
    </div>

    <!-- Scripts frontend -->
    <script>
        // Variables globales PHP -> JS
        window.SYSTICKET = {
            baseUrl: '<?= APP_URL ?>',
            apiUrl: '<?= APP_URL ?>/api',
            csrfToken: '<?= csrfToken() ?>',
            user: <?= json_encode($currentUser, JSON_UNESCAPED_UNICODE) ?>,
            role: '<?= e($userRole) ?>'
        };
    </script>
    <script src="<?= asset('js/app.js') ?>"></script>
    <script src="<?= asset('js/forms-validation.js') ?>"></script>
    <script src="<?= asset('js/sidebar.js') ?>"></script>
    <script src="<?= asset('js/roles.js') ?>"></script>
    <script src="<?= asset('js/list-filters.js') ?>"></script>
    <script src="<?= asset('js/ticket-validation.js') ?>"></script>
    <script src="<?= asset('js/rapports.js') ?>"></script>
</body>
</html>
