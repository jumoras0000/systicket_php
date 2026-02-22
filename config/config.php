<?php
/**
 * Systicket 2.0 - Configuration de la base de données
 */

// Configuration MySQL
define('DB_HOST', 'localhost');
define('DB_NAME', 'systicket');
define('DB_USER', 'root');
define('DB_PASS', 'root');
define('DB_CHARSET', 'utf8mb4');

// Configuration de l'application
define('APP_NAME', 'Systicket');
define('APP_VERSION', '2.0.0');
define('APP_URL', '/systicket2');
define('APP_SECRET', 'systicket_secret_key_change_me_in_production');

// Chemin absolu vers la racine du projet
if (!defined('ROOT_PATH')) {
    define('ROOT_PATH', dirname(__DIR__));
}

// Fuseau horaire
date_default_timezone_set('Europe/Paris');

// Sessions
ini_set('session.cookie_httponly', 1);
ini_set('session.use_strict_mode', 1);
