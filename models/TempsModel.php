<?php
/**
 * Systicket 2.0 - Modèle Temps
 */

require_once __DIR__ . '/../config/database.php';

class TempsModel {
    private PDO $db;

    public function __construct() {
        $this->db = Database::getInstance();
    }

    public function getAll(array $filters = []): array {
        $sql = 'SELECT te.*, t.title as ticket_title, p.name as project_name,
                CONCAT(u.first_name, " ", u.last_name) as user_name
                FROM temps te
                LEFT JOIN tickets t ON te.ticket_id = t.id
                LEFT JOIN projets p ON te.project_id = p.id
                LEFT JOIN users u ON te.user_id = u.id
                WHERE 1=1';
        $params = [];

        if (!empty($filters['user_id'])) {
            $sql .= ' AND te.user_id = ?';
            $params[] = $filters['user_id'];
        }
        if (!empty($filters['project_id'])) {
            $sql .= ' AND te.project_id = ?';
            $params[] = $filters['project_id'];
        }
        if (!empty($filters['ticket_id'])) {
            $sql .= ' AND te.ticket_id = ?';
            $params[] = $filters['ticket_id'];
        }
        if (!empty($filters['date_from'])) {
            $sql .= ' AND te.date >= ?';
            $params[] = $filters['date_from'];
        }
        if (!empty($filters['date_to'])) {
            $sql .= ' AND te.date <= ?';
            $params[] = $filters['date_to'];
        }

        $sql .= ' ORDER BY te.date DESC, te.created_at DESC';
        $stmt = $this->db->prepare($sql);
        $stmt->execute($params);
        return $stmt->fetchAll();
    }

    public function getById(int $id): ?array {
        $stmt = $this->db->prepare('SELECT te.*, t.title as ticket_title, p.name as project_name
            FROM temps te
            LEFT JOIN tickets t ON te.ticket_id = t.id
            LEFT JOIN projets p ON te.project_id = p.id
            WHERE te.id = ?');
        $stmt->execute([$id]);
        return $stmt->fetch() ?: null;
    }

    public function create(array $data): int {
        $stmt = $this->db->prepare('INSERT INTO temps (ticket_id, project_id, user_id, date, hours, description) VALUES (?, ?, ?, ?, ?, ?)');
        $stmt->execute([
            $data['ticket_id'] ?: null,
            $data['project_id'] ?: null,
            $data['user_id'] ?: null,
            $data['date'],
            $data['hours'] ?? 0,
            $data['description'] ?? null
        ]);
        return (int)$this->db->lastInsertId();
    }

    public function update(int $id, array $data): bool {
        $stmt = $this->db->prepare('UPDATE temps SET ticket_id = ?, project_id = ?, user_id = ?, date = ?, hours = ?, description = ? WHERE id = ?');
        return $stmt->execute([
            $data['ticket_id'] ?: null,
            $data['project_id'] ?: null,
            $data['user_id'] ?: null,
            $data['date'],
            $data['hours'] ?? 0,
            $data['description'] ?? null,
            $id
        ]);
    }

    public function delete(int $id): bool {
        $stmt = $this->db->prepare('DELETE FROM temps WHERE id = ?');
        return $stmt->execute([$id]);
    }

    public function getWeekSummary(?int $userId = null, ?string $weekStart = null): array {
        if (!$weekStart) {
            $weekStart = date('Y-m-d', strtotime('monday this week'));
        }
        $weekEnd = date('Y-m-d', strtotime($weekStart . ' +6 days'));

        $sql = 'SELECT COALESCE(SUM(hours), 0) as total_hours, COUNT(*) as entries
                FROM temps WHERE date BETWEEN ? AND ?';
        $params = [$weekStart, $weekEnd];

        if ($userId) {
            $sql .= ' AND user_id = ?';
            $params[] = $userId;
        }

        $stmt = $this->db->prepare($sql);
        $stmt->execute($params);
        $result = $stmt->fetch();
        $result['week_start'] = $weekStart;
        $result['week_end'] = $weekEnd;
        return $result;
    }

    public function getMonthTotal(?int $userId = null): float {
        $sql = 'SELECT COALESCE(SUM(hours), 0) FROM temps WHERE MONTH(date) = MONTH(CURDATE()) AND YEAR(date) = YEAR(CURDATE())';
        $params = [];
        if ($userId) {
            $sql .= ' AND user_id = ?';
            $params[] = $userId;
        }
        $stmt = $this->db->prepare($sql);
        $stmt->execute($params);
        return (float)$stmt->fetchColumn();
    }

    public function getHoursByProject(array $filters = []): array {
        $sql = 'SELECT p.name as project_name, p.id as project_id, COALESCE(SUM(te.hours), 0) as total_hours
                FROM temps te JOIN projets p ON te.project_id = p.id WHERE 1=1';
        $params = [];

        if (!empty($filters['date_from'])) { $sql .= ' AND te.date >= ?'; $params[] = $filters['date_from']; }
        if (!empty($filters['date_to'])) { $sql .= ' AND te.date <= ?'; $params[] = $filters['date_to']; }

        $sql .= ' GROUP BY p.id, p.name ORDER BY total_hours DESC';
        $stmt = $this->db->prepare($sql);
        $stmt->execute($params);
        return $stmt->fetchAll();
    }

    public function getHoursByUser(array $filters = []): array {
        $sql = 'SELECT CONCAT(u.first_name, " ", u.last_name) as user_name, u.id as user_id, COALESCE(SUM(te.hours), 0) as total_hours
                FROM temps te JOIN users u ON te.user_id = u.id WHERE 1=1';
        $params = [];

        if (!empty($filters['date_from'])) { $sql .= ' AND te.date >= ?'; $params[] = $filters['date_from']; }
        if (!empty($filters['date_to'])) { $sql .= ' AND te.date <= ?'; $params[] = $filters['date_to']; }

        $sql .= ' GROUP BY u.id ORDER BY total_hours DESC';
        $stmt = $this->db->prepare($sql);
        $stmt->execute($params);
        return $stmt->fetchAll();
    }
}
