# 📐 EXEMPLES DE STRUCTURE HTML
## Guide pratique pour l'Étape 1

Ce document fournit des exemples de structure HTML sémantique pour les pages principales de l'application Systicket.

---

## 🏗️ STRUCTURE GÉNÉRALE D'UNE PAGE

```html
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Nom de la page - Systicket</title>
    <link rel="stylesheet" href="css/style.css">
</head>
<body>
    <!-- Header (sur toutes les pages sauf connexion/inscription) -->
    <header class="header">
        <!-- Contenu header -->
    </header>

    <!-- Container principal avec sidebar et contenu -->
    <div class="container">
        <!-- Sidebar navigation -->
        <aside class="sidebar">
            <!-- Menu navigation -->
        </aside>

        <!-- Contenu principal -->
        <main class="main-content">
            <!-- Contenu de la page -->
        </main>
    </div>

    <!-- Footer (optionnel) -->
    <footer class="footer">
        <!-- Contenu footer -->
    </footer>
</body>
</html>
```

---

## 🔐 PAGE DE CONNEXION

```html
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Connexion - Systicket</title>
    <link rel="stylesheet" href="css/style.css">
</head>
<body class="login-page">
    <div class="login-container">
        <div class="login-card">
            <div class="login-header">
                <img src="assets/images/logo.svg" alt="Logo Systicket" class="logo">
                <h1>Connexion</h1>
                <p>Connectez-vous à votre compte</p>
            </div>

            <form class="login-form" action="#" method="post">
                <div class="form-group">
                    <label for="email" class="form-label">Email ou identifiant</label>
                    <input 
                        type="email" 
                        id="email" 
                        name="email" 
                        class="form-input" 
                        placeholder="votre@email.com" 
                        required
                    >
                </div>

                <div class="form-group">
                    <label for="password" class="form-label">Mot de passe</label>
                    <input 
                        type="password" 
                        id="password" 
                        name="password" 
                        class="form-input" 
                        placeholder="••••••••" 
                        required
                    >
                </div>

                <div class="form-group form-group-inline">
                    <label class="checkbox-label">
                        <input type="checkbox" name="remember" id="remember">
                        <span>Se souvenir de moi</span>
                    </label>
                    <a href="#" class="link">Mot de passe oublié ?</a>
                </div>

                <button type="submit" class="btn btn-primary btn-block">
                    Se connecter
                </button>
            </form>

            <div class="login-footer">
                <p>Vous n'avez pas de compte ? <a href="inscription.html">Créer un compte</a></p>
            </div>
        </div>
    </div>
</body>
</html>
```

---

## 🏠 TABLEAU DE BORD

