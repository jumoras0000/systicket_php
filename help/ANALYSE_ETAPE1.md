# 📊 ANALYSE DÉTAILLÉE — ÉTAPE 1 : HTML/CSS
## Application de Gestion de Ticketing — Systicket

---

## 🎯 OBJECTIF DE L'ÉTAPE 1

Créer **uniquement des pages HTML/CSS statiques** (sans JavaScript ni logique métier) pour établir la structure visuelle et l'architecture de l'application de gestion de ticketing.

**Date limite :** 5 Février 2026  
**Contraintes :** HTML sémantique, CSS Flexbox, Responsive minimum, Validation W3C

---

## 📄 INVENTAIRE COMPLET DES PAGES NÉCESSAIRES

### 🔐 **Pages d'Authentification**

#### 1. **Page de Connexion** (`connexion.html` ou `login.html`)
**Objectif :** Point d'entrée de l'application

**Éléments à inclure :**
- Formulaire centré avec :
  - Champ email/identifiant (requis)
  - Champ mot de passe (requis)
  - Case à cocher "Se souvenir de moi" (optionnel)
  - Bouton "Se connecter"
- Lien "Mot de passe oublié ?" (vers page dédiée ou placeholder)
- Lien "Créer un compte" vers inscription
- Logo de l'application en haut
- Design épuré, centré verticalement et horizontalement

**Design inspiré :** Pages de connexion modernes avec fond neutre, carte centrée, ombre légère

---

#### 2. **Page d'Inscription** (`inscription.html` ou `register.html`)
**Objectif :** Permettre la création de compte

**Éléments à inclure :**
- Formulaire avec :
  - Nom (requis)
  - Prénom (requis)
  - Email (requis, type="email")
  - Mot de passe (requis, min 8 caractères)
  - Confirmation mot de passe (requis)
  - Sélection du rôle : Radio buttons ou Select
    - Administrateur
    - Collaborateur
    - Client
  - Case à cocher "J'accepte les conditions générales"
  - Bouton "Créer mon compte"
- Lien retour vers connexion
- Messages d'aide pour les champs (placeholder ou texte sous les champs)

---

### 🏠 **Pages Principales**

#### 3. **Tableau de Bord** (`dashboard.html`)
**Objectif :** Vue d'ensemble après connexion

**Structure :**
- **Header fixe** avec :
  - Logo
  - Nom de l'utilisateur connecté
  - Menu déroulant profil (icône)
  - Bouton déconnexion

- **Sidebar (menu latéral)** avec :
  - Tableau de bord (actif)
  - Projets
  - Tickets
  - Clients (si Admin)
  - Utilisateurs (si Admin)
  - Contrats
  - Rapports
  - Profil

- **Zone principale** avec :
  - **Cards de statistiques** (4 cards côte à côte) :
    - Tickets ouverts (nombre + icône)
    - Tickets en cours (nombre + icône)
    - Tickets terminés (nombre + icône)
    - Tickets à valider (nombre + icône)
  - **Widget "Mes projets actifs"** :
    - Liste des 3-5 derniers projets avec barre de progression
  - **Widget "Tickets récents"** :
    - Tableau compact des 5 derniers tickets
  - **Widget "Heures consommées ce mois"** :
    - Graphique visuel (barre CSS) ou nombre total

**Design inspiré :** Dashboards modernes type AdminLTE, Tailwind Admin, avec cards colorées et icônes

---

#### 4. **Liste des Projets** (`projets.html`)
**Objectif :** Afficher tous les projets accessibles

**Éléments à inclure :**
- **En-tête de page** :
  - Titre "Projets"
  - Bouton "+ Créer un projet" (si Admin/Collaborateur)
  - Barre de recherche (placeholder)

- **Filtres visuels** (non fonctionnels à cette étape) :
  - Par client (dropdown)
  - Par statut (dropdown)
  - Par collaborateur assigné (dropdown)

- **Tableau des projets** :
  - Colonnes :
    - Nom du projet (lien vers détail)
    - Client
    - Statut (badge coloré)
    - Nombre de tickets
    - Heures consommées / Heures totales
    - Date de création
    - Actions (icônes : voir, éditer, supprimer)
  - Pagination visuelle (non fonctionnelle)

- **Vue alternative** : Option de basculement tableau ↔ cartes (bouton toggle)

**Design inspiré :** Tableaux modernes avec hover sur les lignes, badges de statut colorés

---

