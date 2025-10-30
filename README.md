# Telegram ML Bot

Um bot para Telegram que utiliza **Machine Learning** para entender intenções em linguagem natural e consultar a previsão do tempo via OpenWeatherMap.

## 🧩 Funcionalidades

* Saudações (`oi`, `olá`, `bom dia`)
* Despedidas (`tchau`, `até mais`)
* Consulta do clima em cidades específicas ou gerais
* Modelo de NLP treinado localmente usando **node-nlp**

---

## ⚙️ Pré-requisitos

* Node.js >= 18
* NPM ou Yarn
* Conta no Telegram (para criar o bot)
* Chave de API do OpenWeatherMap

---

## 📦 Instalação

1. Clone o repositório:

```bash
git clone https://github.com/seu-usuario/telegram-ml-bot.git
cd telegram-ml-bot
```

2. Instale as dependências:

```bash
npm install
```

3. Crie um arquivo `.env` na raiz com as variáveis:

```env
MY_BOT_TOKEN=seu_token_do_telegram
OWM_API_KEY=sua_chave_openweathermap
```

> ⚠️ Não compartilhe este arquivo publicamente.

---

## 🚀 Treinando o modelo

Antes de rodar o bot, treine o modelo NLP:

```bash
node nlp-trainer.js
```

O modelo será salvo em `./models/model.nlp`.

---

## 🤖 Rodando o bot

```bash
node index.js
```

O bot estará online e pronto para interações no Telegram.

---

## 💡 Como funciona

1. O bot recebe mensagens do usuário.
2. O modelo NLP identifica a **intenção** e, se houver, a **entidade** (como cidade).
3. Para intenções de clima, o bot consulta a **API do OpenWeatherMap**.
4. Responde de forma natural conforme o treinamento do modelo.

---

## 📌 Estrutura do projeto

```
├── index.js          (Seu bot principal)
├── nlp-trainer.js    (O script para treinar o cérebro)
├── weather.js        (O script que busca o clima)
├── models/           (Pasta que o trainer cria)
│   └── model.nlp     (O "cérebro" treinado)
├── .env              (Suas chaves de API secretas)
├── .gitignore        (Para ignorar o .env, models/ e node_modules/)
├── package.json      (Define seu projeto)
└── node_modules/     (Instalada pelo npm)       
```

---

## 🔗 Referências

* [Telegraf](https://telegraf.js.org/)
* [Node-NLP](https://github.com/axa-group/nlp.js)
* [OpenWeatherMap API](https://openweathermap.org/api)
