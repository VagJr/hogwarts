const fs = require('fs');

const html = fs.readFileSync('index.html', 'utf8');

// 1. Canvases
const canvases = [...html.matchAll(/<canvas[^>]*id=["']([^"']+)["'][^>]*>/g)].map(m => m[1]);
console.log('Canvases found:', canvases);

// 2. Buttons or links to map / mapa
const mapButtons = [];
const lines = html.split(/\r?\n/);
lines.forEach((l, i) => {
    if (/mapa|explorar|andar|castelo.*mapa|forest-map/i.test(l)) {
        if (l.includes('button') || l.includes('onclick') || l.includes('nav(') || l.includes('id=')) {
            mapButtons.push({ line: i + 1, text: l.trim().slice(0, 120) });
        }
    }
});
console.log('\nMap references (first 30):');
mapButtons.slice(0, 30).forEach(b => console.log(`  L${b.line}: ${b.text}`));

// 3. Search for map engines / loops in JavaScript
const engines = [];
lines.forEach((l, i) => {
    if (/Engine|Map|Walk|Mover|Joystick|teclado|loop.*render/i.test(l)) {
        if (l.includes('const ') || l.includes('let ') || l.includes('var ') || l.includes('function ') || l.includes('class ')) {
            engines.push({ line: i + 1, text: l.trim().slice(0, 120) });
        }
    }
});
console.log('\nEngines / functions related to map/movement (first 30):');
engines.slice(0, 30).forEach(e => console.log(`  L${e.line}: ${e.text}`));
