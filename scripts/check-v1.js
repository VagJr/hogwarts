'use strict';

const fs = require('fs');
const { spawnSync } = require('child_process');

const mustExist = [
  'server.js',
  'HogwartsCore.js',
  'index.html',
  'v1/server-runtime.js',
  'v1/content.js',
  'v1-client.js',
  'v1.css'
];

let failed = false;
function pass(msg) { console.log(`✅ ${msg}`); }
function fail(msg) { failed = true; console.error(`❌ ${msg}`); }

for (const f of mustExist) {
  if (fs.existsSync(f)) pass(`Existe: ${f}`);
  else fail(`Falta: ${f}`);
}

const server = fs.readFileSync('server.js', 'utf8');
const core = fs.readFileSync('HogwartsCore.js', 'utf8');
const index = fs.readFileSync('index.html', 'utf8');

if (server.includes('installHogwartsV1')) pass('Runtime V1 instalado no servidor.');
else fail('server.js não carrega installHogwartsV1.');

if (index.includes('/v1.css') && index.includes('/v1-client.js')) pass('UI V1 carregada no index.');
else fail('index.html não carrega CSS/cliente V1.');

if (!core.includes('aa.nuques')) pass('World Boss: referência aa.nuques removida.');
else fail('Ainda existe aa.nuques no core.');

if (!core.includes('Math.random() < chance || true')) pass('Exploração: bypass || true removido.');
else fail('Ainda existe bypass || true.');

const duplicateEvents = ['forest_open_chest', 'aceitar_convite_grupo', 'pedir_presenca'];
for (const ev of duplicateEvents) {
  const count = (server.match(new RegExp(`socket\\.on\\(['"\`]${ev}['"\`]`, 'g')) || []).length;
  if (count <= 1) pass(`Socket ${ev}: ${count} handler.`);
  else fail(`Socket ${ev}: ${count} handlers duplicados.`);
}

for (const f of ['server.js', 'HogwartsCore.js', 'v1/server-runtime.js', 'v1/content.js', 'scripts/check-v1.js']) {
  const r = spawnSync(process.execPath, ['--check', f], { encoding: 'utf8' });
  if (r.status === 0) pass(`Sintaxe OK: ${f}`);
  else fail(`Sintaxe inválida em ${f}: ${r.stderr || r.stdout}`);
}

if (!process.env.SESSION_SECRET) console.warn('⚠️ Configure SESSION_SECRET em produção.');
if (!process.env.ADMIN_PLAYER_ID) console.warn('⚠️ Configure ADMIN_PLAYER_ID para ativar painel administrativo.');

if (failed) process.exit(1);
console.log('\n🏰 Hogwarts V1: validação estrutural concluída.');
