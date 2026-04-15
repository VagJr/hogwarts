// ==============================================================================
// server.js - O NÚCLEO AAA DO CASTELO DE HOGWARTS (ULTIMATE ROLEPLAY & FIXES)
// ==============================================================================
require('dotenv').config(); // <-- ISTO ACORDA A SUA CHAVE DA IA E A DATABASE!

const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');
const { MongoClient } = require('mongodb');
const crypto = require('crypto'); // 🔥 ADICIONE ISTO NA LINHA 2

const { HogwartsCore, AstrolabioMagico, RelogioHogwarts, Ollivanders, MotorConscienciaHogwarts, MotorQuadribol } = require('./HogwartsCore.js');
const Lexicon = require('./LexiconMagicae.js'); 

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" }, pingInterval: 25000, pingTimeout: 60000 });
global.io = io; 
const PORT = process.env.PORT || 8080;
const MONGO_URI = process.env.MONGO_URI || ""; 

app.use(express.json());
app.use(express.static(__dirname));

const core = new HogwartsCore();

async function inicializarServidor() {
    console.log("A invocar os feitiços de proteção de Gringotes...");
    if (MONGO_URI) {
        try {
            const client = new MongoClient(MONGO_URI); await client.connect();
            const db = client.db('hogwarts_db'); core.collection = db.collection('registos_escolares');
            const doc = await core.collection.findOne({ _id: 'MATRIZ_HOGWARTS' });
            
            if (doc) {
                core.alunos = doc.alunos || {}; core.mercadoJogadores = doc.mercadoJogadores || []; 
                core.logs = doc.logs || { salaoPrincipal: [], profetaDiario: [] };
                core.pontuacaoCasas = doc.pontuacaoCasas || { Gryffindor: 0, Slytherin: 0, Ravenclaw: 0, Hufflepuff: 0, lider: 'Empate' };
                core.gremios = doc.gremios || {};
            }

            // SALVAMENTO LENTO (Apenas para movimento passivo)
            let precisaSalvar = false; let salvando = false;
            core._salvarBancoDeDados = () => { precisaSalvar = true; };

            // 🔥 SALVAMENTO URGENTE: Blinda a base de dados instantaneamente contra Rollbacks no Fly.io
            core._salvarUrgente = () => {
                if(!core.collection || salvando) { precisaSalvar = true; return; }
                salvando = true;
                
                const data = { alunos: core.alunos, mercadoJogadores: core.mercadoJogadores, logs: core.logs, pontuacaoCasas: core.pontuacaoCasas, gremios: core.gremios };
                
                // Dispara o salvamento mas NÃO manda o servidor esperar (Sem await). 
                // A resposta vai instantânea para o jogador!
                core.collection.updateOne({ _id: 'MATRIZ_HOGWARTS' }, { $set: data }, { upsert: true })
                    .then(() => { 
                        salvando = false; 
                        if(precisaSalvar) { precisaSalvar = false; core._salvarUrgente(); }
                    })
                    .catch(e => { console.error("Erro Mágico ao salvar:", e); salvando = false; });
            };
            setInterval(() => {
                if(precisaSalvar && !salvando) core._salvarUrgente();
            }, 6000); 

        } catch (error) { console.error("❌ Falha na conexão a Gringotes!", error.message); }
    }
}


// ==============================================================================
// 1. ADMISSÃO E BECO DIAGONAL
// ==============================================================================
app.post('/api/registrar', async (req, res) => { try { const r = core.registrarNovaConta(Date.now(), req.body.username, req.body.nomeBruxo, req.body.senha); await core._salvarUrgente(); res.json(r); } catch(e) { res.status(500).json({erro: "Falha ao criar pergaminho."}); } });
app.post('/api/beco/ollivanders_ia', async (req, res) => { try { const r = await core.gerarVarinhaOllivanders(req.body.id, req.body.personalidade); if(!r.erro) { await core._salvarUrgente(); forcarSyncAluno(req.body.id); } res.json(r); } catch(e) { res.status(500).json({erro: "A varinha explodiu."}); } });
app.post('/api/beco/comprar', async (req, res) => { try { const r = core.comprarNoBecoDiagonal(req.body.id, req.body.loja, req.body.itemId); if(!r.erro) { await core._salvarUrgente(); forcarSyncAluno(req.body.id); } res.json(r); } catch(e) { res.status(500).json({erro: "O lojista ignorou-te."}); } });
app.post('/api/selecao', async (req, res) => { try { const r = await core.processarSelecao(req.body.id, req.body.resposta); io.emit('pontuacao_atualizada', core.pontuacaoCasas); await core._salvarUrgente(); forcarSyncAluno(req.body.id); res.json(r); } catch(e) { res.status(500).json({erro: "O Chapéu adormeceu."}); } });
app.post('/api/gringotes/acao', (req, res) => { try { const r = core.acaoGringotes(req.body.id, req.body.acao, req.body.valor); if(!r.erro) forcarSyncAluno(req.body.id); res.json(r); } catch(e) { res.status(500).json({erro: "Erro no banco."}); } });

