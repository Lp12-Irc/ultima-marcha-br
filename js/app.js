/*
  Última Marcha BR — roteador, dados ao vivo (Roblox + Discord) e páginas
*/

const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const app = $("#app");

const fmtBRL = (n) => n.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });
const fmtN = (n, d = 0) => n.toLocaleString("pt-BR", { minimumFractionDigits: d, maximumFractionDigits: d });
const carById = (id) => CARROS.find((c) => c.id === id);
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const RAR_NOME = { comum: "Comum", incomum: "Incomum", raro: "Raro", lendario: "Raro / V8" };

function toast(msg) {
  const t = $("#toast");
  t.textContent = msg;
  t.classList.add("show");
  clearTimeout(t._t);
  t._t = setTimeout(() => t.classList.remove("show"), 2000);
}

function copiar(texto, msg = "Copiado") {
  if (navigator.clipboard) navigator.clipboard.writeText(texto).then(() => toast(msg));
  else {
    const ta = document.createElement("textarea");
    ta.value = texto; document.body.appendChild(ta); ta.select();
    document.execCommand("copy"); ta.remove(); toast(msg);
  }
}

/* ---------------- DADOS AO VIVO (ROBLOX + DISCORD) ---------------- */
const LIVE = { loaded: false, playing: null, visits: null, favs: null, maxPlayers: null, updated: null, discordMembers: null, discordOnline: null };

async function carregarStatusAoVivo() {
  try {
    const snap = await fetch(`js/stats.json?t=${Date.now()}`).then((r) => r.ok ? r.json() : null).catch(() => null);
    if (snap) {
      LIVE.playing = snap.playing;
      LIVE.visits = snap.visits;
      LIVE.favs = snap.favoritedCount;
      LIVE.maxPlayers = snap.maxPlayers;
      LIVE.discordMembers = snap.discordMembers;
      LIVE.discordOnline = snap.discordOnline;
      atualizarStripAoVivo();
    }
    const [rbRes, dcRes] = await Promise.allSettled([
      fetch(`https://games.roproxy.com/v1/games?universeIds=${GAME.universeId}`).then((r) => r.ok ? r.json() : null),
      fetch(`https://discord.com/api/v10/invites/${GAME.discordInvite}?with_counts=true`).then((r) => r.ok ? r.json() : null),
    ]);
    if (rbRes.status === "fulfilled" && rbRes.value?.data?.[0]) {
      const g = rbRes.value.data[0];
      LIVE.playing = g.playing;
      LIVE.visits = g.visits;
      LIVE.favs = g.favoritedCount;
      LIVE.maxPlayers = g.maxPlayers;
      LIVE.updated = g.updated;
    }
    if (dcRes.status === "fulfilled" && dcRes.value?.approximate_member_count) {
      LIVE.discordMembers = dcRes.value.approximate_member_count;
      LIVE.discordOnline = dcRes.value.approximate_presence_count;
    }
    LIVE.loaded = true;
    atualizarStripAoVivo();
  } catch (_) {}
}

function atualizarStripAoVivo() {
  const el = $("#liveStrip");
  if (!el) return;
  const itens = [
    ["Jogando agora", LIVE.playing != null ? fmtN(LIVE.playing) : "—", LIVE.playing > 0],
    ["Visitas no Alpha", LIVE.visits != null ? fmtN(LIVE.visits) : "—"],
    ["Favoritos", LIVE.favs != null ? fmtN(LIVE.favs) : "—"],
    ["No Discord", LIVE.discordMembers != null ? `${fmtN(LIVE.discordMembers)} (${fmtN(LIVE.discordOnline || 0)} on)` : "—"],
    ["Lançamento Beta", GAME.betaData],
  ];
  el.innerHTML = itens.map(([k, v, live]) => `
    <div class="strip-cell">
      <span class="strip-label">${live ? '<i class="live-dot"></i>' : ""}${k}</span>
      <strong class="strip-val">${v}</strong>
    </div>`).join("");
}

/* ---------------- SILHUETAS LATERAIS DOS CARROS ---------------- */
function silhuetaTipo(car) {
  if (car.id === "fusca") return "bug";
  if (car.id === "kombi") return "van";
  if (car.id === "d20" || car.id === "saveiro") return "pickup";
  if (car.categoria === "Hatch" || car.Categoria === "Popular" || car.id === "uno" || car.id === "corsa") return "hatch";
  return "sedan";
}

