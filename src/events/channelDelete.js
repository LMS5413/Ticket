const dbTicket = require('../tables/models/ticket');

module.exports = {
    async execute(client, channel) {
        const ticket = await dbTicket.findOne({where: {idc: channel.id}})
        if (ticket) ticket.destroy()
    }
}