#### 5. **Détail d'un Projet** (`projet-detail.html`)
**Objectif :** Afficher toutes les informations d'un projet

**Structure :**
- **En-tête** :
  - Nom du projet (grand titre)
  - Client associé
  - Statut du projet (badge)
  - Boutons : Éditer, Supprimer, Créer un ticket

- **Section "Informations générales"** :
  - Description
  - Date de création
  - Date de fin prévue
  - Responsable projet

- **Section "Contrat"** :
  - Heures incluses : XXh
  - Heures consommées : XXh (barre de progression)
  - Heures restantes : XXh
  - Taux horaire supplémentaire : XX€/h
  - Période de validité

- **Section "Collaborateurs assignés"** :
  - Liste des collaborateurs avec avatars/initiales
  - Bouton "+ Ajouter un collaborateur"

- **Section "Tickets du projet"** :
  - Tableau des tickets liés (même structure que liste tickets)
  - Filtres par statut

- **Breadcrumb** : Accueil > Projets > [Nom du projet]

---

#### 6. **Liste des Tickets** (`tickets.html`)
**Objectif :** Afficher tous les tickets avec filtres

**Éléments à inclure :**
- **En-tête** :
  - Titre "Tickets"
  - Bouton "+ Créer un ticket"
  - Barre de recherche

- **Filtres avancés** :
  - Par statut (checkboxes ou badges cliquables visuels)
  - Par priorité
  - Par projet
  - Par client
  - Par assigné
  - Par type (Inclus / Facturable)

- **Tableau des tickets** :
  - Colonnes :
    - ID (numéro)
    - Titre (lien vers détail)
    - Projet
    - Client
    - Statut (badge coloré)
    - Priorité (badge/icône)
    - Type (badge "Inclus" ou "Facturable")
    - Assigné(s) (avatars/initiales)
    - Temps passé / Temps estimé
    - Date de création
    - Actions (voir, éditer)

- **Vue compacte** : Option d'affichage en liste ou en cartes

**Design inspiré :** Systèmes de ticketing type Jira, Zendesk avec filtres visuels et badges de statut

---

#### 7. **Détail d'un Ticket** (`ticket-detail.html`)
**Objectif :** Afficher toutes les informations d'un ticket

**Structure :**
- **En-tête** :
  - ID du ticket : #1234
  - Titre (grand)
  - Statut (badge large)
  - Priorité (badge)
  - Type (badge "Inclus" ou "Facturable")
  - Boutons : Éditer, Changer statut, Ajouter du temps

- **Colonne principale** :
  - **Section "Description"** :
    - Texte de la description
  - **Section "Temps passé"** :
    - Temps total : XXh XXmin
    - Temps estimé : XXh XXmin
    - Liste des entrées de temps :
      - Date, Durée, Collaborateur, Commentaire
    - Bouton "+ Ajouter une entrée"
  - **Section "Commentaires"** :
    - Liste des commentaires (auteur, date, contenu)
    - Formulaire d'ajout de commentaire

- **Sidebar droite** :
  - **Informations** :
    - Projet (lien)
    - Client (lien)
    - Créé le : date
    - Modifié le : date
    - Créé par : nom
  - **Assignation** :
    - Collaborateurs assignés (liste avec avatars)
    - Bouton "+ Assigner"
  - **Actions rapides** :
    - Changer le statut (dropdown)
    - Marquer comme facturable/inclus
    - Valider (si client et ticket facturable)

- **Breadcrumb** : Accueil > Tickets > [Titre du ticket]

---

#### 8. **Formulaire de Création/Édition de Ticket** (`ticket-form.html`)
**Objectif :** Créer ou modifier un ticket

**Éléments du formulaire :**
- **Titre** (input text, requis)
- **Description** (textarea, requis, min 10 caractères)
- **Projet** (select dropdown, requis)
- **Priorité** (select ou radio) :
  - Faible
  - Normale
  - Élevée
  - Critique
- **Type** (radio buttons) :
  - Inclus dans le contrat
  - Facturable en supplément
- **Temps estimé** (input number, optionnel) :
  - Heures
  - Minutes
- **Assigner à** (multi-select ou checkboxes) :
  - Liste des collaborateurs disponibles
- **Boutons** :
  - Créer / Enregistrer
  - Annuler (retour liste)
  - Enregistrer comme brouillon (optionnel)

**Validation visuelle :** Indicateurs de champs requis, messages d'aide

---

