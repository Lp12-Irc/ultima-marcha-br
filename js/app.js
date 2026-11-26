/* =========================================================
   ÚLTIMA MARCHA BR — APP (roteador + páginas)
   ========================================================= */

const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const app = $("#app");

const fmtBRL = (n) => n.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });
const fmtN = (n, d = 0) => n.toLocaleString("pt-BR", { minimumFractionDigits: d, maximumFractionDigits: d });
const carById = (id) => CARROS.find((c) => c.id === id);
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const RAR_NOME = { comum: "Comum", incomum: "Incomum", raro: "Raro", lendario: "Lendário" };

function toast(msg) {
  const t = $("#toast");
  t.textContent = msg;
  t.classList.add("show");
  clearTimeout(t._t);
  t._t = setTimeout(() => t.classList.remove("show"), 2200);
}

function copiar(texto, msg = "Copiado!") {
  if (navigator.clipboard) navigator.clipboard.writeText(texto).then(() => toast(msg));
  else {
    const ta = document.createElement("textarea");
    ta.value = texto; document.body.appendChild(ta); ta.select();
    document.execCommand("copy"); ta.remove(); toast(msg);
  }
}

/* ---------------- DESENHO DOS CARROS (SVG) ---------------- */
function formatoCarro(car) {
  if (car.id === "fusquinha") return "bug";
  if (car.id === "kombosa") return "van";
  if (car.id === "d20") return "pickup";
  if (car.categoria === "Off-Road") return "jeep";
  return "sedan";
}

function carSVG(car, extra = "") {
  const c = car.cor;
  const shapes = {
    sedan: {
      body: "M20,95 L20,76 Q22,63 40,61 L88,57 L112,32 Q117,28 127,28 L193,28 Q203,28 210,34 L234,57 L268,62 Q282,64 282,78 L282,95 Z",
      win: ["M116,36 L152,36 L152,56 L98,56 Z", "M158,36 L193,36 Q201,36 206,42 L221,56 L158,56 Z"],
      wheels: [78, 228], r: 20, wy: 96,
    },
    bug: {
      body: "M28,95 Q24,70 55,63 Q82,58 96,45 Q130,16 175,22 Q215,28 236,60 Q274,66 272,95 Z",
      win: ["M110,48 Q130,30 158,30 L158,56 L100,56 Z", "M164,30 Q198,32 218,56 L164,56 Z"],
      wheels: [80, 222], r: 20, wy: 96,
    },
    van: {
      body: "M30,95 L30,32 Q30,18 46,18 L254,18 Q274,18 278,42 L282,95 Z",
      win: ["M48,28 L110,28 L110,52 L48,52 Z", "M118,28 L180,28 L180,52 L118,52 Z", "M188,28 L250,28 Q266,28 268,52 L188,52 Z"],
      wheels: [80, 232], r: 20, wy: 96,
    },
    pickup: {
      body: "M20,95 L20,74 Q22,63 40,61 L80,58 L100,30 Q104,26 112,26 L162,26 Q170,26 172,34 L174,60 L284,60 L284,95 Z",
      win: ["M108,34 L162,34 L164,58 L92,58 Z"],
      wheels: [70, 232], r: 21, wy: 96,
    },
    jeep: {
      body: "M24,96 L24,62 L72,58 L84,28 L182,28 L182,58 L280,58 L280,96 Z",
      win: ["M92,35 L174,35 L174,56 L86,56 Z"],
      wheels: [76, 228], r: 24, wy: 98,
    },
  };
  const s = shapes[formatoCarro(car)];
  const dark = car.cor === "#1d1d1d" || car.cor === "#2c3e50";
  return `
  <svg viewBox="0 0 300 130" xmlns="http://www.w3.org/2000/svg" ${extra}>
    <defs>
      <linearGradient id="g-${car.id}" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="${c}" stop-opacity="1"/>
        <stop offset="1" stop-color="${c}" stop-opacity=".75"/>
      </linearGradient>
    </defs>
    <ellipse cx="150" cy="${s.wy + s.r - 2}" rx="135" ry="7" fill="#000" opacity=".45"/>
    <path d="${s.body}" fill="url(#g-${car.id})" stroke="${dark ? "#444" : "rgba(0,0,0,.35)"}" stroke-width="2"/>
    <path d="${s.body}" fill="none" stroke="rgba(255,255,255,.18)" stroke-width="1" transform="translate(0,-1)"/>
    ${s.win.map((w) => `<path d="${w}" fill="#9ad0ec" opacity=".85" stroke="#0b0d10" stroke-width="1.5"/>`).join("")}
    <rect x="270" y="70" width="12" height="8" rx="2" fill="#ffe680"/>
    <rect x="20" y="72" width="8" height="7" rx="2" fill="#ff4d4d"/>
    ${s.wheels.map((x) => `
      <circle cx="${x}" cy="${s.wy}" r="${s.r}" fill="#111" stroke="#2b2b2b" stroke-width="3"/>
      <circle cx="${x}" cy="${s.wy}" r="${s.r * 0.5}" fill="#9aa4ae"/>
      <circle cx="${x}" cy="${s.wy}" r="${s.r * 0.18}" fill="#555"/>`).join("")}
  </svg>`;
}

/* ---------------- FÍSICA SIMPLIFICADA ---------------- */
const BUILD_PADRAO = () => Object.fromEntries(Object.keys(PECAS).map((k) => [k, PECAS[k].opcoes[0].id]));
const opc = (grupo, id) => PECAS[grupo].opcoes.find((o) => o.id === id) || PECAS[grupo].opcoes[0];

