# 📋 PLAN D'ACTION — ÉTAPE 1
## Guide de réalisation pas à pas

Ce document vous guide dans la réalisation de l'étape 1 de manière structurée et efficace.

---

## 🎯 OBJECTIF FINAL

Créer **17 pages HTML/CSS statiques** avec navigation fonctionnelle, design cohérent et responsive, validées W3C.

**Date limite :** 5 Février 2026

---

## 📅 PLANNING SUGGÉRÉ (3-4 semaines)

### **Semaine 1 : Setup et Pages d'Authentification**
- Jour 1-2 : Structure du projet et CSS de base
- Jour 3-4 : Page de connexion
- Jour 5 : Page d'inscription

### **Semaine 2 : Pages Principales**
- Jour 1-2 : Tableau de bord
- Jour 3 : Liste des projets + Détail projet
- Jour 4-5 : Liste des tickets + Détail ticket

### **Semaine 3 : Formulaires et Pages Complémentaires**
- Jour 1 : Formulaire création ticket
- Jour 2 : Suivi du temps
- Jour 3 : Validation tickets (client)
- Jour 4 : Gestion clients
- Jour 5 : Gestion utilisateurs

### **Semaine 4 : Finalisation**
- Jour 1-2 : Pages restantes (contrats, rapports, profil, 404)
- Jour 3 : Tests et corrections responsive
- Jour 4 : Validation W3C
- Jour 5 : Documentation et livrable final

---

## 🚀 ÉTAPE PAR ÉTAPE

### **PHASE 1 : SETUP INITIAL**

#### ✅ Étape 1.1 : Créer la structure de dossiers
```
systicket/
├── css/
├── assets/
│   └── images/
└── (pages HTML à créer)
```

#### ✅ Étape 1.2 : Créer le fichier CSS de base
**Fichier :** `css/style.css`

**Contenu initial :**
- Reset CSS ou Normalize
- Variables CSS (couleurs, espacements)
- Styles de base (body, typographie)
- Classes utilitaires

**À inclure :**
```css
/* Variables */
:root {
    --color-primary: #2563eb;
    --color-secondary: #64748b;
    --color-success: #10b981;
    --color-danger: #ef4444;
    --color-warning: #f59e0b;
    --spacing-xs: 4px;
    --spacing-sm: 8px;
    --spacing-md: 16px;
    --spacing-lg: 24px;
    --spacing-xl: 32px;
}

/* Reset et base */
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    font-size: 16px;
    line-height: 1.5;
    color: #1e293b;
    background: #f8fafc;
}
```

#### ✅ Étape 1.3 : Créer le layout de base
**Fichiers à créer :**
- `css/layout.css` : Header, Sidebar, Container
- `css/components.css` : Boutons, Cards, Badges, Tableaux

---

### **PHASE 2 : PAGES D'AUTHENTIFICATION**

#### ✅ Étape 2.1 : Page de connexion
**Fichier :** `connexion.html`

**Checklist :**
- [ ] Structure HTML sémantique
- [ ] Formulaire avec email et mot de passe
- [ ] Lien vers inscription
- [ ] Design centré et épuré
- [ ] Responsive (mobile-friendly)
- [ ] Validation W3C

**Temps estimé :** 2-3 heures

#### ✅ Étape 2.2 : Page d'inscription
**Fichier :** `inscription.html`

**Checklist :**
- [ ] Formulaire complet (nom, prénom, email, mot de passe)
- [ ] Sélection du rôle (radio buttons)
- [ ] Validation visuelle des champs
- [ ] Lien retour vers connexion
- [ ] Responsive
- [ ] Validation W3C

**Temps estimé :** 2-3 heures

---

### **PHASE 3 : LAYOUT COMMUN (Header + Sidebar)**

#### ✅ Étape 3.1 : Créer le header
**À inclure dans toutes les pages (sauf connexion/inscription) :**
- Logo
- Nom de l'application
- Menu utilisateur (nom + avatar)
- Bouton déconnexion

