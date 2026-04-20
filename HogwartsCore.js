// ==============================================================================
// 🏰 HogwartsCore.js - IA DEEP LORE, ROLEPLAY, COMBATE E SISTEMAS AAA
// ==============================================================================
const crypto = require('crypto');
const Groq = require('groq-sdk'); 
const Lexicon = require('./LexiconMagicae.js');

class AstrolabioMagico {
    static obterClimaAtual() {
        const hora = new Date().getHours();
        let periodo = (hora >= 6 && hora < 18) ? 'Dia' : 'Noite';
        let toqueRecolher = (hora >= 22 || hora < 6); 
        let climas = ['Céu Limpo', 'Chuva Torrencial', 'Nevoeiro Denso', 'Tempestade de Neve'];
        return { periodo, toqueRecolher, clima: climas[Math.floor(Math.random() * climas.length)], hora };
    }
}

class RelogioHogwarts {
    static obterHorarioAtual(anoLetivo = 1) {
        const agora = new Date();
        const diaSemanaReal = agora.getDay(); 
        const horaReal = agora.getHours();
        
        const dias = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];
        const diaNome = dias[diaSemanaReal];

        const cronograma = {
            "Segunda": { manha: { m: "Feitiços", p: "Flitwick", l: "Livro Padrão de Feitiços" }, tarde: { m: "Poções", p: "Snape", l: "Poções Avançadas" } },
            "Terça": { manha: { m: "Transfiguração", p: "McGonagall", l: "Guia de Transfiguração" }, tarde: { m: "Herbologia", p: "Sprout", l: "Mil Ervas Mágicas" } },
            "Quarta": { manha: { m: "D.C.A.T.", p: "Lupin", l: "As Forças das Trevas" }, tarde: { m: "Trato de Criaturas Mágicas", p: "Hagrid", l: "O Livro Monstruoso dos Monstros" } },
            "Quinta": { manha: { m: "História da Magia", p: "Binns", l: "História da Magia" }, tarde: { m: "Adivinhação", p: "Trelawney", l: "Esclarecendo o Futuro" } },
            "Sexta": { manha: { m: "Aritmancia", p: "Vector", l: "Numerologia e Gramática" }, tarde: { m: "Estudos dos Muggles", p: "Burbage", l: "Vida Doméstica dos Muggles" } },
            "Sábado": { manha: { m: "Runas Antigas", p: "Babbling", l: "Dicionário de Runas" }, tarde: { m: "Voo", p: "Hooch", l: "Quadribol Através dos Séculos" } },
            "Domingo": { manha: { m: "Astronomia", p: "Sinistra", l: "O Céu Noturno" }, tarde: { m: "Alquimia", p: "Dumbledore", l: "Alquimia, O Guia Prático" } }
        };

        const hoje = cronograma[diaNome];
        let infoTurno = (horaReal >= 8 && horaReal < 14) ? hoje.manha : hoje.tarde;

        // 🔥 O NOVO CRONOGRAMA ÉPICO (1 Ano Letivo = 4 Meses Reais = 120 Dias)
        const janeiroPrimeiro = new Date(agora.getFullYear(), 0, 1);
        const diasPassados = Math.floor((agora - janeiroPrimeiro) / (24 * 60 * 60 * 1000));
        
        // Ciclo contínuo de 120 dias. Um livro tem 20 capítulos. 120 / 20 = 6 dias por capítulo.
        const diaDoCiclo = diasPassados % 120;
        const capituloHoje = Math.floor(diaDoCiclo / 6) + 1; // Resultado: 1 a 20

        let fase = "Estudo Livre";
        if (horaReal >= 8 && horaReal < 20) fase = (horaReal < 14) ? "Palestra Matinal" : "Sessão Prática de Tarde";

        return {
            diaAtual: diaNome,
            horaJogo: `${horaReal.toString().padStart(2,'0')}:00`,
            aulaAtiva: infoTurno.m,
            professorAtivo: infoTurno.p,
            requerLivro: `${infoTurno.l} (Ano ${anoLetivo})`, 
            capituloAtual: capituloHoje,
            faseEscolar: fase,
            toqueRecolher: (horaReal >= 22 || horaReal < 6)
        };
    }
}
class Ollivanders {
    static forjarVarinhaDestinada(nomeBruxo) {
        const madeiras = [ "Azevinho", "Teixo", "Salgueiro", "Carvalho", "Nogueira", "Ébano", "Salgueiro Lutador", "Jacarandá Escuro", "Amieiro" ];
        const nucleos = [ "Pena de Fênix", "Coração de Dragão", "Pelo de Unicórnio", "Crina de Kelpie", "Chifre de Basilisco" ];
        const estilosMadeira = [ "#4A2F1D", "#6C4E3D", "#8B4513", "#A0522D", "#1A0000", "#d1a37c", "#4E5C4E" ];
        const formatosHaste = [ 'esguia_elegante', 'ondulante', 'torta_fibrosa', 'reta_aristocratica', 'espessa_batalha' ];
        const aurasPossiveis = [ "#f1c40f", "#0f5", "#40a0ff", "#d080ff", "#ff4040", "#ffffff", "#00ffcc" ];

        let mad = madeiras[Math.floor(Math.random()*madeiras.length)]; 
        let nuc = nucleos[Math.floor(Math.random()*nucleos.length)];
        
        let hasteAlea = formatosHaste[Math.floor(Math.random()*formatosHaste.length)];
        let handleSeed = Math.floor(Math.random()*4); // Dá formato exato do grip
        
        let comprimentosDispo = ["10.5", "11", "12", "13", "13.5", "14", "9.5", "15", "8¾", "12½"];
        
        return { 
            nome: `Varinha de ${mad}`, 
            comprimento: `${comprimentosDispo[Math.floor(Math.random() * comprimentosDispo.length)]} pol`, 
            nucleo: nuc, 
            afinidade: ["feiticos", "artes_trevas", "defesa", "transfiguracao"][Math.floor(Math.random()*4)], 
            poderBase: Math.floor(Math.random() * 10) + 10, 
            lore: `Talhada magistralmente a partir de ${mad}, atrelada e destemida a servir unicamente ao bruxo que respeite a sua fonte arcana em ${nuc}.`, 
            visual: { 
                corMadeira: estilosMadeira[Math.floor(Math.random()*estilosMadeira.length)], 
                corAura: aurasPossiveis[Math.floor(Math.random()*aurasPossiveis.length)], 
                corCabo: estilosMadeira[Math.floor(Math.random()*estilosMadeira.length)], 
                estilo: hasteAlea, 
                hSeed: handleSeed
            } 
        };
    }
}


// ==========================================================
// A CLASSE MotorQuadribol FINAL (COM IA / BOTS AAA)
// ==========================================================
class MotorQuadribol {
    constructor() { 
        this.partidas = {}; 
        setInterval(() => { if(global.io) this.processarTick(global.io); }, 50); 
    }
    
    iniciarPartida(casaA, casaB) {
        const id = crypto.randomBytes(4).toString('hex');
        this.partidas[id] = { 
            id, casaA, casaB, pontosA: 0, pontosB: 0, 
            bola: { x: 400, y: 200, vx: 0, vy: 0, posse: null, cooldownCaptura: 0 },
            snitch: { active: false, x: 400, y: 200, timer: 600 }, // Demora a aparecer
            jogadores: {}, 
            tempoRestante: 8000, // Partida muito mais longa (~6.5 minutos)
            status: 'aguardando', 
            tempoEspera: 300 // 15 Segundos de Lobby para entrar mais gente
        };
        return this.partidas[id];
    }

    preencherComBots(partida) {
        const posicoes = ['Artilheiro', 'Apanhador', 'Goleiro'];
        ['A', 'B'].forEach(eq => {
            posicoes.forEach(pos => {
                let existe = Object.values(partida.jogadores).find(j => j.equipa === eq && j.posicao === pos);
                if (!existe) {
                    let botId = `BOT_${eq}_${pos}_${Math.floor(Math.random()*1000)}`;
                    let startX = eq === 'A' ? 150 : 650;
                    let startY = 200 + (Math.random() * 150 - 75);
                    partida.jogadores[botId] = { id: botId, nome: `[BOT] ${pos}`, posicao: pos, equipa: eq, x: startX, y: startY, isBot: true, vx: 0, vy: 0, tempoComBola: 0 };
                }
            });
        });
    }
    
    processarTick(ioGlobal) {
        let partidasParaDeletar = []; 

        for (let pid in this.partidas) {
            let p = this.partidas[pid]; 
            
            // ==================== LOBBY ====================
            if (p.status === 'aguardando') {
                if (p.tempoEspera > 0) {
                    p.tempoEspera--;
                    if (p.tempoEspera % 20 === 0) ioGlobal.to(p.id).emit('quadribol_msg', `O jogo começa em ${Math.floor(p.tempoEspera/20)}s... Junta-te à equipa!`);
                } else {
                    this.preencherComBots(p);
                    p.status = 'jogando';
                    ioGlobal.to(p.id).emit('quadribol_msg', `Apito Soou! A Partida Começou!`);
                }
                ioGlobal.to(p.id).emit('quadribol_update', p);
                continue;
            }

            if (p.status !== 'jogando') continue;
            p.tempoRestante--; 
            let alguemComPosse = false;
            if(p.bola.cooldownCaptura > 0) p.bola.cooldownCaptura--;

            // ==================== FÍSICA E IA DOS BOTS ====================
            for(let idB in p.jogadores) {
                let j = p.jogadores[idB];

                if (j.isBot) {
                    let alvoX = j.x; let alvoY = j.y; 
                    let velocidadeIA = 0.015; // BOTS MUITO MAIS LENTOS E HUMANIZADOS

                    if (j.posicao === 'Artilheiro') {
                        if (p.bola.posse === idB) {
                            alvoX = j.equipa === 'A' ? 780 : 20; 
                            alvoY = 200; velocidadeIA = 0.02; // Acelera um pouco com a bola
                            
                            j.tempoComBola = (j.tempoComBola || 0) + 1;

                            // TENTATIVA DE PASSE: Se estiver longe do golo, mas tiver um aliado à frente
                            let aliadoPerto = Object.values(p.jogadores).find(ali => ali.equipa === j.equipa && ali.id !== j.id && ali.posicao === 'Artilheiro');
                            if (aliadoPerto && j.tempoComBola > 40 && Math.hypot(j.x - alvoX, j.y - alvoY) > 300) {
                                if (Math.random() < 0.05) { // Chance de passar
                                    p.bola.posse = null; p.bola.cooldownCaptura = 20;
                                    p.bola.vx = (aliadoPerto.x - j.x) * 0.05; p.bola.vy = (aliadoPerto.y - j.y) * 0.05;
                                    j.tempoComBola = 0;
                                    ioGlobal.to(p.id).emit('quadribol_msg', `🤖 ${j.nome} passou a Goles!`);
                                }
                            }
                            // CHUTE AO GOLO: Só se estiver minimamente perto e após carregar a bola
                            else if (Math.hypot(j.x - alvoX, j.y - alvoY) < 250 && j.tempoComBola > 60) {
                                p.bola.posse = null; p.bola.cooldownCaptura = 25;
                                p.bola.vx = j.equipa === 'A' ? 22 : -22; p.bola.vy = (alvoY - j.y) * 0.05;
                                j.tempoComBola = 0;
                                ioGlobal.to(p.id).emit('quadribol_msg', `☄️ ${j.nome} chutou à baliza!`);
                            }
                        } else if (!p.bola.posse) {
                            alvoX = p.bola.x; alvoY = p.bola.y;
                            velocidadeIA = 0.018; 
                        } else if (p.jogadores[p.bola.posse].equipa !== j.equipa) {
                            let portador = p.jogadores[p.bola.posse];
                            alvoX = portador.x; alvoY = portador.y;
                        } else {
                            // Se a equipa tem a bola, espalham-se
                            alvoX = j.equipa === 'A' ? j.x + 50 : j.x - 50; alvoY = j.y + (Math.random()*40-20);
                        }
                    }
                    else if (j.posicao === 'Apanhador') {
                        if (p.snitch.active) { 
                            alvoX = p.snitch.x; alvoY = p.snitch.y; velocidadeIA = 0.022; 
                        } else { 
                            alvoX = 400 + (Math.random()*600-300); alvoY = 200 + (Math.random()*300-150); velocidadeIA = 0.005; 
                        }
                        
                        // O bot tem que ficar EXATAMENTE em cima do pomo (Hitbox microscópico) para o jogo não acabar rápido
                        if (p.snitch.active && Math.hypot(j.x - p.snitch.x, j.y - p.snitch.y) < 8) { 
                            p.status = 'finalizado'; if (j.equipa === 'A') p.pontosA += 150; else p.pontosB += 150; 
                            ioGlobal.to(p.id).emit('quadribol_fim', { vencedor: p.pontosA > p.pontosB ? p.casaA : p.casaB, snitchApanhado: true }); 
                            partidasParaDeletar.push(pid); continue; 
                        }
                    }
                    else if (j.posicao === 'Goleiro') {
                        alvoX = j.equipa === 'A' ? 30 : 770;
                        alvoY = Math.max(80, Math.min(320, p.bola.y)); // Acompanha a bola no eixo Y
                        
                        // O Goleiro Bot passa a bola se a apanhar
                        if(p.bola.posse === idB) {
                            j.tempoComBola = (j.tempoComBola || 0) + 1;
                            if(j.tempoComBola > 30) {
                                p.bola.posse = null; p.bola.cooldownCaptura = 20;
                                p.bola.vx = j.equipa === 'A' ? 20 : -20; p.bola.vy = (Math.random()*10 - 5);
                                j.tempoComBola = 0;
                            }
                        }
                    }

                    j.vx += (alvoX - j.x) * velocidadeIA; 
                    j.vy += (alvoY - j.y) * velocidadeIA;
                }

                // INÉRCIA E MOVIMENTO (Para Todos)
                j.x = (j.x || 400) + (j.vx || 0); j.y = (j.y || 200) + (j.vy || 0);
                j.x = Math.max(10, Math.min(790, j.x)); j.y = Math.max(10, Math.min(390, j.y));
                if(j.vx) j.vx *= 0.88; if(j.vy) j.vy *= 0.88; 

                // Goleiros refletem passivamente a bola
                if (j.posicao === 'Goleiro' && Math.hypot(j.x - p.bola.x, j.y - p.bola.y) < 40) {
                    if(p.bola.x < 150 || p.bola.x > 650) { 
                        p.bola.vx *= -1.5; 
                        if(!j.isBot) ioGlobal.to(p.id).emit('quadribol_msg', `🛡️ Grande defesa de ${j.nome}!`);
                    }
                }

                // LÓGICA DE POSSE DE BOLA E ROUBO
                if (p.bola.posse === idB) {
                    p.bola.x = j.x; p.bola.y = j.y + 15; p.bola.vx = 0; p.bola.vy = 0;
                    alguemComPosse = true;

                    for (let eId in p.jogadores) {
                        let inimigo = p.jogadores[eId];
                        if (inimigo.equipa !== j.equipa && Math.hypot(j.x - inimigo.x, j.y - inimigo.y) < 35) {
                            let chanceRoubo = (!inimigo.isBot && j.isBot) ? 0.6 : 0.1; // Humano rouba fácil do Bot
                            if (Math.random() < chanceRoubo) { 
                                p.bola.posse = eId; p.bola.cooldownCaptura = 20;
                                ioGlobal.to(p.id).emit('quadribol_msg', `💥 ${inimigo.nome} roubou a Goles!`); break;
                            } else {
                                inimigo.vx = (inimigo.x - j.x)*0.5; inimigo.vy = (inimigo.y - j.y)*0.5; 
                            }
                        }
                    }
                }
            } 

            // ALGUEM APANHA A BOLA SOLTA
            if (!alguemComPosse && p.bola.cooldownCaptura <= 0) {
                for(let idB in p.jogadores) {
                    let j = p.jogadores[idB];
                    if (Math.hypot(j.x - p.bola.x, j.y - p.bola.y) < 35 && j.posicao !== 'Apanhador') { 
                        p.bola.posse = idB; 
                        if(!j.isBot) ioGlobal.to(p.id).emit('quadribol_msg', `🧹 ${j.nome} dominou a Goles!`);
                        break; 
                    }
                }
            }

            // FÍSICA DA BOLA LIVRE
            if (!alguemComPosse) {
                p.bola.x += p.bola.vx; p.bola.y += p.bola.vy;
                p.bola.vx *= 0.96; p.bola.vy *= 0.96;
                p.bola.vx = Math.max(-25, Math.min(25, p.bola.vx)); 
                p.bola.vy = Math.max(-25, Math.min(25, p.bola.vy));

                if (p.bola.y < 10 || p.bola.y > 390) p.bola.vy *= -1;
                if (p.bola.x < 10 || p.bola.x > 790) p.bola.vx *= -1;
            }

            // GOLOS
            if (p.bola.x <= 40 && p.bola.y > 100 && p.bola.y < 300) { p.pontosB += 10; p.bola.posse = null; p.bola.x = 400; p.bola.y = 200; p.bola.vx = 0; p.bola.vy = 0; ioGlobal.to(p.id).emit('quadribol_msg', `GOLO DE ${p.casaB.toUpperCase()}!`); }
            if (p.bola.x >= 760 && p.bola.y > 100 && p.bola.y < 300) { p.pontosA += 10; p.bola.posse = null; p.bola.x = 400; p.bola.y = 200; p.bola.vx = 0; p.bola.vy = 0; ioGlobal.to(p.id).emit('quadribol_msg', `GOLO DE ${p.casaA.toUpperCase()}!`); }

            // ==================== COMPORTAMENTO DO POMO (SNITCH) ====================
            p.snitch.timer--;
            if (p.snitch.timer <= 0) {
                if (!p.snitch.active) { 
                    p.snitch.active = true; 
                    p.snitch.timer = 1500; // Fica visível bastante tempo
                    p.snitch.x = Math.random()*600+100; p.snitch.y = Math.random()*300+50; 
                    ioGlobal.to(p.id).emit('quadribol_msg', `✨ O POMO DE OURO FOI AVISTADO!`); 
                } else { 
                    p.snitch.active = false; 
                    p.snitch.timer = Math.floor(Math.random()*800)+400; // Some e demora a voltar
                    ioGlobal.to(p.id).emit('quadribol_msg', `O Pomo fugiu de vista...`);
                }
            } else if (p.snitch.active) {
                // O pomo foge rápido e errático
                p.snitch.x += (Math.random()-0.5)*18; p.snitch.y += (Math.random()-0.5)*18; 
                p.snitch.x = Math.max(20, Math.min(780, p.snitch.x)); p.snitch.y = Math.max(20, Math.min(380, p.snitch.y));
                
                for(let idB in p.jogadores) {
                    let j = p.jogadores[idB];
                    // O Jogador Humano tem uma hitbox muito maior (35) para conseguir apanhar
                    if (j.posicao === 'Apanhador' && !j.isBot && Math.hypot(j.x - p.snitch.x, j.y - p.snitch.y) < 35) {
                        p.status = 'finalizado'; if (j.equipa === 'A') p.pontosA += 150; else p.pontosB += 150; 
                        ioGlobal.to(p.id).emit('quadribol_fim', { vencedor: p.pontosA > p.pontosB ? p.casaA : p.casaB, snitchApanhado: true }); 
                        partidasParaDeletar.push(pid);
                        break;
                    }
                }
            }

            if (p.status === 'finalizado') continue; 

            if (p.tempoRestante <= 0) { 
                p.status = 'finalizado'; ioGlobal.to(p.id).emit('quadribol_fim', { vencedor: p.pontosA > p.pontosB ? p.casaA : p.casaB }); 
                partidasParaDeletar.push(pid); 
            } else { 
                ioGlobal.to(p.id).emit('quadribol_update', p); 
            }
        }

        // LIMPEZA E DAR XP/ELO
        partidasParaDeletar.forEach(id => {
            let p = this.partidas[id];
            for(let jId in p.jogadores) {
                let j = p.jogadores[jId];
                if(!j.isBot && global.coreInstance) {
                    let casaVencedora = p.pontosA > p.pontosB ? p.casaA : p.casaB;
                    let casaDesteJogador = j.equipa === 'A' ? p.casaA : p.casaB;
                    if (casaVencedora === casaDesteJogador) {
                        let a = global.coreInstance.alunos[j.id];
                        global.coreInstance._progressoQuest(a, 'quadribol', 'vitoria', 1);
                        a.elos.quadribol = (a.elos.quadribol || 1000) + 20;
                        global.coreInstance.ganharXp(a, 400); // Dá bastante XP por vencer Quadribol
                    }
                }
            }
            delete this.partidas[id];
        });
    } 

    acaoJogador(partidaId, alunoId, actionData) {
        const p = this.partidas[partidaId]; if (!p || p.status !== 'jogando') return;
        const j = p.jogadores[alunoId]; if (!j) return;

        if (actionData.vX !== undefined && actionData.vY !== undefined) {
            j.vx = actionData.vX * 16; j.vy = actionData.vY * 16; // Jogador é rápido
        }

        if (actionData.acao === 'chutar' && p.bola.posse === alunoId) {
            p.bola.posse = null; p.bola.cooldownCaptura = 20; 
            p.bola.vx = j.equipa === 'A' ? 35 : -35; p.bola.vy = (Math.random() * 10) - 5;
            global.io.to(p.id).emit('quadribol_msg', `☄️ ${j.nome} lançou a Goles!`);
        }
    }
    
    entrarQuadribol(alunoId, posicao) {
        const a = global.coreInstance.alunos[alunoId]; if(!a) return { erro: "Fantasma." };
        let match = Object.values(this.partidas).find(p => p.status === 'aguardando');
        if (!match) match = this.iniciarPartida('Gryffindor', 'Slytherin'); 
        
        let equipa = match.casaA === a.casa ? 'A' : 'B';
        if (Object.values(match.jogadores).some(j => j.id !== a.id && j.equipa === 'A')) equipa = 'B';

        let startX = equipa === 'A' ? 200 : 600; let startY = 200 + (Math.random() * 50 - 25);

        match.jogadores[a.id] = { id: a.id, nome: a.nome, posicao, equipa, x: startX, y: startY, isBot: false };
        
        return { sucesso: true, matchId: match.id, msg: `Entraste no Balneário. Prepara-te!` };
    }
}
class MotorConscienciaHogwarts {
    constructor() {
        const chavesEnv = process.env.GROQ_API_KEY || "";
        // 🔥 A MÁGICA DO POOLING: Separa as chaves por vírgula e cria um arsenal!
        this.apiKeys = chavesEnv.split(',').map(k => k.trim()).filter(k => k.length > 0);
        this.currentKeyIndex = 0;
        this.iaBloqueadaAte = 0; 
        
        if (this.apiKeys.length > 0) {
            this.apiKey = this.apiKeys[this.currentKeyIndex];
            this.groq = new Groq({ apiKey: this.apiKey });
            console.log(`🔑 [SISTEMA IA] Arsenal Mágico carregado com ${this.apiKeys.length} Varinhas (Chaves Groq)!`);
        }

        this.Penseira = {
            livrosDaBiblioteca: {}, capitulosAulas: {}, quizzes: [], 
            atmosferas: {}, noticias: [], chatCooldowns: {}, 
            mobDrops: {}, pocoesIneditas: {}
        };
    }

