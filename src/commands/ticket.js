const { ActionRowBuilder, EmbedBuilder, SelectMenuBuilder } = require('discord.js');
const departaments = require('../tables/models/departaments');
const { readFileSync } = require('fs')

module.exports.run = async (client, interaction) => {
    const find = (await departaments.findAll()).filter(x => x.getDataValue('id_guild') === interaction.guild.id)
    if (!find[0]) {
        const embed = new EmbedBuilder()
            .setColor("#71368A")
            .setThumbnail(interaction.guild.iconURL({ format: "png", size: 1024 }))
            .setTitle("Aviso!")
            .setDescription(`Olá! Infelizmente você não configurou as mensagens para poder construir o bot! \n \nDigite </config:${(await client.application.commands.fetch()).find(x => x.name === "config").id}> para poder configurar seu bot!`);
        return interaction.reply({embeds: [embed], ephemeral: true})
    };
    const emojiReplace = /(?:[\u2700-\u27bf]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff]|[\u0023-\u0039]\ufe0f?\u20e3|\u3299|\u3297|\u303d|\u3030|\u24c2|\ud83c[\udd70-\udd71]|\ud83c[\udd7e-\udd7f]|\ud83c\udd8e|\ud83c[\udd91-\udd9a]|\ud83c[\udde6-\uddff]|\ud83c[\ude01-\ude02]|\ud83c\ude1a|\ud83c\ude2f|\ud83c[\ude32-\ude3a]|\ud83c[\ude50-\ude51]|\u203c|\u2049|[\u25aa-\u25ab]|\u25b6|\u25c0|[\u25fb-\u25fe]|\u00a9|\u00ae|\u2122|\u2139|\ud83c\udc04|[\u2600-\u26FF]|\u2b05|\u2b06|\u2b07|\u2b1b|\u2b1c|\u2b50|\u2b55|\u231a|\u231b|\u2328|\u23cf|[\u23e9-\u23f3]|[\u23f8-\u23fa]|\ud83c\udccf|\u2934|\u2935|[\u2190-\u21ff])/g;
    const row = new ActionRowBuilder()
        .addComponents(
            new SelectMenuBuilder()
                .setCustomId('ticket-abert')
                .setPlaceholder('Selecione o tipo de atendimento!')
                .addOptions(find.map(x => ({label: x.getDataValue('name'), description: x.getDataValue('description') ?? "Sem descrição", value: x.getDataValue('name').toLowerCase().replace(emojiReplace, "").trim()})).slice(0, 25)),
        );
    interaction.reply({content: 'Mensagem criada com sucesso', ephemeral: true})
    const embed = JSON.parse(readFileSync('./msg.json', 'utf-8'))
    interaction.channel.send({ embeds: Array.isArray(embed) ?  embed:[embed], components: [row] });
};

module.exports.help = {
    name: "ticket",
    category: "moderation"
};
