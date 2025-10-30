
require("dotenv").config(); // Carrega o .env

const { Telegraf, session } = require("telegraf");
const { NlpManager } = require('node-nlp');
const fs = require('fs');
const { getWeatherData } = require('./weather-service'); // Importa nossa função de clima

// ----- 1. CONFIGURAÇÃO -----
const TELEGRAM_TOKEN = process.env.MY_BOT_TOKEN; // Use a variável que você definiu no .env
const MODEL_PATH = './models/model.nlp';

if (!TELEGRAM_TOKEN) {
    console.error("Erro: Token do Telegram (MY_BOT_TOKEN) não definido!"); // Mensagem de erro clara
    process.exit(1);
}

const bot = new Telegraf(TELEGRAM_TOKEN);
const manager = new NlpManager();

// (Opcional, mas recomendado) Gerenciamento de "estado" da conversa
// Isso é útil se precisarmos fazer perguntas de acompanhamento
bot.use(session());

// ----- 2. FUNÇÃO PRINCIPAL DO BOT -----
async function startBot() {
    // Carrega o cérebro (modelo de ML)
    if (fs.existsSync(MODEL_PATH)) {
        console.log("Carregando modelo de ML treinado...");
        await manager.load(MODEL_PATH);
        console.log("Modelo carregado com sucesso.");
    } else {
        console.error(`Erro: Arquivo de modelo não encontrado em ${MODEL_PATH}`);
        console.log("Por favor, execute 'node nlp-trainer.js' primeiro.");
        process.exit(1);
    }

    // ----- Handlers de comando tradicionais (sem ML) -----
    bot.start((ctx) => {
        ctx.reply("Olá! Eu sou um bot com ML. Tente me perguntar o clima ou me dar um 'oi'!");
    });

    bot.help((ctx) => {
        ctx.reply("Você pode falar comigo em linguagem natural! Tente 'como tá o tempo em Salvador?' ou 'bom dia'.");
    });

    bot.command('sobre', (ctx) => {
        ctx.reply("Eu sou um bot com ML que usa node-nlp para entender intenções e APIs para buscar dados!");
    });

    // ----- 3. O HANDLER DE MENSAGENS COM ML -----
    // bot.on('text') escuta por QUALQUER mensagem de texto.
    bot.on('text', async (ctx) => {
        const userText = ctx.message.text;

        // 1. Processar a mensagem com o ML
        console.log(`Processando: "${userText}"`);
        const response = await manager.process('pt', userText);

        // 2. Extrair intenção e entidades
        const intent = response.intent;
        const score = response.score; // A confiança do modelo (0 a 1)

        console.log(`Intenção: ${intent} (Confiança: ${score.toFixed(2)})`);

        // Se a confiança for muito baixa, não faça nada
        if (score < 0.6) {
            ctx.reply("Desculpe, não entendi o que você quis dizer. Pode tentar de outra forma?");
            return;
        }

        // 3. Tomar Ações com base na Intenção
        switch (intent) {
            case 'saudacao':
            case 'despedida':
            case 'ver_clima.sem_local':
                // Para estas, o nlp-trainer já tem uma resposta pronta
                ctx.reply(response.answer);
                break;

            case 'ver_clima':
                // Esta intenção precisa de uma ação!
                // Vamos encontrar a entidade "@city" que o ML extraiu
                const cityEntity = response.entities.find(e => e.entity === 'city');

                if (cityEntity) {
                    const cityName = cityEntity.sourceText; // 'sourceText' é o que o usuário digitou

                    // Informa que está buscando (melhor experiência)
                    await ctx.reply(`Verificando o clima para ${cityName}...`);

                    // Chama nosso serviço de API
                    const weatherReport = await getWeatherData(cityName);
                    ctx.reply(weatherReport);
                } else {
                    // Caso o ML identifique "ver_clima" mas falhe em pegar a cidade
                    // Usamos a resposta padrão que definimos no trainer
                    ctx.reply(response.answer || "Para qual cidade?");
                }
                break;

            case 'None':
            default:
                ctx.reply("Desculpe, não consegui entender isso.");
                break;
        }
    });

    // Inicia o bot
    bot.launch()
        .then(() => {
            console.log('🤖 Bot (Telegraf) rodando e escutando mensagens...');
        })
        .catch((err) => {
            console.error('Erro ao iniciar o bot:', err);
        });
}

// Inicia o bot
startBot();

// 4. Tratamento de sinais para desligamento gracioso
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));