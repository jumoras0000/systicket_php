# Explication ligne par ligne des fichiers JavaScript — Systicket

Ce document décrit chaque fichier JavaScript du projet et explique le rôle des lignes principales.

---

## 1. `app-data.js` — Persistance des données (localStorage / sessionStorage)

| Lignes | Explication |
|--------|-------------|
| **1-4** | Commentaire de en-tête : ce fichier gère la persistance des données côté navigateur. |
| **6** | `(function() {` — Démarre une IIFE (fonction exécutée immédiatement) pour éviter de polluer l’espace global. |
| **7** | `'use strict';` — Active le mode strict JavaScript (erreurs plus strictes). |
| **9-18** | Objet `STORAGE` : associe des clés logiques (`tickets`, `clients`, etc.) aux noms de clés utilisés dans le stockage (`systicket_tickets`, etc.). |
| **20** | `window.AppData = { ... }` — Expose l’API de données sur `window` pour que les autres scripts puissent l’utiliser. |
| **21-25** | `get(key)` — Récupère une valeur dans `localStorage` : lit la clé, parse le JSON, renvoie `null` en cas d’erreur ou d’absence. |
| **26-28** | `set(key, value)` — Enregistre une valeur dans `localStorage` (sérialisée en JSON). |
| **29-33** | `add(key, item)` — Récupère le tableau existant pour `key`, y ajoute `item`, puis le resauvegarde. |
| **34-41** | `getSession` / `setSession` — Même principe que get/set mais avec `sessionStorage` (données perdues à la fermeture de l’onglet). |
| **45-47** | `injectStoredRows()` — Récupère la page courante (`data-page`) et le `tbody` du tableau ; sort si pas de tableau. |
| **49-52** | Supprime les lignes déjà injectées par ce script (`data-systicket-injected="1"`) et repère la ligne « vide » pour insérer avant. |
| **54-66** | Si `page === 'tickets'` : lit les tickets en localStorage, pour chaque ticket crée une `<tr>`, la remplit (ID, titre, badges, etc.) et l’insère dans le tableau. |
| **67-76** | Si `page === 'clients'` : même logique pour les clients (nom, contact, email, etc.). |
| **77-89** | Si `page === 'projets'` : même logique pour les projets. |
| **90-99** | Si `page === 'contrats'` : même logique pour les contrats (heures, taux, dates). |
| **100-111** | Si `page === 'temps'` : même logique pour les entrées de suivi du temps. |
| **113** | Déclenche l’événement personnalisé `systicket:listDataInjected` pour indiquer que les données ont été injectées. |
| **116-132** | `init()` : appelle `injectStoredRows()` puis, si un formulaire profil existe, pré-remplit les champs (nom, prénom, tél) avec les données du profil en localStorage. |
| **134-139** | Si le DOM est encore en chargement, enregistre `init` sur `DOMContentLoaded` ; sinon appelle `init()` tout de suite. Écoute aussi `systicket:contentLoaded` pour ré-injecter après un chargement de contenu dynamique. |

---

## 2. `auth-button.js` — Retour visuel sur les formulaires d’authentification

| Lignes | Explication |
|--------|-------------|
| **1-3** | Commentaire : gestion du feedback visuel sur les formulaires auth (connexion, inscription, mot de passe oublié). |
| **5-6** | IIFE + mode strict. |
| **8** | `init()` — Point d’entrée. |
| **9** | Sélectionne tous les formulaires avec la classe `.auth-form`. |
| **10-24** | Pour chaque formulaire : à la soumission, désactive le bouton submit et change son texte en « Envoi en cours... » ; après 1,5 s, réactive le bouton et remet le libellé selon le formulaire (Se connecter / Créer mon compte / Envoyer le lien). |
| **27-32** | Si le DOM charge encore, attend `DOMContentLoaded` ; sinon appelle `init()` immédiatement. |

---

## 3. `components-loader.js` — Chargement des composants HTML

