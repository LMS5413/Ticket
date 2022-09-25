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
    const row = new ActionRowBuilder()
        .addComponents(
            new SelectMenuBuilder()
                .setCustomId('ticket-abert')
                .setPlaceholder('Selecione o tipo de atendimento!')
                .addOptions(find.map(x => ({label: x.getDataValue('name'), description: x.getDataValue('description') ?? "Sem descrição", value: x.getDataValue('name').toLowerCase().replace(/([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g,'').replace(/\s+/g, ' ').trim(), emoji: x.emoji})).slice(0, 25)),
        );
    interaction.reply({content: 'Mensagem criada com sucesso', ephemeral: true})
    const embed = JSON.parse(readFileSync('./msg.json', 'utf-8'))
    interaction.channel.send({ embeds: Array.isArray(embed) ?  embed:[embed], components: [row] });
};

module.exports.help = {
    name: "ticket",
    category: "moderation"
};