function calcular(car, build = BUILD_PADRAO()) {
  const m = opc("motor", build.motor), ind = opc("inducao", build.inducao), cam = opc("cambio", build.cambio);
  const pn = opc("pneus", build.pneus), su = opc("suspensao", build.suspensao), pe = opc("peso", build.peso);

  const cv = car.cv * m.cvMult * ind.cvMult;
  const torque = car.torque * m.torqueMult * ind.torqueMult;
  const peso = Math.max(500, car.peso + pe.peso);
  const grip = pn.grip + su.grip;
  const trac = car.tracao === "4x4" ? 0.94 : car.tracao === "D" ? 1.04 : 1;
  const rel = peso / cv;

  const zero100 = Math.max(2.4, 1.35 * Math.pow(rel, 0.9) * cam.acelMult * (1 - grip) * trac);
  const quarto = Math.max(8, 5.825 * Math.cbrt(rel * 2.2046) * Math.sqrt(cam.acelMult * (1 - grip)) * Math.sqrt(trac));
  const pesado = ["Off-Road", "Utilitário"].includes(car.categoria) ? 0.88 : 1;
  const offPecas = (pn.offroad ? 0.95 : 1) * (su.offroad ? 0.96 : 1);
  const vmax = 29 * Math.pow(cv, 0.38) * cam.vmaxMult * pesado * offPecas;

  let offroad = (car.tracao === "4x4" ? 75 : car.tracao === "T" ? 30 : 22);
  if (pn.offroad) offroad += 15; if (su.offroad) offroad += 15;
  if (pn.id === "slick") offroad -= 20; if (su.id === "rebaixada") offroad -= 12; if (su.id === "rosca") offroad -= 6;
  const curvas = 40 + grip * 260 + (1400 - peso) / 25 - (su.offroad ? 8 : 0);

  const custo = Object.keys(PECAS).reduce((s, k) => s + opc(k, build[k]).preco, 0);

  return {
    cv, torque, peso, zero100, quarto, vmax,
    offroad: clamp(offroad, 0, 100), curvas: clamp(curvas, 0, 100), custo,
  };
}

/* ---------------- MODAL ---------------- */
function abrirModal(html) {
  $("#modalBody").innerHTML = html;
  $("#modal").classList.add("open");
  document.body.style.overflow = "hidden";
}
function fecharModal() {
  $("#modal").classList.remove("open");
  document.body.style.overflow = "";
}
$$("[data-close]").forEach((el) => el.addEventListener("click", fecharModal));
document.addEventListener("keydown", (e) => e.key === "Escape" && fecharModal());

const MAX = (() => {
  const st = CARROS.map((c) => calcular(c));
  return { cv: Math.max(...st.map((s) => s.cv)), vmax: Math.max(...st.map((s) => s.vmax)), torque: Math.max(...st.map((s) => s.torque)) };
})();

function barra(label, val, max, txt, inverso = false) {
  const pct = inverso ? clamp((1 - (val - 2) / (max - 2)) * 100, 4, 100) : clamp((val / max) * 100, 4, 100);
  return `<div class="bar-row"><span class="muted">${label}</span><div class="bar"><i style="width:${pct}%"></i></div><b>${txt}</b></div>`;
}

function abrirCarro(id) {
  const c = carById(id);
  const s = calcular(c);
  abrirModal(`
    <div class="modal-hero">${carSVG(c)}</div>
    <div class="modal-content">
      <div class="car-meta" style="margin-bottom:10px">
        <span class="tag rar-${c.raridade}">${RAR_NOME[c.raridade].toUpperCase()}</span>
        <span class="tag">${c.categoria}</span><span class="tag">${c.ano}</span>
        <span class="tag">Tração ${c.tracao === "T" ? "traseira" : c.tracao === "D" ? "dianteira" : "4x4"}</span>
      </div>
      <h2>${c.nome}</h2>
      <p class="muted" style="margin-top:6px">${c.desc}</p>
      <div class="spec-grid">
        <div class="spec"><small>Potência</small><b>${fmtN(s.cv)} cv</b></div>
        <div class="spec"><small>Torque</small><b>${fmtN(s.torque, 1)} kgfm</b></div>
        <div class="spec"><small>Peso</small><b>${fmtN(s.peso)} kg</b></div>
        <div class="spec"><small>0–100 km/h</small><b>${fmtN(s.zero100, 1)} s</b></div>
      </div>
      ${barra("Velocidade", s.vmax, MAX.vmax, fmtN(s.vmax) + " km/h")}
      ${barra("Aceleração", s.zero100, 20, fmtN(s.zero100, 1) + " s", true)}
      ${barra("Curvas", s.curvas, 100, fmtN(s.curvas))}
      ${barra("Off-road", s.offroad, 100, fmtN(s.offroad))}
      <div class="spec-grid" style="grid-template-columns:1fr 1fr">
        <div class="spec"><small>Preço na concessionária</small><b class="price">${fmtBRL(c.preco)}</b></div>
        <div class="spec"><small>Preço como sucata (ferro-velho)</small><b>${fmtBRL(c.sucata)}</b></div>
      </div>
      <div style="display:flex;gap:10px;flex-wrap:wrap">
        <a class="btn btn-primary" href="#/tuning?car=${c.id}" data-close-link>🔧 Tunar este carro</a>
        <a class="btn" href="#/comparar?a=${c.id}" data-close-link>⚖️ Comparar</a>
      </div>
    </div>`);
  $$("[data-close-link]").forEach((a) => a.addEventListener("click", fecharModal));
}

