const { MessageEmbed, MessageActionRow, MessageButton, MessageAttachment } = require("discord.js");
const dbTicket = require('../../tables/ticket');

module.exports = {
    async execute(client, interaction) {
        if (interaction.isCommand()) return;
        const ticket = (await dbTicket.findOne({ where: { id: interaction.user.id } }))?.dataValues ?? await dbTicket.findOne({ where: { idc: interaction.channel.id } })?.dataValues;

        if (interaction.customId === "fechar") {
            await interaction.deferUpdate();
            if (!ticket) return;
            await interaction.channel.permissionOverwrites.edit(ticket.id, { VIEW_CHANNEL: false });

            const embed = new MessageEmbed()
                .setTitle("Atendimento")
                .setDescription("Atendimento fechado com sucesso!");

            const row = new MessageActionRow()
                .addComponents(
                    new MessageButton()
                        .setLabel('Reabrir')
                        .setCustomId('reabrir')
                        .setStyle('SECONDARY')
                        .setEmoji("🔓")
                )
                .addComponents(
                    new MessageButton()
                        .setLabel('Transcript')
                        .setCustomId('transcript')
                        .setStyle('SECONDARY')
                        .setEmoji("📑")
                )
                .addComponents(
                    new MessageButton()
                        .setLabel('Deletar o ticket')
                        .setCustomId('delete')
                        .setStyle('SECONDARY')
                        .setEmoji("⛔")
                );

            let msg = await interaction.channel.send({ embeds: [embed], components: [row] });
            const filter = (c) => !c.user.bot;
            const collector = msg.createMessageComponentCollector({ filter, componentType: 'BUTTON' });

            collector.on('collect', async (c) => {
                await c.deferUpdate();

                switch (c.customId) {
                    case "transcript":
                        let transcript = require('../functions/transcript');
                        let bufferHtml = await transcript(interaction.channel, interaction.guild);
                        const attachment = new MessageAttachment(bufferHtml, `transcript-${ticket.id}.html`);
                        interaction.channel.send({ content: `Transcript gerado com sucesso!`, files: [attachment] });
                        break;
                    case "delete":
                        let close = require('../functions/deleteTicket');
                        close(interaction.channel);
                        dbTicket.destroy({ where: { idc: interaction.channel.id } });
                        collector.stop();
                        break;
                    case "reabrir":
                        await interaction.channel.permissionOverwrites.edit(ticket.id, { VIEW_CHANNEL: true });
                        msg.delete();
                        collector.stop();
                        break;
                }
            });
            return;
        }

        if (interaction.customId !== "ticket-abert") return;
        if (ticket) return interaction.reply({ content: "Você já possui um ticket aberto!", ephemeral: true });
        let channel = await interaction.guild.channels.create(`ticket-${interaction.user.discriminator}`, {
            type: "text",
            permissionOverwrites: [
                {
                    id: client.user.id,
                    allow: ["VIEW_CHANNEL", "SEND_MESSAGES", "READ_MESSAGE_HISTORY"],
                },
                {
                    id: interaction.user.id,
                    allow: ["VIEW_CHANNEL", "SEND_MESSAGES", "READ_MESSAGE_HISTORY"],
                },
                {
                    id: interaction.guild.id,
                    deny: ["VIEW_CHANNEL", "SEND_MESSAGES", "READ_MESSAGE_HISTORY"],
                },
            ]
        });
      
       interaction.reply({ content: "Seu ticket foi aberto com sucesso! <#" + channel.id + ">", ephemeral: true });

        const embed = new MessageEmbed()
            .setTitle("📫 Suporte de Kettra!")
            .setColor("#71368A")
            .setThumbnail(interaction.guild.iconURL({ dynamic : true, format: "png", size: 1024}))
            .setDescription("Você receberá suporte em breve, enquanto isso descreva em detalhes o problema que você está enfrentando.");

   const row = new MessageActionRow()
      .addComponents(
        new MessageButton()
                .setLabel("Fechar")
                .setStyle("DANGER")
                .setEmoji("⚠️")
                .setCustomId("fechar")
         );
         
    channel.send({ content: `${interaction.user}`, embeds: [embed], components: [row] });
    
  await dbTicket.create({ id: interaction.user.id, idc: channel.id });
  
    },
    
};

