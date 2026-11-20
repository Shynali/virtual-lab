<?php
/* ===== Виртуалды химия зертханасы — сервер логикасы (PHP + MySQL) =====
   Бұл файлды тікелей ашуға болмайды: оны api.php мен install.php қосады. */
if (!defined('LAB_APP')) { http_response_code(403); exit; }

const LAB_SESSION_DAYS = 30;
const LAB_CLASS_RE = '/^(7|8|9|10|11)[^\d\s]{1,2}$/u';
const LAB_LOGIN_RE = '/^[a-z0-9_.\-]{3,30}$/';
const LAB_SEED_SCHOOLS = ["№1 мектеп-гимназиясы", "№2 орта мектебі", "№3 орта мектебі", "№5 орта мектебі", "№6 орта мектебі", "№7 орта мектебі",
  "Ғани Мұратбаев атындағы гимназия", "Н. Киікбаев атындағы мектеп-гимназия", "Абай атындағы орта мектебі", "Амангелді атындағы орта мектебі",
  "Ы. Алтынсарин атындағы орта мектебі", "А. Суханбаев атындағы орта мектебі", "С. Сейфуллин атындағы орта мектебі", "Т. Ақбозов атындағы орта мектебі",
  "Н. Ақшабаев атындағы орта мектебі", "С. Абланов атындағы орта мектебі", "М. Әуезов атындағы орта мектебі", "Жамбыл атындағы орта мектебі",
  "А. Пушкин атындағы орта мектебі", "Ю. Гагарин атындағы орта мектебі", "Ш. Уәлиханов атындағы орта мектебі", "Ғ. Әбдірахманов атындағы орта мектебі",
  "Еңбек орта мектебі", "Үлгілі орта мектебі", "Қарасу орта мектебі", "Түймекент орта мектебі", "Қостөбе орта мектебі", "Жаңатұрмыс орта мектебі",
  "Көктал орта мектебі", "Мырзатай орта мектебі", "Сарыбарақ орта мектебі", "Қосақ негізгі мектебі", "Аққия бастауыш мектебі"];

/* ---------- база ---------- */
function lab_connect(array $c): PDO {
  if (($c['driver'] ?? 'mysql') === 'sqlite') {
    $pdo = new PDO('sqlite:' . $c['path']);
  } else {
    $dsn = 'mysql:host=' . $c['host'] . ';dbname=' . $c['name'] . ';charset=utf8mb4' . (!empty($c['port']) ? ';port=' . (int)$c['port'] : '');
    $pdo = new PDO($dsn, $c['user'], $c['pass']);
  }
  $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
  $pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
  return $pdo;
}
function lab_schema(PDO $db): void {
  $my = $db->getAttribute(PDO::ATTR_DRIVER_NAME) === 'mysql';
  $tail = $my ? ' ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci' : '';
  $big = $my ? 'MEDIUMTEXT' : 'TEXT';
  $db->exec("CREATE TABLE IF NOT EXISTS lab_users (id VARCHAR(32) PRIMARY KEY, role VARCHAR(10) NOT NULL, login VARCHAR(40) NOT NULL UNIQUE, hash VARCHAR(255) NOT NULL,
    first VARCHAR(80) NOT NULL DEFAULT '', last VARCHAR(80) NOT NULL DEFAULT '', school_id VARCHAR(16) NOT NULL DEFAULT '', classes VARCHAR(600) NOT NULL DEFAULT '',
    cls VARCHAR(8) NOT NULL DEFAULT '', teacher_id VARCHAR(32) NOT NULL DEFAULT '', status VARCHAR(10) NOT NULL, must_change INT NOT NULL DEFAULT 0, created VARCHAR(30) NOT NULL)$tail");
  $db->exec("CREATE TABLE IF NOT EXISTS lab_schools (id VARCHAR(16) PRIMARY KEY, name VARCHAR(200) NOT NULL, approved INT NOT NULL DEFAULT 1)$tail");
  $db->exec("CREATE TABLE IF NOT EXISTS lab_subs (id VARCHAR(32) PRIMARY KEY, student_id VARCHAR(32) NOT NULL, teacher_id VARCHAR(32) NOT NULL, lab_id VARCHAR(20) NOT NULL,
    answers $big NOT NULL, submitted_at VARCHAR(30) NOT NULL, feedback TEXT NOT NULL, feedback_at VARCHAR(30) NOT NULL DEFAULT '', UNIQUE (student_id, lab_id))$tail");
  $db->exec("CREATE TABLE IF NOT EXISTS lab_sessions (token VARCHAR(64) PRIMARY KEY, user_id VARCHAR(32) NOT NULL, expires VARCHAR(30) NOT NULL)$tail");
}
function lab_q(PDO $db, string $sql, array $p = []): PDOStatement { $s = $db->prepare($sql); $s->execute($p); return $s; }
function lab_all(PDO $db, string $sql, array $p = []): array { return lab_q($db, $sql, $p)->fetchAll(); }
function lab_one(PDO $db, string $sql, array $p = []) { $r = lab_q($db, $sql, $p)->fetch(); return $r ?: null; }

