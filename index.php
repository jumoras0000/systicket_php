<?php
/**
 * Systicket 2.0 - Point d'entrée principal (Router)
 * Toutes les requêtes passent par ce fichier via .htaccess
 */

require_once __DIR__ . '/config/config.php';
require_once __DIR__ . '/includes/helpers.php';
require_once __DIR__ . '/includes/Auth.php';

Auth::init();

// Récupérer le chemin demandé
$requestUri = $_SERVER['REQUEST_URI'];
$basePath = parse_url(APP_URL, PHP_URL_PATH) ?: '';
$path = parse_url($requestUri, PHP_URL_PATH);
$path = substr($path, strlen($basePath));
$path = trim($path, '/');

// Si vide, page d'accueil
if ($path === '' || $path === 'index.php') {
    $path = 'home';
}

// Variables partagées pour les vues
$currentUser = Auth::user();
$userRole = Auth::role();
$isLoggedIn = Auth::check();

// Routes publiques (pas besoin d'authentification)
$publicRoutes = ['home', 'connexion', 'inscription', 'mot-de-passe-oublie', 'cgu', 'auth/login', 'auth/register'];

// Routes API
if (strpos($path, 'api/') === 0) {
    $apiFile = __DIR__ . '/' . $path . '.php';
    // Gérer les routes API avec paramètres
    $apiParts = explode('/', $path);
    if (count($apiParts) >= 2) {
        $apiFile = __DIR__ . '/api/' . $apiParts[1] . '.php';
        if (isset($apiParts[2])) {
            // Si le segment est numérique, c'est un ID ; sinon, c'est une action
            if (ctype_digit($apiParts[2])) {
                $_GET['id'] = $apiParts[2];
            } else {
                $_GET['action'] = $apiParts[2];
            }
        }
        // Support api/resource/action/id (ex: api/dashboard/stats)
        if (isset($apiParts[3]) && ctype_digit($apiParts[3])) {
            $_GET['id'] = $apiParts[3];
        }
    }
    if (file_exists($apiFile)) {
        require $apiFile;
        exit;
    }
    jsonResponse(['error' => 'Route API non trouvée'], 404);
}

// Vérifier authentification pour routes protégées
if (!in_array($path, $publicRoutes) && !$isLoggedIn) {
    redirect('connexion');
}

// Matrice d'accès par rôle (contrôle d'accès serveur)
$pageAccess = [
    'dashboard'         => ['admin', 'collaborateur', 'client'],
    'tickets'           => ['admin', 'collaborateur', 'client'],
    'ticket-detail'     => ['admin', 'collaborateur', 'client'],
    'ticket-form'       => ['admin', 'collaborateur'],
    'ticket-validation' => ['client'],
    'projets'           => ['admin', 'collaborateur', 'client'],
    'projet-detail'     => ['admin', 'collaborateur', 'client'],
    'projet-form'       => ['admin', 'collaborateur'],
    'contrats'          => ['admin', 'client'],
    'contrat-detail'    => ['admin', 'client'],
    'contrat-form'      => ['admin'],
    'temps'             => ['admin', 'collaborateur'],
    'rapports'          => ['admin'],
    'utilisateurs'      => ['admin'],
    'user-form'         => ['admin'],
    'profil'            => ['admin', 'collaborateur', 'client'],
];

// Vérifier les permissions de page
if (isset($pageAccess[$path]) && $isLoggedIn) {
    $allowed = $pageAccess[$path];
    if (!in_array($userRole, $allowed)) {
        flash('error', 'Vous n\'avez pas accès à cette page.');
        redirect('dashboard');
    }
}

// Mapping routes -> vues
$routes = [
    'home'               => 'pages/home.php',
    'connexion'          => 'pages/connexion.php',
    'inscription'        => 'pages/inscription.php',
    'mot-de-passe-oublie'=> 'pages/mot-de-passe-oublie.php',
    'cgu'                => 'pages/cgu.php',
    'dashboard'          => 'pages/dashboard.php',
    'tickets'            => 'pages/tickets.php',
    'ticket-detail'      => 'pages/ticket-detail.php',
    'ticket-form'        => 'pages/ticket-form.php',
    'ticket-validation'  => 'pages/ticket-validation.php',
    'projets'            => 'pages/projets.php',
    'projet-detail'      => 'pages/projet-detail.php',
    'projet-form'        => 'pages/projet-form.php',
    'contrats'           => 'pages/contrats.php',
    'contrat-detail'     => 'pages/contrat-detail.php',
    'contrat-form'       => 'pages/contrat-form.php',
    'temps'              => 'pages/temps.php',
    'rapports'           => 'pages/rapports.php',
    'utilisateurs'       => 'pages/utilisateurs.php',
    'user-form'          => 'pages/user-form.php',
    'profil'             => 'pages/profil.php',
    'logout'             => null, // géré spécialement
];

// Gestion de la déconnexion
if ($path === 'logout') {
    Auth::logout();
    redirect('connexion');
}

// Gestion login/register via POST
if ($path === 'connexion' && $_SERVER['REQUEST_METHOD'] === 'POST') {
    if (!verifyCsrf()) {
        $loginError = 'Jeton de sécurité invalide. Veuillez réessayer.';
    } else {
        $result = Auth::login(post('email', ''), post('password', ''));
        if ($result['success']) {
            redirect('dashboard');
        } else {
            $loginError = $result['message'];
        }
    }
}

if ($path === 'inscription' && $_SERVER['REQUEST_METHOD'] === 'POST') {
    if (!verifyCsrf()) {
        $registerError = 'Jeton de sécurité invalide. Veuillez réessayer.';
    } else {
        $result = Auth::register($_POST);
        if ($result['success']) {
            redirect('dashboard');
        } else {
            $registerError = $result['message'];
        }
    }
}

// Trouver la vue
if (isset($routes[$path])) {
    $viewFile = __DIR__ . '/views/' . $routes[$path];
    if (file_exists($viewFile)) {
        // Pages authentifiées : utiliser le layout
        $authPages = ['home', 'connexion', 'inscription', 'mot-de-passe-oublie', 'cgu'];
        if (in_array($path, $authPages)) {
            require $viewFile;
        } else {
            $pageContent = $viewFile;
            $pageName = $path;
            require __DIR__ . '/views/layout.php';
        }
        exit;
    }
}

// 404
http_response_code(404);
$pageName = '404';
require __DIR__ . '/views/pages/404.php';