function carSVG(car, extra = "") {
  const c = car.cor;
  const shapes = {
    hatch: {
      body: "M28,94 L28,74 L38,63 L92,57 L122,31 L212,31 L246,59 L264,74 L264,94 Z",
      win: ["M127,37 L168,37 L168,56 L104,56 Z", "M174,37 L209,37 L236,56 L174,56 Z"],
      wheels: [78, 222], r: 20, wy: 95,
    },
    sedan: {
      body: "M20,94 L20,74 L36,62 L92,57 L118,32 L196,32 L228,57 L274,63 L282,76 L282,94 Z",
      win: ["M122,38 L158,38 L158,56 L102,56 Z", "M164,38 L193,38 L218,56 L164,56 Z"],
      wheels: [76, 228], r: 20, wy: 95,
    },
    bug: {
      body: "M28,95 Q26,70 56,63 Q84,58 98,44 Q130,17 176,23 Q214,29 236,60 Q272,66 270,95 Z",
      win: ["M112,48 Q130,30 158,30 L158,56 L102,56 Z", "M164,30 Q196,32 216,56 L164,56 Z"],
      wheels: [80, 222], r: 20, wy: 95,
    },
    van: {
      body: "M30,95 L30,30 L44,20 L254,20 L276,46 L280,95 Z",
      win: ["M46,28 L108,28 L108,52 L46,52 Z", "M116,28 L178,28 L178,52 L116,52 Z", "M186,28 L248,28 L266,52 L186,52 Z"],
      wheels: [80, 232], r: 20, wy: 95,
    },
    pickup: {
      body: "M20,95 L20,72 L36,61 L84,58 L104,30 L166,30 L170,60 L282,60 L282,95 Z",
      win: ["M109,36 L161,36 L164,58 L94,58 Z"],
      wheels: [72, 232], r: 21, wy: 95,
    },
  };
  const s = shapes[silhuetaTipo(car)];
  const dark = ["#1f2124", "#2c343d", "#2b3d54"].includes(car.cor);
  return `
  <svg viewBox="0 0 300 126" xmlns="http://www.w3.org/2000/svg" ${extra}>
    <line x1="14" y1="${s.wy + s.r}" x2="286" y2="${s.wy + s.r}" stroke="#2a2d33" stroke-width="2"/>
    <path d="${s.body}" fill="${c}" stroke="${dark ? "#4b5058" : "#0e1012"}" stroke-width="2" stroke-linejoin="round"/>
    ${s.win.map((w) => `<path d="${w}" fill="#1b222a" stroke="#0e1012" stroke-width="1.5"/>`).join("")}
    <rect x="20" y="72" width="7" height="7" fill="#e8c86b"/>
    <rect x="${formatoCauda(silhuetaTipo(car))}" y="70" width="7" height="8" fill="#c93b2b"/>
    ${s.wheels.map((x) => `
      <circle cx="${x}" cy="${s.wy}" r="${s.r}" fill="#121316" stroke="#090a0c" stroke-width="2"/>
      <circle cx="${x}" cy="${s.wy}" r="${s.r * 0.56}" fill="#cfd3d8"/>
      <circle cx="${x}" cy="${s.wy}" r="${s.r * 0.2}" fill="#2b2e33"/>`).join("")}
  </svg>`;
}
function formatoCauda(t) { return t === "hatch" ? 257 : t === "bug" ? 262 : 274; }

/* ---------------- CÁLCULO DE TUNING ---------------- */
const BUILD_PADRAO = () => Object.fromEntries(Object.keys(PECAS).map((k) => [k, PECAS[k].opcoes[0].id]));
const opc = (grupo, id) => PECAS[grupo].opcoes.find((o) => o.id === id) || PECAS[grupo].opcoes[0];

