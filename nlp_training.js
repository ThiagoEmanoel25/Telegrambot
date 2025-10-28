// executar apenas uma vez para treinar o modelo NLP
const { NlpManager} = require('node-nlp');
const fs = require('fs'); // Importa o módulo 'fs' para manipulação de arquivos

console.log('Treinando o modelo NLP...');

// 1. cria uma instância do NlpManager

const manager = new NlpManager({ languages: ['pt'], forceNER: true });
// 2. Adiciona intenções e exemplos de treinamento

manager.addDocument('pt', 'olá', 'saudacao');
manager.addDocument('pt', 'oi', 'saudacao');
manager.addDocument('pt', 'bom dia', 'saudacao');
manager.addDocument('pt', 'boa tarde', 'saudacao');
manager.addDocument('pt', 'E ai', 'saudacao');

// intenção de despedida
manager.addDocument('pt', 'tchau', 'despedida');
manager.addDocument('pt', 'até mais', 'despedida');
manager.addDocument('pt', 'até logo', 'despedida');
manager.addDocument('pt', 'falou', 'despedida');

// Intenção: ver o clima (com cidade)
manager.addDocument('pt', 'como está o tempo em @city', 'ver_clima');
manager.addDocument('pt', 'qual a previsão para @city', 'ver_clima');
manager.addDocument('pt', 'vai chover em @city?', 'ver_clima');
manager.addDocument('pt', 'clima @city', 'ver_clima');

// Intenção: ver o clima (sem cidade)
manager.addDocument('pt', 'como está o tempo?', 'ver_clima.sem_local');
manager.addDocument('pt', 'qual a previsão?', 'ver_clima.sem_local');
manager.addDocument('pt', 'e o clima?', 'ver_clima.sem_local');

// 3. Adicionar respostas simples (para intenções que não precisam de API)
manager.addAnswer('pt', 'saudacao', 'Olá! Como posso ajudar você hoje? 👋');
manager.addAnswer('pt', 'despedida', 'Até logo! 👋');
manager.addAnswer('pt', 'ver_clima.sem_local', 'Claro! Para qual cidade você gostaria de saber o clima?');

// 4. Treina o modelo NLP
(async () => {
    await manager.train();

    // 5. Salva o modelo treinado em um arquivo
    const modelFileName = "model.nlp";
    if (!fs.existsSync('./models')) fs.mkdirSync("./models");   // Cria o arquivo se não existir

    manager.save('./models/${modelFileName}');
    console.log('Modelo NLP treinado e salvo em ./models/${modelFileName}!');
})();