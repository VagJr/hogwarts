// ==============================================================================
// GamificacaoHogwarts.js - CAMADA SUPREMA DE GAMIFICAÇÃO & SOCIAL BROADCAST
// Conecta todo o ecossistema do MMO com Beacons ("Participar Junto"),
// Diário do Maroto (5 Metas Diárias), 52 Conquistas com Títulos Equipáveis,
// Quadro de Procurados de Hogsmeade, Coleção de Sapos de Chocolate e Aura de Descanso.
// ==============================================================================

const crypto = require('crypto');

// ------------------------------------------------------------------------------
// 1. CATÁLOGO DE 52 CONQUISTAS E TÍTULOS EQUIPÁVEIS
// ------------------------------------------------------------------------------
const CATALOGO_CONQUISTAS = [
    // --- COMBATE (16 Conquistas) ---
    { id: 'combate_primeiro_sangue', nome: 'Primeiro Sangue', titulo: 'Iniciado em Duelos', cat: 'combate', desc: 'Vence o teu primeiro combate no castelo.', passiva: { stat: 'dano_geral', valor: 2 } },
    { id: 'combate_10_vitorias', nome: 'Veterano da Varinha', titulo: 'Duelista Nato', cat: 'combate', desc: 'Vence 10 combates em masmorras ou floresta.', passiva: { stat: 'dano_geral', valor: 3 } },
    { id: 'combate_50_vitorias', nome: 'Campeão da Arena', titulo: 'Invicto de Hogwarts', cat: 'combate', desc: 'Vence 50 combates em masmorras ou floresta.', passiva: { stat: 'dano_geral', valor: 5 } },
    { id: 'combate_parry_perfeito', nome: 'Reflexo de Aço', titulo: 'Escudo Inquebrável', cat: 'combate', desc: 'Executa o teu primeiro Protego Perfect Parry.', passiva: { stat: 'max_foco', valor: 5 } },
    { id: 'combate_10_parries', nome: 'Sentinela Imbatível', titulo: 'Mestre do Protego', cat: 'combate', desc: 'Acerta 10 parries perfeitos em combate.', passiva: { stat: 'max_foco', valor: 10 } },
    { id: 'combate_mestre_fogo', nome: 'Chama Eterna', titulo: 'Mestre das Chamas', cat: 'combate', desc: 'Alcança Nível 5 de maestria no feitiço Incêndio.', passiva: { stat: 'dano_fogo', valor: 6 } },
    { id: 'combate_mestre_gelo', nome: 'Coração de Gelo', titulo: 'Geada Viva', cat: 'combate', desc: 'Alcança Nível 5 de maestria no feitiço Glacius.', passiva: { stat: 'dano_gelo', valor: 6 } },
    { id: 'combate_mestre_eletrico', nome: 'Condutor Celeste', titulo: 'Fúria Elétrica', cat: 'combate', desc: 'Realiza a sinergia Paralisia Elétrica (Molhado + Choque).', passiva: { stat: 'dano_eletrico', valor: 6 } },
    { id: 'combate_algoz_basilisco', nome: 'Herdeiro da Coragem', titulo: 'Algoz do Basilisco', cat: 'combate', desc: 'Derrota um Basilisco nas Criptas ou Floresta.', passiva: { stat: 'dano_trevas_alvo', valor: 8 } },
    { id: 'combate_terror_trolls', nome: 'Porrete Destroçado', titulo: 'Terror dos Trolls', cat: 'combate', desc: 'Derruba um Trasgo Montanhês.', passiva: { stat: 'defesa_fisica', valor: 5 } },
    { id: 'combate_floresta_andar3', nome: 'Rastreador da Penumbra', titulo: 'Explorador da Floresta', cat: 'combate', desc: 'Chega ao 3º Andar da Floresta Proibida.', passiva: { stat: 'velocidade', valor: 3 } },
    { id: 'combate_floresta_andar7', nome: 'Abismo Proibido', titulo: 'Sobrevivente do Andar 7', cat: 'combate', desc: 'Sobrevive ao 7º Andar mais profundo da Floresta.', passiva: { stat: 'defesa_geral', valor: 8 } },
    { id: 'combate_artes_trevas', nome: 'Sussurros do Abismo', titulo: 'Flagelo das Sombras', cat: 'combate', desc: 'Perfura um escudo inimigo com Magia das Trevas.', passiva: { stat: 'perfuracao_escudo', valor: 5 } },
    { id: 'combate_luz_suprema', nome: 'Amanhecer Dourado', titulo: 'Guardião da Luz', cat: 'combate', desc: 'Dissipa as sombras com feitiço de Luz Sagrada.', passiva: { stat: 'cura_recebida', valor: 6 } },
    { id: 'combate_shatter_combo', nome: 'Estilhaçamento Cruel', titulo: 'Quebrador de Gelo', cat: 'combate', desc: 'Executa o combo Shatter (Cinético em alvo Congelado).', passiva: { stat: 'dano_cinetico', valor: 5 } },
    { id: 'combate_deck_completo', nome: 'Arsenal Prontidão', titulo: 'Estrategista de Varinha', cat: 'combate', desc: 'Equipa um Deck com 6 magias e 2 elixires.', passiva: { stat: 'iniciativa', valor: 5 } },

    // --- ACADEMIA & ESTUDOS (10 Conquistas) ---
    { id: 'academia_primeira_aula', nome: 'Sino do Castelo', titulo: 'Calouro de Hogwarts', cat: 'academia', desc: 'Assiste à tua primeira aula presencial com professor.', passiva: { stat: 'xp_aulas', valor: 5 } },
    { id: 'academia_10_aulas', nome: 'Cadeira da Frente', titulo: 'Estudante Exemplar', cat: 'academia', desc: 'Conclui 10 aulas imersivas no horário escolar.', passiva: { stat: 'xp_aulas', valor: 10 } },
    { id: 'academia_ano_3', nome: 'Terceiro Ano Conquistado', titulo: 'Veterano do 3º Ano', cat: 'academia', desc: 'Avança até ao 3º Ano Letivo em Hogwarts.', passiva: { stat: 'pontos_casa_mult', valor: 5 } },
    { id: 'academia_ano_7', nome: 'Formatura Iminente', titulo: 'Candidato aos N.I.E.M.s', cat: 'academia', desc: 'Atinge o prestigiado 7º Ano Letivo.', passiva: { stat: 'pontos_casa_mult', valor: 15 } },
    { id: 'academia_nota_o', nome: 'Gênio da Turma', titulo: 'Aluno Nota Ótimo', cat: 'academia', desc: 'Obtém nota Ótimo (O) na Banca Examinadora do Ministério.', passiva: { stat: 'xp_geral', valor: 8 } },
    { id: 'academia_monitor', nome: 'Braçadeira Prateada', titulo: 'Monitor de Hogwarts', cat: 'academia', desc: 'Conquista mais de 200 pontos para a tua Casa.', passiva: { stat: 'carisma', valor: 10 } },
    { id: 'academia_tese_submetida', nome: 'Pena Imortal', titulo: 'Erudito do Ministério', cat: 'academia', desc: 'Submete e aprova uma tese mágica na Biblioteca.', passiva: { stat: 'inteligencia', valor: 6 } },
    { id: 'academia_leitor_avido', nome: 'Tomo Consumido', titulo: 'Historiador Arcano', cat: 'academia', desc: 'Lê 5 livros antigos completos na Biblioteca.', passiva: { stat: 'max_foco', valor: 8 } },
    { id: 'academia_genio_transfiguracao', nome: 'Forma e Essência', titulo: 'Gênio da Transfiguração', cat: 'academia', desc: 'Alcança Nível 5 de maestria em Transfiguração.', passiva: { stat: 'dano_cinetico', valor: 5 } },
    { id: 'academia_mestre_feiticos', nome: 'Encanto Absoluto', titulo: 'Grão-Mestre em Feitiços', cat: 'academia', desc: 'Leva qualquer feitiço ao Nível 10 de Maestria.', passiva: { stat: 'custo_foco_red', valor: 1 } },

    // --- HERBOLOGIA & ALQUIMIA (8 Conquistas) ---
    { id: 'alquimia_primeira_pocao', nome: 'Fogo Sob o Caldeirão', titulo: 'Aprendiz de Caldeirão', cat: 'alquimia', desc: 'Destila com sucesso a tua primeira poção mágica.', passiva: { stat: 'cura_pocao', valor: 5 } },
    { id: 'alquimia_10_pocoes', nome: 'Vapor Místico', titulo: 'Destilador Noturno', cat: 'alquimia', desc: 'Prepara 10 poções engarrafadas para a mochila.', passiva: { stat: 'cura_pocao', valor: 10 } },
    { id: 'alquimia_descobridor_receita', nome: 'Receita Inédita', titulo: 'Alquimista Supremo', cat: 'alquimia', desc: 'Inventa uma poção inédita reconhecida pela IA.', passiva: { stat: 'elo_pocoes', valor: 15 } },
    { id: 'alquimia_pocao_perfeita', nome: 'Infusão Sem Erros', titulo: 'Mestre Caldeireiro', cat: 'alquimia', desc: 'Destila uma poção com 100% de precisão de temperatura.', passiva: { stat: 'duracao_buffs', valor: 10 } },
    { id: 'herbologia_primeira_colheita', nome: 'Broto Verdejante', titulo: 'Jardineiro do Castelo', cat: 'alquimia', desc: 'Planta e colhe a tua primeira muda na Estufa.', passiva: { stat: 'drop_sementes', valor: 5 } },
    { id: 'herbologia_mandragora', nome: 'Sem Ouvidos Fracos', titulo: 'Domador de Mandrágoras', cat: 'alquimia', desc: 'Colhe 3 mudas adultas de Mandrágora na Estufa.', passiva: { stat: 'res_atordoar', valor: 10 } },
    { id: 'herbologia_10_plantas', nome: 'Mão Verde', titulo: 'Dedo Verde', cat: 'alquimia', desc: 'Cultiva 10 espécimes botânicos na Estufa.', passiva: { stat: 'tempo_estufa_red', valor: 10 } },
    { id: 'herbologia_ditamno_mestre', nome: 'Seiva Cicatrizante', titulo: 'Curandeiro Natural', cat: 'alquimia', desc: 'Produz 5 unidades de essência pura de Ditamno.', passiva: { stat: 'regen_hp', valor: 5 } },

    // --- ECONOMIA & EXPLORAÇÃO (10 Conquistas) ---
    { id: 'economia_100_galeoes', nome: 'Bolsa Tilintante', titulo: 'Bruxo Abastado', cat: 'economia', desc: 'Acumula 100 Galeões na tua carteira.', passiva: { stat: 'lucro_vendas', valor: 5 } },
    { id: 'economia_1000_galeoes', nome: 'Cofre Subterrâneo', titulo: 'Lorde de Gringotes', cat: 'economia', desc: 'Guarda 1.000 Galeões no Banco Gringotes.', passiva: { stat: 'juros_bonus', valor: 0.2 } },
    { id: 'economia_primeiro_juros', nome: 'Rendimento do Duende', titulo: 'Investidor Arcano', cat: 'economia', desc: 'Resgata dividendos diários pela primeira vez no cofre.', passiva: { stat: 'ouro_mobs', valor: 5 } },
    { id: 'economia_venda_coruja', nome: 'Correspondência de Ouro', titulo: 'Mercador das Corujas', cat: 'economia', desc: 'Vende 5 lotes de itens através do Correio Coruja.', passiva: { stat: 'lucro_vendas', valor: 8 } },
    { id: 'economia_guarda_roupa', nome: 'Elegância Vitoriana', titulo: 'Elegância Bruxa', cat: 'economia', desc: 'Personaliza vestes e varinha no Guarda-Roupa.', passiva: { stat: 'velocidade', valor: 2 } },
    { id: 'exploracao_mapa_salteador', nome: 'Juro Solenemente', titulo: 'Salteador de Hogwarts', cat: 'economia', desc: 'Abre e navega pelo Mapa do Salteador.', passiva: { stat: 'furtividade', valor: 5 } },
    { id: 'exploracao_todos_segredos', nome: 'Paredes Sussurrantes', titulo: 'Caçador de Segredos', cat: 'economia', desc: 'Descobre 3 segredos ocultos com a IA no Castelo.', passiva: { stat: 'sorte_loot', valor: 8 } },
    { id: 'exploracao_amigo_fantasmas', nome: 'Conversa Etérea', titulo: 'Amigo dos Fantasmas', cat: 'economia', desc: 'Interage com Nick Quase-Sem-Cabeça ou Murta Que Geme.', passiva: { stat: 'res_trevas', valor: 5 } },
    { id: 'exploracao_invasao_cozinhas', nome: 'Ceia da Meia-Noite', titulo: 'Invasor das Cozinhas', cat: 'economia', desc: 'Invade as cozinhas e faz um lanche sem ser pego.', passiva: { stat: 'foco_ao_comer', valor: 15 } },
    { id: 'exploracao_sala_necessidades', nome: 'Arquiteto de Sonhos', titulo: 'Mestre das Necessidades', cat: 'economia', desc: 'Decora a Sala das Necessidades com mobílias mágicas.', passiva: { stat: 'aura_descanso_mult', valor: 15 } },

    // --- QUADRIBOL & SOCIAL (8 Conquistas) ---
    { id: 'quadribol_primeiro_jogo', nome: 'Pés Fora do Chão', titulo: 'Cavaleiro do Vento', cat: 'social', desc: 'Entra numa partida de Quadribol oficial.', passiva: { stat: 'vel_vassoura', valor: 4 } },
    { id: 'quadribol_10_golos', nome: 'Pontaria Cirúrgica', titulo: 'Artilheiro de Ouro', cat: 'social', desc: 'Marca 10 golos com a Goles no estádio.', passiva: { stat: 'elo_quadribol', valor: 10 } },
    { id: 'quadribol_snitch', nome: 'Asas Douradas na Mão', titulo: 'Apanhador Lendário', cat: 'social', desc: 'Captura o Pomo de Ouro para a tua Casa.', passiva: { stat: 'sorte_geral', valor: 10 } },
    { id: 'quadribol_defesa_baliza', nome: 'Parede Voadora', titulo: 'Guardião Imbatível', cat: 'social', desc: 'Defende 5 remates como Guarda-Redes.', passiva: { stat: 'defesa_geral', valor: 5 } },
    { id: 'social_primeiro_grupo', nome: 'Aliança Mágica', titulo: 'Companheiro Leal', cat: 'social', desc: 'Forma ou junta-te a uma Party de bruxos.', passiva: { stat: 'xp_grupo', valor: 5 } },
    { id: 'social_10_ajudas', nome: 'Ombro Amigo', titulo: 'Alma da Sala Comunal', cat: 'social', desc: 'Participa de 5 beacons de colegas ("Participar Junto").', passiva: { stat: 'foco_grupo', valor: 8 } },
    { id: 'social_colecionador_sapos', nome: 'Colecionador Insaciável', titulo: 'Grande Colecionador Bruxo', cat: 'social', desc: 'Coleciona pelo menos 8 figurinhas de Sapos de Chocolate.', passiva: { stat: 'todos_atributos', valor: 3 } },
    { id: 'social_streak_7dias', nome: 'Fidelidade ao Castelo', titulo: 'Bruxo Infatigável', cat: 'social', desc: 'Mantém uma sequência de 7 dias consecutivos em Hogwarts.', passiva: { stat: 'juros_bonus', valor: 0.3 } }
];