function carCard(c) {
  const s = calcular(c);
  return `
  <article class="card car-card fade-in" data-car="${c.id}">
    <div class="car-thumb">
      <span class="tag rar rar-${c.raridade}">${RAR_NOME[c.raridade]}</span>
      ${carSVG(c)}
    </div>
    <div class="car-body">
      <div style="display:flex;justify-content:space-between;gap:8px;align-items:start">
        <h3>${c.nome}</h3><span class="price">${fmtBRL(c.preco)}</span>
      </div>
      <div class="car-meta"><span class="tag">${c.categoria}</span><span class="tag">${c.ano}</span><span class="tag">${c.tracao}</span></div>
      <div class="car-stats">
        <div><b>${fmtN(s.cv)}</b><small>cv</small></div>
        <div><b>${fmtN(s.vmax)}</b><small>km/h</small></div>
        <div><b>${fmtN(s.zero100, 1)}s</b><small>0-100</small></div>
      </div>
    </div>
  </article>`;
}
function ligarCards(root = app) {
  $$("[data-car]", root).forEach((el) => el.addEventListener("click", () => abrirCarro(el.dataset.car)));
}

/* =========================================================
   PÁGINAS
   ========================================================= */

/* ---------- INÍCIO ---------- */
function pageHome() {
  const destaque = [...CARROS].sort((a, b) => b.preco - a.preco).slice(0, 3);
  const ultima = NOTICIAS[0];
  const ativos = CODIGOS.filter((c) => c.ativo).length;
  const heroCar = carById("opalao");

  app.innerHTML = `
  <section class="hero">
    <div class="container hero-inner">
      <div class="fade-in">
        <span class="badge"><span class="dot"></span> <span id="online">—</span> jogadores online agora</span>
        <h1>ÚLTIMA MARCHA <em>BR</em><span>Restaure. Tune. Acelere.</span></h1>
        <p>Compre sucatas no ferro-velho, restaure clássicos brasileiros peça por peça, trabalhe pra pagar as contas e mostre quem manda na pista.</p>
        <div class="hero-actions">
          <a class="btn btn-green" href="${GAME.robloxUrl}" target="_blank" rel="noopener">▶ Jogar no Roblox</a>
          <a class="btn btn-primary" href="#/tuning">🔧 Simulador de Tuning</a>
          <a class="btn" href="#/carros">Ver carros</a>
        </div>
      </div>
      <div class="fade-in">
        <div class="hero-car">${carSVG(heroCar)}</div>
        <div class="road"></div>
      </div>
    </div>
  </section>

  <div class="container">
    <div class="stats">
      <div class="stat"><div class="n">${CARROS.length}</div><div class="l">Carros para restaurar</div></div>
      <div class="stat"><div class="n">${Object.values(PECAS).reduce((s, g) => s + g.opcoes.length - 1, 0)}</div><div class="l">Peças de tuning</div></div>
      <div class="stat"><div class="n">${MAPA_LOCAIS.length}</div><div class="l">Locais no mapa</div></div>
      <div class="stat"><div class="n">${ativos}</div><div class="l">Códigos ativos</div></div>
    </div>
  </div>

  <section class="section">
    <div class="container">
      <div class="section-head"><h2 class="section-title">O QUE TEM NO <span>SITE</span></h2></div>
      <div class="grid grid-3">
        ${[
          ["🚗", "Enciclopédia de carros", "Ficha técnica, preço e onde achar a sucata de cada carro.", "#/carros"],
          ["🔧", "Simulador de tuning", "Monte sua build e veja potência, 0-100 e custo antes de gastar no jogo.", "#/tuning"],
          ["⚖️", "Comparador", "Coloque dois carros lado a lado e descubra qual é melhor.", "#/comparar"],
          ["🗺️", "Mapa interativo", "Oficinas, ferro-velhos, postos, trabalhos, pistas e trilhas.", "#/mapa"],
          ["🏆", "Rankings", "Arrancada, tempo de volta, mais rico e mais entregas.", "#/ranking"],
          ["🎁", "Códigos", "Resgate dinheiro e itens grátis dentro do jogo.", "#/codigos"],
        ].map(([ic, t, d, h]) => `<a class="card feature" href="${h}"><div class="ic">${ic}</div><h3>${t}</h3><p>${d}</p></a>`).join("")}
      </div>
    </div>
  </section>

  <section class="section" style="padding-top:0">
    <div class="container">
      <div class="section-head">
        <h2 class="section-title">CARROS EM <span>DESTAQUE</span></h2>
        <a class="btn btn-sm" href="#/carros">Ver todos →</a>
      </div>
      <div class="grid grid-3">${destaque.map(carCard).join("")}</div>
    </div>
  </section>

  <section class="section" style="padding-top:0">
    <div class="container grid" style="grid-template-columns: 1.4fr 1fr; gap:18px" id="homeBottom">
      <div class="card">
        <span class="tag tag-${ultima.tag}">${ultima.tag}</span>
        <h3 style="font-size:22px;margin:10px 0 6px">${ultima.titulo}</h3>
        <p class="muted">${ultima.texto}</p>
        <a class="btn btn-sm" style="margin-top:14px" href="#/noticias">Ler todas as notícias →</a>
      </div>
      <div class="card">
        <h3 style="margin-bottom:10px">🎁 Código da vez</h3>
        <div class="code" style="display:inline-block">${CODIGOS[0].codigo}</div>
        <p class="muted" style="margin:10px 0">${CODIGOS[0].recompensa}</p>
        <button class="btn btn-sm btn-primary" id="copyHome">Copiar código</button>
      </div>
    </div>
  </section>

  <section class="container">
    <div class="cta">
      <h2 class="section-title">BORA PRA <span>OFICINA?</span></h2>
      <p>Entre no Discord da comunidade, participe dos encontros e campeonatos.</p>
      <div class="hero-actions" style="justify-content:center">
        <a class="btn btn-green" href="${GAME.robloxUrl}" target="_blank" rel="noopener">▶ Jogar agora</a>
        <a class="btn" href="${GAME.discordUrl}" target="_blank" rel="noopener">💬 Discord</a>
      </div>
    </div>
  </section>`;

  ligarCards();
  $("#copyHome").onclick = () => copiar(CODIGOS[0].codigo, "Código copiado!");
  if (innerWidth < 800) $("#homeBottom").style.gridTemplateColumns = "1fr";
  iniciarOnline();
}

