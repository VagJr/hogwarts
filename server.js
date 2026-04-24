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
const fs = require('fs');

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
// 🔥 SISTEMA ANTI-SONO PARA O RENDER FREE TIER
app.get('/api/ping', (req, res) => {
    res.status(200).send('Servidor de Hogwarts Acordado!');
});

const core = new HogwartsCore();
// Inicializar a gestão de grupos
core.grupos = {}; // Formato: { liderId: { lider: id, membros: [id1, id2, id3] } }



	
	function darRecompensa(alunoId, xp, galeoes, dropItens) {
let aluno = core.alunos[socket.idAluno];
if (!aluno) return; // ← Essa linha previne o erro!


    let liderId = aluno.partyId; // Usa a partyId que ligámos no passo 1
    
    if (liderId && core.grupos[liderId]) {
        let membrosOnline = core.grupos[liderId].membros;
        let xpDividido = Math.floor((xp / membrosOnline.length) * 1.2);
        let goldDividido = Math.floor(galeoes / membrosOnline.length);

        membrosOnline.forEach(mId => {
            let membro = core.alunos[mId];
            if(membro) {
                membro.galeoes += goldDividido;
                core.ganharXp(membro, xpDividido);
                io.to(`priv_${mId}`).emit('nova_mensagem', { canal: 'zona', autor: 'SISTEMA', texto: `O teu grupo derrotou um inimigo! +${xpDividido} XP, +${goldDividido} G` });
            }
        });
    } else {
        aluno.galeoes += galeoes;
        core.ganharXp(aluno, xp);
    }
    core._salvarUrgente();
}