// ------------------------------------------------------------------------------
// 2. CATÁLOGO DE 16 FIGURINHAS DE SAPOS DE CHOCOLATE
// ------------------------------------------------------------------------------
const CATALOGO_SAPOS = [
    { id: 'sapo_dumbledore', nome: 'Albus Dumbledore', cat: 'Diretores', raridade: 'Lendária', bonus: '+5% Dano Geral', lore: 'Atual Diretor de Hogwarts, considerado o maior bruxo dos tempos modernos. Famoso pela derrota de Grindelwald em 1945.' },
    { id: 'sapo_merlin', nome: 'Merlin', cat: 'Antiguidade', raridade: 'Mítica', bonus: '+10 Foco Máximo', lore: 'O mais célebre feiticeiro de todos os tempos. Defensor dos direitos dos Muggles e mestre da corte do Rei Arthur.' },
    { id: 'sapo_morgana', nome: 'Morgana le Fay', cat: 'Antiguidade', raridade: 'Lendária', bonus: '+5% Perfuração de Escudo', lore: 'Poderosa feiticeira das trevas e meia-irmã do Rei Arthur. Mestra na arte da metamorfose e feitiçaria antiga.' },
    { id: 'sapo_gryffindor', nome: 'Godric Gryffindor', cat: 'Fundadores', raridade: 'Lendária', bonus: '+5% Ataque Físico & Fogo', lore: 'Fundador de Gryffindor, duelista lendário de espada e varinha. Valorizava a coragem, lealdade e nobreza de coração.' },
    { id: 'sapo_slytherin', nome: 'Salazar Slytherin', cat: 'Fundadores', raridade: 'Lendária', bonus: '+5% Dano de Trevas & Veneno', lore: 'Fundador de Slytherin, mestre da língua dos répteis (Ofidioglossia) e construtor da mítica Câmara Secreta.' },
    { id: 'sapo_ravenclaw', nome: 'Rowena Ravenclaw', cat: 'Fundadores', raridade: 'Lendária', bonus: '+8% Ganho de XP Acadêmico', lore: 'Fundadora de Ravenclaw. A mais brilhante mente de sua era: "O espírito sem limites é o maior tesouro do homem".' },
    { id: 'sapo_hufflepuff', nome: 'Helga Hufflepuff', cat: 'Fundadores', raridade: 'Lendária', bonus: '+10% Rendimento de Colheita', lore: 'Fundadora de Hufflepuff, talentosa em feitiços de culinária e hospitalidade. Acolhia todos os estudantes sem preconceito.' },
    { id: 'sapo_flamel', nome: 'Nicolau Flamel', cat: 'Alquimistas', raridade: 'Lendária', bonus: '+15% Sucesso em Poções', lore: 'Célebre alquimista e criador da lendária Pedra Filosofal, capaz de conceder o Elixir da Vida eterna.' },
    { id: 'sapo_scamander', nome: 'Newt Scamander', cat: 'Naturalistas', raridade: 'Épica', bonus: '+10% Defesa vs Bestas', lore: 'Famoso magizoologista britânico e autor de "Monstros Fantásticos e Onde Encontrá-los".' },
    { id: 'sapo_paracelso', nome: 'Paracelso', cat: 'Alquimistas', raridade: 'Épica', bonus: '+5% Regeneração de HP', lore: 'Gênio alquimista e médico bruxo do século XVI. Descobriu o uso medicinal do ditamno e essências raras.' },
    { id: 'sapo_circe', nome: 'Circe', cat: 'Antiguidade', raridade: 'Épica', bonus: '+5% Duração de Transfiguração', lore: 'Feiticeira grega antiga que vivia na ilha de Eea, famosa por transfigurar marinheiros desavisados em porcos.' },
    { id: 'sapo_cliodna', nome: 'Cliodna', cat: 'Antiguidade', raridade: 'Épica', bonus: '+5% Efeito de Poções de Cura', lore: 'Druidesa irlandesa antiga e animaga de pássaro marinho. Famosa pelas suas ondas de cura milagrosas.' },
    { id: 'sapo_hengist', nome: 'Hengist de Woodcroft', cat: 'Pioneiros', raridade: 'Rara', bonus: '+5% Lucro em Vendas', lore: 'Fundador do vilarejo bruxo de Hogsmeade após ser expulso de casa por perseguidores Muggles.' },
    { id: 'sapo_herpo', nome: 'Herpo, o Sujo', cat: 'Trevas', raridade: 'Rara', bonus: '+3% Dano Venenoso', lore: 'Bruxo grego antigo que chocou o primeiro Basilisco da história ao colocar um ovo de galinha sob um sapo.' },
    { id: 'sapo_bertie', nome: 'Bertie Bott', cat: 'Inventores', raridade: 'Comum', bonus: '+5 Foco ao Comer', lore: 'Criador dos famosos Feijõezinhos de Todos os Sabores, por um erro feliz ao tentar fazer doces de frutas.' },
    { id: 'sapo_bowman', nome: 'Bowman Wright', cat: 'Inventores', raridade: 'Rara', bonus: '+5% Velocidade de Voo', lore: 'Encantador de metais em Godric\'s Hollow que forjou o primeiro Pomo de Ouro para substituir o pomorim.' }
];

