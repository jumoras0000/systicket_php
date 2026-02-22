<?php
/**
 * Systicket 2.0 - Modèle Dashboard (agrégations)
 */

require_once __DIR__ . '/../config/database.php';

class DashboardModel {
    private PDO $db;

    public function __construct() {
        $this->db = Database::getInstance();
    }

    public function getStats(?string $role = 'admin', ?int $userId = null, ?int $clientId = null): array {
        $stats = [];

        // Tickets ouverts
        $sql = 'SELECT COUNT(*) FROM tickets t LEFT JOIN projets p ON t.project_id = p.id WHERE t.status IN ("new", "in-progress", "waiting-client")';
        $params = [];
        if ($role === 'collaborateur' && $userId) {
            $sql .= ' AND t.project_id IN (SELECT projet_id FROM projet_user WHERE user_id = ?)';
            $params[] = $userId;
        } elseif ($role === 'client' && $clientId) {
            $sql .= ' AND p.client_id = ?';
            $params[] = $clientId;
        }
        $stmt = $this->db->prepare($sql);
        $stmt->execute($params);
        $stats['tickets_open'] = (int)$stmt->fetchColumn();

        // Projets actifs
        $sql = 'SELECT COUNT(*) FROM projets WHERE status = "active"';
        $params = [];
        if ($role === 'collaborateur' && $userId) {
            $sql .= ' AND (manager_id = ? OR id IN (SELECT projet_id FROM projet_user WHERE user_id = ?))';
            $params = [$userId, $userId];
        } elseif ($role === 'client' && $clientId) {
            $sql .= ' AND client_id = ?';
            $params[] = $clientId;
        }
        $stmt = $this->db->prepare($sql);
        $stmt->execute($params);
        $stats['projets_active'] = (int)$stmt->fetchColumn();

        // À valider ce mois
        $sql = 'SELECT COUNT(*) FROM tickets t LEFT JOIN projets p ON t.project_id = p.id 
                WHERE t.status = "to-validate" AND t.type = "billable"';
        $params = [];
        if ($clientId) {
            $sql .= ' AND p.client_id = ?';
            $params[] = $clientId;
        }
        $stmt = $this->db->prepare($sql);
        $stmt->execute($params);
        $stats['to_validate'] = (int)$stmt->fetchColumn();

        // Heures ce mois
        $sql = 'SELECT COALESCE(SUM(hours), 0) FROM temps WHERE MONTH(date) = MONTH(CURDATE()) AND YEAR(date) = YEAR(CURDATE())';
        $params = [];
        if ($role === 'collaborateur' && $userId) {
            $sql .= ' AND user_id = ?';
            $params[] = $userId;
        }
        $stmt = $this->db->prepare($sql);
        $stmt->execute($params);
        $stats['hours_month'] = (float)$stmt->fetchColumn();

        // Enveloppe heures totale (contrats actifs)
        $sql = 'SELECT COALESCE(SUM(hours), 0) FROM contrats';
        $stmt = $this->db->query($sql);
        $stats['hours_budget'] = (float)$stmt->fetchColumn();

        // Hours consumed overall (only validated tickets)
        $sql = 'SELECT COALESCE(SUM(te.hours), 0) FROM temps te JOIN tickets tk ON te.ticket_id = tk.id WHERE tk.status = "validated"';
        $stmt = $this->db->query($sql);
        $stats['hours_consumed'] = (float)$stmt->fetchColumn();

        return $stats;
    }

    public function getTicketsByStatus(?int $userId = null, ?int $clientId = null): array {
        $sql = 'SELECT t.status, COUNT(*) as count FROM tickets t 
                LEFT JOIN projets p ON t.project_id = p.id WHERE 1=1';
        $params = [];
        if ($userId) {
            $sql .= ' AND t.project_id IN (SELECT projet_id FROM projet_user WHERE user_id = ?)';
            $params[] = $userId;
        }
        if ($clientId) {
            $sql .= ' AND p.client_id = ?';
            $params[] = $clientId;
        }
        $sql .= ' GROUP BY t.status';
        $stmt = $this->db->prepare($sql);
        $stmt->execute($params);
        return $stmt->fetchAll();
    }