function iniciarDueloPvP(jogador1, jogador2) {
    let matchId = crypto.randomBytes(4).toString('hex');
    core.arenas[matchId] = { id: matchId, j1: jogador1.id, j2: jogador2.id };
    io.to(`priv_${jogador1.id}`).emit('pvp_iniciar', { oponente: jogador2, matchId: matchId, equipa: 'A' });
    io.to(`priv_${jogador2.id}`).emit('pvp_iniciar', { oponente: jogador1, matchId: matchId, equipa: 'B' });
}
// =====================================================================
// 🚀 INICIALIZAÇÃO DE BANCO DE DADOS BLINDADA (RENDER + ATLAS)
// =====================================================================
async function inicializarServidor() {
    console.log("A invocar os feitiços de proteção de Gringotes...");

    if (MONGO_URI) {
        try {
            // 1. CONEXÃO OTIMIZADA PARA RENDER (Sem o keepAlive descontinuado)
            const client = new MongoClient(MONGO_URI, {
                maxPoolSize: 50,
                serverSelectionTimeoutMS: 5000,
                socketTimeoutMS: 45000
            }); 

            await client.connect();
            const db = client.db('hogwarts_db'); 
            
            // 2. NOVAS COLEÇÕES SEPARADAS (O Segredo do Sucesso)
            core.col_sistema = db.collection('sistema_global'); // Casas, Mercado, Feitiços
            core.col_alunos = db.collection('alunos');          // Cada jogador será 1 documento
            core.db_biblioteca = db.collection('biblioteca_oficial');
            core.backup_collection = db.collection('backups_seguranca');

            // =================================================================
            // 🔄 SISTEMA DE AUTO-MIGRAÇÃO (Resgata dados do Fly.io)
            // =================================================================
            const legacyCollection = db.collection('registos_escolares');
            const docLegado = await legacyCollection.findOne({ _id: 'MATRIZ_HOGWARTS' });

            if (docLegado && docLegado.alunos && Object.keys(docLegado.alunos).length > 0) {
                console.log("⚠️ ATENÇÃO: Formato antigo detetado! A iniciar migração blindada...");
                
                // 1. Move os alunos para a nova coleção (BulkWrite é ultra rápido)
                const opsAlunos = Object.values(docLegado.alunos).map(aluno => ({
                    updateOne: {
                        filter: { _id: aluno.id }, // Usa o ID do bruxo como ID do documento
                        update: { $set: aluno },
                        upsert: true
                    }
                }));
                if (opsAlunos.length > 0) await core.col_alunos.bulkWrite(opsAlunos);

                // 2. Salva o resto do sistema
                await core.col_sistema.updateOne(
                    { _id: 'MATRIZ_SISTEMA' },
                    { $set: {
                        mercadoJogadores: docLegado.mercadoJogadores || [],
                        pontuacaoCasas: docLegado.pontuacaoCasas || { Gryffindor: 0, Slytherin: 0, Ravenclaw: 0, Hufflepuff: 0, lider: 'Empate', fimCiclo: Date.now() + 604800000 },
                        gremios: docLegado.gremios || {},
                        livroDeFeiticos: docLegado.livroDeFeiticos || {}
                    }},
                    { upsert: true }
                );

                // 3. Renomeia a coleção antiga para evitar que a migração rode duas vezes
                await legacyCollection.rename('registos_escolares_old_backup');
                console.log("✅ Migração Concluída com Sucesso! Bem-vindo à nova Era de Hogwarts.");
            }

            // =================================================================
            // 📥 CARREGAMENTO DO JOGO (BOOT)
            // =================================================================
            console.log("📜 A carregar jogadores e sistema do Atlas...");
            
            // Carrega TODOS os alunos individualmente para a RAM
            const todosAlunos = await core.col_alunos.find({}).toArray();
            core.alunos = {};
            todosAlunos.forEach(a => { core.alunos[a._id] = a; }); // Usa o _id para montar o objeto na RAM

            // Carrega o Sistema Global
            let sysDoc = await core.col_sistema.findOne({ _id: 'MATRIZ_SISTEMA' });
            
            if (sysDoc) {
                core.mercadoJogadores = sysDoc.mercadoJogadores || [];
                core.pontuacaoCasas = sysDoc.pontuacaoCasas || { Gryffindor: 0, Slytherin: 0, Ravenclaw: 0, Hufflepuff: 0, lider: 'Empate', fimCiclo: Date.now() + 604800000 };
                core.gremios = sysDoc.gremios || {};
                
                // Protege o Grimório Base e puxa os Customs
                if (sysDoc.livroDeFeiticos) {
                    for (let key in sysDoc.livroDeFeiticos) {
                        if (key.startsWith('custom_')) {
                            core.livroDeFeiticos[key] = sysDoc.livroDeFeiticos[key];
                        }
                    }
                }
            } else if (todosAlunos.length === 0) {
                console.log("⚠️ Base de dados completamente limpa. A iniciar novo universo.");
                core.pontuacaoCasas = { Gryffindor: 0, Slytherin: 0, Ravenclaw: 0, Hufflepuff: 0, lider: 'Empate', fimCiclo: Date.now() + 604800000 };
            }

            console.log(`✅ Conexão Gringotes Estabelecida! Jogadores carregados: ${todosAlunos.length}`);

        } catch (error) { 
            console.error("❌ Falha crítica na conexão a Gringotes!", error); 
        }
    }

    // 3. INJEÇÃO DOS LIVROS PADRÃO (Livraria)
    const materiasParaGerar = [
        { m: "Feitiços", l: "Livro Padrão de Feitiços" }, { m: "Poções", l: "Poções Avançadas" },
        { m: "Transfiguração", l: "Guia de Transfiguração" }, { m: "Herbologia", l: "Mil Ervas Mágicas" },
        { m: "D.C.A.T.", l: "As Forças das Trevas" }, { m: "Trato de Criaturas Mágicas", l: "O Livro Monstruoso dos Monstros" },
        { m: "Adivinhação", l: "Esclarecendo o Futuro" }, { m: "Aritmancia", l: "Numerologia e Gramática" },
        { m: "Runas Antigas", l: "Dicionário de Runas" }, { m: "Astronomia", l: "O Céu Noturno" },
        { m: "Alquimia", l: "Alquimia, O Guia Prático" }, { m: "História da Magia", l: "História da Magia" },
        { m: "Estudos dos Muggles", l: "Vida Doméstica dos Muggles" }, { m: "Voo", l: "Quadribol Através dos Séculos" }
    ];

    core.lojasBeco.floreios = [];
    let idCounter = 1;
    for (const mat of materiasParaGerar) {
        core.lojasBeco.floreios.push({ id: `l_${idCounter++}`, nome: `${mat.l} (Ano 1)`, tipo: "livro", preco: 25 });
    }

    // =====================================================================
    // 💾 SISTEMA DE SALVAMENTO BLINDADO E FRACIONADO
    // =====================================================================
    let salvandoNesteMomento = false;
    let existeSalvamentoPendente = false;

    const gravarDiretoNoAtlas = async () => {
        if (!core.col_sistema || !core.col_alunos) return;
        
        if (salvandoNesteMomento) {
            existeSalvamentoPendente = true;
            return;
        }
        
        salvandoNesteMomento = true;
        existeSalvamentoPendente = false;

        try {
            // 1. Salvar Variáveis do Mundo (Mercado, Casas, Guildas)
            await core.col_sistema.updateOne(
                { _id: 'MATRIZ_SISTEMA' }, 
                { $set: {
                    mercadoJogadores: core.mercadoJogadores, 
                    pontuacaoCasas: core.pontuacaoCasas, 
                    gremios: core.gremios,
                    livroDeFeiticos: core.livroDeFeiticos
                }}, 
                { upsert: true }
            );

            // 2. Salvar Jogadores Isoladamente usando BULK WRITE (Foge ao limite de 16MB)
            const alunosArray = Object.values(core.alunos);
            if (alunosArray.length > 0) {
                const bulkOps = alunosArray.map(aluno => ({
                    updateOne: {
                        filter: { _id: aluno.id }, // Procura o documento pelo ID do aluno
                        update: { $set: aluno },   // Atualiza os dados
                        upsert: true               // Se a conta for nova, cria no banco!
                    }
                }));
                // Executa tudo de uma vez. 'ordered: false' faz com que se um der erro, os outros gravem na mesma.
                await core.col_alunos.bulkWrite(bulkOps, { ordered: false });
            }
            
            console.log(`💾 [ATLAS] Progresso salvo com SUCESSO! (${new Date().toLocaleTimeString('pt-PT')})`);
        } catch(e) { 
            console.error("❌ ERRO CRÍTICO AO GRAVAR NO ATLAS:", e.message); 
            existeSalvamentoPendente = true;
        }
        
        salvandoNesteMomento = false;
        
        if (existeSalvamentoPendente) {
            setTimeout(gravarDiretoNoAtlas, 3000); 
        }
    };

    // Liga o Core a este novo motor
    core._salvarBancoDeDados = gravarDiretoNoAtlas;
    core._salvarUrgente = gravarDiretoNoAtlas;

    // =====================================================================
    // 🛡️ PREVENÇÃO CONTRA O "SONO" DO RENDER (SIGTERM / SHUTDOWN)
    // =====================================================================
    const DesligarServidorSeguro = async () => {
        console.log("⚠️ Render a forçar o encerramento! A disparar Salvamento Final Rápido...");
        await gravarDiretoNoAtlas();
        console.log("✅ Gravação final bem sucedida! A desligar...");
        process.exit(0);
    };

    process.on('SIGTERM', DesligarServidorSeguro);
    process.on('SIGINT', DesligarServidorSeguro);
    process.on('uncaughtException', async (err) => {
        console.error("❌ CRASH CRÍTICO DO NODE DETETADO:", err);
        await DesligarServidorSeguro();
    });

    // =====================================================================
    // 📦 BACKUP FÍSICO SEGURO (A CADA 60 MINUTOS)
    // =====================================================================
    setInterval(async () => {
        if (!core.backup_collection) return;
        console.log("📦 A iniciar rotina de Backup de Segurança Global...");
        
        try {
            await core.backup_collection.insertOne({
                timestamp: Date.now(),
                data_humana: new Date().toLocaleString('pt-PT'),
                sistema: {
                    mercadoJogadores: core.mercadoJogadores, 
                    pontuacaoCasas: core.pontuacaoCasas, 
                    gremios: core.gremios,
                    livroDeFeiticos: core.livroDeFeiticos
                },
                quantidade_alunos: Object.keys(core.alunos).length 
            });

            // Mantém os últimos 12 backups
            const backupsAntigos = await core.backup_collection.find().sort({ timestamp: -1 }).skip(12).toArray();
            for (let b of backupsAntigos) {
                await core.backup_collection.deleteOne({ _id: b._id });
            }
            console.log("✅ Backup de Segurança gerado.");
        } catch (e) {
            console.error("❌ Falha no Backup Secundário:", e.message);
        }
    }, 3600000); 

    // O Scriptorium (Máquina de Escrever em Background) continua como estava...
    async function iniciarForjaDeLivrosEmBackground() {
        if (!core.db_biblioteca) {
            console.log("❌ [SCRIPTORIUM] Base de dados inacessível. O Monge volta a dormir.");
            return;
        }
        console.log("🧙‍♂️ [SCRIPTORIUM] O Monge Arquivista acordou. A forjar livros em background...");
        
        for (const mat of materiasParaGerar) {
            let nomeLivro = `${mat.l} (Ano 1)`;
            let materia = mat.m;

            let livroDoc = await core.db_biblioteca.findOne({ nomeLivro: nomeLivro });
            
            if (!livroDoc) {
                console.log(`[SCRIPTORIUM] A ditar o Índice para: ${nomeLivro}...`);
                const ementa = await core.cerebroIA.gerarEmentaLivro(materia, 1);
                
                if (ementa && ementa.length > 0) {
                    livroDoc = { materia: materia, ano: 1, nomeLivro: nomeLivro, capitulos: ementa };
                    await core.db_biblioteca.insertOne(livroDoc);
                    console.log(`[SCRIPTORIUM] Índice guardado! A descansar a mente por 10 segundos...`);
                    await new Promise(resolve => setTimeout(resolve, 10000));
                } else {
                    console.log(`[SCRIPTORIUM] Falha no Índice. Tentarei no próximo ciclo.`);
                    continue; 
                }
            }

            let mapaDoLivro = livroDoc.capitulos.map(c => `Cap.${c.cap}: ${c.titulo}`).join(" | ");

            for (let i = 0; i < livroDoc.capitulos.length; i++) {
                let cap = livroDoc.capitulos[i];
                
                if (!cap.teoria) { 
                    console.log(`[SCRIPTORIUM] A redigir o Capítulo ${cap.cap} de ${nomeLivro}...`);
                    
                    const novoTexto = await core.cerebroIA.escreverCapituloColossal(materia, cap.titulo, cap.cap, mapaDoLivro);
                    
                    if (novoTexto && novoTexto.trocarChave) {
                        console.log(`[SCRIPTORIUM] ⚠️ Tinta gasta! O Monge trocou de pena mágica. A descansar 60 segundos...`);
                        await new Promise(resolve => setTimeout(resolve, 60000)); 
                        i--; 
                        continue;
                    }

                    if (novoTexto && novoTexto.rateLimit) {
                        console.log(`[SCRIPTORIUM] ⚠️ ENERGIA DIÁRIA TOTAL ESGOTADA! 🛌 Dormir por 1 HORA...`);
                        await new Promise(resolve => setTimeout(resolve, 3600000));
                        i--; 
                        continue;
                    }

                    if (novoTexto && novoTexto.teoria) {
                        livroDoc.capitulos[i].teoria = novoTexto.teoria;
                        livroDoc.capitulos[i].pratica = novoTexto.pratica;
                        livroDoc.capitulos[i].pergunta = novoTexto.pergunta;
                        
                        await core.db_biblioteca.updateOne(
                            { nomeLivro: nomeLivro }, 
                            { $set: { capitulos: livroDoc.capitulos } }
                        );
                        console.log(`[SCRIPTORIUM] Capítulo ${cap.cap} finalizado com ÊXITO!`);
                        
                        await new Promise(resolve => setTimeout(resolve, 25000)); 
                    } else {
                        console.log(`[SCRIPTORIUM] A pena quebrou no Cap ${cap.cap}. A aguardar 15 segundos...`);
                        await new Promise(resolve => setTimeout(resolve, 15000));
                        i--; 
                    }
                }
            }
        }
        console.log("📚 [SCRIPTORIUM] TAREFA CONCLUÍDA! Toda a Biblioteca de Hogwarts foi gerada!");
    }




    // =====================================================================
    // 🧙‍♂️ O MONGE ARQUIVISTA (MÁQUINA DE ESCREVER AUTOMATIZADA EM BACKGROUND)
    // =====================================================================
    async function iniciarForjaDeLivrosEmBackground() {
        if (!core.db_biblioteca) {
            console.log("❌ [SCRIPTORIUM] Base de dados inacessível. O Monge volta a dormir.");
            return;
        }
        console.log("🧙‍♂️ [SCRIPTORIUM] O Monge Arquivista acordou. A forjar livros em background...");
        
        for (const mat of materiasParaGerar) {
            let nomeLivro = `${mat.l} (Ano 1)`;
            let materia = mat.m;

            let livroDoc = await core.db_biblioteca.findOne({ nomeLivro: nomeLivro });
            
            if (!livroDoc) {
                console.log(`[SCRIPTORIUM] A ditar o Índice para: ${nomeLivro}...`);
                const ementa = await core.cerebroIA.gerarEmentaLivro(materia, 1);
                
                if (ementa && ementa.length > 0) {
                    livroDoc = { materia: materia, ano: 1, nomeLivro: nomeLivro, capitulos: ementa };
                    await core.db_biblioteca.insertOne(livroDoc);
                    console.log(`[SCRIPTORIUM] Índice guardado! A descansar a mente por 10 segundos...`);
                    await new Promise(resolve => setTimeout(resolve, 10000));
                } else {
                    console.log(`[SCRIPTORIUM] Falha no Índice. Tentarei no próximo ciclo.`);
                    continue; 
                }
            }

            // 🔥 Cria o mapa do livro (String com todos os títulos) para a IA não se perder
            let mapaDoLivro = livroDoc.capitulos.map(c => `Cap.${c.cap}: ${c.titulo}`).join(" | ");

            for (let i = 0; i < livroDoc.capitulos.length; i++) {
                let cap = livroDoc.capitulos[i];
                
                if (!cap.teoria) { 
                    console.log(`[SCRIPTORIUM] A redigir o Capítulo ${cap.cap} de ${nomeLivro}...`);
                    
                    // Envia a Matéria, o Título, o Número do Cap, e o Mapa Completo!
                    const novoTexto = await core.cerebroIA.escreverCapituloColossal(materia, cap.titulo, cap.cap, mapaDoLivro);
                    
                    if (novoTexto && novoTexto.trocarChave) {
                        console.log(`[SCRIPTORIUM] ⚠️ Tinta gasta! O Monge trocou de pena mágica. A descansar 60 segundos para os limites da API resetarem...`);
                        await new Promise(resolve => setTimeout(resolve, 60000)); // 🔥 Alterado para 60 segundos
                        i--; 
                        continue;
                    }

                    if (novoTexto && novoTexto.rateLimit) {
                        console.log(`[SCRIPTORIUM] ⚠️ ENERGIA DIÁRIA TOTAL ESGOTADA!`);
                        console.log(`[SCRIPTORIUM] 🛌 O Monge vai dormir por 1 HORA para recuperar...`);
                        await new Promise(resolve => setTimeout(resolve, 3600000));
                        i--; 
                        continue;
                    }

                    if (novoTexto && novoTexto.teoria) {
                        livroDoc.capitulos[i].teoria = novoTexto.teoria;
                        livroDoc.capitulos[i].pratica = novoTexto.pratica;
                        livroDoc.capitulos[i].pergunta = novoTexto.pergunta;
                        
                        await core.db_biblioteca.updateOne(
                            { nomeLivro: nomeLivro }, 
                            { $set: { capitulos: livroDoc.capitulos } }
                        );
                        console.log(`[SCRIPTORIUM] Capítulo ${cap.cap} finalizado com ÊXITO! A descansar 25 segundos...`);
                        
                        await new Promise(resolve => setTimeout(resolve, 25000)); 
                    } else {
                        console.log(`[SCRIPTORIUM] A pena quebrou no Cap ${cap.cap}. A aguardar 15 segundos para retentar...`);
                        await new Promise(resolve => setTimeout(resolve, 15000));
                        i--; 
                    }
                }
            }
        }
        console.log("📚 [SCRIPTORIUM] TAREFA CONCLUÍDA! Toda a Biblioteca de Hogwarts foi gerada com sucesso!");
    }
     

    if (MONGO_URI) iniciarForjaDeLivrosEmBackground();
}
    