#### ✅ Étape 3.2 : Créer la sidebar
**Menu de navigation avec :**
- Tableau de bord
- Projets
- Tickets
- Clients
- Contrats
- Rapports
- Profil

**Style :** Menu vertical avec icônes, état actif visible

**Temps estimé :** 3-4 heures

---

### **PHASE 4 : PAGES PRINCIPALES**

#### ✅ Étape 4.1 : Tableau de bord
**Fichier :** `dashboard.html`

**Checklist :**
- [ ] Header + Sidebar intégrés
- [ ] 4 cards de statistiques (Flexbox)
- [ ] Widget "Projets actifs"
- [ ] Widget "Tickets récents"
- [ ] Widget "Heures consommées"
- [ ] Design cohérent
- [ ] Responsive

**Temps estimé :** 4-5 heures

#### ✅ Étape 4.2 : Liste des projets
**Fichier :** `projets.html`

**Checklist :**
- [ ] En-tête avec titre et bouton "Créer"
- [ ] Barre de recherche (visuelle)
- [ ] Filtres (dropdowns)
- [ ] Tableau des projets OU vue en cartes
- [ ] Colonnes : Nom, Client, Statut, Tickets, Heures
- [ ] Pagination visuelle
- [ ] Liens vers détail projet

**Temps estimé :** 3-4 heures

#### ✅ Étape 4.3 : Détail d'un projet
**Fichier :** `projet-detail.html`

**Checklist :**
- [ ] Breadcrumb
- [ ] En-tête avec nom projet et actions
- [ ] Section "Informations générales"
- [ ] Section "Contrat" avec barre de progression
- [ ] Section "Collaborateurs"
- [ ] Section "Tickets du projet" (tableau)
- [ ] Responsive

**Temps estimé :** 3-4 heures

#### ✅ Étape 4.4 : Liste des tickets
**Fichier :** `tickets.html`

**Checklist :**
- [ ] En-tête avec bouton "Créer ticket"
- [ ] Filtres avancés (statut, priorité, type)
- [ ] Tableau complet avec toutes les colonnes
- [ ] Badges de statut colorés
- [ ] Badges de priorité
- [ ] Badges type (Inclus/Facturable)
- [ ] Liens vers détail ticket
- [ ] Responsive (tableau scrollable sur mobile)

**Temps estimé :** 4-5 heures

#### ✅ Étape 4.5 : Détail d'un ticket
**Fichier :** `ticket-detail.html`

**Checklist :**
- [ ] Breadcrumb
- [ ] En-tête avec badges (statut, priorité, type)
- [ ] Section "Description"
- [ ] Section "Temps passé" avec liste des entrées
- [ ] Section "Commentaires"
- [ ] Sidebar droite avec :
  - Informations (projet, client, dates)
  - Assignation
  - Actions rapides
- [ ] Layout responsive (sidebar en bas sur mobile)

**Temps estimé :** 5-6 heures

---

### **PHASE 5 : FORMULAIRES**

#### ✅ Étape 5.1 : Formulaire création ticket
**Fichier :** `ticket-form.html`

**Checklist :**
- [ ] Breadcrumb
- [ ] Formulaire complet :
  - Titre (requis)
  - Description (requis, textarea)
  - Projet (select, requis)
  - Priorité (select)
  - Type (radio buttons)
  - Temps estimé (number)
  - Assignation (multi-select)
- [ ] Boutons : Créer, Annuler, Brouillon
- [ ] Validation visuelle (champs requis)
- [ ] Messages d'aide

**Temps estimé :** 3-4 heures

#### ✅ Étape 5.2 : Suivi du temps
**Fichier :** `temps.html`

**Checklist :**
- [ ] Formulaire d'ajout d'entrée de temps
- [ ] Liste des entrées existantes (tableau)
- [ ] Filtres par projet, période
- [ ] Total du temps affiché

**Temps estimé :** 2-3 heures

---

### **PHASE 6 : PAGES DE GESTION**

#### ✅ Étape 6.1 : Gestion des clients
**Fichier :** `clients.html`

