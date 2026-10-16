# Hogwarts Online — Product Rework V2

Base alvo: `VagJr/hogwarts`, commit auditado `2e045dc851c84c40cb19666e28ab1d09e57b2006`
(18/09/2026).

Este rework substitui a tentativa V1 anterior e foi desenhado especificamente para a
versão que já possui `HogwartsMMOEngine.js` e `GamificacaoHogwarts.js`.

## Princípio de produto

O jogo passa a ser organizado por um único ciclo:

**Aprender → Preparar → Explorar → Pertencer → Competir → Evoluir**

Os sistemas existentes continuam sendo o conteúdo do jogo; o V2 fecha integrações,
corrige regras e coloca uma camada de orientação e interface por cima do mundo.

## Correções críticas

- sessão assinada para REST e Socket.IO;
- identidade do jogador passa a ser derivada da sessão;
- upgrade progressivo de senha PBKDF2 para 210.000 iterações;
- hashes de senha não saem em respostas de API;
- admin depende de `ADMIN_PLAYER_ID`;
- rate limiting básico;
- bloqueio HTTP dos principais arquivos privados do servidor;
- CORS configurável via `APP_ORIGIN`;
- Gringotes deixa de converter cofre-objeto em número no mercado;
- Ollivanders cobra corretamente;
- exploração remove `|| true`;
- World Boss remove `aa.nuques` e valida Foco;
- PvP deixa de aplicar o mesmo dano duas vezes;
- duração de efeitos usa duração da magia;
- PvE/PvP validam instância, deck, Foco e recarga;
- jogadores carregados do Mongo deixam de manter `_id` dentro do documento de domínio;
- salvamento `$set` remove `_id`;
- fome, energia, pet e estufa deixam de degradar todos os jogadores offline a cada tick;
- `toLowerCase()` de casa/mobs é protegido contra dados incompletos;
- chat principal deixa de interpolar autor/texto diretamente em HTML quando o padrão é encontrado.

## Gamificação realmente conectada

O rework liga ações do core a:
- aulas assistidas;
- vitórias PvE/PvP;
- Perfect Parry;
- poções criadas;
- livros/treinos;
- ajudas por beacon;
- Diário do Maroto;
- verificação de conquistas;
- passivas de conquistas relevantes.

## PC

- command center persistente no topo;
- objetivo contextual;
- aula/tempo livre, Casa, pontuação e estado online;
- painel “Diário vivo”;
- melhor hierarquia para tabs, cards, chat e canvases;
- atalhos M (mapa/locais) e I (mochila).

## Mobile

- HUD dedicado em vez de simplesmente encolher o desktop;
- barra inferior com Explorar, Aulas, Mochila, Diário e Vida;
- touch targets maiores;
- tabs horizontais;
- mundo/canvas priorizado;
- safe-area;
- inputs com 16px para evitar zoom involuntário;
- painel de rotina em bottom overlay.

## Configuração

Adicione ao `.env`:

```env
SESSION_SECRET=uma-chave-longa-aleatoria-com-pelo-menos-32-caracteres
ADMIN_PLAYER_ID=BRX_SEU_ID
APP_ORIGIN=https://seu-dominio.example
```

`APP_ORIGIN` pode ser omitido em desenvolvimento local.

## Validação

```powershell
npm install
npm run check
npm start
```

O patch cria um backup completo dos arquivos alterados e
`ROLLBACK_HOGWARTS_PRODUCT_V2.ps1`.