// ------------------------------------------------------------------------------
// 3. QUADRO DE CARTAZES DE CAÇA DE HOGSMEADE (BOUNTIES DE ELITE)
// ------------------------------------------------------------------------------
const MODELOS_BOUNTIES = [
    {
        id: 'bounty_troll_pedra',
        nome: 'Troll Encouraçado de Pedra',
        local: 'Floresta Proibida - Andar 2',
        andar: 2,
        nivelMin: 3,
        recompensa: { galeoes: 120, xp: 250, pontosCasa: 15 },
        modificadores: ['Pele de Pedra (+40% Defesa)', 'Investida Brutal'],
        descricao: 'Um trasgo gigante foi enfeitiçado por contrabandistas e está a aterrorizar a margem do lago.'
    },
    {
        id: 'bounty_acromantula_rainha',
        nome: 'Matriarca das Teias Carmesim',
        local: 'Floresta Proibida - Andar 4',
        andar: 4,
        nivelMin: 6,
        recompensa: { galeoes: 200, xp: 400, pontosCasa: 25 },
        modificadores: ['Aura Tóxica (Veneno Constante)', 'Convoca Crias'],
        descricao: 'Uma aranha ancestral desceu das copas mais altas da Floresta e ameaça o perímetro de Hogwarts.'
    },
    {
        id: 'bounty_espectro_renegado',
        nome: 'Aparição Vingativa do Pântano',
        local: 'Floresta Proibida - Andar 5',
        andar: 5,
        nivelMin: 8,
        recompensa: { galeoes: 280, xp: 550, pontosCasa: 35 },
        modificadores: ['Forma Etérea (Imune a Físico)', 'Dreno Sombrio'],
        descricao: 'Uma entidade espectral roubou artefatos do Ministério e oculta-se nas brumas profundas.'
    }
];