// ==============================================================================
// 2. FUNÇÃO CENTRAL DE SYNC (NÃO DUPLICAR)
// ==============================================================================
function forcarSyncAluno(id) {
    try {
        if(core.alunos[id]) {
            const aluno = core.alunos[id];
            core._obterAtributosTotais(aluno);
            const servidor = {
                pontuacaoCasas: core.pontuacaoCasas, 
                relogio: RelogioHogwarts.obterHorarioAtual(),
                climaHogwarts: AstrolabioMagico.obterClimaAtual(),
                livroDeFeiticos: core.livroDeFeiticos,
                ranking: core.gerarRanking(),
                gremios: core.gremios,
                mercadoJogadores: core.mercadoJogadores,
                worldBoss: core.worldBoss,
                receitasPocoes: core.receitasPocoes
            };
            global.io.to(`priv_${id}`).emit('sync_imediato', { aluno, servidor });
        }
    } catch(e) { console.error("Falha no Sync:", e); }
}
// Adicione estas rotas no seu server.js

// Banco de dados em memória para livros públicos (idealmente use MongoDB)
core.livrosPublicos = [];

// --- ROTAS DA BIBLIOTECA NO SERVER.JS ---

app.post('/api/biblioteca/gerar_livro', async (req, res) => {
    const { id, assunto, estilo } = req.body;
    const a = core.alunos[id];
    if(!a) return res.json({erro: "Aluno não encontrado"});
    
    // XP Passivo por invocar conhecimento (Gasta foco, ganha algum XP)
    if (a.focoAtual < 2) return res.json({erro: "Foco Insuficiente (Requer 2)."});
    a.focoAtual -= 2;
    core.ganharXp(a, 25); // +25 XP só por pesquisar
    core._salvarUrgente();
    
    const livro = await core.cerebroIA.gerarLivroCompleto(a.nome, assunto, estilo);
    res.json(livro);
});



app.post('/api/biblioteca/arquivar', async (req, res) => {
    const { id, titulo, conteudo } = req.body;
    const a = core.alunos[id];
    if(!a) return res.json({erro: "Bruxo não encontrado."});
    
    if(!a.manuscritos) a.manuscritos = [];
    
    const idx = a.manuscritos.findIndex(m => m.titulo === titulo);
    if(idx !== -1) {
        a.manuscritos[idx].conteudo = conteudo;
        core.ganharXp(a, 15); // +15 XP por editar e refinar
    } else {
        a.manuscritos.push({ id: Date.now(), titulo, conteudo });
        core.ganharXp(a, 30); // +30 XP por arquivar um novo pergaminho
    }
    
    core._salvarUrgente();
    res.json({ sucesso: true, msg: "Pergaminho arquivado com sucesso! Ganhaste XP." });
});

app.post('/api/biblioteca/publicar', (req, res) => {
    const { id, titulo, conteudo, feiticoId } = req.body;
    const a = core.alunos[id];
    core.livrosPublicos.push({
        id: Date.now(),
        autor: a.nome,
        titulo,
        conteudo,
        feiticoOriginalId: feiticoId
    });
    res.json({sucesso: true});
});
// ATUALIZAR: Rota da Biblioteca para dar ELO
app.post('/api/biblioteca/avaliar_tese', async (req, res) => {
    const { id, manuscrito } = req.body;
    const a = core.alunos[id];
    if (a.focoAtual < 5) return res.json({erro: "Requer 5 de Foco."});
    a.focoAtual -= 5;
    
    const r = await core.cerebroIA.avaliarTeseMagica(a, manuscrito);
    
    let xp = r.xpGanha || 50; let elo = r.eloGanha || 5;
    core.ganharXp(a, xp);
    a.elos.sabedoria += elo;
    
    if (r.aprovado && r.feitico) {
        const fId = `custom_${Date.now()}`;
        core.livroDeFeiticos[fId] = { ...r.feitico, criador: a.nome, custom: true };
        a.maestriaFeiticos[fId] = { nivel: 1, exp: 0, expProx: 100 };
        a.feitiçosEquipados.push(fId);
    }
    core._salvarUrgente();
    r.feedback = `[+${xp} XP | +${elo} ELO] ${r.feedback}`;
    res.json(r);
});

// ATUALIZAR: Quiz ELO
app.post('/api/quiz/responder', (req, res) => {
    const { id, acertou } = req.body;
    const a = core.alunos[id];
    if(!a) return res.json({erro: "Erro"});
    let diff = acertou ? 15 : -10;
    a.elos.quiz = Math.max(0, (a.elos.quiz || 1000) + diff);
    if(acertou) { core.ganharXp(a, 50); a.galeoes += 5; }
    core._salvarUrgente();
    res.json({ msg: acertou ? "Correto! (+15 ELO, +50XP)" : "Errado! (-10 ELO)", elo: a.elos.quiz });
});

// =========================================================
// ROTAS DA SALA PRECISA (HOUSING)
// =========================================================
app.post('/api/quarto/comprar', async (req, res) => {
    const { id } = req.body;
    const a = core.alunos[id];
    if (!a) return res.json({ erro: "Erro de autenticação." });
    if (a.galeoes < 50) return res.json({ erro: "A Mobília Misteriosa custa 50 Galeões." });

    const movelIA = await core.cerebroIA.gerarMobiliaMagica();
    if (!movelIA) return res.json({ erro: "A Sala Precisa não respondeu. Tenta de novo." });

    a.galeoes -= 50;
    if (!a.inventario.mobilia) a.inventario.mobilia = [];
    
    const novoMovel = { 
        id: 'movel_' + crypto.randomBytes(4).toString('hex'), 
        ...movelIA, 
        equipado: false, x: 50, y: 50 
    };
    
    a.inventario.mobilia.push(novoMovel);
    core._salvarUrgente();
    res.json({ sucesso: true, msg: `A Sala manifestou: [${novoMovel.nome}]!`, movel: novoMovel });
});