```html
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Tableau de bord - Systicket</title>
    <link rel="stylesheet" href="css/style.css">
</head>
<body>
    <header class="header">
        <div class="header-left">
            <img src="assets/images/logo.svg" alt="Logo" class="logo-small">
            <h1 class="header-title">Systicket</h1>
        </div>
        <div class="header-right">
            <div class="user-menu">
                <span class="user-name">user</span>
                <img src="assets/images/avatar-placeholder.svg" alt="Avatar" class="avatar">
            </div>
            <a href="connexion.html" class="btn btn-text">Déconnexion</a>
        </div>
    </header>

    <div class="container">
        <aside class="sidebar">
            <nav class="sidebar-nav">
                <ul class="nav-list">
                    <li class="nav-item active">
                        <a href="dashboard.html" class="nav-link">
                            <span class="nav-icon">📊</span>
                            Tableau de bord
                        </a>
                    </li>
                    <li class="nav-item">
                        <a href="projets.html" class="nav-link">
                            <span class="nav-icon">📁</span>
                            Projets
                        </a>
                    </li>
                    <li class="nav-item">
                        <a href="tickets.html" class="nav-link">
                            <span class="nav-icon">🎫</span>
                            Tickets
                        </a>
                    </li>
                    <li class="nav-item">
                        <a href="clients.html" class="nav-link">
                            <span class="nav-icon">🏢</span>
                            Clients
                        </a>
                    </li>
                    <li class="nav-item">
                        <a href="contrats.html" class="nav-link">
                            <span class="nav-icon">📄</span>
                            Contrats
                        </a>
                    </li>
                    <li class="nav-item">
                        <a href="rapports.html" class="nav-link">
                            <span class="nav-icon">📈</span>
                            Rapports
                        </a>
                    </li>
                    <li class="nav-item">
                        <a href="profil.html" class="nav-link">
                            <span class="nav-icon">👤</span>
                            Mon profil
                        </a>
                    </li>
                </ul>
            </nav>
        </aside>

        <main class="main-content">
            <div class="page-header">
                <h1>Tableau de bord</h1>
                <p class="page-subtitle">Vue d'ensemble de vos activités</p>
            </div>

            <!-- Cards de statistiques -->
            <section class="stats-grid">
                <article class="stat-card stat-card-blue">
                    <div class="stat-icon">🎫</div>
                    <div class="stat-content">
                        <h3 class="stat-value">24</h3>
                        <p class="stat-label">Tickets ouverts</p>
                    </div>
                </article>

                <article class="stat-card stat-card-orange">
                    <div class="stat-icon">⚙️</div>
                    <div class="stat-content">
                        <h3 class="stat-value">12</h3>
                        <p class="stat-label">Tickets en cours</p>
                    </div>
                </article>

                <article class="stat-card stat-card-green">
                    <div class="stat-icon">✅</div>
                    <div class="stat-content">
                        <h3 class="stat-value">48</h3>
                        <p class="stat-label">Tickets terminés</p>
                    </div>
                </article>

                <article class="stat-card stat-card-purple">
                    <div class="stat-icon">⏳</div>
                    <div class="stat-content">
                        <h3 class="stat-value">8</h3>
                        <p class="stat-label">À valider</p>
                    </div>
                </article>
            </section>

            <!-- Widgets -->
            <section class="dashboard-widgets">
                <div class="widget-grid">
                    <article class="widget-card">
                        <header class="widget-header">
                            <h2>Mes projets actifs</h2>
                            <a href="projets.html" class="link">Voir tout</a>
                        </header>
                        <div class="widget-content">
                            <ul class="project-list">
                                <li class="project-item">
                                    <div class="project-info">
                                        <h3>Site web e-commerce</h3>
                                        <p class="project-client">Client : Acme Corp</p>
                                    </div>
                                    <div class="project-progress">
                                        <div class="progress-bar">
                                            <div class="progress-fill" style="width: 65%"></div>
                                        </div>
                                        <span class="progress-text">65% (32h / 50h)</span>
                                    </div>
                                </li>
                                <!-- Plus de projets... -->
                            </ul>
                        </div>
                    </article>

                    <article class="widget-card">
                        <header class="widget-header">
                            <h2>Tickets récents</h2>
                            <a href="tickets.html" class="link">Voir tout</a>
                        </header>
                        <div class="widget-content">
                            <table class="table table-compact">
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Titre</th>
                                        <th>Statut</th>
                                        <th>Date</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>#1234</td>
                                        <td><a href="ticket-detail.html">Correction bug panier</a></td>
                                        <td><span class="badge badge-warning">En cours</span></td>
                                        <td>15 Jan 2026</td>
                                    </tr>
                                    <!-- Plus de tickets... -->
                                </tbody>
                            </table>
                        </div>
                    </article>
                </div>
            </section>
        </main>
    </div>
</body>
</html>
```

---

## 🎫 LISTE DES TICKETS