    public function getHoursByProject(?int $userId = null, ?int $clientId = null): array {
        $sql = 'SELECT p.name, COALESCE(SUM(te.hours), 0) as total
            FROM temps te JOIN projets p ON te.project_id = p.id WHERE 1=1';
        $params = [];
        if ($userId) {
            $sql .= ' AND te.user_id = ?';
            $params[] = $userId;
        }
        if ($clientId) {
            $sql .= ' AND p.client_id = ?';
            $params[] = $clientId;
        }
        $sql .= ' GROUP BY p.id, p.name ORDER BY total DESC LIMIT 5';
        $stmt = $this->db->prepare($sql);
        $stmt->execute($params);
        return $stmt->fetchAll();
    }

    public function getRecentTickets(int $limit = 5, ?int $userId = null, ?int $clientId = null): array {
        $sql = 'SELECT t.id, t.title, t.status, t.created_at, p.name as project_name
                FROM tickets t LEFT JOIN projets p ON t.project_id = p.id WHERE 1=1';
        $params = [];
        if ($clientId) { $sql .= ' AND p.client_id = ?'; $params[] = $clientId; }
        $sql .= ' ORDER BY t.created_at DESC LIMIT ?';
        $params[] = $limit;
        $stmt = $this->db->prepare($sql);
        $stmt->execute($params);
        return $stmt->fetchAll();
    }