app.post('/api/quarto/estado', (req, res) => {
    const { id, movelId, equipado, x, y, rotacao } = req.body; // 🔥 Adicionado rotacao
    const a = core.alunos[id];
    if (a && a.inventario.mobilia) {
        let m = a.inventario.mobilia.find(x => x.id === movelId);
        if (m) {
            if (equipado !== undefined) m.equipado = equipado;
            if (x !== undefined && y !== undefined) { m.x = x; m.y = y; }
            if (rotacao !== undefined) m.rotacao = rotacao; // 🔥 Guarda o ângulo
            core._salvarUrgente();
        }
    }
    res.json({ sucesso: true });
});

// Rota para limpar vaso com planta morta
app.post('/api/estufa/limpar_morto', (req, res) => {
    const { id, poteId } = req.body;
    const a = core.alunos[id];
    if(!a) return res.json({erro: "Aluno não encontrado"});
    let p = a.estufa.find(x => x.id === poteId);
    if(p) {
        p.plantada = false; p.morta = false; p.tipo = null; p.agua = 0; p.praga = false;
        core._salvarUrgente();
    }
    res.json({sucesso: true, msg: "O vaso foi limpo e está pronto para nova vida."});
});

// Atualização da rota de vender no mercado para suportar móveis
app.post('/api/mercado/vender', (req, res) => {
    const { id, itemId, preco } = req.body;
    const a = core.alunos[id];
    if(!a) return res.json({erro: "Bruxo não encontrado."});

    let itemObj = (a.mochilaEscolar || []).find(i => i.id === itemId);
    let isMovel = false;

    if(!itemObj && a.inventario && a.inventario.mobilia) {
        itemObj = a.inventario.mobilia.find(m => m.id === itemId);
        if(itemObj && itemObj.equipado) return res.json({erro: "Retira o móvel da sala antes de o vender!"});
        isMovel = true;
    }

    if(!itemObj) return res.json({erro: "Item não encontrado."});

    const oferta = {
        id: "of_" + Date.now(), 
        vendedorId: a.id, 
        vendedorNome: a.nome,
        item: itemObj, 
        preco: parseInt(preco), 
        tipo: isMovel ? 'mobilia' : 'item'
    };

    // 🔥 CORREÇÃO: Guardar na variável "servidorGlobal" para que a interface o encontre ao atualizar!
    if (!core.servidorGlobal) core.servidorGlobal = {};
    if (!core.servidorGlobal.mercadoJogadores) core.servidorGlobal.mercadoJogadores = [];
    
    core.servidorGlobal.mercadoJogadores.push(oferta);
    
    // Retira o item da mochila ou do baú
    if(isMovel) a.inventario.mobilia = a.inventario.mobilia.filter(m => m.id !== itemId);
    else a.mochilaEscolar = a.mochilaEscolar.filter(i => i.id !== itemId);

    if (typeof core._salvarBancoDeDados === 'function') core._salvarBancoDeDados();
    else if (typeof core._salvarUrgente === 'function') core._salvarUrgente();
    
    res.json({sucesso: true, msg: "Oferta anunciada no Correio Coruja!"});
});

// =========================================================
// ROTAS DA ESTUFA AVANÇADA (Água e Pragas)
// =========================================================

app.post('/api/estufa/regar', (req, res) => {
    const { id, poteId } = req.body;
    if (!core.alunos[id]) return res.json({ erro: "Estudante não encontrado." });
    
    const resultado = core.regarEstufa(id, poteId);
    res.json(resultado);
});

app.post('/api/estufa/curar', (req, res) => {
    const { id, poteId } = req.body;
    if (!core.alunos[id]) return res.json({ erro: "Estudante não encontrado." });
    
    const resultado = core.curarPragaEstufa(id, poteId);
    res.json(resultado);
});

// NOVA: Baile ELO
app.post('/api/baile/recompensa', (req, res) => {
    const { id, score } = req.body;
    const a = core.alunos[id];
    if(!a) return res.json({erro: "Erro"});
    let eloGained = Math.floor(score / 500); // 1 ELO a cada 500 pts
    if(eloGained > 50) eloGained = 50;
    a.elos.baile += eloGained;
    core.ganharXp(a, Math.floor(score/2));
    core._salvarUrgente();
    res.json({ sucesso: true, msg: `Baile Finalizado! (+${eloGained} ELO | +${Math.floor(score/2)} XP)`});
});
// ==============================================================================
// 3. EVENTOS DO JOGO, ROTINAS E EXPLORAÇÃO
// ==============================================================================
app.get('/api/status', (req, res) => {
    const { id } = req.query;
    const a = core.alunos[id];
    if (!a) return res.json({ erro: "Estudante ausente." });
    
    // O ranking e TODOS os dados globais que a interface (e o combate) precisam para desenhar os botões
    const ranking = core.gerarRanking();
    
    const servidorCompleto = {
        pontuacaoCasas: core.pontuacaoCasas, 
        relogio: RelogioHogwarts.obterHorarioAtual(),
        climaHogwarts: AstrolabioMagico.obterClimaAtual(),
        livroDeFeiticos: core.livroDeFeiticos, // 🔥 AQUI ESTAVA O PROBLEMA! Faltava isto para desenhar os botões
        ranking: ranking,
        gremios: core.gremios,
        mercadoJogadores: core.mercadoJogadores,
        worldBoss: core.worldBoss,
        receitasPocoes: core.receitasPocoes
    };

    res.json({ aluno: a, servidor: servidorCompleto });
});

