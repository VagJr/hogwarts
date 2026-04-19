const Groq = require('groq-sdk');

// Coloca aqui as tuas 3 chaves reais para testar
const chaves = [
    "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",
    "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",
    "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"
];

async function testarChaves() {
    for (let i = 0; i < chaves.length; i++) {
        console.log(`\nTestando Chave ${i + 1}...`);
        try {
            const groq = new Groq({ apiKey: chaves[i] });
            const res = await groq.chat.completions.create({
                messages: [{ role: "user", content: "Responde apenas com 'OK'" }],
                model: "llama-3.1-8b-instant",
                max_tokens: 10
            });
            console.log(`✅ Chave ${i + 1} ESTÁ A FUNCIONAR! Resposta: ${res.choices[0].message.content}`);
        } catch (error) {
            console.log(`❌ Chave ${i + 1} FALHOU!`);
            console.log(`Motivo: ${error.message}`);
        }
    }
}

testarChaves();