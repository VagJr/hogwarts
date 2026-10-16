const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

// Look for socket listeners in client
const socketEvents = [...html.matchAll(/socket\.on\(['"]([^'"]+)['"]/g)].map(m => m[1]);
console.log('Client socket.on events:', [...new Set(socketEvents)]);

// Look for socket emits in client
const socketEmits = [...html.matchAll(/socket\.emit\(['"]([^'"]+)['"]/g)].map(m => m[1]);
console.log('Client socket.emit events:', [...new Set(socketEmits)]);

// Look for occurrences of "rumor", "criatura", "dungeon", "masmorra", "combate"
const matches = [];
const lines = html.split('\n');
lines.forEach((l, i) => {
    if (/rumor|criatura|bicho|masmorra|dungeon|iniciar_combate|batalha/i.test(l)) {
        matches.push({ line: i + 1, text: l.trim().slice(0, 100) });
    }
});
console.log('\nFound ' + matches.length + ' lines with rumor/criatura/masmorra/etc. First 25:');
matches.slice(0, 25).forEach(m => console.log(`  L${m.line}: ${m.text}`));