// <--- ESTE É O FECHO OFICIAL DA FUNÇÃO inicializarServidor() E DEVE ESTAR AQUI!
// ==============================================================================
// 🔥 PATCH 2.0: PETS TAMAGOTCHI E XADREZ BRUXO
// ==============================================================================
app.post('/api/equipamento/desequipar', async (req, res) => {
    const { id, slot } = req.body;
    if (!id || !slot) return res.json({ erro: "Dados incompletos." });
    
    // Chama a função que criámos no HogwartsCore
    const resultado = core.desequiparItem(id, slot);
    res.json(resultado);
});
app.post('/api/pet/adotar', (req, res) => {
    const { id, tipo, nome } = req.body;
    const a = core.alunos[id];
    if(!a) return res.json({erro: "Fantasma."});
    if(a.galeoes < 150) return res.json({erro: "Adoção custa 150 Galeões."});
    if(a.pet && a.pet.adotado) return res.json({erro: "Já tens um mascote!"});
    
    a.galeoes -= 150;
    a.pet = { adotado: true, tipo: tipo, nome: nome, fome: 100, felicidade: 100, nivel: 1, xp: 0, ultimaColeta: Date.now() };
    core._salvarUrgente();
    res.json({sucesso: true, msg: `Adotaste um ${tipo} chamado ${nome}!`});
});

app.post('/api/pet/interagir', (req, res) => {
    const { id, acao } = req.body;
    const a = core.alunos[id];
    if(!a || !a.pet || !a.pet.adotado) return res.json({erro: "Sem mascote."});
    
    if (acao === 'alimentar') {
        if(a.inventario.ingredientes['muco'] > 0 || a.inventario.ingredientes['asfodelo'] > 0) {
            if(a.inventario.ingredientes['muco'] > 0) a.inventario.ingredientes['muco']--;
            else a.inventario.ingredientes['asfodelo']--;
            a.pet.fome = 100;
            res.json({sucesso: true, msg: "Alimentaste o teu Mascote!"});
        } else {
            res.json({erro: "Falta-te Ingredientes (Muco ou Asfódelo) para o alimentar."});
        }
    } 
    else if (acao === 'brincar') {
        if (a.energia < 10) return res.json({erro: "Estás cansado demais para brincar."});
        a.energia -= 10;
        a.pet.felicidade = 100;
        res.json({sucesso: true, msg: "Brincaste com o mascote! (Felicidade Máxima)"});
    }
    else if (acao === 'coletar') {
        const horasPassadas = (Date.now() - a.pet.ultimaColeta) / (1000 * 60 * 60);
        if (horasPassadas < 4) return res.json({erro: "O teu mascote ainda não achou nada (Requer 4h)."});
        if (a.pet.fome < 50 || a.pet.felicidade < 50) return res.json({erro: "O mascote está triste/esfomeado e recusa-se a trabalhar."});
        
        let drop = a.pet.tipo === 'Pelúcio' ? 'Galeões' : 'Ingredientes';
        let recompensa = "";
        if(drop === 'Galeões') { a.galeoes += 80; recompensa = "80 Galeões"; }
        else { 
            a.inventario.ingredientes['bezoar'] = (a.inventario.ingredientes['bezoar'] || 0) + 2; 
            recompensa = "2 Bezoares"; 
        }
        
        a.pet.ultimaColeta = Date.now();
        a.pet.xp += 50;
        if(a.pet.xp >= 100) { a.pet.nivel++; a.pet.xp = 0; }
        res.json({sucesso: true, msg: `O teu ${a.pet.tipo} encontrou: ${recompensa}!`});
    }
    core._salvarUrgente();
});
// 🔥 PATCH 3.0: GUARDA-ROUPA E COSMÉTICOS
app.post('/api/equipamento/comprar_misterio', async (req, res) => {
    const { id, tipo } = req.body;
    if (!id || !tipo) return res.json({ erro: "Dados insuficientes." });
    
    // Agora chama a função de Craft que exige materiais
    const resultado = await core.craftEquipamento(id, tipo);
    res.json(resultado);
});

app.post('/api/equipamento/equipar', async (req, res) => {
    const { id, itemId } = req.body;
    const resultado = core.equiparItem(id, itemId);
    res.json(resultado);
});

// 🔥 MINIGAME: Xadrez Bruxo
app.post('/api/minigame/xadrez', (req, res) => {
    const { id, jogada } = req.body; // jogada: 'Cavalo', 'Bispo', 'Torre'
    const a = core.alunos[id];
    if(!a) return res.json({erro: "Erro."});
    if(a.galeoes < 5) return res.json({erro: "O bilhete de entrada no tabuleiro custa 5 Galeões."});
    
    a.galeoes -= 5;
    const pecasIA = ['Cavalo', 'Bispo', 'Torre'];
    const jogadaIA = pecasIA[Math.floor(Math.random() * pecasIA.length)];
    
    // Regras Mágicas: Cavalo (Agilidade) > Bispo (Magia) > Torre (Força) > Cavalo
    let resultado = 'empate';
    if (jogada === 'Cavalo' && jogadaIA === 'Bispo') resultado = 'vitoria';
    if (jogada === 'Bispo' && jogadaIA === 'Torre') resultado = 'vitoria';
    if (jogada === 'Torre' && jogadaIA === 'Cavalo') resultado = 'vitoria';
    
    if (jogada === 'Bispo' && jogadaIA === 'Cavalo') resultado = 'derrota';
    if (jogada === 'Torre' && jogadaIA === 'Bispo') resultado = 'derrota';
    if (jogada === 'Cavalo' && jogadaIA === 'Torre') resultado = 'derrota';
    
    if (resultado === 'vitoria') {
        a.galeoes += 15; // Lucro de 10
        core.ganharXp(a, 80);
        res.json({sucesso: true, resultado, jogadaIA, msg: `Xeque-Mate! A tua peça destruiu o ${jogadaIA} inimigo. Ganhaste 15G!`});
    } else if (resultado === 'derrota') {
        res.json({sucesso: true, resultado, jogadaIA, msg: `A IA jogou ${jogadaIA} e esmagou a tua peça. Perdeste.`});
    } else {
        a.galeoes += 5; // Devolve o dinheiro
        res.json({sucesso: true, resultado, jogadaIA, msg: `Ambas as peças colidiram! Empate.`});
    }
    core._salvarUrgente();
});
// 🔥 ROTAS DE PROGRESSÃO E RETENÇÃO MOBILE
app.post('/api/personagem/distribuir_pontos', (req, res) => {
    const { id, atributo } = req.body;
    const a = core.alunos[id];
    if(!a || !a.atributosRPG || a.atributosRPG.pontosLivres <= 0) return res.json({erro: "Sem pontos livres."});
    
    if (a.atributosRPG[atributo] !== undefined) {
        a.atributosRPG[atributo]++;
        a.atributosRPG.pontosLivres--;
        core._obterAtributosTotais(a); // Recalcula HP, Foco, etc baseado nos novos status
        core._salvarUrgente();
        res.json({sucesso: true, msg: `${atributo.toUpperCase()} aumentado!`});
    } else {
        res.json({erro: "Atributo inválido."});
    }
});

