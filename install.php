<?php
/* Виртуалды химия зертханасы — бір реттік орнату беті.
   Базаның деректерін және бас админнің құпиясөзін енгізіп, кестелерді жасайды. Орнатудан кейін өзін бұғаттайды. */
define('LAB_APP', 1);
require __DIR__ . '/lib.php';
header('Content-Type: text/html; charset=utf-8');
header('X-Frame-Options: DENY');
$cfgFile = __DIR__ . '/config.php';
$done = is_file($cfgFile);
$msg = ''; $ok = false;
function h($s) { return htmlspecialchars((string)$s, ENT_QUOTES, 'UTF-8'); }

if (!$done && $_SERVER['REQUEST_METHOD'] === 'POST') {
  $c = ['driver' => 'mysql', 'host' => trim($_POST['host'] ?? 'localhost'), 'port' => trim($_POST['port'] ?? ''), 'name' => trim($_POST['name'] ?? ''),
    'user' => trim($_POST['user'] ?? ''), 'pass' => (string)($_POST['pass'] ?? '')];
  $login = lab_norm_login($_POST['alogin'] ?? ''); $ap = (string)($_POST['apass'] ?? ''); $ap2 = (string)($_POST['apass2'] ?? '');
  if (!preg_match(LAB_LOGIN_RE, $login)) $msg = 'Админ логині дұрыс емес (латын әріптері, сандар, «.», «_», «-», 3–30 таңба).';
  elseif (!lab_check_pass($ap)) $msg = 'Админ құпиясөзі кемінде 6 таңба болуы керек.';
  elseif ($ap !== $ap2) $msg = 'Админ құпиясөздері сәйкес емес.';
  else {
    try {
      $db = lab_connect($c);
      lab_install($db, $login, $ap, lab_clean($_POST['afirst'] ?? '', 60), lab_clean($_POST['alast'] ?? '', 60));
      $php = "<?php\n/* Базаға қосылу деректері (install.php жасады). Бұл файлды ешкімге көрсетпеңіз. */\nif (!defined('LAB_APP')) { http_response_code(403); exit; }\nreturn " . var_export($c, true) . ";\n";
      if (@file_put_contents($cfgFile, $php, LOCK_EX) === false) $msg = 'config.php файлын жазу мүмкін болмады. Папкаға жазу рұқсатын тексеріңіз.';
      else { @chmod($cfgFile, 0640); $ok = true; $done = true; }
    } catch (Throwable $e) {
      $msg = 'Базаға қосылу мүмкін болмады: ' . $e->getMessage();
    }
  }
}
?><!DOCTYPE html>
<html lang="kk"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex">
<title>Орнату · Виртуалды химия зертханасы</title>
<style>
body{font-family:system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;background:#0f4c5c;margin:0;padding:24px 12px;color:#0f172a}
.card{max-width:560px;margin:0 auto;background:#fff;border-radius:16px;padding:24px}
h1{font-size:22px;margin:0 0 6px}h2{font-size:16px;margin:20px 0 6px;color:#0f4c5c}
label{display:block;font-size:14px;color:#475569;margin-top:10px}input{width:100%;box-sizing:border-box;font-size:16px;padding:10px;border:1px solid #cbd5e1;border-radius:8px;margin-top:4px}
.row{display:grid;grid-template-columns:1fr 1fr;gap:12px}button{margin-top:18px;background:#0f4c5c;color:#fff;border:0;border-radius:10px;padding:12px 18px;font-size:16px;font-weight:700;cursor:pointer}
.bad{background:#fee2e2;color:#991b1b;padding:10px;border-radius:8px;margin-top:12px}.ok{background:#dcfce7;color:#166534;padding:12px;border-radius:8px}
.mute{color:#64748b;font-size:13px}a{color:#0f4c5c;font-weight:700}
</style></head><body><div class="card">
<h1>Виртуалды химия зертханасы · Орнату</h1>
<?php if ($ok): ?>
  <p class="ok">Орнату сәтті аяқталды! Кестелер жасалды, мектептер тізімі мен бас админ аккаунты қосылды.</p>
  <p>Енді <a href="./">сайтқа өтіп</a>, админ логинімен кіріңіз.</p>
  <p class="mute">Қауіпсіздік үшін хостингтің файл менеджерінен <b>install.php</b> файлын өшіріп тастаңыз (ол қайта іске қосылмайды, бірақ өшірген дұрыс).</p>
<?php elseif ($done): ?>
  <p class="ok">Сайт орнатылған. Қайта орнату үшін алдымен config.php файлын өшіріңіз.</p><p><a href="./">Сайтқа өту</a></p>
<?php else: ?>
  <p class="mute">Хостинг панелінде алдымен MySQL базасы мен оның пайдаланушысын жасаңыз, сосын деректерін осында жазыңыз.</p>
  <?php if ($msg): ?><p class="bad"><?= h($msg) ?></p><?php endif; ?>
  <form method="post" autocomplete="off">
    <h2>1. MySQL базасы</h2>
    <div class="row"><label>Сервер (host)<input name="host" value="<?= h($_POST['host'] ?? 'localhost') ?>" required></label><label>Порт (міндетті емес)<input name="port" value="<?= h($_POST['port'] ?? '') ?>" inputmode="numeric"></label></div>
    <label>База атауы<input name="name" value="<?= h($_POST['name'] ?? '') ?>" required></label>
    <div class="row"><label>Пайдаланушы<input name="user" value="<?= h($_POST['user'] ?? '') ?>" required></label><label>Құпиясөзі<input name="pass" type="password"></label></div>
    <h2>2. Бас админ</h2>
    <div class="row"><label>Тегі<input name="alast" value="<?= h($_POST['alast'] ?? '') ?>"></label><label>Аты<input name="afirst" value="<?= h($_POST['afirst'] ?? '') ?>"></label></div>
    <label>Логин<input name="alogin" value="<?= h($_POST['alogin'] ?? '') ?>" required autocapitalize="none"></label>
    <div class="row"><label>Құпиясөз<input name="apass" type="password" required></label><label>Құпиясөзді қайталаңыз<input name="apass2" type="password" required></label></div>
    <button>Орнату</button>
  </form>
<?php endif; ?>
</div></body></html>
