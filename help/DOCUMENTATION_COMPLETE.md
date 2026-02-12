# 📚 DOCUMENTATION COMPLÈTE - SYSTICKET

## 🎯 Vue d'ensemble du projet

**Systicket** est une application web de gestion de ticketing pour les sociétés de services (ESN, agence web, société de conseil). Elle permet de gérer les projets clients, suivre les tickets, enregistrer le temps passé, gérer les contrats et valider les tickets facturables.

**Version actuelle** : Phase 2 - JavaScript frontend (validation, interactivité, persistance localStorage/sessionStorage)

---

## 📁 STRUCTURE COMPLÈTE DU PROJET

```
systicket/
│
├── 📄 PAGES HTML (23 fichiers)
│   ├── index.html                    # Page d'accueil
│   ├── connexion.html                # Page de connexion
│   ├── inscription.html              # Page d'inscription
│   ├── mot-de-passe-oublie.html      # Réinitialisation mot de passe
│   ├── cgu.html                      # Conditions générales d'utilisation
│   ├── 404.html                      # Page d'erreur 404
│   │
│   ├── dashboard.html                # Tableau de bord principal
│   │
│   ├── projets.html                  # Liste des projets
│   ├── projet-detail.html            # Détail d'un projet
│   ├── projet-form.html              # Formulaire création/édition projet
│   │
│   ├── tickets.html                  # Liste des tickets
│   ├── ticket-detail.html            # Détail d'un ticket
│   ├── ticket-form.html              # Formulaire création/édition ticket
│   ├── ticket-validation.html        # Validation tickets (vue client)
│   │
│   ├── clients.html                  # Liste des clients
│   ├── client-detail.html             # Détail d'un client
│   ├── client-form.html               # Formulaire création/édition client
│   │
│   ├── contrats.html                 # Liste des contrats
│   ├── contrat-detail.html           # Détail d'un contrat
│   ├── contrat-form.html             # Formulaire création/édition contrat
│   │
│   ├── utilisateurs.html             # Gestion des utilisateurs (admin)
│   ├── temps.html                    # Suivi du temps passé
│   ├── profil.html                   # Profil utilisateur
│   └── rapports.html                 # Rapports et statistiques
│
├── 📂 CSS/
│   ├── style.css                     # Feuille de style principale
│   └── roles.css                     # Styles pour gestion des rôles
│
├── 📂 JS/
│   ├── sidebar.js                    # Script pour sidebar responsive
│   ├── auth-button.js                # Script bouton "fuyant" (validation)
│   ├── roles.js                      # Script gestion des rôles
│   ├── storage.js                    # Persistance localStorage/sessionStorage
│   ├── app-data.js                   # Injection données, mises à jour des pages
│   ├── forms-validation.js           # Validation et enregistrement des formulaires
│   ├── list-filters.js               # Filtrage tableaux + persistance sessionStorage
│   ├── components-loader.js          # Chargement des composants
│   ├── ticket-validation.js          # Validation des tickets (client)
│   └── rapports.js                   # Rapports et statistiques
│
├── 📂 assets/
│   └── images/                       # Dossier pour les images
│
└── 📄 DOCUMENTATION/
    ├── README.md                     # Documentation principale
    ├── ANALYSE_ETAPE1.md             # Analyse détaillée étape 1
    ├── PLAN_ACTION_ETAPE1.md          # Plan d'action étape par étape
    ├── EXEMPLES_STRUCTURE_HTML.md    # Exemples de structure HTML
    ├── GESTION_ROLES.md              # Documentation des rôles
    └── DOCUMENTATION_COMPLETE.md     # Ce fichier
```

---

## 📄 DESCRIPTION DÉTAILLÉE DE CHAQUE FICHIER HTML

### 🔐 PAGES D'AUTHENTIFICATION

#### 1. `index.html` - Page d'accueil
**Rôle** : Point d'entrée de l'application  
**Fonctionnalités** :
- Présentation de l'application avec logo animé
- Boutons de redirection vers connexion/inscription
- Design centré et épuré
- Animations CSS (fade, scale)

**Éléments clés** :
- Logo "ST" avec animation
- Tagline : "Gestion de tickets et suivi du temps pour les équipes"
- Boutons : "Se connecter" et "Créer un compte"
- Message d'aide contextuel

**Navigation** :
- → `connexion.html`
- → `inscription.html`

---

