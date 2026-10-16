const fs = require('fs');

const file = 'index.html';
let content = fs.readFileSync(file, 'utf8');

// 1. Add "📢 Convidar Patrulha" in aba-pve
const pveButtonsRegex = /(<button onclick="entrarFlorestaExploracao\(\)"[\s\S]*?<\/button>\s*<\/div>)/;
if (pveButtonsRegex.test(content) && !content.includes('emitirBeaconAtividade(\'floresta\'')) {
    const pveBeaconBtn = `$1
                <div style="margin-top:10px;">
                    <button onclick="window.emitirBeaconAtividade('floresta', '🌲 Patrulha na Floresta Proibida', 'Estou a formar uma patrulha para enfrentar as sombras da Floresta Proibida! Clica para entrar junto!')" style="background:linear-gradient(135deg, #8e44ad, #5b2c6f); border-color:#9b59b6; color:#fff; width:100%; padding:10px; font-size:0.85em; border-radius:6px; cursor:pointer; box-shadow:0 0 10px rgba(155,89,182,0.3);">
                        📢 Convidar Colegas para Patrulha ("Participar Junto")
                    </button>
                </div>`;
    content = content.replace(pveButtonsRegex, pveBeaconBtn);
    console.log('Added beacon button to aba-pve.');
}

// 2. Add "📢 Convidar para Mutirão" in aba-estufa
const estufaHeaderRegex = /(<div id="estufa-vasos-container"[\s\S]*?<\/div>)/;
if (estufaHeaderRegex.test(content) && !content.includes('emitirBeaconAtividade(\'estufa\'')) {
    const estufaBeaconBtn = `<div style="margin-bottom:15px;">
                    <button onclick="window.emitirBeaconAtividade('estufa', '🌿 Mutirão de Herbologia', 'Estou cuidando das mandrágoras e plantas mágicas na Estufa! Venham regar e adubar juntos com bônus de XP!')" style="background:linear-gradient(135deg, #27ae60, #1e8449); border-color:#2ecc71; color:#fff; padding:8px 18px; font-size:0.85em; border-radius:20px; cursor:pointer; box-shadow:0 0 10px rgba(46,204,113,0.3);">
                        📢 Convidar para Mutirão na Estufa ("Participar Junto")
                    </button>
                </div>
                $1`;
    content = content.replace(estufaHeaderRegex, estufaBeaconBtn);
    console.log('Added beacon button to aba-estufa.');
}

// 3. Add "📢 Convocação para Quadribol" in aba-quadribol
const quadribolRegex = /(<button onclick="entrarQuadribol\(\)"[\s\S]*?<\/button>)/;
if (quadribolRegex.test(content) && !content.includes('emitirBeaconAtividade(\'quadribol\'')) {
    const quadBeaconBtn = `$1
                    <button onclick="window.emitirBeaconAtividade('quadribol', '🧹 Partida no Campo de Quadribol', 'O campo está aberto e as vassouras estão prontas! Convocação de artilheiros e apanhadores!')" style="margin-top:8px; background:linear-gradient(135deg, #d4ac0d, #b7950b); color:#000; font-weight:bold; font-size:0.85em; padding:8px 16px; border-radius:20px; width:100%; border:none; cursor:pointer; box-shadow:0 0 10px rgba(241,196,15,0.4);">
                        📢 Convocação Geral de Quadribol ("Participar Junto")
                    </button>`;
    content = content.replace(quadribolRegex, quadBeaconBtn);
    console.log('Added beacon button to aba-quadribol.');
}

// 4. Add "📢 Convidar para Grupo de Estudos" in aba-biblioteca
const bibRegex = /(<p style="color:#aaa; font-style: italic;">"Onde a teoria ganha vida e o conhecimento ecoa na eternidade\."<\/p>)/;
if (bibRegex.test(content) && !content.includes('emitirBeaconAtividade(\'biblioteca\'')) {
    const bibBeaconBtn = `$1
                    <div style="margin-top:10px;">
                        <button onclick="window.emitirBeaconAtividade('biblioteca', '📚 Grupo de Estudos na Biblioteca', 'Estou a pesquisar tomos antigos e a redigir teses mágicas! Venham debater com bônus de XP!')" style="background:linear-gradient(135deg, #8e44ad, #6c3483); border-color:#9b59b6; color:#fff; padding:6px 18px; font-size:0.82em; border-radius:20px; cursor:pointer; box-shadow:0 0 10px rgba(155,89,182,0.3);">
                            📢 Convidar para Grupo de Estudos ("Participar Junto")
                        </button>
                    </div>`;
    content = content.replace(bibRegex, bibBeaconBtn);
    console.log('Added beacon button to aba-biblioteca.');
}