```html
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Tickets - Systicket</title>
    <link rel="stylesheet" href="css/style.css">
</head>
<body>
    <!-- Header et Sidebar identiques au dashboard -->
    <header class="header">
        <!-- ... -->
    </header>

    <div class="container">
        <aside class="sidebar">
            <!-- ... -->
        </aside>

        <main class="main-content">
            <div class="page-header">
                <div class="page-header-left">
                    <h1>Tickets</h1>
                    <p class="page-subtitle">Gérez tous vos tickets</p>
                </div>
                <div class="page-header-right">
                    <a href="ticket-form.html" class="btn btn-primary">
                        + Créer un ticket
                    </a>
                </div>
            </div>

            <!-- Filtres -->
            <section class="filters-section">
                <div class="filters-bar">
                    <input 
                        type="search" 
                        placeholder="Rechercher un ticket..." 
                        class="search-input"
                    >
                    <select class="filter-select">
                        <option>Tous les statuts</option>
                        <option>Nouveau</option>
                        <option>En cours</option>
                        <option>Terminé</option>
                        <option>À valider</option>
                    </select>
                    <select class="filter-select">
                        <option>Toutes les priorités</option>
                        <option>Faible</option>
                        <option>Normale</option>
                        <option>Élevée</option>
                        <option>Critique</option>
                    </select>
                    <select class="filter-select">
                        <option>Tous les types</option>
                        <option>Inclus</option>
                        <option>Facturable</option>
                    </select>
                </div>
            </section>

            <!-- Tableau des tickets -->
            <section class="content-section">
                <div class="table-container">
                    <table class="table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Titre</th>
                                <th>Projet</th>
                                <th>Client</th>
                                <th>Statut</th>
                                <th>Priorité</th>
                                <th>Type</th>
                                <th>Assigné</th>
                                <th>Temps</th>
                                <th>Date</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>#1234</td>
                                <td>
                                    <a href="ticket-detail.html" class="link">
                                        Correction bug panier
                                    </a>
                                </td>
                                <td>Site e-commerce</td>
                                <td>Acme Corp</td>
                                <td>
                                    <span class="badge badge-warning">En cours</span>
                                </td>
                                <td>
                                    <span class="badge badge-danger">Critique</span>
                                </td>
                                <td>
                                    <span class="badge badge-success">Inclus</span>
                                </td>
                                <td>
                                    <div class="avatar-group">
                                        <span class="avatar-small">JD</span>
                                    </div>
                                </td>
                                <td>2h / 3h</td>
                                <td>15 Jan 2026</td>
                                <td>
                                    <div class="action-buttons">
                                        <a href="ticket-detail.html" class="btn-icon" title="Voir">
                                            👁️
                                        </a>
                                        <a href="ticket-form.html?id=1234" class="btn-icon" title="Éditer">
                                            ✏️
                                        </a>
                                    </div>
                                </td>
                            </tr>
                            <!-- Plus de lignes... -->
                        </tbody>
                    </table>
                </div>

                <!-- Pagination -->
                <div class="pagination">
                    <button class="btn btn-text" disabled>Précédent</button>
                    <span class="pagination-info">Page 1 sur 5</span>
                    <button class="btn btn-text">Suivant</button>
                </div>
            </section>
        </main>
    </div>
</body>
</html>
```

---

## 📝 FORMULAIRE DE CRÉATION DE TICKET

