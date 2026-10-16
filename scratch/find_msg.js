const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');
const lines = html.split(/\r?\n/);
lines.forEach((l, i) => {
    if (l.includes('nova_mensagem')) {
        console.log(`L${i+1}: ${l.slice(0, 100)}`);
    }
});
