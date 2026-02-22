<?php
/**
 * Systicket 2.0 - API Authentification
 * POST /api/auth/login    - Connexion
 * POST /api/auth/register - Inscription
 * POST /api/auth/logout   - Déconnexion
 * GET  /api/auth/user     - Utilisateur courant
 */

require_once __DIR__ . '/../includes/Auth.php';
require_once __DIR__ . '/../includes/helpers.php';

$method = $_SERVER['REQUEST_METHOD'];
$action = $_GET['action'] ?? '';

switch ($action) {
    case 'login':
        if ($method !== 'POST') jsonResponse(['error' => 'Méthode non autorisée'], 405);
        $data = jsonInput();
        $email = trim($data['email'] ?? '');
        $password = $data['password'] ?? '';
        
        if (!$email || !$password) {
            jsonResponse(['success' => false, 'message' => 'Email et mot de passe requis.'], 400);
        }
        
        $result = Auth::login($email, $password);
        jsonResponse($result, $result['success'] ? 200 : 401);
        break;

    case 'register':
        if ($method !== 'POST') jsonResponse(['error' => 'Méthode non autorisée'], 405);
        $data = jsonInput();
        
        $lastName = $data['last_name'] ?? $data['nom'] ?? '';
        if (empty($data['email']) || empty($data['password']) || empty($lastName)) {
            jsonResponse(['success' => false, 'message' => 'Tous les champs obligatoires doivent être remplis.'], 400);
        }
        
        $result = Auth::register($data);
        jsonResponse($result, $result['success'] ? 201 : 400);
        break;

    case 'logout':
        Auth::logout();
        jsonResponse(['success' => true, 'message' => 'Déconnecté.']);
        break;

    case 'user':
        if (!Auth::check()) {
            jsonResponse(['success' => false, 'message' => 'Non authentifié.'], 401);
        }
        jsonResponse(['success' => true, 'user' => Auth::user()]);
        break;

    case 'change-password':
        if ($method !== 'POST') jsonResponse(['error' => 'Méthode non autorisée'], 405);
        if (!Auth::check()) {
            jsonResponse(['success' => false, 'message' => 'Non authentifié.'], 401);
        }
        $data = jsonInput();
        $oldPassword = $data['old_password'] ?? '';
        $newPassword = $data['new_password'] ?? '';

        if (!$oldPassword || !$newPassword) {
            jsonResponse(['success' => false, 'message' => 'Ancien et nouveau mot de passe requis.'], 400);
        }
        if (strlen($newPassword) < 8) {
            jsonResponse(['success' => false, 'message' => 'Le nouveau mot de passe doit contenir au moins 8 caractères.'], 400);
        }

        // Verify old password
        $db = Database::getInstance();
        $stmt = $db->prepare('SELECT password FROM users WHERE id = ? LIMIT 1');
        $stmt->execute([Auth::id()]);
        $user = $stmt->fetch();

        if (!$user || !password_verify($oldPassword, $user['password'])) {
            jsonResponse(['success' => false, 'message' => 'Ancien mot de passe incorrect.'], 400);
        }

        // Update password
        $hash = password_hash($newPassword, PASSWORD_BCRYPT);
        $db->prepare('UPDATE users SET password = ? WHERE id = ?')->execute([$hash, Auth::id()]);

        jsonResponse(['success' => true, 'message' => 'Mot de passe modifié avec succès.']);
        break;

    default:
        jsonResponse(['error' => 'Action inconnue'], 404);
}
