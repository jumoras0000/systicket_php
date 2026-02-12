# Guide de simulation — Systicket

Ce guide décrit comment l’application fonctionne pour chaque type d’utilisateur et simule les cas d’usage typiques du projet.

---

## 1. Vue d’ensemble de l’application

**Systicket** est une application de gestion de tickets et de suivi du temps. Elle permet de :

- Créer et suivre des tickets (bugs, fonctionnalités)
- Gérer des projets et des clients
- Enregistrer le temps passé par ticket
- Valider ou refuser des tickets facturables (côté client)
- Consulter des rapports et statistiques

L’application fonctionne en **frontend uniquement** (HTML/CSS/JS) avec persistance via `localStorage` et `sessionStorage`.

---

## 2. Les trois rôles utilisateur

| Rôle            | Description                                   | Menu principal                          |
|-----------------|-----------------------------------------------|-----------------------------------------|
| **Administrateur** | Accès complet à toutes les fonctionnalités    | Dashboard, Projets, Tickets, Clients, Contrats, Temps, Rapports, Utilisateurs, Profil |
| **Collaborateur**  | Gestion opérationnelle (tickets, projets, temps) | Dashboard, Projets, Tickets, Temps, Profil |
| **Client**         | Consultation et validation des tickets facturables | Dashboard, Mes projets, Validation, Profil |

---

## 3. Changer de rôle (simulation)

Pour simuler un rôle :

1. **Via l’URL**  
   - Admin : `html/pages/dashboard.html` (par défaut)  
   - Collaborateur : `html/pages/dashboard.html?role=collaborateur`  
   - Client : `html/pages/dashboard.html?role=client`

2. **Persistance**  
   Le rôle est mémorisé dans `localStorage` et reste actif tant que vous ne le changez pas via l’URL.

> **Important** : Lancer l’application avec un serveur HTTP (ex. `npx serve .`) car les composants sont chargés dynamiquement.

---

## 4. Cas d’usage par rôle

---

### 4.1 Cas d’usage — Administrateur

#### UC1 : Connexion et accès au tableau de bord

| Étape | Action | Page / Élément | Résultat |
|-------|--------|----------------|----------|
| 1 | Ouvrir l’application | `index.html` | Page d’accueil avec boutons Se connecter / Créer un compte |
| 2 | Cliquer sur « Se connecter » | `connexion.html` | Formulaire email + mot de passe |
| 3 | Remplir et valider le formulaire | `connexion.html` | Message de succès puis redirection vers `dashboard.html` |
| 4 | Visualiser le tableau de bord | `dashboard.html` | KPIs, alertes, graphiques |

#### UC2 : Créer un ticket

| Étape | Action | Page / Élément | Résultat |
|-------|--------|----------------|----------|
| 1 | Menu → Tickets | `tickets.html` | Liste des tickets |
| 2 | Cliquer sur « + Créer un ticket » | Bouton | Redirection vers `ticket-form.html` |
| 3 | Remplir le formulaire | Titre*, Description*, Projet*, Type | Validation côté client |
| 4 | Cliquer sur « Créer le ticket » | Bouton submit | Message « Enregistrement effectué », redirection vers `tickets.html` |
| 5 | Vérifier la liste | `tickets.html` | Nouveau ticket visible dans le tableau |

#### UC3 : Créer un client

| Étape | Action | Page / Élément | Résultat |
|-------|--------|----------------|----------|
| 1 | Menu → Clients | `clients.html` | Liste des clients |
| 2 | Cliquer sur « + Ajouter un client » | Bouton | Redirection vers `client-form.html` |
| 3 | Remplir le formulaire | Raison sociale*, Contact*, Email* | Validation |
| 4 | Valider | Bouton | Redirection vers `clients.html`, nouveau client visible |

#### UC4 : Créer un projet

| Étape | Action | Page / Élément | Résultat |
|-------|--------|----------------|----------|
| 1 | Menu → Projets | `projets.html` | Liste des projets |
| 2 | Cliquer sur « + Créer un projet » | Bouton | Redirection vers `projet-form.html` |
| 3 | Remplir le formulaire | Nom*, Client* | Validation |
| 4 | Valider | Bouton | Redirection vers `projets.html`, nouveau projet visible |

#### UC5 : Créer un contrat

| Étape | Action | Page / Élément | Résultat |
|-------|--------|----------------|----------|
| 1 | Menu → Contrats | `contrats.html` | Liste des contrats |
| 2 | Cliquer sur « + Créer un contrat » | Bouton | Redirection vers `contrat-form.html` |
| 3 | Remplir le formulaire | Projet*, Client*, Heures*, Taux*, Dates* | Validation |
| 4 | Valider | Bouton | Redirection vers `contrats.html`, nouveau contrat visible |

#### UC6 : Enregistrer du temps passé

| Étape | Action | Page / Élément | Résultat |
|-------|--------|----------------|----------|
| 1 | Menu → Suivi du temps | `temps.html` | Formulaire + tableau des entrées |
| 2 | Remplir le formulaire | Ticket*, Date*, Heures* | Validation |
| 3 | Cliquer sur « Enregistrer » | Bouton | Message de succès, nouvelle ligne dans le tableau |

