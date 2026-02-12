# Explication Ligne par Ligne Détaillée

Ce guide explique chaque ligne de code des fonctions `addProjectToTable` et `filterTable` de manière très simple pour les débutants.

---

## 📋 Partie 1 : Fonction `addProjectToTable` (forms-validation.js, lignes 62-102)

### Ligne 62
```javascript
function addProjectToTable(project) {
```

**Explication** :
- `function` = mot-clé pour créer une fonction (une boîte qui fait quelque chose)
- `addProjectToTable` = nom de la fonction (comme un nom de boîte)
- `(project)` = paramètre (une information qu'on donne à la fonction)
- `{` = début du code de la fonction

**Exemple simple** : C'est comme une machine à laver. Vous mettez des vêtements (`project`) dedans, et elle les lave (ajoute le projet au tableau).

---

### Ligne 63
```javascript
    var page = document.body.getAttribute('data-page');
```

**Explication** :
- `var page` = crée une variable appelée `page` (comme une boîte vide)
- `document.body` = le corps de la page HTML (tout le contenu visible)
- `.getAttribute('data-page')` = cherche la valeur de l'attribut `data-page`
- `=` = met la valeur trouvée dans la variable `page`

**Exemple simple** : C'est comme regarder une étiquette sur une boîte pour savoir ce qu'elle contient. L'étiquette s'appelle `data-page` et contient le nom de la page (comme "projets").

**Valeur possible** : `page = "projets"` ou `page = "tickets"` ou `null` (rien)

---

### Ligne 64
```javascript
    if (page !== 'projets') return;
```

**Explication** :
- `if` = "si" (une condition)
- `page !== 'projets'` = vérifie si `page` n'est PAS égal à "projets"
- `!==` = "n'est pas égal à" (opérateur de comparaison)
- `return;` = arrête la fonction immédiatement (sort de la fonction)

**Exemple simple** : Si vous n'êtes pas sur la page "projets", on arrête tout. C'est comme vérifier que vous êtes dans la bonne pièce avant de commencer à travailler.

**Scénarios** :
- Si `page = "projets"` → on continue ✅
- Si `page = "tickets"` → on s'arrête ❌
- Si `page = null` → on s'arrête ❌

---

### Ligne 66
```javascript
    var tbody = document.querySelector('.table tbody');
```

**Explication** :
- `var tbody` = crée une variable appelée `tbody`
- `document.querySelector()` = cherche un élément dans la page HTML
- `'.table tbody'` = cherche un élément avec la classe `table`, puis à l'intérieur un élément `tbody`
- `.table` = un élément avec la classe CSS "table"
- `tbody` = la partie du tableau qui contient les lignes de données

**Exemple simple** : C'est comme chercher une table dans une pièce. On cherche d'abord la table (`.table`), puis la partie où on met les assiettes (`tbody`).

**Résultat** : `tbody` contient l'élément HTML du tableau, ou `null` si rien n'est trouvé.

---

### Ligne 67
```javascript
    if (!tbody) return;
```

**Explication** :
- `if` = "si"
- `!tbody` = "si tbody n'existe pas" (le `!` signifie "non" ou "pas")
- `return;` = arrête la fonction

**Exemple simple** : Si le tableau n'existe pas, on s'arrête. C'est comme vérifier que la table existe avant d'y mettre des assiettes.

**Scénarios** :
- Si `tbody` existe → on continue ✅
- Si `tbody = null` → on s'arrête ❌

---

### Ligne 70
```javascript
    var existingRow = tbody.querySelector('[data-project-id="' + project._id + '"]');
```

**Explication** :
- `var existingRow` = crée une variable pour stocker une ligne existante
- `tbody.querySelector()` = cherche dans le tableau (`tbody`)
- `'[data-project-id="' + project._id + '"]'` = cherche un élément avec l'attribut `data-project-id` égal à l'ID du projet
- `project._id` = le numéro unique du projet (comme un numéro de série)
- `+` = concatène (colle) les morceaux de texte ensemble

**Exemple simple** : On cherche si une ligne avec ce numéro de projet existe déjà. C'est comme vérifier si un livre avec ce numéro est déjà dans la bibliothèque.

**Exemple concret** :
- Si `project._id = 1234567890`
- On cherche : `[data-project-id="1234567890"]`
- Si trouvé → `existingRow` contient la ligne
- Si pas trouvé → `existingRow = null`

---

### Ligne 71
```javascript
    if (existingRow) return;
```

**Explication** :
- `if (existingRow)` = "si existingRow existe" (si une ligne a été trouvée)
- `return;` = arrête la fonction

**Exemple simple** : Si le projet est déjà dans le tableau, on ne l'ajoute pas deux fois. C'est comme vérifier qu'on ne met pas deux fois le même livre dans la bibliothèque.

**Scénarios** :
- Si `existingRow` existe → on s'arrête (déjà présent) ❌
- Si `existingRow = null` → on continue (pas encore présent) ✅

---

### Ligne 73
```javascript
    var tr = document.createElement('tr');
```

**Explication** :
- `var tr` = crée une variable appelée `tr`
- `document.createElement()` = crée un nouvel élément HTML
- `'tr'` = type d'élément à créer (une ligne de tableau)

**Exemple simple** : On crée une nouvelle ligne vide pour le tableau. C'est comme prendre une feuille de papier vierge pour écrire une nouvelle ligne.

**Résultat** : `tr` est un élément HTML `<tr></tr>` vide, prêt à être rempli.

---

### Ligne 74
```javascript
    tr.className = 'project-row';
```

**Explication** :
- `tr.className` = la classe CSS de l'élément `tr`
- `=` = assigne (donne) une valeur
- `'project-row'` = le nom de la classe CSS

**Exemple simple** : On donne un nom à la ligne pour pouvoir la reconnaître et la styliser. C'est comme mettre une étiquette "PROJET" sur la ligne.

**Utilité** : Cette classe permet au CSS de styliser la ligne et au JavaScript de la trouver facilement.

---

### Ligne 75
```javascript
    tr.setAttribute('data-project-id', project._id);
```

**Explication** :
- `tr.setAttribute()` = ajoute un attribut à l'élément HTML
- `'data-project-id'` = nom de l'attribut
- `project._id` = valeur de l'attribut (l'ID du projet)

