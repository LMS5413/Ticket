const { Client } = require('discord.js');
const client = new Client({ intents: ['Guilds', 'GuildMessages', 'MessageContent'] });
const { token } = require('./config');
client.login(token);
const colors = require('colors');
console.log(colors.yellow("[Auto-Updater]") + ' Verificando se há atualizações disponíveis');
const { version } = require('./package.json');
const init = require('./src/functions/init');
const { existsSync, rmdirSync } = require('fs');
const updater = new (require('./src/functions/checkUpdates'))()
updater.check().then(async res => {
    if (res.update) {
        const readline = require('readline').createInterface({
            input: process.stdin,
            output: process.stdout,
        });
        readline.question(colors.yellow("[Auto-Updater]") + ` Existe atualização disponivel! ${version} > ${res.version} Você deseja fazer a atualização? `, async q => {
            if (q.toLowerCase() !== "s" && q.toLowerCase() !== "n") {
                console.log(colors.red("[Auto-Updater]") + ` Resposta inválida!`)
                return process.exit(1)
            }
            if (q.toLowerCase() === "s") {
                console.log(colors.yellow("[Auto-Updater]") + ` Estamos atualizando seu bot.`)
                await updater.download(client)
            } else await init(client)
            readline.close()
        })
    } else {
        console.log(colors.green("[Auto-Updater]") + ` Você está na ultima versão do bot!`);
        if (existsSync('./update.zip'))  unlinkSync('./update.zip')
        if (existsSync('./Ticket-main')) rmdirSync('./Ticket-main')
        await init(client)
    }
})
process.on('unhandledRejection', error => {
    if (error.message === "An invalid token was provided.") {
        console.error(colors.red("[Info]") + " Você providenciou um token invalido para sua aplicação para pegar um token válido veja esse tutorial: https://discordjs.guide/preparations/setting-up-a-bot-application.html#creating-your-bot.");
        process.exit(1)
    }
    console.error(colors.red("[Info]") + " Ocorreu um erro na aplicação! Detalhes embaixo:");
    console.error(error);
});
process.on('uncaughtException', error => {
    console.error(colors.red("[Info]") + " Ocorreu um erro na aplicação! Detalhes embaixo:");
    console.error(error);
});