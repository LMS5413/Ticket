const Sequelize = require('sequelize');
const connection = require('../connection')

let roles = connection.define("TicketsRoles", {
    id_guild: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    id_role: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    category: {
        type: Sequelize.STRING,
        allowNull: true,
    }
});
roles.sync()
module.exports = roles
