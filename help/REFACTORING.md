# 🔧 Guide de Refactorisation

## Structure des composants

Les parties répétitives ont été extraites dans des fichiers séparés :

### Composants créés

- `components/header.html` - Header commun (logo, menu utilisateur, déconnexion)
- `components/sidebar.html` - Sidebar pour admin/collaborateur
- `components/sidebar-client.html` - Sidebar pour client (menu réduit)
- `components/overlay.html` - Overlay pour mobile
- `components/skip-link.html` - Lien d'accessibilité
- `components/scripts.html` - Scripts communs (sidebar.js, roles.js)

### Script de chargement

- `js/components-loader.js` - Charge automatiquement les composants dans les pages

## Utilisation dans les pages

### Structure de base d'une page

```html
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Nom de la page - Systicket</title>
    <link rel="stylesheet" href="css/style.css">
    <link rel="stylesheet" href="css/roles.css">
    <script src="js/components-loader.js" defer></script>
</head>
<body class="role-admin" data-role="admin" data-page="nom-page">
    <div data-component="skip-link"></div>
    <div data-component="header"></div>
    <div data-component="overlay"></div>
    <div class="container">
        <div data-component="sidebar"></div>
        <main id="main-content" class="main-content">
            <!-- Contenu spécifique de la page -->
        </main>
    </div>
    <div data-component="scripts"></div>
</body>
</html>
```

### Pour les pages client

Utiliser `data-component="sidebar-client"` au lieu de `data-component="sidebar"` :

```html
<div data-component="sidebar-client"></div>
```

### Attribut data-page

L'attribut `data-page` sur `<body>` permet au script d'activer automatiquement l'item de menu correspondant.

Valeurs possibles :
- `dashboard`
- `projets`
- `tickets`
- `clients`
- `contrats`
- `temps`
- `rapports`
- `utilisateurs`
- `profil`
- `validation` (pour ticket-validation.html)

## Pages refactorisées

Les pages suivantes ont été mises à jour pour utiliser le système de composants :
- ✅ `dashboard.html`
- ✅ `ticket-validation.html`

Les autres pages doivent être mises à jour manuellement en suivant le même modèle.