// Contador de jogadores online (SIMULADO — troque por dados reais da sua API)
let onlineTimer;
function iniciarOnline() {
  clearInterval(onlineTimer);
  let n = 180 + Math.floor(Math.random() * 120);
  const upd = () => { const el = $("#online"); if (!el) return clearInterval(onlineTimer); n = clamp(n + Math.floor(Math.random() * 11) - 5, 90, 400); el.textContent = n; };
  upd();
  onlineTimer = setInterval(upd, 3000);
}

/* ---------- CARROS ---------- */
function pageCarros() {
  const cats = ["Todos", ...new Set(CARROS.map((c) => c.categoria))];
  let cat = "Todos", busca = "", ordem = "preco-asc";

  app.innerHTML = `
  <div class="container">
    <div class="page-head fade-in">
      <h1>ENCICLOPÉDIA DE <span>CARROS</span></h1>
      <p>Todos os carros do Última Marcha BR com ficha técnica completa. Clique em um carro para ver os detalhes.</p>
    </div>
    <div class="filters">
      <input class="input" id="busca" placeholder="🔍 Buscar carro..." />
      <select class="select" id="ordem">
        <option value="preco-asc">Menor preço</option>
        <option value="preco-desc">Maior preço</option>
        <option value="cv-desc">Mais potente</option>
        <option value="acel">Mais rápido no 0-100</option>
        <option value="nome">Nome (A-Z)</option>
      </select>
    </div>
    <div class="chips" id="cats">${cats.map((c, i) => `<span class="chip ${i === 0 ? "active" : ""}" data-cat="${c}">${c}</span>`).join("")}</div>
    <div class="grid grid-3" id="lista" style="margin-top:22px"></div>
  </div>`;

  const render = () => {
    let l = CARROS.filter((c) => (cat === "Todos" || c.categoria === cat) && c.nome.toLowerCase().includes(busca.toLowerCase()));
    const sorters = {
      "preco-asc": (a, b) => a.preco - b.preco,
      "preco-desc": (a, b) => b.preco - a.preco,
      "cv-desc": (a, b) => b.cv - a.cv,
      acel: (a, b) => calcular(a).zero100 - calcular(b).zero100,
      nome: (a, b) => a.nome.localeCompare(b.nome),
    };
    l.sort(sorters[ordem]);
    $("#lista").innerHTML = l.length ? l.map(carCard).join("") : `<div class="empty" style="grid-column:1/-1">Nenhum carro encontrado 😕</div>`;
    ligarCards();
  };

  $("#busca").oninput = (e) => { busca = e.target.value; render(); };
  $("#ordem").onchange = (e) => { ordem = e.target.value; render(); };
  $$("#cats .chip").forEach((ch) => ch.onclick = () => {
    $$("#cats .chip").forEach((x) => x.classList.remove("active"));
    ch.classList.add("active"); cat = ch.dataset.cat; render();
  });
  render();
}

/* ---------- TUNING ---------- */
const LS_KEY = "umbr_builds";
const getBuilds = () => JSON.parse(localStorage.getItem(LS_KEY) || "[]");
const setBuilds = (b) => localStorage.setItem(LS_KEY, JSON.stringify(b));

