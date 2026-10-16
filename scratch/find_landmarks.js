const fs = require('fs');
const html = fs.readFileSync('c:/hogwarts/index.html', 'utf8');
const lines = html.split('\n');
lines.forEach((l, idx) => {
    if (l.includes('aba-aventura') || l.includes('modal-perfil') || l.includes('taca-lider')) {
        console.log((idx + 1) + ': ' + l.trim());
    }
});
