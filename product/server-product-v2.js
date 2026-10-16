'use strict';

const crypto = require('crypto');

const SESSION_TTL = 1000 * 60 * 60 * 24 * 30;
const API_LIMIT_WINDOW = 60_000;
const API_LIMIT_MAX = 240;
const LOGIN_LIMIT_WINDOW = 5 * 60_000;
const LOGIN_LIMIT_MAX = 15;

function clamp(value, min, max) {
  const n = Number(value);
  return Number.isFinite(n) ? Math.max(min, Math.min(max, n)) : min;
}

function text(value, max = 500) {
  return String(value ?? '')
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '')
    .replace(/[<>]/g, '')
    .slice(0, max);
}

function cleanName(value) {
  return text(value, 40)
    .replace(/[^\p{L}\p{N}\s'’_-]/gu, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function publicClone(value, seen = new WeakSet()) {
  if (value === null || value === undefined) return value;
  if (typeof value !== 'object') return value;
  if (seen.has(value)) return null;
  seen.add(value);
  if (Array.isArray(value)) return value.map(v => publicClone(v, seen));

  const out = {};
  for (const [k, v] of Object.entries(value)) {
    if (['_id', 'senhaHash', 'senhaHashV2', 'senhaSalt', 'password', 'passwordHash'].includes(k)) continue;
    out[k] = publicClone(v, seen);
  }
  return out;
}

function sessionSecret() {
  const configured = process.env.SESSION_SECRET;
  if (configured && configured.length >= 32) return configured;
  return crypto.createHash('sha256')
    .update(String(process.env.MONGO_URI || 'hogwarts-product-v2-development-secret'))
    .digest('hex');
}

function issueToken(playerId) {
  const payload = {
    sub: playerId,
    exp: Date.now() + SESSION_TTL,
    iat: Date.now(),
    v: 2
  };
  const body = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const sig = crypto.createHmac('sha256', sessionSecret()).update(body).digest('base64url');
  return `${body}.${sig}`;
}

function verifyToken(token) {
  if (!token || typeof token !== 'string') return null;
  const parts = token.split('.');
  if (parts.length !== 2) return null;
  const [body, signature] = parts;
  const expected = crypto.createHmac('sha256', sessionSecret()).update(body).digest('base64url');
  const a = Buffer.from(signature);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null;

  try {
    const payload = JSON.parse(Buffer.from(body, 'base64url').toString('utf8'));
    if (!payload.sub || !payload.exp || payload.exp <= Date.now()) return null;
    return payload.sub;
  } catch (_) {
    return null;
  }
}

function requestToken(req) {
  const auth = String(req.headers.authorization || '');
  if (auth.startsWith('Bearer ')) return auth.slice(7);
  return String(req.headers['x-hogwarts-session'] || '');
}

function limiter(windowMs, max) {
  const buckets = new Map();
  return key => {
    const now = Date.now();
    let entry = buckets.get(key);
    if (!entry || now - entry.start >= windowMs) entry = { start: now, count: 0 };
    entry.count += 1;
    buckets.set(key, entry);

    if (buckets.size > 5000 && Math.random() < 0.02) {
      for (const [k, v] of buckets) {
        if (now - v.start > windowMs * 2) buckets.delete(k);
      }
    }
    return entry.count <= max;
  };
}

function ensureBank(a) {
  if (typeof a.cofreGringotes === 'number') {
    a.cofreGringotes = { galeoes: Math.max(0, Math.floor(a.cofreGringotes)), siclos: 0, nuques: 0 };
  }
  if (!a.cofreGringotes || typeof a.cofreGringotes !== 'object') {
    a.cofreGringotes = { galeoes: 0, siclos: 0, nuques: 0 };
  }
  for (const moeda of ['galeoes', 'siclos', 'nuques']) {
    a[moeda] = Math.max(0, Math.floor(Number(a[moeda]) || 0));
    a.cofreGringotes[moeda] = Math.max(0, Math.floor(Number(a.cofreGringotes[moeda]) || 0));
  }
}

function normalizeAluno(core, a, first = false) {
  if (!a) return a;

  if (a._id !== undefined) delete a._id;
  ensureBank(a);

  a.atributosRPG ||= { intelecto: 5, destreza: 5, vigor: 5, percepcao: 5, pontosLivres: 0 };
  for (const stat of ['intelecto', 'destreza', 'vigor', 'percepcao', 'pontosLivres']) {
    a.atributosRPG[stat] = Math.max(0, Math.floor(Number(a.atributosRPG[stat]) || 0));
  }

  a.equipamentos ||= {};
  if (a.equipamentos.veste && !a.equipamentos.corpo) a.equipamentos.corpo = a.equipamentos.veste;
  a.equipamentos.varinha ??= null;
  a.equipamentos.cabeca ??= null;
  a.equipamentos.corpo ??= null;
  a.equipamentos.pescoco ??= null;

  a.inventario ||= {};
  a.inventario.livros ||= [];
  a.inventario.ingredientes ||= {};
  a.inventario.materiais ||= [];
  a.inventario.armario ||= [];
  a.inventario.mobilia ||= [];
  a.mochilaEscolar ||= [];
  a.maestriaFeiticos ||= {};
  a.feitiçosEquipados ||= [];
  a.estatisticas ||= { duelosVencidos: 0, monstrosMortos: 0 };
  a.elos ||= { duelos: 1000, quadribol: 1000, baile: 1000, quiz: 1000, pocoes: 1000, sabedoria: 1000 };

  for (const [k, v] of Object.entries({
    aulasAssistidas: 0,
    vitoriasPvE: 0,
    vitoriasPvP: 0,
    parriesPerfeitos: 0,
    pocoesCriadas: 0,
    colheitasEstufa: 0,
    livrosLidos: 0,
    ajudasBeacons: 0
  })) {
    a[k] = Math.max(0, Math.floor(Number(a[k]) || v));
  }

  a.productV2 ||= {};
  a.productV2.schema = 2;

  try { core._obterAtributosTotais(a); } catch (_) {}
  a.hpMax = Math.max(1, Math.floor(Number(a.hpMax) || 1000));
  a.maxFoco = Math.max(1, Math.floor(Number(a.maxFoco) || 10));

  if (first || !a.productV2.initialized) {
    a.hpAtual = a.hpMax;
    a.focoAtual = a.maxFoco;
    a.productV2.initialized = true;
  } else {
    a.hpAtual = clamp(a.hpAtual, 0, a.hpMax);
    a.focoAtual = clamp(a.focoAtual, 0, a.maxFoco);
  }

  a.fome = clamp(a.fome ?? 100, 0, 100);
  a.energia = clamp(a.energia ?? 100, 0, 100);

  try { core.gamificacao?.garantirEstadoAluno(a); } catch (_) {}
  return a;
}

function installPasswordUpgrade(core) {
  if (typeof core.registrarNovaConta !== 'function' || core.__productV2AuthWrapped) return;
  core.__productV2AuthWrapped = true;

  const original = core.registrarNovaConta.bind(core);

  function idFromName(nome) {
    const nomeLimpo = String(nome || '').toLowerCase().trim();
    return 'BRX_' + crypto.createHash('sha256')
      .update(`JOGADOR::${nomeLimpo}`)
      .digest('hex')
      .substring(0, 10)
      .toUpperCase();
  }

  function verifyV2(a, password) {
    if (!a.senhaHashV2 || !a.senhaSalt) return false;
    const hash = crypto.pbkdf2Sync(String(password), a.senhaSalt, 210000, 64, 'sha512').toString('hex');
    const x = Buffer.from(hash, 'hex');
    const y = Buffer.from(a.senhaHashV2, 'hex');
    return x.length === y.length && crypto.timingSafeEqual(x, y);
  }

  function verifyLegacy(a, id, password) {
    if (!a.senhaHash) return false;
    const hash = crypto.pbkdf2Sync(String(password), id, 1000, 64, 'sha512').toString('hex');
    const x = Buffer.from(hash, 'hex');
    const y = Buffer.from(a.senhaHash, 'hex');
    return x.length === y.length && crypto.timingSafeEqual(x, y);
  }

  function upgrade(a, password) {
    const salt = crypto.randomBytes(18).toString('hex');
    a.senhaSalt = salt;
    a.senhaHashV2 = crypto.pbkdf2Sync(String(password), salt, 210000, 64, 'sha512').toString('hex');
  }

  core.registrarNovaConta = function productV2Register(tgId, username, nomeBruxo, senha) {
    const nome = cleanName(nomeBruxo);
    const password = String(senha || '');
    if (nome.length < 2) return { erro: 'O nome do bruxo é demasiado curto.' };
    if (password.length < 6 || password.length > 128) return { erro: 'A senha deve ter entre 6 e 128 caracteres.' };

    const id = idFromName(nome);
    const existing = core.alunos[id];

    if (existing) {
      const ok = verifyV2(existing, password) || verifyLegacy(existing, id, password);
      if (!ok) return { erro: 'A assinatura mágica (senha) não corresponde a este bruxo.' };
      if (!existing.senhaHashV2) upgrade(existing, password);
      normalizeAluno(core, existing);
      core._salvarUrgente?.();
      return { sucesso: true, aluno: existing };
    }

    const result = original(tgId, username, nome, password);
    if (result?.sucesso && result.aluno) {
      upgrade(result.aluno, password);
      normalizeAluno(core, result.aluno, true);
      core._salvarUrgente?.();
    }
    return result;
  };
}

function installRestApiAuthority(app, core) {
  const generalLimit = limiter(API_LIMIT_WINDOW, API_LIMIT_MAX);
  const loginLimit = limiter(LOGIN_LIMIT_WINDOW, LOGIN_LIMIT_MAX);

  app.use('/api', (req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('Referrer-Policy', 'same-origin');
    res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
    res.setHeader('Cache-Control', 'no-store');

    const ip = req.ip || req.socket?.remoteAddress || 'unknown';
    const isLogin = req.path === '/registrar';

    if (!(isLogin ? loginLimit(ip) : generalLimit(ip))) {
      return res.status(429).json({ erro: 'Muitas ações em pouco tempo. Tenta novamente em instantes.' });
    }

    const rawJson = res.json.bind(res);
    res.json = payload => {
      let safe = publicClone(payload);
      if (isLogin && safe?.sucesso && safe?.aluno?.id) {
        safe.sessionToken = issueToken(safe.aluno.id);
      }
      return rawJson(safe);
    };

    if (req.path === '/ping' || isLogin) {
      if (isLogin) {
        req.body ||= {};
        req.body.nomeBruxo = cleanName(req.body.nomeBruxo);
        req.body.username = text(req.body.username || req.body.nomeBruxo, 40);
        req.body.senha = String(req.body.senha || '');
      }
      return next();
    }

    const playerId = verifyToken(requestToken(req));
    if (!playerId || !core.alunos[playerId]) {
      return res.status(401).json({ erro: 'Sessão expirada. Entra novamente em Hogwarts.', codigo: 'AUTH_REQUIRED' });
    }

    req.playerId = playerId;

    if (req.path.startsWith('/admin')) {
      if (!process.env.ADMIN_PLAYER_ID || process.env.ADMIN_PLAYER_ID !== playerId) {
        return res.status(403).json({ erro: 'Permissão administrativa necessária.' });
      }
    }

    if (req.path.startsWith('/jogador/perfil/')) {
      const requested = decodeURIComponent(req.path.split('/').pop() || '');
      if (requested && requested !== playerId) return res.status(403).json({ erro: 'Perfil privado.' });
    }

    if (req.query?.id && String(req.query.id) !== playerId) {
      return res.status(403).json({ erro: 'Identidade divergente.' });
    }

    if (req.body && typeof req.body === 'object') {
      for (const key of ['id', 'alunoId', 'jogadorId', 'atacanteId', 'meuId', 'autorId', 'remetenteId']) {
        if (key in req.body || key === 'id') req.body[key] = playerId;
      }

      for (const key of ['texto', 'acao', 'zona', 'nome', 'titulo', 'descricao']) {
        if (typeof req.body[key] === 'string') {
          req.body[key] = text(req.body[key], key === 'texto' || key === 'descricao' ? 700 : 140);
        }
      }
    }

    next();
  });
}

function installSocketAuthority(io, core) {
  io.on('connection', socket => {
    socket.productV2PlayerId = null;

    socket.use((packet, next) => {
      try {
        const event = packet[0];
        let data = packet[1];
        if (!data || typeof data !== 'object' || Array.isArray(data)) {
          data = {};
          packet[1] = data;
        }

        if (!socket.productV2PlayerId) {
          const token = data.token || socket.handshake?.auth?.token || '';
          const id = verifyToken(token);
          if (!id || !core.alunos[id]) return next(new Error('AUTH_REQUIRED'));
          socket.productV2PlayerId = id;
          socket.alunoId = id;
        }

        const id = socket.productV2PlayerId;
        const a = core.alunos[id];
        if (!a) return next(new Error('AUTH_REQUIRED'));

        for (const key of ['id', 'idAluno', 'alunoId', 'jogadorId', 'atacanteId', 'meuId', 'autorId']) {
          if (key in data || (event === 'entrar_chat' && key === 'idAluno')) data[key] = id;
        }

        if (event === 'entrar_chat') {
          data.idAluno = id;
          data.casa = a.casa || 'Nenhuma';
        }

        if (event === 'mensagem_chat') {
          data.texto = text(data.texto, 500);
          data.canal = ['mundo', 'global', 'zona', 'grupo', 'gremio', 'aula'].includes(data.canal) ? data.canal : 'zona';
        }

        if (event === 'admin_comando' || event === 'comando_deus') {
          if (!process.env.ADMIN_PLAYER_ID || process.env.ADMIN_PLAYER_ID !== id) {
            return next(new Error('ADMIN_REQUIRED'));
          }
          data.adminId = 'BRX_9AC7F35224';
        }

        next();
      } catch (_) {
        next(new Error('INVALID_PACKET'));
      }
    });
  });
}

function installGamificationIntegration(core) {
  const gam = core.gamificacao;
  if (!gam || core.__productV2GamificationWrapped) return;
  core.__productV2GamificationWrapped = true;

  function update(id, type, context = {}) {
    const a = core.alunos[id];
    if (!a) return;
    normalizeAluno(core, a);

    try {
      if (type) gam.progredirDiario(id, type, 1);
      gam.verificarConquistas(id, context);
    } catch (_) {}
  }

  function wrapSync(name, after) {
    if (typeof core[name] !== 'function') return;
    const old = core[name].bind(core);
    core[name] = function (...args) {
      const result = old(...args);
      try { after(result, args); } catch (_) {}
      return result;
    };
  }

  function wrapAsync(name, after) {
    if (typeof core[name] !== 'function') return;
    const old = core[name].bind(core);
    core[name] = async function (...args) {
      const result = await old(...args);
      try { after(result, args); } catch (_) {}
      return result;
    };
  }

  wrapSync('assistirAula', (r, args) => {
    if (!r?.erro) {
      const a = core.alunos[args[0]];
      a.aulasAssistidas = (a.aulasAssistidas || 0) + 1;
      update(args[0], 'aula', { tipo: 'aula' });
    }
  });

  wrapAsync('prepararPocao', (r, args) => {
    if (r?.sucesso) {
      const a = core.alunos[args[0]];
      a.pocoesCriadas = (a.pocoesCriadas || 0) + 1;
      update(args[0], 'estufa_pocao', { tipo: 'pocao' });
    }
  });

  wrapSync('treinarFeiticoBoneco', (r, args) => {
    if (r?.sucesso) update(args[0], 'treino_leitura', { tipo: 'treino' });
  });

  wrapAsync('lerLivroIA', (r, args) => {
    if (r?.sucesso || r?.conteudo || r?.pagina) {
      const a = core.alunos[args[0]];
      a.livrosLidos = (a.livrosLidos || 0) + 1;
      update(args[0], 'treino_leitura', { tipo: 'leitura' });
    }
  });

  if (typeof core.processarActionCombat === 'function') {
    const old = core.processarActionCombat.bind(core);
    core.processarActionCombat = async function productV2Combat(...args) {
      const result = await old(...args);
      const [id, , spell] = args;
      const a = core.alunos[id];
      if (a && spell === 'protego_block_reflex' && result?.sucesso) {
        a.parriesPerfeitos = (a.parriesPerfeitos || 0) + 1;
        update(id, null, { tipo: 'parry' });
      }
      if (a && result?.bossMorto) {
        a.vitoriasPvE = (a.vitoriasPvE || 0) + 1;
        update(id, 'combate', { tipo: 'combate' });
      }
      return result;
    };
  }

  if (typeof gam.participarBeaconSocial === 'function') {
    const old = gam.participarBeaconSocial.bind(gam);
    gam.participarBeaconSocial = function productV2Beacon(...args) {
      const r = old(...args);
      if (r?.sucesso) {
        const a = core.alunos[args[1]];
        if (a) a.ajudasBeacons = (a.ajudasBeacons || 0) + 1;
      }
      return r;
    };
  }
}

function installAchievementPassives(core) {
  if (typeof core._obterAtributosTotais !== 'function' || core.__productV2PassivesWrapped) return;
  core.__productV2PassivesWrapped = true;

  const oldStats = core._obterAtributosTotais.bind(core);
  core._obterAtributosTotais = function productV2Stats(a) {
    const base = oldStats(a);
    if (!a || !core.gamificacao) return base;

    const earned = new Set(a.conquistas || []);
    const bonuses = {};
    for (const ach of core.gamificacao.catalogoConquistas || []) {
      if (!earned.has(ach.id) || !ach.passiva) continue;
      bonuses[ach.passiva.stat] = (bonuses[ach.passiva.stat] || 0) + (Number(ach.passiva.valor) || 0);
    }

    a.bonusGamificacao = bonuses;

    if (bonuses.max_foco) {
      a.maxFoco = Math.floor(a.maxFoco + bonuses.max_foco);
      a.focoAtual = Math.min(a.focoAtual, a.maxFoco);
    }
    if (bonuses.defesa_geral || bonuses.defesa_fisica) {
      const pct = (bonuses.defesa_geral || 0) + (bonuses.defesa_fisica || 0);
      base.defesa = Math.floor((base.defesa || 0) * (1 + pct / 100));
      a.atributosTotais.defesa = base.defesa;
    }
    if (bonuses.todos_atributos) {
      const add = bonuses.todos_atributos;
      for (const stat of ['feiticos', 'defesa', 'pocoes', 'transfiguracao', 'furtividade', 'artes_trevas']) {
        if (typeof base[stat] === 'number') base[stat] += add;
      }
    }

    return base;
  };

  if (typeof core.calcularDanoSinergia === 'function') {
    const oldDamage = core.calcularDanoSinergia.bind(core);
    core.calcularDanoSinergia = function productV2Damage(ctx) {
      const out = oldDamage(ctx);
      const a = ctx?.atacante;
      if (!out || !a) return out;
      core._obterAtributosTotais(a);
      const b = a.bonusGamificacao || {};
      const element = String(ctx?.feitico?.elemento || '').toLowerCase();
      const pct = (b.dano_geral || 0) + (b[`dano_${element}`] || 0);
      if (pct > 0 && Number.isFinite(out.danoFinal)) {
        out.danoFinal = Math.max(0, Math.floor(out.danoFinal * (1 + pct / 100)));
      }
      return out;
    };
  }
}

function installCombatAuthority(core) {
  if (core.__productV2CombatAuthority) return;
  core.__productV2CombatAuthority = true;

  if (typeof core.processarActionCombat === 'function') {
    const old = core.processarActionCombat.bind(core);
    core.processarActionCombat = async function authoritativePve(atacanteId, instId, feiticoId, alvoIdx = 0) {
      const a = core.alunos[atacanteId];
      const inst = core.dungeonInstancias?.[instId];
      if (!a || !inst) return { erro: 'Combate inexistente.' };
      normalizeAluno(core, a);

      if (Array.isArray(inst.membros) && !inst.membros.includes(atacanteId)) {
        return { erro: 'Não pertences a esta instância.' };
      }

      const special = ['dano_recebido', 'protego_block_reflex'].includes(feiticoId);
      let spent = 0;

      if (!special) {
        const f = core.livroDeFeiticos?.[feiticoId];
        if (!f) return { erro: 'Feitiço desconhecido.' };
        if (!a.feitiçosEquipados?.includes(feiticoId)) return { erro: 'Esse feitiço não está equipado.' };

        const custo = Math.max(0, Math.floor(Number(f.custoFocoBase ?? f.custoFoco ?? 0)));
        if (a.focoAtual < custo) return { erro: `Foco insuficiente (${custo}).` };

        a.productV2 ||= {};
        a.productV2.cooldowns ||= {};
        if ((a.productV2.cooldowns[feiticoId] || 0) > Date.now()) return { erro: 'A varinha ainda está em recarga.' };

        spent = custo;
        a.focoAtual -= custo;
        a.productV2.cooldowns[feiticoId] = Date.now() + Math.max(250, Number(f.tempoCasting) || 350);
      }

      const result = await old(atacanteId, instId, feiticoId, alvoIdx);
      if (result?.erro && spent) {
        a.focoAtual = Math.min(a.maxFoco, a.focoAtual + spent);
        delete a.productV2.cooldowns[feiticoId];
      }
      return result;
    };
  }

  if (typeof core.processarAcaoPvP === 'function') {
    const old = core.processarAcaoPvP.bind(core);
    core.processarAcaoPvP = function authoritativePvp(atacanteId, instId, feiticoId, ioGlobal) {
      const p = core.pvpPartidas?.[instId];
      if (!p || ![p.p1?.id, p.p2?.id].includes(atacanteId)) return { erro: 'Não pertences a este duelo.' };

      const a = core.alunos[atacanteId];
      if (!a) return { erro: 'Bruxo inexistente.' };
      normalizeAluno(core, a);

      const special = ['dano_recebido', 'protego_block_reflex'].includes(feiticoId);
      let spent = 0;
      if (!special) {
        const real = feiticoId === 'protego_block_reflex' ? 'protego' : feiticoId;
        const f = core.livroDeFeiticos?.[real];
        if (!f) return { erro: 'Feitiço desconhecido.' };
        if (!a.feitiçosEquipados?.includes(real) && !a.feitiçosEquipados?.includes(feiticoId)) {
          return { erro: 'Esse feitiço não está no teu deck.' };
        }

        const custo = Math.max(0, Math.floor(Number(f.custoFocoBase ?? f.custoFoco ?? 0)));
        if (a.focoAtual < custo) return { erro: `Foco insuficiente (${custo}).` };

        a.productV2 ||= {};
        a.productV2.pvpCooldowns ||= {};
        if ((a.productV2.pvpCooldowns[real] || 0) > Date.now()) return { erro: 'A varinha ainda está em recarga.' };

        spent = custo;
        a.focoAtual -= custo;
        a.productV2.pvpCooldowns[real] = Date.now() + Math.max(250, Number(f.tempoCasting) || 350);
      }

      const result = old(atacanteId, instId, feiticoId, ioGlobal);
      if (result?.erro && spent) {
        a.focoAtual = Math.min(a.maxFoco, a.focoAtual + spent);
      }
      if (result?.pvpFim) {
        a.vitoriasPvP = (a.vitoriasPvP || 0) + 1;
        try { core.gamificacao?.verificarConquistas(atacanteId, { tipo: 'pvp_vitoria' }); } catch (_) {}
      }
      return result;
    };
  }
}

function snapshotLife(a) {
  return {
    hpAtual: a.hpAtual,
    focoAtual: a.focoAtual,
    fome: a.fome,
    energia: a.energia,
    pet: a.pet ? JSON.parse(JSON.stringify(a.pet)) : a.pet,
    estufa: a.estufa ? JSON.parse(JSON.stringify(a.estufa)) : a.estufa
  };
}

function restoreLife(a, s) {
  a.hpAtual = s.hpAtual;
  a.focoAtual = s.focoAtual;
  a.fome = s.fome;
  a.energia = s.energia;
  a.pet = s.pet;
  a.estufa = s.estufa;
}

function applyLife(core, a, online) {
  normalizeAluno(core, a);
  const now = Date.now();
  a.productV2 ||= {};

  const last = Number(a.productV2.lastLifeAt) || now;
  const mins = Math.min(15, Math.max(0, (now - last) / 60000));
  a.productV2.lastLifeAt = now;

  if (online && mins > 0) {
    a.fome = clamp(a.fome - mins / 3.5, 0, 100);
    a.energia = clamp(a.energia - mins / 4.5, 0, 100);

    if (a.fome > 20 && a.energia > 20) {
      a.focoAtual = clamp(a.focoAtual + mins * 0.35, 0, a.maxFoco);
      a.hpAtual = clamp(a.hpAtual + a.hpMax * 0.0015 * mins, 0, a.hpMax);
    } else if (a.fome <= 0 || a.energia <= 0) {
      a.hpAtual = clamp(a.hpAtual - a.hpMax * 0.002 * mins, 1, a.hpMax);
    }

    if (a.pet?.adotado) {
      a.pet.fome = clamp((a.pet.fome ?? 100) - mins / 5, 0, 100);
      a.pet.felicidade = clamp((a.pet.felicidade ?? 100) - mins / 8, 0, 100);
    }
  }

  const lastGarden = Number(a.productV2.lastGardenAt) || now;
  const gardenMins = Math.min(720, Math.max(0, (now - lastGarden) / 60000));
  a.productV2.lastGardenAt = now;

  if (Array.isArray(a.estufa) && gardenMins >= 1) {
    for (const pot of a.estufa) {
      if (!pot?.plantada || pot.morta || pot.colhida) continue;
      pot.agua = clamp(pot.agua ?? 100, 0, 100);
      pot.agua = clamp(pot.agua - gardenMins / 20, 0, 100);
      if (pot.agua <= 0) pot.morta = true;
      if (!pot.praga && Math.random() < Math.min(0.12, gardenMins / 720 * 0.12)) pot.praga = true;
    }
  }
}

function installLifeSimulation(core, io) {
  if (typeof core.tickServerGlobal !== 'function' || core.__productV2LifeWrapped) return;
  core.__productV2LifeWrapped = true;
  const old = core.tickServerGlobal.bind(core);

  core.tickServerGlobal = function productV2Tick() {
    const snapshots = new Map();
    for (const [id, a] of Object.entries(core.alunos || {})) snapshots.set(id, snapshotLife(a));

    const result = old();

    const online = new Set();
    for (const socket of io.sockets.sockets.values()) {
      if (socket.productV2PlayerId) online.add(socket.productV2PlayerId);
      else if (socket.alunoId) online.add(socket.alunoId);
    }

    for (const [id, a] of Object.entries(core.alunos || {})) {
      const snap = snapshots.get(id);
      if (snap) restoreLife(a, snap);
      applyLife(core, a, online.has(id));
    }

    return result;
  };
}

function objectiveFor(a, serverState) {
  const diary = a.diarioMaroto;
  const openTask = diary?.tarefas?.find(t => !t.concluida);
  const hour = new Date().getHours();

  if (a.estadoJogo === 'BECO_DIAGONAL') {
    return { icon: 'bag', title: 'Preparar o primeiro ano', detail: 'Completa a lista escolar, escolhe a tua varinha e embarca no Expresso.' };
  }
  if (!a.casa || a.casa === 'Nenhuma') {
    return { icon: 'hat', title: 'Chegar a Hogwarts', detail: 'Avança pela introdução até ao Chapéu Seletor.' };
  }
  if ((a.fome ?? 100) < 28) {
    return { icon: 'meal', title: 'Ir ao Salão Principal', detail: 'A tua fome está baixa. Faz uma refeição antes de uma expedição.' };
  }
  if ((a.energia ?? 100) < 25) {
    return { icon: 'bed', title: 'Recuperar energia', detail: 'Passa pela Sala Comunal ou Dormitório e prepara o próximo ciclo.' };
  }
  if (serverState?.relogio?.aulaAtiva && serverState.relogio.aulaAtiva !== 'Livre') {
    return { icon: 'class', title: serverState.relogio.aulaAtiva, detail: `Aula em curso com ${serverState.relogio.professorAtivo || 'um professor de Hogwarts'}.` };
  }
  if (openTask) {
    return { icon: 'journal', title: openTask.texto, detail: `Diário do Maroto: ${openTask.atual || 0}/${openTask.meta || 1}.` };
  }
  if (a.questAtiva) {
    return { icon: 'quest', title: a.questAtiva.titulo || 'Continuar a aventura', detail: a.questAtiva.objetivo || 'Segue a tua missão ativa pelo castelo.' };
  }
  if (hour >= 21 || hour < 6) {
    return { icon: 'moon', title: 'Hogwarts depois do toque de recolher', detail: 'Explora com cautela, descansa ou procura segredos noturnos.' };
  }
  return { icon: 'castle', title: 'Viver Hogwarts', detail: 'Aprende, prepara-te, explora, ajuda colegas e fortalece a tua Casa.' };
}

function installProductRoutes(app, core, RelogioHogwarts, AstrolabioMagico) {
  app.get('/api/product/dashboard', (req, res) => {
    const a = core.alunos[req.playerId];
    normalizeAluno(core, a);

    let relogio = null;
    let clima = null;
    try { relogio = RelogioHogwarts?.obterHorarioAtual?.(a.anoLetivo || 1) || null; } catch (_) {}
    try { clima = AstrolabioMagico?.obterClimaAtual?.() || null; } catch (_) {}

    const state = { relogio, clima };
    const casa = a.casa || 'Nenhuma';
    const score = Number(core.pontuacaoCasas?.[casa]) || 0;

    res.json({
      sucesso: true,
      dashboard: {
        player: {
          id: a.id,
          nome: a.nome,
          titulo: a.tituloEquipado || a.titulo || 'Aprendiz de Magia',
          casa,
          nivel: a.nivel || 1,
          xp: a.xp || 0,
          xpProx: a.xpProx || 100,
          hpAtual: a.hpAtual,
          hpMax: a.hpMax,
          focoAtual: a.focoAtual,
          maxFoco: a.maxFoco,
          fome: Math.round(a.fome),
          energia: Math.round(a.energia),
          galeoes: a.galeoes || 0
        },
        objective: objectiveFor(a, state),
        relogio,
        clima,
        houseScore: score,
        worldBoss: core.worldBoss?.ativo ? publicClone(core.worldBoss) : null,
        diary: publicClone(a.diarioMaroto || null),
        quest: publicClone(a.questAtiva || null),
        bounties: publicClone(core.gamificacao?.obterBountiesHogsmeade?.(a.id) || []),
        activeBeacons: publicClone(Object.values(core.gamificacao?.beaconsAtivos || {}).slice(0, 6)),
        loop: [
          { id: 'learn', label: 'Aprender', hint: 'Aulas, biblioteca, exames e maestria' },
          { id: 'prepare', label: 'Preparar', hint: 'Poções, Herbologia, equipamento e descanso' },
          { id: 'explore', label: 'Explorar', hint: 'Castelo, segredos, Floresta e bounties' },
          { id: 'belong', label: 'Pertencer', hint: 'Casa, grupos, beacons, guildas e dormitórios' },
          { id: 'compete', label: 'Competir', hint: 'Duelos, Quadribol, rankings e eventos' }
        ]
      }
    });
  });

  app.get('/api/product/health', (req, res) => {
    res.json({
      sucesso: true,
      version: '2.0.0',
      playersInMemory: Object.keys(core.alunos || {}).length,
      onlineSockets: app?.locals?.io?.sockets?.sockets?.size || undefined
    });
  });
}

function installHogwartsProductV2({ app, io, core, RelogioHogwarts, AstrolabioMagico }) {
  if (!app || !io || !core) throw new Error('Hogwarts Product V2: dependências ausentes.');
  if (core.__productV2Installed) return;
  core.__productV2Installed = true;

  if (!process.env.SESSION_SECRET) {
    console.warn('[PRODUCT V2] SESSION_SECRET não configurado. Use uma chave longa em produção.');
  }

  app.locals.io = io;

  for (const a of Object.values(core.alunos || {})) normalizeAluno(core, a);

  installPasswordUpgrade(core);
  installRestApiAuthority(app, core);
  installSocketAuthority(io, core);
  installAchievementPassives(core);
  installGamificationIntegration(core);
  installCombatAuthority(core);
  installLifeSimulation(core, io);
  installProductRoutes(app, core, RelogioHogwarts, AstrolabioMagico);

  setInterval(() => {
    for (const a of Object.values(core.alunos || {})) normalizeAluno(core, a);
  }, 60_000).unref?.();

  console.log('[PRODUCT V2] Rework integrado ativo: auth, progressão, combate, vida e dashboard.');
}

module.exports = {
  installHogwartsProductV2,
  issueToken,
  verifyToken,
  normalizeAluno,
  publicClone
};
