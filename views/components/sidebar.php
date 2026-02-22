<?php
/**
 * Composant Sidebar (admin/collaborateur)
 */
$pageName = $pageName ?? '';
?>
<aside class="sidebar">
    <nav class="sidebar-nav" aria-label="Menu principal">
        <ul class="nav-list">
            <li class="nav-item <?= $pageName === 'dashboard' ? 'active' : '' ?>" data-page="dashboard">
                <a href="<?= url('dashboard') ?>">
                    <span class="nav-icon">📊</span>
                    <span class="nav-label">Tableau de bord</span>
                </a>
            </li>
            <li class="nav-item nav-item-projets <?= $pageName === 'projets' || $pageName === 'projet-detail' || $pageName === 'projet-form' ? 'active' : '' ?>" data-page="projets">
                <a href="<?= url('projets') ?>">
                    <span class="nav-icon">📁</span>
                    <span class="nav-label">Projets</span>
                </a>
            </li>
            <li class="nav-item nav-item-tickets <?= $pageName === 'tickets' || $pageName === 'ticket-detail' || $pageName === 'ticket-form' ? 'active' : '' ?>" data-page="tickets">
                <a href="<?= url('tickets') ?>">
                    <span class="nav-icon">🎫</span>
                    <span class="nav-label">Tickets</span>
                </a>
            </li>
            <li class="nav-item nav-item-contrats role-admin-client <?= $pageName === 'contrats' || $pageName === 'contrat-detail' || $pageName === 'contrat-form' ? 'active' : '' ?>" data-page="contrats">
                <a href="<?= url('contrats') ?>">
                    <span class="nav-icon">📄</span>
                    <span class="nav-label">Contrats</span>
                </a>
            </li>
            <li class="nav-item nav-item-temps role-admin-collaborateur <?= $pageName === 'temps' ? 'active' : '' ?>" data-page="temps">
                <a href="<?= url('temps') ?>">
                    <span class="nav-icon">⏱️</span>
                    <span class="nav-label">Temps</span>
                </a>
            </li>
            <li class="nav-item nav-item-rapports role-admin-only <?= $pageName === 'rapports' ? 'active' : '' ?>" data-page="rapports">
                <a href="<?= url('rapports') ?>">
                    <span class="nav-icon">📈</span>
                    <span class="nav-label">Rapports</span>
                </a>
            </li>
            <li class="nav-item nav-item-utilisateurs role-admin-only <?= $pageName === 'utilisateurs' || $pageName === 'user-form' ? 'active' : '' ?>" data-page="utilisateurs">
                <a href="<?= url('utilisateurs') ?>">
                    <span class="nav-icon">👥</span>
                    <span class="nav-label">Utilisateurs</span>
                </a>
            </li>
            <li class="nav-item nav-item-validation role-client-only <?= $pageName === 'ticket-validation' ? 'active' : '' ?>" data-page="validation">
                <a href="<?= url('ticket-validation') ?>">
                    <span class="nav-icon">✅</span>
                    <span class="nav-label">Validation</span>
                </a>
            </li>
            <li class="nav-separator"></li>
            <li class="nav-item <?= $pageName === 'profil' ? 'active' : '' ?>" data-page="profil">
                <a href="<?= url('profil') ?>">
                    <span class="nav-icon">👤</span>
                    <span class="nav-label">Mon profil</span>
                </a>
            </li>
        </ul>
    </nav>
</aside>