function calcular(car, build = BUILD_PADRAO()) {
  const m = opc("motor", build.motor), ind = opc("inducao", build.inducao), cam = opc("cambio", build.cambio);
  const pn = opc("pneus", build.pneus), su = opc("suspensao", build.suspensao), pe = opc("peso", build.peso);

  const cv = car.cv * m.cvMult * ind.cvMult;
  const torque = car.torque * m.torqueMult * ind.torqueMult;
  const peso = Math.max(520, car.peso + pe.peso);
  const grip = pn.grip + su.grip;
  const trac = car.tracao === "4x4" ? 0.94 : car.tracao === "D" ? 1.04 : 1;
  const rel = peso / cv;

  const zero100 = Math.max(2.6, 1.35 * Math.pow(rel, 0.9) * cam.acelMult * (1 - grip) * trac);
  const quarto = Math.max(8.2, 5.825 * Math.cbrt(rel * 2.2046) * Math.sqrt(cam.acelMult * (1 - grip)) * Math.sqrt(trac));
  const pesado = car.categoria === "Utilitário" ? 0.9 : 1;
  const offPecas = (pn.offroad ? 0.95 : 1) * (su.offroad ? 0.96 : 1);
  const vmax = 29 * Math.pow(cv, 0.38) * cam.vmaxMult * pesado * offPecas;

  let offroad = car.tracao === "4x4" ? 75 : car.tracao === "T" ? 32 : 24;
  if (pn.offroad) offroad += 18; if (su.offroad) offroad += 16;
  if (pn.id === "drag") offroad -= 20; if (su.id === "fixa") offroad -= 12; if (su.id === "rosca") offroad -= 6;
  const curvas = 42 + grip * 250 + (1400 - peso) / 26 - (su.offroad ? 8 : 0);

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
        <span class="tag rar-${c.raridade}">${RAR_NOME[c.raridade]}</span>
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
      ${barra("Final", s.vmax, MAX.vmax, fmtN(s.vmax) + " km/h")}
      ${barra("Arrancada", s.zero100, 20, fmtN(s.zero100, 1) + " s", true)}
      ${barra("Chão / curva", s.curvas, 100, fmtN(s.curvas))}
      ${barra("Terra", s.offroad, 100, fmtN(s.offroad))}
      <div class="spec-grid" style="grid-template-columns:1fr 1fr">
        <div class="spec"><small>Rodando (seminovo)</small><b class="price">${fmtBRL(c.preco)}</b></div>
        <div class="spec"><small>Carcaça no ferro-velho</small><b>${fmtBRL(c.sucata)}</b></div>
      </div>
      <div style="display:flex;gap:10px;flex-wrap:wrap">
        <a class="btn btn-primary" href="#/tuning?car=${c.id}" data-close-link>Testar peças na bancada</a>
        <a class="btn" href="#/comparar?a=${c.id}" data-close-link>Comparar com outro</a>
      </div>
    </div>`);
  $$("[data-close-link]").forEach((a) => a.addEventListener("click", fecharModal));
}

function carCard(c) {
  const s = calcular(c);
  return `
  <article class="card car-card" data-car="${c.id}">
    <div class="car-thumb">
      <span class="tag rar rar-${c.raridade}">${c.ano}</span>
      ${carSVG(c)}
    </div>
    <div class="car-body">
      <div style="display:flex;justify-content:space-between;gap:8px;align-items:baseline">
        <h3>${c.nome}</h3><span class="price">${fmtBRL(c.preco)}</span>
      </div>
      <div class="car-meta"><span class="tag">${c.categoria}</span><span class="tag">Tração ${c.tracao}</span><span class="tag">Sucata ${fmtBRL(c.sucata)}</span></div>
      <div class="car-stats">
        <div><b>${fmtN(s.cv)} cv</b><small>motor</small></div>
        <div><b>${fmtN(s.vmax)} km/h</b><small>final</small></div>
        <div><b>${fmtN(s.zero100, 1)} s</b><small>0–100</small></div>
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
  const destaque = ["astra", "opala", "chevette"].map(carById).filter(Boolean);
  const ultima = NOTICIAS[0];
  const cod = CODIGOS.find((c) => c.ativo);

  app.innerHTML = `
  <section class="hero">
    <div class="container hero-inner">
      <div>
        <div class="status-pill">Em ${GAME.fase} · Beta em ${GAME.betaData}</div>
        <h1>Pega no desmanche.<br>Monta na oficina.<br><span>Acerta na pista.</span></h1>
        <p class="lead">Portal de consulta do <strong>Última Marcha BR</strong> no Roblox: tabela dos carros, bancada pra simular acerto de motor e câmbio antes de gastar no jogo, mapa da cidade e notas de atualização.</p>
        <div class="hero-actions">
          <a class="btn btn-green" href="${GAME.robloxUrl}" target="_blank" rel="noopener">Abrir no Roblox</a>
          <a class="btn" href="${GAME.discordUrl}" target="_blank" rel="noopener">Discord da comunidade</a>
          <a class="btn" href="#/tuning">Bancada de tuning</a>
        </div>
      </div>
      <figure class="hero-art">
        <img src="img/logo.png" alt="Astra azul em frente à oficina Injetec Motores no Última Marcha BR" class="hero-logo" />
        <figcaption>Injetec Motores — captura dentro do Alpha</figcaption>
      </figure>
    </div>
  </section>

  <div class="live-bar">
    <div class="container live-strip" id="liveStrip"></div>
  </div>

  <section class="section">
    <div class="container">
      <div class="section-head">
        <h2 class="section-title">Ferramentas do site</h2>
        <span class="muted" style="font-size:14px">Dados sincronizados com a página do jogo no Roblox</span>
      </div>
      <div class="index-grid">
        ${[
          ["Catálogo de carros", "Potência, peso, tração, valor rodando e quanto custa puxar do ferro-velho.", "#/carros"],
          ["Bancada de tuning", "Monta comando, turbina, câmbio e pneu pra ver 0–100, 402m e orçamento total.", "#/tuning"],
          ["Comparador", "Coloca dois carros lado a lado na ficha original pra decidir qual projeto vale mais.", "#/comparar"],
          ["Mapa da cidade", "Localização da Injetec, desmanches, postos, pátio do guincho e pistas.", "#/mapa"],
          ["Tempos e ranking", "Marcações de 402m na reta, subida da serra e entregas concluídas.", "#/ranking"],
          ["Códigos e updates", "Notas do que mudou no Alpha e códigos liberados no Discord.", "#/noticias"],
        ].map(([t, d, h], i) => `<a class="index-item" href="${h}"><span class="num">0${i + 1}</span><div><h3>${t}</h3><p>${d}</p></div></a>`).join("")}
      </div>
    </div>
  </section>

  <section class="section" style="padding-top:0">
    <div class="container">
      <div class="section-head">
        <h2 class="section-title">Projetos mais comuns</h2>
        <a class="link" href="#/carros">Abrir lista completa (${CARROS.length})</a>
      </div>
      <div class="grid grid-3">${destaque.map(carCard).join("")}</div>
    </div>
  </section>

  <section class="section" style="padding-top:0">
    <div class="container split">
      <div class="panel">
        <p class="kicker">${ultima.tag} · ${ultima.data.split("-").reverse().join("/")}</p>
        <h3 class="panel-title">${ultima.titulo}</h3>
        <p class="muted">${ultima.texto}</p>
        ${ultima.itens ? `<ul class="plain-list">${ultima.itens.map((i) => `<li>${i}</li>`).join("")}</ul>` : ""}
        <a class="link" style="margin-top:14px;display:inline-block" href="#/noticias">Histórico de atualizações</a>
      </div>
      <div class="panel">
        <p class="kicker">Comunidade e códigos</p>
        ${cod ? `
          <div class="code">${cod.codigo}</div>
          <p class="muted" style="margin:10px 0 14px">${cod.recompensa}</p>
          <button class="btn btn-sm" id="copyHome">Copiar código</button>
        ` : `
          <h3 class="panel-title">Jogo em fase Alpha</h3>
          <p class="muted">Nenhum código ativo no momento. Avisos de códigos novos, enquetes de carros e relatos de bug saem primeiro no servidor oficial do Discord.</p>
          <div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:16px">
            <a class="btn btn-primary btn-sm" href="${GAME.discordUrl}" target="_blank" rel="noopener">Entrar no Discord</a>
            <a class="btn btn-sm" href="#/codigos">Como resgatar</a>
          </div>
        `}
      </div>
    </div>
  </section>`;

  ligarCards();
  atualizarStripAoVivo();
  if ($("#copyHome") && cod) $("#copyHome").onclick = () => copiar(cod.codigo, "Código copiado");
}

