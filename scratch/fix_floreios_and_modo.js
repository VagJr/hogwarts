const fs = require('fs');

const file = 'index.html';
let content = fs.readFileSync(file, 'utf8');

// Restore catalogoSeguro for floreios
const brokenFloreiosRegex = /const nomesLojas = \{ 'floreios': 'Floreios & Borrões'[\s\S]*?\{ id: "l_12", nome: "Alquimia, O Guia Prático", preco: 80 \},/;

const restoredFloreios = `const nomesLojas = { 'floreios': 'Floreios & Borrões', 'boticario': 'Boticário', 'madamalkin': 'Madame Malkin', 'dedosdemel': 'Dedosdemel', 'gemialidades': 'Gemialidades Weasley' };
            titulo.innerText = nomesLojas[loja] || "Loja Mágica";
            
            const catalogoSeguro = {
                floreios: [ 
                    { id: "l_1", nome: "Livro Padrão de Feitiços", preco: 20 }, 
                    { id: "l_2", nome: "Poções Avançadas", preco: 50 },
                    { id: "l_3", nome: "Guia de Transfiguração", preco: 40 },
                    { id: "l_4", nome: "Mil Ervas Mágicas", preco: 30 },
                    { id: "l_5", nome: "As Forças das Trevas", preco: 50 },
                    { id: "l_6", nome: "O Livro Monstruoso dos Monstros", preco: 60 },
                    { id: "l_7", nome: "Esclarecendo o Futuro", preco: 35 },
                    { id: "l_8", nome: "Numerologia e Gramática", preco: 45 },
                    { id: "l_9", nome: "Dicionário de Runas", preco: 40 },
                    { id: "l_10", nome: "O Céu Noturno", preco: 40 },
                    { id: "l_11", nome: "Vida Doméstica dos Muggles", preco: 25 },
                    { id: "l_12", nome: "Alquimia, O Guia Prático", preco: 80 },`;

if (brokenFloreiosRegex.test(content)) {
    content = content.replace(brokenFloreiosRegex, restoredFloreios);
    console.log('Restored floreios catalog items 1-11.');
} else {
    console.error('brokenFloreiosRegex did not match.');
}

// Ensure window.modoMmoAtivo is synced
const alternarRegex = /window\.alternarModoHogwarts = function\(\) \{\s*playSFX\('magic'\);\s*modoMmoAtivo = !modoMmoAtivo;/;
if (alternarRegex.test(content)) {
    content = content.replace(alternarRegex, `window.alternarModoHogwarts = function() {
        playSFX('magic');
        modoMmoAtivo = !modoMmoAtivo;
        window.modoMmoAtivo = modoMmoAtivo;`);
    console.log('Synced window.modoMmoAtivo in alternarModoHogwarts.');
}

fs.writeFileSync(file, content, 'utf8');
console.log('fix applied successfully.');
