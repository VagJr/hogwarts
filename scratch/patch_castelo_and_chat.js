const fs = require('fs');

let html = fs.readFileSync('c:/hogwarts/index.html', 'utf8');

// 1. Invasão às Cozinhas + Descansar button
const regexCastelo = /(<button onclick="abrirMinigameCozinha\(\)"[^>]*>🍗 Invasão às Cozinhas<\/button>\s*<button onclick="coletarRecursos\(\)"[^>]*>🌿 Vasculhar Terreno<\/button>)/;
const matchCastelo = html.match(regexCastelo);
console.log('Match Castelo:', !!matchCastelo);

if (matchCastelo) {
    const replacement = `${matchCastelo[0]}
                <button onclick="window.descansarSalaComunal()" style="background:#1b2631; border-color:#3498db; color:#5dade2; width:auto; padding:5px 15px; border-radius:20px; font-size:0.8em; box-shadow:0 0 10px rgba(52,152,219,0.2); cursor:pointer;">💤 Descansar (+Aura XP)</button>`;
    html = html.replace(matchCastelo[0], replacement);
    console.log('Rest button injected successfully!');
}

// 2. Chat beacon card in nova_mensagem
const regexChat = /\/\/\s*3\.\s*Injeta a mensagem no chat unificado\r?\n\s*box\.innerHTML\s*\+=\s*`<div class="chat-msg"><span style="color:\$\{corNome\}; font-weight:bold;">\$\{dados\.autor\}:<\/span> <span style="color:#d0d5dc;">\$\{dados\.texto\}<\/span><\/div>`;\s*\r?\n\s*box\.scrollTop\s*=\s*box\.scrollHeight;/;

const matchChat = html.match(regexChat);
console.log('Match Chat:', !!matchChat);

if (matchChat) {
    const replacementChat = `// 3. Injeta a mensagem no chat unificado (Com suporte a Beacons Interativos "Participar Junto")
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

    html = html.replace(matchChat[0], replacementChat);
    console.log('Interactive beacon card injected in nova_mensagem successfully!');
}

// 3. Banner da Taça das Casas com Bênção dos Fundadores
const regexRumores = /(<div class="card" style="border-color:\s*#f1c40f; background:\s*rgba\(241,\s*196,\s*15,\s*0\.05\);)/;
const matchRumores = html.match(regexRumores);
console.log('Match Rumores:', !!matchRumores);

if (matchRumores) {
    const bannerBencao = `<div id="banner-bencao-casas" style="background:rgba(20,15,5,0.75); border:1px solid var(--hp-gold); border-radius:6px; padding:10px 15px; margin-bottom:15px; display:flex; justify-content:space-between; align-items:center; box-shadow:0 0 15px rgba(212,175,55,0.15);">
                <div style="display:flex; align-items:center; gap:10px;">
                    <span style="font-size:1.6em;">🏆</span>
                    <div>
                        <div style="font-size:0.85em; font-weight:bold; color:var(--hp-gold);">A Taça das Casas: <span id="ui-bencao-casa-lider" style="color:#fff;">Grifinória na Liderança</span></div>
                        <div id="ui-bencao-descricao" style="font-size:0.75em; color:#bbb;">Bênção dos Fundadores: +10% Velocidade de Movimento & +10% Juros em Gringotes</div>
                    </div>
                </div>
                <button onclick="document.getElementById('modal-placar-casas').classList.remove('oculto')" style="width:auto; padding:5px 12px; font-size:0.75em; background:transparent; border:1px dashed var(--hp-gold); color:var(--hp-gold); cursor:pointer;">Ampulhetas</button>
            </div>
            $1`;
    html = html.replace(matchRumores[0], bannerBencao);
    console.log('Banner da Taça das Casas injected successfully!');
}

fs.writeFileSync('c:/hogwarts/index.html', html, 'utf8');
console.log('Done!');