#### 2. `connexion.html` - Page de connexion
**Rôle** : Authentification des utilisateurs  
**Fonctionnalités** :
- Formulaire de connexion (email, mot de passe)
- Case à cocher "Se souvenir de moi"
- Lien "Mot de passe oublié"
- Lien vers inscription
- Layout en deux colonnes (branding + formulaire)
- Bouton "fuyant" si formulaire invalide (via `auth-button.js`)

**Éléments clés** :
- Panneau gauche : Présentation avec fonctionnalités
- Panneau droit : Formulaire centré verticalement
- Validation visuelle du formulaire
- Accessibilité : skip link, labels associés

**Champs du formulaire** :
- Email (type="email", requis)
- Mot de passe (type="password", requis)
- Case "Se souvenir de moi" (optionnel)

**Navigation** :
- → `inscription.html`
- → `mot-de-passe-oublie.html`
- → `dashboard.html` (après connexion)

**Rôles** : Accessible à tous (non connectés)

---

#### 3. `inscription.html` - Page d'inscription
**Rôle** : Création de compte utilisateur  
**Fonctionnalités** :
- Formulaire d'inscription complet
- Sélection du rôle (Admin, Collaborateur, Client)
- Validation des mots de passe
- Acceptation des CGU
- Layout en deux colonnes (branding + formulaire)

**Éléments clés** :
- Champs : Nom, Prénom, Email, Mot de passe, Confirmation
- Radio buttons pour sélection du rôle
- Case à cocher CGU (requis)
- Validation visuelle

**Champs du formulaire** :
- Nom (requis)
- Prénom (requis)
- Email (type="email", requis)
- Mot de passe (min 8 caractères, requis)
- Confirmation mot de passe (requis)
- Rôle : Admin / Collaborateur / Client (radio, requis)
- Acceptation CGU (checkbox, requis)

**Navigation** :
- → `connexion.html`
- → `cgu.html` (lien CGU)
- → `dashboard.html` (après inscription)

**Rôles** : Accessible à tous (non connectés)

---

#### 4. `mot-de-passe-oublie.html` - Réinitialisation mot de passe
**Rôle** : Récupération du mot de passe  
**Fonctionnalités** :
- Formulaire de demande de réinitialisation
- Champ email pour recevoir le lien de réinitialisation
- Message d'information
- Design cohérent avec les autres pages d'authentification

**Éléments clés** :
- Champ email unique
- Message explicatif
- Bouton "Envoyer le lien de réinitialisation"

**Navigation** :
- → `connexion.html`

**Rôles** : Accessible à tous (non connectés)

---

#### 5. `cgu.html` - Conditions générales d'utilisation
**Rôle** : Affichage des conditions d'utilisation  
**Fonctionnalités** :
- Texte des conditions générales
- Structure lisible et organisée
- Navigation de retour

**Navigation** :
- → `inscription.html` (retour)

**Rôles** : Accessible à tous

---

#### 6. `404.html` - Page d'erreur
**Rôle** : Gestion des erreurs 404  
**Fonctionnalités** :
- Message d'erreur clair
- Liens de navigation de retour
- Design cohérent avec l'application

**Navigation** :
- → `index.html`
- → `dashboard.html`

**Rôles** : Accessible à tous

---

### 🏠 PAGES PRINCIPALES

#### 7. `dashboard.html` - Tableau de bord
**Rôle** : Vue d'ensemble de l'application  
**Fonctionnalités** :
- Statistiques globales (KPIs)
- Sélecteur de période (semaine, mois, année)
- Alertes et notifications
- Widgets de synthèse :
  - Distribution des tickets
  - Heures par projet
  - Tickets récents
  - Jauge d'heures
  - Activité récente
  - Projets en vedette

**Éléments clés** :
- Header avec logo, nom utilisateur, badge de rôle, déconnexion
- Sidebar avec menu de navigation complet
- Section alertes (tickets en retard, validations en attente)
- Cartes de statistiques avec tendances (↑↓)
- Graphiques et visualisations (CSS uniquement)

**KPIs affichés** :
- Tickets totaux
- Projets actifs
- Heures enregistrées
- Tickets en retard

**Navigation** :
- Toutes les pages via le menu sidebar

**Rôles** :
- ✅ Admin : Accès complet
- ✅ Collaborateur : Accès complet
- ✅ Client : Accès complet (vue limitée)

---

### 📁 GESTION DES PROJETS

#### 8. `projets.html` - Liste des projets
**Rôle** : Affichage et gestion de tous les projets  
**Fonctionnalités** :
- Liste complète des projets en tableau
- Filtres : recherche, client, statut
- Résumé par statut (cartes de synthèse)
- Bouton de création de projet
- Pagination
- Tri des colonnes

