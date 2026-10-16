const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');
const lines = html.split(/\r?\n/);
lines.forEach((l, i) => {
    if (l.includes('mmo_sync_posicoes')) {
        console.log(`L${i+1}: ${l.trim().slice(0, 120)}`);
    }
});
