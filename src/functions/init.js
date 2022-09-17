const fs = require('fs');
const { Collection } = require('discord.js');
const colors = require('colors');

async function init(client) {
    client.once("ready", () => {
        console.log(colors.cyan("[Info]") + ` ${client.user.tag} foi iniciada em ${client.guilds.cache.size} sevidores!`);
        console.log(colors.cyan("[Info]") + ` tendo acesso a ${client.channels.cache.size} canais!`);
        console.log(colors.cyan("[Info]") + ` contendo ${client.users.cache.size} usuarios!`);
        client.commands.forEach(x => {
            client.application.commands.create({ name: x.help.name, description: x.help.description ?? "Sem descrição", options: x.help.options ?? null })
        })
        console.log(colors.cyan("[Info]") + ' Slash commands criado com sucesso');
    });

    client.commands = new Collection();


    fs.readdir("./src/commands", (err, files) => {
        if (err) console.error(err);
        let arquivojs = files.filter(f => f.split(".").pop() === "js");
        arquivojs.forEach((f) => {
            let props = require(`../commands/${f}`);
            client.commands.set(props.help.name, props);
        });
    });

    fs.readdir("./src/events/", (err, files) => {
        if (err) console.error(err);
        let arquivojs = files.filter(f => f.split(".").pop() === "js");
        arquivojs.forEach((f) => {
            let props = require(`../events/${f}`);
            client.on(f.replace(".js", ""), (...args) => props.execute(client, ...args));
        });
    });
}
module.exports = init