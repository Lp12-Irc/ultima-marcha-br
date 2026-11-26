/* =========================================================
   ÚLTIMA MARCHA BR — DADOS DO SITE
   Edite este arquivo para atualizar carros, peças, notícias,
   códigos, mapa e ranking. Não precisa mexer no resto.
   ========================================================= */

const GAME = {
  nome: "Última Marcha BR",
  robloxUrl: "https://www.roblox.com/games/", // <- coloque o link do seu jogo aqui
  discordUrl: "#",                            // <- link do Discord
  versao: "v1.0",
};

/* ---------- CARROS ----------
   cv = cavalos | torque = kgfm | peso = kg
   tracao: "T" traseira, "D" dianteira, "4x4"
   raridade: comum | incomum | raro | lendario
*/
const CARROS = [
  { id: "fusquinha", nome: "Fusquinha 1300", ano: 1978, categoria: "Clássico", tracao: "T", cv: 46, torque: 9.0, peso: 800, preco: 8500, sucata: 2500, raridade: "comum", cor: "#4fa3e0",
    desc: "O primeiro carro de todo mecânico. Barato, fácil de consertar e indestrutível." },
  { id: "brasilia", nome: "Brasilinha 1600", ano: 1980, categoria: "Clássico", tracao: "T", cv: 60, torque: 11.0, peso: 890, preco: 11000, sucata: 3200, raridade: "comum", cor: "#e8c547",
    desc: "Espaçosa e confiável. Ótima pra começar a fazer entregas pela cidade." },
  { id: "chevetao", nome: "Chevetão SL", ano: 1983, categoria: "Clássico", tracao: "T", cv: 72, torque: 12.2, peso: 900, preco: 14500, sucata: 4000, raridade: "comum", cor: "#c0392b",
    desc: "Tração traseira e leve. O queridinho de quem quer aprender a dar drift." },
  { id: "opalao", nome: "Opalão 4.1 SS", ano: 1979, categoria: "Muscle", tracao: "T", cv: 140, torque: 29.0, peso: 1220, preco: 42000, sucata: 12000, raridade: "raro", cor: "#1d1d1d",
    desc: "Seis cilindros de pura nostalgia. Com turbo vira um monstro de arrancada." },
  { id: "maverao", nome: "Maverão V8 GT", ano: 1975, categoria: "Muscle", tracao: "T", cv: 199, torque: 38.0, peso: 1350, preco: 68000, sucata: 21000, raridade: "lendario", cor: "#e67e22",
    desc: "O V8 mais desejado do servidor. Raro de achar no ferro-velho." },
  { id: "gol-quadrado", nome: "Golzinho Quadrado GTi", ano: 1994, categoria: "Esportivo", tracao: "D", cv: 120, torque: 18.4, peso: 920, preco: 31000, sucata: 8500, raridade: "incomum", cor: "#ecf0f1",
    desc: "Leve e nervoso. Rei das ruas nos anos 90 e preferido pra rachas na cidade." },
  { id: "uninho", nome: "Uninho Mille", ano: 1996, categoria: "Popular", tracao: "D", cv: 56, torque: 8.0, peso: 790, preco: 9500, sucata: 2800, raridade: "comum", cor: "#27ae60",
    desc: "Econômico ao extremo. Com escada no teto vira o carro oficial da firma." },
  { id: "escortao", nome: "Escortão XR3", ano: 1991, categoria: "Esportivo", tracao: "D", cv: 105, torque: 16.0, peso: 960, preco: 27000, sucata: 7500, raridade: "incomum", cor: "#8e44ad",
    desc: "Conversível clássico com motor esperto. Ótimo para encontros." },
  { id: "kombosa", nome: "Kombosa Furgão", ano: 1985, categoria: "Utilitário", tracao: "T", cv: 58, torque: 11.5, peso: 1150, preco: 16000, sucata: 4500, raridade: "comum", cor: "#f5f5f5",
    desc: "Carga máxima em entregas. Não é rápida, mas paga as contas." },
  { id: "d20", nome: "Caminhonete D-20 Diesel", ano: 1992, categoria: "Utilitário", tracao: "T", cv: 90, torque: 28.0, peso: 1900, preco: 39000, sucata: 11000, raridade: "incomum", cor: "#2c3e50",
    desc: "Torque de sobra para reboque e trabalhos pesados na fazenda." },
  { id: "jipao", nome: "Jipão Willys", ano: 1968, categoria: "Off-Road", tracao: "4x4", cv: 90, torque: 17.0, peso: 1150, preco: 26000, sucata: 7000, raridade: "raro", cor: "#556b2f",
    desc: "Feito pra lama. Encara qualquer trilha do mapa sem atolar." },
  { id: "toyotona", nome: "Bandeirantão 4x4", ano: 1990, categoria: "Off-Road", tracao: "4x4", cv: 96, torque: 24.5, peso: 1800, preco: 47000, sucata: 13500, raridade: "raro", cor: "#a0522d",
    desc: "Robusto e imparável. O rei das trilhas pesadas e travessias de rio." },
];