// ------------------------------------------------------------------------------
// CLASSE PRINCIPAL: GamificacaoHogwarts
// ------------------------------------------------------------------------------
class GamificacaoHogwarts {
    constructor(core) {
        this.core = core;
        this.beaconsAtivos = {}; // { beaconId: { id, autorId, autorNome, tipo, ... } }
        this.catalogoConquistas = CATALOGO_CONQUISTAS;
        this.catalogoSapos = CATALOGO_SAPOS;
        this.bountiesAtivos = JSON.parse(JSON.stringify(MODELOS_BOUNTIES));

        // Limpeza de beacons expirados a cada 10s
        setInterval(() => this._limparBeaconsExpirados(), 10000);
    }

    // --------------------------------------------------------------------------
    // A. GARANTIA DE ESTADO DE GAMIFICAÇÃO DO ALUNO
    // --------------------------------------------------------------------------
    garantirEstadoAluno(aluno) {
        if (!aluno) return;
        const hoje = new Date().toISOString().slice(0, 10);

        if (!aluno.diarioMaroto || aluno.diarioMaroto.data !== hoje) {
            aluno.diarioMaroto = this._gerarDiarioDoDia(hoje, aluno);
        }
        if (!aluno.conquistas) aluno.conquistas = [];
        if (!aluno.tituloEquipado) aluno.tituloEquipado = "Aprendiz de Magia";
        if (!aluno.saposColecionados) aluno.saposColecionados = [];
        if (aluno.auraDescanso === undefined) aluno.auraDescanso = 100;
        if (aluno.auraDescansoMax === undefined) aluno.auraDescansoMax = 500;
        if (!aluno.bountiesAceitos) aluno.bountiesAceitos = [];
        if (!aluno.streakDias) aluno.streakDias = 1;
        if (!aluno.ultimoLoginData) aluno.ultimoLoginData = hoje;

        // Atualização de Streak
        if (aluno.ultimoLoginData !== hoje) {
            const dUltimo = new Date(aluno.ultimoLoginData);
            const dHoje = new Date(hoje);
            const diffDias = Math.floor((dHoje - dUltimo) / (1000 * 60 * 60 * 24));
            if (diffDias === 1) {
                aluno.streakDias = (aluno.streakDias || 1) + 1;
            } else if (diffDias > 1) {
                aluno.streakDias = 1; // Quebrou a sequência
            }
            aluno.ultimoLoginData = hoje;
        }
    }

