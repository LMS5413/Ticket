const Sequelize = require('sequelize');
const connection = require('../connection')

let ticket = connection.define("TicketsList", {
    id: {
        type: Sequelize.STRING,
        primaryKey: true,
    },
    idc: {
        type: Sequelize.STRING,
        allowNull: false,
    }
});
ticket.sync()
module.exports = ticket
