/* Зертхана бетін сайттың ішіне (iframe) қосу скрипті.
   Тек ?embed=1 болғанда іске қосылады. Жұмысты ата-бетке жібереді, жауапты қабылдайды. */
(function () {
  var qs = new URLSearchParams(location.search);
  if (qs.get("embed") !== "1") return;
  var lang = qs.get("lang") === "ru" ? "ru" : "kk";
  var L = {
    kk: { empty: "Алдымен күнделіктегі сұрақтарға жауап жаз.", sending: "Жіберілуде…", sent: "Жұмыс мұғалімге жіберілді! Мұғалім пікірін өз бетіңнен көресің.", fail: "Жіберу мүмкін болмады. Интернетті тексеріп, қайта көр.", send: "Мұғалімге жіберу", resend: "Қайта жіберу" },
    ru: { empty: "Сначала ответь на вопросы журнала.", sending: "Отправка…", sent: "Работа отправлена учителю! Отзыв учителя появится на твоей странице.", fail: "Не удалось отправить. Проверь интернет и попробуй снова.", send: "Отправить учителю", resend: "Отправить ещё раз" }
  };
  function setLang(l) {
    lang = l;
    var b = document.getElementById(l === "ru" ? "l-ru" : "l-kk");
    if (b) b.click();
    var s = document.getElementById("send");
    if (s) s.textContent = L[lang].send;
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

  function init() {
    var css = document.createElement("style");
    css.textContent = ".note,.lang{display:none!important}body{background:transparent!important}.wrap{padding:0!important;max-width:none!important}" +
      ":root{color-scheme:light!important}.wrap>header{display:none!important}.sheet{box-shadow:none!important;border:1px solid var(--line);padding:clamp(12px,2.2vw,26px)!important}" +
      ".board{position:relative!important;top:auto!important;order:0;z-index:5;transform-origin:top center;transition:box-shadow .2s}" +
      "@media(max-width:860px){.board{order:-1}}.board.floating{box-shadow:0 10px 28px rgba(0,0,0,.28);border-radius:14px}";
    document.head.appendChild(css);
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
    setLang(lang);
    window.addEventListener("message", function (e) {
      var d = e.data || {};
      if (d.type === "labResult") {
        var b = document.getElementById("send"); if (b) { b.disabled = false; if (d.ok) b.textContent = L[lang].resend; }
        show(d.ok ? L[lang].sent : (d.text || L[lang].fail), !!d.ok);
      }
      if (d.type === "labScroll") { view.y = +d.y || 0; view.vh = +d.vh || window.innerHeight; place(); }
      if (d.type === "labLang") setLang(d.lang === "ru" ? "ru" : "kk");
      if (d.type === "labPrefill" && Array.isArray(d.answers)) {
        var tas = document.querySelectorAll("textarea");
        d.answers.forEach(function (x, i) { if (tas[i] && !tas[i].value) tas[i].value = x.a || ""; });
      }
    });
    /* Тәжірибе тақтасын экранда ұстау: сайт бетін айналдырғанда тақта жоғарыда тұрып қалады */
    var view = { y: 0, vh: 800 }, board = document.querySelector(".grid > .board"), grid = document.querySelector(".grid");
    function docTop(el) { var t = 0; while (el) { t += el.offsetTop; el = el.offsetParent; } return t; }
    function place() {
      if (!board || !grid) return;
      var top = docTop(board), h = board.offsetHeight, end = docTop(grid) + grid.offsetHeight;
      var wide = window.innerWidth > 860, s = 1, shift = 0, room;
      if (wide) {
        room = end - top - h; shift = Math.min(Math.max(view.y + 12 - top, 0), Math.max(room, 0));
      } else if (view.y > top + h * 0.6) {
        s = Math.min(1, (view.vh * 0.42) / h); room = end - top - h * s;
        shift = Math.min(Math.max(view.y + 6 - top, 0), Math.max(room, 0));
      }
      board.style.transform = shift > 0 ? "translateY(" + Math.round(shift) + "px)" + (s < 1 ? " scale(" + s.toFixed(3) + ")" : "") : "";
      board.classList.toggle("floating", shift > 0 && (!wide || s < 1));
    }
    window.addEventListener("resize", place);
    /* Биіктікті тек мазмұн бойынша өлшейміз (iframe-нің өз биіктігін емес), сондықтан бет өздігінен ұзармайды */
    var last = 0, root = document.querySelector(".wrap") || document.body;
    function report() { var r = root.getBoundingClientRect(), h = Math.ceil(r.bottom + window.scrollY + 12); if (Math.abs(h - last) > 4) { last = h; post({ type: "labHeight", h: h }); } }
    if (window.ResizeObserver) new ResizeObserver(report).observe(document.body);
    setInterval(report, 800); report();
    post({ type: "labReady" });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init); else init();
})();
