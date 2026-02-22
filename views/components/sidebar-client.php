<?php
/**
 * Composant Sidebar Client (navigation réduite)
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
            <li class="nav-item <?= $pageName === 'projets' || $pageName === 'projet-detail' ? 'active' : '' ?>" data-page="projets">
                <a href="<?= url('projets') ?>">
                    <span class="nav-icon">📁</span>
                    <span class="nav-label">Projets</span>
                </a>
            </li>
            <li class="nav-item <?= $pageName === 'tickets' || $pageName === 'ticket-detail' ? 'active' : '' ?>" data-page="tickets">
                <a href="<?= url('tickets') ?>">
                    <span class="nav-icon">🎫</span>
                    <span class="nav-label">Tickets</span>
                </a>
            </li>
            <li class="nav-item <?= $pageName === 'contrats' || $pageName === 'contrat-detail' ? 'active' : '' ?>" data-page="contrats">
                <a href="<?= url('contrats') ?>">
                    <span class="nav-icon">📄</span>
                    <span class="nav-label">Contrats</span>
                </a>
            </li>
            <li class="nav-item <?= $pageName === 'ticket-validation' ? 'active' : '' ?>" data-page="validation">
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