| Lignes | Explication |
|--------|-------------|
| **1** | Commentaire : charge les composants de chaque page. |
| **3-6** | IIFE, mode strict, objet `ComponentsLoader` avec un `Set` pour ne pas recharger deux fois le même composant. |
| **9-11** | `loadComponent(componentName, targetSelector, options)` — Si le composant est déjà chargé, sort. |
| **14-18** | `fetch` du fichier HTML du composant dans `../components/`. Si la réponse n’est pas OK, avertissement et sortie. |
| **20-21** | Récupère le HTML en texte. |
| **22-26** | Cherche l’élément cible avec `targetSelector` ; si absent, avertissement et sortie. |
| **28-34** | Selon `options` : insère le HTML avant la cible, après, ou remplace le contenu de la cible (`innerHTML`). |
| **36-53** | Cas spécial « scripts » : les scripts inclus via `innerHTML` ne s’exécutent pas ; le code parcourt les balises `<script>` du composant et les recrée une par une pour les exécuter (charge séquentielle). |
| **55-59** | Marque le composant comme chargé, appelle le callback optionnel, et en cas d’erreur log dans la console. |
| **65-72** | `initSidebar(activePage)` — Trouve la sidebar, puis l’élément dont `data-page` vaut `activePage`, et lui ajoute la classe `active`. |
| **75-78** | `init()` — Récupère la page courante et le rôle depuis le `body`. |
| **79-92** | Charge le skip-link, le header et l’overlay s’ils ont une cible dans le DOM. |
| **94-107** | Si une cible `sidebar-client` existe, charge le composant sidebar client et initialise l’item actif ; sinon si une cible `sidebar` existe, charge la sidebar standard. |
| **109-112** | Si une cible « scripts » existe, charge le composant scripts (qui inclut les autres JS). |
| **116-123** | Au chargement de la page, appelle `ComponentsLoader.init()` (soit après `DOMContentLoaded`, soit immédiatement si le DOM est prêt). |

---

## 4. `forms-validation.js` — Validation des formulaires

| Lignes | Explication |
|--------|-------------|
| **1-5** | Commentaire : validation côté client pour tous les formulaires. |
| **6-12** | IIFE, mode strict, constantes pour les classes d’erreur et les messages (succès/erreur). |
| **18-68** | Objet `RULES` : pour chaque formulaire (ticket, client, projet, contrat, profil, mot de passe, temps, login, register, reset), définit les règles par champ (required, minLength, min, max, email, etc.) et le message d’erreur associé. |
| **70-76** | `getGroup(input)` — À partir de l’id du champ, trouve le `<label for="...">` puis le groupe de formulaire parent (`.form-group` ou `.auth-form-group`). |
| **78-89** | `showFieldError(input, message)` — Trouve le groupe, supprime une erreur existante, crée un `<span>` d’erreur, l’ajoute au groupe et ajoute la classe d’erreur sur l’input. |
| **91-95** | `clearFieldErrors(form)` — Supprime tous les messages d’erreur et les classes d’erreur dans le formulaire (ou le document). |
| **97-120** | `validateField(input, rules)` — Applique les règles (required, minLength, min, max, email, equals) et renvoie le message d’erreur ou `null` si valide. |
| **122-171** | `validate(form)` — Détermine les règles selon l’id ou le contenu du formulaire, nettoie les erreurs, valide chaque champ concerné, affiche les erreurs et gère aussi la confirmation de mot de passe (nouveau / confirmation). Vérifie en plus les champs `[required]` natifs. Renvoie `true` si tout est valide. |
| **173-186** | `ensureMessageContainer(form)` — Cherche ou crée un conteneur pour les messages globaux (succès/erreur) en haut du formulaire. |
| **188-233** | `initForm(form)` — Assure le conteneur de messages. Sur submit : si la validation échoue, affiche le message d’erreur et empêche l’envoi. Sinon affiche « Enregistrement effectué », construit un objet depuis le FormData, et selon le type de formulaire appelle `AppData.add` ou `AppData.set` (tickets, clients, projets, contrats, temps, profil). Redirige vers l’URL d’action après 800 ms (sauf profil/mot de passe) ou déclenche `systicket:contentLoaded` pour le formulaire temps. |
| **235-240** | `init()` — Sélectionne tous les formulaires concernés (ticket-form, auth-form, etc.), ignore ceux avec `data-no-validate`, et appelle `initForm` sur chacun. |
| **242-248** | Démarrage : au `DOMContentLoaded` ou immédiatement, puis à chaque `systicket:contentLoaded`. |

---

## 5. `list-filters.js` — Filtrage des listes (tableaux)

