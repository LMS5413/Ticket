const Sequelize = require('sequelize');
const { mysql } = require('../../config.json');
const table = require('../../tables/ticket');
const queryInterface = table.connect.getQueryInterface();

module.exports = {
    execute(client) {
        table.findOne({ where: { id: client.user.id } }).catch(e => {
            if (e.message === `Table \'${mysql.database}.tickets\' doesn't exist`) {
                console.log(`[MYSQL] Não encontrei a tabela tickets! Criando uma nova...`);
                queryInterface.createTable('tickets', {
                    id: {
                        type: Sequelize.STRING,
                        primaryKey: true,
                    },
                    idc: {
                        type: Sequelize.STRING,
                        allowNull: false,
                    }
                });
                return console.log(`[MYSQL] Tabela criada com sucesso`);
            }
            console.error(`[MYSQL] Não foi possivel fazer uma conexão com o banco de dados! Erro: ${e.message}`);
        });
        console.log(`\n[CLIENT] O bot foi iniciado com sucesso!\n\nBot: ${client.user.tag}\nID: ${client.user.id}\nLink de convite: https://discordapp.com/oauth2/authorize?client_id=${client.user.id}&scope=bot&permissions=8`);
    },
};