**Exemple simple** : On ajoute un numéro d'identification à la ligne. C'est comme mettre un numéro de série sur un produit.

**Résultat HTML** : La ligne aura `<tr data-project-id="1234567890">`

**Utilité** : Permet de retrouver cette ligne plus tard et de vérifier les doublons.

---

### Ligne 76
```javascript
    tr.setAttribute('data-client', project.client || '');
```

**Explication** :
- `tr.setAttribute('data-client', ...)` = ajoute un attribut avec l'ID du client
- `project.client` = l'ID du client du projet
- `||` = "ou" (opérateur logique)
- `''` = chaîne vide (si pas de client)

**Exemple simple** : On ajoute l'ID du client à la ligne. Si le projet n'a pas de client, on met une chaîne vide.

**Exemple concret** :
- Si `project.client = "1"` → attribut = `data-client="1"`
- Si `project.client = null` → attribut = `data-client=""`

**Utilité** : Permet de filtrer les projets par client plus tard.

---

### Ligne 77
```javascript
    tr.setAttribute('data-status', project.status || 'active');
```

**Explication** :
- `tr.setAttribute('data-status', ...)` = ajoute un attribut avec le statut
- `project.status` = le statut du projet
- `|| 'active'` = si pas de statut, utilise "active" par défaut

**Exemple simple** : On ajoute le statut du projet. Si aucun statut n'est défini, on met "active" par défaut.

**Exemple concret** :
- Si `project.status = "paused"` → attribut = `data-status="paused"`
- Si `project.status = null` → attribut = `data-status="active"` (par défaut)

**Utilité** : Permet de filtrer les projets par statut (actif, en pause, terminé).

---

### Ligne 78
```javascript
    tr.setAttribute('data-systicket-injected', '1');
```

**Explication** :
- `tr.setAttribute('data-systicket-injected', '1')` = ajoute un attribut spécial
- `'data-systicket-injected'` = nom de l'attribut
- `'1'` = valeur (signifie "ajouté par JavaScript")

**Explication simple** : On marque cette ligne comme "ajoutée par JavaScript". C'est comme mettre un tampon "AJOUTÉ PAR ORDINATEUR" sur un document.

**Utilité** : Permet de distinguer les lignes ajoutées dynamiquement des lignes statiques du HTML, et de les supprimer facilement si nécessaire.

