import { config as privilegedConfig } from '../config/privilegedUsers.js';

export const ipCommand = {
    name: 'ip',
    description: 'Muestra la IP de un usuario (Solo creador)',
    execute: async (sock, message, args) => {
        const from = message.key.remoteJid;
        const sender = message.key.participant || from;
        
        // Verificar si es el creador
        // Verificar si es el creador
        if (!privilegedConfig.isSuperAdmin(sender)) {
            const senderNumber = sender.split('@')[0];
            console.log(`[IP Command] Access denied for: ${senderNumber}`);
            await sock.sendMessage(from, {
                text: `❌ Este comando solo puede ser usado por el creador del bot.`
            }, { quoted: message });
            return;
        }

        // Obtener menciones
        const mentionedJid = message.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
        
        if (mentionedJid.length === 0) {
            await sock.sendMessage(from, {
                text: '❌ Debes mencionar a un usuario para sacar su IP.'
            }, { quoted: message });
            return;
        }

        const targetJid = mentionedJid[0];
        
        // Generar IP aleatoria
        const ip = Array.from({length: 4}, () => Math.floor(Math.random() * 256)).join('.');
        
        // Mensaje de respuesta
        await sock.sendMessage(from, {
            text: `📡 *RASTREO COMPLETADO*\n\n👤 Objetivo: @${targetJid.split('@')[0]}\n🌐 IP: ${ip}\n📍 Ubicación: Desconocida (Proxy detectado)`,
            mentions: [targetJid]
        }, { quoted: message });
    }
};
