<?php
/**
 * Systicket 2.0 - API Contrats
 */

require_once __DIR__ . '/../includes/Auth.php';
require_once __DIR__ . '/../includes/helpers.php';
require_once __DIR__ . '/../models/ContratModel.php';

Auth::requireLogin();

$method = $_SERVER['REQUEST_METHOD'];
$model = new ContratModel();

switch ($method) {
    case 'GET':
        $action = $_GET['action'] ?? '';
        
        if ($action === 'summary') {
            jsonResponse(['success' => true, 'data' => $model->getSummary()]);
        }
        if ($action === 'linked-tickets' && !empty($_GET['id'])) {
            jsonResponse(['success' => true, 'data' => $model->getLinkedTickets((int)$_GET['id'])]);
        }

        if (!empty($_GET['id'])) {
            $contrat = $model->getById((int)$_GET['id']);
            if (!$contrat) jsonResponse(['error' => 'Contrat non trouvé'], 404);
            // Scope check : les clients ne voient que leurs propres contrats
            if (Auth::role() === 'client') {
                $userClientId = Auth::id();
                if ((int)($contrat['client_id'] ?? 0) !== (int)$userClientId) {
                    jsonResponse(['error' => 'Non autorisé'], 403);
                }
            }
            $contrat['linked_tickets'] = $model->getLinkedTickets((int)$_GET['id']);
            jsonResponse(['success' => true, 'data' => $contrat]);
        }
        
        $filters = [
            'client_id'  => $_GET['client_id'] ?? null,
            'project_id' => $_GET['project_id'] ?? null,
            'status'     => $_GET['status'] ?? null,
            'search'     => $_GET['search'] ?? null,
        ];
        if (Auth::role() === 'client') {
            $filters['for_client_id'] = Auth::id();
        }
        jsonResponse(['success' => true, 'data' => $model->getAll($filters)]);
        break;

    case 'POST':
        if (!Auth::hasRole('admin')) jsonResponse(['error' => 'Non autorisé'], 403);
        $data = jsonInput();
        $id = $model->create($data);
        jsonResponse(['success' => true, 'id' => $id], 201);
        break;

    case 'PUT':
        if (!Auth::hasRole('admin')) jsonResponse(['error' => 'Non autorisé'], 403);
        $id = (int)($_GET['id'] ?? 0);
        if (!$id) jsonResponse(['error' => 'ID requis'], 400);
        $data = jsonInput();
        $model->update($id, $data);
        jsonResponse(['success' => true]);
        break;

    case 'DELETE':
        if (!Auth::hasRole('admin')) jsonResponse(['error' => 'Non autorisé'], 403);
        $id = (int)($_GET['id'] ?? 0);
        if (!$id) jsonResponse(['error' => 'ID requis'], 400);
        $model->delete($id);
        jsonResponse(['success' => true]);
        break;

    default:
        jsonResponse(['error' => 'Méthode non autorisée'], 405);
}
