const { prefix } = require('../../config.json');

module.exports = {
    execute(client, message) {
        if (message.author.bot) return;
        if (message.channel.type === "DM") return;
        if (!message.content.startsWith(prefix)) return;

        const args = message.content.slice(prefix.length).trim().split(/ +/g);
        let arquivocmd = client.commands.get(args[0]);
        if (arquivocmd) {
            if (arquivocmd.help.category === "moderation" && !message.member.permissions.has("ADMINISTRATOR")) return;
            arquivocmd.run(client, message, args.slice(1));
        }
    },
};