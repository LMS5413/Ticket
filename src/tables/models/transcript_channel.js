const Sequelize = require('sequelize');
const connection = require('../connection')

let transcript = connection.define("TicketsTranscript", {
    id_guild: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    id_channel: {
        type: Sequelize.STRING,
        allowNull: true,
    },
});
transcript.sync()
module.exports = transcript