app.post('/api/castelo/cozinha_stealth', (req, res) => {
    const { id, win } = req.body;
    const a = core.alunos[id];
    if(!a) return res.json({erro: "Fantasma."});
    
    if(win) {
        a.fome = 100;
        a.energia = Math.min(100, a.energia + 20); // Comer dá um pouco de energia
        core._salvarUrgente();
        res.json({sucesso: true, msg: "Banqueteeaste-te com as sobras! Fome restaurada."});
    } else {
        core.adicionarPontosCasa(a.casa, -5);
        res.json({erro: "Foste apanhado pelo Filch! Menos 5 pontos para a tua casa."});
    }
});
// ==============================================================================
// 1. ADMISSÃO E BECO DIAGONAL
// ==============================================================================
app.post('/api/registrar', async (req, res) => { 
    try { 
        // A função core.registrarNovaConta que te dei já faz o check de senha/id
        const r = core.registrarNovaConta(Date.now(), req.body.username, req.body.nomeBruxo, req.body.senha); 
        
        if (r.sucesso) {
            await core._salvarUrgente(); 
        }
        res.json(r); 
    } catch(e) { 
        res.status(500).json({erro: "Erro ao acessar o Grande Livro."}); 
    } 
});
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
if (!core.locksIA) core.locksIA = {}; // Cadeado Anti-Spam Global

// --- ROTAS DA BIBLIOTECA NO SERVER.JS ---

app.post('/api/livros/abrir', async (req, res) => {
    try {
        const a = core.alunos[req.body.id];
        if(!a || !a.inventario.livros.includes(req.body.nomeLivro)) return res.json({erro: "Não tens este livro."});

        // 1. Vai buscar o livro diretamente à base de dados
        let livroDoc = await core.db_biblioteca.findOne({ nomeLivro: req.body.nomeLivro });
        
        // 2. Se o Monge Arquivista ainda não começou a escrever sequer o Índice, diz ao jogador para esperar.
        if (!livroDoc) {
            return res.json({erro: "Os monges arquivistas ainda não catalogaram este tomo. Tenta voltar amanhã."});
        }

        // 3. Devolve a Ementa para a interface montar os botões. (O conteúdo do texto só vai no pacote se o monge já o tiver escrito)
        let indiceLimpo = livroDoc.capitulos.map(c => ({ 
            cap: c.cap, 
            titulo: c.titulo, 
            teoria: c.teoria, // Se o monge já escreveu, isto tem texto. Se não, é null.
            pratica: c.pratica,
            gerado: c.teoria !== null 
        }));
        
        res.json({ sucesso: true, titulo: livroDoc.nomeLivro, capitulos: indiceLimpo });
    } catch(e) { 
        res.status(500).json({erro: "A biblioteca trancou as portas."}); 
    }
});

// --- ROTAS DA BIBLIOTECA NO SERVER.JS (ATUALIZADAS) ---
// --- ROTAS DA BIBLIOTECA NO SERVER.JS (ATUALIZADAS) ---

app.post('/api/biblioteca/gerar_livro', async (req, res) => {
    try {
        const { id, assunto, estilo } = req.body;
        const a = core.alunos[id];
        if(!a) return res.json({erro: "Aluno não encontrado"});
        
        // XP Passivo por invocar conhecimento
        if (a.focoAtual < 2) return res.json({erro: "Foco Insuficiente (Requer 2)."});
        a.focoAtual -= 2;
        core.ganharXp(a, 25); 
        core._salvarUrgente();
        
        const livro = await core.cerebroIA.gerarLivroCompleto(a.nome, assunto, estilo);
        
        // BLINDAGEM: Se a IA falhar e retornar null, damos feedback ao jogador sem crashar!
        if (!livro) return res.json({ erro: "O pergaminho desfez-se em pó durante a escrita. A magia estava instável, tenta de novo." });
        
        res.json(livro);
    } catch(e) {
        console.error("Erro Mágico ao Gerar Livro:", e);
        res.status(500).json({erro: "As estantes da biblioteca trancaram-se."});
    }
});