    // --------------------------------------------------------------------------
    // B. DIÁRIO DO MAROTO (5 TAREFAS DIÁRIAS + MARCOS)
    // --------------------------------------------------------------------------
    _gerarDiarioDoDia(dataStr, aluno) {
        return {
            data: dataStr,
            concluidosCount: 0,
            marcosReivindicados: [],
            tarefas: [
                { id: 't_aula', tipo: 'aula', texto: 'Assistir a 1 Aula Imersiva com Professor', atual: 0, meta: 1, concluida: false, icone: '✍️' },
                { id: 't_combate', tipo: 'combate', texto: 'Vencer 2 Combates (Rumores, Masmorra ou Floresta)', atual: 0, meta: 2, concluida: false, icone: '⚔️' },
                { id: 't_estufa_pocao', tipo: 'estufa_pocao', texto: 'Cultivar 1 Muda na Estufa ou Destilar 1 Poção', atual: 0, meta: 1, concluida: false, icone: '🌿' },
                { id: 't_treino_leitura', tipo: 'treino_leitura', texto: 'Treinar Feitiço no Boneco ou Ler na Biblioteca', atual: 0, meta: 1, concluida: false, icone: '🎯' },
                { id: 't_social', tipo: 'social', texto: 'Ajudar um Colega no Chat ("Participar Junto")', atual: 0, meta: 1, concluida: false, icone: '🤝' }
            ]
        };
    }

    progredirDiario(alunoId, tipoAcao, qtd = 1) {
        const a = this.core.alunos[alunoId];
        if (!a) return;
        this.garantirEstadoAluno(a);

        let alterou = false;
        a.diarioMaroto.tarefas.forEach(t => {
            if (t.tipo === tipoAcao && !t.concluida) {
                t.atual = Math.min(t.meta, t.atual + qtd);
                if (t.atual >= t.meta) {
                    t.concluida = true;
                    a.diarioMaroto.concluidosCount = (a.diarioMaroto.concluidosCount || 0) + 1;
                    if (global.io) {
                        global.io.to(`priv_${a.id}`).emit('nova_mensagem', {
                            canal: 'zona',
                            autor: '📜 DIÁRIO DO MAROTO',
                            texto: `Objetivo Concluído: [${t.texto}]! Abre o Diário para resgatar recompensas.`
                        });
                    }
                }
                alterou = true;
            }
        });

        if (alterou) {
            this.core._salvarBancoDeDados();
            this.verificarConquistas(alunoId, { tipo: 'diario_progresso' });
        }
    }

