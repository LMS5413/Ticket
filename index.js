const { Client, Collection } = require('discord.js');
const client = new Client({ intents: ['GUILDS', 'GUILD_MESSAGES'] });
const { token } = require('./config');
const fs = require('fs');
client.commands = new Collection();

console.log("\n[FILE MANAGER ] Carregando o handler");
fs.readdir("./src/commands", (err, files) => {
    if (err) console.error(err);
    let arquivojs = files.filter(f => f.split(".").pop() === "js");
    arquivojs.forEach((f, i) => {
        let props = require(`./src/commands/${f}`);
        client.commands.set(props.help.name, props);
    });
});

fs.readdir("./src/events/", (err, files) => {
    if (err) console.error(err);
    let arquivojs = files.filter(f => f.split(".").pop() === "js");
    arquivojs.forEach((f, i) => {
        let props = require(`./src/events/${f}`);
        client.on(f.replace(".js", ""), (...args) => props.execute(client, ...args));
    });
});

console.log("\n[FILE MANAGER ] Eventos e comandos carregados com sucesso");
console.log("\n[CLIENT] Ligando o bot");

client.login(token);

process.on('unhandledRejection', error => {
    if (error.message === "An invalid token was provided.") {
        return console.error("\n[ERRO unhandledRejection] Você providenciou um token invalido para o seu bot. \n \nPara pegar um token válido veja esse tutorial: https://discordjs.guide/preparations/setting-up-a-bot-application.html#creating-your-bot");
    }
    console.error("\n[ERRO unhandledRejection] Ocorreu um erro na aplicação! Detalhes embaixo");
    console.error(error.stack);
});
process.on('uncaughtException', error => {
    console.error("\n[ERRO uncaughtException] Ocorreu um erro na aplicação! Detalhes embaixo");
    console.error(error.stack);
});