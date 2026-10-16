const fs = require('fs');

let html = fs.readFileSync('c:/hogwarts/index.html', 'utf8');

// 1. INJECT DIÁRIO DO MAROTO & BOUNTIES IN #aba-aventura
const targetAventura = `<div id="aba-aventura" class="aba oculto">
            <div class="card" style="border-color: #ff9900; background: rgba(255, 153, 0, 0.05);">`;

const replacementAventura = `<div id="aba-aventura" class="aba oculto">
            <!-- 📜 DIÁRIO DO MAROTO (METAS DIÁRIAS & STREAK) -->
            <div class="card" style="border-color:var(--hp-gold); background:rgba(212,175,55,0.06); margin-bottom:15px; box-shadow:0 0 20px rgba(212,175,55,0.15);">
                <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid rgba(212,175,55,0.3); padding-bottom:8px; margin-bottom:12px;">
                    <div style="display:flex; align-items:center; gap:8px;">
                        <span style="font-size:1.4em;">📜</span>
                        <h3 style="color:var(--hp-gold); margin:0; font-size:1.25em; font-family:'Cinzel', serif;">Diário do Maroto</h3>
                    </div>
                    <span id="diario-streak-badge" style="background:rgba(231,76,60,0.2); border:1px solid #e74c3c; color:#ff7675; padding:3px 10px; border-radius:15px; font-size:0.75em; font-weight:bold;">🔥 Sequência: 1 Dia</span>
                </div>
                
                <div style="margin-bottom:12px;">
                    <div style="display:flex; justify-content:space-between; font-size:0.8em; color:#ccc; margin-bottom:6px;">
                        <span>Progresso de Hoje: <b id="diario-progresso-txt" style="color:var(--hp-gold);">0 / 5 Concluídas</b></span>
                        <span style="color:#aaa;">Marcos de Baú: 2, 4 e 5</span>
                    </div>
                    <div class="meter-bg" style="height:10px; border-radius:5px; position:relative; background:rgba(0,0,0,0.6);">
                        <div id="diario-barra-progresso" style="width:0%; height:100%; background:linear-gradient(90deg, #f1c40f, #2ecc71); border-radius:5px; transition:width 0.4s ease;"></div>
                    </div>
                </div>

                <div id="diario-tarefas-lista" style="display:flex; flex-direction:column; gap:8px; margin-bottom:15px;"></div>

                <div style="display:flex; gap:8px; justify-content:space-between; flex-wrap:wrap;">
                    <button id="btn-marco-2" onclick="window.reivindicarMarco(2)" style="flex:1; min-width:95px; padding:8px 4px; font-size:0.75em; background:rgba(255,255,255,0.05); border:1px solid #555; color:#aaa; cursor:pointer;" disabled>🎁 Marco 2/5 (25G)</button>
                    <button id="btn-marco-4" onclick="window.reivindicarMarco(4)" style="flex:1; min-width:95px; padding:8px 4px; font-size:0.75em; background:rgba(255,255,255,0.05); border:1px solid #555; color:#aaa; cursor:pointer;" disabled>🎁 Marco 4/5 (50G+XP)</button>
                    <button id="btn-marco-5" onclick="window.reivindicarMarco(5)" style="flex:1; min-width:110px; padding:8px 4px; font-size:0.75em; background:rgba(212,175,55,0.15); border:1px solid var(--hp-gold); color:var(--hp-gold); font-weight:bold; cursor:pointer;" disabled>👑 Baú Supremo (120G+Sapo)</button>
                </div>
            </div>

            <!-- 🎯 QUADRO DE CARTAZES DE CAÇA DE HOGSMEADE (BOUNTIES) -->
            <div class="card" style="border-color:#e74c3c; background:rgba(231,76,60,0.05); margin-bottom:15px; box-shadow:0 0 15px rgba(231,76,60,0.15);">
                <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid rgba(231,76,60,0.3); padding-bottom:8px; margin-bottom:10px;">
                    <div style="display:flex; align-items:center; gap:8px;">
                        <span style="font-size:1.4em;">🎯</span>
                        <h3 style="color:#e74c3c; margin:0; font-size:1.25em; font-family:'Cinzel', serif;">Cartazes de Caça de Hogsmeade</h3>
                    </div>
                    <span style="color:#ff7675; font-size:0.75em; font-weight:bold;">Contratos de Elite</span>
                </div>
                <p style="color:#ccc; font-size:0.82em; margin:0 0 10px 0;">Bestas aberrantes ameaçam o perímetro de Hogwarts. Aceita contratos de caça e convoca colegas pelo chat para lutarem juntos!</p>
                <div id="hogsmeade-bounties-lista" style="display:flex; flex-direction:column; gap:10px;"></div>
            </div>

            <div class="card" style="border-color: #ff9900; background: rgba(255, 153, 0, 0.05);">`;

