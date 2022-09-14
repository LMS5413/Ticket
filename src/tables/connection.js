const { mysql } = require('../../config.json');
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(mysql.database, mysql.user, mysql.password, {
    dialect: "mysql",
    host: mysql.host,
    port: mysql.port ?? 3306,
    logging: false,
    define: {
        timestamps: false
    },
});
sequelize.sync().catch(e => {
    throw new Error(`Um erro ocorreu ao tentar se conectar na mysql! Erro: ${e.message}`)
})
module.exports = sequelize