(function () {
  "use strict";

  var app = document.getElementById("app");
  var lessons = window.LESSONS || [];
  var STORE = "english-teacher:v1";

  // ---------- estado salvo no celular (sem conta, sem placar) ----------
  function load() {
    try { return JSON.parse(localStorage.getItem(STORE)) || {}; } catch (e) { return {}; }
  }
  function save(data) {
    try { localStorage.setItem(STORE, JSON.stringify(data)); } catch (e) { /* sem storage, segue sem salvar */ }
  }
  var saved = load();
  saved.done = saved.done || {};
  saved.sentences = saved.sentences || {};

  // ---------- utilidades ----------
  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function shuffle(arr) {
    var a = arr.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }
  function sentenceHTML(parts) {
    return parts.map(function (p) { return p.h ? "<mark>" + esc(p.t) + "</mark>" : esc(p.t); }).join("");
  }
  function norm(s) { return String(s).replace(/\s+/g, " ").trim(); }
  function pick(list) { return list[Math.floor(Math.random() * list.length)]; }

  // ---------- temas: cada tema tem cor, painel e mascote ----------
  // c = cor forte (progresso), soft = fundo suave, dark = texto de etiqueta,
  // panel = cor do painel grande, body = cor do corpo do mascote, mascot = forma
  var THEMES = {
    "Cinema":    { c: "#FF4242", soft: "#FFDAD5", dark: "#D62B2B", panel: "#C5CEF3", body: "#F98B4E", mascot: "star" },
    "Música":    { c: "#2781F9", soft: "#D8E8FF", dark: "#1A62D1", panel: "#EBE887", body: "#EE8888", mascot: "sun" },
    "Arte":      { c: "#E0A800", soft: "#FFF1A8", dark: "#7A6200", panel: "#A58DB8", body: "#D9ADFF", mascot: "hand" },
    "Design":    { c: "#28AF60", soft: "#D5F2E0", dark: "#1B8A49", panel: "#97E3B6", body: "#F7C84B", mascot: "squircle" },
    "Marketing": { c: "#8B6FD1", soft: "#E6DDF8", dark: "#5E45A8", panel: "#F47A52", body: "#FFC9BC", mascot: "capsule" }
  };
  function themeOf(name) { return THEMES[name] || THEMES.Cinema; }
  function setAccent(themeName) {
    var x = themeOf(themeName);
    var s = document.documentElement.style;
    s.setProperty("--accent", x.c);
    s.setProperty("--accent-soft", x.soft);
    s.setProperty("--accent-dark", x.dark);
    s.setProperty("--panel", x.panel);
  }
  function panelColor(themeName) { return themeOf(themeName).panel; }

  // ---------- mascotes ----------
  // Inspirados nas ilustrações de referência: formas planas e orgânicas, rosto só com dois
  // arcos finos nos olhos e um objeto em traço fino preto ligado ao tema (viewBox 200 x 170).
  var INK = "#262B3D";
  var LW = 2.3;
  function ln(fill) { return 'fill="' + (fill || "none") + '" stroke="' + INK + '" stroke-width="' + LW + '" stroke-linecap="round" stroke-linejoin="round"'; }
  function eyes(mood, fx, fy, gap) {
    var l = fx - gap, r = fx + gap;
    if (mood === "oops") {
      return '<circle cx="' + l + '" cy="' + fy + '" r="2.8" fill="' + INK + '"/><circle cx="' + r + '" cy="' + fy + '" r="2.8" fill="' + INK + '"/>' +
        '<path d="M' + (fx - 5) + " " + (fy + 11) + 'h10" ' + ln() + "/>";
    }
    var q = mood === "calm" ? "q7 8 14 0" : "q7-9 14 0";
    return '<path d="M' + (l - 7) + " " + fy + q + "M" + (r - 7) + " " + fy + q + '" ' + ln() + "/>";
  }
  // estrela irregular, de pontas desiguais, como o blob laranja da referência
  function spikyBlob(cx, cy) {
    var ro = [46, 39, 47, 37, 45, 41, 38, 47, 40];
    var ri = [30, 26, 31, 25, 29, 27, 30, 26, 28];
    var pts = [], n = ro.length;
    for (var i = 0; i < n * 2; i++) {
      var r = i % 2 === 0 ? ro[i / 2] : ri[(i - 1) / 2];
      var ang = (Math.PI / n) * i - Math.PI / 2 + 0.18;
      pts.push((cx + r * Math.cos(ang)).toFixed(1) + " " + (cy + r * Math.sin(ang)).toFixed(1));
    }
    return "M" + pts.join("L") + "Z";
  }
  function dome(x, y) { return '<path d="M' + (x - 9) + " " + y + "a9 9 0 0 1 18 0z" + '"'; }

  // cada forma: { body, face: [x, y, gap], prop (só no tamanho grande), box (enquadramento pequeno) }
  var SHAPES = {
    // blob laranja pendurado numa barra (aqui, uma tira de filme)
    star: function (b) {
      var holes = "";
      for (var x = 46; x < 154; x += 12) holes += '<rect x="' + x + '" y="43.6" width="5" height="3" rx=".6"/><rect x="' + x + '" y="52.6" width="5" height="3" rx=".6"/>';
      return {
        body: '<path d="' + spikyBlob(100, 96) + '" fill="' + b + '" stroke="' + b + '" stroke-width="5" stroke-linejoin="round"/>',
        face: [100, 90, 17],
        prop: '<path d="M40 36v100M160 36v100M30 136h20M150 136h20" ' + ln() + '/><rect x="40" y="42" width="120" height="14" rx="2" ' + ln() + '/><g fill="' + INK + '">' + holes + '</g>' +
          '<path d="M62 42a9 9 0 0 1 18 0zM120 42a9 9 0 0 1 18 0z" fill="' + b + '"/>',
        box: "50 46 100 100"
      };
    },
    // sol de dedos em leque, com vão entre eles, sobre uma base achatada, segurando um disco de vinil
    sun: function (b) {
      var rays = "", angs = [156, 128, 102, 78, 52, 24], lens = [60, 66, 72, 72, 66, 60];
      angs.forEach(function (d, i) {
        var a = (Math.PI * d) / 180;
        rays += "M100 124L" + (100 + lens[i] * Math.cos(a)).toFixed(1) + " " + (124 - lens[i] * Math.sin(a)).toFixed(1);
      });
      return {
        body: '<path d="' + rays + '" stroke="' + b + '" stroke-width="20" stroke-linecap="round" fill="none"/><circle cx="100" cy="124" r="25" fill="' + b + '"/><rect x="18" y="124" width="164" height="26" rx="13" fill="' + b + '"/>',
        face: [100, 111, 13],
        prop: '<g ' + ln() + '><circle cx="100" cy="30" r="19"/><circle cx="100" cy="30" r="13.5"/><circle cx="100" cy="30" r="5"/></g><circle cx="80" cy="46" r="7.5" fill="' + b + '"/><circle cx="120" cy="46" r="7.5" fill="' + b + '"/>',
        box: "10 38 180 114"
      };
    },
    // mitene lilás de dois dedos largos, segurando um pincel
    hand: function (b) {
      return {
        body: '<rect x="62" y="24" width="34" height="70" rx="17" fill="' + b + '"/><rect x="100" y="24" width="34" height="70" rx="17" fill="' + b + '"/><rect x="62" y="58" width="72" height="86" rx="27" fill="' + b + '"/>',
        face: [98, 102, 17],
        prop: '<g transform="translate(28 0) rotate(-24 42 128)"><path d="M33 20c0-8 4-14 6-18 2 4 6 10 6 18z" ' + ln() + '/><rect x="31" y="20" width="16" height="12" rx="2" ' + ln() + '/><rect x="35" y="32" width="8" height="96" rx="4" ' + ln() + '/></g><circle cx="68" cy="134" r="11" fill="' + b + '"/>',
        box: "50 18 96 134"
      };
    },
    // quadrado arredondado segurando um lápis
    squircle: function (b) {
      return {
        body: '<rect x="50" y="44" width="100" height="98" rx="38" fill="' + b + '"/>',
        face: [100, 96, 21],
        prop: '<g ' + ln() + '><rect x="34" y="34" width="112" height="14" rx="2"/><path d="M146 34l20 7-20 7z"/><path d="M44 34v14M158 38l8 3-8 3"/></g><path d="M68 40a9 9 0 0 1 18 0zM114 40a9 9 0 0 1 18 0z" fill="' + b + '"/>',
        box: "44 34 112 114"
      };
    },
    // cápsula inclinada com um megafone
    capsule: function (b) {
      return {
        body: '<g transform="rotate(-10 76 82)"><rect x="46" y="22" width="62" height="118" rx="31" fill="' + b + '"/></g>',
        face: [77, 64, 15],
        prop: '<g ' + ln() + '><path d="M124 80h-10v22h10"/><path d="M124 80l36-19v60l-36-19z"/><path d="M118 102l-4 18h12l2-18"/><path d="M168 78q9 13 0 26M176 70q14 21 0 42"/></g><circle cx="116" cy="108" r="11" fill="' + b + '"/>',
        box: "38 16 80 128"
      };
    }
  };

  // big = true desenha o objeto do tema; senão, só o personagem com enquadramento justo
  function mascotSVG(kind, mood, body, big) {
    var s = (SHAPES[kind] || SHAPES.star)(body);
    mood = mood || "happy";
    var box = big ? "0 0 200 170" : s.box;
    var hands = "";
    return '<svg viewBox="' + box + '" aria-hidden="true">' + s.body + eyes(mood, s.face[0], s.face[1], s.face[2]) + (big ? s.prop : "") + "</svg>";
  }
  function mascotFor(lesson, mood, big) {
    var t = themeOf(lesson.theme);
    return mascotSVG(t.mascot, mood, t.body, big);
  }

  // ---------- sessão de uma lição ----------
  var L = null;          // lição atual
  var step = 0;          // índice da etapa
  var STEPS = ["mold", "build", "swap", "own", "end"];
  var exIndex = 0;
  var swapIndex = 0;

  function dots() {
    var n = STEPS.length - 1; // sem contar o "end"
    var html = "";
    for (var i = 0; i < n; i++) {
      html += '<span class="dot ' + (i < step ? "done" : i === step ? "now" : "") + '"></span>';
    }
    return '<div class="top"><div class="dots" aria-hidden="true">' + html + '</div>' +
      '<button class="iconbtn" id="close" aria-label="Sair da lição">✕</button></div>';
  }

  function render(html) {
    app.innerHTML = '<div class="pop">' + html + "</div>";
    window.scrollTo(0, 0);
    var close = document.getElementById("close");
    if (close) close.onclick = home;
  }

  // ---------- home ----------
  function home() {
    var next = lessons.filter(function (l) { return !saved.done[l.id]; })[0] || lessons[0];
    setAccent(next.theme);
    var doneCount = lessons.filter(function (l) { return saved.done[l.id]; }).length;
    var list = lessons.map(function (l) {
      var t = themeOf(l.theme);
      var done = saved.done[l.id];
      return '<button class="row-lesson' + (done ? " is-done" : "") + '" data-id="' + l.id + '">' +
        '<span class="dotc" style="background:' + t.panel + '"></span>' +
        '<span class="rl-text"><span class="rl-n">' + l.id + '</span> ' + esc(l.title) + '<small>' + esc(l.grammar) + "</small></span>" +
        '<span class="rl-check">' + (done ? "✓" : "") + "</span></button>";
    }).join("");
    render(
      '<section class="hero">' +
      '<h1>Oi, Nayara<span class="pop-dot">.</span></h1>' +
      "<p>Uma lição curtinha por dia, no seu ritmo. Sem nota, sem sequência, sem culpa.</p>" +
      "</section>" +
      '<div class="card lesson">' +
      '<div class="rowtop"><span class="pill">Hoje · 3 min</span><span class="arrow" aria-hidden="true">↗</span></div>' +
      "<h2>" + esc(next.title) + "</h2>" +
      '<p class="pt">' + esc(next.theme) + " · " + esc(next.grammar) + "</p>" +
      '<div class="panel big"><span class="mascot lg">' + mascotFor(next, "happy", true) + "</span></div>" +
      '<button class="btn" id="start" data-id="' + next.id + '">Começar</button>' +
      "</div>" +
      (lessons.length > 1 ? '<details class="card all"><summary><h3>Todas as lições</h3><span class="small">' + doneCount + " de " + lessons.length + " feitas</span></summary><div class=\"lessons\">" + list + "</div></details>" : "")
    );
    app.querySelectorAll("[data-id]").forEach(function (b) {
      b.onclick = function () { startLesson(Number(b.getAttribute("data-id"))); };
    });
  }

  function startLesson(id) {
    L = lessons.filter(function (l) { return l.id === id; })[0];
    setAccent(L.theme);
    step = 0; exIndex = 0;
    swapIndex = Math.max(0, (window.THEME_ORDER || []).indexOf(L.theme));
    go();
  }

  function go() { views[STEPS[step]](); }
  function next() { step++; go(); }

  // ---------- etapas ----------
  var views = {};

  views.mold = function () {
    var m = L.mold;
    render(
      dots() +
      '<div class="card">' +
      '<span class="tag">1 · O molde</span>' +
      '<p class="small">' + esc(L.theme) + " · " + esc(L.grammar) + "</p>" +
      '<div class="panel">' +
      '<div class="sentence">' + sentenceHTML(m.sentence) + "</div>" +
      '<p class="pt">' + esc(m.pt) + "</p>" +
      '<span class="mascot sm">' + mascotFor(L, "calm") + "</span>" +
      "</div>" +
      "</div>" +
      '<div class="card">' +
      "<h3>Quando usar</h3>" +
      '<p style="margin-top:8px">' + esc(m.explain) + "</p>" +
      (m.analogy ? '<div class="analogy">' + esc(m.analogy) + "</div>" : "") +
      '<h3 style="margin-top:22px">Como montar</h3>' +
      '<ul class="formula">' + m.formula.map(function (f) { return "<li>" + esc(f) + "</li>"; }).join("") + "</ul>" +
      (m.note ? '<h3 style="margin-top:22px">Atenção ao particípio</h3><p style="margin-top:8px">' + esc(m.note) + "</p>" : "") +
      "</div>" +
      '<button class="btn" id="go">Bora praticar</button>'
    );
    document.getElementById("go").onclick = next;
  };

  var HIT_TITLES = ["Isso aí!", "Mandou bem.", "Na mosca.", "Acertou em cheio.", "É isso mesmo."];
  var MISS_TITLES = ["Quase. O certo é:", "Foi por pouco. O certo é:", "Ops, essa escapou. O certo é:", "Tudo bem, acontece. O certo é:"];

  function feedbackHTML(ok, answerText, ex) {
    return '<div class="fbp ' + (ok ? "right" : "wrong") + '">' +
      '<div class="fbtext">' +
      '<div class="t">' + (ok ? pick(HIT_TITLES) : pick(MISS_TITLES)) + "</div>" +
      (ok ? (ex.right ? '<div class="fun">' + esc(ex.right) + "</div>" : "") : '<div class="ans">' + esc(answerText) + "</div>") +
      "</div>" +
      '<span class="mascot fb-m">' + mascotFor(L, ok ? "happy" : "oops") + "</span>" +
      '<div class="lbl">Por quê</div>' +
      '<div class="why">' + esc(ex.why) + "</div></div>";
  }

  views.build = function () {
    var ex = L.exercises[exIndex];
    var total = L.exercises.length;
    var isLast = exIndex === total - 1;
    var checked = false;
    var head = dots() +
      '<div class="card"><span class="tag">2 · Monte a frase · ' + (exIndex + 1) + "/" + total + "</span>";

    function finish() { if (isLast) next(); else { exIndex++; views.build(); } }

    if (ex.type === "order") {
      var placed = [];
      var pool = shuffle(ex.blocks.concat(ex.extra || []));
      var draw = function () {
        document.getElementById("zone").innerHTML = placed.map(function (b, i) {
          return '<button class="chip placed" data-p="' + i + '"' + (checked ? " disabled" : "") + ">" + esc(pool[b]) + "</button>";
        }).join("");
        document.getElementById("pool").innerHTML = checked ? "" : pool.map(function (t, i) {
          return '<button class="chip ' + (placed.indexOf(i) > -1 ? "used" : "") + '" data-i="' + i + '">' + esc(t) + "</button>";
        }).join("");
        document.getElementById("pool").style.minHeight = checked ? "0" : "";
        document.getElementById("ok").disabled = placed.length === 0;
        if (checked) return;
        document.querySelectorAll("#zone [data-p]").forEach(function (b) {
          b.onclick = function () { placed.splice(Number(b.getAttribute("data-p")), 1); draw(); };
        });
        document.querySelectorAll("#pool [data-i]").forEach(function (b) {
          b.onclick = function () { placed.push(Number(b.getAttribute("data-i"))); draw(); };
        });
      };
      render(
        head +
        '<p class="pt">' + esc(ex.pt) + "</p>" +
        '<div class="zone" id="zone" aria-label="Sua frase"></div>' +
        '<div class="pool" id="pool"></div>' +
        '<div id="fb"></div>' +
        '<button class="btn" id="ok" disabled>Conferir</button></div>'
      );
      draw();
      document.getElementById("ok").onclick = function () {
        if (checked) { finish(); return; }
        checked = true;
        var given = placed.map(function (i) { return pool[i]; }).join(" ");
        var ok = norm(given) === norm(ex.answer);
        document.getElementById("zone").classList.add(ok ? "right" : "wrong");
        document.getElementById("fb").innerHTML = feedbackHTML(ok, ex.answer, ex);
        document.getElementById("ok").textContent = isLast ? "Continuar" : "Próxima";
        draw();
        document.getElementById("ok").disabled = false;
      };
    } else {
      var chosen = null;
      var parts = ex.prompt.split("___");
      render(
        head +
        '<p class="sentence">' + esc(parts[0]) + '<span class="gap">&nbsp;?&nbsp;</span>' + esc(parts[1] || "") + "</p>" +
        '<div class="options" id="opts">' +
        ex.options.map(function (o, i) { return '<button class="opt" data-o="' + i + '">' + esc(o) + "</button>"; }).join("") +
        "</div>" +
        '<div id="fb"></div>' +
        '<button class="btn" id="ok" disabled>Conferir</button></div>'
      );
      document.querySelectorAll("#opts [data-o]").forEach(function (b) {
        b.onclick = function () {
          if (checked) return;
          chosen = Number(b.getAttribute("data-o"));
          document.querySelectorAll("#opts .opt").forEach(function (x) { x.classList.remove("sel"); });
          b.classList.add("sel");
          document.getElementById("ok").disabled = false;
        };
      });
      document.getElementById("ok").onclick = function () {
        if (checked) { finish(); return; }
        checked = true;
        var ok = chosen === ex.answer;
        document.querySelectorAll("#opts .opt").forEach(function (x, i) {
          x.disabled = true;
          x.classList.remove("sel");
          if (i === ex.answer) x.classList.add("right");
          else if (i === chosen) x.classList.add("wrong");
        });
        document.getElementById("fb").innerHTML = feedbackHTML(ok, ex.prompt.replace("___", ex.options[ex.answer]), ex);
        document.getElementById("ok").textContent = isLast ? "Continuar" : "Próxima";
      };
    }
  };

  views.swap = function () {
    var s = L.swap;
    var it = s.items[swapIndex];
    render(
      dots() +
      '<div class="card"><span class="tag">3 · Troque as peças</span>' +
      "<p>" + esc(s.intro) + "</p>" +
      '<div class="themes" id="themes">' +
      s.items.map(function (x, i) {
        return '<button class="theme ' + (i === swapIndex ? "sel" : "") + '" data-t="' + i + '">' + esc(x.label) + "</button>";
      }).join("") +
      "</div>" +
      '<div class="panel" style="--panel:' + panelColor(it.label) + '">' +
      '<div class="sentence">' + sentenceHTML(it.sentence) + "</div>" +
      '<p class="pt">' + esc(it.pt) + "</p>" +
      "</div>" +
      "</div>" +
      '<button class="btn" id="go">Próximo</button>'
    );
    document.querySelectorAll("#themes [data-t]").forEach(function (b) {
      b.onclick = function () { swapIndex = Number(b.getAttribute("data-t")); views.swap(); };
    });
    document.getElementById("go").onclick = next;
  };

  views.own = function () {
    var o = L.own;
    var prev = (saved.sentences[L.id] || "");
    render(
      dots() +
      '<div class="card"><span class="tag">4 · Sua frase</span>' +
      "<p>" + esc(o.prompt) + "</p>" +
      '<textarea id="txt" placeholder="' + esc(o.placeholder) + '" lang="en" autocapitalize="sentences" spellcheck="false">' + esc(prev) + "</textarea>" +
      '<button class="btn" id="show">Ver jeitos de dizer</button>' +
      '<div id="models"></div>' +
      "</div>" +
      '<button class="btn" id="go">Terminar</button>'
    );
    var txt = document.getElementById("txt");
    document.getElementById("show").onclick = function () {
      saved.sentences[L.id] = txt.value;
      save(saved);
      document.getElementById("models").innerHTML =
        '<h3 style="margin-top:20px">Jeitos corretos</h3>' +
        '<ul class="formula">' + o.models.map(function (m) { return "<li>" + esc(m) + "</li>"; }).join("") + "</ul>" +
        '<h3 style="margin-top:20px">Compare a sua</h3>' +
        '<ul class="checklist">' + o.checklist.map(function (c) { return "<li>" + esc(c) + "</li>"; }).join("") + "</ul>";
      document.getElementById("show").style.display = "none";
    };
    document.getElementById("go").onclick = function () {
      saved.sentences[L.id] = txt.value;
      saved.done[L.id] = true;
      save(saved);
      next();
    };
  };

  views.end = function () {
    render(
      '<section class="hero">' +
      '<h1>Pronto por hoje<span class="pop-dot">.</span></h1>' +
      "<p>Você fez a lição de " + esc(L.grammar) + ". Amanhã tem outra, ou quando você quiser.</p>" +
      "</section>" +
      '<div class="panel big celebrate"><span class="mascot lg">' + mascotFor(L, "happy", true) + "</span></div>" +
      '<button class="btn" id="home">Voltar ao início</button>' +
      '<button class="btn ghost" id="again">Refazer essa lição</button>'
    );
    document.getElementById("home").onclick = home;
    document.getElementById("again").onclick = function () { startLesson(L.id); };
  };

  // ---------- início ----------
  home();

  if ("serviceWorker" in navigator && location.protocol.indexOf("http") === 0) {
    navigator.serviceWorker.register("sw.js").catch(function () {});
  }
})();
