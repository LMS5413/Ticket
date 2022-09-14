const { generateTranscript } = require('reconlx');

async function transcript(channel, guild) {
    let msgs = (await channel.messages.fetch()).filter(y => !y.author.bot && y.content.length > 0).map(x => x).reverse();
    let transcript = await generateTranscript({ messages: msgs, guild: guild, channel: channel });
    let html = transcript.toString();

    html = html.replace("<p class='copyright'>© github.com/reconlx</p>", "").replace("\n", "").replace(`Transcripted ${msgs.length} messages.`, `${msgs.length} mensagens foram escritas aqui.`);
    transcript = Buffer.from(html, "utf-8");

    return transcript;
}

module.exports = transcript;
