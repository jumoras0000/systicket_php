<?php
/**
 * Systicket 2.0 - Modèle Utilisateur
 */

require_once __DIR__ . '/../config/database.php';

class UserModel {
    private PDO $db;

    public function __construct() {
        $this->db = Database::getInstance();
    }

    public function getAll(array $filters = []): array {
        $sql = 'SELECT u.*,
                (SELECT MAX(te.date) FROM temps te WHERE te.user_id = u.id) as last_activity
                FROM users u
                WHERE 1=1';
        $params = [];

        if (!empty($filters['role'])) {
            $sql .= ' AND u.role = ?';
            $params[] = $filters['role'];
        }
        if (!empty($filters['status'])) {
            $sql .= ' AND u.status = ?';
            $params[] = $filters['status'];
        }
        if (!empty($filters['search'])) {
            $sql .= ' AND (u.last_name LIKE ? OR u.first_name LIKE ? OR u.email LIKE ?)';
            $s = '%' . $filters['search'] . '%';
            $params = array_merge($params, [$s, $s, $s]);
        }

        $sql .= ' ORDER BY u.last_name ASC';
        $stmt = $this->db->prepare($sql);
        $stmt->execute($params);
        return $stmt->fetchAll();
    }

    public function getById(int $id): ?array {
        $stmt = $this->db->prepare('SELECT * FROM users WHERE id = ?');
        $stmt->execute([$id]);
        return $stmt->fetch() ?: null;
    }

    public function getByEmail(string $email): ?array {
        $stmt = $this->db->prepare('SELECT * FROM users WHERE email = ? LIMIT 1');
        $stmt->execute([$email]);
        return $stmt->fetch() ?: null;
    }

    public function create(array $data): int {
        if (empty($data['password'])) {
            throw new \InvalidArgumentException('Le mot de passe est obligatoire.');
        }
        $role = $data['role'] ?? 'collaborateur';
        $stmt = $this->db->prepare('INSERT INTO users (last_name, first_name, email, password, role, status, phone) VALUES (?, ?, ?, ?, ?, ?, ?)');
        $stmt->execute([
            $data['last_name'] ?? $data['nom'] ?? '',
            $data['first_name'] ?? $data['prenom'] ?? '',
            $data['email'],
            password_hash($data['password'], PASSWORD_BCRYPT),
            $role,
            $data['status'] ?? 'active',
            $data['phone'] ?? $data['telephone'] ?? null
        ]);
        return (int)$this->db->lastInsertId();
    }

    public function update(int $id, array $data): bool {
        $role = $data['role'] ?? 'collaborateur';
        $fields = ['last_name = ?', 'first_name = ?', 'email = ?', 'role = ?', 'status = ?', 'phone = ?'];
        $params = [
            $data['last_name'] ?? $data['nom'] ?? '',
            $data['first_name'] ?? $data['prenom'] ?? '',
            $data['email'],
            $role,
            $data['status'] ?? 'active',
            $data['phone'] ?? $data['telephone'] ?? null
        ];

        if (!empty($data['password'])) {
            $fields[] = 'password = ?';
            $params[] = password_hash($data['password'], PASSWORD_BCRYPT);
        }

        $params[] = $id;
        $sql = 'UPDATE users SET ' . implode(', ', $fields) . ' WHERE id = ?';
        $stmt = $this->db->prepare($sql);
        return $stmt->execute($params);
    }

    public function updateProfile(int $id, array $data): bool {
        $fields = ['last_name = ?', 'first_name = ?', 'phone = ?'];
        $params = [
            $data['last_name'] ?? $data['nom'] ?? '',
            $data['first_name'] ?? $data['prenom'] ?? '',
            $data['phone'] ?? $data['telephone'] ?? null
        ];

        if (!empty($data['password'])) {
            $fields[] = 'password = ?';
            $params[] = password_hash($data['password'], PASSWORD_BCRYPT);
        }

        $params[] = $id;
        $stmt = $this->db->prepare('UPDATE users SET ' . implode(', ', $fields) . ' WHERE id = ?');
        return $stmt->execute($params);
    }

    public function delete(int $id): bool {
        $stmt = $this->db->prepare('DELETE FROM users WHERE id = ?');
        return $stmt->execute([$id]);
    }

    public function getCollaborateurs(): array {
        $stmt = $this->db->prepare('SELECT id, last_name, first_name, email FROM users WHERE role IN ("admin", "collaborateur") AND status = "active" ORDER BY last_name');
        $stmt->execute();
        return $stmt->fetchAll();
    }

    public function getClients(): array {
        $stmt = $this->db->prepare('SELECT id, last_name, first_name, email FROM users WHERE role = "client" AND status = "active" ORDER BY last_name');
        $stmt->execute();
        return $stmt->fetchAll();
    }

    // Profil pending
    public function getPendingProfiles(): array {
        $stmt = $this->db->prepare('SELECT pp.*, CONCAT(u.first_name, " ", u.last_name) as current_name, u.email
            FROM profil_pending pp JOIN users u ON pp.user_id = u.id
            WHERE pp.status = "pending" ORDER BY pp.created_at DESC');
        $stmt->execute();
        return $stmt->fetchAll();
    }

    public function createPendingProfile(int $userId, array $data): int {
        // Remove existing pending
        $this->db->prepare('DELETE FROM profil_pending WHERE user_id = ? AND status = "pending"')->execute([$userId]);
        
        $stmt = $this->db->prepare('INSERT INTO profil_pending (user_id, last_name, first_name, phone) VALUES (?, ?, ?, ?)');
        $stmt->execute([
            $userId,
            $data['last_name'] ?? $data['nom'] ?? '',
            $data['first_name'] ?? $data['prenom'] ?? '',
            $data['phone'] ?? $data['telephone'] ?? null
        ]);
        return (int)$this->db->lastInsertId();
    }

    public function approvePendingProfile(int $pendingId): bool {
        $stmt = $this->db->prepare('SELECT * FROM profil_pending WHERE id = ? AND status = "pending"');
        $stmt->execute([$pendingId]);
        $pending = $stmt->fetch();
        if (!$pending) return false;

        // Apply changes
        $this->db->prepare('UPDATE users SET last_name = ?, first_name = ?, phone = ? WHERE id = ?')
            ->execute([$pending['last_name'], $pending['first_name'], $pending['phone'], $pending['user_id']]);

        // Mark as approved
        $this->db->prepare('UPDATE profil_pending SET status = "approved", processed_at = NOW() WHERE id = ?')
            ->execute([$pendingId]);

        return true;
    }

    public function rejectPendingProfile(int $pendingId): bool {
        $stmt = $this->db->prepare('UPDATE profil_pending SET status = "rejected", processed_at = NOW() WHERE id = ?');
        return $stmt->execute([$pendingId]);
    }
}