/* ---------- CARROS ---------- */
function pageCarros() {
  const cats = ["Todos", ...new Set(CARROS.map((c) => c.categoria))];
  let cat = "Todos", busca = "", ordem = "preco-asc";

  app.innerHTML = `
  <div class="container">
    <div class="page-head">
      <h1>Catálogo de carros</h1>
      <p>Fichas de referência para planejar compra na garagem de seminovos ou restauração pelo ferro-velho.</p>
    </div>
    <div class="filters">
      <input class="input" id="busca" placeholder="Filtrar por nome (ex: Astra, Opala, AP...)" />
      <select class="select" id="ordem">
        <option value="preco-asc">Menor preço</option>
        <option value="preco-desc">Maior preço</option>
        <option value="cv-desc">Mais potência</option>
        <option value="acel">Melhor 0–100</option>
        <option value="ano">Mais antigos</option>
      </select>
    </div>
    <div class="chips" id="cats">${cats.map((c, i) => `<span class="chip ${i === 0 ? "active" : ""}" data-cat="${c}">${c}</span>`).join("")}</div>
    <div class="grid grid-3" id="lista" style="margin-top:20px"></div>
  </div>`;

  const render = () => {
    const q = busca.toLowerCase();
    let l = CARROS.filter((c) => (cat === "Todos" || c.categoria === cat) && (c.nome.toLowerCase().includes(q) || c.desc.toLowerCase().includes(q)));
    const sorters = {
      "preco-asc": (a, b) => a.preco - b.preco,
      "preco-desc": (a, b) => b.preco - a.preco,
      "cv-desc": (a, b) => b.cv - a.cv,
      acel: (a, b) => calcular(a).zero100 - calcular(b).zero100,
      ano: (a, b) => a.ano - b.ano,
    };
    l.sort(sorters[ordem]);
    $("#lista").innerHTML = l.length ? l.map(carCard).join("") : `<div class="empty" style="grid-column:1/-1">Nenhum carro encontrado para esse filtro.</div>`;
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
  let car = carById(params.car) || CARROS[0];
  let build = BUILD_PADRAO();
  if (params.b) params.b.split(",").forEach((p) => { const [k, v] = p.split(":"); if (PECAS[k]) build[k] = v; });

  app.innerHTML = `
  <div class="container">
    <div class="page-head">
      <h1>Bancada de tuning</h1>
      <p>Simule combinações de preparação, câmbio e pneu para estimar ganho e custo antes de montar no jogo.</p>
    </div>
    <div class="tuning-layout">
      <div>
        <div class="card" style="margin-bottom:16px">
          <label class="muted" style="font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:.06em">Carro no elevador</label>
          <select class="select" id="tCar" style="width:100%;margin-top:6px">
            ${CARROS.map((c) => `<option value="${c.id}" ${c.id === car.id ? "selected" : ""}>${c.nome} (${c.ano}) — ${c.cv} cv originais</option>`).join("")}
          </select>
          <div id="tCarSvg" style="margin-top:14px;padding:0 24px"></div>
        </div>
        <div class="card" id="parts"></div>
      </div>
      <div class="card result-card" id="result"></div>
    </div>
  </div>`;

  const renderParts = () => {
    $("#parts").innerHTML = Object.entries(PECAS).map(([k, g]) => `
      <div class="part-group">
        <h3>${g.nome}</h3>
        <div class="part-options">
          ${g.opcoes.map((o) => `
            <button class="part-opt ${build[k] === o.id ? "active" : ""}" data-g="${k}" data-o="${o.id}">
              <b>${o.nome}</b><small>${o.preco ? fmtBRL(o.preco) : "Original"}</small>
            </button>`).join("")}
        </div>
      </div>`).join("");
    $$(".part-opt").forEach((b) => b.onclick = () => { build[b.dataset.g] = b.dataset.o; renderParts(); renderResult(); });
  };

  const delta = (novo, velho, menorMelhor = false, d = 0, suf = "") => {
    const diff = novo - velho;
    if (Math.abs(diff) < 0.05) return `<span class="delta muted">sem alteração</span>`;
    const bom = menorMelhor ? diff < 0 : diff > 0;
    return `<span class="delta ${bom ? "up" : "down"}">${diff > 0 ? "+" : ""}${fmtN(diff, d)}${suf}</span>`;
  };

  const renderResult = () => {
    const base = calcular(car), s = calcular(car, build);
    const builds = getBuilds();
    $("#result").innerHTML = `
      <div style="display:flex;justify-content:space-between;align-items:baseline">
        <h3 style="font-size:18px">Ficha estimada</h3>
        <span class="muted" style="font-size:13px">${car.nome}</span>
      </div>
      <div class="big-stats">
        <div class="big-stat"><small>Potência</small><div class="v">${fmtN(s.cv)} cv</div>${delta(s.cv, base.cv, false, 0, " cv")}</div>
        <div class="big-stat"><small>Torque</small><div class="v">${fmtN(s.torque, 1)} kgfm</div>${delta(s.torque, base.torque, false, 1, " kgfm")}</div>
        <div class="big-stat"><small>0–100 km/h</small><div class="v">${fmtN(s.zero100, 1)} s</div>${delta(s.zero100, base.zero100, true, 1, " s")}</div>
        <div class="big-stat"><small>Final</small><div class="v">${fmtN(s.vmax)} km/h</div>${delta(s.vmax, base.vmax, false, 0, " km/h")}</div>
        <div class="big-stat"><small>402m</small><div class="v">${fmtN(s.quarto, 2)} s</div>${delta(s.quarto, base.quarto, true, 2, " s")}</div>
        <div class="big-stat"><small>Peso</small><div class="v">${fmtN(s.peso)} kg</div>${delta(s.peso, base.peso, true, 0, " kg")}</div>
      </div>
      ${barra("Chão / curva", s.curvas, 100, fmtN(s.curvas))}
      ${barra("Terra", s.offroad, 100, fmtN(s.offroad))}
      <div class="total"><span>Total em peças</span><b>${fmtBRL(s.custo)}</b></div>
      <p class="muted" style="font-size:13px">Projeto completo: <b style="color:var(--text)">${fmtBRL(s.custo + car.preco)}</b> comprando rodando, ou <b style="color:var(--text)">${fmtBRL(s.custo + car.sucata)}</b> puxando do desmanche.</p>
      <div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:14px">
        <button class="btn btn-primary btn-sm" id="save">Salvar acerto</button>
        <button class="btn btn-sm" id="share">Copiar link</button>
        <button class="btn btn-sm" id="reset">Zerar</button>
      </div>
      <h4 style="margin-top:20px;font-size:13px;text-transform:uppercase;letter-spacing:.06em;color:var(--muted)">Acertos salvos no navegador</h4>
      <div class="saved-list">
        ${builds.length ? builds.map((b, i) => `
          <div class="saved-item">
            <div><b>${b.nome}</b><br><small class="muted">${carById(b.car)?.nome || "?"}</small></div>
            <div style="display:flex;gap:6px">
              <button class="btn btn-sm" data-load="${i}">Carregar</button>
              <button class="btn btn-sm" data-del="${i}">Apagar</button>
            </div>
          </div>`).join("") : `<p class="muted" style="font-size:13px">Nenhum acerto salvo.</p>`}
      </div>`;

    $("#save").onclick = () => {
      const nome = prompt("Nome pra identificar esse acerto:", `${car.nome} (${fmtN(s.cv)} cv)`);
      if (!nome) return;
      setBuilds([{ nome, car: car.id, build: { ...build } }, ...getBuilds()].slice(0, 20));
      toast("Acerto salvo"); renderResult();
    };
    $("#share").onclick = () => {
      const b = Object.entries(build).map(([k, v]) => `${k}:${v}`).join(",");
      const url = `${location.origin}${location.pathname}#/tuning?car=${car.id}&b=${b}`;
      history.replaceState(null, "", `#/tuning?car=${car.id}&b=${b}`);
      copiar(url, "Link copiado");
    };
    $("#reset").onclick = () => { build = BUILD_PADRAO(); renderParts(); renderResult(); };
    $$("[data-load]").forEach((el) => el.onclick = () => {
      const b = getBuilds()[el.dataset.load];
      car = carById(b.car) || CARROS[0]; build = { ...BUILD_PADRAO(), ...b.build };
      $("#tCar").value = car.id; renderCar(); renderParts(); renderResult(); toast("Acerto carregado");
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
  let a = carById(params.a) || CARROS[0], b = carById(params.b) || (a.id === CARROS[1].id ? CARROS[2] : CARROS[1]);
  const opts = (sel) => CARROS.map((c) => `<option value="${c.id}" ${c.id === sel.id ? "selected" : ""}>${c.nome} (${c.ano})</option>`).join("");

  app.innerHTML = `
  <div class="container">
    <div class="page-head">
      <h1>Comparador</h1>
      <p>Comparação direta entre dois carros originais (sem peças de preparação).</p>
    </div>
    <div class="compare-pick">
      <select class="select" id="cA">${opts(a)}</select>
      <div class="vs">×</div>
      <select class="select" id="cB">${opts(b)}</select>
    </div>
    <div class="compare-cars" id="cSvgs"></div>
    <div class="card" style="margin-top:16px;padding:8px 16px"><table class="compare-table" id="cTable"></table></div>
  </div>`;

  const render = () => {
    const sa = calcular(a), sb = calcular(b);
    $("#cSvgs").innerHTML = [a, b].map((c) => `<div class="card car-thumb">${carSVG(c)}<h3 style="text-align:center;margin-top:8px">${c.nome}</h3></div>`).join("");
    const linhas = [
      ["Potência", sa.cv, sb.cv, (v) => fmtN(v) + " cv", false],
      ["Torque", sa.torque, sb.torque, (v) => fmtN(v, 1) + " kgfm", false],
      ["Peso", sa.peso, sb.peso, (v) => fmtN(v) + " kg", true],
      ["0–100 km/h", sa.zero100, sb.zero100, (v) => fmtN(v, 1) + " s", true],
      ["Velocidade final", sa.vmax, sb.vmax, (v) => fmtN(v) + " km/h", false],
      ["402m", sa.quarto, sb.quarto, (v) => fmtN(v, 2) + " s", true],
      ["Preço rodando", a.preco, b.preco, fmtBRL, true],
      ["Carcaça no ferro-velho", a.sucata, b.sucata, fmtBRL, true],
    ];
    let pa = 0, pb = 0;
    $("#cTable").innerHTML = linhas.map(([l, va, vb, f, menor]) => {
      const winA = menor ? va < vb : va > vb, winB = menor ? vb < va : vb > va;
      if (winA) pa++; if (winB) pb++;
      return `<tr><td class="${winA ? "win" : ""}">${f(va)}</td><td>${l}</td><td class="${winB ? "win" : ""}">${f(vb)}</td></tr>`;
    }).join("") + `<tr><td style="font-family:var(--font-title);font-size:24px;color:${pa >= pb ? "var(--yellow)" : "inherit"}">${pa}</td><td>Vantagens</td><td style="font-family:var(--font-title);font-size:24px;color:${pb >= pa ? "var(--yellow)" : "inherit"}">${pb}</td></tr>`;
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
    <rect width="160" height="110" fill="#1e291c"/>
    <g fill="#253322">
      <circle cx="12" cy="10" r="10"/><circle cx="25" cy="6" r="8"/><circle cx="6" cy="95" r="12"/><circle cx="20" cy="104" r="9"/>
      <circle cx="150" cy="100" r="11"/><circle cx="140" cy="8" r="7"/><circle cx="110" cy="105" r="8"/>
    </g>
    <path d="M0,30 C30,26 40,60 70,64 S120,95 160,88" stroke="#244b6b" stroke-width="5" fill="none"/>
    <rect x="55" y="40" width="40" height="34" rx="1" fill="#26292e"/>
    <g fill="#31353c">
      ${Array.from({ length: 4 }, (_, i) => Array.from({ length: 3 }, (_, j) => `<rect x="${57 + i * 9.5}" y="${42 + j * 10.5}" width="7.5" height="8.5"/>`).join("")).join("")}
    </g>
    <g stroke="#4a4e54" stroke-width="2.4" fill="none" stroke-linecap="round">
      <path d="M0,60 L160,60"/><path d="M75,0 L75,110"/><path d="M75,60 L105,33 L160,15"/>
      <path d="M75,60 L30,40 L20,10"/><path d="M75,60 L40,80 L12,92"/><path d="M75,60 L125,80"/>
    </g>
    <g stroke="#d4aa00" stroke-width=".35" fill="none" stroke-dasharray="2 2">
      <path d="M0,60 L160,60"/><path d="M75,0 L75,110"/><path d="M75,60 L105,33 L160,15"/>
    </g>
    <rect x="128" y="16" width="26" height="5" fill="#3c4046" transform="rotate(-18 141 19)"/>
    <ellipse cx="32" cy="53" rx="10" ry="6" fill="none" stroke="#4a4e54" stroke-width="2"/>
    <path d="M12,92 C8,98 4,100 2,108" stroke="#6b4f35" stroke-width="2" fill="none" stroke-dasharray="1.5 1"/>
  </svg>`;
}

function pageMapa() {
  const ativos = new Set(Object.keys(MAPA_TIPOS));
  app.innerHTML = `
  <div class="container">
    <div class="page-head">
      <h1>Mapa esquemático</h1>
      <p>Pontos principais de referência. Clique num marcador para ler o que funciona lá ou filtre pela legenda.</p>
    </div>
    <div class="map-layout">
      <div class="map-wrap" id="map">
        ${mapaSVG()}
        ${MAPA_LOCAIS.map((l, i) => {
          const t = MAPA_TIPOS[l.tipo];
          return `<div class="pin" data-i="${i}" data-tipo="${l.tipo}" style="left:${l.x}%;top:${l.y}%;background:${t.cor}"><span class="pin-label">${l.nome}</span></div>`;
        }).join("")}
      </div>
      <div class="card">
        <h3 style="margin-bottom:8px;font-size:15px">Filtrar pontos</h3>
        <div id="legend">
          ${Object.entries(MAPA_TIPOS).map(([k, t]) => `
            <div class="legend-item" data-tipo="${k}">
              <span class="sw" style="background:${t.cor}"></span>${t.nome}
              <span class="count">${MAPA_LOCAIS.filter((l) => l.tipo === k).length}</span>
            </div>`).join("")}
        </div>
        <div class="map-info" id="mapInfo"><span class="muted" style="font-size:13px">Selecione um ponto no mapa para ver os detalhes.</span></div>
      </div>
    </div>
  </div>`;

  $$(".pin").forEach((p) => p.onclick = () => {
    $$(".pin").forEach((x) => x.classList.remove("active"));
    p.classList.add("active");
    const l = MAPA_LOCAIS[p.dataset.i], t = MAPA_TIPOS[l.tipo];
    $("#mapInfo").innerHTML = `<span class="tag" style="color:${t.cor}">${t.nome}</span><h3 style="margin:6px 0 4px;font-size:16px">${l.nome}</h3><p class="muted" style="font-size:13px">${l.info}</p>`;
  });
  $$(".legend-item").forEach((li) => li.onclick = () => {
    const k = li.dataset.tipo;
    ativos.has(k) ? ativos.delete(k) : ativos.add(k);
    li.classList.toggle("off", !ativos.has(k));
    $$(`.pin[data-tipo="${k}"]`).forEach((p) => p.classList.toggle("hidden", !ativos.has(k)));
  });
}

/* ---------- RANKING ---------- */
function pageRanking(params) {
  let tab = RANKING[params.t] ? params.t : Object.keys(RANKING)[0];
  app.innerHTML = `
  <div class="container">
    <div class="page-head">
      <h1>Quadro de tempos</h1>
      <p>Registros por categoria. ${typeof RANKING_DEMO !== "undefined" && RANKING_DEMO ? "Dados demonstrativos até a integração via HttpService entrar no Beta." : ""}</p>
    </div>
    <div class="chips" id="tabs" style="margin-top:18px">
      ${Object.entries(RANKING).map(([k, r]) => `<span class="chip ${k === tab ? "active" : ""}" data-t="${k}">${r.titulo}</span>`).join("")}
    </div>
    <div id="rank" style="margin-top:18px"></div>
  </div>`;

  const fmtVal = (r, v) => r.unidade === "R$" ? fmtBRL(v) : r.unidade === "s" ? fmtN(v, 2) + " s" : r.unidade === "volta" ? `${Math.floor(v / 60)}:${fmtN(v % 60, 2).padStart(5, "0")}` : fmtN(v) + " " + r.unidade;

  const render = () => {
    const r = RANKING[tab];
    const d = [...r.dados].sort((a, b) => r.menorMelhor ? a.valor - b.valor : b.valor - a.valor);
    $("#rank").innerHTML = `
      <div class="card" style="padding:4px 8px">
        <table class="rank-table">
          <thead><tr><th>Pos.</th><th>Piloto (Roblox)</th><th class="hide-sm">Carro</th><th style="text-align:right">${r.titulo}</th></tr></thead>
          <tbody>
            ${d.map((p, i) => `
              <tr>
                <td class="pos ${i === 0 ? "pos-1" : ""}">${i + 1}º</td>
                <td><strong>@${p.jogador}</strong></td>
                <td class="hide-sm muted">${p.carro}</td>
                <td style="text-align:right;font-weight:700;font-variant-numeric:tabular-nums">${fmtVal(r, p.valor)}</td>
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
    <div class="page-head">
      <h1>Atualizações</h1>
      <p>Registro do desenvolvimento do Alpha até a virada pro Beta em ${GAME.betaData}.</p>
    </div>
    <div class="grid" style="margin-top:22px">
      ${NOTICIAS.map((n) => {
        const [y, m, d] = n.data.split("-");
        return `
        <article class="card news-item">
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
    <div class="page-head">
      <h1>Códigos</h1>
      <p>Códigos liberados pela equipe em metas de likes, eventos ou compensação de bugs.</p>
    </div>
    <div class="split" style="margin-top:22px">
      <div class="grid" style="align-content:start">
        ${CODIGOS.length ? CODIGOS.map((c) => `
          <div class="card code-card ${c.ativo ? "" : "expired"}">
            <div>
              <div class="code">${c.codigo}</div>
              <div style="margin-top:8px;font-weight:600">${c.recompensa}</div>
              <small class="muted">${c.ativo ? "Até " + fmtData(c.expira) : "Expirado"}</small>
            </div>
            ${c.ativo ? `<button class="btn btn-primary btn-sm" data-code="${c.codigo}">Copiar</button>` : `<span class="tag">Expirado</span>`}
          </div>`).join("") : `
          <div class="card">
            <h3 style="font-size:18px;margin-bottom:6px">Nenhum código liberado ainda</h3>
            <p class="muted" style="font-size:14px">O jogo ainda está em Alpha fechado de sistemas e o próximo marco grande é o Beta em <strong>${GAME.betaData}</strong>. Quando sair código novo no servidor, ele aparece listado aqui.</p>
            <a class="btn btn-sm" style="margin-top:14px" href="${GAME.discordUrl}" target="_blank" rel="noopener">Acompanhar no Discord</a>
          </div>`}
      </div>
      <div class="card" style="align-self:start">
        <h3 style="margin-bottom:12px;font-size:17px">Onde digitar no jogo</h3>
        <ol class="steps">
          <li>Abra o Última Marcha BR pelo Roblox</li>
          <li>Procure o menu lateral na tela inicial ou dentro do servidor</li>
          <li>Entre na aba de códigos, cole o texto e confirme</li>
        </ol>
        <a class="btn btn-green" style="margin-top:18px;width:100%" href="${GAME.robloxUrl}" target="_blank" rel="noopener">Entrar no jogo</a>
      </div>
    </div>
  </div>`;
  $$("[data-code]").forEach((b) => b.onclick = () => copiar(b.dataset.code, `Código ${b.dataset.code} copiado`));
}

/* ---------- 404 ---------- */
function page404() {
  app.innerHTML = `<div class="container empty"><h1 class="section-title">Página não encontrada</h1><p style="margin:12px 0 20px">Esse endereço não existe.</p><a class="btn btn-primary" href="#/">Voltar ao início</a></div>`;
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
$("#robloxFooter").href = GAME.robloxUrl;
router();
carregarStatusAoVivo();
