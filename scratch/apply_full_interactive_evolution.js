const fs = require('fs');

const file = 'index.html';
let content = fs.readFileSync(file, 'utf8');

// 1. Restore Rumores card under banner-bencao-casas in aba-castelo
const bannerAnchor = `id="banner-bencao-casas"`;
if (content.includes(bannerAnchor) && !content.includes('id="mmo-live-events"')) {
    const bannerCloseRegex = /(<div id="banner-bencao-casas"[\s\S]*?<\/button>\s*<\/div>)/;
    const rumoresCardHtml = `$1

            <div class="card" style="border-color: #f1c40f; margin-bottom: 15px; padding: 10px;">
                <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px dashed #f1c40f; padding-bottom:5px; margin-bottom:10px;">
                    <h4 style="color:var(--hp-gold); margin:0; font-size:1em;">✨ Rumores e Aparições</h4>
                    <span style="font-size:0.7em; color:#2ecc71; animation: pulse 2s infinite;">(Eventos do Mundo)</span>
                </div>
                <div id="mmo-live-events" style="display:flex; gap:10px; overflow-x:auto; padding-bottom:5px;">
                    <p style="color:#666; font-size:0.8em; width:100%; text-align:center; font-style:italic;">A magia no castelo encontra-se serena neste momento...</p>
                </div>
            </div>`;
    content = content.replace(bannerCloseRegex, rumoresCardHtml);
    console.log('Restored mmo-live-events card under banner-bencao-casas.');
} else {
    console.log('mmo-live-events already exists or banner not found.');
}

// 2. Enhance mmo_world_update to add Convidar Aliados buttons to creatures and items
const oldWorldUpdateRegex = /socket\.on\('mmo_world_update'[\s\S]*?container\.innerHTML = html \|\| "<p style='color:#666; font-size:0.8em; width:100%; text-align:center;'>O castelo está calmo\.\.\.<\/p>";\s*\}\);/;

const newWorldUpdate = `socket.on('mmo_world_update', (sala) => {
    window.objetosDoMundo = { entidades: sala.entidades || [], itens: sala.itens || [] };
    const container = document.getElementById('mmo-live-events');
    if(!container) return;
    
    let html = '';
    sala.entidades.forEach(m => {
        let elWait = document.getElementById(\`wait_\${m.id}\`);
        let isWaiting = elWait && elWait.innerText.includes("Preparando");
        let statusText = isWaiting ? elWait.innerText : "Livre para ataque";
        let btnDisabled = isWaiting ? "disabled" : "";
        let btnText = isWaiting ? "AGUARDANDO..." : "⚔️ COMBATE";

        html += \`
        <div class="action-card" id="card_\${m.id}" style="border-color:#e74c3c; min-width:180px; position:relative; background:rgba(20,5,5,0.7);">
            <b style="color:#e74c3c; display:block; margin-bottom:4px;">👾 \${m.nome}</b>
            <div id="wait_\${m.id}" style="font-size:0.7em; color:var(--hp-gold); margin-bottom:6px;">\${statusText}</div>
            <div style="display:flex; flex-direction:column; gap:4px;">
                <button onclick="mmoInteragirMundo('\${m.id}', 'combate')" \${btnDisabled} style="background:linear-gradient(to bottom, #c0392b, #781e17); font-size:0.78em; padding:5px 8px;">\${btnText}</button>
                <button onclick="window.emitirBeaconRumor('\${m.id}', '\${m.nome.replace(/'/g, "\\\\'")}')" style="background:linear-gradient(135deg, #8e44ad, #5b2c6f); font-size:0.72em; padding:4px 6px; border:none; border-radius:4px; cursor:pointer;">📢 Convidar Aliados</button>
            </div>
        </div>\`;
    });

    sala.itens.forEach(i => {
        html += \`
        <div class="action-card" id="card_\${i.id}" style="border-color:#2ecc71; min-width:180px; background:rgba(5,20,10,0.7);">
            <b style="color:#2ecc71; display:block; margin-bottom:4px;">📦 \${i.nome}</b>
            <div id="prog_\${i.id}" style="font-size:0.65em; color:#aaa; margin-bottom:6px;">Distante...</div>
            <div style="display:flex; flex-direction:column; gap:4px;">
                <button onclick="iniciarMinigameColeta('\${i.id}')" style="background:linear-gradient(to bottom, #27ae60, #196f3d); font-size:0.78em; padding:5px 8px;">🔎 PROCURAR</button>
                <button onclick="window.emitirBeaconAtividade('coleta', '📦 Artefato no Castelo: \${i.nome.replace(/'/g, "\\\\'")}', 'Um item misterioso apareceu! Vamos resgatar juntos!', { alvoId: '\${i.id}' })" style="background:linear-gradient(135deg, #d35400, #935116); font-size:0.72em; padding:4px 6px; border:none; border-radius:4px; cursor:pointer;">📢 Convidar Busca</button>
            </div>
        </div>\`;
    });
    container.innerHTML = html || "<p style='color:#666; font-size:0.8em; width:100%; text-align:center;'>A magia no castelo encontra-se serena neste momento...</p>";
});`;

if (oldWorldUpdateRegex.test(content)) {
    content = content.replace(oldWorldUpdateRegex, newWorldUpdate);
    console.log('Enhanced mmo_world_update with creature & chest beacon invitation buttons.');
} else {
    console.log('oldWorldUpdateRegex did not match.');
}

// 3. Enhance mmoInteragirMundo to automatically broadcast beacon when starting combat
const oldInteragirRegex = /window\.mmoInteragirMundo\s*=\s*function\(idAlvo,\s*tipo\)\s*\{[\s\S]*?socket\.emit\('mmo_action',\s*\{\s*idAlvo,\s*tipo,\s*zona:\s*zonaAtual\s*\}\);\s*\};/;

const newInteragir = `window.mmoInteragirMundo = function(idAlvo, tipo) {
    playSFX('magic');
    if(tipo === 'combate') {
        const btn = event?.target;
        if (btn) {
            btn.disabled = true;
            btn.innerText = "AGUARDANDO...";
        }
        // Dispara automaticamente Convocação Coletiva ("Participar Junto") no Chat MMO
        const entidade = (window.objetosDoMundo?.entidades || []).find(e => e.id === idAlvo);
        const nomeEntidade = entidade ? entidade.nome : 'Criatura Sombria';
        if (window.meuBruxo && window.emitirBeaconAtividade) {
            window.emitirBeaconAtividade(
                'combate_mundo',
                \`⚔️ Combate contra \${nomeEntidade}\`,
                \`\${window.meuBruxo.nome} está a iniciar duelo contra [\${nomeEntidade}]! Clica abaixo para participar junto!\`,
                { alvoId: idAlvo, zona: window.zonaAtual }
            );
        }
    }
    socket.emit('mmo_action', { idAlvo, tipo, zona: zonaAtual });
};`;

if (oldInteragirRegex.test(content)) {
    content = content.replace(oldInteragirRegex, newInteragir);
    console.log('Enhanced mmoInteragirMundo with auto-broadcast beacon.');
} else {
    console.log('oldInteragirRegex did not match.');
}

fs.writeFileSync(file, content, 'utf8');
console.log('Part 1 applied successfully.');