**Checklist :**
- [ ] Liste des clients (tableau)
- [ ] Bouton "Créer un client"
- [ ] Colonnes : Nom, Contact, Email, Projets, Statut
- [ ] Lien vers détail client

**Fichier :** `client-detail.html`
- [ ] Informations client complètes
- [ ] Liste des projets
- [ ] Liste des tickets récents

**Temps estimé :** 3-4 heures

#### ✅ Étape 6.2 : Gestion des utilisateurs (Admin)
**Fichier :** `utilisateurs.html`

**Checklist :**
- [ ] Tableau des utilisateurs
- [ ] Colonnes : Nom, Email, Rôle, Statut, Actions
- [ ] Bouton "Ajouter utilisateur"

**Temps estimé :** 2-3 heures

#### ✅ Étape 6.3 : Gestion des contrats
**Fichier :** `contrats.html`

**Checklist :**
- [ ] Liste des contrats
- [ ] Colonnes : Projet, Client, Heures incluses, Consommées, Restantes
- [ ] Barres de progression visuelles

**Temps estimé :** 2-3 heures

---

### **PHASE 7 : PAGES COMPLÉMENTAIRES**

#### ✅ Étape 7.1 : Validation des tickets (Client)
**Fichier :** `ticket-validation.html`

**Checklist :**
- [ ] Liste des tickets facturables en attente
- [ ] Pour chaque ticket : titre, description, temps, montant
- [ ] Boutons "Valider" et "Refuser"
- [ ] Zone de commentaires pour refus

**Temps estimé :** 2-3 heures

#### ✅ Étape 7.2 : Profil utilisateur
**Fichier :** `profil.html`

**Checklist :**
- [ ] Formulaire informations personnelles
- [ ] Section changement de mot de passe
- [ ] Upload photo de profil (placeholder)

**Temps estimé :** 2 heures

#### ✅ Étape 7.3 : Rapports/Statistiques
**Fichier :** `rapports.html`

**Checklist :**
- [ ] Graphiques visuels (CSS uniquement)
- [ ] Tableaux de synthèse
- [ ] Statistiques par projet, collaborateur

**Temps estimé :** 3-4 heures

#### ✅ Étape 7.4 : Page 404
**Fichier :** `404.html`

**Checklist :**
- [ ] Message d'erreur clair
- [ ] Lien retour tableau de bord
- [ ] Design cohérent

**Temps estimé :** 1 heure

---

### **PHASE 8 : FINALISATION**

#### ✅ Étape 8.1 : Navigation complète
**Checklist :**
- [ ] Tous les liens fonctionnent
- [ ] Menu de navigation présent partout
- [ ] Breadcrumbs sur pages détail
- [ ] Liens "Retour" présents

#### ✅ Étape 8.2 : Responsive Design
**Checklist :**
- [ ] Test sur desktop (1920px, 1440px, 1280px)
- [ ] Test sur tablette (768px, 1024px)
- [ ] Test sur mobile (375px, 414px)
- [ ] Sidebar cachée sur mobile
- [ ] Tableaux scrollables horizontalement
- [ ] Formulaires adaptés

#### ✅ Étape 8.3 : Validation W3C
**Checklist :**
- [ ] Validation de chaque page HTML
- [ ] Correction de toutes les erreurs
- [ ] Aucun warning critique

**Outil :** https://validator.w3.org/

#### ✅ Étape 8.4 : Cohérence visuelle
**Checklist :**
- [ ] Palette de couleurs identique partout
- [ ] Typographie cohérente
- [ ] Espacements réguliers
- [ ] Badges de même style
- [ ] Boutons cohérents
- [ ] Cards uniformes

#### ✅ Étape 8.5 : Documentation
**Fichier :** `README.md`

**À inclure :**
- Description du projet
- Structure des dossiers
- Liste des pages créées
- Instructions pour ouvrir les pages
- Captures d'écran (optionnel)

---

## 🎨 CONSEILS DE DESIGN

