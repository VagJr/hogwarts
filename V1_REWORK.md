# Hogwarts Browser MMO — Rework V1

Este patch é um rework único e integrado sobre a versão `main` auditada.

## O que muda

- sessão assinada e autoridade do servidor para REST e Socket.IO;
- IDs de jogador enviados pelo navegador deixam de ser fonte de verdade;
- respostas da API removem hashes/salts de senha;
- rate limiting básico e validação de nomes/mensagens;
- correções centrais de Gringotes, mercado, Ollivanders e World Boss;
- economia do vendedor deposita no campo correto do cofre;
- combate PvE/PvP valida pertencimento, grimório, Foco e recarga;
- duração configurada das magias volta a influenciar efeitos;
- XP passa a conceder pontos de atributo por nível;
- exploração deixa de ter sucesso garantido por `|| true`;
- fome/energia/pet deixam de avançar destrutivamente para jogadores offline;
- Herbologia passa a usar uma cadência baseada em tempo, com catch-up limitado;
- juros de Gringotes usam o novo formato do cofre;
- handlers duplicados de Socket e funções duplicadas conhecidas são removidos;
- criação de magia por IA deixa de ser stub e ganha limites mecânicos;
- dashboard de vida em Hogwarts (`/api/v1/dashboard`);
- novo command center no topo, objetivo contextual e ritmo diário;
- redesign global PC e mobile sem remover sistemas existentes;
- mobile dock, áreas tocáveis maiores, viewport de mundo priorizado;
- melhorias de acessibilidade e reduced-motion;
- script `npm run check` para smoke-check estrutural;
- backup automático antes da instalação e script de rollback.

## Core loop de produto

**Aprender → Preparar → Explorar → Pertencer → Competir → Evoluir**

O patch reorganiza a experiência em torno desse ciclo sem apagar Floresta, aulas,
Biblioteca, Poções, Herbologia, mercado, dormitórios, PvP, Quadribol, guildas,
House Cup, pets ou os sistemas de IA existentes.

## Depois de aplicar

1. Crie `.env` a partir de `.env.example` se ainda não existir.
2. Configure `SESSION_SECRET` com um valor longo e aleatório.
3. Configure `ADMIN_PLAYER_ID` com o `BRX_...` do administrador.
4. Rode `npm install`.
5. Rode `npm run check`.
6. Rode `npm start`.

Contas antigas precisarão entrar novamente uma vez para receber o token de sessão V1.
