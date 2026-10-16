const fs = require('fs');
const code = fs.readFileSync('server.js', 'utf8');
const lines = code.split(/\r?\n/);
lines.forEach((l, i) => {
    if (l.includes('playersOnlineMmo') || l.includes('mmo_sync') || l.includes('setInterval') && l.includes('mmo')) {
        console.log(`L${i+1}: ${l.trim().slice(0, 120)}`);
    }
});