app.post('/api/lifeskills/coletar', async (req, res) => { 
    try { const resultado = await core.coletarRecursoLifeSkill(req.body.id, req.body.zona); res.json(resultado); forcarSyncAluno(req.body.id); } 
    catch(e) { res.status(500).json({erro: "A magia da floresta instabilizou a coleta."}); } 
});

app.post('/api/castelo/interagir', async (req, res) => { try { res.json(await core.acaoLivreAmbiente(req.body.id, req.body.zona, req.body.acao)); } catch(e) { res.status(500).json({erro: "A sala desvaneceu."}); } });
app.post('/api/castelo/procurar_segredo', async (req, res) => { try { const r = await core.procurarSegredo(req.body.id, req.body.zona); if(!r.erro) forcarSyncAluno(req.body.id); res.json(r); } catch(e) { res.status(500).json({erro: "Nada."}); } });
app.post('/api/roleplay/acao', (req, res) => { try { const r = core.acaoRoleplay(req.body.id, req.body.tipo); if(!r.erro) forcarSyncAluno(req.body.id); res.json(r); } catch(e) { res.status(500).json({erro: "Falha na ação."}); } });

// ==============================================================================
// 4. HISTÓRIA, QUESTS E MERCADO
// ==============================================================================
app.post('/api/historia/embarcar', (req, res) => { try { const r = core.embarcarExpresso(req.body.id); if(r.sucesso) forcarSyncAluno(req.body.id); res.json(r); } catch(e) { res.status(500).json({erro: "O comboio já partiu."}); } });
app.post('/api/historia/desembarcar', (req, res) => { try { const r = core.desembarcarExpresso(req.body.id); if(r.sucesso) forcarSyncAluno(req.body.id); res.json(r); } catch(e) { res.status(500).json({erro: "O barco afundou."}); } });
app.post('/api/historia/avancar_expresso', (req, res) => { try { const a = core.alunos[req.body.id]; if(a && a.estadoJogo === 'EXPRESSO_HOGWARTS') { a.estadoJogo = 'SELECAO_CHAPEU'; core._salvarBancoDeDados(); forcarSyncAluno(a.id); res.json({sucesso:true}); } else res.json({erro:"Ainda não."}); } catch(e){} });

app.post('/api/aventura/nova', async (req, res) => { try { res.json(await core.pedirQuestIA(req.body.id)); forcarSyncAluno(req.body.id); } catch(e) { res.status(500).json({erro:"Erro no Oráculo."}); } });
app.post('/api/aventura/concluir', async (req, res) => { try { res.json(await core.concluirQuest(req.body.id)); forcarSyncAluno(req.body.id); } catch(e) { res.status(500).json({erro:"Erro."}); } });

app.post('/api/mercado/comprar', (req, res) => { try { const r = core.comprarItemMercado(req.body.id, req.body.ofertaId); if(r.sucesso) forcarSyncAluno(req.body.id); res.json(r); } catch(e) { res.status(500).json({erro: "Erro no contrato."}); } });

// ==============================================================================
// 5. AULAS E BIBLIOTECA
// ==============================================================================
app.post('/api/aulas/assistir', async (req, res) => { try { const r = await core.assistirAula(req.body.id); if(!r.erro) forcarSyncAluno(req.body.id); res.json(r); } catch(e) { res.status(500).json({erro: "Chegaste atrasado."}); } });
app.post('/api/aulas/estudar_item', async (req, res) => { try { const r = await core.estudarMaterial(req.body.id, req.body.itemId); if(!r.erro) forcarSyncAluno(req.body.id); res.json(r); } catch(e){ res.status(500).json({erro:"Erro ao ler."}); } });
app.post('/api/aulas/folhear', async (req, res) => { try { const r = await core.folhearLivro(req.body.id); res.json(r); if(!r.erro) forcarSyncAluno(req.body.id); } catch(e) { res.status(500).json({erro: "A magia instabilizou-se."}); } });
app.post('/api/aulas/iniciar_imersiva', async (req, res) => {
    try {
        const a = core.alunos[req.body.id]; if(!a) return res.status(404).json({erro:"Estudante não encontrado"});
        a.focoAtual -= 2; core._salvarBancoDeDados(); forcarSyncAluno(a.id);
        res.json({sucesso: true});
        (async () => {
            try {
                const relogio = RelogioHogwarts.obterHorarioAtual();
                const prompt = `És o Prof. ${relogio.professorAtivo} a ensinar ${relogio.aulaAtiva}. O aluno ${a.nome} está no ${a.anoLetivo || 1}º Ano. O livro é "${relogio.requerLivro}". Dá uma introdução curta da aula. NADA DE JSON, texto puro.`;
                const iaRes = await core.cerebroIA.groq.chat.completions.create({ messages: [{ role: "user", content: prompt }], model: "llama-3.3-70b-versatile" });
                global.io.emit('nova_mensagem', { canal: 'aula', autor: `🎓 [Prof. ${relogio.professorAtivo}]`, texto: iaRes.choices[0].message.content.trim() });
            } catch(err) { global.io.emit('nova_mensagem', { canal: 'aula', autor: `🎓 [Sistema]`, texto: `A aula iniciou em silêncio.` }); }
        })();
    } catch(e) {}
});
app.post('/api/aulas/concluir_imersiva', async (req, res) => {
    try {
        const a = core.alunos[req.body.id]; const relogio = RelogioHogwarts.obterHorarioAtual();
        await core._addXp(a, 400); 
        a.mochilaEscolar.push({ id: crypto.randomBytes(4).toString('hex'), nome: `Apontamentos de ${relogio.aulaAtiva}`, tipo: 'apontamento' });
        core._salvarBancoDeDados(); forcarSyncAluno(a.id);
        res.json({sucesso: true, msg: "Concluíste a aula brilhantemente! +400 EXP e Apontamentos guardados."});
    } catch(e) { res.status(500).json({erro:"Erro ao concluir aula."}); }
});

