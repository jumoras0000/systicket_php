-- ============================================================
-- Systicket 2.0 - Schema de base de donnees MySQL/MariaDB
-- Le CLIENT est un UTILISATEUR avec role='client'
-- Convention : noms de colonnes en anglais
-- ============================================================

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;
DROP DATABASE IF EXISTS `systicket`;
CREATE DATABASE IF NOT EXISTS `systicket` 
    CHARACTER SET utf8mb4 
    COLLATE utf8mb4_unicode_ci;

USE `systicket`;

-- ============================================================
-- Table : users
-- ============================================================
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
    `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `last_name` VARCHAR(100) NOT NULL,
    `first_name` VARCHAR(100) NOT NULL,
    `email` VARCHAR(255) NOT NULL UNIQUE,
    `password` VARCHAR(255) NOT NULL,
    `role` ENUM('admin', 'collaborateur', 'client') NOT NULL DEFAULT 'collaborateur',
    `status` ENUM('active', 'inactive') NOT NULL DEFAULT 'active',
    `phone` VARCHAR(50) DEFAULT NULL,
    `last_login` DATETIME DEFAULT NULL,
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
    INDEX `idx_users_role` (`role`),
    INDEX `idx_users_status` (`status`),
    INDEX `idx_users_email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- Table : projets
