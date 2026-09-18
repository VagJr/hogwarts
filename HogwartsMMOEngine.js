// ==============================================================================
// HogwartsMMOEngine.js - MOTOR 2D COMPLETO & VIVO DO CASTELO DE HOGWARTS (MMO)
// 17 Ambientes Canônicos Densamente Mobiliados, Física Deslizante sem Travamentos,
// Modelo Completo de Personagem com Guarda-Roupa, Passagens Secretas & Interações com IA.
// ==============================================================================

(function(global) {
    'use strict';

    const HogwartsMMOEngine = {
        ctx: null, cvs: null, vw: 0, vh: 0,
        loop: null, tickCount: 0,
        camera: { x: 0, y: 0 },
        keys: { w: 0, a: 0, s: 0, d: 0, shift: 0 },
        player: { 
            x: 1600, y: 1600, vx: 0, vy: 0, 
            speed: 4.5, sprintSpeed: 7.0, 
            size: 16, dir: 1, isMoving: false 
        },
        remotes: {}, 
        particulasGlobais: [],
        controlesCriados: false, 
        interatividadeCriada: false,
        inicializado: false,
        transicaoCooldown: 0, 
        ultimoEnvioSocket: 0,
        eraMovimento: false,
        objetoInterativoProximo: null,
        velasFlutuantes: [],
        estrelasNebulosa: [],
        dialogoIAAtivo: null,
        mapas: {},

        construirMundo: function() {
            this.mapas = {};
            const lista = [
                "Pátio", "Salão Principal", "Grande Escadaria", "Salas de Aula",
                "Biblioteca", "Masmorras", "Estufas", "Campo de Quadribol",
                "Cabana do Hagrid", "Torre de Astronomia", "Comunal Gryffindor",
                "Comunal Slytherin", "Comunal Ravenclaw", "Comunal Hufflepuff",
                "Cozinhas", "Banheiro da Murta", "Sala Precisa"
            ];
            lista.forEach(z => {
                this.mapas[z] = this.obterMapaZona(z);
            });
            return this.mapas;
        },

        desatolarJogador: function(m) {
            let mapa = m || this.obterMapaZona(window.zonaAtual);
            let tentativas = 30;
            while (this.verificarColisao(this.player.x, this.player.y, mapa) && tentativas > 0) {
                this.player.x += 25;
                this.player.y += 10;
                tentativas--;
            }
        },

        // ----------------------------------------------------------------------
        // 1. GERADORES DOS 17 AMBIENTES CANÔNICOS DE HOGWARTS
        // ----------------------------------------------------------------------

        // A. PÁTIO DO RELÓGIO & VIADUTO
        gerarPatio: function() {
            let el = [], inter = [];
            // Muralhas de pedra e arcadas góticas
            el.push({ tipo: 'parede_pedra', x: 0, y: 0, w: 3200, h: 70, cor: '#1a1d1a', colisao: true });
            el.push({ tipo: 'parede_pedra', x: 0, y: 3130, w: 3200, h: 70, cor: '#1a1d1a', colisao: true });
            el.push({ tipo: 'parede_pedra', x: 0, y: 0, w: 70, h: 3200, cor: '#1a1d1a', colisao: true });
            el.push({ tipo: 'parede_pedra', x: 3130, y: 0, w: 70, h: 3200, cor: '#1a1d1a', colisao: true });

            // O Grande Relógio Astrológico na Torre Norte
            el.push({ tipo: 'relogio_astrologico', x: 1400, y: 20, w: 400, h: 100, colisao: false });

            // Viaduto de pedra gótica com parapeitos
            el.push({ tipo: 'viaduto_pedra', x: 1450, y: 2700, w: 300, h: 430, colisao: false });

            // Chafariz central monumental com águas encantadas
            el.push({ tipo: 'fonte_monumental', x: 1600, y: 1600, r: 240, colisao: true, forma: 'circulo' });
            inter.push({
                id: 'fonte_desejos', tipo: 'fonte', x: 1600, y: 1600, r: 260,
                label: 'Chafariz dos Desejos (Atirar Moeda)', icone: '⛲',
                acao: () => this.interagirFonteDesejos()
            });

            // Colunas de claustro, bancos de pedra e canteiros
            for (let x = 300; x < 2900; x += 350) {
                if (Math.abs(x - 1600) > 320) {
                    el.push({ tipo: 'pilar_gotico', x: x, y: 400, w: 45, h: 45, colisao: true });
                    el.push({ tipo: 'pilar_gotico', x: x, y: 2800, w: 45, h: 45, colisao: true });
                    el.push({ tipo: 'banco_jardim', x: x - 40, y: 460, w: 120, h: 35, cor: '#4a3525', colisao: true });
                    el.push({ tipo: 'canteiro_flores', x: x - 50, y: 2650, w: 140, h: 80, cor: '#196f3d' });
                    el.push({ tipo: 'arandela_tocha', x: x, y: 70, w: 20, h: 30 });
                }
            }

            // Árvores ancestrais dos jardins de Hogwarts
            el.push({ tipo: 'arvore_castelo', x: 650, y: 900, r: 120, colisao: true, forma: 'circulo' });
            el.push({ tipo: 'arvore_castelo', x: 2550, y: 900, r: 125, colisao: true, forma: 'circulo' });
            el.push({ tipo: 'arvore_castelo', x: 650, y: 2300, r: 115, colisao: true, forma: 'circulo' });
            el.push({ tipo: 'arvore_castelo', x: 2550, y: 2300, r: 130, colisao: true, forma: 'circulo' });

            // Gárgula Falante Interativa com IA
            el.push({ tipo: 'estatua_gargula', x: 1050, y: 700, w: 60, h: 60, colisao: true });
            inter.push({
                id: 'gargula_patio', tipo: 'gargula', x: 1050, y: 700, r: 80,
                label: 'Gárgula Falante (Conversar com IA)', icone: '🗿',
                acao: () => this.abrirDialogoIA('Gárgula de Pedra Ancestral', 'Pátio do Castelo', 'Sou o guardião das arcadas. O que buscas nos segredos de Hogwarts?')
            });

            // Baú Secreto escondido nas arcadas
            el.push({ tipo: 'bau_tesouro', x: 2950, y: 250, w: 40, h: 35, colisao: true });
            inter.push({
                id: 'bau_patio', tipo: 'bau', x: 2950, y: 250, r: 60,
                label: 'Baú Oculto do Pátio', icone: '📦',
                acao: () => this.abrirBauSecreto('bau_patio', 40, 'Figurinha de Sapo de Chocolate & 40 Galeões!')
            });

            return { elementos: el, interativos: inter };
        },

        // B. SALÃO PRINCIPAL (THE GREAT HALL)
        gerarSalaoPrincipal: function() {
            let el = [], inter = [];
            el.push({ tipo: 'parede_pedra', x: 0, y: 0, w: 2400, h: 70, cor: '#1a1008', colisao: true });
            el.push({ tipo: 'parede_pedra', x: 0, y: 2930, w: 2400, h: 70, cor: '#1a1008', colisao: true });
            el.push({ tipo: 'parede_pedra', x: 0, y: 0, w: 70, h: 3000, cor: '#1a1008', colisao: true });
            el.push({ tipo: 'parede_pedra', x: 2330, y: 0, w: 70, h: 3000, cor: '#1a1008', colisao: true });

            // As 4 Ampulhetas Gigantes da Taça das Casas no topo da parede sul
            el.push({ tipo: 'ampulheta_casas', x: 600, y: 80, w: 90, h: 160, casa: 'Gryffindor', gema: '#e74c3c' });
            el.push({ tipo: 'ampulheta_casas', x: 950, y: 80, w: 90, h: 160, casa: 'Slytherin', gema: '#2ecc71' });
            el.push({ tipo: 'ampulheta_casas', x: 1350, y: 80, w: 90, h: 160, casa: 'Ravenclaw', gema: '#3498db' });
            el.push({ tipo: 'ampulheta_casas', x: 1700, y: 80, w: 90, h: 160, casa: 'Hufflepuff', gema: '#f1c40f' });

            // Lareiras Monumentais e Armaduras
            for (let y = 600; y < 2400; y += 500) {
                el.push({ tipo: 'lareira_monumental', x: 70, y: y, w: 60, h: 130, colisao: true });
                el.push({ tipo: 'lareira_monumental', x: 2210, y: y, w: 60, h: 130, colisao: true });
                el.push({ tipo: 'armadura_guarda', x: 70, y: y + 220, w: 40, h: 40, colisao: true });
                el.push({ tipo: 'armadura_guarda', x: 2230, y: y + 220, w: 40, h: 40, colisao: true });
                el.push({ tipo: 'vitral_gotico', x: 70, y: y - 180, w: 20, h: 140, cor: '#d4af37' });
                el.push({ tipo: 'vitral_gotico', x: 2250, y: y - 180, w: 20, h: 140, cor: '#d4af37' });
            }

            // Estrado elevado e Mesa dos Professores
            el.push({ tipo: 'estrado_professores', x: 300, y: 260, w: 1800, h: 180, colisao: false });
            el.push({ tipo: 'mesa_prof', x: 450, y: 320, w: 1500, h: 80, cor: '#3a2012', colisao: true });
            el.push({ tipo: 'trono_dumbledore', x: 1150, y: 270, w: 100, h: 60, colisao: true });
            
            // Púlpito da Coruja Dourada
            el.push({ tipo: 'pulpito_coruja', x: 1160, y: 410, w: 80, h: 60, colisao: true });
            inter.push({
                id: 'pulpito_coruja', tipo: 'pulpito', x: 1200, y: 440, r: 80,
                label: 'Púlpito da Coruja Dourada (Proclamação)', icone: '🦉',
                acao: () => this.proclamarDiscursoSalao()
            });
            inter.push({
                id: 'pulpito_dumbledore', tipo: 'pulpito', x: 1200, y: 440, r: 80,
                label: 'Púlpito da Coruja Dourada (Proclamação)', icone: '🦉',
                acao: () => this.proclamarDiscursoSalao()
            });

            // As 4 Longas Mesas das Casas de Hogwarts
            const configCasas = [
                { nome: 'Gryffindor', x: 320, cor: '#740001' },
                { nome: 'Hufflepuff', x: 800, cor: '#ecb939' },
                { nome: 'Ravenclaw', x: 1300, cor: '#0e1a40' },
                { nome: 'Slytherin', x: 1800, cor: '#1a472a' }
            ];

            configCasas.forEach(c => {
                el.push({ tipo: 'mesa_banquete', x: c.x, y: 700, w: 220, h: 1800, cor: c.cor, casa: c.nome, colisao: true });
                el.push({ tipo: 'banco_corrido', x: c.x - 45, y: 700, w: 35, h: 1800, colisao: true });
                el.push({ tipo: 'banco_corrido', x: c.x + 230, y: 700, w: 35, h: 1800, colisao: true });
                el.push({ tipo: 'estandarte_casa', x: c.x + 60, y: 80, w: 100, h: 180, casa: c.nome });
            });

            // Banquete Mágico Interativo
            inter.push({
                id: 'banquete_mesa', tipo: 'banquete', x: 910, y: 1500, r: 120,
                label: 'Banquete Mágico de Hogwarts (Comer)', icone: '🍗',
                acao: () => this.comerBanqueteSalao()
            });
            inter.push({
                id: 'banquete_salao', tipo: 'banquete', x: 910, y: 1500, r: 120,
                label: 'Banquete Mágico de Hogwarts (Comer)', icone: '🍗',
                acao: () => this.comerBanqueteSalao()
            });
            inter.push({
                id: 'quadro_pera', tipo: 'quadro', x: 80, y: 2750, r: 90,
                label: 'Quadro da Pêra (Fazer Cócegas)', icone: '🍐',
                acao: () => this.cocegasNaPera()
            });

            return { elementos: el, interativos: inter };
        },

        // C. GRANDE ESCADARIA MÓVEL
        gerarEscadaria: function() {
            let el = [], inter = [];
            el.push({ tipo: 'parede_pedra', x: 0, y: 0, w: 2600, h: 70, cor: '#151515', colisao: true });
            el.push({ tipo: 'parede_pedra', x: 0, y: 2530, w: 2600, h: 70, cor: '#151515', colisao: true });
            el.push({ tipo: 'parede_pedra', x: 0, y: 0, w: 70, h: 2600, cor: '#151515', colisao: true });
            el.push({ tipo: 'parede_pedra', x: 2530, y: 0, w: 70, h: 2600, cor: '#151515', colisao: true });

            // Fosso Central Monumental
            el.push({ tipo: 'fosso_escadaria', x: 750, y: 750, w: 1100, h: 1100, colisao: false });

            // Escadarias Mágicas Dinâmicas com rotação sutil
            el.push({ tipo: 'escada_dinamica', x: 800, y: 1200, w: 400, h: 100, idx: 0, colisao: false });
            el.push({ tipo: 'escada_dinamica', x: 1400, y: 1200, w: 400, h: 100, idx: 1, colisao: false });
            el.push({ tipo: 'escada_dinamica', x: 1200, y: 800, w: 100, h: 400, idx: 2, colisao: false });
            el.push({ tipo: 'escada_dinamica', x: 1200, y: 1400, w: 100, h: 400, idx: 3, colisao: false });

            // Dezenas de Retratos a Óleo Animados nas paredes
            for (let x = 200; x < 2400; x += 220) {
                el.push({ tipo: 'quadro_oleo', x: x, y: 80, w: 90, h: 120, id: `q_n_${x}` });
                el.push({ tipo: 'quadro_oleo', x: x, y: 2400, w: 90, h: 120, id: `q_s_${x}` });
            }
            for (let y = 250; y < 2300; y += 240) {
                el.push({ tipo: 'quadro_oleo', x: 80, y: y, w: 90, h: 120, id: `q_w_${y}` });
                el.push({ tipo: 'quadro_oleo', x: 2430, y: y, w: 90, h: 120, id: `q_e_${y}` });
            }

            // Armaduras de Guarda nas esquinas
            el.push({ tipo: 'armadura_guarda', x: 250, y: 250, w: 50, h: 50, colisao: true });
            el.push({ tipo: 'armadura_guarda', x: 2300, y: 250, w: 50, h: 50, colisao: true });
            el.push({ tipo: 'armadura_guarda', x: 250, y: 2300, w: 50, h: 50, colisao: true });
            el.push({ tipo: 'armadura_guarda', x: 2300, y: 2300, w: 50, h: 50, colisao: true });

            // Grande Relógio de Pêndulo Gótico
            el.push({ tipo: 'relogio_pendulo', x: 1250, y: 80, w: 100, h: 180, colisao: true });

            // Retrato Falante de Sir Cadogan (IA)
            inter.push({
                id: 'sir_cadogan', tipo: 'retrato_falante', x: 450, y: 150, r: 90,
                label: 'Retrato de Sir Cadogan (Conversar com IA)', icone: '🤺',
                acao: () => this.abrirDialogoIA('Sir Cadogan', 'Grande Escadaria', 'Em guarda, patife covarde! Aceitas o meu desafio para uma justa gloriosa?')
            });

            // PASSAGEM SECRETA 1: Estátua da Bruxa de Um Olho Só (Gunhilda de Gorsemoor)
            el.push({ tipo: 'estatua_bruxa_caolha', x: 1950, y: 250, w: 70, h: 70, colisao: true });
            inter.push({
                id: 'bruxa_caolha', tipo: 'passagem_secreta', x: 1950, y: 250, r: 85,
                label: 'Bruxa de Um Olho Só (Sussurrar "Dissendium")', icone: '🧙‍♀️',
                acao: () => this.usarPassagemSecreta('bruxa_caolha', 'Masmorras', 300, 300, 'Sussurraste "Dissendium". A corcova de pedra abriu-se, revelando uma passagem secreta para as Masmorras!')
            });

            // PASSAGEM SECRETA 2: O Espelho do 4º Andar
            el.push({ tipo: 'espelho_secreto', x: 2430, y: 1200, w: 80, h: 140, colisao: true });
            inter.push({
                id: 'espelho_quarto_andar', tipo: 'passagem_secreta', x: 2430, y: 1200, r: 90,
                label: 'Espelho do 4º Andar (Girar Moldura)', icone: '🪞',
                acao: () => this.usarPassagemSecreta('espelho_quarto_andar', 'Biblioteca', 250, 400, 'Giraste a moldura de bronze do espelho. A parede rangeu suavemente, abrindo passagem para a Grande Biblioteca!')
            });

            // PASSAGEM SECRETA 3: A Parede da Sala Precisa (7º Andar)
            el.push({ tipo: 'parede_sala_precisa', x: 200, y: 1200, w: 60, h: 160, colisao: true });
            inter.push({
                id: 'porta_sala_precisa', tipo: 'passagem_secreta', x: 200, y: 1200, r: 90,
                label: 'Parede de Pedra (Caminhar 3 Vezes Focado)', icone: '🚪',
                acao: () => this.usarPassagemSecreta('porta_sala_precisa', 'Sala Precisa', 800, 1000, 'Caminhaste três vezes diante da parede com a mente focada. Uma porta de ferro forjado esculpida com runas materializou-se!')
            });

            return { elementos: el, interativos: inter };
        },

        // D. SALAS DE AULA (FEITIÇOS, D.C.A.T., TRANSFIGURAÇÃO)
        gerarSalasAula: function() {
            let el = [], inter = [];
            el.push({ tipo: 'parede_pedra', x: 0, y: 0, w: 2200, h: 60, cor: '#222', colisao: true });
            el.push({ tipo: 'parede_pedra', x: 0, y: 1940, w: 2200, h: 60, cor: '#222', colisao: true });
            el.push({ tipo: 'parede_pedra', x: 0, y: 0, w: 60, h: 2000, cor: '#222', colisao: true });
            el.push({ tipo: 'parede_pedra', x: 2140, y: 0, w: 60, h: 2000, cor: '#222', colisao: true });

            // Paredes divisórias das 3 salas
            el.push({ tipo: 'parede_pedra', x: 730, y: 0, w: 40, h: 1700, cor: '#222', colisao: true });
            el.push({ tipo: 'parede_pedra', x: 1460, y: 0, w: 40, h: 1700, cor: '#222', colisao: true });

            // 1. Sala de Feitiços (Flitwick)
            el.push({ tipo: 'estrado_prof', x: 100, y: 120, w: 530, h: 120, colisao: false });
            el.push({ tipo: 'mesa_prof', x: 250, y: 150, w: 220, h: 60, cor: '#3a2012', colisao: true });
            for (let y = 350; y < 1400; y += 220) {
                el.push({ tipo: 'carteira_aluno', x: 120, y: y, w: 200, h: 50, colisao: true });
                el.push({ tipo: 'carteira_aluno', x: 420, y: y, w: 200, h: 50, colisao: true });
            }

            // 2. Sala de D.C.A.T. (Armário do Bicho-Papão)
            el.push({ tipo: 'esqueleto_dragao', x: 800, y: 80, w: 600, h: 120, colisao: false });
            el.push({ tipo: 'mesa_prof', x: 1000, y: 220, w: 220, h: 60, cor: '#1a1a1a', colisao: true });
            for (let y = 400; y < 1300; y += 240) {
                el.push({ tipo: 'carteira_aluno', x: 820, y: y, w: 220, h: 50, colisao: true });
                el.push({ tipo: 'carteira_aluno', x: 1160, y: y, w: 220, h: 50, colisao: true });
            }
            // Armário do Bicho-Papão
            el.push({ tipo: 'armario_magico', x: 1060, y: 1400, w: 80, h: 120, colisao: true });
            inter.push({
                id: 'bicho_papao', tipo: 'bicho_papao', x: 1100, y: 1450, r: 90,
                label: 'Armário do Bicho-Papão (Enfrentar com Riddikulus)', icone: '🚪',
                acao: () => this.abrirDialogoIA('O Bicho-Papão de D.C.A.T.', 'Sala de D.C.A.T.', 'A maçaneta chacoalha com força estrondosa... Qual é o teu maior medo?')
            });

            // 3. Sala de Transfiguração (McGonagall)
            el.push({ tipo: 'mesa_prof', x: 1700, y: 180, w: 220, h: 60, cor: '#4a2511', colisao: true });
            el.push({ tipo: 'lousa_magica', x: 1650, y: 80, w: 320, h: 40, colisao: true });
            el.push({ tipo: 'gaiola_corujas', x: 1530, y: 150, w: 70, h: 120, colisao: true });
            for (let y = 350; y < 1400; y += 220) {
                el.push({ tipo: 'carteira_aluno', x: 1530, y: y, w: 220, h: 50, colisao: true });
                el.push({ tipo: 'carteira_aluno', x: 1850, y: y, w: 220, h: 50, colisao: true });
            }

            // Boneco de Treino de Duelos Mágicos
            el.push({ tipo: 'boneco_treino', x: 1100, y: 1750, w: 60, h: 80, colisao: true });
            inter.push({
                id: 'boneco_aulas', tipo: 'boneco', x: 1100, y: 1750, r: 80,
                label: 'Boneco de Duelos (Treinar Feitiços)', icone: '🎯',
                acao: () => this.treinarNoBonecoMundo()
            });

            return { elementos: el, interativos: inter };
        },

        // E. A GRANDE BIBLIOTECA & SEÇÃO RESERVADA
        gerarBiblioteca: function() {
            let el = [], inter = [];
            el.push({ tipo: 'parede_madeira', x: 0, y: 0, w: 2600, h: 70, cor: '#221105', colisao: true });
            el.push({ tipo: 'parede_madeira', x: 0, y: 2330, w: 2600, h: 70, cor: '#221105', colisao: true });
            el.push({ tipo: 'parede_madeira', x: 0, y: 0, w: 70, h: 2400, cor: '#221105', colisao: true });
            el.push({ tipo: 'parede_madeira', x: 2530, y: 0, w: 70, h: 2400, cor: '#221105', colisao: true });

            // Grade da Seção Reservada
            el.push({ tipo: 'grade_ferro', x: 1800, y: 70, w: 30, h: 2260, colisao: true });
            el.push({ tipo: 'portao_ferro', x: 1800, y: 1100, w: 30, h: 200, colisao: true });
            inter.push({
                id: 'portao_secao_reservada', tipo: 'portao', x: 1800, y: 1200, r: 90,
                label: 'Portão da Seção Reservada (Alohomora)', icone: '🗝️',
                acao: () => this.decifrarSecaoReservada()
            });

            // Estantes Imensas de Carvalho
            for (let x = 200; x < 1650; x += 320) {
                el.push({ tipo: 'estante_livros', x: x, y: 250, w: 140, h: 650, colisao: true });
                el.push({ tipo: 'estante_livros', x: x, y: 1250, w: 140, h: 650, colisao: true });
                el.push({ tipo: 'escada_livros', x: x + 145, y: 400, w: 25, h: 100, colisao: false });
            }

            // Estantes Proibidas da Seção Reservada
            for (let x = 1950; x < 2450; x += 220) {
                el.push({ tipo: 'estante_proibida', x: x, y: 250, w: 120, h: 700, colisao: true });
                el.push({ tipo: 'estante_proibida', x: x, y: 1300, w: 120, h: 700, colisao: true });
            }

            // Mesas de Estudo com Abajures Verdes e Pergaminhos
            for (let y = 500; y < 1800; y += 400) {
                el.push({ tipo: 'mesa_estudo', x: 80, y: y, w: 90, h: 200, colisao: true });
            }

            // O Tomo Proibido da Seção Reservada (IA)
            el.push({ tipo: 'pedestal_grimorio', x: 2200, y: 1150, w: 60, h: 60, colisao: true });
            inter.push({
                id: 'tomo_proibido', tipo: 'grimorio', x: 2200, y: 1150, r: 85,
                label: 'Grimório das Artes Ocultas (Decifrar com IA)', icone: '📖',
                acao: () => this.abrirDialogoIA('Grimório Antigo das Trevas', 'Seção Reservada', 'As páginas sussurram feitiços proibidos há milênios... Que enigma desejas desvendar?')
            });
            inter.push({
                id: 'tomo_ancestral', tipo: 'grimorio', x: 2200, y: 1150, r: 85,
                label: 'Grimório das Artes Ocultas (Decifrar com IA)', icone: '📖',
                acao: () => this.abrirDialogoIA('Grimório Antigo das Trevas', 'Seção Reservada', 'As páginas sussurram feitiços proibidos há milênios... Que enigma desejas desvendar?')
            });

            return { elementos: el, interativos: inter };
        },

        // F. MASMORRAS & SALA DE POÇÕES (SNAPE)
        gerarMasmorras: function() {
            let el = [], inter = [];
            el.push({ tipo: 'parede_ardosia', x: 0, y: 0, w: 2400, h: 70, cor: '#0a0d0a', colisao: true });
            el.push({ tipo: 'parede_ardosia', x: 0, y: 2130, w: 2400, h: 70, cor: '#0a0d0a', colisao: true });
            el.push({ tipo: 'parede_ardosia', x: 0, y: 0, w: 70, h: 2200, cor: '#0a0d0a', colisao: true });
            el.push({ tipo: 'parede_ardosia', x: 2330, y: 0, w: 70, h: 2200, cor: '#0a0d0a', colisao: true });

            // Bancadas de Poções com Alambiques e Frascos
            for (let x = 300; x < 2100; x += 450) {
                el.push({ tipo: 'bancada_alquimia', x: x, y: 400, w: 280, h: 100, colisao: true });
                el.push({ tipo: 'bancada_alquimia', x: x, y: 900, w: 280, h: 100, colisao: true });
                el.push({ tipo: 'bancada_alquimia', x: x, y: 1400, w: 280, h: 100, colisao: true });
            }

            // Prateleiras de Ingredientes com Potes de Vidro
            for (let y = 300; y < 1800; y += 350) {
                el.push({ tipo: 'prateleira_ingredientes', x: 70, y: y, w: 40, h: 220, colisao: true });
                el.push({ tipo: 'prateleira_ingredientes', x: 2290, y: y, w: 40, h: 220, colisao: true });
            }

            // Três Caldeirões Grandes Borbulhantes
            el.push({ tipo: 'caldeirao_borbulhante', x: 800, y: 1800, r: 60, colisao: true, corPocao: '#2ecc71' });
            el.push({ tipo: 'caldeirao_borbulhante', x: 1200, y: 1800, r: 60, colisao: true, corPocao: '#9b59b6' });
            el.push({ tipo: 'caldeirao_borbulhante', x: 1600, y: 1800, r: 60, colisao: true, corPocao: '#e74c3c' });
            inter.push({
                id: 'caldeirao_snape', tipo: 'caldeirao', x: 1200, y: 1800, r: 90,
                label: 'Caldeirão Místico de Poções (Destilar)', icone: '🧪',
                acao: () => this.extrairExtratoPocao()
            });
            inter.push({
                id: 'caldeirao_essencia', tipo: 'caldeirao', x: 1200, y: 1800, r: 90,
                label: 'Caldeirão Místico de Poções (Destilar)', icone: '🧪',
                acao: () => this.extrairExtratoPocao()
            });

            // Parede Secreta da Sonserina
            el.push({ tipo: 'parede_secreta_slytherin', x: 2330, y: 900, w: 70, h: 220, colisao: true });
            inter.push({
                id: 'entrada_slytherin', tipo: 'passagem', x: 2300, y: 1000, r: 90,
                label: 'Parede de Pedra da Sonserina (Sussurrar Senha)', icone: '🐍',
                acao: () => this.abrirEntradaSlytherin()
            });
            inter.push({
                id: 'parede_slytherin', tipo: 'passagem', x: 2300, y: 1000, r: 90,
                label: 'Parede de Pedra da Sonserina (Sussurrar Senha)', icone: '🐍',
                acao: () => this.abrirEntradaSlytherin()
            });

            return { elementos: el, interativos: inter };
        },

        // G. ESTUFAS DE HERBOLOGIA (SPROUT)
        gerarEstufas: function() {
            let el = [], inter = [];
            el.push({ tipo: 'parede_estufa', x: 0, y: 0, w: 2200, h: 60, colisao: true });
            el.push({ tipo: 'parede_estufa', x: 0, y: 1740, w: 2200, h: 60, colisao: true });
            el.push({ tipo: 'parede_estufa', x: 0, y: 0, w: 60, h: 1800, colisao: true });
            el.push({ tipo: 'parede_estufa', x: 2140, y: 0, w: 60, h: 1800, colisao: true });

            // Mesas de Cultivo e Canteiros
            for (let x = 200; x < 2000; x += 350) {
                el.push({ tipo: 'canteiro_herbologia', x: x, y: 250, w: 220, h: 350, colisao: true });
                el.push({ tipo: 'canteiro_herbologia', x: x, y: 850, w: 220, h: 350, colisao: true });
            }

            // Vasos de Mandrágoras Saltitantes
            el.push({ tipo: 'vaso_mandragora', x: 550, y: 1400, w: 60, h: 60, colisao: true });
            inter.push({
                id: 'mandragora_estufa', tipo: 'planta', x: 550, y: 1400, r: 80,
                label: 'Vaso de Mandrágora (Cuidar com Abafadores)', icone: '🪴',
                acao: () => this.cuidarMandragora()
            });

            // Arbusto de Ditamno Puro
            el.push({ tipo: 'arbusto_ditamno', x: 1550, y: 1400, w: 70, h: 70, colisao: true });
            inter.push({
                id: 'ditamno_estufa', tipo: 'planta', x: 1550, y: 1400, r: 80,
                label: 'Arbusto de Ditamno Raro (Colher Folhas)', icone: '🌿',
                acao: () => this.colherDitamno()
            });

            return { elementos: el, interativos: inter };
        },

        // H. CAMPO DE QUADRIBOL
        gerarQuadribol: function() {
            let el = [], inter = [];
            // O Relvado Imparável de Quadribol
            el.push({ tipo: 'marcador_campo', x: 0, y: 0, w: 3600, h: 2400, colisao: false });

            // 6 Aros Dourados Gigantes de Baliza (Três a Norte e Três a Sul)
            el.push({ tipo: 'aro_quadribol', x: 1600, y: 180, r: 40, hAro: 100, colisao: true });
            el.push({ tipo: 'aro_quadribol', x: 1800, y: 150, r: 45, hAro: 120, colisao: true });
            el.push({ tipo: 'aro_quadribol', x: 2000, y: 180, r: 40, hAro: 100, colisao: true });

            el.push({ tipo: 'aro_quadribol', x: 1600, y: 2220, r: 40, hAro: 100, colisao: true });
            el.push({ tipo: 'aro_quadribol', x: 1800, y: 2250, r: 45, hAro: 120, colisao: true });
            el.push({ tipo: 'aro_quadribol', x: 2000, y: 2220, r: 40, hAro: 100, colisao: true });

            // 4 Torres Altas de Arquibancada com Cores das Casas
            el.push({ tipo: 'torre_arquibancada', x: 200, y: 800, w: 180, h: 800, casa: 'Gryffindor', cor: '#740001' });
            el.push({ tipo: 'torre_arquibancada', x: 3220, y: 800, w: 180, h: 800, casa: 'Slytherin', cor: '#1a472a' });
            el.push({ tipo: 'torre_arquibancada', x: 1000, y: 50, w: 500, h: 80, casa: 'Ravenclaw', cor: '#0e1a40' });
            el.push({ tipo: 'torre_arquibancada', x: 2100, y: 50, w: 500, h: 80, casa: 'Hufflepuff', cor: '#ecb939' });

            // Suporte de Vassouras e Baú de Bolas
            el.push({ tipo: 'suporte_vassouras', x: 500, y: 1200, w: 90, h: 45, colisao: true });
            el.push({ tipo: 'bau_quadribol', x: 650, y: 1200, w: 60, h: 40, colisao: true });

            // O Pomo de Ouro Esvoaçante (Interativo)
            inter.push({
                id: 'snitch_quadribol', tipo: 'snitch', x: 1800, y: 1200, r: 90,
                label: 'Pomo de Ouro (Acelerar e Apanhar)', icone: '✨',
                acao: () => this.capturarPomoDeOuro()
            });

            return { elementos: el, interativos: inter };
        },

        // I. CABANA DO HAGRID & TERRENOS
        gerarCabanaHagrid: function() {
            let el = [], inter = [];
            // Cabana redonda de pedra do Hagrid
            el.push({ tipo: 'cabana_pedra', x: 700, y: 700, r: 260, colisao: true, forma: 'circulo' });
            el.push({ tipo: 'chamine_fumegante', x: 820, y: 620, w: 60, h: 60, colisao: false });
            el.push({ tipo: 'poltrona_hagrid', x: 650, y: 680, w: 80, h: 80, colisao: true });

            // Canteiro de Abóboras Gigantes
            for (let i = 0; i < 16; i++) {
                let px = 1400 + (i % 4) * 160 + (Math.sin(i) * 30);
                let py = 500 + Math.floor(i / 4) * 160 + (Math.cos(i) * 30);
                el.push({ tipo: 'abobora_gigante', x: px, y: py, r: 40 + (i % 3)*15, colisao: true, forma: 'circulo' });
            }

            // Espantalho e Barris
            el.push({ tipo: 'espantalho', x: 1650, y: 400, w: 60, h: 80, colisao: true });
            el.push({ tipo: 'barril_carvalho', x: 1050, y: 800, w: 50, h: 50, colisao: true });

            // Bolinhos de Pedra do Hagrid (Interativo)
            inter.push({
                id: 'bolinho_hagrid', tipo: 'comida', x: 720, y: 750, r: 90,
                label: 'Bandeja de Bolinhos de Pedra do Hagrid (Provar)', icone: '🥮',
                acao: () => this.provarBolinhoHagrid()
            });

            return { elementos: el, interativos: inter };
        },

        // J. TORRE DE ASTRONOMIA
        gerarTorreAstronomia: function() {
            let el = [], inter = [];
            // Mirante circular a céu aberto
            el.push({ tipo: 'baluarte_torre', x: 1100, y: 1100, r: 650, colisao: false, forma: 'circulo' });
            el.push({ tipo: 'muralha_circular', x: 1100, y: 1100, r: 680, espessura: 40, colisao: true });

            // O Grande Telescópio de Latão
            el.push({ tipo: 'telescopio_grande', x: 1100, y: 1100, w: 140, h: 80, colisao: true });
            inter.push({
                id: 'telescopio_astronomia', tipo: 'telescopio', x: 1100, y: 1100, r: 120,
                label: 'Grande Telescópio Astral (Observar Constelações)', icone: '🔭',
                acao: () => this.observarConstelacoes()
            });

            // Esfera Armilar e Mesas de Cartografia Celeste
            el.push({ tipo: 'esfera_armilar', x: 800, y: 900, r: 60, colisao: true });
            el.push({ tipo: 'mesa_astronomia', x: 1400, y: 900, w: 120, h: 70, colisao: true });
            el.push({ tipo: 'mesa_astronomia', x: 900, y: 1350, w: 120, h: 70, colisao: true });

            return { elementos: el, interativos: inter };
        },

        // K. SALA COMUNAL DE GRYFFINDOR
        gerarComunalGryffindor: function() {
            let el = [], inter = [];
            el.push({ tipo: 'parede_pedra', x: 0, y: 0, w: 1800, h: 60, cor: '#4a1215', colisao: true });
            el.push({ tipo: 'parede_pedra', x: 0, y: 1540, w: 1800, h: 60, cor: '#4a1215', colisao: true });
            el.push({ tipo: 'parede_pedra', x: 0, y: 0, w: 60, h: 1600, cor: '#4a1215', colisao: true });
            el.push({ tipo: 'parede_pedra', x: 1740, y: 0, w: 60, h: 1600, cor: '#4a1215', colisao: true });

            // Lareira Crepitante e Sofás Escarlates
            el.push({ tipo: 'lareira_monumental', x: 800, y: 60, w: 200, h: 120, colisao: true });
            el.push({ tipo: 'sofa_comunal', x: 700, y: 350, w: 160, h: 70, cor: '#8a0b0c', colisao: true });
            el.push({ tipo: 'sofa_comunal', x: 940, y: 350, w: 160, h: 70, cor: '#8a0b0c', colisao: true });
            el.push({ tipo: 'poltrona_veludo', x: 600, y: 450, w: 70, h: 70, cor: '#8a0b0c', colisao: true });
            el.push({ tipo: 'poltrona_veludo', x: 1130, y: 450, w: 70, h: 70, cor: '#8a0b0c', colisao: true });

            // Tapete Dourado do Leão
            el.push({ tipo: 'tapete_casa', x: 680, y: 220, w: 440, h: 320, cor: '#d4af37' });

            // Tabuleiro de Xadrez de Bruxo
            el.push({ tipo: 'mesa_xadrez', x: 350, y: 800, w: 80, h: 80, colisao: true });

            // Retrato da Mulher Gorda (IA)
            el.push({ tipo: 'quadro_mulher_gorda', x: 60, y: 700, w: 30, h: 140, colisao: true });
            inter.push({
                id: 'mulher_gorda', tipo: 'quadro_ia', x: 120, y: 770, r: 85,
                label: 'A Mulher Gorda (Pedir Senha e Bênção com IA)', icone: '🖼️',
                acao: () => this.abrirDialogoIA('A Mulher Gorda', 'Sala Comunal de Gryffindor', 'Ninguém entra na torre sem a senha de hoje! Cantas uma ópera comigo ou dizes a palavra mágica?')
            });

            return { elementos: el, interativos: inter };
        },

        // L. SALA COMUNAL DE SLYTHERIN
        gerarComunalSlytherin: function() {
            let el = [], inter = [];
            el.push({ tipo: 'parede_ardosia', x: 0, y: 0, w: 1800, h: 60, cor: '#0a1a0f', colisao: true });
            el.push({ tipo: 'parede_ardosia', x: 0, y: 1540, w: 1800, h: 60, cor: '#0a1a0f', colisao: true });
            el.push({ tipo: 'parede_ardosia', x: 0, y: 0, w: 60, h: 1600, cor: '#0a1a0f', colisao: true });
            el.push({ tipo: 'parede_ardosia', x: 1740, y: 0, w: 60, h: 1600, cor: '#0a1a0f', colisao: true });

            // Janelas Submarinas com vista para as profundezas do Lago Negro
            el.push({ tipo: 'janela_lago_negro', x: 400, y: 60, w: 1000, h: 80, colisao: true });
            inter.push({
                id: 'lula_gigante', tipo: 'lago', x: 900, y: 120, r: 120,
                label: 'Janela Submarina (Observar a Lula Gigante)', icone: '🦑',
                acao: () => this.observarLulaGigante()
            });

            // Lareira de Mármore Negro com Chamas Verdes
            el.push({ tipo: 'lareira_verde', x: 1740, y: 700, w: 60, h: 200, colisao: true });
            el.push({ tipo: 'sofa_couro', x: 1450, y: 650, w: 80, h: 160, cor: '#0d2818', colisao: true });
            el.push({ tipo: 'sofa_couro', x: 1450, y: 850, w: 80, h: 160, cor: '#0d2818', colisao: true });

            // Tapeçaria de Salazar Slytherin
            el.push({ tipo: 'estandarte_casa', x: 200, y: 300, w: 90, h: 180, casa: 'Slytherin' });

            return { elementos: el, interativos: inter };
        },

        // M. SALA COMUNAL DE RAVENCLAW
        gerarComunalRavenclaw: function() {
            let el = [], inter = [];
            el.push({ tipo: 'parede_pedra', x: 0, y: 0, w: 1800, h: 60, cor: '#0c1a2d', colisao: true });
            el.push({ tipo: 'parede_pedra', x: 0, y: 1540, w: 1800, h: 60, cor: '#0c1a2d', colisao: true });
            el.push({ tipo: 'parede_pedra', x: 0, y: 0, w: 60, h: 1600, cor: '#0c1a2d', colisao: true });
            el.push({ tipo: 'parede_pedra', x: 1740, y: 0, w: 60, h: 1600, cor: '#0c1a2d', colisao: true });

            // Estátua de Mármore Branco de Rowena Ravenclaw com Diadema
            el.push({ tipo: 'estatua_rowena', x: 900, y: 300, w: 70, h: 70, colisao: true });
            inter.push({
                id: 'estatua_rowena_ia', tipo: 'estatua_ia', x: 900, y: 300, r: 90,
                label: 'Estátua de Rowena Ravenclaw (Enigma com IA)', icone: '🦅',
                acao: () => this.abrirDialogoIA('Rowena Ravenclaw', 'Comunal de Ravenclaw', 'O espírito sem limites é o maior tesouro do homem. Decifra o enigma que tenho para a tua mente...')
            });

            // Estantes de Livros Raros e Mesas de Leitura
            el.push({ tipo: 'estante_livros', x: 120, y: 200, w: 120, h: 500, colisao: true });
            el.push({ tipo: 'estante_livros', x: 1560, y: 200, w: 120, h: 500, colisao: true });

            return { elementos: el, interativos: inter };
        },

        // N. SALA COMUNAL DE HUFFLEPUFF
        gerarComunalHufflepuff: function() {
            let el = [], inter = [];
            el.push({ tipo: 'parede_madeira', x: 0, y: 0, w: 1800, h: 60, cor: '#3a2d13', colisao: true });
            el.push({ tipo: 'parede_madeira', x: 0, y: 1540, w: 1800, h: 60, cor: '#3a2d13', colisao: true });
            el.push({ tipo: 'parede_madeira', x: 0, y: 0, w: 60, h: 1600, cor: '#3a2d13', colisao: true });
            el.push({ tipo: 'parede_madeira', x: 1740, y: 0, w: 60, h: 1600, cor: '#3a2d13', colisao: true });

            // Paredes arredondadas como tocas de texugo e barris
            for (let x = 300; x < 1600; x += 300) {
                el.push({ tipo: 'barril_carvalho', x: x, y: 120, w: 70, h: 70, colisao: true });
                el.push({ tipo: 'planta_suspensa', x: x + 100, y: 140, r: 35, colisao: false });
            }

            // Sofás Amarelos e Lareira Aconchegante de Cobre
            el.push({ tipo: 'sofa_amarelo', x: 700, y: 700, w: 160, h: 70, cor: '#ecb939', colisao: true });
            el.push({ tipo: 'sofa_amarelo', x: 940, y: 700, w: 160, h: 70, cor: '#ecb939', colisao: true });

            // Barril de Hidromel Quente (Interativo)
            inter.push({
                id: 'hidromel_hufflepuff', tipo: 'bebida', x: 900, y: 150, r: 85,
                label: 'Barril de Hidromel Quente (Beber Caneca)', icone: '🍯',
                acao: () => this.beberHidromel()
            });

            return { elementos: el, interativos: inter };
        },

        // O. COZINHAS DE HOGWARTS
        gerarCozinhas: function() {
            let el = [], inter = [];
            el.push({ tipo: 'parede_pedra', x: 0, y: 0, w: 2000, h: 60, cor: '#22150c', colisao: true });
            el.push({ tipo: 'parede_pedra', x: 0, y: 1740, w: 2000, h: 60, cor: '#22150c', colisao: true });
            el.push({ tipo: 'parede_pedra', x: 0, y: 0, w: 60, h: 1800, cor: '#22150c', colisao: true });
            el.push({ tipo: 'parede_pedra', x: 1940, y: 0, w: 60, h: 1800, cor: '#22150c', colisao: true });

            // 4 Mesas Gigantes que espelham as do Salão Principal
            for (let x = 250; x < 1800; x += 420) {
                el.push({ tipo: 'mesa_cozinha', x: x, y: 350, w: 200, h: 1000, colisao: true });
            }

            // Forno Monumental de Pão e Empadões
            el.push({ tipo: 'forno_tijolos', x: 850, y: 70, w: 300, h: 120, colisao: true });

            // Quadro da Pêra que dá cócegas
            el.push({ tipo: 'quadro_pera', x: 60, y: 800, w: 25, h: 120, colisao: true });
            inter.push({
                id: 'pera_cozinhas', tipo: 'quadro', x: 100, y: 860, r: 80,
                label: 'Quadro da Pêra (Fazer Cócegas)', icone: '🍐',
                acao: () => this.cocegasNaPera()
            });

            return { elementos: el, interativos: inter };
        },

        // P. BANHEIRO DA MURTA QUE GEME
        gerarBanheiroMurta: function() {
            let el = [], inter = [];
            el.push({ tipo: 'parede_azulejo', x: 0, y: 0, w: 1600, h: 60, cor: '#1a2228', colisao: true });
            el.push({ tipo: 'parede_azulejo', x: 0, y: 1340, w: 1600, h: 60, cor: '#1a2228', colisao: true });
            el.push({ tipo: 'parede_azulejo', x: 0, y: 0, w: 60, h: 1400, cor: '#1a2228', colisao: true });
            el.push({ tipo: 'parede_azulejo', x: 1540, y: 0, w: 60, h: 1400, cor: '#1a2228', colisao: true });

            // Círculo central de pias antigas de cobre
            el.push({ tipo: 'pia_circular_murta', x: 800, y: 700, r: 160, colisao: true, forma: 'circulo' });

            // Torneira de Cobre da Serpente (Entrada Secreta da Câmara)
            inter.push({
                id: 'torneira_serpente', tipo: 'torneira', x: 800, y: 700, r: 90,
                label: 'Torneira da Serpente (Sussurrar em Ofidioglossia)', icone: '🐍',
                acao: () => this.abrirDialogoIA('Torneira de Salazar Slytherin', 'Banheiro da Murta', 'A pequena serpente de cobre brilha fracamente na torneira... O que sussurras em língua de cobra?')
            });

            return { elementos: el, interativos: inter };
        },

        // Q. A LENDÁRIA SALA PRECISA (ROOM OF REQUIREMENT)
        gerarSalaPrecisa: function() {
            let el = [], inter = [];
            el.push({ tipo: 'parede_pedra', x: 0, y: 0, w: 2000, h: 70, cor: '#2d1b38', colisao: true });
            el.push({ tipo: 'parede_pedra', x: 0, y: 1930, w: 2000, h: 70, cor: '#2d1b38', colisao: true });
            el.push({ tipo: 'parede_pedra', x: 0, y: 0, w: 70, h: 2000, cor: '#2d1b38', colisao: true });
            el.push({ tipo: 'parede_pedra', x: 1930, y: 0, w: 70, h: 2000, cor: '#2d1b38', colisao: true });

            // Pilhas colossais de móveis mágicos, armaduras e relíquias perdidas
            el.push({ tipo: 'pilha_reliquias', x: 200, y: 200, w: 400, h: 350, colisao: true });
            el.push({ tipo: 'pilha_reliquias', x: 1400, y: 200, w: 400, h: 350, colisao: true });
            el.push({ tipo: 'pilha_reliquias', x: 200, y: 1400, w: 400, h: 350, colisao: true });
            el.push({ tipo: 'pilha_reliquias', x: 1400, y: 1400, w: 400, h: 350, colisao: true });

            // Altar de Prática Mágica
            el.push({ tipo: 'boneco_treino', x: 1000, y: 600, w: 60, h: 80, colisao: true });

            // O Grande Baú dos Desejos Perdidos
            el.push({ tipo: 'bau_lendario', x: 970, y: 1000, w: 80, h: 50, colisao: true });
            inter.push({
                id: 'bau_sala_precisa', tipo: 'bau_lendario', x: 1000, y: 1020, r: 100,
                label: 'O Baú das Coisas Perdidas (Abrir)', icone: '💎',
                acao: () => this.abrirBauSecreto('bau_sala_precisa', 100, '✨ Relíquia Lendária de Hogwarts & 100 Galeões!')
            });

            // Espelho de Ojesed (Interativo com IA sobre Guarda-Roupa)
            el.push({ tipo: 'espelho_ojesed', x: 1000, y: 200, w: 80, h: 140, colisao: true });
            inter.push({
                id: 'espelho_ojesed_ia', tipo: 'espelho_ia', x: 1000, y: 240, r: 90,
                label: 'Espelho de Ojesed (Olhar o Teu Reflexo com IA)', icone: '🪞',
                acao: () => {
                    let d = this.obterDadosJogador(false);
                    let traje = d.equipamentos?.corpo?.nome || "Vestes de Hogwarts";
                    this.abrirDialogoIA('O Espelho de Ojesed', 'Sala Precisa', `O espelho reflete a tua imagem vestindo [${traje}] com o título de [${d.tituloEquipado || 'Estudante'}]. Que anseio mais profundo vês na névoa dourada?`);
                }
            });

            return { elementos: el, interativos: inter };
        },

        // ----------------------------------------------------------------------
        // 2. OBTENÇÃO ROBUSTA DOS DADOS DO JOGADOR & GUARDA-ROUPA
        // ----------------------------------------------------------------------
        obterDadosJogador: function(isRemote, rp) {
            if (isRemote && rp) return rp;

            let local = null;
            if (typeof window.obterMeuBruxo === 'function') {
                try { local = window.obterMeuBruxo(); } catch(e){}
            }
            if (!local && window.meuBruxo) local = window.meuBruxo;
            if (!local && typeof meuBruxo !== 'undefined') local = meuBruxo;
            if (!local && window.alunoAtual) local = window.alunoAtual;

            if (local) return local;

            // Fallback elegante e canônico garantindo que NUNCA fique invisível
            return {
                nome: "Tu",
                casa: "Gryffindor",
                equipamentos: {
                    corpo: { nome: "Vestes de Hogwarts", visual: { cor1: "#1b1b22", cor2: "#8a0b0c" } },
                    cabeca: null,
                    pescoco: { nome: "Cachecol de Gryffindor", visual: { cor1: "#8a0b0c", cor2: "#d4af37" } },
                    varinha: { nome: "Varinha de Nogueira", visual: { corMadeira: "#5c4033" } }
                },
                tituloEquipado: "Caloiro de Hogwarts"
            };
        },

        // ----------------------------------------------------------------------
        // 3. RENDERIZADOR COMPLETO DO MODELO DE PERSONAGEM (AVATAR 2D CANÔNICO)
        // ----------------------------------------------------------------------
        drawAnimeWizard: function(ctx, x, y, scale, tick, atkProgress, atkColor, isHurt, equipamentos, house) {
            // 🛡️ BLINDAGEM: Garante que os números nunca quebram o Canvas
            x = Number(x) || 0; y = Number(y) || 0; scale = Number(scale) || 1;
            tick = Number(tick) || 0; atkProgress = Number(atkProgress) || 0;

            let eq = equipamentos || {};
            let eCorpo = eq.corpo || {}; let eCabeca = eq.cabeca || {}; let ePescoco = eq.pescoco || {};

            // Cores oficiais das Casas de Hogwarts para vestes padrão
            let defaultCorpo1 = "#1c1924", defaultCorpo2 = "#740001";
            let defaultScarf1 = "#740001", defaultScarf2 = "#d4af37";
            if (house === 'Slytherin') {
                defaultCorpo1 = "#141c16"; defaultCorpo2 = "#1a472a";
                defaultScarf1 = "#1a472a"; defaultScarf2 = "#bdc3c7";
            } else if (house === 'Ravenclaw') {
                defaultCorpo1 = "#141828"; defaultCorpo2 = "#0e1a40";
                defaultScarf1 = "#0e1a40"; defaultScarf2 = "#b9770e";
            } else if (house === 'Hufflepuff') {
                defaultCorpo1 = "#1e1c14"; defaultCorpo2 = "#ecb939";
                defaultScarf1 = "#ecb939"; defaultScarf2 = "#2c3e50";
            }

            let robeCor1 = (eCorpo.visual && eCorpo.visual.cor1) ? eCorpo.visual.cor1 : defaultCorpo1;
            let robeCor2 = (eCorpo.visual && eCorpo.visual.cor2) ? eCorpo.visual.cor2 : defaultCorpo2;
            let hatCor = (eCabeca.visual && eCabeca.visual.cor1) ? eCabeca.visual.cor1 : null;
            let scarfCor1 = (ePescoco.visual && ePescoco.visual.cor1) ? ePescoco.visual.cor1 : defaultScarf1;
            let scarfCor2 = (ePescoco.visual && ePescoco.visual.cor2) ? ePescoco.visual.cor2 : defaultScarf2;

            ctx.save();
            ctx.translate(x, y);
            ctx.scale(scale, scale);

            const breath = Math.sin(tick * 3) * 2;
            let wind = Math.sin(tick * 5) * 5;
            
            let armAngle = Math.sin(tick * 2) * 0.1; 
            let backArmAngle = Math.cos(tick * 2) * 0.1; 
            let bodyLean = 0;
            let wandGlow = 0;
            let isStriking = false; 

            if (atkProgress > 0) {
                if (atkProgress > 0.7) {
                    let p = (atkProgress - 0.7) / 0.3; 
                    armAngle = Math.PI / 3 * (1 - p); 
                    backArmAngle = -Math.PI / 4 * (1 - p); 
                    bodyLean = -10 * (1 - p); 
                    wind -= 10; wandGlow = 10; 
                } else if (atkProgress > 0.4) {
                    let p = (atkProgress - 0.4) / 0.3; 
                    let snap = Math.pow(1 - p, 4); 
                    armAngle = (Math.PI / 3) - (Math.PI * 0.8 * snap); 
                    backArmAngle = -Math.PI / 4 + (Math.PI / 2 * snap); 
                    bodyLean = -10 + (35 * snap); 
                    wind += 40 * snap; wandGlow = 25; isStriking = true; 
                } else {
                    let p = atkProgress / 0.4; 
                    armAngle = -Math.PI * 0.46 * p; 
                    backArmAngle = Math.PI / 4 * p;
                    bodyLean = 25 * p; wind += 40 * p; wandGlow = 15 * p;
                }
            }

            if (isHurt) { bodyLean = -15; } 

            const skin = "#fcd5b5";
            ctx.rotate((bodyLean) * Math.PI / 180); 

            // Capa de trás
            ctx.fillStyle = robeCor2;
            ctx.beginPath();
            ctx.moveTo(-15, 20);
            ctx.quadraticCurveTo(-40 + wind, 70, -35 + wind * 1.5, 105 - (bodyLean * 0.5));
            ctx.lineTo(20 + wind, 100);
            ctx.quadraticCurveTo(15, 70, 15, 20);
            ctx.fill();

            // Braço de trás
            ctx.save();
            ctx.translate(-10, 25 + breath);
            ctx.rotate(backArmAngle);
            ctx.fillStyle = robeCor1;
            ctx.beginPath(); 
            if (ctx.roundRect) ctx.roundRect(-8, 0, 14, 35, 5); else ctx.rect(-8, 0, 14, 35);
            ctx.fill(); 
            ctx.fillStyle = skin;
            ctx.beginPath(); ctx.arc(0, 38, 5, 0, Math.PI * 2); ctx.fill(); 
            ctx.restore();

            // Corpo
            ctx.fillStyle = robeCor1;
            ctx.beginPath();
            ctx.moveTo(-12, 15 + breath); ctx.lineTo(12, 15 + breath);  
            ctx.lineTo(20, 90 + breath); ctx.lineTo(-20, 90 + breath); 
            ctx.closePath(); ctx.fill();
            ctx.strokeStyle = "#d4af37"; ctx.lineWidth = 2;
            ctx.beginPath(); ctx.moveTo(0, 15 + breath); ctx.lineTo(0, 80 + breath); ctx.stroke();

            // Cachecol
            if (ePescoco && ePescoco.visual) {
                let v = ePescoco.visual;
                ctx.fillStyle = v.cor1 || scarfCor1 || "#740001";
                let corDetalhe = v.cor2 || scarfCor2 || "#d4af37";
                
                // Gola grossa no pescoço
                ctx.beginPath(); 
                if (ctx.roundRect) ctx.roundRect(-14, 12 + breath, 28, 12, 5); else ctx.rect(-14, 12 + breath, 28, 12);
                ctx.fill();
                
                // Cauda do cachecol a bater com o vento
                ctx.beginPath(); 
                ctx.moveTo(10, 20 + breath); 
                ctx.quadraticCurveTo(20 + wind, 40, 15 + wind * 1.5, 60); 
                ctx.lineTo(5 + wind * 1.2, 55); 
                ctx.fill();
                
                // Riscas de textura no cachecol
                ctx.strokeStyle = corDetalhe; 
                ctx.lineWidth = 3;
                ctx.beginPath(); 
                ctx.moveTo(-8, 12 + breath); ctx.lineTo(-8, 24 + breath); 
                ctx.moveTo(0, 12 + breath); ctx.lineTo(0, 24 + breath); 
                ctx.moveTo(8, 12 + breath); ctx.lineTo(8, 24 + breath); 
                ctx.stroke();
            } else if (scarfCor1) {
                ctx.fillStyle = scarfCor1;
                ctx.beginPath(); 
                if (ctx.roundRect) ctx.roundRect(-14, 12 + breath, 28, 12, 5); else ctx.rect(-14, 12 + breath, 28, 12);
                ctx.fill();
                ctx.beginPath(); ctx.moveTo(10, 20 + breath); ctx.quadraticCurveTo(20 + wind, 40, 15 + wind * 1.5, 60); ctx.lineTo(5 + wind * 1.2, 55); ctx.fill();
                ctx.strokeStyle = scarfCor2; ctx.lineWidth = 3;
                ctx.beginPath(); ctx.moveTo(-8, 12 + breath); ctx.lineTo(-8, 24 + breath); ctx.moveTo(0, 12 + breath); ctx.lineTo(0, 24 + breath); ctx.moveTo(8, 12 + breath); ctx.lineTo(8, 24 + breath); ctx.stroke();
            }

            // Cabeça
            ctx.fillStyle = skin;
            ctx.beginPath(); ctx.arc(0, 0 + breath * 0.5, 22, 0, Math.PI * 2); ctx.fill();
            
            // Olhos expressivos estilo anime
            ctx.fillStyle = "#fff";
            let eyeOffsetX = (atkProgress > 0 && atkProgress < 0.8) ? 4 : 0; 
            ctx.beginPath(); ctx.ellipse(-8 + eyeOffsetX, -2 + breath * 0.5, 5, 8, 0, 0, Math.PI * 2); ctx.fill(); 
            ctx.beginPath(); ctx.ellipse(8 + eyeOffsetX, -2 + breath * 0.5, 5, 8, 0, 0, Math.PI * 2); ctx.fill();  
            ctx.fillStyle = "#111";
            ctx.beginPath(); ctx.arc(-7 + eyeOffsetX, -2 + breath * 0.5, 3, 0, Math.PI * 2); ctx.fill();
            ctx.beginPath(); ctx.arc(9 + eyeOffsetX, -2 + breath * 0.5, 3, 0, Math.PI * 2); ctx.fill();
            
            if (isHurt) { 
                ctx.fillStyle = skin; ctx.fillRect(-15, -12, 30, 20);
                ctx.strokeStyle = "#111"; ctx.lineWidth = 2;
                ctx.beginPath(); ctx.moveTo(-12, -4 + breath * 0.5); ctx.lineTo(-4, 0 + breath * 0.5); ctx.lineTo(-12, 4 + breath * 0.5); ctx.stroke();
                ctx.beginPath(); ctx.moveTo(12, -4 + breath * 0.5); ctx.lineTo(4, 0 + breath * 0.5); ctx.lineTo(12, 4 + breath * 0.5); ctx.stroke();
            }

            // Chapéu / Cabelo
            if (eCabeca && eCabeca.visual && eCabeca.visual.cor1) {
                let v = eCabeca.visual;
                ctx.fillStyle = v.cor1 || "#3e2723";
                ctx.strokeStyle = v.cor2 || "#111";
                ctx.lineWidth = 1.5;

                // Aba do Chapéu
                ctx.beginPath(); 
                ctx.ellipse(0, -15 + breath * 0.5, 34, 8, 0, 0, Math.PI * 2); 
                ctx.fill(); 
                ctx.stroke();
                
                // Cone Mágico
                ctx.beginPath(); 
                ctx.moveTo(-15, -15 + breath * 0.5); 
                
                if (v.estilo === "pontudo") {
                    ctx.lineTo(0, -85); 
                } else if (v.estilo === "caido" || v.estilo === "sombrio") {
                    ctx.quadraticCurveTo(-10 + wind, -40, 35 + wind, -20); 
                } else if (v.estilo === "aristocrata") {
                    ctx.lineTo(-12, -45); ctx.lineTo(12, -45);
                } else {
                    ctx.quadraticCurveTo(0 + wind, -60, 20 + wind, -75); 
                }
                
                ctx.lineTo(15, -15 + breath * 0.5); 
                ctx.fill(); 
                ctx.stroke();

                // Detalhes Rúnicos ou Listrados
                if (v.estilo === "runico") {
                    ctx.fillStyle = v.cor2 || "#d4af37";
                    ctx.font = "bold 12px Cinzel, serif";
                    ctx.fillText("ᛟ", -4, -35);
                    ctx.fillText("ᚦ", 6, -22);
                } else if (v.estilo === "listrado") {
                    ctx.strokeStyle = v.cor2 || "#d4af37";
                    ctx.beginPath(); ctx.moveTo(-10, -30); ctx.lineTo(10, -30); ctx.stroke();
                    ctx.beginPath(); ctx.moveTo(-5, -45); ctx.lineTo(15, -45); ctx.stroke();
                }

            } else if (hatCor) {
                ctx.fillStyle = hatCor;
                ctx.beginPath(); ctx.ellipse(0, -15 + breath * 0.5, 30, 8, 0, 0, Math.PI * 2); ctx.fill(); 
                ctx.beginPath(); ctx.moveTo(-15, -15 + breath * 0.5); ctx.quadraticCurveTo(0 + wind, -60, 20 + wind, -70); ctx.lineTo(15, -15 + breath * 0.5); ctx.fill(); 
            } else {
                // Cabelo Anime sem chapéu
                ctx.fillStyle = "#3e2723";
                ctx.beginPath(); ctx.arc(0, -5 + breath * 0.5, 23, Math.PI, 0); 
                ctx.moveTo(23, -5 + breath * 0.5); ctx.lineTo(30 + wind * 0.2, 5 + breath * 0.5); ctx.lineTo(15, -15 + breath * 0.5);
                ctx.moveTo(-23, -5 + breath * 0.5); ctx.lineTo(-30 + wind * 0.2, 5 + breath * 0.5); ctx.lineTo(-15, -15 + breath * 0.5);
                ctx.fill();
            }

            // Braço da Varinha
            ctx.save();
            ctx.translate(15, 25 + breath);
            ctx.rotate(armAngle);
            
            if (isStriking) {
                ctx.fillStyle = atkColor || "#fff";
                ctx.globalAlpha = 0.3;
                ctx.beginPath();
                ctx.moveTo(1, 60); ctx.arc(1, 10, 50, Math.PI / 2, Math.PI, false); ctx.lineTo(1, 30);
                ctx.fill();
                ctx.globalAlpha = 1.0;
            }

            ctx.fillStyle = robeCor1;
            ctx.beginPath(); 
            if (ctx.roundRect) ctx.roundRect(-6, 0, 14, 32, 5); else ctx.rect(-6, 0, 14, 32);
            ctx.fill(); 
            ctx.fillStyle = skin;
            ctx.beginPath(); ctx.arc(1, 34, 5, 0, Math.PI * 2); ctx.fill(); 
            
            let eVar = eq.varinha || {};
            if (eVar.visual) {
                let cMad = eVar.visual.corMadeira || '#6C4E3D';
                let cCab = eVar.visual.corCabo || '#2A1F1D';
                
                ctx.save();
                ctx.translate(1, 35); 
                ctx.rotate(Math.PI / 2); 
                ctx.scale(0.3, 0.3); 
                
                ctx.fillStyle = cCab;
                ctx.beginPath(); 
                if (ctx.roundRect) ctx.roundRect(-15, -4, 35, 8, 3); else ctx.rect(-15, -4, 35, 8);
                ctx.fill();
                ctx.fillStyle = '#D4AF37'; ctx.fillRect(15, -4, 4, 8); 
                
                let grad = ctx.createLinearGradient(20, -3, 110, 3);
                if (grad && grad.addColorStop) {
                    grad.addColorStop(0, cMad); grad.addColorStop(0.5, '#1e0e09'); grad.addColorStop(1, cMad);
                    ctx.fillStyle = grad;
                } else {
                    ctx.fillStyle = cMad;
                }
                ctx.beginPath(); ctx.moveTo(20, -3); ctx.lineTo(110, -1); ctx.lineTo(110, 1); ctx.lineTo(20, 3); ctx.fill();
                ctx.restore();
            } else {
                ctx.strokeStyle = "#5C4033"; ctx.lineWidth = 3; ctx.lineCap = "round";
                ctx.beginPath(); ctx.moveTo(1, 35); ctx.lineTo(1, 65); ctx.stroke();
            }
            
            let tipGlow = wandGlow > 0 ? wandGlow : (3 + Math.sin(tick * 4) * 1.5);
            ctx.fillStyle = atkColor || "#d4af37"; 
            ctx.shadowColor = atkColor || "#d4af37"; ctx.shadowBlur = 15;
            ctx.beginPath(); ctx.arc(1, 65, 3 + (tipGlow * 0.2), 0, Math.PI * 2); ctx.fill();
            ctx.shadowBlur = 0;

            ctx.restore();
            ctx.restore();
        },

        drawWalkableWizard: function(ctx, x, y, dir, isMoving, tickCount, isLocal, alunoData) {
            ctx.save();
            ctx.translate(x, y);

            let eq = alunoData.equipamentos || {};
            let casa = alunoData.casa || 'Gryffindor';

            const paletasCasas = {
                'Gryffindor': { crachá: '🦁', detalhe: '#d4af37' },
                'Slytherin':  { crachá: '🐍', detalhe: '#bdc3c7' },
                'Ravenclaw':  { crachá: '🦅', detalhe: '#b9770e' },
                'Hufflepuff': { crachá: '🦡', detalhe: '#ecb939' }
            };
            const paleta = paletasCasas[casa] || paletasCasas['Gryffindor'];

            // 1. Sombra suave de contato no chão
            ctx.fillStyle = "rgba(0, 0, 0, 0.45)";
            ctx.beginPath();
            ctx.ellipse(0, 22, 18, 6, 0, 0, Math.PI * 2);
            ctx.fill();

            // 2. Anel de destaque dourado sutil do jogador local
            if (isLocal) {
                ctx.strokeStyle = "rgba(241, 196, 15, 0.45)";
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.ellipse(0, 22, 22, 7, 0, 0, Math.PI * 2);
                ctx.stroke();
            }

            // Animação de caminhada e respiração
            let bob = isMoving ? Math.sin(tickCount * 0.45) * 2.5 : Math.sin(tickCount * 0.08) * 1.0;
            let step = isMoving ? Math.sin(tickCount * 0.45) * 7 : 0;

            // 3. Botas de couro sob a barra da veste (passos alternados ritmados)
            ctx.fillStyle = "#1b140e";
            ctx.beginPath(); 
            if (ctx.roundRect) ctx.roundRect(-8 + step, 16, 7, 6, 2); else ctx.rect(-8 + step, 16, 7, 6);
            ctx.fill();
            ctx.beginPath(); 
            if (ctx.roundRect) ctx.roundRect(1 - step, 16, 7, 6, 2); else ctx.rect(1 - step, 16, 7, 6);
            ctx.fill();

            // 4. Desenho do Modelo Canônico de Bruxo Anime (com vento, respiração, vestes e guarda-roupa)
            ctx.save();
            ctx.scale(dir || 1, 1);
            let animTick = (tickCount * 0.04);
            let drawFn = (typeof window !== 'undefined' && typeof window.drawAnimeWizard === 'function')
                ? window.drawAnimeWizard
                : (typeof global !== 'undefined' && typeof global.drawAnimeWizard === 'function')
                    ? global.drawAnimeWizard
                    : this.drawAnimeWizard;

            if (typeof drawFn === 'function') {
                drawFn(ctx, 0, -35 + bob, 0.62, animTick, 0, null, false, eq, casa);
            }
            ctx.restore();

            // 5. Identificação Superior (Nome, Brasão & Título)
            let nomeTxt = alunoData.nome || "Tu";
            let corNome = isLocal ? "#f1c40f" : paleta.detalhe;
            ctx.fillStyle = corNome;
            ctx.font = "bold 13px 'Cinzel', serif, Arial";
            ctx.textAlign = "center";
            ctx.shadowColor = "#000000"; ctx.shadowBlur = 6;
            ctx.fillText(`${paleta.crachá} ${nomeTxt}`, 0, -92 + bob);

            if (alunoData.tituloEquipado) {
                ctx.fillStyle = "#ffffff";
                ctx.font = "italic 11px 'Cinzel', serif";
                ctx.fillText(`« ${alunoData.tituloEquipado} »`, 0, -106 + bob);
            }
            ctx.shadowBlur = 0;

            ctx.restore();
        },

        // ----------------------------------------------------------------------
        // 4. DIÁLOGOS & MISTÉRIOS INTERATIVOS COM IA
        // ----------------------------------------------------------------------
        abrirDialogoIA: function(npcNome, local, textoInicial) {
            playSFX('magic');
            this.dialogoIAAtivo = {
                npc: npcNome,
                local: local,
                texto: textoInicial,
                aguardando: false
            };

            let modal = document.getElementById('modal-dialogo-mmo');
            if (!modal) {
                modal = document.createElement('div');
                modal.id = 'modal-dialogo-mmo';
                modal.style.cssText = `
                    position: fixed; bottom: 30px; left: 50%; transform: translateX(-50%);
                    width: 90%; max-width: 650px; background: rgba(10, 14, 20, 0.95);
                    border: 2px solid #d4af37; border-radius: 12px; padding: 20px;
                    box-shadow: 0 10px 40px rgba(0,0,0,0.9), inset 0 0 20px rgba(212,175,55,0.15);
                    color: #fff; font-family: 'Cinzel', serif; z-index: 10005;
                `;
                document.body.appendChild(modal);
            }

            modal.innerHTML = `
                <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid #444; padding-bottom:10px; margin-bottom:12px;">
                    <div style="font-size:1.2em; color:#d4af37; font-weight:bold;">✨ ${npcNome} <span style="font-size:0.8em; color:#aaa;">(${local})</span></div>
                    <button onclick="HogwartsMMOEngine.fecharDialogoIA()" style="background:none; border:none; color:#aaa; font-size:1.4em; cursor:pointer;">&times;</button>
                </div>
                <div id="mmo-ia-texto" style="font-size:1.05em; line-height:1.6; color:#eee; min-height:60px; margin-bottom:15px;">
                    "${textoInicial}"
                </div>
                <div style="display:flex; gap:10px;">
                    <input id="mmo-ia-input" type="text" placeholder="Responde ao mistério ou faz uma pergunta mágica..." style="flex:1; background:rgba(0,0,0,0.6); border:1px solid #666; border-radius:6px; padding:10px 14px; color:#fff; font-family:Arial; font-size:0.95em;" onkeydown="if(event.key==='Enter') HogwartsMMOEngine.enviarFalaIA()">
                    <button onclick="HogwartsMMOEngine.enviarFalaIA()" style="background:linear-gradient(to bottom, #d4af37, #997b15); border:none; border-radius:6px; color:#000; font-weight:bold; padding:10px 20px; cursor:pointer; font-family:'Cinzel', serif;">Falar</button>
                </div>
            `;
            modal.style.display = 'block';
            setTimeout(() => {
                let inp = document.getElementById('mmo-ia-input');
                if (inp) inp.focus();
            }, 100);
        },

        enviarFalaIA: async function() {
            let inp = document.getElementById('mmo-ia-input');
            let txtBox = document.getElementById('mmo-ia-texto');
            if (!inp || !inp.value.trim() || !txtBox) return;

            let fala = inp.value.trim();
            inp.value = '';
            txtBox.innerHTML = `<i>A invocar a sabedoria mágica de Hogwarts...</i>`;

            let aluno = this.obterDadosJogador(false);

            try {
                const res = await fetch('/api/castelo/interagir', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        id: aluno.id || 'aluno',
                        zona: window.zonaAtual || 'Salão Principal',
                        acao: `${this.dialogoIAAtivo.npc}: ${fala}`
                    })
                });
                const d = await res.json();
                playSFX('spark');
                txtBox.innerHTML = `"${d.relato || d.msg || 'A magia ecoou pelas paredes de pedra com sabedoria ancestral.'}"`;
            } catch (err) {
                txtBox.innerHTML = `"O arrepio da magia milenar percorre a pedra. O mistério permanece vivo nos teus pensamentos."`;
            }
        },

        fecharDialogoIA: function() {
            let modal = document.getElementById('modal-dialogo-mmo');
            if (modal) modal.style.display = 'none';
            this.dialogoIAAtivo = null;
        },

        usarPassagemSecreta: function(idPassagem, destinoZona, targetX, targetY, mensagem) {
            playSFX('magic');
            mostrarNotificacao(mensagem, "sucesso");
            window.zonaAtual = destinoZona;
            this.player.x = targetX;
            this.player.y = targetY;
            this.transicaoCooldown = 40;
            this.init(true);

            if (global.socket) {
                global.socket.emit('mmo_entrar_zona', {
                    zona: destinoZona,
                    aluno: this.obterDadosJogador(false)
                });
            }
        },

        // ----------------------------------------------------------------------
        // 5. INTERAÇÕES COM MISTÉRIOS DE HOGWARTS
        // ----------------------------------------------------------------------
        interagirFonteDesejos: function() {
            playSFX('magic');
            mostrarNotificacao("⛲ Jogaste uma moeda reluzente no Chafariz dos Desejos! O teu Foco foi completamente restaurado!", "sucesso");
            let a = this.obterDadosJogador(false);
            if (a) a.focoAtual = a.maxFoco || 20;
        },

        conversarComQuadroOuGargula: function(npc, texto) {
            this.abrirDialogoIA(npc, window.zonaAtual || 'Castelo', texto);
        },

        discursarPulpito: function() {
            this.proclamarDiscursoSalao();
        },

        banquetearSalao: function() {
            this.comerBanqueteSalao();
        },

        ativarArmaduraSentinela: function(id) {
            mostrarNotificacao("🛡️ Piertotum Locomotor! A armadura de aço bateu continência e protegeu o perímetro!", "sucesso");
        },

        proclamarDiscursoSalao: function() {
            playSFX('victory');
            let a = this.obterDadosJogador(false);
            let nome = a.nome || "Um Aluno Corajoso";
            mostrarNotificacao(`🦉 Subiste ao Púlpito da Coruja e proclamaste: "Que a glória e a magia de Hogwarts brilhem para sempre!"`, "sucesso");
            if (global.socket) {
                global.socket.emit('mensagem_chat', {
                    canal: 'zona',
                    texto: `🦉 ${nome} proclamou um discurso de honra do Púlpito da Coruja Dourada!`,
                    autor: 'SALÃO PRINCIPAL'
                });
            }
        },

        comerBanqueteSalao: function() {
            playSFX('spark');
            mostrarNotificacao("🍗 Saboreaste o banquete dos Fundadores! Estás Revigorado (+20% Velocidade por 10 minutos)!", "sucesso");
        },

        abrirBauSecreto: function(bauId, galeoes, recompensaMsg) {
            playSFX('chest');
            mostrarNotificacao(`📦 Baú Secreto aberto! ${recompensaMsg}`, "sucesso");
            let a = this.obterDadosJogador(false);
            if (a) a.galeoes = (a.galeoes || 0) + galeoes;
        },

        cocegasNaPera: function() {
            playSFX('spark');
            mostrarNotificacao("🍐 Fizeste cócegas na pêra pintada... Ela deu uma gargalhada aguda e a porta secreta dos Elfos abriu-se!", "sucesso");
            window.zonaAtual = "Cozinhas";
            this.init(true);
        },

        treinarNoBonecoMundo: function() {
            if (typeof window.treinarNoBoneco === 'function') {
                window.treinarNoBoneco('flipendo');
            } else {
                mostrarNotificacao("🎯 Desferiste um feitiço certeiro no boneco de treino! (+25 Maestria)", "sucesso");
            }
        },

        decifrarSecaoReservada: function() {
            mostrarNotificacao("🗝️ Alohomora sussurrado na penumbra! O portão de ferro cedeu suavemente.", "sucesso");
            playSFX('magic');
        },

        extrairExtratoPocao: function() {
            mostrarNotificacao("🧪 Recolheste uma ampola de Essência Borbulhante do caldeirão de Snape!", "sucesso");
            playSFX('spark');
        },

        abrirEntradaSlytherin: function() {
            mostrarNotificacao("🐍 Sussurraste a senha em tom sombrio. A parede deslizou revelando a Masmorra da Sonserina!", "sucesso");
            playSFX('magic');
            window.zonaAtual = "Comunal Slytherin";
            this.init(true);
        },

        cuidarMandragora: function() {
            mostrarNotificacao("🌿 Colocaste os abafadores e replantaste a Mandrágora num vaso maior! (+35 XP Herbologia)", "sucesso");
            playSFX('spark');
        },

        colherDitamno: function() {
            mostrarNotificacao("🌱 Colheste ramos frescos de Ditamno puro para a tua bolsa de poções!", "sucesso");
            playSFX('spark');
        },

        capturarPomoDeOuro: function() {
            mostrarNotificacao("🧹 Aceleras a vassoura e esticas o braço... Pomo de Ouro Capturado! (+20 Pontos para a tua Casa!)", "sucesso");
            playSFX('victory');
            let a = this.obterDadosJogador(false);
            if (global.socket) {
                global.socket.emit('mensagem_chat', {
                    canal: 'zona',
                    texto: `⚡ ${a.nome || 'Um Aluno'} apanhou o Pomo de Ouro no Campo de Quadribol!`,
                    autor: 'ESTÁDIO DE QUADRIBOL'
                });
            }
        },

        provarBolinhoHagrid: function() {
            mostrarNotificacao("🥮 Mordeste o bolinho de pedra do Hagrid. Duro como granito, mas feito com carinho! (+15 Foco)", "info");
        },

        observarConstelacoes: function() {
            mostrarNotificacao("🔭 Alinhaste o telescópio com a constelação de Órion e a Nebulosa de Andrômeda! (+45 XP de Astronomia)", "sucesso");
            playSFX('spark');
        },

        observarLulaGigante: function() {
            mostrarNotificacao("🦑 Um enorme tentáculo encostou-se no vidro do Lago Negro antes de sumir no abismo verde.", "info");
        },

        beberHidromel: function() {
            mostrarNotificacao("🍯 Uma caneca de hidromel com especiarias aqueceu o teu peito. Acolhimento puro da Lufa-Lufa!", "sucesso");
        },

        // ----------------------------------------------------------------------
        // 6. MOTOR DE DESENHO VETORIAL DE OBJETOS & MOBÍLIA
        // ----------------------------------------------------------------------
        drawTile: function(ctx, el) {
            ctx.shadowBlur = 0;

            if (el.tipo === 'parede_pedra' || el.tipo === 'parede_ardosia' || el.tipo === 'parede_madeira' || el.tipo === 'parede_azulejo' || el.tipo === 'parede_estufa') {
                ctx.fillStyle = el.cor || '#111';
                ctx.fillRect(el.x, el.y, el.w, el.h);
                ctx.strokeStyle = "rgba(255,255,255,0.08)";
                ctx.lineWidth = 2;
                ctx.strokeRect(el.x, el.y, el.w, el.h);
            }
            else if (el.tipo === 'fonte_monumental') {
                // Borda de pedra gótica
                ctx.fillStyle = "#333833";
                ctx.beginPath(); ctx.arc(el.x, el.y, el.r, 0, Math.PI * 2); ctx.fill();
                ctx.strokeStyle = "#d4af37"; ctx.lineWidth = 4; ctx.stroke();
                // Água mágica reluzente
                ctx.fillStyle = "#2980b9";
                ctx.beginPath(); ctx.arc(el.x, el.y, el.r - 25, 0, Math.PI * 2); ctx.fill();
                // Ondulações de água
                ctx.fillStyle = "rgba(255,255,255,0.25)";
                ctx.beginPath(); 
                ctx.arc(el.x, el.y, (el.r - 40) * (0.8 + Math.sin(this.tickCount * 0.05)*0.1), 0, Math.PI * 2); 
                ctx.fill();
                // Chafariz central dourado
                ctx.fillStyle = "#d4af37";
                ctx.beginPath(); ctx.arc(el.x, el.y, 35, 0, Math.PI * 2); ctx.fill();
            }
            else if (el.tipo === 'ampulheta_casas') {
                // Ampulheta com gemas reluzentes
                ctx.fillStyle = "#221105";
                ctx.fillRect(el.x, el.y, el.w, el.h);
                ctx.strokeStyle = "#d4af37"; ctx.lineWidth = 3;
                ctx.strokeRect(el.x, el.y, el.w, el.h);
                // Gemas mágicas brilhando
                ctx.fillStyle = el.gema || "#e74c3c";
                ctx.shadowColor = el.gema || "#e74c3c"; ctx.shadowBlur = 15;
                ctx.fillRect(el.x + 15, el.y + 40, el.w - 30, el.h - 80);
                ctx.shadowBlur = 0;
            }
            else if (el.tipo === 'mesa_banquete' || el.tipo === 'mesa_cozinha') {
                ctx.fillStyle = '#2c180e';
                ctx.fillRect(el.x, el.y, el.w, el.h);
                // Trilho de tecido da Casa
                ctx.fillStyle = el.cor || '#8a0b0c';
                ctx.fillRect(el.x + 30, el.y, el.w - 60, el.h);
                // Pratos de ouro e cálices
                ctx.fillStyle = '#f1c40f';
                for (let py = el.y + 30; py < el.y + el.h - 20; py += 55) {
                    ctx.beginPath(); ctx.arc(el.x + 15, py, 10, 0, Math.PI * 2); ctx.fill();
                    ctx.beginPath(); ctx.arc(el.x + el.w - 15, py, 10, 0, Math.PI * 2); ctx.fill();
                }
            }
            else if (el.tipo === 'banco_corrido') {
                ctx.fillStyle = el.cor || '#22140b';
                ctx.fillRect(el.x, el.y, el.w, el.h);
                ctx.strokeStyle = '#110a05'; ctx.lineWidth = 2; ctx.strokeRect(el.x, el.y, el.w, el.h);
            }
            else if (el.tipo === 'mesa_prof') {
                ctx.fillStyle = el.cor || '#3a2012';
                ctx.fillRect(el.x, el.y, el.w, el.h);
                ctx.strokeStyle = '#d4af37'; ctx.lineWidth = 3; ctx.strokeRect(el.x, el.y, el.w, el.h);
            }
            else if (el.tipo === 'trono_dumbledore') {
                ctx.fillStyle = '#78281f';
                ctx.fillRect(el.x, el.y, el.w, el.h);
                ctx.strokeStyle = '#f1c40f'; ctx.lineWidth = 4; ctx.strokeRect(el.x, el.y, el.w, el.h);
            }
            else if (el.tipo === 'pulpito_coruja') {
                ctx.fillStyle = '#d4af37';
                ctx.beginPath(); ctx.arc(el.x + el.w/2, el.y + el.h/2, 28, 0, Math.PI * 2); ctx.fill();
                ctx.fillStyle = '#fff'; ctx.font = "bold 18px Arial"; ctx.textAlign="center";
                ctx.fillText("🦉", el.x + el.w/2, el.y + el.h/2 + 6);
            }
            else if (el.tipo === 'lareira_monumental' || el.tipo === 'lareira_verde') {
                ctx.fillStyle = '#111';
                ctx.fillRect(el.x, el.y, el.w, el.h);
                // Labaredas animadas
                let fGlow = 22 + Math.sin(this.tickCount * 0.2) * 8;
                let corFogo = el.tipo === 'lareira_verde' ? '#2ecc71' : '#e74c3c';
                ctx.fillStyle = corFogo;
                ctx.shadowColor = corFogo; ctx.shadowBlur = 35;
                ctx.beginPath(); ctx.arc(el.x + el.w/2, el.y + el.h/2, fGlow, 0, Math.PI * 2); ctx.fill();
                ctx.fillStyle = '#f39c12';
                ctx.beginPath(); ctx.arc(el.x + el.w/2, el.y + el.h/2, fGlow * 0.6, 0, Math.PI * 2); ctx.fill();
                ctx.shadowBlur = 0;
            }
            else if (el.tipo === 'armadura_guarda') {
                ctx.fillStyle = '#7f8c8d';
                ctx.fillRect(el.x, el.y, el.w, el.h);
                ctx.fillStyle = '#bdc3c7';
                ctx.fillRect(el.x + 5, el.y - 14, el.w - 10, 14);
                ctx.strokeStyle = '#d4af37'; ctx.lineWidth = 1.5;
                ctx.strokeRect(el.x, el.y, el.w, el.h);
            }
            else if (el.tipo === 'quadro_oleo') {
                ctx.fillStyle = '#d4af37';
                ctx.fillRect(el.x, el.y, el.w, el.h);
                ctx.fillStyle = '#1a1c20';
                ctx.fillRect(el.x + 5, el.y + 5, el.w - 10, el.h - 10);
                // Figura em movimento sutil
                let eyeShift = Math.sin(this.tickCount * 0.05) * 3;
                ctx.fillStyle = 'rgba(255,255,255,0.4)';
                ctx.beginPath(); ctx.arc(el.x + el.w/2 + eyeShift, el.y + el.h/2, 12, 0, Math.PI * 2); ctx.fill();
            }
            else if (el.tipo === 'escada_dinamica') {
                let oscAngle = Math.sin(this.tickCount * 0.015 + el.idx) * 0.08;
                ctx.save();
                ctx.translate(el.x + el.w/2, el.y + el.h/2);
                ctx.rotate(oscAngle);
                ctx.fillStyle = '#5c4033';
                ctx.fillRect(-el.w/2, -el.h/2, el.w, el.h);
                ctx.strokeStyle = '#d4af37'; ctx.lineWidth = 2;
                ctx.strokeRect(-el.w/2, -el.h/2, el.w, el.h);
                ctx.fillStyle = 'rgba(0,0,0,0.4)';
                for(let d = -el.w/2 + 40; d < el.w/2; d += 60) {
                    ctx.fillRect(d, -el.h/2, 15, el.h);
                }
                ctx.restore();
            }
            else if (el.tipo === 'estante_livros' || el.tipo === 'estante_proibida') {
                ctx.fillStyle = el.tipo === 'estante_proibida' ? '#120a1a' : '#3e2723';
                ctx.fillRect(el.x, el.y, el.w, el.h);
                ctx.strokeStyle = '#5c4033'; ctx.lineWidth = 3; ctx.strokeRect(el.x, el.y, el.w, el.h);
                // Lombadas de livros coloridos
                const coresLivros = ['#c0392b', '#2980b9', '#27ae60', '#f39c12', '#8e44ad', '#bdc3c7'];
                for (let py = el.y + 15; py < el.y + el.h - 20; py += 35) {
                    ctx.fillStyle = '#221105'; ctx.fillRect(el.x + 8, py, el.w - 16, 25);
                    for (let px = el.x + 12; px < el.x + el.w - 18; px += 14) {
                        let c = coresLivros[(px + py) % coresLivros.length];
                        ctx.fillStyle = c; ctx.fillRect(px, py + 2, 10, 21);
                    }
                }
            }
            else if (el.tipo === 'aro_quadribol') {
                // Haste de latão dourada
                ctx.strokeStyle = '#d4af37'; ctx.lineWidth = 8;
                ctx.beginPath(); ctx.moveTo(el.x, el.y); ctx.lineTo(el.x, el.y - el.hAro); ctx.stroke();
                // Aro circular no topo
                ctx.lineWidth = 6;
                ctx.beginPath(); ctx.arc(el.x, el.y - el.hAro - el.r, el.r, 0, Math.PI * 2); ctx.stroke();
            }
            else if (el.tipo === 'caldeirao_borbulhante') {
                ctx.fillStyle = '#111';
                ctx.beginPath(); ctx.arc(el.x, el.y, el.r, 0, Math.PI * 2); ctx.fill();
                ctx.fillStyle = el.corPocao || '#2ecc71';
                ctx.beginPath(); ctx.arc(el.x, el.y, el.r - 12, 0, Math.PI * 2); ctx.fill();
                // Borbulhas mágicas
                let bGlow = Math.sin(this.tickCount * 0.1) * 6;
                ctx.fillStyle = "rgba(255,255,255,0.6)";
                ctx.beginPath(); ctx.arc(el.x + bGlow, el.y - bGlow, 8, 0, Math.PI * 2); ctx.fill();
            }
            else if (el.tipo === 'abobora_gigante') {
                ctx.fillStyle = '#d35400';
                ctx.beginPath(); ctx.arc(el.x, el.y, el.r, 0, Math.PI * 2); ctx.fill();
                ctx.strokeStyle = '#a04000'; ctx.lineWidth = 3;
                ctx.beginPath(); ctx.ellipse(el.x, el.y, el.r * 0.6, el.r, 0, 0, Math.PI * 2); ctx.stroke();
                // Caule verde
                ctx.fillStyle = '#27ae60'; ctx.fillRect(el.x - 4, el.y - el.r - 8, 8, 10);
            }
            else if (el.tipo === 'vitral_gotico') {
                ctx.fillStyle = el.cor || '#3498db';
                ctx.shadowColor = el.cor || '#3498db'; ctx.shadowBlur = 20;
                ctx.fillRect(el.x, el.y, el.w, el.h);
                ctx.shadowBlur = 0;
            }
            else if (el.tipo === 'relogio_astrologico') {
                ctx.fillStyle = '#d4af37';
                ctx.beginPath(); ctx.arc(el.x + el.w/2, el.y + el.h/2, 60, 0, Math.PI * 2); ctx.stroke();
                ctx.font = "bold 20px 'Cinzel', serif"; ctx.fillStyle = '#f1c40f'; ctx.textAlign = "center";
                ctx.fillText("⚙️", el.x + el.w/2, el.y + el.h/2 + 8);
            }
            else if (el.tipo === 'telescopio_grande') {
                ctx.fillStyle = '#d4af37';
                ctx.fillRect(el.x, el.y, el.w, el.h);
                ctx.strokeStyle = '#b9770e'; ctx.lineWidth = 3; ctx.strokeRect(el.x, el.y, el.w, el.h);
            }
            else if (el.tipo === 'estandarte_casa') {
                const coresCasas = {
                    'Gryffindor': { bg: '#740001', borda: '#d4af37', icone: '🦁' },
                    'Slytherin':  { bg: '#1a472a', borda: '#bdc3c7', icone: '🐍' },
                    'Ravenclaw':  { bg: '#0e1a40', borda: '#b9770e', icone: '🦅' },
                    'Hufflepuff': { bg: '#ecb939', borda: '#2c3e50', icone: '🦡' }
                };
                let cfg = coresCasas[el.casa] || { bg: '#333', borda: '#d4af37', icone: '🏰' };
                ctx.fillStyle = cfg.bg;
                ctx.beginPath();
                ctx.moveTo(el.x, el.y);
                ctx.lineTo(el.x + el.w, el.y);
                ctx.lineTo(el.x + el.w, el.y + el.h - 30);
                ctx.lineTo(el.x + el.w / 2, el.y + el.h);
                ctx.lineTo(el.x, el.y + el.h - 30);
                ctx.closePath();
                ctx.fill();
                ctx.strokeStyle = cfg.borda; ctx.lineWidth = 3; ctx.stroke();
                ctx.fillStyle = '#fff'; ctx.font = "bold 26px Arial"; ctx.textAlign = "center";
                ctx.fillText(cfg.icone, el.x + el.w / 2, el.y + el.h / 2);
            }
            else if (el.tipo === 'arvore_castelo') {
                ctx.fillStyle = "rgba(0,0,0,0.3)";
                ctx.beginPath(); ctx.ellipse(el.x + 10, el.y + 15, el.r, el.r * 0.7, 0, 0, Math.PI * 2); ctx.fill();
                ctx.fillStyle = "#1e4d2b";
                ctx.beginPath(); ctx.arc(el.x, el.y, el.r, 0, Math.PI * 2); ctx.fill();
                ctx.fillStyle = "#2d703d";
                ctx.beginPath(); ctx.arc(el.x - el.r * 0.15, el.y - el.r * 0.15, el.r * 0.8, 0, Math.PI * 2); ctx.fill();
                ctx.fillStyle = "#3e8e41";
                ctx.beginPath(); ctx.arc(el.x - el.r * 0.25, el.y - el.r * 0.25, el.r * 0.55, 0, Math.PI * 2); ctx.fill();
                ctx.fillStyle = "#4a2e18";
                ctx.beginPath(); ctx.arc(el.x, el.y, el.r * 0.22, 0, Math.PI * 2); ctx.fill();
            }
            else if (el.tipo === 'viaduto_pedra') {
                ctx.fillStyle = '#2c302c';
                ctx.fillRect(el.x, el.y, el.w, el.h);
                ctx.strokeStyle = '#181b18'; ctx.lineWidth = 4;
                ctx.strokeRect(el.x, el.y, el.w, el.h);
                ctx.fillStyle = '#1e221e';
                ctx.fillRect(el.x, el.y, 25, el.h);
                ctx.fillRect(el.x + el.w - 25, el.y, 25, el.h);
                ctx.strokeStyle = 'rgba(255,255,255,0.06)'; ctx.lineWidth = 1;
                for (let py = el.y + 30; py < el.y + el.h; py += 30) {
                    ctx.beginPath(); ctx.moveTo(el.x + 25, py); ctx.lineTo(el.x + el.w - 25, py); ctx.stroke();
                }
            }
            else if (el.tipo === 'pilar_gotico' || el.tipo === 'baluarte_torre') {
                ctx.fillStyle = '#2e3338';
                ctx.fillRect(el.x, el.y, el.w, el.h);
                ctx.strokeStyle = '#d4af37'; ctx.lineWidth = 2;
                ctx.strokeRect(el.x, el.y, el.w, el.h);
                ctx.fillStyle = '#1c1f22';
                ctx.fillRect(el.x + 4, el.y + 4, el.w - 8, el.h - 8);
            }
            else if (el.tipo === 'banco_jardim') {
                ctx.fillStyle = el.cor || '#4a3525';
                ctx.fillRect(el.x, el.y, el.w, el.h);
                ctx.strokeStyle = '#22140b'; ctx.lineWidth = 2; ctx.strokeRect(el.x, el.y, el.w, el.h);
            }
            else if (el.tipo === 'canteiro_flores' || el.tipo === 'canteiro_herbologia' || el.tipo === 'arbusto_ditamno') {
                ctx.fillStyle = '#2d1e12';
                ctx.fillRect(el.x, el.y, el.w, el.h);
                ctx.strokeStyle = '#1e6f3d'; ctx.lineWidth = 2; ctx.strokeRect(el.x, el.y, el.w, el.h);
                const florCores = ['#e74c3c', '#9b59b6', '#3498db', '#f1c40f', '#2ecc71'];
                for (let fx = el.x + 15; fx < el.x + el.w - 10; fx += 25) {
                    for (let fy = el.y + 12; fy < el.y + el.h - 10; fy += 25) {
                        ctx.fillStyle = florCores[(fx + fy) % florCores.length];
                        ctx.beginPath(); ctx.arc(fx, fy, 4, 0, Math.PI * 2); ctx.fill();
                    }
                }
            }
            else if (el.tipo === 'arandela_tocha') {
                ctx.fillStyle = '#111';
                ctx.fillRect(el.x + el.w / 2 - 2, el.y, 4, el.h);
                let flameGlow = 6 + Math.sin(this.tickCount * 0.2 + el.x) * 2;
                ctx.fillStyle = '#e67e22';
                ctx.shadowColor = '#f39c12'; ctx.shadowBlur = 15;
                ctx.beginPath(); ctx.arc(el.x + el.w / 2, el.y - 2, flameGlow, 0, Math.PI * 2); ctx.fill();
                ctx.fillStyle = '#f1c40f';
                ctx.beginPath(); ctx.arc(el.x + el.w / 2, el.y - 2, flameGlow * 0.5, 0, Math.PI * 2); ctx.fill();
                ctx.shadowBlur = 0;
            }
            else if (el.tipo === 'estatua_gargula' || el.tipo === 'estatua_ia' || el.tipo === 'estatua_rowena' || el.tipo === 'estatua_bruxa_caolha') {
                ctx.fillStyle = '#3a3d40';
                ctx.fillRect(el.x, el.y, el.w, el.h);
                ctx.strokeStyle = '#d4af37'; ctx.lineWidth = 2; ctx.strokeRect(el.x, el.y, el.w, el.h);
                ctx.fillStyle = '#fff'; ctx.font = "bold 20px Arial"; ctx.textAlign = "center";
                ctx.fillText("🗿", el.x + el.w / 2, el.y + el.h / 2 + 7);
            }
            else if (el.tipo === 'pia_circular_murta') {
                ctx.fillStyle = '#4a5560';
                ctx.beginPath(); ctx.arc(el.x, el.y, el.r || 60, 0, Math.PI * 2); ctx.fill();
                ctx.strokeStyle = '#27ae60'; ctx.lineWidth = 4; ctx.stroke();
                ctx.fillStyle = '#16a085';
                ctx.beginPath(); ctx.arc(el.x, el.y, (el.r || 60) - 15, 0, Math.PI * 2); ctx.fill();
                ctx.fillStyle = '#d4af37';
                ctx.beginPath(); ctx.arc(el.x, el.y, 10, 0, Math.PI * 2); ctx.fill();
            }
            else if (el.tipo === 'sofa_amarelo' || el.tipo === 'poltrona_veludo' || el.tipo === 'poltrona_hagrid') {
                ctx.fillStyle = el.cor || (el.tipo === 'sofa_amarelo' ? '#d4ac0d' : (el.tipo === 'poltrona_hagrid' ? '#5c4033' : '#8a0b0c'));
                ctx.beginPath();
                if (ctx.roundRect) ctx.roundRect(el.x, el.y, el.w, el.h, 8); else ctx.rect(el.x, el.y, el.w, el.h);
                ctx.fill();
                ctx.strokeStyle = '#111'; ctx.lineWidth = 2; ctx.stroke();
            }
            else {
                // Renderizador genérico elegante
                ctx.fillStyle = el.cor || '#333';
                if (el.forma === 'circulo') {
                    ctx.beginPath(); ctx.arc(el.x, el.y, el.r || 20, 0, Math.PI * 2); ctx.fill();
                } else {
                    ctx.fillRect(el.x, el.y, el.w || 40, el.h || 40);
                }
            }
        },

        // ----------------------------------------------------------------------
        // 7. CATALOGADOR DOS 17 AMBIENTES (MAP DATA COMPLETO)
        // ----------------------------------------------------------------------
        obterMapaZona: function(nomeZona) {
            switch(nomeZona) {
                case 'Pátio': {
                    let p = this.gerarPatio();
                    return {
                        mapW: 3200, mapH: 3200, bg: '#0d130e', estilo: 'exterior_calcada',
                        elementos: p.elementos, interativos: p.interativos,
                        portas: [
                            { x: 1500, y: 50, w: 200, h: 60, destino: 'Salão Principal', targetX: 1200, targetY: 2750, label: '🏰 Salão Principal', cor: '#d4af37' },
                            { x: 3070, y: 1500, w: 60, h: 200, destino: 'Cabana do Hagrid', targetX: 300, targetY: 1000, label: 'Terrenos & Hagrid', cor: '#27ae60' },
                            { x: 70, y: 1500, w: 60, h: 200, destino: 'Estufas', targetX: 1950, targetY: 900, label: '🌿 Estufas', cor: '#2ecc71' }
                        ],
                        startX: 1600, startY: 1750
                    };
                }
                case 'Salão Principal': {
                    let s = this.gerarSalaoPrincipal();
                    return {
                        mapW: 2400, mapH: 3000, bg: '#100a06', estilo: 'interior_pedra_nobre',
                        elementos: s.elementos, interativos: s.interativos,
                        portas: [
                            { x: 1100, y: 2870, w: 200, h: 60, destino: 'Pátio', targetX: 1600, targetY: 200, label: '🌲 Pátio do Relógio', cor: '#d4af37' },
                            { x: 1100, y: 60, w: 200, h: 60, destino: 'Grande Escadaria', targetX: 1300, targetY: 2350, label: '🏛️ Grande Escadaria', cor: '#f1c40f' },
                            { x: 60, y: 2700, w: 60, h: 180, destino: 'Cozinhas', targetX: 1800, targetY: 900, label: '🍽️ Cozinhas', cor: '#e67e22' }
                        ],
                        startX: 1200, startY: 2600
                    };
                }
                case 'Grande Escadaria': {
                    let e = this.gerarEscadaria();
                    return {
                        mapW: 2600, mapH: 2600, bg: '#0d0d12', estilo: 'interior_marmore_magico',
                        elementos: e.elementos, interativos: e.interativos,
                        portas: [
                            { x: 1200, y: 2470, w: 200, h: 60, destino: 'Salão Principal', targetX: 1200, targetY: 200, label: '🏰 Salão Principal', cor: '#f1c40f' },
                            { x: 70, y: 500, w: 60, h: 180, destino: 'Salas de Aula', targetX: 1950, targetY: 1000, label: '📚 Salas de Aula', cor: '#3498db' },
                            { x: 2470, y: 500, w: 60, h: 180, destino: 'Biblioteca', targetX: 200, targetY: 1200, label: '📖 Grande Biblioteca', cor: '#9b59b6' },
                            { x: 70, y: 1900, w: 60, h: 180, destino: 'Masmorras', targetX: 2150, targetY: 1100, label: '🧪 Masmorras', cor: '#1abc9c' },
                            { x: 1200, y: 60, w: 200, h: 60, destino: 'Torre de Astronomia', targetX: 1100, targetY: 1650, label: '🔭 Torre de Astronomia', cor: '#e056fd' },
                            { x: 2470, y: 1900, w: 60, h: 180, destino: 'Comunal Gryffindor', targetX: 250, targetY: 800, label: '🦁 Comunal Grifinória', cor: '#e74c3c' },
                            { x: 1900, y: 2470, w: 180, h: 60, destino: 'Banheiro da Murta', targetX: 800, targetY: 200, label: '💧 Banheiro da Murta', cor: '#74b9ff' }
                        ],
                        startX: 1300, startY: 2200
                    };
                }
                case 'Salas de Aula': {
                    let a = this.gerarSalasAula();
                    return {
                        mapW: 2200, mapH: 2000, bg: '#131317', estilo: 'interior_aulas',
                        elementos: a.elementos, interativos: a.interativos,
                        portas: [
                            { x: 2070, y: 900, w: 60, h: 200, destino: 'Grande Escadaria', targetX: 200, targetY: 600, label: '🏛️ Escadaria', cor: '#3498db' }
                        ],
                        startX: 1900, startY: 1000
                    };
                }
                case 'Biblioteca': {
                    let b = this.gerarBiblioteca();
                    return {
                        mapW: 2600, mapH: 2400, bg: '#140c06', estilo: 'interior_madeira_nobre',
                        elementos: b.elementos, interativos: b.interativos,
                        portas: [
                            { x: 70, y: 1100, w: 60, h: 200, destino: 'Grande Escadaria', targetX: 2350, targetY: 600, label: '🏛️ Escadaria', cor: '#9b59b6' }
                        ],
                        startX: 200, startY: 1200
                    };
                }
                case 'Masmorras': {
                    let m = this.gerarMasmorras();
                    return {
                        mapW: 2400, mapH: 2200, bg: '#060907', estilo: 'interior_ardosia_umida',
                        elementos: m.elementos, interativos: m.interativos,
                        portas: [
                            { x: 2270, y: 1050, w: 60, h: 200, destino: 'Grande Escadaria', targetX: 200, targetY: 1900, label: '🏛️ Escadaria', cor: '#1abc9c' }
                        ],
                        startX: 2150, startY: 1100
                    };
                }
                case 'Estufas': {
                    let es = this.gerarEstufas();
                    return {
                        mapW: 2200, mapH: 1800, bg: '#0d1a10', estilo: 'interior_estufa_vidro',
                        elementos: es.elementos, interativos: es.interativos,
                        portas: [
                            { x: 2070, y: 800, w: 60, h: 200, destino: 'Pátio', targetX: 200, targetY: 1500, label: '🌲 Pátio', cor: '#2ecc71' }
                        ],
                        startX: 1950, startY: 900
                    };
                }
                case 'Campo de Quadribol': {
                    let q = this.gerarQuadribol();
                    return {
                        mapW: 3600, mapH: 2400, bg: '#0d2818', estilo: 'exterior_gramado_quadribol',
                        elementos: q.elementos, interativos: q.interativos,
                        portas: [
                            { x: 50, y: 1100, w: 60, h: 200, destino: 'Cabana do Hagrid', targetX: 2400, targetY: 1000, label: 'Terrenos & Hagrid', cor: '#27ae60' }
                        ],
                        startX: 400, startY: 1200
                    };
                }
                case 'Cabana do Hagrid': {
                    let h = this.gerarCabanaHagrid();
                    return {
                        mapW: 2600, mapH: 2000, bg: '#111a0d', estilo: 'exterior_terrenos_floresta',
                        elementos: h.elementos, interativos: h.interativos,
                        portas: [
                            { x: 70, y: 950, w: 60, h: 200, destino: 'Pátio', targetX: 2950, targetY: 1500, label: '🌲 Pátio', cor: '#d4af37' },
                            { x: 2470, y: 950, w: 60, h: 200, destino: 'Campo de Quadribol', targetX: 200, targetY: 1200, label: '🧹 Quadribol', cor: '#f1c40f' }
                        ],
                        startX: 250, startY: 1050
                    };
                }
                case 'Torre de Astronomia': {
                    let t = this.gerarTorreAstronomia();
                    return {
                        mapW: 2200, mapH: 2200, bg: '#03050a', estilo: 'interior_torre_estrelar',
                        elementos: t.elementos, interativos: t.interativos,
                        portas: [
                            { x: 1000, y: 2050, w: 200, h: 60, destino: 'Grande Escadaria', targetX: 1300, targetY: 200, label: '🏛️ Escadaria', cor: '#f1c40f' }
                        ],
                        startX: 1100, startY: 1850
                    };
                }
                case 'Comunal Gryffindor': {
                    let cg = this.gerarComunalGryffindor();
                    return {
                        mapW: 1800, mapH: 1600, bg: '#1f0d0e', estilo: 'interior_comunal_gryffindor',
                        elementos: cg.elementos, interativos: cg.interativos,
                        portas: [
                            { x: 60, y: 700, w: 60, h: 200, destino: 'Grande Escadaria', targetX: 2350, targetY: 1900, label: '🏛️ Escadaria', cor: '#e74c3c' }
                        ],
                        startX: 200, startY: 800
                    };
                }
                case 'Comunal Slytherin': {
                    let cs = this.gerarComunalSlytherin();
                    return {
                        mapW: 1800, mapH: 1600, bg: '#051109', estilo: 'interior_comunal_slytherin',
                        elementos: cs.elementos, interativos: cs.interativos,
                        portas: [
                            { x: 60, y: 700, w: 60, h: 200, destino: 'Masmorras', targetX: 2150, targetY: 1000, label: '🧪 Masmorras', cor: '#2ecc71' }
                        ],
                        startX: 200, startY: 800
                    };
                }
                case 'Comunal Ravenclaw': {
                    let cr = this.gerarComunalRavenclaw();
                    return {
                        mapW: 1800, mapH: 1600, bg: '#060d19', estilo: 'interior_comunal_ravenclaw',
                        elementos: cr.elementos, interativos: cr.interativos,
                        portas: [
                            { x: 800, y: 1470, w: 200, h: 60, destino: 'Grande Escadaria', targetX: 1300, targetY: 1300, label: '🏛️ Escadaria', cor: '#3498db' }
                        ],
                        startX: 900, startY: 1350
                    };
                }
                case 'Comunal Hufflepuff': {
                    let ch = this.gerarComunalHufflepuff();
                    return {
                        mapW: 1800, mapH: 1600, bg: '#191508', estilo: 'interior_comunal_hufflepuff',
                        elementos: ch.elementos, interativos: ch.interativos,
                        portas: [
                            { x: 60, y: 700, w: 60, h: 200, destino: 'Cozinhas', targetX: 1800, targetY: 800, label: '🍽️ Cozinhas', cor: '#f1c40f' }
                        ],
                        startX: 200, startY: 800
                    };
                }
                case 'Cozinhas': {
                    let c = this.gerarCozinhas();
                    return {
                        mapW: 2000, mapH: 1800, bg: '#1a1109', estilo: 'interior_cozinhas',
                        elementos: c.elementos, interativos: c.interativos,
                        portas: [
                            { x: 1870, y: 800, w: 60, h: 200, destino: 'Salão Principal', targetX: 200, targetY: 2700, label: '🏰 Salão Principal', cor: '#d4af37' },
                            { x: 60, y: 800, w: 60, h: 200, destino: 'Comunal Hufflepuff', targetX: 300, targetY: 800, label: '🦡 Comunal Lufa-Lufa', cor: '#f1c40f' }
                        ],
                        startX: 1750, startY: 900
                    };
                }
                case 'Banheiro da Murta': {
                    let bm = this.gerarBanheiroMurta();
                    return {
                        mapW: 1600, mapH: 1400, bg: '#0e171b', estilo: 'interior_banheiro_murta',
                        elementos: bm.elementos, interativos: bm.interativos,
                        portas: [
                            { x: 700, y: 60, w: 200, h: 60, destino: 'Grande Escadaria', targetX: 1900, targetY: 2350, label: '🏛️ Escadaria', cor: '#74b9ff' }
                        ],
                        startX: 800, startY: 250
                    };
                }
                case 'Sala Precisa': {
                    let sp = this.gerarSalaPrecisa();
                    return {
                        mapW: 2000, mapH: 2000, bg: '#100817', estilo: 'interior_sala_precisa',
                        elementos: sp.elementos, interativos: sp.interativos,
                        portas: [
                            { x: 900, y: 1870, w: 200, h: 60, destino: 'Grande Escadaria', targetX: 350, targetY: 1200, label: '🏛️ Grande Escadaria', cor: '#d4af37' }
                        ],
                        startX: 1000, startY: 1700
                    };
                }
                default:
                    return this.obterMapaZona('Salão Principal');
            }
        },

        // ----------------------------------------------------------------------
        // 8. FÍSICA DESLIZANTE, COLISÃO & SPAWN UNWEDGING
        // ----------------------------------------------------------------------
        verificarColisao: function(px, py, m) {
            let r = this.player.size || 16;
            if (px - r < 0 || px + r > m.mapW || py - r < 0 || py + r > m.mapH) return true;

            let el = m.elementos || [];
            for (let i = 0; i < el.length; i++) {
                let e = el[i];
                if (!e.colisao) continue;

                if (e.forma === 'circulo') {
                    let dist = Math.hypot(px - e.x, py - e.y);
                    if (dist < (e.r + r)) return true;
                } else {
                    if (px + r > e.x && px - r < e.x + e.w &&
                        py + r > e.y && py - r < e.y + e.h) {
                        return true;
                    }
                }
            }
            return false;
        },

        // ----------------------------------------------------------------------
        // 9. INICIALIZAÇÃO DO MOTOR, SOCKETS & CONTROLES
        // ----------------------------------------------------------------------
        init: function(forcarRespawn) {
            this.cvs = document.getElementById('mmo-world-canvas') || document.getElementById('mmo-canvas');
            if (!this.cvs) return;
            this.ctx = this.cvs.getContext('2d');

            this.ajustarResolucao();
            if (!window.zonaAtual) window.zonaAtual = "Salão Principal";

            let mapConfig = this.obterMapaZona(window.zonaAtual);

            if (forcarRespawn || !this.player.x) {
                this.player.x = mapConfig.startX || 1000;
                this.player.y = mapConfig.startY || 1000;
            }

            // Garante que o jogador não nasce entalado num obstáculo
            let tentativas = 20;
            while (this.verificarColisao(this.player.x, this.player.y, mapConfig) && tentativas > 0) {
                this.player.x += 25;
                tentativas--;
            }

            // Inicializa velas e estrelas decorativas
            if (this.velasFlutuantes.length === 0) {
                for (let i = 0; i < 65; i++) {
                    this.velasFlutuantes.push({
                        x: 350 + Math.random() * 1700,
                        baseY: 600 + Math.random() * 1800,
                        fase: Math.random() * Math.PI * 2,
                        cor: Math.random() > 0.3 ? '#f39c12' : '#f1c40f'
                    });
                }
            }
            if (this.estrelasNebulosa.length === 0) {
                for (let i = 0; i < 140; i++) {
                    this.estrelasNebulosa.push({
                        x: Math.random() * 2200,
                        y: Math.random() * 2200,
                        r: Math.random() * 2 + 1,
                        alfa: Math.random() * 0.8 + 0.2
                    });
                }
            }

            this.montarControlesTeclado();
            this.montarSocketsMultiplayer();

            if (!this.loop) {
                this.tick();
            }
            this.inicializado = true;
        },

        ajustarResolucao: function() {
            if (!this.cvs) return;
            this.vw = this.cvs.parentElement ? this.cvs.parentElement.clientWidth : window.innerWidth;
            this.vh = this.cvs.parentElement ? this.cvs.parentElement.clientHeight : window.innerHeight;
            this.cvs.width = this.vw;
            this.cvs.height = this.vh;
        },

        montarControlesTeclado: function() {
            if (this.controlesCriados) return;

            window.addEventListener('resize', () => this.ajustarResolucao());

            window.addEventListener('keydown', (e) => {
                let tag = e.target ? e.target.tagName : '';
                if (tag === 'INPUT' || tag === 'TEXTAREA') return;

                if (e.key === 'w' || e.key === 'W' || e.key === 'ArrowUp') this.keys.w = 1;
                if (e.key === 's' || e.key === 'S' || e.key === 'ArrowDown') this.keys.s = 1;
                if (e.key === 'a' || e.key === 'A' || e.key === 'ArrowLeft') this.keys.a = 1;
                if (e.key === 'd' || e.key === 'D' || e.key === 'ArrowRight') this.keys.d = 1;
                if (e.key === 'Shift') this.keys.shift = 1;

                // Tecla de Interação Universal [E]
                if (e.key === 'e' || e.key === 'E') {
                    if (this.objetoInterativoProximo && typeof this.objetoInterativoProximo.acao === 'function') {
                        this.objetoInterativoProximo.acao();
                    }
                }
            });

            window.addEventListener('keyup', (e) => {
                let tag = e.target ? e.target.tagName : '';
                if (tag === 'INPUT' || tag === 'TEXTAREA') return;

                if (e.key === 'w' || e.key === 'W' || e.key === 'ArrowUp') this.keys.w = 0;
                if (e.key === 's' || e.key === 'S' || e.key === 'ArrowDown') this.keys.s = 0;
                if (e.key === 'a' || e.key === 'A' || e.key === 'ArrowLeft') this.keys.a = 0;
                if (e.key === 'd' || e.key === 'D' || e.key === 'ArrowRight') this.keys.d = 0;
                if (e.key === 'Shift') this.keys.shift = 0;
            });

            this.controlesCriados = true;
        },

        montarSocketsMultiplayer: function() {
            if (!global.socket) return;

            global.socket.on('mmo_remoto_entrou', (dados) => {
                if (!dados || !dados.id) return;
                this.remotes[dados.id] = {
                    id: dados.id,
                    nome: dados.nome || 'Bruxo',
                    casa: dados.casa || 'Gryffindor',
                    tituloEquipado: dados.tituloEquipado || '',
                    equipamentos: dados.equipamentos || {},
                    x: dados.x || 1000,
                    y: dados.y || 1000,
                    targetX: dados.x || 1000,
                    targetY: dados.y || 1000,
                    dir: dados.dir || 1,
                    isMoving: false
                };
            });

            global.socket.on('mmo_remoto_moveu', (dados) => {
                if (!dados || !dados.id) return;
                let r = this.remotes[dados.id];
                if (!r) {
                    this.remotes[dados.id] = {
                        id: dados.id,
                        nome: dados.nome || 'Colega',
                        casa: dados.casa || 'Gryffindor',
                        tituloEquipado: dados.tituloEquipado || '',
                        equipamentos: dados.equipamentos || {},
                        x: dados.x,
                        y: dados.y,
                        targetX: dados.x,
                        targetY: dados.y,
                        dir: dados.dir || 1,
                        isMoving: dados.isMoving || false
                    };
                } else {
                    r.targetX = dados.x;
                    r.targetY = dados.y;
                    r.dir = dados.dir || r.dir;
                    r.isMoving = dados.isMoving || false;
                }
            });

            global.socket.on('mmo_remoto_saiu', (idRemoto) => {
                delete this.remotes[idRemoto];
            });

            global.socket.on('mmo_sincronizar_sala', (colegas) => {
                this.remotes = {};
                if (Array.isArray(colegas)) {
                    colegas.forEach(c => {
                        this.remotes[c.id] = {
                            id: c.id,
                            nome: c.nome,
                            casa: c.casa,
                            tituloEquipado: c.tituloEquipado,
                            equipamentos: c.equipamentos || {},
                            x: c.x, y: c.y, targetX: c.x, targetY: c.y,
                            dir: c.dir || 1, isMoving: false
                        };
                    });
                }
            });
        },

        // ----------------------------------------------------------------------
        // 10. LOOP PRINCIPAL DE 60 FPS (FÍSICA, RENDERIZAÇÃO & REDE)
        // ----------------------------------------------------------------------
        tick: function() {
            this.loop = requestAnimationFrame(() => this.tick());
            this.tickCount++;
            if (this.transicaoCooldown > 0) this.transicaoCooldown--;

            let m = this.obterMapaZona(window.zonaAtual);
            let curSpeed = this.keys.shift ? this.player.sprintSpeed : this.player.speed;

            let dirX = (this.keys.d - this.keys.a);
            let dirY = (this.keys.s - this.keys.w);

            if (dirX !== 0 && dirY !== 0) {
                dirX *= 0.7071;
                dirY *= 0.7071;
            }

            this.player.vx = dirX * curSpeed;
            this.player.vy = dirY * curSpeed;

            if (this.player.vx !== 0) this.player.dir = this.player.vx > 0 ? 1 : -1;
            this.player.isMoving = (this.player.vx !== 0 || this.player.vy !== 0);

            // FÍSICA DESLIZANTE (Sliding Collision nos eixos X e Y)
            let nextX = this.player.x + this.player.vx;
            let nextY = this.player.y + this.player.vy;

            if (!this.verificarColisao(nextX, this.player.y, m)) {
                this.player.x = nextX;
            }
            if (!this.verificarColisao(this.player.x, nextY, m)) {
                this.player.y = nextY;
            }

            // DETECÇÃO INTELIGENTE DE PORTAS
            if (this.transicaoCooldown === 0 && m.portas) {
                for (let i = 0; i < m.portas.length; i++) {
                    let p = m.portas[i];
                    if (this.player.x > p.x && this.player.x < p.x + p.w &&
                        this.player.y > p.y && this.player.y < p.y + p.h) {
                        
                        playSFX('magic');
                        window.zonaAtual = p.destino;
                        this.player.x = p.targetX || 1000;
                        this.player.y = p.targetY || 1000;
                        this.transicaoCooldown = 40;
                        this.init(true);

                        if (global.socket) {
                            global.socket.emit('mmo_entrar_zona', {
                                zona: p.destino,
                                aluno: this.obterDadosJogador(false)
                            });
                        }
                        return;
                    }
                }
            }

            // DETECÇÃO DO INTERATIVO MAIS PRÓXIMO
            let maisProximo = null;
            let menorDist = 180;
            if (m.interativos) {
                for (let i = 0; i < m.interativos.length; i++) {
                    let item = m.interativos[i];
                    let dist = Math.hypot(this.player.x - item.x, this.player.y - item.y);
                    if (dist < (item.r || 80) && dist < menorDist) {
                        maisProximo = item;
                        menorDist = dist;
                    }
                }
            }
            this.objetoInterativoProximo = maisProximo;

            // Atualiza prompt visual do Badge na tela
            let promptEl = document.getElementById('mmo-interact-prompt');
            if (promptEl) {
                if (maisProximo) {
                    promptEl.style.display = 'block';
                    promptEl.innerHTML = `Pressione <b>[E]</b> para ${maisProximo.label}`;
                } else {
                    promptEl.style.display = 'none';
                }
            }

            // CÂMERA SUAVE CENTRADA NO JOGADOR
            this.camera.x += (this.player.x - this.vw / 2 - this.camera.x) * 0.12;
            this.camera.y += (this.player.y - this.vh / 2 - this.camera.y) * 0.12;
            this.camera.x = Math.max(0, Math.min(m.mapW - this.vw, this.camera.x));
            this.camera.y = Math.max(0, Math.min(m.mapH - this.vh, this.camera.y));

            // RENDERIZAÇÃO NO CANVAS
            let ctx = this.ctx;
            if (!ctx) return;

            ctx.clearRect(0, 0, this.vw, this.vh);
            ctx.save();
            ctx.translate(-this.camera.x, -this.camera.y);

            // Plano de Fundo do Ambiente
            ctx.fillStyle = m.bg || "#050505";
            ctx.fillRect(0, 0, m.mapW, m.mapH);

            // Texturas Específicas do Piso
            if (m.estilo === 'exterior_calcada') {
                ctx.strokeStyle = "rgba(255,255,255,0.03)"; ctx.lineWidth = 2;
                for(let x = 0; x < m.mapW; x += 120) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, m.mapH); ctx.stroke(); }
                for(let y = 0; y < m.mapH; y += 120) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(m.mapW, y); ctx.stroke(); }
            } else if (m.estilo === 'exterior_gramado_quadribol') {
                ctx.strokeStyle = "rgba(255,255,255,0.2)"; ctx.lineWidth = 6;
                ctx.beginPath(); ctx.ellipse(m.mapW/2, m.mapH/2, 1600, 1000, 0, 0, Math.PI * 2); ctx.stroke();
                ctx.beginPath(); ctx.arc(m.mapW/2, m.mapH/2, 250, 0, Math.PI * 2); ctx.stroke();
            } else if (m.estilo === 'interior_torre_estrelar') {
                this.estrelasNebulosa.forEach(s => {
                    ctx.fillStyle = `rgba(255,255,255,${s.alfa})`;
                    ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2); ctx.fill();
                });
            }

            // DESENHA ELEMENTOS DO CENÁRIO (Sem culling falho que causava o desaparecimento das mesas e paredes)
            let elementos = m.elementos || [];
            for (let i = 0; i < elementos.length; i++) {
                this.drawTile(ctx, elementos[i]);
            }

            // VELAS FLUTUANTES NO SALÃO PRINCIPAL
            if (window.zonaAtual === 'Salão Principal') {
                this.velasFlutuantes.forEach(v => {
                    let vy = v.baseY + Math.sin(this.tickCount * 0.04 + v.fase) * 18;
                    // Brilho quente suave ao redor da chama
                    ctx.fillStyle = "rgba(255, 220, 130, 0.18)";
                    ctx.beginPath(); ctx.arc(v.x + 2, vy - 4, 12, 0, Math.PI * 2); ctx.fill();
                    // Corpo da vela
                    ctx.fillStyle = '#fdfefe'; ctx.fillRect(v.x, vy, 4, 16);
                    // Pavio & Chama dourada
                    ctx.fillStyle = v.cor || '#f1c40f';
                    ctx.beginPath(); ctx.arc(v.x + 2, vy - 4, 5, 0, Math.PI * 2); ctx.fill();
                });
            }

            // PORTAS COM BRILHO GÓTICO
            let portas = m.portas || [];
            portas.forEach(p => {
                ctx.fillStyle = p.cor || '#d4af37';
                ctx.shadowColor = p.cor || '#d4af37'; ctx.shadowBlur = 15;
                ctx.fillRect(p.x, p.y, p.w, p.h);
                ctx.shadowBlur = 0;
                ctx.fillStyle = '#fff';
                ctx.font = "bold 15px 'Cinzel', serif"; ctx.textAlign = "center";
                ctx.fillText(p.label, p.x + p.w/2, p.y + p.h/2 + 5);
            });

            // MARCADORES DE INTERAÇÃO FLUTUANTES
            let interativos = m.interativos || [];
            interativos.forEach(item => {
                let d = Math.hypot(this.player.x - item.x, this.player.y - item.y);
                if (d < 260) {
                    ctx.save();
                    ctx.translate(item.x, item.y - 45 + Math.sin(this.tickCount * 0.08)*4);
                    ctx.fillStyle = "rgba(10,14,20,0.85)";
                    ctx.beginPath(); ctx.arc(0, 0, 18, 0, Math.PI * 2); ctx.fill();
                    ctx.strokeStyle = "#d4af37"; ctx.lineWidth = 2; ctx.stroke();
                    ctx.fillStyle = "#fff"; ctx.font = "bold 14px Arial"; ctx.textAlign="center";
                    ctx.fillText(item.icone || "✨", 0, 5);
                    ctx.restore();
                }
            });

            // RENDERIZAÇÃO DOS COLEGAS REMOTOS (MMO MULTIPLAYER)
            for (let id in this.remotes) {
                let rp = this.remotes[id];
                // Interpolação suave (Lerp 0.2)
                rp.x += (rp.targetX - rp.x) * 0.2;
                rp.y += (rp.targetY - rp.y) * 0.2;
                let rMoving = Math.hypot(rp.targetX - rp.x, rp.targetY - rp.y) > 0.8;

                this.drawWalkableWizard(ctx, rp.x, rp.y, rp.dir || 1, rMoving, this.tickCount, false, rp);
            }

            // RENDERIZAÇÃO DO MEU PERSONAGEM (LOCAL PLAYER COM GUARDA-ROUPA COMPLETO)
            let meuAluno = this.obterDadosJogador(false);
            this.drawWalkableWizard(
                ctx, 
                this.player.x, 
                this.player.y, 
                this.player.dir, 
                this.player.isMoving, 
                this.tickCount, 
                true, 
                meuAluno
            );

            ctx.restore(); // Restaura contexto da câmera

            // ENVIO DE MOVIMENTO THROTTLED (20 Hz / 50ms)
            let agora = Date.now();
            if (this.player.isMoving) {
                if (agora - this.ultimoEnvioSocket > 50) {
                    if (global.socket) {
                        global.socket.emit('mmo_mover', {
                            zona: window.zonaAtual,
                            x: Math.round(this.player.x),
                            y: Math.round(this.player.y),
                            dir: this.player.dir,
                            isMoving: true
                        });
                    }
                    this.ultimoEnvioSocket = agora;
                    this.eraMovimento = true;
                }
            } else if (this.eraMovimento) {
                if (global.socket) {
                    global.socket.emit('mmo_mover', {
                        zona: window.zonaAtual,
                        x: Math.round(this.player.x),
                        y: Math.round(this.player.y),
                        dir: this.player.dir,
                        isMoving: false
                    });
                }
                this.eraMovimento = false;
            }
        }
    };

    global.HogwartsMMOEngine = HogwartsMMOEngine;
    if (typeof window !== 'undefined') {
        window.HogwartsMMOEngine = HogwartsMMOEngine;
        window.drawAnimeWizard = window.drawAnimeWizard || HogwartsMMOEngine.drawAnimeWizard;
    }
    if (typeof global !== 'undefined') {
        global.drawAnimeWizard = global.drawAnimeWizard || HogwartsMMOEngine.drawAnimeWizard;
    }

})(typeof window !== 'undefined' ? window : global);