### 👥 **Pages de Gestion (selon rôle)**

#### 9. **Gestion des Utilisateurs** (`utilisateurs.html` - Admin uniquement)
**Objectif :** Gérer les utilisateurs de l'application

**Éléments :**
- Titre "Gestion des Utilisateurs"
- Bouton "+ Ajouter un utilisateur"
- Tableau :
  - Colonnes : Nom, Prénom, Email, Rôle, Statut (actif/inactif), Date création, Actions
- Formulaire modal ou page séparée pour création/édition

---

#### 10. **Gestion des Clients** (`clients.html` - Admin uniquement)
**Objectif :** Gérer les entreprises clientes

**Éléments :**
- Titre "Clients"
- Bouton "+ Ajouter un client"
- Tableau :
  - Colonnes : Nom entreprise, Contact principal, Email, Téléphone, Nombre de projets, Statut, Actions
- Lien vers détail client

---

#### 11. **Détail Client** (`client-detail.html`)
**Objectif :** Informations complètes d'un client

**Structure :**
- Informations entreprise :
  - Nom, SIRET, Adresse, Téléphone, Email
- Contact principal
- Liste des projets du client
- Liste des tickets récents
- Statistiques (heures consommées, tickets ouverts, etc.)

---

#### 12. **Gestion des Contrats** (`contrats.html`)
**Objectif :** Visualiser et gérer les contrats/heures

**Éléments :**
- Liste des contrats par projet
- Tableau :
  - Colonnes : Projet, Client, Heures incluses, Heures consommées, Heures restantes, Taux horaire, Période, Actions
- Bouton "+ Créer un contrat" (si Admin)
- Barres de progression visuelles pour consommation

---

#### 13. **Suivi du Temps** (`temps.html` ou `time-entry.html`)
**Objectif :** Enregistrer et consulter le temps passé

**Éléments :**
- **Formulaire d'ajout** :
  - Ticket (select, requis)
  - Date (input date, requis)
  - Durée (heures + minutes, requis)
  - Description du travail (textarea, optionnel)
  - Bouton "Enregistrer"
- **Liste des entrées** :
  - Tableau : Date, Ticket, Durée, Description, Actions
  - Filtres par projet, par période
  - Total du temps sur la période

---

#### 14. **Validation des Tickets** (`ticket-validation.html` - Client uniquement)
**Objectif :** Permettre au client de valider les tickets facturables

**Éléments :**
- Titre "Tickets en attente de validation"
- Liste des tickets facturables :
  - Pour chaque ticket :
    - Titre, Description, Temps passé, Montant à facturer
    - Boutons : "Valider" (vert), "Refuser" (rouge)
    - Zone de commentaires (si refus)
- Historique des validations passées

---

#### 15. **Profil Utilisateur** (`profil.html`)
**Objectif :** Gérer ses informations personnelles

**Éléments :**
- Formulaire :
  - Nom, Prénom, Email (non modifiable si connecté via email)
  - Téléphone
  - Photo de profil (upload placeholder)
- Section "Changer le mot de passe" :
  - Ancien mot de passe
  - Nouveau mot de passe
  - Confirmation
- Bouton "Enregistrer les modifications"

---

#### 16. **Rapports/Statistiques** (`rapports.html` - Admin/Manager)
**Objectif :** Visualiser les statistiques globales

**Éléments :**
- Graphiques visuels (CSS uniquement, placeholders) :
  - Tickets par statut (graphique en barres CSS)
  - Heures consommées par projet (graphique en barres)
  - Répartition des tickets par priorité (graphique circulaire CSS)
- Tableaux de synthèse :
  - Top collaborateurs (temps passé)
  - Projets les plus actifs
  - Facturation en attente

---

#### 17. **Page 404 / Erreur** (`404.html` ou `erreur.html`)
**Objectif :** Page d'erreur en cas de page non trouvée

**Éléments :**
- Message "Page non trouvée"
- Lien retour vers tableau de bord
- Design cohérent avec le reste de l'application

---

## 🎨 GUIDE DE DESIGN & ARCHITECTURE CSS

### **Palette de Couleurs Recommandée**

Inspirée des templates modernes de gestion de tickets :

