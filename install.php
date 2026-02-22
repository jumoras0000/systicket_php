<?php
/**
 * Systicket 2.0 - Script d'installation
 * Crée la base de données et les tables à partir de schema.sql
 * 
 * Usage: accéder à /systicket2/install.php dans le navigateur
 * ⚠️ SUPPRIMER CE FICHIER APRÈS L'INSTALLATION
 */

// Configuration
require_once __DIR__ . '/config/config.php';

$host = DB_HOST;
$user = DB_USER;
$pass = DB_PASS;
$dbname = DB_NAME;

$messages = [];
$success = true;

try {
    // 1. Connexion sans base spécifique
    $pdo = new PDO("mysql:host=$host;charset=utf8mb4", $user, $pass, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION
    ]);
    $messages[] = ['type' => 'success', 'text' => "Connexion au serveur MySQL réussie."];

    // 2. Créer la base de données si elle n'existe pas
    $pdo->exec("CREATE DATABASE IF NOT EXISTS `$dbname` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci");
    $messages[] = ['type' => 'success', 'text' => "Base de données '$dbname' créée ou existante."];

    // 3. Se connecter à la base
    $pdo->exec("USE `$dbname`");
    $messages[] = ['type' => 'success', 'text' => "Utilisation de la base '$dbname'."];

    // 4. Charger et exécuter le schema.sql
    $schemaFile = __DIR__ . '/database/schema.sql';
    if (!file_exists($schemaFile)) {
        throw new Exception("Fichier schema.sql introuvable dans /database/schema.sql");
    }

    $sql = file_get_contents($schemaFile);
    
    // Supprimer les commentaires SQL qui pourraient poser problème
    $sql = preg_replace('/^--.*$/m', '', $sql);
    
    // Séparer les requêtes par point-virgule
    $queries = array_filter(array_map('trim', explode(';', $sql)));
    
    $tablesCreated = 0;
    $insertsExecuted = 0;
    
    foreach ($queries as $query) {
        if (empty($query)) continue;
        try {
            $pdo->exec($query);
            if (stripos($query, 'CREATE TABLE') !== false) {
                preg_match('/CREATE TABLE(?:\s+IF NOT EXISTS)?\s+`?(\w+)`?/i', $query, $m);
                $tableName = $m[1] ?? '?';
                $messages[] = ['type' => 'success', 'text' => "Table '$tableName' créée."];
                $tablesCreated++;
            } elseif (stripos($query, 'INSERT INTO') !== false) {
                $insertsExecuted++;
            }
        } catch (PDOException $e) {
            // Ignorer les erreurs "table already exists"
            if ($e->getCode() === '42S01') {
                preg_match('/CREATE TABLE(?:\s+IF NOT EXISTS)?\s+`?(\w+)`?/i', $query, $m);
                $tableName = $m[1] ?? '?';
                $messages[] = ['type' => 'info', 'text' => "Table '$tableName' existe déjà."];
            } else {
                $messages[] = ['type' => 'warning', 'text' => "Requête ignorée : " . substr($e->getMessage(), 0, 200)];
            }
        }
    }

    $messages[] = ['type' => 'success', 'text' => "$tablesCreated tables créées, $insertsExecuted insertions effectuées."];

    // 5. Vérifier les tables
    $stmt = $pdo->query("SHOW TABLES");
    $tables = $stmt->fetchAll(PDO::FETCH_COLUMN);
    $messages[] = ['type' => 'info', 'text' => "Tables dans la base : " . implode(', ', $tables)];

    // 6. Vérifier mod_rewrite
    if (function_exists('apache_get_modules')) {
        $modules = apache_get_modules();
        if (in_array('mod_rewrite', $modules)) {
            $messages[] = ['type' => 'success', 'text' => "mod_rewrite est activé."];
        } else {
            $messages[] = ['type' => 'warning', 'text' => "mod_rewrite n'est pas activé. Activez-le dans httpd.conf."];
            $success = false;
        }
    } else {
        $messages[] = ['type' => 'info', 'text' => "Impossible de vérifier mod_rewrite (non-Apache ou CGI)."];
    }

    // 7. Vérifier .htaccess
    if (file_exists(__DIR__ . '/.htaccess')) {
        $messages[] = ['type' => 'success', 'text' => "Fichier .htaccess présent."];
    } else {
        $messages[] = ['type' => 'warning', 'text' => "Fichier .htaccess manquant !"];
        $success = false;
    }

    $messages[] = ['type' => 'success', 'text' => "Installation terminée avec succès !"];

} catch (Exception $e) {
    $messages[] = ['type' => 'error', 'text' => "Erreur : " . $e->getMessage()];
    $success = false;
}
?>
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Installation - Systicket 2.0</title>
    <link rel="stylesheet" href="css/style.css">
    <style>
        body { max-width: 800px; margin: 40px auto; padding: 0 20px; background: var(--background, #f5f7fa); font-family: Inter, sans-serif; }
        .install-header { text-align: center; margin-bottom: 30px; }
        .install-header h1 { font-size: 2rem; margin-bottom: 10px; }
        .install-msg { padding: 10px 15px; margin: 5px 0; border-radius: 6px; font-size: 0.95rem; }
        .install-msg-success { background: #d4edda; color: #155724; border: 1px solid #c3e6cb; }
        .install-msg-error { background: #f8d7da; color: #721c24; border: 1px solid #f5c6cb; }
        .install-msg-warning { background: #fff3cd; color: #856404; border: 1px solid #ffeeba; }
        .install-msg-info { background: #d1ecf1; color: #0c5460; border: 1px solid #bee5eb; }
        .install-footer { text-align: center; margin-top: 30px; padding: 20px; background: #fff; border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
        .install-footer a { color: var(--primary, #5046e5); text-decoration: none; font-weight: 600; }
        .accounts-table { width: 100%; border-collapse: collapse; margin-top: 10px; }
        .accounts-table th, .accounts-table td { padding: 8px 12px; text-align: left; border-bottom: 1px solid #dee2e6; }
        .accounts-table th { background: #f8f9fa; }
    </style>
</head>
<body>
    <div class="install-header">
        <h1>🔧 Installation Systicket 2.0</h1>
        <p>Création de la base de données et des tables</p>
    </div>

    <?php foreach ($messages as $msg): ?>
    <div class="install-msg install-msg-<?= $msg['type'] ?>">
        <?php if ($msg['type'] === 'success'): ?>✅
        <?php elseif ($msg['type'] === 'error'): ?>❌
        <?php elseif ($msg['type'] === 'warning'): ?>⚠️
        <?php else: ?>ℹ️
        <?php endif; ?>
        <?= htmlspecialchars($msg['text']) ?>
    </div>
    <?php endforeach; ?>

    <?php if ($success): ?>
    <div class="install-footer">
        <h2>✅ Installation réussie !</h2>
        <p>Comptes de test disponibles :</p>
        <table class="accounts-table">
            <thead>
                <tr><th>Email</th><th>Mot de passe</th><th>Rôle</th></tr>
            </thead>
            <tbody>
                <tr><td>admin@systicket.fr</td><td>password</td><td>Admin</td></tr>
                <tr><td>collab@systicket.fr</td><td>password</td><td>Collaborateur</td></tr>
                <tr><td>client@systicket.fr</td><td>password</td><td>Client (TechCorp Solutions)</td></tr>
            </tbody>
        </table>
        <p style="margin-top: 20px;">
            <a href="<?= APP_URL ?>/connexion">→ Accéder à Systicket</a>
        </p>
        <p style="margin-top: 10px; color: #dc3545; font-size: 0.85rem;">
            ⚠️ Supprimez ce fichier <code>install.php</code> après l'installation pour des raisons de sécurité.
        </p>
    </div>
    <?php else: ?>
    <div class="install-footer">
        <h2>⚠️ Installation incomplète</h2>
        <p>Corrigez les erreurs ci-dessus et rechargez cette page.</p>
    </div>
    <?php endif; ?>
</body>
</html>
