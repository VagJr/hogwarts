// ==============================================================================
// test_walkable_hogwarts.js - SUÍTE DE TESTES DO MAPA ANDÁVEL 2D & MULTIPLAYER
// ==============================================================================

const assert = require('assert');

// Mock browser environment for headless testing
global.window = global;
global.document = {
    activeElement: null,
    getElementById: (id) => {
        if (id === 'mmo-world-canvas' || id === 'mmo-canvas') {
            return {
                width: 1200, height: 800,
                parentElement: { clientWidth: 1200, clientHeight: 800 },
                getContext: () => mockContext,
                getBoundingClientRect: () => ({ left: 0, top: 0, width: 1200, height: 800 })
            };
        }
        if (id === 'mmo-world-container') {
            return { getBoundingClientRect: () => ({ width: 1200, height: 800 }) };
        }
        return {
            classList: { add: () => {}, remove: () => {}, contains: () => false },
            style: {},
            innerText: '',
            addEventListener: () => {},
            removeEventListener: () => {},
            getBoundingClientRect: () => ({ left: 0, top: 0, width: 140, height: 140 })
        };
    },
    createElement: (tag) => ({
        style: {},
        id: '',
        innerHTML: '',
        appendChild: () => {}
    }),
    body: {
        appendChild: () => {}
    },
    addEventListener: () => {}
};

global.prompt = (msg) => "Discurso Mágico de Hogwarts!";
global.addEventListener = () => {};
global.window.addEventListener = () => {};
global.requestAnimationFrame = (cb) => setTimeout(cb, 16);
global.cancelAnimationFrame = (id) => clearTimeout(id);
global.safeSet = () => {};
global.mostrarNotificacao = () => {};
global.playSFX = () => {};
global.syncRequest = () => {};
global.modoMmoAtivo = true;
global.zonaAtual = "Pátio";
global.meuBruxo = {
    id: "aluno_teste_1",
    nome: "Harry Potter",
    casa: "Gryffindor",
    tituloEquipado: "Duelista Nato",
    focoAtual: 100,
    focoMaximo: 100,
    equipamentos: {
        corpo: { nome: "Vestes de Fios de Acromântula", visual: { cor1: "#1b1b22", cor2: "#8a0b0c" } },
        cabeca: { nome: "Chapéu Rúnico de Batalha", visual: { cor1: "#3e2723" } },
        pescoco: { nome: "Cachecol de Gryffindor", visual: { cor1: "#8a0b0c", cor2: "#d4af37" } },
        varinha: { nome: "Varinha de Azevinho e Fênix", visual: { corMadeira: "#6c4e3d" } }
    }
};

// Canvas 2D Mock
const mockContext = {
    save: () => {},
    restore: () => {},
    translate: () => {},
    scale: () => {},
    rotate: () => {},
    clearRect: () => {},
    fillRect: () => {},
    strokeRect: () => {},
    beginPath: () => {},
    closePath: () => {},
    arc: () => {},
    ellipse: () => {},
    moveTo: () => {},
    lineTo: () => {},
    quadraticCurveTo: () => {},
    stroke: () => {},
    fill: () => {},
    fillText: () => {},
    measureText: () => ({ width: 50 }),
    createRadialGradient: () => ({ addColorStop: () => {} }),
    createLinearGradient: () => ({ addColorStop: () => {} }),
    roundRect: () => {}
};

// Mock Socket.IO
let emittedEvents = [];
global.socket = {
    emit: (event, data) => {
        emittedEvents.push({ event, data });
    },
    on: () => {}
};

// Carrega o motor
require('../HogwartsMMOEngine.js');
const engine = global.HogwartsMMOEngine;

let passed = 0;
let failed = 0;

function test(name, fn) {
    try {
        fn();
        console.log(`  ✅ [PASS] ${name}`);
        passed++;
    } catch (err) {
        console.error(`  ❌ [FAIL] ${name}: ${err.message}`);
        failed++;
    }
}

