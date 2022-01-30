const Discord = require('discord.js')
const client = new Discord.Client({intents: ['GUILDS', 'GUILD_MESSAGES']});
const config = require('./config.json')
const fs = require('fs')
client.commands = new Discord.Collection();
client.color = require('colors')
console.log(client.color.yellow("\n[FILE MANAGER ] Carregando o handler"))
fs.readdir("./src/commands", (err, files) => {
    if (err) console.error(err);
    let arquivojs = files.filter(f => f.split(".").pop() == "js");
    arquivojs.forEach((f, i) => {
        let props = require(`./src/commands/${f}`);
        client.commands.set(props.help.name, props);
    })
})
fs.readdir("./src/events/", (err, files) => {
    if (err) console.error(err);
    let arquivojs = files.filter(f => f.split(".").pop() == "js");
    arquivojs.forEach((f, i) => {
        let props = require(`./src/events/${f}`);
        client.on(f.replace(".js", ""), (...args) => props.execute(client, ...args));
    })
})
console.log(client.color.green("\n[FILE MANAGER ] Eventos e comandos carregados com sucesso"))
console.log(client.color.yellow("\n[CLIENT] Ligando o bot"))
client.login(config.token);
process.on('unhandledRejection', error => {
    if(error.message === "An invalid token was provided.") {
        return console.error(client.color.red("\n[ERRO unhandledRejection] Você providenciou um token invalido para o seu bot. \n \nPara pegar um token válido veja esse tutorial: https://discordjs.guide/preparations/setting-up-a-bot-application.html#creating-your-bot"))
    }
    console.error(client.color.red("\n[ERRO unhandledRejection] Ocorreu um erro na aplicação! Detalhes embaixo"))
    console.error(error.stack)
});
process.on('uncaughtException', error => {
    console.error(client.color.red("\n[ERRO uncaughtException] Ocorreu um erro na aplicação! Detalhes embaixo"))
    console.error(error.stack)
})