app.post('/api/biblioteca/ler', async (req, res) => { try { const r = await core.lerLivroIA(req.body.id, req.body.assunto); if(r.sucesso) forcarSyncAluno(req.body.id); res.json(r); } catch(e) { res.status(500).json({erro: "O livro trancou-se."}); } });
app.post('/api/biblioteca/prova', async (req, res) => { try { const r = await core.fazerProvaIA(req.body.id, req.body.resposta); if(r.sucesso) { io.emit('pontuacao_atualizada', core.pontuacaoCasas); forcarSyncAluno(req.body.id); } res.json(r); } catch(e) { res.status(500).json({erro: "A pena partiu-se."}); } });
app.post('/api/biblioteca/manuscrito', async (req, res) => { try { const r = await core.submeterManuscrito(req.body.id, req.body.texto); if(r.sucesso) forcarSyncAluno(req.body.id); res.json(r); } catch(e) { res.status(500).json({erro: "Tinta borrada."}); } });
app.post('/api/biblioteca/criar_feitico', async (req, res) => { try { const r = await core.criarNovoFeitico(req.body.id, req.body.tese); if(!r.erro) forcarSyncAluno(req.body.id); res.json(r); } catch(e) { res.status(500).json({erro: "A magia falhou."}); } });
app.post('/api/biblioteca/copiar', (req, res) => {
    try {
        const a = core.alunos[req.body.id]; if(a.galeoes < 5) return res.status(403).json({erro: "Precisas de 5 Galeões."});
        a.galeoes -= 5; a.mochilaEscolar.push({ id: crypto.randomBytes(4).toString('hex'), nome: `Cópia: ${req.body.titulo}`, tipo: 'apontamento' });
        core._salvarBancoDeDados(); forcarSyncAluno(a.id); res.json({sucesso: true, msg: "Fizeste uma cópia do pergaminho para a tua mochila! (Custou 5G)"});
    } catch(e) { res.status(500).json({erro: "O tinteiro derramou."}); }
});
app.post('/api/livros/abrir', async (req, res) => { 
    try { 
        const a = core.alunos[req.body.id]; if(!a || !a.inventario.livros.includes(req.body.nomeLivro)) return res.status(403).json({erro: "Não possuis este livro."});
        const textoGerado = await core.cerebroIA.gerarCapituloLivro(req.body.nomeLivro); res.json({ sucesso: true, texto: textoGerado }); 
    } catch(e) { res.status(500).json({erro: "A magia da Biblioteca falhou (Erro 500 evitado)."}); } 
});

// ==============================================================================
// 6. INVENTÁRIO (Sapos, Álbum e Poções)
// ==============================================================================
app.post('/api/inventario/abrir_sapo', (req, res) => {
    try {
        const a = core.alunos[req.body.id];
        const idx = a.mochilaEscolar.findIndex(i => i.nome.includes('Sapo de Chocolate'));
        if(idx === -1) return res.status(403).json({erro: "Não tens Sapos de Chocolate!"});
        
        a.mochilaEscolar.splice(idx, 1); 
        
        // 🔥 CORREÇÃO: Agora o Sapo recupera FOCO além da energia base!
        a.energia = Math.min(100, (parseInt(a.energia) || 0) + 25);
        a.focoAtual = Math.min(a.maxFoco, (parseInt(a.focoAtual) || 0) + 5); // Recupera 5 pontos de Foco
        
        if(!a.colecaoFigurinhas) a.colecaoFigurinhas = [];
        
        const bruxos = ["Albus Dumbledore", "Merlin", "Morgana le Fay", "Godric Gryffindor", "Salazar Slytherin", "Helga Hufflepuff", "Rowena Ravenclaw", "Gellert Grindelwald", "Nicolas Flamel", "Newt Scamander"];
        const cartaSorteada = bruxos[Math.floor(Math.random() * bruxos.length)];
        if(!a.colecaoFigurinhas.includes(cartaSorteada)) a.colecaoFigurinhas.push(cartaSorteada);
        
        core._salvarUrgente(); // Usa o salvamento c/ prioridade
        forcarSyncAluno(a.id);
        res.json({sucesso: true, carta: cartaSorteada, msg: `Comeste o Sapo e sentes a magia a voltar!`});
    } catch(e) { res.status(500).json({erro: "O sapo fugiu."}); }
});

app.post('/api/inventario/recompensa_album', (req, res) => {
    try {
        const a = core.alunos[req.body.id];
        if(!a.colecaoFigurinhas || a.colecaoFigurinhas.length < 10) return res.status(403).json({erro: "Ainda não tens todas as figurinhas!"});
        if(a.albumReivindicado) return res.status(403).json({erro: "Já reivindicaste esta recompensa."});
        
        a.albumReivindicado = true; a.galeoes += 5000; a.atributos.feiticos += 5; a.atributos.defesa += 5;
        core._salvarBancoDeDados(); forcarSyncAluno(a.id);
        res.json({sucesso: true, msg: "O Ministério enviou-te 5000 Galeões e +5 Atributos por completares a coleção!"});
    } catch(e) { res.status(500).json({erro:"Erro."}); }
});

