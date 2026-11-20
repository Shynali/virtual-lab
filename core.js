/* ===== Виртуалды химия зертханасы — ортақ логика (сервер және демо режим) =====
   Бұл файл Apps Script-те де, браузердегі демо режимде де бірдей жұмыс істейді.
   db адаптері: all(table) → [obj], insert(table,obj), update(table,id,patch), remove(table,id) */

var LAB_CORE = (function () {
  var TABLES = {
    users: ["id", "role", "login", "salt", "hash", "first", "last", "schoolId", "classes", "cls", "teacherId", "status", "mustChange", "created"],
    schools: ["id", "name", "approved"],
    subs: ["id", "studentId", "teacherId", "labId", "answers", "submittedAt", "feedback", "feedbackAt"],
    sessions: ["token", "userId", "expires"]
  };
  var SEED_SCHOOLS = ["№1 мектеп-гимназиясы", "№2 орта мектебі", "№3 орта мектебі", "№5 орта мектебі", "№6 орта мектебі", "№7 орта мектебі",
    "Ғани Мұратбаев атындағы гимназия", "Н. Киікбаев атындағы мектеп-гимназия", "Абай атындағы орта мектебі", "Амангелді атындағы орта мектебі",
    "Ы. Алтынсарин атындағы орта мектебі", "А. Суханбаев атындағы орта мектебі", "С. Сейфуллин атындағы орта мектебі", "Т. Ақбозов атындағы орта мектебі",
    "Н. Ақшабаев атындағы орта мектебі", "С. Абланов атындағы орта мектебі", "М. Әуезов атындағы орта мектебі", "Жамбыл атындағы орта мектебі",
    "А. Пушкин атындағы орта мектебі", "Ю. Гагарин атындағы орта мектебі", "Ш. Уәлиханов атындағы орта мектебі", "Ғ. Әбдірахманов атындағы орта мектебі",
    "Еңбек орта мектебі", "Үлгілі орта мектебі", "Қарасу орта мектебі", "Түймекент орта мектебі", "Қостөбе орта мектебі", "Жаңатұрмыс орта мектебі",
    "Көктал орта мектебі", "Мырзатай орта мектебі", "Сарыбарақ орта мектебі", "Қосақ негізгі мектебі", "Аққия бастауыш мектебі"];
  var SESSION_DAYS = 30;

  /* ---------- SHA-256 (таза JS) ---------- */
  function sha256(ascii) {
    function rr(v, a) { return (v >>> a) | (v << (32 - a)); }
    var utf = unescape(encodeURIComponent(ascii)), words = [], i, j, result = "", hash = [], k = [];
    var isP = {}, cand = 2;
    while (hash.length < 8) {
      var prime = true;
      for (var d = 2; d * d <= cand; d++) if (cand % d === 0) { prime = false; break; }
      if (prime) { if (hash.length < 8) hash.push((Math.pow(cand, 1 / 2) * 4294967296) | 0); }
      cand++;
    }
    cand = 2;
    while (k.length < 64) {
      var p2 = true;
      for (var d2 = 2; d2 * d2 <= cand; d2++) if (cand % d2 === 0) { p2 = false; break; }
      if (p2) k.push((Math.pow(cand, 1 / 3) * 4294967296) | 0);
      cand++;
    }
    var bitLen = utf.length * 8;
    utf += "\x80";
    while (utf.length % 64 - 56) utf += "\x00";
    for (i = 0; i < utf.length; i++) words[i >> 2] |= utf.charCodeAt(i) << ((3 - i) % 4) * 8;
    words[words.length] = (bitLen / 4294967296) | 0;
    words[words.length] = bitLen;
    for (j = 0; j < words.length;) {
      var w = words.slice(j, j += 16), old = hash;
      hash = hash.slice(0, 8);
      for (i = 0; i < 64; i++) {
        var w15 = w[i - 15], w2 = w[i - 2], a = hash[0], e = hash[4];
        var t1 = hash[7] + (rr(e, 6) ^ rr(e, 11) ^ rr(e, 25)) + ((e & hash[5]) ^ (~e & hash[6])) + k[i] +
          (w[i] = i < 16 ? w[i] : (w[i - 16] + (rr(w15, 7) ^ rr(w15, 18) ^ (w15 >>> 3)) + w[i - 7] + (rr(w2, 17) ^ rr(w2, 19) ^ (w2 >>> 10))) | 0);
        var t2 = (rr(a, 2) ^ rr(a, 13) ^ rr(a, 22)) + ((a & hash[1]) ^ (a & hash[2]) ^ (hash[1] & hash[2]));
        hash = [(t1 + t2) | 0].concat(hash);
        hash[4] = (hash[4] + t1) | 0;
      }
      for (i = 0; i < 8; i++) hash[i] = (hash[i] + old[i]) | 0;
    }
    for (i = 0; i < 8; i++) for (j = 3; j + 1; j--) { var b = (hash[i] >> (j * 8)) & 255; result += (b < 16 ? "0" : "") + b.toString(16); }
    return result;
  }

  function rid(n) { var c = "abcdefghijkmnopqrstuvwxyz23456789", s = ""; for (var i = 0; i < (n || 12); i++) s += c[Math.floor(Math.random() * c.length)]; return s; }
  function tempPass() { var s = ""; for (var i = 0; i < 6; i++) s += Math.floor(Math.random() * 10); return s; }
  function now() { return new Date().toISOString(); }
  function hashPass(salt, pass) { return sha256(salt + "|" + pass); }
  function err(code) { return { ok: false, error: code }; }
  function clean(s, max) { return String(s == null ? "" : s).replace(/[\u0000-\u001f]/g, "").trim().slice(0, max || 120); }
  function normLogin(s) { return clean(s, 40).toLowerCase(); }
  var LOGIN_RE = /^[a-z0-9_.\-]{3,30}$/;
  function gradeOf(cls) { var m = String(cls || "").match(/^(\d+)/); return m ? +m[1] : 0; }

  function publicUser(u, schools) {
    var sc = schools && schools.filter(function (s) { return s.id === u.schoolId; })[0];
    return { id: u.id, role: u.role, login: u.login, first: u.first, last: u.last, schoolId: u.schoolId, school: sc ? sc.name : "",
      classes: u.classes ? String(u.classes).split(",").filter(Boolean) : [], cls: u.cls, grade: gradeOf(u.cls), teacherId: u.teacherId,
      status: u.status, mustChange: String(u.mustChange) === "1" };
  }

  function ensureInit(db, adminLogin, adminPass) {
    var users = db.all("users");
    if (!users.some(function (u) { return u.role === "admin"; })) {
      var salt = rid(10);
      db.insert("users", { id: rid(), role: "admin", login: normLogin(adminLogin), salt: salt, hash: hashPass(salt, adminPass), first: "Админ", last: "",
        schoolId: "", classes: "", cls: "", teacherId: "", status: "approved", mustChange: "0", created: now() });
    }
    if (!db.all("schools").length) SEED_SCHOOLS.forEach(function (n) { db.insert("schools", { id: rid(8), name: n, approved: "1" }); });
  }

  function auth(db, token) {
    if (!token) return null;
    var s = db.all("sessions").filter(function (x) { return x.token === token; })[0];
    if (!s || new Date(s.expires) < new Date()) return null;
    var u = db.all("users").filter(function (x) { return x.id === s.userId; })[0];
    if (!u || u.status === "blocked") return null;
    return u;
  }
  function newSession(db, userId) {
    var token = rid(32), exp = new Date(Date.now() + SESSION_DAYS * 864e5).toISOString();
    db.insert("sessions", { token: token, userId: userId, expires: exp });
    return token;
  }
  function checkPass(p) { return typeof p === "string" && p.length >= 6 && p.length <= 64; }
  function loginTaken(db, login) { return db.all("users").some(function (u) { return u.login === login; }); }
  function teacherOwns(me, st) { return me.role === "admin" || st.teacherId === me.id; }

  function handle(db, req, cfg) {
    req = req || {};
    ensureInit(db, cfg.adminLogin, cfg.adminPass);
    var a = req.action, schools = db.all("schools");
    var me = auth(db, req.token);
    var users;

    /* ---------- ашық әрекеттер ---------- */
    if (a === "schools") {
      var withTeachers = req.withTeachers;
      users = db.all("users");
      var list = schools.filter(function (s) { return s.approved === "1"; }).map(function (s) { return { id: s.id, name: s.name }; });
      if (withTeachers) list = list.filter(function (s) { return users.some(function (u) { return (u.role === "teacher" || u.role === "admin") && u.status === "approved" && u.schoolId === s.id && u.classes; }); });
      list.sort(function (x, y) { return x.name.localeCompare(y.name, "kk"); });
      return { ok: true, schools: list };
    }
    if (a === "teachers") {
      users = db.all("users");
      return { ok: true, teachers: users.filter(function (u) { return (u.role === "teacher" || u.role === "admin") && u.status === "approved" && u.schoolId === req.schoolId && u.classes; })
        .map(function (u) { return { id: u.id, name: (u.last + " " + u.first).trim(), classes: String(u.classes).split(",").filter(Boolean) }; }) };
    }
    if (a === "registerTeacher") {
      var login = normLogin(req.login);
      if (!LOGIN_RE.test(login)) return err("badLogin");
      if (!checkPass(req.pass)) return err("badPass");
      if (loginTaken(db, login)) return err("loginTaken");
      var first = clean(req.first, 60), last = clean(req.last, 60);
      if (!first || !last) return err("badName");
      var classes = (req.classes || []).map(function (c) { return clean(c, 6); }).filter(function (c) { return /^(7|8|9|10|11)[^\d\s]{1,2}$/.test(c); });
      if (!classes.length) return err("noClasses");
      var schoolId = req.schoolId;
      if (req.newSchool) {
        var nm = clean(req.newSchool, 120);
        if (!nm) return err("badSchool");
        schoolId = rid(8);
        db.insert("schools", { id: schoolId, name: nm, approved: "0" });
      } else if (!schools.some(function (s) { return s.id === schoolId && s.approved === "1"; })) return err("badSchool");
      var salt = rid(10);
      db.insert("users", { id: rid(), role: "teacher", login: login, salt: salt, hash: hashPass(salt, req.pass), first: first, last: last, schoolId: schoolId,
        classes: classes.join(","), cls: "", teacherId: "", status: "pending", mustChange: "0", created: now() });
      return { ok: true, pending: true };
    }
    if (a === "registerStudent") {
      var login2 = normLogin(req.login);
      if (!LOGIN_RE.test(login2)) return err("badLogin");
      if (!checkPass(req.pass)) return err("badPass");
      if (loginTaken(db, login2)) return err("loginTaken");
      var f2 = clean(req.first, 60), l2 = clean(req.last, 60);
      if (!f2 || !l2) return err("badName");
      users = db.all("users");
      var t = users.filter(function (u) { return u.id === req.teacherId && (u.role === "teacher" || u.role === "admin") && u.status === "approved"; })[0];
      if (!t || t.schoolId !== req.schoolId) return err("badTeacher");
      var cls = clean(req.cls, 6);
      if (String(t.classes).split(",").indexOf(cls) < 0) return err("badClass");
      var salt2 = rid(10), id2 = rid();
      db.insert("users", { id: id2, role: "student", login: login2, salt: salt2, hash: hashPass(salt2, req.pass), first: f2, last: l2, schoolId: t.schoolId,
        classes: "", cls: cls, teacherId: t.id, status: "approved", mustChange: "0", created: now() });
      var u2 = db.all("users").filter(function (u) { return u.id === id2; })[0];
      return { ok: true, token: newSession(db, id2), user: publicUser(u2, schools) };
    }
    if (a === "login") {
      var lg = normLogin(req.login);
      var u3 = db.all("users").filter(function (u) { return u.login === lg; })[0];
      if (!u3 || hashPass(u3.salt, String(req.pass || "")) !== u3.hash) return err("badCredentials");
      if (u3.status === "pending") return err("pending");
      if (u3.status === "rejected") return err("rejected");
      if (u3.status === "blocked") return err("blocked");
      return { ok: true, token: newSession(db, u3.id), user: publicUser(u3, schools) };
    }

    /* ---------- кіргеннен кейінгі әрекеттер ---------- */
    if (!me) return err("auth");
    if (a === "me") return { ok: true, user: publicUser(me, schools) };
    if (a === "logout") { var ss = db.all("sessions").filter(function (x) { return x.token === req.token; })[0]; if (ss) db.remove("sessions", ss.token); return { ok: true }; }
    if (a === "changePassword") {
      if (!checkPass(req.newPass)) return err("badPass");
      if (String(me.mustChange) !== "1" && hashPass(me.salt, String(req.oldPass || "")) !== me.hash) return err("badOldPass");
      var s4 = rid(10);
      db.update("users", me.id, { salt: s4, hash: hashPass(s4, req.newPass), mustChange: "0" });
      return { ok: true };
    }

    if (me.role === "student") {
      if (a === "submit") {
        var labId = clean(req.labId, 20);
        var lm = /^g(7|8|9|10|11)-(\d{1,2})$/.exec(labId); if (!lm || +lm[1] !== gradeOf(me.cls)) return err("badLab");
        var ans = JSON.stringify(req.answers || []).slice(0, 40000);
        var ex = db.all("subs").filter(function (s) { return s.studentId === me.id && s.labId === labId; })[0];
        if (ex) db.update("subs", ex.id, { answers: ans, submittedAt: now(), teacherId: me.teacherId });
        else db.insert("subs", { id: rid(), studentId: me.id, teacherId: me.teacherId, labId: labId, answers: ans, submittedAt: now(), feedback: "", feedbackAt: "" });
        return { ok: true };
      }
      if (a === "mySubs") {
        return { ok: true, subs: db.all("subs").filter(function (s) { return s.studentId === me.id; })
          .map(function (s) { return { labId: s.labId, answers: safeJSON(s.answers), submittedAt: s.submittedAt, feedback: s.feedback, feedbackAt: s.feedbackAt }; }) };
      }
      return err("forbidden");
    }

    /* ---------- мұғалім мен админ ---------- */
    if (me.role !== "teacher" && me.role !== "admin") return err("forbidden");
    users = db.all("users");
    function nameOf(id) { var u = users.filter(function (x) { return x.id === id; })[0]; return u ? (u.last + " " + u.first).trim() : ""; }
    function schoolName(id) { var s = schools.filter(function (x) { return x.id === id; })[0]; return s ? s.name : ""; }

    if (a === "students") {
      var st = users.filter(function (u) { return u.role === "student" && teacherOwns(me, u); });
      var subs = db.all("subs");
      return { ok: true, students: st.map(function (u) {
        return { id: u.id, first: u.first, last: u.last, login: u.login, cls: u.cls, teacher: nameOf(u.teacherId), teacherId: u.teacherId, school: schoolName(u.schoolId),
          subs: subs.filter(function (s) { return s.studentId === u.id; }).map(function (s) { return { id: s.id, labId: s.labId, answers: safeJSON(s.answers), submittedAt: s.submittedAt, feedback: s.feedback, feedbackAt: s.feedbackAt }; }) };
      }) };
    }
    if (a === "feedback") {
      var sb = db.all("subs").filter(function (s) { return s.id === req.subId; })[0];
      if (!sb) return err("notFound");
      var stu = users.filter(function (u) { return u.id === sb.studentId; })[0];
      if (!stu || !teacherOwns(me, stu)) return err("forbidden");
      db.update("subs", sb.id, { feedback: clean(req.text, 3000), feedbackAt: now() });
      return { ok: true };
    }
    if (a === "resetStudent" || a === "deleteStudent") {
      var s5 = users.filter(function (u) { return u.id === req.studentId && u.role === "student"; })[0];
      if (!s5 || !teacherOwns(me, s5)) return err("forbidden");
      if (a === "deleteStudent") {
        db.all("subs").filter(function (s) { return s.studentId === s5.id; }).forEach(function (s) { db.remove("subs", s.id); });
        db.remove("users", s5.id); return { ok: true };
      }
      var tp = tempPass(), sl = rid(10);
      db.update("users", s5.id, { salt: sl, hash: hashPass(sl, tp), mustChange: "1" });
      return { ok: true, temp: tp };
    }
    if (a === "myClasses") {
      var cl = (req.classes || []).map(function (c) { return clean(c, 6); }).filter(function (c) { return /^(7|8|9|10|11)[^\d\s]{1,2}$/.test(c); });
      var patch = { classes: cl.join(",") };
      if (me.role === "admin" && req.schoolId && schools.some(function (s) { return s.id === req.schoolId; })) patch.schoolId = req.schoolId;
      if (me.role === "admin") { var f5 = clean(req.first, 60), l5 = clean(req.last, 60); if (f5) patch.first = f5; if (l5 || req.last === "") patch.last = l5; }
      db.update("users", me.id, patch);
      return { ok: true };
    }

    /* ---------- тек админ ---------- */
    if (me.role !== "admin") return err("forbidden");
    if (a === "adminData") {
      return { ok: true,
        teachers: users.filter(function (u) { return u.role === "teacher"; }).map(function (u) {
          var sc = schools.filter(function (s) { return s.id === u.schoolId; })[0];
          return { id: u.id, first: u.first, last: u.last, login: u.login, schoolId: u.schoolId, school: sc ? sc.name : "", schoolApproved: sc ? sc.approved === "1" : false,
            classes: String(u.classes || "").split(",").filter(Boolean), status: u.status, created: u.created,
            students: users.filter(function (s) { return s.teacherId === u.id; }).length };
        }),
        schools: schools.map(function (s) { return { id: s.id, name: s.name, approved: s.approved === "1",
          teachers: users.filter(function (u) { return u.role !== "student" && u.schoolId === s.id; }).length,
          students: users.filter(function (u) { return u.role === "student" && u.schoolId === s.id; }).length }; }) };
    }
    if (a === "setTeacherStatus") {
      var tt = users.filter(function (u) { return u.id === req.teacherId && u.role === "teacher"; })[0];
      if (!tt || ["approved", "rejected", "blocked"].indexOf(req.status) < 0) return err("notFound");
      db.update("users", tt.id, { status: req.status });
      if (req.status === "approved") {
        var sc2 = schools.filter(function (s) { return s.id === tt.schoolId; })[0];
        if (sc2 && sc2.approved !== "1") db.update("schools", sc2.id, { approved: "1", name: clean(req.schoolName, 120) || sc2.name });
      }
      if (req.status !== "approved") db.all("sessions").filter(function (x) { return x.userId === tt.id; }).forEach(function (x) { db.remove("sessions", x.token); });
      return { ok: true };
    }
    if (a === "resetTeacher") {
      var t6 = users.filter(function (u) { return u.id === req.teacherId && u.role === "teacher"; })[0];
      if (!t6) return err("notFound");
      var tp2 = tempPass(), sl2 = rid(10);
      db.update("users", t6.id, { salt: sl2, hash: hashPass(sl2, tp2), mustChange: "1" });
      return { ok: true, temp: tp2 };
    }
    if (a === "saveSchool") {
      var nm2 = clean(req.name, 120);
      if (!nm2) return err("badSchool");
      if (req.id) { if (!schools.some(function (s) { return s.id === req.id; })) return err("notFound"); db.update("schools", req.id, { name: nm2, approved: "1" }); }
      else db.insert("schools", { id: rid(8), name: nm2, approved: "1" });
      return { ok: true };
    }
    if (a === "deleteSchool") {
      if (users.some(function (u) { return u.schoolId === req.id; })) return err("schoolInUse");
      db.remove("schools", req.id); return { ok: true };
    }
    return err("unknown");
  }
  function safeJSON(s) { try { return JSON.parse(s || "[]"); } catch (e) { return []; } }

  return { TABLES: TABLES, handle: handle, sha256: sha256 };
})();
