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
    },
    emoji: {
        type: Sequelize.STRING,
        allowNull: true,
    }
});
departaments.sync().then(async () => await connection.query('ALTER TABLE TicketsDepartaments CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_bin'))
module.exports = departaments