/* ---------- көмекшілер ---------- */
function lab_rid(int $n = 12): string { $c = 'abcdefghijkmnopqrstuvwxyz23456789'; $s = ''; for ($i = 0; $i < $n; $i++) $s .= $c[random_int(0, strlen($c) - 1)]; return $s; }
function lab_temp(): string { $s = ''; for ($i = 0; $i < 6; $i++) $s .= random_int(0, 9); return $s; }
function lab_now(): string { return gmdate('Y-m-d\TH:i:s\Z'); }
function lab_err(string $code): array { return ['ok' => false, 'error' => $code]; }
function lab_clean($s, int $max = 120): string {
  $s = is_scalar($s) ? (string)$s : '';
  $s = preg_replace('/[\x00-\x1F\x7F]/u', '', $s) ?? '';
  return mb_substr(trim($s), 0, $max);
}
function lab_norm_login($s): string { return mb_strtolower(lab_clean($s, 40)); }
function lab_grade($cls): int { return preg_match('/^(\d+)/', (string)$cls, $m) ? (int)$m[1] : 0; }
function lab_check_pass($p): bool { return is_string($p) && mb_strlen($p) >= 6 && mb_strlen($p) <= 64; }
function lab_classes($arr): array {
  $out = [];
  foreach ((array)$arr as $c) { $c = lab_clean($c, 6); if (preg_match(LAB_CLASS_RE, $c) && !in_array($c, $out, true)) $out[] = $c; }
  return $out;
}
function lab_split($s): array { return array_values(array_filter(explode(',', (string)$s), 'strlen')); }
function lab_json($s) { $v = json_decode((string)$s, true); return is_array($v) ? $v : []; }
function lab_sort_names(array &$list, string $key): void {
  if (class_exists('Collator')) { $col = new Collator('kk_KZ'); usort($list, fn($a, $b) => $col->compare($a[$key], $b[$key])); }
  else usort($list, fn($a, $b) => strcmp($a[$key], $b[$key]));
}
function lab_fullname($u): string { return trim(($u['last'] ?? '') . ' ' . ($u['first'] ?? '')); }

