<?php
/**
 * Systicket 2.0 - Gestion de l'authentification et des sessions
 */

require_once __DIR__ . '/../config/database.php';

class Auth {
    
    /**
     * Démarre la session si pas encore active
     */
    public static function init(): void {
        if (session_status() === PHP_SESSION_NONE) {
            session_start();
        }
    }

    /**
     * Vérifie si l'utilisateur est connecté
     */
    public static function check(): bool {
        self::init();
        return isset($_SESSION['user_id']);
    }

    /**
     * Retourne l'utilisateur connecté ou null
     */
    public static function user(): ?array {
        self::init();
        if (!isset($_SESSION['user_id'])) return null;
        return [
            'id'         => $_SESSION['user_id'],
            'last_name'  => $_SESSION['user_last_name'] ?? '',
            'first_name' => $_SESSION['user_first_name'] ?? '',
            'email'      => $_SESSION['user_email'] ?? '',
            'role'       => $_SESSION['user_role'] ?? 'client',
            'phone'      => $_SESSION['user_phone'] ?? '',
        ];
    }

    /**
     * Retourne l'ID de l'utilisateur connecté
     */
    public static function id(): ?int {
        self::init();
        return $_SESSION['user_id'] ?? null;
    }

    /**
     * Retourne le rôle de l'utilisateur connecté
     */
    public static function role(): string {
        self::init();
        return $_SESSION['user_role'] ?? 'client';
    }

    /**
     * Vérifie si l'utilisateur a un rôle donné
     */
    public static function hasRole(string ...$roles): bool {
        return in_array(self::role(), $roles);
    }

    /**
     * Connexion de l'utilisateur
     */
    public static function login(string $email, string $password): array {
        $db = Database::getInstance();
        $stmt = $db->prepare('SELECT * FROM users WHERE email = ? AND status = "active" LIMIT 1');
        $stmt->execute([$email]);
        $user = $stmt->fetch();

        if (!$user) {
            return ['success' => false, 'message' => 'Aucun compte associé à cet email.'];
        }

        if (!password_verify($password, $user['password'])) {
            return ['success' => false, 'message' => 'Mot de passe incorrect.'];
        }

        // Mettre à jour last_login
        $db->prepare('UPDATE users SET last_login = NOW() WHERE id = ?')->execute([$user['id']]);

        // Créer la session
        self::init();
        session_regenerate_id(true);
        $_SESSION['user_id']         = (int)$user['id'];
        $_SESSION['user_last_name']  = $user['last_name'];
        $_SESSION['user_first_name'] = $user['first_name'];
        $_SESSION['user_email']      = $user['email'];
        $_SESSION['user_role']       = $user['role'];
        $_SESSION['user_phone']      = $user['phone'] ?? '';

        return ['success' => true, 'user' => self::user()];
    }

    /**
     * Inscription d'un nouvel utilisateur
     */
    public static function register(array $data): array {
        $db = Database::getInstance();

        // Champs obligatoires
        if (empty($data['email']) || empty($data['password'])) {
            return ['success' => false, 'message' => 'Email et mot de passe sont requis.'];
        }
        if (empty($data['last_name'] ?? $data['nom'] ?? '') || empty($data['first_name'] ?? $data['prenom'] ?? '')) {
            return ['success' => false, 'message' => 'Nom et prénom sont requis.'];
        }

        // Validation mot de passe
        if (strlen($data['password']) < 8) {
            return ['success' => false, 'message' => 'Le mot de passe doit contenir au moins 8 caractères.'];
        }
        if (!empty($data['password_confirm']) && $data['password'] !== $data['password_confirm']) {
            return ['success' => false, 'message' => 'Les mots de passe ne correspondent pas.'];
        }

        // Vérifier email unique
        $stmt = $db->prepare('SELECT id FROM users WHERE email = ? LIMIT 1');
        $stmt->execute([$data['email']]);
        if ($stmt->fetch()) {
            return ['success' => false, 'message' => 'Un compte existe déjà avec cet email.'];
        }

        // Valider rôle (whitelist : seulement collaborateur ou client)
        $role = $data['role'] ?? 'collaborateur';
        if (!in_array($role, ['collaborateur', 'client'])) {
            return ['success' => false, 'message' => 'Seuls les collaborateurs et clients peuvent s\'inscrire.'];
        }

        $passwordHash = password_hash($data['password'], PASSWORD_BCRYPT);

        $stmt = $db->prepare('INSERT INTO users (last_name, first_name, email, password, role, status, phone) VALUES (?, ?, ?, ?, ?, "active", ?)');
        $stmt->execute([
            $data['last_name'] ?? $data['nom'] ?? '',
            $data['first_name'] ?? $data['prenom'] ?? '',
            $data['email'],
            $passwordHash,
            $role,
            $data['phone'] ?? $data['telephone'] ?? ''
        ]);

        $userId = (int)$db->lastInsertId();

        // Connecter automatiquement
        self::init();
        session_regenerate_id(true);
        $_SESSION['user_id']         = $userId;
        $_SESSION['user_last_name']  = $data['last_name'] ?? $data['nom'] ?? '';
        $_SESSION['user_first_name'] = $data['first_name'] ?? $data['prenom'] ?? '';
        $_SESSION['user_email']      = $data['email'];
        $_SESSION['user_role']       = $role;
        $_SESSION['user_phone']      = $data['phone'] ?? $data['telephone'] ?? '';

        return ['success' => true, 'user' => self::user()];
    }

    /**
     * Déconnexion
     */
    public static function logout(): void {
        self::init();
        $_SESSION = [];
        if (ini_get("session.use_cookies")) {
            $params = session_get_cookie_params();
            setcookie(session_name(), '', time() - 42000,
                $params["path"], $params["domain"],
                $params["secure"], $params["httponly"]
            );
        }
        session_destroy();
    }

    /**
     * Exige que l'utilisateur soit connecté, sinon redirige (pour pages HTML)
     */
    public static function requireLogin(): void {
        if (!self::check()) {
            // Détecter si c'est un appel API (JSON attendu)
            $isApi = strpos($_SERVER['REQUEST_URI'] ?? '', '/api/') !== false
                  || (isset($_SERVER['HTTP_ACCEPT']) && strpos($_SERVER['HTTP_ACCEPT'], 'application/json') !== false)
                  || (isset($_SERVER['CONTENT_TYPE']) && strpos($_SERVER['CONTENT_TYPE'], 'application/json') !== false);
            if ($isApi) {
                http_response_code(401);
                header('Content-Type: application/json; charset=utf-8');
                echo json_encode(['error' => 'Non authentifié'], JSON_UNESCAPED_UNICODE);
                exit;
            }
            header('Location: ' . APP_URL . '/connexion');
            exit;
        }
    }

    /**
     * Exige un rôle spécifique
     */
    public static function requireRole(string ...$roles): void {
        self::requireLogin();
        if (!self::hasRole(...$roles)) {
            header('Location: ' . APP_URL . '/dashboard');
            exit;
        }
    }

    /**
     * Rafraîchit la session depuis la BDD
     */
    public static function refresh(): void {
        if (!self::check()) return;
        $db = Database::getInstance();
        $stmt = $db->prepare('SELECT * FROM users WHERE id = ? LIMIT 1');
        $stmt->execute([self::id()]);
        $user = $stmt->fetch();
        if ($user) {
            $_SESSION['user_last_name']  = $user['last_name'];
            $_SESSION['user_first_name'] = $user['first_name'];
            $_SESSION['user_email']      = $user['email'];
            $_SESSION['user_role']       = $user['role'];
            $_SESSION['user_phone']      = $user['phone'] ?? '';
        }
    }
}
