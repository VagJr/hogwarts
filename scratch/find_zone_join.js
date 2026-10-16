const fs = require('fs');

function search(file, str) {
    const content = fs.readFileSync(file, 'utf8');
    const lines = content.split(/\r?\n/);
    lines.forEach((l, i) => {
        if (l.includes(str)) {
            console.log(`${file}:${i+1}: ${l.trim().slice(0, 120)}`);
        }
    });
}

search('server.js', 'entrar_zona');
search('index.html', 'entrar_zona');
search('server.js', 'join(');
search('index.html', 'mmo_mover');
