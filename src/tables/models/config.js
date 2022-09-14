const Sequelize = require('sequelize');
const connection = require('../connection')

let config = connection.define("TicketSettings", {
    id: {
        type: Sequelize.STRING,
        primaryKey: true,
    },
    proprietes: {
        type: Sequelize.TEXT('long'),
        allowNull: false,
    },
    value: {
        type: Sequelize.TEXT('long'),
        allowNull: false,
    }
});
config.sync()
module.exports = config