```html
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Créer un ticket - Systicket</title>
    <link rel="stylesheet" href="css/style.css">
</head>
<body>
    <!-- Header et Sidebar -->
    <header class="header">
        <!-- ... -->
    </header>

    <div class="container">
        <aside class="sidebar">
            <!-- ... -->
        </aside>

        <main class="main-content">
            <!-- Breadcrumb -->
            <nav class="breadcrumb">
                <a href="dashboard.html">Accueil</a>
                <span class="breadcrumb-separator">/</span>
                <a href="tickets.html">Tickets</a>
                <span class="breadcrumb-separator">/</span>
                <span>Créer un ticket</span>
            </nav>

            <div class="page-header">
                <h1>Créer un nouveau ticket</h1>
            </div>

            <section class="form-section">
                <form class="ticket-form" action="#" method="post">
                    <div class="form-row">
                        <div class="form-group">
                            <label for="ticket-title" class="form-label">
                                Titre du ticket <span class="required">*</span>
                            </label>
                            <input 
                                type="text" 
                                id="ticket-title" 
                                name="title" 
                                class="form-input" 
                                placeholder="Ex: Correction bug panier" 
                                required
                            >
                        </div>
                    </div>

                    <div class="form-row">
                        <div class="form-group">
                            <label for="ticket-description" class="form-label">
                                Description <span class="required">*</span>
                            </label>
                            <textarea 
                                id="ticket-description" 
                                name="description" 
                                class="form-textarea" 
                                rows="6" 
                                placeholder="Décrivez en détail le problème ou la demande..."
                                required
                            ></textarea>
                            <small class="form-help">Minimum 10 caractères</small>
                        </div>
                    </div>

                    <div class="form-row form-row-2">
                        <div class="form-group">
                            <label for="ticket-project" class="form-label">
                                Projet <span class="required">*</span>
                            </label>
                            <select id="ticket-project" name="project" class="form-select" required>
                                <option value="">Sélectionner un projet</option>
                                <option value="1">Site web e-commerce</option>
                                <option value="2">Application mobile</option>
                                <option value="3">Refonte site vitrine</option>
                            </select>
                        </div>

                        <div class="form-group">
                            <label for="ticket-priority" class="form-label">
                                Priorité
                            </label>
                            <select id="ticket-priority" name="priority" class="form-select">
                                <option value="normal">Normale</option>
                                <option value="low">Faible</option>
                                <option value="high">Élevée</option>
                                <option value="critical">Critique</option>
                            </select>
                        </div>
                    </div>

                    <div class="form-row">
                        <div class="form-group">
                            <label class="form-label">
                                Type de ticket <span class="required">*</span>
                            </label>
                            <div class="radio-group">
                                <label class="radio-label">
                                    <input 
                                        type="radio" 
                                        name="type" 
                                        value="included" 
                                        checked
                                        required
                                    >
                                    <span>Inclus dans le contrat</span>
                                </label>
                                <label class="radio-label">
                                    <input 
                                        type="radio" 
                                        name="type" 
                                        value="billable" 
                                        required
                                    >
                                    <span>Facturable en supplément</span>
                                </label>
                            </div>
                        </div>
                    </div>

                    <div class="form-row form-row-2">
                        <div class="form-group">
                            <label for="ticket-estimated-hours" class="form-label">
                                Temps estimé (heures)
                            </label>
                            <input 
                                type="number" 
                                id="ticket-estimated-hours" 
                                name="estimated_hours" 
                                class="form-input" 
                                min="0" 
                                step="0.5" 
                                placeholder="3"
                            >
                        </div>

                        <div class="form-group">
                            <label for="ticket-assignees" class="form-label">
                                Assigner à
                            </label>
                            <select 
                                id="ticket-assignees" 
                                name="assignees[]" 
                                class="form-select" 
                                multiple
                            >
                                <option value="1">user</option>
                                <option value="2">Marie Martin</option>
                                <option value="3">Pierre Durand</option>
                            </select>
                            <small class="form-help">Maintenez Ctrl (Cmd sur Mac) pour sélectionner plusieurs</small>
                        </div>
                    </div>

                    <div class="form-actions">
                        <button type="submit" class="btn btn-primary">
                            Créer le ticket
                        </button>
                        <a href="tickets.html" class="btn btn-secondary">
                            Annuler
                        </a>
                        <button type="submit" name="draft" class="btn btn-text">
                            Enregistrer comme brouillon
                        </button>
                    </div>
                </form>
            </section>
        </main>
    </div>
</body>
</html>
```

---

## 🎫 DÉTAIL D'UN TICKET

