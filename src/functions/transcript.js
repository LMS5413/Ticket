const { generateTranscript } = require('reconlx');

async function transcript(channel, guild) {
    let msgs = [];
    const getMsg = async (msg, limit=100) => {
        const messages = await channel.messages.fetch({ limit: limit, before: msg ? msg.id : null });
        msgs = msgs.concat(messages.array());
        if (messages.size === limit) {
            await getMsg(messages.last(), limit);
        }
    }
    let transcript = await generateTranscript({ messages: msgs, guild: guild, channel: channel });
    let html = transcript.toString();

    html = html.replace("<p class='copyright'>© github.com/reconlx</p>", "").replace("\n", "").replace(`Transcripted ${msgs.length} messages.`, `${msgs.length} mensagens foram escritas aqui.`);
    transcript = Buffer.from(html, "utf-8");

    return transcript;
}

module.exports = transcript;
