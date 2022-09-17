const { Client, Collection } = require('discord.js');
const client = new Client({ intents: ['Guilds', 'GuildMessages', 'MessageContent'] });
const { token } = require('./config');
client.login(token);
const fs = require('fs');
const colors = require('colors');
console.log(colors.yellow("[Auto-Updater]") + ' Verificando se há atualizações disponíveis');
const AutoUpdater = require('auto-updater');

const autoupdater = new AutoUpdater({
    pathToJson: './package.json',
    autoupdate: true,
    checkgit: true,
    jsonhost: 'raw.githubusercontent.com',
    contenthost: 'raw.githubusercontent.com',
    progressDebounce: 0,
    devmode: true
});
autoupdater.on('git-clone', function () {
    console.log(colors.green("[Auto-Updater]") + ` Infelizmente você usou o comando git clone e assim não é possivel checar as atualizações.`);
    init()
});
autoupdater.on('error', function (name, e) {
    console.error(name, e);
});
autoupdater.on('check.up-to-date', function (v) {
    console.log(colors.yellow("[Auto-Updater]") + ` Que legal! Você está utilizando a ultima atualização do bot!`);
    init()
});
autoupdater.on('check.out-dated', function (v_old, v) {
    console.log(colors.red("[Auto-Updater]") + ` Que pena! Você não está usando a ultima versão do bot. Estamos atualizando seu bot para você poder desfrutar sem bugs dele!`);
    autoupdater.on('download.progress', function (name, perc) {
        process.stdout.write(colors.yellow("[Auto-Updater]") + `Baixando: ${perc}%. Basta aguardar`);
    });
    autoupdater.on('update.downloaded', function () {
        console.log(colors.red("[Auto-Updater]") + ` Update baixado! Estamos atualizando para você tudo!`);
    });
});
process.on('unhandledRejection', error => {
    if (error.message === "An invalid token was provided.") {
        console.error(colors.red("[Info]") + " Você providenciou um token invalido para sua aplicação para pegar um token válido veja esse tutorial: https://discordjs.guide/preparations/setting-up-a-bot-application.html#creating-your-bot.");
        process.exit(1)
    }
    console.error(colors.red("[Info]") + " Ocorreu um erro na aplicação! Detalhes embaixo:");
    console.error(error.stack);
});
process.on('uncaughtException', error => {
    console.error(colors.red("[Info]") + " Ocorreu um erro na aplicação! Detalhes embaixo:");
    console.error(error.stack);
});
autoupdater.fire('check');
async function init() {
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
}