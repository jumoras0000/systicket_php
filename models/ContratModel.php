<?php
/**
 * Systicket 2.0 - Modèle Contrat
 */

require_once __DIR__ . '/../config/database.php';

class ContratModel {
    private PDO $db;

    public function __construct() {
        $this->db = Database::getInstance();
    }

    public function getAll(array $filters = []): array {
        $sql = 'SELECT co.*, p.name as project_name, CONCAT(uc.first_name, " ", uc.last_name) as client_name,
                COALESCE((SELECT SUM(te.hours) FROM temps te JOIN tickets tk ON te.ticket_id = tk.id WHERE te.project_id = co.project_id AND tk.status = "validated"), 0) as consumed_hours
                FROM contrats co
                LEFT JOIN projets p ON co.project_id = p.id
                LEFT JOIN users uc ON co.client_id = uc.id
                WHERE 1=1';
        $params = [];

        if (!empty($filters['client_id'])) {
            $sql .= ' AND co.client_id = ?';
            $params[] = $filters['client_id'];
        }
        if (!empty($filters['project_id'])) {
            $sql .= ' AND co.project_id = ?';
            $params[] = $filters['project_id'];
        }
        if (!empty($filters['status'])) {
            $sql .= ' AND co.status = ?';
            $params[] = $filters['status'];
        }
        if (!empty($filters['for_client_id'])) {
            $sql .= ' AND co.client_id = ?';
            $params[] = $filters['for_client_id'];
        }
        if (!empty($filters['search'])) {
            $sql .= ' AND (p.name LIKE ? OR uc.last_name LIKE ? OR uc.first_name LIKE ? OR co.reference LIKE ?)';
            $s = '%' . $filters['search'] . '%';
            $params = array_merge($params, [$s, $s, $s, $s]);
        }

        $sql .= ' ORDER BY co.created_at DESC';
        $stmt = $this->db->prepare($sql);
        $stmt->execute($params);
        return $stmt->fetchAll();
    }

    public function getById(int $id): ?array {
        $stmt = $this->db->prepare('SELECT co.*, p.name as project_name, CONCAT(uc.first_name, " ", uc.last_name) as client_name,
            COALESCE((SELECT SUM(te.hours) FROM temps te JOIN tickets tk ON te.ticket_id = tk.id WHERE te.project_id = co.project_id AND tk.status = "validated"), 0) as consumed_hours
            FROM contrats co
            LEFT JOIN projets p ON co.project_id = p.id
            LEFT JOIN users uc ON co.client_id = uc.id
            WHERE co.id = ?');
        $stmt->execute([$id]);
        return $stmt->fetch() ?: null;
    }

    public function create(array $data): int {
        $stmt = $this->db->prepare('INSERT INTO contrats (project_id, client_id, hours, rate, start_date, end_date, reference, status, notes) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)');
        $stmt->execute([
            $data['project_id'] ?: null,
            $data['client_id'] ?: null,
            $data['hours'] ?? 0,
            $data['rate'] ?? 0,
            $data['start_date'] ?: null,
            $data['end_date'] ?: null,
            $data['reference'] ?? null,
            $data['status'] ?? 'active',
            $data['notes'] ?? null
        ]);
        return (int)$this->db->lastInsertId();
    }

    public function update(int $id, array $data): bool {
        $stmt = $this->db->prepare('UPDATE contrats SET project_id = ?, client_id = ?, hours = ?, rate = ?, start_date = ?, end_date = ?, reference = ?, status = ?, notes = ? WHERE id = ?');
        return $stmt->execute([
            $data['project_id'] ?: null,
            $data['client_id'] ?: null,
            $data['hours'] ?? 0,
            $data['rate'] ?? 0,
            $data['start_date'] ?: null,
            $data['end_date'] ?: null,
            $data['reference'] ?? null,
            $data['status'] ?? 'active',
            $data['notes'] ?? null,
            $id
        ]);
    }

    public function delete(int $id): bool {
        $stmt = $this->db->prepare('DELETE FROM contrats WHERE id = ?');
        return $stmt->execute([$id]);
    }

    public function getLinkedTickets(int $contratId): array {
        $contrat = $this->getById($contratId);
        if (!$contrat || !$contrat['project_id']) return [];
        
        $stmt = $this->db->prepare('SELECT t.*, 
            COALESCE((SELECT SUM(hours) FROM temps WHERE ticket_id = t.id), 0) as spent_hours
            FROM tickets t WHERE t.project_id = ? ORDER BY t.created_at DESC');
        $stmt->execute([$contrat['project_id']]);
        return $stmt->fetchAll();
    }

    public function getSummary(): array {
        $stmt = $this->db->query('SELECT 
            COALESCE(SUM(co.hours), 0) as total_hours,
            COALESCE(SUM((SELECT COALESCE(SUM(te.hours), 0) FROM temps te JOIN tickets tk ON te.ticket_id = tk.id WHERE te.project_id = co.project_id AND tk.status = "validated")), 0) as consumed_hours,
            COUNT(*) as total_contracts
            FROM contrats co');
        return $stmt->fetch();
    }
}
