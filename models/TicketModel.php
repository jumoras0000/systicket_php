<?php
/**
 * Systicket 2.0 - Modèle Ticket
 */

require_once __DIR__ . '/../config/database.php';

class TicketModel {
    private PDO $db;

    public function __construct() {
        $this->db = Database::getInstance();
    }

    public function getAll(array $filters = []): array {
        $sql = 'SELECT t.*, p.name as project_name, CONCAT(uc.first_name, " ", uc.last_name) as client_name,
                CONCAT(cr.first_name, " ", cr.last_name) as creator_name,
                (SELECT COALESCE(SUM(te.hours), 0) FROM temps te WHERE te.ticket_id = t.id) as spent_hours,
                (SELECT GROUP_CONCAT(CONCAT(u2.first_name, " ", u2.last_name) SEPARATOR ", ") FROM ticket_user tu2 JOIN users u2 ON tu2.user_id = u2.id WHERE tu2.ticket_id = t.id) as assignee_names
                FROM tickets t
                LEFT JOIN projets p ON t.project_id = p.id
                LEFT JOIN users uc ON p.client_id = uc.id
                LEFT JOIN users cr ON t.created_by = cr.id
                WHERE 1=1';
        $params = [];

        if (!empty($filters['status'])) {
            $sql .= ' AND t.status = ?';
            $params[] = $filters['status'];
        }
        if (!empty($filters['priority'])) {
            $sql .= ' AND t.priority = ?';
            $params[] = $filters['priority'];
        }
        if (!empty($filters['type'])) {
            $sql .= ' AND t.type = ?';
            $params[] = $filters['type'];
        }
        if (!empty($filters['project_id'])) {
            $sql .= ' AND t.project_id = ?';
            $params[] = $filters['project_id'];
        }
        if (!empty($filters['search'])) {
            $sql .= ' AND (t.title LIKE ? OR t.description LIKE ?)';
            $params[] = '%' . $filters['search'] . '%';
            $params[] = '%' . $filters['search'] . '%';
        }
        if (!empty($filters['project_ids'])) {
            $placeholders = implode(',', array_fill(0, count($filters['project_ids']), '?'));
            $sql .= " AND t.project_id IN ($placeholders)";
            $params = array_merge($params, $filters['project_ids']);
        }
        if (!empty($filters['for_client_id'])) {
            $sql .= ' AND p.client_id = ?';
            $params[] = $filters['for_client_id'];
        }

        $sql .= ' ORDER BY t.created_at DESC';

        if (!empty($filters['limit'])) {
            $sql .= ' LIMIT ?';
            $params[] = (int)$filters['limit'];
            if (!empty($filters['offset'])) {
                $sql .= ' OFFSET ?';
                $params[] = (int)$filters['offset'];
            }
        }

        $stmt = $this->db->prepare($sql);
        $stmt->execute($params);
        return $stmt->fetchAll();
    }

    public function count(array $filters = []): int {
        $sql = 'SELECT COUNT(*) FROM tickets t
                LEFT JOIN projets p ON t.project_id = p.id
                WHERE 1=1';
        $params = [];

        if (!empty($filters['status'])) { $sql .= ' AND t.status = ?'; $params[] = $filters['status']; }
        if (!empty($filters['priority'])) { $sql .= ' AND t.priority = ?'; $params[] = $filters['priority']; }
        if (!empty($filters['type'])) { $sql .= ' AND t.type = ?'; $params[] = $filters['type']; }
        if (!empty($filters['project_id'])) { $sql .= ' AND t.project_id = ?'; $params[] = $filters['project_id']; }
        if (!empty($filters['search'])) {
            $sql .= ' AND (t.title LIKE ? OR t.description LIKE ?)';
            $params[] = '%' . $filters['search'] . '%';
            $params[] = '%' . $filters['search'] . '%';
        }
        if (!empty($filters['project_ids'])) {
            $placeholders = implode(',', array_fill(0, count($filters['project_ids']), '?'));
            $sql .= " AND t.project_id IN ($placeholders)";
            $params = array_merge($params, $filters['project_ids']);
        }
        if (!empty($filters['for_client_id'])) { $sql .= ' AND p.client_id = ?'; $params[] = $filters['for_client_id']; }

        $stmt = $this->db->prepare($sql);
        $stmt->execute($params);
        return (int)$stmt->fetchColumn();
    }

