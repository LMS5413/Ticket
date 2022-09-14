const { Client, ButtonInteraction, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ChannelType } = require('discord.js')
const { Model } = require('sequelize');
const ticket = require('../../tables/models/roles');
const config = require("../../tables/models/config");

/**
 * 
 * @param {Client} client 
 * @param {ButtonInteraction} interaction 
 * @param {Model} db
 */

async function configRoles(client, interaction, db) {
    const embed = new EmbedBuilder().setColor("#71368A");

    const questions = [
        'Digite no chat qual categoria deseja para configurar esse cargo (digite all para caso esse cargo possa ver todos os tickets)',
        'Digite no chat o ID ou mencione o cargo que terá acesso.'
    ];
    let answers = [];
    embed.setDescription(questions[0])
    interaction.reply({embeds: [embed]})
    const collector = interaction.channel.createMessageCollector({ filter: (m) => m.author.id === interaction.user.id, max: questions.length });
    collector.on('collect', (m) => {
        answers.push(m.content)
        if (answers.length === questions.length || !questions[answers.length]) return collector.stop();
        embed.setDescription(`${questions[answers.length]}`)
        m.channel.send({embeds: [embed]})
    })
    collector.on('end', async () => {
        const cfg = await config.findOne({where: {id: interaction.guild.id}});
        const category = JSON.parse(cfg.getDataValue('value'))[JSON.parse(cfg.getDataValue('proprietes')).findIndex(x => x === "categories")];
        if (answers[0].toLowerCase() !== "all" && !category?.map?.(x => x.category)?.includes(answers[0].toLowerCase())) {
            embed.setDescription('Essa categoria não está configurada!')
            return interaction.channel.send({embeds: [embed]})
        }
        if (!interaction.guild.roles.cache.get(answers[1].replace(/[^0-9]/g, ''))) {
            embed.setDescription('Esse cargo não existe')
            return interaction.channel.send({embeds: [embed]})
        }
        embed.setDescription('Cargo configurado com sucesso!')
        interaction.channel.send({embeds: [embed]})
        await ticket.create({id_guild: interaction.guild.id, id_role: answers[1].replace(/[^0-9]/g, ''), category: answers[0].toLowerCase()})
    })
}
module.exports = configRoles