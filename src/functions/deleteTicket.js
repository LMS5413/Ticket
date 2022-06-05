function deleteTicket(channel) {
    channel.send("<:K_atencao:943658966473392128> **Ticket será fechado em 5 segundos!**");
    setTimeout(() => {
        channel.delete();
    }, 5e3);
}

module.exports = deleteTicket;