if (html.includes(targetAventura)) {
    html = html.replace(targetAventura, replacementAventura);
    console.log('Injected Diario & Bounties in aba-aventura');
} else {
    console.error('Target aba-aventura not found directly, trying regex');
    html = html.replace(/<div id="aba-aventura" class="aba oculto">\s*<div class="card" style="border-color:\s*#ff9900;[^"]*">/, replacementAventura);
}

// 2. INJECT CASA LÍDER BANNER & REST BUTTON IN #aba-castelo
const targetCasteloBotoes = `<button onclick="abrirMinigameCozinha()" style="background:#4a2b10; border-color:#e67e22; color:#e67e22; width:auto; padding:5px 15px; border-radius:20px; font-size:0.8em; margin-left:5px;">🍗 Invasão às Cozinhas</button>
				<button onclick="coletarRecursos()" style="background:#0e2918; border-color:#2ecc71; color:#2ecc71; width:auto; padding:5px 15px; border-radius:20px; font-size:0.8em; box-shadow: 0 0 10px rgba(46,204,113,0.2);">🌿 Vasculhar Terreno</button>`;

const replacementCasteloBotoes = `<button onclick="abrirMinigameCozinha()" style="background:#4a2b10; border-color:#e67e22; color:#e67e22; width:auto; padding:5px 15px; border-radius:20px; font-size:0.8em; margin-left:5px;">🍗 Invasão às Cozinhas</button>
				<button onclick="coletarRecursos()" style="background:#0e2918; border-color:#2ecc71; color:#2ecc71; width:auto; padding:5px 15px; border-radius:20px; font-size:0.8em; box-shadow: 0 0 10px rgba(46,204,113,0.2);">🌿 Vasculhar Terreno</button>
                <button onclick="window.descansarSalaComunal()" style="background:#1b2631; border-color:#3498db; color:#5dade2; width:auto; padding:5px 15px; border-radius:20px; font-size:0.8em; box-shadow:0 0 10px rgba(52,152,219,0.2); cursor:pointer;">💤 Descansar (+Aura XP)</button>`;

if (html.includes(targetCasteloBotoes)) {
    html = html.replace(targetCasteloBotoes, replacementCasteloBotoes);
    console.log('Injected Rest Button in aba-castelo');
}

// 3. INJECT CONQUISTAS & TÍTULOS IN #modal-perfil
const targetPerfil = `<button onclick="pedirTituloIA()" style="background:#4b0082; color:#fff; border-color:#9b59b6; margin-bottom:15px; width:100%;">🔮 Pedir Honraria ao Ministério</button>`;

const replacementPerfil = `<button onclick="pedirTituloIA()" style="background:#4b0082; color:#fff; border-color:#9b59b6; margin-bottom:15px; width:100%;">🔮 Pedir Honraria ao Ministério</button>
        
        <!-- 🏆 PROEZAS BRUXAS & TÍTULOS EQUIPÁVEIS -->
        <div id="painel-conquistas-perfil" style="background:rgba(0,0,0,0.6); border:1px solid var(--ouro); border-radius:6px; padding:15px; margin-bottom:15px; text-align:left;">
            <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px dashed #555; padding-bottom:8px; margin-bottom:10px;">
                <h4 style="color:var(--ouro); margin:0; font-size:1em;">🏆 Proezas Bruxas & Títulos</h4>
                <span id="conquistas-count" style="color:#2ecc71; font-size:0.85em; font-weight:bold;">0 / 52 Desbloqueadas</span>
            </div>
            <div style="margin-bottom:10px;">
                <label style="color:#bbb; font-size:0.75em; display:block; margin-bottom:4px;">Título Equipado sobre o Nome:</label>
                <select id="seletor-titulo-equipado" onchange="window.equiparTituloSelecionado(this.value)" style="width:100%; background:#111; color:var(--ouro); border:1px solid var(--ouro); border-radius:4px; padding:6px; font-size:0.85em;"></select>
            </div>
            <div id="lista-conquistas-box" style="max-height:160px; overflow-y:auto; display:flex; flex-direction:column; gap:6px;"></div>
        </div>

        <!-- 🐸 SAPOS DE CHOCOLATE COLECIONÁVEIS -->
        <div id="painel-album-sapos-perfil" style="background:rgba(0,0,0,0.6); border:1px solid #d35400; border-radius:6px; padding:15px; margin-bottom:15px; text-align:left;">
            <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px dashed #d35400; padding-bottom:8px; margin-bottom:10px;">
                <h4 style="color:#e67e22; margin:0; font-size:1em;">🐸 Sapos de Chocolate Colecionáveis</h4>
                <span id="sapos-count" style="color:#f39c12; font-size:0.85em; font-weight:bold;">0 / 16 Figurinhas</span>
            </div>
            <button onclick="window.abrirSapoComprar()" style="width:100%; padding:8px; background:linear-gradient(to bottom, #d35400, #963a03); color:#fff; font-size:0.8em; margin-bottom:10px; border-radius:4px; border:1px solid #e67e22; cursor:pointer;">🍫 Comprar Sapo de Chocolate (20 Galeões)</button>
            <div id="lista-sapos-box" style="max-height:140px; overflow-y:auto; display:grid; grid-template-columns:repeat(auto-fill, minmax(90px, 1fr)); gap:6px;"></div>
        </div>`;