app.post('/api/inventario/empacotar_carta', (req, res) => {
    try {
        const a = core.alunos[req.body.id]; const carta = req.body.carta;
        const contagem = a.colecaoFigurinhas.filter(c => c === carta).length;
        if(contagem <= 1) return res.status(400).json({erro: "Só podes empacotar figurinhas repetidas!"});
        
        const index = a.colecaoFigurinhas.indexOf(carta); a.colecaoFigurinhas.splice(index, 1);
        a.mochilaEscolar.push({ id: crypto.randomBytes(4).toString('hex'), nome: `Carta: ${carta}`, tipo: 'reliquia' });
        core._salvarBancoDeDados(); forcarSyncAluno(a.id);
        res.json({sucesso: true, msg: "A figurinha foi colocada na mochila e está pronta para ser vendida!"});
    } catch(e) { res.status(500).json({erro: "Erro ao empacotar."}); }
});

app.post('/api/pocoes/preparar', async (req, res) => { try { const r = await core.prepararPocao(req.body.id, req.body.ingredientes); if(!r.erro) forcarSyncAluno(req.body.id); res.json(r); } catch(e) { res.status(500).json({erro: "O caldeirão derreteu."}); } });

// ==============================================================================
// 7. MAGIA, COMBATE E PVP
// ==============================================================================
// ==============================================================================
// 7. MAGIA, COMBATE E PVP (Consolidado e Blindado)
// ==============================================================================
app.post('/api/magia/equipar', (req, res) => { try { const r = core.equiparFeitico(req.body.id, req.body.feiticoId); if (r.sucesso) forcarSyncAluno(req.body.id); res.json(r); } catch(e) { res.status(500).json({erro: "Erro."}); } });

app.post('/api/dungeon/iniciar', async (req, res) => {
    try {
        const { id, local } = req.body;
        const r = await core.entrarDungeon(id, local);

        if(r.sucesso) {
            // Guarda instantaneamente para evitar rollback
            if (typeof core._salvarUrgente === 'function') core._salvarUrgente();

            const aluno = core.alunos[id];
            let roomInst = r.idInstancia;

            // Suporte a Grupos Multiplayer (Party)
            if(aluno.partyId && core.parties[aluno.partyId]) {
                core.parties[aluno.partyId].membros.forEach(mId => {
                    let s = Array.from(global.io.sockets.sockets.values()).find(sock => sock.rooms.has(`priv_${mId}`));
                    if(s) s.join(roomInst);
                    if(mId !== id) global.io.to(`priv_${mId}`).emit('puxado_para_dungeon', r);
                });
            } else {
                let s = Array.from(global.io.sockets.sockets.values()).find(sock => sock.rooms.has(`priv_${id}`));
                if(s) s.join(roomInst);
            }
        }
        res.json(r);
    } catch(e) {
        console.error("Falha ao iniciar Masmorra:", e);
        res.status(500).json({erro: "A masmorra colapsou devido a instabilidade mágica."});
    }
});

app.post('/api/dungeon/fugir', (req, res) => {
    try { const inst = core.dungeonInstancias[req.body.instId]; if(inst) inst.status = 'fugiu'; res.json({sucesso: true}); }
    catch(e) { res.status(500).json({erro: "Erro ao fugir."}); }
});

app.post('/api/combate/action', async (req, res) => {
    try {
        const r = await core.processarActionCombat(req.body.id, req.body.instId, req.body.feiticoId, req.body.alvoIdx);
        if (r.bossMorto || r.novaFase) forcarSyncAluno(req.body.id);
        res.json(r);
    } catch(e) { res.status(500).json({ erro: "A magia ricocheteou no servidor." }); }
});

app.post('/api/pvp/entrar_fila', (req, res) => { try { res.json(core.entrarFilaPvP(req.body.id, io)); } catch(e) { res.status(500).json({erro: "Fechado."}); } });
app.post('/api/pvp/action', (req, res) => { try { res.json(core.processarAcaoPvP(req.body.id, req.body.instId, req.body.feiticoId, io)); } catch(e) { res.status(500).json({erro: "Falha mágica."}); } });
app.post('/api/evento/atacar_boss', (req, res) => { try { res.json(core.atacarWorldBossGlobal(req.body.id)); forcarSyncAluno(req.body.id); } catch(e) { res.status(500).json({erro:"O boss rugiu alto."}); } });
// ==============================================================================
// 8. ESTUFA (HERBOLOGIA)
// ==============================================================================
app.post('/api/estufa/plantar', (req, res) => {
    try {
        const a = core.alunos[req.body.id]; const semente = req.body.semente;
        if(!a.inventario.sementes || !a.inventario.sementes[semente] || a.inventario.sementes[semente] <= 0) return res.status(400).json({erro: "Não tens sementes desta planta!"});
        const pote = a.estufa.find(p => p.id === req.body.poteId);
        if(pote.plantada) return res.status(400).json({erro: "O vaso já está ocupado."});
        
        a.inventario.sementes[semente] -= 1; pote.plantada = true; pote.tipo = semente; pote.plantaTempo = Date.now(); pote.cuidada = false;
        core._salvarBancoDeDados(); res.json({sucesso: true, msg: `Plantaste ${semente}!`});
    } catch(e) { res.status(500).json({erro: "Erro ao mexer na terra."}); }
});

