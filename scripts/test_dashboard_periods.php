<?php
// Script de test CLI: affiche getStats pour day/week/month
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../models/DashboardModel.php';

try {
    $model = new DashboardModel();
    $periods = ['day', 'week', 'month'];
    $out = [];
    foreach ($periods as $p) {
        $out[$p] = $model->getStats('admin', null, null, $p);
    }
    echo json_encode(['success' => true, 'data' => $out], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
} catch (Throwable $e) {
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
}