if (html.includes(targetPerfil)) {
    html = html.replace(targetPerfil, replacementPerfil);
    console.log('Injected Conquistas & Sapos in modal-perfil');
}

// 4. INJECT CHAT BEACON CARD RENDERER IN socket.on('nova_mensagem')
const targetChatMsg = `// 3. Injeta a mensagem no chat unificado
        box.innerHTML += \`<div class="chat-msg"><span style="color:\${corNome}; font-weight:bold;">\${dados.autor}:</span> <span style="color:#d0d5dc;">\${dados.texto}</span></div>\`; 
        box.scrollTop = box.scrollHeight;`;

const replacementChatMsg = `// 3. Injeta a mensagem no chat unificado (Suporte a Beacons Interativos "Participar Junto")
        if (dados.beacon) {
            box.innerHTML += \`
            <div class="chat-msg" style="background:linear-gradient(135deg, rgba(212,175,55,0.15), rgba(0,0,0,0.85)); border:1px solid var(--hp-gold); border-radius:6px; padding:10px 14px; margin:8px 0; box-shadow:0 0 15px rgba(212,175,55,0.25);">
                <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px dashed rgba(212,175,55,0.3); padding-bottom:4px; margin-bottom:6px;">
                    <span style="color:var(--hp-gold); font-weight:bold; font-size:0.88em; font-family:'Cinzel', serif;">⚡ \${dados.beacon.titulo}</span>
                    <span style="font-size:0.72em; color:#2ecc71; font-weight:bold;">Convite de \${dados.beacon.autorNome} (\${dados.beacon.autorCasa})</span>
                </div>
                <div style="margin:4px 0 8px 0; font-size:0.82em; color:#d0d5dc; line-height:1.4;">\${dados.texto}</div>
                <div style="display:flex; justify-content:flex-end;">
                    <button onclick="window.participarBeaconGlobal('\${dados.beacon.id}', '\${dados.beacon.tipo}')" style="width:auto; padding:5px 16px; background:linear-gradient(to bottom, #f1c40f, #b78a06); color:#000; font-weight:900; font-size:0.78em; border-radius:20px; border:none; cursor:pointer; box-shadow:0 0 10px rgba(241,196,15,0.6);">
                        ⚔️ \${dados.beacon.acaoBtn || 'PARTICIPAR JUNTO'}
                    </button>
                </div>
            </div>\`;
        } else {
            box.innerHTML += \`<div class="chat-msg"><span style="color:\${corNome}; font-weight:bold;">\${dados.autor}:</span> <span style="color:#d0d5dc;">\${dados.texto}</span></div>\`;
        }
        box.scrollTop = box.scrollHeight;`;

if (html.includes(targetChatMsg)) {
    html = html.replace(targetChatMsg, replacementChatMsg);
    console.log('Injected interactive beacon card renderer in nova_mensagem');
}