```
Couleurs principales :
- Primaire : #2563eb (Bleu)
- Secondaire : #64748b (Gris)
- Succès : #10b981 (Vert)
- Danger : #ef4444 (Rouge)
- Avertissement : #f59e0b (Orange)
- Info : #3b82f6 (Bleu clair)

Statuts des tickets :
- Nouveau : #3b82f6 (Bleu)
- En cours : #f59e0b (Orange)
- En attente client : #8b5cf6 (Violet)
- Terminé : #10b981 (Vert)
- À valider : #f59e0b (Orange)
- Validé : #10b981 (Vert)
- Refusé : #ef4444 (Rouge)

Priorités :
- Faible : #94a3b8 (Gris clair)
- Normale : #3b82f6 (Bleu)
- Élevée : #f59e0b (Orange)
- Critique : #ef4444 (Rouge)

Types :
- Inclus : #10b981 (Vert)
- Facturable : #f59e0b (Orange)

Fond :
- Fond principal : #f8fafc (Gris très clair)
- Fond cartes : #ffffff (Blanc)
- Bordure : #e2e8f0 (Gris clair)
```

### **Typographie**

```
Police principale : 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif
Taille de base : 16px
Hiérarchie :
- H1 : 2rem (32px) - Titres de page
- H2 : 1.5rem (24px) - Sous-titres
- H3 : 1.25rem (20px) - Titres de section
- Body : 1rem (16px)
- Small : 0.875rem (14px)
- Caption : 0.75rem (12px)
```

### **Espacements (Grille 8px)**

```
- xs : 4px
- sm : 8px
- md : 16px
- lg : 24px
- xl : 32px
- 2xl : 48px
- 3xl : 64px
```

### **Composants CSS à Créer**

#### **1. Layout Principal**
```css
/* Structure avec Flexbox */
.container {
  display: flex;
  min-height: 100vh;
}

.sidebar {
  width: 250px;
  background: #ffffff;
  border-right: 1px solid #e2e8f0;
}

.main-content {
  flex: 1;
  padding: 24px;
  background: #f8fafc;
}
```

#### **2. Header**
```css
.header {
  height: 64px;
  background: #ffffff;
  border-bottom: 1px solid #e2e8f0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
}
```

#### **3. Cards**
```css
.card {
  background: #ffffff;
  border-radius: 8px;
  padding: 24px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  margin-bottom: 24px;
}
```

#### **4. Badges**
```css
.badge {
  display: inline-block;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
}

.badge-success { background: #d1fae5; color: #065f46; }
.badge-danger { background: #fee2e2; color: #991b1b; }
.badge-warning { background: #fef3c7; color: #92400e; }
.badge-info { background: #dbeafe; color: #1e40af; }
```

#### **5. Boutons**
```css
.btn {
  padding: 8px 16px;
  border-radius: 6px;
  border: none;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-primary {
  background: #2563eb;
  color: #ffffff;
}

.btn-primary:hover {
  background: #1d4ed8;
}
```

#### **6. Tableaux**
```css
.table {
  width: 100%;
  border-collapse: collapse;
  background: #ffffff;
  border-radius: 8px;
  overflow: hidden;
}

.table th {
  background: #f8fafc;
  padding: 12px;
  text-align: left;
  font-weight: 600;
  border-bottom: 2px solid #e2e8f0;
}

.table td {
  padding: 12px;
  border-bottom: 1px solid #e2e8f0;
}

.table tr:hover {
  background: #f8fafc;
}
```

#### **7. Formulaires**
```css
.form-group {
  margin-bottom: 24px;
}

.form-label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #1e293b;
}

.form-input {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  font-size: 1rem;
}

.form-input:focus {
  outline: none;
  border-color: #2563eb;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
}
```

### **Responsive Design**

Breakpoints recommandés :
```css
/* Mobile */
@media (max-width: 768px) {
  .sidebar {
    transform: translateX(-100%);
    position: fixed;
    z-index: 1000;
  }
  
  .main-content {
    padding: 16px;
  }
  
  .table {
    display: block;
    overflow-x: auto;
  }
}

/* Tablet */
@media (min-width: 769px) and (max-width: 1024px) {
  .sidebar {
    width: 200px;
  }
}

/* Desktop */
@media (min-width: 1025px) {
  /* Styles desktop */
}
```

---

## 📁 STRUCTURE DE DOSSIERS RECOMMANDÉE