    public function getRecentActivity(int $limit = 5): array {
        $stmt = $this->db->prepare('
            (SELECT "temps" as type, te.description as label, te.hours, te.date as activity_date,
                CONCAT(u.first_name, " ", u.last_name) as user_name, p.name as project_name
             FROM temps te 
             LEFT JOIN users u ON te.user_id = u.id
             LEFT JOIN projets p ON te.project_id = p.id
             ORDER BY te.created_at DESC LIMIT ?)
            UNION ALL
            (SELECT "ticket" as type, t.title as label, NULL as hours, t.created_at as activity_date,
                CONCAT(u.first_name, " ", u.last_name) as user_name, p.name as project_name
             FROM tickets t 
             LEFT JOIN users u ON t.created_by = u.id
             LEFT JOIN projets p ON t.project_id = p.id
             ORDER BY t.created_at DESC LIMIT ?)
            ORDER BY activity_date DESC LIMIT ?
        ');
        $stmt->execute([$limit, $limit, $limit]);
        return $stmt->fetchAll();
    }

    public function getFeaturedProjects(int $limit = 3): array {
        $stmt = $this->db->prepare('SELECT p.*, CONCAT(uc.first_name, " ", uc.last_name) as client_name,
            (SELECT COUNT(*) FROM tickets WHERE project_id = p.id) as tickets_count,
            (SELECT COALESCE(SUM(te.hours), 0) FROM temps te JOIN tickets tk ON te.ticket_id = tk.id WHERE te.project_id = p.id AND tk.status = "validated") as total_hours
            FROM projets p LEFT JOIN users uc ON p.client_id = uc.id
            WHERE p.status = "active"
            ORDER BY p.created_at DESC LIMIT ?');
        $stmt->execute([$limit]);
        return $stmt->fetchAll();
    }

    /**
     * Données pour les rapports
     */
    public function getReportData(array $filters = []): array {
        $data = [];

        // Date filters
        $dateFrom = $filters['date_from'] ?? date('Y-01-01');
        $dateTo = $filters['date_to'] ?? date('Y-12-31');
        $projectId = $filters['project_id'] ?? null;
        $clientId = $filters['client_id'] ?? null;

        $dateCondition = ' AND te.date BETWEEN ? AND ?';
        $baseParams = [$dateFrom, $dateTo];

        // Total hours
        $sql = 'SELECT COALESCE(SUM(te.hours), 0) as total FROM temps te WHERE 1=1' . $dateCondition;
        $params = array_merge($baseParams);
        if ($projectId) { $sql .= ' AND te.project_id = ?'; $params[] = $projectId; }
        $stmt = $this->db->prepare($sql);
        $stmt->execute($params);
        $data['total_hours'] = (float)$stmt->fetchColumn();

        // Hours by project
        $sql = 'SELECT p.name, COALESCE(SUM(te.hours), 0) as total,
                co.hours as budget_hours, co.rate
                FROM temps te 
                JOIN projets p ON te.project_id = p.id
                LEFT JOIN contrats co ON co.project_id = p.id
                WHERE 1=1' . $dateCondition;
        $params = array_merge($baseParams);
        if ($projectId) { $sql .= ' AND te.project_id = ?'; $params[] = $projectId; }
        if ($clientId) { $sql .= ' AND p.client_id = ?'; $params[] = $clientId; }
        $sql .= ' GROUP BY p.id, p.name, co.hours, co.rate ORDER BY total DESC';
        $stmt = $this->db->prepare($sql);
        $stmt->execute($params);
        $data['hours_by_project'] = $stmt->fetchAll();

        // Hours by user
        $sql = 'SELECT CONCAT(u.first_name, " ", u.last_name) as name, COALESCE(SUM(te.hours), 0) as total
                FROM temps te JOIN users u ON te.user_id = u.id
                WHERE 1=1' . $dateCondition;
        $params = array_merge($baseParams);
        if ($projectId) { $sql .= ' AND te.project_id = ?'; $params[] = $projectId; }
        $sql .= ' GROUP BY u.id ORDER BY total DESC';
        $stmt = $this->db->prepare($sql);
        $stmt->execute($params);
        $data['hours_by_user'] = $stmt->fetchAll();

        // Tickets by status
        $sql = 'SELECT t.status, COUNT(*) as count FROM tickets t 
                LEFT JOIN projets p ON t.project_id = p.id WHERE 1=1';
        $params = [];
        if ($projectId) { $sql .= ' AND t.project_id = ?'; $params[] = $projectId; }
        if ($clientId) { $sql .= ' AND p.client_id = ?'; $params[] = $clientId; }
        $sql .= ' GROUP BY t.status';
        $stmt = $this->db->prepare($sql);
        $stmt->execute($params);
        $data['tickets_by_status'] = $stmt->fetchAll();

        // Billing summary (only count hours from validated tickets)
        $sql = 'SELECT p.name as project_name, CONCAT(uc.first_name, " ", uc.last_name) as client_name,
                co.hours as contract_hours, co.rate,
                COALESCE((SELECT SUM(te2.hours) FROM temps te2 JOIN tickets tk ON te2.ticket_id = tk.id WHERE te2.project_id = p.id AND tk.status = "validated" AND te2.date BETWEEN ? AND ?), 0) as consumed_hours
                FROM contrats co
                JOIN projets p ON co.project_id = p.id
                LEFT JOIN users uc ON co.client_id = uc.id
                WHERE 1=1';
        $params = [$dateFrom, $dateTo];
        if ($projectId) { $sql .= ' AND co.project_id = ?'; $params[] = $projectId; }
        if ($clientId) { $sql .= ' AND co.client_id = ?'; $params[] = $clientId; }
        $sql .= ' GROUP BY co.id, p.id, p.name, uc.first_name, uc.last_name, co.hours, co.rate ORDER BY p.name';
        $stmt = $this->db->prepare($sql);
        $stmt->execute($params);
        $data['billing'] = $stmt->fetchAll();

        // KPIs
        $data['total_tickets'] = $this->db->query('SELECT COUNT(*) FROM tickets')->fetchColumn();
        $data['total_projects'] = $this->db->query('SELECT COUNT(*) FROM projets')->fetchColumn();
        $data['total_clients'] = $this->db->query('SELECT COUNT(*) FROM users WHERE role = "client" AND status = "active"')->fetchColumn();

        return $data;
    }
}