console.log('🔮 =================================================================');
console.log('⚡ TESTE DO MAPA ANDÁVEL 2D & MOTOR MULTIPLAYER DE HOGWARTS ⚡');
console.log('🔮 =================================================================\n');

// ---------------------------------------------------------------------
// 1. CATÁLOGO COMPLETO DE AMBIENTES CANÔNICOS (17 MAPAS)
// ---------------------------------------------------------------------
console.log('--- 1. CATÁLOGO DOS AMBIENTES DE HOGWARTS ---');

engine.construirMundo();

const mapasEsperados = [
    "Pátio", "Salão Principal", "Grande Escadaria", "Salas de Aula",
    "Biblioteca", "Masmorras", "Estufas", "Campo de Quadribol",
    "Cabana do Hagrid", "Torre de Astronomia", "Comunal Gryffindor",
    "Comunal Slytherin", "Comunal Ravenclaw", "Comunal Hufflepuff",
    "Cozinhas", "Banheiro da Murta", "Sala Precisa"
];

test('Todos os 17 mapas canônicos e salas estão construídos', () => {
    mapasEsperados.forEach(mNome => {
        assert(engine.mapas[mNome], `Mapa [${mNome}] deve existir no motor`);
        const m = engine.mapas[mNome];
        assert(m.mapW >= 1000 && m.mapH >= 1000, `Dimensões de [${mNome}] devem ser amplas (>=1000px)`);
        assert(m.bg, `Mapa [${mNome}] deve possuir cor de fundo`);
        assert(typeof m.startX === 'number' && typeof m.startY === 'number', `Mapa [${mNome}] deve possuir coordenadas de spawn válidas`);
        assert(m.portas && m.portas.length > 0, `Mapa [${mNome}] deve possuir portas de navegação`);
    });
});

test('Integridade das portas: todos os destinos existem no mundo', () => {
    for (let nome in engine.mapas) {
        let m = engine.mapas[nome];
        m.portas.forEach(p => {
            assert(p.destino, `Porta em [${nome}] deve ter destino`);
            assert(engine.mapas[p.destino], `Destino [${p.destino}] da porta em [${nome}] deve existir no catálogo de mapas`);
            assert(p.w > 0 && p.h > 0, `Dimensões da porta em [${nome}] devem ser positivas`);
        });
    }
});

// ---------------------------------------------------------------------
// 2. MISTÉRIOS, PASSAGENS SECRETAS E CONTEÚDOS INTERAGÍVEIS
// ---------------------------------------------------------------------
console.log('\n--- 2. MISTÉRIOS & PONTOS INTERATIVOS NO MAPA ---');