/* ---------- PEÇAS DE TUNING ----------
   cv/torque: multiplicador ou soma | peso: kg somados | grip: aderência
*/
const PECAS = {
  motor: {
    nome: "Motor", icone: "⚙️",
    opcoes: [
      { id: "orig", nome: "Original", preco: 0, cvMult: 1, torqueMult: 1 },
      { id: "retifica", nome: "Retífica completa", preco: 3500, cvMult: 1.08, torqueMult: 1.06 },
      { id: "comando", nome: "Comando bravo + cabeçote", preco: 7800, cvMult: 1.22, torqueMult: 1.12 },
      { id: "forjado", nome: "Motor forjado", preco: 18000, cvMult: 1.45, torqueMult: 1.30 },
    ],
  },
  inducao: {
    nome: "Indução", icone: "🌀",
    opcoes: [
      { id: "aspirado", nome: "Aspirado", preco: 0, cvMult: 1, torqueMult: 1 },
      { id: "carbs", nome: "Carburação dupla", preco: 2800, cvMult: 1.10, torqueMult: 1.05 },
      { id: "turbo-p", nome: "Turbo pequeno", preco: 9000, cvMult: 1.35, torqueMult: 1.40 },
      { id: "turbo-g", nome: "Turbo grande", preco: 16500, cvMult: 1.75, torqueMult: 1.70 },
      { id: "blower", nome: "Blower (compressor)", preco: 21000, cvMult: 1.65, torqueMult: 1.85 },
    ],
  },
  cambio: {
    nome: "Câmbio", icone: "🕹️",
    opcoes: [
      { id: "orig", nome: "Original 4 marchas", preco: 0, vmaxMult: 1, acelMult: 1 },
      { id: "5m", nome: "5 marchas", preco: 4200, vmaxMult: 1.08, acelMult: 0.97 },
      { id: "curto", nome: "Relação curta (arrancada)", preco: 6000, vmaxMult: 0.92, acelMult: 0.88 },
      { id: "seq", nome: "Sequencial de corrida", preco: 15000, vmaxMult: 1.10, acelMult: 0.86 },
    ],
  },
  pneus: {
    nome: "Pneus", icone: "🛞",
    opcoes: [
      { id: "orig", nome: "Rodagem comum", preco: 0, grip: 0 },
      { id: "esportivo", nome: "Esportivo", preco: 2400, grip: 0.06 },
      { id: "slick", nome: "Slick / Drag", preco: 5200, grip: 0.12 },
      { id: "lameiro", nome: "Lameiro (off-road)", preco: 3000, grip: -0.03, offroad: true },
    ],
  },
  suspensao: {
    nome: "Suspensão", icone: "🔩",
    opcoes: [
      { id: "orig", nome: "Original", preco: 0, grip: 0 },
      { id: "rebaixada", nome: "Rebaixada (molas)", preco: 1800, grip: 0.03 },
      { id: "rosca", nome: "Coilover de rosca", preco: 6500, grip: 0.07 },
      { id: "lift", nome: "Lift kit off-road", preco: 5500, grip: -0.02, offroad: true },
    ],
  },
  peso: {
    nome: "Redução de peso", icone: "🪶",
    opcoes: [
      { id: "orig", nome: "Nenhuma", preco: 0, peso: 0 },
      { id: "bancos", nome: "Bancos concha + sem banco traseiro", preco: 1500, peso: -45 },
      { id: "fibra", nome: "Capô e portas de fibra", preco: 6000, peso: -110 },
      { id: "gaiola", nome: "Depenado completo", preco: 9500, peso: -170 },
    ],
  },
};

