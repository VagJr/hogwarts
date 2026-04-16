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
    static obterHorarioAtual() {
        const tempoReal = new Date();
        const minutosPassados = tempoReal.getMinutes();
        const diasSemana = ["Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Fim de Semana"];
        const diaAtual = diasSemana[Math.floor(minutosPassados / 10) % 6]; 
        let horaJogo = Math.floor((minutosPassados % 10) * 2.4); // 0 a 23h
        
        const grade = {
            "Segunda": { manha: { a: "Feitiços", p: "Flitwick", l: "Livro Padrão de Feitiços" }, tarde: { a: "Poções", p: "Snape", l: "Poções Avançadas" } },
            "Terça": { manha: { a: "Transfiguração", p: "McGonagall", l: "Guia de Transfiguração" }, tarde: { a: "Herbologia", p: "Sprout", l: "Mil Ervas Mágicas" } },
            "Quarta": { manha: { a: "D.C.A.T.", p: "Lupin", l: "Forças das Trevas" }, tarde: { a: "Voo", p: "Hooch", l: "Quadribol Através dos Séculos" } },
            "Quinta": { manha: { a: "História da Magia", p: "Binns", l: "História da Magia" }, tarde: { a: "Astronomia", p: "Sinistra", l: "O Céu Noturno" } },
            "Sexta": { manha: { a: "Poções", p: "Snape", l: "Poções Avançadas" }, tarde: { a: "Feitiços", p: "Flitwick", l: "Livro Padrão de Feitiços" } }
        };

        let aulaAtiva = "Livre"; let professorAtivo = "Nenhum"; let requerLivro = null;
        
        if (diaAtual !== "Fim de Semana") {
            if (horaJogo >= 8 && horaJogo < 13) {
                aulaAtiva = grade[diaAtual].manha.a; professorAtivo = grade[diaAtual].manha.p; requerLivro = grade[diaAtual].manha.l;
            } else if (horaJogo >= 14 && horaJogo < 19) {
                aulaAtiva = grade[diaAtual].tarde.a; professorAtivo = grade[diaAtual].tarde.p; requerLivro = grade[diaAtual].tarde.l;
            }
        }

        return { diaAtual, horaJogo: `${horaJogo.toString().padStart(2,'0')}:00`, aulaAtiva, professorAtivo, requerLivro, toqueRecolher: (horaJogo >= 22 || horaJogo < 6) };
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
// SUBSTITUIR TODA A CLASSE MotorQuadribol EM HogwartsCore.js
// ==========================================================
// ==========================================================
// A CLASSE MotorQuadribol CORRIGIDA
// Substitua desde 'class MotorQuadribol {' até ao fecho da classe
// ==========================================================
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
            snitch: { active: false, x: 400, y: 200, timer: 400 }, // Snitch aparece mais cedo
            jogadores: {}, tempoRestante: 3600, status: 'aguardando' 
        };
        return this.partidas[id];
    }

    // PREENCHE A PARTIDA COM BOTS SE FALTAR JOGADORES
    preencherComBots(partida) {
        const posicoes = ['Artilheiro', 'Apanhador', 'Goleiro'];
        ['A', 'B'].forEach(eq => {
            posicoes.forEach(pos => {
                // Verifica se já existe um jogador real nesta posição/equipa
                let existe = Object.values(partida.jogadores).find(j => j.equipa === eq && j.posicao === pos);
                if (!existe) {
                    let botId = `BOT_${eq}_${pos}_${Math.floor(Math.random()*1000)}`;
                    let startX = eq === 'A' ? 200 : 600;
                    let startY = 200 + (Math.random() * 100 - 50);
                    partida.jogadores[botId] = { id: botId, nome: `[IA] ${pos}`, posicao: pos, equipa: eq, x: startX, y: startY, isBot: true, vx: 0, vy: 0 };
                }
            });
        });
    }
    
    processarTick(ioGlobal) {
        let partidasParaDeletar = []; // Coletor de lixo seguro

        for (let pid in this.partidas) {
            let p = this.partidas[pid]; if (p.status !== 'jogando') continue;
            
            p.tempoRestante--; 
            let alguemComPosse = false;
            if(p.bola.cooldownCaptura > 0) p.bola.cooldownCaptura--;

            // FÍSICA E INTELIGÊNCIA ARTIFICIAL DOS BOTS
            for(let idB in p.jogadores) {
                let j = p.jogadores[idB];

                // ---------------------------------
                // CÉREBRO DOS BOTS (IA DE QUADRIBOL)
                // ---------------------------------
                if (j.isBot) {
    let alvoX = j.x; let alvoY = j.y; let velocidadeIA = 0.045; // Bots um pouco mais rápidos

    if (j.posicao === 'Artilheiro') {
        if (p.bola.posse === idB) {
            // TEM A BOLA: Vai para as argolas inimigas
            alvoX = j.equipa === 'A' ? 780 : 20; 
            alvoY = 200; velocidadeIA = 0.055;
            
            // SISTEMA DE EVASÃO: Se um inimigo se aproximar, o bot desvia!
            for (let eId in p.jogadores) {
                let inimi = p.jogadores[eId];
                if (inimi.equipa !== j.equipa && Math.hypot(j.x - inimi.x, j.y - inimi.y) < 90) {
                    alvoY += (j.y > inimi.y) ? 60 : -60; // Foge verticalmente
                    velocidadeIA = 0.07; // Acelera por pânico
                }
            }

            // Chuta se estiver perto
            if (Math.hypot(j.x - alvoX, j.y - alvoY) < 140) {
                p.bola.posse = null; p.bola.cooldownCaptura = 20;
                p.bola.vx = j.equipa === 'A' ? 35 : -35; p.bola.vy = (alvoY - j.y) * 0.15;
                ioGlobal.to(p.id).emit('quadribol_msg', `🤖 O ${j.nome} atirou a Goles!`);
            }
        } else if (!p.bola.posse) {
            // BOLA SOLTA: Vai atrás da bola com jittering (não linear)
            alvoX = p.bola.x + (Math.random()*40-20); alvoY = p.bola.y + (Math.random()*40-20);
        } else if (p.jogadores[p.bola.posse].equipa !== j.equipa) {
            // INIMIGO TEM A BOLA: Tenta intercetar o caminho à frente do inimigo
            let portador = p.jogadores[p.bola.posse];
            alvoX = portador.x + (portador.vx * 10); alvoY = portador.y + (portador.vy * 10);
        } else {
            // ALIADO TEM A BOLA: Posiciona-se para receber passe
            alvoX = j.equipa === 'A' ? j.x + 80 : j.x - 80; alvoY = p.jogadores[p.bola.posse].y + 100;
        }
    }
                    else if (j.posicao === 'Apanhador') {
                        if (p.snitch.active) { alvoX = p.snitch.x; alvoY = p.snitch.y; velocidadeIA = 0.06; } // Acelera
                        else { alvoX = 400 + (Math.random()*400-200); alvoY = 200 + (Math.random()*200-100); velocidadeIA = 0.01; } // Patrulha
                        
                        // IA Apanha o pomo
                        if (p.snitch.active && Math.hypot(j.x - p.snitch.x, j.y - p.snitch.y) < 30) {
                            p.status = 'finalizado'; if (j.equipa === 'A') p.pontosA += 150; else p.pontosB += 150; 
                            ioGlobal.to(p.id).emit('quadribol_fim', { vencedor: p.pontosA > p.pontosB ? p.casaA : p.casaB, snitchApanhado: true }); 
                            delete this.partidas[pid]; continue; // Interrompe o loop da partida
                        }
                    }
                    else if (j.posicao === 'Goleiro') {
                        // Fica na linha do gol seguindo a altura da bola
                        alvoX = j.equipa === 'A' ? 50 : 750;
                        alvoY = Math.max(100, Math.min(300, p.bola.y)); // Segue Y da bola limitando à área
                    }

                    // Aplica vetor de movimento da IA
                    j.vx += (alvoX - j.x) * velocidadeIA; 
                    j.vy += (alvoY - j.y) * velocidadeIA;
                }

                // LIMITADOR DE INÉRCIA GERAL E PAREDES
                j.x = (j.x || 400) + (j.vx || 0); j.y = (j.y || 200) + (j.vy || 0);
                j.x = Math.max(10, Math.min(790, j.x)); j.y = Math.max(10, Math.min(390, j.y));
                if(j.vx) j.vx *= 0.85; if(j.vy) j.vy *= 0.85; 

                // Goleiro - Campo de Força Real
                if (j.posicao === 'Goleiro' && Math.hypot(j.x - p.bola.x, j.y - p.bola.y) < 40) {
                    if(p.bola.x < 150 || p.bola.x > 650) { // Só defende se estiver na área de perigo
                        p.bola.vx *= -1.5; 
                        if(!j.isBot) ioGlobal.to(p.id).emit('quadribol_msg', `🛡️ Grande defesa de ${j.nome}!`);
                    }
                }

                // Lógica de Posse e Roubo (Colisão corpo-a-corpo)
                // Lógica de Posse e Roubo
if (p.bola.posse === idB) {
    p.bola.x = j.x; p.bola.y = j.y + 15; p.bola.vx = 0; p.bola.vy = 0;
    alguemComPosse = true;

    for (let eId in p.jogadores) {
        let inimigo = p.jogadores[eId];
        // Hitbox de roubo maior (40px)
        if (inimigo.equipa !== j.equipa && Math.hypot(j.x - inimigo.x, j.y - inimigo.y) < 40) {
            // Humanos têm 70% de chance de roubar bots. Bots têm 30% de chance de roubar humanos.
            let chanceRoubo = (!inimigo.isBot && j.isBot) ? 0.7 : 0.3; 
            if (Math.random() < chanceRoubo) { 
                p.bola.posse = eId;
                p.bola.cooldownCaptura = 15;
                ioGlobal.to(p.id).emit('quadribol_msg', `💥 ${inimigo.nome} roubou a Goles brutalmente!`);
                break;
            } else {
                inimigo.vx = (inimigo.x - j.x)*0.8; inimigo.vy = (inimigo.y - j.y)*0.8; // Respinga forte
            }
        }
    }
}
            } // Fim Loop Jogadores

            // Magnetismo da Goles
            if (!alguemComPosse && p.bola.cooldownCaptura <= 0) {
                for(let idB in p.jogadores) {
                    let j = p.jogadores[idB];
                    if (Math.hypot(j.x - p.bola.x, j.y - p.bola.y) < 30 && j.posicao === 'Artilheiro') { 
                        p.bola.posse = idB; 
                        if(!j.isBot) ioGlobal.to(p.id).emit('quadribol_msg', `🧹 ${j.nome} dominou a Goles!`);
                        break; 
                    }
                }
            }

            // Física da Bola
            if (!alguemComPosse) {
                p.bola.x += p.bola.vx; p.bola.y += p.bola.vy;
                p.bola.vx *= 0.95; p.bola.vy *= 0.95;
                
                // LIMITADOR DE VELOCIDADE DA BOLA (Impede que a bola bugue e quebre o tamanho)
                p.bola.vx = Math.max(-30, Math.min(30, p.bola.vx));
                p.bola.vy = Math.max(-30, Math.min(30, p.bola.vy));

                if (p.bola.y < 10 || p.bola.y > 390) p.bola.vy *= -1;
                if (p.bola.x < 10 || p.bola.x > 790) p.bola.vx *= -1;
            }
            // GOLOS (Argolas posicionadas em Y entre 100 e 300)
            if (p.bola.x <= 40 && p.bola.y > 100 && p.bola.y < 300) { p.pontosB += 10; p.bola.posse = null; p.bola.x = 400; p.bola.y = 200; p.bola.vx = 0; p.bola.vy = 0; ioGlobal.to(p.id).emit('quadribol_msg', `GOLO DE ${p.casaB.toUpperCase()}!`); }
            if (p.bola.x >= 760 && p.bola.y > 100 && p.bola.y < 300) { p.pontosA += 10; p.bola.posse = null; p.bola.x = 400; p.bola.y = 200; p.bola.vx = 0; p.bola.vy = 0; ioGlobal.to(p.id).emit('quadribol_msg', `GOLO DE ${p.casaA.toUpperCase()}!`); }

            // Pomo de Ouro (Aparece Aleatoriamente)
            p.snitch.timer--;
            if (p.snitch.timer <= 0) {
                if (!p.snitch.active) { p.snitch.active = true; p.snitch.timer = 1200; p.snitch.x = Math.random()*700+50; p.snitch.y = Math.random()*300+50; ioGlobal.to(p.id).emit('quadribol_msg', `✨ O POMO DE OURO FOI AVISTADO!`); }
                else { p.snitch.active = false; p.snitch.timer = Math.floor(Math.random()*1000)+500; ioGlobal.to(p.id).emit('quadribol_msg', `O Pomo desapareceu...`);}
            } else if (p.snitch.active) {
                p.snitch.x += (Math.random()-0.5)*15; p.snitch.y += (Math.random()-0.5)*15;
                p.snitch.x = Math.max(20, Math.min(780, p.snitch.x)); p.snitch.y = Math.max(20, Math.min(380, p.snitch.y));
                
                // IA apanha o pomo e finaliza de forma segura
                for(let idB in p.jogadores) {
                    let j = p.jogadores[idB];
                    if (j.posicao === 'Apanhador' && Math.hypot(j.x - p.snitch.x, j.y - p.snitch.y) < 30) {
                        p.status = 'finalizado'; if (j.equipa === 'A') p.pontosA += 150; else p.pontosB += 150; 
                        ioGlobal.to(p.id).emit('quadribol_fim', { vencedor: p.pontosA > p.pontosB ? p.casaA : p.casaB, snitchApanhado: true }); 
                        partidasParaDeletar.push(pid);
                        break; // Sai do loop de jogadores
                    }
                }
            }

            if (p.status === 'finalizado') continue; // Previne o resto do loop se a partida acabou

            if (p.tempoRestante <= 0) { 
                p.status = 'finalizado'; ioGlobal.to(p.id).emit('quadribol_fim', { vencedor: p.pontosA > p.pontosB ? p.casaA : p.casaB }); 
                partidasParaDeletar.push(pid); 
            } else { 
                ioGlobal.to(p.id).emit('quadribol_update', p); 
            }
        } // Fim do loop 'for (let pid in this.partidas)'

        // LIMPEZA SEGURA NO FINAL DO TICK (Evita o Erro de Crash no Node.js)
        partidasParaDeletar.forEach(id => {
            let p = this.partidas[id];
            for(let jId in p.jogadores) {
                let j = p.jogadores[jId];
                if(!j.isBot && global.coreInstance) {
                    let casaVencedora = p.pontosA > p.pontosB ? p.casaA : p.casaB;
                    let casaDesteJogador = j.equipa === 'A' ? p.casaA : p.casaB;
                    if (casaVencedora === casaDesteJogador) {
                        global.coreInstance._progressoQuest(global.coreInstance.alunos[j.id], 'quadribol', 'vitoria', 1);
                    }
                }
            }
            delete this.partidas[id];
        });
    } // Fim da função processarTick

    // Ação do jogador também precisa proteger o delete
    acaoJogador(partidaId, alunoId, actionData) {
        const p = this.partidas[partidaId]; if (!p || p.status !== 'jogando') return;
        const j = p.jogadores[alunoId]; if (!j) return;

        if (actionData.vX !== undefined && actionData.vY !== undefined) {
            j.vx = actionData.vX * 14; j.vy = actionData.vY * 14;
        }

        if (actionData.acao === 'chutar' && p.bola.posse === alunoId) {
            p.bola.posse = null; p.bola.cooldownCaptura = 20; 
            p.bola.vx = j.equipa === 'A' ? 35 : -35; p.bola.vy = (Math.random() * 10) - 5;
            global.io.to(p.id).emit('quadribol_msg', `☄️ ${j.nome} lançou a Goles com força extrema!`);
        }

        if (actionData.acao === 'apanhar_pomo' && p.snitch.active && j.posicao === 'Apanhador') {
            if (Math.hypot(j.x - p.snitch.x, j.y - p.snitch.y) < 50) {
                p.status = 'finalizado'; if (j.equipa === 'A') p.pontosA += 150; else p.pontosB += 150; 
                global.io.to(p.id).emit('quadribol_fim', { vencedor: p.pontosA > p.pontosB ? p.casaA : p.casaB, snitchApanhado: true }); 
                // Apenas muda o status. O loop tick apagará com segurança no próximo quadro.
            }
        }
    }
}
class MotorConscienciaHogwarts {
    constructor() {
        this.apiKey = process.env.GROQ_API_KEY || "";
        if (this.apiKey) this.groq = new Groq({ apiKey: this.apiKey });
		this.iaBloqueadaAte = 0; // NOVA VARIÁVEL
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
async gerarLivroCompleto(alunoNome, assunto, estilo) {
        const prompt = `És o bibliotecário de Hogwarts. Escreve um capítulo de um livro de lore sobre "${assunto}". 
        O estilo deve ser "${estilo}". O autor fictício é "${alunoNome}".
        Retorna um JSON com o título e o conteúdo formatado (máximo 4 parágrafos).
        JSON: {"titulo": "...", "conteúdo": "..."}`;

        try {
            const res = await this.groq.chat.completions.create({
                messages: [{ role: "user", content: prompt }],
                model: "llama-3.1-8b-instant",
                response_format: { type: "json_object" }
            });
            const p = this._extrairJSONBlindado(res.choices[0].message.content);
            if (!p) throw new Error("JSON Parse Error");
            return p;
        } catch (e) { return null; }
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
        }`;
        
        try {
            const res = await this.groq.chat.completions.create({ messages: [{ role: "user", content: prompt }], model: "llama-3.1-8b-instant", response_format: { type: "json_object" } });
            return this._extrairJSONBlindado(res.choices[0].message.content);
        } catch (e) { return { aprovado: false, feedback: "Falha na conexão astral." }; }
    }

	async folhearLivroAula(materia, livro) {
        if (!this.apiKey) return { texto: "As letras fogem dos teus olhos." };
        try {
            const prompt = `Escreve um excerto real e detalhado do livro mágico "${livro}" da disciplina de ${materia} em Hogwarts. 
            OBRIGATÓRIO RESPONDER APENAS NO FORMATO JSON ABAIXO, SEM MAIS NENHUM TEXTO:
            {"texto": "O parágrafo do livro começa aqui..."}`;
            
            const res = await this.groq.chat.completions.create({ 
                messages: [{ role: "user", content: prompt }], 
                model: "llama-3.1-8b-instant",
                response_format: { type: "json_object" } 
            });
            
            return this._extrairJSONBlindado(res.choices[0].message.content) || { texto: "Página rasgada." };
        } catch(e) { 
            console.error("Erro na IA Folhear:", e);
            return { texto: "O livro trancou as suas páginas." }; 
        }
    }

    async respostaProfessorIA(professor, materia, alunoNome, mensagem, casa) {
        if (!this.apiKey) return null;
        try {
            const prompt = `És o Professor ${professor} de ${materia} em Hogwarts. O aluno ${alunoNome} da casa ${casa} disse-te isto na aula: "${mensagem}". 
            Avalia a frase. Se for correta ou fizer sentido, elogia e dá 10 XP (escreve "+10 XP" no texto). Se for asneira, retira 5 pontos à casa.
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
            Para "coleta", o alvo deve ser (exato): asfodelo, bezoar, mandragora, ditamno ou muco.
            Para "pve", o alvo deve ser: aranha, basilisco ou dementador.
            Para "quadribol", o alvo é: vitoria.
            RETORNE SÓ JSON ESTRITO E VÁLIDO:
            {
                "titulo": "A Ameaça das Aranhas",
                "lore": "Hagrid relatou que há aranhas a solta...",
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
        try {
            const prompt = `És a enciclopédia definitiva de Harry Potter. O aluno procurou ler sobre: "${assunto}".
            Escreve o conteúdo de um livro histórico oficial de Hogwarts com profundidade extrema, detalhando as origens, os usos e os perigos do tema.
            RETORNA APENAS O JSON, SEM NADA ANTES OU DEPOIS:
            {"titulo": "A História Oculta de...", "texto": "Há séculos atrás..."}`;
            const res = await this.groq.chat.completions.create({ messages: [{ role: "user", content: prompt }], model: "llama-3.1-8b-instant" });
            return this._extrairJSONBlindado(res.choices[0].message.content) || { titulo: "Tomo Esquecido", texto: "O livro desfaz-se em pó." };
        } catch(e) { return { titulo: "Tomo Selado", texto: "Protegido por magia antiga." }; }
    }

    async folhearLivro(alunoId) {
        const a = this.alunos[alunoId]; if (!a || a.focoAtual < 1) return { erro: "Foco Insuficiente (Requer 1)." };
        const relogio = RelogioHogwarts.obterHorarioAtual();
        if (relogio.aulaAtiva === "Livre") return { erro: "A sala está vazia. Não há livros na tua mesa." };
        
        a.focoAtual -= 1;
        const lido = await this.cerebroIA.folhearLivroAula(relogio.aulaAtiva, relogio.requerLivro || "Tomo Antigo");
        
        // 🔥 CORREÇÃO: Chamada correta ao novo sistema assíncrono de XP
        await this._addXp(a, 25);
        this._salvarBancoDeDados();
        
        return { sucesso: true, texto: lido.texto };
    }
	
	async gerarQuizIA() {
        if (!this.apiKey) return { pergunta: "A magia é real?", opcoes: ["Sim", "Não", "Talvez", "Sempre"], correta: 0 };
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
                response_format: { type: "json_object" } // 🔥 GARANTE O JSON!
            });
            const dados = this._extrairJSONBlindado(res.choices[0].message.content);
            if(dados && dados.opcoes && Array.isArray(dados.opcoes)) {
                return dados;
            }
            throw new Error("Formato inválido da IA.");
        } catch(e) { 
            return { pergunta: "Qual a cor do céu encantado de Hogwarts à noite?", opcoes: ["Azul", "Preto Estrelado", "Vermelho", "Verde"], correta: 1 }; 
        }
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
        try {
            const prompt = `És a magia onipresente do castelo de Hogwarts, controlando os fantasmas, quadros e o próprio ambiente. O aluno ${jogadorNome} (${casa}) disse em "${zona}": "${mensagemTexto}".
            Responde como um habitante local (Fantasma, Quadro, etc). 
            
            NOVA REGRA DE MATERIALIZAÇÃO:
            - Se o aluno te pedir para invocar um inimigo, para treinar, ou se o contexto justificar um ataque (ex: "Quero lutar!", "Traz-me um trasgo"), preenche "spawnMob" com o nome da criatura.
            - Se o aluno pedir ajuda para encontrar um objeto, ou se a conversa levar a uma recompensa material, preenche "spawnItem" com o nome do objeto (ex: "Tomo Esquecido", "Sapo de Chocolate").
            - Se for apenas uma conversa normal, deixa spawnMob e spawnItem como nulos.

            RETORNA APENAS JSON ESTRITO: 
            {
                "personagem": "Nick Quase Sem Cabeça", 
                "texto": "Ah, jovem! Queres provar o teu valor? Então enfrenta esta besta que acabou de sair das sombras!", 
                "pontos": 0,
                "spawnMob": "Trasgo Montanhês Furioso",
                "spawnItem": null
            }`;
            
            const res = await this.groq.chat.completions.create({ 
                messages: [{ role: "user", content: prompt }], 
                model: "llama-3.1-8b-instant",
                response_format: { type: "json_object" }
            });
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

    async gerarAtmosferaLocal(zona) {
        if (!this.apiKey) return "As tochas cintilam suavemente na pedra fria.";
        try {
            const prompt = `Age como J.K. Rowling. Cria UMA FRASE curta, inédita e altamente imersiva descrevendo o que está a acontecer AGORA em "${zona}" no Castelo de Hogwarts. Descreve cheiros, sons distantes, o clima nas janelas, fantasmas passando ou alunos ao fundo. NUNCA REPITA.`;
            const res = await this.groq.chat.completions.create({ messages: [{ role: "user", content: prompt }], model: "llama-3.1-8b-instant", temperature: 1.0 });
            return res.choices[0].message.content.replace(/["']/g, '').trim();
        } catch(e) { return null; }
    }
}// <--- Fecho da classe MotorConscienciaHogwarts

class HogwartsCore {
    constructor() {
        this.alunos = {}; 
        this.gremios = {}; 
        this.parties = {};
        this.grupos = {};
        this.pontuacaoCasas = { Gryffindor: 0, Slytherin: 0, Ravenclaw: 0, Hufflepuff: 0, lider: 'Empate' };
        
        this.lojasBeco = {
            floreios: [ 
                { id: "l_1", nome: "Livro Padrão de Feitiços", tipo: "livro", preco: 20 }, 
                { id: "l_2", nome: "Poções Avançadas", tipo: "livro", preco: 50 }, 
                { id: "l_3", nome: "Forças das Trevas", tipo: "livro", preco: 50 }, 
                { id: "l_4", nome: "Guia de Transfiguração", tipo: "livro", preco: 40 },
                { id: "l_5", nome: "Mil Ervas Mágicas", tipo: "livro", preco: 30 },
                { id: "l_6", nome: "Quadribol Através dos Séculos", tipo: "livro", preco: 30 },
                { id: "l_7", nome: "História da Magia", tipo: "livro", preco: 40 },
                { id: "l_8", nome: "O Céu Noturno", tipo: "livro", preco: 40 }
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

        this.livroDeFeiticos = {
            'expelliarmus': { nome: "Expelliarmus", tipoMecanica: 'ataque', elemento: 'cinetico', custoFocoBase: 2, poderBase: 80, lore: "Desarma o oponente.", visualConfig: { shape: 'bolt', color: '#ff4040', glow: '#ff0000', quantity: 1, trailSize: 15 } },
            'incendio': { nome: "Incendio", tipoMecanica: 'ataque', elemento: 'fogo', custoFocoBase: 4, poderBase: 120, lore: "Lança chamas.", visualConfig: { shape: 'wave', color: '#ff4500', glow: '#ff8800', quantity: 3, trailSize: 8 } },
            'protego': { nome: "Protego", tipoMecanica: 'escudo', elemento: 'escudo', custoFocoBase: 2, poderBase: 0, defende: true, lore: "Escudo instantâneo.", visualConfig: { shape: 'sphere', color: '#3498db' } },
            'stupefy': { nome: "Estupefaça", tipoMecanica: 'ataque', elemento: 'cinetico', custoFocoBase: 3, poderBase: 100, lore: "Atordoa o alvo.", visualConfig: { shape: 'sphere', color: '#e74c3c', glow: '#ff0000', quantity: 1, trailSize: 20 } },
            'sectumsempra': { nome: "Sectumsempra", tipoMecanica: 'ataque', elemento: 'trevas', custoFocoBase: 6, poderBase: 200, lore: "Cortes profundos.", visualConfig: { shape: 'slash', color: '#ffffff', glow: '#888888', quantity: 2, trailSize: 5 } },
            'aguamenti': { nome: "Aguamenti", tipoMecanica: 'ataque', elemento: 'agua', custoFocoBase: 3, poderBase: 90, lore: "Jato de água.", visualConfig: { shape: 'wave', color: '#0f3c55', glow: '#3498db', quantity: 5, trailSize: 15 } },
            'crucio': { nome: "Crucio", tipoMecanica: 'status', elemento: 'trevas', custoFocoBase: 8, poderBase: 300, lore: "Maldição da Tortura.", visualConfig: { shape: 'bolt', color: '#8e44ad', glow: '#4b0082', quantity: 3, trailSize: 25 } },
            'expecto_patronum': { nome: "Expecto Patronum", tipoMecanica: 'ataque', elemento: 'luz', custoFocoBase: 10, poderBase: 400, lore: "O feitiço protetor.", visualConfig: { shape: 'sphere', color: '#ffffff', glow: '#a8d5ff', quantity: 1, trailSize: 30 } }
        };

        this.receitasPocoes = {
            'wiggenweld': { nome: 'Poção Wiggenweld', ingredientes: ['ditamno', 'muco'], cura: 500, visual: { corPrincipal: "#0f5", tipo: "pocao" } },
            'antidoto': { nome: 'Antídoto Universal', ingredientes: ['bezoar', 'ditamno'], cura: 200, visual: { corPrincipal: "#fff", tipo: "pocao" } },
            'restauradora': { nome: 'Poção Restauradora', ingredientes: ['mandragora', 'asfodelo'], cura: 1000, visual: { corPrincipal: "#8b4513", tipo: "pocao" } }
        };

        this._salvarBancoDeDados = () => {}; 
    }

    // 🔥 O SEGREDO DO MUNDO ABERTO (Adicione este método na mesma classe HogwartsCore)
    processarCicloMundoVivo() {
        const zonaSorteada = this.listaZonas[Math.floor(Math.random() * this.listaZonas.length)];
        const sala = this.zonasVivas[zonaSorteada];

        // 25% de chance de spawnar algo na zona a cada "tick"
        if (Math.random() < 0.25) {
            if (Math.random() < 0.40 && sala.entidades.length < 3) {
                const mob = this._gerarMonstroRapido(400, zonaSorteada, false);
                const idEv = `mob_${Date.now()}`;
                sala.entidades.push({ id: idEv, ...mob, tipo: 'combate' });
                if (global.io) global.io.to(`zona_${zonaSorteada}`).emit('mmo_world_update', sala);
            } else if (sala.itens.length < 5) {
                const itens = ["Saco de Galeões", "Erva Mágica Estranha", "Pergaminho Perdido"];
                const item = { id: `itm_${Date.now()}`, nome: itens[Math.floor(Math.random()*itens.length)], tipo: 'coleta' };
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
        // 🔥 PATCH RETROATIVO: ELOs e Estufa para todos os jogadores
        if (!aluno.estufa) {
            aluno.estufa = [ { id: 1, plantada: false }, { id: 2, plantada: false }, { id: 3, plantada: false } ];
        }
        if (!aluno.elos) {
            aluno.elos = {
                duelos: (aluno.estatisticas && aluno.estatisticas.eloPvP) ? aluno.estatisticas.eloPvP : 1000,
                quadribol: (aluno.estatisticas && aluno.estatisticas.eloQuadribol) ? aluno.estatisticas.eloQuadribol : 1000,
                baile: 1000, quiz: 1000, pocoes: 1000, sabedoria: 1000
            };
            this._salvarBancoDeDados();
        }

        let base = { feiticos: 10, defesa: 10, pocoes: 10, transfiguracao: 10, furtividade: 10, artes_trevas: 5 };
        if (aluno.atributos) { for (let a in base) base[a] += Number(aluno.atributos[a]) || 0; }
        if (aluno.equipamentos && aluno.equipamentos.varinha) {
            let v = aluno.equipamentos.varinha;
            if (base[v.afinidade] !== undefined) base[v.afinidade] += Math.floor((v.poderBase || 10) * (1 + ((v.lealdade || 0) / 100)));
        }
        aluno.hpMax = Math.floor(1000 + (base.defesa * 100) + (aluno.nivel * 150));
        aluno.maxFoco = Math.floor(10 + (base.transfiguracao * 0.5) + (aluno.nivel / 2));
        if (aluno.focoAtual > aluno.maxFoco) aluno.focoAtual = aluno.maxFoco;
        aluno.atributosTotais = base; aluno.centelhaArcana = Lexicon.CalcularCentelhaArcana(aluno); return base;
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
            lifeSkills: { herbologia: 1, magizoologia: 1, encantamentos: 1 },
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
        const relogio = RelogioHogwarts.obterHorarioAtual();
        if (relogio.aulaAtiva === "Livre") return { erro: "Não há aulas neste momento." };
        
        a.focoAtual -= 2;
        
        // A IA inicia uma aula dinâmica no chat e exige que os alunos interajam
        const prompt = `És o Professor ${relogio.professorAtivo} de ${relogio.aulaAtiva}. O aluno ${a.nome} prestou atenção.
        Inicia a tua aula. Fala sobre um feitiço ou criatura. Termina fazendo UMA pergunta direta para os alunos responderem no chat! Mantém a tua personalidade canónica.`;
        
        try {
            const res = await this.cerebroIA.groq.chat.completions.create({ messages: [{ role: "user", content: prompt }], model: "llama-3.1-8b-instant" });
            let fala = res.choices[0].message.content.trim();
            
            global.io.to('sala_de_aula').emit('nova_mensagem', { canal: 'aula', autor: `🎓 [Prof. ${relogio.professorAtivo}]`, texto: fala });
            await this._addXp(a, 30); this._salvarBancoDeDados();
            return { sucesso: true, msg: "A Aula Iniciou-se! Presta atenção no chat do Professor." };
        } catch(e) { return { erro: "O professor ainda não chegou." }; }
    }

    // Em MotorConscienciaHogwarts
    async respostaProfessorIA(professor, materia, alunoNome, mensagem, casa) {
        if (!this.apiKey) return null;
        try {
            const prompt = `Prof ${professor} de ${materia}. O aluno ${alunoNome} (${casa}) disse na aula: "${mensagem}". 
            Avalia o que ele disse como sendo uma resposta à matéria. Se estiver correto, elogia e dá 10 XP (escreve "+10 XP" no texto). Se for asneira, retira 5 pontos à casa.
            Responde no tom de ${professor}.
            JSON ESTRITO: {"texto": "Exato senhor ${alunoNome}! Mais 10 XP para si...", "pontos": 10}`;
            const res = await this.groq.chat.completions.create({ messages: [{ role: "user", content: prompt }], model: "llama-3.1-8b-instant", response_format: {type: "json_object"} });
            return this._extrairJSONBlindado(res.choices[0].message.content);
        } catch(e) { return null; }
    }

async processarActionCombat(atacanteId, instId, feiticoId, alvoIdx = 0) {
        const a = this.alunos[atacanteId]; 
        const inst = this.dungeonInstancias[instId];
        if (!a || !inst || inst.status !== 'combate') return { erro: "Combate encerrado." };

        if (feiticoId === "dano_recebido" || feiticoId === "protego_block_reflex") {
            return { sucesso: true, relatoAcao: "Impacto registado." };
        }

        const feitico = this.livroDeFeiticos[feiticoId];
        if (!feitico) return { erro: "Feitiço desconhecido." };

        // 🔥 SISTEMA DE PROFICIÊNCIA (MAESTRIA)
        if(!a.maestriaFeiticos[feiticoId]) a.maestriaFeiticos[feiticoId] = { nivel: 1, exp: 0, expProx: 100 };
        let maestria = a.maestriaFeiticos[feiticoId];
        
        // Dá XP por usar a magia no combate!
        maestria.exp += 15;
        let upouFeitico = false;
        if(maestria.exp >= maestria.expProx) {
            maestria.nivel++;
            maestria.exp -= maestria.expProx;
            maestria.expProx = Math.floor(maestria.expProx * 1.5);
            upouFeitico = true;
        }

        let mecanica = feitico.tipoMecanica || (feitico.defende ? 'escudo' : 'ataque');
        
        // 🔥 APLICAR O UPGRADE AO VALOR DO FEITIÇO (+10 pontos de poder por nível do feitiço)
        let bonusMaestria = (maestria.nivel - 1) * 10;
        let forcaDoFeitico = Number(feitico.valorBase || feitico.poderBase || 50) + bonusMaestria;
        
        let relatoAcao = "";

        // ===============================================
        // LÓGICA 1: CURA
        // ===============================================
        if (mecanica === 'cura') {
            let curaAplicada = forcaDoFeitico + ((a.atributosTotais.pocoes || 5) * 5);
            a.hpAtual = Math.min(a.hpMax, a.hpAtual + curaAplicada);
            relatoAcao = `Lançaste ${feitico.nome} e recuperaste ${curaAplicada} HP!`;
            
            this._salvarBancoDeDados();
            return { sucesso: true, hpJogador: a.hpAtual, cura: curaAplicada, relatoAcao, bossMorto: false, entidades: inst.entidades, upouFeitico, nomeFeiticoUpado: feitico.nome, novoNivelFeitico: maestria.nivel };
        } 
        
        // ===============================================
        // LÓGICA 2: ESCUDO
        // ===============================================
        if (mecanica === 'escudo' || mecanica === 'defesa') {
            relatoAcao = `A barreira de ${feitico.nome} protege-te!`;
            this._salvarBancoDeDados();
            return { sucesso: true, relatoAcao, bossMorto: false, entidades: inst.entidades, upouFeitico, nomeFeiticoUpado: feitico.nome, novoNivelFeitico: maestria.nivel };
        }

        // ===============================================
        // LÓGICA 3: ATAQUE E STATUS
        // ===============================================
        let mob = inst.entidades.find(m => m.idx === alvoIdx && m.vivo) || inst.entidades.find(m => m.vivo);
        if(!mob) return { erro: "Sem alvos vivos." };

        let danoAplicado = forcaDoFeitico + ((a.atributosTotais.feiticos || 5) * 5);
        let defendeu = false;

        if (mecanica === 'status') {
            danoAplicado = Math.floor(danoAplicado * 0.8);
            mob.padrao = 'vulneravel';
            relatoAcao = `O ${feitico.nome} quebrou a defesa do inimigo!`;
        } else {
            relatoAcao = `O teu ${feitico.nome} atingiu o alvo!`;
        }

        if(mob.padrao === 'defensivo') {
            danoAplicado = Math.floor(danoAplicado * 0.6);
            defendeu = true;
        }

        let critico = Math.random() > 0.85;
        if(critico) danoAplicado = Math.floor(danoAplicado * 1.5);

        mob.hpAtual -= Math.floor(danoAplicado);

        if (mob.hpAtual <= 0) {
            mob.vivo = false; mob.hpAtual = 0;
            let todosMortos = inst.entidades.every(m => !m.vivo);

            if(todosMortos) {
                let isBoss = (inst.faseAtual === inst.maxFases);
                let xpFase = isBoss ? 1500 : 400 * inst.entidades.length;
                let galeoesFase = isBoss ? 800 : 100 * inst.entidades.length;

                await this._addXp(a, xpFase); a.galeoes += galeoesFase; 
                if(!a.estatisticas) a.estatisticas = { monstrosMortos: 0 };
                a.estatisticas.monstrosMortos += inst.entidades.length;
                try { this._progressoQuest(a, 'pve', mob.nome, 1); } catch(ex){}

                if (inst.faseAtual < inst.maxFases) {
                    inst.faseAtual++;
                    let maxMobs = (a.pveProgresso && a.pveProgresso.nivel >= 2) ? 2 : 1;
                    let proxMobs = inst.faseAtual === inst.maxFases ? 1 : Math.floor(Math.random() * maxMobs) + 1;
                    let novasEntidades = [];
                    let mData = await this.cerebroIA.gerarMonstroProcedural(mob.hpMax * 1.3, inst.local, (inst.faseAtual === inst.maxFases), a.nivel);
                    for(let i=0; i<proxMobs; i++) {
                        novasEntidades.push({ idx: i, nome: (proxMobs > 1 ? `${mData.nome} [${i+1}]` : mData.nome), hpMax: mData.hp, hpAtual: mData.hp, vivo: true, padrao: ['agressivo', 'tanque'][Math.floor(Math.random()*2)] });
                    }
                    inst.entidades = novasEntidades; this._salvarBancoDeDados();
                    return { novaFase: true, faseAtual: inst.faseAtual, relatoAcao: `Onda aniquilada! [+${xpFase} XP].`, entidades: novasEntidades, hpBoss: novasEntidades[0].hpAtual, danoAplicado, alvoMorto: mob.idx, upouFeitico, nomeFeiticoUpado: feitico.nome, novoNivelFeitico: maestria.nivel };
                } else {
                    inst.status = 'finalizado'; clearInterval(inst.timerBossAtaque);
                    if(!a.pveProgresso) a.pveProgresso = { area: 1, nivel: 1 };
                    a.pveProgresso.area++; if (a.pveProgresso.area > 5) { a.pveProgresso.area = 1; a.pveProgresso.nivel++; }
                    this._salvarBancoDeDados();
                    return { bossMorto: true, relatoAcao: `Área Purificada! [+${xpFase} XP]`, hpBoss: 0, danoAplicado, alvoMorto: mob.idx, upouFeitico, nomeFeiticoUpado: feitico.nome, novoNivelFeitico: maestria.nivel };
                }
            } else {
                this._salvarBancoDeDados();
                return { mobEliminado: true, relatoAcao: `${mob.nome} caiu!`, entidades: inst.entidades, hpBoss: 0, danoAplicado, alvoMorto: mob.idx, upouFeitico, nomeFeiticoUpado: feitico.nome, novoNivelFeitico: maestria.nivel };
            }
        }

        this._salvarBancoDeDados();
        return { bossMorto: false, entidades: inst.entidades, hpBoss: mob.hpAtual, danoAplicado, defendeu, relatoAcao, upouFeitico, nomeFeiticoUpado: feitico.nome, novoNivelFeitico: maestria.nivel };
    }

    async folhearLivro(alunoId) {
        const a = this.alunos[alunoId]; if (!a || a.focoAtual < 1) return { erro: "Foco Insuficiente (Requer 1)." };
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
	
	entrarQuadribol(alunoId, posicao) {
        const a = this.alunos[alunoId]; if(!a) return { erro: "Fantasma." };
        let match = Object.values(this.quadribol.partidas).find(p => p.status === 'aguardando');
        if (!match) match = this.quadribol.iniciarPartida('Gryffindor', 'Slytherin'); 
        
        let equipa = match.casaA === a.casa ? 'A' : 'B';
        let startX = equipa === 'A' ? 200 : 600; let startY = 200 + (Math.random() * 50 - 25);

        match.jogadores[a.id] = { id: a.id, nome: a.nome, posicao, equipa, x: startX, y: startY, isBot: false };
        
        // SE FOR O PRIMEIRO JOGADOR, PREENCHE O RESTO DO CAMPO COM IAs
        if (Object.keys(match.jogadores).length === 1) {
            this.quadribol.preencherComBots(match);
        }

        match.status = 'jogando';
        return { sucesso: true, matchId: match.id, msg: `Entraste em campo!` };
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
        this._verificarAvancoBeco(a); return { sucesso: true, varinha: a.equipamentos.varinha };
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
        // Blindagem contra variáveis vazias
        let temLivros = (aluno.inventario && aluno.inventario.livros) ? aluno.inventario.livros.length >= 3 : false; 
        let temVeste = (aluno.equipamentos && aluno.equipamentos.veste !== null);
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
        
        const item = a.mochilaEscolar[idx];
        a.mochilaEscolar.splice(idx, 1); // Retira da mochila
        
        const ofertaId = crypto.randomBytes(4).toString('hex');
        if(!this.mercadoJogadores) this.mercadoJogadores = [];
        this.mercadoJogadores.push({ id: ofertaId, vendedorId: a.id, vendedorNome: a.nome, item: item, preco: Number(preco), data: Date.now() });
        this._salvarBancoDeDados();
        return {sucesso: true, msg: "A tua coruja partiu com a oferta para o Mercado Global!"};
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
            a.hpAtual = a.hpMax; a.focoAtual = a.maxFoco;
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
                this._addXp(a, 100); this._salvarBancoDeDados();
                return { sucesso: true, msg: `Engarrafaste a brilhante [${r.nome}]!` };
            }
        }
        
        // 2. Se não for receita conhecida, a IA tenta descobrir uma nova poção infinita!
        const pocaoIA = await this.cerebroIA.tentarDescobrirPocao(ingredientesUsados);
        if (pocaoIA && pocaoIA.sucesso) {
            ingredientesUsados.forEach(i => { a.inventario.ingredientes[i] -= 1; });
            a.mochilaEscolar.push({ id: crypto.randomBytes(4).toString('hex'), nome: pocaoIA.nome, tipo: 'pocao_feita', visual: pocaoIA.visual });
            
            // Salva a nova receita globalmente para o jogo evoluir!
            let novaChave = pocaoIA.nome.toLowerCase().replace(/ /g, '_');
            this.receitasPocoes[novaChave] = { nome: pocaoIA.nome, ingredientes: ingredientesUsados, cura: pocaoIA.cura || 500, visual: pocaoIA.visual };
            
            // 🔥 MMO SOCIAL: AVISA O SERVIDOR INTEIRO DA DESCOBERTA!
            global.io.emit('nova_mensagem', { canal: 'salaoPrincipal', autor: '🧪 O Alquimista', texto: `Notícia Extraordinária! O bruxo ${a.nome} acabou de inventar uma poção inédita: [${pocaoIA.nome}]!` });
            
            this._addXp(a, 300); this._salvarBancoDeDados();
            return { sucesso: true, msg: `🧪 INCRÍVEL! Descobriste uma receita inédita: [${pocaoIA.nome}]!` };
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
    
    _gerarMonstroRapido(hpBase, local, isBoss) {
        const nomesBoss = ["Basilisco Sombrio", "Acromântula Rainha", "Dementador Ancião", "Trasgo Feroz", "Lobisomem Alfa"];
        const nomesNormal = ["Aranha Venenosa", "Lobisomem Menor", "Esqueleto Amaldiçoado", "Espírito das Trevas", "Trasgo Jovem"];
        let nomeFinal = isBoss ? nomesBoss[Math.floor(Math.random() * nomesBoss.length)] : nomesNormal[Math.floor(Math.random() * nomesNormal.length)];
        
        // Padrões de IA que geram mecânicas diferentes no Frontend
        const padroes = ['agressivo', 'defensivo', 'tanque', 'venenoso'];
        
        return { 
            nome: nomeFinal, 
            hpMax: Math.floor(hpBase), 
            hpAtual: Math.floor(hpBase), 
            vivo: true, 
            padrao: padroes[Math.floor(Math.random() * padroes.length)] 
        };
    }

    async entrarDungeon(liderId, local) {
        const lider = this.alunos[liderId]; 
        if (!lider || lider.focoAtual < 3) return { erro: "A exploração exige 3 de Foco." };
        if (!lider.pveProgresso) lider.pveProgresso = { nivel: 1, area: 1 };
        
        lider.focoAtual -= 3;
        const idInst = `dungeon_${crypto.randomBytes(4).toString('hex')}`;
        
        let dificuldadeMult = 1 + (lider.pveProgresso.nivel * 0.3) + (lider.pveProgresso.area * 0.05);
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
        
        this.dungeonInstancias[idInst].timerBossAtaque = setInterval(() => {
            const inst = this.dungeonInstancias[idInst];
            if(!inst || inst.status !== 'combate') { 
                clearInterval(this.dungeonInstancias[idInst].timerBossAtaque); 
                return; 
            }
            
            inst.entidades.forEach(mob => {
                if(!mob.vivo) return;
                
                let tempoCast = 2000; let cor = "#e74c3c"; let tipoAtk = "normal"; let chance = 0.5;
                if(mob.padrao === 'agressivo') { tempoCast = 1000; cor = "#ff3300"; tipoAtk = "rápido"; chance = 0.7; }
                else if(mob.padrao === 'tanque') { tempoCast = 3500; cor = "#8e44ad"; tipoAtk = "pesado"; chance = 0.4; }
                else if(mob.padrao === 'venenoso') { tempoCast = 2500; cor = "#2ecc71"; tipoAtk = "veneno"; chance = 0.6; }

                if(Math.random() < chance && global.io) {
                    global.io.emit('alerta_boss', { 
                        instId: idInst, tempoCast: tempoCast, mobIdx: mob.idx, mobNome: mob.nome, cor: cor, tipo: tipoAtk
                    }); 
                }
            });
        }, 1800); 
        
        this._salvarBancoDeDados();
        return { sucesso: true, idInstancia: idInst, estado: { entidades: inimigosAtivos } };
    }
    async processarActionCombat(atacanteId, instId, feiticoId, alvoIdx = 0) {
        const a = this.alunos[atacanteId]; 
        const inst = this.dungeonInstancias[instId];
        if (!a || !inst || inst.status !== 'combate') return { erro: "Combate encerrado." };

        // Ignora pacotes de impacto visual do Frontend
        if (feiticoId === "dano_recebido" || feiticoId === "protego_block_reflex") {
            return { sucesso: true, relatoAcao: "Impacto registado." };
        }

        const feitico = this.livroDeFeiticos[feiticoId];
        if (!feitico) return { erro: "Feitiço desconhecido." };

        // LÊ EXATAMENTE AS CHAVES GERADAS PELA TUA IA
        let mecanica = feitico.tipoMecanica || (feitico.defende ? 'escudo' : 'ataque');
        let forcaDoFeitico = Number(feitico.valorBase) || Number(feitico.poderBase) || 50;
        let relatoAcao = "";

        // ===============================================
        // LÓGICA 1: CURA (Sobe o HP)
        // ===============================================
        if (mecanica === 'cura') {
            let curaAplicada = forcaDoFeitico + ((a.atributosTotais.pocoes || 5) * 5);
            a.hpAtual = Math.min(a.hpMax, a.hpAtual + curaAplicada);
            relatoAcao = `Lançaste ${feitico.nome} e recuperaste ${curaAplicada} HP!`;
            
            this._salvarBancoDeDados();
            // IMPORTANTE: O return aqui impede que a cura cause dano aos inimigos!
            return { sucesso: true, hpJogador: a.hpAtual, cura: curaAplicada, relatoAcao, bossMorto: false, entidades: inst.entidades };
        } 
        
        // ===============================================
        // LÓGICA 2: ESCUDO (Bloqueio Total)
        // ===============================================
        if (mecanica === 'escudo' || mecanica === 'defesa') {
            relatoAcao = `A barreira de ${feitico.nome} está a proteger-te!`;
            return { sucesso: true, relatoAcao, bossMorto: false, entidades: inst.entidades };
        }

        // ===============================================
        // LÓGICA 3: ATAQUE E STATUS (Dá Dano e Altera Boss)
        // ===============================================
        let mob = inst.entidades.find(m => m.idx === alvoIdx && m.vivo) || inst.entidades.find(m => m.vivo);
        if(!mob) return { erro: "Sem alvos vivos." };

        let danoAplicado = forcaDoFeitico + ((a.atributosTotais.feiticos || 5) * 5);
        let defendeu = false;

        // Se for STATUS, dá menos dano mas QUEBRA o escudo/padrão do inimigo!
        if (mecanica === 'status') {
            danoAplicado = Math.floor(danoAplicado * 0.8);
            mob.padrao = 'vulneravel'; // Tira o escudo do mob
            relatoAcao = `O feitiço ${feitico.nome} atordoou o inimigo! Defesa quebrada!`;
        } else {
            relatoAcao = `O teu ${feitico.nome} atingiu o alvo!`;
        }

        if(mob.padrao === 'defensivo') {
            danoAplicado = Math.floor(danoAplicado * 0.6);
            defendeu = true;
        }

        let critico = Math.random() > 0.85;
        if(critico) danoAplicado = Math.floor(danoAplicado * 1.5);

        mob.hpAtual -= Math.floor(danoAplicado);

        // ===============================================
        // VERIFICAÇÃO DE MORTE
        // ===============================================
        if (mob.hpAtual <= 0) {
            mob.vivo = false; mob.hpAtual = 0;
            let todosMortos = inst.entidades.every(m => !m.vivo);

            if(todosMortos) {
                let isBoss = (inst.faseAtual === inst.maxFases);
                let xpFase = isBoss ? 1500 : 400 * inst.entidades.length;
                let galeoesFase = isBoss ? 800 : 100 * inst.entidades.length;

                await this._addXp(a, xpFase); a.galeoes += galeoesFase; 
                if(!a.estatisticas) a.estatisticas = { monstrosMortos: 0 };
                a.estatisticas.monstrosMortos += inst.entidades.length;
                try { this._progressoQuest(a, 'pve', mob.nome, 1); } catch(ex){}

                if (inst.faseAtual < inst.maxFases) {
                    inst.faseAtual++;
                    let maxMobs = (a.pveProgresso && a.pveProgresso.nivel >= 2) ? 2 : 1;
                    let proxMobs = inst.faseAtual === inst.maxFases ? 1 : Math.floor(Math.random() * maxMobs) + 1;
                    let novasEntidades = [];
                    let mData = await this.cerebroIA.gerarMonstroProcedural(mob.hpMax * 1.3, inst.local, (inst.faseAtual === inst.maxFases), a.nivel);
                    
                    for(let i=0; i<proxMobs; i++) {
                        novasEntidades.push({ idx: i, nome: (proxMobs > 1 ? `${mData.nome} [${i+1}]` : mData.nome), hpMax: mData.hp, hpAtual: mData.hp, vivo: true, padrao: ['agressivo', 'tanque'][Math.floor(Math.random()*2)] });
                    }
                    inst.entidades = novasEntidades; this._salvarBancoDeDados();
                    return { novaFase: true, faseAtual: inst.faseAtual, relatoAcao: `Onda aniquilada! [+${xpFase} XP].`, entidades: novasEntidades, hpBoss: novasEntidades[0].hpAtual, danoAplicado, alvoMorto: mob.idx };
                } else {
                    inst.status = 'finalizado'; clearInterval(inst.timerBossAtaque);
                    if(!a.pveProgresso) a.pveProgresso = { area: 1, nivel: 1 };
                    a.pveProgresso.area++; if (a.pveProgresso.area > 5) { a.pveProgresso.area = 1; a.pveProgresso.nivel++; }
                    this._salvarBancoDeDados();
                    return { bossMorto: true, relatoAcao: `Área Purificada! [+${xpFase} XP]. Avançaste!`, hpBoss: 0, danoAplicado, alvoMorto: mob.idx };
                }
            } else {
                this._salvarBancoDeDados();
                return { mobEliminado: true, relatoAcao: `${mob.nome} foi pulverizado!`, entidades: inst.entidades, hpBoss: 0, danoAplicado, alvoMorto: mob.idx };
            }
        }

        this._salvarBancoDeDados();
        return { bossMorto: false, entidades: inst.entidades, hpBoss: mob.hpAtual, danoAplicado, defendeu, relatoAcao };
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
    async gerarRespostaPersonagemIA(zona, jogadorNome, mensagemTexto, casa) {
        if (!this.apiKey) return null;
        try {
            const prompt = `És a magia onipresente do castelo de Hogwarts, controlando os fantasmas, quadros e o próprio ambiente. O aluno ${jogadorNome} (${casa}) disse em "${zona}": "${mensagemTexto}".
            Responde como um habitante local (Fantasma, Quadro, etc). 
            
            NOVA REGRA DE MATERIALIZAÇÃO FÍSICA NO JOGO:
            - Se o aluno te pedir para invocar um inimigo, para treinar, ou se o contexto justificar um ataque (ex: "Quero lutar!", "Traz-me um trasgo"), preenche "spawnMob" com o nome da criatura.
            - Se o aluno pedir ajuda para encontrar um objeto, ou se a conversa levar a uma recompensa material (ex: "Tenho fome", "Preciso de uma poção"), preenche "spawnItem" com o nome do objeto (ex: "Sapo de Chocolate").
            - Se for apenas uma conversa normal, deixa spawnMob e spawnItem como null.

            RETORNA APENAS JSON ESTRITO: 
            {
                "personagem": "Nick Quase Sem Cabeça", 
                "texto": "Ah, jovem! Queres provar o teu valor? Então enfrenta esta besta que acabou de sair das sombras!", 
                "pontos": 0,
                "spawnMob": "Trasgo Montanhês Furioso",
                "spawnItem": null
            }`;
            
            const res = await this.groq.chat.completions.create({ 
                messages: [{ role: "user", content: prompt }], 
                model: "llama-3.1-8b-instant",
                response_format: { type: "json_object" }
            });
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
            
            // Puxa ambos os jogadores para a Arena de Ação!
            ioGlobal.to(`priv_${b1.id}`).emit('pvp_start', { instId, inimigoNome: b2.nome, maxHpInimigo: b2.hpMax });
            ioGlobal.to(`priv_${b2.id}`).emit('pvp_start', { instId, inimigoNome: b1.nome, maxHpInimigo: b1.hpMax });
            
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
            if(!aEu.estatisticas.eloPvP) aEu.estatisticas.eloPvP = 1000;
            if(!aInimigo.estatisticas.eloPvP) aInimigo.estatisticas.eloPvP = 1000;
            
            // Distribui as recompensas e o ELO Ranked
            aEu.estatisticas.eloPvP += 25; 
            aEu.estatisticas.duelosVencidos++;
            aInimigo.estatisticas.eloPvP = Math.max(0, aInimigo.estatisticas.eloPvP - 15);
            aEu.galeoes += 50; 
            this.ganharXp(aEu, 500); // 500 XP por vitória
            
            ioGlobal.to(`priv_${eu.id}`).emit('pvp_fim', { msg: "🏆 Venceste o Duelo Mágico! (+25 ELO, +50G)" });
            ioGlobal.to(`priv_${inimigo.id}`).emit('pvp_fim', { msg: "💀 Foste derrotado no duelo! (-15 ELO)" });
            
            delete this.pvpPartidas[instId];
            this._salvarBancoDeDados();
        }
        return { sucesso: true };
    }

    tickServerGlobal() {
        const relogio = RelogioHogwarts.obterHorarioAtual();
        global.io.emit('relogio_hogwarts', relogio);
        Lexicon.PulsarEternidade(); 

        if (this.quadribol) this.quadribol.processarTick(global.io);
        
        // 🔥 GERA A VIDA NO MUNDO!
        this.processarCicloMundoVivo();
        // CICLO DE VIDA DA ESTUFA
        for (let id in this.alunos) {
            let a = this.alunos[id];
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
            if(a.fome < 0) a.fome = 0; if(a.energia < 0) a.energia = 0;

            if(Math.random() < 0.05) { 
                if (a.focoAtual < a.maxFoco) a.focoAtual += 1;
                if (a.hpAtual < a.hpMax) a.hpAtual += Math.floor(a.hpMax * 0.05); 
            }
        }
        
        // 🛑 CORREÇÃO: Reduzido de 10% (0.10) para 1% (0.01) chance de notícia a cada tick
        // Isto dá pausas longas e moderadas entre as notícias geradas.
        if(Math.random() < 0.01) {
            this.cerebroIA.gerarNoticiaProfeta().then(noticia => {
                global.io.emit('noticia_profeta', noticia);
            });
        }

        // 🛑 CORREÇÃO: Reduzida a fala dos fantasmas para não atropelar a IA
        if(Math.random() < 0.02 && Object.keys(this.alunos).length > 0) {
            const zonas = ["Salão Principal", "Grande Escadaria", "Masmorras", "Torre de Astronomia", "Cabana do Hagrid", "Hogsmeade"];
            const z = zonas[Math.floor(Math.random() * zonas.length)];
            const alunosAtivos = Object.values(this.alunos).filter(a => a.estadoJogo === 'CASTELO').map(a => a.nome).slice(0, 3).join(", ");
            
            this.cerebroIA.gerarVidaAutonomaCastelo(z, alunosAtivos || "ninguém").then(evento => {
                if(evento && evento.texto && evento.personagem !== "Nenhum") {
                    global.io.to(`zona_${z}`).emit('nova_mensagem', { canal: 'zona', autor: `🗣️ [${evento.personagem}]`, texto: evento.texto });
					// TICK GLOBAL: 1% de Chance de Spawnar um World Boss no Mapa
        if(Math.random() < 0.01 && !this.worldBoss.ativo && Object.keys(this.alunos).length > 0) {
            const zonasArray = ["Salão Principal", "Grande Escadaria", "Torre de Astronomia", "Hogsmeade"];
            this.worldBoss.ativo = true;
            this.worldBoss.zona = zonasArray[Math.floor(Math.random() * zonasArray.length)];
            this.worldBoss.nome = "Trasgo Montanhês Furioso";
            this.worldBoss.hpMax = 20000; this.worldBoss.hpAtual = 20000;
            
            global.io.emit('nova_mensagem', { canal: 'salaoPrincipal', autor: '🚨 ALERTA GERAL', texto: `Um ${this.worldBoss.nome} invadiu a ${this.worldBoss.zona}! Reúnam-se lá imediatamente para o derrotar!` });
        }
               }
            });
        }
    }// <--- FECHAMENTO DO tickServerGlobal() FALTANTE
} // <--- FECHAMENTO DA CLASSE HogwartsCore FALTANTE

module.exports = { HogwartsCore, AstrolabioMagico, RelogioHogwarts, Ollivanders, MotorConscienciaHogwarts, MotorQuadribol };