const { Sequelize } = require('sequelize');
const { mysql } = require('../../config.json');

const sequelize = new Sequelize(mysql.database, mysql.user, mysql.password, {
    dialect: "mysql",
    host: mysql.host,
    port: mysql.port ?? 3306,
    logging: false,
    define: {
        timestamps: false
    },
});

let ticket = sequelize.define("tickets", {
    id: {
        type: Sequelize.STRING,
        primaryKey: true,
    },
    idc: {
        type: Sequelize.STRING,
        allowNull: false,
    }
});

module.exports = ticket;
module.exports.connect = sequelize;
