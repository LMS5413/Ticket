const table = require('../../tables/ticket')
const queryInterface = table.connect.getQueryInterface();
const config = require('../../config.json')
const Sequelize = require('sequelize')

module.exports = {
	execute(client) {
		table.findOne({ where: { id: client.user.id } }).catch(e => {
			if (e.message === `Table \'${config.mysql.database}.tickets\' doesn't exist`) {
				console.log(client.color.yellow(`[MYSQL] Não encontrei a tabela tickets! Criando uma nova...`))
				queryInterface.createTable('tickets', {
					id: {
						type: Sequelize.STRING,
						primaryKey: true,
					},
					idc: {
						type: Sequelize.STRING,
						allowNull: false,
					}
				})
				return console.log(client.color.green(`[MYSQL] Tabela criada com sucesso`))
			}
			console.error(client.color.red(`[MYSQL] Não foi possivel fazer uma conexão com o banco de dados! Erro: ${e.message}`))
		})
		console.log(client.color.green(`\n[CLIENT] O bot foi iniciado com sucesso! \n` + client.color.yellow.bold(`\nBot: ${client.user.tag} \nID: ${client.user.id}\nLink de convite: https://discordapp.com/oauth2/authorize?client_id=${client.user.id}&scope=bot&permissions=8`)));
	},
};