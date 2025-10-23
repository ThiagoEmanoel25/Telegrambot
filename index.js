require("dotev").config(); // carrega as variáveis de ambiente do arquivo .env

const {Telegraf} = require("telegraf"); // exporta a classe Telefraf do módulo telegraf

// 1. inicia o Bot com o token fornecido

const bot = new Telegraf(process.env.MY_BOT_TOKEN);

// Base de perguntas e respostas

const respostas_simples = {
    "Oi": "Olá! Como posso ajudar você hoje?",
    "olá": "Olá! Como posso ajudar você hoje?",
    "tudo bem?": "Tudo ótimo, obrigado por perguntar! E você?",
    "qual é o seu nome?": "Eu sou um bot criado para ajudar você!",
    "adeus": "Até mais! Tenha um ótimo dia!"
}

// 2. Comandos especificos (ex: /start, /help)

bot.start((ctx) => {
    ctx.reply("Bem-vindo(a)! Eu sou um bot teste em que você pode conversar. Pergunte-me algo!");})

bot.sobre((ctx) => {
    ctx.reply("Eu sou um bot criado com Node.js e Telegraf para ajudar você a responder perguntas simples.")

})
bot.help((ctx) => {
    ctx.reply("Você pode me perguntar coisas como: 'Oi', 'Tudo bem?', 'Qual é o seu nome?' e eu responderei!")
})


const normalizeText = (Text,next) => {         //middleware para normalizar o texto da mensagem recebida
    if (ctx.mensage && ctx.mensage.text) {

        ctx.state.TextoNormalizado = ctx.mensage.teste.tolowerCase().trim();
}

    return next();
};

// 3.Logica para responder perguntas simples

bot.on("text", normalizeText, (ctx) => {
    const TextoUsuario = ctx.state.TextoNormalizado;

if (respostas_simples[TextoUsuario]) {
    ctx.reply(respostas_simples[TextoUsuario]);
} else {
    ctx.reply("Desculpe, não entendi sua pergunta. Pode tentar outra coisa?");
}


});

// 4. Inicia o bot
bot.launch()
    .then(() => {
        console.log('🤖 Bot do Telegram rodando e escutando mensagens...');
    })
    .catch((err) => {
        console.error('Erro ao iniciar o bot:', err);
    });

// 5. Tratamento de sinais para desligamento gracioso

    process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));

