// Comando para verificar el ping del bot
import os from 'os';

export const pingCommand = {
    name: 'ping',
    aliases: ['latencia', 'speed'],
    description: 'Verifica la latencia del bot',
    execute: async (sock, message) => {
        const from = message.key.remoteJid;

        // Tiempo de inicio
        const start = Date.now();

        // Calcular latencia aproximada (tiempo de procesamiento)
        const processingTime = Date.now() - start;

        // Simular envío para calcular latencia real
        const testStart = Date.now();
        const sentMsg = await sock.sendMessage(from, {
            text: '🏓 Calculando...'
        }, { quoted: message });
        const latency = Date.now() - testStart;

        // Determinar emoji y calidad según latencia
        let emoji = '🟢';
        let quality = 'Excelente';
        let statusBar = '▰▰▰▰▰';

        if (latency > 500) {
            emoji = '🔴';
            quality = 'Lento';
            statusBar = '▰▱▱▱▱';
        } else if (latency > 300) {
            emoji = '🟠';
            quality = 'Regular';
            statusBar = '▰▰▱▱▱';
        } else if (latency > 150) {
            emoji = '🟡';
            quality = 'Normal';
            statusBar = '▰▰▰▱▱';
        } else if (latency > 50) {
            emoji = '🟢';
            quality = 'Bueno';
            statusBar = '▰▰▰▰▱';
        }

        // Obtener información del sistema
        const totalMem = os.totalmem();
        const freeMem = os.freemem();
        const usedMem = totalMem - freeMem;
        const cpus = os.cpus();
        const cpuModel = cpus.length > 0 ? cpus[0].model : 'Desconocido';
        const hostname = os.hostname();

        const formatBytes = (bytes) => {
            const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
            if (bytes === 0) return '0 Byte';
            const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
            return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
        };

        const formatUptime = (seconds) => {
            seconds = Number(seconds);
            const d = Math.floor(seconds / (3600 * 24));
            const h = Math.floor(seconds % (3600 * 24) / 3600);
            const m = Math.floor(seconds % 3600 / 60);
            const s = Math.floor(seconds % 60);

            const dDisplay = d > 0 ? d + (d == 1 ? " d, " : " d, ") : "";
            const hDisplay = h > 0 ? h + (h == 1 ? " h, " : " h, ") : "";
            const mDisplay = m > 0 ? m + (m == 1 ? " m, " : " m, ") : "";
            const sDisplay = s > 0 ? s + (s == 1 ? " s" : " s") : "";
            return dDisplay + hDisplay + mDisplay + sDisplay;
        };

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

        const uptime = formatUptime(process.uptime());
        const ramPercentage = Math.round((usedMem / totalMem) * 100);
        const cpuPercentage = await getCpuUsage();

        // Editar el mensaje con la información completa
        const creatorNumber = '34608837414';
        const creatorJid = `${creatorNumber}@s.whatsapp.net`;

        await sock.sendMessage(from, {
            edit: sentMsg.key,
            text: `${emoji} *¡Pong!*\n\n` +
                `⏱️ *Tiempo:* ${latency}ms\n` +
                `📊 *Estado:* ${quality}\n` +
                `📶 *Señal:* ${statusBar}\n\n` +
                `⏲️ *Activo:* ${uptime}\n` +
                `💻 *Host:* ${hostname}\n` +
                `🧠 *CPU:* ${cpuModel} (*${cpuPercentage}%*)\n` +
                `💾 *RAM:* ${formatBytes(usedMem)} / ${formatBytes(totalMem)} (*${ramPercentage}%*)\n\n` +
                `🤖 *Bot creado por:* @${creatorNumber}`,
            mentions: [creatorJid]
        });
    }
};

