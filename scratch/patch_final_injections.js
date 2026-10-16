const fs = require('fs');

let html = fs.readFileSync('c:/hogwarts/index.html', 'utf8');

// 1. Exam Desk Regex Replacement
const examRegex = /<div id="painel-acao-aula"[\s\S]*?<\/div>/;
const examMatch = html.match(examRegex);
console.log('Exam regex match found:', !!examMatch);

if (examMatch) {
    const examReplacement = `${examMatch[0]}
                    
                    <div id="painel-exame-ministerio" style="background:rgba(20,15,5,0.85); border:1px solid #d4af37; border-radius:6px; padding:15px; margin-top:15px; text-align:center; box-shadow:0 0 15px rgba(212,175,55,0.2);">
                        <h4 style="color:var(--hp-gold); margin:0 0 5px 0; font-size:1.1em; font-family:'Cinzel', serif;">📜 Banca Examinadora de Hogwarts (N.O.M.s / N.I.E.M.s)</h4>
                        <p style="color:#bbb; font-size:0.8em; margin:0 0 12px 0;">Submete o teu conhecimento prático e teórico aos avaliadores do Ministério para avançares de ano letivo (1º ao 7º Ano).</p>
                        <button onclick="window.realizarExameAcademia()" style="background:linear-gradient(to bottom, #d4af37, #997c22); color:#000; font-weight:bold; padding:10px 20px; font-size:0.95em; border-radius:4px; border:1px solid #f1c40f; box-shadow:0 0 10px rgba(212,175,55,0.3); cursor:pointer;">
                            🎓 Prestar Exame Oficial de Ano
                        </button>
                        <div id="exame-resultado-box" class="oculto" style="margin-top:12px; padding:12px; background:rgba(0,0,0,0.8); border:1px solid #d4af37; border-radius:4px;"></div>
                    </div>`;
    html = html.replace(examMatch[0], examReplacement);
    console.log('Exam panel injected successfully!');
}

// 2. Deck visual slots Regex Replacement
const deckRegex = /<div style="text-align:center; margin-bottom:15px; color:var\(--hp-gold\); font-weight:bold; font-size:1\.2em; background:rgba\(0,0,0,0\.5\); padding:8px; border-radius:20px; border:1px solid #555;">[\s\S]*?Slots Ocupados:[\s\S]*?<\/div>/;
const deckMatch = html.match(deckRegex);
console.log('Deck regex match found:', !!deckMatch);

if (deckMatch) {
    const deckReplacement = `<div style="text-align:center; margin-bottom:12px; color:var(--hp-gold); font-weight:bold; font-size:1.1em; background:rgba(0,0,0,0.5); padding:8px; border-radius:20px; border:1px solid #555;">
    Slots do Grimório: <span id="deck-count" style="color:#fff;">0</span> / 6
</div>
<div id="deck-slots-visual" style="display:flex; flex-wrap:wrap; gap:8px; justify-content:center; margin-bottom:12px; padding:10px; background:rgba(0,0,0,0.6); border-radius:6px; border:1px solid #333;"></div>
<div style="margin-top:5px; margin-bottom:12px; background:rgba(0,0,0,0.5); padding:8px 12px; border-radius:6px; border:1px dashed #555;">
    <div style="font-size:0.8em; color:var(--hp-gold); margin-bottom:6px; font-weight:bold; text-align:center;">🧪 Cinto de Consumíveis Rápidos [Teclas 5 e 6]</div>
    <div style="display:flex; justify-content:center; gap:10px; flex-wrap:wrap;">
        <div style="background:rgba(231,76,60,0.15); border:1px solid #e74c3c; border-radius:4px; padding:4px 8px; font-size:0.75em; color:#ff7675;">
            Slot 1 [Tecla 5]: 🧪 Wiggenweld (+400 HP)
        </div>
        <div style="background:rgba(52,152,219,0.15); border:1px solid #3498db; border-radius:4px; padding:4px 8px; font-size:0.75em; color:#74b9ff;">
            Slot 2 [Tecla 6]: 💙 Foco Lúcido (+30 Foco)
        </div>
    </div>
</div>`;
    html = html.replace(deckMatch[0], deckReplacement);
    console.log('Deck visual slots injected successfully!');
}

// 3. Combat hotbar potion belt
const hotbarTarget = `<div class="hotbar" id="ca-hotbar" style="padding: 10px; max-height: 25vh; overflow-y: auto;"></div>`;
if (html.includes(hotbarTarget)) {
    const hotbarReplacement = `<div class="hotbar" id="ca-hotbar" style="padding: 10px; max-height: 25vh; overflow-y: auto;"></div>
            <div id="ca-potion-belt" style="display:flex; justify-content:center; gap:12px; padding:6px 10px 10px; background:rgba(10,10,10,0.95); border-top:1px dashed #333;">
                <button onclick="window.consumirPocaoBolsa(0)" id="btn-potion-slot-0" style="width:auto; padding:6px 14px; font-size:0.8em; background:rgba(231,76,60,0.2); border:1px solid #e74c3c; color:#ff7675; border-radius:20px; display:flex; align-items:center; gap:6px; cursor:pointer;">
                    🧪 <span>[5] Poção Wiggenweld (+400 HP)</span>
                </button>
                <button onclick="window.consumirPocaoBolsa(1)" id="btn-potion-slot-1" style="width:auto; padding:6px 14px; font-size:0.8em; background:rgba(52,152,219,0.2); border:1px solid #3498db; color:#74b9ff; border-radius:20px; display:flex; align-items:center; gap:6px; cursor:pointer;">
                    💙 <span>[6] Foco Lúcido (+30 Foco)</span>
                </button>
            </div>`;
    html = html.replace(hotbarTarget, hotbarReplacement);
    console.log('Hotbar potion belt injected successfully!');
}

// 4. Combat Keys 1-6
const keysRegex = /\/\/ 1-4: Atalho para feitiços em combate[\s\S]*?if \(\['1', '2', '3', '4'\]\.includes\(k\)\) \{[\s\S]*?\}\s*\}\s*\}/;
const keysMatch = html.match(keysRegex);
console.log('Keys regex match found:', !!keysMatch);

if (keysMatch) {
    const keysReplacement = `// 1-6: Atalho para feitiços e consumíveis rápidos em combate
    if (['1', '2', '3', '4', '5', '6'].includes(k)) {
        if (k === '5') {
            e.preventDefault();
            if (typeof window.consumirPocaoBolsa === 'function') window.consumirPocaoBolsa(0);
            return;
        }
        if (k === '6') {
            e.preventDefault();
            if (typeof window.consumirPocaoBolsa === 'function') window.consumirPocaoBolsa(1);
            return;
        }
        if (combatEngineAtivo && meuBruxo && (meuBruxo.deckCombate || meuBruxo.feitiçosEquipados)) {
            const deck = meuBruxo.deckCombate || meuBruxo.feitiçosEquipados;
            const idx = parseInt(k) - 1;
            if (deck[idx]) {
                e.preventDefault();
                if (typeof usarFeiticoDeck === 'function') {
                    usarFeiticoDeck(deck[idx], idx);
                } else if (typeof lançarFeiticoFloresta === 'function') {
                    lançarFeiticoFloresta(deck[idx]);
                }
            }
        }
    }`;
    html = html.replace(keysMatch[0], keysReplacement);
    console.log('Combat keys 1-6 updated successfully!');
}

fs.writeFileSync('c:/hogwarts/index.html', html, 'utf8');
console.log('Done patching index.html!');
