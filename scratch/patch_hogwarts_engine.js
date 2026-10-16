const fs = require('fs');

const file = 'index.html';
let content = fs.readFileSync(file, 'utf8');

// 1. Add <script src="HogwartsMMOEngine.js"></script> in <head>
if (!content.includes('src="HogwartsMMOEngine.js"')) {
    content = content.replace(
        '<script src="/socket.io/socket.io.js"></script>',
        '<script src="/socket.io/socket.io.js"></script>\n<script src="HogwartsMMOEngine.js"></script>'
    );
    console.log('Added script tag for HogwartsMMOEngine.js');
}

// 2. Add interaction prompt and HUD controls in #mmo-world-container
const mmoKnobRegex = /(<div id="mmo-joystick-zone"[\s\S]*?<\/div>\s*<\/div>)/;
if (mmoKnobRegex.test(content) && !content.includes('id="mmo-interaction-prompt"')) {
    const promptHtml = `$1
            
            <!-- Prompt Interativo de Mistérios [E] -->
            <div id="mmo-interaction-prompt" class="oculto" style="position:absolute; bottom:30px; left:50%; transform:translateX(-50%); background:rgba(10,8,5,0.92); border:2px solid var(--hp-gold); border-radius:30px; padding:10px 24px; color:#fff; font-family:'Cinzel', serif; font-size:0.95em; z-index:150; box-shadow:0 0 20px rgba(212,175,55,0.6); pointer-events:auto; display:flex; align-items:center; gap:10px; cursor:pointer;" onclick="if(window.HogwartsMMOEngine) window.HogwartsMMOEngine.executarInteracaoProxima()">
                <span style="background:var(--hp-gold); color:#000; font-weight:bold; padding:2px 8px; border-radius:4px; font-size:0.85em;">E</span>
                <span id="mmo-interaction-text">Interagir</span>
            </div>
            
            <div style="position:absolute; top:10px; left:50%; transform:translateX(-50%); background:rgba(0,0,0,0.75); border:1px solid rgba(255,255,255,0.2); border-radius:20px; padding:4px 16px; color:#bbb; font-size:0.75em; z-index:20; pointer-events:none;">
                <span>[WASD / Setas] Mover</span> | <span>[SHIFT] Correr</span> | <span>[E] Interagir</span>
            </div>`;
    content = content.replace(mmoKnobRegex, promptHtml);
    console.log('Added interaction prompt to #mmo-world-container');
}

// 3. Replace the old inline HogwartsMMOEngine object (lines 9196-10008)
const oldEngineRegex = /const HogwartsMMOEngine = \{[\s\S]*?this\.loop = requestAnimationFrame\(this\.tick\.bind\(this\)\);\s*\}\s*\};/;

if (oldEngineRegex.test(content)) {
    content = content.replace(oldEngineRegex, `// 🏰 O NOVO MOTOR HOGWARTS MMO 3.0 É CARREGADO A PARTIR DE HogwartsMMOEngine.js
    // 13 Ambientes Canônicos Detalhados, Física Deslizante, Zero Travamentos e Sincronização Multiplayer
    var HogwartsMMOEngine = window.HogwartsMMOEngine || {};`);
    console.log('Successfully replaced old inline HogwartsMMOEngine with reference to HogwartsMMOEngine.js');
} else {
    console.error('Could not find oldEngineRegex in index.html');
}

fs.writeFileSync(file, content, 'utf8');
console.log('index.html updated successfully.');