    public function getById(int $id): ?array {
        $stmt = $this->db->prepare('SELECT t.*, p.name as project_name, p.client_id as client_id, CONCAT(uc.first_name, " ", uc.last_name) as client_name,
            CONCAT(cr.first_name, " ", cr.last_name) as creator_name,
            (SELECT COALESCE(SUM(te.hours), 0) FROM temps te WHERE te.ticket_id = t.id) as spent_hours
            FROM tickets t
            LEFT JOIN projets p ON t.project_id = p.id
            LEFT JOIN users uc ON p.client_id = uc.id
            LEFT JOIN users cr ON t.created_by = cr.id
            WHERE t.id = ?');
        $stmt->execute([$id]);
        return $stmt->fetch() ?: null;
    }

    public function create(array $data): int {
        $stmt = $this->db->prepare('INSERT INTO tickets (title, description, project_id, status, priority, type, estimated_hours, created_by) VALUES (?, ?, ?, ?, ?, ?, ?, ?)');
        $stmt->execute([
            $data['title'],
            $data['description'] ?? null,
            $data['project_id'] ?? null,
            $data['status'] ?? 'new',
            $data['priority'] ?? 'normal',
            $data['type'] ?? 'included',
            $data['estimated_hours'] ?? 0,
            $data['created_by'] ?? null
        ]);
        $id = (int)$this->db->lastInsertId();

        if (!empty($data['assignees'])) {
            $this->syncAssignees($id, $data['assignees']);
        }

        return $id;
    }

    public function update(int $id, array $data): bool {
        $fields = [];
        $params = [];
        $allowed = ['title', 'description', 'project_id', 'status', 'priority', 'type', 'estimated_hours'];

        foreach ($allowed as $field) {
            if (array_key_exists($field, $data)) {
                $fields[] = "$field = ?";
                $params[] = $data[$field];
            }
        }

        if (empty($fields)) return true;

        $params[] = $id;
        $sql = 'UPDATE tickets SET ' . implode(', ', $fields) . ' WHERE id = ?';
        $stmt = $this->db->prepare($sql);
        $result = $stmt->execute($params);

        if (isset($data['assignees'])) {
            $this->syncAssignees($id, $data['assignees']);
        }

        return $result;
    }

    public function delete(int $id): bool {
        $stmt = $this->db->prepare('DELETE FROM tickets WHERE id = ?');
        return $stmt->execute([$id]);
    }

    public function getAssignees(int $ticketId): array {
        $stmt = $this->db->prepare('SELECT u.id, u.last_name, u.first_name, u.email
            FROM ticket_user tu JOIN users u ON tu.user_id = u.id
            WHERE tu.ticket_id = ? ORDER BY u.last_name');
        $stmt->execute([$ticketId]);
        return $stmt->fetchAll();
    }

    public function syncAssignees(int $ticketId, array $userIds): void {
        $this->db->prepare('DELETE FROM ticket_user WHERE ticket_id = ?')->execute([$ticketId]);
        $stmt = $this->db->prepare('INSERT INTO ticket_user (ticket_id, user_id) VALUES (?, ?)');
        foreach ($userIds as $uid) {
            if ($uid) $stmt->execute([$ticketId, (int)$uid]);
        }
    }

    public function getTimeEntries(int $ticketId): array {
        $stmt = $this->db->prepare('SELECT te.*, CONCAT(u.first_name, " ", u.last_name) as user_name
            FROM temps te LEFT JOIN users u ON te.user_id = u.id
            WHERE te.ticket_id = ? ORDER BY te.date DESC');
        $stmt->execute([$ticketId]);
        return $stmt->fetchAll();
    }

    public function getComments(int $ticketId): array {
        $stmt = $this->db->prepare('SELECT c.*, CONCAT(u.first_name, " ", u.last_name) as author_name
            FROM commentaires c LEFT JOIN users u ON c.user_id = u.id
            WHERE c.ticket_id = ? ORDER BY c.created_at ASC');
        $stmt->execute([$ticketId]);
        return $stmt->fetchAll();
    }

    public function addComment(int $ticketId, int $userId, string $content): int {
        $stmt = $this->db->prepare('INSERT INTO commentaires (ticket_id, user_id, content) VALUES (?, ?, ?)');
        $stmt->execute([$ticketId, $userId, $content]);
        return (int)$this->db->lastInsertId();
    }

    public function countByStatus(): array {
        $stmt = $this->db->query('SELECT status, COUNT(*) as count FROM tickets GROUP BY status');
        return $stmt->fetchAll();
    }

    public function getToValidate(?int $clientId = null): array {
        $sql = 'SELECT t.*, p.name as project_name, p.client_id as client_id,
                (SELECT COALESCE(SUM(te.hours), 0) FROM temps te WHERE te.ticket_id = t.id) as spent_hours,
                (SELECT co.rate FROM contrats co WHERE co.project_id = t.project_id AND co.status = "active" LIMIT 1) as contract_rate
                FROM tickets t
                LEFT JOIN projets p ON t.project_id = p.id
                WHERE t.status IN ("to-validate", "validated", "refused")';
        $params = [];
        if ($clientId) {
            $sql .= ' AND p.client_id = ?';
            $params[] = $clientId;
        }
        $sql .= ' ORDER BY t.created_at DESC';
        $stmt = $this->db->prepare($sql);
        $stmt->execute($params);
        return $stmt->fetchAll();
    }
}
