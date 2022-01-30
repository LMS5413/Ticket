function deleteTicket(channel) {
    channel.send("Irei deletar em 5 segundos")
    setTimeout(() => {
        channel.delete()
    }, 5000)
}
module.exports = deleteTicket