// 5. Add "📢 Convidar para a Aula" in aba-aulas
const aulaRegex = /(<button onclick="iniciarAulaImersiva\(\)"[\s\S]*?<\/button>\s*<\/div>)/;
if (aulaRegex.test(content) && !content.includes('emitirBeaconAtividade(\'aula\'')) {
    const aulaBeaconBtn = `$1
                    <div style="margin-top:8px;">
                        <button onclick="window.emitirBeaconAtividade('aula', '✍️ Aula com Professor em Hogwarts', 'A aula vai começar na sala de aula! Venham assistir para somar pontos à nossa Casa!')" style="background:linear-gradient(135deg, #6c3483, #4a235a); color:#fff; border-color:#9b59b6; padding:8px 16px; font-size:0.85em; border-radius:4px; width:100%; cursor:pointer; box-shadow:0 0 10px rgba(155,89,182,0.2);">
                            📢 Convidar Colegas para a Aula ("Participar Junto")
                        </button>
                    </div>`;
    content = content.replace(aulaRegex, aulaBeaconBtn);
    console.log('Added beacon button to aba-aulas.');
}

// 6. Update universal beacon client functions (emitirBeaconAtividade & expanded participarBeaconGlobal)
const oldBeaconsScriptRegex = /window\.participarBeaconGlobal\s*=\s*async function[\s\S]*?window\.atualizarVisualDeckSlots/;

const newBeaconsScript = `window.emitirBeaconAtividade = function(tipo, titulo, descricao, dados = {}) {
    if (!meuBruxo || !meuBruxo.id) return;
    playSFX('magic');
    fetch('/api/social/beacon/criar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            id: meuBruxo.id,
            tipo,
            titulo,
            descricao,
            dados: { ...dados, zona: window.zonaAtual }
        })
    }).then(r => r.json()).then(d => {
        if (d.sucesso) {
            mostrarNotificacao(\`📢 Convocação enviada ao chat do castelo: [\${titulo}]!\`, 'sucesso');
            playSFX('spark');
        } else if (d.erro) {
            mostrarNotificacao(d.erro, 'erro');
        }
    }).catch(()=>{});
};

window.participarBeaconGlobal = async function(beaconId, tipo) {
    if (!meuBruxo || !meuBruxo.id) return;
    playSFX('magic');
    try {
        const res = await fetch('/api/social/beacon/participar', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: meuBruxo.id, beaconId })
        });
        const d = await res.json();
        if (d.erro) return mostrarNotificacao(d.erro, 'erro');

        mostrarNotificacao(d.msg, 'sucesso');
        playSFX('victory');

        // Roteamento inteligente para todas as 9 atividades do MMO
        if (tipo === 'combate_mundo' || tipo === 'combate') {
            if (d.beacon.dados?.alvoId) {
                mmoInteragirMundo(d.beacon.dados.alvoId, 'combate');
            } else {
                nav('castelo');
            }
        } else if (tipo === 'floresta') {
            nav('aventura');
            if (typeof entrarFlorestaExploracao === 'function') {
                setTimeout(() => entrarFlorestaExploracao(), 250);
            }
        } else if (tipo === 'masmorra') {
            if (typeof entrarDungeonAcao === 'function') {
                entrarDungeonAcao(d.beacon.dados?.local || 'Catacumbas');
            }
        } else if (tipo === 'estufa') {
            nav('estufa');
        } else if (tipo === 'pocao') {
            nav('inventario');
            if (typeof abrirCaldeiraoUI === 'function') abrirCaldeiraoUI();
        } else if (tipo === 'biblioteca') {
            nav('biblioteca');
        } else if (tipo === 'aula') {
            nav('aulas');
        } else if (tipo === 'quadribol') {
            nav('quadribol');
            if (typeof entrarQuadribol === 'function') entrarQuadribol();
        } else if (tipo === 'banquete') {
            if (typeof abrirMinigameCozinha === 'function') abrirMinigameCozinha();
        } else if (tipo === 'coleta') {
            if (d.beacon.dados?.alvoId && typeof iniciarMinigameColeta === 'function') {
                iniciarMinigameColeta(d.beacon.dados.alvoId);
            }
        }
        syncRequest();
    } catch(e) { mostrarNotificacao('Erro ao juntar-se à convocação.', 'erro'); }
};

window.emitirBeaconRumor = function(mobId, mobNome) {
    if (!meuBruxo || !meuBruxo.id) return;
    window.emitirBeaconAtividade(
        'combate_mundo',
        \`⚔️ Alerta de Caçada: \${mobNome}\`,
        \`\${meuBruxo.nome} precisa de reforços para combater [\${mobNome}]! Clica abaixo para entrar junto!\`,
        { alvoId: mobId }
    );
};

window.atualizarVisualDeckSlots`;

if (oldBeaconsScriptRegex.test(content)) {
    content = content.replace(oldBeaconsScriptRegex, newBeaconsScript);
    console.log('Replaced and upgraded beacon client engine with all 9 activities.');
} else {
    console.log('oldBeaconsScriptRegex did not match.');
}