function lab_public_user(PDO $db, array $u): array {
  $sc = $u['school_id'] ? lab_one($db, 'SELECT name FROM lab_schools WHERE id=?', [$u['school_id']]) : null;
  return ['id' => $u['id'], 'role' => $u['role'], 'login' => $u['login'], 'first' => $u['first'], 'last' => $u['last'], 'schoolId' => $u['school_id'],
    'school' => $sc ? $sc['name'] : '', 'classes' => lab_split($u['classes']), 'cls' => $u['cls'], 'grade' => lab_grade($u['cls']),
    'teacherId' => $u['teacher_id'], 'status' => $u['status'], 'mustChange' => (int)$u['must_change'] === 1];
}
function lab_new_session(PDO $db, string $uid): string {
  $tok = bin2hex(random_bytes(24));
  lab_q($db, 'INSERT INTO lab_sessions (token,user_id,expires) VALUES (?,?,?)', [$tok, $uid, gmdate('Y-m-d\TH:i:s\Z', time() + LAB_SESSION_DAYS * 86400)]);
  if (random_int(1, 50) === 1) lab_q($db, 'DELETE FROM lab_sessions WHERE expires < ?', [lab_now()]);
  return $tok;
}
function lab_auth(PDO $db, $token): ?array {
  if (!is_string($token) || $token === '') return null;
  $s = lab_one($db, 'SELECT * FROM lab_sessions WHERE token=?', [$token]);
  if (!$s || $s['expires'] < lab_now()) return null;
  $u = lab_one($db, 'SELECT * FROM lab_users WHERE id=?', [$s['user_id']]);
  if (!$u || $u['status'] !== 'approved') return null;
  return $u;
}
function lab_login_taken(PDO $db, string $login): bool { return (bool)lab_one($db, 'SELECT id FROM lab_users WHERE login=?', [$login]); }
function lab_owns(array $me, array $st): bool { return $me['role'] === 'admin' || $st['teacher_id'] === $me['id']; }
function lab_sub_out(array $s): array {
  return ['id' => $s['id'], 'labId' => $s['lab_id'], 'answers' => lab_json($s['answers']), 'submittedAt' => $s['submitted_at'], 'feedback' => $s['feedback'], 'feedbackAt' => $s['feedback_at']];
}

/* ---------- орнату ---------- */
function lab_install(PDO $db, string $adminLogin, string $adminPass, string $first, string $last): void {
  lab_schema($db);
  if (!lab_one($db, "SELECT id FROM lab_users WHERE role='admin'")) {
    lab_q($db, 'INSERT INTO lab_users (id,role,login,hash,first,last,school_id,classes,cls,teacher_id,status,must_change,created) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)',
      [lab_rid(), 'admin', lab_norm_login($adminLogin), password_hash($adminPass, PASSWORD_DEFAULT), $first ?: 'Админ', $last, '', '', '', '', 'approved', 0, lab_now()]);
  }
  if (!lab_one($db, 'SELECT id FROM lab_schools')) {
    foreach (LAB_SEED_SCHOOLS as $n) lab_q($db, 'INSERT INTO lab_schools (id,name,approved) VALUES (?,?,1)', [lab_rid(8), $n]);
  }
}

