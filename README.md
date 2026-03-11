# Systicket PHP

Système de gestion de tickets développé en PHP avec interface web.

## Prérequis

- PHP 7.4 ou supérieur
- MySQL 5.7 ou supérieur
- Serveur web (Apache recommandé)

## Installation rapide

### 1. Télécharger le projet
```bash
git clone https://github.com/jumoras0000/systicket_php.git
cd systicket_php
```

### 2. Configuration de la base de données

1. Créer une base de données MySQL nommée `systicket`
2. Importer le schéma :
```bash
mysql -u root -p systicket < database/schema.sql
```

### 3. Configuration de l'application

Éditer le fichier `config/config.php` avec vos paramètres :
```php
<?php
// Configuration de la base de données
define('DB_HOST', 'localhost');
define('DB_NAME', 'systicket');
define('DB_USER', 'root');
define('DB_PASS', 'votre_mot_de_passe');

// Configuration de l'application
define('APP_NAME', 'Systicket');
define('APP_URL', 'http://localhost/systicket_php');
```

### 4. Lancement

1. Démarrer votre serveur web (Apache) et MySQL
2. Accéder à l'application dans votre navigateur :
   ```
   http://localhost/systicket_php
   ```

## Lancement

1. Démarrer votre serveur web (Apache) et MySQL
2. Accéder à l'application dans votre navigateur :
   ```
   http://localhost/systicket_php
   ```

## Structure du projet

- `api/` - Endpoints API REST
- `config/` - Configuration de l'application
- `database/` - Schéma et migrations
- `includes/` - Classes et helpers
- `models/` - Modèles de données
- `views/` - Templates et pages
- `css/`, `js/` - Assets frontend

## Fonctionnalités

- Gestion des tickets
- Gestion des projets
- Gestion des utilisateurs
- Gestion du temps
- Tableaux de bord
- Système d'authentification

