/*
  Dados do site — Última Marcha BR
  Para trocar carros, peças, códigos ou locais do mapa, edite aqui.
*/

const GAME = {
  nome: "Última Marcha BR",
  universeId: 10765368145,
  placeId: 106981767858651,
  robloxUrl: "https://www.roblox.com/games/106981767858651/ltima-Marcha-BR",
  discordInvite: "zy2exUyTEX",
  discordUrl: "https://discord.gg/zy2exUyTEX",
  criador: "Davigrandao02",
  fase: "Alpha",
  betaData: "18/12/2026",
};

/*
  Carros (catálogo inicial de referência — ajustar conforme lista oficial in-game)
  tracao: "T" traseira | "D" dianteira | "4x4"
*/
const CARROS = [
  { id: "astra", nome: "Astra Hatch 2.0", ano: 2001, categoria: "Hatch", tracao: "D", cv: 116, torque: 17.3, peso: 1130, preco: 28500, sucata: 8200, raridade: "incomum", cor: "#195ec9",
    desc: "Hatch 2.0 8v bom de chão e fácil de mexer na injeção. Presença garantida na frente da Injetec." },
  { id: "gol-quadrado", nome: "Gol GL 1.8 AP", ano: 1992, categoria: "Hatch", tracao: "D", cv: 96, torque: 15.2, peso: 915, preco: 19500, sucata: 5400, raridade: "comum", cor: "#d8dce0",
    desc: "Motor AP aguenta desaforo. É o carro mais usado pra montar kit turbo básico de rua." },
  { id: "chevette", nome: "Chevette SL 1.6", ano: 1986, categoria: "Sedã", tracao: "T", cv: 73, torque: 12.6, peso: 890, preco: 14000, sucata: 3900, raridade: "comum", cor: "#b6342a",
    desc: "Leve e tração traseira. Com diferencial blocante e um pouco de fôlego já sai de lado em qualquer esquina." },
  { id: "fusca", nome: "Fusca 1300", ano: 1978, categoria: "Clássico", tracao: "T", cv: 46, torque: 9.1, peso: 800, preco: 9000, sucata: 2400, raridade: "comum", cor: "#3d87c4",
    desc: "Manutenção barata e mecânica a ar simples. Bom primeiro projeto pra tirar do ferro-velho." },
  { id: "uno", nome: "Uno Mille EP", ano: 1996, categoria: "Popular", tracao: "D", cv: 58, torque: 8.3, peso: 795, preco: 10200, sucata: 2800, raridade: "comum", cor: "#26854c",
    desc: "Gasta quase nada e passa em qualquer buraco. Ideal pra juntar grana nas entregas." },
  { id: "corsa", nome: "Corsa Wind 1.0", ano: 1998, categoria: "Popular", tracao: "D", cv: 60, torque: 8.3, peso: 845, preco: 11800, sucata: 3300, raridade: "comum", cor: "#7a2638",
    desc: "Direto pro dia a dia. Muita gente compra barato pra fazer swap de motor 2.0 depois." },
  { id: "opala", nome: "Opala Diplomata 4.1", ano: 1988, categoria: "Clássico", tracao: "T", cv: 138, torque: 29.2, peso: 1260, preco: 44000, sucata: 13000, raridade: "raro", cor: "#1f2124",
    desc: "Seis cilindros em linha com torque desde baixa. Pede pista reta e pneu largo atrás." },
  { id: "omega", nome: "Omega CD 3.0", ano: 1994, categoria: "Sedã", tracao: "T", cv: 165, torque: 23.4, peso: 1420, preco: 49000, sucata: 14500, raridade: "raro", cor: "#2b3d54",
    desc: "Pesado, confortável e comprido de final. Na rodovia busca quase tudo." },
  { id: "saveiro", nome: "Saveiro CL 1.6", ano: 1995, categoria: "Utilitário", tracao: "D", cv: 82, torque: 13.4, peso: 930, preco: 21000, sucata: 6000, raridade: "incomum", cor: "#e2b227",
    desc: "Caçamba leve que leva peça de motor, pneu reserva e frete rápido pela cidade." },
  { id: "kombi", nome: "Kombi Furgão 1600", ano: 1989, categoria: "Utilitário", tracao: "T", cv: 58, torque: 11.6, peso: 1160, preco: 15500, sucata: 4200, raridade: "comum", cor: "#ecebe6",
    desc: "Lenta na subida, mas leva o dobro de carga por viagem. Paga a oficina inteira se tiver paciência." },
  { id: "d20", nome: "D-20 Custom S", ano: 1992, categoria: "Utilitário", tracao: "T", cv: 120, torque: 37.5, peso: 1940, preco: 46000, sucata: 13800, raridade: "raro", cor: "#2c343d",
    desc: "Turbodiesel feita pra puxar reboque pesado e atravessar estrada de terra sem reclamar." },
  { id: "maverick", nome: "Maverick GT V8", ano: 1975, categoria: "Clássico", tracao: "T", cv: 197, torque: 39.5, peso: 1340, preco: 72000, sucata: 23000, raridade: "lendario", cor: "#d4631c",
    desc: "302 V8 difícil de aparecer no desmanche. Peça cara, consumo alto e arrancada bruta." },
];

