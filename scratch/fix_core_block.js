const fs = require('fs');

let content = fs.readFileSync('c:/hogwarts/HogwartsCore.js', 'utf8');

// Find marker where calcularDanoSinergia CC ends
const startMarker = `                alvo.efeitos.push({ tipo: ccTipo, expiresAt: agora + duracaoMs, duracao: duracaoMs / 1000 });\n                relato +=`;
const startMarkerCRLF = `                alvo.efeitos.push({ tipo: ccTipo, expiresAt: agora + duracaoMs, duracao: duracaoMs / 1000 });\r\n                relato +=`;

const endMarker = `    equiparFeitico(alunoId, feiticoId) {`;

let startIdx = content.indexOf(startMarkerCRLF);
let len = startMarkerCRLF.length;
if (startIdx === -1) {
    startIdx = content.indexOf(startMarker);
    len = startMarker.length;
}

const endIdx = content.indexOf(endMarker);

console.log('startIdx:', startIdx, 'endIdx:', endIdx);

if (startIdx !== -1 && endIdx !== -1 && endIdx > startIdx) {
    const cleanBlock = ` ` + '`' + `[\${ccTipo}] ` + '`' + `;
            }
        }

        // Crítico natural (15% chance de +50% dano)
        let isCrit = Math.random() < 0.15;
        if (isCrit) {
            danoFinal = Math.floor(danoFinal * 1.5);
            relato += "⚡ CRÍTICO! ";
        }

        return { danoFinal, multiplicador, sinergiaAtivada, relato, shieldBroken, isCrit };
    }

    // 🏋️ CAMPO DE TREINO DE DUELOS (Maestria sem risco)
    treinarFeiticoBoneco(alunoId, feiticoId) {
        const a = this.alunos[alunoId];
        if (!a) return { erro: "Aluno não encontrado." };
        if (a.focoAtual < 1) return { erro: "Foco insuficiente. Descansa na Sala Comunal!" };

        const feitico = this.livroDeFeiticos[feiticoId];
        if (!feitico) return { erro: "Feitiço desconhecido." };

        a.focoAtual -= 1;
        if (!a.maestriaFeiticos) a.maestriaFeiticos = {};
        if (!a.maestriaFeiticos[feiticoId]) a.maestriaFeiticos[feiticoId] = { nivel: 1, exp: 0, expProx: 100 };

        let m = a.maestriaFeiticos[feiticoId];
        m.exp += 25;
        let upou = false;
        let perkDesbloqueado = null;

        let expProx = Math.floor(100 * Math.pow(1.35, m.nivel - 1));
        if (m.exp >= expProx && m.nivel < 10) {
            m.exp -= expProx;
            m.nivel++;
            m.expProx = Math.floor(100 * Math.pow(1.35, m.nivel - 1));
            upou = true;
            if (m.nivel === 5) perkDesbloqueado = "Perk Adepto: Efeito Elemental Aprimorado (+25% Duração/Área)";
            if (m.nivel === 10) perkDesbloqueado = "Perk Grão-Mestre: Custo de Foco -1 e Aura Dourada Mística!";
        }
        if (m.nivel >= 10) m.perk = 'GRAO_MESTRE';
        else if (m.nivel >= 5) m.perk = 'ADEPTO';
        else m.perk = null;

        this._addXp(a, 35);
        this._salvarBancoDeDados();

        return {
            sucesso: true,
            msg: upou ? \`✨ Parabéns! O feitiço \${feitico.nome} atingiu o Nível \${m.nivel}!\` : \`Praticaste \${feitico.nome} no boneco (+25 EXP da Magia).\`,
            nivel: m.nivel,
            exp: m.exp,
            expGanho: 25,
            expProx: m.expProx || 100,
            upou,
            perk: m.perk,
            perkDesbloqueado
        };
    }

    // 💰 ECONOMIA BANCÁRIA: JUROS DO COFRE DE GRINGOTES (1.5% ao dia)
    calcularJurosGringotes(alunoId) {
        const a = this.alunos[alunoId];
        if (!a || (a.cofreGringotes === undefined && !a.galeoes)) return { juros: 0, jurosGaleoes: 0, saldo: 0, taxaDiaria: '1.5%', pronto: false };
        
        let saldo = typeof a.cofreGringotes === 'number' ? a.cofreGringotes : (a.cofreGringotes?.galeoes || a.galeoes || 0);
        if (saldo < 100) return { juros: 0, jurosGaleoes: 0, saldo, taxaDiaria: '1.5%', pronto: false };

        let agora = Date.now();
        let ult = (typeof a.cofreGringotes === 'object' && a.cofreGringotes?.ultimoJuro) 
            ? a.cofreGringotes.ultimoJuro 
            : (a.ultimoRendimentoGringotes || (agora - (24 * 60 * 60 * 1000)));
        let diffHoras = (agora - ult) / (1000 * 60 * 60);

        if (diffHoras >= 24) {
            let dias = Math.floor(diffHoras / 24);
            let juros = Math.floor(saldo * (0.015 * Math.min(dias, 14))); // Max 14 dias acumulados
            return { juros, jurosGaleoes: juros, saldo, diasAcumulados: dias, diasDecorridos: dias, taxaDiaria: '1.5%', pronto: true };
        }
        return { juros: 0, jurosGaleoes: 0, saldo, diasDecorridos: 0, taxaDiaria: '1.5%', pronto: false, horasRestantes: (24 - diffHoras).toFixed(1) };
    }

    resgatarJurosGringotes(alunoId) {
        const a = this.alunos[alunoId];
        if (!a || (a.cofreGringotes === undefined && !a.galeoes)) return { erro: "Cofre não encontrado." };

        const info = this.calcularJurosGringotes(alunoId);
        if (!info.pronto || info.juros <= 0) {
            return { erro: \`Os juros ainda não renderam. Faltam \${info.horasRestantes || 'algumas'} horas para o próximo rendimento.\` };
        }

        if (typeof a.cofreGringotes === 'number') {
            a.cofreGringotes += info.juros;
            a.ultimoRendimentoGringotes = Date.now();
        } else if (typeof a.cofreGringotes === 'object') {
            a.cofreGringotes.galeoes += info.juros;
            a.cofreGringotes.ultimoJuro = Date.now();
        } else {
            a.galeoes = (a.galeoes || 0) + info.juros;
            a.ultimoRendimentoGringotes = Date.now();
        }
        this._salvarBancoDeDados();

        return {
            sucesso: true,
            msg: \`🪙 O Banco Gringotes creditou +\${info.juros} Galeões de rendimentos mágicos no teu cofre!\`,
            resgatado: info.juros,
            novoSaldo: typeof a.cofreGringotes === 'number' ? a.cofreGringotes : (a.cofreGringotes?.galeoes || a.galeoes)
        };
    }

    // 📜 EXAMES DE FINAL DE ANO E N.O.M.s / N.I.E.M.s (O, E, A, P, D, T)
    async realizarExameAno(alunoId, respostas) {
        const a = this.alunos[alunoId];
        if (!a) return { erro: "Aluno não encontrado." };

        const anoAtual = a.anoLetivo || 1;
        const materias = ["Feitiços", "Poções", "Transfiguração", "D.C.A.T.", "Herbologia"];
        
        let acertos = 0;
        let totalPerguntas = materias.length;

        // Avaliação das respostas do exame
        materias.forEach((mat, idx) => {
            let resp = (respostas && respostas[mat]) ? String(respostas[mat]).toLowerCase() : "";
            if (resp.length >= 10 && !resp.includes("sei la") && !resp.includes("não sei")) {
                acertos++;
            }
        });

        let pct = Math.floor((acertos / totalPerguntas) * 100);
        let notaInfo = { nota: 'A', titulo: 'Aceitável (Acceptable)', aprovado: true, xp: 200, galeoes: 25, pontosCasa: 10 };

        if (pct >= 90) notaInfo = { nota: 'O', titulo: 'Ótimo (Outstanding)', aprovado: true, xp: 500, galeoes: 100, pontosCasa: 30 };
        else if (pct >= 75) notaInfo = { nota: 'E', titulo: 'Excede as Expectativas (Exceeds Expectations)', aprovado: true, xp: 350, galeoes: 50, pontosCasa: 20 };
        else if (pct >= 60) notaInfo = { nota: 'A', titulo: 'Aceitável (Acceptable)', aprovado: true, xp: 200, galeoes: 25, pontosCasa: 10 };
        else if (pct >= 40) notaInfo = { nota: 'P', titulo: 'Pobre (Poor)', aprovado: false, xp: 50, galeoes: 0, pontosCasa: -5 };
        else notaInfo = { nota: 'D', titulo: 'Desastroso (Dreadful)', aprovado: false, xp: 10, galeoes: 0, pontosCasa: -10 };

        if (notaInfo.aprovado) {
            a.galeoes = (a.galeoes || 0) + notaInfo.galeoes;
            this._addXp(a, notaInfo.xp);
            if (a.casa && this.pontuacaoCasas[a.casa] !== undefined) {
                this.pontuacaoCasas[a.casa] += notaInfo.pontosCasa;
            }
            if (anoAtual < 7) {
                a.anoLetivo = anoAtual + 1;
                notaInfo.promovido = true;
                notaInfo.novoAno = a.anoLetivo;
            }
        }

        this._salvarBancoDeDados();

        return {
            sucesso: true,
            anoAvaliado: anoAtual,
            nota: notaInfo.nota,
            titulo: notaInfo.titulo,
            aprovado: notaInfo.aprovado,
            promovido: notaInfo.promovido || false,
            novoAno: a.anoLetivo,
            recompensas: { xp: notaInfo.xp, galeoes: notaInfo.galeoes, pontosCasa: notaInfo.pontosCasa }
        };
    }

    // 🦉 MERCADO MÁGICO / CORREIO CORUJA: Venda de excedentes
    venderItemMercado(alunoId, tipoItem, chaveOuId, quantidade = 1) {
        const a = this.alunos[alunoId];
        if (!a) return { erro: "Aluno não encontrado." };

        let valorUnitario = 15;
        let nomeItem = chaveOuId || "Item";

        if (tipoItem === 'ingrediente' || tipoItem === 'inventario') {
            const precos = { 'asfodelo': 15, 'bezoar': 50, 'mandragora': 40, 'ditamno': 25, 'muco': 10, 'veneno_aranha': 35, 'escama_basilisco': 120, 'Mandrágora Rara': 40 };
            valorUnitario = precos[chaveOuId] || 20;
            nomeItem = String(chaveOuId).replace('_', ' ').toUpperCase();

            if (a.inventario?.ingredientes && a.inventario.ingredientes[chaveOuId] !== undefined) {
                if (a.inventario.ingredientes[chaveOuId] < quantidade) return { erro: \`Não tens \${quantidade}x \${nomeItem} para vender!\` };
                a.inventario.ingredientes[chaveOuId] -= quantidade;
            } else if (Array.isArray(a.inventario)) {
                let itemObj = a.inventario.find(i => i.nome === chaveOuId || i.id === chaveOuId);
                if (itemObj) {
                    valorUnitario = itemObj.valor || valorUnitario;
                    itemObj.quantidade = (itemObj.quantidade || 1) - quantidade;
                    if (itemObj.quantidade <= 0) a.inventario = a.inventario.filter(i => i !== itemObj);
                }
            }
        } else if (tipoItem === 'pocao') {
            valorUnitario = 80;
            let idx = (a.mochilaEscolar || []).findIndex(i => i.tipo === 'pocao_feita');
            if (idx === -1) return { erro: "Não tens poções engarrafadas para vender." };
            nomeItem = a.mochilaEscolar[idx].nome;
            a.mochilaEscolar.splice(idx, 1);
        } else {
            return { erro: "Tipo de item não suportado para venda rápida." };
        }

        let totalGanho = valorUnitario * quantidade;
        a.galeoes = (a.galeoes || 0) + totalGanho;
        this._salvarBancoDeDados();

        return {
            sucesso: true,
            msg: \`Vendeste \${quantidade}x \${nomeItem} por \${totalGanho} Galeões no Correio Coruja!\`,
            ganhoTotal: totalGanho,
            galeoes: a.galeoes
        };
    }

    `;

    content = content.slice(0, startIdx + len) + cleanBlock + content.slice(endIdx);
    fs.writeFileSync('c:/hogwarts/HogwartsCore.js', content, 'utf8');
    console.log('Successfully repaired and enhanced HogwartsCore.js section!');
} else {
    console.error('Failed to find start or end marker');
}
