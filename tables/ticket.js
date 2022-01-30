const Sequelize = require('sequelize')
const config = require('../config.json')

const sequelize = new Sequelize(config.mysql.database, config.mysql.user, config.mysql.password, {
    dialect: "mysql",
    host: config.mysql.host,
    port: config.mysql.port ?? 3306,
    logging: false,
    define: {
        timestamps: false
    },
})

let ticket = sequelize.define("tickets", {
    id: {
        type: Sequelize.STRING,
        primaryKey: true,
    },
    idc: {
        type: Sequelize.STRING,
        allowNull: false,
    }
})
module.exports = ticket
module.exports.connect = sequelize