---

### Ligne 80
```javascript
    var statusClass = project.status === 'paused' ? 'badge-warning' : (project.status === 'completed' ? 'badge-info' : 'badge-success');
```

**Explication** :
- `var statusClass` = crée une variable pour la classe CSS du badge
- `project.status === 'paused'` = vérifie si le statut est "paused"
- `?` = "alors" (opérateur ternaire)
- `'badge-warning'` = classe CSS pour "en pause" (couleur orange/jaune)
- `:` = "sinon"
- `(project.status === 'completed' ? 'badge-info' : 'badge-success')` = autre condition imbriquée
- `'badge-info'` = classe CSS pour "terminé" (couleur bleue)
- `'badge-success'` = classe CSS pour "actif" (couleur verte)

**Exemple simple** : On choisit la couleur du badge selon le statut. C'est comme choisir un feutre de couleur selon l'état du projet.

**Logique** :
1. Si statut = "paused" → classe = "badge-warning" (orange)
2. Sinon, si statut = "completed" → classe = "badge-info" (bleu)
3. Sinon → classe = "badge-success" (vert)

**Exemple concret** :
- Projet en pause → badge orange
- Projet terminé → badge bleu
- Projet actif → badge vert

---

### Ligne 81
```javascript
    var statusText = project.status === 'paused' ? 'En pause' : (project.status === 'completed' ? 'Terminé' : 'Actif');
```

**Explication** :
- `var statusText` = crée une variable pour le texte à afficher
- Même logique que la ligne précédente, mais pour le texte au lieu de la classe CSS

**Exemple simple** : On choisit le texte à afficher selon le statut. C'est comme traduire le statut en français.

**Résultats** :
- Si statut = "paused" → texte = "En pause"
- Si statut = "completed" → texte = "Terminé"
- Sinon → texte = "Actif"

---

### Ligne 84
```javascript
    var clientName = '—';
```

**Explication** :
- `var clientName` = crée une variable pour le nom du client
- `'—'` = tiret long (caractère spécial pour "aucun" ou "non défini")

**Exemple simple** : On commence avec "—" par défaut, comme si on disait "pas de client".

---

### Ligne 85
```javascript
    if (project.client) {
```

**Explication** :
- `if (project.client)` = "si le projet a un client"
- Si `project.client` existe et n'est pas vide, on entre dans le bloc

**Exemple simple** : On vérifie si le projet a un client. Si oui, on va chercher son nom.

**Scénarios** :
- Si `project.client = "1"` → on entre dans le bloc ✅
- Si `project.client = null` → on saute le bloc ❌
- Si `project.client = ""` → on saute le bloc ❌

---

### Ligne 86
```javascript
        if (project.client === '1') clientName = 'Acme Corp';
```

**Explication** :
- `if (project.client === '1')` = "si l'ID du client est '1'"
- `===` = comparaison stricte (vérifie la valeur ET le type)
- `clientName = 'Acme Corp'` = met le nom "Acme Corp" dans la variable

**Exemple simple** : Si le client a le numéro 1, c'est "Acme Corp". C'est comme un annuaire : numéro 1 = Acme Corp.

---

### Ligne 87
```javascript
        else if (project.client === '2') clientName = 'Tech Solutions';
```

**Explication** :
- `else if` = "sinon, si"
- Si le client n'est pas "1", on vérifie s'il est "2"
- Si oui, on met "Tech Solutions"

**Exemple simple** : Si ce n'est pas le client 1, on vérifie s'il est le client 2.

---

### Ligne 88
```javascript
        else if (project.client === '3') clientName = 'Design Studio';
```

**Explication** :
- Même logique que précédemment
- Si le client est "3", on met "Design Studio"

**Exemple simple** : Si ce n'est ni 1 ni 2, on vérifie s'il est 3.

---

### Ligne 89
```javascript
        else {
```

**Explication** :
- `else` = "sinon" (si aucun des cas précédents)
- Si le client n'est ni "1", ni "2", ni "3", on entre dans ce bloc

**Exemple simple** : Si le client n'est pas un des 3 clients statiques, c'est un client créé dynamiquement.

---

### Ligne 91
```javascript
            if (window.AppData) {
```

