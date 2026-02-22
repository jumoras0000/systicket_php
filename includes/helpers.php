<?php
/**
 * Systicket 2.0 - Fonctions utilitaires
 */

/**
 * Échappe une valeur pour affichage HTML
 */
function e(?string $value): string {
    return htmlspecialchars($value ?? '', ENT_QUOTES, 'UTF-8');
}

/**
 * Génère une URL absolue pour l'application
 */
function url(string $path = ''): string {
    return APP_URL . '/' . ltrim($path, '/');
}

/**
 * Génère une URL pour les assets (CSS, JS, images)
 */
function asset(string $path): string {
    $filePath = __DIR__ . '/../' . ltrim($path, '/');
    $v = file_exists($filePath) ? filemtime($filePath) : time();
    return APP_URL . '/' . ltrim($path, '/') . '?v=' . $v;
}

/**
 * Redirige vers une URL
 */
function redirect(string $path): void {
    header('Location: ' . url($path));
    exit;
}

/**
 * Retourne une réponse JSON
 */
function jsonResponse(array $data, int $status = 200): void {
    http_response_code($status);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode($data, JSON_UNESCAPED_UNICODE);
    exit;
}

/**
 * Récupère un paramètre GET nettoyé
 */
function input(string $key, $default = null) {
    return isset($_GET[$key]) ? trim($_GET[$key]) : $default;
}

/**
 * Récupère un paramètre POST nettoyé
 */
function post(string $key, $default = null) {
    return isset($_POST[$key]) ? trim($_POST[$key]) : $default;
}

/**
 * Récupère les données JSON du body
 */
function jsonInput(): array {
    $raw = file_get_contents('php://input');
    $data = json_decode($raw, true);
    return is_array($data) ? $data : [];
}

/**
 * Formate une date pour l'affichage
 */
function formatDate(?string $date, string $format = 'd/m/Y'): string {
    if (!$date) return '—';
    try {
        return (new DateTime($date))->format($format);
    } catch (Exception $e) {
        return $date;
    }
}

/**
 * Formate une date relative (il y a X minutes/heures/jours)
 */
function timeAgo(?string $datetime): string {
    if (!$datetime) return '—';
    try {
        $now = new DateTime();
        $ago = new DateTime($datetime);
        $diff = $now->diff($ago);
        
        if ($diff->days > 30) return formatDate($datetime);
        if ($diff->days > 0) return $diff->days . 'j';
        if ($diff->h > 0) return $diff->h . 'h';
        if ($diff->i > 0) return $diff->i . 'min';
        return 'À l\'instant';
    } catch (Exception $e) {
        return '—';
    }
}

/**
 * Label d'un statut de ticket
 */
function ticketStatusLabel(string $status): string {
    $labels = [
        'new'            => 'Nouveau',
        'in-progress'    => 'En cours',
        'waiting-client' => 'En attente client',
        'done'           => 'Terminé',
        'to-validate'    => 'À valider',
        'validated'      => 'Validé',
        'refused'        => 'Refusé',
    ];
    return $labels[$status] ?? $status;
}

/**
 * Classe CSS d'un badge de statut ticket
 */
function ticketStatusBadge(string $status): string {
    $badges = [
        'new'            => 'badge-info',
        'in-progress'    => 'badge-warning',
        'waiting-client' => 'badge-secondary',
        'done'           => 'badge-success',
        'to-validate'    => 'badge-primary',
        'validated'      => 'badge-success',
        'refused'        => 'badge-danger',
    ];
    return $badges[$status] ?? 'badge-secondary';
}

/**
 * Label d'une priorité
 */
function priorityLabel(string $priority): string {
    $labels = [
        'low'      => 'Faible',
        'normal'   => 'Normale',
        'high'     => 'Élevée',
        'critical' => 'Critique',
    ];
    return $labels[$priority] ?? $priority;
}

/**
 * Classe CSS d'un badge de priorité
 */
function priorityBadge(string $priority): string {
    $badges = [
        'low'      => 'badge-secondary',
        'normal'   => 'badge-info',
        'high'     => 'badge-warning',
        'critical' => 'badge-danger',
    ];
    return $badges[$priority] ?? 'badge-secondary';
}

/**
 * Label d'un type de ticket
 */
function ticketTypeLabel(string $type): string {
    return $type === 'billable' ? 'Facturable' : 'Inclus';
}

/**
 * Classe CSS d'un type de ticket
 */
function ticketTypeBadge(string $type): string {
    return $type === 'billable' ? 'badge-warning' : 'badge-success';
}

/**
 * Label du statut d'un projet
 */
function projetStatusLabel(string $status): string {
    $labels = [
        'active'    => 'Actif',
        'paused'    => 'En pause',
        'completed' => 'Terminé',
    ];
    return $labels[$status] ?? $status;
}

/**
 * Classe CSS d'un badge de statut projet
 */
function projetStatusBadge(string $status): string {
    $badges = [
        'active'    => 'badge-success',
        'paused'    => 'badge-warning',
        'completed' => 'badge-info',
    ];
    return $badges[$status] ?? 'badge-secondary';
}

/**
 * Flash message (stocké en session pour affichage après redirection)
 */
function flash(string $type, string $message): void {
    if (session_status() === PHP_SESSION_NONE) session_start();
    $_SESSION['flash'] = ['type' => $type, 'message' => $message];
}

/**
 * Récupère et supprime le flash message
 * Si $type est fourni, retourne uniquement le message si le type correspond (en tant que string)
 * Sinon retourne le tableau complet ['type', 'message'] ou null
 */
function getFlash(?string $type = null) {
    if (session_status() === PHP_SESSION_NONE) session_start();
    if (isset($_SESSION['flash'])) {
        $flash = $_SESSION['flash'];
        if ($type === null) {
            unset($_SESSION['flash']);
            return $flash;
        }
        // Type spécifié: retourner le message seulement si le type correspond
        if ($flash['type'] === $type) {
            unset($_SESSION['flash']);
            return $flash['message'];
        }
        return null;
    }
    return null;
}

/**
 * CSRF token
 */
function csrfToken(): string {
    if (session_status() === PHP_SESSION_NONE) session_start();
    if (empty($_SESSION['csrf_token'])) {
        $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
    }
    return $_SESSION['csrf_token'];
}

/**
 * Champ hidden CSRF
 */
function csrfField(): string {
    return '<input type="hidden" name="_token" value="' . csrfToken() . '">';
}

/**
 * Vérifie le CSRF token
 */
function verifyCsrf(): bool {
    if (session_status() === PHP_SESSION_NONE) session_start();
    $token = $_POST['_token'] ?? $_SERVER['HTTP_X_CSRF_TOKEN'] ?? '';
    return hash_equals($_SESSION['csrf_token'] ?? '', $token);
}