**Éléments clés** :
- Cartes de résumé : Actifs, En pause, Terminés, Archivés
- Barre de recherche textuelle
- Filtres par client et statut
- Tableau avec colonnes :
  - Nom du projet
  - Client
  - Statut
  - Progression
  - Heures consommées
  - Date de début
  - Actions (voir, éditer)

**Actions disponibles** :
- Voir le détail d'un projet
- Éditer un projet
- Créer un nouveau projet

**Navigation** :
- → `projet-detail.html` (clic sur projet)
- → `projet-form.html` (création)

**Rôles** :
- ✅ Admin : Accès complet + création
- ✅ Collaborateur : Accès complet + création
- ✅ Client : Accès limité (lecture seule, ses projets uniquement)

---

#### 9. `projet-detail.html` - Détail d'un projet
**Rôle** : Affichage détaillé d'un projet spécifique  
**Fonctionnalités** :
- Informations générales du projet
- Détails du contrat (heures, taux)
- Collaborateurs assignés
- Liste des tickets liés au projet
- Actions rapides (éditer, créer ticket)

**Éléments clés** :
- Header avec nom, statut, client
- Boutons d'action : Éditer, Créer un ticket
- Sections :
  - Informations générales
  - Détails du contrat
  - Collaborateurs assignés (avec ajout)
  - Tickets du projet (tableau)

**Actions disponibles** :
- Éditer le projet
- Créer un ticket dans ce projet
- Ajouter un collaborateur
- Voir les détails d'un ticket

**Navigation** :
- → `projet-form.html` (édition)
- → `ticket-form.html` (création ticket)
- → `ticket-detail.html` (détail ticket)
- → `utilisateurs.html` (ajout collaborateur)

**Rôles** :
- ✅ Admin : Accès complet + toutes actions
- ✅ Collaborateur : Accès complet + création ticket
- ✅ Client : Accès limité (lecture seule)

---

#### 10. `projet-form.html` - Formulaire projet
**Rôle** : Création ou édition d'un projet  
**Fonctionnalités** :
- Formulaire complet de création/édition
- Sélection du client
- Dates de début et fin
- Chef de projet
- Collaborateurs assignés (multi-select)
- Description

**Éléments clés** :
- Breadcrumbs de navigation
- Champs du formulaire :
  - Nom du projet (requis)
  - Client (select, requis)
  - Description (textarea)
  - Date de début (date, requis)
  - Date de fin (date)
  - Chef de projet (select)
  - Collaborateurs assignés (multi-select)

**Actions disponibles** :
- Enregistrer le projet
- Annuler (retour liste)

**Navigation** :
- → `projets.html` (après enregistrement)
- → `projet-detail.html` (après création)

**Rôles** :
- ✅ Admin : Accès complet
- ✅ Collaborateur : Accès complet
- ❌ Client : Accès refusé

---

### 🎫 GESTION DES TICKETS

#### 11. `tickets.html` - Liste des tickets
**Rôle** : Affichage et gestion de tous les tickets  
**Fonctionnalités** :
- Liste complète des tickets en tableau
- Filtres avancés : recherche, statut, priorité, type, projet
- Bouton de création de ticket
- Pagination
- Toggle vue (liste/grille)

**Éléments clés** :
- Barre de recherche textuelle
- Filtres multiples :
  - Statut (Nouveau, En cours, Terminé, En attente client, Validé, Refusé)
  - Priorité (Faible, Normale, Élevée, Critique)
  - Type (Inclus, Facturable)
  - Projet
- Tableau avec colonnes :
  - ID
  - Titre
  - Projet
  - Client
  - Statut
  - Priorité
  - Type
  - Assigné à
  - Heures
  - Date création
  - Actions

**Actions disponibles** :
- Voir le détail d'un ticket
- Éditer un ticket
- Créer un nouveau ticket

**Navigation** :
- → `ticket-detail.html` (clic sur ticket)
- → `ticket-form.html` (création)

**Rôles** :
- ✅ Admin : Accès complet + création
- ✅ Collaborateur : Accès complet + création
- ❌ Client : Accès refusé (utilise `ticket-validation.html`)

---

#### 12. `ticket-detail.html` - Détail d'un ticket
**Rôle** : Affichage détaillé d'un ticket spécifique  
**Fonctionnalités** :
- Informations complètes du ticket
- Description détaillée
- Temps passé (historique)
- Commentaires et pièces jointes
- Timeline des événements
- Sidebar avec informations et actions rapides