// 5. CALL renderizarGamificacaoUI in syncUI()
const targetSyncUI = `if (typeof renderizarGuardaRoupaUI === 'function') renderizarGuardaRoupaUI();`;
const replacementSyncUI = `if (typeof renderizarGuardaRoupaUI === 'function') renderizarGuardaRoupaUI();
            if (typeof window.renderizarGamificacaoUI === 'function') window.renderizarGamificacaoUI();`;

if (html.includes(targetSyncUI)) {
    html = html.replace(targetSyncUI, replacementSyncUI);
    console.log('Hooked renderizarGamificacaoUI in syncUI()');
}

// 6. INJECT CLIENT GAMIFICATION SCRIPT AT THE BOTTOM
const targetBottom = `window.atualizarVisualDeckSlots = function() {`;

const clientGamificationCode = `
// ==============================================================================
// 🌟 SISTEMA DE GAMIFICAÇÃO & BEACONS SOCIAIS NO CLIENTE ("PARTICIPAR JUNTO")
// ==============================================================================
window.gamificacaoCache = null;

window.carregarGamificacao = async function() {
    if (!meuBruxo || !meuBruxo.id) return null;
    try {
        const res = await fetch('/api/gamificacao/status?id=' + meuBruxo.id);
        const d = await res.json();
        if (!d.erro) window.gamificacaoCache = d;
        return d;
    } catch(e) { return null; }
};

window.renderizarGamificacaoUI = async function() {
    const data = await window.carregarGamificacao();
    if (!data) return;

    // A. DIÁRIO DO MAROTO
    const streakEl = document.getElementById('diario-streak-badge');
    if (streakEl) streakEl.innerText = \`🔥 Sequência: \${data.streakDias || 1} Dias\`;

    const progTxt = document.getElementById('diario-progresso-txt');
    const barraProg = document.getElementById('diario-barra-progresso');
    const concluidos = data.diario?.concluidosCount || 0;
    if (progTxt) progTxt.innerText = \`\${concluidos} / 5 Concluídas\`;
    if (barraProg) barraProg.style.width = \`\${(concluidos / 5) * 100}%\`;

    const listaTarefas = document.getElementById('diario-tarefas-lista');
    if (listaTarefas && data.diario?.tarefas) {
        listaTarefas.innerHTML = data.diario.tarefas.map(t => \`
            <div style="display:flex; justify-content:space-between; align-items:center; background:rgba(0,0,0,0.5); padding:8px 12px; border-radius:4px; border:1px solid \${t.concluida ? '#2ecc71' : '#444'};">
                <div style="display:flex; align-items:center; gap:8px;">
                    <span style="font-size:1.1em;">\${t.icone || '📜'}</span>
                    <span style="font-size:0.82em; color:\${t.concluida ? '#2ecc71' : '#eee'}; \${t.concluida ? 'text-decoration:line-through;' : ''}">\${t.texto}</span>
                </div>
                <span style="font-size:0.75em; font-weight:bold; color:\${t.concluida ? '#2ecc71' : 'var(--hp-gold)'};">
                    \${t.concluida ? '✓ CONCLUÍDO' : \`\${t.atual}/\${t.meta}\`}
                </span>
            </div>
        \`).join('');
    }

    // Botões dos Marcos
    const reivindicados = data.diario?.marcosReivindicados || [];
    [2, 4, 5].forEach(m => {
        const btn = document.getElementById('btn-marco-' + m);
        if (btn) {
            if (reivindicados.includes(m)) {
                btn.disabled = true;
                btn.innerText = \`✓ Resgatado (\${m}/5)\`;
                btn.style.color = '#777';
                btn.style.borderColor = '#333';
            } else if (concluidos >= m) {
                btn.disabled = false;
                btn.innerText = \`✨ RESGATAR (\${m}/5)\`;
                btn.style.borderColor = '#2ecc71';
                btn.style.color = '#2ecc71';
            } else {
                btn.disabled = true;
                btn.style.color = '#777';
            }
        }
    });

    // B. BOUNTIES DE HOGSMEADE
    const listaBounties = document.getElementById('hogsmeade-bounties-lista');
    if (listaBounties && data.bounties) {
        listaBounties.innerHTML = data.bounties.map(b => \`
            <div style="background:rgba(15,10,10,0.85); padding:10px 14px; border:1px solid \${b.aceito ? '#e74c3c' : '#444'}; border-left:4px solid #e74c3c; border-radius:4px;">
                <div style="display:flex; justify-content:space-between; align-items:center;">
                    <b style="color:#ff7675; font-size:0.92em;">\${b.nome}</b>
                    <span style="font-size:0.75em; color:var(--hp-gold); font-weight:bold;">+\${b.recompensa.galeoes}G | +\${b.recompensa.xp} XP</span>
                </div>
                <div style="font-size:0.75em; color:#bbb; margin:3px 0;">\${b.local} | Nível Mínimo: \${b.nivelMin}</div>
                <p style="font-size:0.78em; color:#ddd; margin:4px 0 8px 0;">\${b.descricao}</p>
                <div style="display:flex; justify-content:space-between; align-items:center;">
                    <span style="font-size:0.7em; color:#e67e22;">Modificador: \${b.modificadores[0] || 'Aura Brutal'}</span>
                    <button onclick="window.aceitarBountyClient('\${b.id}')" style="width:auto; padding:4px 12px; font-size:0.75em; background:\${b.aceito ? 'transparent' : '#c0392b'}; color:\${b.aceito ? '#2ecc71' : '#fff'}; border:1px solid \${b.aceito ? '#2ecc71' : '#e74c3c'}; cursor:pointer;">
                        \${b.aceito ? '✓ CONTRATO ATIVO' : '📜 ACEITAR CAÇADA'}
                    </button>
                </div>
            </div>
        \`).join('');
    }

    // C. CONQUISTAS E TÍTULOS NO PERFIL
    const countConq = document.getElementById('conquistas-count');
    if (countConq) countConq.innerText = \`\${(data.conquistas || []).length} / \${(data.catalogoConquistas || []).length} Desbloqueadas\`;

    const seletorTitulo = document.getElementById('seletor-titulo-equipado');
    if (seletorTitulo && data.catalogoConquistas) {
        let optHtml = '<option value="Aprendiz de Magia">Aprendiz de Magia (Padrão)</option>';
        data.catalogoConquistas.forEach(c => {
            if (data.conquistas.includes(c.id)) {
                let sel = data.tituloEquipado === c.titulo ? 'selected' : '';
                optHtml += \`<option value="\${c.titulo}" \${sel}>\${c.titulo} (+\${c.passiva.valor}% \${c.passiva.stat})</option>\`;
            }
        });
        seletorTitulo.innerHTML = optHtml;
    }

    const boxConq = document.getElementById('lista-conquistas-box');
    if (boxConq && data.catalogoConquistas) {
        boxConq.innerHTML = data.catalogoConquistas.map(c => {
            const has = data.conquistas.includes(c.id);
            return \`
                <div style="display:flex; justify-content:space-between; align-items:center; background:rgba(0,0,0,0.4); padding:4px 8px; border-radius:4px; border:1px solid \${has ? '#2ecc71' : '#333'}; font-size:0.75em;">
                    <span style="color:\${has ? '#2ecc71' : '#777'};">\${has ? '🏆' : '🔒'} \${c.nome}</span>
                    <span style="color:\${has ? 'var(--hp-gold)' : '#555'}; font-style:italic;">\${c.titulo}</span>
                </div>\`;
        }).join('');
    }

    // D. SAPOS DE CHOCOLATE NO PERFIL
    const countSapos = document.getElementById('sapos-count');
    if (countSapos) countSapos.innerText = \`\${(data.saposColecionados || []).length} / \${(data.catalogoSapos || []).length} Figurinhas\`;

    const boxSapos = document.getElementById('lista-sapos-box');
    if (boxSapos && data.catalogoSapos) {
        boxSapos.innerHTML = data.catalogoSapos.map(s => {
            const has = data.saposColecionados.includes(s.id);
            return \`
                <div style="background:rgba(0,0,0,0.5); border:1px solid \${has ? '#e67e22' : '#333'}; border-radius:4px; padding:6px; text-align:center; font-size:0.7em;">
                    <div style="font-size:1.4em;">\${has ? '🧙' : '❓'}</div>
                    <div style="color:\${has ? '#f39c12' : '#555'}; font-weight:bold; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">\${has ? s.nome : 'Bloqueado'}</div>
                    <div style="font-size:0.75em; color:\${has ? '#2ecc71' : '#444'};">\${has ? s.bonus : '---'}</div>
                </div>\`;
        }).join('');
    }
};

window.reivindicarMarco = async function(marco) {
    if (!meuBruxo || !meuBruxo.id) return;
    playSFX('click');
    try {
        const res = await fetch('/api/gamificacao/diario/reivindicar', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: meuBruxo.id, marco })
        });
        const d = await res.json();
        if (d.erro) return mostrarNotificacao(d.erro, 'erro');
        playSFX('victory');
        mostrarNotificacao(d.msg, 'sucesso');
        syncRequest();
    } catch(e) { mostrarNotificacao('Erro ao resgatar recompensa.', 'erro'); }
};

window.equiparTituloSelecionado = async function(titulo) {
    if (!meuBruxo || !meuBruxo.id) return;
    playSFX('click');
    try {
        const res = await fetch('/api/gamificacao/titulos/equipar', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: meuBruxo.id, tituloId: titulo })
        });
        const d = await res.json();
        if (d.erro) return mostrarNotificacao(d.erro, 'erro');
        mostrarNotificacao(d.msg, 'sucesso');
        playSFX('magic');
        meuBruxo.tituloEquipado = d.tituloEquipado;
        syncRequest();
    } catch(e) {}
};

window.aceitarBountyClient = async function(bountyId) {
    if (!meuBruxo || !meuBruxo.id) return;
    playSFX('click');
    try {
        const res = await fetch('/api/gamificacao/bounties/aceitar', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: meuBruxo.id, bountyId })
        });
        const d = await res.json();
        if (d.erro) return mostrarNotificacao(d.erro, 'erro');
        mostrarNotificacao(d.msg, 'sucesso');
        playSFX('magic');
        window.renderizarGamificacaoUI();
    } catch(e) {}
};

window.abrirSapoComprar = async function() {
    if (!meuBruxo || !meuBruxo.id) return;
    playSFX('click');
    try {
        const res = await fetch('/api/gamificacao/sapos/abrir', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: meuBruxo.id })
        });
        const d = await res.json();
        if (d.erro) return mostrarNotificacao(d.erro, 'erro');
        playSFX('magic');
        mostrarNotificacao(\`🍫 Abriste um Sapo de Chocolate e encontraste: \${d.sapo.nome} (\${d.sapo.raridade})! \${d.sapo.bonus}\`, 'sucesso');
        syncRequest();
    } catch(e) {}
};

window.descansarSalaComunal = async function() {
    if (!meuBruxo || !meuBruxo.id) return;
    playSFX('click');
    try {
        const res = await fetch('/api/social/descansar', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: meuBruxo.id, minutos: 3 })
        });
        const d = await res.json();
        if (d.erro) return mostrarNotificacao(d.erro, 'erro');
        mostrarNotificacao(d.msg, 'sucesso');
        playSFX('magic');
        syncRequest();
    } catch(e) {}
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

        // Roteamento inteligente para o conteúdo em coop
        if (tipo === 'combate_mundo' || tipo === 'masmorra') {
            if (d.beacon.dados?.alvoId) {
                mmoInteragirMundo(d.beacon.dados.alvoId, 'combate');
            } else {
                nav('castelo');
            }
        } else if (tipo === 'estufa') {
            nav('estufa');
        } else if (tipo === 'pocao') {
            nav('inventario');
        } else if (tipo === 'biblioteca') {
            nav('biblioteca');
        } else if (tipo === 'quadribol') {
            if (typeof abrirQuadribol === 'function') abrirQuadribol();
        }
        syncRequest();
    } catch(e) { mostrarNotificacao('Erro ao juntar-se à convocação.', 'erro'); }
};

window.emitirBeaconRumor = function(mobId, mobNome) {
    if (!meuBruxo || !meuBruxo.id) return;
    playSFX('magic');
    fetch('/api/social/beacon/criar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            id: meuBruxo.id,
            tipo: 'combate_mundo',
            titulo: \`⚔️ Alerta de Caçada: \${mobNome}\`,
            descricao: \`\${meuBruxo.nome} precisa de reforços para combater \${mobNome}! Clica abaixo para entrar.\`,
            dados: { alvoId: mobId, zona: zonaAtual }
        })
    }).then(r => r.json()).then(d => {
        if (d.sucesso) mostrarNotificacao('Convocação enviada ao chat do castelo!', 'sucesso');
    }).catch(()=>{});
};

window.atualizarVisualDeckSlots = function() {`;

if (html.includes(targetBottom)) {
    html = html.replace(targetBottom, clientGamificationCode);
    console.log('Injected client gamification scripts at the bottom');
} else {
    console.error('Target bottom not found');
}

fs.writeFileSync('c:/hogwarts/index.html', html, 'utf8');
console.log('Done applying gamification UI patches to index.html!');
