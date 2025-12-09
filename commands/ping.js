// Comando para verificar el ping del bot
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
        
        // Editar el mensaje con la información completa
        await sock.sendMessage(from, {
            edit: sentMsg.key,
            text: `${emoji} *¡Pong!*\n\n` +
                  `⏱️ *Tiempo:* ${latency}ms\n` +
                  `📊 *Estado:* ${quality}\n` +
                  `📶 *Señal:* ${statusBar}`
        });
    }
};

