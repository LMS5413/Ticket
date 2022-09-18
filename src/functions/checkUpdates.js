const packageJson = require('../../package.json')
const {default: axios} = require('axios')
const { resolve } = require('path')
const { createWriteStream, unlinkSync, writeFileSync, readFileSync, readdirSync } = require('fs')
const colors = require('colors')
const readRecursive = require('fs-readdir-recursive')
const os = require('os')
const init = require('./init')
const { exec } = require('child_process')

class CheckUpdates {
    async check() {
        const json = (await axios.get(`https://raw.githubusercontent.com/${packageJson['auto-updater']?.repo.split("/")[0].replace("/", "")}/${packageJson['auto-updater']?.repo.split("/")[1]}/${packageJson['auto-updater']?.branch}/package.json`)).data
        if (packageJson.version !== json.version) return {update: true, version: json.version};
        return {update: false};
    }
    async download(client) {
        const pathFromUpdate = resolve(__dirname, '..', '..', 'update.zip')
        const streamFromUpdate = createWriteStream(pathFromUpdate)
        const bufferDown = await axios.get(`https://github.com/${packageJson['auto-updater']?.repo.split("/")[0].replace("/", "")}/${packageJson['auto-updater']?.repo.split("/")[1]}/archive/refs/heads/main.zip`, {responseType: 'stream'})
        console.log(bufferDown.data.readableLength)
        bufferDown.data.pipe(streamFromUpdate)
        streamFromUpdate.on('finish', async () => {
            console.log(colors.green("[Auto-Updater]") + ` Download do update feito com sucesso. Estamos aplicando esse update nesse diretório. Verificando seu sistema para inicar a descompactação`);
            if (os.platform() !== "linux" && os.platform() !== "win32") {
                unlinkSync('./update.zip')
                console.log(colors.red("[Auto-Updater]") + ` Update ignorado! Motivo: Sistema operacional não é windows/linux`)
                return await init(client)
            }
            console.log(colors.green("[Auto-Updater]") + ` Plataforma: ${os.platform() === "win32" ? "Windows":"Linux"} \nComando para descompactar arquivo: ${os.platform() === "win32" ? "tar":"unzip"}`);
            exec(os.platform() === "win32" ? "tar -xf update.zip":"unzip update.zip").on('exit', (m) => {
                readRecursive('./Ticket-main').map(x => x.split(os.platform() === "win32" ? "\\":"/")).forEach(x => {
                    if (x.length === 1) {
                        const file = readFileSync(`./${x[0]}`, 'utf-8')
                        const oldFile = readFileSync(`./${x[0]}`, 'utf-8')
                        if (file === oldFile || (x[0] === "config.json" && Object.keys(file).length === Object.keys(oldFile).length)) return;
                        writeFileSync(`./${x[0]}`, readFileSync(`./Ticket-main/${x[0]}`, 'utf-8'))
                    } else {
                        const file = readFileSync(`./Ticket-main/${x.filter(x => !x.includes(".")).join("/")}/${x[x.length - 1]}`, 'utf-8')
                        const oldFile = readFileSync(`./${x.filter(x => !x.includes(".")).join("/")}/${x[x.length - 1]}`, 'utf-8')
                        if (file === oldFile) return;
                        writeFileSync(`./${x.filter(x => !x.includes(".")).join("/")}/${x[x.length - 1]}`, file)
                    }
                })
                console.log(colors.red("[Auto-Updater]") + ` O bot foi atualizado com sucesso! Pedimos que você ligue novamente para aplicar as alterações`)
            })
        })
    }
}
module.exports = CheckUpdates