const Sequelize = require('sequelize');
const colors = require('colors');
const { mysql } = require('../../config.json');
const table = require('../../tables/ticket');
const queryInterface = table.connect.getQueryInterface();

module.exports = {
    execute(client) {
        table.findOne({ where: { id: client.user.id } }).catch(e => {
            if (e.message === `Table \'${mysql.database}.tickets\' doesn't exist`) {
                console.log(colors.red("[Info]")+` Não encontrei a tabela tickets! Criando uma nova...`);
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
   return console.log(colors.cyan("[Info]")+` Tabela criada com sucesso no MYSQL!`);
}
   console.error(colors.red("[Info]")+` Não foi possivel fazer uma conexão com o banco de dados! Erro: ${e.message}`);
        });
    },
};