**Éléments clés** :
- Header avec titre, ID, statut, priorité, type
- Boutons d'action : Éditer, Ajouter du temps
- Layout en deux colonnes :
  - Colonne principale :
    - Description
    - Temps passé (tableau)
    - Commentaires (ajout possible)
    - Pièces jointes
    - Timeline
  - Sidebar :
    - Informations (projet, client, dates)
    - Assignés (avec ajout)
    - Actions rapides

**Actions disponibles** :
- Éditer le ticket
- Ajouter du temps passé
- Ajouter un commentaire
- Ajouter une pièce jointe
- Assigner un collaborateur
- Changer le statut

**Navigation** :
- → `ticket-form.html` (édition)
- → `temps.html` (ajout temps)
- → `utilisateurs.html` (assignation)

**Rôles** :
- ✅ Admin : Accès complet + toutes actions
- ✅ Collaborateur : Accès complet + toutes actions
- ❌ Client : Accès refusé (utilise `ticket-validation.html`)

---

#### 13. `ticket-form.html` - Formulaire ticket
**Rôle** : Création ou édition d'un ticket  
**Fonctionnalités** :
- Formulaire complet de création/édition
- Sélection du projet
- Type de ticket (radio : Inclus / Facturable)
- Priorité
- Assignation multiple de collaborateurs
- Estimation d'heures

**Éléments clés** :
- Breadcrumbs de navigation
- Champs du formulaire :
  - Titre (requis)
  - Description (textarea, requis)
  - Projet (select, requis)
  - Priorité (select, requis)
  - Type (radio : Inclus / Facturable, requis)
  - Heures estimées (number)
  - Assigner à (multi-select)

**Actions disponibles** :
- Enregistrer le ticket
- Annuler (retour liste)

**Navigation** :
- → `tickets.html` (après enregistrement)
- → `ticket-detail.html` (après création)

**Rôles** :
- ✅ Admin : Accès complet
- ✅ Collaborateur : Accès complet
- ❌ Client : Accès refusé

---

#### 14. `ticket-validation.html` - Validation tickets (Client)
**Rôle** : Validation des tickets facturables par le client  
**Fonctionnalités** :
- Vue spécifique pour les clients
- Liste des tickets en attente de validation
- Montant total à facturer
- Actions : Valider / Refuser
- Historique des validations

**Éléments clés** :
- Menu réduit (Dashboard, Projets, Validation, Profil)
- Cartes de résumé :
  - Tickets à valider
  - Montant total
- Cartes de tickets avec :
  - Informations du ticket
  - Projet associé
  - Temps passé
  - Montant à facturer
  - Boutons : Valider / Refuser / Voir détails
- Tableau historique des validations

**Actions disponibles** :
- Valider un ticket
- Refuser un ticket
- Voir les détails d'un ticket

**Navigation** :
- → `ticket-detail.html` (détails)
- → `dashboard.html`
- → `projets.html`

**Rôles** :
- ❌ Admin : Accès refusé
- ❌ Collaborateur : Accès refusé
- ✅ Client : Accès exclusif

---

### 🏢 GESTION DES CLIENTS

#### 15. `clients.html` - Liste des clients
**Rôle** : Affichage et gestion de tous les clients  
**Fonctionnalités** :
- Liste complète des clients en tableau
- Filtres : recherche, statut
- Bouton d'ajout de client
- Pagination

**Éléments clés** :
- Barre de recherche textuelle
- Filtre par statut (Actif, Inactif)
- Tableau avec colonnes :
  - Raison sociale
  - Contact
  - Email
  - Téléphone
  - Projets
  - Statut
  - Actions

**Actions disponibles** :
- Voir le détail d'un client
- Éditer un client
- Ajouter un nouveau client

**Navigation** :
- → `client-detail.html` (clic sur client)
- → `client-form.html` (création)

**Rôles** :
- ✅ Admin : Accès exclusif
- ❌ Collaborateur : Accès refusé
- ❌ Client : Accès refusé

---

#### 16. `client-detail.html` - Détail d'un client
**Rôle** : Affichage détaillé d'un client spécifique  
**Fonctionnalités** :
- Informations de contact complètes
- Liste des projets du client
- Historique d'activité (CRM)
- Tickets récents
- Actions rapides

**Éléments clés** :
- Header avec nom, statut
- Bouton d'édition
- Sections :
  - Informations client (contact, adresse, etc.)
  - Projets du client (avec création)
  - Activité récente (timeline CRM)
  - Tickets récents

