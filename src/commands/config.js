const { ActionRowBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const config = require('../tables/models/departaments');
const roles = require('../tables/models/roles');
const { existsSync } = require('fs')

module.exports.run = async (client, interaction) => {
    const departaments = await config.findAll({where: {id_guild: interaction.guild.id}})
    const obj1 = roles.findAll({where: {id_guild: interaction.guild.id}})
    const embed = new EmbedBuilder()
        .setColor("#71368A")
        .setTitle('Configuração')
        .setDescription(`> Bem vindo ao sistema de configuração! Aqui você poderá configurar o sistema de ticket do jeito que você quiser! Aqui está uma lista o que você pode configurar \n \n**Quando está ❌ atrás da configuração, é porque ela não foi configurada ainda**\n**Quando está ✅ atrás da configuração, é porque ela foi configurada e você pode configurar novamente** \n \n${departaments.length === 0 || !existsSync('./msg.json') ?  "❌" : "✅"} Categoria dos tickets e mensagem principal\n${obj1.length === 0 ? "❌" : "✅"} Cargos que podem ter acesso aos tickets`)
    const row = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId('ticket_category_cfg')
                .setLabel('Configuração dos tickets/categorias')
                .setStyle(ButtonStyle.Primary)
        )
        .addComponents(
            new ButtonBuilder()
                .setCustomId('ticket_roles_cfg')
                .setLabel('Configuração dos cargos')
                .setStyle(ButtonStyle.Primary)
        )
    const msg = await interaction.reply({ embeds: [embed], components: [row], fetchReply: true })
    const collector = msg.createMessageComponentCollector({ filter: (m) => m.user.id === interaction.user.id })
    collector.on('collect', (m) => {
        require(`../configs/${m.customId.split("_")[1]}/${m.customId.split("_")[2]}`)(client, m, find)
    })
};
module.exports.help = {
    name: "config",
    category: "moderation",
    description: "Configure seu sistema de ticket!"
};
