<?php
/**
 * Systicket 2.0 - Modèle Validation
 */

require_once __DIR__ . '/../config/database.php';

class ValidationModel {
    private PDO $db;

    public function __construct() {
        $this->db = Database::getInstance();
    }

    public function getAll(?int $clientId = null): array {
        $sql = 'SELECT v.*, t.title as ticket_title, p.name as project_name,
                CONCAT(u.first_name, " ", u.last_name) as validator_name
                FROM validations v
                JOIN tickets t ON v.ticket_id = t.id
                LEFT JOIN projets p ON t.project_id = p.id
                LEFT JOIN users u ON v.user_id = u.id
                WHERE 1=1';
        $params = [];

        if ($clientId) {
            $sql .= ' AND p.client_id = ?';
            $params[] = $clientId;
        }

        $sql .= ' ORDER BY v.created_at DESC';
        $stmt = $this->db->prepare($sql);
        $stmt->execute($params);
        return $stmt->fetchAll();
    }

    public function validate(int $ticketId, int $userId, ?string $comment = null): bool {
        $this->db->beginTransaction();
        try {
            // Update ticket status
            $this->db->prepare('UPDATE tickets SET status = "validated", updated_at = NOW() WHERE id = ?')
                ->execute([$ticketId]);

            // Record validation
            $this->db->prepare('INSERT INTO validations (ticket_id, user_id, status, comment) VALUES (?, ?, "validated", ?)')
                ->execute([$ticketId, $userId, $comment]);

            $this->db->commit();
            return true;
        } catch (Exception $e) {
            $this->db->rollBack();
            return false;
        }
    }

    public function refuse(int $ticketId, int $userId, ?string $comment = null): bool {
        $this->db->beginTransaction();
        try {
            $this->db->prepare('UPDATE tickets SET status = "refused", updated_at = NOW() WHERE id = ?')
                ->execute([$ticketId]);

            $this->db->prepare('INSERT INTO validations (ticket_id, user_id, status, comment) VALUES (?, ?, "refused", ?)')
                ->execute([$ticketId, $userId, $comment]);

            $this->db->commit();
            return true;
        } catch (Exception $e) {
            $this->db->rollBack();
            return false;
        }
    }
}