#### UC7 : Consulter les rapports

| Étape | Action | Page / Élément | Résultat |
|-------|--------|----------------|----------|
| 1 | Menu → Rapports | `rapports.html` | Filtres et graphiques |
| 2 | Appliquer une période | Filtres dates / période | Mise à jour des données affichées |
| 3 | Cliquer sur « Exporter » | Bouton | Impression (`window.print()`) |

#### UC8 : Gérer les utilisateurs

| Étape | Action | Page / Élément | Résultat |
|-------|--------|----------------|----------|
| 1 | Menu → Utilisateurs | `utilisateurs.html` | Liste des utilisateurs |
| 2 | Cliquer sur « + Ajouter un utilisateur » | Bouton | Redirection vers `profil.html?new=1` |

---

### 4.2 Cas d’usage — Collaborateur

Le collaborateur a un menu réduit (pas de Clients, Contrats, Rapports, Utilisateurs).

#### UC1 : Connexion

Identique à l’admin. Pour tester en collaborateur, aller sur :  
`dashboard.html?role=collaborateur`

#### UC2 : Créer un ticket

| Étape | Action | Page / Élément | Résultat |
|-------|--------|----------------|----------|
| 1 | Menu → Tickets | `tickets.html` | Liste des tickets |
| 2 | Cliquer sur « + Créer un ticket » | Bouton visible | Même flux que l’admin |
| 3 | Valider le formulaire | Formulaire | Ticket créé et visible dans la liste |

#### UC3 : Créer un projet

| Étape | Action | Page / Élément | Résultat |
|-------|--------|----------------|----------|
| 1 | Menu → Projets | `projets.html` | Liste des projets |
| 2 | Cliquer sur « + Créer un projet » | Bouton visible | Même flux que l’admin |

#### UC4 : Enregistrer du temps

| Étape | Action | Page / Élément | Résultat |
|-------|--------|----------------|----------|
| 1 | Menu → Suivi du temps | `temps.html` | Formulaire et tableau |
| 2 | Remplir et valider | Ticket, Date, Heures | Nouvelle entrée ajoutée |

#### UC5 : Restrictions du collaborateur

| Action | Visible pour l’admin | Visible pour le collaborateur |
|--------|----------------------|--------------------------------|
| Menu Clients | ✅ | ❌ |
| Menu Contrats | ✅ | ❌ |
| Menu Rapports | ✅ | ❌ |
| Menu Utilisateurs | ✅ | ❌ |
| Bouton « + Créer un ticket » | ✅ | ✅ |
| Bouton « + Créer un projet » | ✅ | ✅ |

---

### 4.3 Cas d’usage — Client

Le client voit un menu simplifié : Dashboard, Mes projets, Validation, Profil. La page `ticket-validation.html` utilise le composant `sidebar-client`.

#### UC1 : Accès en tant que client

| Étape | Action | URL / Page | Résultat |
|-------|--------|-----------|----------|
| 1 | Simuler connexion client | `dashboard.html?role=client` ou `ticket-validation.html` | Menu limité à 4 entrées |
| 2 | Ouverture de la page validation | `ticket-validation.html` | Sidebar client avec Validation |

#### UC2 : Valider un ticket facturable

| Étape | Action | Page / Élément | Résultat |
|-------|--------|----------------|----------|
| 1 | Menu → Validation | `ticket-validation.html` | Liste des tickets à valider |
| 2 | Voir les cartes tickets | `.project-card` | Projet, description, montant |
| 3 | Cliquer sur « ✅ Valider » | Bouton vert | Toast succès, carte grisée |
| 4 | Cliquer sur « ❌ Refuser » | Bouton rouge | Toast erreur, carte grisée |

#### UC3 : Consulter ses projets

| Étape | Action | Page / Élément | Résultat |
|-------|--------|----------------|----------|
| 1 | Menu → Mes projets | `projets.html` | Liste des projets (lecture seule) |
| 2 | Cliquer sur un projet | Lien | `projet-detail.html` |
| 3 | Actions possibles | — | Pas de bouton Créer / Éditer |

#### UC4 : Accéder à la validation depuis le dashboard

| Étape | Action | Page / Élément | Résultat |
|-------|--------|----------------|----------|
| 1 | Dashboard client | `dashboard.html?role=client` | Cartes et alertes |
| 2 | Clic sur alerte « tickets en attente de validation » | Lien | `ticket-validation.html` |
| 3 | Clic sur carte « À valider ce mois » | Lien | `ticket-validation.html` |

#### UC5 : Restrictions du client

| Action | Visible pour l’admin | Visible pour le client |
|--------|----------------------|-------------------------|
| Menu Tickets | ✅ | ❌ |
| Menu Clients | ✅ | ❌ |
| Menu Contrats | ✅ | ❌ |
| Menu Temps | ✅ | ❌ |
| Menu Rapports | ✅ | ❌ |
| Menu Utilisateurs | ✅ | ❌ |
| Menu Validation | — (utilise ticket-validation) | ✅ |
| Boutons Valider / Refuser | — | ✅ (sur ticket-validation) |