    // 🔥 NOVA FUNÇÃO: Troca de chave instantaneamente quando a atual esgota!
    rodarChave() {
        this.currentKeyIndex++;
        if (this.currentKeyIndex >= this.apiKeys.length) {
            console.log("❌ [SISTEMA IA] TODAS as chaves do arsenal esgotaram o limite diário!");
            return false;
        }
        console.log(`🔄 [SISTEMA IA] Chave esgotada! A equipar a Chave nº ${this.currentKeyIndex + 1}...`);
        this.apiKey = this.apiKeys[this.currentKeyIndex];
        this.groq = new Groq({ apiKey: this.apiKey }); // Inicia nova conexão fresca!
        return true;
    }	
	// Adicione um verificador
    podeUsarIA() {
        if (!this.apiKey) return false;
        if (Date.now() < this.iaBloqueadaAte) return false; // Se estiver de castigo, ignora a IA
        return true;
    }

    _extrairJSONBlindado(str) {
        try {
            // Remove blocos de markdown de código (```json ... ```) se a IA alucinar
            let puro = str.replace(/```json/gi, '').replace(/```/g, '').trim();
            const match = puro.match(/\{[\s\S]*\}/);
            if (!match) return null;
            puro = match[0].replace(/(?:\r\n|\r|\n)/g, ' '); 
            puro = puro.replace(/([{,]\s*)([A-Za-z0-9_]+)\s*:/g, '$1"$2":');
            puro = puro.replace(/""/g, '"');
            return JSON.parse(puro);
        } catch (e) { 
            console.error("👁️ Falha JSON IA:", e.message); 
            return null; 
        }
    }
	async gerarAtmosferaLocal(zona) {
        if (!this.apiKey) {
            return "As tochas cintilam suavemente na pedra fria.";
        }
        try {
            // Modelo 8B é o melhor para coisas curtas para poupar o limite de 6000 TPM
            const prompt = `Age como J.K. Rowling. Cria UMA FRASE curta, inédita e altamente imersiva descrevendo o que está a acontecer AGORA em "${zona}" no Castelo de Hogwarts. Descreve cheiros, sons distantes, o clima nas janelas, fantasmas passando ou alunos ao fundo. NUNCA REPITA.`;
            const res = await this.groq.chat.completions.create({ 
                messages: [{ role: "user", content: prompt }], 
                model: "llama-3.1-8b-instant", 
                max_tokens: 500, // Limite baixo para isto não gerar erro 413
                temperature: 1.0 
            });
            return res.choices[0].message.content.replace(/["']/g, '').trim();
        } catch(e) { 
            console.error(`🔴 Erro na IA Atmosfera em ${zona}:`, e.message); 
            return "Um eco misterioso ressoa pelas paredes de pedra..."; 
        }
    }
	// 1. Gera apenas o Esqueleto do Livro (20 Capítulos Rápidos)
    async gerarEmentaLivro(materia, anoLetivo = 1) {
        if (!this.apiKey) return null;
        const prompt = `És o Diretor Académico de Hogwarts. Cria o Índice (Tabela de Conteúdos) para o manual oficial de "${materia}" do ${anoLetivo}º ano.
        O livro terá EXATAMENTE 20 Capítulos, cobrindo o ano inteiro desde os fundamentos até a magias avançadas e perigosas no fim.
        Retorna APENAS o JSON estrito:
        { "titulos": ["1. Origens da Matéria", "2. Segurança Básica", "3. ... até o 20"] }`;

        try {
            const res = await this.groq.chat.completions.create({
                messages: [{ role: "user", content: prompt }], model: "llama-3.1-8b-instant", response_format: { type: "json_object" }
            });
            const data = this._extrairJSONBlindado(res.choices[0].message.content);
            if (data && data.titulos && data.titulos.length > 0) {
                // Formata os capítulos para o banco de dados (Vazios de conteúdo, apenas o título)
                return data.titulos.map((t, i) => ({ cap: i + 1, titulo: t, teoria: null, pratica: null, pergunta: null }));
            }
        } catch (e) { console.error("Erro Ementa:", e.message); } return null;
    }

    // 2. Gera O CAPÍTULO COLOSSAL quando solicitado!
   // 2. Gera O CAPÍTULO COLOSSAL quando solicitado!
    // 2. Gera O CAPÍTULO COLOSSAL com Contexto de Continuidade
    async escreverCapituloColossal(materia, tituloCapitulo, numeroCapitulo, ementaCompleta) {
        if (!this.apiKey) return null;
        
        // 🔥 O TRUQUE DE MESTRE: Damos o mapa do livro à IA para ela saber onde está!
        const prompt = `És o Arquivista Supremo de Hogwarts. Estás a escrever o manual oficial de "${materia}".
        
        A EMENTA COMPLETA DO LIVRO É ESTA: [ ${ementaCompleta} ]
        
        A TUA TAREFA: Escreve APENAS o conteúdo do Capítulo ${numeroCapitulo}: "${tituloCapitulo}".
        
        REGRAS DE CONTINUIDADE E ESCRITA:
        1. Foca-te EXCLUSIVAMENTE no tema deste capítulo. Olha para a Ementa acima e NUNCA repitas temas de capítulos passados, nem dês spoilers de capítulos futuros. Mantém a progressão didática!
        2. A secção "teoria" deve ser COLOSSAL e PROFUNDA. Explora a história, os acidentes documentados e a física mágica.
        3. VITAL: A "teoria" deve ser OBRIGATORIAMENTE uma LISTA (Array) contendo entre 6 a 10 parágrafos DENSOS. Não resuma.
        4. A secção "pratica" deve explicar passo-a-passo a posição da varinha.
        5. A "pergunta" será usada pelo professor para debater na aula.

        Retorna APENAS o JSON estrito:
        {
          "teoria": [
             "Parágrafo colossal 1...",
             "Parágrafo colossal 2...",
             "Parágrafo colossal 3...",
             "Parágrafo colossal 4...",
             "Parágrafo colossal 5...",
             "Parágrafo colossal 6..."
          ],
          "pratica": "Instruções práticas exaustivas aqui...",
          "pergunta": "Uma pergunta teórica desafiadora?"
        }`;

        try {
            const res = await this.groq.chat.completions.create({
                messages: [
                    { role: "system", content: "Escreves textos imersivos e massivos sobre o universo de J.K.Rowling." },
                    { role: "user", content: prompt }
                ],
                model: "llama-3.1-8b-instant", 
                response_format: { type: "json_object" },
                temperature: 0.7,
                max_tokens: 4500 
            });
            
            let data = this._extrairJSONBlindado(res.choices[0].message.content);
            
            if (data && Array.isArray(data.teoria)) {
                data.teoria = data.teoria.join('\n\n');
                return data;
            } else if (data && typeof data.teoria === 'string') {
                return data; 
            }
            
            return null;
        } catch (e) { 
            // 🔥 CORREÇÃO: Agora ele deteta o erro 413 e o aviso de "tokens"
            if (e.message.includes('429') || e.message.includes('Rate limit') || e.message.includes('413') || e.message.includes('tokens')) {
                console.log(`⚠️ [ALERTA DE LIMITE GROQ]: TPM Esgotado ou Payload grande. Tentando rodar a chave...`);
                if (this.rodarChave()) {
                    return { trocarChave: true }; 
                } else {
                    return { rateLimit: true }; 
                }
            }
            console.error("Erro Capítulo Colossal:", e.message); 
            return null; 
        }
	}
	// Dentro da classe MotorConscienciaHogwarts em HogwartsCore.js
// Adicione estes métodos dentro da classe MotorConscienciaHogwarts em HogwartsCore.js
async gerarMobiliaMagica() {
        if (!this.apiKey) return null;
        try {
            const prompt = `Gera uma peça de mobília mágica, bizarra e única para a Sala Precisa em Hogwarts.
            Pode ser um armário torto e vivo, um pedestal com uma relíquia flutuante, um espelho das trevas, uma mesa de alquimia caótica, um assento de veludo amaldiçoado ou um tapete rúnico.
            RETORNE APENAS UM JSON ESTRITO E VÁLIDO:
            {
                "nome": "Espelho de Ojesed Fragmentado",
                "lore": "Mostra os teus desejos mais sombrios e distorcidos.",
                "tipo": "reliquia", 
                "cores": ["#2c3e50", "#000000", "#8e44ad"],
                "aura": "#9b59b6",
                "tamanho": {"w": 60, "h": 100},
                "formatoSeed": 42
            }
            DICA: O tipo DEVE SER um destes: "reliquia", "armario", "mesa", "assento", "tapete".`;
            
            const res = await this.groq.chat.completions.create({ 
                messages: [{ role: "user", content: prompt }], 
                model: "llama-3.1-8b-instant", 
                response_format: { type: "json_object" } 
            });
            return this._extrairJSONBlindado(res.choices[0].message.content);
        } catch(e) { return null; }
    }
	
	// 🔥 PATCH 3.0: GERAÇÃO PROCEDURAL INFINITA DE EQUIPAMENTOS
    async gerarEquipamentoRPG(tipoPeca, nivelJogador) {
        if (!this.podeUsarIA()) return this._fallbackEquipamento(tipoPeca, nivelJogador);

        const prompt = `Cria um equipamento mágico épico do tipo "${tipoPeca}" para um bruxo de nível ${nivelJogador}.
        O tipo DEVE SER: "cabeca" (Chapéus/Capuzes), "corpo" (Vestes/Armaduras) ou "pescoco" (Cachecóis/Amuletos).
        Gera atributos bónus (intelecto, destreza, vigor, percepcao) somando no máximo ${nivelJogador * 2} pontos no total.
        RETORNE APENAS JSON ESTRITO:
        {
            "nome": "Capa do Corvo da Noite",
            "tipo": "corpo",
            "lore": "Tecida com penas caídas na Floresta Proibida.",
            "atributos": { "intelecto": 2, "vigor": 1, "destreza": 0, "percepcao": 0 },
            "visual": { "cor1": "#1a1c23", "cor2": "#34495e", "estilo": "rasgado" }
        }`;

        try {
            const res = await this.groq.chat.completions.create({
                messages: [{ role: "user", content: prompt }],
                model: "llama-3.1-8b-instant",
                response_format: { type: "json_object" },
                max_tokens: 800
            });
            return this._extrairJSONBlindado(res.choices[0].message.content) || this._fallbackEquipamento(tipoPeca, nivelJogador);
        } catch(e) { return this._fallbackEquipamento(tipoPeca, nivelJogador); }
    }

    _fallbackEquipamento(tipo, nivel) {
        return { 
            nome: `${tipo === 'cabeca' ? 'Chapéu' : (tipo==='corpo'?'Veste':'Cachecol')} Desgastado`, tipo: tipo, lore: "Cheira a naftalina.",
            atributos: { intelecto: 1, vigor: 1, destreza: 0, percepcao: 0 }, visual: { cor1: "#444", cor2: "#222", estilo: "basico" }
        };
    }
async gerarLivroCompleto(alunoNome, assunto, estilo) {
        if (!this.apiKey) return { titulo: "Tomo Vazio", conteudo: "A magia da IA está desligada no servidor." };
        
        try {
            const prompt = `És o bibliotecário-chefe de Hogwarts. Escreve um capítulo de um livro de lore do universo de Harry Potter sobre: "${assunto}". 
            O estilo literário deve ser: "${estilo}". O autor fictício da obra é: "${alunoNome}".
            O conteúdo deve ser rico, detalhado e mágico (máximo 4 parágrafos).
            
            OBRIGATÓRIO - RETORNA APENAS UM JSON ESTRITO E VÁLIDO SEGUINDO ESTE FORMATO:
            {
                "titulo": "O Título do Livro Gerado",
                "conteudo": "Todo o texto da história aqui, usando \\n para quebras de linha."
            }`;

            const res = await this.groq.chat.completions.create({
                messages: [{ role: "user", content: prompt }],
                model: "llama-3.1-8b-instant",
                response_format: { type: "json_object" }, // 🔥 BLOQUEIO INFALÍVEL
                temperature: 0.7
            });
            
            const parseado = this._extrairJSONBlindado(res.choices[0].message.content);
            if (!parseado) throw new Error("Falha no JSON");
            
            return parseado;
        } catch (e) { 
            console.error("Erro na Biblioteca IA:", e);
            return null; 
        }
    }

async avaliarEstudoParaAprender(alunoSummary, feiticoOriginal) {
    const prompt = `Um aluno submeteu este resumo de estudo: "${alunoSummary}". 
    Ele quer aprender o feitiço "${feiticoOriginal.nome}" que tem a lore: "${feiticoOriginal.lore}".
    Analise se o aluno demonstrou compreensão real. Se sim, aprove.
    RETORNE APENAS JSON: {"aprovado": true, "feedback": "..."}`;

    try {
        const res = await this.groq.chat.completions.create({
            messages: [{ role: "user", content: prompt }],
            model: "llama-3.1-8b-instant",
            response_format: { type: "json_object" }
        });
        return this._extrairJSONBlindado(res.choices[0].message.content);
    } catch (e) { return { aprovado: false, feedback: "A conexão com a biblioteca falhou." }; }
}

async avaliarTeseMagica(aluno, manuscrito) {
        const prompt = `És a Consciência de Hogwarts. Analisa a tese: "${manuscrito}".
        
        REGRAS DE EQUILÍBRIO (MÁXIMO DE MANA 10):
        - Tier 1: custoMana 2-3 | valorBase 100
        - Tier 2: custoMana 4-6 | valorBase 250
        - Tier 3: custoMana 7-8 | valorBase 500
        - Tier 4: custoMana 9-10 | valorBase 900
        
        DNA VISUAL AVANÇADO (visualConfig):
        - shape: 'bolt' (raio zig-zag), 'sphere' (bola clássica), 'meteor' (chuva do céu), 'wave' (meia-lua cortante), 'slash' (lâmina invisível), 'spiral' (hélice dupla giratória), 'beam' (laser contínuo).
        - color: código Hex da cor principal.
        - glow: código Hex do brilho.
        - quantity: 1 a 15 projéteis.
        - speed: velocidade (15 a 35).
        - trailSize: tamanho do rastro (10 a 50).
        - movement: 'linear' (reto), 'wavy' (movimento senoidal em onda), 'erratic' (tremeluzente/caótico).
        - particleStyle: 'sparks' (faíscas de luz), 'smoke' (fumaça escura), 'stars' (estrelas brilhantes), 'void' (distorção negra/vácuo), 'blood' (gotas vermelhas).
        - impactEffect: 'explosion' (explosão radial), 'implosion' (suga para o centro antes de explodir), 'nova' (anel de energia massivo), 'shatter' (quebra como vidro).
        Regras:

        - O shape define obrigatoriamente o tipo de movimento e impacto.

        - Nunca gerar comportamento que contradiga o shape.

        - Sempre associar origem + trajetória + efeito final.





    - color:

        Define a cor base dominante da habilidade (Hex).

        A IA deve interpretar a cor como identidade elemental e emocional.



        Interpretação:

        - Vermelho (#FF0000 - #FF5500) → fogo, agressividade, destruição

        - Azul (#0099FF - #00CCFF) → energia, gelo, controle

        - Roxo (#8000FF - #CC00FF) → arcano, caos, magia instável

        - Verde (#00FF66 - #66FF99) → veneno, natureza, corrupção

        - Amarelo (#FFFF00 - #FFD700) → luz, eletricidade, poder divino

        - Branco (#FFFFFF) → pureza, energia máxima

        - Preto (#000000) → vazio, escuridão, anulação



Regras:
- Deve influenciar partículas, iluminação e impacto.
- Pode variar em tons durante o movimento.
- Deve harmonizar ou contrastar com o glow.
- glow:
Define a cor do brilho externo e da aura energética.
Função:
- Criar sensação de energia irradiando
- Destacar o efeito no ambiente
- Adicionar profundidade visual
Interpretação:
- Glow igual ao color → efeito coeso e sólido
- Glow contrastante → efeito mais mágico ou instável
A IA deve:
- Criar pulsação, vibração ou emissão contínua
- Aplicar bloom visual (brilho forte)
- Expandir levemente além da forma principal
- quantity:
Define quantas instâncias do efeito existem simultaneamente.
Escala:
- 1 a 2   → ataque focado, precisão máxima
- 3 a 5   → múltiplos projéteis controlados
- 6 a 10  → ataque em área moderado
- 11 a 15 → caos visual, chuva massiva, destruição em larga escala
A IA deve:
- Determinar distribuição (linha, arco, círculo, chuva, aleatório)
- Definir se ocorre simultâneo ou em sequência
- Evitar sobreposição visual confusa
- speed:
Define a velocidade de movimento do efeito.
Escala:
- 15 a 18 → lento/pesado (sensação de massa e impacto)
- 19 a 24 → equilibrado (controle + impacto)
- 25 a 30 → extremamente rápido (difícil de reagir)
A IA deve:
- Ajustar sensação de peso vs agilidade
- Alterar tempo de impacto
- Influenciar o comprimento do rastro
- trailSize:
Define o tamanho e intensidade do rastro visual deixado pelo movimento.
Escala:
- 10 a 15 → rastro leve, quase imperceptível
- 16 a 25 → rastro visível e estilizado
- 26 a 40 → rastro dominante, cinematográfico
A IA deve:
- Gerar partículas residuais (faíscas, fumaça, energia)
- Criar persistência temporal (rastro permanece após movimento)
- Ajustar largura e opacidade do rastro
REGRAS GLOBAIS DE INTERPRETAÇÃO:
- Sempre converter os valores em comportamento visual, nunca apenas repetir.
- Sempre criar uma sequência lógica:

origem → movimento → trajetória → impacto → dissipação


- Sempre adicionar:
- partículas secundárias
- efeitos de luz
- sensação física (calor, choque, pressão, tremor)
- Sempre manter coerência:
- velocidade deve combinar com shape
- quantidade deve combinar com escala do ataque
- cores devem reforçar o tema
- Sempre gerar sensação de poder e impacto visual forte.
        RETORNE JSON ESTRITO (Exemplo para Implosão de Vácuo):
        {
            "aprovado": true,
            "feedback": "Uma teoria fascinante sobre a física do vácuo.",
            "feitico": {
                "nome": "Implosio Totalis", "tipoMecanica": "ataque", "elemento": "cinetico",
                "valorBase": 600, "custoMana": 8,
                "visualConfig": { "shape": "sphere", "color": "#8e44ad", "glow": "#4b0082", "quantity": 1, "speed": 18, "trailSize": 10, "movement": "linear", "particleStyle": "void", "impactEffect": "implosion" },
                "lore": "Colapso de pressão atmosférica."
            }
        REGRAS DE SINERGIA E STATUS (NOVO E PROFUNDO):
        - A tua tarefa é criar combos MTG/MMORPG. Podes adicionar 'efeitoSecundario' à magia. Efeitos válidos:
          'queimar' (DoT de fogo), 'sangrar' (DoT de trevas), 'envenenar' (DoT de natureza), 'atordoar' (Impede ataque), 'congelado' (Impede ataque + combo cinético), 'desarmar' (Impede ataque), 'vulneravel' (Alvo sofre o dobro do dano), 'molhado' (Combo elétrico), 'anti_cura' (Quebra escudos).
        - Podes adicionar 'buffJogador' para classes de Suporte/Tank: 'regeneracao' (Cura por tempo), 'espinhos' (Reflete dano), 'pressa' (Reduz custo de feitiços).
        - Podes adicionar 'duracao' (em turnos 1 a 5).
        - Podes adicionar 'lifesteal' (ex: 0.3 para 30% do dano curar o jogador).
        - Podes adicionar 'purificar': true (remove status negativos do jogador).
        RETORNE JSON ESTRITO (Exemplo para Implosão de Vácuo):
        {
            "aprovado": true,
            "feedback": "Uma teoria fascinante sobre a física do vácuo.",
            "feitico": {
                "nome": "Implosio Totalis", "tipoMecanica": "status", "elemento": "cinetico",
                "valorBase": 200, "custoMana": 8, "efeitoSecundario": "atordoar", "duracao": 2,
                "visualConfig": { "shape": "sphere", "color": "#8e44ad", "glow": "#4b0082", "quantity": 1, "speed": 18, "trailSize": 10, "movement": "linear", "particleStyle": "void", "impactEffect": "implosion" },
                "lore": "Colapso de pressão atmosférica."
            }
        }`;       
        try {
            const res = await this.groq.chat.completions.create({ messages: [{ role: "user", content: prompt }], model: "llama-3.1-8b-instant", response_format: { type: "json_object" } });
            return this._extrairJSONBlindado(res.choices[0].message.content);
        } catch (e) { return { aprovado: false, feedback: "Falha na conexão astral." }; }
    }

	async folhearLivroAula(materia, livro, anoLetivo) {
        if (!this.apiKey) return { texto: "As letras fogem dos teus olhos." };
        try {
            const prompt = `Escreve um excerto real e detalhado do livro mágico "${livro}" da disciplina de ${materia}. O leitor é um aluno do ${anoLetivo}º Ano em Hogwarts.
            PROGRESSÃO DIDÁTICA ESTRUTURADA: O texto deve conter um Início (teoria de acordo com o ano), Meio (como realizar na prática) e Fim (cuidados/perigos). Finge que é a página exata da aula de hoje para um estudante do ${anoLetivo}º ano.
            OBRIGATÓRIO RESPONDER APENAS NO FORMATO JSON ABAIXO, SEM MAIS NENHUM TEXTO:
            {"texto": "O parágrafo do livro começa aqui..."}`;
            
            const res = await this.groq.chat.completions.create({ 
                messages: [{ role: "user", content: prompt }], 
                model: "llama-3.1-8b-instant",
                response_format: { type: "json_object" } 
            });
            return this._extrairJSONBlindado(res.choices[0].message.content) || { texto: "Página rasgada." };
        } catch(e) { return { texto: "O livro trancou as suas páginas." }; }
    }

    async respostaProfessorIA(professor, materia, alunoNome, mensagem, casa, anoLetivo) {
        if (!this.apiKey) return null;
        try {
            const prompt = `És o Professor ${professor} de ${materia}. A tua turma tem alunos do ${anoLetivo}º Ano. O aluno ${alunoNome} (${casa}) disse na aula: "${mensagem}". 
            Avalia a resposta do aluno com base na teoria mágica adequada para o ${anoLetivo}º Ano. Se a resposta fizer sentido e mostrar estudo, elogia e dá 10 XP (escreve "+10 XP" no texto). Se for asneira ou estiver incorreta para este nível escolar, repreende-o e retira 5 pontos à casa.
            Sê RÁPIDO, DIRETO E CURTO. NO MÁXIMO 2 FRASES.
            OBRIGATÓRIO RESPONDER APENAS NO FORMATO JSON ABAIXO:
            {"texto": "Muito bem dito, ${alunoNome}! Mais 10 XP.", "pontos": 10}`;
            
            const res = await this.groq.chat.completions.create({ 
                messages: [{ role: "user", content: prompt }], 
                model: "llama-3.1-8b-instant", 
                response_format: {type: "json_object"} 
            });
            return this._extrairJSONBlindado(res.choices[0].message.content);
        } catch(e) { return null; }
    }
	
	async gerarNoticiaProfeta() {
        if (!this.apiKey) return "Avistamentos de Nargles na Escócia reportados por Luna Lovegood.";
        try {
            const prompt = `Escreve uma manchete super criativa e curta (1 frase) para o jornal 'O Profeta Diário' do mundo de Harry Potter. Pode ser sobre o Ministério, Quidditch, ou coisas engraçadas no mundo bruxo. APENAS O TEXTO DA NOTÍCIA, sem aspas.`;
            const res = await this.groq.chat.completions.create({ messages: [{ role: "user", content: prompt }], model: "llama-3.1-8b-instant" });
			return res.choices[0].message.content.replace(/["']/g, '').trim();
        } catch(e) { return "O Ministério aprova nova lei sobre caldeirões de espessura padrão."; }
    }
async gerarCapituloLivro(nomeLivro) {
        if (!this.apiKey) return "A magia deste tomo está adormecida. Não detetei a chave da IA (GROQ_API_KEY). Verifica o teu terminal ou ficheiro .env.";
        try {
            const prompt = `És J.K. Rowling. Escreve um capítulo imersivo (cerca de 3 parágrafos) do livro "${nomeLivro}". O texto deve conter conhecimento mágico real (feitiços, poções ou criaturas) que um aluno de Hogwarts leria. Sem saudações, apenas o texto do livro.`;
            const res = await this.groq.chat.completions.create({ messages: [{ role: "user", content: prompt }], model: "llama-3.1-8b-instant", temperature: 1.0 });
			return res.choices[0].message.content.trim();
        } catch (e) {
            return "As páginas estão manchadas de tinta e ilegíveis.";
        }
    }
	async gerarQuestProcedural(aluno) {
        if (!this.apiKey) return null;
        try {
            const prompt = `Cria uma Missão RPG em Hogwarts para um aluno.
            Tipos permitidos OBRIGATÓRIOS: "coleta" (achar ingredientes), "pve" (derrotar monstros) ou "quadribol" (vencer partidas).
            
            REGRAS ABSOLUTAS:
            1. Se for "coleta", o alvo DEVE SER um destes: "asfodelo", "bezoar", "mandragora", "ditamno" ou "muco". A lore DEVE instruir o jogador a usar o botão 'Vasculhar Chão' num terreno ao ar livre (ex: Pátio, Estufas). NUNCA mande coletar ervas em salas de aula ou biblioteca.
            2. Se for "pve", o alvo DEVE SER um destes: "aranha", "basilisco", "dementador", "lobisomem" ou "trasgo". A lore DEVE mandar o jogador ir lutar na 'Floresta Proibida'.
            3. Se for "quadribol", o alvo é: "vitoria".

            RETORNE SÓ JSON ESTRITO E VÁLIDO:
            {
                "titulo": "A Ameaça das Aranhas",
                "lore": "Hagrid relatou que há aranhas a solta na Floresta...",
                "objetivo": "Derrota 2 Aranhas na Floresta",
                "tipo": "pve",
                "alvo": "aranha",
                "meta": 2,
                "recompensaGaleoes": 200,
                "recompensaXp": 500
            }`;
            const res = await this.groq.chat.completions.create({ messages: [{ role: "user", content: prompt }], model: "llama-3.1-8b-instant", response_format: {type: "json_object"} });
            let q = this._extrairJSONBlindado(res.choices[0].message.content);
            if(q) { q.progresso = 0; q.concluida = false; return q; }
            return null;
        } catch(e) { return null; }
    }
    async entrevistarAluno(nome, respostaAberta) {
        const fallback = ["Gryffindor", "Slytherin", "Ravenclaw", "Hufflepuff"][Math.floor(Math.random() * 4)];
        if (!this.apiKey) return { casa: fallback, relato: "Hmm, tens algo peculiar na tua mente..." };
        try {
            const prompt = `Age como o Chapéu Seletor de Hogwarts. Analisa: "${respostaAberta}". Retorna EXATAMENTE O JSON ABAIXO, substituindo a casa por Gryffindor, Slytherin, Ravenclaw ou Hufflepuff, e criando uma fala realista:
            {"casa": "Gryffindor", "relato": "Uma mente astuta, vejo... mas há coragem!"}`;
            const res = await this.groq.chat.completions.create({ messages: [{ role: "user", content: prompt }], model: "llama-3.1-8b-instant" });
            return this._extrairJSONBlindado(res.choices[0].message.content) || { casa: fallback, relato: "Vejo o teu destino..." };
        } catch (e) { return { casa: fallback, relato: "Vou pelo palpite." }; }
    }

    // Substitua a sua função forjarVarinhaUnica por esta versão "Blindada"
async forjarVarinhaUnica(nomeAluno, personalidadeInput) {
        if (!this.podeUsarIA()) return Ollivanders.forjarVarinhaDestinada(nomeAluno); // Retorno instantâneo sem lag!
        
        try {
        const prompt = `És o mestre Ollivander. Analisa esta alma bruxa: "${personalidadeInput}". 
Cria uma varinha que a represente. Responde EXCLUSIVAMENTE com o objeto JSON abaixo, sem qualquer texto adicional:
{
  "nome": "Nome da Varinha",
  "nucleo": "Pena de Fénix/Coração de Dragão/Pêlo de Unicórnio",
  "comprimento": "X pol",
  "lore": "Uma frase curta de lore",
  "afinidade": "feiticos/artes_trevas/defesa/transfiguracao",
  "poderBase": 35,
  "visual": {
    "corMadeira": "#hex",
    "corAura": "rgba(r,g,b,0.4)",
    "corCabo": "#hex",
    "estilo": "curva ou reta"
  }
}`;
        const res = await this.groq.chat.completions.create({ 
            messages: [{ role: "user", content: prompt }], 
            model: "llama-3.1-8b-instant",
            response_format: { type: "json_object" } // Força o modo JSON
        });
        
        const data = JSON.parse(res.choices[0].message.content);
        return data; 
    } catch(e) { 
        console.error("Erro Ollivander IA:", e);
        return Ollivanders.forjarVarinhaDestinada(nomeAluno); 
    }
}

    // A AULA REAL (A IA PROFESSOR)
    async darAulaCompleta(professor, aula, alunoNome) {
        if (!this.apiKey) return { texto: `A aula de ${aula} decorreu normalmente.`, temLoot: true, lootNome: `Notas da Aula` };
        try {
            const prompt = `És o Professor ${professor} a dar aula de ${aula} a ${alunoNome}. O teu conhecimento de Harry Potter é infinito. 
            Dá uma aula real, explicando detalhadamente um feitiço, poção ou criatura exata dos livros. Termina a tua fala perguntando algo diretamente à turma.
            RETORNE SÓ JSON: {"texto": "Silêncio na sala! Hoje vamos estudar...", "temLoot": true, "lootNome": "Pergaminho de Estudo"}`;
            const res = await this.groq.chat.completions.create({ messages: [{ role: "user", content: prompt }], model: "llama-3.1-8b-instant" });
            return this._extrairJSONBlindado(res.choices[0].message.content) || { texto: "Aula proveitosa.", temLoot: true, lootNome: `Notas de ${aula}` };
        } catch (e) { return { texto: `Aula em silêncio.`, temLoot: false }; }
    }
    // ARQUIVO HISTÓRICO DE HOGWARTS (O Saber Absoluto)
    async gerarLivroLore(assunto) {
        if (!this.apiKey) return { titulo: `Tomo sobre ${assunto}`, texto: "Páginas gastas." };
        
        // Chave normalizada para busca (Ex: "as horcruxes" -> "as_horcruxes")
        let chave = assunto.toLowerCase().trim().replace(/ /g, '_');
        
        // ECONOMIA: Se alguém já leu sobre este assunto hoje, devolve o livro salvo! (Custo 0)
        if (this.Penseira.livrosDaBiblioteca[chave]) {
            return this.Penseira.livrosDaBiblioteca[chave];
        }

        try {
            const prompt = `És a enciclopédia definitiva de Harry Potter. O aluno procurou ler sobre: "${assunto}".
            Escreve o conteúdo de um livro histórico oficial de Hogwarts com profundidade extrema, detalhando as origens, os usos e os perigos do tema.
            RETORNA APENAS O JSON:
            {"titulo": "A História Oculta de...", "texto": "Há séculos atrás..."}`;
            const res = await this.groq.chat.completions.create({ messages: [{ role: "user", content: prompt }], model: "llama-3.1-8b-instant" });
            let livro = this._extrairJSONBlindado(res.choices[0].message.content);
            
            if(livro && livro.titulo) {
                this.Penseira.livrosDaBiblioteca[chave] = livro; // Guarda na estante virtual
                return livro;
            }
            throw new Error();
        } catch(e) { return { titulo: "Tomo Selado", texto: "Protegido por magia antiga." }; }
    }

    async folhearLivro(alunoId) {
        const a = this.alunos[alunoId]; if (!a || a.focoAtual < 1) return { erro: "Foco Insuficiente (Requer 1)." };
        const relogio = RelogioHogwarts.obterHorarioAtual();
        if (relogio.aulaAtiva === "Livre") return { erro: "A sala está vazia. Não há livros na tua mesa." };
        
        a.focoAtual -= 1;
        const lido = await this.cerebroIA.folhearLivroAula(relogio.aulaAtiva, relogio.requerLivro || "Tomo Antigo", a.anoLetivo || 1);
        
        // 🔥 CORREÇÃO: Chamada correta ao novo sistema assíncrono de XP
        await this._addXp(a, 25);
        this._salvarBancoDeDados();
        
        return { sucesso: true, texto: lido.texto };
    }
	
	async gerarQuizIA() {
        if (!this.apiKey) return { pergunta: "A magia é real?", opcoes: ["Sim", "Não", "Talvez", "Sempre"], correta: 0 };
        
        // ECONOMIA: Se já gerámos 20 perguntas, usa a cache em vez de pagar a API!
        if (this.Penseira.quizzes.length >= 20 && Math.random() < 0.9) {
            return this.Penseira.quizzes[Math.floor(Math.random() * this.Penseira.quizzes.length)];
        }

        try {
            const prompt = `Gera uma pergunta muito difícil de conhecimento avançado sobre o universo de Harry Potter (Feitiços, Poções, Criaturas ou História).
            Cria 4 opções de resposta curtas. Indica o índice (0 a 3) da resposta correta.
            RETORNE APENAS UM JSON ESTRITO E VÁLIDO:
            {
                "pergunta": "Qual é o principal ingrediente da Poção Polissuco?",
                "opcoes": ["Asfódelo", "Hemeróbios", "Sangue de Unicórnio", "Bezoar"],
                "correta": 1
            }`;
            const res = await this.groq.chat.completions.create({ 
                messages: [{ role: "user", content: prompt }], 
                model: "llama-3.1-8b-instant",
                response_format: { type: "json_object" }
            });
            const dados = this._extrairJSONBlindado(res.choices[0].message.content);
            if(dados && dados.opcoes && Array.isArray(dados.opcoes)) {
                this.Penseira.quizzes.push(dados); // Guarda na memória!
                return dados;
            }
            throw new Error("Formato inválido.");
        } catch(e) { return { pergunta: "A magia falhou?", opcoes: ["Sim", "Não", "Talvez", "Sempre"], correta: 0 }; }
    }

    async gerarPerguntaProva(materia) {
        if (!this.apiKey) return { pergunta: "Qual a cor do céu?", respostaCerta: "Azul" };
        try {
            const prompt = `Gera uma pergunta muito difícil de N.O.M. do universo Harry Potter sobre: ${materia}. 
            RETORNA APENAS JSON: {"pergunta": "Qual é a base da poção Polissuco?", "respostaCerta": "Hemeróbios e Descurainia..."}`;
            const res = await this.groq.chat.completions.create({ messages: [{ role: "user", content: prompt }], model: "llama-3.1-8b-instant" });
            return this._extrairJSONBlindado(res.choices[0].message.content) || { pergunta: "O que é magia?", respostaCerta: "Magia" };
        } catch(e) { return { pergunta: "O Ministério cancelou os exames.", respostaCerta: "Nada" }; }
    }

    async avaliarProva(respostaAluno, respostaCerta) {
        if (!this.apiKey) return { nota: 80, feedback: "Aceitável." };
        try {
            const prompt = `Exame N.O.M.. Resposta correta: "${respostaCerta}". O aluno respondeu: "${respostaAluno}".
            Sê um examinador muito exigente. Avalia de 0 a 100.
            RETORNA APENAS JSON: {"nota": 80, "feedback": "Argumentaste bem, mas esqueceste-te dos detalhes."}`;
            const res = await this.groq.chat.completions.create({ messages: [{ role: "user", content: prompt }], model: "llama-3.1-8b-instant" });
            return this._extrairJSONBlindado(res.choices[0].message.content) || { nota: 50, feedback: "O pergaminho manchou." };
        } catch(e) { return { nota: 50, feedback: "Avaliador ocupado." }; }
    }

    // A CONSCIÊNCIA DE EXPLORAÇÃO ONISCIENTE (O Dungeon Master)
    async interagirAmbienteRPG(alunoNome, zona, acao) {
        if (!this.apiKey) return { relato: "O objeto não reage à tua magia." };
        try {
            const prompt = `És o Castelo de Hogwarts vivo e onisciente. Tu controlas todos os segredos. O aluno ${alunoNome} está em "${zona}" e tenta: "${acao}".
            Reage à ação dele baseado na lore canónica. Pode abrir passagens, fazer quadros falarem ou encontrar objetos.
            Decide se ele merece uma recompensa.
            RETORNA APENAS JSON ESTRITO: 
            {"relato": "Uma parede de pedra afasta-se, revelando...", "xpGanho": 25, "item": "Moeda de Ouro Antiga", "ouro": 10}`;
            
            const res = await this.groq.chat.completions.create({ 
                messages: [{ role: "user", content: prompt }], 
                model: "llama-3.1-8b-instant",
                response_format: { type: "json_object" } // 🔥 FORÇA O FORMATO CORRETO
            });
            const parse = this._extrairJSONBlindado(res.choices[0].message.content);
            if(!parse) throw new Error(); return parse;
        } catch(e) { return { relato: "Um feitiço de proteção bloqueou a tua ação.", xpGanho: 0, ouro: 0 }; }
    }
	
	async gerarVidaAutonomaCastelo(zona, alunosAtivos) {
        if (!this.apiKey) return { personagem: "Fantasma", texto: "Uma brisa fria atravessa o corredor..." };
        try {
            const prompt = `Hogwarts é viva. Cria uma fala curta e independente de um personagem (ex: Pirraça, Murta, Nick, um Quadro) que está em "${zona}". Alunos perto: ${alunosAtivos}.
            RETORNA APENAS JSON ESTRITO: {"personagem": "Pirraça", "texto": "Bomba de bosta no corredor! Hihihi!"}`;
            
            const res = await this.groq.chat.completions.create({ 
                messages: [{ role: "user", content: prompt }], 
                model: "llama-3.1-8b-instant",
                response_format: { type: "json_object" } // 🔥 FORÇA O FORMATO CORRETO
            });
            return this._extrairJSONBlindado(res.choices[0].message.content) || { personagem: "Nenhum", texto: "" };
        } catch(e) { return { personagem: "Nenhum", texto: "" }; }
    }

    async gerarRespostaPersonagemIA(zona, jogadorNome, mensagemTexto, casa) {
        if (!this.apiKey) return null;
        
        // ECONOMIA EXTREMA: Bloqueia spam! Só deixa a IA responder nesta zona a cada 10 segundos.
        const agora = Date.now();
        if (this.Penseira.chatCooldowns[zona] && agora < this.Penseira.chatCooldowns[zona]) {
            return null; // Ignora e não gasta a API se os jogadores estiverem a spammar o chat
        }

        try {
            const prompt = `És a magia onipresente do castelo de Hogwarts, controlando os fantasmas, quadros e o ambiente. O aluno ${jogadorNome} (${casa}) disse em "${zona}": "${mensagemTexto}".
            Responde como um habitante local (Fantasma, Quadro, etc). 
            Se pedir inimigo preenche "spawnMob", se pedir item preenche "spawnItem".
            RETORNA APENAS JSON ESTRITO: 
            {"personagem": "Nick", "texto": "Olá!", "pontos": 0, "spawnMob": null, "spawnItem": null}`;
            
            const res = await this.groq.chat.completions.create({ 
                messages: [{ role: "user", content: prompt }], 
                model: "llama-3.1-8b-instant",
                response_format: { type: "json_object" }
            });
            
            // Sucesso! Aplica o Cooldown de 10 segundos nesta sala para não drenar a API
            this.Penseira.chatCooldowns[zona] = agora + 10000; 
            return this._extrairJSONBlindado(res.choices[0].message.content);
        } catch(e) { return null; }
    }

    async avaliarManuscrito(texto) { /* mantido base */ return { brilhante: true, buffAtr: 'feiticos', feedback: "Curioso." }; }
    async investigarSegredo(zona) { /* mantido base */ return { item: "Pena", gold: 10, lore: "Achaste algo." }; }
    async gerarMonstroProcedural(hpBase, local, isBoss, nivelProgresso) { 
        try {
            const prompt = `Gera um monstro do universo de Harry Potter no local "${local}". Boss: ${isBoss}. Nível de perigo: ${nivelProgresso}.
            Crie um design único e um 'Loot' (ingrediente) que faça sentido biológico com essa criatura para ser usado em poções.
            RETORNE APENAS JSON ESTRITO: 
            {
                "nome": "Acromântula Anciã", 
                "lore": "Ouve-se o bater de quelíceras gigantescas nas sombras...", 
                "visual": {"corPrincipal": "#2b1d14", "tipo": "aracnideo", "seed": ${Math.floor(Math.random() * 1000)}},
                "saque": "Veneno de Acromântula"
            }`;
            const res = await this.groq.chat.completions.create({ 
                messages: [{ role: "user", content: prompt }], 
                model: "llama-3.1-8b-instant",
                response_format: { type: "json_object" }
            });
            let j = this._extrairJSONBlindado(res.choices[0].message.content);
            if(j && j.nome) { j.hp = hpBase; return j; }
        } catch(e) {}
        return { nome: isBoss ? "Basilisco Corrompido" : "Criatura Sombria", hp: hpBase, lore: "Uma criatura monstruosa surge!", visual: { corPrincipal: "#8a0303", tipo: "monstro", seed: 1 }, saque: "Sangue Sombrio" }; 
    }
	
	// SISTEMA INFINITO DE POÇÕES (Descoberta Alquímica)
    async tentarDescobrirPocao(ingredientesUsados) {
        if (!this.apiKey) return { sucesso: false };
        try {
            const prompt = `No universo de Harry Potter, um aluno misturou os seguintes ingredientes num caldeirão: ${ingredientesUsados.join(", ")}.
            Atuando como as leis da alquimia mágica, avalie se essa mistura resulta em uma poção coerente (mesmo que nunca vista antes, mas plausível).
            Se a mistura for um desastre químico, retorne {"sucesso": false}.
            Se fizer sentido, crie os dados da poção.
            RETORNE APENAS JSON ESTRITO: 
            {
                "sucesso": true, 
                "nome": "Poção da Visão Noturna", 
                "cura": 450, 
                "visual": {"corPrincipal": "#00ffcc", "tipo": "pocao"}
            }`;
            const res = await this.groq.chat.completions.create({ 
                messages: [{ role: "user", content: prompt }], 
                model: "llama-3.1-8b-instant",
                response_format: { type: "json_object" }
            });
            // Adicionado "|| { sucesso: false }" para salvaguarda!
            return this._extrairJSONBlindado(res.choices[0].message.content) || { sucesso: false };
        } catch(e) { return { sucesso: false }; }
    }
    async criarFeiticoInedito(aluno, tese) { return null; }
    async gerarTitulo(aluno) {
        try {
            const prompt = `Gera SÓ UM Título épico (ex: 'Mestre das Sombras') para bruxo nível ${aluno.nivel} da casa ${aluno.casa}. NADA DE ASPAS OU JSON.`;
            const res = await this.groq.chat.completions.create({ messages: [{ role: "user", content: prompt }], model: "llama-3.1-8b-instant" });
            return res.choices[0].message.content.replace(/["']/g, '').trim();
        } catch(e) { return "Membro da Ordem"; }
    }

    }
            
class HogwartsCore {
    constructor() {
        global.coreInstance = this; // 🔥 PREVINE O CRASH DO QUADRIBOL
        this.alunos = {}; 
        this.gremios = {};
        this.parties = {};
        this.grupos = {};
		this.florestaEngine = new MotorFlorestaProcedural(this);
        this.pontuacaoCasas = { Gryffindor: 0, Slytherin: 0, Ravenclaw: 0, Hufflepuff: 0, lider: 'Empate' };
        
       this.lojasBeco = {
            floreios: [ 
                { id: "l_1", nome: "Livro Padrão de Feitiços", tipo: "livro", preco: 20 }, 
                { id: "l_2", nome: "Poções Avançadas", tipo: "livro", preco: 50 }, 
                { id: "l_3", nome: "Guia de Transfiguração", tipo: "livro", preco: 40 },
                { id: "l_4", nome: "Mil Ervas Mágicas", tipo: "livro", preco: 30 },
                { id: "l_5", nome: "As Forças das Trevas", tipo: "livro", preco: 50 },
                { id: "l_6", nome: "O Livro Monstruoso dos Monstros", tipo: "livro", preco: 60 },
                { id: "l_7", nome: "Esclarecendo o Futuro", tipo: "livro", preco: 35 },
                { id: "l_8", nome: "Numerologia e Gramática", tipo: "livro", preco: 45 },
                { id: "l_9", nome: "Dicionário de Runas", tipo: "livro", preco: 40 },
                { id: "l_10", nome: "O Céu Noturno", tipo: "livro", preco: 40 },
                { id: "l_11", nome: "Vida Doméstica dos Muggles", tipo: "livro", preco: 25 },
                { id: "l_12", nome: "Alquimia, O Guia Prático", tipo: "livro", preco: 80 },
                { id: "l_13", nome: "História da Magia", tipo: "livro", preco: 30 }
            ],
            madamalkin: [ { id: "r_1", nome: "Veste Escolar Simples", tipo: "veste", preco: 50 } ],
            boticario: [ 
                { id: "i_1", nome: "Raiz de Asfódelo", tipo: "ingrediente", preco: 30, key: "asfodelo" }, 
                { id: "i_2", nome: "Bezoar", tipo: "ingrediente", preco: 100, key: "bezoar" },
                { id: "i_3", nome: "Mandrágora", tipo: "ingrediente", preco: 80, key: "mandragora" },
                { id: "i_4", nome: "Ditamno", tipo: "ingrediente", preco: 50, key: "ditamno" },
                { id: "i_5", nome: "Muco de Verme", tipo: "ingrediente", preco: 20, key: "muco" },
                { id: "s_1", nome: "Semente de Ditamno", tipo: "semente", preco: 2, key: "ditamno" },
                { id: "s_2", nome: "Muda de Mandrágora", tipo: "semente", preco: 3, key: "mandragora" },
                { id: "s_3", nome: "Semente de Asfódelo", tipo: "semente", preco: 3, key: "asfodelo" },
                { id: "s_4", nome: "Casulo de Verme", tipo: "semente", preco: 1, key: "muco" },
                { id: "s_5", nome: "Mineral Calcário (Bezoar)", tipo: "semente", preco: 4, key: "bezoar" }
            ],
            gemialidades: [ { id: "w_1", nome: "Bomba de Bosta", tipo: "brinquedo", preco: 100 } ],
            dedosdemel: [ { id: "d_1", nome: "Sapo de Chocolate", tipo: "comida", preco: 20 } ]
        };

        this.worldBoss = { ativo: false, nome: "Basilisco Desperto", hpMax: 100000, hpAtual: 100000 };
        this.dungeonInstancias = {}; this.pvpFila = []; this.pvpPartidas = {};
        this.quadribol = new MotorQuadribol(); 
        
        // 🔥 CORREÇÃO DO ERRO: Estas duas linhas nunca podem ser apagadas!
        this.logs = { salaoPrincipal: [], profetaDiario: [] }; 
        this.cerebroIA = new MotorConscienciaHogwarts();

        // 🔥 O NOVO MOTOR MMO (Zonas Vivas do Open World)
        this.zonasVivas = {}; 
        this.listaZonas = ["Salão Principal", "Grande Escadaria", "Masmorras", "Torre de Astronomia", "Biblioteca", "Floresta Proibida", "Banheiro da Murta", "Hogsmeade"];
        this.listaZonas.forEach(z => this.zonasVivas[z] = { entidades: [], itens: [] });

        // NOVO GRIMÓRIO (Sistema de Classes: DPS, Healer, Tank, Control)
        this.livroDeFeiticos = {
            'expelliarmus': { nome: "Expelliarmus", tipoMecanica: 'status', elemento: 'cinetico', custoFocoBase: 2, poderBase: 40, efeitoSecundario: 'desarmar', duracao: 2, lore: "Desarma o oponente (Impede o inimigo de atacar por 2 turnos).", visualConfig: { shape: 'bolt', color: '#ff4040', glow: '#ff0000', quantity: 1, trailSize: 15 } },
            'incendio': { nome: "Incendio", tipoMecanica: 'ataque', elemento: 'fogo', custoFocoBase: 4, poderBase: 80, efeitoSecundario: 'queimar', duracao: 4, lore: "Dano + Queimadura. Sinergia: Detona 'Veneno' para 300% de dano extra.", visualConfig: { shape: 'wave', color: '#ff4500', glow: '#ff8800', quantity: 3, trailSize: 8 } },
            'protego': { nome: "Protego", tipoMecanica: 'escudo', elemento: 'escudo', custoFocoBase: 3, poderBase: 300, defende: true, buffJogador: 'espinhos', duracaoBuff: 3, lore: "Escudo denso. Reflete 20% do dano recebido (Espinhos por 3 turnos).", visualConfig: { shape: 'sphere', color: '#3498db' } },
            'stupefy': { nome: "Estupefaça", tipoMecanica: 'ataque', elemento: 'cinetico', custoFocoBase: 3, poderBase: 120, efeitoSecundario: 'atordoar', duracao: 1, lore: "Dano massivo. Sinergia: Shatter (Quebra o alvo se Congelado multiplicando dano).", visualConfig: { shape: 'sphere', color: '#e74c3c', glow: '#ff0000', quantity: 1, trailSize: 20 } },
            'sectumsempra': { nome: "Sectumsempra", tipoMecanica: 'ataque', elemento: 'trevas', custoFocoBase: 6, poderBase: 150, efeitoSecundario: 'sangrar', duracao: 4, lifesteal: 0.5, lore: "Cortes profundos. (Sangramento 4 turnos + 50% Roubo de Vida).", visualConfig: { shape: 'slash', color: '#ffffff', glow: '#888888', quantity: 2, trailSize: 5 } },
            'aguamenti': { nome: "Aguamenti", tipoMecanica: 'status', elemento: 'agua', custoFocoBase: 3, poderBase: 50, efeitoSecundario: 'molhado', duracao: 3, lore: "Jato de água. Sinergia: Feitiços elétricos em alvos molhados causam Paralisia e Dano x2.", visualConfig: { shape: 'wave', color: '#0f3c55', glow: '#3498db', quantity: 5, trailSize: 15 } },
            'crucio': { nome: "Crucio", tipoMecanica: 'maldicao', elemento: 'trevas', custoFocoBase: 8, poderBase: 80, efeitoSecundario: 'vulneravel', duracao: 3, lore: "Maldição. O alvo recebe +100% de dano de TODAS as fontes (Quebra Defesa).", visualConfig: { shape: 'bolt', color: '#8e44ad', glow: '#4b0082', quantity: 3, trailSize: 25 } },
            'expecto_patronum': { nome: "Expecto Patronum", tipoMecanica: 'cura', elemento: 'luz', custoFocoBase: 10, poderBase: 400, purificar: true, buffJogador: 'regeneracao', duracaoBuff: 5, lore: "Cura 400 HP, purifica e concede Regeneração de Vida contínua (HoT).", visualConfig: { shape: 'sphere', color: '#ffffff', glow: '#a8d5ff', quantity: 1, trailSize: 30 } },
            'glacius': { nome: "Glacius", tipoMecanica: 'status', elemento: 'gelo', custoFocoBase: 4, poderBase: 40, efeitoSecundario: 'congelado', duracao: 2, lore: "Congela o alvo (Impede ataque). O próximo ataque cinético causa Dano Crítico Absoluto.", visualConfig: { shape: 'beam', color: '#a2d2df', glow: '#ffffff', quantity: 1, speed: 30, trailSize: 25 } },
            'diffindo': { nome: "Diffindo", tipoMecanica: 'ataque', elemento: 'cinetico', custoFocoBase: 2, poderBase: 80, efeitoSecundario: 'anti_cura', duracao: 3, lore: "Corta a magia do inimigo, impedindo-o de se curar ou defender.", visualConfig: { shape: 'slash', color: '#ffcc00', glow: '#ff9900', quantity: 1, speed: 35, trailSize: 10 } }
        };

        this.receitasPocoes = {
            'wiggenweld': { nome: 'Poção Wiggenweld', ingredientes: ['ditamno', 'muco'], cura: 500, visual: { corPrincipal: "#0f5", tipo: "pocao" } },
            'antidoto': { nome: 'Antídoto Universal', ingredientes: ['bezoar', 'ditamno'], cura: 200, visual: { corPrincipal: "#fff", tipo: "pocao" } },
           'restauradora': { nome: 'Poção Restauradora', ingredientes: ['mandragora', 'asfodelo'], cura: 1000, visual: { corPrincipal: "#8b4513", tipo: "pocao" } },
            // 🔥 NOVA POÇÃO DO ECOSSISTEMA
            'foco_lucido': { nome: 'Elixir do Foco Lúcido', ingredientes: ['mandragora', 'veneno_aranha'], cura: 100, foca: 15, visual: { corPrincipal: "#40a0ff", tipo: "pocao" } }
			};
		

        this._salvarBancoDeDados = () => {}; 
    }
  
    // 🔥 O SEGREDO DO MUNDO ABERTO (Adicione este método na mesma classe HogwartsCore)
    processarCicloMundoVivo() {
        const zonaSorteada = this.listaZonas[Math.floor(Math.random() * this.listaZonas.length)];
        const sala = this.zonasVivas[zonaSorteada];

        // 25% de chance de spawnar algo na zona a cada "tick"
        if (Math.random() < 0.25) {
            // Posicionamento aleatório inteligente dentro dos limites do mapa 2D
            let rx = 400 + Math.random() * 1200; 
            let ry = 400 + Math.random() * 1200;
            
            if (Math.random() < 0.40 && sala.entidades.length < 3) {
                const mob = this._gerarMonstroRapido(400, zonaSorteada, false);
                const idEv = `mob_${Date.now()}`;
                sala.entidades.push({ id: idEv, ...mob, tipo: 'combate', x: rx, y: ry });
                if (global.io) global.io.to(`zona_${zonaSorteada}`).emit('mmo_world_update', sala);
            } else if (sala.itens.length < 5) {
                const itens = ["Saco de Galeões", "Baú Escondido", "Erva Mágica Rara", "Relíquia Brilhante"];
                const item = { id: `itm_${Date.now()}`, nome: itens[Math.floor(Math.random()*itens.length)], tipo: 'coleta', x: rx, y: ry };
                sala.itens.push(item);
                if (global.io) global.io.to(`zona_${zonaSorteada}`).emit('mmo_world_update', sala);
            }
        }
    }
	// ==========================================
    // 1. MOTOR DE XP (AGORA NO ESCOPO CERTO)
    // ==========================================
    async _addXp(aluno, val) {
        if (!aluno) return;
        let valorReal = parseInt(val) || 0;
        
        // Sistema de Resgate de Conta Corrompida
        if (isNaN(aluno.xp) || aluno.xp == null) aluno.xp = 0;
        if (isNaN(aluno.nivel) || aluno.nivel == null || aluno.nivel === 0) aluno.nivel = 1;
        if (isNaN(aluno.xpProx) || aluno.xpProx == null) aluno.xpProx = 100;

        aluno.xp += valorReal;
        let subiu = false;
        
        while (aluno.xp >= aluno.xpProx) {
            aluno.nivel++;
            aluno.xp -= aluno.xpProx;
            aluno.xpProx = Math.floor(aluno.xpProx * 1.6);
            subiu = true;
        }

        if (subiu) {
            aluno.anoLetivo = Math.min(7, Math.floor(aluno.nivel / 10) + 1);
            
            // 🔥 NOVO: Dá 3 pontos de atributos ao jogador por nível!
            if(!aluno.atributosRPG) aluno.atributosRPG = { intelecto: 5, destreza: 5, vigor: 5, percepcao: 5, pontosLivres: 0 };
            aluno.atributosRPG.pontosLivres += 3;

            this._obterAtributosTotais(aluno); 
            aluno.hpAtual = aluno.hpMax;
            aluno.focoAtual = aluno.maxFoco;
            try {
                const novoTitulo = await this.cerebroIA.gerarTitulo(aluno);
                if (novoTitulo) aluno.titulo = novoTitulo;
            } catch(e) {}
        }
        this._salvarBancoDeDados();
    }
	
	async gerarTituloBruxo(aluno) {
        const prompt = `Atue como o Ministro da Magia. O bruxo "${aluno.nome}" solicitou um título de honraria.
        Estatísticas Atuais de ${aluno.nome}:
        Nível: ${aluno.nivel}
        Monstros Derrotados: ${aluno.estatisticas?.monstrosMortos || 0}
        Duelos Vencidos: ${aluno.estatisticas?.duelosVencidos || 0}
        ELO PvP: ${aluno.elos?.duelos || 1000}
        
        Gere UM título oficial do Ministério que reflita ESTRITAMENTE estas estatísticas.
        - Se for nível baixo (<5), dê títulos fracos: "Aprendiz Esforçado", "Tropeça-em-Varinhas".
        - Se tiver ELO alto (>1500), foque em duelos: "O Espadachim Arcano".
        - Se tiver muitas mortes de monstros, foque na floresta: "Caçador de Feras".
        RETORNE APENAS JSON: {"titulo": "O Título"} `;
        
        try {
            const res = await this.groq.chat.completions.create({
                messages: [{ role: "user", content: prompt }],
                model: "llama-3.1-8b-instant",
                response_format: { type: "json_object" }
            });
            return this._extrairJSONBlindado(res.choices[0].message.content);
        } catch(e) { return {titulo: "Bruxo Desconhecido"}; }
    }

  
	async coletarRecursoLifeSkill(alunoId, zona) {
        const a = this.alunos[alunoId]; 
        if (!a) return { erro: "O aluno não existe na matriz." };
        if (a.focoAtual < 2) return { erro: "A coleta exige 2 de Foco." };
        
        a.focoAtual -= 2;
        
        // Proteção contra undefined (Assegura que a mochila tem estrutura base)
        if (!a.inventario) a.inventario = { livros: [], ingredientes: {}, materiais: [] };
        if (!a.inventario.ingredientes) a.inventario.ingredientes = {};
        if (!a.lifeSkills) a.lifeSkills = { herbologia: 1, magizoologia: 1, encantamentos: 1 };

        try {
            if (!this.cerebroIA || !this.cerebroIA.apiKey) throw new Error("IA Desligada");

            const prompt = `Universo Harry Potter. Zona: "${zona}". O jogador procura recursos. Gera APENAS UM ingrediente botânico ou criatura raro. RETORNE JSON ESTRITO: {"item": "Pelo de Unicórnio", "lore": "Brilhava na terra húmida..."}`;
            const res = await this.cerebroIA.groq.chat.completions.create({ messages: [{ role: "user", content: prompt }], model: "llama-3.1-8b-instant", response_format: {type: "json_object"} });
            
            if(!res || !res.choices || !res.choices[0]) throw new Error("Resposta da IA vazia");
            const loot = this.cerebroIA._extrairJSONBlindado(res.choices[0].message.content);
            
            if(loot && loot.item) {
                let nomeFormatado = loot.item.trim();
                let key = nomeFormatado.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9_]/g, '_');
                
                a.inventario.ingredientes[key] = (a.inventario.ingredientes[key] || 0) + 1;
                
                try { this._progressoQuest(a, 'coleta', key, 1); } catch(ex){}
                
                await this._addXp(a, 30);
                a.lifeSkills.herbologia += 0.1;
                this._salvarBancoDeDados();
                
                let msgHtml = `<div style="font-size:0.85em; color:#ccc; font-style:italic; line-height:1.4;">"${loot.lore}"</div>
                               <div style="margin-top:10px; padding-top:10px; border-top:1px dashed #2ecc71; color:#2ecc71; font-size:1.1em; font-weight:bold;">🌿 Obtido: ${nomeFormatado}</div>`;
                return { sucesso: true, msg: msgHtml };
            }
            throw new Error("A IA gerou um formato inválido");
        } catch(e) { 
            console.error("Coleta gerou fallback:", e.message);
            a.inventario.ingredientes['ervas_daninhas'] = (a.inventario.ingredientes['ervas_daninhas'] || 0) + 1;
            try { await this._addXp(a, 10); } catch(ex) {}
            this._salvarBancoDeDados();
            return { sucesso: true, msg: "A neblina mágica estava densa... Encontraste apenas: [Ervas Daninhas]." }; 
        }
    }
	
	regarEstufa(alunoId, poteId) {
        const a = this.alunos[alunoId]; if(!a) return {erro:"Erro."};
        let pote = a.estufa.find(p => p.id === poteId);
        if(!pote || !pote.plantada || pote.morta) return {erro:"Não há planta viva aqui."};
        pote.agua = 100; this._salvarBancoDeDados();
        return {sucesso: true, msg: "💦 Regaste a planta. A terra está húmida."};
    }

    curarPragaEstufa(alunoId, poteId) {
        const a = this.alunos[alunoId]; if(!a) return {erro:"Erro."};
        let pote = a.estufa.find(p => p.id === poteId);
        if(!pote || !pote.praga) return {erro:"A planta não tem pragas."};
        if(a.galeoes < 2) return {erro: "Precisas de 2 Galeões para o pesticida mágico."};
        
        a.galeoes -= 2; pote.praga = false; this._salvarBancoDeDados();
        return {sucesso: true, msg: "🧪 Praga eliminada! A planta respira de novo."};
    }
	
	// Rastreador Global de Quests
    _progressoQuest(aluno, tipo, alvo, valor = 1) {
        if (!aluno.questAtiva || aluno.questAtiva.concluida) return;
        let q = aluno.questAtiva;
        
        if (q.tipo === tipo) {
            // Verifica se o alvo bate certo (Ex: "aranha" está contido no nome "Aranha Gigante")
            if (alvo.toLowerCase().includes(q.alvo.toLowerCase()) || q.alvo.toLowerCase().includes(alvo.toLowerCase())) {
                q.progresso += valor;
                if (q.progresso >= q.meta) {
                    q.progresso = q.meta;
                    q.concluida = true;
                    global.io.to(`priv_${aluno.id}`).emit('nova_mensagem', { canal: 'zona', autor: 'SISTEMA', texto: `🏆 Objetivo Concluído: ${q.titulo}! Vai à aba Aventura reclamar o prémio.` });
                }
            }
        }
    }

    async pedirQuestIA(alunoId) {
        const a = this.alunos[alunoId]; if(!a) return {erro:"Erro."};
        if(a.questAtiva) return {erro:"Já tens uma missão."};
        
        const q = await this.cerebroIA.gerarQuestProcedural(a);
        if(!q) return {erro:"O Oráculo está confuso."};
        
        a.questAtiva = q; this._salvarBancoDeDados();
        return {sucesso:true};
    }

    async concluirQuest(alunoId) {
        const a = this.alunos[alunoId]; if(!a || !a.questAtiva) return {erro:"Erro."};
        if(!a.questAtiva.concluida) return {erro:"Missão não terminada."};
        
        let q = a.questAtiva;
        a.galeoes += q.recompensaGaleoes;
        await this._addXp(a, q.recompensaXp);
        a.questAtiva = null; // Limpa para a próxima
        
        this._salvarBancoDeDados();
        return {sucesso:true, msg:`Recebeste ${q.recompensaGaleoes}G e ${q.recompensaXp} EXP!`};
    }

    _obterAtributosTotais(aluno) {
        if (!aluno.estufa) aluno.estufa = [ { id: 1, plantada: false }, { id: 2, plantada: false }, { id: 3, plantada: false } ];
        if (!aluno.elos) aluno.elos = { duelos: 1000, quadribol: 1000, baile: 1000, quiz: 1000, pocoes: 1000, sabedoria: 1000 };

        let base = { feiticos: 10, defesa: 10, pocoes: 10, transfiguracao: 10, furtividade: 10, artes_trevas: 5 };
        let passivas = { crit_chance: 0.05, lifesteal: 0, esquiva: 0.05, mana_regen: 0 }; // Status Base Ocultos

        let rpg = aluno.atributosRPG || { intelecto: 5, destreza: 5, vigor: 5, percepcao: 5 };
        
        base.feiticos += (rpg.intelecto * 2); base.pocoes += (rpg.intelecto * 1);
        base.defesa += (rpg.vigor * 2); base.furtividade += (rpg.destreza * 2);
        passivas.esquiva += (rpg.destreza * 0.005); // Destreza dá esquiva natural
        passivas.crit_chance += (rpg.percepcao * 0.01); // Percepção dá chance de crítico

        const somarEquip = (equip) => {
            if(!equip || !equip.atributos) return;
            if(equip.atributos.intelecto) base.feiticos += (equip.atributos.intelecto * 3);
            if(equip.atributos.vigor) base.defesa += (equip.atributos.vigor * 3);
            if(equip.atributos.destreza) base.furtividade += (equip.atributos.destreza * 3);
            
            // Soma as passivas geradas proceduralmente nos itens
            if(equip.passivas) {
                if(equip.passivas.crit_chance) passivas.crit_chance += equip.passivas.crit_chance;
                if(equip.passivas.lifesteal) passivas.lifesteal += equip.passivas.lifesteal;
                if(equip.passivas.esquiva) passivas.esquiva += equip.passivas.esquiva;
                if(equip.passivas.mana_regen) passivas.mana_regen += equip.passivas.mana_regen;
            }
        };

        if(aluno.equipamentos) {
            somarEquip(aluno.equipamentos.cabeca);
            somarEquip(aluno.equipamentos.corpo);
            somarEquip(aluno.equipamentos.pescoco);
            
            let v = aluno.equipamentos.varinha;
            if (v && base[v.afinidade] !== undefined) {
                base[v.afinidade] += Math.floor((v.poderBase || 10) * (1 + ((v.lealdade || 0) / 100)));
            }
        }

        aluno.hpMax = Math.floor(1000 + (base.defesa * 50) + (rpg.vigor * 100));
        aluno.maxFoco = Math.floor(10 + (rpg.intelecto * 1));
        if (aluno.focoAtual > aluno.maxFoco) aluno.focoAtual = aluno.maxFoco;
        
        aluno.atributosTotais = base; 
        aluno.passivasCombate = passivas; // Guarda as passivas na RAM para o motor de combate
        aluno.centelhaArcana = Lexicon.CalcularCentelhaArcana(aluno); 
        return base;
    }
    // =========================================================
    // SUBSTITUIR A FUNÇÃO registrarNovaConta INTEIRA
    // =========================================================
    // =========================================================
    // SUBSTITUIR A FUNÇÃO registrarNovaConta INTEIRA
    // =========================================================
    registrarNovaConta(tgId, tgUsername, nomeBruxo, senha) {
    // 🔥 Garante que o ID seja sempre o mesmo independente de espaços ou maiúsculas
    const nomeLimpo = String(nomeBruxo).toLowerCase().trim();
    const idBruxo = 'BRX_' + crypto.createHash('sha256').update(`JOGADOR::${nomeLimpo}`).digest('hex').substring(0, 10).toUpperCase();
        const senhaHash = crypto.pbkdf2Sync(senha, idBruxo, 1000, 64, 'sha512').toString('hex');
        
        // 1. SISTEMA DE LOGIN (Se a conta já existe)
        if (this.alunos[idBruxo]) {
            if (this.alunos[idBruxo].senhaHash === senhaHash) {
                this._obterAtributosTotais(this.alunos[idBruxo]); // Previne crash na UI
                return { sucesso: true, aluno: this.alunos[idBruxo] };
            } else {
                return { erro: "A assinatura mágica (senha) não corresponde a este bruxo." };
            }
        }

        // 2. SISTEMA DE REGISTO (Se for conta nova)
        this.alunos[idBruxo] = {
            id: idBruxo, nome: nomeBruxo, tgId: "WEB", tgUsername: `@Jogador`, titulo: "O Aprendiz",
            senhaHash: senhaHash,
            estadoJogo: "BECO_DIAGONAL", casa: "Nenhuma", nivel: 1, xp: 0, xpProx: 100, 
            galeoes: 755, hpAtual: 1000, hpMax: 1000, focoAtual: 10, maxFoco: 10, energia: 100, fome: 100, cofreGringotes: 0,
            atributos: { feiticos: 5, defesa: 5, pocoes: 5, transfiguracao: 5, furtividade: 5, artes_trevas: 1 }, 
            // 🔥 NOVO: Atributos de RPG para Progressão Vertical
            atributosRPG: { intelecto: 5, destreza: 5, vigor: 5, percepcao: 5, pontosLivres: 0 },
            lifeSkills: { herbologia: 1, magizoologia: 1, encantamentos: 1 }, 
			// 🔥 NOVO: Sistema Tamagotchi (Mascote)
            pet: { adotado: false, tipo: null, nome: "Mascote", fome: 100, felicidade: 100, nivel: 1, xp: 0 },
       
            equipamentos: { varinha: null, veste: null, anel: null }, 
            inventario: { livros: [], ingredientes: { 'ditamno': 2, 'muco': 1 }, materiais: [] }, 
			manuscritos: [],
			estufa: [
    { id: 1, plantada: false, tipo: null, plantaTempo: null },
    { id: 2, plantada: false, tipo: null, plantaTempo: null },
    { id: 3, plantada: false, tipo: null, plantaTempo: null }
],
            maestriaFeiticos: { 'expelliarmus': {nivel:1, exp:0, expProx:100}, 'protego': {nivel:1, exp:0, expProx:100} }, 
            feitiçosEquipados: ['expelliarmus', 'protego'], 
            mochilaEscolar: [
                { id: crypto.randomBytes(4).toString('hex'), nome: "Sapo de Chocolate", tipo: 'comida' },
                { id: crypto.randomBytes(4).toString('hex'), nome: "Kit de Polimento", tipo: 'reliquia' }
            ], 
            questAtiva: null, gremioId: null,
            elos: { duelos: 1000, quadribol: 1000, baile: 1000, quiz: 1000, pocoes: 1000, sabedoria: 1000 },
            estatisticas: { duelosVencidos: 0, monstrosMortos: 0 }
        };
        
        this._obterAtributosTotais(this.alunos[idBruxo]);
        this._salvarBancoDeDados(); 
        return { sucesso: true, aluno: this.alunos[idBruxo] };
    }
	// SUBSTITUIR DENTRO DE HogwartsCore
    async acaoLivreAmbiente(alunoId, zona, acao) {
        const a = this.alunos[alunoId]; if (!a || a.focoAtual < 1) return { erro: "Foco Insuficiente (Requer 1)." };
        a.focoAtual -= 1;
        const respIA = await this.cerebroIA.interagirAmbienteRPG(a.nome, zona, acao);
        
        if(!respIA) return { erro: "O oráculo não respondeu." };
        this.ganharXp(a, respIA.xpGanho || 10);
        if(respIA.ouro) a.galeoes += respIA.ouro;
        if(respIA.item && respIA.item !== "Nenhum") a.mochilaEscolar.push({ id: crypto.randomBytes(4).toString('hex'), nome: respIA.item, tipo: 'reliquia' });
        
        this._salvarBancoDeDados();
        let recompensas = [];
        if(respIA.ouro) recompensas.push(`+${respIA.ouro}G`);
        if(respIA.item && respIA.item !== "Nenhum") recompensas.push(`Encontraste: [${respIA.item}]`);
        
        return { sucesso: true, relato: `${respIA.relato}\n\n<span style="color:#0f5">${recompensas.join(' | ')}</span>` };
    }

    // =========================================================
// MOTOR DA SALA DE AULA (Imersão IA) - Substitua estas duas:
// =========================================================
    async assistirAula(alunoId) {
        const a = this.alunos[alunoId]; if (!a || a.focoAtual < 2) return { erro: "Foco Insuficiente (Requer 2)." };
        const anoAtual = a.anoLetivo || 1;
        const relogio = RelogioHogwarts.obterHorarioAtual(anoAtual);
        if (relogio.aulaAtiva === "Livre") return { erro: "Não há aulas neste momento." };

        let material = await this.db_biblioteca.findOne({ materia: relogio.aulaAtiva, ano: anoAtual });
        if (!material) {
            global.io.to(`priv_${a.id}`).emit('nova_mensagem', { canal: 'zona', autor: 'SISTEMA', texto: 'O Ministério está a entregar os novos livros. Aguarde...' });
            return { erro: "O professor ainda não recebeu os manuais da biblioteca." };
        }

        a.focoAtual -= 2;
        this._salvarBancoDeDados();

        // Identifica exatamente qual capítulo deve ser lecionado hoje
        const capitulo = material.capitulos.find(c => c.cap === relogio.capituloAtual) || material.capitulos[0];

        // 🔥 BLINDAGEM ANTI-BLOQUEIO (413): Cortamos o texto para o Professor não ler o livro inteiro de uma vez
        // Ele lê os primeiros 1500 caracteres da Teoria e os primeiros 500 da Prática para preparar a aula.
        const excertoTeoria = capitulo.teoria.substring(0, 1500);
        const excertoPratica = capitulo.pratica.substring(0, 500);

        setTimeout(async () => {
            try {
                // O Prompt Absoluto de Roleplay Académico
                // O Prompt Absoluto de Roleplay Académico
                const prompt = `És o Professor ${relogio.professorAtivo} de Hogwarts. Estás a dar aula de ${relogio.aulaAtiva} ao ${anoAtual}º Ano.
                O livro oficial em cima da mesa dos alunos tem 4 Capítulos e chama-se: "${material.nomeLivro}".
                O Capítulo selecionado para lecionares hoje é o Capítulo ${relogio.capituloAtual} - "${capitulo.titulo}".
                Base da Matéria do Livro para te orientares: "${excertoTeoria}" e a prática é: "${excertoPratica}".

                A TUA TAREFA (Nesta ordem estrita):
                1. Cumprimenta a turma com a tua personalidade. Informa-os que hoje irão estudar o Capítulo ${relogio.capituloAtual}.
                2. Explica a matéria baseando-te no texto do livro. Sê imersivo, como um professor a discursar.
                3. Passa uma LIÇÃO DE CASA baseada na matéria.
                4. Termina a tua fala a fazer ESTRITAMENTE esta pergunta à turma para eles debaterem no chat: "${capitulo.pergunta}".

                NADA DE JSON. Apenas o teu discurso puro, direto e imersivo.`;
                const iaRes = await this.cerebroIA.groq.chat.completions.create({
                    messages: [
                        { role: "system", content: "És um professor exigente de Hogwarts. As tuas aulas são rigorosas, imersivas e segues sempre o manual escolar." },
                        { role: "user", content: prompt }
                    ],
                    model: "llama-3.1-8b-instant", // Rápido, inteligente e poupa os teus limites
                    max_tokens: 1000 // Garante que a resposta cabe no chat sem dar erro de TPM
                });
                
                global.io.to('sala_de_aula').emit('nova_mensagem', { 
                    canal: 'aula', 
                    autor: `🎓 [Prof. ${relogio.professorAtivo}]`, 
                    texto: iaRes.choices[0].message.content.trim() 
                });
            } catch(err) { 
                console.error("Erro Professor IA:", err.message);
                global.io.to('sala_de_aula').emit('nova_mensagem', { canal: 'aula', autor: `🎓 [Sistema]`, texto: `O Professor abriu o livro no Capítulo ${relogio.capituloAtual} e começou a ler a matéria em silêncio. Abram os vossos livros.` }); 
            }
        }, 1500);

        return { sucesso: true, msg: `Sentaste-te na carteira. Abre o teu livro no Capítulo ${relogio.capituloAtual} e presta atenção!` };
    }

    async respostaProfessorIA(professor, materia, alunoNome, mensagem, casa, anoLetivo) {
        if (!this.apiKey) return null;
        try {
            const relogio = RelogioHogwarts.obterHorarioAtual(anoLetivo);
            
            // O professor lembra-se de que capítulo está a dar para avaliar a resposta do aluno!
            const prompt = `És o Professor ${professor} de ${materia}. A tua turma do ${anoLetivo}º Ano está a estudar o Capítulo ${relogio.capituloAtual}. 
            O aluno ${alunoNome} (${casa}) levantou a mão e disse: "${mensagem}". 
            
            Avalia a resposta do aluno.
            - Se ele demonstrou que leu o livro e respondeu com lógica mágica, elogia-o, diz-lhe que a lição de casa está dispensada hoje e dá 10 XP (escreve "+10 XP" no texto).
            - Se ele disse uma asneira ou algo fora de contexto, repreende-o severamente, dobra-lhe a lição de casa e retira 5 pontos à casa (escreve "-5 Pontos" no texto).
            
            Responde ESTRITAMENTE com a tua personalidade de professor. Sê curto (máx 2 frases).
            RETORNA APENAS O JSON: {"texto": "Exato senhor ${alunoNome}! Leu bem o capítulo. Mais 10 XP...", "pontos": 10}`;
            
            const res = await this.groq.chat.completions.create({ 
                messages: [{ role: "user", content: prompt }], 
                model: "llama-3.1-8b-instant", 
                response_format: {type: "json_object"},
                max_tokens: 300
            });
            return this._extrairJSONBlindado(res.choices[0].message.content);
        } catch(e) { return null; }
    }

async folhearLivro(alunoId) {
    const a = this.alunos[alunoId]; 
    if (!a || a.focoAtual < 1) return { erro: "Foco Insuficiente (Requer 1)." };
    const relogio = RelogioHogwarts.obterHorarioAtual();
    if (relogio.aulaAtiva === "Livre") return { erro: "A sala está vazia. Não há livros na tua mesa." };
    
    a.focoAtual -= 1;
    const lido = await this.cerebroIA.folhearLivroAula(relogio.aulaAtiva, relogio.requerLivro || "Tomo Antigo");
    this.ganharXp(a, 25);
    this._salvarBancoDeDados();
    return { sucesso: true, texto: lido.texto };
}

    // Função de XP auxiliar isolada
    ganharXp(aluno, valor) {
        aluno.xp += valor;
        while (aluno.xp >= aluno.xpProx) { 
            aluno.nivel++; aluno.xp -= aluno.xpProx; aluno.xpProx = Math.floor(aluno.xpProx * 1.5); 
            aluno.hpAtual = aluno.hpMax; aluno.focoAtual = aluno.maxFoco; 
            this.cerebroIA.gerarTitulo(aluno).then(t => { aluno.titulo = t; this._salvarBancoDeDados(); });
        }
    }

    gerarRanking() {
        let lista = Object.values(this.alunos).filter(a => a.nivel > 0);
        
        // 🔥 CORREÇÃO: Blindagem! Se o jogador for antigo e não tiver ELO, a IA assume que ele tem 1000 em vez de crashar o servidor
        let getTop = (modo) => lista
            .sort((a,b) => (b.elos ? b.elos[modo] : 1000) - (a.elos ? a.elos[modo] : 1000))
            .slice(0, 5)
            .map(a => ({
                nome: a.nome, 
                val: a.elos ? a.elos[modo] : 1000, 
                casa: a.casa
            }));
            
        return {
            nivel: lista.sort((a,b) => b.nivel - a.nivel).slice(0, 5).map(a => ({nome: a.nome, val: a.nivel, casa: a.casa})),
            duelos: getTop('duelos'), 
            quadribol: getTop('quadribol'),
            sabedoria: getTop('sabedoria'), 
            pocoes: getTop('pocoes'),
            baile: getTop('baile'), 
            quiz: getTop('quiz')
        };
    }
	


    adicionarPontosCasa(casa, pontos) {
        if(this.pontuacaoCasas[casa] !== undefined && casa !== "Nenhuma") {
            this.pontuacaoCasas[casa] += pontos;
            let sort = [ {c:'Gryffindor',v:this.pontuacaoCasas.Gryffindor}, {c:'Slytherin',v:this.pontuacaoCasas.Slytherin}, {c:'Ravenclaw',v:this.pontuacaoCasas.Ravenclaw}, {c:'Hufflepuff',v:this.pontuacaoCasas.Hufflepuff} ].sort((a,b)=>b.v-a.v);
            this.pontuacaoCasas.lider = sort[0].v > sort[1].v ? sort[0].c : 'Empate';
            this._salvarBancoDeDados();
        }
    }

    acaoGringotes(alunoId, acao, valor) {
        const a = this.alunos[alunoId]; if (!a) return { erro: "Erro" };
        let v = parseInt(valor); if(isNaN(v) || v <= 0) return { erro: "Valor inválido." };
        if(acao === 'depositar') {
            if(a.galeoes < v) return { erro: "Não tens galeões suficientes." };
            a.galeoes -= v; a.cofreGringotes += v; this._salvarBancoDeDados(); return { sucesso: true, msg: `Depositaste ${v} G.` };
        } else {
            if(a.cofreGringotes < v) return { erro: "Não tens isso no cofre." };
            a.cofreGringotes -= v; a.galeoes += v; this._salvarBancoDeDados(); return { sucesso: true, msg: `Levantaste ${v} G.` };
        }
    }

    async gerarVarinhaOllivanders(alunoId, tracoPersonalidade) {
        const a = this.alunos[alunoId]; if (!a) return { erro: "Fantasma." };
        if (a.galeoes < 7) return { erro: "A varinha custa 7 Galeões." }; 
        if (a.equipamentos.varinha) return { erro: "Já tens varinha." };
        
        let varinhaUnica = await this.cerebroIA.forjarVarinhaUnica(a.nome, tracoPersonalidade);
        if (!varinhaUnica || !varinhaUnica.nome) { varinhaUnica = Ollivanders.forjarVarinhaDestinada(a.nome); }

        a.galeoes -= 7;
        a.equipamentos.varinha = { 
            id: 'var_ia', nome: varinhaUnica.nome, 
            madeira_nucleo: `${varinhaUnica.comprimento || '11 pol'} | ${varinhaUnica.nucleo || 'Misterioso'}`, 
            afinidade: varinhaUnica.afinidade || 'feiticos', poderBase: varinhaUnica.poderBase || 15, 
            lore: varinhaUnica.lore || "A varinha escolheu.", lealdade: 0,
            visual: varinhaUnica.visual || { corMadeira: "#5c4033", corAura: "#fff", corCabo: "#111", estilo: "reta" }
        };
        
        this._verificarAvancoBeco(a); 
        this._salvarBancoDeDados(); // 🔥 PEÇA CRÍTICA: Grava no MongoDB AGORA!
        
        return { sucesso: true, varinha: a.equipamentos.varinha };
    }

    comprarNoBecoDiagonal(alunoId, loja, itemId) {
        const a = this.alunos[alunoId]; if (!a) return { erro: "Fantasma." };
        let lista = this.lojasBeco[loja] || (loja === 'boticario' ? this.boticario : null); if(!lista) return { erro: "Loja fechada."};
        const item = lista.find(i => i.id === itemId); if (!item) return { erro: "Item não existe." };
        if (a.galeoes < item.preco) return { erro: `Custa ${item.preco} Galeões.` };
        a.galeoes -= item.preco;
        
        // Tratamento Correto para a Mochila / Inventário
        if (item.tipo === 'veste') a.equipamentos.veste = { id: item.id, nome: item.nome };
        else if (item.tipo === 'livro') { if(!a.inventario.livros.includes(item.nome)) a.inventario.livros.push(item.nome); }
        else if (item.tipo === 'ingrediente') { 
            let k = item.key || item.nome.toLowerCase().replace(/ /g, '_');
            a.inventario.ingredientes[k] = (a.inventario.ingredientes[k] || 0) + 1; 
        }
        // NOVA LÓGICA: Adicionar sementes ao inventário (BLINDADO)
        else if (item.tipo === 'semente') {
            if (!a.inventario) a.inventario = {};
            if (!a.inventario.sementes) a.inventario.sementes = { ditamno: 0, mandragora: 0, asfodelo: 0, muco: 0, bezoar: 0 };
            
            let k = item.key || item.nome.toLowerCase().replace(/ /g, '_');
            a.inventario.sementes[k] = (a.inventario.sementes[k] || 0) + 1;
        }
        // 🔥 CORREÇÃO: O bloco vazio que roubava os sapos de chocolate foi removido!
        else if (item.tipo === 'comida' || item.tipo === 'brinquedo') { 
            a.mochilaEscolar.push({ id: crypto.randomBytes(4).toString('hex'), nome: item.nome, tipo: item.tipo }); 
        }
        
        this._verificarAvancoBeco(a); 
        this._salvarBancoDeDados();
        return { sucesso: true, msg: `Compraste [${item.nome}].` };
    }


            _verificarAvancoBeco(aluno) {
        // Exige os 14 livros
        let temLivros = (aluno.inventario && aluno.inventario.livros) ? aluno.inventario.livros.length >= 14 : false; 
        
        // O mesmo truque infalível da Veste
        let strInventario = JSON.stringify(aluno);
        let temVeste = strInventario.includes('Veste Escolar Simples');
        
        let i = (aluno.inventario && aluno.inventario.ingredientes) ? aluno.inventario.ingredientes : {};
        
        let temIngredientes = (
            (i['asfodelo'] >= 1) && 
            (i['bezoar'] >= 1) && 
            (i['mandragora'] >= 1) && 
            (i['ditamno'] >= 1) && 
            (i['muco'] >= 1)
        );
        
        return (aluno.equipamentos && aluno.equipamentos.varinha && temVeste && temLivros && temIngredientes);
    }
        
	
	embarcarExpresso(alunoId) {
        const a = this.alunos[alunoId];
        if (!a || a.estadoJogo !== 'BECO_DIAGONAL') return {erro: "Não estás no Beco."};
        if (!this._verificarAvancoBeco(a)) return {erro: "Faltam itens da lista escolar!"};
        a.estadoJogo = 'EXPRESSO_HOGWARTS';
        this._salvarBancoDeDados(); return {sucesso: true, msg: "Todos a bordo do Expresso de Hogwarts!"};
    }

    desembarcarExpresso(alunoId) {
        const a = this.alunos[alunoId];
        if (!a || a.estadoJogo !== 'EXPRESSO_HOGWARTS') return {erro: "Não estás no Expresso."};
        a.estadoJogo = 'SELECAO_CHAPEU';
        this._salvarBancoDeDados(); return {sucesso: true, msg: "Bem-vindo a Hogwarts!"};
    }

    venderItemMercado(alunoId, itemMochilaId, preco) {
        const a = this.alunos[alunoId]; if (!a) return {erro:"Fantasma."};
        if (preco <= 0 || isNaN(preco)) return {erro:"Preço de Galeões inválido."};
        const idx = a.mochilaEscolar.findIndex(i => i.id === itemMochilaId);
        if(idx === -1) return {erro:"Não tens esse item na mochila."};
        
        // 🔥 NOVO: Taxa do Ministério para travar inflação (5%)
        let taxa = Math.ceil(preco * 0.05);
        if(a.galeoes < taxa) return {erro:`O Ministério exige uma taxa de ${taxa} G para anunciar a oferta.`};
        a.galeoes -= taxa;

        const item = a.mochilaEscolar[idx];
        a.mochilaEscolar.splice(idx, 1); 
        
        const ofertaId = crypto.randomBytes(4).toString('hex');
        if(!this.mercadoJogadores) this.mercadoJogadores = [];
        this.mercadoJogadores.push({ id: ofertaId, vendedorId: a.id, vendedorNome: a.nome, item: item, preco: Number(preco), data: Date.now() });
        this._salvarBancoDeDados();
        return {sucesso: true, msg: `Pagaste ${taxa}G de taxa. A tua coruja partiu com a oferta!`};
    }

    comprarItemMercado(alunoId, ofertaId) {
        const a = this.alunos[alunoId]; if (!a) return {erro:"Fantasma."};
        if(!this.mercadoJogadores) this.mercadoJogadores = [];
        const idx = this.mercadoJogadores.findIndex(o => o.id === ofertaId);
        if(idx === -1) return {erro:"A oferta já foi comprada por outro bruxo."};
        
        const oferta = this.mercadoJogadores[idx];
        if(a.id === oferta.vendedorId) return {erro:"Não podes comprar a tua própria oferta."};
        if(a.galeoes < oferta.preco) return {erro:"Galeões insuficientes."};
        
        // Efetua a transação
        a.galeoes -= oferta.preco;
        a.mochilaEscolar.push({ id: crypto.randomBytes(4).toString('hex'), nome: oferta.item.nome, tipo: oferta.item.tipo });
        
        // Paga ao vendedor diretamente no Banco Gringotes
        if(this.alunos[oferta.vendedorId]) {
            this.alunos[oferta.vendedorId].cofreGringotes += oferta.preco; 
            global.io.to(`priv_${oferta.vendedorId}`).emit('nova_mensagem', { canal: 'zona', autor: '🦉 [Correio Coruja]', texto: `Venda bem sucedida! Alguém comprou o teu [${oferta.item.nome}]. Foram depositados ${oferta.preco} G no teu Cofre.` });
        }
        
        this.mercadoJogadores.splice(idx, 1);
        this._salvarBancoDeDados();
        return {sucesso: true, msg: `Compraste [${oferta.item.nome}] por ${oferta.preco} G!`};
    }

    async processarSelecao(alunoId, resposta) {
        const a = this.alunos[alunoId]; if (!a) return { erro: "Erro de estudante." };
        const iaResp = await this.cerebroIA.entrevistarAluno(a.nome, resposta);
        a.casa = iaResp.casa; a.estadoJogo = "CASTELO";
        this._obterAtributosTotais(a); this._salvarBancoDeDados();
        return { sucesso: true, casa: a.casa, relato: iaResp.relato };
    }

    acaoRoleplay(alunoId, tipo) {
        const a = this.alunos[alunoId]; if(!a) return {erro:"Fantasma"};
        if(tipo === 'comer') {
            if(a.fome >= 100) return { erro: "Estás cheio. Pára de comer tarte de melaço." };
            a.fome = 100; a.energia += 10; if(a.energia>100) a.energia=100;
            return { sucesso:true, msg: "Banqueteeaste-te no Salão Principal! Fome restaurada." };
        } else if (tipo === 'dormir') {
            if(a.energia >= 100) return { erro: "Não tens sono." };
            a.energia = 100; a.fome -= 30; if(a.fome<0) a.fome=0;
            a.hpAtual = a.hpMax; a.focoAtual = a.maxFoco;
            return { sucesso:true, msg: "Dormiste profundamente no teu dormitório. Status restaurados." };
        }
        return {erro:"Ação inválida."};
    }

    

    async estudarMaterial(alunoId, itemId) {
        const a = this.alunos[alunoId]; if (!a) return { erro: "Fantasma." };
        const idx = a.mochilaEscolar.findIndex(i => i.id === itemId);
        if(idx === -1) return { erro: "Não tens esse item na mochila." };
        
        const item = a.mochilaEscolar[idx]; 
        a.mochilaEscolar.splice(idx, 1); // Consome o item

        if(item.tipo === 'pocao_feita') {
            a.hpAtual = a.hpMax; 
            // Se for elixir de foco, dá FOCO EXTRA!
            if(item.nome.includes('Foco')) a.focoAtual = Math.min(a.maxFoco, a.focoAtual + 15);
            else a.focoAtual = a.maxFoco;
            
            this._salvarBancoDeDados(); return { sucesso: true, msg: `Bebeste a ${item.nome}. Sentes-te totalmente renovado!` };
        }
        else if(item.tipo === 'comida') {
            a.fome = 100; a.energia = Math.min(100, a.energia + 30);
            this._salvarBancoDeDados(); return { sucesso: true, msg: `Comeste ${item.nome}. A tua fome desapareceu.` };
        }
        else if(item.tipo === 'brinquedo' && item.nome === 'Bomba de Bosta') {
            this._salvarBancoDeDados(); return { sucesso: true, msg: `Lançaste uma Bomba de Bosta!`, efeito: 'bomba_bosta' };
        }

        // ========================================================
        // 📚 LÓGICA DE APRENDIZADO DE FEITIÇOS NAS AULAS
        // ========================================================
        await this._addXp(a, 150);
        let msgExtra = `Estudaste [${item.nome}] (150 EXP).`;
        
        // 1. Pega todos os feitiços do jogo que NÃO foram criados por jogadores (os canônicos)
        let feiticosBase = Object.keys(this.livroDeFeiticos).filter(k => !this.livroDeFeiticos[k].custom);
        
        // 2. Filtra apenas os feitiços que o aluno ainda NÃO TEM
        if (!a.maestriaFeiticos) a.maestriaFeiticos = {};
        let feiticosNaoAprendidos = feiticosBase.filter(k => !a.maestriaFeiticos[k]);

        // 3. Sorteia se o aluno vai aprender um feitiço novo ou melhorar um que já tem
        // (70% de chance de aprender um novo, se ainda houver feitiços para aprender)
        if (feiticosNaoAprendidos.length > 0 && Math.random() < 0.7) { 
            let novoFeitico = feiticosNaoAprendidos[Math.floor(Math.random() * feiticosNaoAprendidos.length)];
            
            // Adiciona o feitiço ao grimório do aluno
            a.maestriaFeiticos[novoFeitico] = { nivel: 1, exp: 0, expProx: 100 };
            
            let nomeF = this.livroDeFeiticos[novoFeitico].nome;
            msgExtra += ` 🎇 EUREKA! Acabaste de aprender o feitiço: [${nomeF}]! Vai ao teu Grimório para o equipar.`;
        } 
        else {
            // Se já sabe todos ou caiu nos 30%, aumenta a maestria (Aptidão) de um feitiço que já possui
            let magias = Object.keys(a.maestriaFeiticos);
            if (magias.length > 0) {
                let magiaSorteada = magias[Math.floor(Math.random() * magias.length)];
                a.maestriaFeiticos[magiaSorteada].exp += 80;
                let nomeM = this.livroDeFeiticos[magiaSorteada] ? this.livroDeFeiticos[magiaSorteada].nome : magiaSorteada;
                msgExtra += ` A tua aptidão com [${nomeM}] aumentou!`;
            }
        }

        this._salvarBancoDeDados(); 
        return { sucesso: true, msg: msgExtra };
    }

    // BIBLIOTECA: LORE E PROVAS (N.O.M.)
    async lerLivroIA(alunoId, assunto) {
        const a = this.alunos[alunoId]; if (!a || a.focoAtual < 2) return { erro: "Precisas de 2 de Foco." };
        a.focoAtual -= 2;
        const livro = await this.cerebroIA.gerarLivroLore(assunto);
        return { sucesso: true, titulo: livro.titulo, texto: livro.texto };
    }

    async fazerProvaIA(alunoId, resposta) {
        const a = this.alunos[alunoId]; if (!a) return { erro: "Erro" };
        if(!a.provaAtual) {
            const relogio = RelogioHogwarts.obterHorarioAtual();
            let p = await this.cerebroIA.gerarPerguntaProva(relogio.aulaAtiva === "Livre" ? "História da Magia" : relogio.aulaAtiva);
            a.provaAtual = p; return { sucesso: true, pergunta: p.pergunta, modo: 'pergunta' };
        } else {
            const result = await this.cerebroIA.avaliarProva(resposta, a.provaAtual.respostaCerta);
            a.provaAtual = null;
            if(result.nota >= 70) {
                this.adicionarPontosCasa(a.casa, 10); await this._addXp(a, 300); a.galeoes += 10;
                this._salvarBancoDeDados(); return { sucesso: true, modo: 'resultado', msg: `Nota: ${result.nota}/100. ${result.feedback} (+10 Pontos p/ Casa, +300 EXP, +10 G)` };
            } else {
                return { sucesso: true, modo: 'resultado', msg: `Nota: ${result.nota}/100. ${result.feedback} (Chumbaste na Prova.)` };
            }
        }
    }

    async submeterManuscrito(alunoId, texto) {
        const a = this.alunos[alunoId]; if (!a || a.focoAtual < 5) return { erro: "Custa 5 Foco." };
        a.focoAtual -= 5;
        const aval = await this.cerebroIA.avaliarManuscrito(texto);
        if(aval.brilhante) {
            a.atributos[aval.buffAtr] = (a.atributos[aval.buffAtr] || 5) + 1;
            await this._addXp(a, 200); this._salvarBancoDeDados();
            return { sucesso: true, msg: `${aval.feedback} (+1 em ${aval.buffAtr.toUpperCase()})` };
        }
        return { sucesso: true, msg: `${aval.feedback} (Tese rejeitada, sem atributos ganhos).` };
    }

    async criarNovoFeitico(alunoId, tese) {
        const a = this.alunos[alunoId]; if (!a || a.focoAtual < 5 || a.nivel < 5) return { erro: "Requer Nível 5 e 5 de Foco." };
        a.focoAtual -= 5;
        const feiticoIA = await this.cerebroIA.criarFeiticoInedito(a, tese);
        if (!feiticoIA) return { erro: "A Física Mágica rejeitou a tua teoria." };

        const newId = `custom_${crypto.randomBytes(4).toString('hex')}`;
        feiticoIA.aula = "Feitiços"; feiticoIA.tier = 3;
        this.livroDeFeiticos[newId] = feiticoIA;
        a.maestriaFeiticos[newId] = { nivel: 1, exp: 0, expProx: 100 };
        this._salvarBancoDeDados(); return { sucesso: true, msg: `Inventaste [${feiticoIA.nome}]!` };
    }

    equiparFeitico(alunoId, feiticoId) {
        const a = this.alunos[alunoId]; if(!a) return {erro:"Erro"};
        if (a.feitiçosEquipados.includes(feiticoId)) { a.feitiçosEquipados = a.feitiçosEquipados.filter(f => f !== feiticoId); return { sucesso: true }; }
        if (a.feitiçosEquipados.length >= 4) return { erro: "Max 4 magias no Deck." };
        a.feitiçosEquipados.push(feiticoId); this._salvarBancoDeDados(); return { sucesso: true };
    }

    // MAPA E SEGREDOS
    async procurarSegredo(alunoId, zona) {
        const a = this.alunos[alunoId]; if(!a) return {erro:"Erro"};
        if(a.focoAtual < 1) return {erro: "Cansado demais para procurar."};
        a.focoAtual -= 1;
        
        let chance = (a.atributosTotais.furtividade || 10) / 100;
        if(Math.random() < chance || true) { // Forçado a true para testar IA
            let segredo = await this.cerebroIA.investigarSegredo(zona);
            a.galeoes += segredo.gold || 0;
            if(segredo.item) a.mochilaEscolar.push({ id: crypto.randomBytes(4).toString('hex'), nome: segredo.item, tipo: 'reliquia' });
            return { sucesso: true, msg: segredo.lore + ` (+${segredo.gold} G)` };
        }
        return { erro: "Não encontraste nada." };
    }

    // POÇÕES (MINIGAME)
    async prepararPocao(alunoId, ingredientesUsados) {
        const a = this.alunos[alunoId]; if(!a) return {erro:"Erro"};
        if(ingredientesUsados.length === 0) return {erro: "O caldeirão só tem água."};

        let contagem = {}; ingredientesUsados.forEach(i => contagem[i] = (contagem[i]||0)+1);
        for(let k in contagem) { if((a.inventario.ingredientes[k]||0) < contagem[k]) return {erro: `Não tens ${k} suficiente!`}; }

        // 1. Tenta receitas conhecidas estáticas
        for(let k in this.receitasPocoes) {
            let r = this.receitasPocoes[k];
            let comp = r.ingredientes.slice().sort(); let test = ingredientesUsados.slice().sort();
            let acertou = comp.length === test.length && comp.every((val, index) => val === test[index]);
            
            if (acertou) {
                ingredientesUsados.forEach(i => { a.inventario.ingredientes[i] -= 1; });
                a.mochilaEscolar.push({ id: crypto.randomBytes(4).toString('hex'), nome: r.nome, tipo: 'pocao_feita', visual: r.visual });
                a.elos.pocoes = (a.elos.pocoes || 1000) + 15; // 🔥 GANHO DE ELO AQUI
                this._addXp(a, 100); this._salvarBancoDeDados();
                return { sucesso: true, msg: `Engarrafaste a brilhante [${r.nome}]! (+15 ELO Alquimista)` };
            }
        }
        
        const pocaoIA = await this.cerebroIA.tentarDescobrirPocao(ingredientesUsados);
        if (pocaoIA && pocaoIA.sucesso) {
            ingredientesUsados.forEach(i => { a.inventario.ingredientes[i] -= 1; });
            a.mochilaEscolar.push({ id: crypto.randomBytes(4).toString('hex'), nome: pocaoIA.nome, tipo: 'pocao_feita', visual: pocaoIA.visual });
            
            let novaChave = pocaoIA.nome.toLowerCase().replace(/ /g, '_');
            this.receitasPocoes[novaChave] = { nome: pocaoIA.nome, ingredientes: ingredientesUsados, cura: pocaoIA.cura || 500, visual: pocaoIA.visual };
            
            global.io.emit('nova_mensagem', { canal: 'salaoPrincipal', autor: '🧪 O Alquimista', texto: `Notícia Extraordinária! O bruxo ${a.nome} acabou de inventar uma poção inédita: [${pocaoIA.nome}]!` });
            
            a.elos.pocoes = (a.elos.pocoes || 1000) + 30; // 🔥 GANHO MAIOR DE ELO POR DESCOBERTA
            this._addXp(a, 300); this._salvarBancoDeDados();
            return { sucesso: true, msg: `🧪 INCRÍVEL! Descobriste uma receita inédita: [${pocaoIA.nome}]! (+30 ELO Alquimista)` };
        }

        // 3. Falhou miseravelmente
        ingredientesUsados.forEach(i => { a.inventario.ingredientes[i] -= 1; });
        a.hpAtual = Math.floor(a.hpAtual * 0.8);
        return { erro: "💥 CABUM! O caldeirão explodiu fumo verde! Mistura instável (-20% HP)." };
    }

    // ========================================================
    // MMO OPEN WORLD: EVENTO DE BOSS GLOBAL NO CASTELO
    // ========================================================
    atacarWorldBossGlobal(alunoId) {
        const a = this.alunos[alunoId];
        if(!a || !this.worldBoss.ativo) return {erro: "Não há ameaças no momento."};
        if(a.focoAtual < 2) return {erro: "Estás demasiado exausto para atacar (2 Foco)."};
        
        a.focoAtual -= 2;
        let dano = this._obterAtributosTotais(a).feiticos * 10 + (a.nivel * 5);
        this.worldBoss.hpAtual -= dano;
        
        global.io.emit('nova_mensagem', { canal: 'zona', autor: '⚔️ BATALHA GLOBAL', texto: `${a.nome} causou ${dano} de dano ao ${this.worldBoss.nome}!` });

        if(this.worldBoss.hpAtual <= 0) {
            this.worldBoss.ativo = false;
            a.galeoes += 500; // Bonus pro Last Hit
            global.io.emit('nova_mensagem', { canal: 'salaoPrincipal', autor: '🏆 VITÓRIA GLOBAL', texto: `O ${this.worldBoss.nome} foi derrotado na ${this.worldBoss.zona}! O golpe final foi de ${a.nome}. A paz regressa.` });
        }
        this._salvarBancoDeDados();
        return {sucesso: true, msg: `Atacaste o Boss! Causaste ${dano} dano!`};
    }

// ==========================================
    // COMBATE PVE MULTI-MOB - REFEITO (INSTANTÂNEO SEM IA)
    // ==========================================
    
    // 🔥 FIX 1: Gerador de monstros instantâneo (0 segundos de lag!)
    // ==========================================
    // COMBATE PVE MULTI-MOB - COM JUICE E IA DE ATAQUE
    // ==========================================
    
    // 🔥 GERADOR DE MONSTROS AAA (COM ELEMENTOS E TIER SCALING)
    _gerarMonstroRapido(hpBase, local, isBoss, areaAndar = 1) {
        // Tiers: 1 (Normal), 2 (Elite/MiniBoss), 3 (Boss)
        let isElite = (!isBoss && areaAndar % 3 === 0);
        
        const bestiario = [
            { nome: "Aranha Venenosa", padrao: "venenoso", elemento: "natureza", fraco: "fogo", resiste: "cinetico" },
            { nome: "Lobisomem Menor", padrao: "agressivo", elemento: "cinetico", fraco: "trevas", resiste: "gelo" },
            { nome: "Assassino das Sombras", padrao: "assassino", elemento: "trevas", fraco: "luz", resiste: "cinetico" },
            { nome: "Trasgo da Caverna", padrao: "tanque", elemento: "cinetico", fraco: "fogo", resiste: "cinetico" },
            { nome: "Espírito Penado", padrao: "mago_sombrio", elemento: "gelo", fraco: "luz", resiste: "cinetico" },
            { nome: "Cultista das Trevas", padrao: "mago_sombrio", elemento: "trevas", fraco: "cinetico", resiste: "trevas" }
        ];

        const bosses = [
            { nome: "Acromântula Rainha", padrao: "venenoso", elemento: "natureza", fraco: "fogo", resiste: "cinetico" },
            { nome: "Dementador Ancião", padrao: "mago_sombrio", elemento: "trevas", fraco: "luz", resiste: "gelo" },
            { nome: "Basilisco Desperto", padrao: "assassino", elemento: "natureza", fraco: "luz", resiste: "agua" },
            { nome: "Gigante da Montanha", padrao: "tanque", elemento: "cinetico", fraco: "trevas", resiste: "cinetico" }
        ];

        let pool = isBoss ? bosses : bestiario;
        let mData = pool[Math.floor(Math.random() * pool.length)];
        
        let prefixo = isElite ? "💀 Elite: " : "";
        let multElite = isElite ? 1.8 : 1.0;

        return { 
            nome: prefixo + mData.nome, 
            hpMax: Math.floor(hpBase * multElite), 
            hpAtual: Math.floor(hpBase * multElite), 
            vivo: true, 
            elemento: mData.elemento, 
            padrao: mData.padrao,
            fracoContra: mData.fraco,
            resisteContra: mData.resiste
        };
    }

    async entrarDungeon(liderId, local) {
        const lider = this.alunos[liderId]; 
        if (!lider || lider.focoAtual < 3) return { erro: "A exploração exige 3 de Foco." };
        if (!lider.pveProgresso) lider.pveProgresso = { nivel: 1, area: 1 };
        
        lider.focoAtual -= 3;
        const idInst = `dungeon_${crypto.randomBytes(4).toString('hex')}`;
        
       
        // 🔥 NOVO SCALING: Andares 1-5 são muito fáceis. A partir do 6, a dificuldade explode.
        let areaA = lider.pveProgresso.area;
        let dificuldadeMult = areaA <= 5 ? (0.4 + (areaA * 0.1)) : (1.0 + ((areaA - 5) * 0.3));
        let hpBase = Math.floor((lider.centelhaArcana || 50) * 4 * dificuldadeMult);
		
        let isAreaBoss = (lider.pveProgresso.area === 7);
        
        // 🔥 SISTEMA DE PROGRESSÃO: Regula a quantidade de Mobs pelo nível!
        let maxMobsPossiveis = 1;
        if (lider.pveProgresso.nivel >= 2 || lider.pveProgresso.area >= 4) maxMobsPossiveis = 2;
        if (lider.pveProgresso.nivel >= 4) maxMobsPossiveis = 3;
        
        let quantidadeMobs = isAreaBoss ? 1 : Math.floor(Math.random() * maxMobsPossiveis) + 1;
        let inimigosAtivos = [];

        let hpM = isAreaBoss ? hpBase * 2 : hpBase / (quantidadeMobs * 0.8);
        let monstroBase = this._gerarMonstroRapido(hpM, local, isAreaBoss);

        for(let i = 0; i < quantidadeMobs; i++) {
            inimigosAtivos.push({
                idx: i,
                nome: quantidadeMobs > 1 ? `${monstroBase.nome} [${i+1}]` : monstroBase.nome,
                hpMax: monstroBase.hpMax,
                hpAtual: monstroBase.hpAtual,
                vivo: true,
                padrao: monstroBase.padrao
            });
        }
        
        this.dungeonInstancias[idInst] = { 
            id: idInst, local,
            faseAtual: 1, maxFases: isAreaBoss ? 6 : 4, mult: dificuldadeMult,
            entidades: inimigosAtivos, status: 'combate', liderId: liderId 
        };
        
       // Substitui todo o bloco antigo do setInterval por isto:
        this.iniciarIACombate(idInst);
        
        this._salvarBancoDeDados();
        return { sucesso: true, idInstancia: idInst, estado: { entidades: inimigosAtivos } };
	}
	// 🔥 FIX: NOVA FUNÇÃO QUE CONTROLA A INTELIGÊNCIA ARTIFICIAL DE QUALQUER COMBATE
   // 🔥 IA DE COMBATE CORRIGIDA E MELHORADA
    iniciarIACombate(idInst) {
        if(this.dungeonInstancias[idInst].timerBossAtaque) clearInterval(this.dungeonInstancias[idInst].timerBossAtaque);

        this.dungeonInstancias[idInst].timerBossAtaque = setInterval(() => {
            const inst = this.dungeonInstancias[idInst];
            if(!inst || inst.status !== 'combate') { 
                clearInterval(this.dungeonInstancias[idInst].timerBossAtaque); 
                return; 
            }
            
            let jogadorAlterado = false;
            let membrosObjs = inst.membros ? inst.membros.map(id => this.alunos[id]).filter(a => a) : (inst.liderId ? [this.alunos[inst.liderId]] : []);

            membrosObjs.forEach(lider => {
                if (lider && lider.buffs) {
                    lider.buffs.forEach(b => {
                        if (b.tipo === 'regeneracao') {
                            lider.hpAtual = Math.min(lider.hpMax, lider.hpAtual + 80);
                            jogadorAlterado = true;
                        }
                        b.duracao--;
                    });
                    lider.buffs = lider.buffs.filter(b => b.duracao > 0);
                }
            });

            inst.entidades.forEach(mob => {
                if(!mob.vivo) return;

                let danoDoT = 0; let ccAtivo = false;
                if (!mob.efeitos) mob.efeitos = [];
                mob.efeitos.forEach(e => {
                    if (e.tipo === 'queimar') danoDoT += 60;
                    if (e.tipo === 'sangrar') danoDoT += 80;
                    if (e.tipo === 'envenenar') danoDoT += 100;
                    if (e.tipo === 'atordoar' || e.tipo === 'congelado' || e.tipo === 'desarmar') ccAtivo = true;
                    e.duracao--;
                });
                mob.efeitos = mob.efeitos.filter(e => e.duracao > 0);

                if (danoDoT > 0) {
                    mob.hpAtual -= danoDoT;
                    if(mob.hpAtual < 0) mob.hpAtual = 0;
                    if (global.io) {
                        membrosObjs.forEach(lider => {
                            global.io.to(`priv_${lider.id}`).emit('mmo_combat_update', { 
                                hpBoss: mob.hpAtual, efeitosBoss: mob.efeitos, hpJogador: lider.hpAtual, buffsJogador: lider.buffs
                            });
                        });
                    }
                }

                if (!ccAtivo) {
                    let diffMult = inst.mult || 1.0; 
                    let tempoBase = 2000; let cor = "#e74c3c"; let tipoAtk = "normal"; let chance = 0.5;
                    let nomeAtaque = "Ataque";
                    
                    if(mob.padrao === 'agressivo') { tempoBase = 1200; cor = "#ff3300"; tipoAtk = "rápido"; chance = 0.7; nomeAtaque = "Golpe Feroz"; }
                    else if(mob.padrao === 'tanque') { tempoBase = 3500; cor = "#8e44ad"; tipoAtk = "pesado"; chance = 0.4; nomeAtaque = "Esmagar"; }
                    else if(mob.padrao === 'venenoso') { tempoBase = 2500; cor = "#2ecc71"; tipoAtk = "veneno"; chance = 0.6; nomeAtaque = "Cuspir Ácido"; }
                    else if(mob.padrao === 'frenesi') { tempoBase = 800; cor = "#ff00ff"; tipoAtk = "caos"; chance = 0.85; nomeAtaque = "Frenesi"; }
                    else if(mob.padrao === 'defensivo') { tempoBase = 3000; cor = "#3498db"; tipoAtk = "gelo"; chance = 0.3; nomeAtaque = "Raio Congelante"; }
                    else if(mob.padrao === 'assassino') { tempoBase = 900; cor = "#111111"; tipoAtk = "furtivo"; chance = 0.75; nomeAtaque = "Lâmina das Sombras"; }
                    else if(mob.padrao === 'mago_sombrio') { tempoBase = 2800; cor = "#4a0000"; tipoAtk = "magia_negra"; chance = 0.5; nomeAtaque = "Maldição"; }

                    // Auto-Cura do Mago Sombrio
                    if (mob.padrao === 'mago_sombrio' && mob.hpAtual < mob.hpMax * 0.4 && Math.random() < 0.35) {
                        let cura = Math.floor(mob.hpMax * 0.20);
                        mob.hpAtual += cura;
                        if (global.io) membrosObjs.forEach(lider => global.io.to(`priv_${lider.id}`).emit('nova_mensagem', { canal: 'zona', autor: 'ALERTA', texto: `🩸 O ${mob.nome} conjurou Magia de Sangue e curou ${cura} HP!` }));
                    }

                    let tempoCast = Math.max(600, Math.floor(tempoBase / diffMult));
                    chance = Math.min(0.95, chance * diffMult);

                    if(Math.random() < chance && global.io) {
                        membrosObjs.forEach(lider => {
                            global.io.to(`priv_${lider.id}`).emit('alerta_boss', { 
                                instId: idInst, tempoCast: tempoCast, mobIdx: mob.idx, mobNome: mob.nome, cor: cor, tipo: nomeAtaque
                            }); 
                        });
                    }
                }
            });

            if(jogadorAlterado) this._salvarBancoDeDados();

        }, 1800);
    }
    async processarActionCombat(atacanteId, instId, feiticoId, alvoIdx = 0) {
        const a = this.alunos[atacanteId]; 
        const inst = this.dungeonInstancias[instId];
        if (!a || !inst || inst.status !== 'combate') return { erro: "Combate encerrado." };

        if (feiticoId === "dano_recebido" || feiticoId === "protego_block_reflex") {
            if (feiticoId === "dano_recebido") {
                // O dano inimigo agora escala com a dificuldade da dungeon!
                let danoInimigo = Math.floor((inst.entidades[0].hpMax || 1000) * 0.08 * (inst.mult || 1));
                a.hpAtual = Math.max(0, a.hpAtual - danoInimigo);
                this._salvarBancoDeDados();
                return { sucesso: true, relatoAcao: "Sofreste dano!", hpJogador: a.hpAtual };
            }
            return { sucesso: true, relatoAcao: "Impacto registado.", hpJogador: a.hpAtual };
        }

        const feitico = this.livroDeFeiticos[feiticoId];
        if (!feitico) return { erro: "Feitiço desconhecido." };

        if(!a.maestriaFeiticos[feiticoId]) a.maestriaFeiticos[feiticoId] = { nivel: 1, exp: 0, expProx: 100 };
        let maestria = a.maestriaFeiticos[feiticoId];
        maestria.exp += 15; let upouFeitico = false;
        if(maestria.exp >= maestria.expProx) {
            maestria.nivel++; maestria.exp -= maestria.expProx; maestria.expProx = Math.floor(maestria.expProx * 1.5); upouFeitico = true;
        }

        let mecanica = feitico.tipoMecanica || (feitico.defende ? 'escudo' : 'ataque');
        let bonusMaestria = (maestria.nivel - 1) * 10;
        let forcaDoFeitico = Number(feitico.valorBase || feitico.poderBase || 50) + bonusMaestria;
        let relatoAcao = "";

        if (mecanica === 'cura') {
            let curaAplicada = forcaDoFeitico + ((a.atributosTotais.pocoes || 5) * 5);
            a.hpAtual = Math.min(a.hpMax, a.hpAtual + curaAplicada);
            if (feitico.purificar) a.efeitos = []; 
            relatoAcao = `Lançaste ${feitico.nome} e recuperaste ${curaAplicada} HP!`;
            this._salvarBancoDeDados();
            return { sucesso: true, hpJogador: a.hpAtual, cura: curaAplicada, relatoAcao, bossMorto: false, entidades: inst.entidades, upouFeitico, nomeFeiticoUpado: feitico.nome, novoNivelFeitico: maestria.nivel };
        } 
        
        if (mecanica === 'escudo' || mecanica === 'defesa') {
            return { sucesso: true, relatoAcao: `A barreira de ${feitico.nome} protege-te!`, bossMorto: false, entidades: inst.entidades, upouFeitico, nomeFeiticoUpado: feitico.nome, novoNivelFeitico: maestria.nivel };
        }

        let mob = inst.entidades.find(m => m.idx === alvoIdx && m.vivo) || inst.entidades.find(m => m.vivo);
        if(!mob) return { erro: "Sem alvos vivos." };

        // 🔥 A MECÂNICA DO ASSASSINO (CORRIGIDA)
        // O assassino esquiva-se de 30% dos ataques, A NÃO SER QUE esteja congelado ou atordoado.
        let isImobilizado = mob.efeitos && mob.efeitos.some(e => e.tipo === 'congelado' || e.tipo === 'atordoar');
        if (mob.padrao === 'assassino' && !isImobilizado && Math.random() < 0.30) {
            return { bossMorto: false, entidades: inst.entidades, hpBoss: mob.hpAtual, danoAplicado: 0, defendeu: true, relatoAcao: `💨 O ${mob.nome} esquivou-se pelas sombras! (Dica: Usa Feitiços de Controle/Gelo)`, upouFeitico, nomeFeiticoUpado: feitico.nome, novoNivelFeitico: maestria.nivel, hpJogador: a.hpAtual };
        }

        if (!mob.efeitos) mob.efeitos = [];
        let danoBaseCalculado = forcaDoFeitico + ((a.atributosTotais.feiticos || 5) * 5);
        let danoFinal = danoBaseCalculado;
        let multiplicador = 1.0;
        let defendeu = false;
   // 🔥 APLICA AS PASSIVAS DO JOGADOR
        let isCríticoPassivo = Math.random() < (a.passivasCombate.crit_chance || 0.05);
        if (isCríticoPassivo) {
            multiplicador += 1.0; // Dobra o dano base
            relatoAcao += `⚡ CRÍTICO! `;
        }
        let danoDoT = 0;
        mob.efeitos.forEach(e => {
            if (e.tipo === 'queimar') danoDoT += 45;
            if (e.tipo === 'sangrar') danoDoT += 60;
            e.duracao--;
        });
        mob.efeitos = mob.efeitos.filter(e => e.duracao > 0);
        if (danoDoT > 0) { mob.hpAtual -= danoDoT; relatoAcao += `[DoT: -${danoDoT} HP] `; }

        let alvoVeneno = mob.efeitos.find(e => e.tipo === 'envenenar');
        let alvoMolhado = mob.efeitos.find(e => e.tipo === 'molhado');
        let alvoCongelado = mob.efeitos.find(e => e.tipo === 'congelado');
        let alvoVulneravel = mob.efeitos.find(e => e.tipo === 'vulneravel');
        let alvoAntiCura = mob.efeitos.find(e => e.tipo === 'anti_cura');

        if (alvoVulneravel) multiplicador += 1.0; 

        // 🔥 NOVO: SISTEMA DE FRAQUEZAS ELEMENTAIS
        if (mob.fracoContra && feitico.elemento === mob.fracoContra) {
            multiplicador += 1.0; // Dano a Dobrar!
            relatoAcao += `💥 ATAQUE SUPER EFICAZ! `;
        }
        if (mob.resisteContra && feitico.elemento === mob.resisteContra) {
            multiplicador -= 0.8; // Corta 80% do dano!
            relatoAcao += `🛡️ O monstro resistiu ao teu feitiço... `;
            defendeu = true;
        }

        // Combos (Sinergias)
        if (feitico.elemento === 'fogo' && alvoVeneno) { multiplicador += 2.0; mob.efeitos = mob.efeitos.filter(e => e.tipo !== 'envenenar'); relatoAcao += "💥 DETONAÇÃO TÓXICA CRÍTICA! "; }
        else if (feitico.elemento === 'eletrico' && alvoMolhado) { multiplicador += 1.5; mob.efeitos.push({ tipo: 'atordoar', duracao: 2 }); relatoAcao += "⚡ CHOQUE PARALISANTE! "; } 
        else if (feitico.elemento === 'cinetico' && alvoCongelado) { multiplicador += 2.5; mob.efeitos = mob.efeitos.filter(e => e.tipo !== 'congelado'); relatoAcao += "❄️ SHATTER! Gelo estilhaçado! "; }
        else if (feitico.elemento === 'fogo' && alvoMolhado) { multiplicador -= 0.5; mob.efeitos = mob.efeitos.filter(e => e.tipo !== 'molhado'); relatoAcao += "💨 Evaporação. "; }

        if (feitico.efeitoSecundario) {
            let eExistente = mob.efeitos.find(e => e.tipo === feitico.efeitoSecundario);
            if (eExistente) eExistente.duracao = feitico.duracao || 3;
            else mob.efeitos.push({ tipo: feitico.efeitoSecundario, duracao: feitico.duracao || 3 });
        }

        if (mob.padrao === 'defensivo' && mecanica !== 'status' && !alvoAntiCura) {
            danoFinal = Math.floor(danoFinal * 0.4); defendeu = true;
        }

        danoFinal = Math.max(1, Math.floor(danoBaseCalculado * multiplicador));

        if (feitico.buffJogador) {
            if(!a.buffs) a.buffs = [];
            a.buffs.push({ tipo: feitico.buffJogador, duracao: feitico.duracaoBuff || 3 });
        }

        let critico = Math.random() > 0.85;
        if(critico) danoFinal = Math.floor(danoFinal * 1.5);

        if (feitico.lifesteal) {
            let roubo = Math.floor(danoFinal * feitico.lifesteal);
            a.hpAtual = Math.min(a.hpMax, a.hpAtual + roubo);
            relatoAcao += `[Roubo de Vida: +${roubo}] `;
        }

        mob.hpAtual -= danoFinal;
        relatoAcao += `Infligiu ${danoFinal} Dano!`;

        if (mob.hpAtual <= 0) {
            mob.vivo = false; mob.hpAtual = 0;
            let todosMortos = inst.entidades.every(m => !m.vivo);

            if(todosMortos) {
                let isBoss = (inst.faseAtual === inst.maxFases);
                
                // 🔥 NOVO: PARTILHA DE LOOT E XP MULTIPLAYER COOP
                let recebedores = inst.membros && inst.membros.length > 0 ? inst.membros : [a.id];
                let divisao = recebedores.length;

                let xpFase = Math.floor((isBoss ? 1500 : 400 * inst.entidades.length) / divisao);
                let galeoesFase = Math.floor((isBoss ? 800 : 100 * inst.entidades.length) / divisao);

                // Aplica Loot a todos os membros vivos na instância!
                for (let mId of recebedores) {
                    let membro = this.alunos[mId];
                    if (!membro) continue;

                    if (inst.isForestNode) {
                        if (!membro.lootTemporario) membro.lootTemporario = { galeoes: 0, xp: 0, itens: [] };
                        membro.lootTemporario.galeoes += galeoesFase;
                        membro.lootTemporario.xp += xpFase;
                        if (!membro.inventario.ingredientes) membro.inventario.ingredientes = {};
                        if (mob.nome.includes("Aranha")) membro.inventario.ingredientes['veneno_aranha'] = (membro.inventario.ingredientes['veneno_aranha']||0) + 1;
                        if (mob.nome.includes("Lobisomem")) membro.inventario.ingredientes['pelo_lobo'] = (membro.inventario.ingredientes['pelo_lobo']||0) + 1;
                    } else {
                        this._addXp(membro, xpFase); membro.galeoes += galeoesFase; 
                    }

                    if(!membro.estatisticas) membro.estatisticas = { monstrosMortos: 0 };
                    membro.estatisticas.monstrosMortos += inst.entidades.length;

                    // DROP DE EQUIPAMENTOS PROCEDURAIS PARA TODOS (Roll individual!)
                    if (Math.random() < (isBoss ? 0.35 : 0.08)) { 
                        let tipoRnd = ['cabeca', 'corpo', 'pescoco'][Math.floor(Math.random()*3)];
                        this.cerebroIA.gerarEquipamentoRPG(tipoRnd, membro.nivel).then(equipNovo => {
                            equipNovo.id = `eq_${crypto.randomBytes(4).toString('hex')}`;
                            equipNovo.raridade = ['Comum', 'Incomum', 'Raro', 'Épico', 'Lendário'][isBoss ? Math.floor(Math.random()*2+3) : Math.floor(Math.random()*3)];
                            
                            if (inst.isForestNode) {
                                if(!membro.lootTemporario.itens) membro.lootTemporario.itens = [];
                                membro.lootTemporario.itens.push(equipNovo);
                            } else {
                                if(!membro.inventario.armario) membro.inventario.armario = [];
                                membro.inventario.armario.push(equipNovo);
                            }
                            if(global.io) global.io.to(`priv_${membro.id}`).emit('nova_mensagem', { canal: 'zona', autor: '🎁 DROP', texto: `Obtiveste [${equipNovo.raridade}] ${equipNovo.nome}!` });
                        });
                    }

                    // Envia HUD de Floresta
                    if (inst.isForestNode && global.io) {
                        global.io.to(`priv_${membro.id}`).emit('forest_loot_update', { 
                            gold: membro.lootTemporario.galeoes, xp: membro.lootTemporario.xp, itens: membro.lootTemporario.itens ? membro.lootTemporario.itens.length : 0 
                        });
                    }
                }

                relatoAcao += ` | O Grupo ganhou ${xpFase} XP e ${galeoesFase} G cada!`;

                if (inst.faseAtual < inst.maxFases) {
                    inst.faseAtual++;
                    let maxMobs = (a.pveProgresso && a.pveProgresso.nivel >= 2) ? 2 : 1;
                    let proxMobs = inst.faseAtual === inst.maxFases ? 1 : Math.floor(Math.random() * maxMobs) + 1;
                    let novasEntidades = [];
                    let mData = await this.cerebroIA.gerarMonstroProcedural(mob.hpMax * 1.3, inst.local, (inst.faseAtual === inst.maxFases), a.nivel);
                    for(let i=0; i<proxMobs; i++) {
                        novasEntidades.push({ idx: i, nome: (proxMobs > 1 ? `${mData.nome} [${i+1}]` : mData.nome), hpMax: mData.hp, hpAtual: mData.hp, vivo: true, padrao: ['agressivo', 'tanque'][Math.floor(Math.random()*2)], efeitos: [] });
                    }
                    inst.entidades = novasEntidades; this._salvarBancoDeDados();
                    return { novaFase: true, faseAtual: inst.faseAtual, relatoAcao: `Onda aniquilada! ${relatoAcao}`, entidades: novasEntidades, hpBoss: novasEntidades[0].hpAtual, danoAplicado: danoFinal, alvoMorto: mob.idx, upouFeitico, nomeFeiticoUpado: feitico.nome, novoNivelFeitico: maestria.nivel, hpJogador: a.hpAtual };
                } else {
                    inst.status = 'finalizado'; 
                    if (inst.timerBossAtaque) clearInterval(inst.timerBossAtaque);
                    
                    if(!a.pveProgresso) a.pveProgresso = { area: 1, nivel: 1 };
                    a.pveProgresso.area++; if (a.pveProgresso.area > 7) { a.pveProgresso.area = 1; a.pveProgresso.nivel++; }
                    this._salvarBancoDeDados();

                    if (this.florestaEngine && inst.isForestNode) {
                        recebedores.forEach(mId => {
                            this.florestaEngine.retornarDaBatalha(mId, true, false, inst.isForestNode, inst.forestInstId, global.io);
                        });
                    }

                    return { bossMorto: true, relatoAcao: `Área Purificada! ${relatoAcao}`, hpBoss: 0, danoAplicado: danoFinal, alvoMorto: mob.idx, upouFeitico, nomeFeiticoUpado: feitico.nome, novoNivelFeitico: maestria.nivel, hpJogador: a.hpAtual };
                }
            } else {
                this._salvarBancoDeDados();
                return { mobEliminado: true, relatoAcao: `${mob.nome} caiu!`, entidades: inst.entidades, hpBoss: 0, danoAplicado: danoFinal, alvoMorto: mob.idx, upouFeitico, nomeFeiticoUpado: feitico.nome, novoNivelFeitico: maestria.nivel, hpJogador: a.hpAtual };
            }
        }
        this._salvarBancoDeDados();
        return { bossMorto: false, entidades: inst.entidades, hpBoss: mob.hpAtual, danoAplicado: danoFinal, defendeu, relatoAcao, upouFeitico, nomeFeiticoUpado: feitico.nome, novoNivelFeitico: maestria.nivel, hpJogador: a.hpAtual, buffsJogador: a.buffs };
    }
	// ==========================================
// RECEITAS DE FORJA (CRAFTING)
// ==========================================
// ==========================================
    // SISTEMA DE FORJA (CRAFTING)
    // ==========================================
    async craftEquipamento(alunoId, tipo) {
        // 🔥 NOVO ECOSSISTEMA DE CRAFTING CRUZADO
        // O jogador precisa de plantar (Estufa) E matar monstros (Floresta)
        const RECEITAS_CRAFT = {
            cabeca: { galeoes: 1200, materiais: { mandragora: 5, veneno_aranha: 3 } },
            corpo: { galeoes: 2500, materiais: { asfodelo: 8, escama_basilisco: 1 } },
            pescoco: { galeoes: 900, materiais: { ditamno: 10, pelo_lobo: 4 } }
        };

        const a = this.alunos[alunoId];
        const receita = RECEITAS_CRAFT[tipo];
        if (!a || !receita) return { erro: "Receita não encontrada." };

        if (a.galeoes < receita.galeoes) return { erro: `O ferreiro duende exige ${receita.galeoes} G.` };
        
        for (let mat in receita.materiais) {
            if ((a.inventario.ingredientes[mat] || 0) < receita.materiais[mat]) {
                let mName = mat.replace('_', ' ').toUpperCase();
                return { erro: `Faltam materiais: ${mName} (${a.inventario.ingredientes[mat] || 0}/${receita.materiais[mat]})` };
            }
        }

        a.galeoes -= receita.galeoes;
        for (let mat in receita.materiais) { a.inventario.ingredientes[mat] -= receita.materiais[mat]; }

        const item = await this.cerebroIA.gerarEquipamentoRPG(tipo, a.nivel);
        item.id = `eq_craft_${crypto.randomBytes(4).toString('hex')}`;
        
        // Itens craftados têm muito mais chance de serem bons!
        const rand = Math.random();
        if (rand < 0.15) item.raridade = "Mítico";
        else if (rand < 0.40) item.raridade = "Lendário";
        else if (rand < 0.80) item.raridade = "Épico";
        else item.raridade = "Raro";

        const mults = { "Raro": 1.7, "Épico": 2.5, "Lendário": 4.0, "Mítico": 8.0 };
        const m = mults[item.raridade];
        for (let attr in item.atributos) { item.atributos[attr] = Math.ceil((item.atributos[attr]+1) * m); }

        item.passivas = { crit_chance: parseFloat((Math.random() * 0.15).toFixed(3)) }; // Crafted gear always has crit!

        if (!a.inventario.armario) a.inventario.armario = [];
        a.inventario.armario.push(item);
        
        this._salvarBancoDeDados();
        return { sucesso: true, msg: `Obra Prima! Forjaste um item [${item.raridade}]!`, item };
    }
    // ==========================================
    // SISTEMA DE DESEQUIPAR / EQUIPAR
    // ==========================================
    desequiparItem(alunoId, slot) {
        const a = this.alunos[alunoId];
        if (!a || !a.equipamentos[slot]) return { erro: "Nada equipado." };
        
        const item = a.equipamentos[slot];
        if (!a.inventario.armario) a.inventario.armario = [];
        
        // Devolve o item para a lista de inventário (Armário)
        a.inventario.armario.push(item);
        a.equipamentos[slot] = null;

        this._obterAtributosTotais(a); // Recalcula os bónus
        this._salvarBancoDeDados();
        return { sucesso: true, msg: `Removeste [${item.nome}] e guardaste no armário.` };
    }

    equiparItem(alunoId, itemId) {
        const a = this.alunos[alunoId];
        if (!a || !a.inventario.armario) return { erro: "Armário vazio." };

        const idx = a.inventario.armario.findIndex(i => i.id === itemId);
        if (idx === -1) return { erro: "Item não encontrado." };

        const item = a.inventario.armario[idx];
        const slot = item.tipo; // 'cabeca', 'corpo' ou 'pescoco'

        // Se já tiver algo equipado, troca (desequipa o antigo primeiro)
        if (a.equipamentos[slot]) {
            a.inventario.armario.push(a.equipamentos[slot]);
        }

        a.equipamentos[slot] = item;
        a.inventario.armario.splice(idx, 1); // Remove do armário pois está no corpo

        this._obterAtributosTotais(a);
        this._salvarBancoDeDados();
        return { sucesso: true, msg: `Equipaste [${item.nome}].` };
    }

    criarGremio(alunoId, nomeGremio) {
        const a = this.alunos[alunoId]; if(!a) return {erro:"Fantasma"};
        if(a.galeoes < 100) return {erro: "Requer 100 Galeões."};
        if(a.nivel < 5) return {erro: "Requer Nível 5 no mínimo."};
        if(a.gremioId) return {erro: "Já tens um Grêmio."};

        let idG = `gremio_${crypto.randomBytes(4).toString('hex')}`;
        this.gremios[idG] = { id: idG, nome: nomeGremio, lider: a.id, membros: [a.id], nivel: 1, xp: 0, banco: 0 };
        a.gremioId = idG; a.galeoes -= 100;
        this._salvarBancoDeDados();
        return { sucesso: true, msg: `Grêmio [${nomeGremio}] fundado com glória!` };
    }
	// Dentro da classe MotorConscienciaHogwarts em HogwartsCore.js

// 1. GERAÇÃO DE ITENS PARA O CHÃO DO MAPA
    async gerarItemMundoIA(nomeBase) {
        if (!this.apiKey) return { nome: nomeBase, tipo: "reliquia", descricao: "Um objeto antigo.", efeito: "nenhum", valor: 10 };
        const prompt = `Gera as propriedades mágicas para o item "${nomeBase}" encontrado no chão de Hogwarts.
        Retorne APENAS JSON ESTRITO: {
            "nome": "${nomeBase} Encantado",
            "tipo": "reliquia",
            "descricao": "Lore curta e misteriosa do item.",
            "efeito": "vida",
            "valor": 50
        }`;
        try {
            const res = await this.groq.chat.completions.create({
                messages: [{ role: "user", content: prompt }],
                model: "llama-3.1-8b-instant",
                response_format: { type: "json_object" }
            });
            return this._extrairJSONBlindado(res.choices[0].message.content) || { nome: nomeBase, tipo: "reliquia", descricao: "Misterioso.", efeito: "vida", valor: 10 };
        } catch(e) {
            return { nome: nomeBase, tipo: "reliquia", descricao: "Um item comum.", efeito: "vida", valor: 10 };
        }
    }

    // 2. A IA QUE OUVE O CHAT E CONJURA MONSTROS/ITENS NO MAPA!
   // 2. A IA QUE OUVE O CHAT E CONJURA MONSTROS/ITENS NO MAPA!
    async gerarRespostaPersonagemIA(zona, jogadorNome, mensagemTexto, casa) {
        if (!this.apiKey) return null;
        
        const agora = Date.now();
        if (this.Penseira.chatCooldowns[zona] && agora < this.Penseira.chatCooldowns[zona]) {
            return null; 
        } // <--- A CHAVETA QUE FALTAVA AQUI!

        try {
            const prompt = `És a magia onipresente de Hogwarts, respondendo pelo próprio ambiente, quadros ou fantasmas. O aluno ${jogadorNome} (${casa}) gritou em "${zona}": "${mensagemTexto}".
            
            REGRAS DE RESPOSTA (PORTUGUÊS):
            1. O teu "texto" tem de ser imersivo, ter personalidade (Pode ser sarcástico se for o Pirraça, melancólico se for o Barão Sangrento, ou épico se for a própria sala).
            2. Se o aluno pedir um desafio, treino ou luta (ex: "Quero lutar!", "Aparece monstro"), preenche "spawnMob" com o nome de uma besta perigosa apropriada.
            3. Se pedir comida, itens, ou ajuda material, preenche "spawnItem".
            
            RETORNA APENAS JSON: 
            {
                "personagem": "Nome do Fantasma/Quadro/Armadura", 
                "texto": "Um texto rico, com personalidade, rindo ou lamentando a ação do aluno...", 
                "pontos": 0,
                "spawnMob": null,
                "spawnItem": null
            }`;
            
            const res = await this.groq.chat.completions.create({ 
                messages: [{ role: "user", content: prompt }], 
                model: "llama-3.1-8b-instant", // Aqui usamos o mais rápido para não dar lag no chat!
                response_format: { type: "json_object" }
            });
            
            this.Penseira.chatCooldowns[zona] = agora + 8000; // 8 Segundos de cooldown para não spammar a API
            return this._extrairJSONBlindado(res.choices[0].message.content);
        } catch(e) { return null; }
    }
	async requisitarTituloIA(alunoId) {
        const a = this.alunos[alunoId]; if(!a) return {erro:"Fantasma"};
        if(a.focoAtual < 5) return {erro:"Requer 5 de Foco para refletir sobre a tua jornada."};
        a.focoAtual -= 5;
        const prompt = `Avalia o bruxo ${a.nome}. Casa: ${a.casa}. Nível: ${a.nivel}. Duelos vencidos: ${a.estatisticas.duelosVencidos}. Monstros mortos: ${a.estatisticas.monstrosMortos}. Atributo maior: Feitiços (${a.atributosTotais.feiticos}).
        Atua como o Ministro da Magia e decreta UM TÍTULO ÉPICO e EXCLUSIVO (Max 4 palavras, ex: 'O Executor das Sombras', 'Duelista de Fogo'). Retorna SÓ O TÍTULO em texto simples.`;
        try {
            const res = await this.cerebroIA.groq.chat.completions.create({ messages: [{ role: "user", content: prompt }], model: "llama-3.1-8b-instant" });
            a.titulo = res.choices[0].message.content.replace(/["']/g, '').trim();
            this._salvarBancoDeDados(); return {sucesso: true, titulo: a.titulo};
        } catch(e) { return {erro:"O Ministério ignorou a carta."}; }
    }
	
	// ========================================================
    // SISTEMA DE DUELOS MULTIPLAYER (PvP RANKED)
    // ========================================================
    entrarFilaPvP(alunoId, ioGlobal) {
        const a = this.alunos[alunoId]; if (!a) return { erro: "Fantasma." };
        if (this.pvpFila.includes(a.id)) return { erro: "Já estás na fila aguardando." };
        
        this.pvpFila.push(a.id);
        
        // Matchmaking: Se houver 2 pessoas na fila, inicia o Duelo!
        if (this.pvpFila.length >= 2) {
            const id1 = this.pvpFila.shift(); const id2 = this.pvpFila.shift();
            const b1 = this.alunos[id1]; const b2 = this.alunos[id2];
            const instId = `pvp_${crypto.randomBytes(4).toString('hex')}`;
            
            // Restaura a vida de ambos para um duelo justo
            b1.hpAtual = b1.hpMax; b1.focoAtual = b1.maxFoco;
            b2.hpAtual = b2.hpMax; b2.focoAtual = b2.maxFoco;
            
            this.pvpPartidas[instId] = {
                id: instId,
                p1: { id: b1.id, nome: b1.nome, hpAtual: b1.hpAtual, hpMax: b1.hpMax },
                p2: { id: b2.id, nome: b2.nome, hpAtual: b2.hpAtual, hpMax: b2.hpMax },
                status: 'jogando'
            };
            
            // Puxa ambos os jogadores para a Arena de Ação (Com Equipamentos para Renderizar)!
            ioGlobal.to(`priv_${b1.id}`).emit('pvp_start', { 
                instId, 
                inimigo: { id: b2.id, nome: b2.nome, hpMax: b2.hpMax, equipamentos: b2.equipamentos, casa: b2.casa },
                isInvade: true
            });
            ioGlobal.to(`priv_${b2.id}`).emit('pvp_start', { 
                instId, 
                inimigo: { id: b1.id, nome: b1.nome, hpMax: b1.hpMax, equipamentos: b1.equipamentos, casa: b1.casa },
                isInvade: true
            });
            return { sucesso: true, msg: "Adversário encontrado! O Duelo vai começar!" };
        }
        return { sucesso: true, msg: "Entraste na fila. Aguarda um oponente..." };
    }

    processarAcaoPvP(atacanteId, instId, feiticoId, ioGlobal) {
        const partida = this.pvpPartidas[instId];
        if (!partida || partida.status !== 'jogando') return { erro: "Duelo finalizado ou não existe." };
        
        const isP1 = partida.p1.id === atacanteId;
        const eu = isP1 ? partida.p1 : partida.p2;
        const inimigo = isP1 ? partida.p2 : partida.p1;
        const aEu = this.alunos[eu.id];
        
        let dano = 0;
        // Calcula o Dano do Feitiço se não for um reflexo de defesa
        if (feiticoId !== "protego_block_reflex" && feiticoId !== "dano_recebido") {
            const f = this.livroDeFeiticos[feiticoId];
            if(f) dano = (f.poderBase || 50) + ((aEu.atributosTotais.feiticos || 5) * 5);
        }
        
        if (dano > 0) {
            inimigo.hpAtual -= dano;
            if(inimigo.hpAtual < 0) inimigo.hpAtual = 0;
            
            // Avisa o ecrã do inimigo que ele perdeu vida (Atualiza o BossBar dele)
            ioGlobal.to(`priv_${inimigo.id}`).emit('pvp_update', { meuHp: inimigo.hpAtual, inimigoHp: eu.hpAtual });
            // Atualiza o teu próprio ecrã (O BossBar é o teu inimigo)
            ioGlobal.to(`priv_${eu.id}`).emit('pvp_update', { meuHp: eu.hpAtual, inimigoHp: inimigo.hpAtual });
        }

        // Verifica se alguém morreu
         if (inimigo.hpAtual <= 0) {
            partida.status = 'finalizado';
            const aInimigo = this.alunos[inimigo.id];
            
            // Garantir que os Elos existem
            if(!aEu.elos) aEu.elos = { duelos: 1000 };
            if(!aInimigo.elos) aInimigo.elos = { duelos: 1000 };
            
            // Distribui as recompensas e o ELO Ranked de forma correta e permanente!
            aEu.elos.duelos += 25; 
            aEu.estatisticas.duelosVencidos++;
            aInimigo.elos.duelos = Math.max(0, aInimigo.elos.duelos - 15);
            
            aEu.galeoes += 50; 
            this.ganharXp(aEu, 500); // 500 XP por vitória
            
            ioGlobal.to(`priv_${eu.id}`).emit('pvp_fim', { msg: "🏆 Venceste o Duelo Mágico! (+25 ELO, +50G)" });
            ioGlobal.to(`priv_${inimigo.id}`).emit('pvp_fim', { msg: "💀 Foste derrotado no duelo! (-15 ELO)" });
            
            delete this.pvpPartidas[instId];
            this._salvarBancoDeDados();

            // 🔥 INSERE O CÓDIGO DA FLORESTA PVP AQUI 🔥
            if (this.florestaEngine && partida.isForestInvade) {
                // 'eu' é quem atacou e matou. 'inimigo' é quem morreu.
                this.florestaEngine.retornarDaBatalha(eu.id, true, true, partida.isForestInvade, partida.forestInstId, ioGlobal);
                this.florestaEngine.retornarDaBatalha(inimigo.id, false, true, partida.isForestInvade, partida.forestInstId, ioGlobal);
            }
        }
        return { sucesso: true };
}
    tickServerGlobal() {
        const relogio = RelogioHogwarts.obterHorarioAtual();
        global.io.emit('relogio_hogwarts', relogio);
        Lexicon.PulsarEternidade(); 

        if (this.quadribol) this.quadribol.processarTick(global.io);
        this.processarCicloMundoVivo();
        
        for (let id in this.alunos) {
            let a = this.alunos[id];
            
            // 🔥 NOVO: Juros de Gringotes (Gold Sink positivo) - 0.1% a cada 100 ticks
            if (a.cofreGringotes > 0 && Math.random() < 0.01) {
                let rendimento = Math.max(1, Math.floor(a.cofreGringotes * 0.001));
                a.cofreGringotes += rendimento;
            }

            // ... (Resto do tickServerGlobal mantém-se igual)
			if(a.estufa) {
                a.estufa.forEach(p => {
                    if(p.plantada && !p.morta && !p.colhida) {
                        p.agua -= 2; // Perde água a cada tick
                        if(p.agua <= 0) { p.morta = true; p.agua = 0; }
                        
                        // 2% de chance de ganhar uma praga a cada tick
                        if(!p.praga && Math.random() < 0.02) p.praga = true;
                        
                        // Se tiver praga, a planta não cresce e perde água mais rápido
                        if(p.praga) p.agua -= 3;
                    }
                });
            }
        }
        for (let id in this.alunos) {
            let a = this.alunos[id];
            if (a.estadoJogo !== "CASTELO") continue;
            
            if(Math.random() < 0.05) { a.fome -= 1; a.energia -= 1; }
			// 🔥 NOVO: Ciclo de vida do Pet (Tamagotchi)
            if (a.pet && a.pet.adotado) {
                if (Math.random() < 0.15) { 
                    a.pet.fome = Math.max(0, a.pet.fome - 1); 
                    a.pet.felicidade = Math.max(0, a.pet.felicidade - 1); 
                }
            }
            if(a.fome < 0) a.fome = 0; if(a.energia < 0) a.energia = 0;

            if(Math.random() < 0.05) { 
                if (a.focoAtual < a.maxFoco) a.focoAtual += 1;
                if (a.hpAtual < a.hpMax) a.hpAtual += Math.floor(a.hpMax * 0.05); 
            }
        }
        
        // 🛑 CORREÇÃO MAXIMA: A IA cria as próprias notícias de forma autónoma (Apenas 0.5% de chance a cada tick)
        if(Math.random() < 0.005) {
            this.cerebroIA.gerarNoticiaProfeta().then(noticia => {
                global.io.emit('noticia_profeta', noticia);
            });
        }

        // 🛑 CORREÇÃO MAXIMA: Fantasmas autónomos quase não gastam API agora (0.8% de chance)
        if(Math.random() < 0.008 && Object.keys(this.alunos).length > 0) {
            const zonas = ["Salão Principal", "Grande Escadaria", "Masmorras", "Torre de Astronomia", "Cabana do Hagrid", "Hogsmeade"];
            const z = zonas[Math.floor(Math.random() * zonas.length)];
            const alunosAtivos = Object.values(this.alunos).filter(a => a.estadoJogo === 'CASTELO').map(a => a.nome).slice(0, 3).join(", ");
            
            this.cerebroIA.gerarVidaAutonomaCastelo(z, alunosAtivos || "ninguém").then(evento => {
                if(evento && evento.texto && evento.personagem !== "Nenhum") {
                    global.io.to(`zona_${z}`).emit('nova_mensagem', { canal: 'zona', autor: `🗣️ [${evento.personagem}]`, texto: evento.texto });
                }
            });
        }
    } // <--- FECHA O tickServerGlobal()
} // <--- FECHA A CLASSE HogwartsCore
// ==============================================================================
// 🌲 MOTOR PROCEDURAL DA FLORESTA PROIBIDA (ROGUELIKE & PVP)
// ==============================================================================
// ==============================================================================
// 🌲 MOTOR PROCEDURAL DA FLORESTA PROIBIDA (ROGUELIKE & PVP)
// ==============================================================================
class MotorFlorestaProcedural {
    constructor(coreObj) {
        this.core = coreObj;
        this.instancias = {};
        setInterval(() => this.tickFloresta(global.io), 100); 
    }

    entrarFloresta(aluno) {
        let instId = null;
        let areaAlvo = aluno.pveProgresso ? aluno.pveProgresso.area : 1;
        
        for (let id in this.instancias) {
            let inst = this.instancias[id];
            if (inst.area === areaAlvo && Object.keys(inst.jogadores).length < 10) {
                instId = id; break;
            }
        }

        if (!instId) {
            instId = `forest_${crypto.randomBytes(4).toString('hex')}`;
            this.instancias[instId] = this.gerarNivelFloresta(areaAlvo, instId);
        }

        let inst = this.instancias[instId];
        aluno.lootTemporario = { galeoes: 0, xp: 0, itens: [] };
        
        inst.jogadores[aluno.id] = {
            id: aluno.id, nome: aluno.nome, casa: aluno.casa, partyId: aluno.partyId,
            x: inst.spawn.x + (Math.random()*100 - 50), 
            y: inst.spawn.y + (Math.random()*100 - 50),
            vx: 0, vy: 0, dir: 1, isMoving: false, emCombate: false
        };

        return inst;
    }

    gerarNivelFloresta(areaNivel, instId) {
        let size = 2000 + (areaNivel * 500); 
        let inst = {
            id: instId, area: areaNivel, w: size, h: size,
            jogadores: {}, mobs: [], baus: [], arvores: [],
            spawn: { x: size/2, y: size - 200 },
            portal: { x: size/2, y: 200, ativo: false } 
        };

        for(let i=0; i < (size/10); i++) {
            let ax = Math.random() * size; let ay = Math.random() * size;
            if (Math.hypot(ax - inst.spawn.x, ay - inst.spawn.y) > 300 && Math.hypot(ax - inst.portal.x, ay - inst.portal.y) > 300) {
                inst.arvores.push({ x: ax, y: ay, r: 30 + Math.random()*30 });
            }
        }

        let qtdMobs = 5 + (areaNivel * 3);
        for(let i=0; i<qtdMobs; i++) {
            let baseHp = 400 * (1 + (areaNivel*0.2));
            let mData = this.core._gerarMonstroRapido(baseHp, "Floresta", false);
            inst.mobs.push({
                id: `fmob_${crypto.randomBytes(3).toString('hex')}`,
                nome: mData.nome, hpMax: mData.hpMax, hpAtual: mData.hpMax,
                padrao: mData.padrao, elemento: mData.elemento, // Guarda IA
                x: Math.random() * size, y: Math.random() * size,
                vx: Math.random()*2-1, vy: Math.random()*2-1, isBoss: false
            });
        }

        let bossData = this.core._gerarMonstroRapido(1500 * areaNivel, "Floresta", true);
        inst.mobs.push({
            id: `fboss_${crypto.randomBytes(3).toString('hex')}`,
            nome: bossData.nome, hpMax: bossData.hpMax, hpAtual: bossData.hpMax,
            padrao: bossData.padrao, elemento: bossData.elemento, 
            x: inst.portal.x, y: inst.portal.y + 100, vx: 0, vy: 0, isBoss: true
        });

        let qtdBaus = 3 + Math.floor(Math.random() * 3);
        for(let i=0; i<qtdBaus; i++) {
            inst.baus.push({ id: `chest_${crypto.randomBytes(3).toString('hex')}`, x: Math.random() * size, y: Math.random() * size, looted: false });
        }
        return inst;
    }

    tickFloresta(ioGlobal) {
        for (let instId in this.instancias) {
            let inst = this.instancias[instId];
            let playersInMap = Object.values(inst.jogadores).filter(p => !p.emCombate);

            inst.mobs.forEach(mob => {
                if (!mob.isBoss) {
                    let alvoMaisProximo = null;
                    let menorDist = 350; // Raio de Aggro/Perseguição do mapa 2D

                    playersInMap.forEach(p => {
                        if (p.imune && Date.now() < p.imune) return;
                        let dist = Math.hypot(p.x - mob.x, p.y - mob.y);
                        if (dist < menorDist) { menorDist = dist; alvoMaisProximo = p; }
                    });

                    // 🔥 IA DE PERSEGUIÇÃO: Os Monstros vão ativamente correr atrás dos jogadores!
                    if (alvoMaisProximo && mob.padrao !== 'defensivo') {
                        let ang = Math.atan2(alvoMaisProximo.y - mob.y, alvoMaisProximo.x - mob.x);
                        let speed = mob.padrao === 'frenesi' ? 6 : 3.5;
                        mob.vx = Math.cos(ang) * speed;
                        mob.vy = Math.sin(ang) * speed;
                        mob.x += mob.vx; mob.y += mob.vy;
                    } else {
                        // WANDER: Continua a vaguear de forma aleatória se ninguém estiver perto
                        mob.x += mob.vx * 2; mob.y += mob.vy * 2;
                        if(Math.random() < 0.05) { mob.vx = Math.random()*2-1; mob.vy = Math.random()*2-1; }
                    }

                    if(mob.x < 50 || mob.x > inst.w - 50) mob.vx *= -1;
                    if(mob.y < 50 || mob.y > inst.h - 50) mob.vy *= -1;
                }

                // Valida a colisão
                playersInMap.forEach(p => {
                    if (p.imune && Date.now() < p.imune) return;
                    if (Math.hypot(p.x - mob.x, p.y - mob.y) < 40) {
                        this.iniciarCombate(inst, mob, p, ioGlobal, false);
                    }
                });
            });

            inst.baus.forEach(bau => {
                if(bau.looted) return;
                playersInMap.forEach(p => {
                    if (p.imune && Date.now() < p.imune) return;
                    if (Math.hypot(p.x - bau.x, p.y - bau.y) < 40) {
                        bau.looted = true;
                        let a = this.core.alunos[p.id];
                        let goldDrop = Math.floor(Math.random() * 100) + (inst.area * 50);
                        if(a) a.lootTemporario.galeoes += goldDrop;
                        ioGlobal.to(`priv_${p.id}`).emit('forest_msg', { msg: `📦 Abriste um baú! +${goldDrop} G.` });
                    }
                });
            });

            for (let i = 0; i < playersInMap.length; i++) {
                for (let j = i + 1; j < playersInMap.length; j++) {
                    let p1 = playersInMap[i]; let p2 = playersInMap[j];
                    if ((p1.imune && Date.now() < p1.imune) || (p2.imune && Date.now() < p2.imune)) continue;

                    if (Math.hypot(p1.x - p2.x, p1.y - p2.y) < 30) {
                        if (!p1.partyId || p1.partyId !== p2.partyId) {
                            this.iniciarCombate(inst, p2, p1, ioGlobal, true);
                        }
                    }
                }
            }

            let bossMorto = !inst.mobs.some(m => m.isBoss);
            if(bossMorto) inst.portal.ativo = true;

            playersInMap.forEach(p => {
                if (inst.portal.ativo && Math.hypot(p.x - inst.portal.x, p.y - inst.portal.y) < 50) {
                    let a = this.core.alunos[p.id];
                    if(a) {
                        a.pveProgresso.area++;
                        delete inst.jogadores[p.id]; // Remove da instância antiga
                        
                        let novaInst = this.entrarFloresta(a); // Cria/Puxa o jogador para a nova instância
                        
                        // 🔥 Força a sala do Socket.IO a mudar para o novo Andar (Isto resolve a invisibilidade!)
                        if (ioGlobal) {
                            let s = Array.from(ioGlobal.sockets.sockets.values()).find(sock => sock.rooms.has(`priv_${p.id}`));
                            if (s) {
                                s.leave(`forest_${inst.id}`);
                                s.join(`forest_${novaInst.id}`);
                            }
                            ioGlobal.to(`priv_${p.id}`).emit('forest_floor_changed', { newInstId: novaInst.id, area: a.pveProgresso.area });
                            ioGlobal.to(`priv_${p.id}`).emit('forest_msg', { msg: `🌀 Entraste no portal para o Andar ${a.pveProgresso.area}!` });
                        }
                    }
                }
            });
            
            // 🔥 FALTAVA ISTO AQUI PARA FECHAR O LOOP E A FUNÇÃO CORRETAMENTE!
            ioGlobal.to(`forest_${instId}`).emit('forest_sync', inst);
        }
    } // <--- FECHA O tickFloresta

    iniciarCombate(inst, alvo, atacante, ioGlobal, isPvPLocal) {
        atacante.emCombate = true;
        let alunosParty = [atacante];
        if (atacante.partyId) {
            Object.values(inst.jogadores).forEach(aliado => {
                if (aliado.id !== atacante.id && aliado.partyId === atacante.partyId && !aliado.emCombate) {
                    aliado.emCombate = true;
                    alunosParty.push(aliado);
                }
            });
        }

        if (!isPvPLocal) {
            inst.mobs = inst.mobs.filter(m => m.id !== alvo.id);

            const idInst = `dungeon_${crypto.randomBytes(4).toString('hex')}`;
            let entidadeMob = { 
                idx: 0, nome: alvo.nome, hpMax: alvo.hpMax, hpAtual: alvo.hpMax, 
                vivo: true, padrao: alvo.padrao || 'agressivo', elemento: alvo.elemento || 'cinetico' 
            };
            
            this.core.dungeonInstancias[idInst] = { 
                id: idInst, local: 'Floresta', faseAtual: 1, maxFases: 1, mult: 1,
                entidades: [entidadeMob], status: 'combate', 
                membros: alunosParty.map(a => a.id),
                isForestNode: true, forestInstId: inst.id 
            };

            // Inicia a Inteligência Artificial Dinâmica de Combate
            this.core.iniciarIACombate(idInst);

            alunosParty.forEach(p => {
                let s = Array.from(ioGlobal.sockets.sockets.values()).find(sock => sock.rooms.has(`priv_${p.id}`));
                if(s) s.join(idInst);
                ioGlobal.to(`priv_${p.id}`).emit('puxado_para_dungeon', { idInstancia: idInst, estado: { entidades: [entidadeMob] } });
            });
            this.core._salvarBancoDeDados();
        } else {
            alvo.emCombate = true;
            const instIdPvP = `pvp_${crypto.randomBytes(4).toString('hex')}`;
            const a1 = this.core.alunos[atacante.id];
            const a2 = this.core.alunos[alvo.id];

            this.core.pvpPartidas[instIdPvP] = {
                id: instIdPvP,
                p1: { id: a1.id, nome: a1.nome, hpAtual: a1.hpMax, hpMax: a1.hpMax },
                p2: { id: a2.id, nome: a2.nome, hpAtual: a2.hpMax, hpMax: a2.hpMax },
                status: 'jogando',
                isForestInvade: true, forestInstId: inst.id
            };

            ioGlobal.to(`priv_${a1.id}`).emit('pvp_start', { instId: instIdPvP, inimigoNome: a2.nome, maxHpInimigo: a2.hpMax, isInvade: true });
            ioGlobal.to(`priv_${a2.id}`).emit('pvp_start', { instId: instIdPvP, inimigoNome: a1.nome, maxHpInimigo: a1.hpMax, isInvade: true });
        }
    }

    retornarDaBatalha(alunoId, win, isPvP, isForestNode, forestInstId, ioGlobal) {
        if (!isForestNode || !this.instancias) return;
        const a = this.core.alunos[alunoId];
        const inst = this.instancias[forestInstId];
        if (!inst || !a) return;

        if (win) {
            a.estadoJogo = 'FLORESTA'; 
            if (inst.jogadores[a.id]) {
                inst.jogadores[a.id].emCombate = false;
                inst.jogadores[a.id].imune = Date.now() + 4000; 
            }
            ioGlobal.to(`priv_${a.id}`).emit('forest_return_map', { hp: a.hpAtual });
        } else {
            a.estadoJogo = 'CASTELO'; 
            a.lootTemporario = { galeoes: 0, xp: 0, itens: [] };
            delete inst.jogadores[a.id];
            ioGlobal.to(`priv_${a.id}`).emit('forest_dead');
        }
    }

    extrairLootEVaz(aluno) {
        if (aluno.lootTemporario) {
            aluno.galeoes += (aluno.lootTemporario.galeoes || 0);
            this.core.ganharXp(aluno, (aluno.lootTemporario.xp || 0));
            
            if (aluno.lootTemporario.itens && aluno.lootTemporario.itens.length > 0) {
                if (!aluno.inventario.armario) aluno.inventario.armario = [];
                aluno.inventario.armario.push(...aluno.lootTemporario.itens);
            }
            aluno.lootTemporario = { galeoes: 0, xp: 0, itens: [] };
        }
    }
}
module.exports = { HogwartsCore, AstrolabioMagico, RelogioHogwarts, Ollivanders, MotorConscienciaHogwarts, MotorQuadribol, MotorFlorestaProcedural };