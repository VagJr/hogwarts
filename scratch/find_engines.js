const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

// Find occurrences of mmo-world-canvas
const lines = html.split(/\r?\n/);
console.log('--- mmo-world-canvas occurrences: ---');
lines.forEach((l, i) => {
    if (l.includes('mmo-world-canvas')) {
        console.log(`L${i+1}: ${l.trim()}`);
    }
});

console.log('\n--- ForestMMOEngine or similar engines: ---');
lines.forEach((l, i) => {
    if (/ForestMMOEngine|MundoEngine|HogwartsEngine|MMOEngine/i.test(l)) {
        console.log(`L${i+1}: ${l.trim().slice(0, 100)}`);
    }
});