test('Presença de objetos interativos nos ambientes principais', () => {
    const interativosPatio = engine.mapas["Pátio"].interativos;
    assert(interativosPatio.some(i => i.id === 'fonte_desejos'), 'Pátio deve ter Chafariz dos Desejos');
    assert(interativosPatio.some(i => i.id === 'gargula_patio'), 'Pátio deve ter Gárgula Falante');
    assert(interativosPatio.some(i => i.id === 'bau_patio'), 'Pátio deve ter Baú Oculto');

    const interativosSalao = engine.mapas["Salão Principal"].interativos;
    assert(interativosSalao.some(i => i.id === 'pulpito_coruja'), 'Salão Principal deve ter Púlpito da Coruja');
    assert(interativosSalao.some(i => i.id === 'banquete_mesa'), 'Salão Principal deve ter Banquete');
    assert(interativosSalao.some(i => i.id === 'quadro_pera'), 'Salão Principal deve ter Quadro da Pêra para Cozinhas');

    const interativosAulas = engine.mapas["Salas de Aula"].interativos;
    assert(interativosAulas.some(i => i.id === 'bicho_papao'), 'Salas de Aula deve ter Armário do Bicho-Papão');

    const interativosBib = engine.mapas["Biblioteca"].interativos;
    assert(interativosBib.some(i => i.id === 'portao_secao_reservada'), 'Biblioteca deve ter Portão da Seção Reservada');
    assert(interativosBib.some(i => i.id === 'tomo_ancestral'), 'Biblioteca deve ter Tomo Proibido');

    const interativosMasmorras = engine.mapas["Masmorras"].interativos;
    assert(interativosMasmorras.some(i => i.id === 'caldeirao_essencia'), 'Masmorras deve ter Caldeirão');
    assert(interativosMasmorras.some(i => i.id === 'parede_slytherin'), 'Masmorras deve ter Passagem da Sonserina');

    const interativosMurta = engine.mapas["Banheiro da Murta"].interativos;
    assert(interativosMurta.some(i => i.id === 'torneira_serpente'), 'Banheiro da Murta deve ter Torneira da Serpente');

    const interativosEscadaria = engine.mapas["Grande Escadaria"].interativos;
    assert(interativosEscadaria.some(i => i.id === 'sir_cadogan'), 'Escadaria deve ter Retrato de Sir Cadogan');
    assert(interativosEscadaria.some(i => i.id === 'bruxa_caolha'), 'Escadaria deve ter Passagem da Bruxa de Um Olho Só');
    assert(interativosEscadaria.some(i => i.id === 'espelho_quarto_andar'), 'Escadaria deve ter Passagem do Espelho do 4º Andar');
    assert(interativosEscadaria.some(i => i.id === 'porta_sala_precisa'), 'Escadaria deve ter Acesso à Sala Precisa');

    const interativosSalaPrecisa = engine.mapas["Sala Precisa"].interativos;
    assert(interativosSalaPrecisa.some(i => i.id === 'bau_sala_precisa'), 'Sala Precisa deve ter Baú Lendário');
    assert(interativosSalaPrecisa.some(i => i.id === 'espelho_ojesed_ia'), 'Sala Precisa deve ter Espelho de Ojesed');
});

test('Execução de interações mágicas sem exceções', () => {
    engine.interagirFonteDesejos();
    engine.conversarComQuadroOuGargula('Gárgula de Teste', 'Olá bruxo!');
    engine.abrirBauSecreto('bau_teste_unitario', 50, 'Figurinha Rara');
    engine.discursarPulpito();
    engine.banquetearSalao();
    engine.ativarArmaduraSentinela('armadura_1');
    engine.observarConstelacoes();
    engine.observarLulaGigante();
});

// ---------------------------------------------------------------------
// 3. MODELO DE PERSONAGEM & GUARDA-ROUPA (FIM DA INVISIBILIDADE)
// ---------------------------------------------------------------------
console.log('\n--- 3. MODELO DE PERSONAGEM & GUARDA-ROUPA ---');

test('Resolução segura de dados do jogador local e do guarda-roupa', () => {
    const dados = engine.obterDadosJogador(false);
    assert(dados, 'Dados do jogador local devem ser resolvidos');
    assert.strictEqual(dados.nome, 'Harry Potter');
    assert.strictEqual(dados.casa, 'Gryffindor');
    assert(dados.equipamentos.corpo, 'Deve carregar veste do guarda-roupa');
    assert(dados.equipamentos.varinha, 'Deve carregar varinha do guarda-roupa');
});

test('Fallback robusto impede jogador de ficar invisível mesmo sem dados', () => {
    const temp = global.meuBruxo;
    global.meuBruxo = null;
    const fallback = engine.obterDadosJogador(false);
    assert(fallback, 'Fallback deve retornar modelo padrão de aluno');
    assert(fallback.nome, 'Aluno deve ter nome');
    assert(fallback.casa, 'Aluno deve ter casa atribuída');
    global.meuBruxo = temp;
});

test('Renderizador de avatar desenha modelo com passos, capas e varinha sem erros', () => {
    const dados = engine.obterDadosJogador(false);
    // Testa parado
    engine.drawWalkableWizard(mockContext, 100, 100, 1, false, 10, true, dados);
    // Testa em movimento (com animação de passos)
    engine.drawWalkableWizard(mockContext, 120, 120, -1, true, 25, true, dados);
});

// ---------------------------------------------------------------------
// 4. FÍSICA DESLIZANTE & DETECÇÃO DE COLISÕES
// ---------------------------------------------------------------------
console.log('\n--- 4. FÍSICA DESLIZANTE & COLISÕES ---');