```html
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Ticket #1234 - Systicket</title>
    <link rel="stylesheet" href="css/style.css">
</head>
<body>
    <!-- Header et Sidebar -->
    <header class="header">
        <!-- ... -->
    </header>

    <div class="container">
        <aside class="sidebar">
            <!-- ... -->
        </aside>

        <main class="main-content">
            <!-- Breadcrumb -->
            <nav class="breadcrumb">
                <a href="dashboard.html">Accueil</a>
                <span class="breadcrumb-separator">/</span>
                <a href="tickets.html">Tickets</a>
                <span class="breadcrumb-separator">/</span>
                <span>Ticket #1234</span>
            </nav>

            <!-- En-tête du ticket -->
            <header class="ticket-header">
                <div class="ticket-header-left">
                    <h1>Correction bug panier</h1>
                    <div class="ticket-meta">
                        <span class="ticket-id">#1234</span>
                        <span class="badge badge-warning">En cours</span>
                        <span class="badge badge-danger">Critique</span>
                        <span class="badge badge-success">Inclus</span>
                    </div>
                </div>
                <div class="ticket-header-right">
                    <a href="ticket-form.html?id=1234" class="btn btn-secondary">
                        ✏️ Éditer
                    </a>
                    <button class="btn btn-primary">
                        ⏱️ Ajouter du temps
                    </button>
                </div>
            </header>

            <div class="ticket-layout">
                <!-- Colonne principale -->
                <div class="ticket-main">
                    <!-- Description -->
                    <section class="ticket-section">
                        <h2>Description</h2>
                        <div class="ticket-description">
                            <p>Le panier ne se met pas à jour correctement lorsque l'utilisateur ajoute plusieurs produits. 
                            Le total affiché reste à 0€ même après ajout d'articles.</p>
                            <p>Problème identifié sur les navigateurs Chrome et Firefox, version mobile uniquement.</p>
                        </div>
                    </section>

                    <!-- Temps passé -->
                    <section class="ticket-section">
                        <div class="section-header">
                            <h2>Temps passé</h2>
                            <span class="time-total">Total : 2h 30min</span>
                        </div>
                        <div class="time-entries">
                            <article class="time-entry">
                                <div class="time-entry-header">
                                    <span class="time-date">15 Jan 2026</span>
                                    <span class="time-duration">1h 30min</span>
                                </div>
                                <div class="time-entry-content">
                                    <p class="time-user">Par user</p>
                                    <p class="time-description">Analyse du problème et identification de la cause</p>
                                </div>
                            </article>
                            <article class="time-entry">
                                <div class="time-entry-header">
                                    <span class="time-date">16 Jan 2026</span>
                                    <span class="time-duration">1h</span>
                                </div>
                                <div class="time-entry-content">
                                    <p class="time-user">Par user</p>
                                    <p class="time-description">Développement de la correction</p>
                                </div>
                            </article>
                        </div>
                        <div class="time-estimated">
                            <strong>Temps estimé :</strong> 3h
                        </div>
                    </section>

                    <!-- Commentaires -->
                    <section class="ticket-section">
                        <h2>Commentaires</h2>
                        <div class="comments-list">
                            <article class="comment">
                                <div class="comment-header">
                                    <span class="comment-author">Marie Martin</span>
                                    <span class="comment-date">16 Jan 2026 à 14:30</span>
                                </div>
                                <div class="comment-content">
                                    <p>J'ai testé la correction, tout fonctionne correctement maintenant.</p>
                                </div>
                            </article>
                        </div>
                        <form class="comment-form">
                            <textarea 
                                class="form-textarea" 
                                placeholder="Ajouter un commentaire..."
                                rows="3"
                            ></textarea>
                            <button type="submit" class="btn btn-primary">
                                Publier
                            </button>
                        </form>
                    </section>
                </div>

                <!-- Sidebar droite -->
                <aside class="ticket-sidebar">
                    <div class="info-card">
                        <h3>Informations</h3>
                        <dl class="info-list">
                            <dt>Projet</dt>
                            <dd><a href="projet-detail.html">Site e-commerce</a></dd>
                            
                            <dt>Client</dt>
                            <dd><a href="client-detail.html">Acme Corp</a></dd>
                            
                            <dt>Créé le</dt>
                            <dd>15 Jan 2026</dd>
                            
                            <dt>Modifié le</dt>
                            <dd>16 Jan 2026</dd>
                            
                            <dt>Créé par</dt>
                            <dd>user</dd>
                        </dl>
                    </div>

                    <div class="info-card">
                        <h3>Assignation</h3>
                        <div class="assignees-list">
                            <div class="assignee-item">
                                <span class="avatar">JD</span>
                                <span>user</span>
                            </div>
                        </div>
                        <button class="btn btn-text btn-small">
                            + Assigner
                        </button>
                    </div>

                    <div class="info-card">
                        <h3>Actions rapides</h3>
                        <div class="action-list">
                            <select class="form-select">
                                <option>Changer le statut</option>
                                <option>Nouveau</option>
                                <option>En cours</option>
                                <option>En attente client</option>
                                <option>Terminé</option>
                                <option>À valider</option>
                            </select>
                            <button class="btn btn-success btn-block">
                                Valider (si facturable)
                            </button>
                        </div>
                    </div>
                </aside>
            </div>
        </main>
    </div>
</body>
</html>
```

