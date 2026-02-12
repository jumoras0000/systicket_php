# Guide : Validation et Insertion de Projets dans le Tableau

Ce guide explique de manière simple comment fonctionnent la validation des projets, leur insertion dans le tableau et les filtres.

---

## 📋 Table des matières

1. [Validation du formulaire (`forms-validation.js`)](#validation)
2. [Insertion dans le tableau (`app-data.js`)](#insertion)
3. [Filtres du tableau (`list-filters.js`)](#filtres)

---

## 🔍 1. Validation du formulaire (`forms-validation.js`)

### À quoi sert ce fichier ?

Ce fichier vérifie que les informations du formulaire sont correctes avant de les sauvegarder.

### Comment ça marche ?

#### Étape 1 : Quand vous cliquez sur "Valider"

Quand vous remplissez le formulaire et cliquez sur le bouton "Valider", le code fait ceci :

```javascript
form.addEventListener('submit', function(e) {
    e.preventDefault();  // Empêche la page de se recharger
```

**Explication simple :** 
- `e.preventDefault()` empêche la page de se recharger quand vous cliquez sur "Valider"
- C'est comme si vous disiez au navigateur : "Attends, je vais vérifier les informations d'abord"

#### Étape 2 : Vérification des informations

Le code vérifie trois choses :

**a) Les champs obligatoires**
```javascript
var required = form.querySelectorAll('[required]');
required.forEach(function(field) {
    if (!field.value || field.value.trim() === '') {
        showError(field, 'Ce champ est obligatoire.');
        ok = false;
    }
});
```

**Explication simple :**
- Le code cherche tous les champs marqués comme "obligatoires" (avec `required`)
- Si un champ obligatoire est vide, il affiche une erreur en rouge
- `ok = false` signifie "il y a une erreur"

**b) Les emails**
```javascript
var emails = form.querySelectorAll('input[type="email"]');
emails.forEach(function(field) {
    if (field.value && field.value.indexOf('@') === -1) {
        showError(field, 'L\'email n\'est pas valide.');
        ok = false;
    }
});
```

**Explication simple :**
- Le code vérifie si l'email contient le symbole `@`
- Si l'email n'a pas de `@`, c'est une erreur

**c) Les mots de passe**
```javascript
if (password && confirm && password.value !== confirm.value) {
    showError(confirm, 'Les mots de passe ne correspondent pas.');
    ok = false;
}
```

**Explication simple :**
- Le code compare le mot de passe et sa confirmation
- S'ils ne sont pas identiques, c'est une erreur

#### Étape 3 : Si tout est correct, on sauvegarde

```javascript
if (!validate(form)) {
    return false;  // S'il y a des erreurs, on s'arrête ici
}

// Si on arrive ici, c'est que tout est correct
saveData(form, data);
```

**Explication simple :**
- Si `validate()` retourne `false`, le code s'arrête et affiche les erreurs
- Si tout est correct, le code appelle `saveData()` pour sauvegarder

#### Étape 4 : Sauvegarde du projet

```javascript
function saveData(form, data) {
    data._id = Date.now();  // Donne un numéro unique au projet
    
    if (form.querySelector('#project-name')) {
        AppData.add('projets', data);  // Ajoute le projet à la liste
        window.dispatchEvent(new CustomEvent('systicket:projectAdded', { detail: data }));
    }
}
```

**Explication simple :**
- `Date.now()` donne un numéro unique au projet (comme un numéro de série)
- `AppData.add('projets', data)` ajoute le projet dans la mémoire de l'application
- `dispatchEvent` envoie un message à tous les autres fichiers JavaScript : "Un nouveau projet a été ajouté !"

#### Étape 5 : Réinitialisation du formulaire

```javascript
if (form.querySelector('#project-name')) {
    form.reset();  // Vide le formulaire pour en ajouter un autre
}
```

**Explication simple :**
- `form.reset()` vide tous les champs du formulaire
- Vous pouvez maintenant ajouter un autre projet sans recharger la page

---

## 📊 2. Insertion dans le tableau (`app-data.js`)

### À quoi sert ce fichier ?

Ce fichier affiche les projets dans le tableau de la page "Projets".

### Comment ça marche ?

#### Étape 1 : Écouter le message "projet ajouté"

Quand un projet est ajouté, le fichier `forms-validation.js` envoie un message. Ce fichier l'écoute :

