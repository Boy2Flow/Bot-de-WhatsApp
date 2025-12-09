import os from 'os';

export const infoCommand = {
    name: 'info',
    aliases: ['información', 'about', 'bot'],
    description: 'Muestra información del bot y del sistema',
    execute: async (sock, message) => {
        // Calcular estadísticas
        const uptime = formatUptime(process.uptime());

        // Memoria
        const totalMem = os.totalmem();
        const freeMem = os.freemem();
        const usedMem = totalMem - freeMem;
        const ramPercentage = Math.round((usedMem / totalMem) * 100);

        // CPU Usage
        const getCpuUsage = async () => {
            const startCpus = os.cpus();
            const startSnapshot = startCpus.map(cpu => cpu.times);

            await new Promise(resolve => setTimeout(resolve, 100));

            const endCpus = os.cpus();
            const endSnapshot = endCpus.map(cpu => cpu.times);

            let totalIdle = 0;
            let totalTick = 0;

            for (let i = 0; i < startSnapshot.length; i++) {
                const start = startSnapshot[i];
                const end = endSnapshot[i];

                const idle = end.idle - start.idle;
                const total = (end.user + end.nice + end.sys + end.idle + end.irq) -
                    (start.user + start.nice + start.sys + start.idle + start.irq);

                totalIdle += idle;
                totalTick += total;
            }

            return (totalTick > 0) ? Math.round(((totalTick - totalIdle) / totalTick) * 100) : 0;
        };

        const cpuPercentage = await getCpuUsage();
        const cpuModel = os.cpus()[0].model;

        // Owner Info
        const ownerNumber = '34608837414';
        const ownerJid = `${ownerNumber}@s.whatsapp.net`;

        const infoText = `
╔═══════════════════════════╗
║   🤖 ESTADO DE SIRI BOT   ║
╚═══════════════════════════╝

📊 *ESTADÍSTICAS DEL SISTEMA*
💻 *CPU:* ${cpuPercentage}% (${cpuModel})
💾 *RAM:* ${ramPercentage}% (${formatBytes(usedMem)} / ${formatBytes(totalMem)})
⏱️ *Tiempo Encendido:* ${uptime}

━━━━━━━━━━━━━━━━━━━━━━━━━

👑 *Dueño:* @${ownerNumber}
🌐 *GitHub:* https://github.com/Boy2Flow
📸 *Instagram:* https://www.instagram.com/boy2flow_

━━━━━━━━━━━━━━━━━━━━━━━━━
`.trim();

        await sock.sendMessage(message.key.remoteJid, {
            text: infoText,
            mentions: [ownerJid]
        }, { quoted: message });
    }
};

function formatUptime(seconds) {
    const d = Math.floor(seconds / (3600 * 24));
    const h = Math.floor(seconds % (3600 * 24) / 3600);
    const m = Math.floor(seconds % 3600 / 60);
    const s = Math.floor(seconds % 60);

    const dDisplay = d > 0 ? d + "d " : "";
    const hDisplay = h > 0 ? h + "h " : "";
    const mDisplay = m > 0 ? m + "m " : "";
    const sDisplay = s > 0 ? s + "s" : "";
    return (dDisplay + hDisplay + mDisplay + sDisplay).trim();
}

function formatBytes(bytes) {
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    if (bytes === 0) return '0 Byte';
    const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
    return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
}
