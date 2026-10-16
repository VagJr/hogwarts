'use strict';

const crypto = require('crypto');
const CONTENT = require('./content');

const TOKEN_TTL_MS = 1000 * 60 * 60 * 24 * 30;
const API_WINDOW_MS = 60_000;
const LOGIN_WINDOW_MS = 5 * 60_000;
const API_MAX = 180;
const LOGIN_MAX = 12;

function clamp(n, min, max) {
  n = Number(n);
  if (!Number.isFinite(n)) return min;
  return Math.max(min, Math.min(max, n));
}

function todayKey() {
  return new Date().toISOString().slice(0, 10);
}

function cleanText(value, max = 500) {
  return String(value ?? '')
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '')
    .replace(/[<>]/g, '')
    .slice(0, max);
}

function cleanName(value) {
  return cleanText(value, 36)
    .replace(/[^\p{L}\p{N}\s'’_-]/gu, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function stripSecrets(value, seen = new WeakSet()) {
  if (value === null || value === undefined) return value;
  if (typeof value !== 'object') return value;
  if (seen.has(value)) return null;
  seen.add(value);

  if (Array.isArray(value)) return value.map(v => stripSecrets(v, seen));

  const out = {};
  for (const [key, val] of Object.entries(value)) {
    if (['senhaHash', 'senhaHashV2', 'senhaSalt', 'password', 'passwordHash'].includes(key)) continue;
    out[key] = stripSecrets(val, seen);
  }
  return out;
}

function ensureBank(aluno) {
  if (!aluno) return;
  if (typeof aluno.cofreGringotes === 'number') {
    aluno.cofreGringotes = { galeoes: Math.max(0, Math.floor(aluno.cofreGringotes)), siclos: 0, nuques: 0 };
  }
  if (!aluno.cofreGringotes || typeof aluno.cofreGringotes !== 'object') {
    aluno.cofreGringotes = { galeoes: 0, siclos: 0, nuques: 0 };
  }
  for (const moeda of ['galeoes', 'siclos', 'nuques']) {
    aluno.cofreGringotes[moeda] = Math.max(0, Math.floor(Number(aluno.cofreGringotes[moeda]) || 0));
    aluno[moeda] = Math.max(0, Math.floor(Number(aluno[moeda]) || 0));
  }
}

function normalizeAluno(core, aluno, { initial = false } = {}) {
  if (!aluno) return aluno;
  ensureBank(aluno);

  aluno.atributosRPG ||= { intelecto: 5, destreza: 5, vigor: 5, percepcao: 5, pontosLivres: 0 };
  aluno.atributosRPG.pontosLivres = Math.max(0, Math.floor(Number(aluno.atributosRPG.pontosLivres) || 0));
  aluno.estatisticas ||= { duelosVencidos: 0, monstrosMortos: 0 };
  aluno.elos ||= { duelos: 1000, quadribol: 1000, baile: 1000, quiz: 1000, pocoes: 1000, sabedoria: 1000 };
  aluno.inventario ||= { livros: [], ingredientes: {}, materiais: [] };
  aluno.inventario.livros ||= [];
  aluno.inventario.ingredientes ||= {};
  aluno.inventario.materiais ||= [];
  aluno.mochilaEscolar ||= [];
  aluno.maestriaFeiticos ||= {};
  aluno.feitiçosEquipados ||= [];
  aluno.equipamentos ||= { varinha: null, cabeca: null, corpo: null, pescoco: null };
  aluno.v1 ||= {};
  aluno.v1.schema = 1;

  try { core._obterAtributosTotais(aluno); } catch (_) {}

  aluno.hpMax = Math.max(1, Math.floor(Number(aluno.hpMax) || 1000));
  aluno.maxFoco = Math.max(1, Math.floor(Number(aluno.maxFoco) || 10));
  if (initial || !aluno.v1.initialized) {
    aluno.hpAtual = aluno.hpMax;
    aluno.focoAtual = aluno.maxFoco;
    aluno.v1.initialized = true;
  } else {
    aluno.hpAtual = clamp(aluno.hpAtual, 0, aluno.hpMax);
    aluno.focoAtual = clamp(aluno.focoAtual, 0, aluno.maxFoco);
  }
  aluno.fome = clamp(aluno.fome ?? 100, 0, 100);
  aluno.energia = clamp(aluno.energia ?? 100, 0, 100);

  return aluno;
}

function tokenSecret() {
  const explicit = process.env.SESSION_SECRET;
  if (explicit && explicit.length >= 24) return explicit;
  const fallback = process.env.MONGO_URI || 'hogwarts-v1-local-dev-secret-change-me';
  return crypto.createHash('sha256').update(fallback).digest('hex');
}

function issueToken(playerId) {
  const payload = {
    sub: playerId,
    exp: Date.now() + TOKEN_TTL_MS,
    iat: Date.now(),
    v: 1
  };
  const encoded = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const sig = crypto.createHmac('sha256', tokenSecret()).update(encoded).digest('base64url');
  return `${encoded}.${sig}`;
}

function verifyToken(token) {
  if (!token || typeof token !== 'string' || !token.includes('.')) return null;
  const [encoded, sig] = token.split('.');
  if (!encoded || !sig) return null;
  const expected = crypto.createHmac('sha256', tokenSecret()).update(encoded).digest('base64url');
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null;
  try {
    const payload = JSON.parse(Buffer.from(encoded, 'base64url').toString('utf8'));
    if (!payload.sub || !payload.exp || payload.exp < Date.now()) return null;
    return payload.sub;
  } catch (_) {
    return null;
  }
}

function getTokenFromRequest(req) {
  const auth = String(req.headers.authorization || '');
  if (auth.startsWith('Bearer ')) return auth.slice(7);
  return String(req.headers['x-hogwarts-session'] || '');
}

function createLimiter(windowMs, max) {
  const buckets = new Map();
  return (key) => {
    const now = Date.now();
    let b = buckets.get(key);
    if (!b || now - b.start >= windowMs) b = { start: now, count: 0 };
    b.count++;
    buckets.set(key, b);
    return b.count <= max;
  };
}

function installSecurity({ app, core }) {
  const apiLimiter = createLimiter(API_WINDOW_MS, API_MAX);
  const loginLimiter = createLimiter(LOGIN_WINDOW_MS, LOGIN_MAX);

  app.use('/api', (req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('Referrer-Policy', 'same-origin');
    res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
    res.setHeader('Cache-Control', 'no-store');

    const ip = req.ip || req.socket?.remoteAddress || 'unknown';
    const isRegister = req.path === '/registrar';
    if (!(isRegister ? loginLimiter(ip) : apiLimiter(ip))) {
      return res.status(429).json({ erro: 'Muitas ações em pouco tempo. Aguarda alguns instantes.' });
    }

    const originalJson = res.json.bind(res);
    res.json = (payload) => {
      let safe = stripSecrets(payload);
      if (isRegister && safe && safe.sucesso && safe.aluno?.id) {
        safe.sessionToken = issueToken(safe.aluno.id);
      }
      return originalJson(safe);
    };

    if (isRegister) {
      req.body ||= {};
      req.body.nomeBruxo = cleanName(req.body.nomeBruxo);
      req.body.username = cleanText(req.body.username || req.body.nomeBruxo, 40);
      req.body.senha = String(req.body.senha || '');
      if (req.body.nomeBruxo.length < 2) return res.status(400).json({ erro: 'O nome do bruxo é muito curto.' });
      if (req.body.senha.length < 6 || req.body.senha.length > 128) {
        return res.status(400).json({ erro: 'A senha precisa ter entre 6 e 128 caracteres.' });
      }
      return next();
    }

    if (req.path === '/ping') return next();

    const playerId = verifyToken(getTokenFromRequest(req));
    if (!playerId || !core.alunos[playerId]) {
      return res.status(401).json({ erro: 'Sessão expirada. Assina novamente o pergaminho de Hogwarts.', codigo: 'AUTH_REQUIRED' });
    }

    req.playerId = playerId;
    if (req.body && typeof req.body === 'object') {
      for (const key of ['id', 'alunoId', 'jogadorId', 'atacanteId', 'remetenteId']) {
        if (key in req.body || key === 'id') req.body[key] = playerId;
      }
    }
    try {
      if (req.query && ('id' in req.query)) req.query.id = playerId;
    } catch (_) {}

    next();
  });
}

function installSocketAuthority({ io, core }) {
  io.on('connection', (socket) => {
    socket.v1PlayerId = null;

    socket.use((packet, next) => {
      try {
        const event = packet[0];
        let data = packet[1];
        if (!data || typeof data !== 'object' || Array.isArray(data)) {
          data = {};
          packet[1] = data;
        }

        if (event === 'entrar_chat' || !socket.v1PlayerId) {
          const token = data.token || socket.handshake?.auth?.token || '';
          const playerId = verifyToken(token);
          if (!playerId || !core.alunos[playerId]) return next(new Error('AUTH_REQUIRED'));
          socket.v1PlayerId = playerId;
          socket.alunoId = playerId;
        }

        const playerId = socket.v1PlayerId;
        const aluno = core.alunos[playerId];
        if (!aluno) return next(new Error('AUTH_REQUIRED'));

        for (const key of ['id', 'idAluno', 'alunoId', 'jogadorId', 'atacanteId', 'remetenteId']) {
          if (key in data || key === 'idAluno' && event === 'entrar_chat') data[key] = playerId;
        }

        if (event === 'entrar_chat') {
          data.idAluno = playerId;
          data.casa = aluno.casa || 'Nenhuma';
        }

        if (event === 'mensagem_chat') {
          data.remetenteNome = aluno.nome;
          data.remetenteCasa = aluno.casa || 'Nenhuma';
          data.texto = cleanText(data.texto, 500);
          data.canal = ['mundo', 'zona', 'grupo', 'gremio', 'aula'].includes(data.canal) ? data.canal : 'mundo';
        }

        if (event === 'admin_comando') {
          if (!process.env.ADMIN_PLAYER_ID || playerId !== process.env.ADMIN_PLAYER_ID) {
            return next(new Error('ADMIN_REQUIRED'));
          }
          // Compatibilidade com o handler legado; a autorização real já ocorreu acima.
          data.adminId = 'BRX_9AC7F35224';
        }

        for (const key of ['acao', 'texto', 'zona', 'tipo', 'nome']) {
          if (typeof data[key] === 'string') data[key] = cleanText(data[key], key === 'texto' ? 500 : 120);
        }

        next();
      } catch (_) {
        next(new Error('INVALID_PACKET'));
      }
    });

    socket.on('disconnect', () => {
      if (socket.v1PlayerId && core.alunos[socket.v1PlayerId]) {
        core.alunos[socket.v1PlayerId].v1 ||= {};
        core.alunos[socket.v1PlayerId].v1.lastSeenAt = Date.now();
      }
    });
  });
}

function installProgression(core) {
  const originalGain = core.ganharXp.bind(core);
  core.ganharXp = function v1GanharXp(aluno, valor) {
    normalizeAluno(core, aluno);
    const before = Number(aluno.nivel) || 1;
    const result = originalGain(aluno, Math.max(0, Math.floor(Number(valor) || 0)));
    const after = Number(aluno.nivel) || before;
    if (after > before) {
      const gained = after - before;
      aluno.atributosRPG ||= { intelecto: 5, destreza: 5, vigor: 5, percepcao: 5, pontosLivres: 0 };
      let bonus = 0;
      for (let lvl = before + 1; lvl <= after; lvl++) bonus += (lvl % 5 === 0 ? 2 : 1);
      aluno.atributosRPG.pontosLivres = (aluno.atributosRPG.pontosLivres || 0) + bonus;
      try { core._obterAtributosTotais(aluno); } catch (_) {}
      aluno.hpAtual = aluno.hpMax;
      aluno.focoAtual = aluno.maxFoco;
      aluno.v1 ||= {};
      aluno.v1.lastLevelUp = { at: Date.now(), from: before, to: after, points: bonus };
    }
    return result;
  };
}

function installEconomy(core) {
  const originalGringotes = typeof core.acaoGringotes === 'function' ? core.acaoGringotes.bind(core) : null;

  if (originalGringotes) {
    core.acaoGringotes = function v1Gringotes(id, acao, valor, moeda = 'galeoes') {
      const a = core.alunos[id];
      if (!a) return { erro: 'Bruxo inexistente.' };
      normalizeAluno(core, a);
      if (!['galeoes', 'siclos', 'nuques'].includes(moeda)) return { erro: 'Moeda inválida.' };
      return originalGringotes(id, acao, valor, moeda);
    };
  }

  core.comprarItemMercado = function v1ComprarMercado(alunoId, ofertaId) {
    const comprador = core.alunos[alunoId];
    if (!comprador) return { erro: 'Bruxo inexistente.' };
    normalizeAluno(core, comprador);

    core.mercadoJogadores ||= [];
    const idx = core.mercadoJogadores.findIndex(o => o.id === ofertaId);
    if (idx < 0) return { erro: 'A oferta já não existe.' };

    const oferta = core.mercadoJogadores[idx];
    if (oferta.vendedorId === comprador.id) return { erro: 'Não podes comprar a tua própria oferta.' };

    const preco = Math.max(1, Math.floor(Number(oferta.preco) || 0));
    if (comprador.galeoes < preco) return { erro: 'Galeões insuficientes.' };

    const item = oferta.item;
    if (!item) return { erro: 'A coruja perdeu o pacote. Oferta inválida.' };

    comprador.galeoes -= preco;
    const tipo = oferta.tipo || item.tipo;

    if (tipo === 'mobilia') {
      comprador.inventario.mobilia ||= [];
      comprador.inventario.mobilia.push({ ...item, id: `movel_${crypto.randomBytes(4).toString('hex')}`, equipado: false });
    } else {
      comprador.mochilaEscolar.push({ ...item, id: crypto.randomBytes(4).toString('hex') });
    }

    let vendedorIdRefresh = null;
    const vendedor = core.alunos[oferta.vendedorId];
    if (vendedor) {
      normalizeAluno(core, vendedor);
      vendedor.cofreGringotes.galeoes += preco;
      vendedorIdRefresh = vendedor.id;
      global.io?.to(`priv_${vendedor.id}`).emit('nova_mensagem', {
        canal: 'zona',
        autor: '🦉 [Correio Coruja]',
        texto: `Venda concluída. ${preco} Galeões foram depositados no teu cofre.`
      });
    }

    core.mercadoJogadores.splice(idx, 1);
    core._salvarBancoDeDados?.();
    return { sucesso: true, msg: `Compraste [${item.nome}] por ${preco} G.`, vendedorId: vendedorIdRefresh };
  };

  core.gerarVarinhaOllivanders = async function v1Ollivanders(alunoId, tracoPersonalidade) {
    const a = core.alunos[alunoId];
    if (!a) return { erro: 'Bruxo inexistente.' };
    normalizeAluno(core, a);

    const custoSiclos = 47;
    if (a.siclos < custoSiclos) return { erro: `O teste e vínculo da varinha custam ${custoSiclos} Sicles.` };
    if (a.equipamentos.varinha) return { erro: 'Já tens uma varinha vinculada.' };

    let varinhaUnica = null;
    try { varinhaUnica = await core.cerebroIA.forjarVarinhaUnica(a.nome, cleanText(tracoPersonalidade, 300)); } catch (_) {}
    if (!varinhaUnica?.nome) {
      try {
        const { Ollivanders } = require('../HogwartsCore.js');
        varinhaUnica = Ollivanders.forjarVarinhaDestinada(a.nome);
      } catch (_) {
        varinhaUnica = { nome: 'Varinha de Teixo', afinidade: 'feiticos', poderBase: 15 };
      }
    }

    a.siclos -= custoSiclos;
    a.equipamentos.varinha = {
      id: `var_${crypto.randomBytes(4).toString('hex')}`,
      nome: cleanText(varinhaUnica.nome, 80),
      madeira_nucleo: `${cleanText(varinhaUnica.comprimento || '11 pol', 30)} | ${cleanText(varinhaUnica.nucleo || 'Misterioso', 80)}`,
      afinidade: ['feiticos', 'defesa', 'pocoes', 'transfiguracao', 'furtividade', 'artes_trevas'].includes(varinhaUnica.afinidade) ? varinhaUnica.afinidade : 'feiticos',
      poderBase: clamp(varinhaUnica.poderBase || 15, 8, 40),
      lore: cleanText(varinhaUnica.lore || 'A varinha escolheu o seu bruxo.', 500),
      lealdade: 0,
      visual: varinhaUnica.visual || { corMadeira: '#5c4033', corAura: '#fff', corCabo: '#111', estilo: 'reta' }
    };

    try { core._verificarAvancoBeco(a); } catch (_) {}
    core._salvarBancoDeDados?.();
    return { sucesso: true, varinha: a.equipamentos.varinha, custo: { siclos: custoSiclos } };
  };
}

function installExploration(core) {
  core.procurarSegredo = async function v1ProcurarSegredo(alunoId, zona) {
    const a = core.alunos[alunoId];
    if (!a) return { erro: 'Bruxo inexistente.' };
    normalizeAluno(core, a);
    if (a.focoAtual < 1) return { erro: 'Precisas de 1 de Foco.' };

    a.focoAtual -= 1;
    const furtividade = Number(a.atributosTotais?.furtividade) || 10;
    const percepcao = Number(a.atributosRPG?.percepcao) || 5;
    const chance = clamp(0.12 + furtividade / 250 + percepcao / 200, 0.12, 0.68);

    if (Math.random() >= chance) {
      core._salvarBancoDeDados?.();
      return { sucesso: true, encontrou: false, msg: 'Exploraste o local, mas o castelo não revelou nenhum segredo desta vez.' };
    }

    let segredo = null;
    try { segredo = await core.cerebroIA.investigarSegredo(cleanText(zona, 80)); } catch (_) {}
    segredo ||= { lore: 'Encontraste um detalhe antigo gravado na pedra.', gold: 0, item: null };

    const gold = clamp(segredo.gold || 0, 0, 60);
    a.galeoes += gold;
    if (segredo.item) {
      a.mochilaEscolar.push({
        id: crypto.randomBytes(4).toString('hex'),
        nome: cleanText(segredo.item, 100),
        tipo: 'reliquia'
      });
    }

    core._salvarBancoDeDados?.();
    return { sucesso: true, encontrou: true, msg: cleanText(segredo.lore || 'Segredo encontrado.', 800), gold };
  };
}

function installWorldBoss(core) {
  core.atacarWorldBossGlobal = function v1WorldBoss(alunoId) {
    const a = core.alunos[alunoId];
    if (!a || !core.worldBoss?.ativo) return { erro: 'Não há ameaça global ativa.' };
    normalizeAluno(core, a);
    if (!a.feitiçosEquipados || a.feitiçosEquipados.length !== 6) return { erro: 'Equipa exatamente 6 feitiços.' };
    if (a.focoAtual < 2) return { erro: 'Precisas de 2 de Foco.' };

    a.focoAtual -= 2;
    const dano = Math.max(1, Math.floor((core._obterAtributosTotais(a).feiticos || 10) * 10 + a.nivel * 5));
    core.worldBoss.hpAtual = Math.max(0, Number(core.worldBoss.hpAtual || 0) - dano);

    global.io?.emit('nova_mensagem', {
      canal: 'zona',
      autor: '⚔️ BATALHA GLOBAL',
      texto: `${a.nome} causou ${dano} de dano em ${core.worldBoss.nome}.`
    });

    if (core.worldBoss.hpAtual <= 0) {
      core.worldBoss.ativo = false;
      a.nuques += 50;
      a.siclos += 5;
      a.galeoes += 25;
      core.ganharXp(a, 750);
      global.io?.emit('nova_mensagem', {
        canal: 'salaoPrincipal',
        autor: '🏆 VITÓRIA GLOBAL',
        texto: `${core.worldBoss.nome} foi derrotado. O golpe final foi de ${a.nome}.`
      });
    }

    core._salvarBancoDeDados?.();
    return { sucesso: true, msg: `Causaste ${dano} de dano.`, hpBoss: core.worldBoss.hpAtual };
  };
}

function installCombatAuthority(core) {
  if (typeof core.processarAcaoPvP === 'function') {
    const oldPvp = core.processarAcaoPvP.bind(core);
    core.processarAcaoPvP = function v1Pvp(atacanteId, instId, feiticoId, ioGlobal) {
      const partida = core.pvpPartidas?.[instId];
      if (!partida || ![partida.p1?.id, partida.p2?.id].includes(atacanteId)) return { erro: 'Não pertences a este duelo.' };

      const a = core.alunos[atacanteId];
      if (!a) return { erro: 'Bruxo inexistente.' };
      normalizeAluno(core, a);

      const special = ['dano_recebido', 'protego_block_reflex'].includes(feiticoId);
      const f = special ? null : core.livroDeFeiticos?.[feiticoId];
      let spent = 0;

      if (!special) {
        if (!f) return { erro: 'Feitiço desconhecido.' };
        if (!a.feitiçosEquipados?.includes(feiticoId)) return { erro: 'Esse feitiço não está no teu Grimório de Combate.' };
        const custo = Math.max(0, Math.floor(Number(f.custoFocoBase) || 0));
        if (a.focoAtual < custo) return { erro: `Foco insuficiente (${custo}).` };

        a.v1 ||= {};
        a.v1.cooldowns ||= {};
        const readyAt = Number(a.v1.cooldowns[feiticoId]) || 0;
        if (readyAt > Date.now()) return { erro: 'A varinha ainda está a recuperar desta conjuração.' };

        spent = custo;
        a.focoAtual -= custo;
        a.v1.cooldowns[feiticoId] = Date.now() + Math.max(300, Number(f.tempoCasting) || 500);
      }

      const target = partida.p1.id === atacanteId ? partida.p2 : partida.p1;
      const result = oldPvp(atacanteId, instId, feiticoId, ioGlobal);

      if (result?.erro && spent) {
        a.focoAtual = Math.min(a.maxFoco, a.focoAtual + spent);
        if (a.v1?.cooldowns) delete a.v1.cooldowns[feiticoId];
      } else if (f?.efeitoSecundario && target?.efeitos) {
        const effect = target.efeitos.find(e => e.tipo === f.efeitoSecundario);
        if (effect) {
          effect.duracao = Number(f.duracao) || 1.2;
          effect.expiresAt = Date.now() + effect.duracao * 1000;
        }
      }

      return result;
    };
  }

  if (typeof core.processarActionCombat === 'function') {
    const oldPve = core.processarActionCombat.bind(core);
    core.processarActionCombat = async function v1Pve(atacanteId, instId, feiticoId, alvoIdx = 0) {
      const inst = core.dungeonInstancias?.[instId];
      const a = core.alunos[atacanteId];
      if (!inst || !a) return { erro: 'Combate inexistente.' };
      if (Array.isArray(inst.membros) && !inst.membros.includes(atacanteId)) return { erro: 'Não pertences a esta instância.' };
      normalizeAluno(core, a);

      const special = ['dano_recebido', 'protego_block_reflex'].includes(feiticoId);
      const f = special ? null : core.livroDeFeiticos?.[feiticoId];
      let spent = 0;

      if (!special) {
        if (!f) return { erro: 'Feitiço desconhecido.' };
        if (!a.feitiçosEquipados?.includes(feiticoId)) return { erro: 'Esse feitiço não está equipado.' };
        const custo = Math.max(0, Math.floor(Number(f.custoFocoBase) || 0));
        if (a.focoAtual < custo) return { erro: `Foco insuficiente (${custo}).` };

        a.v1 ||= {};
        a.v1.cooldowns ||= {};
        const readyAt = Number(a.v1.cooldowns[feiticoId]) || 0;
        if (readyAt > Date.now()) return { erro: 'O feitiço ainda está em recarga.' };

        spent = custo;
        a.focoAtual -= custo;
        a.v1.cooldowns[feiticoId] = Date.now() + Math.max(300, Number(f.tempoCasting) || 500);
      }

      const result = await oldPve(atacanteId, instId, feiticoId, alvoIdx);

      if (result?.erro && spent) {
        a.focoAtual = Math.min(a.maxFoco, a.focoAtual + spent);
        if (a.v1?.cooldowns) delete a.v1.cooldowns[feiticoId];
      } else if (f?.efeitoSecundario) {
        const target = inst.entidades?.find(m => m.idx === alvoIdx && m.vivo) || inst.entidades?.find(m => m.vivo) || inst.entidades?.[0];
        const effect = target?.efeitos?.find(e => e.tipo === f.efeitoSecundario);
        if (effect) {
          effect.duracao = Number(f.duracao) || 1.2;
          effect.expiresAt = Date.now() + effect.duracao * 1000;
        }
      }

      return result;
    };
  }
}

function copyLifeState(a) {
  return {
    hpAtual: a.hpAtual,
    focoAtual: a.focoAtual,
    fome: a.fome,
    energia: a.energia,
    pet: a.pet ? JSON.parse(JSON.stringify(a.pet)) : a.pet,
    estufa: a.estufa ? JSON.parse(JSON.stringify(a.estufa)) : a.estufa
  };
}

function restoreLifeState(a, s) {
  a.hpAtual = s.hpAtual;
  a.focoAtual = s.focoAtual;
  a.fome = s.fome;
  a.energia = s.energia;
  a.pet = s.pet;
  a.estufa = s.estufa;
}

function applyLifeSimulation(core, a, online) {
  normalizeAluno(core, a);
  a.v1 ||= {};
  const now = Date.now();

  const lastLife = Number(a.v1.lastLifeAt) || now;
  const elapsedMin = Math.min(15, Math.max(0, (now - lastLife) / 60000));
  a.v1.lastLifeAt = now;

  if (online && elapsedMin > 0) {
    a.fome = clamp(a.fome - elapsedMin / 3.2, 0, 100);
    a.energia = clamp(a.energia - elapsedMin / 4.2, 0, 100);

    if (a.fome > 20 && a.energia > 20) {
      a.focoAtual = clamp(a.focoAtual + elapsedMin * 0.35, 0, a.maxFoco);
      a.hpAtual = clamp(a.hpAtual + a.hpMax * 0.0015 * elapsedMin, 0, a.hpMax);
    } else if (a.fome <= 0 || a.energia <= 0) {
      a.hpAtual = clamp(a.hpAtual - a.hpMax * 0.0025 * elapsedMin, 1, a.hpMax);
    }

    if (a.pet?.adotado) {
      a.pet.fome = clamp((a.pet.fome ?? 100) - elapsedMin / 5, 0, 100);
      a.pet.felicidade = clamp((a.pet.felicidade ?? 100) - elapsedMin / 7, 0, 100);
    }
  }

  const lastGarden = Number(a.v1.lastGardenAt) || now;
  const gardenMin = Math.min(720, Math.max(0, (now - lastGarden) / 60000));
  a.v1.lastGardenAt = now;

  if (Array.isArray(a.estufa) && gardenMin >= 1) {
    for (const p of a.estufa) {
      if (!p?.plantada || p.morta || p.colhida) continue;
      p.agua = clamp(p.agua ?? 100, 0, 100);
      p.agua = clamp(p.agua - gardenMin / 20, 0, 100);
      if (p.agua <= 0) p.morta = true;
      if (!p.praga && Math.random() < Math.min(0.20, gardenMin / 720 * 0.20)) p.praga = true;
    }
  }

  const lastInterest = Number(a.v1.lastInterestAt) || now;
  if (now - lastInterest >= 24 * 60 * 60 * 1000) {
    const days = Math.min(7, Math.floor((now - lastInterest) / (24 * 60 * 60 * 1000)));
    const saldo = a.cofreGringotes.galeoes;
    if (saldo > 0 && days > 0) {
      const juros = Math.min(500, Math.max(1, Math.floor(saldo * 0.0005 * days)));
      a.cofreGringotes.galeoes += juros;
    }
    a.v1.lastInterestAt = now;
  }
}

function installLifeSimulation({ core, io }) {
  if (typeof core.tickServerGlobal !== 'function') return;
  const originalTick = core.tickServerGlobal.bind(core);

  core.tickServerGlobal = function v1Tick() {
    const snapshots = new Map();
    for (const [id, a] of Object.entries(core.alunos)) snapshots.set(id, copyLifeState(a));

    const result = originalTick();

    const onlineIds = new Set();
    for (const s of io.sockets.sockets.values()) {
      if (s.alunoId) onlineIds.add(s.alunoId);
      if (s.v1PlayerId) onlineIds.add(s.v1PlayerId);
    }

    for (const [id, a] of Object.entries(core.alunos)) {
      const snap = snapshots.get(id);
      if (snap) restoreLifeState(a, snap);
      applyLifeSimulation(core, a, onlineIds.has(id));
    }

    return result;
  };
}

function chooseObjective(a, relogio) {
  if (a.estadoJogo === 'BECO_DIAGONAL') return { icon: '🛍️', title: 'Preparar o primeiro ano', text: 'Conclui a lista escolar, visita Ollivanders e embarca no Expresso.' };
  if (a.estadoJogo !== 'CASTELO') return { icon: '✉️', title: 'Começar a jornada', text: 'Segue o fluxo de introdução até chegares a Hogwarts.' };
  if (relogio?.aulaAtiva && relogio.aulaAtiva !== 'Livre') return { icon: '🎓', title: `Aula: ${relogio.aulaAtiva}`, text: `Professor ${relogio.professorAtivo || 'de Hogwarts'} está em aula agora.` };
  if (!a.questAtiva) return { icon: '🔮', title: 'Procurar um novo fio do destino', text: 'Consulta o Oráculo e inicia uma aventura antes da próxima aula.' };
  if ((a.fome ?? 100) < 35) return { icon: '🍗', title: 'Recuperar energia', text: 'Passa pelo Salão ou usa comida antes de explorar.' };
  if ((a.focoAtual ?? 0) < Math.max(3, (a.maxFoco ?? 10) * 0.3)) return { icon: '🛏️', title: 'Recuperar Foco', text: 'Descansa, estuda com calma ou prepara-te antes de outro combate.' };
  return { icon: '🗺️', title: 'Viver Hogwarts', text: 'Explora o castelo, avança a tua missão, encontra colegas e contribui para a tua Casa.' };
}

function installV1Routes({ app, core, RelogioHogwarts }) {
  app.get('/api/v1/dashboard', (req, res) => {
    const a = core.alunos[req.playerId];
    normalizeAluno(core, a);

    let relogio = null;
    try { relogio = RelogioHogwarts?.obterHorarioAtual?.(a.anoLetivo || 1) || null; } catch (_) {}

    const objective = chooseObjective(a, relogio);
    const house = a.casa || 'Nenhuma';
    const houseScore = Number(core.pontuacaoCasas?.[house]) || 0;

    res.json({
      sucesso: true,
      dashboard: {
        player: {
          id: a.id, nome: a.nome, casa: house, nivel: a.nivel,
          hpAtual: a.hpAtual, hpMax: a.hpMax,
          focoAtual: a.focoAtual, maxFoco: a.maxFoco,
          galeoes: a.galeoes, energia: Math.round(a.energia), fome: Math.round(a.fome)
        },
        objective,
        relogio,
        houseScore,
        worldBoss: core.worldBoss?.ativo ? stripSecrets(core.worldBoss) : null,
        quest: a.questAtiva ? stripSecrets(a.questAtiva) : null,
        rhythms: CONTENT.rhythms,
        locations: CONTENT.locations
      }
    });
  });
}

function installDataNormalization(core) {
  const originalStatusHelpers = ['_obterAtributosTotais'];
  for (const a of Object.values(core.alunos || {})) normalizeAluno(core, a);

  const originalRegister = core.registrarNovaConta?.bind(core);
  if (originalRegister) {
    core.registrarNovaConta = function v1Register(...args) {
      const result = originalRegister(...args);
      if (result?.aluno) normalizeAluno(core, result.aluno, { initial: !result.aluno.v1?.initialized });
      return result;
    };
  }
}

function installHogwartsV1({ app, io, core, RelogioHogwarts }) {
  if (!app || !io || !core) throw new Error('Hogwarts V1: dependências ausentes.');
  if (core.__v1Installed) return;
  core.__v1Installed = true;

  if (!process.env.SESSION_SECRET) {
    console.warn('⚠️ [V1] SESSION_SECRET não configurado. Será derivado do ambiente. Configure-o em produção.');
  }

  installSecurity({ app, core });
  installSocketAuthority({ io, core });
  installDataNormalization(core);
  installProgression(core);
  installEconomy(core);
  installExploration(core);
  installWorldBoss(core);
  installCombatAuthority(core);
  installLifeSimulation({ core, io });
  installV1Routes({ app, core, RelogioHogwarts });

  setInterval(() => {
    try {
      for (const a of Object.values(core.alunos || {})) normalizeAluno(core, a);
    } catch (_) {}
  }, 60_000).unref?.();

  console.log('✨ [HOGWARTS V1] Runtime de produto instalado: segurança, economia, combate, vida e UX.');
}

module.exports = {
  installHogwartsV1,
  issueToken,
  verifyToken,
  normalizeAluno,
  stripSecrets
};
