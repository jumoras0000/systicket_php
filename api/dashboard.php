<?php
/**
 * Systicket 2.0 - API Dashboard
 */

require_once __DIR__ . '/../includes/Auth.php';
require_once __DIR__ . '/../includes/helpers.php';
require_once __DIR__ . '/../models/DashboardModel.php';

Auth::requireLogin();

$method = $_SERVER['REQUEST_METHOD'];
$model = new DashboardModel();
$action = $_GET['action'] ?? 'stats';

if ($method !== 'GET') {
    jsonResponse(['error' => 'Méthode non autorisée'], 405);
}

$user = Auth::user();
$role = $user['role'];
$userId = $user['id'];
$clientId = ($role === 'client') ? $userId : null;

switch ($action) {
    case 'stats':
        jsonResponse(['success' => true, 'data' => $model->getStats($role, $userId, $clientId)]);
        break;

    case 'tickets-by-status':
        $filterUserId = ($role === 'collaborateur') ? $userId : null;
        $filterClientId = ($role === 'client') ? $clientId : null;
        jsonResponse(['success' => true, 'data' => $model->getTicketsByStatus($filterUserId, $filterClientId)]);
        break;

    case 'hours-by-project':
        $filterUserId = ($role === 'collaborateur') ? $userId : null;
        $filterClientId = ($role === 'client') ? $clientId : null;
        jsonResponse(['success' => true, 'data' => $model->getHoursByProject($filterUserId, $filterClientId)]);
        break;

    case 'recent-tickets':
        $limit = (int)($_GET['limit'] ?? 5);
        jsonResponse(['success' => true, 'data' => $model->getRecentTickets($limit, $userId, $clientId)]);
        break;

    case 'recent-activity':
        jsonResponse(['success' => true, 'data' => $model->getRecentActivity()]);
        break;

    case 'featured-projects':
        jsonResponse(['success' => true, 'data' => $model->getFeaturedProjects()]);
        break;

    case 'reports':
        if (!Auth::hasRole('admin')) jsonResponse(['error' => 'Non autorisé'], 403);
        $filters = [
            'date_from'  => $_GET['date_from'] ?? null,
            'date_to'    => $_GET['date_to'] ?? null,
            'project_id' => $_GET['project_id'] ?? null,
            'client_id'  => $_GET['client_id'] ?? null,
        ];
        jsonResponse(['success' => true, 'data' => $model->getReportData($filters)]);
        break;

    default:
        jsonResponse(['error' => 'Action inconnue'], 404);
}