**Actions disponibles** :
- Éditer le client
- Créer un projet pour ce client
- Voir les détails d'un projet
- Voir les détails d'un ticket

**Navigation** :
- → `client-form.html` (édition)
- → `projet-form.html` (création projet)
- → `projet-detail.html` (détail projet)
- → `ticket-detail.html` (détail ticket)

**Rôles** :
- ✅ Admin : Accès exclusif
- ❌ Collaborateur : Accès refusé
- ❌ Client : Accès refusé

---

#### 17. `client-form.html` - Formulaire client
**Rôle** : Création ou édition d'un client  
**Fonctionnalités** :
- Formulaire complet de création/édition
- Informations de contact
- Adresse complète

**Éléments clés** :
- Breadcrumbs de navigation
- Champs du formulaire :
  - Raison sociale (requis)
  - Contact principal (requis)
  - Email (requis)
  - Téléphone
  - Adresse
  - Code postal
  - Ville
  - Pays

**Actions disponibles** :
- Enregistrer le client
- Annuler (retour liste)

**Navigation** :
- → `clients.html` (après enregistrement)
- → `client-detail.html` (après création)

**Rôles** :
- ✅ Admin : Accès exclusif
- ❌ Collaborateur : Accès refusé
- ❌ Client : Accès refusé

---

### 📄 GESTION DES CONTRATS

#### 18. `contrats.html` - Liste des contrats
**Rôle** : Affichage et gestion de tous les contrats  
**Fonctionnalités** :
- Liste complète des contrats en tableau
- Résumé des heures (totales, consommées, restantes)
- Bouton de création de contrat
- Pagination

**Éléments clés** :
- Cartes de résumé : Heures totales, Consommées, Restantes
- Tableau avec colonnes :
  - Nom du contrat
  - Client
  - Projet
  - Heures totales
  - Heures consommées
  - Heures restantes
  - Statut
  - Actions

**Actions disponibles** :
- Voir le détail d'un contrat
- Éditer un contrat
- Créer un nouveau contrat

**Navigation** :
- → `contrat-detail.html` (clic sur contrat)
- → `contrat-form.html` (création)

**Rôles** :
- ✅ Admin : Accès exclusif
- ❌ Collaborateur : Accès refusé
- ❌ Client : Accès refusé

---

#### 19. `contrat-detail.html` - Détail d'un contrat
**Rôle** : Affichage détaillé d'un contrat spécifique  
**Fonctionnalités** :
- Informations complètes du contrat
- Détails des heures et taux
- Période de validité
- Liste des tickets liés

**Éléments clés** :
- Header avec nom, projet, statut
- Bouton d'édition
- Sections :
  - Informations générales
  - Détails des heures (totales, consommées, restantes)
  - Taux horaire
  - Période de validité
  - Tickets liés (tableau)

**Actions disponibles** :
- Éditer le contrat
- Voir les détails d'un ticket

**Navigation** :
- → `contrat-form.html` (édition)
- → `ticket-detail.html` (détail ticket)

**Rôles** :
- ✅ Admin : Accès exclusif
- ❌ Collaborateur : Accès refusé
- ❌ Client : Accès refusé

---

#### 20. `contrat-form.html` - Formulaire contrat
**Rôle** : Création ou édition d'un contrat  
**Fonctionnalités** :
- Formulaire complet de création/édition
- Association à un client et projet
- Définition des heures et taux

**Éléments clés** :
- Breadcrumbs de navigation
- Champs du formulaire :
  - Nom du contrat (requis)
  - Client (select, requis)
  - Projet (select, requis)
  - Heures totales (number, requis)
  - Taux horaire (number, requis)
  - Date de début (date, requis)
  - Date de fin (date)

**Actions disponibles** :
- Enregistrer le contrat
- Annuler (retour liste)

**Navigation** :
- → `contrats.html` (après enregistrement)
- → `contrat-detail.html` (après création)

**Rôles** :
- ✅ Admin : Accès exclusif
- ❌ Collaborateur : Accès refusé
- ❌ Client : Accès refusé

---

### 👥 GESTION DES UTILISATEURS

#### 21. `utilisateurs.html` - Gestion des utilisateurs
**Rôle** : Gestion des utilisateurs, rôles et permissions  
**Fonctionnalités** :
- Liste complète des utilisateurs
- Filtres : recherche, rôle, statut
- Boutons d'invitation et création
- Gestion des rôles et permissions

**Éléments clés** :
- Barre de recherche textuelle
- Filtres :
  - Rôle (Administrateur, Collaborateur, Client)
  - Statut (Actif, Inactif)
