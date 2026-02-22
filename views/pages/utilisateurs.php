<?php
/**
 * Gestion des utilisateurs
 */
?>
<div id="inviter" class="page-header">
    <div class="page-header-left">
        <h1>Gestion des utilisateurs</h1>
        <p class="page-subtitle">Rôles, permissions et accès à l'application</p>
    </div>
    <div class="page-header-right">
        <a href="<?= url('utilisateurs#inviter') ?>" class="btn btn-secondary">📧 Inviter</a>
        <a href="<?= url('user-form') ?>" class="btn btn-primary">+ Ajouter un utilisateur</a>
    </div>
</div>

<!-- Modifications de profil en attente (admin) -->
<section id="pending-profiles" class="content-section role-admin-only" style="display:none;">
    <div class="card">
        <h2 class="card-title">Modifications de profil en attente</h2>
        <p class="text-secondary text-sm">Les utilisateurs ont demandé des modifications. Validez ou refusez.</p>
        <div id="pending-profiles-list"></div>
        <p id="pending-profiles-empty" class="text-secondary text-sm" style="display:none;">Aucune modification en attente.</p>
    </div>
</section>

<!-- Filtres -->
<section class="filters-section">
    <div class="filters-bar">
        <input type="search" placeholder="Rechercher un utilisateur..." class="search-input" id="user-search">
        <select class="filter-select" id="filter-role" data-filter="role">
            <option value="">Tous les rôles</option>
            <option value="admin">Administrateur</option>
            <option value="collaborateur">Collaborateur</option>
            <option value="client">Client</option>
        </select>
        <select class="filter-select" id="filter-status" data-filter="status">
            <option value="">Tous les statuts</option>
            <option value="active">Actif</option>
            <option value="inactive">Inactif</option>
        </select>
    </div>
</section>

<!-- Tableau utilisateurs -->
<section class="content-section">
    <div class="table-container">
        <table class="table" id="users-table">
            <thead>
                <tr>
                    <th>Utilisateur</th>
                    <th>Email</th>
                    <th>Téléphone</th>
                    <th>Rôle</th>
                    <th>Statut</th>
                    <th>Dernière connexion</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody id="users-tbody">
                <tr class="table-empty-row">
                    <td colspan="7">Chargement des utilisateurs...</td>
                </tr>
            </tbody>
        </table>
    </div>
</section>
