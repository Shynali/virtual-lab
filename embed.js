/* Зертхана бетін сайттың ішіне (iframe) қосу скрипті.
   Тек ?embed=1 болғанда іске қосылады. Жұмысты ата-бетке жібереді, жауапты қабылдайды.

   Тәжірибе тақтасы:
   - Компьютерде: мәтіннің жанында тұрады, бет айналғанда экранда қалады.
   - Телефонда зертхана экранды толық алып, өз ішінде айналады (сондықтан ештеңе дірілдемейді):
       • тақтасы биік зертханалар (TABS) — «Тәжірибе | Тапсырма» екі қойындысы;
         тапсырмадағы батырма тәжірибені өзгертсе, бет өзі «Тәжірибе» қойындысына ауысып,
         «нәтижесін көріңіз» деген жазу шығады;
       • қалғандары — тақта жоғарыда мәзір сияқты бекітіледі, жазу кезінде өзі жиналады. */
(function () {
  var qs = new URLSearchParams(window.LAB_EMBED_QS || location.search);
  if (qs.get("embed") !== "1") return;
  var lang = qs.get("lang") === "ru" ? "ru" : "kk";
  var L = {
    kk: { empty: "Алдымен күнделіктегі сұрақтарға жауап жаз.", sending: "Жіберілуде…", sent: "Жұмыс мұғалімге жіберілді! Мұғалім пікірін өз бетіңнен көресің.", fail: "Жіберу мүмкін болмады. Интернетті тексеріп, қайта көр.", send: "Мұғалімге жіберу", resend: "Қайта жіберу",
      exp: "Тәжірибе", task: "Тапсырма", hide: "Жасыру ▴", show: "Көрсету ▾", pick: "Таңдаңыз:", look: "нәтижесін көріңіз!", look0: "Нәтижесін көріңіз!" },
    ru: { empty: "Сначала ответь на вопросы журнала.", sending: "Отправка…", sent: "Работа отправлена учителю! Отзыв учителя появится на твоей странице.", fail: "Не удалось отправить. Проверь интернет и попробуй снова.", send: "Отправить учителю", resend: "Отправить ещё раз",
      exp: "Опыт", task: "Задания", hide: "Свернуть ▴", show: "Показать ▾", pick: "Выберите:", look: "посмотрите на результат!", look0: "Посмотрите на результат!" }
  };
  var TABS = ["g7-1", "g7-2", "g7-7", "g8-1", "g8-3", "g8-6", "g9-1", "g9-3", "g9-5", "g9-6", "g9-7", "g9-8", "g9-11", "g9-12", "g9-14", "g9-15",
    "g10-1", "g10-5", "g10-7", "g10-9", "g11-2", "g11-3", "g11-4", "g11-5", "g11-6", "g11-7", "g11-10", "g11-11", "g11-13"];
  var lid = window.LAB_EMBED_ID || (location.pathname.match(/(g\d+-\d+)\.html/) || [])[1] || "";
  var relabel = function () {};

  function setLang(l) {
    lang = l;
    var b = document.getElementById(l === "ru" ? "l-ru" : "l-kk");
    if (b) b.click();
    var s = document.getElementById("send");
    if (s) s.textContent = L[lang].send;
    relabel();
  }
  function post(msg) { try { parent.postMessage(msg, "*"); } catch (e) {} }
  function journal() {
    var out = [];
    document.querySelectorAll("textarea").forEach(function (t) {
      var lab = t.closest("label"), sp = lab && lab.querySelector("span");
      out.push({ q: sp ? sp.textContent.trim() : "", a: t.value.trim() });
    });
    return out;
  }
  function msgEl() {
    var s = document.getElementById("send"), sec = s && s.closest("section");
    return sec ? sec.querySelector(".msg") : null;
  }
  function show(text, good) { var m = msgEl(); if (m) { m.textContent = text; m.className = "msg " + (good ? "ok" : "bad"); } }

  var CSS = [
    ".note,.lang{display:none!important}body{background:transparent!important}.wrap{padding:0!important;max-width:none!important}",
    ":root{color-scheme:light!important}.wrap>header{display:none!important}",
    ".sheet{box-shadow:none!important;border:1px solid var(--line);padding:clamp(12px,2.2vw,26px)!important}",
    ".board{position:relative!important;top:auto!important;z-index:20}",
    ".pbar,.ltabs,.looknote{display:none}",
    /* ---- телефон ---- */
    "@media(max-width:860px){",
    "html.fill,html.fill body{height:auto}",
    ".grid{display:flex!important;flex-direction:column}.grid>*{min-width:0;max-width:100%}",
    ".grid>.board{order:-1;align-self:stretch!important}",
    /* бекітілген тақта */
    "html.pin .grid>.board{position:sticky!important;top:0!important;background:#fff;margin:0 -12px;padding:0 12px 10px;box-shadow:0 12px 20px -16px rgba(0,0,0,.55)}",
    "html.pin .pbar{display:flex;align-items:center;justify-content:space-between;gap:8px;padding:8px 0 6px;font:600 14px 'Noto Sans',Arial,sans-serif;color:#0f4c5c}",
    ".pbar span{display:flex;align-items:center;gap:6px}",
    ".pbar button{border:1px solid #c9d6d9;background:#eef5f7;color:#0f4c5c;border-radius:999px;padding:6px 14px;font:600 13px 'Noto Sans',Arial,sans-serif;min-height:36px;cursor:pointer}",
    "html.pin .board.mini>*:not(.pbar){display:none!important}",
    /* екі қойынды */
    "html.tabs .ltabs{display:flex;gap:6px;position:sticky;top:0;z-index:30;background:#fff;padding:6px;margin:0 -12px 12px;border-bottom:1px solid #d5dde5;box-shadow:0 10px 18px -16px rgba(0,0,0,.55)}",
    ".ltabs button{flex:1;border:0;border-radius:10px;background:#eef5f7;color:#0f4c5c;font:700 15px 'Noto Sans',Arial,sans-serif;min-height:44px;cursor:pointer}",
    ".ltabs button.on{background:#0f4c5c;color:#fff}",
    ".ltabs button:focus-visible{outline:3px solid #e8a33d;outline-offset:2px}",
    "html.tabs .grid.t-exp>:not(.board){display:none!important}html.tabs .grid.t-task>.board{display:none!important}",
    "html.tabs .looknote.show{display:block;margin:0 0 10px;padding:12px 14px;border-radius:12px;background:#fff4dc;border:1px solid #f1d29a;color:#5c3b00;font:700 15px/1.35 'Noto Sans',Arial,sans-serif;animation:lookin .35s ease both}",
    "@keyframes lookin{from{opacity:0;transform:translateY(-6px)}to{opacity:1;transform:none}}",
    "}",
    /* ---- таңдау батырмалары: чип түрінде ---- */
    ".pick-hint{width:100%;margin:2px 0 6px;font:600 12.5px 'Noto Sans',Arial,sans-serif;color:#566170}",
    ".board button:not(.btn):not(.pb){border:1.5px solid #c9d6d9;background:#fff;border-radius:999px;box-shadow:0 1px 3px rgba(16,19,26,.12);transition:transform .08s ease,background-color .15s,border-color .15s,box-shadow .15s;-webkit-tap-highlight-color:transparent}",
    ".board button:not(.btn):not(.pb):active{transform:scale(.95);box-shadow:none}",
    ".board button:not(.btn):not(.pb):focus-visible{outline:3px solid #e8a33d;outline-offset:2px}",
    ".board button.sel:not(.btn),.board button.on:not(.btn){background:#0f4c5c!important;border-color:#0f4c5c!important;color:#fff!important;box-shadow:0 2px 6px rgba(15,76,92,.35)}",
    ".board button.sel:not(.btn)::after,.board button.on:not(.btn)::after{content:' ✓';font-weight:700}",
    ".board button:not(.btn):not(.pb):disabled{box-shadow:none}"
  ].join("");

  function init() {
    var css = document.createElement("style"); css.textContent = CSS; document.head.appendChild(css);
    var old = document.getElementById("send");
    if (old) {
      var btn = old.cloneNode(true); old.parentNode.replaceChild(btn, old);
      btn.addEventListener("click", function () {
        var j = journal();
        if (!j.length || j.some(function (x) { return !x.a; })) { show(L[lang].empty, false); return; }
        btn.disabled = true; show(L[lang].sending, true);
        var h = document.querySelector("h1");
        post({ type: "labSubmit", answers: j, title: h ? h.textContent.trim() : "" });
      });
    }

    var view = { y: 0 }, board = document.querySelector(".grid > .board"), grid = document.querySelector(".grid");
    var tabsMode = TABS.indexOf(lid) >= 0 && board && grid;
    var root = document.documentElement;
    root.classList.add(tabsMode ? "tabs" : "pin");
    function mobile() { return window.innerWidth <= 860; }
    function docTop(el) { var t = 0; while (el) { t += el.offsetTop; el = el.offsetParent; } return t; }

    /* «Таңдаңыз:» жазуы — тақтадағы таңдау батырмаларының бірінші тобының алдына */
    var hint = null;
    if (board) {
      var first = board.querySelector("button:not(.btn)");
      if (first && first.parentElement) { hint = document.createElement("div"); hint.className = "pick-hint"; first.parentElement.parentNode.insertBefore(hint, first.parentElement); }
    }

    /* ---- бекітілген тақта (телефон) ---- */
    var bar = null, pbtn = null, ptxt = null, auto = false;
    if (board && !tabsMode) {
      bar = document.createElement("div"); bar.className = "pbar";
      bar.innerHTML = '<span><svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"><path d="M9 3h6M10 3v6L4.5 18.5A2 2 0 0 0 6.2 21.5h11.6a2 2 0 0 0 1.7-3L14 9V3" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><path d="M7 16h10l1.5 3h-13z" fill="#5cc2d6"/></svg><b></b></span><button type="button" class="pb"></button>';
      board.insertBefore(bar, board.firstChild);
      pbtn = bar.querySelector(".pb"); ptxt = bar.querySelector("b");
      pbtn.addEventListener("click", function () { auto = false; collapse(!board.classList.contains("mini")); });
    }
    function collapse(mini, keep) {
      if (!bar || board.classList.contains("mini") === mini) return;
      var y0 = keep ? keep.getBoundingClientRect().top : 0;
      board.classList.toggle("mini", mini); labels();
      /* жазатын өріс орнынан жылжымасын */
      if (keep) { var dy = keep.getBoundingClientRect().top - y0; if (Math.abs(dy) > 1) window.scrollBy(0, dy); }
    }
    function isField(el) { return el && el.matches && el.matches("input:not([type=checkbox]):not([type=radio]):not([type=button]),textarea,select"); }
    document.addEventListener("focusin", function (e) {
      if (!bar || !mobile() || !isField(e.target) || board.contains(e.target) || board.classList.contains("mini")) return;
      auto = true; collapse(true, e.target);
    });
    document.addEventListener("focusout", function () {
      setTimeout(function () { if (auto && !isField(document.activeElement)) { auto = false; collapse(false); } }, 200);
    });

    /* ---- екі қойынды (телефон) ---- */
    var tabs = null, note = null, watchUntil = 0, lastBtn = "", taskY = null;
    if (tabsMode) {
      tabs = document.createElement("div"); tabs.className = "ltabs"; tabs.setAttribute("role", "tablist");
      tabs.innerHTML = '<button type="button" role="tab" data-t="exp"></button><button type="button" role="tab" data-t="task"></button>';
      grid.parentNode.insertBefore(tabs, grid);
      note = document.createElement("div"); note.className = "looknote"; note.setAttribute("role", "status");
      board.insertBefore(note, board.firstChild);
      tabs.addEventListener("click", function (e) {
        var b = e.target.closest("button[data-t]"); if (!b) return;
        var t = b.dataset.t, cur = grid.classList.contains("t-exp") ? "exp" : "task";
        if (t === cur) return;
        if (cur === "task") taskY = window.scrollY;
        setTab(t);
        if (t === "task" && taskY !== null) window.scrollTo(0, taskY);   /* тапсырманың кеткен жеріне */
        else toTabs();
      });
      /* тапсырмадағы батырма тәжірибені өзгертсе — «Тәжірибе» қойындысына ауысып, нәтижені көрсету */
      grid.addEventListener("click", function (e) {
        if (!mobile() || !grid.classList.contains("t-task")) return;
        var b = e.target.closest("button"); if (!b || board.contains(b)) return;
        watchUntil = Date.now() + 700; lastBtn = b.textContent.replace(/\s+/g, " ").trim();
      }, true);
      new MutationObserver(function (list) {
        if (Date.now() > watchUntil || !grid.classList.contains("t-task")) return;
        if (list.every(function (m) { return note.contains(m.target); })) return;
        watchUntil = 0; taskY = window.scrollY;
        setTimeout(function () {
          note.textContent = lastBtn && lastBtn.length <= 40 ? "«" + lastBtn + "» — " + L[lang].look : L[lang].look0;
          note.classList.add("show"); setTab("exp"); toTabs();
        }, 150);
      }).observe(board, { subtree: true, childList: true, attributes: true, characterData: true });
    }
    function setTab(t) {
      if (!tabs) return;
      grid.classList.toggle("t-exp", t === "exp"); grid.classList.toggle("t-task", t === "task");
      if (t === "task") note.classList.remove("show");
      tabs.querySelectorAll("button").forEach(function (b) { var on = b.dataset.t === t; b.classList.toggle("on", on); b.setAttribute("aria-selected", on); });
      if (wrap) report();
    }
    function toTabs() { var y = docTop(tabs); if (window.scrollY > y) window.scrollTo(0, y); }
    if (tabsMode) setTab("exp");

    function labels() {
      var t = L[lang];
      if (hint) hint.textContent = t.pick;
      if (bar) { ptxt.textContent = t.exp; pbtn.textContent = board.classList.contains("mini") ? t.show : t.hide; }
      if (tabs) { var bs = tabs.querySelectorAll("button"); bs[0].textContent = t.exp; bs[1].textContent = t.task; }
    }
    relabel = labels;

    /* ---- компьютер: тақта мәтіннің жанында, бет айналғанда экранда қалады ---- */
    function place() {
      if (!board || !grid) return;
      if (mobile()) { board.style.transform = ""; return; }
      var top = docTop(board), h = board.offsetHeight, end = docTop(grid) + grid.offsetHeight;
      var shift = Math.min(Math.max(view.y + 12 - top, 0), Math.max(end - top - h, 0));
      board.style.transform = shift > 0 ? "translateY(" + Math.round(shift) + "px)" : "";
    }
    window.addEventListener("resize", function () { place(); report(); });

    setLang(lang);
    window.addEventListener("message", function (e) {
      var d = e.data || {};
      if (d.type === "labResult") {
        var b = document.getElementById("send"); if (b) { b.disabled = false; if (d.ok) b.textContent = L[lang].resend; }
        show(d.ok ? L[lang].sent : (d.text || L[lang].fail), !!d.ok);
      }
      if (d.type === "labScroll") { view.y = +d.y || 0; place(); }
      if (d.type === "labLang") setLang(d.lang === "ru" ? "ru" : "kk");
      if (d.type === "labPrefill" && Array.isArray(d.answers)) {
        var tas = document.querySelectorAll("textarea");
        d.answers.forEach(function (x, i) { if (tas[i] && !tas[i].value) tas[i].value = x.a || ""; });
      }
    });

    /* Биіктік: компьютерде мазмұн бойынша (бет өздігінен ұзармайды); телефонда ата-бет терезені экран биіктігіне қояды */
    var last = 0, wrap = document.querySelector(".wrap") || document.body;
    function report() {
      var r = wrap.getBoundingClientRect(), h = Math.ceil(r.bottom + window.scrollY + 12);
      if (Math.abs(h - last) > 4) { last = h; post({ type: "labHeight", h: h, mobile: mobile() }); }
    }
    if (window.ResizeObserver) new ResizeObserver(report).observe(document.body);
    setInterval(report, 800); report();
    post({ type: "labReady", mobile: mobile() });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init); else init();
})();
