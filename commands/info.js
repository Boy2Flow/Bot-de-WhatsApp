export const infoCommand = {
    name: 'info',
    aliases: ['información', 'about'],
    description: 'Muestra información sobre el bot',
    execute: async (sock, message) => {
        const infoText = `
╔═══════════════════════════╗
║   🤖 INFORMACIÓN DEL BOT  ║
╚═══════════════════════════╝

📱 *Nombre:* Siri BOT
🔢 *Versión:* 1.0.0
⚡ *Tecnología:* B2F (WhatsApp Web API)
🌐 *Node.js:* ${process.version}
*Soporte y uso de comandos y juegos en:*
https://chat.whatsapp.com/GfbbXC9E7Ly2jPrOijxypk

━━━━━━━━━━━━━━━━━━━━━━━━━

✨ *Características:*

• 🎨 Creación de stickers
• 👥 Menciones grupales
• 🎮 Mini juegos interactivos
• 🤖 Respuestas automáticas
• 👋 Mensajes de bienvenida
• 🔧 Sistema de comandos

━━━━━━━━━━━━━━━━━━━━━━━━

📊 *Estadísticas:*

⏱️ Tiempo activo: ${formatUptime(process.uptime())}
💾 Memoria: ${formatMemory(process.memoryUsage().heapUsed)}

━━━━━━━━━━━━━━━━━━━━━━━━

💡 Usa *.menu* para ver todos los comandos

╔═══════════════════════════════════════════════════════╗
║  💚Creado por https://www.instagram.com/boy2flow_ 💚 ║
╚═══════════════════════════════════════════════════════╝
        `.trim();

        await sock.sendMessage(message.key.remoteJid, {
            text: infoText
        }, { quoted: message });
    }
};

function formatUptime(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    return `${hours}h ${minutes}m ${secs}s`;
}

function formatMemory(bytes) {
    return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
}
