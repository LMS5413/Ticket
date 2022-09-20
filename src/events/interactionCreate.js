const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, AttachmentBuilder, ButtonStyle, ChannelType, PermissionFlagsBits, InteractionType, PermissionsBitField } = require("discord.js");
const dbTicket = require('../tables/models/ticket');
const roles = require('../tables/models/roles');
const departaments = require("../tables/models/departaments");
const transcriptModel = require("../tables/models/transcript_channel");

module.exports = {
    async execute(client, interaction) {
        if (interaction.type === InteractionType.ApplicationCommand) {
            let arquivocmd = client.commands.get(interaction.commandName);
            if (arquivocmd) {
                if (arquivocmd.help.category === "moderation" && !interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) return;
                arquivocmd.run(client, interaction);
            }
        }
        const ticket = await dbTicket.findOne({ where: { idc: interaction.channel.id } }) || await dbTicket.findOne({ where: { id: interaction.channel.id } });
        if (interaction.isButton()) {
            if (interaction.customId === "fechar") {
                if (!ticket) return interaction.deferUpdate()
                await interaction.channel.permissionOverwrites.edit(ticket.getDataValue('id'), {ViewChannel: false});
                const embed = new EmbedBuilder()
                    .setTitle("Atendimento")
                    .setDescription("Atendimento fechado com sucesso!");
                const row = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setLabel('Reabrir')
                            .setCustomId('reabrir')
                            .setStyle(ButtonStyle.Primary)
                            .setEmoji("🔓")
                    )
                    .addComponents(
                        new ButtonBuilder()
                            .setLabel('Transcript')
                            .setCustomId('transcript')
                            .setStyle(ButtonStyle.Secondary)
                            .setEmoji("📑")
                    )
                    .addComponents(
                        new ButtonBuilder()
                            .setLabel('Deletar o ticket')
                            .setCustomId('delete')
                            .setStyle(ButtonStyle.Danger)
                            .setEmoji("⛔")
                    );
                interaction.reply({ embeds: [embed], components: [row] });
            }
            switch (interaction.customId) {
                case "transcript":
                    interaction.deferUpdate()
                    let transcript = require('../functions/transcript');
                    let bufferHtml = await transcript(interaction.channel, interaction.guild);
                    const attachment = new AttachmentBuilder(bufferHtml, {name: `transcript-${ticket.id}.html`});
                    interaction.channel.send({ content: `Transcript gerado com sucesso!`, files: [attachment] });
                    const transcripts = (await transcriptModel.findAll()).filter(x => client.channels.cache.get(x.getDataValue('id_channel')));
                    transcripts.forEach(x => {
                        const channel = client.channels.cache.get(x.getDataValue('id_channel'))
                        channel.send({ content: `Transcript do canal ${interaction.channel.name} com ID ${interaction.channel.id} \nAutor do ticket: ${client.users.cache.get(ticket.getDataValue('id'))?.username ?? ticket.getDataValue('id')}`, files: [attachment] });
                    })
                    break;
                case "delete":
                    interaction.deferUpdate()
                    let close = require('../functions/deleteTicket');
                    close(interaction.channel);
                    dbTicket.destroy({ where: { idc: interaction.channel.id } });
                    break;
                case "reabrir":
                    interaction.deferUpdate()
                    await interaction.channel.permissionOverwrites.edit(ticket.getDataValue('id'), { ViewChannel: true });
                    interaction.message.delete();
                    break;
            }
            return;
        }
        if (interaction.customId !== "ticket-abert") return;
        if (ticket) return interaction.reply({ content: "Você já possui um ticket aberto!", ephemeral: true });
        const emojiReplace = /(?:[\u2700-\u27bf]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff]|[\u0023-\u0039]\ufe0f?\u20e3|\u3299|\u3297|\u303d|\u3030|\u24c2|\ud83c[\udd70-\udd71]|\ud83c[\udd7e-\udd7f]|\ud83c\udd8e|\ud83c[\udd91-\udd9a]|\ud83c[\udde6-\uddff]|\ud83c[\ude01-\ude02]|\ud83c\ude1a|\ud83c\ude2f|\ud83c[\ude32-\ude3a]|\ud83c[\ude50-\ude51]|\u203c|\u2049|[\u25aa-\u25ab]|\u25b6|\u25c0|[\u25fb-\u25fe]|\u00a9|\u00ae|\u2122|\u2139|\ud83c\udc04|[\u2600-\u26FF]|\u2b05|\u2b06|\u2b07|\u2b1b|\u2b1c|\u2b50|\u2b55|\u231a|\u231b|\u2328|\u23cf|[\u23e9-\u23f3]|[\u23f8-\u23fa]|\ud83c\udccf|\u2934|\u2935|[\u2190-\u21ff])/g;
        const category = (await departaments.findAll()).filter(x => x.getDataValue('id_guild') === interaction.guild.id).find(x => x.getDataValue('name').toLowerCase().replace(emojiReplace, "").trim() === interaction.values[0])
        const roleList = await roles.findAll({where: {id_guild: interaction.guild.id}})
        console.log(category, interaction.values[0])
        let channel = await interaction.guild.channels.create({
            name: `${interaction.values[0]}-${interaction.user.username}`,
            type: ChannelType.GuildText,
            parent: client.channels.cache.get(category.getDataValue('category_id'))?.id ?? null,
            permissionOverwrites: [
                {
                    id: client.user.id,
                    allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.ReadMessageHistory],
                },
                {
                    id: interaction.user.id,
                    allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.ReadMessageHistory],
                },
                {
                    id: interaction.guild.id,
                    deny: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.ReadMessageHistory],
                },
                ...roleList.filter(x => x.getDataValue('parent') === "all" || x.getDataValue('category') === interaction.values[0]).map(x => ({id: x.getDataValue('id_role'), allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.ReadMessageHistory]}))
            ]
        });

        interaction.reply({ content: "Seu ticket foi aberto com sucesso! <#" + channel.id + ">", ephemeral: true });

        const embed = new EmbedBuilder()
            .setTitle("📫 Suporte!")
            .setColor("#71368A")
            .setThumbnail(interaction.guild.iconURL({ format: "png", size: 1024 }))
            .setDescription("Você receberá suporte em breve, enquanto isso descreva em detalhes o problema que você está enfrentando.");

        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setLabel("Fechar")
                    .setStyle(ButtonStyle.Danger)
                    .setEmoji("⚠️")
                    .setCustomId("fechar")
            );

        channel.send({ content: `${interaction.user}`, embeds: [embed], components: [row] });
        await dbTicket.create({ id: interaction.user.id, idc: channel.id });

    },

};

