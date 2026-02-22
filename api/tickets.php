<?php
/**
 * Systicket 2.0 - API Tickets
 * GET    /api/tickets.php           - Liste
 * GET    /api/tickets.php?id=X      - Détail
 * POST   /api/tickets.php           - Créer
 * PUT    /api/tickets.php?id=X      - Modifier
 * DELETE /api/tickets.php?id=X      - Supprimer
 * GET    /api/tickets.php?action=comments&id=X      - Commentaires
 * POST   /api/tickets.php?action=comment&id=X       - Ajouter commentaire
 * GET    /api/tickets.php?action=to-validate         - Tickets à valider
 */

require_once __DIR__ . '/../includes/Auth.php';
require_once __DIR__ . '/../includes/helpers.php';
require_once __DIR__ . '/../models/TicketModel.php';
require_once __DIR__ . '/../models/ProjetModel.php';

Auth::requireLogin();

$method = $_SERVER['REQUEST_METHOD'];
$model = new TicketModel();
$action = $_GET['action'] ?? '';

// Filtres basés sur le rôle
function applyRoleFilters(array $filters): array {
    $role = Auth::role();
    if ($role === 'collaborateur') {
        $projetModel = new ProjetModel();
        $filters['project_ids'] = $projetModel->getProjectIdsForUser(Auth::id());
    } elseif ($role === 'client') {
        $filters['for_client_id'] = Auth::id();
    }
    return $filters;
}

switch ($method) {
    case 'GET':
        if ($action === 'comments' && !empty($_GET['id'])) {
            $comments = $model->getComments((int)$_GET['id']);
            jsonResponse(['success' => true, 'data' => $comments]);
        }
        
        if ($action === 'to-validate') {
            $clientId = Auth::role() === 'client' ? Auth::id() : null;
            $tickets = $model->getToValidate($clientId);
            jsonResponse(['success' => true, 'data' => $tickets]);
        }

        if ($action === 'assignees' && !empty($_GET['id'])) {
            $assignees = $model->getAssignees((int)$_GET['id']);
            jsonResponse(['success' => true, 'data' => $assignees]);
        }

        if ($action === 'time-entries' && !empty($_GET['id'])) {
            $entries = $model->getTimeEntries((int)$_GET['id']);
            jsonResponse(['success' => true, 'data' => $entries]);
        }
        
        if (!empty($_GET['id'])) {
            $ticket = $model->getById((int)$_GET['id']);
            if (!$ticket) jsonResponse(['error' => 'Ticket non trouvé'], 404);
            // Scope check : les clients ne voient que les tickets de leurs projets
            if (Auth::role() === 'client') {
                $userClientId = Auth::id();
                $ticketClientId = $ticket['client_id'] ?? null;
                if (!$ticketClientId || (int)$userClientId !== (int)$ticketClientId) {
                    jsonResponse(['error' => 'Non autorisé'], 403);
                }
            }
            $ticket['assignees'] = $model->getAssignees((int)$_GET['id']);
            $ticket['comments'] = $model->getComments((int)$_GET['id']);
            $ticket['time_entries'] = $model->getTimeEntries((int)$_GET['id']);
            jsonResponse(['success' => true, 'data' => $ticket]);
        }
        
        $filters = applyRoleFilters([
            'status'     => $_GET['status'] ?? null,
            'priority'   => $_GET['priority'] ?? null,
            'type'       => $_GET['type'] ?? null,
            'project_id' => $_GET['project_id'] ?? null,
            'search'     => $_GET['search'] ?? null,
            'limit'      => $_GET['limit'] ?? null,
            'offset'     => $_GET['offset'] ?? null,
        ]);
        $tickets = $model->getAll($filters);
        $total = $model->count($filters);
        jsonResponse(['success' => true, 'data' => $tickets, 'total' => $total]);
        break;

    case 'POST':
        // Commentaire : ouvert à admin, collaborateur ET client
        if ($action === 'comment' && !empty($_GET['id'])) {
            $data = jsonInput();
            if (empty($data['content'])) {
                jsonResponse(['error' => 'Contenu requis'], 400);
            }
            
            // Pour les clients, vérifier que le ticket concerne leurs projets
            if (Auth::hasRole('client')) {
                $ticket = $model->getById((int)$_GET['id']);
                if (!$ticket) jsonResponse(['error' => 'Ticket non trouvé'], 404);
                $userClientId = Auth::id();
                $ticketClientId = $ticket['client_id'] ?? null;
                if (!$ticketClientId || (int)$userClientId !== (int)$ticketClientId) {
                    jsonResponse(['error' => 'Ce ticket ne concerne pas vos projets.'], 403);
                }
            }
            
            $commentId = $model->addComment((int)$_GET['id'], Auth::id(), $data['content']);
            jsonResponse(['success' => true, 'id' => $commentId], 201);
        }

        // Autres POST (créer ticket) : admin/collaborateur uniquement
        if (!Auth::hasRole('admin', 'collaborateur')) {
            jsonResponse(['error' => 'Non autorisé'], 403);
        }

        $data = jsonInput();
        $data['created_by'] = Auth::id();
        
        if (empty($data['title'])) {
            jsonResponse(['error' => 'Titre requis'], 400);
        }
        
        $id = $model->create($data);
        jsonResponse(['success' => true, 'id' => $id], 201);
        break;

    case 'PUT':
        if (!Auth::hasRole('admin', 'collaborateur')) {
            jsonResponse(['error' => 'Non autorisé'], 403);
        }
        $id = (int)($_GET['id'] ?? 0);
        if (!$id) jsonResponse(['error' => 'ID requis'], 400);
        
        $data = jsonInput();
        
        // Auto-transition: when a billable ticket is set to "done", change to "to-validate"
        if (isset($data['status']) && $data['status'] === 'done') {
            $existing = $model->getById($id);
            if ($existing && $existing['type'] === 'billable') {
                $data['status'] = 'to-validate';
            }
        }
        
        $model->update($id, $data);
        jsonResponse(['success' => true]);
        break;

    case 'DELETE':
        if (!Auth::hasRole('admin')) {
            jsonResponse(['error' => 'Non autorisé'], 403);
        }
        $id = (int)($_GET['id'] ?? 0);
        if (!$id) jsonResponse(['error' => 'ID requis'], 400);
        
        $model->delete($id);
        jsonResponse(['success' => true]);
        break;

    default:
        jsonResponse(['error' => 'Méthode non autorisée'], 405);
}
