const { MessageActionRow, MessageEmbed, MessageSelectMenu } = require('discord.js');

module.exports.run = async (client, message) => {
    const embed = new MessageEmbed()
        .setColor("#71368A")
        .setThumbnail(message.guild.iconURL({ dynamic : true, format: "png", size: 1024}))
        .setTitle("<:K_:947545349151653898> Suporte de Kettra!")
        .setDescription("Ola, Boas vindas a central de atendimento de **Kettra World**.\n\n<:K_env:938833579981566043> Para começar o atendimento selecione uma das opções abaixo que lê melhor corresponde!");

    const row = new MessageActionRow()
        .addComponents(
            new MessageSelectMenu()
                .setCustomId('ticket-abert')
                .setPlaceholder('Selecione o tipo de atendimento!')
                .addOptions([
                    {
                        label: 'Reportar Bugs.',
                        emoji: '<:K_atencao:943658966473392128>',
                        value: 'bugs',
                    },
                    {
                        label: 'Dúvidas sobre o servidor.',
                        emoji: '<:K_humm:939225711678459934>',
                        value: 'duvidas',
                    },
                    {
                        label: 'Outro assunto não listado.',
                        emoji: '<:KConstrutores:980993351455211520>',
                        value: 'outro',
                    },
                ]),
        );
    message.delete();
    message.channel.send({ embeds: [embed], components: [row] });
};

module.exports.help = {
    name: "ticket",
    category: "moderation"
};