---

## 📁 LISTE DES PROJETS

```html
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Projets - Systicket</title>
    <link rel="stylesheet" href="css/style.css">
</head>
<body>
    <!-- Header et Sidebar -->
    <header class="header">
        <!-- ... -->
    </header>

    <div class="container">
        <aside class="sidebar">
            <!-- ... -->
        </aside>

        <main class="main-content">
            <div class="page-header">
                <div class="page-header-left">
                    <h1>Projets</h1>
                    <p class="page-subtitle">Gérez vos projets et contrats</p>
                </div>
                <div class="page-header-right">
                    <a href="projet-form.html" class="btn btn-primary">
                        + Créer un projet
                    </a>
                </div>
            </div>

            <!-- Filtres -->
            <section class="filters-section">
                <div class="filters-bar">
                    <input 
                        type="search" 
                        placeholder="Rechercher un projet..." 
                        class="search-input"
                    >
                    <select class="filter-select">
                        <option>Tous les clients</option>
                        <option>Acme Corp</option>
                        <option>Tech Solutions</option>
                    </select>
                    <select class="filter-select">
                        <option>Tous les statuts</option>
                        <option>Actif</option>
                        <option>En pause</option>
                        <option>Terminé</option>
                    </select>
                </div>
            </section>

            <!-- Vue en cartes -->
            <section class="projects-grid">
                <article class="project-card">
                    <header class="project-card-header">
                        <h3><a href="projet-detail.html">Site web e-commerce</a></h3>
                        <span class="badge badge-success">Actif</span>
                    </header>
                    <div class="project-card-body">
                        <p class="project-client">Client : <a href="client-detail.html">Acme Corp</a></p>
                        <div class="project-stats">
                            <div class="stat-item">
                                <span class="stat-label">Tickets</span>
                                <span class="stat-value">12</span>
                            </div>
                            <div class="stat-item">
                                <span class="stat-label">Heures</span>
                                <span class="stat-value">32h / 50h</span>
                            </div>
                        </div>
                        <div class="project-progress">
                            <div class="progress-bar">
                                <div class="progress-fill" style="width: 64%"></div>
                            </div>
                            <span class="progress-text">64% consommé</span>
                        </div>
                    </div>
                    <footer class="project-card-footer">
                        <a href="projet-detail.html" class="btn btn-text">Voir le projet</a>
                    </footer>
                </article>
                <!-- Plus de cartes... -->
            </section>
        </main>
    </div>
</body>
</html>
```

---

## 💡 NOTES IMPORTANTES

1. **Sémantique HTML5** : Utiliser les balises appropriées (`<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<aside>`, `<footer>`)

2. **Accessibilité** :
   - Labels associés aux inputs
   - Attributs `alt` sur les images
   - Structure logique avec titres hiérarchiques

3. **Classes CSS** : Utiliser des noms de classes descriptifs et cohérents (BEM recommandé : `.block__element--modifier`)

4. **Formulaires** : Tous les champs requis doivent avoir l'attribut `required`

5. **Liens** : Tous les liens doivent pointer vers les bonnes pages (même si statiques)

6. **Données fictives** : Utiliser des données réalistes et cohérentes entre les pages

---

**Ces exemples sont des modèles de base. Adaptez-les selon vos besoins et votre design !**