test('Colisão bloqueia penetração em obstáculos', () => {
    const mapaPatio = engine.mapas["Pátio"];
    assert.strictEqual(engine.verificarColisao(1600, 1600, mapaPatio), true, 'Centro da fonte deve colidir');
    assert.strictEqual(engine.verificarColisao(1600, 1370, mapaPatio), true, 'Borda da fonte deve colidir');
    assert.strictEqual(engine.verificarColisao(1000, 1000, mapaPatio), false, 'Piso aberto não deve colidir');
});

test('Desatolamento automático de spawn posiciona jogador em local livre', () => {
    const mapa = engine.mapas["Salão Principal"];
    engine.player.x = 60; // Perto da parede
    engine.player.y = 60;
    engine.desatolarJogador(mapa);
    assert.strictEqual(engine.verificarColisao(engine.player.x, engine.player.y, mapa), false, 'Jogador deve estar desatolado');
});

// ---------------------------------------------------------------------
// 5. SIMULAÇÃO DE CAMINHADA CONTÍNUA (TESTE DO BUG DOS 15 SEGUNDOS)
// ---------------------------------------------------------------------
console.log('\n--- 5. SIMULAÇÃO DE 1200 TICKS DE CAMINHADA (ZERO TRAVAMENTOS) ---');

test('Executar 1200 ticks (20 segundos a 60 FPS) sem congelamento ou exceção', () => {
    if (engine.loop) cancelAnimationFrame(engine.loop);
    global.requestAnimationFrame = () => {};
    engine.init(true);

    engine.keys.d = 1;
    engine.keys.s = 1;

    let startTicks = engine.tickCount;
    for (let i = 0; i < 1200; i++) {
        engine.tick();
    }

    let diffTicks = engine.tickCount - startTicks;
    assert.strictEqual(diffTicks, 1200, `Devem ser executados exatamente 1200 ticks, obtido ${diffTicks}`);
    assert(engine.player.x > 0 && engine.player.y > 0, 'Coordenadas do jogador devem ser válidas');
});

// ---------------------------------------------------------------------
// 6. SINCRONIZAÇÃO MULTIPLAYER & EMISSÃO DE REDE
// ---------------------------------------------------------------------
console.log('\n--- 6. SINCRONIZAÇÃO MULTIPLAYER MMO (REDES & COLEGAS) ---');

test('Emissão throttled de movimento para o servidor Socket.IO', () => {
    emittedEvents = [];
    engine.keys.w = 1;
    engine.ultimoEnvioSocket = 0;
    engine.tick();
    
    const moveEvents = emittedEvents.filter(e => e.event === 'mmo_mover');
    assert(moveEvents.length > 0, 'Deve ter emitido evento mmo_mover');
    assert(moveEvents[0].data.zona, 'Evento mmo_mover deve conter zona');
    assert(typeof moveEvents[0].data.x === 'number', 'Evento mmo_mover deve conter x numérico');
});

test('Renderização e interpolação suave de colegas remotos na sala', () => {
    engine.remotes["bruxo_amigo_1"] = {
        id: "bruxo_amigo_1",
        nome: "Hermione Granger",
        casa: "Gryffindor",
        tituloEquipado: "Erudita de Hogwarts",
        x: 1500, y: 1500,
        targetX: 1550, targetY: 1520,
        dir: 1, isMoving: true,
        equipamentos: {}
    };

    engine.tick();
    const colega = engine.remotes["bruxo_amigo_1"];
    assert(colega.x > 1500, 'Posição X do colega remoto deve interpolar suavemente em direção a targetX');
});

// ---------------------------------------------------------------------
// RESUMO DOS TESTES
// ---------------------------------------------------------------------
console.log('\n=================================================================');
console.log(`📊 RESULTADO DO MAPA ANDÁVEL: ${passed} PASSOU | ${failed} FALHOU`);
console.log('=================================================================\n');

process.exit(failed > 0 ? 1 : 0);
