<?php
/**
 * Systicket 2.0 - API Validations
 */

require_once __DIR__ . '/../includes/Auth.php';
require_once __DIR__ . '/../includes/helpers.php';
require_once __DIR__ . '/../models/ValidationModel.php';
require_once __DIR__ . '/../models/TicketModel.php';

Auth::requireLogin();

$method = $_SERVER['REQUEST_METHOD'];
$model = new ValidationModel();
$action = $_GET['action'] ?? '';

switch ($method) {
    case 'GET':
        $clientId = Auth::role() === 'client' ? Auth::id() : null;
        jsonResponse(['success' => true, 'data' => $model->getAll($clientId)]);
        break;

    case 'POST':
        if (!Auth::hasRole('client')) jsonResponse(['error' => 'Seul un client peut valider/refuser'], 403);
        $data = jsonInput();
        $ticketId = (int)($data['ticket_id'] ?? 0);
        if (!$ticketId) jsonResponse(['error' => 'ID ticket requis'], 400);

        // VÉRIFICATION DE PROPRIÉTÉ : le ticket doit appartenir à un projet du client connecté
        $ticketModel = new TicketModel();
        $ticket = $ticketModel->getById($ticketId);
        if (!$ticket) jsonResponse(['error' => 'Ticket non trouvé'], 404);
        
        $userClientId = Auth::id();
        $ticketClientId = $ticket['client_id'] ?? null;
        if (!$ticketClientId || (int)$userClientId !== (int)$ticketClientId) {
            jsonResponse(['error' => 'Ce ticket ne concerne pas vos projets.'], 403);
        }

        if ($action === 'validate') {
            $model->validate($ticketId, Auth::id(), $data['comment'] ?? null);
            jsonResponse(['success' => true, 'message' => 'Ticket validé avec succès.']);
        } elseif ($action === 'refuse') {
            $model->refuse($ticketId, Auth::id(), $data['comment'] ?? null);
            jsonResponse(['success' => true, 'message' => 'Ticket refusé.']);
        } else {
            jsonResponse(['error' => 'Action requise (validate ou refuse)'], 400);
        }
        break;

    default:
        jsonResponse(['error' => 'Méthode non autorisée'], 405);
}