-- client_id reference un utilisateur avec role='client'
-- ============================================================
DROP TABLE IF EXISTS `projets`;
CREATE TABLE `projets` (
    `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(255) NOT NULL,
    `description` TEXT DEFAULT NULL,
    `client_id` INT UNSIGNED DEFAULT NULL COMMENT 'User with role=client',
    `status` ENUM('active', 'paused', 'completed') NOT NULL DEFAULT 'active',
    `start_date` DATE DEFAULT NULL,
    `end_date` DATE DEFAULT NULL,
    `manager_id` INT UNSIGNED DEFAULT NULL,
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
    INDEX `idx_projets_status` (`status`),
    INDEX `idx_projets_client` (`client_id`),
    CONSTRAINT `fk_projets_client` FOREIGN KEY (`client_id`) 
        REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT `fk_projets_manager` FOREIGN KEY (`manager_id`) 
        REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- Table pivot : projet_user
-- ============================================================
DROP TABLE IF EXISTS `projet_user`;
CREATE TABLE `projet_user` (
    `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `projet_id` INT UNSIGNED NOT NULL,
    `user_id` INT UNSIGNED NOT NULL,
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY `uk_projet_user` (`projet_id`, `user_id`),
    CONSTRAINT `fk_pu_projet` FOREIGN KEY (`projet_id`) 
        REFERENCES `projets`(`id`) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT `fk_pu_user` FOREIGN KEY (`user_id`) 
        REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- Table : tickets
-- ============================================================
DROP TABLE IF EXISTS `tickets`;
CREATE TABLE `tickets` (
    `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `title` VARCHAR(255) NOT NULL,
    `description` TEXT DEFAULT NULL,
    `project_id` INT UNSIGNED DEFAULT NULL,
    `status` ENUM('new', 'in-progress', 'waiting-client', 'done', 'to-validate', 'validated', 'refused') NOT NULL DEFAULT 'new',
    `priority` ENUM('low', 'normal', 'high', 'critical') NOT NULL DEFAULT 'normal',
    `type` ENUM('included', 'billable') NOT NULL DEFAULT 'included',
    `estimated_hours` DECIMAL(8,2) DEFAULT 0,
    `created_by` INT UNSIGNED DEFAULT NULL,
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
    INDEX `idx_tickets_status` (`status`),
    INDEX `idx_tickets_priority` (`priority`),
    INDEX `idx_tickets_type` (`type`),
    INDEX `idx_tickets_project` (`project_id`),
    CONSTRAINT `fk_tickets_project` FOREIGN KEY (`project_id`) 
        REFERENCES `projets`(`id`) ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT `fk_tickets_creator` FOREIGN KEY (`created_by`) 
        REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- Table pivot : ticket_user
-- ============================================================
DROP TABLE IF EXISTS `ticket_user`;
CREATE TABLE `ticket_user` (
    `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `ticket_id` INT UNSIGNED NOT NULL,
    `user_id` INT UNSIGNED NOT NULL,
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY `uk_ticket_user` (`ticket_id`, `user_id`),
    CONSTRAINT `fk_tu_ticket` FOREIGN KEY (`ticket_id`) 
        REFERENCES `tickets`(`id`) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT `fk_tu_user` FOREIGN KEY (`user_id`) 
        REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- Table : contrats
-- client_id reference un utilisateur avec role='client'
-- ============================================================
DROP TABLE IF EXISTS `contrats`;
CREATE TABLE `contrats` (
    `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `reference` VARCHAR(50) DEFAULT NULL,
    `project_id` INT UNSIGNED DEFAULT NULL,
    `client_id` INT UNSIGNED DEFAULT NULL COMMENT 'User with role=client',
    `hours` DECIMAL(8,2) NOT NULL DEFAULT 0,
    `rate` DECIMAL(10,2) NOT NULL DEFAULT 0,
    `status` ENUM('active', 'expired', 'cancelled') NOT NULL DEFAULT 'active',
    `start_date` DATE DEFAULT NULL,
    `end_date` DATE DEFAULT NULL,
    `notes` TEXT DEFAULT NULL,
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
    INDEX `idx_contrats_project` (`project_id`),
    INDEX `idx_contrats_client` (`client_id`),
    INDEX `idx_contrats_status` (`status`),
    CONSTRAINT `fk_contrats_project` FOREIGN KEY (`project_id`) 
        REFERENCES `projets`(`id`) ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT `fk_contrats_client` FOREIGN KEY (`client_id`) 
        REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- Table : temps
-- ============================================================
DROP TABLE IF EXISTS `temps`;
CREATE TABLE `temps` (
    `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `ticket_id` INT UNSIGNED DEFAULT NULL,
    `project_id` INT UNSIGNED DEFAULT NULL,
    `user_id` INT UNSIGNED DEFAULT NULL,
    `date` DATE NOT NULL,
    `hours` DECIMAL(8,2) NOT NULL DEFAULT 0,
    `description` VARCHAR(500) DEFAULT NULL,
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
    INDEX `idx_temps_ticket` (`ticket_id`),
    INDEX `idx_temps_project` (`project_id`),
    INDEX `idx_temps_user` (`user_id`),
    INDEX `idx_temps_date` (`date`),
    CONSTRAINT `fk_temps_ticket` FOREIGN KEY (`ticket_id`) 
        REFERENCES `tickets`(`id`) ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT `fk_temps_project` FOREIGN KEY (`project_id`) 
        REFERENCES `projets`(`id`) ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT `fk_temps_user` FOREIGN KEY (`user_id`) 
        REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- Table : commentaires
-- ============================================================
DROP TABLE IF EXISTS `commentaires`;
CREATE TABLE `commentaires` (
    `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `ticket_id` INT UNSIGNED NOT NULL,
    `user_id` INT UNSIGNED DEFAULT NULL,
    `content` TEXT NOT NULL,
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    INDEX `idx_commentaires_ticket` (`ticket_id`),
    CONSTRAINT `fk_commentaires_ticket` FOREIGN KEY (`ticket_id`) 
        REFERENCES `tickets`(`id`) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT `fk_commentaires_user` FOREIGN KEY (`user_id`) 
        REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- Table : validations
-- ============================================================
DROP TABLE IF EXISTS `validations`;
CREATE TABLE `validations` (
    `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `ticket_id` INT UNSIGNED NOT NULL,
    `user_id` INT UNSIGNED DEFAULT NULL,
    `status` ENUM('validated', 'refused') NOT NULL,
    `comment` TEXT DEFAULT NULL,
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    INDEX `idx_validations_ticket` (`ticket_id`),
    CONSTRAINT `fk_validations_ticket` FOREIGN KEY (`ticket_id`) 
        REFERENCES `tickets`(`id`) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT `fk_validations_user` FOREIGN KEY (`user_id`) 
        REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- Table : profil_pending
-- ============================================================
DROP TABLE IF EXISTS `profil_pending`;
CREATE TABLE `profil_pending` (
    `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `user_id` INT UNSIGNED NOT NULL,
    `last_name` VARCHAR(100) DEFAULT NULL,
    `first_name` VARCHAR(100) DEFAULT NULL,
    `phone` VARCHAR(50) DEFAULT NULL,
    `status` ENUM('pending', 'approved', 'rejected') NOT NULL DEFAULT 'pending',
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `processed_at` DATETIME DEFAULT NULL,
    INDEX `idx_pp_user` (`user_id`),
    INDEX `idx_pp_status` (`status`),
    CONSTRAINT `fk_pp_user` FOREIGN KEY (`user_id`) 
        REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- DONNEES DE DEMONSTRATION
-- Mot de passe pour TOUS les comptes : password
-- Le client = utilisateur avec role='client'
-- projets.client_id et contrats.client_id referencent users.id
-- ============================================================

INSERT INTO `users` (`id`, `last_name`, `first_name`, `email`, `password`, `role`, `status`, `phone`, `last_login`) VALUES
(1,  'Dupont',  'Jean',    'admin@systicket.fr',    '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin',         'active',   '01 23 45 67 89', '2026-02-08 10:00:00'),
(2,  'Martin',  'Marie',   'collab@systicket.fr',   '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'collaborateur', 'active',   '06 12 34 56 78', '2026-02-07 14:30:00'),
(3,  'Leroy',   'Pierre',  'client@systicket.fr',   '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'client',        'active',   '03 12 34 56 78', NULL),
(4,  'Bernard', 'Sophie',  'sophie@greenit.fr',     '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'client',        'active',   '05 67 89 01 23', NULL),
(5,  'Petit',   'Lucas',   'lucas@logisys.fr',      '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'client',        'active',   '02 98 76 54 32', NULL),
(6,  'Dubois',  'Emma',    'emma@systicket.fr',     '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'collaborateur', 'active',   '01 45 67 89 10', '2026-02-05 09:00:00'),
(7,  'Morel',   'Hugo',    'hugo@systicket.fr',     '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'collaborateur', 'active',   '09 87 65 43 21', '2026-02-04 11:00:00'),
(8,  'Garnier', 'Chloe',   'chloe@alpina.fr',       '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'client',        'active',   '04 56 78 90 12', NULL),
(9,  'Lefevre', 'Nicolas', 'nicolas@urbanweb.fr',   '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'client',        'active',   '01 23 98 76 54', NULL),
(10, 'Marin',   'Isabelle','isabelle@blueocean.fr',  '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'client',        'inactive', '03 21 43 65 87', NULL),
(11, 'Durand',  'Marie',   'marie@techsol.fr',      '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'client',        'active',   '04 78 12 34 56', NULL),
(12, 'Renard',  'Claire',  'claire@mediacorp.fr',   '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'client',        'inactive', '01 45 67 89 11', NULL),
(13, 'Noir',    'Thomas',  'thomas@nextgensoft.fr',  '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'client',        'active',   '09 87 65 43 22', NULL);

INSERT INTO `projets` (`id`, `name`, `description`, `client_id`, `status`, `start_date`, `end_date`, `manager_id`) VALUES
(1,  'Site e-commerce',      'Developpement d''un site e-commerce complet avec panier, paiement et back-office.',              3,  'active',    '2025-01-15', '2025-06-30', 1),
(2,  'Application mobile',   'Application mobile cross-platform (iOS/Android) avec API REST.',                                  11, 'active',    '2025-02-01', '2025-08-31', 2),
(3,  'Refonte site vitrine', 'Refonte complete du site vitrine : design, integration et referencement.',                        3,  'completed', '2024-10-01', '2025-01-15', 1),
(4,  'Intranet RH',          'Mise en place d''un intranet pour la gestion RH.',                                                4,  'active',    '2025-03-01', '2025-09-30', 2),
(5,  'ERP Logistique',       'Deploiement d''un ERP pour la gestion logistique.',                                               5,  'active',    '2025-04-15', '2025-12-31', 6),
(6,  'Campagne pub',         'Campagne publicitaire multi-canal.',                                                              12, 'paused',    '2025-05-01', '2025-07-31', 7),
(7,  'Plateforme SaaS',      'Developpement d''une plateforme SaaS B2B.',                                                       13, 'active',    '2025-06-01', '2026-01-31', 6),
(8,  'Audit securite',       'Audit de securite informatique.',                                                                 8,  'completed', '2024-11-01', '2025-02-28', 1),
(9,  'Refonte UX',           'Refonte de l''experience utilisateur.',                                                            9,  'active',    '2025-07-01', '2025-10-31', 7),
(10, 'Portail client',       'Creation d''un portail client personnalise.',                                                     10, 'active',    '2025-08-01', '2026-02-28', 2);

INSERT INTO `projet_user` (`projet_id`, `user_id`) VALUES
(1, 1), (1, 2),
(2, 2), (2, 7),
(3, 1),
(4, 2), (4, 6),
(5, 6), (5, 7),
(6, 7),
(7, 6), (7, 2),
(8, 1), (8, 7),
(9, 7), (9, 6),
(10, 2);

INSERT INTO `tickets` (`id`, `title`, `description`, `project_id`, `status`, `priority`, `type`, `estimated_hours`, `created_by`) VALUES
(1,  'Maquettes homepage',     'Creer les maquettes de la page d''accueil selon le cahier des charges.', 1,  'done',           'high',     'included', 8.00,  1),
(2,  'Integration panier',     'Integrer le systeme de panier avec gestion des quantites.', 1,  'in-progress',    'high',     'billable', 24.00, 1),
(3,  'API authentification',   'Mettre en place l''API d''authentification JWT.',                2,  'to-validate',    'critical', 'billable', 16.00, 2),
(4,  'Deploiement serveur',    'Deployer l''application sur le serveur de production.',            3,  'validated',      'normal',   'included', 10.00, 1),
(5,  'Tests unitaires',        'Ecrire des tests unitaires pour les modules principaux.',          4,  'new',            'normal',   'included', 12.00, 2),
(6,  'Migration base',         'Migrer la base de donnees vers MariaDB 10.6.',                    5,  'to-validate',    'high',     'billable', 20.00, 6),
(7,  'Campagne emailing',      'Lancer une campagne emailing pour la nouvelle offre.',             6,  'in-progress',    'normal',   'billable', 15.00, 7),
(8,  'Refonte dashboard',      'Moderniser le dashboard utilisateur.',                             7,  'waiting-client', 'high',     'included', 18.00, 6),
(9,  'Audit securite serveur', 'Realiser un audit de securite complet du serveur.',                8,  'done',           'critical', 'billable', 22.00, 1),
(10, 'UX tests utilisateurs',  'Organiser des tests utilisateurs sur la nouvelle interface.',      9,  'to-validate',    'normal',   'billable', 14.00, 7);

INSERT INTO `ticket_user` (`ticket_id`, `user_id`) VALUES
(1, 1),
(2, 1), (2, 2),
(3, 2),
(4, 1),
(5, 2), (5, 6),
(6, 6),
(7, 7),
(8, 6), (8, 7),
(9, 1), (9, 7),
(10, 7);

INSERT INTO `contrats` (`id`, `reference`, `project_id`, `client_id`, `hours`, `rate`, `status`, `start_date`, `end_date`, `notes`) VALUES
(1,  'CTR-2025-001', 1,  3,   100.00,  80.00, 'active',    '2025-01-15', '2025-06-30', 'Contrat annuel de maintenance et developpement.'),
(2,  'CTR-2025-002', 2,  11,   80.00,  90.00, 'active',    '2025-02-01', '2025-08-31', NULL),
(3,  'CTR-2025-003', 3,  3,    60.00,  75.00, 'expired',   '2024-10-01', '2025-01-15', 'Contrat termine.'),
(4,  'CTR-2025-004', 4,  4,   120.00,  85.00, 'active',    '2025-03-01', '2025-09-30', NULL),
(5,  'CTR-2025-005', 5,  5,    90.00,  95.00, 'active',    '2025-04-15', '2025-12-31', 'ERP logistique.'),
(6,  'CTR-2025-006', 6,  12,   50.00, 110.00, 'cancelled', '2025-05-01', '2025-07-31', 'Campagne annulee.'),
(7,  'CTR-2025-007', 7,  13,  200.00, 120.00, 'active',    '2025-06-01', '2026-01-31', NULL),
(8,  'CTR-2025-008', 8,  8,    30.00,  70.00, 'expired',   '2024-11-01', '2025-02-28', NULL),
(9,  'CTR-2025-009', 9,  9,   110.00, 105.00, 'active',    '2025-07-01', '2025-10-31', NULL),
(10, 'CTR-2025-010', 10, 10,   75.00, 100.00, 'active',    '2025-08-01', '2026-02-28', 'Portail client premium.');

INSERT INTO `temps` (`id`, `ticket_id`, `project_id`, `user_id`, `date`, `hours`, `description`) VALUES
(1,  1,  1,  1, '2025-02-01',  8.00, 'Creation des maquettes Figma'),
(2,  2,  1,  2, '2025-02-05',  4.00, 'Integration HTML/CSS du panier'),
(3,  3,  2,  2, '2025-03-10',  6.00, 'Developpement API JWT'),
(4,  4,  3,  1, '2025-04-12', 10.00, 'Deploiement sur serveur prod'),
(5,  5,  4,  2, '2025-05-20',  5.00, 'Ecriture des tests unitaires - partie 1'),
(6,  5,  4,  6, '2025-05-22',  7.00, 'Ecriture des tests unitaires - partie 2'),
(7,  6,  5,  6, '2025-06-15', 20.00, 'Migration base de donnees complete'),
(8,  7,  6,  7, '2025-07-10', 15.00, 'Campagne emailing - mise en place'),
(9,  8,  7,  6, '2025-08-05', 10.00, 'Refonte dashboard - maquettes'),
(10, 8,  7,  7, '2025-08-08',  8.00, 'Refonte dashboard - integration'),
(11, 9,  8,  1, '2025-09-01', 12.00, 'Audit securite - scan vulnerabilites'),
(12, 9,  8,  7, '2025-09-03', 10.00, 'Audit securite - rapport'),
(13, 10, 9,  7, '2025-10-10',  8.00, 'Organisation tests utilisateurs'),
(14, 10, 9,  6, '2025-10-12',  6.00, 'Analyse resultats tests UX'),
(15, 2,  1,  1, '2026-02-10',  3.00, 'Integration panier - paiement Stripe'),
(16, 2,  1,  2, '2026-02-12',  5.00, 'Integration panier - tests fonctionnels'),
(17, 3,  2,  2, '2026-02-15',  4.00, 'API auth - corrections refresh token'),
(18, 3,  2,  7, '2026-02-16',  3.00, 'API auth - tests d''integration');

INSERT INTO `commentaires` (`id`, `ticket_id`, `user_id`, `content`, `created_at`) VALUES
(1,  1,  1, 'Super travail sur les maquettes !', '2025-02-02 10:00:00'),
(2,  2,  2, 'Panier fonctionnel, a tester cote client.', '2025-02-06 11:30:00'),
(3,  3,  2, 'API JWT en place, en attente de validation client.', '2025-03-11 09:15:00'),
(4,  4,  1, 'Deploiement reussi.', '2025-04-13 16:45:00'),
(5,  5,  6, 'Tests unitaires en cours de redaction.', '2025-05-21 14:20:00'),
(6,  6,  6, 'Migration terminee, a valider par le client.', '2025-06-16 17:00:00'),
(7,  7,  7, 'Campagne emailing lancee.', '2025-07-11 08:30:00'),
(8,  8,  7, 'Dashboard modernise, en attente retour client.', '2025-08-06 13:10:00'),
(9,  9,  1, 'Audit securite termine, rapport transmis.', '2025-09-02 15:00:00'),
(10, 10, 7, 'Tests utilisateurs organises, resultats en analyse.', '2025-10-11 10:50:00'),
(11, 3,  3, 'Nous allons examiner l''API cette semaine.', '2025-03-12 10:00:00'),
(12, 8,  9, 'Le dashboard est bien, mais quelques ajustements souhaites.', '2025-08-10 11:00:00');

INSERT INTO `validations` (`id`, `ticket_id`, `user_id`, `status`, `comment`, `created_at`) VALUES
(1, 4, 3, 'validated', NULL, '2025-04-14 09:00:00'),
(2, 9, 8, 'validated', 'Audit conforme, RAS.', '2025-09-05 10:00:00');

INSERT INTO `profil_pending` (`id`, `user_id`, `last_name`, `first_name`, `phone`, `status`, `created_at`, `processed_at`) VALUES
(1, 3, 'Leroy',   'Pierre',  '03 00 00 00 00', 'pending', '2026-02-01 10:00:00', NULL),
(2, 4, 'Bernard', 'Sophie',  '05 00 00 00 00', 'pending', '2026-02-02 11:00:00', NULL);

SET FOREIGN_KEY_CHECKS = 1;