/* ---------- NOTÍCIAS / PATCH NOTES ---------- */
const NOTICIAS = [
  { data: "2026-11-20", tag: "Atualização", titulo: "Atualização 1.0 — Bem-vindo à Última Marcha BR!",
    texto: "Lançamento oficial com 12 carros, ferro-velho, oficina completa, sistema de entregas e pista de arrancada.",
    itens: ["12 carros clássicos brasileiros", "Sistema de desgaste de peças", "Pista de arrancada 402m", "Trabalhos de entrega e reboque"] },
  { data: "2026-11-15", tag: "Evento", titulo: "1º Encontro de Clássicos neste sábado",
    texto: "Leve seu carro restaurado para o posto da Rodovia às 19h. Os 3 carros mais votados ganham prêmios em dinheiro do jogo.",
    itens: ["Sábado às 19h (horário de Brasília)", "Local: Posto Rodovia", "Prêmio: R$ 50.000 no jogo"] },
  { data: "2026-11-10", tag: "Correção", titulo: "Correções de bugs — Beta 0.9.4",
    texto: "Corrigido bug do carro voando ao sair do elevador da oficina e melhorias de desempenho no mapa.",
    itens: ["Elevador da oficina corrigido", "+15% de FPS no centro da cidade", "Correção no salvamento da garagem"] },
];

/* ---------- CÓDIGOS ---------- */
const CODIGOS = [
  { codigo: "ULTIMAMARCHA", recompensa: "R$ 10.000", ativo: true, expira: "2026-12-31" },
  { codigo: "1KLIKES", recompensa: "R$ 5.000 + Pintura Neon", ativo: true, expira: "2026-12-15" },
  { codigo: "OPALAOTURBO", recompensa: "Turbo pequeno grátis", ativo: true, expira: "2026-12-01" },
  { codigo: "BETA2026", recompensa: "R$ 2.500", ativo: false, expira: "2026-11-01" },
];

/* ---------- MAPA (coordenadas em % do mapa) ---------- */
const MAPA_LOCAIS = [
  { nome: "Oficina Central", tipo: "oficina", x: 48, y: 46, info: "Elevadores, compra de peças e pintura." },
  { nome: "Oficina do Zé", tipo: "oficina", x: 22, y: 70, info: "Peças usadas mais baratas." },
  { nome: "Ferro-Velho do Tião", tipo: "ferrovelho", x: 78, y: 72, info: "Sucatas novas aparecem a cada 30 minutos." },
  { nome: "Desmanche da Serra", tipo: "ferrovelho", x: 14, y: 22, info: "Chance de sucatas raras (Maverão!)." },
  { nome: "Posto Rodovia", tipo: "posto", x: 64, y: 30, info: "Combustível e ponto de encontro." },
  { nome: "Posto Centro", tipo: "posto", x: 38, y: 58, info: "Combustível e loja de conveniência." },
  { nome: "Transportadora", tipo: "trabalho", x: 70, y: 52, info: "Trabalho de entregas (CLT)." },
  { nome: "Guincho 24h", tipo: "trabalho", x: 30, y: 38, info: "Trabalho de reboque de carros quebrados." },
  { nome: "Pista de Arrancada", tipo: "corrida", x: 86, y: 18, info: "402 metros, com cronômetro oficial." },
  { nome: "Circuito da Serra", tipo: "corrida", x: 20, y: 48, info: "Pista de curvas para drift e tempo de volta." },
  { nome: "Trilha do Barro", tipo: "trilha", x: 8, y: 84, info: "Trilha off-road nível difícil." },
  { nome: "Concessionária", tipo: "loja", x: 54, y: 66, info: "Carros novos e seminovos." },
];