**Explication** :
- `if (window.AppData)` = "si AppData existe"
- `window.AppData` = l'objet qui stocke les données de l'application
- On vérifie qu'il existe avant de l'utiliser

**Exemple simple** : On vérifie que la boîte à données existe avant d'y chercher quelque chose.

**Scénarios** :
- Si `AppData` existe → on continue ✅
- Si `AppData` n'existe pas → on saute le bloc ❌

---

### Ligne 92
```javascript
                var clients = AppData.get('clients') || [];
```

**Explication** :
- `var clients` = crée une variable pour la liste des clients
- `AppData.get('clients')` = récupère la liste des clients depuis AppData
- `|| []` = si rien n'est trouvé, utilise un tableau vide

**Exemple simple** : On récupère la liste de tous les clients. Si la liste n'existe pas, on prend une liste vide.

**Résultat** : `clients` est un tableau contenant tous les clients, ou un tableau vide `[]`.

---

### Ligne 93
```javascript
                var client = clients.find(function(c) {
```

**Explication** :
- `var client` = crée une variable pour le client trouvé
- `clients.find()` = cherche dans le tableau `clients`
- `function(c)` = fonction qui sera appelée pour chaque client `c` du tableau

**Exemple simple** : On cherche dans la liste des clients. On va regarder chaque client un par un.

---

### Ligne 94
```javascript
                    return String(c._id) === String(project.client) || String(c.name) === String(project.client);
```

**Explication** :
- `return` = retourne `true` si la condition est vraie
- `String(c._id)` = convertit l'ID du client en texte
- `===` = comparaison stricte
- `String(project.client)` = convertit l'ID du projet en texte
- `||` = "ou"
- `String(c.name) === String(project.client)` = compare aussi avec le nom

**Exemple simple** : On vérifie si ce client correspond au projet. On compare soit l'ID, soit le nom.

**Logique** :
- Si l'ID du client = l'ID du projet → trouvé ✅
- OU si le nom du client = l'ID du projet → trouvé ✅
- Sinon → pas trouvé ❌

---

### Ligne 95
```javascript
                });
```

**Explication** :
- `});` = ferme la fonction `find()` et le bloc `if`

**Exemple simple** : On termine la recherche.

**Résultat** : `client` contient le client trouvé, ou `undefined` si rien n'est trouvé.

---

### Ligne 96
```javascript
                if (client) {
```

**Explication** :
- `if (client)` = "si un client a été trouvé"

**Exemple simple** : Si on a trouvé le client, on utilise son nom.

---

### Ligne 97
```javascript
                    clientName = client.name || '—';
```

**Explication** :
- `clientName =` = met à jour la variable `clientName`
- `client.name` = le nom du client trouvé
- `|| '—'` = si le nom n'existe pas, utilise "—"

**Exemple simple** : On prend le nom du client trouvé. S'il n'a pas de nom, on met "—".

**Résultat** : `clientName` contient maintenant le nom du client ou "—".

---

### Lignes 98-101
```javascript
                }
            }
        }
    }
```

**Explication** :
- Ces lignes ferment tous les blocs `if` et `else` ouverts précédemment

**Exemple simple** : On termine toutes les vérifications. Maintenant `clientName` contient le bon nom du client.

---

## 📋 Partie 2 : Fonction `filterTable` (list-filters.js, lignes 6-79)

### Ligne 6
```javascript
function filterTable() {
```

**Explication** :
- `function` = mot-clé pour créer une fonction
- `filterTable` = nom de la fonction
- `()` = pas de paramètre (la fonction ne reçoit rien)
- `{` = début du code

**Exemple simple** : C'est une machine qui filtre le tableau. Elle ne reçoit rien en entrée, elle lit directement ce qui est dans la page.

---

### Ligne 7
```javascript
    var table = document.querySelector('.table');
```

**Explication** :
- `var table` = crée une variable pour le tableau
- `document.querySelector('.table')` = cherche un élément avec la classe CSS "table"
- `.table` = la classe CSS (le point signifie "classe")

**Exemple simple** : On cherche le tableau dans la page. C'est comme chercher une table dans une pièce.

**Résultat** : `table` contient l'élément HTML du tableau, ou `null` si rien n'est trouvé.

---

### Ligne 8
```javascript
    if (!table) return;
```

