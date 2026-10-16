const fs = require('fs');
const path = require('path');
const assert = require('assert');
const { HogwartsCore } = require('../HogwartsCore.js');
const { GamificacaoHogwarts, CATALOGO_CONQUISTAS, CATALOGO_SAPOS, MODELOS_BOUNTIES } = require('../GamificacaoHogwarts.js');

async function runTests() {
    console.log('🔮 =================================================================');
    console.log('⚡ TESTE DA CAMADA DE GAMIFICAÇÃO & BEACONS SOCIAIS DE HOGWARTS ⚡');
    console.log('🔮 =================================================================\n');

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
    }
    const studentId = Object.keys(core.alunos)[0];
    const aluno = core.alunos[studentId];
    core.gamificacao.garantirEstadoAluno(aluno);

    // -----------------------------------------------------------------
    // 1. DIÁRIO DO MAROTO (METAS DIÁRIAS & MARCOS)
    // -----------------------------------------------------------------
    console.log('--- 1. DIÁRIO DO MAROTO & PROGRESSÃO DIÁRIA ---');

    test('Diário do Maroto gera exatamente 5 tarefas balanceadas do dia', () => {
        const diario = aluno.diarioMaroto;
        assert(diario, 'Diário deve existir');
        assert.strictEqual(diario.tarefas.length, 5, 'Devem existir 5 tarefas');
        const tipos = diario.tarefas.map(t => t.tipo);
        assert(tipos.includes('aula'), 'Deve incluir tarefa de aula');
        assert(tipos.includes('combate'), 'Deve incluir tarefa de combate');
        assert(tipos.includes('estufa_pocao'), 'Deve incluir tarefa de estufa/poção');
        assert(tipos.includes('treino_leitura'), 'Deve incluir tarefa de treino/leitura');
        assert(tipos.includes('social'), 'Deve incluir tarefa social de ajuda');
    });

    test('Progresso do Diário avança ao realizar ações', () => {
        core.gamificacao.progredirDiario(studentId, 'combate', 1);
        const tarefaCombate = aluno.diarioMaroto.tarefas.find(t => t.tipo === 'combate');
        assert(tarefaCombate.atual >= 1, 'Tarefa de combate deve ter progredido');
    });

    test('Reivindicação de Marco do Diário concede recompensas e baú', () => {
        // Concluir artificialmente 2 tarefas para testar Marco 2
        aluno.diarioMaroto.tarefas[0].concluida = true;
        aluno.diarioMaroto.tarefas[1].concluida = true;
        aluno.diarioMaroto.concluidosCount = 2;
        aluno.diarioMaroto.marcosReivindicados = [];

        const res = core.gamificacao.reivindicarMarcoDiario(studentId, 2);
        assert.strictEqual(res.sucesso, true, 'Marco 2 deve ser resgatado com sucesso');
        assert.strictEqual(res.recompensas.galeoes, 25, 'Deve conceder 25 Galeões');
        assert(aluno.diarioMaroto.marcosReivindicados.includes(2), 'Marco deve estar registrado como reivindicado');
    });

    // -----------------------------------------------------------------
    // 2. CATÁLOGO DE 52 CONQUISTAS & TÍTULOS EQUIPÁVEIS
    // -----------------------------------------------------------------
    console.log('\n--- 2. CONQUISTAS BRUXAS & TÍTULOS EQUIPÁVEIS (52 PROEZAS) ---');

    test('Catálogo contém pelo menos 50 conquistas com títulos e passivas', () => {
        assert(CATALOGO_CONQUISTAS.length >= 50, `Esperado >= 50 conquistas, obtido ${CATALOGO_CONQUISTAS.length}`);
        CATALOGO_CONQUISTAS.forEach(c => {
            assert(c.id && c.nome && c.titulo && c.cat && c.passiva, `Conquista ${c.id} deve ter estrutura completa`);
        });
    });

    test('Desbloqueio de Conquista por ação mágica e registro no perfil', () => {
        aluno.vitoriasPvE = 15;
        const novas = core.gamificacao.verificarConquistas(studentId);
        assert(aluno.conquistas.includes('combate_10_vitorias'), 'Deve ter desbloqueado combate_10_vitorias');
    });

    test('Equipagem de Título honorífico desbloqueado', () => {
        const res = core.gamificacao.equiparTitulo(studentId, 'combate_10_vitorias');
        assert.strictEqual(res.sucesso, true, 'Deve equipar com sucesso');
        assert.strictEqual(aluno.tituloEquipado, 'Duelista Nato', 'Título equipado deve ser Duelista Nato');
    });

    test('Bloqueio de equipagem de títulos ainda não conquistados', () => {
        const res = core.gamificacao.equiparTitulo(studentId, 'academia_ano_7');
        if (aluno.anoLetivo < 7) {
            assert(res.erro, 'Não deve permitir equipar título não conquistado');
        }
    });

    // -----------------------------------------------------------------
    // 3. SAPOS DE CHOCOLATE & COLEÇÃO
    // -----------------------------------------------------------------
    console.log('\n--- 3. ÁLBUM DE FIGURINHAS DE SAPOS DE CHOCOLATE ---');

    test('Catálogo de Sapos contém 16 lendas mágicas com raridades e lore', () => {
        assert.strictEqual(CATALOGO_SAPOS.length, 16, 'Devem existir 16 figurinhas');
        assert(CATALOGO_SAPOS.some(s => s.nome === 'Albus Dumbledore'), 'Dumbledore deve constar no catálogo');
        assert(CATALOGO_SAPOS.some(s => s.nome === 'Merlin'), 'Merlin deve constar no catálogo');
    });

    test('Abertura de Sapo de Chocolate adiciona figurinha à coleção', () => {
        const res = core.gamificacao.abrirSapoDeChocolate(studentId);
        assert(res && res.id && res.nome, 'Deve retornar figurinha válida');
        assert(aluno.saposColecionados.includes(res.id), 'Figurinha deve constar na coleção do aluno');
    });

    // -----------------------------------------------------------------
    // 4. QUADRO DE CARTAZES DE CAÇA DE HOGSMEADE (BOUNTIES)
    // -----------------------------------------------------------------
    console.log('\n--- 4. CARTAZES DE CAÇA DE HOGSMEADE (BOUNTIES) ---');

    test('Obter lista de Bounties ativas com modificadores de combate', () => {
        const bounties = core.gamificacao.obterBountiesHogsmeade(studentId);
        assert(bounties.length >= 3, 'Devem existir ao menos 3 contratos');
        assert(bounties[0].modificadores.length > 0, 'Bounty deve ter modificadores de combate');
    });

    test('Aceitar contrato de caça registra na lista do aluno', () => {
        const bId = MODELOS_BOUNTIES[0].id;
        aluno.bountiesAceitos = (aluno.bountiesAceitos || []).filter(id => id !== bId);
        const res = core.gamificacao.aceitarBounty(studentId, bId);
        assert.strictEqual(res.sucesso, true, 'Deve aceitar contrato com sucesso');
        assert(aluno.bountiesAceitos.includes(bId), 'Bounty deve estar na lista de aceitos do aluno');
    });

    // -----------------------------------------------------------------
    // 5. MOTOR DE BEACONS SOCIAIS ("PARTICIPAR JUNTO")
    // -----------------------------------------------------------------
    console.log('\n--- 5. MOTOR DE BEACONS SOCIAIS ("PARTICIPAR JUNTO") ---');

    let beaconCriado = null;

    test('Criação de Beacon de convocação coletiva', () => {
        const res = core.gamificacao.criarBeaconSocial({
            autorId: studentId,
            tipo: 'combate_mundo',
            titulo: '⚔️ Batalha contra Basilisco',
            descricao: 'Venham reforçar a linha de defesa!',
            dados: { alvoId: 'mob_basilisco_1' }
        });
        assert.strictEqual(res.sucesso, true, 'Beacon deve ser criado com sucesso');
        assert(res.beacon && res.beacon.id, 'Deve retornar ID de beacon');
        beaconCriado = res.beacon;
    });

    test('Outro aluno atende à convocação clicando em "Participar Junto"', () => {
        const outrosAlunos = Object.keys(core.alunos).filter(id => id !== studentId);
        const peerId = outrosAlunos[0] || studentId;

        const res = core.gamificacao.participarBeaconSocial(beaconCriado.id, peerId);
        assert.strictEqual(res.sucesso, true, 'Deve participar com sucesso');
        assert(res.msg.includes('Juntaste-te'), 'Mensagem de cooperação deve ser emitida');
    });

    // -----------------------------------------------------------------
    // 6. AURA DE DESCANSO & BÊNÇÃO DOS FUNDADORES
    // -----------------------------------------------------------------
    console.log('\n--- 6. AURA DE DESCANSO & BÊNÇÃO DA TAÇA DAS CASAS ---');

    test('Descansar na Sala Comunal acumula Aura de Descanso (Rested XP)', () => {
        const auraAntes = aluno.auraDescanso || 0;
        core.gamificacao.adicionarAuraDescanso(studentId, 4); // 4 minutos de descanso
        assert(aluno.auraDescanso > auraAntes, 'Aura de descanso deve ter aumentado');
    });

    test('Aura de Descanso dobra o XP ganho em atividades', () => {
        aluno.auraDescanso = 100;
        const xpOriginal = 50;
        const xpComBonus = core.gamificacao.aplicarBonusRestedXp(aluno, xpOriginal);
        assert.strictEqual(xpComBonus, 100, `XP deve ser dobrado (100), obtido ${xpComBonus}`);
        assert.strictEqual(aluno.auraDescanso, 50, 'Aura de descanso deve ter sido consumida proporcionalmente');
    });

    test('Cálculo da Bênção dos Fundadores para a Casa Líder', () => {
        const info = core.gamificacao.obterCasaLiderComBonus();
        assert(info.lider, 'Deve determinar a casa líder');
        assert(info.bencaoAtiva, 'Deve conceder bênção ativa com bônus de velocidade e juros');
    });

    // -----------------------------------------------------------------
    // 7. ENDPOINTS HTTP AO VIVO NO SERVIDOR (PORTA 8080)
    // -----------------------------------------------------------------
    console.log('\n--- 7. ENDPOINTS HTTP DE GAMIFICAÇÃO NO SERVIDOR AO VIVO ---');

    await testAsync('GET /api/gamificacao/status retorna estado completo', async () => {
        const resp = await fetch('http://localhost:8080/api/gamificacao/status?id=' + studentId);
        const d = await resp.json();
        assert.strictEqual(resp.status, 200, 'Status 200 esperado');
        assert(d.diario && d.diario.tarefas, 'Deve retornar tarefas do diário');
        assert(d.catalogoConquistas && d.catalogoConquistas.length >= 50, 'Deve retornar catálogo de 50+ conquistas');
        assert(d.bounties && d.bounties.length >= 3, 'Deve retornar bounties');
    });

    await testAsync('POST /api/social/beacon/criar despacha convocação', async () => {
        const resp = await fetch('http://localhost:8080/api/social/beacon/criar', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                id: studentId,
                tipo: 'estufa',
                titulo: '🌿 Cultivo de Mandrágoras',
                descricao: 'Preciso de ajuda para regar a estufa!'
            })
        });
        const d = await resp.json();
        assert.strictEqual(resp.status, 200, 'Status 200 esperado');
        assert.strictEqual(d.sucesso, true, 'Beacon deve ser criado');
    });

    await testAsync('POST /api/social/descansar ativa descanso e aura XP', async () => {
        const resp = await fetch('http://localhost:8080/api/social/descansar', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: studentId, minutos: 2 })
        });
        const d = await resp.json();
        assert.strictEqual(resp.status, 200, 'Status 200 esperado');
        assert.strictEqual(d.sucesso, true, 'Descanso deve ser registrado');
        assert(typeof d.auraDescanso === 'number', 'Deve retornar aura de descanso');
    });

    await testAsync('POST /api/gamificacao/titulos/equipar equipa título', async () => {
        const resp = await fetch('http://localhost:8080/api/gamificacao/titulos/equipar', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: studentId, tituloId: 'Aprendiz de Magia' })
        });
        const d = await resp.json();
        assert.strictEqual(resp.status, 200, 'Status 200 esperado');
        assert.strictEqual(d.sucesso, true, 'Título deve ser equipado');
    });

    // -----------------------------------------------------------------
    // RESUMO
    // -----------------------------------------------------------------
    console.log('\n=================================================================');
    console.log(`📊 RESULTADO FINAL DA GAMIFICAÇÃO: ${passed} PASSOU | ${failed} FALHOU`);
    console.log('=================================================================\n');

    process.exit(failed > 0 ? 1 : 0);
}

runTests().catch(err => {
    console.error('Erro fatal nos testes de gamificação:', err);
    process.exit(1);
});
