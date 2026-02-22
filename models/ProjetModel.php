<?php
/**
 * Systicket 2.0 - Modèle Projet
 */

require_once __DIR__ . '/../config/database.php';

class ProjetModel {
    private PDO $db;

    public function __construct() {
        $this->db = Database::getInstance();
    }

    public function getAll(array $filters = []): array {
        $sql = 'SELECT p.*, CONCAT(uc.first_name, " ", uc.last_name) as client_name,
                CONCAT(u.first_name, " ", u.last_name) as manager_name,
                (SELECT COUNT(*) FROM tickets WHERE project_id = p.id) as tickets_count,
                (SELECT COALESCE(SUM(te.hours), 0) FROM temps te JOIN tickets tk ON te.ticket_id = tk.id WHERE te.project_id = p.id AND tk.status = "validated") as total_hours,
                (SELECT co.hours FROM contrats co WHERE co.project_id = p.id ORDER BY FIELD(co.status, "active", "expired", "cancelled") LIMIT 1) as contract_hours,
                (SELECT co.rate FROM contrats co WHERE co.project_id = p.id ORDER BY FIELD(co.status, "active", "expired", "cancelled") LIMIT 1) as contract_rate
                FROM projets p
                LEFT JOIN users uc ON p.client_id = uc.id
                LEFT JOIN users u ON p.manager_id = u.id
                WHERE 1=1';
        $params = [];

        if (!empty($filters['status'])) {
            $sql .= ' AND p.status = ?';
            $params[] = $filters['status'];
        }
        if (!empty($filters['client_id'])) {
            $sql .= ' AND p.client_id = ?';
            $params[] = $filters['client_id'];
        }
        if (!empty($filters['search'])) {
            $sql .= ' AND (p.name LIKE ? OR p.description LIKE ?)';
            $s = '%' . $filters['search'] . '%';
            $params = array_merge($params, [$s, $s]);
        }
        if (!empty($filters['user_id'])) {
            $sql .= ' AND (p.manager_id = ? OR p.id IN (SELECT projet_id FROM projet_user WHERE user_id = ?))';
            $params[] = $filters['user_id'];
            $params[] = $filters['user_id'];
        }
        if (!empty($filters['for_client_id'])) {
            $sql .= ' AND p.client_id = ?';
            $params[] = $filters['for_client_id'];
        }

        $sql .= ' ORDER BY p.created_at DESC';
        $stmt = $this->db->prepare($sql);
        $stmt->execute($params);
        return $stmt->fetchAll();
    }

    public function getById(int $id): ?array {
        $stmt = $this->db->prepare('SELECT p.*, CONCAT(uc.first_name, " ", uc.last_name) as client_name, p.client_id as client_id_fk,
            CONCAT(u.first_name, " ", u.last_name) as manager_name
            FROM projets p
            LEFT JOIN users uc ON p.client_id = uc.id
            LEFT JOIN users u ON p.manager_id = u.id
            WHERE p.id = ?');
        $stmt->execute([$id]);
        return $stmt->fetch() ?: null;
    }

    public function create(array $data): int {
        $stmt = $this->db->prepare('INSERT INTO projets (name, description, client_id, status, start_date, end_date, manager_id) VALUES (?, ?, ?, ?, ?, ?, ?)');
        $stmt->execute([
            $data['name'],
            $data['description'] ?? null,
            $data['client_id'] ?: null,
            $data['status'] ?? 'active',
            $data['start_date'] ?: null,
            $data['end_date'] ?: null,
            $data['manager_id'] ?: null
        ]);
        $id = (int)$this->db->lastInsertId();

        if (!empty($data['assignees'])) {
            $this->syncAssignees($id, $data['assignees']);
        }
        return $id;
    }

    public function update(int $id, array $data): bool {
        $stmt = $this->db->prepare('UPDATE projets SET name = ?, description = ?, client_id = ?, status = ?, start_date = ?, end_date = ?, manager_id = ? WHERE id = ?');
        $result = $stmt->execute([
            $data['name'],
            $data['description'] ?? null,
            $data['client_id'] ?: null,
            $data['status'] ?? 'active',
            $data['start_date'] ?: null,
            $data['end_date'] ?: null,
            $data['manager_id'] ?: null,
            $id
        ]);

        if (isset($data['assignees'])) {
            $this->syncAssignees($id, $data['assignees']);
        }
        return $result;
    }

    public function delete(int $id): bool {
        $stmt = $this->db->prepare('DELETE FROM projets WHERE id = ?');
        return $stmt->execute([$id]);
    }

    public function getAssignees(int $projetId): array {
        $stmt = $this->db->prepare('SELECT u.id, u.last_name, u.first_name, u.email, u.role
            FROM users u JOIN projet_user pu ON u.id = pu.user_id
            WHERE pu.projet_id = ? ORDER BY u.last_name');
        $stmt->execute([$projetId]);
        return $stmt->fetchAll();
    }

    public function syncAssignees(int $projetId, array $userIds): void {
        $this->db->prepare('DELETE FROM projet_user WHERE projet_id = ?')->execute([$projetId]);
        $stmt = $this->db->prepare('INSERT INTO projet_user (projet_id, user_id) VALUES (?, ?)');
        foreach ($userIds as $uid) {
            if ($uid) $stmt->execute([$projetId, (int)$uid]);
        }
    }

    public function getTickets(int $projetId): array {
        $stmt = $this->db->prepare('SELECT t.*, 
            COALESCE(SUM(te.hours), 0) as spent_hours
            FROM tickets t 
            LEFT JOIN temps te ON t.id = te.ticket_id
            WHERE t.project_id = ?
            GROUP BY t.id
            ORDER BY t.created_at DESC');
        $stmt->execute([$projetId]);
        return $stmt->fetchAll();
    }

    public function getContrat(int $projetId): ?array {
        $stmt = $this->db->prepare('SELECT co.*,
            COALESCE((SELECT SUM(te.hours) FROM temps te JOIN tickets tk ON te.ticket_id = tk.id WHERE te.project_id = co.project_id AND tk.status = "validated"), 0) as consumed_hours
            FROM contrats co WHERE co.project_id = ? LIMIT 1');
        $stmt->execute([$projetId]);
        return $stmt->fetch() ?: null;
    }

    public function countByStatus(): array {
        $stmt = $this->db->query('SELECT status, COUNT(*) as count FROM projets GROUP BY status');
        $result = ['active' => 0, 'paused' => 0, 'completed' => 0];
        foreach ($stmt->fetchAll() as $row) {
            $result[$row['status']] = (int)$row['count'];
        }
        return $result;
    }

    public function getProjectIdsForUser(int $userId): array {
        $stmt = $this->db->prepare('SELECT DISTINCT p.id FROM projets p
            LEFT JOIN projet_user pu ON p.id = pu.projet_id
            WHERE p.manager_id = ? OR pu.user_id = ?');
        $stmt->execute([$userId, $userId]);
        return array_column($stmt->fetchAll(), 'id');
    }
}
