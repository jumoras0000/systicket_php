# 🔐 Gestion des Rôles et Permissions

## Vue d'ensemble

Le système de gestion des rôles et permissions a été implémenté pour contrôler l'accès aux différentes fonctionnalités selon le type d'utilisateur.

## Types d'utilisateurs

### 1. **Administrateur** (`admin`)
- **Accès complet** à toutes les fonctionnalités
- Peut gérer les utilisateurs, clients, contrats
- Peut créer/modifier tous les tickets et projets
- Accès aux rapports et statistiques

### 2. **Collaborateur** (`collaborateur`)
- **Accès limité** aux fonctionnalités opérationnelles
- Peut créer/modifier des tickets et projets
- Peut enregistrer du temps passé
- **Ne peut pas** :
  - Gérer les clients
  - Gérer les contrats
  - Gérer les utilisateurs
  - Voir les rapports

### 3. **Client** (`client`)
- **Accès très limité** pour consultation et validation
- Peut consulter ses projets
- Peut valider/refuser les tickets facturables
- **Ne peut pas** :
  - Créer/modifier des tickets
  - Créer/modifier des projets
  - Gérer les clients
  - Gérer les contrats
  - Voir les utilisateurs
  - Voir les rapports
  - Enregistrer du temps

## Implémentation technique

### Fichiers créés

1. **`css/roles.css`** : Styles CSS pour masquer/afficher les éléments selon le rôle
2. **`js/roles.js`** : Script JavaScript pour appliquer dynamiquement les restrictions

### Classes CSS utilisées

- `.role-admin-only` : Éléments visibles uniquement pour les administrateurs
- `.role-admin-collaborateur` : Éléments visibles pour admin et collaborateurs
- `.role-client-only` : Éléments visibles uniquement pour les clients
- `.role-admin-client` : Éléments visibles pour admin et clients

### Attributs HTML

Chaque page HTML contient :
- `data-role="admin|collaborateur|client"` sur l'élément `<body>`
- Classe `role-{role}` sur l'élément `<body>`
- Badge de rôle dans le header : `<span class="user-role-badge {role}">`

## Restrictions par page

### Pages réservées aux administrateurs
- `clients.html` - Gestion des clients
- `client-detail.html` - Détail d'un client
- `client-form.html` - Formulaire client
- `contrats.html` - Gestion des contrats
- `contrat-detail.html` - Détail d'un contrat
- `contrat-form.html` - Formulaire contrat
- `utilisateurs.html` - Gestion des utilisateurs
- `rapports.html` - Rapports et statistiques

### Pages accessibles aux admin et collaborateurs
- `tickets.html` - Liste des tickets
- `ticket-detail.html` - Détail d'un ticket
- `ticket-form.html` - Formulaire ticket
- `projets.html` - Liste des projets
- `projet-detail.html` - Détail d'un projet
- `projet-form.html` - Formulaire projet
- `temps.html` - Suivi du temps

### Pages accessibles à tous
- `dashboard.html` - Tableau de bord
- `profil.html` - Profil utilisateur

### Pages spécifiques aux clients
- `ticket-validation.html` - Validation des tickets facturables

## Restrictions par action

### Boutons masqués selon le rôle

#### Clients
- `+ Créer un ticket` (`.btn-create-ticket`)
- `✏️ Éditer` ticket/projet (`.btn-edit-ticket`, `.btn-edit-project`)
- `+ Créer un projet` (`.btn-create-project`)
- `+ Ajouter un client` (`.btn-create-client`)
- `✏️ Éditer` client (`.btn-edit-client`)
- `+ Créer un contrat` (`.btn-create-contract`)
- `✏️ Éditer` contrat (`.btn-edit-contract`)
- `+ Assigner` / Gérer utilisateurs (`.btn-manage-users`)

#### Collaborateurs
- `+ Ajouter un client` (`.btn-create-client`)
- `✏️ Éditer` client (`.btn-edit-client`)
- `+ Créer un contrat` (`.btn-create-contract`)
- `✏️ Éditer` contrat (`.btn-edit-contract`)
- `+ Assigner` / Gérer utilisateurs (`.btn-manage-users`)

## Menu de navigation

### Menu complet (Admin)
- Tableau de bord
- Projets
- Tickets
- Clients
- Contrats
- Suivi du temps
- Rapports
- Utilisateurs
- Mon profil

### Menu collaborateur
- Tableau de bord
- Projets
- Tickets
- Suivi du temps
- Mon profil

### Menu client
- Tableau de bord
- Mes projets
- Validation
- Mon profil

## Utilisation

### Pour tester différents rôles

1. **Via l'URL** : Ajouter `?role=admin`, `?role=collaborateur` ou `?role=client` à l'URL
   - Exemple : `dashboard.html?role=collaborateur`

2. **Via localStorage** : Le script `roles.js` sauvegarde le rôle dans `localStorage` pour la session

### Exemple de code

```html
<!-- Badge de rôle dans le header -->
<span class="user-name">
    user 
    <span class="user-role-badge admin">Admin</span>
</span>

<!-- Bouton masqué pour les clients -->
<a href="ticket-form.html" class="btn btn-primary btn-create-ticket role-admin-collaborateur">
    + Créer un ticket
</a>

<!-- Menu masqué pour les clients et collaborateurs -->
<li class="nav-item nav-item-clients role-admin-only">
    <a href="clients.html" class="nav-link">Clients</a>
</li>
```

## Notes importantes

⚠️ **Phase 1 (HTML/CSS statique)** : 
- Les restrictions sont appliquées côté client (CSS/JS)
- En production, ces restrictions doivent être validées côté serveur
- Le système actuel est une **démonstration visuelle** des permissions

✅ **Pour la phase 2+ (avec backend)** :
- Implémenter la validation côté serveur
- Utiliser des sessions/authentification réelle
- Vérifier les permissions avant chaque action
