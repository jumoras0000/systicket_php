<?php
/**
 * Systicket 2.0 - API Temps
 */

require_once __DIR__ . '/../includes/Auth.php';
require_once __DIR__ . '/../includes/helpers.php';
require_once __DIR__ . '/../models/TempsModel.php';

Auth::requireLogin();

if (!Auth::hasRole('admin', 'collaborateur')) {
    jsonResponse(['error' => 'Non autorisé'], 403);
}

$method = $_SERVER['REQUEST_METHOD'];
$model = new TempsModel();

switch ($method) {
    case 'GET':
        $action = $_GET['action'] ?? '';
        
        if ($action === 'week-summary') {
            $userId = Auth::role() === 'collaborateur' ? Auth::id() : null;
            jsonResponse(['success' => true, 'data' => $model->getWeekSummary($userId, $_GET['week_start'] ?? null)]);
        }
        if ($action === 'month-total') {
            $userId = Auth::role() === 'collaborateur' ? Auth::id() : null;
            jsonResponse(['success' => true, 'data' => ['total' => $model->getMonthTotal($userId)]]);
        }
        if ($action === 'by-project') {
            jsonResponse(['success' => true, 'data' => $model->getHoursByProject($_GET)]);
        }
        if ($action === 'by-user') {
            jsonResponse(['success' => true, 'data' => $model->getHoursByUser($_GET)]);
        }

        if (!empty($_GET['id'])) {
            $entry = $model->getById((int)$_GET['id']);
            if (!$entry) jsonResponse(['error' => 'Entrée non trouvée'], 404);
            jsonResponse(['success' => true, 'data' => $entry]);
        }
        
        $filters = [
            'user_id'    => $_GET['user_id'] ?? (Auth::role() === 'collaborateur' ? Auth::id() : null),
            'project_id' => $_GET['project_id'] ?? null,
            'ticket_id'  => $_GET['ticket_id'] ?? null,
            'date_from'  => $_GET['date_from'] ?? null,
            'date_to'    => $_GET['date_to'] ?? null,
        ];
        jsonResponse(['success' => true, 'data' => $model->getAll($filters)]);
        break;

    case 'POST':
        $data = jsonInput();
        $data['user_id'] = $data['user_id'] ?? Auth::id();
        if (empty($data['date'])) jsonResponse(['error' => 'Date requise'], 400);

        // Auto-resolve project_id from ticket if not provided
        if (!empty($data['ticket_id']) && empty($data['project_id'])) {
            $ticketStmt = Database::getInstance()->prepare('SELECT project_id FROM tickets WHERE id = ?');
            $ticketStmt->execute([(int)$data['ticket_id']]);
            $ticket = $ticketStmt->fetch();
            if ($ticket) $data['project_id'] = $ticket['project_id'];
        }

        $id = $model->create($data);
        jsonResponse(['success' => true, 'id' => $id], 201);
        break;

    case 'PUT':
        $id = (int)($_GET['id'] ?? 0);
        if (!$id) jsonResponse(['error' => 'ID requis'], 400);
        $data = jsonInput();
        $data['user_id'] = $data['user_id'] ?? Auth::id();
        $model->update($id, $data);
        jsonResponse(['success' => true]);
        break;

    case 'DELETE':
        $id = (int)($_GET['id'] ?? 0);
        if (!$id) jsonResponse(['error' => 'ID requis'], 400);
        $model->delete($id);
        jsonResponse(['success' => true]);
        break;

    default:
        jsonResponse(['error' => 'Méthode non autorisée'], 405);
}