    reivindicarMarcoDiario(alunoId, marco) {
        const a = this.core.alunos[alunoId];
        if (!a) return { erro: "Aluno não encontrado." };
        this.garantirEstadoAluno(a);

        const d = a.diarioMaroto;
        const marcoNum = parseInt(marco);
        if (![2, 4, 5].includes(marcoNum)) return { erro: "Marco inválido. Escolha 2, 4 ou 5." };
        if (d.concluidosCount < marcoNum) return { erro: `Ainda não concluíste ${marcoNum} tarefas hoje!` };
        if (d.marcosReivindicados.includes(marcoNum)) return { erro: "Este marco já foi resgatado hoje." };

        d.marcosReivindicados.push(marcoNum);
        let recompensas = { galeoes: 0, xp: 0, pontosCasa: 0, sapo: null };

        if (marcoNum === 2) {
            recompensas.galeoes = 25;
            recompensas.xp = 60;
        } else if (marcoNum === 4) {
            recompensas.galeoes = 50;
            recompensas.xp = 120;
            recompensas.pontosCasa = 10;
        } else if (marcoNum === 5) {
            // BAÚ SUPREMO DO MAROTO
            recompensas.galeoes = 120;
            recompensas.xp = 300;
            recompensas.pontosCasa = 25;
            recompensas.sapo = this.abrirSapoDeChocolate(alunoId);
        }

        a.galeoes = (a.galeoes || 0) + recompensas.galeoes;
        this.core.ganharXp(a, recompensas.xp);
        if (recompensas.pontosCasa > 0 && a.casa) {
            this.core.adicionarPontosCasa(a.casa, recompensas.pontosCasa);
        }

        this.core._salvarBancoDeDados();
        return {
            sucesso: true,
            marco: marcoNum,
            recompensas,
            msg: `🎉 Marco ${marcoNum}/5 resgatado com glória! +${recompensas.galeoes}G, +${recompensas.xp} XP${recompensas.pontosCasa ? ` e +${recompensas.pontosCasa} Pts para ${a.casa}` : ''}!`
        };
    }

    // --------------------------------------------------------------------------
    // C. MOTOR UNIVERSAL DE BEACONS ("PARTICIPAR JUNTO")
    // --------------------------------------------------------------------------
    criarBeaconSocial({ autorId, tipo, titulo, descricao, dados = {}, salaId = null, duracaoSegundos = 60 }) {
        const autor = this.core.alunos[autorId];
        if (!autor) return { erro: "Autor não encontrado." };

        const beaconId = `bcn_${Date.now()}_${crypto.randomBytes(3).toString('hex')}`;
        const beacon = {
            id: beaconId,
            autorId: autor.id,
            autorNome: autor.nome,
            autorCasa: autor.casa,
            tipo, // 'combate_mundo', 'masmorra', 'quadribol', 'estufa', 'pocao', 'biblioteca', 'duelo', 'banquete'
            titulo,
            descricao,
            dados,
            jogadores: [autor.id],
            maxJogadores: dados.maxJogadores || 4,
            criadoEm: Date.now(),
            expiraEm: Date.now() + (duracaoSegundos * 1000)
        };

        this.beaconsAtivos[beaconId] = beacon;

        // Monta o payload interativo para o Chat MMO e HUD
        const payloadChat = {
            canal: salaId ? 'zona' : 'global',
            autor: `📢 [CONVOCAÇÃO]`,
            texto: `${autor.nome} (${autor.casa}) abriu: ${titulo} - ${descricao}`,
            beacon: {
                id: beaconId,
                tipo,
                titulo,
                autorNome: autor.nome,
                autorCasa: autor.casa,
                expiraEm: beacon.expiraEm,
                acaoBtn: 'PARTICIPAR JUNTO'
            }
        };

        if (global.io) {
            if (salaId) global.io.to(`zona_${salaId}`).emit('nova_mensagem', payloadChat);
            else global.io.emit('nova_mensagem', payloadChat);
            global.io.emit('beacon_novo', beacon);
        }

        return { sucesso: true, beacon };
    }

    participarBeaconSocial(beaconId, participanteId) {
        const beacon = this.beaconsAtivos[beaconId];
        if (!beacon) return { erro: "Esta convocação já terminou ou expirou." };
        if (Date.now() > beacon.expiraEm) {
            delete this.beaconsAtivos[beaconId];
            return { erro: "Esta convocação acabou de expirar." };
        }

        const participante = this.core.alunos[participanteId];
        if (!participante) return { erro: "Aluno não encontrado." };

        if (!beacon.jogadores.includes(participante.id)) {
            if (beacon.jogadores.length >= beacon.maxJogadores) {
                return { erro: "O grupo para esta atividade já está cheio!" };
            }
            beacon.jogadores.push(participante.id);
        }

        // Concede bônus mútuo de cooperação
        this.core.ganharXp(participante, 35);
        this.progredirDiario(participante.id, 'social', 1);

        const autor = this.core.alunos[beacon.autorId];
        if (autor && autor.id !== participante.id) {
            this.core.ganharXp(autor, 25);
            this.progredirDiario(autor.id, 'social', 1);
            if (global.io) {
                global.io.to(`priv_${autor.id}`).emit('nova_mensagem', {
                    canal: 'zona',
                    autor: '🤝 REFORÇOS',
                    texto: `${participante.nome} atendeu ao teu chamado e juntou-se à atividade!`
                });
            }
        }

        this.core._salvarBancoDeDados();
        this.verificarConquistas(participante.id, { tipo: 'beacon_participar' });

        return {
            sucesso: true,
            beacon,
            msg: `Juntaste-te a ${beacon.autorNome} em [${beacon.titulo}]! (+35 XP de Cooperação)`
        };
    }