**Explication** :
- `if (!table)` = "si le tableau n'existe pas"
- `!` = "non" ou "pas"
- `return;` = arrête la fonction

**Exemple simple** : Si le tableau n'existe pas, on s'arrête. Pas besoin de filtrer quelque chose qui n'existe pas.

---

### Ligne 10
```javascript
    var tbody = table.querySelector('tbody');
```

**Explication** :
- `var tbody` = crée une variable pour la partie du tableau
- `table.querySelector('tbody')` = cherche `tbody` à l'intérieur du tableau trouvé
- `tbody` = la partie du tableau qui contient les lignes de données

**Exemple simple** : On cherche la partie du tableau qui contient les lignes. C'est comme chercher le tiroir d'une table.

**Résultat** : `tbody` contient l'élément `tbody`, ou `null`.

---

### Ligne 11
```javascript
    if (!tbody) return;
```

**Explication** :
- Même logique que ligne 8
- Si `tbody` n'existe pas, on s'arrête

**Exemple simple** : Si le tiroir n'existe pas, on s'arrête.

---

### Ligne 13
```javascript
    var rows = tbody.querySelectorAll('tr.ticket-row, tr.project-row, tr.client-row, tr.contrat-row, tr.time-row');
```

**Explication** :
- `var rows` = crée une variable pour toutes les lignes
- `tbody.querySelectorAll()` = cherche TOUS les éléments correspondants
- `'tr.ticket-row, tr.project-row, ...'` = cherche des lignes (`tr`) avec différentes classes
- `,` = séparateur (cherche l'un OU l'autre)

**Exemple simple** : On trouve toutes les lignes du tableau, peu importe leur type (projets, tickets, clients, etc.).

**Résultat** : `rows` est une liste (NodeList) contenant toutes les lignes trouvées.

**Exemple concret** : Si le tableau a 5 projets, `rows` contient 5 éléments.

---

### Ligne 14
```javascript
    var searchInput = document.querySelector('.search-input');
```

**Explication** :
- `var searchInput` = crée une variable pour la barre de recherche
- `document.querySelector('.search-input')` = cherche un élément avec la classe "search-input"
- `.search-input` = la classe CSS de la barre de recherche

**Exemple simple** : On trouve la barre de recherche dans la page. C'est comme trouver la boîte où on tape pour chercher.

**Résultat** : `searchInput` contient l'élément de la barre de recherche, ou `null`.

---

### Ligne 15
```javascript
    var selects = document.querySelectorAll('select[data-filter]');
```

**Explication** :
- `var selects` = crée une variable pour les menus déroulants
- `document.querySelectorAll()` = cherche TOUS les éléments correspondants
- `'select[data-filter]'` = cherche des éléments `<select>` qui ont l'attribut `data-filter`
- `select` = type d'élément (menu déroulant)
- `[data-filter]` = qui a l'attribut `data-filter`

**Exemple simple** : On trouve tous les menus déroulants de filtrage (client, statut, etc.).

**Résultat** : `selects` est une liste contenant tous les menus de filtrage.

**Exemple concret** : Si la page a 2 filtres (client et statut), `selects` contient 2 éléments.

---

### Ligne 16
```javascript
    var emptyRow = tbody.querySelector('.table-empty-row, tr.table-empty');
```

**Explication** :
- `var emptyRow` = crée une variable pour la ligne "aucun résultat"
- `tbody.querySelector()` = cherche dans le tableau
- `'.table-empty-row, tr.table-empty'` = cherche soit un élément avec la classe "table-empty-row", soit un `<tr>` avec la classe "table-empty"
- `,` = séparateur (cherche l'un OU l'autre)

**Exemple simple** : On trouve la ligne qui affiche "Aucun projet" ou "Aucun résultat".

**Résultat** : `emptyRow` contient cette ligne, ou `null` si elle n'existe pas.

---

### Ligne 17
```javascript
    var countEl = document.querySelector('.list-results-count strong');
```

**Explication** :
- `var countEl` = crée une variable pour l'élément qui affiche le nombre de résultats
- `document.querySelector('.list-results-count strong')` = cherche un élément `<strong>` à l'intérieur d'un élément avec la classe "list-results-count"
- `.list-results-count` = la classe du conteneur
- `strong` = l'élément qui affiche le nombre (en gras)