- Tableau avec colonnes :
  - Utilisateur (nom, prénom)
  - Email
  - Rôle
  - Statut
  - Dernière connexion
  - Actions

**Actions disponibles** :
- Inviter un utilisateur par email
- Ajouter un utilisateur
- Éditer un utilisateur
- Activer/Désactiver un utilisateur

**Navigation** :
- → `profil.html?new=1` (création)

**Rôles** :
- ✅ Admin : Accès exclusif
- ❌ Collaborateur : Accès refusé
- ❌ Client : Accès refusé

---

### ⏱️ SUIVI DU TEMPS

#### 22. `temps.html` - Suivi du temps
**Rôle** : Enregistrement et suivi du temps passé  
**Fonctionnalités** :
- Formulaire d'ajout de temps
- Historique des enregistrements
- Filtres par projet, ticket, période
- Statistiques personnelles

**Éléments clés** :
- Formulaire d'ajout :
  - Projet (select, requis)
  - Ticket (select)
  - Date (date, requis)
  - Heures (number, requis)
  - Description (textarea)
- Tableau historique avec colonnes :
  - Date
  - Projet
  - Ticket
  - Durée
  - Description
  - Actions

**Actions disponibles** :
- Ajouter une entrée de temps
- Éditer une entrée
- Supprimer une entrée

**Navigation** :
- → `projet-detail.html` (détail projet)
- → `ticket-detail.html` (détail ticket)

**Rôles** :
- ✅ Admin : Accès complet
- ✅ Collaborateur : Accès complet
- ❌ Client : Accès refusé

---

### 📊 RAPPORTS ET STATISTIQUES

#### 23. `rapports.html` - Rapports et statistiques
**Rôle** : Génération de rapports et statistiques  
**Fonctionnalités** :
- Rapports personnalisables avec filtres
- Statistiques globales
- Graphiques et visualisations
- Export de données
- Sections :
  - Tickets par statut
  - Heures par collaborateur
  - Facturation par client

**Éléments clés** :
- Filtres de période et client
- Cartes de statistiques
- Graphiques (CSS uniquement)
- Tableaux de données
- Bouton d'export

**Actions disponibles** :
- Filtrer les rapports
- Exporter les données
- Imprimer les rapports

**Navigation** :
- Toutes les pages via le menu

**Rôles** :
- ✅ Admin : Accès exclusif
- ❌ Collaborateur : Accès refusé
- ❌ Client : Accès refusé

---

### 👤 PROFIL UTILISATEUR

#### 24. `profil.html` - Profil utilisateur
**Rôle** : Gestion du profil personnel  
**Fonctionnalités** :
- Modification des informations personnelles
- Changement de mot de passe
- Préférences utilisateur

**Éléments clés** :
- Formulaire d'informations :
  - Nom, Prénom
  - Email
  - Téléphone
  - Avatar
- Formulaire de changement de mot de passe :
  - Mot de passe actuel
  - Nouveau mot de passe
  - Confirmation

**Actions disponibles** :
- Modifier les informations
- Changer le mot de passe
- Sauvegarder les modifications

**Navigation** :
- Toutes les pages via le menu

**Rôles** :
- ✅ Admin : Accès complet
- ✅ Collaborateur : Accès complet
- ✅ Client : Accès complet

---

## 🎭 SIMULATION DES PARCOURS UTILISATEURS

### 👨‍💼 PARCOURS ADMINISTRATEUR

#### Scénario 1 : Création d'un nouveau projet client

1. **Connexion** (`connexion.html`)
   - Saisie email et mot de passe
   - Clic sur "Se connecter"
   - Redirection vers `dashboard.html`

2. **Tableau de bord** (`dashboard.html`)
   - Consultation des statistiques
   - Clic sur "Projets" dans le menu

3. **Liste des projets** (`projets.html`)
   - Consultation de la liste
   - Clic sur "+ Créer un projet"

4. **Formulaire projet** (`projet-form.html`)
   - Remplissage du formulaire :
     - Nom : "Site e-commerce"
     - Client : Sélection d'un client existant
     - Dates : Début et fin
     - Chef de projet : Sélection
     - Collaborateurs : Multi-sélection
   - Clic sur "Enregistrer"
   - Redirection vers `projet-detail.html`

5. **Détail du projet** (`projet-detail.html`)
   - Vérification des informations
   - Clic sur "+ Créer un ticket" pour ajouter un ticket

6. **Formulaire ticket** (`ticket-form.html`)
   - Création d'un ticket lié au projet
   - Enregistrement