```javascript
window.addEventListener('systicket:projectAdded', function(e) {
    // e.detail contient les informations du nouveau projet
    addProjectToTable(e.detail);
});
```

**Explication simple :**
- `addEventListener` écoute les messages
- Quand le message `systicket:projectAdded` arrive, le code appelle `addProjectToTable()`
- `e.detail` contient toutes les informations du projet (nom, client, statut, etc.)

#### Étape 2 : Ajouter le projet au tableau

```javascript
function addProjectToTable(project) {
    var tbody = document.querySelector('.table tbody');  // Trouve le tableau
    
    // Vérifie si le projet n'est pas déjà dans le tableau
    var existingRow = tbody.querySelector('[data-project-id="' + project._id + '"]');
    if (existingRow) return;  // Si déjà présent, on s'arrête
    
    // Crée une nouvelle ligne pour le tableau
    var tr = document.createElement('tr');
    tr.className = 'project-row';
    tr.setAttribute('data-project-id', project._id);
```

**Explication simple :**
- `document.querySelector('.table tbody')` trouve le tableau dans la page HTML
- Le code vérifie si le projet existe déjà pour éviter les doublons
- `createElement('tr')` crée une nouvelle ligne de tableau
- `setAttribute` ajoute des informations à la ligne (comme l'ID du projet)

#### Étape 3 : Trouver le nom du client

```javascript
var clientName = '—';
if (project.client) {
    var client = clients.find(function(c) {
        return String(c._id) === String(project.client);
    });
    if (client) {
        clientName = client.name || '—';
    }
}
```

**Explication simple :**
- Le projet contient seulement l'ID du client (comme "1" ou "2")
- Le code cherche dans la liste des clients pour trouver le nom correspondant
- Si le client n'est pas trouvé, on affiche "—"

#### Étape 4 : Calculer les statistiques

```javascript
// Compter les tickets du projet
var projectTickets = tickets.filter(function(t) {
    return String(t.project) === String(project._id);
}).length;

// Calculer les heures du projet
var projectHours = 0;
temps.forEach(function(t) {
    if (String(t.project) === String(project._id)) {
        projectHours += parseFloat(t.hours) || 0;
    }
});
```

**Explication simple :**
- Le code compte combien de tickets appartiennent à ce projet
- Le code additionne toutes les heures travaillées sur ce projet
- Ces informations seront affichées dans le tableau

#### Étape 5 : Créer le contenu de la ligne

```javascript
tr.innerHTML = '<td>' + project.name + '</td>' +
               '<td>' + clientName + '</td>' +
               '<td><span class="badge">' + statusText + '</span></td>' +
               '<td>' + projectTickets + '</td>' +
               '<td>' + hoursDisplay + '</td>' +
               '<td>' + progressPercent + '%</td>' +
               '<td><a href="projet-detail.html?id=' + project._id + '">Voir</a></td>';
```

**Explication simple :**
- `innerHTML` remplit la ligne avec du texte HTML
- Chaque `<td>` est une colonne du tableau
- Les colonnes affichent : nom, client, statut, nombre de tickets, heures, progression, lien "Voir"

#### Étape 6 : Ajouter la ligne au tableau

```javascript
// Enlève la ligne vide si elle existe
var emptyRow = tbody.querySelector('.table-empty-row');
if (emptyRow) {
    emptyRow.remove();
}

// Ajoute le nouveau projet à la fin du tableau
tbody.appendChild(tr);
```

**Explication simple :**
- Si le message "Aucun projet" est affiché, on le supprime
- `appendChild(tr)` ajoute la nouvelle ligne à la fin du tableau
- Le projet apparaît maintenant dans le tableau !

---

## 🔎 3. Filtres du tableau (`list-filters.js`)

### À quoi sert ce fichier ?

Ce fichier permet de filtrer les projets dans le tableau (par nom, client, statut, etc.).

### Comment ça marche ?

#### Étape 1 : Écouter les changements

```javascript
var searchInput = document.querySelector('.search-input');
var selects = document.querySelectorAll('select[data-filter]');

// Écoute la recherche
if (searchInput) {
    searchInput.addEventListener('input', filterTable);
}

// Écoute les sélecteurs
selects.forEach(function(sel) {
    sel.addEventListener('change', filterTable);
});
```

**Explication simple :**
- Le code trouve la barre de recherche et les menus déroulants (filtres)
- `addEventListener('input')` écoute quand vous tapez dans la barre de recherche
- `addEventListener('change')` écoute quand vous changez un filtre
- À chaque changement, le code appelle `filterTable()`

#### Étape 2 : Filtrer les lignes

```javascript
function filterTable() {
    var rows = tbody.querySelectorAll('tr.project-row');  // Trouve toutes les lignes
    var searchText = searchInput.value.toLowerCase().trim();  // Texte de recherche
    
    rows.forEach(function(row) {
        var show = true;  // Par défaut, on affiche la ligne
        
        // Vérifie la recherche
        if (searchText) {
            var rowText = row.textContent.toLowerCase();
            if (rowText.indexOf(searchText) === -1) {
                show = false;  // Le texte n'est pas trouvé, on cache la ligne
            }
        }
        
        // Vérifie les filtres (client, statut, etc.)
        for (var key in filterValues) {
            var rowValue = row.getAttribute('data-' + key);
            if (rowValue !== filterValues[key]) {
                show = false;  // Le filtre ne correspond pas, on cache la ligne
            }
        }
        
        // Affiche ou cache la ligne
        if (show) {
            row.style.display = '';  // Affiche la ligne
        } else {
            row.style.display = 'none';  // Cache la ligne
        }
    });
}
```

**Explication simple :**
- Le code parcourt toutes les lignes du tableau
- Pour chaque ligne :
  - Il vérifie si le texte de recherche est dans la ligne
  - Il vérifie si les filtres correspondent (client, statut, etc.)
  - Si tout correspond, `show = true` (on affiche)
  - Sinon, `show = false` (on cache)
- `style.display = 'none'` cache la ligne
- `style.display = ''` affiche la ligne

#### Exemple concret

**Situation :** Vous avez 3 projets dans le tableau :
- Projet A (Client: Acme Corp, Statut: Actif)
- Projet B (Client: Tech Solutions, Statut: En pause)
- Projet C (Client: Acme Corp, Statut: Actif)

**Action :** Vous tapez "A" dans la recherche et sélectionnez "Actif" dans le filtre statut

**Résultat :**
- Projet A : contient "A" ET statut "Actif" → **AFFICHÉ** ✅
- Projet B : contient "A" MAIS statut "En pause" → **CACHÉ** ❌
- Projet C : contient "A" ET statut "Actif" → **AFFICHÉ** ✅

---

## 🔄 Résumé du flux complet

### Quand vous créez un projet :

1. **Vous remplissez le formulaire** → `forms-validation.js` vérifie les informations
2. **Vous cliquez sur "Valider"** → `forms-validation.js` sauvegarde le projet
3. **Un message est envoyé** → `app-data.js` reçoit le message "projet ajouté"
4. **Le projet est ajouté au tableau** → `addProjectToTable()` crée une nouvelle ligne
5. **Le tableau se met à jour** → Le nouveau projet apparaît à la fin du tableau

### Quand vous filtrez le tableau :

1. **Vous tapez dans la recherche** → `list-filters.js` écoute vos frappes
2. **Vous changez un filtre** → `list-filters.js` écoute le changement
3. **Le tableau est filtré** → `filterTable()` cache/affiche les lignes selon les critères

---

## 💡 Points importants à retenir

1. **Validation** : Vérifie que les informations sont correctes avant de sauvegarder
2. **Sauvegarde** : Stocke le projet en mémoire (disparaît au rafraîchissement)
3. **Insertion** : Ajoute le projet au tableau sans remplacer les autres
4. **Filtres** : Cache/affiche les lignes selon vos critères de recherche

---

## 🎯 Questions fréquentes

**Q : Pourquoi le projet disparaît quand je rafraîchis la page ?**
R : Parce que les données sont stockées en mémoire (`DATA`), pas dans une base de données. C'est normal pour cette application.

**Q : Comment ajouter plusieurs projets rapidement ?**
R : Remplissez le formulaire, cliquez sur "Valider", le formulaire se vide automatiquement, vous pouvez en ajouter un autre immédiatement.

**Q : Les filtres fonctionnent-ils en temps réel ?**
R : Oui ! Dès que vous tapez ou changez un filtre, le tableau se met à jour automatiquement.

---

**Fin du guide** 📚
