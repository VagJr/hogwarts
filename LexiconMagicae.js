// ==============================================================================
// ✨ LexiconMagicae.js - FÍSICA MÁGICA E COMBATE
// ==============================================================================
const crypto = require('crypto');

const MAGIA_ANCESTRAL = Symbol("A Força Primordial");
const ESTATUTO_SIGILO = Symbol("O Véu Mágico");

class LexiconMagicae {
    constructor() { this.ignicao_concluida = false; }
    DespertarMatriz(codigoSeguranca) { if (this.ignicao_concluida) return; this.ignicao_concluida = true; return true; }
    PulsarEternidade() { return true; }

    CalcularCentelhaArcana(aluno) {
        let pA = (aluno.atributosTotais.feiticos + aluno.atributosTotais.defesa + aluno.atributosTotais.transfiguracao) * 10;
        let pM = Object.values(aluno.maestriaFeiticos || {}).reduce((acc, f) => acc + (f.nivel * 50), 0);
        return Math.floor((aluno.nivel * 100) + pA + pM + (aluno.equipamentos.varinha ? aluno.equipamentos.varinha.poderBase * 2 : 0));
    }
    CalcularPoderComMaestria(poderBase, maestriaNivel) { return Math.floor((poderBase * (1 + ((maestriaNivel - 1) * 0.08))) + (maestriaNivel * 10)); }
    CalcularCustoComMaestria(custoBase, maestriaNivel) { return Math.max(1, custoBase - Math.floor(maestriaNivel / 4)); }

    CalcularSinergiaElemental(alvoStatus, feiticoElemento) {
        if (!alvoStatus || alvoStatus === 'normal') return { multiplicador: 1.0, novoStatus: feiticoElemento, efeitoTexto: null };
        const reacoes = { 'agua_fogo': { mult: 1.5, status: 'vapor', efeito: 'Vapor Escaldante!' }, 'gelo_fogo': { mult: 2.0, status: 'molhado', efeito: 'Derretimento Abrupto!' } };
        return reacoes[`${alvoStatus}_${feiticoElemento}`] ? { multiplicador: reacoes[`${alvoStatus}_${feiticoElemento}`].mult, novoStatus: reacoes[`${alvoStatus}_${feiticoElemento}`].status, efeitoTexto: reacoes[`${alvoStatus}_${feiticoElemento}`].efeito } : { multiplicador: 1.0, novoStatus: feiticoElemento, efeitoTexto: null };
    }
}
module.exports = new LexiconMagicae();