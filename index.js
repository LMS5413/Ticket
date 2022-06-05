const { Client, Collection } = require('discord.js');
const client = new Client({ intents: ['GUILDS', 'GUILD_MESSAGES'] });
const { token } = require('./config');
client.login(token);
const fs = require('fs');
const colors = require('colors');

client.once("ready", () => {
 console.log(colors.cyan("[Info]")+` ${client.user.tag} foi iniciada em ${client.guilds.cache.size} sevidores!`);
 console.log(colors.cyan("[Info]")+` tendo acesso a ${client.channels.cache.size} canais!`);
 console.log(colors.cyan("[Info]")+` contendo ${client.users.cache.size} usuarios!`);
});

client.commands = new Collection();


fs.readdir("./src/commands", (err, files) => {
    if (err) console.error(err);
    let arquivojs = files.filter(f => f.split(".").pop() === "js");
    arquivojs.forEach((f) => {
        let props = require(`./src/commands/${f}`);
        client.commands.set(props.help.name, props);
    });
});

fs.readdir("./src/events/", (err, files) => {
    if (err) console.error(err);
    let arquivojs = files.filter(f => f.split(".").pop() === "js");
    arquivojs.forEach((f) => {
        let props = require(`./src/events/${f}`);
        client.on(f.replace(".js", ""), (...args) => props.execute(client, ...args));
    });
});


process.on('unhandledRejection', error => {
    if (error.message === "An invalid token was provided.") {
        return console.error(colors.red("[Info]")+" Você providenciou um token invalido para sua aplicação para pegar um token válido veja esse tutorial: https://discordjs.guide/preparations/setting-up-a-bot-application.html#creating-your-bot.");
    }
    console.error(colors.red("[Info]")+" Ocorreu um erro na aplicação! Detalhes embaixo:");
    console.error(error.stack);
});
process.on('uncaughtException', error => {
    console.error(colors.red("[Info]")+" Ocorreu um erro na aplicação! Detalhes embaixo:");
    console.error(error.stack);
});