function pageTuning(params) {
  let car = carById(params.car) || CARROS[3];
  let build = BUILD_PADRAO();
  if (params.b) params.b.split(",").forEach((p) => { const [k, v] = p.split(":"); if (PECAS[k]) build[k] = v; });

  app.innerHTML = `
  <div class="container">
    <div class="page-head fade-in">
      <h1>SIMULADOR DE <span>TUNING</span></h1>
      <p>Escolha um carro, monte sua build e veja o resultado antes de gastar seu dinheiro no jogo. Salve e compartilhe com os amigos!</p>
    </div>
    <div class="tuning-layout">
      <div>
        <div class="card" style="margin-bottom:18px">
          <label class="muted" style="font-size:13px;font-weight:600">Carro base</label>
          <select class="select" id="tCar" style="width:100%;margin-top:6px">
            ${CARROS.map((c) => `<option value="${c.id}" ${c.id === car.id ? "selected" : ""}>${c.nome} — ${c.cv} cv</option>`).join("")}
          </select>
          <div id="tCarSvg" style="margin-top:14px;padding:0 30px"></div>
        </div>
        <div class="card" id="parts"></div>
      </div>
      <div class="card result-card" id="result"></div>
    </div>
  </div>`;

  const renderParts = () => {
    $("#parts").innerHTML = Object.entries(PECAS).map(([k, g]) => `
      <div class="part-group">
        <h3>${g.icone} ${g.nome}</h3>
        <div class="part-options">
          ${g.opcoes.map((o) => `
            <button class="part-opt ${build[k] === o.id ? "active" : ""}" data-g="${k}" data-o="${o.id}">
              <b>${o.nome}</b><small>${o.preco ? fmtBRL(o.preco) : "Incluso"}</small>
            </button>`).join("")}
        </div>
      </div>`).join("");
    $$(".part-opt").forEach((b) => b.onclick = () => { build[b.dataset.g] = b.dataset.o; renderParts(); renderResult(); });
  };

  const delta = (novo, velho, menorMelhor = false, d = 0, suf = "") => {
    const diff = novo - velho;
    if (Math.abs(diff) < 0.05) return `<span class="delta muted">—</span>`;
    const bom = menorMelhor ? diff < 0 : diff > 0;
    return `<span class="delta ${bom ? "up" : "down"}">${diff > 0 ? "+" : ""}${fmtN(diff, d)}${suf}</span>`;
  };

  const renderResult = () => {
    const base = calcular(car), s = calcular(car, build);
    const builds = getBuilds();
    $("#result").innerHTML = `
      <h3 style="font-size:20px">📊 Resultado</h3>
      <p class="muted" style="font-size:14px">${car.nome}</p>
      <div class="big-stats">
        <div class="big-stat"><small>Potência</small><div class="v">${fmtN(s.cv)} cv</div>${delta(s.cv, base.cv, false, 0, " cv")}</div>
        <div class="big-stat"><small>Torque</small><div class="v">${fmtN(s.torque, 1)}</div>${delta(s.torque, base.torque, false, 1, " kgfm")}</div>
        <div class="big-stat"><small>0–100 km/h</small><div class="v">${fmtN(s.zero100, 1)} s</div>${delta(s.zero100, base.zero100, true, 1, " s")}</div>
        <div class="big-stat"><small>Vel. máxima</small><div class="v">${fmtN(s.vmax)}</div>${delta(s.vmax, base.vmax, false, 0, " km/h")}</div>
        <div class="big-stat"><small>Arrancada 402m</small><div class="v">${fmtN(s.quarto, 2)} s</div>${delta(s.quarto, base.quarto, true, 2, " s")}</div>
        <div class="big-stat"><small>Peso</small><div class="v">${fmtN(s.peso)} kg</div>${delta(s.peso, base.peso, true, 0, " kg")}</div>
      </div>
      ${barra("Curvas", s.curvas, 100, fmtN(s.curvas))}
      ${barra("Off-road", s.offroad, 100, fmtN(s.offroad))}
      <div class="total"><span>Custo das peças</span><b>${fmtBRL(s.custo)}</b></div>
      <p class="muted" style="font-size:13px;margin-top:-6px">Carro + peças: <b style="color:var(--text)">${fmtBRL(s.custo + car.preco)}</b> (ou ${fmtBRL(s.custo + car.sucata)} partindo da sucata)</p>
      <div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:14px">
        <button class="btn btn-primary btn-sm" id="save">💾 Salvar build</button>
        <button class="btn btn-sm" id="share">🔗 Compartilhar</button>
        <button class="btn btn-sm" id="reset">↺ Resetar</button>
      </div>
      <h4 style="margin-top:22px">Minhas builds</h4>
      <div class="saved-list">
        ${builds.length ? builds.map((b, i) => `
          <div class="saved-item">
            <div><b>${b.nome}</b><br><small class="muted">${carById(b.car)?.nome || "?"}</small></div>
            <div style="display:flex;gap:6px">
              <button class="btn btn-sm" data-load="${i}">Abrir</button>
              <button class="btn btn-sm" data-del="${i}">🗑</button>
            </div>
          </div>`).join("") : `<p class="muted" style="font-size:14px">Nenhuma build salva ainda.</p>`}
      </div>`;

    $("#save").onclick = () => {
      const nome = prompt("Nome da build:", `${car.nome} — ${fmtN(s.cv)} cv`);
      if (!nome) return;
      setBuilds([{ nome, car: car.id, build: { ...build } }, ...getBuilds()].slice(0, 20));
      toast("Build salva!"); renderResult();
    };
    $("#share").onclick = () => {
      const b = Object.entries(build).map(([k, v]) => `${k}:${v}`).join(",");
      const url = `${location.origin}${location.pathname}#/tuning?car=${car.id}&b=${b}`;
      history.replaceState(null, "", `#/tuning?car=${car.id}&b=${b}`);
      copiar(url, "Link da build copiado!");
    };
    $("#reset").onclick = () => { build = BUILD_PADRAO(); renderParts(); renderResult(); };
    $$("[data-load]").forEach((el) => el.onclick = () => {
      const b = getBuilds()[el.dataset.load];
      car = carById(b.car); build = { ...BUILD_PADRAO(), ...b.build };
      $("#tCar").value = car.id; renderCar(); renderParts(); renderResult(); toast("Build carregada!");
    });
    $$("[data-del]").forEach((el) => el.onclick = () => {
      const b = getBuilds(); b.splice(el.dataset.del, 1); setBuilds(b); renderResult();
    });
  };

  const renderCar = () => { $("#tCarSvg").innerHTML = carSVG(car); };
  $("#tCar").onchange = (e) => { car = carById(e.target.value); renderCar(); renderResult(); };
  renderCar(); renderParts(); renderResult();
}