// ATUALIZAR: Rota da Biblioteca para dar ELO
app.post('/api/biblioteca/avaliar_tese', async (req, res) => {
    try {
        const { id, manuscrito } = req.body;
        const a = core.alunos[id];
        if (!a) return res.json({erro: "O aluno desvaneceu."});
        if (a.focoAtual < 5) return res.json({erro: "Requer 5 de Foco."});
        a.focoAtual -= 5;
        
        let r = await core.cerebroIA.avaliarTeseMagica(a, manuscrito);
        
        if (!r || !r.aprovado) {
            let msg = (r && r.feedback) ? r.feedback : "O pergaminho carbonizou-se! A Consciência não compreendeu a tua magia, tenta reescrever com mais rigor mecânico e visual.";
            return res.json({ aprovado: false, feedback: msg });
        }
        
        let xp = r.xpGanha || 50; 
        let elo = r.eloGanha || 5;
        core.ganharXp(a, xp);
        
        if (!a.elos) a.elos = { sabedoria: 1000, duelos: 1000, quadribol: 1000, baile: 1000, quiz: 1000, pocoes: 1000 };
        if (a.elos.sabedoria === undefined) a.elos.sabedoria = 1000;
        
        a.elos.sabedoria += elo;
        
        if (r.aprovado && r.feitico) {
            // 🔥 BLINDAGEM INFALÍVEL: Normaliza os dados do feitiço para nunca quebrar no front-end!
            let f = r.feitico;
            let custoReal = Number(f.custoMana) || Number(f.custoFocoBase) || 5;
            let poderReal = Number(f.valorBase) || Number(f.poderBase) || 150;
            
            // Garante que o visualConfig tem a estrutura certa
            let vc = f.visualConfig || {};
            
            const novoFeiticoSanitizado = {
                nome: String(f.nome || "Magia Desconhecida"),
                tipoMecanica: String(f.tipoMecanica || 'ataque'),
                elemento: String(f.elemento || 'cinetico'),
                custoMana: Math.min(10, custoReal), // Nunca passa de 10
                poderBase: poderReal,
                lore: String(f.lore || "Feitiço criado por " + a.nome),
                criador: a.nome,
                custom: true, // ESSENCIAL para o salvamento seguro
                visualConfig: {
                    shape: vc.shape || 'sphere',
                    color: vc.color || '#3498db',
                    glow: vc.glow || '#2980b9',
                    quantity: Number(vc.quantity) || 1,
                    speed: Number(vc.speed) || 20,
                    trailSize: Number(vc.trailSize) || 15,
                    movement: vc.movement || 'linear',
                    particleStyle: vc.particleStyle || 'sparks',
                    impactEffect: vc.impactEffect || 'explosion'
                }
            };

            const fId = `custom_${Date.now()}`;
            core.livroDeFeiticos[fId] = novoFeiticoSanitizado;
            
            if(!a.maestriaFeiticos) a.maestriaFeiticos = {};
            a.maestriaFeiticos[fId] = { nivel: 1, exp: 0, expProx: 100 };
            if(!a.feitiçosEquipados) a.feitiçosEquipados = [];
            a.feitiçosEquipados.push(fId);
            
            // Subscreve a resposta para enviar para a interface os dados limpos
            r.feitico = novoFeiticoSanitizado;
        }
        
        core._salvarUrgente();
        r.feedback = `[+${xp} XP | +${elo} ELO] ${r.feedback}`;
        res.json(r);
    } catch(e) {
        console.error("Falha ao avaliar tese:", e);
        res.status(500).json({erro: "A sala da biblioteca trancou as portas."});
    }
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

// ATUALIZAR: Quiz ELO
// ATUALIZAR: Quiz ELO
app.post('/api/quiz/responder', (req, res) => {
    const { id, acertou } = req.body;
    const a = core.alunos[id];
    if(!a) return res.json({erro: "Erro"});
    let diff = acertou ? 15 : -10;
    a.elos.quiz = Math.max(0, (a.elos.quiz || 1000) + diff);
    if(acertou) { 
        core.ganharXp(a, 50); a.galeoes += 5; 
        core.adicionarPontosCasa(a.casa, 2); // 🔥 QUIZ DÁ 2 PONTOS PARA A CASA
        io.emit('pontuacao_atualizada', core.pontuacaoCasas);
    }
    core._salvarUrgente();
    res.json({ msg: acertou ? "Correto! (+15 ELO, +50XP, +2 Pontos)" : "Errado! (-10 ELO)", elo: a.elos.quiz });
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

    // 🔥 CORREÇÃO: Guardar na array correta do núcleo do jogo!
    if (!core.mercadoJogadores) core.mercadoJogadores = [];
    core.mercadoJogadores.push(oferta);
    
    // Retira o item da mochila ou do baú
    if(isMovel) a.inventario.mobilia = a.inventario.mobilia.filter(m => m.id !== itemId);
    else a.mochilaEscolar = a.mochilaEscolar.filter(i => i.id !== itemId);

    if (typeof core._salvarBancoDeDados === 'function') core._salvarBancoDeDados();
    else if (typeof core._salvarUrgente === 'function') core._salvarUrgente();
    
    res.json({sucesso: true, msg: "Oferta anunciada no Correio Coruja!"});
	if (r.sucesso) {
        // 🔥 AVISA TODOS OS JOGADORES EM TEMPO REAL
        io.emit('mercado_atualizado', core.mercadoJogadores);
    }
    res.json(r);
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

app.post('/api/mercado/comprar', (req, res) => { 
    try { 
        const r = core.comprarItemMercado(req.body.id, req.body.ofertaId); 
        if(r.sucesso) {
            forcarSyncAluno(req.body.id); // Atualiza o ecrã do comprador
            
            // 🔥 CORREÇÃO: Atualiza também o ecrã do vendedor para ele ver o saldo subir em tempo real!
            if (r.vendedorId) {
                forcarSyncAluno(r.vendedorId);
            }
        }
        io.emit('mercado_atualizado', core.mercadoJogadores);
    res.json(r);
    } catch(e) { 
        res.status(500).json({erro: "Erro no contrato."}); 
    } 
});
// ==============================================================================
// 5. AULAS E BIBLIOTECA
// ==============================================================================
app.post('/api/aulas/assistir', async (req, res) => { try { const r = await core.assistirAula(req.body.id); if(!r.erro) forcarSyncAluno(req.body.id); res.json(r); } catch(e) { res.status(500).json({erro: "Chegaste atrasado."}); } });
app.post('/api/aulas/estudar_item', async (req, res) => { try { const r = await core.estudarMaterial(req.body.id, req.body.itemId); if(!r.erro) forcarSyncAluno(req.body.id); res.json(r); } catch(e){ res.status(500).json({erro:"Erro ao ler."}); } });
app.post('/api/aulas/folhear', async (req, res) => {
    try {
        const a = core.alunos[req.body.id];
        if (!a) return res.json({erro: "Bruxo não encontrado"});
        
        const anoAtual = a.anoLetivo || 1;
        const relogio = RelogioHogwarts.obterHorarioAtual(anoAtual);
        if (relogio.aulaAtiva === "Livre") return res.json({erro: "Não há livros na mesa agora."});

        const livroDoc = await core.db_biblioteca.findOne({ materia: relogio.aulaAtiva, ano: anoAtual });
        if (!livroDoc) return res.json({erro: "O livro do teu ano não está na mesa."});

        res.json({ 
            sucesso: true, 
            titulo: livroDoc.nomeLivro, 
            capitulos: livroDoc.capitulos,
            capituloSugerido: relogio.capituloAtual 
        });
    } catch(e) { res.status(500).json({erro: "Erro ao abrir livro de aula."}); }
});
app.post('/api/aulas/iniciar_imersiva', async (req, res) => {
    try {
        const r = await core.assistirAula(req.body.id);
        if (!r.erro) forcarSyncAluno(req.body.id);
        res.json(r);
    } catch(e) {
        res.status(500).json({erro: "Erro na secretaria escolar."});
    }
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

// Substitui a rota antiga da dungeon
// Substitui a rota antiga da dungeon por esta versão com suporte a Grupo
// Substitui a rota antiga da dungeon por esta versão com suporte a Grupo corrigida!
app.post('/api/dungeon/iniciar', async (req, res) => {
    try {
        const { id, local } = req.body;
        const a = core.alunos[id];
        if (!a || a.focoAtual < 3) return res.json({ erro: "Precisas de 3 Foco." });
        
        a.focoAtual -= 3;
        
        // Coloca o jogador (Líder) no Motor Procedural da Floresta
        let inst = core.florestaEngine.entrarFloresta(a);
        
        // Coloca no Socket Room para receber o Sync 2D
        let s = Array.from(global.io.sockets.sockets.values()).find(sock => sock.rooms.has(`priv_${id}`));
        if(s) s.join(`forest_${inst.id}`);

        core._salvarUrgente();

        // 🔥 CORREÇÃO: Usa core.grupos em vez de core.parties!
        if (a.partyId && core.grupos[a.partyId]) {
            core.grupos[a.partyId].membros.forEach(mId => {
                if (mId !== a.id) {
                    global.io.to(`priv_${mId}`).emit('convite_instancia', { 
                        liderNome: a.nome, 
                        local: "Floresta Proibida", 
                        instId: inst.id, 
                        tipo: 'floresta' 
                    });
                }
            });
        }

        res.json({ sucesso: true, msg: "Entraste na Floresta Sombria...", instId: inst.id });
    } catch(e) {
        res.status(500).json({erro: "A masmorra colapsou."});
    }
});



// 🔥 NOVA ROTA: Aceitar o puxão do grupo
// 🔥 NOVA ROTA: Aceitar o puxão do grupo
app.post('/api/dungeon/aceitar_convite', (req, res) => {
    const { id, instId, tipo } = req.body;
    const a = core.alunos[id];
    if(!a) return res.json({erro: "Erro de sessão."});

    if (tipo === 'floresta') {
        const instOriginal = core.florestaEngine.instancias[instId];
        if (!instOriginal) return res.json({erro: "A instância do teu líder já fechou."});
        
        a.focoAtual -= 3;
        a.lootTemporario = { galeoes: 0, xp: 0, itens: [] };
        a.estadoJogo = 'FLORESTA';

        instOriginal.jogadores[a.id] = {
            id: a.id, nome: a.nome, casa: a.casa, partyId: a.partyId,
            equipamentos: a.equipamentos || {}, // 🔥 Roupas enviadas para a renderização dos aliados
            x: instOriginal.spawn.x + (Math.random()*60 - 30), 
            y: instOriginal.spawn.y + (Math.random()*60 - 30),
            vx: 0, vy: 0, dir: 1, isMoving: false, emCombate: false
        };

        let s = Array.from(global.io.sockets.sockets.values()).find(sock => sock.rooms.has(`priv_${id}`));
        if(s) s.join(`forest_${instOriginal.id}`);
        
        core._salvarUrgente();
        res.json({ sucesso: true, instId: instOriginal.id });
    }
});

app.post('/api/dungeon/fugir_floresta_seguro', (req, res) => {
    // Para quando o jogador clica no botão "Voltar ao Castelo" do mapa 2D
    const a = core.alunos[req.body.id];
    core.florestaEngine.extrairLootEVaz(a); // Guarda o loot na conta real
    
    // Tira o jogador da instância
    for(let id in core.florestaEngine.instancias) {
        delete core.florestaEngine.instancias[id].jogadores[req.body.id];
    }
    core._salvarUrgente();
    res.json({sucesso: true});
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
	// PROCURA ESTA LINHA:


// 🔥 Lidar com ataques iniciados via clique no mapa da Floresta
    socket.on('forest_attack_mob', (dados) => {
        let inst = core.florestaEngine.instancias[dados.instId];
        let a = core.alunos[socket.alunoId];
        if(!inst || !a) return;
        
        let mob = inst.mobs.find(m => m.id === dados.mobId);
        if(mob) core.florestaEngine.iniciarCombate(inst, mob, inst.jogadores[a.id], io, false);
    });

    // 🔥 Lidar com os baús procedurais da Floresta
    socket.on('forest_open_chest', async (dados) => {
        let inst = core.florestaEngine.instancias[dados.instId];
        let a = core.alunos[socket.alunoId];
        if(!inst || !a) return;
        
        let bau = inst.baus[dados.bauIdx];
        if(!bau || bau.looted) return;

        bau.looted = true;
        let goldDrop = Math.floor(Math.random() * 100) + (inst.area * 50);
        a.lootTemporario.galeoes += goldDrop;

        // 30% de chance da IA gerar um item mágico raro no baú
        if (Math.random() > 0.70 && core.cerebroIA) {
            const itemIA = await core.cerebroIA.gerarItemMundoIA("Artefato da Floresta");
            if (itemIA) {
                const novoItem = { 
                    id: 'itm_' + crypto.randomBytes(4).toString('hex'), 
                    nome: itemIA.nome, tipo: 'reliquia', lore: itemIA.descricao 
                };
                a.lootTemporario.itens.push(novoItem);
                io.to(`priv_${a.id}`).emit('forest_msg', { msg: `📦 Abriu Baú: +${goldDrop} G e obteve [${novoItem.nome}]!` });
            } else {
                io.to(`priv_${a.id}`).emit('forest_msg', { msg: `📦 Abriu Baú: +${goldDrop} G.` });
            }
        } else {
            io.to(`priv_${a.id}`).emit('forest_msg', { msg: `📦 Abriu Baú: +${goldDrop} G.` });
        }

        // Atualiza a tela de todo o mundo na instância para eles verem o baú a sumir
        io.to(`forest_${inst.id}`).emit('forest_sync', inst);
    });

    // =====================================
    // CORREÇÃO AAA: CRIAÇÃO E SYNC DE GRUPOS
    // =====================================
    socket.on('admin_comando', async (dados) => {
    // 🔥 SEGURANÇA: Substitui pelo teu ID de Administrador real
    if (dados.adminId !== 'BRX_9AC7F35224') return; 
// Dentro do switch ou if de comandos admin
if (dados.acao === 'gerar_backup_agora') {
    console.log("📦 [ADMIN] Backup de segurança disparado manualmente por", dados.adminId);
    
    const snapshot = { 
        alunos: core.alunos, 
        mercadoJogadores: core.mercadoJogadores, 
        pontuacaoCasas: core.pontuacaoCasas, 
        gremios: core.gremios,
        livroDeFeiticos: core.livroDeFeiticos
    };

    try {
        await core.backup_collection.insertOne({
            timestamp: Date.now(),
            data_humana: new Date().toLocaleString('pt-PT'),
            dados: snapshot
        });
        socket.emit('nova_mensagem', { canal: 'zona', autor: 'SISTEMA', texto: '✅ Backup de 30min gerado manualmente com sucesso!' });
    } catch(e) {
        socket.emit('nova_mensagem', { canal: 'zona', autor: 'SISTEMA', texto: '❌ Erro ao gerar backup manual.' });
    }
}
    if (dados.acao === 'set_level') core.alunos[dados.alvoId].nivel = dados.valor;
    if (dados.acao === 'dar_ouro') core.alunos[dados.alvoId].galeoes += dados.valor;
    if (dados.acao === 'reset_aulas') core.configGlobal.offsetCapitulo = dados.valor; 

    core._salvarUrgente();
    io.emit('sync_imediato', { servidor: core._obterDadosServidor() });
});
socket.on('forest_mover', (dados) => {
        // Blindagem: impede crash se o servidor reiniciar enquanto jogadores andam
        if (!core.florestaEngine || !core.florestaEngine.instancias || !dados.instId) return; 
        
        let inst = core.florestaEngine.instancias[dados.instId];
        if (inst && inst.jogadores[socket.alunoId]) {
            let p = inst.jogadores[socket.alunoId];
            p.x = dados.x; 
            p.y = dados.y; 
            p.dir = dados.dir; 
            p.isMoving = dados.isMoving;
        }
    });

	
// Ação de Clique em Objeto do Mundo (MMO)
socket.on('mmo_interagir_objeto', async (dados) => {
    const a = core.alunos[socket.alunoId];
    const sala = core.zonasVivas[socket.zonaAtual];
    if (!a || !sala) return;

    // Se for um monstro
    const mobIdx = sala.entidades.findIndex(m => m.idMundo === dados.alvoId);
    if (mobIdx !== -1) {
        const mob = sala.entidades[mobIdx];
        const dano = (a.atributosTotais.feiticos * 10);
        mob.hpAtual -= dano;

        io.to(`zona_${socket.zonaAtual}`).emit('nova_mensagem', {
            canal: 'zona',
            autor: '⚔️ COMBATE',
            texto: `${a.nome} lançou um feitiço no ${mob.nome}! (-${dano} HP)`
        });

        if (mob.hpAtual <= 0) {
            sala.entidades.splice(mobIdx, 1);
            a.galeoes += 50;
            core.ganharXp(a, 100);
            io.to(`zona_${socket.zonaAtual}`).emit('mmo_entidade_morreu', { id: dados.alvoId, msg: `🏆 O ${mob.nome} foi derrotado por ${a.nome}!` });
        }
    }

    // Se for um item
    const itemIdx = sala.itens.findIndex(i => i.id === dados.alvoId);
    if (itemIdx !== -1) {
        const item = sala.itens[itemIdx];
        sala.itens.splice(itemIdx, 1);
        a.mochilaEscolar.push({ id: crypto.randomBytes(4).toString('hex'), nome: item.nome, tipo: 'reliquia' });
        
        io.to(`zona_${socket.zonaAtual}`).emit('mmo_item_coletado', { 
            id: dados.alvoId, 
            texto: `🖐️ ${a.nome} foi mais rápido e pegou o [${item.nome}]!` 
        });
    }
    core._salvarUrgente();
});
// =====================================
    // SISTEMA MMO: CONVITES E GRUPOS
    // =====================================
    
	
// =====================================
    // AÇÃO DE CLIQUE MUNDO ABERTO (Mmo_Action Limpo e Fechado)
    // =====================================
    socket.on('mmo_action', async (dados) => {
        const a = core.alunos[socket.alunoId];
        const sala = core.zonasVivas[dados.zona];
        if(!a || !sala) return;

        // --- LÓGICA DE COLETA BLINDADA ---
        if (dados.tipo === 'coleta') {
            const itemIdx = sala.itens.findIndex(i => i.id === dados.idAlvo);
            if (itemIdx !== -1) {
                const itemBase = sala.itens[itemIdx];
                if (!itemBase.statusDinamico) {
                    if (typeof core.cerebroIA.gerarItemMundoIA === 'function') {
                        itemBase.statusDinamico = await core.cerebroIA.gerarItemMundoIA(itemBase.nome);
                    } else {
                        itemBase.statusDinamico = { nome: itemBase.nome, tipo: 'reliquia', descricao: 'Relíquia encontrada no castelo.' };
                    }
                }
                sala.itens.splice(itemIdx, 1);
                
                const novoItem = { 
                    id: 'itm_' + crypto.randomBytes(4).toString('hex'), 
                    nome: itemBase.statusDinamico.nome || itemBase.nome,
                    tipo: 'reliquia',
                    lore: itemBase.statusDinamico.descricao 
                };
                
                a.mochilaEscolar.push(novoItem);
                io.to(`zona_${dados.zona}`).emit('mmo_item_coletado', { id: dados.idAlvo, texto: `🖐️ [${novoItem.nome}] foi recolhido por ${a.nome}!` });
                io.to(`zona_${dados.zona}`).emit('mmo_world_update', sala); 
                core._salvarUrgente();
                forcarSyncAluno(a.id);
            }
        }
        // --- LÓGICA DE COMBATE COOPERATIVO (MUNDO ABERTO & RAIDS) ---
        else if (dados.tipo === 'combate') {
            const mob = sala.entidades.find(m => m.id === dados.idAlvo);
            if (!mob) return;

            let membrosParaAdicionar = a.partyId && core.grupos[a.partyId] ? core.grupos[a.partyId].membros : [a.id];

            let adicionouAlguem = false;
            membrosParaAdicionar.forEach(mId => {
                if (!mob.jogadoresConfirmados.includes(mId)) {
                    mob.jogadoresConfirmados.push(mId);
                    adicionouAlguem = true;
                }
            });

            if (!adicionouAlguem) return; 

            if (!mob.timerIniciado) {
                mob.timerIniciado = true;
                let tempoRestante = 6;

                const intervalId = setInterval(() => {
                    tempoRestante--;
                    io.to(`zona_${dados.zona}`).emit('mmo_raid_status', { 
                        id: mob.id, count: mob.jogadoresConfirmados.length, tempo: tempoRestante,
                        texto: `🔥 PREPARANDO: ${mob.categoria || 'Combate'} em ${tempoRestante}s...`
                    });

                    if (tempoRestante <= 0) {
                        clearInterval(intervalId);
                        const idInst = `raid_${Date.now()}`;
                        
                        const aliadosData = mob.jogadoresConfirmados.map(pid => {
                            let al = core.alunos[pid];
                            return al ? { id: al.id, nome: al.nome, equipamentos: al.equipamentos || {}, casa: al.casa } : null;
                        }).filter(Boolean);

                        core.dungeonInstancias[idInst] = {
                            id: idInst, local: dados.zona, 
                            entidades: [{ ...mob, hpAtual: mob.hpMax, vivo: true, idx: 0 }],
                            status: 'combate', multiplayer: true, membros: mob.jogadoresConfirmados,
                            faseAtual: 1, maxFases: mob.waves || 1, mult: 1, recompensaMult: mob.recompensaMult || 1
                        };

                        core.iniciarIACombate(idInst);

                        mob.jogadoresConfirmados.forEach(pid => {
                            let s = Array.from(global.io.sockets.sockets.values()).find(sock => sock.alunoId === pid);
                            if(s) s.join(idInst);
                            io.to(`priv_${pid}`).emit('puxado_para_dungeon', { idInstancia: idInst, estado: { entidades: core.dungeonInstancias[idInst].entidades }, aliados: aliadosData });
                        });

                        sala.entidades = sala.entidades.filter(m => m.id !== mob.id);
                        io.to(`zona_${dados.zona}`).emit('mmo_world_update', sala);
                    }
                }, 1000);
            } else {
                io.to(`zona_${dados.zona}`).emit('mmo_raid_status', { id: mob.id, count: mob.jogadoresConfirmados.length, texto: `⚔️ ${a.nome} e o seu grupo juntaram-se à batalha!` });
            }
        }
    }); // <-- AQUI ESTÁ A CHAVETA DE FECHO QUE RESOLVE O TEU SYNTAX ERROR!
// FECHA O SOCKET CORRETAMENTE AQUI // <-- ESTA LINHA FECHA O SOCKET E EVITA O ERRO!
    socket.on('multiplayer_spell', (dados) => {
        // Transmite a renderização visual da magia para os aliados na Masmorra
        socket.to(dados.instId).emit('render_multiplayer_spell', dados);
    });

   
    socket.on('entrar_chat', (dados) => { 
        socket.join('salaoPrincipal'); // Canal Global
        if(dados.casa) socket.join(`comum_${dados.casa}`); 
        socket.join(`priv_${dados.idAluno}`); 
        socket.join('sala_de_aula'); // 🔥 GARANTE QUE RECEBE O CHAT DA AULA
        
        // Regista o jogador no sistema online
        socket.alunoId = dados.idAluno;
        socket.alunoNome = core.alunos[dados.idAluno].nome;
    });
    
    // ==============================================================================
    // MMO MOTOR DE POSIÇÕES E ZONAS EM TEMPO REAL
    // ==============================================================================
    // ==============================================================================
    // 🌍 MOTOR MMO GLOBAL: GESTÃO DE ZONAS E SINCRONIZAÇÃO DE MOVIMENTO
    // ==============================================================================
    if (!core.playersOnlineMmo) core.playersOnlineMmo = {};

    

    // O jogador envia a sua posição local para o servidor
    socket.on('mmo_mover', (dados) => {
        if (!core.playersOnlineMmo[socket.alunoId]) return;
        
        let p = core.playersOnlineMmo[socket.alunoId];
        p.x = dados.x;
        p.y = dados.y;
        p.dir = dados.dir;
        p.isMoving = dados.isMoving;
        p.zona = dados.zona; // Garante que sabemos onde ele está
    });

     // ==============================================================================
    // 🤝 SISTEMA DE GRUPOS E COOP INSTANCIADO
    // ==============================================================================
    // --- LÓGICA DE GRUPOS CORRIGIDA ---
 // =====================================
    // 🤝 SISTEMA MMO: CONVITES, GRUPOS E PRESENÇA
    // =====================================
    socket.on('enviar_convite_grupo', (dados) => {
        let alvo = Object.values(core.alunos).find(a => a.nome.toLowerCase() === dados.alvoNome.toLowerCase());
        if(alvo) {
            io.to(`priv_${alvo.id}`).emit('receber_convite_grupo', { liderId: dados.meuId, liderNome: dados.meuNome });
            io.to(`priv_${dados.meuId}`).emit('nova_mensagem', { canal: 'zona', autor: 'SISTEMA', texto: `Convite de Grupo enviado para ${alvo.nome}.` });
        } else {
            io.to(`priv_${dados.meuId}`).emit('nova_mensagem', { canal: 'zona', autor: 'SISTEMA', texto: `Bruxo '${dados.alvoNome}' não está online.` });
        }
    });

    socket.on('grupo_convidar', (dados) => {
        if(!core.alunos[dados.alvoId] || dados.alvoId === socket.alunoId) return;
        io.to(`priv_${dados.alvoId}`).emit('receber_convite_grupo', { 
            liderId: socket.alunoId, 
            liderNome: core.alunos[socket.alunoId].nome 
        });
    });

    // 🔥 CORREÇÃO: Padronização do nome do Socket
    socket.on('aceitar_convite_grupo', (dados) => {
        let liderId = dados.liderId;
        if (!core.grupos[liderId]) core.grupos[liderId] = { lider: liderId, membros: [liderId] };
        
        if (!core.grupos[liderId].membros.includes(socket.alunoId)) {
            core.grupos[liderId].membros.push(socket.alunoId);
        }
        
        if(core.alunos[liderId]) core.alunos[liderId].partyId = liderId;
        if(core.alunos[socket.alunoId]) core.alunos[socket.alunoId].partyId = liderId;
        core._salvarUrgente();
        
        // Coloca na mesma sala de Socket para chat de grupo
        socket.join(`party_${liderId}`);
        let sLider = Array.from(global.io.sockets.sockets.values()).find(sock => sock.alunoId === liderId);
        if(sLider) sLider.join(`party_${liderId}`);
        
        let infoGrupo = { 
            lider: liderId, 
            membrosNomes: core.grupos[liderId].membros.map(id => {
                let a = core.alunos[id];
                return { id: id, nome: a.nome, equipamentos: a.equipamentos || {}, casa: a.casa };
            }) 
        };
        
        global.io.to(`party_${liderId}`).emit('grupo_atualizado', infoGrupo);
        atualizarPresencaZona(socket.zonaAtual); // Atualiza a lista da direita
    });

    socket.on('conteudo_puxar_grupo', (dados) => {
        let grupo = core.grupos[dados.liderId];
        if(grupo) {
            grupo.membros.forEach(mId => {
                if(mId !== socket.alunoId) {
                    io.to(`priv_${mId}`).emit('conteudo_convite_grupo', { tipo: dados.tipo, instId: dados.instId });
                }
            });
        }
    });
	
	 // =====================================
    // MOTOR DE ZONAS E PRESENÇA AAA
    // =====================================
    function atualizarPresencaZona(zona) {
        if (!zona) return;
        const clientsInZone = global.io.sockets.adapter.rooms.get(`zona_${zona}`);
        let jogadoresNaZona = [];
        if (clientsInZone) {
            for (const clientId of clientsInZone) {
                const clientSocket = global.io.sockets.sockets.get(clientId);
                // Valida o socket, extrai da classe mestre
                if (clientSocket && clientSocket.alunoId) {
                    const a = core.alunos[clientSocket.alunoId];
                    if (a) {
                        jogadoresNaZona.push({
                            id: a.id,
                            nome: a.nome,
                            nivel: a.nivel,
                            casa: a.casa,
                            partyId: a.partyId, // 🔥 CHAVE PARA O GRUPO FUNCIONAR
                            equipamentos: a.equipamentos
                        });
                    }
                }
            }
        }
        global.io.to(`zona_${zona}`).emit('mmo_update_presenca', jogadoresNaZona);
    }

    socket.on('entrar_zona_castelo', (dados) => {
        // Sai da zona antiga apenas se for diferente da nova
        if (socket.zonaAtual && socket.zonaAtual !== dados.zona) {
            socket.leave(`zona_${socket.zonaAtual}`);
            io.to(`zona_${socket.zonaAtual}`).emit('mmo_jogador_saiu', { id: socket.alunoId });
            atualizarPresencaZona(socket.zonaAtual); 
        }
        
        socket.zonaAtual = dados.zona;
        socket.join(`zona_${dados.zona}`);
        
        const a = core.alunos[socket.alunoId];
        if (a) {
            core.playersOnlineMmo[a.id] = {
                id: a.id, nome: a.nome, casa: a.casa, nivel: a.nivel,
                x: dados.startX || 400, y: dados.startY || 300, dir: 1, isMoving: false,
                partyId: a.partyId, // Essencial para os grupos
                equipamentos: a.equipamentos || {}, 
                zona: dados.zona
            };
        }

        // Mensagem de sistema global
        io.to(`zona_${dados.zona}`).emit('nova_mensagem', { canal: 'zona', autor: '🏰 [SISTEMA]', texto: `${a.nome} chegou a ${dados.zona}.` });
        
        if (core.zonasVivas[dados.zona]) {
            socket.emit('mmo_world_update', core.zonasVivas[dados.zona]);
        }
        
        atualizarPresencaZona(dados.zona);

        // 🔥 RECUPERAÇÃO DA LORE DA IA AQUI!
        if (core.cerebroIA && typeof core.cerebroIA.gerarAtmosferaLocal === 'function') {
            core.cerebroIA.gerarAtmosferaLocal(dados.zona).then(atmosfera => {
                if (atmosfera) {
                    socket.emit('nova_mensagem', { canal: 'zona', autor: '✨ [AMBIENTE]', texto: atmosfera });
                }
            }).catch(err => console.log("Erro na atmosfera:", err));
        }
    });

    socket.on('pedir_presenca', (dados) => {
        atualizarPresencaZona(dados.zona);
    });

    socket.on('disconnect', () => {
        if (socket.alunoId) {
            let z = socket.zonaAtual;
            if (core.playersOnlineMmo[socket.alunoId]) {
                z = core.playersOnlineMmo[socket.alunoId].zona;
                delete core.playersOnlineMmo[socket.alunoId];
            }
            if (z) {
                io.to(`zona_${z}`).emit('mmo_jogador_saiu', { id: socket.alunoId });
                atualizarPresencaZona(z);
            }
        }
    });

    socket.on('aceitar_convite_grupo', (dados) => {
        let liderId = dados.liderId;
        if (!core.grupos[liderId]) core.grupos[liderId] = { lider: liderId, membros: [liderId] };
        
        if (!core.grupos[liderId].membros.includes(socket.alunoId)) {
            core.grupos[liderId].membros.push(socket.alunoId);
        }
        
        // Atualiza as contas
        if(core.alunos[liderId]) core.alunos[liderId].partyId = liderId;
        if(core.alunos[socket.alunoId]) core.alunos[socket.alunoId].partyId = liderId;
        core._salvarUrgente();
        
        forcarSyncAluno(liderId);
        forcarSyncAluno(socket.alunoId);

        // O SEGREDO DO COOP: Juntar toda a gente à mesma sala Socket
        socket.join(`party_${liderId}`);
        let sLider = Array.from(global.io.sockets.sockets.values()).find(sock => sock.alunoId === liderId);
        if(sLider) sLider.join(`party_${liderId}`);
        
        let infoGrupo = { 
            lider: liderId, 
            membrosNomes: core.grupos[liderId].membros.map(id => {
                let a = core.alunos[id];
                return a ? { id: id, nome: a.nome, equipamentos: a.equipamentos, casa: a.casa } : null;
            }).filter(Boolean)
        };
        
        // Emite para a SALA INTEIRA
        global.io.to(`party_${liderId}`).emit('grupo_atualizado', infoGrupo);
        atualizarPresencaZona(socket.zonaAtual); // Re-renderiza as cores verdes na tela
    });

	


	socket.on('pedir_presenca', (dados) => {
        atualizarPresencaZona(dados.zona);
    });
	// 🔥 VERSÃO ÚNICA E DEFINITIVA PARA TODO O SERVIDOR
    function atualizarPresencaZona(zona) {
        if (!zona) return;
        const clientsInZone = global.io.sockets.adapter.rooms.get(`zona_${zona}`);
        let jogadoresNaZona = [];
        if (clientsInZone) {
            for (const clientId of clientsInZone) {
                const clientSocket = global.io.sockets.sockets.get(clientId);
                if (clientSocket && clientSocket.alunoId) {
                    const a = core.alunos[clientSocket.alunoId];
                    if (a) {
                        jogadoresNaZona.push({
                            id: a.id,
                            nome: a.nome,
                            nivel: a.nivel,
                            casa: a.casa,
                            partyId: a.partyId,
                            equipamentos: a.equipamentos
                        });
                    }
                }
            }
        }
        global.io.to(`zona_${zona}`).emit('mmo_update_presenca', jogadoresNaZona);
    }

    socket.on('disconnect', () => {
        if (socket.zonaAtual && socket.alunoId) {
            io.to(`zona_${socket.zonaAtual}`).emit('mmo_jogador_saiu', { id: socket.alunoId });
        }
    });
	
	socket.on('disconnect', () => {
        if (socket.zonaAtual && socket.alunoId) {
            io.to(`zona_${socket.zonaAtual}`).emit('mmo_jogador_saiu', { id: socket.alunoId });
        }
    });

    // API para Inspecionar Jogador (Novo Endpoint)
    app.get('/api/jogador/perfil/:id', (req, res) => {
        const a = core.alunos[req.params.id];
        if(!a) return res.json({erro: "Bruxo desaparecido."});
        res.json({
            id: a.id, nome: a.nome, titulo: a.titulo, nivel: a.nivel, casa: a.casa,
            elo: a.elos?.duelos || 1000, 
            varinha: a.equipamentos.varinha ? a.equipamentos.varinha.nome : "Nenhuma",
            gremio: a.gremioId ? core.gremios[a.gremioId]?.nome : "Sem Guilda"
        });
    });

    socket.on('mensagem_chat', async (dados) => {
        const payload = { autor: `[${dados.remetenteCasa.substring(0,3)}] ${dados.remetenteNome}`, texto: dados.texto, hora: new Date().toLocaleTimeString() };
        let roomEmit = 'salaoPrincipal'; // Default (Global)
        let prefixo = '';

        if (dados.canal === 'zona') {
            roomEmit = `zona_${dados.zona}`;
            prefixo = '📍 ';
        } else if (dados.canal === 'grupo' && dados.partyId) {
            roomEmit = dados.partyId;
            prefixo = '🤝 ';
        } else if (dados.canal === 'gremio' && dados.gremioId) {
            roomEmit = dados.gremioId;
            prefixo = '🛡️ ';
        } else if (dados.canal === 'aula') {
            roomEmit = 'sala_de_aula';
            if (!socket.rooms.has('sala_de_aula')) socket.join('sala_de_aula');
        } else {
            // Canal Global
            roomEmit = 'salaoPrincipal';
            prefixo = '🌍 ';
        }

        payload.autor = prefixo + payload.autor;

        // Se for grupo ou guilda, garante que o socket faz parte da sala (room) para ouvir os amigos
        if ((dados.canal === 'grupo' || dados.canal === 'gremio') && roomEmit !== 'salaoPrincipal') {
             if (!socket.rooms.has(roomEmit)) socket.join(roomEmit);
        }

        // Emite a mensagem falada pelo jogador
        io.to(roomEmit).emit('nova_mensagem', { canal: dados.canal, ...payload });

        // RESPOSTAS INTELIGENTES DA IA & INJEÇÃO NO MUNDO!
        if (dados.canal === 'zona') {
            const respIA = await core.cerebroIA.gerarRespostaPersonagemIA(dados.zona, dados.remetenteNome, dados.texto, dados.remetenteCasa);
            
            if (respIA && respIA.personagem !== "Nenhum" && respIA.texto) {
                setTimeout(() => { 
                    // 1. A IA RESPONDE COMO PERSONAGEM
                    io.to(roomEmit).emit('nova_mensagem', { canal: 'zona', autor: `👻 [${respIA.personagem}]`, texto: respIA.texto }); 
                    
                    if(respIA.pontos && respIA.pontos !== 0) { 
                        core.adicionarPontosCasa(dados.remetenteCasa, respIA.pontos); 
                        io.emit('pontuacao_atualizada', core.pontuacaoCasas); 
                    }

                    // 2. A IA MATERIALIZA O PEDIDO DO JOGADOR NO MAPA REAL!
                    const sala = core.zonasVivas[dados.zona];
                    let mundoAlterado = false;

                    // Se a IA decidiu gerar um Monstro
                    if (respIA.spawnMob && sala) {
                        const a = core.alunos[dados.remetenteId];
                        const hpEscalado = 400 + ((a ? a.nivel : 1) * 50); // Adapta o HP ao nível do jogador
                        const mob = core._gerarMonstroRapido(hpEscalado, dados.zona, false);
                        mob.nome = respIA.spawnMob; // Põe o nome que a IA inventou!
                        
                        sala.entidades.push({ id: `mob_${Date.now()}`, ...mob, tipo: 'combate' });
                        mundoAlterado = true;
                        
                        io.to(roomEmit).emit('nova_mensagem', { canal: 'zona', autor: '⚡ MAGIA DO CASTELO', texto: `As palavras ecoaram... Um [${respIA.spawnMob}] materializou-se das sombras!` });
                    }

                    // Se a IA decidiu gerar um Item
                    if (respIA.spawnItem && sala) {
                        sala.itens.push({ id: `itm_${Date.now()}`, nome: respIA.spawnItem, tipo: 'coleta' });
                        mundoAlterado = true;
                        
                        io.to(roomEmit).emit('nova_mensagem', { canal: 'zona', autor: '✨ MAGIA DO CASTELO', texto: `O ambiente reagiu! Um [${respIA.spawnItem}] apareceu no chão.` });
                    }

                    // Se algo foi criado, atualiza a barra HUD "Acontecimentos Atuais" de toda a gente!
                    if (mundoAlterado) {
                        io.to(roomEmit).emit('mmo_world_update', sala);
                    }

                }, 1500);
            }
        }

        // O BLOCO CORRIGIDO DA AULA
        if (dados.canal === 'aula') {
            const relogio = RelogioHogwarts.obterHorarioAtual();
            if(relogio.professorAtivo !== 'Nenhum') {
                const a = core.alunos[dados.remetenteId];
                const anoLetivo = a ? a.anoLetivo : 1; // Puxa o ano do aluno que falou!
                
                const respProf = await core.cerebroIA.respostaProfessorIA(relogio.professorAtivo, relogio.aulaAtiva, dados.remetenteNome, dados.texto, dados.remetenteCasa, anoLetivo);
                
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
        // Substituir a antiga forma de chamada por esta ligada diretamente à classe!
        const r = core.quadribol.entrarQuadribol(dados.id, dados.pos); 
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
        
        setInterval(() => { core.tickServerGlobal(); }, 2000); // Lógica de recursos e economia
        
        // 🔥 O BATIMENTO CARDÍACO DO MMO (15 FPS) 🔥
        setInterval(() => {
            if (!core.playersOnlineMmo) return;
            
            // Agrupa os jogadores por zona
            let zonasPacotes = {};
            Object.values(core.playersOnlineMmo).forEach(p => {
                if(!zonasPacotes[p.zona]) zonasPacotes[p.zona] = [];
                zonasPacotes[p.zona].push(p);
            });

            // Envia apenas o pacote da zona para quem está nessa zona
            for (let zona in zonasPacotes) {
                io.to(`zona_${zona}`).emit('mmo_sync_posicoes', zonasPacotes[zona]);
            }
        }, 60); 

    });
}
iniciarSistema();