| Lignes | Explication |
|--------|-------------|
| **1-4** | Commentaire : filtrage dynamique pour les listes, basé sur `data-filter` (selects) et `data-*` (lignes). |
| **6-7** | IIFE, mode strict. |
| **14-19** | `applyFilters(filtersBar, table)` — Récupère le `tbody`, le compteur de résultats, les lignes filtrables (ticket-row, project-row, etc.) et la ligne « vide ». |
| **20-29** | Récupère la valeur du champ recherche et des selects `[data-filter]` pour construire l’objet `filters`. |
| **31-48** | Pour chaque ligne : si un filtre recherche est présent, vérifie que le texte de la ligne contient la recherche ; pour les autres filtres, compare avec l’attribut `data-<nom>` de la ligne. Affiche ou masque la ligne (`display`), compte les visibles. |
| **50-55** | Affiche la ligne « vide » seulement s’il n’y a aucune ligne visible ; met à jour le compteur affiché. |
| **62-65** | `initSection(section)` — Trouve la barre de filtres et le tableau de la section. |
| **69-72** | `onFilter()` — Appelle `applyFilters`. |
| **74-75** | Clé de stockage session pour mémoriser les filtres par page. |
| **77-91** | Sur le champ recherche : restaure la valeur sauvegardée en session si présente ; sur `input`, sauvegarde la recherche en session et appelle `onFilter()`. |
| **93-108** | Sur chaque select `[data-filter]` : restaure la valeur en session ; sur `change`, sauvegarde et appelle `onFilter()`. |
| **110** | Applique une première fois les filtres au chargement. |
| **114-124** | `init()` — Pour chaque `.filters-section`, appelle `initSection`. Démarrage au DOMContentLoaded ou immédiatement, plus écoute de `systicket:contentLoaded`. |

---

## 6. `rapports.js` — Filtres et export des rapports

| Lignes | Explication |
|--------|-------------|
| **1-4** | Commentaire : boutons Appliquer / Réinitialiser pour les filtres des rapports + export. |
| **6-7** | IIFE, mode strict. |
| **8-23** | `showReportFeedback(msg, type)` — Met à jour l’info de période si l’élément existe ; crée ou réutilise un toast `#reports-toast`, affiche le message avec une classe de type (success, etc.) et le cache après 2 s. |
| **25-40** | `init()` — Restaure les filtres des rapports depuis la session (dates from/to, période) dans les champs correspondants. |
| **41-60** | Bouton « Appliquer » : lit les champs date/période, sauvegarde en session `rapports_filters`, et affiche un message de succès avec la plage ou la période. |
| **64-74** | Bouton « Réinitialiser » : remet les valeurs par défaut (ex. date from 2026-01-01), vide la session, affiche « Tous les filtres réinitialisés ». |
| **77-84** | Pour les boutons dont le texte contient « Exporter » dans la section rapports : au clic, appelle `window.print()`. |
| **87-93** | Démarrage au DOMContentLoaded ou immédiatement, plus écoute de `systicket:contentLoaded`. |

---

## 7. `roles.js` — Rôles et permissions

| Lignes | Explication |
|--------|-------------|
| **1-4** | Commentaire : gestion des rôles et permissions. |
| **5-7** | IIFE, mode strict. |
| **9-26** | `rolesConfig` : pour chaque rôle (admin, collaborateur, client) définit le nom, le badge CSS, les entrées de menu autorisées (`menuItems`) et les actions autorisées (`allowedActions`). |
| **31-33** | `applyRole(role)` — Si le rôle est invalide, utilise `admin` par défaut. |
| **35-40** | Récupère la config du rôle, nettoie les anciennes classes `role-*` sur le body, ajoute `role-<role>` et `data-role`. |
| **43-49** | Si un élément `.user-name` existe et n’a pas encore de badge, crée un span avec le nom du rôle et l’ajoute. |
| **52-59** | Objet `menuItems` : associe chaque entrée de menu (clients, contrats, tickets, etc.) à des sélecteurs CSS (nav-item + liens). |
| **62-72** | Pour chaque entrée de menu qui n’est pas dans `config.menuItems`, trouve les éléments correspondants et masque le `nav-item` parent. |
| **75-84** | Objet `actionButtons` : associe chaque action (create-ticket, edit-ticket, etc.) à des sélecteurs (liens ou boutons). |
| **87-94** | Pour chaque action non autorisée pour le rôle, trouve les éléments et les masque. |
| **98-110** | `pageAccess` : pour chaque `data-page`, liste des rôles autorisés (conformément au guide). |
| **112-121** | `checkPageAccess(role)` — Lit `data-page` du body ; si la page n’est pas autorisée pour le rôle, redirige (client → ticket-validation, autres → dashboard) en conservant `?role=...`. |
| **124-129** | `initRole()` — Récupère le rôle depuis l’URL (`?role=`) ou le localStorage ; applique le rôle, sauvegarde en localStorage, puis vérifie l’accès à la page. |
| **131-132** | Démarrage au DOMContentLoaded et à chaque `systicket:contentLoaded`. |