/* ---------- COMPARAR ---------- */
function pageComparar(params) {
  let a = carById(params.a) || CARROS[3], b = carById(params.b) || (a.id === CARROS[4].id ? CARROS[3] : CARROS[4]);
  const opts = (sel) => CARROS.map((c) => `<option value="${c.id}" ${c.id === sel.id ? "selected" : ""}>${c.nome}</option>`).join("");

  app.innerHTML = `
  <div class="container">
    <div class="page-head fade-in">
      <h1>COMPARADOR DE <span>CARROS</span></h1>
      <p>Escolha dois carros e veja qual leva a melhor em cada quesito (valores originais, sem tuning).</p>
    </div>
    <div class="compare-pick">
      <select class="select" id="cA">${opts(a)}</select>
      <div class="vs">VS</div>
      <select class="select" id="cB">${opts(b)}</select>
    </div>
    <div class="compare-cars" id="cSvgs"></div>
    <div class="card" style="margin-top:18px"><table class="compare-table" id="cTable"></table></div>
  </div>`;

  const render = () => {
    const sa = calcular(a), sb = calcular(b);
    $("#cSvgs").innerHTML = [a, b].map((c) => `<div class="card car-thumb" style="border-radius:var(--radius)">${carSVG(c)}<h3 style="text-align:center;margin-top:8px">${c.nome}</h3></div>`).join("");
    const linhas = [
      ["Potência", sa.cv, sb.cv, (v) => fmtN(v) + " cv", false],
      ["Torque", sa.torque, sb.torque, (v) => fmtN(v, 1) + " kgfm", false],
      ["Peso", sa.peso, sb.peso, (v) => fmtN(v) + " kg", true],
      ["0–100 km/h", sa.zero100, sb.zero100, (v) => fmtN(v, 1) + " s", true],
      ["Velocidade máx.", sa.vmax, sb.vmax, (v) => fmtN(v) + " km/h", false],
      ["Arrancada 402m", sa.quarto, sb.quarto, (v) => fmtN(v, 2) + " s", true],
      ["Curvas", sa.curvas, sb.curvas, (v) => fmtN(v), false],
      ["Off-road", sa.offroad, sb.offroad, (v) => fmtN(v), false],
      ["Preço", a.preco, b.preco, fmtBRL, true],
      ["Sucata", a.sucata, b.sucata, fmtBRL, true],
    ];
    let pa = 0, pb = 0;
    $("#cTable").innerHTML = linhas.map(([l, va, vb, f, menor]) => {
      const winA = menor ? va < vb : va > vb, winB = menor ? vb < va : vb > va;
      if (winA) pa++; if (winB) pb++;
      return `<tr><td class="${winA ? "win" : ""}">${f(va)}</td><td>${l}</td><td class="${winB ? "win" : ""}">${f(vb)}</td></tr>`;
    }).join("") + `<tr><td style="font-family:var(--font-title);font-size:32px;color:${pa >= pb ? "var(--yellow)" : "inherit"}">${pa}</td><td>Placar</td><td style="font-family:var(--font-title);font-size:32px;color:${pb >= pa ? "var(--yellow)" : "inherit"}">${pb}</td></tr>`;
    history.replaceState(null, "", `#/comparar?a=${a.id}&b=${b.id}`);
  };
  $("#cA").onchange = (e) => { a = carById(e.target.value); render(); };
  $("#cB").onchange = (e) => { b = carById(e.target.value); render(); };
  render();
}

/* ---------- MAPA ---------- */
function mapaSVG() {
  return `
  <svg class="map-bg" viewBox="0 0 160 110" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="160" height="110" fill="#22361f"/>
    <g fill="#2b4527" opacity=".9">
      <circle cx="12" cy="10" r="10"/><circle cx="25" cy="6" r="8"/><circle cx="6" cy="95" r="12"/><circle cx="20" cy="104" r="9"/>
      <circle cx="150" cy="100" r="11"/><circle cx="140" cy="8" r="7"/><circle cx="110" cy="105" r="8"/>
    </g>
    <path d="M0,30 C30,26 40,60 70,64 S120,95 160,88" stroke="#2f6fa8" stroke-width="5" fill="none" opacity=".85"/>
    <g fill="#2c2f33">
      <rect x="55" y="40" width="40" height="34" rx="2"/>
    </g>
    <g fill="#3a3f45">
      ${Array.from({ length: 4 }, (_, i) => Array.from({ length: 3 }, (_, j) => `<rect x="${57 + i * 9.5}" y="${42 + j * 10.5}" width="7.5" height="8.5" rx="1"/>`).join("")).join("")}
    </g>
    <g stroke="#55595e" stroke-width="2.4" fill="none" stroke-linecap="round">
      <path d="M0,60 L160,60"/>
      <path d="M75,0 L75,110"/>
      <path d="M75,60 L105,33 L160,15"/>
      <path d="M75,60 L30,40 L20,10"/>
      <path d="M75,60 L40,80 L12,92"/>
      <path d="M75,60 L125,80"/>
    </g>
    <g stroke="#e8c547" stroke-width=".35" fill="none" stroke-dasharray="2 2">
      <path d="M0,60 L160,60"/><path d="M75,0 L75,110"/><path d="M75,60 L105,33 L160,15"/>
    </g>
    <rect x="128" y="16" width="26" height="6" fill="#444" transform="rotate(-18 141 19)"/>
    <ellipse cx="32" cy="53" rx="10" ry="6" fill="none" stroke="#555" stroke-width="2"/>
    <path d="M12,92 C8,98 4,100 2,108" stroke="#6b4a2b" stroke-width="2" fill="none" stroke-dasharray="1.5 1"/>
  </svg>`;
}

