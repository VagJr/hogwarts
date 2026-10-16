'use strict';

const fs = require('fs');
const { spawnSync } = require('child_process');

let failed = false;
const ok = msg => console.log(`PASS  ${msg}`);
const bad = msg => { failed = true; console.error(`FAIL  ${msg}`); };

const required = [
  'server.js',
  'HogwartsCore.js',
  'HogwartsMMOEngine.js',
  'GamificacaoHogwarts.js',
  'index.html',
  'product/server-product-v2.js',
  'product/client-product-v2.js',
  'product/product-v2.css'
];

for (const f of required) {
  if (fs.existsSync(f)) ok(`exists ${f}`);
  else bad(`missing ${f}`);
}

for (const f of [
  'server.js',
  'HogwartsCore.js',
  'GamificacaoHogwarts.js',
  'product/server-product-v2.js',
  'product/client-product-v2.js',
  'scripts/preflight-v2.js'
]) {
  if (!fs.existsSync(f)) continue;
  const r = spawnSync(process.execPath, ['--check', f], { encoding: 'utf8' });
  if (r.status === 0) ok(`syntax ${f}`);
  else bad(`syntax ${f}: ${r.stderr || r.stdout}`);
}

const server = fs.readFileSync('server.js', 'utf8');
const core = fs.readFileSync('HogwartsCore.js', 'utf8');
const index = fs.readFileSync('index.html', 'utf8');

if (server.includes('installHogwartsProductV2')) ok('server installs Product V2');
else bad('Product V2 runtime not installed');

if (index.includes('/product/product-v2.css') && index.includes('/product/client-product-v2.js')) {
  ok('client Product V2 assets linked');
} else bad('Product V2 client assets are not linked');

if (!core.includes('Math.random() < chance || true')) ok('secret exploration chance fixed');
else bad('forced secret success still present');

if (!core.includes('aa.nuques')) ok('world boss undefined aa fixed');
else bad('world boss still references aa');

const doubleDamage = /if\s*\(dano\s*>\s*0\)\s*inimigo\.hpAtual\s*-=\s*dano;\s*if\s*\(dano\s*>\s*0\)\s*inimigo\.hpAtual\s*-=\s*dano;/m.test(core);
if (!doubleDamage) ok('PvP double-damage bug fixed');
else bad('PvP still applies damage twice');

if (!core.includes('vendedor.cofreGringotes = (parseInt(vendedor.cofreGringotes)')) ok('market bank structure fixed');
else bad('market still flattens Gringotes object');

if (!index.includes('meuBruxo.casa.toLowerCase()')) ok('house toLowerCase null crash guarded');
else bad('unsafe house toLowerCase still present');

const dupMira = (index.match(/function\s+atualizarPosicaoMira\s*\(/g) || []).length;
console.log(`INFO  legacy atualizarPosicaoMira definitions: ${dupMira} (left intact intentionally for compatibility)`);

if (!process.env.SESSION_SECRET) console.warn('WARN  configure SESSION_SECRET before production.');
if (!process.env.ADMIN_PLAYER_ID) console.warn('WARN  configure ADMIN_PLAYER_ID for admin tools.');

if (failed) process.exit(1);
console.log('\nHogwarts Product V2 preflight completed successfully.');
