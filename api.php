<?php
/* Виртуалды химия зертханасы — API нүктесі. Сайт осы файлға POST сұраныс жібереді. */
define('LAB_APP', 1);
header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');
header('Cache-Control: no-store');
require __DIR__ . '/lib.php';

function lab_out(array $r): void { echo json_encode($r, JSON_UNESCAPED_UNICODE); exit; }

if ($_SERVER['REQUEST_METHOD'] !== 'POST') lab_out(['ok' => true, 'service' => 'virtual-lab']);
$cfgFile = __DIR__ . '/config.php';
if (!is_file($cfgFile)) lab_out(lab_err('notInstalled'));
$raw = file_get_contents('php://input', false, null, 0, 200000);
$req = json_decode((string)$raw, true);
if (!is_array($req)) lab_out(lab_err('unknown'));
try {
  $db = lab_connect(require $cfgFile);
  lab_out(lab_handle($db, $req));
} catch (Throwable $e) {
  error_log('virtual-lab: ' . $e->getMessage());
  lab_out(lab_err('server'));
}