function pageMapa() {
  const ativos = new Set(Object.keys(MAPA_TIPOS));
  app.innerHTML = `
  <div class="container">
    <div class="page-head fade-in">
      <h1>MAPA <span>INTERATIVO</span></h1>
      <p>Encontre oficinas, ferro-velhos, postos, trabalhos, pistas e trilhas. Clique nos pontos para ver os detalhes.</p>
    </div>
    <div class="map-layout">
      <div class="map-wrap" id="map">
        ${mapaSVG()}
        ${MAPA_LOCAIS.map((l, i) => {
          const t = MAPA_TIPOS[l.tipo];
          return `<div class="pin" data-i="${i}" data-tipo="${l.tipo}" style="left:${l.x}%;top:${l.y}%;background:${t.cor}">${t.icone}<span class="pin-label">${l.nome}</span></div>`;
        }).join("")}
      </div>
      <div class="card">
        <h3 style="margin-bottom:8px">Legenda</h3>
        <div id="legend">
          ${Object.entries(MAPA_TIPOS).map(([k, t]) => `
            <div class="legend-item" data-tipo="${k}">
              <span class="sw" style="background:${t.cor}">${t.icone}</span>${t.nome}
              <span class="count">${MAPA_LOCAIS.filter((l) => l.tipo === k).length}</span>
            </div>`).join("")}
        </div>
        <div class="map-info" id="mapInfo"><span class="muted">👆 Clique em um ponto do mapa</span></div>
      </div>
    </div>
  </div>`;

  $$(".pin").forEach((p) => p.onclick = () => {
    $$(".pin").forEach((x) => x.classList.remove("active"));
    p.classList.add("active");
    const l = MAPA_LOCAIS[p.dataset.i], t = MAPA_TIPOS[l.tipo];
    $("#mapInfo").innerHTML = `<span class="tag" style="color:${t.cor};border-color:${t.cor}">${t.icone} ${t.nome}</span><h3 style="margin:8px 0 4px">${l.nome}</h3><p class="muted" style="font-size:14px">${l.info}</p>`;
  });
  $$(".legend-item").forEach((li) => li.onclick = () => {
    const k = li.dataset.tipo;
    ativos.has(k) ? ativos.delete(k) : ativos.add(k);
    li.classList.toggle("off", !ativos.has(k));
    $$(`.pin[data-tipo="${k}"]`).forEach((p) => p.classList.toggle("hidden", !ativos.has(k)));
  });
}

/* ---------- RANKING ---------- */
const corAvatar = (nome) => `hsl(${[...nome].reduce((s, c) => s + c.charCodeAt(0), 0) % 360} 70% 60%)`;

function pageRanking(params) {
  let tab = RANKING[params.t] ? params.t : Object.keys(RANKING)[0];
  app.innerHTML = `
  <div class="container">
    <div class="page-head fade-in">
      <h1>RANKING <span>GERAL</span></h1>
      <p>Os melhores pilotos e mecânicos do Última Marcha BR. Atualizado a cada temporada.</p>
    </div>
    <div class="chips" id="tabs" style="margin-top:20px">
      ${Object.entries(RANKING).map(([k, r]) => `<span class="chip ${k === tab ? "active" : ""}" data-t="${k}">${r.titulo}</span>`).join("")}
    </div>
    <div id="rank"></div>
  </div>`;

  const fmtVal = (r, v) => r.unidade === "R$" ? fmtBRL(v) : r.unidade === "s" ? fmtN(v, 2) + " s" : r.unidade === "volta" ? `${Math.floor(v / 60)}:${fmtN(v % 60, 2).padStart(5, "0")}` : fmtN(v) + " " + r.unidade;

  const render = () => {
    const r = RANKING[tab];
    const d = [...r.dados].sort((a, b) => r.menorMelhor ? a.valor - b.valor : b.valor - a.valor);
    const pod = [d[1], d[0], d[2]];
    $("#rank").innerHTML = `
      <div class="podium fade-in">
        ${pod.map((p, i) => p ? `
          <div class="card ${i === 1 ? "p1" : ""}">
            <div class="medal">${["🥈", "🥇", "🥉"][i]}</div>
            <div class="avatar" style="background:${corAvatar(p.jogador)}">${p.jogador[0]}</div>
            <b>${p.jogador}</b><div class="muted" style="font-size:13px">${p.carro}</div>
            <div class="price" style="font-size:20px;margin-top:6px">${fmtVal(r, p.valor)}</div>
          </div>` : "<div></div>").join("")}
      </div>
      <div class="card fade-in" style="padding:6px">
        <table class="rank-table">
          <thead><tr><th>#</th><th>Jogador</th><th class="hide-sm">Carro</th><th style="text-align:right">${r.titulo}</th></tr></thead>
          <tbody>
            ${d.map((p, i) => `
              <tr>
                <td class="pos pos-${i + 1}">${i + 1}º</td>
                <td><div class="player"><span class="avatar" style="background:${corAvatar(p.jogador)}">${p.jogador[0]}</span>${p.jogador}</div></td>
                <td class="hide-sm muted">${p.carro}</td>
                <td style="text-align:right;font-weight:800">${fmtVal(r, p.valor)}</td>
              </tr>`).join("")}
          </tbody>
        </table>
      </div>`;
  };
  $$("#tabs .chip").forEach((c) => c.onclick = () => {
    $$("#tabs .chip").forEach((x) => x.classList.remove("active"));
    c.classList.add("active"); tab = c.dataset.t; render();
    history.replaceState(null, "", `#/ranking?t=${tab}`);
  });
  render();
}