const PECAS = {
  motor: {
    nome: "Preparação interna",
    opcoes: [
      { id: "orig", nome: "Bloco original", preco: 0, cvMult: 1, torqueMult: 1 },
      { id: "retifica", nome: "Retífica + taxa", preco: 3500, cvMult: 1.08, torqueMult: 1.06 },
      { id: "comando", nome: "Comando + cabeçote trabalhado", preco: 7800, cvMult: 1.22, torqueMult: 1.13 },
      { id: "forjado", nome: "Pistão e biela forjados", preco: 18500, cvMult: 1.46, torqueMult: 1.32 },
    ],
  },
  inducao: {
    nome: "Alimentação / Indução",
    opcoes: [
      { id: "aspirado", nome: "Original", preco: 0, cvMult: 1, torqueMult: 1 },
      { id: "injetec", nome: "Injeção programável + corpos", preco: 4200, cvMult: 1.14, torqueMult: 1.09 },
      { id: "turbo-p", nome: "Kit turbo padaria (0,8 bar)", preco: 9200, cvMult: 1.38, torqueMult: 1.42 },
      { id: "turbo-g", nome: "Turbina roletada + intercooler", preco: 17000, cvMult: 1.78, torqueMult: 1.72 },
      { id: "blower", nome: "Compressor mecânico", preco: 21500, cvMult: 1.66, torqueMult: 1.86 },
    ],
  },
  cambio: {
    nome: "Câmbio e diferencial",
    opcoes: [
      { id: "orig", nome: "Original", preco: 0, vmaxMult: 1, acelMult: 1 },
      { id: "5m", nome: "5 marchas alongado", preco: 4000, vmaxMult: 1.08, acelMult: 0.98 },
      { id: "curto", nome: "Relação curta + blocante", preco: 6400, vmaxMult: 0.92, acelMult: 0.88 },
      { id: "forjado-ret", nome: "Engrenagens retas (sapinho)", preco: 15500, vmaxMult: 1.09, acelMult: 0.85 },
    ],
  },
  pneus: {
    nome: "Pneus e rodas",
    opcoes: [
      { id: "orig", nome: "Radial de rua", preco: 0, grip: 0 },
      { id: "semi", nome: "Semi-slick", preco: 2600, grip: 0.06 },
      { id: "drag", nome: "Hoosier / Drag radial", preco: 5600, grip: 0.12 },
      { id: "lameiro", nome: "Pneu biscoito (terra)", preco: 3100, grip: -0.03, offroad: true },
    ],
  },
  suspensao: {
    nome: "Suspensão",
    opcoes: [
      { id: "orig", nome: "Original", preco: 0, grip: 0 },
      { id: "fixa", nome: "Fixa preparada", preco: 1900, grip: 0.03 },
      { id: "rosca", nome: "Rosca slim", preco: 6200, grip: 0.07 },
      { id: "lift", nome: "Calço + amortecedor longo", preco: 5200, grip: -0.02, offroad: true },
    ],
  },
  peso: {
    nome: "Alívio de peso",
    opcoes: [
      { id: "orig", nome: "Interior completo", preco: 0, peso: 0 },
      { id: "bancos", nome: "Sem banco traseiro + concha", preco: 1500, peso: -45 },
      { id: "fibra", nome: "Capô e tampa de fibra", preco: 5800, peso: -105 },
      { id: "gaiola", nome: "Aliviado de pista + santo antônio", preco: 9800, peso: -165 },
    ],
  },
};

const NOTICIAS = [
  { data: "2026-11-26", tag: "Correção", titulo: "Patch de correções — Alpha",
    texto: "Ajustes de estabilidade nos servidores de 15 jogadores, correção de colisão nas oficinas e preparação da base para o Beta de dezembro.",
    itens: ["Correções gerais de física e salvamento", "Servidor ajustado para até 15 jogadores", "Beta marcado para 18/12/2026"] },
  { data: "2026-09-06", tag: "Atualização", titulo: "Abertura do Alpha público",
    texto: "Primeira versão jogável aberta ao público pra testar mecânica, mapa, compra de peças na Injetec Motores e rodagem na cidade.",
    itens: ["Mapa inicial liberado", "Loja de peças e preparação", "Canal de bugs aberto no Discord da comunidade"] },
];

