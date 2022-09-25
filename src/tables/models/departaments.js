const Sequelize = require('sequelize');
const connection = require('../connection')

let departaments = connection.define("TicketsDepartaments", {
    id_guild: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    category_id: {
        type: Sequelize.STRING,
        allowNull: true,
    },
    description: {
        type: Sequelize.STRING(100),
        allowNull: true,
    }
});
departaments.sync()
module.exports = departaments