// 7. Inject Gamification HUD bar at the top of the castle screen
const castleHeaderRegex = /(<div id="aba-castelo" class="aba">[\s\S]*?<div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px; margin-top:10px;">)/;
const hudGamificacaoHtml = `$1
            <!-- HUD SUPREMO DE GAMIFICAÇÃO & PROGRESSÃO CONTÍNUA -->
            <div id="hud-gamificacao-topo" style="background:linear-gradient(135deg, rgba(15,12,8,0.9), rgba(5,4,2,0.95)); border:1px solid var(--hp-gold); border-radius:8px; padding:8px 14px; margin-bottom:12px; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px; box-shadow:0 0 15px rgba(212,175,55,0.2);">
                <div style="display:flex; align-items:center; gap:8px; cursor:pointer;" onclick="nav('aventura')">
                    <span style="font-size:1.3em;">📜</span>
                    <div>
                        <div style="font-size:0.75em; color:var(--hp-gold); font-weight:bold;">Diário do Maroto</div>
                        <div id="hud-diario-progresso" style="font-size:0.7em; color:#2ecc71;">0/5 Tarefas Hoje</div>
                    </div>
                </div>
                <div style="display:flex; align-items:center; gap:8px; cursor:pointer;" onclick="window.descansarSalaComunal()">
                    <span style="font-size:1.3em;">💤</span>
                    <div>
                        <div style="font-size:0.75em; color:#3498db; font-weight:bold;">Aura de Descanso</div>
                        <div id="hud-descanso-xp" style="font-size:0.7em; color:#5dade2;">100 XP Restante (+100% Dobrado)</div>
                    </div>
                </div>
                <div style="display:flex; align-items:center; gap:8px; cursor:pointer;" onclick="abrirPerfilBruxo()">
                    <span style="font-size:1.3em;">🏆</span>
                    <div>
                        <div style="font-size:0.75em; color:#f39c12; font-weight:bold;">Título Honorífico</div>
                        <div id="hud-titulo-equipado" style="font-size:0.7em; color:#fff; font-style:italic;">Aprendiz de Magia</div>
                    </div>
                </div>
                <div style="display:flex; align-items:center; gap:8px; cursor:pointer;" onclick="abrirPerfilBruxo()">
                    <span style="font-size:1.3em;">🍫</span>
                    <div>
                        <div style="font-size:0.75em; color:#e67e22; font-weight:bold;">Sapos de Chocolate</div>
                        <div id="hud-sapos-resumo" style="font-size:0.7em; color:#f39c12;">0 / 16 Figurinhas</div>
                    </div>
                </div>
                <div style="display:flex; align-items:center; gap:6px;">
                    <span style="font-size:1.2em;">🔥</span>
                    <span id="hud-streak-dias" style="font-size:0.78em; color:#e74c3c; font-weight:bold;">1 Dia Consecutivo</span>
                </div>
            </div>`;

if (castleHeaderRegex.test(content) && !content.includes('id="hud-gamificacao-topo"')) {
    content = content.replace(castleHeaderRegex, hudGamificacaoHtml);
    console.log('Injected Gamification HUD bar into castle top.');
}

// 8. Update renderizarGamificacaoUI to also update the top HUD bar elements
const oldRenderGamiRegex = /(const countSapos = document\.getElementById\('sapos-count'\);[\s\S]*?if \(countSapos\) countSapos\.innerText = `\$\{.*?\} \/ \$\{.*?\} Figurinhas`;)/;
const newHudUpdateCode = `$1
    
    // E. ATUALIZAÇÃO DO HUD SUPREMO NO TOPO DO CASTELO
    const hudDiario = document.getElementById('hud-diario-progresso');
    if (hudDiario && data.diario) hudDiario.innerText = \`\${data.diario.concluidosCount || 0}/5 Concluídas (\${data.diario.marcosReivindicados?.length || 0} Marcos)\`;
    
    const hudDescanso = document.getElementById('hud-descanso-xp');
    if (hudDescanso) hudDescanso.innerText = \`\${data.auraDescanso || 0} XP (+100% XP Bônus)\`;

    const hudTitulo = document.getElementById('hud-titulo-equipado');
    if (hudTitulo) hudTitulo.innerText = data.tituloEquipado || "Aprendiz de Magia";

    const hudSapos = document.getElementById('hud-sapos-resumo');
    if (hudSapos && data.catalogoSapos) hudSapos.innerText = \`\${(data.saposColecionados || []).length} / \${data.catalogoSapos.length} Colecionadas\`;

    const hudStreak = document.getElementById('hud-streak-dias');
    if (hudStreak) hudStreak.innerText = \`\${data.streakDias || 1} Dias Consecutivos\`;`;

if (oldRenderGamiRegex.test(content) && !content.includes('hud-diario-progresso')) {
    content = content.replace(oldRenderGamiRegex, newHudUpdateCode);
    console.log('Updated renderizarGamificacaoUI to refresh HUD elements.');
}

fs.writeFileSync(file, content, 'utf8');
console.log('Part 2 applied successfully.');
