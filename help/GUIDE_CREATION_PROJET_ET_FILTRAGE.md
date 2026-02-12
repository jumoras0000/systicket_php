# Guide : Création de Projet et Filtrage du Tableau

Ce guide explique ligne par ligne comment fonctionne la création d'un projet, son insertion dans le tableau et le filtrage.

---

## 📋 Fichiers concernés

1. **`js/forms-validation.js`** - Validation du formulaire et insertion dans le tableau
2. **`js/list-filters.js`** - Filtrage du tableau

---

## 🔍 Partie 1 : Création et Insertion d'un Projet (`forms-validation.js`)

### Vue d'ensemble

Quand vous remplissez le formulaire de création de projet et cliquez sur "Valider", voici ce qui se passe :

1. Le formulaire est validé
2. Les données sont récupérées
3. Le projet est sauvegardé
4. Le projet est ajouté directement dans le tableau

---

### Explication ligne par ligne

#### Section 1 : Fonction `addProjectToTable()` - Ajouter le projet au tableau

```javascript
function addProjectToTable(project) {
```

**Ligne 62** : Définit une fonction appelée `addProjectToTable` qui prend un paramètre `project` (les informations du projet).

**Explication simple** : C'est comme une boîte qui reçoit les informations du projet et les ajoute au tableau.

---

```javascript
    var page = document.body.getAttribute('data-page');
    if (page !== 'projets') return;
```

**Lignes 63-64** : 
- `document.body.getAttribute('data-page')` cherche l'attribut `data-page` dans le `<body>` de la page HTML
- Si la page n'est pas "projets", la fonction s'arrête (`return`)

**Explication simple** : On vérifie qu'on est bien sur la page "projets". Si on est sur une autre page, on ne fait rien.

---

```javascript
    var tbody = document.querySelector('.table tbody');
    if (!tbody) return;
```

**Lignes 66-67** :
- `document.querySelector('.table tbody')` cherche le tableau dans la page HTML
- `tbody` est la partie du tableau qui contient les lignes
- Si le tableau n'existe pas (`!tbody`), la fonction s'arrête

**Explication simple** : On trouve le tableau. S'il n'existe pas, on s'arrête.

---

```javascript
    var existingRow = tbody.querySelector('[data-project-id="' + project._id + '"]');
    if (existingRow) return;
```

**Lignes 69-70** :
- Cherche si une ligne avec cet ID de projet existe déjà dans le tableau
- `project._id` est le numéro unique du projet
- Si la ligne existe déjà (`existingRow`), on s'arrête pour éviter les doublons

**Explication simple** : On vérifie si le projet n'est pas déjà dans le tableau. S'il y est déjà, on ne l'ajoute pas deux fois.

---

```javascript
    var tr = document.createElement('tr');
```

**Ligne 73** : Crée un nouvel élément HTML `<tr>` (une ligne de tableau).

**Explication simple** : On crée une nouvelle ligne vide pour le tableau.

---

```javascript
    tr.className = 'project-row';
    tr.setAttribute('data-project-id', project._id);
    tr.setAttribute('data-client', project.client || '');
    tr.setAttribute('data-status', project.status || 'active');
    tr.setAttribute('data-systicket-injected', '1');
```

**Lignes 74-77** :
- `tr.className = 'project-row'` : Donne la classe CSS "project-row" à la ligne
- `setAttribute('data-project-id', ...)` : Ajoute un attribut avec l'ID du projet
- `setAttribute('data-client', ...)` : Ajoute un attribut avec l'ID du client
- `setAttribute('data-status', ...)` : Ajoute un attribut avec le statut (actif, en pause, terminé)
- `setAttribute('data-systicket-injected', '1')` : Marque cette ligne comme ajoutée par JavaScript

**Explication simple** : On ajoute des informations à la ligne pour pouvoir la reconnaître et la filtrer plus tard.

---

```javascript
    var statusClass = project.status === 'paused' ? 'badge-warning' : (project.status === 'completed' ? 'badge-info' : 'badge-success');
    var statusText = project.status === 'paused' ? 'En pause' : (project.status === 'completed' ? 'Terminé' : 'Actif');
```

**Lignes 80-81** :
- Si le statut est "paused", on utilise la classe "badge-warning" et le texte "En pause"
- Si le statut est "completed", on utilise la classe "badge-info" et le texte "Terminé"
- Sinon, on utilise "badge-success" et "Actif"

**Explication simple** : On choisit la couleur et le texte à afficher selon le statut du projet.

