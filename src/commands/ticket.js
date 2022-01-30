const { MessageEmbed, MessageSelectMenu, MessageActionRow } = require('discord.js')

module.exports.run = async (client, message) => {
    const embed = new MessageEmbed()
    .setTitle("Atendimento")
    .setDescription("Selecione um dos atendimentos! Embaixo")
    const row = new MessageActionRow()
			.addComponents(
				new MessageSelectMenu()
					.setCustomId('ticket-abert')
					.setPlaceholder('Selecione o tipo de atendimento!')
					.addOptions([
						{
							label: 'Selecione o tipo de atendimento!',
							emoji: '💵',
							value: 'financeiro',
						},
                        {
							label: 'Reporte de Bugs',
							emoji: '🐛',
							value: 'bugs',
						},
                        {
							label: 'Dúvida Geral',
							emoji: '💬',
							value: 'duvidas',
						},
                        {
							label: 'Outro',
							emoji: '🔧',
							value: 'outro',
						},
					]),
			);
            message.delete()
            message.channel.send({embeds: [embed], components: [row]})

}
module.exports.help = {
    name: "ticket",
    category: "moderation"
}