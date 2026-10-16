const fs = require('fs');
const content = fs.readFileSync('c:/hogwarts/HogwartsMMOEngine.js', 'utf8');

const regex = /tipo:\s*'([^']+)'/g;
const tipos = new Set();
let m;
while ((m = regex.exec(content)) !== null) {
    tipos.add(m[1]);
}

console.log('Total unique tipos in HogwartsMMOEngine.js:', tipos.size);
console.log([...tipos].sort());