---

## 5. Matrice des permissions (synthèse)

| Fonctionnalité | Admin | Collaborateur | Client |
|----------------|-------|---------------|--------|
| **Dashboard** | ✅ | ✅ | ✅ |
| **Projets** (lecture) | ✅ | ✅ | ✅ |
| **Projets** (création/édition) | ✅ | ✅ | ❌ |
| **Tickets** (lecture) | ✅ | ✅ | ❌ |
| **Tickets** (création/édition) | ✅ | ✅ | ❌ |
| **Validation tickets facturables** | ❌ | ❌ | ✅ |
| **Clients** | ✅ | ❌ | ❌ |
| **Contrats** | ✅ | ❌ | ❌ |
| **Utilisateurs** | ✅ | ❌ | ❌ |
| **Suivi du temps** | ✅ | ✅ | ❌ |
| **Rapports** | ✅ | ❌ | ❌ |
| **Profil** | ✅ | ✅ | ✅ |

---

## 6. Flux fonctionnels

### 6.1 Parcours complet Admin (journée type)

```
Index → Connexion → Dashboard
         ↓
    Tickets → Créer ticket → Liste tickets (ticket ajouté)
         ↓
    Clients → Ajouter client → Liste clients
         ↓
    Projets → Créer projet → Liste projets
         ↓
    Contrats → Créer contrat → Liste contrats
         ↓
    Temps → Enregistrer temps → Tableau mis à jour
         ↓
    Rapports → Appliquer filtres → Exporter
         ↓
    Profil → Modifier infos → Sauvegarde
```

### 6.2 Parcours Collaborateur

```
Connexion (?role=collaborateur) → Dashboard
         ↓
    Tickets → Créer ticket
         ↓
    Projets → Créer projet
         ↓
    Temps → Enregistrer temps
         ↓
    Profil
```

### 6.3 Parcours Client

```
Connexion (?role=client) → Dashboard
         ↓
    Validation → Valider ou Refuser un ticket
         ↓
    Mes projets → Consulter un projet
         ↓
    Profil
```

---

## 7. Persistance des données

| Donnée | Stockage | Comportement |
|--------|----------|--------------|
| Tickets créés | `localStorage` | Conservés au rechargement |
| Clients | `localStorage` | Idem |
| Projets | `localStorage` | Idem |
| Contrats | `localStorage` | Idem |
| Entrées de temps | `localStorage` | Idem |
| Validations (Valider/Refuser) | `localStorage` | Idem |
| Profil utilisateur | `localStorage` | Idem |
| Filtres de liste | `sessionStorage` | Jusqu’à fermeture de l’onglet |
| Rôle simulé | `localStorage` | Persiste entre sessions |

---

## 8. Pages de l’application

| Page | Rôles | Description |
|------|-------|-------------|
| `index.html` | Tous | Page d’accueil, Connexion / Inscription |
| `connexion.html` | Tous | Formulaire de connexion |
| `inscription.html` | Tous | Formulaire d’inscription |
| `dashboard.html` | Tous | Tableau de bord, KPIs, alertes |
| `tickets.html` | Admin, Collaborateur | Liste des tickets |
| `ticket-form.html` | Admin, Collaborateur | Création/édition de ticket |
| `ticket-detail.html` | Admin, Collaborateur | Détail d’un ticket |
| `ticket-validation.html` | Client | Validation des tickets facturables |
| `projets.html` | Tous | Liste des projets |
| `projet-form.html` | Admin, Collaborateur | Création/édition de projet |
| `projet-detail.html` | Tous | Détail d’un projet |
| `clients.html` | Admin | Liste des clients |
| `client-form.html` | Admin | Création/édition de client |
| `client-detail.html` | Admin | Détail d’un client |
| `contrats.html` | Admin | Liste des contrats |
| `contrat-form.html` | Admin | Création/édition de contrat |
| `contrat-detail.html` | Admin | Détail d’un contrat |
| `temps.html` | Admin, Collaborateur | Suivi du temps |
| `rapports.html` | Admin | Rapports et statistiques |
| `utilisateurs.html` | Admin | Liste des utilisateurs |
| `profil.html` | Tous | Profil utilisateur |
| `cgu.html` | Tous | Conditions générales d’utilisation |

---

## 9. Navigation SPA

La navigation dans la sidebar (menu latéral) utilise une logique SPA :

- Les liens du menu rechargent uniquement le contenu principal.
- Le header et la sidebar restent fixes.
- L’historique du navigateur est mis à jour.
- Le lien actif dans le menu est mis en évidence.

Les liens dans le contenu (breadcrumbs, cartes, boutons) provoquent un rechargement complet de la page.

---

**Version** : 1.0 — Systicket (Phase 2 – JavaScript frontend)  
**Date** : Février 2026
