<?php
/**
 * Systicket 2.0 - API Utilisateurs
 */

require_once __DIR__ . '/../includes/Auth.php';
require_once __DIR__ . '/../includes/helpers.php';
require_once __DIR__ . '/../models/UserModel.php';

Auth::requireLogin();

$method = $_SERVER['REQUEST_METHOD'];
$model = new UserModel();
$action = $_GET['action'] ?? '';

switch ($method) {
    case 'GET':
        if ($action === 'collaborateurs') {
            jsonResponse(['success' => true, 'data' => $model->getCollaborateurs()]);
        }
        if ($action === 'clients') {
            jsonResponse(['success' => true, 'data' => $model->getClients()]);
        }
        if ($action === 'pending-profiles') {
            if (!Auth::hasRole('admin')) jsonResponse(['error' => 'Non autorisé'], 403);
            jsonResponse(['success' => true, 'data' => $model->getPendingProfiles()]);
        }

        if (!empty($_GET['id'])) {
            $user = $model->getById((int)$_GET['id']);
            if (!$user) jsonResponse(['error' => 'Utilisateur non trouvé'], 404);
            unset($user['password']);
            jsonResponse(['success' => true, 'data' => $user]);
        }
        
        if (!Auth::hasRole('admin')) jsonResponse(['error' => 'Non autorisé'], 403);
        
        $filters = [
            'role'   => $_GET['role'] ?? null,
            'status' => $_GET['status'] ?? null,
            'search' => $_GET['search'] ?? null,
        ];
        $users = $model->getAll($filters);
        foreach ($users as &$u) { unset($u['password']); }
        jsonResponse(['success' => true, 'data' => $users]);
        break;

    case 'POST':
        if ($action === 'approve-profile') {
            if (!Auth::hasRole('admin')) jsonResponse(['error' => 'Non autorisé'], 403);
            $data = jsonInput();
            $model->approvePendingProfile((int)($data['id'] ?? 0));
            jsonResponse(['success' => true]);
        }
        if ($action === 'reject-profile') {
            if (!Auth::hasRole('admin')) jsonResponse(['error' => 'Non autorisé'], 403);
            $data = jsonInput();
            $model->rejectPendingProfile((int)($data['id'] ?? 0));
            jsonResponse(['success' => true]);
        }

        if (!Auth::hasRole('admin')) jsonResponse(['error' => 'Non autorisé'], 403);
        
        $data = jsonInput();
        $lastName = $data['last_name'] ?? $data['nom'] ?? '';
        if (empty($lastName) || empty($data['email'])) {
            jsonResponse(['error' => 'Nom et email requis'], 400);
        }
        
        // Check email unique
        $existing = $model->getByEmail($data['email']);
        if ($existing) {
            jsonResponse(['error' => 'Un utilisateur avec cet email existe déjà.'], 400);
        }
        
        $id = $model->create($data);
        jsonResponse(['success' => true, 'id' => $id], 201);
        break;

    case 'PUT':
        $id = (int)($_GET['id'] ?? 0);
        if (!$id) jsonResponse(['error' => 'ID requis'], 400);
        
        // Profil personnel
        if ($id === Auth::id()) {
            $data = jsonInput();
            if (Auth::hasRole('admin')) {
                $model->updateProfile($id, $data);
                Auth::refresh();
                jsonResponse(['success' => true, 'message' => 'Profil mis à jour.']);
            } else {
                // Pending
                $model->createPendingProfile($id, $data);
                jsonResponse(['success' => true, 'message' => 'Modifications en attente de validation par l\'administrateur.']);
            }
        }
        
        if (!Auth::hasRole('admin')) jsonResponse(['error' => 'Non autorisé'], 403);
        
        $data = jsonInput();
        // Check email unique
        $existing = $model->getByEmail($data['email'] ?? '');
        if ($existing && $existing['id'] != $id) {
            jsonResponse(['error' => 'Un utilisateur avec cet email existe déjà.'], 400);
        }
        
        $model->update($id, $data);
        jsonResponse(['success' => true]);
        break;

    case 'DELETE':
        if (!Auth::hasRole('admin')) jsonResponse(['error' => 'Non autorisé'], 403);
        $id = (int)($_GET['id'] ?? 0);
        if (!$id) jsonResponse(['error' => 'ID requis'], 400);
        if ($id === Auth::id()) jsonResponse(['error' => 'Vous ne pouvez pas supprimer votre propre compte.'], 400);
        $model->delete($id);
        jsonResponse(['success' => true]);
        break;

    default:
        jsonResponse(['error' => 'Méthode non autorisée'], 405);
}
