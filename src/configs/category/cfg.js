const { Client, ButtonInteraction, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ChannelType } = require('discord.js')
const { Model } = require('sequelize');
const departaments = require('../../tables/models/departaments');
const { writeFileSync, existsSync } = require('fs')

/**
 * 
 * @param {Client} client 
 * @param {ButtonInteraction} interaction 
 * @param {Model} db
 */

async function configTicket(client, interaction) {
    const embed = new EmbedBuilder()
        .setColor("#71368A")
        .setTitle("Configurações")
        .setDescription(`**O que deseja configurar especificamente** \n \n${!await departaments.findOne({ where: { id_guild: interaction.guild.id } }) ? "❌" : "✅"} Categoria dos tickets \n \n${!existsSync('./msg.json') ? "❌" : "✅"} A mensagem principal`);
    const row = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId('category_config')
                .setLabel('Categoria dos tickets')
                .setStyle(ButtonStyle.Primary)
        )
        .addComponents(
            new ButtonBuilder()
                .setCustomId('msg_principal')
                .setLabel('A mensagem principal')
                .setStyle(ButtonStyle.Primary)
        );
    const msg = await interaction.reply({ embeds: [embed], components: [row], fetchReply: true });
    const collector = msg.createMessageComponentCollector({ filter: (m) => m.user.id === interaction.user.id, max: 1 });
    collector.on('collect', (m) => {
        const rowEdited = ActionRowBuilder.from(msg.components[0]);
        rowEdited.components[0].setDisabled(true);
        rowEdited.components[1].setDisabled(true);
        msg.edit({ components: [rowEdited] });

        const embed = new EmbedBuilder().setColor("#71368A");

        switch (m.customId) {
            case "category_config":
                embed.setTitle("Configurações")
                embed.setDescription(`Digite o nome da categoria junto com ID da categoria no discord que deseja que o canal seja sincronizada \n \n**Exemplos:** \n \n\`Financeiro-categoryid\`\n\`financeiro-null\` (null para caso não queira ID)\n\`financeiro-null-descricao\` \n \nQuando terminar de configurar as categorias digite **terminei** (Envie 1 por 1)`);

                m.reply({ embeds: [embed] });
                const collector = m.channel.createMessageCollector({ filter: (m) => m.author.id === interaction.user.id });
                const arr = [];
                collector.on('collect', async (m) => {
                    if (m.content.toLowerCase() === "terminei") return collector.stop();
                    if (m.content.toLowerCase() === "cancelar") {
                        collector.stop("cancelled")
                        return m.channel.send("Cancelado")
                    }
                    if (!m.content.includes("-")) return m.channel.send("Invalido!");
                    const findDepartament = await departaments.findOne({ where: { id_guild: interaction.guild.id, name: m.content.split("-")[0] } })
                    if (findDepartament) return m.channel.send('Essa categoria já existe!')
                    arr.push({ category: m.content.split("-")[0], id: m.content.split("-")[1] === "null" || !m.content.split("-")[1] ? null : m.content.split("-")[1], description: m.content.split("-")[2] === "null" || !m.content.split("-")[2] ? null : m.content.split("-")[2] });
                })
                collector.on('end', async (reason) => {
                    if (reason === "cancelled") return;
                    arr.forEach(async x => {
                        await departaments.create({ name: x.category, category_id: x.id && client.channels.cache.get(x.id).type === ChannelType.GuildCategory ? x.id : null, description: x.description, id_guild: interaction.guild.id })
                    })
                    embed.setDescription(`Categorias configurado com sucesso.`)
                    m.channel.send({embeds: [embed]})
                })
                break;
            case "msg_principal":
                embed.setDescription(`Digite o objeto da embed embaixo! Para construir uma embed, você pode utilizar o https://autocode.com/tools/discord/embed-builder/`);
                m.reply({ embeds: [embed] })
                const collector1 = m.channel.createMessageCollector({ filter: (m) => m.author.id === interaction.user.id });
                collector1.on('collect', async (m) => {
                    try {
                        const content1 = m.content.replaceAll("const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});", "").replaceAll("await lib.discord.channels['@0.3.0'].messages.create(", "").replaceAll("});", "}").trim()
                        const obj = JSON.parse(`${content1.replaceAll("`", "\"")[0] !== "{" && content1.replaceAll("`", "\"")[content1.length - 2] !== "}" ? `{ ${content1.replaceAll("`", "\"")} }` : content1.replaceAll("`", "\"")}`)
                        if (!(Array.isArray(obj.embeds) ? obj.embeds : obj)) {
                            embed.setDescription(`Você não digitou o objeto corretamente.`);
                            return m.channel.send({ embeds: [embed] })
                        }
                        if (m.content.replaceAll("`", "\"").includes("\"color\"")) {
                            if (Array.isArray(obj.embeds)) {
                                obj.embeds.forEach(x => {
                                    if (x.color) x.color = parseInt(x.color, 16)
                                })
                            } else {
                                obj.color = parseInt(obj.color, 16)
                            }
                        }
                        embed.setDescription(`Um preview da embed foi criada! Verifique se é exatamente isso.`)
                        const msg = await m.channel.send({ embeds: [embed, ...obj.embeds ?? obj], components: [new ActionRowBuilder().addComponents(new ButtonBuilder().setCustomId('confirm_msg').setLabel('Confirmar').setStyle(ButtonStyle.Success))] })
                        const collector = msg.createMessageComponentCollector({ filter: (m) => m.user.id === interaction.user.id, time: 3 * 60 * 1000, max: 1 })
                        collector.on('collect', (i) => {
                            if (i.customId === "confirm_msg") {
                                writeFileSync('./msg.json', JSON.stringify(obj.embeds ?? obj))
                                embed.setDescription(`Você configurou com sucesso!`)
                                i.reply({ embeds: [embed] })
                                collector1.stop()
                            }
                        })
                        collector.on('end', (reason) => {
                            if (reason === "time") {
                                if (msg) {
                                    const component = ActionRowBuilder.from(msg.components[0])
                                    component.components[0].data.disabled = true
                                }
                            }
                        })
                    } catch (e) {
                        embed.setDescription(`Um erro ocorreu! Erro: \`${e.message}\``)
                        m.channel.send({ embeds: [embed] })
                    }
                })
        }
    })
}
module.exports = configTicket