/* ---------- API ---------- */
function lab_handle(PDO $db, array $req): array {
  $a = is_string($req['action'] ?? null) ? $req['action'] : '';
  $me = lab_auth($db, $req['token'] ?? '');

  /* ашық әрекеттер */
  if ($a === 'schools') {
    if (!empty($req['withTeachers'])) {
      $list = lab_all($db, "SELECT DISTINCT s.id, s.name FROM lab_schools s JOIN lab_users u ON u.school_id=s.id
        WHERE s.approved=1 AND u.role IN ('teacher','admin') AND u.status='approved' AND u.classes<>''");
    } else $list = lab_all($db, 'SELECT id, name FROM lab_schools WHERE approved=1');
    lab_sort_names($list, 'name');
    return ['ok' => true, 'schools' => $list];
  }
  if ($a === 'teachers') {
    $rows = lab_all($db, "SELECT id, first, last, classes FROM lab_users WHERE role IN ('teacher','admin') AND status='approved' AND school_id=? AND classes<>''", [lab_clean($req['schoolId'] ?? '', 16)]);
    return ['ok' => true, 'teachers' => array_map(fn($u) => ['id' => $u['id'], 'name' => lab_fullname($u), 'classes' => lab_split($u['classes'])], $rows)];
  }
  if ($a === 'registerTeacher') {
    $login = lab_norm_login($req['login'] ?? '');
    if (!preg_match(LAB_LOGIN_RE, $login)) return lab_err('badLogin');
    if (!lab_check_pass($req['pass'] ?? null)) return lab_err('badPass');
    if (lab_login_taken($db, $login)) return lab_err('loginTaken');
    $first = lab_clean($req['first'] ?? '', 60); $last = lab_clean($req['last'] ?? '', 60);
    if ($first === '' || $last === '') return lab_err('badName');
    $classes = lab_classes($req['classes'] ?? []);
    if (!$classes) return lab_err('noClasses');
    $schoolId = lab_clean($req['schoolId'] ?? '', 16);
    $newSchool = lab_clean($req['newSchool'] ?? '', 120);
    if ($newSchool !== '') {
      $schoolId = lab_rid(8);
      lab_q($db, 'INSERT INTO lab_schools (id,name,approved) VALUES (?,?,0)', [$schoolId, $newSchool]);
    } elseif (!lab_one($db, 'SELECT id FROM lab_schools WHERE id=? AND approved=1', [$schoolId])) return lab_err('badSchool');
    lab_q($db, 'INSERT INTO lab_users (id,role,login,hash,first,last,school_id,classes,cls,teacher_id,status,must_change,created) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)',
      [lab_rid(), 'teacher', $login, password_hash($req['pass'], PASSWORD_DEFAULT), $first, $last, $schoolId, implode(',', $classes), '', '', 'pending', 0, lab_now()]);
    return ['ok' => true, 'pending' => true];
  }
  if ($a === 'registerStudent') {
    $login = lab_norm_login($req['login'] ?? '');
    if (!preg_match(LAB_LOGIN_RE, $login)) return lab_err('badLogin');
    if (!lab_check_pass($req['pass'] ?? null)) return lab_err('badPass');
    if (lab_login_taken($db, $login)) return lab_err('loginTaken');
    $first = lab_clean($req['first'] ?? '', 60); $last = lab_clean($req['last'] ?? '', 60);
    if ($first === '' || $last === '') return lab_err('badName');
    $t = lab_one($db, "SELECT * FROM lab_users WHERE id=? AND role IN ('teacher','admin') AND status='approved'", [lab_clean($req['teacherId'] ?? '', 32)]);
    if (!$t || $t['school_id'] !== lab_clean($req['schoolId'] ?? '', 16)) return lab_err('badTeacher');
    $cls = lab_clean($req['cls'] ?? '', 6);
    if (!in_array($cls, lab_split($t['classes']), true)) return lab_err('badClass');
    $id = lab_rid();
    lab_q($db, 'INSERT INTO lab_users (id,role,login,hash,first,last,school_id,classes,cls,teacher_id,status,must_change,created) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)',
      [$id, 'student', $login, password_hash($req['pass'], PASSWORD_DEFAULT), $first, $last, $t['school_id'], '', $cls, $t['id'], 'approved', 0, lab_now()]);
    $u = lab_one($db, 'SELECT * FROM lab_users WHERE id=?', [$id]);
    return ['ok' => true, 'token' => lab_new_session($db, $id), 'user' => lab_public_user($db, $u)];
  }
  if ($a === 'login') {
    $u = lab_one($db, 'SELECT * FROM lab_users WHERE login=?', [lab_norm_login($req['login'] ?? '')]);
    $pass = is_string($req['pass'] ?? null) ? $req['pass'] : '';
    if (!$u || !password_verify($pass, $u['hash'])) { usleep(400000); return lab_err('badCredentials'); }
    if ($u['status'] !== 'approved') return lab_err($u['status'] === 'pending' ? 'pending' : ($u['status'] === 'rejected' ? 'rejected' : 'blocked'));
    if (password_needs_rehash($u['hash'], PASSWORD_DEFAULT)) lab_q($db, 'UPDATE lab_users SET hash=? WHERE id=?', [password_hash($pass, PASSWORD_DEFAULT), $u['id']]);
    return ['ok' => true, 'token' => lab_new_session($db, $u['id']), 'user' => lab_public_user($db, $u)];
  }

  /* кіргеннен кейін */
  if (!$me) return lab_err('auth');
  if ($a === 'me') return ['ok' => true, 'user' => lab_public_user($db, $me)];
  if ($a === 'logout') { lab_q($db, 'DELETE FROM lab_sessions WHERE token=?', [(string)$req['token']]); return ['ok' => true]; }
  if ($a === 'changePassword') {
    if (!lab_check_pass($req['newPass'] ?? null)) return lab_err('badPass');
    if ((int)$me['must_change'] !== 1 && !password_verify(is_string($req['oldPass'] ?? null) ? $req['oldPass'] : '', $me['hash'])) return lab_err('badOldPass');
    lab_q($db, 'UPDATE lab_users SET hash=?, must_change=0 WHERE id=?', [password_hash($req['newPass'], PASSWORD_DEFAULT), $me['id']]);
    return ['ok' => true];
  }

  if ($me['role'] === 'student') {
    if ($a === 'submit') {
      $labId = lab_clean($req['labId'] ?? '', 20);
      if (!preg_match('/^g(7|8|9|10|11)-(\d{1,2})$/', $labId, $m) || (int)$m[1] !== lab_grade($me['cls'])) return lab_err('badLab');
      $ans = [];
      foreach ((array)($req['answers'] ?? []) as $x) { if (is_array($x)) $ans[] = ['q' => lab_clean($x['q'] ?? '', 500), 'a' => lab_clean($x['a'] ?? '', 4000)]; if (count($ans) >= 20) break; }
      $json = json_encode($ans, JSON_UNESCAPED_UNICODE);
      $ex = lab_one($db, 'SELECT id FROM lab_subs WHERE student_id=? AND lab_id=?', [$me['id'], $labId]);
      if ($ex) lab_q($db, 'UPDATE lab_subs SET answers=?, submitted_at=?, teacher_id=? WHERE id=?', [$json, lab_now(), $me['teacher_id'], $ex['id']]);
      else lab_q($db, 'INSERT INTO lab_subs (id,student_id,teacher_id,lab_id,answers,submitted_at,feedback,feedback_at) VALUES (?,?,?,?,?,?,?,?)', [lab_rid(), $me['id'], $me['teacher_id'], $labId, $json, lab_now(), '', '']);
      return ['ok' => true];
    }
    if ($a === 'mySubs') return ['ok' => true, 'subs' => array_map('lab_sub_out', lab_all($db, 'SELECT * FROM lab_subs WHERE student_id=?', [$me['id']]))];
    return lab_err('forbidden');
  }

  /* мұғалім мен админ */
  if ($me['role'] !== 'teacher' && $me['role'] !== 'admin') return lab_err('forbidden');
  $isAdmin = $me['role'] === 'admin';

  if ($a === 'students') {
    $sql = "SELECT u.*, s.name AS school_name, TRIM(CONCAT(COALESCE(t.last,''),' ',COALESCE(t.first,''))) AS teacher_name FROM lab_users u
      LEFT JOIN lab_schools s ON s.id=u.school_id LEFT JOIN lab_users t ON t.id=u.teacher_id WHERE u.role='student'" . ($isAdmin ? '' : ' AND u.teacher_id=?');
    if ($db->getAttribute(PDO::ATTR_DRIVER_NAME) === 'sqlite') $sql = str_replace("TRIM(CONCAT(COALESCE(t.last,''),' ',COALESCE(t.first,'')))", "TRIM(COALESCE(t.last,'') || ' ' || COALESCE(t.first,''))", $sql);
    $st = lab_all($db, $sql, $isAdmin ? [] : [$me['id']]);
    $subs = []; $ids = array_column($st, 'id');
    if ($ids) {
      foreach (array_chunk($ids, 400) as $chunk) {
        foreach (lab_all($db, 'SELECT * FROM lab_subs WHERE student_id IN (' . implode(',', array_fill(0, count($chunk), '?')) . ')', $chunk) as $s) $subs[$s['student_id']][] = lab_sub_out($s);
      }
    }
    return ['ok' => true, 'students' => array_map(fn($u) => ['id' => $u['id'], 'first' => $u['first'], 'last' => $u['last'], 'login' => $u['login'], 'cls' => $u['cls'],
      'teacher' => (string)$u['teacher_name'], 'teacherId' => $u['teacher_id'], 'school' => (string)$u['school_name'], 'subs' => $subs[$u['id']] ?? []], $st)];
  }
  if ($a === 'feedback') {
    $sb = lab_one($db, 'SELECT * FROM lab_subs WHERE id=?', [lab_clean($req['subId'] ?? '', 32)]);
    if (!$sb) return lab_err('notFound');
    $stu = lab_one($db, 'SELECT * FROM lab_users WHERE id=?', [$sb['student_id']]);
    if (!$stu || !lab_owns($me, $stu)) return lab_err('forbidden');
    lab_q($db, 'UPDATE lab_subs SET feedback=?, feedback_at=? WHERE id=?', [lab_clean($req['text'] ?? '', 3000), lab_now(), $sb['id']]);
    return ['ok' => true];
  }
  if ($a === 'resetStudent' || $a === 'deleteStudent') {
    $s = lab_one($db, "SELECT * FROM lab_users WHERE id=? AND role='student'", [lab_clean($req['studentId'] ?? '', 32)]);
    if (!$s || !lab_owns($me, $s)) return lab_err('forbidden');
    if ($a === 'deleteStudent') {
      lab_q($db, 'DELETE FROM lab_subs WHERE student_id=?', [$s['id']]);
      lab_q($db, 'DELETE FROM lab_sessions WHERE user_id=?', [$s['id']]);
      lab_q($db, 'DELETE FROM lab_users WHERE id=?', [$s['id']]);
      return ['ok' => true];
    }
    $tp = lab_temp();
    lab_q($db, 'UPDATE lab_users SET hash=?, must_change=1 WHERE id=?', [password_hash($tp, PASSWORD_DEFAULT), $s['id']]);
    lab_q($db, 'DELETE FROM lab_sessions WHERE user_id=?', [$s['id']]);
    return ['ok' => true, 'temp' => $tp];
  }
  if ($a === 'myClasses') {
    $sets = ['classes' => implode(',', lab_classes($req['classes'] ?? []))];
    if ($isAdmin) {
      $sid = lab_clean($req['schoolId'] ?? '', 16);
      if ($sid !== '' && lab_one($db, 'SELECT id FROM lab_schools WHERE id=?', [$sid])) $sets['school_id'] = $sid;
      $f = lab_clean($req['first'] ?? '', 60); $l = lab_clean($req['last'] ?? '', 60);
      if ($f !== '') $sets['first'] = $f;
      if (array_key_exists('last', $req)) $sets['last'] = $l;
    }
    $cols = implode(',', array_map(fn($k) => "$k=?", array_keys($sets)));
    lab_q($db, "UPDATE lab_users SET $cols WHERE id=?", array_merge(array_values($sets), [$me['id']]));
    return ['ok' => true];
  }

  /* тек админ */
  if (!$isAdmin) return lab_err('forbidden');
  if ($a === 'adminData') {
    $users = lab_all($db, 'SELECT id, role, login, first, last, school_id, classes, teacher_id, status, created FROM lab_users');
    $schools = lab_all($db, 'SELECT * FROM lab_schools');
    $sc = []; foreach ($schools as $s) $sc[$s['id']] = $s;
    $cnt = []; $tc = []; $stc = [];
    foreach ($users as $u) {
      if ($u['role'] === 'student') { $cnt[$u['teacher_id']] = ($cnt[$u['teacher_id']] ?? 0) + 1; $stc[$u['school_id']] = ($stc[$u['school_id']] ?? 0) + 1; }
      else $tc[$u['school_id']] = ($tc[$u['school_id']] ?? 0) + 1;
    }
    $teachers = [];
    foreach ($users as $u) if ($u['role'] === 'teacher') {
      $s = $sc[$u['school_id']] ?? null;
      $teachers[] = ['id' => $u['id'], 'first' => $u['first'], 'last' => $u['last'], 'login' => $u['login'], 'schoolId' => $u['school_id'], 'school' => $s ? $s['name'] : '',
        'schoolApproved' => $s ? (int)$s['approved'] === 1 : false, 'classes' => lab_split($u['classes']), 'status' => $u['status'], 'created' => $u['created'], 'students' => $cnt[$u['id']] ?? 0];
    }
    return ['ok' => true, 'teachers' => $teachers, 'schools' => array_map(fn($s) => ['id' => $s['id'], 'name' => $s['name'], 'approved' => (int)$s['approved'] === 1,
      'teachers' => $tc[$s['id']] ?? 0, 'students' => $stc[$s['id']] ?? 0], $schools)];
  }
  if ($a === 'setTeacherStatus') {
    $t = lab_one($db, "SELECT * FROM lab_users WHERE id=? AND role='teacher'", [lab_clean($req['teacherId'] ?? '', 32)]);
    $status = $req['status'] ?? '';
    if (!$t || !in_array($status, ['approved', 'rejected', 'blocked'], true)) return lab_err('notFound');
    lab_q($db, 'UPDATE lab_users SET status=? WHERE id=?', [$status, $t['id']]);
    if ($status === 'approved') {
      $s = lab_one($db, 'SELECT * FROM lab_schools WHERE id=?', [$t['school_id']]);
      if ($s && (int)$s['approved'] !== 1) lab_q($db, 'UPDATE lab_schools SET approved=1, name=? WHERE id=?', [lab_clean($req['schoolName'] ?? '', 120) ?: $s['name'], $s['id']]);
    } else lab_q($db, 'DELETE FROM lab_sessions WHERE user_id=?', [$t['id']]);
    return ['ok' => true];
  }
  if ($a === 'resetTeacher') {
    $t = lab_one($db, "SELECT * FROM lab_users WHERE id=? AND role='teacher'", [lab_clean($req['teacherId'] ?? '', 32)]);
    if (!$t) return lab_err('notFound');
    $tp = lab_temp();
    lab_q($db, 'UPDATE lab_users SET hash=?, must_change=1 WHERE id=?', [password_hash($tp, PASSWORD_DEFAULT), $t['id']]);
    lab_q($db, 'DELETE FROM lab_sessions WHERE user_id=?', [$t['id']]);
    return ['ok' => true, 'temp' => $tp];
  }
  if ($a === 'saveSchool') {
    $nm = lab_clean($req['name'] ?? '', 120);
    if ($nm === '') return lab_err('badSchool');
    $id = lab_clean($req['id'] ?? '', 16);
    if ($id !== '') {
      if (!lab_one($db, 'SELECT id FROM lab_schools WHERE id=?', [$id])) return lab_err('notFound');
      lab_q($db, 'UPDATE lab_schools SET name=?, approved=1 WHERE id=?', [$nm, $id]);
    } else lab_q($db, 'INSERT INTO lab_schools (id,name,approved) VALUES (?,?,1)', [lab_rid(8), $nm]);
    return ['ok' => true];
  }
  if ($a === 'deleteSchool') {
    $id = lab_clean($req['id'] ?? '', 16);
    if (lab_one($db, 'SELECT id FROM lab_users WHERE school_id=?', [$id])) return lab_err('schoolInUse');
    lab_q($db, 'DELETE FROM lab_schools WHERE id=?', [$id]);
    return ['ok' => true];
  }
  return lab_err('unknown');
}
