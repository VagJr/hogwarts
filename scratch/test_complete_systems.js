const fs = require('fs');
const path = require('path');
const assert = require('assert');
const { HogwartsCore } = require('../HogwartsCore.js');

async function testCompleteSystems() {
    console.log('🔮 ========================================================');
    console.log('⚡ TESTE COMPLETO DE SISTEMAS, REGRAS E MECÂNICAS HOGWARTS ⚡');
    console.log('🔮 ========================================================\n');

    let passed = 0;
    let failed = 0;

    function test(name, fn) {
        try {
            fn();
            console.log(`  ✅ [PASS] ${name}`);
            passed++;
        } catch (err) {
            console.error(`  ❌ [FAIL] ${name}:`, err.message);
            failed++;
        }
    }

    async function testAsync(name, fn) {
        try {
            await fn();
            console.log(`  ✅ [PASS] ${name}`);
            passed++;
        } catch (err) {
            console.error(`  ❌ [FAIL] ${name}:`, err.message);
            failed++;
        }
    }

    const core = new HogwartsCore();
    const savePath = path.join(__dirname, '..', 'data', 'hogwarts_save.json');
    if (fs.existsSync(savePath)) {
        const raw = fs.readFileSync(savePath, 'utf8');
        const data = JSON.parse(raw);
        if (data.alunos) core.alunos = data.alunos;
        if (data.livroDeFeiticos) {
            for (let k in data.livroDeFeiticos) {
                core.livroDeFeiticos[k] = data.livroDeFeiticos[k];
            }
        }
    }
    console.log(`🏰 Core carregado com ${Object.keys(core.alunos).length} alunos e ${Object.keys(core.livroDeFeiticos).length} feitiços.\n`);

    // -------------------------------------------------------------
    // PILAR 1: COMBATE, MATRIZ ELEMENTAL, CC DIMINISHING & SHIELDS
    // -------------------------------------------------------------
    console.log('--- 1. COMBATE & MATRIZ ELEMENTAL ---');

    test('Matriz elemental: Fogo causa 1.5x contra Gelo', () => {
        const atacante = { id: 'a1', nome: 'Atacante', dano: 50 };
        const alvo = { id: 't1', nome: 'Alvo', elemento: 'gelo', buffs: [], efeitos: [] };
        const feitico = { id: 'incendio', nome: 'Incêndio', elemento: 'fogo', valorBase: 60 };

        const res = core.calcularDanoSinergia({ atacante, alvo, feitico, agora: Date.now() });
        assert.strictEqual(res.multiplicador, 1.5, `Multiplicador esperado 1.5, obtido ${res.multiplicador}`);
        assert(res.danoFinal >= 90, `Dano amplificado esperado >= 90, obtido ${res.danoFinal}`);
    });

    test('Matriz elemental: Fogo causa dano reduzido se alvo resiste', () => {
        const atacante = { id: 'a1', nome: 'Atacante', dano: 50 };
        const alvo = { id: 't1', nome: 'Alvo', elemento: 'agua', resiste: 'fogo', buffs: [], efeitos: [] };
        const feitico = { id: 'incendio', nome: 'Incêndio', elemento: 'fogo', valorBase: 60 };

        const res = core.calcularDanoSinergia({ atacante, alvo, feitico, agora: Date.now() });
        assert(res.multiplicador < 1.0, `Multiplicador deve ser reduzido (< 1.0), obtido ${res.multiplicador}`);
    });

    test('Magia das Trevas perfura escudos com dano direto', () => {
        const atacante = { id: 'a1', nome: 'Atacante', dano: 50 };
        const alvo = { 
            id: 't1', 
            nome: 'Alvo', 
            elemento: 'normal', 
            hpAtual: 500,
            escudoHp: 300,
            buffs: [{ tipo: 'protego' }], 
            efeitos: [] 
        };
        const feitico = { id: 'avada_teste', nome: 'Pulso das Trevas', elemento: 'trevas', valorBase: 100 };

        const res = core.calcularDanoSinergia({ atacante, alvo, feitico, agora: Date.now() });
        assert(res.relato.includes('Trevas perfuram o escudo'), `Relato deve indicar perfuração: ${res.relato}`);
        assert(alvo.hpAtual < 500, `HP deve ter sofrido dano direto vazado`);
    });

    test('Quebra de Escudo (Shield Break) aplica status vulneravel por 3s', () => {
        const atacante = { id: 'a1', nome: 'Atacante', dano: 100 };
        const alvo = { 
            id: 't1', 
            nome: 'Alvo', 
            elemento: 'normal', 
            hpAtual: 500,
            escudoHp: 30,
            buffs: [{ tipo: 'protego' }], 
            efeitos: [] 
        };
        const feitico = { id: 'bombarda', nome: 'Bombarda', elemento: 'cinetico', valorBase: 100 };

        const res = core.calcularDanoSinergia({ atacante, alvo, feitico, agora: Date.now() });
        assert.strictEqual(res.shieldBroken, true, 'shieldBroken deve ser true');
        assert.strictEqual(alvo.escudoHp, 0, 'Escudo deve estar zerado');
        const vuln = alvo.efeitos.find(e => e.tipo === 'vulneravel');
        assert(vuln, 'Alvo deve ter recebido efeito vulneravel');
        assert.strictEqual(vuln.duracao, 3, 'Vulnerabilidade deve durar 3s');
    });

    test('Diminishing Returns em Controles de Grupo (CC)', () => {
        const atacante = { id: 'a1', nome: 'Atacante', dano: 50 };
        const agora = Date.now();
        const alvo = { 
            id: 't1', 
            nome: 'Alvo', 
            elemento: 'normal', 
            hpAtual: 500,
            escudoHp: 0,
            buffs: [], 
            efeitos: [],
            ultimoCCTempo: agora - 1000,
            ccCount: 1 // Já tomou 1 CC recente (< 6s)
        };
        const feitico = { 
            id: 'stupefy', 
            nome: 'Stupefy', 
            elemento: 'cinetico', 
            valorBase: 50,
            efeitoSecundario: 'atordoar',
            duracao: 2.0
        };

        const res = core.calcularDanoSinergia({ atacante, alvo, feitico, agora });
        assert.strictEqual(alvo.ccCount, 2, 'ccCount deve ter incrementado para 2');
        assert(res.relato.includes('Reduzido'), `Relato deve indicar CC Reduzido: ${res.relato}`);
        const ccEff = alvo.efeitos.find(e => e.tipo === 'atordoar');
        assert(ccEff, 'Deve ter aplicado atordoar');
        assert.strictEqual(ccEff.duracao, 1.0, `Duração deve ter sido reduzida pela metade (1.0s), obtido ${ccEff.duracao}`);
    });

    // -------------------------------------------------------------
    // PILAR 2: DECK BUILDING & EVOLUÇÃO DE FEITIÇOS (LIFESKILL)
    // -------------------------------------------------------------
    console.log('\n--- 2. CONSTRUÇÃO DE DECK & MAESTRIA LIFESKILL ---');

    let studentId = Object.keys(core.alunos)[0];

    test('Identificar aluno na base de dados para testes integrados', () => {
        assert(studentId, 'ID de aluno válido obtido');
    });

    test('Treinar feitiço no Boneco consome 1 Foco e concede +25 EXP', () => {
        const aluno = core.alunos[studentId];
        aluno.focoAtual = 20;
        aluno.xp = 0;
        aluno.xpProx = 99999;
        const fId = 'expelliarmus';
        if (!aluno.maestriaFeiticos) aluno.maestriaFeiticos = {};
        aluno.maestriaFeiticos[fId] = { nivel: 1, exp: 0, expProx: 100, perk: null };

        const res = core.treinarFeiticoBoneco(studentId, fId);
        assert(res.sucesso === true, 'Treino deve ter sucesso');
        assert.strictEqual(res.expGanho, 25, 'Deve conceder 25 EXP');
        assert.strictEqual(aluno.focoAtual, 19, 'Foco deve ter decrementado em 1');
        assert.strictEqual(aluno.maestriaFeiticos[fId].exp, 25, 'Maestria deve ter 25 EXP');
    });

    test('Evolução de feitiço desbloqueia Perk ADEPTO no nível 5', () => {
        const aluno = core.alunos[studentId];
        aluno.focoAtual = 100;
        const fId = 'expelliarmus';
        aluno.maestriaFeiticos[fId] = { nivel: 4, exp: 240, expProx: 245, perk: null };

        // Treinar até o nível 5
        const res = core.treinarFeiticoBoneco(studentId, fId);
        assert(aluno.maestriaFeiticos[fId].nivel >= 5, `Nível deve ser >= 5, obtido ${aluno.maestriaFeiticos[fId].nivel}`);
        assert.strictEqual(aluno.maestriaFeiticos[fId].perk, 'ADEPTO', `Perk deve ser ADEPTO`);
    });

    // -------------------------------------------------------------
    // PILAR 3: ECOSSISTEMA ECONÔMICO & GRINGOTES
    // -------------------------------------------------------------
    console.log('\n--- 3. ECONOMIA, GRINGOTES & MERCADO ---');

    test('Cálculo de Juros em Gringotes (1.5% ao dia)', () => {
        const aluno = core.alunos[studentId];
        aluno.cofreGringotes = 1000;
        aluno.ultimoRendimentoGringotes = Date.now() - (2 * 24 * 60 * 60 * 1000); // 2 dias atrás

        const info = core.calcularJurosGringotes(studentId);
        assert(info.diasDecorridos >= 2, `Devem ter decorrido pelo menos 2 dias, obtido ${info.diasDecorridos}`);
        assert(info.jurosGaleoes >= 30, `Juros acumulados de 1000 a 1.5%/dia por 2 dias devem ser >= 30, obtido: ${info.jurosGaleoes}`);
    });

    test('Resgate de Juros credita galeões na carteira', () => {
        const aluno = core.alunos[studentId];
        aluno.cofreGringotes = 1000;
        aluno.ultimoRendimentoGringotes = Date.now() - (2 * 24 * 60 * 60 * 1000);
        const info = core.calcularJurosGringotes(studentId);

        const res = core.resgatarJurosGringotes(studentId);
        assert(res.sucesso === true, 'Resgate deve ter sucesso');
        assert.strictEqual(res.resgatado, info.jurosGaleoes, 'Valor resgatado deve bater com o calculado');
    });

    test('Conversão monetária canônica: 1 Galeão = 17 Sicles = 493 Nuques', () => {
        const galeoes = 5;
        const sicles = galeoes * 17;
        const nuques = galeoes * 493;
        assert.strictEqual(sicles, 85, '5 Galeões devem valer 85 Sicles');
        assert.strictEqual(nuques, 2465, '5 Galeões devem valer 2465 Nuques');
    });

    test('Venda de itens via Coruja no Mercado de Bruxos', () => {
        const aluno = core.alunos[studentId];
        if (!aluno.inventario || typeof aluno.inventario !== 'object') aluno.inventario = {};
        if (!aluno.inventario.ingredientes) aluno.inventario.ingredientes = {};
        aluno.inventario.ingredientes['mandragora'] = 5;
        const saldoAntes = aluno.galeoes || 0;

        const res = core.venderItemMercado(studentId, 'ingrediente', 'mandragora', 2);
        assert(res.sucesso === true, 'Venda deve ter sucesso');
        assert.strictEqual(res.ganhoTotal, 80, `Ganho de 2x40 deve ser 80, obtido ${res.ganhoTotal}`);
        assert.strictEqual(aluno.galeoes, saldoAntes + 80, 'Saldo deve ter aumentado em 80');
    });

    // -------------------------------------------------------------
    // PILAR 4: VIDA EM HOGWARTS, EXAMES N.O.M.s & N.I.E.M.s
    // -------------------------------------------------------------
    console.log('\n--- 4. VIDA EM HOGWARTS & EXAMES DO MINISTÉRIO ---');

    await testAsync('Banca Examinadora do Ministério atribui nota oficial e progressão de ano', async () => {
        const aluno = core.alunos[studentId];
        aluno.anoLetivo = 1;
        aluno.nivel = 10;

        const respostasPerfeitas = {
            'Feitiços': 'Movimento ascendente preciso da varinha e incantação com firmeza vocal.',
            'Poções': 'Temperatura regulada do caldeirão e infusão no sentido horário.',
            'Transfiguração': 'Visualização mental nítida da forma molecular e intenção pura.',
            'D.C.A.T.': 'Postura defensiva e timing exato do feitiço Protego.',
            'Herbologia': 'Cuidado com raízes e uso de abafadores de orelha para mandrágoras.'
        };

        const res = await core.realizarExameAno(studentId, respostasPerfeitas);
        assert.strictEqual(res.aprovado, true, 'Aluno deve ser aprovado com respostas perfeitas');
        assert(['O', 'E'].includes(res.nota), `Nota deve ser O ou E, obtido: ${res.nota}`);
        assert.strictEqual(res.promovido, true, 'Deve ser promovido de ano');
        assert.strictEqual(res.novoAno, 2, `Novo ano deve ser 2, obtido: ${res.novoAno}`);
        assert(res.recompensas.pontosCasa > 0, 'Deve pontuar para a Taça das Casas');
    });

    // -------------------------------------------------------------
    // PILAR 5: ENDPOINTS HTTP NO SERVIDOR AO VIVO (PORTA 8080)
    // -------------------------------------------------------------
    console.log('\n--- 5. INTEGRAÇÃO HTTP SERVIDOR AO VIVO (PORTA 8080) ---');

    await testAsync('POST /api/combate/parry registra defesa e parry', async () => {
        const resp = await fetch('http://localhost:8080/api/combate/parry', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: studentId, deltaMs: 200 })
        });
        const d = await resp.json();
        assert.strictEqual(resp.status, 200, `Status deve ser 200, recebido ${resp.status}`);
        assert.strictEqual(d.sucesso, true, 'Parry deve ser registrado');
        assert.strictEqual(typeof d.parryPerfeito, 'boolean', 'Deve conter estado do parry');
    });

    await testAsync('POST /api/combate/treinar no servidor ao vivo', async () => {
        const resp = await fetch('http://localhost:8080/api/combate/treinar', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: studentId, feiticoId: 'lumos' })
        });
        const d = await resp.json();
        assert.strictEqual(resp.status, 200, `Status 200 esperado`);
        assert.strictEqual(d.sucesso, true, 'Treino deve ter sucesso');
        assert.strictEqual(d.expGanho, 25, 'Deve conceder 25 de exp');
    });

    await testAsync('POST /api/deck/salvar valida limite de 6 feitiços', async () => {
        const resp = await fetch('http://localhost:8080/api/deck/salvar', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                id: studentId, 
                feiticos: ['expelliarmus', 'stupefy', 'incendio', 'lumos', 'protego', 'glacius'] 
            })
        });
        const d = await resp.json();
        assert.strictEqual(resp.status, 200, `Status 200 esperado`);
        assert.strictEqual(d.sucesso, true, 'Deck de 6 feitiços deve ser salvo');
        assert.strictEqual(d.deck.length, 6, 'Deck salvo deve ter 6 slots');
    });

    await testAsync('POST /api/gringotes/juros consulta juros acumulados', async () => {
        const resp = await fetch('http://localhost:8080/api/gringotes/juros', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: studentId, acao: 'consultar' })
        });
        const d = await resp.json();
        assert.strictEqual(resp.status, 200, `Status 200 esperado`);
        assert.strictEqual(typeof d.jurosGaleoes, 'number', 'Deve retornar número de juros');
        assert.strictEqual(d.taxaDiaria, '1.5%', 'Taxa diária deve ser 1.5%');
    });

    await testAsync('POST /api/aulas/exame_ano realiza avaliação acadêmica', async () => {
        const resp = await fetch('http://localhost:8080/api/aulas/exame_ano', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                id: studentId, 
                respostas: {
                    'Feitiços': 'Concentração e movimento de arco.',
                    'Poções': 'Fogo baixo e mexer com cuidado.'
                } 
            })
        });
        const d = await resp.json();
        assert.strictEqual(resp.status, 200, `Status 200 esperado`);
        assert.strictEqual(typeof d.aprovado, 'boolean', 'Deve conter aprovação');
        assert.strictEqual(typeof d.nota, 'string', 'Deve conter nota');
    });

    await testAsync('POST /api/mercado/vender_item processa transação', async () => {
        // Assegurar ingrediente no aluno do servidor
        const aluno = core.alunos[studentId];
        if (!aluno.inventario) aluno.inventario = {};
        if (!aluno.inventario.ingredientes) aluno.inventario.ingredientes = {};
        aluno.inventario.ingredientes['mandragora'] = 10;

        const resp = await fetch('http://localhost:8080/api/mercado/vender_item', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                id: studentId, 
                tipo: 'ingrediente', 
                chaveOuId: 'mandragora', 
                quantidade: 1 
            })
        });
        const d = await resp.json();
        assert.strictEqual(resp.status, 200, `Status 200 esperado`);
        assert.strictEqual(d.sucesso, true, 'Venda deve ter sucesso');
        assert(d.ganhoTotal > 0, 'Ganho total deve ser positivo');
    });

    // -------------------------------------------------------------
    // RESUMO FINAL
    // -------------------------------------------------------------
    console.log('\n========================================================');
    console.log(`📊 RESULTADO FINAL: ${passed} PASSOU | ${failed} FALHOU`);
    console.log('========================================================\n');

    process.exit(failed > 0 ? 1 : 0);
}

testCompleteSystems().catch(err => {
    console.error('Erro fatal nos testes:', err);
    process.exit(1);
});