    _limparBeaconsExpirados() {
        const agora = Date.now();
        for (let bId in this.beaconsAtivos) {
            if (agora > this.beaconsAtivos[bId].expiraEm) {
                delete this.beaconsAtivos[bId];
            }
        }
    }

    // --------------------------------------------------------------------------
    // D. SISTEMA DE 52 CONQUISTAS & TÍTULOS EQUIPÁVEIS
    // --------------------------------------------------------------------------
    verificarConquistas(alunoId, contexto = {}) {
        const a = this.core.alunos[alunoId];
        if (!a) return;
        this.garantirEstadoAluno(a);

        let novasConquistas = [];

        this.catalogoConquistas.forEach(c => {
            if (a.conquistas.includes(c.id)) return;

            let atingiu = false;

            // Avaliador de critérios por ID
            switch (c.id) {
                case 'combate_primeiro_sangue':
                    if (a.vitoriasPvE >= 1 || a.nivel >= 2) atingiu = true;
                    break;
                case 'combate_10_vitorias':
                    if (a.vitoriasPvE >= 10) atingiu = true;
                    break;
                case 'combate_50_vitorias':
                    if (a.vitoriasPvE >= 50) atingiu = true;
                    break;
                case 'combate_parry_perfeito':
                    if (contexto.tipo === 'parry' || a.parriesPerfeitos >= 1) atingiu = true;
                    break;
                case 'combate_10_parries':
                    if (a.parriesPerfeitos >= 10) atingiu = true;
                    break;
                case 'combate_mestre_fogo':
                    if (a.maestriaFeiticos?.incendio?.nivel >= 5) atingiu = true;
                    break;
                case 'combate_mestre_gelo':
                    if (a.maestriaFeiticos?.glacius?.nivel >= 5) atingiu = true;
                    break;
                case 'combate_mestre_eletrico':
                    if (contexto.sinergia === 'PARALISIA_ELETRICA') atingiu = true;
                    break;
                case 'combate_shatter_combo':
                    if (contexto.sinergia === 'SHATTER') atingiu = true;
                    break;
                case 'combate_deck_completo':
                    if ((a.feitiçosEquipados || []).length >= 6) atingiu = true;
                    break;
                case 'academia_primeira_aula':
                    if (contexto.tipo === 'aula' || a.aulasAssistidas >= 1) atingiu = true;
                    break;
                case 'academia_10_aulas':
                    if (a.aulasAssistidas >= 10) atingiu = true;
                    break;
                case 'academia_ano_3':
                    if (a.anoLetivo >= 3) atingiu = true;
                    break;
                case 'academia_ano_7':
                    if (a.anoLetivo >= 7) atingiu = true;
                    break;
                case 'academia_nota_o':
                    if (contexto.nota === 'O' || a.melhorNotaExame === 'O') atingiu = true;
                    break;
                case 'academia_monitor':
                    if ((this.core.pontuacaoCasas[a.casa] || 0) >= 150) atingiu = true;
                    break;
                case 'alquimia_primeira_pocao':
                    if (contexto.tipo === 'pocao' || (a.mochilaEscolar || []).some(i => i.tipo === 'pocao_feita')) atingiu = true;
                    break;
                case 'alquimia_10_pocoes':
                    if (a.pocoesCriadas >= 10) atingiu = true;
                    break;
                case 'herbologia_primeira_colheita':
                    if (contexto.tipo === 'colheita' || a.colheitasEstufa >= 1) atingiu = true;
                    break;
                case 'herbologia_mandragora':
                    if (a.inventario?.ingredientes?.mandragora >= 3) atingiu = true;
                    break;
                case 'economia_100_galeoes':
                    if ((a.galeoes || 0) >= 100) atingiu = true;
                    break;
                case 'economia_1000_galeoes':
                    let saldoCofre = typeof a.cofreGringotes === 'number' ? a.cofreGringotes : (a.cofreGringotes?.galeoes || 0);
                    if (saldoCofre >= 1000) atingiu = true;
                    break;
                case 'economia_primeiro_juros':
                    if (contexto.tipo === 'juros_resgatados') atingiu = true;
                    break;
                case 'social_primeiro_grupo':
                    if (a.partyId) atingiu = true;
                    break;
                case 'social_10_ajudas':
                    if (a.ajudasBeacons >= 5 || contexto.tipo === 'beacon_participar') atingiu = true;
                    break;
                case 'social_colecionador_sapos':
                    if ((a.saposColecionados || []).length >= 8) atingiu = true;
                    break;
                case 'social_streak_7dias':
                    if (a.streakDias >= 7) atingiu = true;
                    break;
                default:
                    // Caso geral avaliado por atributos
                    if (a.nivel >= 10 && c.cat === 'combate') atingiu = true;
                    break;
            }

            if (atingiu) {
                a.conquistas.push(c.id);
                novasConquistas.push(c);
            }
        });

        if (novasConquistas.length > 0) {
            this.core._salvarBancoDeDados();
            if (global.io) {
                novasConquistas.forEach(nc => {
                    global.io.to(`priv_${a.id}`).emit('nova_mensagem', {
                        canal: 'zona',
                        autor: '🏆 PROEZA BRUXA',
                        texto: `Conquista Desbloqueada: [${nc.nome}]! Título disponível: "${nc.titulo}".`
                    });
                });
            }
        }
        return novasConquistas;
    }