---

```javascript
    var clientName = '—';
    if (project.client) {
        if (project.client === '1') clientName = 'Acme Corp';
        else if (project.client === '2') clientName = 'Tech Solutions';
        else if (project.client === '3') clientName = 'Design Studio';
        else {
            if (window.AppData) {
                var clients = AppData.get('clients') || [];
                var client = clients.find(function(c) {
                    return String(c._id) === String(project.client) || String(c.name) === String(project.client);
                });
                if (client) {
                    clientName = client.name || '—';
                }
            }
        }
    }
```

**Lignes 84-101** :
- Par défaut, `clientName = '—'` (aucun client)
- Si le projet a un client (`project.client` existe) :
  - Si c'est "1", le client est "Acme Corp"
  - Si c'est "2", le client est "Tech Solutions"
  - Si c'est "3", le client est "Design Studio"
  - Sinon, on cherche dans la liste des clients dynamiques (ceux créés par l'utilisateur)

**Explication simple** : On trouve le nom du client à partir de son numéro. Si c'est un client créé dynamiquement, on le cherche dans la liste.

---

```javascript
    var projectTickets = 0;
    if (window.AppData) {
        var tickets = AppData.get('tickets') || [];
        projectTickets = tickets.filter(function(t) {
            return String(t.project) === String(project._id) || String(t.project) === project.name;
        }).length;
    }
```

**Lignes 103-110** :
- `projectTickets = 0` : Par défaut, 0 ticket
- Si `AppData` existe, on récupère tous les tickets
- `filter()` garde seulement les tickets qui appartiennent à ce projet
- `.length` compte combien il y en a

**Explication simple** : On compte combien de tickets appartiennent à ce projet.

---

```javascript
    var projectHours = 0;
    if (window.AppData) {
        var temps = AppData.get('temps') || [];
        temps.forEach(function(t) {
            if (String(t.project) === String(project._id) || String(t.project) === project.name) {
                projectHours += parseFloat(t.hours) || 0;
            }
        });
    }
```

**Lignes 112-121** :
- `projectHours = 0` : Par défaut, 0 heure
- On récupère toutes les entrées de temps
- `forEach()` parcourt chaque entrée
- Si l'entrée appartient à ce projet, on additionne les heures (`+=`)

**Explication simple** : On additionne toutes les heures travaillées sur ce projet.

---

```javascript
    var totalHours = 0;
    if (window.AppData) {
        var contrats = AppData.get('contrats') || [];
        var contract = contrats.find(function(c) {
            return String(c.project) === String(project._id) || String(c.project) === project.name;
        });
        totalHours = contract ? (parseFloat(contract.hours) || 0) : 0;
    }
```

**Lignes 123-131** :
- `totalHours = 0` : Par défaut, 0 heure totale
- On récupère tous les contrats
- `find()` cherche le contrat qui correspond à ce projet
- Si un contrat existe, on prend le nombre d'heures prévues

**Explication simple** : On trouve le contrat du projet pour savoir combien d'heures sont prévues.

---

```javascript
    var hoursDisplay = totalHours > 0 ? projectHours + 'h / ' + totalHours + 'h' : (projectHours > 0 ? projectHours + 'h' : '0h / 0h');
```

**Ligne 133** :
- Si `totalHours > 0` : Affiche "10h / 100h" (heures travaillées / heures totales)
- Sinon, si `projectHours > 0` : Affiche "10h" (seulement les heures travaillées)
- Sinon : Affiche "0h / 0h"

**Explication simple** : On crée le texte à afficher pour les heures.

---

```javascript
    var progressPercent = totalHours > 0 ? Math.round((projectHours / totalHours) * 100) : 0;
```

**Ligne 136** :
- Si `totalHours > 0` : Calcule le pourcentage (heures travaillées ÷ heures totales × 100)
- `Math.round()` arrondit le résultat
- Sinon : 0%

**Explication simple** : On calcule le pourcentage de progression du projet.

---

```javascript
    tr.innerHTML = '<td><a href="projet-detail.html?id=' + project._id + '">' + (project.name || '') + '</a></td><td>' + clientName + '</td><td><span class="badge ' + statusClass + '">' + statusText + '</span></td><td>' + projectTickets + '</td><td>' + hoursDisplay + '</td><td>' + progressPercent + '%</td><td><a href="projet-detail.html?id=' + project._id + '">Voir</a></td>';
```

**Ligne 138** :
- `innerHTML` remplit la ligne avec du HTML
- Chaque `<td>` est une colonne :
  1. Nom du projet (lien cliquable)
  2. Nom du client
  3. Statut (badge coloré)
  4. Nombre de tickets
  5. Heures (affichage formaté)
  6. Pourcentage de progression
  7. Lien "Voir"

**Explication simple** : On remplit la ligne avec toutes les informations du projet.

---

```javascript
    var emptyRow = tbody.querySelector('.table-empty-row');
    if (emptyRow) {
        emptyRow.remove();
    }
```

**Lignes 140-143** :
- Cherche la ligne qui affiche "Aucun projet"
- Si elle existe, on la supprime

**Explication simple** : On enlève le message "Aucun projet" car on va ajouter un projet.

---

```javascript
    tbody.appendChild(tr);
```

**Ligne 146** : Ajoute la nouvelle ligne à la fin du tableau.

**Explication simple** : On ajoute la ligne au tableau, elle apparaît maintenant à l'écran.

---

#### Section 2 : Fonction `saveData()` - Sauvegarder le projet

```javascript
function saveData(form, data) {
    if (!window.AppData) return;

    data._id = Date.now();
```

**Lignes 150-152** :
- `saveData` prend le formulaire et les données
- Si `AppData` n'existe pas, on s'arrête
- `Date.now()` donne un numéro unique au projet (timestamp)

**Explication simple** : On donne un numéro unique au projet pour pouvoir l'identifier.

---

```javascript
    } else if (form.querySelector('#project-name')) {
        AppData.add('projets', data);
        addProjectToTable(data);
    }
```

**Lignes 163-165** :
- Si le formulaire contient `#project-name`, c'est un formulaire de projet
- `AppData.add('projets', data)` sauvegarde le projet dans la mémoire
- `addProjectToTable(data)` ajoute immédiatement le projet au tableau

**Explication simple** : On sauvegarde le projet et on l'ajoute directement au tableau.

---

#### Section 3 : Fonction `initForm()` - Gérer la soumission du formulaire

```javascript
form.addEventListener('submit', function(e) {
    e.preventDefault();
```

**Lignes 189-190** :
- `addEventListener('submit')` écoute quand vous cliquez sur "Valider"
- `e.preventDefault()` empêche la page de se recharger

**Explication simple** : On intercepte le clic sur "Valider" et on empêche le rechargement de la page.

---

```javascript
    if (!validate(form)) {
        return false;
    }
```

**Lignes 192-194** : Si la validation échoue, on s'arrête.

**Explication simple** : On vérifie que tous les champs obligatoires sont remplis.

---

```javascript
    var formData = new FormData(form);
    var data = {};
    var assignees = [];

    formData.forEach(function(value, key) {
        if (key.indexOf('assignees') !== -1 && value) {
            assignees.push(value);
        } else {
            data[key] = value;
        }
    });
```

**Lignes 196-205** :
- `FormData` récupère toutes les données du formulaire
- `data = {}` crée un objet vide pour stocker les données
- `assignees = []` crée un tableau vide pour les collaborateurs assignés
- `forEach` parcourt chaque champ du formulaire
- Si le champ contient "assignees", on l'ajoute au tableau `assignees`
- Sinon, on l'ajoute à `data`

**Explication simple** : On récupère toutes les informations du formulaire et on les organise.

---

```javascript
    if (assignees.length > 0) {
        data.assignees = assignees;
    }

    saveData(form, data);
```

**Lignes 207-210** :
- Si des collaborateurs ont été sélectionnés, on les ajoute à `data`
- `saveData()` sauvegarde le projet et l'ajoute au tableau

**Explication simple** : On ajoute les collaborateurs au projet et on sauvegarde tout.

---

```javascript
    if (form.querySelector('#project-name')) {
        form.reset();
    }
```

**Lignes 212-214** : Si c'est un projet, on vide le formulaire pour en ajouter un autre.

**Explication simple** : Le formulaire se vide automatiquement après validation.

---

## 🔍 Partie 2 : Filtrage du Tableau (`list-filters.js`)

### Vue d'ensemble

Le filtrage permet de :
- Rechercher un projet par son nom
- Filtrer par client
- Filtrer par statut

---

### Explication ligne par ligne

#### Section 1 : Fonction `filterTable()` - Filtrer les lignes

```javascript
function filterTable() {
    var table = document.querySelector('.table');
    if (!table) return;

    var tbody = table.querySelector('tbody');
    if (!tbody) return;
```

**Lignes 6-10** :
- Trouve le tableau dans la page
- Trouve la partie `tbody` (les lignes du tableau)
- Si le tableau n'existe pas, on s'arrête

**Explication simple** : On trouve le tableau à filtrer.

---

```javascript
    var rows = tbody.querySelectorAll('tr.ticket-row, tr.project-row, tr.client-row, tr.contrat-row, tr.time-row');
    var searchInput = document.querySelector('.search-input');
    var selects = document.querySelectorAll('select[data-filter]');
```

**Lignes 13-15** :
- `rows` : Trouve toutes les lignes du tableau (projets, tickets, clients, etc.)
- `searchInput` : Trouve la barre de recherche
- `selects` : Trouve tous les menus déroulants de filtrage

**Explication simple** : On trouve tous les éléments nécessaires pour filtrer.

---

```javascript
    var searchText = '';
    if (searchInput) {
        searchText = searchInput.value.toLowerCase().trim();
    }
```

**Lignes 19-22** :
- `searchText = ''` : Par défaut, texte vide
- Si la barre de recherche existe, on récupère le texte tapé
- `.toLowerCase()` met tout en minuscules (pour comparer sans tenir compte des majuscules)
- `.trim()` enlève les espaces au début et à la fin

**Explication simple** : On récupère le texte de recherche et on le met en minuscules.

---

```javascript
    var filterValues = {};
    selects.forEach(function(sel) {
        var key = sel.getAttribute('data-filter');
        if (key && sel.value) {
            filterValues[key] = sel.value;
        }
    });
```

**Lignes 26-32** :
- `filterValues = {}` : Crée un objet vide pour stocker les filtres
- `forEach` parcourt chaque menu déroulant
- `getAttribute('data-filter')` récupère le type de filtre (client, statut, etc.)
- Si un filtre est sélectionné, on le sauvegarde dans `filterValues`

**Explication simple** : On récupère tous les filtres sélectionnés (client, statut, etc.).

---

```javascript
    var visibleCount = 0;

    rows.forEach(function(row) {
        var show = true;
```

**Lignes 35-38** :
- `visibleCount = 0` : Compteur de lignes visibles
- `rows.forEach` parcourt chaque ligne du tableau
- `show = true` : Par défaut, on affiche la ligne

**Explication simple** : On va vérifier chaque ligne pour décider si on l'affiche ou non.

---

```javascript
        if (searchText) {
            var rowText = row.textContent.toLowerCase();
            if (rowText.indexOf(searchText) === -1) {
                show = false;
            }
        }
```

**Lignes 41-46** :
- Si un texte de recherche existe :
  - `row.textContent` récupère tout le texte de la ligne
  - `.toLowerCase()` met en minuscules
  - `indexOf(searchText)` cherche si le texte de recherche est dans la ligne
  - Si `indexOf` retourne `-1`, le texte n'est pas trouvé, donc `show = false`

**Explication simple** : Si vous avez tapé "test" dans la recherche, on vérifie si "test" est dans la ligne. Si non, on cache la ligne.

---

```javascript
        for (var key in filterValues) {
            var rowValue = row.getAttribute('data-' + key);
            if (rowValue !== filterValues[key]) {
                show = false;
            }
        }
```

**Lignes 49-54** :
- `for (var key in filterValues)` parcourt chaque filtre sélectionné
- `row.getAttribute('data-' + key)` récupère la valeur de la ligne pour ce filtre
  - Par exemple, si `key = 'client'`, on cherche `data-client`
- Si la valeur de la ligne ne correspond pas au filtre, `show = false`

**Explication simple** : Si vous avez sélectionné "Acme Corp" dans le filtre client, on vérifie si la ligne a `data-client="1"` (qui correspond à Acme Corp). Si non, on cache la ligne.

---

```javascript
        if (show) {
            row.style.display = '';
            visibleCount++;
        } else {
            row.style.display = 'none';
        }
```

**Lignes 57-62** :
- Si `show = true` :
  - `row.style.display = ''` : Affiche la ligne (style normal)
  - `visibleCount++` : Augmente le compteur de lignes visibles
- Sinon :
  - `row.style.display = 'none'` : Cache la ligne

**Explication simple** : On affiche ou cache la ligne selon les critères de filtrage.

---

```javascript
    if (emptyRow) {
        if (visibleCount === 0) {
            emptyRow.style.display = '';
        } else {
            emptyRow.style.display = 'none';
        }
    }
```

**Lignes 66-72** :
- Si une ligne "Aucun résultat" existe :
  - Si aucune ligne n'est visible (`visibleCount === 0`), on affiche "Aucun résultat"
  - Sinon, on cache ce message

**Explication simple** : Si aucun projet ne correspond aux filtres, on affiche "Aucun résultat".

---

```javascript
    if (countEl) {
        countEl.textContent = String(visibleCount);
    }
```

**Lignes 75-77** : Met à jour le compteur qui affiche le nombre de résultats.

**Explication simple** : On affiche combien de projets correspondent aux filtres.

---

#### Section 2 : Fonction `init()` - Initialiser les filtres

```javascript
function init() {
    var searchInput = document.querySelector('.search-input');
    var selects = document.querySelectorAll('select[data-filter]');
```

**Lignes 82-84** : Trouve la barre de recherche et les menus déroulants.

**Explication simple** : On trouve tous les éléments de filtrage.

---

```javascript
    if (searchInput) {
        searchInput.addEventListener('input', filterTable);
    }
```

**Lignes 86-88** :
- Si la barre de recherche existe
- `addEventListener('input')` écoute chaque frappe
- À chaque frappe, on appelle `filterTable()`

**Explication simple** : Dès que vous tapez dans la recherche, le tableau se filtre automatiquement.

---

```javascript
    selects.forEach(function(sel) {
        sel.addEventListener('change', filterTable);
    });
```

**Lignes 91-93** :
- Pour chaque menu déroulant
- `addEventListener('change')` écoute quand vous changez la sélection
- À chaque changement, on appelle `filterTable()`

**Explication simple** : Dès que vous changez un filtre, le tableau se met à jour.

---

```javascript
    filterTable();
```

**Ligne 96** : Applique les filtres au chargement de la page.

**Explication simple** : On filtre le tableau dès le chargement de la page.

---

## 🔄 Résumé du flux complet

### Création d'un projet :

1. **Vous remplissez le formulaire** → `initForm()` écoute le clic sur "Valider"
2. **Validation** → `validate()` vérifie que les champs sont corrects
3. **Récupération des données** → `FormData` récupère toutes les informations
4. **Sauvegarde** → `saveData()` sauvegarde dans `AppData`
5. **Insertion dans le tableau** → `addProjectToTable()` ajoute la ligne directement
6. **Réinitialisation** → Le formulaire se vide pour en ajouter un autre

### Filtrage du tableau :

1. **Vous tapez dans la recherche** → `addEventListener('input')` détecte chaque frappe
2. **Vous changez un filtre** → `addEventListener('change')` détecte le changement
3. **Filtrage** → `filterTable()` parcourt toutes les lignes
4. **Affichage/Cache** → Les lignes sont affichées ou cachées selon les critères
5. **Mise à jour** → Le compteur de résultats est mis à jour

---

## 💡 Points importants à retenir

1. **Insertion directe** : Le projet est ajouté directement dans le tableau sans passer par `app-data.js`
2. **Pas de rechargement** : La page ne se recharge pas, tout se fait en JavaScript
3. **Filtrage en temps réel** : Le tableau se filtre automatiquement à chaque frappe ou changement de filtre
4. **Attributs `data-*`** : Les lignes ont des attributs `data-client`, `data-status` pour pouvoir les filtrer

---

## 🎯 Exemple concret

**Situation** : Vous avez 3 projets dans le tableau :
- Projet A (Client: Acme Corp, Statut: Actif)
- Projet B (Client: Tech Solutions, Statut: En pause)
- Projet C (Client: Acme Corp, Statut: Actif)

**Action 1** : Vous tapez "A" dans la recherche
- Projet A : contient "A" → **AFFICHÉ** ✅
- Projet B : contient "A" → **AFFICHÉ** ✅
- Projet C : contient "A" → **AFFICHÉ** ✅

**Action 2** : Vous sélectionnez "Acme Corp" dans le filtre client
- Projet A : client = "Acme Corp" → **AFFICHÉ** ✅
- Projet B : client = "Tech Solutions" → **CACHÉ** ❌
- Projet C : client = "Acme Corp" → **AFFICHÉ** ✅

**Action 3** : Vous sélectionnez "Actif" dans le filtre statut
- Projet A : statut = "Actif" → **AFFICHÉ** ✅
- Projet B : statut = "En pause" → **CACHÉ** ❌
- Projet C : statut = "Actif" → **AFFICHÉ** ✅

**Résultat final** : Seuls les projets A et C sont affichés (Acme Corp + Actif + contient "A")

---

**Fin du guide** 📚
