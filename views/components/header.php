<?php
/**
 * Composant Header
 */
$currentUser = Auth::user();
$userRole = Auth::role();
?>
<header class="header">
    <div class="header-left">
        <button type="button" class="menu-toggle" aria-label="Menu" aria-expanded="false">
            <span></span><span></span><span></span>
        </button>
        <a href="<?= url('dashboard') ?>" class="header-logo">
            <span class="header-logo-icon">ST</span>
            <span class="header-logo-text">Systicket</span>
        </a>
    </div>
    <div class="header-right">
        <div class="user-menu">
            <span class="user-name">
                <?= e(($currentUser['first_name'] ?? '') . ' ' . ($currentUser['last_name'] ?? '')) ?>
                <span class="user-role-badge <?= e($userRole) ?>"><?= e(ucfirst($userRole)) ?></span>
            </span>
            <a href="<?= url('profil') ?>" class="btn btn-text btn-small" title="Mon profil">👤</a>
            <a href="<?= url('logout') ?>" class="btn btn-text btn-small" title="Se déconnecter">🚪</a>
        </div>
    </div>
</header>
