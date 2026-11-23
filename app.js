/* ===== Виртуалды химия зертханасы — сайттың интерфейсі ===== */
(function () {
  "use strict";
  var CFG = window.LAB_CONFIG || {};
  var DEMO = !CFG.API_URL;
  var DEMO_ADMIN = { login: "admin", pass: "admin123" };
  var LETTERS = ["А", "Ә", "Б", "В", "Г", "Ғ", "Д", "Е"];
  var GRADES = [7, 8, 9, 10, 11];
  var LABS = window.LABS || [];

  /* ---------- мәтіндер ---------- */
  var T = {
    kk: {
      title: "Виртуалды химия зертханасы", sub: "7–11-сыныптар · Байзақ ауданы", logout: "Шығу",
      demo: "Үлгі режимі: деректер тек осы браузерде сақталады. Бас админ ретінде кіру үшін: логин «admin», құпиясөз «admin123». Нақты жұмыс үшін сайтты PHP + MySQL хостингке (мысалы, ps.kz) орнатыңыз — README.",
      login: "Кіру", loginT: "Жүйеге кіру", lLogin: "Логин", lPass: "Құпиясөз", lPass2: "Құпиясөзді қайталаңыз",
      noAcc: "Аккаунтың жоқ па?", regStudent: "Оқушы ретінде тіркелу", regTeacher: "Мұғалім ретінде тіркелу", back: "← Артқа",
      forgot: "Құпиясөзді ұмыттың ба? Оқушылар — мұғаліміне, мұғалімдер — бас админге жүгінеді. Олар уақытша құпиясөз береді.",
      stRegT: "Оқушы тіркелуі", tRegT: "Мұғалім тіркелуі", lSchool: "Мектеп", lTeacher: "Мұғалім", lClass: "Сынып", lFirst: "Аты", lLast: "Тегі",
      choose: "— таңдаңыз —", otherSchool: "Басқа (тізімде жоқ)", lNewSchool: "Мектептің толық атауы", noTeachers: "Бұл мектепте әлі тіркелген мұғалім жоқ.",
      lClasses: "Сабақ беретін сыныптарыңыз", loginHint: "Латын әріптері, сандар, «.», «_», «-» (3–30 таңба)", passHint: "Кемінде 6 таңба",
      register: "Тіркелу", pendingT: "Өтініш жіберілді", pendingM: "Тіркелуіңіз бас админнің растауын күтуде. Рұқсат берілген соң осы логинмен кіре аласыз.",
      mustT: "Жаңа құпиясөз ойлап табыңыз", mustM: "Сіз уақытша құпиясөзбен кірдіңіз. Жалғастыру үшін өз құпиясөзіңізді орнатыңыз.", save: "Сақтау",
      grade: "-сынып", labsOf: "-сынып зертханалары", lab: "зертхана", stNew: "Орындалмаған", stSent: "Жіберілді", stFb: "Мұғалім пікірі бар",
      openLab: "Ашу", backLabs: "← Зертханаларға оралу", fbT: "Мұғалімнің пікірі", sentAt: "Жіберілген уақыты",
      tUnchecked: "Тексерілмегендер", tStudents: "Оқушылар", tClasses: "Сыныптарым", tProfile: "Профиль", tRequests: "Өтінімдер", tTeachers: "Мұғалімдер", tSchools: "Мектептер",
      allClasses: "Барлық сыныптар", nothing: "Әзірге ештеңе жоқ.", noUnchecked: "Тексерілмеген жұмыс жоқ. Жарайсыз!",
      fbPh: "Оқушыға пікіріңізді жазыңыз…", sendFb: "Пікір жіберу", updFb: "Пікірді жаңарту", fbSaved: "Пікір сақталды.",
      colName: "Аты-жөні", colClass: "Сынып", colLogin: "Логин", colDone: "Жіберген", colTeacher: "Мұғалім", colSchool: "Мектеп", colStatus: "Күйі", colAct: "Әрекет",
      works: "Жұмыстары", resetPass: "Құпиясөзді қалпына келтіру", del: "Жою", delSure: "Шынымен жоясыз ба? Қайта басыңыз", tempIs: "Уақытша құпиясөз: ", tempNote: "Оны оқушыға (мұғалімге) беріңіз — кіргенде жаңа құпиясөз ойлап табады.",
      classesNote: "Белгіленген сыныптардың оқушылары тіркелгенде сізді таңдай алады.", saved: "Сақталды.", lProfSchool: "Менің мектебім",
      oldPass: "Қазіргі құпиясөз", newPass: "Жаңа құпиясөз", changePass: "Құпиясөзді ауыстыру", passChanged: "Құпиясөз ауыстырылды.",
      approve: "Рұқсат беру", reject: "Бас тарту", block: "Бұғаттау", unblock: "Бұғаттан шығару", newSchoolBadge: "жаңа мектеп", schoolFix: "Мектеп атауын түзету (қажет болса)",
      noRequests: "Жаңа өтінім жоқ.", stApproved: "белсенді", stBlocked: "бұғатталған", stRejected: "бас тартылған", stPending: "күтуде",
      addSchool: "Мектеп қосу", rename: "Атын өзгерту", schoolInUse: "Бұл мектепте пайдаланушылар бар — жою мүмкін емес.", tCount: "мұғалім", sCount: "оқушы",
      guestT: "Тіркелмей шолу", guestBtn: "Қонақ ретінде кіру", guestNote: "Барлық 60 зертхананы ашып, тәжірибе жасап көре аласыз. Қонақ режимінде нәтиже сақталмайды және мұғалімге жіберілмейді.",
      guestBanner: "Қонақ режимі: зертханаларды шолуға және тәжірибе жасап көруге болады, бірақ жұмыс сақталмайды және мұғалімге жіберілмейді. Толық мүмкіндік үшін тіркеліңіз.", guest: "Қонақ", guestRole: "шолу режимі", guestNoSend: "Қонақ режимінде жұмыс мұғалімге жіберілмейді. Жіберу үшін оқушы ретінде тіркеліңіз.", guestLabs: "Зертханалық жұмыстар", review: "Шолу",
      profName: "Аты-жөнім (оқушыларға көрінеді)", admin: "Бас админ", teacher: "Мұғалім", student: "Оқушы", answers: "Жауаптары", subject: "Химия",
      errors: { badLogin: "Логин дұрыс емес: латын әріптері, сандар, «.», «_», «-», 3–30 таңба.", badPass: "Құпиясөз кемінде 6 таңба болуы керек.", loginTaken: "Бұл логин бос емес, басқасын ойлап табыңыз.",
        badName: "Аты мен тегін толтырыңыз.", noClasses: "Кемінде бір сыныпты белгілеңіз.", badSchool: "Мектепті таңдаңыз.", badTeacher: "Мұғалімді таңдаңыз.", badClass: "Сыныпты таңдаңыз.",
        badCredentials: "Логин немесе құпиясөз қате.", pending: "Тіркелуіңіз әлі расталмаған. Бас админнің рұқсатын күтіңіз.", rejected: "Тіркелуге рұқсат берілмеді.", blocked: "Аккаунт бұғатталған.",
        auth: "Сеанс аяқталды, қайта кіріңіз.", badOldPass: "Қазіргі құпиясөз қате.", badLab: "Бұл зертхана сіздің сыныбыңызға арналмаған.", forbidden: "Рұқсат жоқ.", notFound: "Табылмады.",
        schoolInUse: "Бұл мектепте пайдаланушылар бар — жою мүмкін емес.", mismatch: "Құпиясөздер сәйкес емес.", net: "Серверге қосылу мүмкін болмады. Интернетті тексеріңіз.", server: "Сервер қатесі.", notInstalled: "Сайт әлі орнатылмаған: алдымен install.php бетін ашыңыз.", unknown: "Белгісіз қате." }
    },
    ru: {
      title: "Виртуальная химическая лаборатория", sub: "7–11 классы · Байзакский район", logout: "Выйти",
      demo: "Демо-режим: данные хранятся только в этом браузере. Вход главного админа: логин «admin», пароль «admin123». Для реальной работы установите сайт на PHP + MySQL хостинг (например, ps.kz) — README.",
      login: "Войти", loginT: "Вход в систему", lLogin: "Логин", lPass: "Пароль", lPass2: "Повторите пароль",
      noAcc: "Нет аккаунта?", regStudent: "Регистрация ученика", regTeacher: "Регистрация учителя", back: "← Назад",
      forgot: "Забыли пароль? Ученики обращаются к учителю, учителя — к главному админу. Они выдадут временный пароль.",
      stRegT: "Регистрация ученика", tRegT: "Регистрация учителя", lSchool: "Школа", lTeacher: "Учитель", lClass: "Класс", lFirst: "Имя", lLast: "Фамилия",
      choose: "— выберите —", otherSchool: "Другая (нет в списке)", lNewSchool: "Полное название школы", noTeachers: "В этой школе пока нет зарегистрированных учителей.",
      lClasses: "Классы, в которых вы преподаёте", loginHint: "Латинские буквы, цифры, «.», «_», «-» (3–30 символов)", passHint: "Не менее 6 символов",
      register: "Зарегистрироваться", pendingT: "Заявка отправлена", pendingM: "Ваша регистрация ожидает подтверждения главного админа. После одобрения вы сможете войти с этим логином.",
      mustT: "Придумайте новый пароль", mustM: "Вы вошли с временным паролем. Чтобы продолжить, установите свой пароль.", save: "Сохранить",
      grade: " класс", labsOf: " класс — лабораторные работы", lab: "лаборатория", stNew: "Не выполнена", stSent: "Отправлена", stFb: "Есть отзыв учителя",
      openLab: "Открыть", backLabs: "← К списку работ", fbT: "Отзыв учителя", sentAt: "Время отправки",
      tUnchecked: "Непроверенные", tStudents: "Ученики", tClasses: "Мои классы", tProfile: "Профиль", tRequests: "Заявки", tTeachers: "Учителя", tSchools: "Школы",
      allClasses: "Все классы", nothing: "Пока ничего нет.", noUnchecked: "Непроверенных работ нет. Отлично!",
      fbPh: "Напишите отзыв ученику…", sendFb: "Отправить отзыв", updFb: "Обновить отзыв", fbSaved: "Отзыв сохранён.",
      colName: "ФИО", colClass: "Класс", colLogin: "Логин", colDone: "Отправлено", colTeacher: "Учитель", colSchool: "Школа", colStatus: "Статус", colAct: "Действие",
      works: "Работы", resetPass: "Сбросить пароль", del: "Удалить", delSure: "Точно удалить? Нажмите ещё раз", tempIs: "Временный пароль: ", tempNote: "Передайте его ученику (учителю) — при входе он придумает новый пароль.",
      classesNote: "Ученики отмеченных классов смогут выбрать вас при регистрации.", saved: "Сохранено.", lProfSchool: "Моя школа",
      oldPass: "Текущий пароль", newPass: "Новый пароль", changePass: "Сменить пароль", passChanged: "Пароль изменён.",
      approve: "Одобрить", reject: "Отклонить", block: "Заблокировать", unblock: "Разблокировать", newSchoolBadge: "новая школа", schoolFix: "Исправить название школы (если нужно)",
      noRequests: "Новых заявок нет.", stApproved: "активен", stBlocked: "заблокирован", stRejected: "отклонён", stPending: "ожидает",
      addSchool: "Добавить школу", rename: "Переименовать", schoolInUse: "В этой школе есть пользователи — удалить нельзя.", tCount: "учит.", sCount: "уч.",
      guestT: "Просмотр без регистрации", guestBtn: "Войти как гость", guestNote: "Можно открыть все 60 лабораторных работ и провести опыты. В гостевом режиме результаты не сохраняются и не отправляются учителю.",
      guestBanner: "Гостевой режим: можно просматривать работы и проводить опыты, но результаты не сохраняются и не отправляются учителю. Для полного доступа зарегистрируйтесь.", guest: "Гость", guestRole: "режим просмотра", guestNoSend: "В гостевом режиме работа не отправляется учителю. Чтобы отправлять работы, зарегистрируйтесь как ученик.", guestLabs: "Лабораторные работы", review: "Просмотр",
      profName: "Моё имя (видно ученикам)", admin: "Главный админ", teacher: "Учитель", student: "Ученик", answers: "Ответы", subject: "Химия",
      errors: { badLogin: "Неверный логин: латинские буквы, цифры, «.», «_», «-», 3–30 символов.", badPass: "Пароль должен быть не короче 6 символов.", loginTaken: "Этот логин занят, придумайте другой.",
        badName: "Заполните имя и фамилию.", noClasses: "Отметьте хотя бы один класс.", badSchool: "Выберите школу.", badTeacher: "Выберите учителя.", badClass: "Выберите класс.",
        badCredentials: "Неверный логин или пароль.", pending: "Регистрация ещё не подтверждена. Дождитесь одобрения главного админа.", rejected: "В регистрации отказано.", blocked: "Аккаунт заблокирован.",
        auth: "Сеанс истёк, войдите снова.", badOldPass: "Текущий пароль неверен.", badLab: "Эта работа не для вашего класса.", forbidden: "Нет доступа.", notFound: "Не найдено.",
        schoolInUse: "В этой школе есть пользователи — удалить нельзя.", mismatch: "Пароли не совпадают.", net: "Не удалось связаться с сервером. Проверьте интернет.", server: "Ошибка сервера.", notInstalled: "Сайт ещё не установлен: сначала откройте страницу install.php.", unknown: "Неизвестная ошибка." }
    }
  };

  /* ---------- күй ---------- */
  var S = { lang: lsGet("vl_lang") || "kk", token: lsGet("vl_token") || "", user: null, view: "login", tab: "", lab: null, subs: [], students: [], admin: null, cls: "", guestGrade: 8 };
  var $app = document.getElementById("app");
  function t(k) { return T[S.lang][k]; }
  function e(k) { return T[S.lang].errors[k] || T[S.lang].errors.unknown; }
  function lsGet(k) { try { return localStorage.getItem(k); } catch (x) { return null; } }
  function lsSet(k, v) { try { if (v == null) localStorage.removeItem(k); else localStorage.setItem(k, v); } catch (x) {} }
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  function labById(id) { return LABS.filter(function (l) { return l.id === id; })[0]; }
  function labTitle(id) { var l = labById(id); return l ? (l.grade + t("grade") + " · " + l.n + " · " + l[S.lang]) : id; }
  function fmtDate(iso) { if (!iso) return ""; var d = new Date(iso); return isNaN(d) ? iso : d.toLocaleString(S.lang === "kk" ? "kk-KZ" : "ru-RU", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" }); }
  function fullName(u) { return ((u.last || "") + " " + (u.first || "")).trim(); }

  /* ---------- API ---------- */
  var demoDb = (function () {
    var KEY = "vl_demo_db", data;
    try { data = JSON.parse(localStorage.getItem(KEY) || "{}"); } catch (x) { data = {}; }
    function save() { try { localStorage.setItem(KEY, JSON.stringify(data)); } catch (x) {} }
    function tab(n) { return data[n] || (data[n] = []); }
    return {
      all: function (n) { return tab(n).map(function (r) { return Object.assign({}, r); }); },
      insert: function (n, o) { var r = {}; LAB_CORE.TABLES[n].forEach(function (c) { r[c] = o[c] == null ? "" : String(o[c]); }); tab(n).push(r); save(); },
      update: function (n, id, p) { var k = LAB_CORE.TABLES[n][0], r = tab(n).filter(function (x) { return x[k] === id; })[0]; if (r) { Object.keys(p).forEach(function (c) { r[c] = String(p[c]); }); save(); } },
      remove: function (n, id) { var k = LAB_CORE.TABLES[n][0]; data[n] = tab(n).filter(function (x) { return x[k] !== id; }); save(); }
    };
  })();
  function api(action, params) {
    var req = Object.assign({ action: action, token: S.token }, params || {});
    if (DEMO) {
      return new Promise(function (res) { setTimeout(function () { var r; try { r = LAB_CORE.handle(demoDb, JSON.parse(JSON.stringify(req)), { adminLogin: DEMO_ADMIN.login, adminPass: DEMO_ADMIN.pass }); } catch (x) { r = { ok: false, error: "server" }; } res(r); }, 120); });
    }
    return fetch(CFG.API_URL, { method: "POST", body: JSON.stringify(req) })
      .then(function (r) { return r.json(); })
      .catch(function () { return { ok: false, error: "net" }; })
      .then(function (r) { if (r && !r.ok && r.error === "auth" && action !== "login") { logoutLocal(); } return r; });
  }

  /* ---------- жалпы көмекшілер ---------- */
  function msgHtml(id) { return '<div class="msg" id="' + id + '" aria-live="polite"></div>'; }
  function showMsg(id, text, ok) { var m = document.getElementById(id); if (m) { m.textContent = text; m.className = "msg " + (ok ? "ok" : "bad"); } }
  function busy(btn, on) { if (btn) btn.disabled = !!on; }
  function opts(list, val, ph) { return (ph ? '<option value="">' + esc(ph) + "</option>" : "") + list.map(function (o) { return '<option value="' + esc(o.v) + '"' + (String(o.v) === String(val) ? " selected" : "") + ">" + esc(o.t) + "</option>"; }).join(""); }
  function classGrid(name, selected) {
    selected = selected || [];
    return '<div class="classes">' + GRADES.map(function (g) {
      return "<b>" + g + "</b>" + LETTERS.map(function (L) { var c = g + L; return '<label><input type="checkbox" name="' + name + '" value="' + c + '"' + (selected.indexOf(c) >= 0 ? " checked" : "") + ">" + L + "</label>"; }).join("");
    }).join("") + "</div>";
  }
  function checked(name) { return Array.prototype.map.call(document.querySelectorAll('input[name="' + name + '"]:checked'), function (i) { return i.value; }); }
  function val(id) { var el = document.getElementById(id); return el ? el.value.trim() : ""; }

  function header() {
    document.getElementById("appTitle").textContent = t("title");
    document.getElementById("appSub").textContent = t("sub");
    document.title = t("title");
    document.documentElement.lang = S.lang;
    document.getElementById("l-kk").classList.toggle("on", S.lang === "kk");
    document.getElementById("l-ru").classList.toggle("on", S.lang === "ru");
    var lo = document.getElementById("logout"), who = document.getElementById("who");
    lo.hidden = !S.user; lo.textContent = t("logout");
    if (S.user) {
      var role = t(S.user.role === "admin" ? "admin" : S.user.role === "teacher" ? "teacher" : S.user.role === "guest" ? "guestRole" : "student");
      var extra = S.user.role === "student" ? " · " + S.user.cls : (S.user.school ? " · " + S.user.school : "");
      if (S.user.role === "guest") { who.innerHTML = "<b>" + esc(t("guest")) + "</b><br>" + esc(role); return; }
      who.innerHTML = "<b>" + esc(fullName(S.user) || S.user.login) + "</b><br>" + esc(role + extra);
    } else who.innerHTML = "";
  }
  function demoBanner() { return DEMO ? '<div class="demo">' + esc(t("demo")) + "</div>" : ""; }

  /* ---------- маршрутизация ---------- */
  function render() {
    header();
    if (!S.user) {
      if (S.view === "regStudent") return viewRegStudent();
      if (S.view === "regTeacher") return viewRegTeacher();
      if (S.view === "pending") return viewPending();
      return viewLogin();
    }
    if (S.user.role === "guest") return S.lab ? viewLab() : viewGuestHome();
    if (S.user.mustChange) return viewMustChange();
    if (S.user.role === "student") return S.lab ? viewLab() : viewStudentHome();
    return viewStaff();
  }
  function setUser(token, user) { S.token = token; S.user = user; lsSet("vl_token", token); S.tab = ""; S.lab = null; S.cls = ""; S.subs = []; S.subsLoaded = false; S.students = []; S.admin = null; }
  function logoutLocal() { S.token = ""; S.user = null; S.subs = []; S.subsLoaded = false; S.students = []; S.admin = null; S.view = "login"; S.lab = null; lsSet("vl_token", null); render(); }

  /* ---------- кіру ---------- */
  function viewLogin() {
    $app.innerHTML = demoBanner() + '<div class="auth"><h1>' + esc(t("loginT")) + "</h1>" +
      '<form id="fLogin"><label>' + esc(t("lLogin")) + '<input id="lg" autocomplete="username" autocapitalize="none" spellcheck="false" required></label>' +
      "<label>" + esc(t("lPass")) + '<input id="pw" type="password" autocomplete="current-password" required></label>' +
      '<button class="btn" id="bLogin">' + esc(t("login")) + "</button></form>" + msgHtml("mLogin") +
      '<p class="mute">' + esc(t("forgot")) + "</p>" +
      "<h3>" + esc(t("noAcc")) + '</h3><div class="btns"><button class="btn ghost" id="goSt">' + esc(t("regStudent")) + '</button><button class="btn ghost" id="goT">' + esc(t("regTeacher")) + "</button></div>" +
      '<div class="guestbox"><h3>' + esc(t("guestT")) + '</h3><p class="mute">' + esc(t("guestNote")) + '</p><button class="btn" id="goG">' + esc(t("guestBtn")) + "</button></div></div>";
    document.getElementById("goG").onclick = function () { S.user = { role: "guest", first: "", last: "", login: "" }; S.lab = null; S.subs = []; S.subsLoaded = true; render(); window.scrollTo(0, 0); };
    document.getElementById("fLogin").onsubmit = function (ev) {
      ev.preventDefault(); var b = document.getElementById("bLogin"); busy(b, 1);
      api("login", { login: val("lg"), pass: document.getElementById("pw").value }).then(function (r) {
        busy(b, 0); if (!r.ok) return showMsg("mLogin", e(r.error), false);
        setUser(r.token, r.user); render();
      });
    };
    document.getElementById("goSt").onclick = function () { S.view = "regStudent"; render(); };
    document.getElementById("goT").onclick = function () { S.view = "regTeacher"; render(); };
  }

  /* ---------- оқушы тіркелуі ---------- */
  function viewRegStudent() {
    $app.innerHTML = demoBanner() + '<div class="auth"><button class="link" id="bk">' + esc(t("back")) + "</button><h1>" + esc(t("stRegT")) + "</h1>" +
      '<form id="fSt"><label>' + esc(t("lSchool")) + '<select id="sch" required><option value="">…</option></select></label>' +
      '<p class="mute" id="noT" hidden>' + esc(t("noTeachers")) + "</p>" +
      '<div class="row"><label>' + esc(t("lTeacher")) + '<select id="tch" required disabled></select></label><label>' + esc(t("lClass")) + '<select id="cls" required disabled></select></label></div>' +
      '<div class="row"><label>' + esc(t("lLast")) + '<input id="ln" required autocomplete="family-name"></label><label>' + esc(t("lFirst")) + '<input id="fn" required autocomplete="given-name"></label></div>' +
      "<label>" + esc(t("lLogin")) + '<input id="lg" required autocapitalize="none" spellcheck="false" autocomplete="username"><span class="mute">' + esc(t("loginHint")) + "</span></label>" +
      '<div class="row"><label>' + esc(t("lPass")) + '<input id="pw" type="password" required autocomplete="new-password"><span class="mute">' + esc(t("passHint")) + "</span></label><label>" + esc(t("lPass2")) + '<input id="pw2" type="password" required autocomplete="new-password"></label></div>' +
      '<button class="btn" id="bReg">' + esc(t("register")) + "</button></form>" + msgHtml("mReg") + "</div>";
    document.getElementById("bk").onclick = function () { S.view = "login"; render(); };
    var sch = document.getElementById("sch"), tch = document.getElementById("tch"), cls = document.getElementById("cls"), teachers = [];
    api("schools", { withTeachers: true }).then(function (r) {
      if (!r.ok) return showMsg("mReg", e(r.error), false);
      sch.innerHTML = opts(r.schools.map(function (s) { return { v: s.id, t: s.name }; }), "", t("choose"));
      if (!r.schools.length) document.getElementById("noT").hidden = false;
    });
    function fillClasses() {
      var tt = teachers.filter(function (x) { return x.id === tch.value; })[0], list = tt ? tt.classes : [];
      cls.innerHTML = opts(list.map(function (c) { return { v: c, t: c }; }), list.length === 1 ? list[0] : "", list.length === 1 ? "" : t("choose"));
      cls.disabled = !list.length;
    }
    sch.onchange = function () {
      tch.disabled = true; cls.disabled = true; tch.innerHTML = ""; cls.innerHTML = "";
      if (!sch.value) return;
      api("teachers", { schoolId: sch.value }).then(function (r) {
        teachers = (r.ok && r.teachers) || [];
        tch.innerHTML = opts(teachers.map(function (x) { return { v: x.id, t: x.name }; }), teachers.length === 1 ? teachers[0].id : "", teachers.length === 1 ? "" : t("choose"));
        tch.disabled = !teachers.length; fillClasses();
      });
    };
    tch.onchange = fillClasses;
    document.getElementById("fSt").onsubmit = function (ev) {
      ev.preventDefault();
      if (document.getElementById("pw").value !== document.getElementById("pw2").value) return showMsg("mReg", e("mismatch"), false);
      var b = document.getElementById("bReg"); busy(b, 1);
      api("registerStudent", { schoolId: sch.value, teacherId: tch.value, cls: cls.value, first: val("fn"), last: val("ln"), login: val("lg"), pass: document.getElementById("pw").value }).then(function (r) {
        busy(b, 0); if (!r.ok) return showMsg("mReg", e(r.error), false);
        setUser(r.token, r.user); render();
      });
    };
  }

  /* ---------- мұғалім тіркелуі ---------- */
  function viewRegTeacher() {
    $app.innerHTML = demoBanner() + '<div class="auth"><button class="link" id="bk">' + esc(t("back")) + "</button><h1>" + esc(t("tRegT")) + "</h1>" +
      '<form id="fT"><div class="row"><label>' + esc(t("lLast")) + '<input id="ln" required autocomplete="family-name"></label><label>' + esc(t("lFirst")) + '<input id="fn" required autocomplete="given-name"></label></div>' +
      "<label>" + esc(t("lSchool")) + '<select id="sch" required><option value="">…</option></select></label>' +
      '<label id="nsWrap" hidden>' + esc(t("lNewSchool")) + '<input id="ns" maxlength="120"></label>' +
      '<p class="mute" style="margin:6px 0 0">' + esc(t("lClasses")) + "</p>" + classGrid("tc") +
      "<label>" + esc(t("lLogin")) + '<input id="lg" required autocapitalize="none" spellcheck="false" autocomplete="username"><span class="mute">' + esc(t("loginHint")) + "</span></label>" +
      '<div class="row"><label>' + esc(t("lPass")) + '<input id="pw" type="password" required autocomplete="new-password"><span class="mute">' + esc(t("passHint")) + "</span></label><label>" + esc(t("lPass2")) + '<input id="pw2" type="password" required autocomplete="new-password"></label></div>' +
      '<button class="btn" id="bReg">' + esc(t("register")) + "</button></form>" + msgHtml("mReg") + "</div>";
    document.getElementById("bk").onclick = function () { S.view = "login"; render(); };
    var sch = document.getElementById("sch");
    api("schools").then(function (r) {
      if (!r.ok) return showMsg("mReg", e(r.error), false);
      sch.innerHTML = opts(r.schools.map(function (s) { return { v: s.id, t: s.name }; }).concat([{ v: "__other", t: t("otherSchool") }]), "", t("choose"));
    });
    sch.onchange = function () { document.getElementById("nsWrap").hidden = sch.value !== "__other"; };
    document.getElementById("fT").onsubmit = function (ev) {
      ev.preventDefault();
      if (document.getElementById("pw").value !== document.getElementById("pw2").value) return showMsg("mReg", e("mismatch"), false);
      var other = sch.value === "__other", b = document.getElementById("bReg"); busy(b, 1);
      api("registerTeacher", { first: val("fn"), last: val("ln"), schoolId: other ? "" : sch.value, newSchool: other ? val("ns") : "", classes: checked("tc"), login: val("lg"), pass: document.getElementById("pw").value }).then(function (r) {
        busy(b, 0); if (!r.ok) return showMsg("mReg", e(r.error), false);
        S.view = "pending"; render();
      });
    };
  }
  function viewPending() {
    $app.innerHTML = '<div class="auth"><h1>' + esc(t("pendingT")) + '</h1><p>' + esc(t("pendingM")) + '</p><button class="btn" id="bk">' + esc(t("login")) + "</button></div>";
    document.getElementById("bk").onclick = function () { S.view = "login"; render(); };
  }

  /* ---------- уақытша құпиясөзден кейін ---------- */
  function viewMustChange() {
    $app.innerHTML = '<div class="auth"><h1>' + esc(t("mustT")) + '</h1><p class="mute">' + esc(t("mustM")) + "</p>" +
      '<form id="fP"><label>' + esc(t("newPass")) + '<input id="pw" type="password" required autocomplete="new-password"><span class="mute">' + esc(t("passHint")) + "</span></label>" +
      "<label>" + esc(t("lPass2")) + '<input id="pw2" type="password" required autocomplete="new-password"></label><button class="btn" id="bs">' + esc(t("save")) + "</button></form>" + msgHtml("mP") + "</div>";
    document.getElementById("fP").onsubmit = function (ev) {
      ev.preventDefault(); var p = document.getElementById("pw").value;
      if (p !== document.getElementById("pw2").value) return showMsg("mP", e("mismatch"), false);
      var b = document.getElementById("bs"); busy(b, 1);
      api("changePassword", { newPass: p }).then(function (r) { busy(b, 0); if (!r.ok) return showMsg("mP", e(r.error), false); S.user.mustChange = false; render(); });
    };
  }

  /* ---------- оқушы беті ---------- */
  function loadSubs() { return api("mySubs").then(function (r) { if (r.ok) { S.subs = r.subs; S.subsLoaded = true; } return r; }); }
  function subOf(labId) { return S.subs.filter(function (s) { return s.labId === labId; })[0]; }
  function viewStudentHome() {
    var g = S.user.grade, list = LABS.filter(function (l) { return l.grade === g; });
    $app.innerHTML = demoBanner() + "<h1>" + esc(g + t("labsOf")) + '</h1><p class="mute">' + esc(S.user.school || "") + "</p>" + '<div class="labs" id="labs"></div>';
    function draw() {
      document.getElementById("labs").innerHTML = list.map(function (l) {
        var s = subOf(l.id), cl = s ? (s.feedback ? "fb" : "sent") : "new", st = s ? (s.feedback ? t("stFb") : t("stSent")) : t("stNew");
        return '<button class="lab" data-lab="' + esc(l.id) + '"><span class="n">' + esc(l.n + "-" + t("lab")) + '</span><span class="t">' + esc(l[S.lang]) + '</span><span class="badge ' + cl + '">' + esc(st) + "</span></button>";
      }).join("") || '<p class="empty">' + esc(t("nothing")) + "</p>";
    }
    if (S.subsLoaded) draw(); else document.getElementById("labs").innerHTML = '<p class="mute">…</p>';
    loadSubs().then(function () { if (!S.lab && S.user && S.user.role === "student" && document.getElementById("labs")) draw(); });
    document.getElementById("labs").onclick = function (ev) { var b = ev.target.closest("[data-lab]"); if (b) { S.lab = b.dataset.lab; render(); window.scrollTo(0, 0); } };
  }
  function viewGuestHome() {
    var g = S.guestGrade, list = LABS.filter(function (l) { return l.grade === g; });
    $app.innerHTML = '<div class="demo">' + esc(t("guestBanner")) + '</div><div class="btns" style="margin:-4px 0 14px"><button class="btn small" id="gSt">' + esc(t("regStudent")) + '</button><button class="btn ghost small" id="gT">' + esc(t("regTeacher")) + "</button></div>" +
      "<h1>" + esc(t("guestLabs")) + '</h1><div class="tabs" role="tablist">' + GRADES.map(function (x) { return '<button role="tab" data-g="' + x + '" class="' + (x === g ? "on" : "") + '">' + esc(x + t("grade")) + "</button>"; }).join("") + "</div>" +
      '<div class="labs" id="labs">' + list.map(function (l) {
        return '<button class="lab" data-lab="' + esc(l.id) + '"><span class="n">' + esc(l.n + "-" + t("lab")) + '</span><span class="t">' + esc(l[S.lang]) + '</span><span class="badge sent">' + esc(t("review")) + "</span></button>";
      }).join("") + "</div>";
    document.querySelector(".tabs").onclick = function (ev) { var b = ev.target.closest("[data-g]"); if (b) { S.guestGrade = +b.dataset.g; viewGuestHome(); } };
    document.getElementById("labs").onclick = function (ev) { var b = ev.target.closest("[data-lab]"); if (b) { S.lab = b.dataset.lab; render(); window.scrollTo(0, 0); } };
    document.getElementById("gSt").onclick = function () { S.user = null; S.view = "regStudent"; render(); };
    document.getElementById("gT").onclick = function () { S.user = null; S.view = "regTeacher"; render(); };
  }
  var frameListener = null;
  function viewLab() {
    var l = labById(S.lab); if (!l) { S.lab = null; return render(); }
    var s = subOf(l.id);
    var isGuest = S.user.role === "guest";
    $app.innerHTML = (isGuest ? '<div class="demo">' + esc(t("guestBanner")) + "</div>" : "") + '<div class="labbar"><button class="btn ghost small" id="bk">' + esc(t("backLabs")) + "</button><b>" + esc(l.n + "-" + t("lab") + " · " + l[S.lang]) + "</b></div>" +
      (s && s.feedback ? '<div class="fbbox"><b>' + esc(t("fbT")) + ":</b> " + esc(s.feedback) + '<div class="mute">' + esc(fmtDate(s.feedbackAt)) + "</div></div>" : "") +
      (s ? '<p class="mute">' + esc(t("sentAt")) + ": " + esc(fmtDate(s.submittedAt)) + "</p>" : "") +
      '<iframe class="frame" id="frame" title="' + esc(l[S.lang]) + '" src="labs/' + esc(l.id) + ".html?embed=1&lang=" + S.lang + '"></iframe>';
    document.getElementById("bk").onclick = function () { S.lab = null; render(); };
    var fr = document.getElementById("frame");
    if (frameListener) window.removeEventListener("message", frameListener);
    frameListener = function (ev) {
      if (ev.source !== fr.contentWindow) return;
      var d = ev.data || {};
      if (d.type === "labHeight") fr.style.height = Math.max(600, d.h + 20) + "px";
      if (d.type === "labReady" && s && s.answers && s.answers.length) fr.contentWindow.postMessage({ type: "labPrefill", answers: s.answers }, "*");
      if (d.type === "labSubmit" && isGuest) { fr.contentWindow.postMessage({ type: "labResult", ok: false, text: t("guestNoSend") }, "*"); return; }
      if (d.type === "labSubmit") {
        api("submit", { labId: l.id, answers: d.answers }).then(function (r) {
          fr.contentWindow.postMessage({ type: "labResult", ok: !!r.ok, text: r.ok ? "" : e(r.error) }, "*");
          if (r.ok) loadSubs();
        });
      }
    };
    window.addEventListener("message", frameListener);
  }

  /* ---------- мұғалім мен админ беті ---------- */
  function viewStaff() {
    var isAdmin = S.user.role === "admin";
    var tabs = isAdmin ? ["requests", "unchecked", "students", "teachers", "schools", "classes", "profile"] : ["unchecked", "students", "classes", "profile"];
    if (!S.tab) S.tab = isAdmin ? "requests" : "unchecked";
    var names = { requests: t("tRequests"), unchecked: t("tUnchecked"), students: t("tStudents"), teachers: t("tTeachers"), schools: t("tSchools"), classes: t("tClasses"), profile: t("tProfile") };
    $app.innerHTML = demoBanner() + '<div class="tabs" role="tablist">' + tabs.map(function (k) { return '<button role="tab" data-tab="' + k + '" class="' + (S.tab === k ? "on" : "") + '">' + esc(names[k]) + '<span class="cnt" id="cnt-' + k + '" hidden></span></button>'; }).join("") + '</div><div id="pane"></div>';
    var onTab = document.querySelector(".tabs .on"); if (onTab && onTab.scrollIntoView) onTab.scrollIntoView({ inline: "center", block: "nearest" });
    document.querySelector(".tabs").onclick = function (ev) { var b = ev.target.closest("[data-tab]"); if (b) { S.tab = b.dataset.tab; viewStaff(); } };
    var pane = document.getElementById("pane");
    pane.innerHTML = '<p class="mute">…</p>';
    var need = [];
    need.push(api("students").then(function (r) { if (r.ok) S.students = r.students; }));
    if (isAdmin) need.push(api("adminData").then(function (r) { if (r.ok) S.admin = r; }));
    Promise.all(need).then(function () {
      counts(isAdmin);
      ({ requests: paneRequests, unchecked: paneUnchecked, students: paneStudents, teachers: paneTeachers, schools: paneSchools, classes: paneClasses, profile: paneProfile })[S.tab](pane);
    });
  }
  function uncheckedList() {
    var out = [];
    S.students.forEach(function (st) { st.subs.forEach(function (sb) { if (!sb.feedback) out.push({ st: st, sb: sb }); }); });
    out.sort(function (a, b) { return String(b.sb.submittedAt).localeCompare(String(a.sb.submittedAt)); });
    return out;
  }
  function counts(isAdmin) {
    function set(k, n) { var c = document.getElementById("cnt-" + k); if (c) { c.hidden = !n; c.textContent = n; } }
    set("unchecked", uncheckedList().length);
    if (isAdmin && S.admin) set("requests", S.admin.teachers.filter(function (x) { return x.status === "pending"; }).length);
  }
  function subCard(st, sb) {
    return '<div class="sub' + (sb.feedback ? "" : " nofb") + '" data-sub="' + esc(sb.id) + '"><b>' + esc(fullName(st)) + "</b> · " + esc(st.cls) + (S.user.role === "admin" && st.teacher ? ' · <span class="mute">' + esc(st.teacher) + "</span>" : "") +
      '<div class="mute">' + esc(labTitle(sb.labId)) + " · " + esc(fmtDate(sb.submittedAt)) + "</div>" +
      (sb.answers || []).map(function (q) { return '<div class="qa"><i>' + esc(q.q) + "</i><div>" + esc(q.a) + "</div></div>"; }).join("") +
      '<textarea placeholder="' + esc(t("fbPh")) + '" maxlength="3000">' + esc(sb.feedback || "") + '</textarea><div class="btns"><button class="btn small" data-fb="' + esc(sb.id) + '">' + esc(sb.feedback ? t("updFb") : t("sendFb")) + '</button></div><div class="msg"></div></div>';
  }
  function bindFeedback(root) {
    root.addEventListener("click", function (ev) {
      var b = ev.target.closest("[data-fb]"); if (!b) return;
      var card = b.closest(".sub"), txt = card.querySelector("textarea").value.trim(), m = card.querySelector(".msg");
      if (!txt) { card.querySelector("textarea").focus(); return; }
      busy(b, 1);
      api("feedback", { subId: b.dataset.fb, text: txt }).then(function (r) {
        busy(b, 0); m.textContent = r.ok ? t("fbSaved") : e(r.error); m.className = "msg " + (r.ok ? "ok" : "bad");
        if (r.ok) { card.classList.remove("nofb"); b.textContent = t("updFb");
          S.students.forEach(function (st) { st.subs.forEach(function (sb) { if (sb.id === b.dataset.fb) { sb.feedback = txt; sb.feedbackAt = new Date().toISOString(); } }); }); counts(S.user.role === "admin"); }
      });
    });
  }
  function paneUnchecked(p) {
    var list = uncheckedList();
    p.innerHTML = list.length ? list.map(function (x) { return subCard(x.st, x.sb); }).join("") : '<p class="empty">' + esc(t("noUnchecked")) + "</p>";
    bindFeedback(p);
  }
  function paneStudents(p) {
    var classes = []; S.students.forEach(function (s) { if (classes.indexOf(s.cls) < 0) classes.push(s.cls); }); classes.sort();
    var isAdmin = S.user.role === "admin";
    p.innerHTML = '<div class="filters"><label>' + esc(t("colClass")) + '<select id="fc">' + opts(classes.map(function (c) { return { v: c, t: c }; }), S.cls, t("allClasses")) + "</select></label></div>" +
      '<div class="scroll"><table class="tbl"><thead><tr><th>' + esc(t("colName")) + "</th><th>" + esc(t("colClass")) + "</th><th>" + esc(t("colLogin")) + "</th>" + (isAdmin ? "<th>" + esc(t("colTeacher")) + "</th>" : "") + "<th>" + esc(t("colDone")) + "</th><th>" + esc(t("colAct")) + '</th></tr></thead><tbody id="tb"></tbody></table></div><div id="detail"></div>';
    function draw() {
      var list = S.students.filter(function (s) { return !S.cls || s.cls === S.cls; }).sort(function (a, b) { return (a.cls + fullName(a)).localeCompare(b.cls + fullName(b), "kk"); });
      document.getElementById("tb").innerHTML = list.map(function (s) {
        return "<tr><td>" + esc(fullName(s)) + "</td><td>" + esc(s.cls) + "</td><td>" + esc(s.login) + "</td>" + (isAdmin ? "<td>" + esc(s.teacher) + "<br><span class=\"mute\">" + esc(s.school) + "</span></td>" : "") + "<td>" + s.subs.length + '</td><td><div class="btns" style="margin:0"><button class="btn small ghost" data-works="' + esc(s.id) + '">' + esc(t("works")) + '</button><button class="btn small ghost" data-reset="' + esc(s.id) + '">' + esc(t("resetPass")) + '</button><button class="btn small danger" data-del="' + esc(s.id) + '">' + esc(t("del")) + "</button></div></td></tr>";
      }).join("") || '<tr><td colspan="6" class="empty">' + esc(t("nothing")) + "</td></tr>";
    }
    draw();
    document.getElementById("fc").onchange = function (ev) { S.cls = ev.target.value; draw(); document.getElementById("detail").innerHTML = ""; };
    var det = document.getElementById("detail"); bindFeedback(det);
    p.querySelector("table").addEventListener("click", function (ev) {
      var b = ev.target.closest("button"); if (!b) return;
      var id = b.dataset.works || b.dataset.reset || b.dataset.del, st = S.students.filter(function (s) { return s.id === id; })[0]; if (!st) return;
      if (b.dataset.works) {
        det.innerHTML = "<h2>" + esc(fullName(st)) + " · " + esc(st.cls) + "</h2>" + (st.subs.length ? st.subs.slice().sort(function (a, c) { return a.labId.localeCompare(c.labId, undefined, { numeric: true }); }).map(function (sb) { return subCard(st, sb); }).join("") : '<p class="empty">' + esc(t("nothing")) + "</p>");
        det.scrollIntoView({ behavior: "smooth" });
      }
      if (b.dataset.reset) {
        busy(b, 1);
        api("resetStudent", { studentId: id }).then(function (r) { busy(b, 0); det.innerHTML = r.ok ? '<div class="temp">' + esc(fullName(st)) + " (" + esc(st.login) + ") — " + esc(t("tempIs") + r.temp) + '</div><p class="mute">' + esc(t("tempNote")) + "</p>" : '<p class="msg bad">' + esc(e(r.error)) + "</p>"; det.scrollIntoView({ behavior: "smooth" }); });
      }
      if (b.dataset.del) {
        if (!b.dataset.sure) { b.dataset.sure = "1"; b.textContent = t("delSure"); return; }
        busy(b, 1);
        api("deleteStudent", { studentId: id }).then(function (r) { if (r.ok) { S.students = S.students.filter(function (s) { return s.id !== id; }); draw(); det.innerHTML = ""; counts(isAdmin); } else busy(b, 0); });
      }
    });
  }
  function paneClasses(p) {
    var isAdmin = S.user.role === "admin";
    p.innerHTML = '<p class="mute">' + esc(t("classesNote")) + "</p>" +
      (isAdmin ? '<div class="row"><label>' + esc(t("lLast")) + '<input id="ln" value="' + esc(S.user.last) + '"></label><label>' + esc(t("lFirst")) + '<input id="fn" value="' + esc(S.user.first) + '"></label></div><label>' + esc(t("lProfSchool")) + '<select id="sch"></select></label>' : "") +
      classGrid("mc", S.user.classes) + '<button class="btn" id="bs">' + esc(t("save")) + "</button>" + msgHtml("mC");
    if (isAdmin) api("schools").then(function (r) { if (r.ok) document.getElementById("sch").innerHTML = opts(r.schools.map(function (s) { return { v: s.id, t: s.name }; }), S.user.schoolId, t("choose")); });
    document.getElementById("bs").onclick = function () {
      var b = this, cl = checked("mc"), prm = { classes: cl };
      if (isAdmin) { prm.schoolId = val("sch"); prm.first = val("fn"); prm.last = val("ln"); }
      busy(b, 1);
      api("myClasses", prm).then(function (r) { busy(b, 0); if (!r.ok) return showMsg("mC", e(r.error), false); return api("me").then(function (m) { if (m.ok) S.user = m.user; header(); showMsg("mC", t("saved"), true); }); });
    };
  }
  function paneProfile(p) {
    p.innerHTML = '<div class="auth" style="margin:0"><h2>' + esc(t("changePass")) + '</h2><form id="fP"><label>' + esc(t("oldPass")) + '<input id="op" type="password" required autocomplete="current-password"></label>' +
      "<label>" + esc(t("newPass")) + '<input id="pw" type="password" required autocomplete="new-password"><span class="mute">' + esc(t("passHint")) + "</span></label><label>" + esc(t("lPass2")) + '<input id="pw2" type="password" required autocomplete="new-password"></label>' +
      '<button class="btn" id="bs">' + esc(t("changePass")) + "</button></form>" + msgHtml("mP") + "</div>";
    document.getElementById("fP").onsubmit = function (ev) {
      ev.preventDefault(); var np = document.getElementById("pw").value;
      if (np !== document.getElementById("pw2").value) return showMsg("mP", e("mismatch"), false);
      var b = document.getElementById("bs"); busy(b, 1);
      api("changePassword", { oldPass: document.getElementById("op").value, newPass: np }).then(function (r) { busy(b, 0); if (!r.ok) return showMsg("mP", e(r.error), false); document.getElementById("fP").reset(); showMsg("mP", t("passChanged"), true); });
    };
  }
  /* ---------- тек админ ---------- */
  function paneRequests(p) {
    var list = S.admin ? S.admin.teachers.filter(function (x) { return x.status === "pending"; }) : [];
    p.innerHTML = list.length ? list.map(function (x) {
      return '<div class="sub nofb" data-t="' + esc(x.id) + '"><b>' + esc(fullName(x)) + '</b> <span class="mute">(' + esc(x.login) + ")</span><div>" + esc(x.school) + (x.schoolApproved ? "" : ' <span class="badge new">' + esc(t("newSchoolBadge")) + "</span>") + "</div>" +
        '<div class="mute">' + esc(t("tClasses")) + ": " + esc(x.classes.join(", ")) + " · " + esc(fmtDate(x.created)) + "</div>" +
        (x.schoolApproved ? "" : '<label style="margin-top:8px">' + esc(t("schoolFix")) + '<input class="sfix" value="' + esc(x.school) + '" maxlength="120"></label>') +
        '<div class="btns"><button class="btn small okb" data-st="approved">' + esc(t("approve")) + '</button><button class="btn small danger" data-st="rejected">' + esc(t("reject")) + '</button></div><div class="msg"></div></div>';
    }).join("") : '<p class="empty">' + esc(t("noRequests")) + "</p>";
    p.onclick = function (ev) {
      var b = ev.target.closest("[data-st]"); if (!b) return;
      var card = b.closest("[data-t]"), fix = card.querySelector(".sfix"); busy(b, 1);
      api("setTeacherStatus", { teacherId: card.dataset.t, status: b.dataset.st, schoolName: fix ? fix.value.trim() : "" }).then(function (r) { if (r.ok) viewStaff(); else { busy(b, 0); card.querySelector(".msg").textContent = e(r.error); } });
    };
  }
  function paneTeachers(p) {
    var list = S.admin ? S.admin.teachers.filter(function (x) { return x.status !== "pending"; }) : [];
    var stName = { approved: t("stApproved"), blocked: t("stBlocked"), rejected: t("stRejected") };
    p.innerHTML = '<div class="scroll"><table class="tbl"><thead><tr><th>' + esc(t("colName")) + "</th><th>" + esc(t("colLogin")) + "</th><th>" + esc(t("colSchool")) + "</th><th>" + esc(t("tClasses")) + "</th><th>" + esc(t("tStudents")) + "</th><th>" + esc(t("colStatus")) + "</th><th>" + esc(t("colAct")) + "</th></tr></thead><tbody>" +
      (list.map(function (x) {
        return "<tr><td>" + esc(fullName(x)) + "</td><td>" + esc(x.login) + "</td><td>" + esc(x.school) + "</td><td>" + esc(x.classes.join(", ")) + "</td><td>" + x.students + "</td><td>" + esc(stName[x.status] || x.status) + '</td><td><div class="btns" style="margin:0">' +
          '<button class="btn small ghost" data-reset="' + esc(x.id) + '">' + esc(t("resetPass")) + "</button>" +
          (x.status === "approved" ? '<button class="btn small danger" data-set="blocked" data-id="' + esc(x.id) + '">' + esc(t("block")) + "</button>" : '<button class="btn small okb" data-set="approved" data-id="' + esc(x.id) + '">' + esc(t(x.status === "blocked" ? "unblock" : "approve")) + "</button>") +
          "</div></td></tr>";
      }).join("") || '<tr><td colspan="7" class="empty">' + esc(t("nothing")) + "</td></tr>") + '</tbody></table></div><div id="detail"></div>';
    p.onclick = function (ev) {
      var b = ev.target.closest("button"); if (!b) return;
      if (b.dataset.reset) { busy(b, 1); api("resetTeacher", { teacherId: b.dataset.reset }).then(function (r) { busy(b, 0); var x = S.admin.teachers.filter(function (q) { return q.id === b.dataset.reset; })[0]; document.getElementById("detail").innerHTML = r.ok ? '<div class="temp">' + esc(fullName(x)) + " (" + esc(x.login) + ") — " + esc(t("tempIs") + r.temp) + '</div><p class="mute">' + esc(t("tempNote")) + "</p>" : '<p class="msg bad">' + esc(e(r.error)) + "</p>"; }); }
      if (b.dataset.set) { busy(b, 1); api("setTeacherStatus", { teacherId: b.dataset.id, status: b.dataset.set }).then(function () { viewStaff(); }); }
    };
  }
  function paneSchools(p) {
    var list = S.admin ? S.admin.schools.slice().sort(function (a, b) { return a.name.localeCompare(b.name, "kk"); }) : [];
    p.innerHTML = '<form id="fS" class="filters" style="align-items:flex-end"><label style="flex:1">' + esc(t("lNewSchool")) + '<input id="sn" maxlength="120" required></label><button class="btn" id="bAdd">' + esc(t("addSchool")) + "</button></form>" + msgHtml("mS") +
      '<div class="scroll"><table class="tbl"><thead><tr><th>' + esc(t("colSchool")) + "</th><th>" + esc(t("tTeachers")) + "</th><th>" + esc(t("tStudents")) + "</th><th>" + esc(t("colAct")) + "</th></tr></thead><tbody>" +
      list.map(function (s) {
        return '<tr data-s="' + esc(s.id) + '"><td><input class="sname" value="' + esc(s.name) + '" maxlength="120" aria-label="' + esc(t("colSchool")) + '">' + (s.approved ? "" : ' <span class="badge new">' + esc(t("newSchoolBadge")) + "</span>") + "</td><td>" + s.teachers + "</td><td>" + s.students + '</td><td><div class="btns" style="margin:0"><button class="btn small ghost" data-ren="1">' + esc(t("rename")) + "</button>" +
          (s.teachers || s.students ? "" : '<button class="btn small danger" data-dels="1">' + esc(t("del")) + "</button>") + "</div></td></tr>";
      }).join("") + "</tbody></table></div>";
    document.getElementById("fS").onsubmit = function (ev) { ev.preventDefault(); var b = document.getElementById("bAdd"); busy(b, 1); api("saveSchool", { name: val("sn") }).then(function (r) { busy(b, 0); if (r.ok) viewStaff(); else showMsg("mS", e(r.error), false); }); };
    p.querySelector("table").onclick = function (ev) {
      var b = ev.target.closest("button"); if (!b) return; var tr = b.closest("tr"), id = tr.dataset.s;
      if (b.dataset.ren) { busy(b, 1); api("saveSchool", { id: id, name: tr.querySelector(".sname").value.trim() }).then(function (r) { busy(b, 0); showMsg("mS", r.ok ? t("saved") : e(r.error), r.ok); }); }
      if (b.dataset.dels) { if (!b.dataset.sure) { b.dataset.sure = "1"; b.textContent = t("delSure"); return; } busy(b, 1); api("deleteSchool", { id: id }).then(function (r) { if (r.ok) viewStaff(); else { busy(b, 0); showMsg("mS", e(r.error), false); } }); }
    };
  }

  /* ---------- іске қосу ---------- */
  document.getElementById("l-kk").onclick = function () { setLang("kk"); };
  document.getElementById("l-ru").onclick = function () { setLang("ru"); };
  function setLang(l) {
    S.lang = l; lsSet("vl_lang", l);
    var fr = document.getElementById("frame");
    if (fr && S.lab) { header(); fr.contentWindow.postMessage({ type: "labLang", lang: l }, "*"); return; }
    render();
  }
  document.getElementById("logout").onclick = function () { if (S.user && S.user.role === "guest") return logoutLocal(); api("logout").then(logoutLocal); };
  if (!S.token && /(^|[?&])guest=1(&|$)/.test(location.search.slice(1))) { S.user = { role: "guest", first: "", last: "", login: "" }; S.subsLoaded = true; }
  if (S.token) {
    $app.innerHTML = '<p class="mute">…</p>';
    api("me").then(function (r) { if (r.ok) { S.user = r.user; } else { S.token = ""; lsSet("vl_token", null); } render(); });
  } else render();
})();
