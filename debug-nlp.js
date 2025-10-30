// debug-nlp.js
const { NlpManager } = require('node-nlp');
const MODEL_PATH = './models/model.nlp';

(async () => {
    const manager = new NlpManager({ languages: ['pt'], use: ['ner'] });
    try {
        await manager.load(MODEL_PATH);
    } catch (err) {
        console.error('Erro ao carregar modelo:', err);
        process.exit(1);
    }

    const tests = [
        'Como está o tempo em Salvador?',
        'Vai chover em Recife amanhã?',
        'Qual a previsão para São Paulo?',
        'Como está o tempo?'
    ];

    for (const t of tests) {
        console.log('\n-----\nFrase:', t);
        const r = await manager.process('pt', t);
        console.log(JSON.stringify(r, null, 2));
    }
})();
