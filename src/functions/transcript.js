const { generateTranscript } = require('reconlx');

async function transcript(channel, guild) {
    let msgs = [];
    const getMsg = async (options = { limit: 100 }) => {
        const messages = await channel.messages.fetch(options);
        msgs = msgs.concat(Array.from(messages.values()));
        if (messages.size === 100) {
            await getMsg({ limit: 100, before: messages.last().id });
        }
    }
    await getMsg()
    let transcript = await generateTranscript({ messages: msgs.filter(x => !x.author.bot), guild: guild, channel: channel });
    let html = transcript.toString();

    html = html.replace("<p class='copyright'>© github.com/reconlx</p>", "").replace("\n", "").replace(`Transcripted ${msgs.filter(x => !x.author.bot).length} messages.`, `${msgs.filter(x => !x.author.bot).length} mensagens foram escritas aqui.`);
    transcript = Buffer.from(html, "utf-8");

    return transcript;
}

module.exports = transcript;
