<?php
/**
 * Systicket 2.0 - API Projets
 */

require_once __DIR__ . '/../includes/Auth.php';
require_once __DIR__ . '/../includes/helpers.php';
require_once __DIR__ . '/../models/ProjetModel.php';

Auth::requireLogin();

$method = $_SERVER['REQUEST_METHOD'];
$model = new ProjetModel();
$action = $_GET['action'] ?? '';

switch ($method) {
    case 'GET':
        if ($action === 'assignees' && !empty($_GET['id'])) {
            jsonResponse(['success' => true, 'data' => $model->getAssignees((int)$_GET['id'])]);
        }
        if ($action === 'tickets' && !empty($_GET['id'])) {
            jsonResponse(['success' => true, 'data' => $model->getTickets((int)$_GET['id'])]);
        }
        if ($action === 'contrat' && !empty($_GET['id'])) {
            jsonResponse(['success' => true, 'data' => $model->getContrat((int)$_GET['id'])]);
        }
        if ($action === 'counts') {
            jsonResponse(['success' => true, 'data' => $model->countByStatus()]);
        }

        if (!empty($_GET['id'])) {
            $projet = $model->getById((int)$_GET['id']);
            if (!$projet) jsonResponse(['error' => 'Projet non trouvé'], 404);
            // Scope check : les clients ne voient que leurs propres projets
            if (Auth::role() === 'client') {
                $userClientId = Auth::id();
                if ((int)($projet['client_id'] ?? 0) !== (int)$userClientId) {
                    jsonResponse(['error' => 'Non autorisé'], 403);
                }
            }
            $projet['assignees'] = $model->getAssignees((int)$_GET['id']);
            $projet['tickets'] = $model->getTickets((int)$_GET['id']);
            $projet['contrat'] = $model->getContrat((int)$_GET['id']);
            jsonResponse(['success' => true, 'data' => $projet]);
        }
        
        $filters = [
            'status'    => $_GET['status'] ?? null,
            'client_id' => $_GET['client_id'] ?? null,
            'search'    => $_GET['search'] ?? null,
        ];
        if (Auth::role() === 'collaborateur') {
            $filters['user_id'] = Auth::id();
        } elseif (Auth::role() === 'client') {
            $filters['for_client_id'] = Auth::id();
        }
        
        jsonResponse(['success' => true, 'data' => $model->getAll($filters)]);
        break;

    case 'POST':
        if (!Auth::hasRole('admin', 'collaborateur')) jsonResponse(['error' => 'Non autorisé'], 403);
        $data = jsonInput();
        if (empty($data['name'])) jsonResponse(['error' => 'Nom requis'], 400);
        $id = $model->create($data);
        jsonResponse(['success' => true, 'id' => $id], 201);
        break;

    case 'PUT':
        if (!Auth::hasRole('admin', 'collaborateur')) jsonResponse(['error' => 'Non autorisé'], 403);
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