---

## 8. `sidebar.js` — Sidebar mobile et navigation type SPA

| Lignes | Explication |
|--------|-------------|
| **1** | Commentaire : sidebar mobile + navigation SPA sans rechargement complet. |
| **3-4** | IIFE, mode strict. |
| **6-8** | `toggleSidebar()` — Bascule les classes `open` sur la sidebar et `active` sur l’overlay. |
| **10-13** | `closeSidebar()` — Retire `open` et `active` pour fermer le menu. |
| **15-21** | `setActive(page)` — Enlève la classe `active` de tous les items du menu, puis l’ajoute à l’item dont `data-page` correspond. |
| **23-44** | `loadPage(href)` — Fetch du HTML de la page ; parse le HTML ; remplace le contenu de `#main-content` par celui de la page chargée ; met à jour title, classes du body, `data-page`, `data-role` ; met à jour l’item actif de la sidebar ; ferme la sidebar sur mobile ; fait un `history.pushState` ; déclenche `systicket:contentLoaded`. En cas d’erreur, redirection classique vers l’URL. |
| **46-50** | `init()` — Clic sur `.menu-toggle` → toggle sidebar ; clic sur overlay → fermeture ; initialise l’état du history. |
| **52-59** | Délégation sur les clics : si le clic est sur un `.nav-link` pointant vers une page .html du même domaine, empêche le comportement par défaut et appelle `loadPage` pour charger le contenu sans recharger la page. |
| **61-64** | Gestion du bouton « Retour » : sur `popstate`, recharge la page correspondante via `loadPage`. |
| **67-73** | Démarrage au DOMContentLoaded ou immédiatement. |

---

## 9. `ticket-validation.js` — Boutons Valider / Refuser (page client)

| Lignes | Explication |
|--------|-------------|
| **1-3** | Commentaire : boutons Valider / Refuser des tickets côté client. |
| **5-6** | IIFE, mode strict. |
| **8-23** | `showToast(message, type)` — Trouve ou crée un élément `#validation-toast`, affiche le message, applique la classe de type (success/error), affiche le toast puis le cache après 3 s. |
| **26-32** | `init()` — Pour chaque carte `.project-card`, si une validation est déjà stockée pour cet index, met l’opacité à 0.5 (visuellement « traité »). |
| **34-61** | Pour chaque bouton succès (Valider) ou danger (Refuser) dans le footer des cartes : au clic, empêche le défaut ; récupère la carte et son index ; enregistre dans `AppData.validations` la valeur `validated` ou `refused` à cet index ; affiche le toast et met la carte en opacité 0.5. |
| **65-71** | Démarrage au DOMContentLoaded ou immédiatement, plus écoute de `systicket:contentLoaded`. |

---

## Ordre de chargement (composant scripts)

Les scripts sont chargés dans cet ordre dans `scripts.html` :

1. **app-data.js** — Données et injection des lignes dans les tableaux.
2. **sidebar.js** — Comportement de la sidebar et navigation SPA.
3. **roles.js** — Rôles, menu et contrôle d’accès aux pages.
4. **forms-validation.js** — Validation et enregistrement des formulaires.
5. **list-filters.js** — Filtres des listes.
6. **ticket-validation.js** — Valider / Refuser sur la page validation client.
7. **rapports.js** — Filtres et export des rapports.

`components-loader.js` et éventuellement `auth-button.js` sont chargés ailleurs (ex. dans le `<head>` ou sur les pages d’auth).

---

**Version** : 1.0 — Systicket