const CODIGOS = [
  // Adicione aqui quando saírem códigos novos no Discord.
  // Exemplo: { codigo: "BETA1812", recompensa: "R$ 5.000", ativo: true, expira: "2026-12-31" }
];

const MAPA_LOCAIS = [
  { nome: "Injetec Motores", tipo: "oficina", x: 50, y: 47, info: "Peças, motores, acessórios e acerto de injeção eletrônica." },
  { nome: "Oficina do Bairro", tipo: "oficina", x: 24, y: 69, info: "Elevador livre pra mexer em suspensão, freio e troca rápida." },
  { nome: "Ferro-Velho da BR", tipo: "ferrovelho", x: 79, y: 71, info: "Carcaças e carros batidos pra puxar no guincho e restaurar." },
  { nome: "Desmanche da Serra", tipo: "ferrovelho", x: 15, y: 23, info: "Peça usada mais em conta e chance de achar carro antigo raro." },
  { nome: "Posto da Rodovia", tipo: "posto", x: 65, y: 31, info: "Abastecimento, calibragem e ponto onde o pessoal encosta à noite." },
  { nome: "Posto Central", tipo: "posto", x: 39, y: 58, info: "Gasolina, etanol e conveniência no meio da cidade." },
  { nome: "Depósito de Entregas", tipo: "trabalho", x: 71, y: 53, info: "Pega frete leve e médio pra levantar dinheiro limpo." },
  { nome: "Pátio do Guincho", tipo: "trabalho", x: 31, y: 39, info: "Serviço de reboque de carro quebrado pelo mapa." },
  { nome: "Reta dos 402m", tipo: "corrida", x: 86, y: 18, info: "Arrancada com pinheirinho e marcação de tempo." },
  { nome: "Subida da Serra", tipo: "corrida", x: 20, y: 49, info: "Trecho travado de asfalto pra testar freio e suspensão." },
  { nome: "Estrada do Barro", tipo: "trilha", x: 9, y: 84, info: "Atola carro baixo. Melhor ir de caminhonete ou pneu alto." },
  { nome: "Garagem Seminovos", tipo: "loja", x: 55, y: 66, info: "Compra e venda de carros rodando." },
];

const MAPA_TIPOS = {
  oficina:    { nome: "Oficinas",      cor: "#f2c200" },
  ferrovelho: { nome: "Ferro-velhos",  cor: "#b57c4a" },
  posto:      { nome: "Postos",        cor: "#1f9d55" },
  trabalho:   { nome: "Trabalhos",     cor: "#3b82c4" },
  corrida:    { nome: "Pistas",        cor: "#d64535" },
  trilha:     { nome: "Terra",         cor: "#7cb342" },
  loja:       { nome: "Concessionária",cor: "#9b6bc4" },
};

/*
  Ranking — enquanto o jogo está em Alpha sem webhook externo, fica marcado como prévia.
*/
const RANKING_DEMO = true;
const RANKING = {
  arrancada: {
    titulo: "402m (Arrancada)", unidade: "s", menorMelhor: true,
    dados: [
      { jogador: "Davigrandao02", carro: "Maverick GT V8", valor: 10.72 },
      { jogador: "kaue_ap20", carro: "Gol GL 1.8 AP", valor: 11.18 },
      { jogador: "injetec_br", carro: "Astra Hatch 2.0", valor: 11.45 },
      { jogador: "seis_caneco", carro: "Opala Diplomata 4.1", valor: 11.89 },
      { jogador: "chevas_sl", carro: "Chevette SL 1.6", valor: 12.64 },
    ],
  },
  serra: {
    titulo: "Subida da Serra", unidade: "volta", menorMelhor: true,
    dados: [
      { jogador: "injetec_br", carro: "Astra Hatch 2.0", valor: 81.90 },
      { jogador: "chevas_sl", carro: "Chevette SL 1.6", valor: 83.14 },
      { jogador: "kaue_ap20", carro: "Gol GL 1.8 AP", valor: 84.02 },
      { jogador: "omega_cd94", carro: "Omega CD 3.0", valor: 86.55 },
    ],
  },
  entregas: {
    titulo: "Fretes concluídos", unidade: "entregas", menorMelhor: false,
    dados: [
      { jogador: "firma_mille", carro: "Uno Mille EP", valor: 184 },
      { jogador: "kombi_frete", carro: "Kombi Furgão 1600", valor: 152 },
      { jogador: "d20_diesel", carro: "D-20 Custom S", valor: 119 },
      { jogador: "sava_cl", carro: "Saveiro CL 1.6", valor: 94 },
    ],
  },
};
