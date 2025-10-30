/*
 * weather.js
 * (Versão final corrigida)
 */

// Pega a chave do .env que foi carregado pelo index.js

const OWM_API_URL = "https://api.openweathermap.org/data/2.5/weather";

async function getWeatherData(cityName) {

    const OWM_API_KEY = process.env.OWM_API_KEY;

    if (!OWM_API_KEY) {
        console.error("Erro: Chave da API OpenWeatherMap (OWM_API_KEY) não definida.");
        return "Erro interno: Não consigo acessar meu serviço de clima agora.";
    }

    const params = new URLSearchParams({
        q: cityName,
        appid: OWM_API_KEY,
        units: 'metric',
        lang: 'pt_br'
    });

    try {
        // 'fetch' é nativo do Node.js v18+
        const response = await fetch(`${OWM_API_URL}?${params.toString()}`);

        if (response.status === 404) {
            return `Desculpe, não consegui encontrar a cidade '${cityName}'. 😥`;
        }

        if (response.status === 401) {
            console.warn("Erro de API Key (401)! Verifique se a chave é válida ou se já está ativa.");
            return "Erro interno ao acessar a API de clima (Key inválida).";
        }

        if (!response.ok) {
            throw new Error(`Erro HTTP! Status: ${response.status}`);
        }

        const data = await response.json();

        // Formata a mensagem
        const nome_cidade = data.name;
        const descricao_clima = data.weather[0].description;
        const temp = data.main.temp;
        const sensacao_termica = data.main.feels_like;
        const umidade = data.main.humidity;

        return (
            `Clima em ${nome_cidade} 🌡️:\n` +
            `  - Descrição: ${descricao_clima.charAt(0).toUpperCase() + descricao_clima.slice(1)}\n` +
            `  - Temperatura: ${temp}°C\n` +
            `  - Sensação térmica: ${sensacao_termica}°C\n` +
            `  - Umidade: ${umidade}%`
        );

    } catch (error) {
        console.error("Erro ao buscar dados do clima:", error);
        return "Ops! Algo deu errado ao tentar buscar o clima.";
    }
}

// Exporta a função para que o index.js possa usá-la
module.exports = { getWeatherData };