# 🎫 Systicket - Application de Gestion de Ticketing

Application web complète de gestion de ticketing pour une société de services (ESN, agence web, société de conseil).

## 📋 Description

Systicket est une application de gestion de tickets permettant de :
- Gérer les projets clients
- Suivre les tickets et leur statut
- Enregistrer le temps passé
- Gérer les contrats et heures incluses
- Distinguer les tickets inclus des tickets facturables
- Valider les tickets facturables

## 🎯 Phase 2 - JavaScript frontend (Livrable actuel)

Cette phase ajoute **JavaScript natif** pour validation des formulaires, interactivité, persistance (localStorage/sessionStorage) et gestion des rôles.

### ✅ Pages créées

#### Pages d'authentification
- `connexion.html` - Page de connexion
- `inscription.html` - Page d'inscription

#### Pages principales
- `dashboard.html` - Tableau de bord avec statistiques
- `projets.html` - Liste des projets
- `projet-detail.html` - Détail d'un projet
- `tickets.html` - Liste des tickets
- `ticket-detail.html` - Détail d'un ticket
- `ticket-form.html` - Formulaire de création/édition de ticket

#### Pages de gestion
- `clients.html` - Liste des clients
- `client-detail.html` - Détail d'un client
- `utilisateurs.html` - Gestion des utilisateurs (Admin)
- `contrats.html` - Gestion des contrats

#### Pages complémentaires
- `temps.html` - Suivi du temps passé
- `ticket-validation.html` - Validation des tickets facturables (Client)
- `profil.html` - Profil utilisateur
- `rapports.html` - Rapports et statistiques
- `404.html` - Page d'erreur
- `index.html` - Page d'accueil (redirection vers connexion)

## 📁 Structure du projet

```
systicket/
├── index.html                    # Page d'accueil (redirection)
├── connexion.html                # Page de connexion
├── inscription.html              # Page d'inscription
├── dashboard.html                # Tableau de bord
├── projets.html                  # Liste des projets
├── projet-detail.html            # Détail d'un projet
├── tickets.html                  # Liste des tickets
├── ticket-detail.html            # Détail d'un ticket
├── ticket-form.html              # Formulaire création/édition ticket
├── ticket-validation.html        # Validation tickets (client)
├── clients.html                  # Liste des clients
├── client-detail.html            # Détail d'un client
├── utilisateurs.html             # Gestion utilisateurs (admin)
├── contrats.html                 # Gestion des contrats
├── temps.html                    # Suivi du temps
├── profil.html                   # Profil utilisateur
├── rapports.html                 # Rapports/statistiques
├── 404.html                      # Page d'erreur
│
├── css/
│   └── style.css                 # Fichier CSS principal
│
├── assets/
│   └── images/                   # Dossier pour les images
│
├── ANALYSE_ETAPE1.md            # Analyse détaillée de l'étape 1
├── EXEMPLES_STRUCTURE_HTML.md    # Exemples de structure HTML
├── PLAN_ACTION_ETAPE1.md         # Plan d'action étape par étape
└── README.md                     # Ce fichier
```

## 🚀 Utilisation

### Ouvrir l'application

1. Ouvrez `index.html` ou `connexion.html` dans votre navigateur
2. Naviguez entre les pages via le menu de navigation
3. Tous les liens sont fonctionnels (navigation statique)

### Navigation

- **Menu latéral** : Présent sur toutes les pages (sauf connexion/inscription)
- **Breadcrumbs** : Sur les pages de détail
- **Liens** : Tous les liens pointent vers les bonnes pages

## 🎨 Design

### Palette de couleurs

- **Primaire** : Bleu (#2563eb)
- **Succès** : Vert (#10b981)
- **Danger** : Rouge (#ef4444)
- **Avertissement** : Orange (#f59e0b)

### Statuts des tickets

- **Nouveau** : Bleu
- **En cours** : Orange
- **Terminé** : Vert
- **À valider** : Orange
- **Validé** : Vert
- **Refusé** : Rouge

### Priorités

- **Faible** : Gris
- **Normale** : Bleu
- **Élevée** : Orange
- **Critique** : Rouge

## 📱 Responsive Design

L'application est responsive avec :
- **Desktop** : Layout complet avec sidebar
- **Tablette** : Sidebar réduite
- **Mobile** : Sidebar cachée, navigation adaptée

## ✅ Contraintes respectées

- ✅ HTML5 sémantique (`<header>`, `<nav>`, `<main>`, `<section>`, `<article>`)
- ✅ CSS avec Flexbox pour tous les layouts
- ✅ Design responsive (minimum 1024px, optimisé pour mobile)
- ✅ Navigation fonctionnelle entre toutes les pages
- ✅ Cohérence visuelle globale
- ✅ JavaScript natif (validation, filtres, persistance)

## ✨ Fonctionnalités avancées (CSS / HTML)

- **Lien d'évitement** : « Aller au contenu » sur chaque page (accessibilité clavier)
- **Focus visible** : contour au focus pour les liens et boutons (navigation clavier)
- **Tooltips CSS** : info-bulles au survol via `data-tooltip` (sans JavaScript)
- **Styles d'impression** : mise en page adaptée à l’impression (masquage sidebar, boutons, etc.)
- **Page 404** : page d’erreur dédiée avec liens de retour
- **Suivi du temps** : entrée « Suivi du temps » dans le menu latéral de toutes les pages
- **Données fictives** : tableaux remplis (tickets, projets, clients, contrats, temps) pour démonstration

## 📝 Validation W3C

Valider chaque page HTML avec le validateur W3C : https://validator.w3.org/

## 🔄 Prochaines étapes

- **Étape 2** : Ajout de JavaScript natif pour validation et interactivité
- **Étape 3** : Migration vers PHP procédural
- **Étape 4** : Intégration base de données SQL
- **Étape 5** : Migration vers Laravel

## 👥 Rôles utilisateurs

L'application prévoit trois rôles :
- **Administrateur** : Accès complet
- **Collaborateur** : Gestion des tickets et projets assignés
- **Client** : Consultation et validation des tickets facturables

## 📄 Données fictives

Toutes les pages contiennent des données d'exemple réalistes pour démonstration.

## 🛠️ Technologies utilisées

- HTML5
- CSS3 (Flexbox)
- Aucun framework CSS (conforme aux contraintes)

## 📅 Date de création

Janvier 2026

## 👨‍💻 Auteur

Projet réalisé dans le cadre du TP Fil Rouge - Module Développement Web

---

**Note** : Ce projet est en cours de développement. Cette version correspond à la Phase 2 (JavaScript frontend). L'authentification est simulée via localStorage (rôle, profil) — pas de backend.
