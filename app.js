(function () {
  "use strict";

  var app = document.getElementById("app");
  var allLessons = window.LESSONS || [];
  // agrupa na ordem de estudo definida em lessons.js (LESSON_GROUPS); o que ficar sem grupo vai para "Outras"
  var groups = (window.LESSON_GROUPS || []).map(function (g) {
    return { name: g.name, items: g.ids.map(function (id) { return allLessons.filter(function (l) { return l.id === id; })[0]; }).filter(Boolean) };
  });
  var grouped = [];
  groups.forEach(function (g) { grouped = grouped.concat(g.items); });
  var loose = allLessons.filter(function (l) { return grouped.indexOf(l) < 0; });
  if (loose.length) groups.push({ name: "Outras", items: loose });
  var lessons = grouped.concat(loose);
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
  saved.read = saved.read || {};
  saved.miss = saved.miss || {};     // id da lição -> quantos erros ainda estão em aberto
  saved.missEx = saved.missEx || {}; // "idLição:númeroDoExercício" -> erros desse exercício
  var readings = window.READINGS || [];

  function slip(lid, key) {
    if (!lid) return;
    saved.miss[lid] = (saved.miss[lid] || 0) + 1;
    if (key) saved.missEx[key] = (saved.missEx[key] || 0) + 1;
    save(saved);
  }
  // acertar na revisão tira um erro da lista
  function recover(lid, key) {
    if (key && saved.missEx[key] > 0) saved.missEx[key]--;
    if (saved.miss[lid] > 0) saved.miss[lid]--;
    save(saved);
  }
  function lessonById(id) { return allLessons.filter(function (l) { return l.id === id; })[0]; }
  function weakLessons() {
    return lessons.filter(function (l) { return saved.miss[l.id] > 0; })
      .sort(function (a, b) { return saved.miss[b.id] - saved.miss[a.id]; });
  }

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
    "Arte":      { c: "#E0A800", soft: "#FFF1A8", dark: "#7A6200", panel: "#A58DB8", body: "#D9ADFF", mascot: "hand" }
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
  // arcos finos nos olhos, duas bolinhas da cor do corpo como mãos (seguram o objeto, como na referência) e um objeto em traço fino preto ligado ao tema (viewBox 200 x 170).
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

  // Cada personagem tem um corpo fixo e uma lista de "personalidades" (objeto ou acessório do tema).
  // Cada lição pega uma delas, para os mascotes não repetirem sempre o mesmo objeto.
  function dome(x, y, b) { return '<path d="M' + (x - 9) + " " + y + 'a9 9 0 0 1 18 0z" fill="' + b + '"/>'; }
  var SHAPES = {
    // CINEMA: blob de pontas, pendurado ou segurando algo
    star: function (b) {
      var holes = "";
      for (var x = 46; x < 154; x += 12) holes += '<rect x="' + x + '" y="43.6" width="5" height="3" rx=".6"/><rect x="' + x + '" y="52.6" width="5" height="3" rx=".6"/>';
      return {
        body: '<path d="' + spikyBlob(100, 96) + '" fill="' + b + '" stroke="' + b + '" stroke-width="5" stroke-linejoin="round"/>',
        face: [100, 90, 17],
        box: "50 46 100 100",
        props: [
          // tira de filme entre dois postes
          '<path d="M40 36v100M160 36v100M30 136h20M150 136h20" ' + ln() + '/><rect x="40" y="42" width="120" height="14" rx="2" ' + ln() + '/><g fill="' + INK + '">' + holes + '</g>' + dome(71, 42, b) + dome(129, 42, b),
          // claquete
          '<rect x="68" y="28" width="64" height="22" rx="2" ' + ln("#fff") + '/><path d="M68 16h64v12H68z" ' + ln("#fff") + '/><path d="M82 16l-6 12M96 16l-6 12M110 16l-6 12M124 16l-6 12" ' + ln() + '/><path d="M78 38h22M78 44h38" ' + ln() + '/>' + dome(80, 52, b) + dome(120, 52, b),
          // balde de pipoca
          '<g ' + ln("#FFF6D6") + '><circle cx="80" cy="26" r="8"/><circle cx="94" cy="19" r="9"/><circle cx="108" cy="19" r="9"/><circle cx="121" cy="26" r="8"/></g><path d="M72 28h56l-6 26H78z" ' + ln("#fff") + '/><path d="M84 28l1.5 26M100 28v26M116 28l-1.5 26" stroke="#FF6B5B" stroke-width="5" fill="none"/>' + dome(78, 54, b) + dome(122, 54, b),
          // óculos 3D
          '<rect x="68" y="80" width="26" height="20" rx="6" fill="#FF4B4B" fill-opacity=".62" ' + ln().replace('fill="none" ', "") + '/><rect x="106" y="80" width="26" height="20" rx="6" fill="#3A86FF" fill-opacity=".62" ' + ln().replace('fill="none" ', "") + '/><path d="M94 88h12M68 86l-9-3M132 86l9-3" ' + ln() + '/><circle cx="58" cy="84" r="7.5" fill="' + b + '"/><circle cx="142" cy="84" r="7.5" fill="' + b + '"/>'
        ]
      };
    },
    // MÚSICA: sol de dedos em leque sobre uma base achatada
    sun: function (b) {
      var rays = "", angs = [160, 132, 104, 76, 48, 20], lens = [78, 82, 80, 80, 82, 78];
      angs.forEach(function (d, i) {
        var a = (Math.PI * d) / 180;
        rays += "M100 126L" + (100 + lens[i] * Math.cos(a)).toFixed(1) + " " + (126 - lens[i] * Math.sin(a)).toFixed(1);
      });
      return {
        body: '<path d="' + rays + '" stroke="' + b + '" stroke-width="18" stroke-linecap="round" fill="none"/><circle cx="100" cy="126" r="20" fill="' + b + '"/><rect x="18" y="124" width="164" height="26" rx="13" fill="' + b + '"/>',
        face: [100, 114, 14],
        box: "8 34 184 118",
        props: [
          // disco de vinil
          '<g ' + ln() + '><circle cx="100" cy="30" r="19"/><circle cx="100" cy="30" r="13.5"/><circle cx="100" cy="30" r="5"/></g><circle cx="80" cy="46" r="7.5" fill="' + b + '"/><circle cx="120" cy="46" r="7.5" fill="' + b + '"/>',
          // fones de ouvido
          '<path d="M66 124a34 34 0 0 1 68 0" ' + ln() + ' stroke-width="4"/><rect x="58" y="112" width="15" height="28" rx="7" fill="' + INK + '"/><rect x="127" y="112" width="15" height="28" rx="7" fill="' + INK + '"/>',
          // notas musicais
          '<g ' + ln() + '><path d="M82 52V22l32-7v32M82 30l32-7"/><ellipse cx="76" cy="53" rx="8" ry="5.5" fill="' + INK + '" transform="rotate(-18 76 53)"/><ellipse cx="108" cy="46" rx="8" ry="5.5" fill="' + INK + '" transform="rotate(-18 108 46)"/></g><circle cx="82" cy="36" r="7.5" fill="' + b + '"/><circle cx="114" cy="30" r="7.5" fill="' + b + '"/>',
          // microfone
          '<g ' + ln() + '><circle cx="100" cy="28" r="14" fill="#fff"/><path d="M90 22l17 13M88 30l13 11M96 16l15 11"/><path d="M100 42v12"/></g><circle cx="86" cy="52" r="7.5" fill="' + b + '"/><circle cx="114" cy="52" r="7.5" fill="' + b + '"/>'
        ]
      };
    },
    // ARTE: mitene de dois dedos
    hand: function (b) {
      return {
        body: '<rect x="62" y="24" width="34" height="70" rx="17" fill="' + b + '"/><rect x="100" y="24" width="34" height="70" rx="17" fill="' + b + '"/><rect x="62" y="58" width="72" height="86" rx="27" fill="' + b + '"/>',
        face: [98, 102, 17],
        box: "50 18 96 134",
        props: [
          // pincel
          '<g transform="translate(28 0) rotate(-24 42 128)"><path d="M33 20c0-8 4-14 6-18 2 4 6 10 6 18z" ' + ln() + '/><rect x="31" y="20" width="16" height="12" rx="2" ' + ln() + '/><rect x="35" y="32" width="8" height="96" rx="4" ' + ln() + '/></g><circle cx="68" cy="134" r="11" fill="' + b + '"/><circle cx="78" cy="108" r="9" fill="' + b + '"/>',
          // paleta de tintas
          '<ellipse cx="38" cy="104" rx="27" ry="22" transform="rotate(-18 38 104)" ' + ln("#fff") + '/><circle cx="26" cy="96" r="4" fill="#FF6B6B"/><circle cx="40" cy="88" r="4" fill="#4D96FF"/><circle cx="55" cy="93" r="4" fill="#FFD93D"/><circle cx="32" cy="113" r="4.5" ' + ln("#A58DB8") + '/><circle cx="64" cy="128" r="11" fill="' + b + '"/><circle cx="28" cy="128" r="9" fill="' + b + '"/>',
          // boina
          '<ellipse cx="98" cy="26" rx="38" ry="13" transform="rotate(-8 98 26)" fill="#E8554E"/><circle cx="119" cy="12" r="4" fill="#E8554E"/><circle cx="54" cy="100" r="9" fill="' + b + '"/><circle cx="142" cy="100" r="9" fill="' + b + '"/>'
        ]
      };
    },
    // DESIGN: quadrado arredondado
    squircle: function (b) {
      return {
        body: '<rect x="50" y="44" width="100" height="98" rx="38" fill="' + b + '"/>',
        face: [100, 96, 21],
        box: "44 34 112 114",
        props: [
          // lápis
          '<g ' + ln() + '><rect x="34" y="34" width="112" height="14" rx="2"/><path d="M146 34l20 7-20 7z"/><path d="M44 34v14M158 38l8 3-8 3"/></g>' + dome(68, 40, b) + dome(114, 40, b),
          // régua
          '<rect x="38" y="32" width="124" height="16" rx="2" ' + ln("#fff") + '/><path d="M52 32v7M64 32v10M76 32v7M88 32v10M100 32v7M112 32v10M124 32v7M136 32v10M148 32v7" ' + ln() + '/>' + dome(68, 40, b) + dome(132, 40, b),
          // amostras de cor
          '<g stroke="' + INK + '" stroke-width="2.3"><rect x="46" y="28" width="26" height="20" rx="4" fill="#FF6B6B"/><rect x="76" y="28" width="26" height="20" rx="4" fill="#FFD93D"/><rect x="106" y="28" width="26" height="20" rx="4" fill="#4D96FF"/><rect x="136" y="28" width="26" height="20" rx="4" fill="#28AF60"/></g>' + dome(66, 40, b) + dome(120, 40, b),
          // ponta de caneta vetorial
          '<g ' + ln("#fff") + '><path d="M100 8l20 28-20 15-20-15z"/><circle cx="100" cy="30" r="4.5"/></g><path d="M100 34v14" ' + ln() + '/>' + dome(82, 44, b) + dome(118, 44, b)
        ]
      };
    },
    // MARKETING: cápsula inclinada
    capsule: function (b) {
      return {
        body: '<g transform="rotate(-10 76 82)"><rect x="46" y="22" width="62" height="118" rx="31" fill="' + b + '"/></g>',
        face: [77, 64, 15],
        box: "38 16 80 128",
        props: [
          // megafone
          '<g ' + ln() + '><path d="M124 80h-10v22h10"/><path d="M124 80l36-19v60l-36-19z"/><path d="M118 102l-4 18h12l2-18"/><path d="M168 78q9 13 0 26M176 70q14 21 0 42"/></g><circle cx="116" cy="108" r="11" fill="' + b + '"/><circle cx="122" cy="84" r="9" fill="' + b + '"/>',
          // gráfico de barras
          '<path d="M122 122V64M122 122h52" ' + ln() + '/><rect x="130" y="100" width="11" height="22" ' + ln("#fff") + '/><rect x="146" y="84" width="11" height="38" ' + ln("#fff") + '/><rect x="162" y="66" width="11" height="56" ' + ln("#fff") + '/><circle cx="114" cy="104" r="11" fill="' + b + '"/><circle cx="126" cy="124" r="9" fill="' + b + '"/>',
          // alvo com flecha
          '<circle cx="142" cy="86" r="28" ' + ln("#fff") + '/><circle cx="142" cy="86" r="19" ' + ln("#FF6B5B") + '/><circle cx="142" cy="86" r="9" ' + ln("#fff") + '/><path d="M142 86l26-26M168 60h-9M168 60v9" ' + ln() + '/><circle cx="114" cy="106" r="11" fill="' + b + '"/><circle cx="118" cy="76" r="9" fill="' + b + '"/>',
          // balão de curtida
          '<rect x="122" y="48" width="58" height="44" rx="14" ' + ln("#fff") + '/><path d="M132 92l-8 16 20-16" ' + ln("#fff") + '/><path d="M151 82c-13-8-13-20-5-20 3 0 5 3 5 4 0-1 2-4 5-4 8 0 8 12-5 20z" fill="#FF4B4B"/><circle cx="114" cy="108" r="11" fill="' + b + '"/><circle cx="128" cy="94" r="9" fill="' + b + '"/>'
        ]
      };
    }
  };

  // big = true desenha a personalidade da lição (objeto ou acessório); senão, só o personagem
  function mascotSVG(kind, mood, body, big, variant) {
    var s = (SHAPES[kind] || SHAPES.star)(body);
    mood = mood || "happy";
    var box = big ? "0 0 200 170" : s.box;
    var prop = big ? s.props[(variant || 0) % s.props.length] : "";
    return '<svg viewBox="' + box + '" aria-hidden="true">' + s.body + eyes(mood, s.face[0], s.face[1], s.face[2]) + prop + "</svg>";
  }
  // a n-ésima lição de um tema pega a n-ésima personalidade
  function variantOf(lesson) {
    return lessons.filter(function (l) { return l.theme === lesson.theme && l.id < lesson.id; }).length;
  }
  function mascotFor(lesson, mood, big) {
    var t = themeOf(lesson.theme);
    return mascotSVG(t.mascot, mood, t.body, big, variantOf(lesson));
  }

  // ---------- sessão de uma lição ----------
  var L = null;          // lição atual
  var step = 0;          // índice da etapa
  var LESSON_STEPS = ["mold", "build", "swap", "own", "end"];
  var READ_STEPS = ["rRead", "rFill", "rTrans", "end"];
  var REVIEW_STEPS = ["build", "end"];
  var STEPS = LESSON_STEPS;
  var exIndex = 0;
  var swapIndex = 0;

  function dots() {
    var n = STEPS.length - 1; // sem contar o "end"
    var html = "";
    for (var i = 0; i < n; i++) {
      html += '<span class="dot ' + (i < step ? "done" : i === step ? "now" : "") + '"></span>';
    }
    return '<div class="top">' +
      (trail.length ? '<button class="iconbtn" id="back" aria-label="Voltar">‹</button>' : "") +
      '<div class="dots" aria-hidden="true">' + html + '</div>' +
      '<button class="iconbtn" id="close" aria-label="Sair da lição">✕</button></div>';
  }

  var firstRender = true;
  function render(html) {
    app.innerHTML = '<div class="pop">' + html + "</div>";
    window.scrollTo(0, 0);
    var close = document.getElementById("close");
    if (close) close.onclick = leave;
    var back = document.getElementById("back");
    if (back) back.onclick = function () { history.back(); };
    // leva o foco para o título da nova tela, senão leitor de tela e teclado ficam perdidos
    // depois que o innerHTML é trocado (não no primeiro carregamento)
    if (!firstRender) {
      var h = app.querySelector("h1, h2, .tag");
      if (h) { h.setAttribute("tabindex", "-1"); h.focus({ preventScroll: true }); }
    }
    firstRender = false;
  }

  // ---------- botão voltar do celular ----------
  // abrir uma lição empilha uma entrada no histórico; voltar (ou o ✕) retorna à home
  // em vez de fechar o app.
  // cada tela nova da lição também empilha uma entrada: o botão ‹, o gesto de voltar do iPhone
  // e o voltar do Android retornam à tela anterior (trail guarda por onde você passou).
  var inLesson = false;
  var trail = [];
  var exiting = false;
  function leave() {
    if (!inLesson) { home(); return; }
    exiting = true;
    history.go(-(trail.length + 1)); // desfaz todas as entradas da lição de uma vez
  }
  function forward(change) {
    trail.push({ step: step, exIndex: exIndex });
    history.pushState({ lesson: L.id, n: trail.length }, "", "#licao-" + L.id);
    change();
    go();
  }
  window.addEventListener("popstate", function () {
    if (!exiting && inLesson && trail.length) {
      var t = trail.pop();
      var txt = document.getElementById("txt"); // não perde a frase digitada ao voltar
      if (txt && L) { saved.sentences[L.id] = txt.value; save(saved); }
      step = t.step; exIndex = t.exIndex;
      go();
      return;
    }
    exiting = false; inLesson = false; trail = [];
    home();
  });
  if (location.hash) history.replaceState(null, "", location.pathname + location.search);

  // ---------- home ----------
  function home() {
    var next = lessons.filter(function (l) { return !saved.done[l.id]; })[0] || lessons[0];
    setAccent(next.theme);
    var doneCount = lessons.filter(function (l) { return saved.done[l.id]; }).length;
    var list = groups.map(function (g) {
      var rows = g.items.map(function (l) {
        var t = themeOf(l.theme);
        var done = saved.done[l.id];
        return '<button class="row-lesson' + (done ? " is-done" : "") + '" data-id="' + l.id + '">' +
          '<span class="dotc" style="background:' + t.panel + '"></span>' +
          '<span class="rl-text"><span class="rl-n">' + (lessons.indexOf(l) + 1) + '</span> ' + esc(l.title) + '<small><span class="rl-theme" style="background:' + t.panel + '">' + esc(l.theme) + "</span>" + esc(l.grammar) + "</small></span>" +
          '<span class="rl-check">' + (done ? "✓" : "") + "</span></button>";
      }).join("");
      var n = g.items.filter(function (l) { return saved.done[l.id]; }).length;
      return '<div class="grp"><h4>' + esc(g.name) + '<span>' + n + "/" + g.items.length + "</span></h4>" + rows + "</div>";
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
      weakHTML() +
      (lessons.length > 1 ? '<details class="card all"><summary><h3>Todas as lições</h3><span class="small">' + doneCount + " de " + lessons.length + " feitas</span></summary><div class=\"lessons\">" + list + "</div></details>" : "") +
      (readings.length ? readingsHTML() : "")
    );
    app.querySelectorAll("[data-id]").forEach(function (b) {
      b.onclick = function () { startLesson(Number(b.getAttribute("data-id"))); };
    });
    var rv = document.getElementById("review");
    if (rv) rv.onclick = startReview;
    app.querySelectorAll("[data-r]").forEach(function (b) {
      b.onclick = function () { startReading(Number(b.getAttribute("data-r"))); };
    });
  }

  function weakHTML() {
    var ranked = weakLessons();
    if (!ranked.length) return "";
    var top = ranked.slice(0, 5);
    var max = saved.miss[top[0].id];
    var rows = top.map(function (l) {
      var t = themeOf(l.theme), n = saved.miss[l.id];
      return '<button class="row-lesson" data-id="' + l.id + '">' +
        '<span class="dotc" style="background:' + t.panel + '"></span>' +
        '<span class="rl-text"><span class="rl-n">' + (lessons.indexOf(l) + 1) + "</span> " + esc(l.title) + "<small>" + esc(l.grammar) + "</small>" +
        '<span class="missbar"><i style="width:' + Math.round(100 * n / max) + '%"></i></span></span>' +
        '<span class="rl-miss">' + n + (n === 1 ? " erro" : " erros") + "</span></button>";
    }).join("");
    return '<div class="card weak"><h3>Onde você mais escorregou</h3>' +
      '<p class="small" style="margin:8px 0 0">Contando exercícios e leituras. Errar faz parte: é aqui que a revisão ajuda. Acertar na revisão tira o erro da lista.</p>' +
      '<div class="lessons">' + rows + "</div>" +
      '<button class="btn" id="review">Revisar agora</button></div>';
  }

  function startReview() {
    var ranked = weakLessons().slice(0, 3);
    if (!ranked.length) return;
    var exs = [];
    ranked.forEach(function (l) {
      var weak = [], rest = [];
      l.exercises.forEach(function (e, i) {
        var c = Object.assign({}, e, { _lid: l.id, _key: l.id + ":" + i });
        (saved.missEx[c._key] > 0 ? weak : rest).push(c);
      });
      exs = exs.concat(weak, shuffle(rest).slice(0, weak.length ? 1 : 2));
    });
    L = { id: "rev", review: true, theme: ranked[0].theme, title: "Revisão", grammar: "Revisão dos seus pontos fracos", exercises: shuffle(exs).slice(0, 8) };
    STEPS = REVIEW_STEPS;
    setAccent(L.theme);
    if (!inLesson) { history.pushState({ lesson: "rev" }, "", "#revisao"); inLesson = true; }
    trail = [];
    step = 0; exIndex = 0;
    go();
  }

  function readingsHTML() {
    var n = readings.filter(function (r) { return saved.read[r.id]; }).length;
    var rows = readings.map(function (r) {
      var t = themeOf(r.theme);
      var done = saved.read[r.id];
      return '<button class="row-lesson' + (done ? " is-done" : "") + '" data-r="' + r.id + '">' +
        '<span class="dotc" style="background:' + t.panel + '"></span>' +
        '<span class="rl-text">' + esc(r.title) + '<small><span class="rl-theme" style="background:' + t.panel + '">' + esc(r.theme) + "</span>" + esc(r.grammar) + "</small></span>" +
        '<span class="rl-check">' + (done ? "✓" : "") + "</span></button>";
    }).join("");
    return '<details class="card all"><summary><h3>Leituras</h3><span class="small">' + n + " de " + readings.length + ' feitas</span></summary><p class="small" style="margin:10px 0 0">Um resumo curto para ler, completar com as palavras das lições e traduzir.</p><div class="lessons">' + rows + "</div></details>";
  }

  function startReading(id) {
    L = readings.filter(function (r) { return r.id === id; })[0];
    STEPS = READ_STEPS;
    setAccent(L.theme);
    if (!inLesson) { history.pushState({ lesson: id }, "", "#leitura-" + id); inLesson = true; }
    trail = [];
    step = 0; exIndex = 0;
    go();
  }

  function startLesson(id) {
    L = lessons.filter(function (l) { return l.id === id; })[0];
    STEPS = LESSON_STEPS;
    setAccent(L.theme);
    if (!inLesson) { history.pushState({ lesson: id }, "", "#licao-" + id); inLesson = true; }
    trail = [];
    step = 0; exIndex = 0;
    swapIndex = Math.max(0, (window.THEME_ORDER || []).indexOf(L.theme));
    go();
  }

  function go() { views[STEPS[step]](); }
  function next() { forward(function () { step++; }); }

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

  // rola até o feedback, deixando folga para a barra inferior do Safari
  function revealFb() {
    var f = document.getElementById("fb");
    if (f && f.scrollIntoView) setTimeout(function () { f.scrollIntoView({ block: "end", behavior: "smooth" }); }, 60);
  }

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
      '<div class="card"><span class="tag">' + (L.review ? "Revisão" : "2 · Monte a frase") + " · " + (exIndex + 1) + "/" + total + "</span>";
    function record(ok) {
      var lid = ex._lid || L.id, key = ex._key || (L.id + ":" + exIndex);
      if (ok) { if (L.review) recover(lid, key); } else slip(lid, key);
    }

    function finish() { if (isLast) next(); else forward(function () { exIndex++; }); }

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
        '<div class="zone" id="zone" role="group" aria-label="Sua frase"></div>' +
        '<div class="pool" id="pool"></div>' +
        '<div id="fb" role="status" aria-live="polite"></div>' +
        '<button class="btn" id="ok" disabled>Conferir</button></div>'
      );
      draw();
      document.getElementById("ok").onclick = function () {
        if (checked) { finish(); return; }
        checked = true;
        var given = placed.map(function (i) { return pool[i]; }).join(" ");
        var ok = norm(given) === norm(ex.answer);
        record(ok);
        document.getElementById("zone").classList.add(ok ? "right" : "wrong");
        document.getElementById("fb").innerHTML = feedbackHTML(ok, ex.answer, ex); revealFb();
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
        '<div id="fb" role="status" aria-live="polite"></div>' +
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
        record(ok);
        document.querySelectorAll("#opts .opt").forEach(function (x, i) {
          x.disabled = true;
          x.classList.remove("sel");
          // ✓/✕ além da cor (não depender só de verde e vermelho), com texto para leitor de tela
          if (i === ex.answer) {
            x.classList.add("right");
            x.insertAdjacentHTML("beforeend", '<span class="mk" aria-hidden="true">✓</span><span class="sr">, resposta certa</span>');
          } else if (i === chosen) {
            x.classList.add("wrong");
            x.insertAdjacentHTML("beforeend", '<span class="mk" aria-hidden="true">✕</span><span class="sr">, sua resposta, errada</span>');
          }
        });
        document.getElementById("fb").innerHTML = feedbackHTML(ok, ex.prompt.replace("___", ex.options[ex.answer]), ex); revealFb();
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
      b.onclick = function () {
        swapIndex = Number(b.getAttribute("data-t")); views.swap();
        var sel = document.querySelector("#themes .sel");
        if (sel) sel.focus({ preventScroll: true }); // mantém o foco no tema escolhido
      };
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
      '<div id="models" aria-live="polite"></div>' +
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

  // ---------- leitura ----------
  function plain(s) { return s.parts.map(function (p) { return p.t; }).join(""); }
  // sem destaque nas palavras dos espaços: na etapa 2 você precisa pensar, não lembrar da cor.
  // só as palavras do glossário ficam sublinhadas (toque para ver o significado)
  function readingHTML(s) {
    var g = L.gloss || {};
    return s.parts.map(function (p) {
      return p.t.split(/([A-Za-z][A-Za-z'’-]*)/).map(function (tok, i) {
        if (i % 2 === 1 && g[tok.toLowerCase()]) return '<span class="gw" data-w="' + esc(tok.toLowerCase()) + '">' + esc(tok) + "</span>";
        return esc(tok);
      }).join("");
    }).join("");
  }

  views.rRead = function () {
    render(
      dots() +
      '<div class="card"><span class="tag">1 · Leia</span>' +
      '<p class="small">' + esc(L.theme) + " · " + esc(L.grammar) + "</p>" +
      '<h2 class="rtitle">' + esc(L.title) + "</h2>" +
      '<p class="small" style="margin-top:10px">Toque numa frase para ver em português, ou numa palavra sublinhada para ver o significado. Entenda a história, depois você vai completar o texto.</p>' +
      '<div class="panel rpanel">' +
      L.sentences.map(function (s, i) {
        return '<button class="rsent' + (s.br ? " newp" : "") + '" data-s="' + i + '" aria-expanded="false"><span class="ren">' + readingHTML(s) + '</span><span class="rpt" hidden>' + esc(s.pt) + "</span></button>";
      }).join("") +
      "</div></div>" +
      '<div class="glossbar" id="gloss" hidden aria-live="polite"></div>' +
      '<button class="btn" id="go">Bora completar</button>'
    );
    document.querySelectorAll(".gw").forEach(function (w) {
      w.onclick = function (e) {
        e.stopPropagation(); // não abre a tradução da frase
        var gb = document.getElementById("gloss");
        gb.innerHTML = "<b>" + esc(w.textContent) + "</b> · " + esc(L.gloss[w.getAttribute("data-w")]);
        gb.removeAttribute("hidden");
      };
    });
    document.querySelectorAll(".rsent").forEach(function (b) {
      b.onclick = function () {
        var pt = b.querySelector(".rpt");
        var open = pt.hasAttribute("hidden");
        if (open) pt.removeAttribute("hidden"); else pt.setAttribute("hidden", "");
        b.setAttribute("aria-expanded", open ? "true" : "false");
        b.classList.toggle("open", open);
      };
    });
    document.getElementById("go").onclick = next;
  };

  views.rFill = function () {
    var gaps = [];
    L.sentences.forEach(function (s) { s.parts.forEach(function (p) { if (p.gap) gaps.push(p); }); });
    var checked = false;
    var oks = [];
    function clean(s) { return String(s).toLowerCase().replace(/[’]/g, "'").replace(/\s+/g, " ").trim(); }
    // aceita "I've watched" / "'ve watched" no lugar de "have watched", e tira um "I" digitado antes
    function fixInput(v) {
      v = clean(v).replace(/^i(?=['’]?(ve|ll)\b)/, "").replace(/^i /, "");
      return v.replace(/^'?ve\b/, "have").replace(/^'?ll\b/, "will");
    }
    // distância de edição de no máximo 1 (uma letra a mais, a menos ou trocada)
    function lev1(a, b) {
      if (a === b) return true;
      if (Math.abs(a.length - b.length) > 1) return false;
      var i = 0;
      while (i < a.length && i < b.length && a[i] === b[i]) i++;
      if (a.length === b.length) return a.slice(i + 1) === b.slice(i + 1);
      if (a.length > b.length) return a.slice(i + 1) === b.slice(i);
      return b.slice(i + 1) === a.slice(i);
    }
    // 0 = errado, 1 = certo, 2 = certo com erro de grafia (só palavras longas e que não sejam um distrator)
    function judge(g, v) {
      var c = fixInput(v);
      var targets = [g.t].concat(g.alts || []).map(clean);
      if (targets.indexOf(c) > -1) return 1;
      var extras = (L.extras || []).map(clean);
      if (c.length >= 6 && extras.indexOf(c) < 0 && targets.some(function (t) { return t.length >= 7 && lev1(c, t); })) return 2;
      return 0;
    }
    var gi = 0;
    var text = L.sentences.map(function (s) {
      return '<span class="rline' + (s.br ? " newp" : "") + '">' + s.parts.map(function (p) {
        if (!p.gap) return esc(p.t);
        var g = gi++;
        var w = Math.max(4, p.t.length + 1);
        return '<input class="gapin" data-g="' + g + '" style="width:' + w + 'ch" type="text" inputmode="text" lang="en" autocapitalize="off" autocomplete="off" autocorrect="off" spellcheck="false" aria-label="espaço ' + (g + 1) + '">';
      }).join("") + "</span>";
    }).join("");
    var help = shuffle(gaps.map(function (g) { return g.t; }).concat(L.extras || []));
    render(
      dots() +
      '<div class="card"><span class="tag">2 · Complete</span>' +
      "<p>Escreva a palavra que falta em cada espaço. Pense no sentido e na gramática.</p>" +
      '<div class="panel rpanel"><p class="rtext" id="rtext">' + text + "</p></div>" +
      '<button class="btn ghost sm" id="help" style="margin-top:12px">Preciso de ajuda</button>' +
      '<div id="helpbox" class="helpbox" hidden><span class="small">Entre estas, algumas não servem:</span><div class="pool">' +
      help.map(function (t) { return '<span class="chip" style="cursor:default">' + esc(t) + "</span>"; }).join("") + "</div></div>" +
      '<div id="fb" role="status" aria-live="polite"></div>' +
      '<button class="btn" id="ok" disabled>Conferir</button></div>'
    );
    var inputs = Array.prototype.slice.call(document.querySelectorAll("#rtext .gapin"));
    function refresh() {
      document.getElementById("ok").disabled = !checked && inputs.some(function (i) { return !i.value.trim(); });
    }
    inputs.forEach(function (inp, i) {
      inp.oninput = refresh;
      inp.onkeydown = function (e) {
        if (e.key === "Enter") {
          e.preventDefault();
          if (inputs[i + 1]) inputs[i + 1].focus(); else if (!document.getElementById("ok").disabled) document.getElementById("ok").click();
        }
      };
    });
    document.getElementById("help").onclick = function () {
      document.getElementById("helpbox").removeAttribute("hidden");
      this.style.display = "none";
    };
    document.getElementById("ok").onclick = function () {
      if (checked) { next(); return; }
      checked = true;
      var verdict = gaps.map(function (g, i) { return judge(g, inputs[i].value); });
      oks = verdict.map(function (v) { return v > 0; });
      var wrongs = [], nears = [];
      verdict.forEach(function (v, i) { if (v === 0) wrongs.push(i); else if (v === 2) nears.push(i); });
      wrongs.forEach(function (i) { slip(gaps[i].lesson); });
      var revs = [], seenL = {};
      wrongs.forEach(function (i) {
        var id = gaps[i].lesson;
        if (id && !seenL[id]) {
          seenL[id] = 1;
          var l = lessonById(id);
          if (l) revs.push("Revise a lição " + (lessons.indexOf(l) + 1) + ": " + l.title + ".");
        }
      });
      var nearTxt = nears.length ? " Só confira a grafia de " + nears.map(function (i) { return "<b>" + esc(gaps[i].t) + "</b>"; }).join(", ") + "." : "";
      var fb;
      if (!wrongs.length) {
        fb = '<div class="fbp right"><div class="fbtext"><div class="t">' + pick(HIT_TITLES) + '</div><div class="fun">Todos os espaços certos, sem banco de palavras. Leia o texto inteiro de novo, já completo.' + nearTxt + "</div></div>" +
          '<span class="mascot fb-m">' + mascotFor(L, "happy") + "</span></div>";
      } else {
        fb = '<div class="fbp wrong"><div class="fbtext"><div class="t">' + (gaps.length - wrongs.length) + " de " + gaps.length + ' certos. Veja os que faltaram:</div></div>' +
          '<span class="mascot fb-m">' + mascotFor(L, "oops") + "</span>" +
          '<div class="lbl">Por quê</div><div class="why">' +
          wrongs.map(function (i) { return "<b>" + esc(gaps[i].t) + "</b>" + (gaps[i].hint ? ": " + esc(gaps[i].hint) : ""); }).join("<br>") +
          (revs.length ? '<br><span class="rev">' + revs.map(esc).join("<br>") + "</span>" : "") +
          (nearTxt ? "<br>" + nearTxt : "") +
          "</div></div>";
      }
      document.getElementById("fb").innerHTML = fb; revealFb();
      inputs.forEach(function (inp, i) {
        inp.readOnly = true;
        inp.classList.add(oks[i] ? "right" : "wrong");
        if (!oks[i] || verdict[i] === 2) inp.insertAdjacentHTML("afterend", '<span class="fix">' + esc(gaps[i].t) + "</span>");
      });
      document.getElementById("help").style.display = "none";
      document.getElementById("ok").textContent = "Continuar";
      document.getElementById("ok").disabled = false;
    };
  };

  // pontos para comparar a tradução: sentido geral, palavras do glossário e o que os espaços ensinam
  function checklistFor(s) {
    var g = L.gloss || {}, seen = {};
    var items = ["O sentido geral bate com o do modelo."];
    plain(s).split(/([A-Za-z][A-Za-z'’-]*)/).forEach(function (tok, i) {
      var k = tok.toLowerCase();
      if (i % 2 === 1 && g[k] && !seen[k]) { seen[k] = 1; items.push("<b>" + esc(tok) + "</b> = " + esc(g[k])); }
    });
    s.parts.forEach(function (p) { if (p.gap && p.hint) items.push("<b>" + esc(p.t) + "</b>: " + esc(p.hint)); });
    return items.slice(0, 5);
  }

  views.rTrans = function () {
    var idx = L.tr[exIndex];
    var s = L.sentences[idx];
    var total = L.tr.length;
    var isLast = exIndex === total - 1;
    var shown = false;
    render(
      dots() +
      '<div class="card"><span class="tag">3 · Traduza · ' + (exIndex + 1) + "/" + total + "</span>" +
      '<div class="panel rpanel"><div class="sentence rs-big">' + esc(plain(s)) + "</div></div>" +
      '<textarea id="txt" placeholder="Escreva em português do seu jeito" lang="pt-BR" spellcheck="false"></textarea>' +
      '<div id="fb" role="status" aria-live="polite"></div>' +
      '<button class="btn" id="ok">Ver tradução</button></div>'
    );
    document.getElementById("ok").onclick = function () {
      if (!shown) {
        shown = true;
        document.getElementById("txt").readOnly = true;
        document.getElementById("fb").innerHTML =
          '<div class="fbp right"><div class="fbtext"><div class="t">Uma tradução possível:</div><div class="ans">' + esc(s.pt) + "</div></div>" +
          '<span class="mascot fb-m">' + mascotFor(L, "calm") + "</span>" +
          '<div class="lbl">Compare</div><div class="why">Não precisa ficar igual, palavra por palavra. Se o sentido bateu, está certo.</div></div>' +
          '<h3 style="margin-top:20px">Confira se a sua tem</h3><ul class="checklist">' + checklistFor(s).map(function (c) { return "<li>" + c + "</li>"; }).join("") + "</ul>";
        revealFb();
        document.getElementById("ok").textContent = isLast ? "Terminar" : "Próxima";
        return;
      }
      if (isLast) { saved.read[L.id] = true; save(saved); next(); }
      else forward(function () { exIndex++; });
    };
  };

  views.end = function () {
    render(
      '<section class="hero">' +
      '<h1>Pronto por hoje<span class="pop-dot">.</span></h1>' +
      (L.read
        ? "<p>Você leu, completou e traduziu " + esc(L.title) + ". Amanhã tem outra, ou quando você quiser.</p>"
        : L.review
          ? "<p>Revisão feita. Os pontos em que você acertou saem da lista de erros.</p>"
          : "<p>Você fez a lição de " + esc(L.grammar) + ". Amanhã tem outra, ou quando você quiser.</p>") +
      "</section>" +
      '<div class="panel big celebrate"><span class="mascot lg">' + mascotFor(L, "happy", true) + "</span></div>" +
      '<button class="btn" id="home">Voltar ao início</button>' +
      (L.review ? "" : '<button class="btn ghost" id="again">Refazer essa lição</button>')
    );
    document.getElementById("home").onclick = leave;
    var again = document.getElementById("again");
    if (again) again.onclick = function () {
      forward(function () { step = 0; exIndex = 0; swapIndex = Math.max(0, (window.THEME_ORDER || []).indexOf(L.theme)); });    };
  };

  // ---------- início ----------
  home();

  if ("serviceWorker" in navigator && location.protocol.indexOf("http") === 0) {
    navigator.serviceWorker.register("sw.js").catch(function () {});
  }
})();