```
systicket/
├── index.html                    # Redirection vers connexion.html
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
│   ├── style.css                 # Fichier CSS principal
│   ├── variables.css             # Variables CSS (couleurs, espacements)
│   ├── layout.css                # Layout (header, sidebar, footer)
│   ├── components.css            # Composants (boutons, badges, cards)
│   ├── forms.css                 # Styles formulaires
│   └── responsive.css            # Media queries responsive
│
├── assets/
│   ├── images/
│   │   ├── logo.svg              # Logo de l'application
│   │   └── favicon.ico           # Favicon
│   └── icons/                    # Icônes SVG (optionnel)
│
└── README.md                     # Documentation du projet
```

---

## ✅ CHECKLIST DE VALIDATION

### **HTML**
- [ ] Toutes les pages utilisent HTML5 sémantique
- [ ] Validation W3C sans erreurs pour chaque page
- [ ] Tous les formulaires ont des labels associés
- [ ] Attributs `alt` sur toutes les images
- [ ] Structure logique avec `<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<footer>`
- [ ] Meta tags présents (charset, viewport)
- [ ] Titres hiérarchiques corrects (H1, H2, H3)

### **CSS**
- [ ] Utilisation de Flexbox pour tous les layouts
- [ ] Pas de floats pour la mise en page
- [ ] Code CSS organisé et commenté
- [ ] Variables CSS pour les couleurs et espacements
- [ ] Cohérence visuelle entre toutes les pages
- [ ] Responsive design fonctionnel (testé sur différentes tailles)

### **Navigation**
- [ ] Menu de navigation présent sur toutes les pages (sauf connexion/inscription)
- [ ] Liens fonctionnels entre toutes les pages
- [ ] Breadcrumbs sur les pages de détail
- [ ] Liens "Retour" présents où nécessaire

### **Design**
- [ ] Palette de couleurs cohérente
- [ ] Typographie lisible et hiérarchisée
- [ ] Espacements réguliers et harmonieux
- [ ] États hover sur les boutons et liens
- [ ] Badges de statut visuellement distincts
- [ ] Tableaux lisibles et bien structurés
- [ ] Formulaires clairs et accessibles

### **Fonctionnalités Visuelles**
- [ ] Cards de statistiques sur le dashboard
- [ ] Badges de statut colorés sur les tickets
- [ ] Barres de progression pour les heures consommées
- [ ] Avatars/initiales pour les utilisateurs
- [ ] Icônes visuelles pour les actions

### **Responsive**
- [ ] Testé sur desktop (1920px, 1440px, 1280px)
- [ ] Testé sur tablette (768px, 1024px)
- [ ] Testé sur mobile (375px, 414px)
- [ ] Menu adaptatif (sidebar cachée sur mobile)
- [ ] Tableaux scrollables horizontalement sur mobile

### **Documentation**
- [ ] README.md avec description du projet
- [ ] Structure des dossiers expliquée
- [ ] Instructions pour ouvrir les pages
- [ ] Liste des pages créées

---

## 🎯 PRIORISATION DES PAGES

### **Priorité 1 (Obligatoires)**
1. Page de connexion
2. Tableau de bord
3. Liste des projets
4. Liste des tickets
5. Détail d'un ticket
6. Formulaire de création de ticket

### **Priorité 2 (Recommandées)**
7. Page d'inscription
8. Détail d'un projet
9. Gestion des clients
10. Suivi du temps
11. Validation des tickets (client)

### **Priorité 3 (Bonus)**
12. Gestion des utilisateurs (admin)
13. Gestion des contrats
14. Profil utilisateur
15. Rapports/statistiques
16. Page 404

---

## 📝 NOTES IMPORTANTES

1. **Pas de JavaScript** : À cette étape, tous les éléments interactifs doivent être visuels uniquement (boutons, liens, mais pas de logique)

2. **Données fictives** : Utiliser des données d'exemple réalistes dans les tableaux et listes

3. **Cohérence** : S'assurer que le même ticket/projet/client apparaît de manière cohérente sur toutes les pages

4. **Accessibilité** : Penser aux utilisateurs avec des besoins spécifiques (contraste, taille de police, navigation au clavier)

5. **Performance** : Optimiser les images, minimiser le CSS (ou organiser en modules)

---

## 🚀 PROCHAINES ÉTAPES (après Étape 1)

L'étape 2 ajoutera le JavaScript pour :
- Validation des formulaires
- Interactions dynamiques
- Messages d'erreur/succès
- Affichage conditionnel

L'étape 3 migrera vers PHP pour la logique métier.

---

**Date de création de cette analyse :** 2025  
**Version :** 1.0  
**Auteur :** Analyse pour Systicket - Étape 1