---

#### Scénario 2 : Gestion d'un client

1. **Dashboard** → Clic sur "Clients"

2. **Liste des clients** (`clients.html`)
   - Consultation de la liste
   - Clic sur "+ Ajouter un client"

3. **Formulaire client** (`client-form.html`)
   - Remplissage :
     - Raison sociale
     - Contact principal
     - Email, téléphone
     - Adresse complète
   - Enregistrement

4. **Détail du client** (`client-detail.html`)
   - Vérification des informations
   - Consultation des projets associés
   - Clic sur "+ Créer un projet" pour ce client

---

#### Scénario 3 : Création d'un contrat

1. **Dashboard** → Clic sur "Contrats"

2. **Liste des contrats** (`contrats.html`)
   - Clic sur "+ Créer un contrat"

3. **Formulaire contrat** (`contrat-form.html`)
   - Sélection client et projet
   - Définition des heures totales
   - Taux horaire
   - Période de validité
   - Enregistrement

4. **Détail du contrat** (`contrat-detail.html`)
   - Vérification des informations
   - Consultation des tickets liés

---

#### Scénario 4 : Gestion des utilisateurs

1. **Dashboard** → Clic sur "Utilisateurs"

2. **Liste des utilisateurs** (`utilisateurs.html`)
   - Consultation de la liste
   - Filtrage par rôle ou statut
   - Clic sur "+ Ajouter un utilisateur" ou "📧 Inviter"

3. **Gestion des rôles**
   - Modification des permissions
   - Activation/Désactivation d'utilisateurs

---

### 👨‍💻 PARCOURS COLLABORATEUR

#### Scénario 1 : Création et suivi d'un ticket

1. **Connexion** → Redirection `dashboard.html`

2. **Liste des tickets** (`tickets.html`)
   - Consultation de la liste
   - Filtrage par statut ou projet
   - Clic sur "+ Créer un ticket"

3. **Formulaire ticket** (`ticket-form.html`)
   - Remplissage :
     - Titre et description
     - Sélection du projet
     - Priorité et type
     - Heures estimées
   - Enregistrement

4. **Détail du ticket** (`ticket-detail.html`)
   - Consultation des informations
   - Clic sur "⏱️ Ajouter du temps"

5. **Suivi du temps** (`temps.html`)
   - Enregistrement du temps passé
   - Ajout d'une description
   - Enregistrement

6. **Retour au ticket**
   - Vérification du temps enregistré
   - Ajout de commentaires si nécessaire

---

#### Scénario 2 : Gestion d'un projet

1. **Liste des projets** (`projets.html`)
   - Consultation des projets assignés
   - Clic sur un projet

2. **Détail du projet** (`projet-detail.html`)
   - Consultation des informations
   - Consultation des tickets liés
   - Clic sur "+ Créer un ticket" dans ce projet

3. **Création d'un ticket** dans le contexte du projet
   - Le projet est pré-rempli
   - Remplissage des autres informations
   - Enregistrement

---

#### Scénario 3 : Consultation du temps passé

1. **Suivi du temps** (`temps.html`)
   - Consultation de l'historique
   - Filtrage par projet ou période
   - Consultation des statistiques personnelles

---

### 👔 PARCOURS CLIENT

#### Scénario 1 : Consultation des projets

1. **Connexion** → Redirection `dashboard.html`
   - Menu réduit : Dashboard, Mes projets, Validation, Profil

2. **Mes projets** (`projets.html`)
   - Consultation uniquement des projets du client
   - Pas de bouton de création
   - Clic sur un projet pour voir les détails

3. **Détail du projet** (`projet-detail.html`)
   - Consultation des informations
   - Consultation des tickets liés
   - Pas d'actions d'édition disponibles

---

#### Scénario 2 : Validation de tickets facturables

1. **Dashboard** → Clic sur "Validation"

2. **Validation des tickets** (`ticket-validation.html`)
   - Consultation des tickets en attente
   - Affichage du montant total à facturer
   - Pour chaque ticket :
     - Consultation des informations
     - Temps passé
     - Montant à facturer
     - Actions : Valider / Refuser / Voir détails