const MAPA_TIPOS = {
  oficina:    { nome: "Oficinas",      cor: "#ffcc00", icone: "🔧" },
  ferrovelho: { nome: "Ferro-velhos",  cor: "#b07a4a", icone: "🧲" },
  posto:      { nome: "Postos",        cor: "#3fb950", icone: "⛽" },
  trabalho:   { nome: "Trabalhos",     cor: "#58a6ff", icone: "💼" },
  corrida:    { nome: "Corridas",      cor: "#ff4d4d", icone: "🏁" },
  trilha:     { nome: "Trilhas",       cor: "#8bc34a", icone: "🌲" },
  loja:       { nome: "Lojas",         cor: "#d070ff", icone: "🏪" },
};

/* ---------- RANKING (exemplo — depois pode vir da API do jogo) ---------- */
const RANKING = {
  arrancada: {
    titulo: "Arrancada 402m", unidade: "s", menorMelhor: true,
    dados: [
      { jogador: "TurboDoNordeste", carro: "Opalão 4.1 SS", valor: 10.84 },
      { jogador: "ZeDaOficina", carro: "Maverão V8 GT", valor: 11.02 },
      { jogador: "Gabriel_Rebaixado", carro: "Golzinho Quadrado GTi", valor: 11.47 },
      { jogador: "MecanicoRaiz", carro: "Chevetão SL", valor: 12.31 },
      { jogador: "FuscaAzul77", carro: "Fusquinha 1300", valor: 13.05 },
      { jogador: "Lu_Drift", carro: "Escortão XR3", valor: 13.40 },
      { jogador: "PedroPneu", carro: "Uninho Mille", valor: 14.88 },
    ],
  },
  dinheiro: {
    titulo: "Mais rico", unidade: "R$", menorMelhor: false,
    dados: [
      { jogador: "ZeDaOficina", carro: "Maverão V8 GT", valor: 1250000 },
      { jogador: "PatraoDaFirma", carro: "D-20 Diesel", valor: 980500 },
      { jogador: "TurboDoNordeste", carro: "Opalão 4.1 SS", valor: 740200 },
      { jogador: "KombiDoAmor", carro: "Kombosa Furgão", valor: 512000 },
      { jogador: "MecanicoRaiz", carro: "Chevetão SL", valor: 330900 },
      { jogador: "Lu_Drift", carro: "Escortão XR3", valor: 210000 },
    ],
  },
  entregas: {
    titulo: "Mais entregas", unidade: "entregas", menorMelhor: false,
    dados: [
      { jogador: "KombiDoAmor", carro: "Kombosa Furgão", valor: 2140 },
      { jogador: "PatraoDaFirma", carro: "D-20 Diesel", valor: 1877 },
      { jogador: "UninhoDaFirma", carro: "Uninho Mille", valor: 1502 },
      { jogador: "BrasiliaAmarela", carro: "Brasilinha 1600", valor: 998 },
      { jogador: "PedroPneu", carro: "Uninho Mille", valor: 640 },
    ],
  },
  serra: {
    titulo: "Circuito da Serra", unidade: "volta", menorMelhor: true,
    dados: [
      { jogador: "Lu_Drift", carro: "Chevetão SL", valor: 82.41 },
      { jogador: "Gabriel_Rebaixado", carro: "Golzinho Quadrado GTi", valor: 83.10 },
      { jogador: "TurboDoNordeste", carro: "Opalão 4.1 SS", valor: 85.92 },
      { jogador: "MecanicoRaiz", carro: "Escortão XR3", valor: 86.33 },
      { jogador: "FuscaAzul77", carro: "Fusquinha 1300", valor: 95.70 },
    ],
  },
};
