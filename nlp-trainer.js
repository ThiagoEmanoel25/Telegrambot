/*
 * nlp-trainer.js
 * Treina o modelo com entidades geographyV2 (muitas variantes)
 */

const { NlpManager } = require('node-nlp');
const fs = require('fs');

console.log('🧠 Iniciando treinamento do modelo de ML (com NER v2)...');

const manager = new NlpManager({ languages: ['pt'], use: ['ner'] });


manager.addDocument('pt', 'oi', 'saudacao');
manager.addDocument('pt', 'olá', 'saudacao');
manager.addDocument('pt', 'bom dia', 'saudacao');

manager.addDocument('pt', 'tchau', 'despedida');
manager.addDocument('pt', 'até mais', 'despedida');

manager.addDocument('pt', 'como está o tempo em São Paulo', 'ver_clima');
manager.addDocument('pt', 'qual a previsão para o Rio de Janeiro', 'ver_clima');
manager.addDocument('pt', 'vai chover em Curitiba?', 'ver_clima');
manager.addDocument('pt', 'clima em Manaus', 'ver_clima');
manager.addDocument('pt', 'temperatura em Recife', 'ver_clima');
manager.addDocument('pt', 'como está o tempo em Salvador', 'ver_clima');
manager.addDocument('pt', 'vai chover amanhã em Fortaleza', 'ver_clima');
manager.addDocument('pt', 'qual a temperatura em Brasília', 'ver_clima');
manager.addDocument('pt', 'me diga o tempo de Belém', 'ver_clima');

manager.addDocument('pt', 'como está o tempo?', 'ver_clima.sem_local');
manager.addDocument('pt', 'qual a previsão do tempo?', 'ver_clima.sem_local');


// ENTIDADES (geographyV2) - inclua variantes com/sem acento e abreviações

const addCity = (canonical, variants = []) => {
    manager.addNamedEntityText('geographyV2', canonical, ['pt'], variants);
};

// exemplos importantes (adicione outras cidades que você queira suportar)
addCity('São Paulo', ['são paulo', 'sao paulo', 'sp']);
addCity('Rio de Janeiro', ['rio de janeiro', 'rio', 'rj']);
addCity('Curitiba', ['curitiba']);
addCity('Recife', ['recife']);
addCity('Manaus', ['manaus']);
addCity('Salvador', ['salvador']);
addCity('Fortaleza', ['fortaleza']);
addCity('Brasília', ['brasília', 'brasilia', 'br']);
addCity('Belém', ['belém', 'belem']);
addCity('Belo Horizonte', ['belo horizonte', 'belo-horizonte', 'bh']);
addCity('Porto Alegre', ['porto alegre', 'poa']);
addCity('Goiânia', ['goiânia', 'goiania']);
addCity('São Luís', ['são luís', 'sao luis']);
addCity('Campo Grande', ['campo grande']);

// Respostas-

manager.addAnswer('pt', 'saudacao', 'Olá! Como posso ajudar você hoje? 👋');
manager.addAnswer('pt', 'despedida', 'Até logo! 👋');
manager.addAnswer('pt', 'ver_clima.sem_local', 'Claro! Para qual cidade você gostaria de saber o clima?');


// Treina e salva

(async () => {
    console.log('🚀 Treinando o modelo NLP... (pode levar alguns segundos)');
    console.time('⏱ Tempo de treino');
    await manager.train();
    console.timeEnd('⏱ Tempo de treino');

    if (!fs.existsSync('./models')) fs.mkdirSync('./models');

    manager.save('./models/model.nlp');
    console.log('✅ Modelo NLP treinado e salvo em ./models/model.nlp');

    // salva metadados simples
    fs.writeFileSync('./models/model-info.json', JSON.stringify({
        trainedAt: new Date().toISOString(),
        intents: ['saudacao', 'despedida', 'ver_clima', 'ver_clima.sem_local'],
        entities: ['geographyV2'],
        version: '1.0.0'
    }, null, 2));

    console.log('📄 ./models/model-info.json criado.');
})();