app.post('/api/estufa/cuidar', (req, res) => {
    try {
        const a = core.alunos[req.body.id]; if(a.focoAtual < 1) return res.status(400).json({erro: "Precisas de 1 de Foco."});
        const pote = a.estufa.find(p => p.id === req.body.poteId);
        if(!pote.plantada) return res.status(400).json({erro: "Vaso vazio."});
        if(pote.cuidada) return res.status(400).json({erro: "Já cuidaste desta planta."});

        a.focoAtual -= 1; pote.cuidada = true; pote.plantaTempo -= 30000; 
        core._salvarBancoDeDados(); res.json({sucesso: true, msg: `Lançaste Herbivicus! A planta crescerá mais rápido.`});
    } catch(e) { res.status(500).json({erro: "A magia ricocheteou."}); }
});

app.post('/api/estufa/colher', async (req, res) => {
    try {
        const a = core.alunos[req.body.id]; const pote = a.estufa.find(p => p.id === req.body.poteId);
        if(!pote.plantada) return res.status(400).json({erro: "Vaso vazio."});
        if((Date.now() - pote.plantaTempo) < 60000) return res.status(400).json({erro: "Ainda não está madura!"});
        
        const rendimento = pote.cuidada ? (Math.floor(Math.random() * 3) + 3) : (Math.floor(Math.random() * 2) + 1); 
        if(!a.inventario.ingredientes) a.inventario.ingredientes = {};
        a.inventario.ingredientes[pote.tipo] = (a.inventario.ingredientes[pote.tipo] || 0) + rendimento;
        
        const tipoColhido = pote.tipo; pote.plantada = false; pote.tipo = null; pote.plantaTempo = null; pote.cuidada = false;
        await core._addXp(a, 80); core._salvarBancoDeDados();
        res.json({sucesso: true, msg: `Colheita Perfeita! Obtiveste +${rendimento} ${tipoColhido} e 80 EXP!`});
    } catch(e) { res.status(500).json({erro: "A raiz secou."}); }
});

// ==============================================================================
// 9. GREMIOS E STATUS EXTRAS
// ==============================================================================
app.post('/api/gremio/criar', (req, res) => { try { const r = core.criarGremio(req.body.id, req.body.nome); if(!r.erro) forcarSyncAluno(req.body.id); res.json(r); } catch(e) { res.status(500).json({erro: "Falha."}); } });
app.post('/api/perfil/titulo', async (req, res) => {
    const { id } = req.body;
    const a = core.alunos[id];
    if(!a) return res.json({erro: "Erro de estudante."});
    if(a.focoAtual < 5) return res.json({erro: "Precisas de 5 de Foco."});
    
    // 🔥 NOVO: Exigência de 500 Galeões
    if(a.galeoes < 500) return res.json({erro: "O Ministério exige uma taxa de 500 Galeões para avaliar a tua honraria."});

    const r = await core.cerebroIA.gerarTituloBruxo(a);
    if(r && r.titulo) {
        a.focoAtual -= 5;
        a.galeoes -= 500;
        a.titulo = r.titulo;
        if (typeof core._salvarUrgente === 'function') core._salvarUrgente();
        res.json(r);
    } else {
        res.json({erro: "O Ministério negou o pedido. Tenta novamente mais tarde."});
    }
});
app.get('/api/quiz/novo', async (req, res) => { try { res.json(await core.cerebroIA.gerarQuizIA()); } catch(e) { res.status(500).json({erro: "Oráculo ocupado."}); } });