**Exemple simple** : On trouve l'endroit où on affiche "5 résultats" par exemple.

**Résultat** : `countEl` contient cet élément, ou `null`.

---

### Ligne 20
```javascript
    var searchText = '';
```

**Explication** :
- `var searchText` = crée une variable pour le texte de recherche
- `''` = chaîne vide (par défaut, rien n'est recherché)

**Exemple simple** : On commence avec un texte de recherche vide.

---

### Ligne 21
```javascript
    if (searchInput) {
```

**Explication** :
- `if (searchInput)` = "si la barre de recherche existe"

**Exemple simple** : On vérifie que la barre de recherche existe avant de l'utiliser.

---

### Ligne 22
```javascript
        searchText = searchInput.value.toLowerCase().trim();
```

**Explication** :
- `searchText =` = met à jour la variable
- `searchInput.value` = récupère le texte tapé dans la barre de recherche
- `.toLowerCase()` = met tout le texte en minuscules
- `.trim()` = enlève les espaces au début et à la fin

**Exemple simple** : On récupère le texte tapé, on le met en minuscules et on enlève les espaces inutiles.

**Exemple concret** :
- Si vous tapez "  TEST  " → `searchText = "test"`
- Si vous tapez "Projet A" → `searchText = "projet a"`

**Pourquoi** : Pour comparer sans tenir compte des majuscules/minuscules et des espaces.

---

### Ligne 26
```javascript
    var filterValues = {};
```

**Explication** :
- `var filterValues` = crée une variable pour stocker les filtres
- `{}` = objet vide (comme un dictionnaire vide)

**Exemple simple** : On crée une boîte vide pour mettre les filtres sélectionnés.

**Exemple concret** : `filterValues` pourrait contenir `{ client: "1", status: "active" }`

---

### Ligne 27
```javascript
    selects.forEach(function(sel) {
```

**Explication** :
- `selects.forEach()` = parcourt chaque menu déroulant dans la liste
- `function(sel)` = fonction appelée pour chaque menu `sel`

**Exemple simple** : On regarde chaque menu de filtrage un par un.

---

### Ligne 28
```javascript
        var key = sel.getAttribute('data-filter');
```

**Explication** :
- `var key` = crée une variable pour le type de filtre
- `sel.getAttribute('data-filter')` = récupère la valeur de l'attribut `data-filter`
- `data-filter` = l'attribut qui indique le type de filtre (client, status, etc.)

**Exemple simple** : On récupère le type de filtre. C'est comme lire l'étiquette sur un filtre.

**Exemple concret** :
- Si le filtre est pour le client → `key = "client"`
- Si le filtre est pour le statut → `key = "status"`

---

### Ligne 29
```javascript
        if (key && sel.value) {
```

**Explication** :
- `if (key && sel.value)` = "si le type existe ET qu'une valeur est sélectionnée"
- `&&` = "et" (les deux conditions doivent être vraies)
- `sel.value` = la valeur sélectionnée dans le menu

**Exemple simple** : On vérifie que le filtre a un type ET qu'une option est sélectionnée.

**Scénarios** :
- Si `key = "client"` ET `sel.value = "1"` → on entre dans le bloc ✅
- Si `key = "client"` ET `sel.value = ""` → on saute le bloc ❌

---

### Ligne 30
```javascript
            filterValues[key] = sel.value;
```

**Explication** :
- `filterValues[key]` = crée ou met à jour une propriété dans l'objet
- `sel.value` = la valeur sélectionnée

**Exemple simple** : On sauvegarde le filtre sélectionné dans notre boîte.

**Exemple concret** :
- Si `key = "client"` et `sel.value = "1"`
- Alors `filterValues = { client: "1" }`

---

### Ligne 35
```javascript
    var visibleCount = 0;
```

**Explication** :
- `var visibleCount` = crée une variable compteur
- `0` = valeur initiale (aucune ligne visible pour l'instant)

**Exemple simple** : On crée un compteur qui commence à zéro. On va compter combien de lignes sont visibles.

---

### Ligne 38
```javascript
    rows.forEach(function(row) {
```

**Explication** :
- `rows.forEach()` = parcourt chaque ligne du tableau
- `function(row)` = fonction appelée pour chaque ligne `row`

**Exemple simple** : On regarde chaque ligne une par une pour décider si on l'affiche ou non.

---

### Ligne 39
```javascript
        var show = true;
```

**Explication** :
- `var show` = crée une variable booléenne (vrai/faux)
- `true` = vrai (par défaut, on affiche la ligne)

**Exemple simple** : On commence en disant "on affiche cette ligne". Si elle ne correspond pas aux critères, on changera à `false`.

---

### Ligne 42
```javascript
        if (searchText) {
```

**Explication** :
- `if (searchText)` = "si un texte de recherche existe"
- Si `searchText` n'est pas vide, on entre dans le bloc

**Exemple simple** : Si vous avez tapé quelque chose dans la recherche, on vérifie si la ligne correspond.

---

### Ligne 43
```javascript
            var rowText = row.textContent.toLowerCase();
```

**Explication** :
- `var rowText` = crée une variable pour le texte de la ligne
- `row.textContent` = récupère tout le texte visible dans la ligne
- `.toLowerCase()` = met tout en minuscules

**Exemple simple** : On récupère tout le texte de la ligne et on le met en minuscules pour comparer.

**Exemple concret** :
- Si la ligne contient "Projet A - Acme Corp - Actif"
- Alors `rowText = "projet a - acme corp - actif"`

---

### Ligne 44
```javascript
            if (rowText.indexOf(searchText) === -1) {
```

**Explication** :
- `if (rowText.indexOf(searchText) === -1)` = "si le texte de recherche n'est PAS dans la ligne"
- `indexOf()` = cherche la position du texte dans la chaîne
- Si trouvé → retourne la position (0, 1, 2, etc.)
- Si pas trouvé → retourne `-1`
- `=== -1` = vérifie si c'est égal à -1 (pas trouvé)

**Exemple simple** : On vérifie si le texte recherché est dans la ligne. Si ce n'est pas le cas, on cache la ligne.

**Exemple concret** :
- Si `searchText = "test"` et `rowText = "projet test"` → `indexOf` retourne 7 (trouvé) → on continue ✅
- Si `searchText = "test"` et `rowText = "projet a"` → `indexOf` retourne -1 (pas trouvé) → on cache ❌

---

### Ligne 45
```javascript
                show = false;
```

**Explication** :
- `show = false` = change la variable à `false` (ne pas afficher)

**Exemple simple** : On décide de ne pas afficher cette ligne car elle ne correspond pas à la recherche.

---

### Ligne 50
```javascript
        for (var key in filterValues) {
```

**Explication** :
- `for (var key in filterValues)` = parcourt chaque filtre dans `filterValues`
- `key` = le nom du filtre (comme "client" ou "status")
- `in` = parcourt les propriétés de l'objet

**Exemple simple** : On regarde chaque filtre sélectionné un par un.

**Exemple concret** :
- Si `filterValues = { client: "1", status: "active" }`
- La boucle s'exécute 2 fois : une fois pour `key = "client"`, une fois pour `key = "status"`

---

### Ligne 51
```javascript
            var rowValue = row.getAttribute('data-' + key);
```

**Explication** :
- `var rowValue` = crée une variable pour la valeur de la ligne
- `row.getAttribute()` = récupère un attribut de la ligne
- `'data-' + key` = construit le nom de l'attribut
- `+` = concatène (colle) les morceaux

**Exemple simple** : On récupère la valeur de l'attribut correspondant au filtre.

**Exemple concret** :
- Si `key = "client"` → on cherche `data-client`
- Si `key = "status"` → on cherche `data-status`
- Si la ligne a `data-client="1"` → `rowValue = "1"`

---

### Ligne 52
```javascript
            if (rowValue !== filterValues[key]) {
```

**Explication** :
- `if (rowValue !== filterValues[key])` = "si la valeur de la ligne n'est PAS égale au filtre"
- `!==` = "n'est pas égal à" (comparaison stricte)
- `filterValues[key]` = la valeur du filtre sélectionné

**Exemple simple** : On compare la valeur de la ligne avec le filtre. Si elles ne correspondent pas, on cache la ligne.

**Exemple concret** :
- Si `filterValues = { client: "1" }` et `rowValue = "1"` → elles correspondent ✅
- Si `filterValues = { client: "1" }` et `rowValue = "2"` → elles ne correspondent pas ❌

---

### Ligne 53
```javascript
                show = false;
```

**Explication** :
- Même logique que ligne 45
- On décide de ne pas afficher cette ligne

**Exemple simple** : Cette ligne ne correspond pas au filtre, donc on la cache.

---

### Ligne 58
```javascript
        if (show) {
```

**Explication** :
- `if (show)` = "si on doit afficher la ligne"
- Si `show = true`, on entre dans le bloc

**Exemple simple** : Si la ligne correspond à tous les critères, on l'affiche.

---

### Ligne 59
```javascript
            row.style.display = '';
```

**Explication** :
- `row.style.display` = la propriété CSS qui contrôle l'affichage
- `''` = chaîne vide (affiche normalement, style par défaut)

**Exemple simple** : On affiche la ligne normalement. C'est comme enlever un cache qui masquait la ligne.

---

### Ligne 60
```javascript
            visibleCount++;
```

**Explication** :
- `visibleCount++` = augmente le compteur de 1
- `++` = opérateur d'incrémentation (ajoute 1)

**Exemple simple** : On compte cette ligne comme visible. Le compteur augmente de 1.

**Exemple concret** :
- Si `visibleCount = 0` → après cette ligne, `visibleCount = 1`
- Si `visibleCount = 5` → après cette ligne, `visibleCount = 6`

---

### Ligne 61
```javascript
        } else {
```

**Explication** :
- `else` = "sinon" (si `show = false`)

**Exemple simple** : Si on ne doit pas afficher la ligne, on fait autre chose.

---

### Ligne 62
```javascript
            row.style.display = 'none';
```

**Explication** :
- `row.style.display = 'none'` = cache la ligne
- `'none'` = valeur CSS qui cache l'élément

**Exemple simple** : On cache la ligne. Elle existe toujours dans le code, mais elle n'est plus visible à l'écran.

---

### Ligne 67
```javascript
    if (emptyRow) {
```

**Explication** :
- `if (emptyRow)` = "si la ligne 'aucun résultat' existe"

**Exemple simple** : On vérifie que cette ligne existe avant de la modifier.

---

### Ligne 68
```javascript
        if (visibleCount === 0) {
```

**Explication** :
- `if (visibleCount === 0)` = "si aucune ligne n'est visible"
- `===` = comparaison stricte
- `0` = zéro

**Exemple simple** : Si aucun résultat ne correspond aux filtres, on affiche "Aucun résultat".

---

### Ligne 69
```javascript
            emptyRow.style.display = '';
```

**Explication** :
- Affiche la ligne "aucun résultat"

**Exemple simple** : On montre le message "Aucun projet trouvé".

---

### Ligne 70
```javascript
        } else {
```

**Explication** :
- `else` = "sinon" (si au moins une ligne est visible)

**Exemple simple** : Si des résultats existent, on cache le message.

---

### Ligne 71
```javascript
            emptyRow.style.display = 'none';
```

**Explication** :
- Cache la ligne "aucun résultat"

**Exemple simple** : On cache le message car il y a des résultats.

---

### Ligne 76
```javascript
    if (countEl) {
```

**Explication** :
- `if (countEl)` = "si l'élément compteur existe"

**Exemple simple** : On vérifie que l'endroit où afficher le nombre existe.

---

### Ligne 77
```javascript
        countEl.textContent = String(visibleCount);
```

**Explication** :
- `countEl.textContent` = le texte affiché dans l'élément
- `String(visibleCount)` = convertit le nombre en texte
- `=` = met à jour le texte

**Exemple simple** : On affiche le nombre de résultats visibles.

**Exemple concret** :
- Si `visibleCount = 5` → affiche "5"
- Si `visibleCount = 0` → affiche "0"

---

## 🔄 Résumé du flux

### Pour `addProjectToTable` :
1. Vérifie qu'on est sur la page projets
2. Trouve le tableau
3. Vérifie que le projet n'existe pas déjà
4. Crée une nouvelle ligne
5. Remplit la ligne avec les informations
6. Ajoute la ligne au tableau

### Pour `filterTable` :
1. Trouve le tableau et tous les éléments de filtrage
2. Récupère le texte de recherche et les filtres
3. Parcourt chaque ligne
4. Vérifie si la ligne correspond aux critères
5. Affiche ou cache la ligne
6. Met à jour le compteur

---

**Fin du guide** 📚