/* ---------- NOTÍCIAS ---------- */
const MESES = ["JAN", "FEV", "MAR", "ABR", "MAI", "JUN", "JUL", "AGO", "SET", "OUT", "NOV", "DEZ"];
function pageNoticias() {
  app.innerHTML = `
  <div class="container">
    <div class="page-head fade-in">
      <h1>NOTÍCIAS E <span>ATUALIZAÇÕES</span></h1>
      <p>Patch notes, eventos e tudo o que está rolando no Última Marcha BR.</p>
    </div>
    <div class="grid" style="margin-top:24px">
      ${NOTICIAS.map((n) => {
        const [y, m, d] = n.data.split("-");
        return `
        <article class="card news-item fade-in">
          <div class="news-date"><b>${d}</b>${MESES[+m - 1]} ${y}</div>
          <div>
            <span class="tag tag-${n.tag}">${n.tag}</span>
            <h3>${n.titulo}</h3>
            <p class="muted">${n.texto}</p>
            ${n.itens ? `<ul>${n.itens.map((i) => `<li>${i}</li>`).join("")}</ul>` : ""}
          </div>
        </article>`;
      }).join("")}
    </div>
  </div>`;
}

/* ---------- CÓDIGOS ---------- */
function pageCodigos() {
  const fmtData = (s) => s.split("-").reverse().join("/");
  app.innerHTML = `
  <div class="container">
    <div class="page-head fade-in">
      <h1>CÓDIGOS <span>PROMOCIONAIS</span></h1>
      <p>Resgate dinheiro e itens grátis dentro do jogo. Corra antes que expirem!</p>
    </div>
    <div class="grid" style="grid-template-columns:1.5fr 1fr;gap:18px;margin-top:24px" id="codesGrid">
      <div class="grid">
        ${CODIGOS.map((c) => `
          <div class="card code-card ${c.ativo ? "" : "expired"} fade-in">
            <div>
              <div class="code">${c.codigo}</div>
              <div style="margin-top:10px;font-weight:700">🎁 ${c.recompensa}</div>
              <small class="muted">${c.ativo ? "Válido até " + fmtData(c.expira) : "Expirado"}</small>
            </div>
            ${c.ativo ? `<button class="btn btn-primary btn-sm" data-code="${c.codigo}">📋 Copiar</button>` : `<span class="tag">Expirado</span>`}
          </div>`).join("")}
      </div>
      <div class="card" style="align-self:start">
        <h3 style="margin-bottom:14px">Como resgatar</h3>
        <ol class="steps">
          <li>Entre no Última Marcha BR no Roblox</li>
          <li>Abra o menu (tecla <b>M</b> ou ícone ⚙️)</li>
          <li>Clique em <b>Códigos</b></li>
          <li>Cole o código e clique em <b>Resgatar</b></li>
        </ol>
        <a class="btn btn-green" style="margin-top:18px;width:100%" href="${GAME.robloxUrl}" target="_blank" rel="noopener">▶ Abrir o jogo</a>
      </div>
    </div>
  </div>`;
  if (innerWidth < 800) $("#codesGrid").style.gridTemplateColumns = "1fr";
  $$("[data-code]").forEach((b) => b.onclick = () => copiar(b.dataset.code, `Código ${b.dataset.code} copiado!`));
}

/* ---------- 404 ---------- */
function page404() {
  app.innerHTML = `<div class="container empty"><h1 class="section-title">PÁGINA NÃO <span>ENCONTRADA</span></h1><p style="margin:12px 0 20px">Parece que esse carro saiu da pista.</p><a class="btn btn-primary" href="#/">Voltar ao início</a></div>`;
}

/* =========================================================
   ROTEADOR
   ========================================================= */
const ROTAS = {
  "": pageHome, carros: pageCarros, tuning: pageTuning, comparar: pageComparar,
  mapa: pageMapa, ranking: pageRanking, noticias: pageNoticias, codigos: pageCodigos,
};

function router() {
  const hash = location.hash.replace(/^#\/?/, "");
  const [rota, qs] = hash.split("?");
  const params = Object.fromEntries(new URLSearchParams(qs || ""));
  (ROTAS[rota] || page404)(params);
  $$(".nav a[data-route]").forEach((a) => a.classList.toggle("active", a.dataset.route === rota));
  $("#nav").classList.remove("open");
  window.scrollTo({ top: 0, behavior: "instant" });
}

window.addEventListener("hashchange", router);

$("#menuBtn").onclick = () => $("#nav").classList.toggle("open");
$("#playBtnNav").href = GAME.robloxUrl;
$("#discordFooter").href = GAME.discordUrl;
router();