app.post('/api/tts', async (req, res) => {
    try {
        const response = await fetch("https://api-inference.huggingface.co/models/facebook/mms-tts-por", {
            headers: { "Authorization": `Bearer ${process.env.HF_TOKEN || "SEU_TOKEN"}`, "Content-Type": "application/json" },
            method: "POST", body: JSON.stringify({ inputs: req.body.text }),
        });
        if (!response.ok) throw new Error("A API da IA recusou o feitiço vocal.");
        res.set('Content-Type', 'audio/flac'); res.send(Buffer.from(await response.arrayBuffer()));
    } catch (e) { res.status(500).json({erro: "Falha na geração de voz."}); }
});
// SOCKETS E INTERATIVIDADE
io.on('connection', (socket) => {
    socket.emit('relogio_hogwarts', RelogioHogwarts.obterHorarioAtual());
    socket.emit('pontuacao_atualizada', core.pontuacaoCasas);

// =====================================
    // SISTEMA MMO: CONVITES E GRUPOS
    // =====================================
    socket.on('enviar_convite_grupo', (dados) => {
        // Procura o alvo pelo Nome exato
        let alvo = Object.values(core.alunos).find(a => a.nome.toLowerCase() === dados.alvoNome.toLowerCase());
        if(alvo) {
            io.to(`priv_${alvo.id}`).emit('receber_convite_grupo', { liderId: dados.meuId, liderNome: dados.meuNome });
            io.to(`priv_${dados.meuId}`).emit('nova_mensagem', { canal: 'zona', autor: 'SISTEMA', texto: `Convite de Grupo enviado para ${alvo.nome}.` });
        } else {
            io.to(`priv_${dados.meuId}`).emit('nova_mensagem', { canal: 'zona', autor: 'SISTEMA', texto: `Bruxo '${dados.alvoNome}' não está no Castelo.` });
        }
    });

    socket.on('multiplayer_spell', (dados) => {
        // Transmite a renderização visual da magia para os aliados na Masmorra
        socket.to(dados.instId).emit('render_multiplayer_spell', dados);
    });

    socket.on('aceitar_convite_grupo', (dados) => {
        const lider = core.alunos[dados.liderId]; const eu = core.alunos[dados.meuId];
        if(!lider || !eu) return;
        
        // Cria a party se não existir
        if(!lider.partyId) {
            lider.partyId = `party_${crypto.randomBytes(4).toString('hex')}`;
            if(!core.parties) core.parties = {};
            core.parties[lider.partyId] = { lider: lider.id, membros: [lider.id] };
        }
        
        eu.partyId = lider.partyId;
        if(!core.parties[lider.partyId].membros.includes(eu.id)) core.parties[lider.partyId].membros.push(eu.id);
        
        core._salvarBancoDeDados();
        forcarSyncAluno(lider.id); forcarSyncAluno(eu.id);
        
        io.to(`priv_${lider.id}`).emit('nova_mensagem', { canal: 'zona', autor: '🤝 GRUPO', texto: `${eu.nome} juntou-se ao teu grupo!` });
        io.to(`priv_${eu.id}`).emit('nova_mensagem', { canal: 'zona', autor: '🤝 GRUPO', texto: `Entraste no grupo de ${lider.nome}!` });
    });
    socket.on('entrar_chat', (dados) => { 
        socket.join('salaoPrincipal'); 
        if(dados.casa) socket.join(`comum_${dados.casa}`); 
        socket.join(`priv_${dados.idAluno}`); 
    });
    
    socket.on('entrar_zona_castelo', async (dados) => {
        socket.rooms.forEach(r => { if(r.startsWith('zona_')) socket.leave(r); });
        socket.join(`zona_${dados.zona}`);
        io.to(`zona_${dados.zona}`).emit('nova_mensagem', { canal: 'zona', autor: '🏰 [SISTEMA]', texto: `${dados.nome} entrou em ${dados.zona}.` });
        
        core.cerebroIA.gerarAtmosferaLocal(dados.zona).then(ambienteMsg => {
            if(ambienteMsg) io.to(`zona_${dados.zona}`).emit('nova_mensagem', { canal: 'zona', autor: '✨ [AMBIENTE]', texto: ambienteMsg });
        });
    });

    socket.on('mensagem_chat', async (dados) => {
        const payload = { autor: `[${dados.remetenteCasa.substring(0,3)}] ${dados.remetenteNome}`, texto: dados.texto, hora: new Date().toLocaleTimeString() };
        let roomEmit = dados.canal === 'salaComum' ? `comum_${dados.casaNome}` : (dados.canal === 'zona' ? `zona_${dados.zona}` : 'salaoPrincipal');
        
        if (dados.canal === 'aula') {
            roomEmit = 'sala_de_aula';
            if (!socket.rooms.has('sala_de_aula')) socket.join('sala_de_aula');
        }

        io.to(roomEmit).emit('nova_mensagem', { canal: dados.canal, ...payload });

        if (dados.canal === 'zona') {
            const respIA = await core.cerebroIA.gerarRespostaPersonagemIA(dados.zona, dados.remetenteNome, dados.texto, dados.remetenteCasa);
            if (respIA && respIA.personagem !== "Nenhum" && respIA.texto) {
                setTimeout(() => { 
                    io.to(roomEmit).emit('nova_mensagem', { canal: 'zona', autor: `👻 [${respIA.personagem}]`, texto: respIA.texto }); 
                    if(respIA.pontos && respIA.pontos !== 0) { 
                        core.adicionarPontosCasa(dados.remetenteCasa, respIA.pontos); 
                        io.emit('pontuacao_atualizada', core.pontuacaoCasas); 
                    }
                }, 1500);
            }
        }

        if (dados.canal === 'aula') {
            const relogio = RelogioHogwarts.obterHorarioAtual();
            if(relogio.professorAtivo !== 'Nenhum') {
                const respProf = await core.cerebroIA.respostaProfessorIA(relogio.professorAtivo, relogio.aulaAtiva, dados.remetenteNome, dados.texto, dados.remetenteCasa);
                if(respProf && respProf.texto) {
                    setTimeout(() => { 
                        io.to('sala_de_aula').emit('nova_mensagem', { canal: 'aula', autor: `🎓 [Prof. ${relogio.professorAtivo}]`, texto: respProf.texto });
                        if(respProf.pontos && respProf.pontos !== 0) { 
                            core.adicionarPontosCasa(dados.remetenteCasa, respProf.pontos); 
                            io.emit('pontuacao_atualizada', core.pontuacaoCasas); 
                        }
                    }, 2000);
                }
            }
        }
    });

    socket.on('boss_ataque_aviso', (data) => { socket.to(data.instId).emit('alerta_boss', { tempoCast: data.tempoCast }); });
    // No bloco de sockets do Quadribol em server.js:
    socket.on('q_entrar', (dados) => { 
        const r = core.entrarQuadribol(dados.id, dados.pos); 
        if(r.sucesso) socket.join(r.matchId); 
    });
    // MUDE ISTO: (Substitua dx/dy para vx/vy para corresponder ao front)
    socket.on('q_mover', (dados) => { if(core.quadribol) core.quadribol.acaoJogador(dados.matchId, dados.id, { vX: dados.vx, vY: dados.vy }); });
    socket.on('q_acao', (dados) => { if(core.quadribol) core.quadribol.acaoJogador(dados.matchId, dados.id, { acao: dados.acao }); });
});

async function iniciarSistema() {
    Lexicon.DespertarMatriz("HOGWARTS_AETERNA_AAA"); 
    await inicializarServidor();
    server.listen(PORT, '0.0.0.0', () => { 
        console.log(`🏰 O Expresso de Hogwarts chegou à porta ${PORT}`); 
        setInterval(() => { core.tickServerGlobal(); }, 2000); 
    });
}

iniciarSistema();