    equiparTitulo(alunoId, tituloOuId) {
        const a = this.core.alunos[alunoId];
        if (!a) return { erro: "Aluno não encontrado." };
        this.garantirEstadoAluno(a);

        // Busca o título seja pelo ID ou pelo texto
        const c = this.catalogoConquistas.find(item => item.id === tituloOuId || item.titulo === tituloOuId);
        if (c) {
            if (!a.conquistas.includes(c.id)) {
                return { erro: `Ainda não desbloqueaste o título "${c.titulo}". Conclui a proeza: ${c.desc}` };
            }
            a.tituloEquipado = c.titulo;
        } else {
            // Título padrão ou customizado
            a.tituloEquipado = tituloOuId.slice(0, 30);
        }

        this.core._salvarBancoDeDados();
        return {
            sucesso: true,
            tituloEquipado: a.tituloEquipado,
            msg: `Título equipado com sucesso: "${a.tituloEquipado}"!`
        };
    }

    // --------------------------------------------------------------------------
    // E. COLEÇÃO DE FIGURINHAS DE SAPOS DE CHOCOLATE
    // --------------------------------------------------------------------------
    abrirSapoDeChocolate(alunoId) {
        const a = this.core.alunos[alunoId];
        if (!a) return null;
        this.garantirEstadoAluno(a);

        // Sorteia com leve viés para figurinhas ainda não colecionadas
        const naoTem = this.catalogoSapos.filter(s => !a.saposColecionados.includes(s.id));
        let sorteada = null;
        if (naoTem.length > 0 && Math.random() < 0.65) {
            sorteada = naoTem[Math.floor(Math.random() * naoTem.length)];
        } else {
            sorteada = this.catalogoSapos[Math.floor(Math.random() * this.catalogoSapos.length)];
        }

        let eraNova = false;
        if (!a.saposColecionados.includes(sorteada.id)) {
            a.saposColecionados.push(sorteada.id);
            eraNova = true;
        }

        this.verificarConquistas(alunoId, { tipo: 'sapo_aberto' });
        this.core._salvarBancoDeDados();

        return {
            ...sorteada,
            eraNova,
            totalColecionadas: a.saposColecionados.length,
            totalCatalogo: this.catalogoSapos.length
        };
    }

    // --------------------------------------------------------------------------
    // F. SISTEMA DE BOUNTIES DE HOGSMEADE
    // --------------------------------------------------------------------------
    obterBountiesHogsmeade(alunoId) {
        const a = this.core.alunos[alunoId];
        if (a) this.garantirEstadoAluno(a);

        return this.bountiesAtivos.map(b => ({
            ...b,
            aceito: a ? (a.bountiesAceitos || []).includes(b.id) : false
        }));
    }

    aceitarBounty(alunoId, bountyId) {
        const a = this.core.alunos[alunoId];
        if (!a) return { erro: "Aluno não encontrado." };
        this.garantirEstadoAluno(a);

        const b = this.bountiesAtivos.find(item => item.id === bountyId);
        if (!b) return { erro: "Cartaz de caça não encontrado." };

        if (!a.bountiesAceitos) a.bountiesAceitos = [];
        if (a.bountiesAceitos.includes(bountyId)) return { erro: "Já aceitaste este contrato de caça." };

        a.bountiesAceitos.push(bountyId);
        this.core._salvarBancoDeDados();

        // Dispara um beacon social de convocação opcional para caçar junto
        this.criarBeaconSocial({
            autorId: a.id,
            tipo: 'combate_mundo',
            titulo: `🎯 Caçada ao ${b.nome}`,
            descricao: `${a.nome} aceitou caçar [${b.nome}] no ${b.local}!`,
            dados: { bountyId: b.id, andar: b.andar }
        });

        return {
            sucesso: true,
            msg: `Aceitaste o contrato de caça para [${b.nome}]! Recompensa prometida: ${b.recompensa.galeoes}G.`
        };
    }

    // --------------------------------------------------------------------------
    // G. AURA DE DESCANSO (RESTED XP) E BÊNÇÃO DOS FUNDADORES
    // --------------------------------------------------------------------------
    adicionarAuraDescanso(alunoId, minutos = 1) {
        const a = this.core.alunos[alunoId];
        if (!a) return;
        this.garantirEstadoAluno(a);

        const ganho = minutos * 25; // 25 XP de descanso por minuto
        a.auraDescanso = Math.min(a.auraDescansoMax || 500, (a.auraDescanso || 0) + ganho);
    }

    aplicarBonusRestedXp(aluno, xpBase) {
        if (!aluno || !aluno.auraDescanso || aluno.auraDescanso <= 0) return xpBase;

        const bonus = Math.min(xpBase, aluno.auraDescanso);
        aluno.auraDescanso -= bonus;
        return xpBase + bonus; // Dobra o XP até esgotar o descanso
    }

    obterCasaLiderComBonus() {
        const casas = ['Gryffindor', 'Slytherin', 'Ravenclaw', 'Hufflepuff'];
        let lider = 'Empate';
        let maxPts = -Infinity;

        casas.forEach(c => {
            let pts = this.core.pontuacaoCasas[c] || 0;
            if (pts > maxPts) {
                maxPts = pts;
                lider = c;
            }
        });

        return {
            lider,
            pontos: maxPts,
            bencaoAtiva: {
                casa: lider,
                bonusVelocidade: '+10%',
                bonusJurosGringotes: '+10%',
                descricao: `Os alunos de ${lider} desfrutam da Bênção dos Fundadores pelo domínio da Taça das Casas!`
            }
        };
    }
}

module.exports = { GamificacaoHogwarts, CATALOGO_CONQUISTAS, CATALOGO_SAPOS, MODELOS_BOUNTIES };
