const fs = require('fs');
const vm = require('vm');

const html = fs.readFileSync('c:/hogwarts/index.html', 'utf8');
const scriptRegex = /<script(?:\s+[^>]*)?>([\s\S]*?)<\/script>/gi;
let match;
let count = 0;
let errors = 0;

while ((match = scriptRegex.exec(html)) !== null) {
    count++;
    const code = match[1];
    // skip external scripts if empty
    if (!code.trim()) continue;
    try {
        new vm.Script(code, { filename: `inline-script-${count}.js` });
        console.log(`Script ${count}: Syntax OK (${code.length} chars)`);
    } catch (e) {
        errors++;
        console.error(`Script ${count} Syntax ERROR:`, e.message);
        const stack = e.stack.split('\n');
        console.error(stack.slice(0, 5).join('\n'));
    }
}

if (errors === 0) {
    console.log(`\nSUCCESS: All ${count} scripts compiled cleanly with zero syntax errors!`);
} else {
    console.error(`\nFAILED: Found ${errors} syntax errors.`);
    process.exit(1);
}