### **Couleurs des Statuts**
- Nouveau : Bleu (#3b82f6)
- En cours : Orange (#f59e0b)
- Terminé : Vert (#10b981)
- À valider : Orange (#f59e0b)
- Validé : Vert (#10b981)
- Refusé : Rouge (#ef4444)

### **Couleurs des Priorités**
- Faible : Gris (#94a3b8)
- Normale : Bleu (#3b82f6)
- Élevée : Orange (#f59e0b)
- Critique : Rouge (#ef4444)

### **Espacements**
Utiliser une grille de 8px :
- Petit : 8px
- Moyen : 16px
- Grand : 24px
- Très grand : 32px

### **Typographie**
- Titre de page : 32px (2rem)
- Sous-titre : 24px (1.5rem)
- Texte normal : 16px (1rem)
- Petit texte : 14px (0.875rem)

---

## ✅ CHECKLIST FINALE

### **Pages HTML**
- [ ] connexion.html
- [ ] inscription.html
- [ ] dashboard.html
- [ ] projets.html
- [ ] projet-detail.html
- [ ] tickets.html
- [ ] ticket-detail.html
- [ ] ticket-form.html
- [ ] temps.html
- [ ] ticket-validation.html
- [ ] clients.html
- [ ] client-detail.html
- [ ] utilisateurs.html
- [ ] contrats.html
- [ ] profil.html
- [ ] rapports.html
- [ ] 404.html

### **CSS**
- [ ] style.css (principal)
- [ ] layout.css (optionnel)
- [ ] components.css (optionnel)
- [ ] responsive.css (optionnel ou intégré)

### **Navigation**
- [ ] Tous les liens fonctionnent
- [ ] Menu présent sur toutes les pages
- [ ] Breadcrumbs sur pages détail

### **Validation**
- [ ] Toutes les pages validées W3C
- [ ] Aucune erreur HTML
- [ ] CSS valide

### **Responsive**
- [ ] Testé sur desktop
- [ ] Testé sur tablette
- [ ] Testé sur mobile

### **Documentation**
- [ ] README.md complet
- [ ] Structure expliquée
- [ ] Instructions claires

---

## 🚨 PIÈGES À ÉVITER

1. **Ne pas utiliser de JavaScript** : Cette étape est purement HTML/CSS
2. **Ne pas oublier la validation W3C** : C'est une contrainte obligatoire
3. **Ne pas négliger le responsive** : Minimum 1024px mais idéalement mobile-friendly
4. **Ne pas créer de pages isolées** : Toutes les pages doivent être liées
5. **Ne pas utiliser de framework CSS** : Bootstrap, Tailwind interdits à cette étape
6. **Ne pas oublier les données fictives** : Remplir les tableaux avec des exemples réalistes

---

## 📚 RESSOURCES UTILES

### **Validation HTML**
- W3C Validator : https://validator.w3.org/
- Validateur local : Extension navigateur

### **Inspiration Design**
- Dribbble : Rechercher "dashboard", "ticket system", "admin panel"
- Behance : Projets de gestion de tickets
- GitHub : Projets open source similaires

### **Flexbox**
- Guide MDN : https://developer.mozilla.org/fr/docs/Web/CSS/CSS_Flexible_Box_Layout
- Flexbox Froggy : Jeu d'apprentissage

### **Responsive Design**
- Can I Use : Vérifier compatibilité navigateurs
- Responsive Design Checker : Tester différentes tailles

---

## 🎯 OBJECTIFS DE QUALITÉ

### **Code**
- HTML sémantique et bien structuré
- CSS organisé et commenté
- Nommage cohérent des classes
- Pas de code dupliqué

### **Design**
- Interface moderne et professionnelle
- Cohérence visuelle
- Lisibilité optimale
- Expérience utilisateur fluide

### **Accessibilité**
- Labels sur tous les inputs
- Alt sur toutes les images
- Contraste suffisant
- Navigation au clavier possible

---

**Bon courage pour la réalisation ! 🚀**

**N'oubliez pas :** Cette étape pose les fondations de votre application. Prenez le temps de bien structurer et de créer un design cohérent. Les étapes suivantes seront plus faciles si cette base est solide !