3. **Action de validation**
   - Clic sur "✅ Valider" ou "❌ Refuser"
   - Confirmation (visuelle pour l'instant)

4. **Historique des validations**
   - Consultation du tableau d'historique
   - Voir les validations passées

---

#### Scénario 3 : Consultation du profil

1. **Menu** → Clic sur "Mon profil"

2. **Profil** (`profil.html`)
   - Consultation des informations personnelles
   - Modification si nécessaire
   - Changement de mot de passe

---

## 🔐 SYSTÈME DE GESTION DES RÔLES

### Matrice des permissions

| Fonctionnalité | Admin | Collaborateur | Client |
|---------------|-------|---------------|--------|
| **Dashboard** | ✅ | ✅ | ✅ |
| **Projets** | ✅ CRUD | ✅ CRUD | ✅ Lecture seule |
| **Tickets** | ✅ CRUD | ✅ CRUD | ❌ |
| **Validation tickets** | ❌ | ❌ | ✅ |
| **Clients** | ✅ CRUD | ❌ | ❌ |
| **Contrats** | ✅ CRUD | ❌ | ❌ |
| **Utilisateurs** | ✅ CRUD | ❌ | ❌ |
| **Temps** | ✅ | ✅ | ❌ |
| **Rapports** | ✅ | ❌ | ❌ |
| **Profil** | ✅ | ✅ | ✅ |

**Légende** :
- ✅ = Accès autorisé
- ❌ = Accès refusé
- CRUD = Create, Read, Update, Delete

---

## 🎨 DESIGN ET STYLE

### Palette de couleurs

- **Primaire** : `#2563eb` (Bleu)
- **Succès** : `#10b981` (Vert)
- **Danger** : `#ef4444` (Rouge)
- **Avertissement** : `#f59e0b` (Orange)
- **Info** : `#3b82f6` (Bleu clair)
- **Secondaire** : `#6b7280` (Gris)

### Composants réutilisables

- **Header** : Logo, titre, menu utilisateur, déconnexion
- **Sidebar** : Navigation principale avec icônes
- **Breadcrumbs** : Navigation hiérarchique
- **Cartes** : Affichage d'informations groupées
- **Tableaux** : Listes de données avec tri et pagination
- **Formulaires** : Champs avec validation visuelle
- **Badges** : Statuts et priorités colorés
- **Boutons** : Actions principales et secondaires

---

## 📱 RESPONSIVE DESIGN

### Breakpoints

- **Mobile** : < 768px
  - Sidebar cachée
  - Menu hamburger
  - Tableaux scrollables horizontalement

- **Tablette** : 768px - 1024px
  - Sidebar réduite
  - Layout adaptatif

- **Desktop** : > 1024px
  - Layout complet
  - Sidebar visible
  - Toutes les fonctionnalités

---

## ♿ ACCESSIBILITÉ

### Fonctionnalités d'accessibilité

- **Skip links** : Lien "Aller au contenu" sur chaque page
- **Labels associés** : Tous les champs de formulaire ont des labels
- **Focus visible** : Contour au focus pour navigation clavier
- **ARIA labels** : Attributs pour les lecteurs d'écran
- **Contraste** : Respect des ratios WCAG
- **Navigation clavier** : Tous les éléments sont accessibles au clavier

---

## 🚀 UTILISATION

### Pour tester l'application

1. **Ouvrir** `index.html` dans un navigateur
2. **Naviguer** entre les pages via les liens
3. **Tester les rôles** : Ajouter `?role=admin`, `?role=collaborateur` ou `?role=client` à l'URL

### Exemples d'URLs avec rôles

- `dashboard.html?role=admin` - Vue administrateur
- `dashboard.html?role=collaborateur` - Vue collaborateur
- `dashboard.html?role=client` - Vue client
- `ticket-validation.html?role=client` - Validation tickets (client uniquement)

---

## 📝 NOTES IMPORTANTES

### Phase 1 (HTML/CSS statique)

- ✅ Toutes les pages sont statiques
- ✅ Pas de logique métier
- ✅ Données fictives pour démonstration
- ✅ Navigation fonctionnelle entre toutes les pages
- ✅ Restrictions visuelles selon les rôles (CSS/JS)

### Prochaines étapes

- **Étape 2** : JavaScript natif pour validation et interactivité
- **Étape 3** : Migration vers PHP procédural
- **Étape 4** : Intégration base de données SQL
- **Étape 5** : Migration vers Laravel

---

## 📞 SUPPORT

Pour toute question ou problème, consulter :
- `README.md` - Documentation principale
- `GESTION_ROLES.md` - Documentation des rôles
- `ANALYSE_ETAPE1.md` - Analyse détaillée

---

**Date de création** : Janvier 2026  
**Version** : 2.0 (Phase 2 - JavaScript frontend)  
**Auteur** : Projet TP Fil Rouge - Module Développement Web
