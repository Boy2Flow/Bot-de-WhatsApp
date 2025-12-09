import fs from 'fs';
import path from 'path';

const MESSAGES_FILE = path.join(process.cwd(), 'messages.json');

export const mensajesCommand = {
    name: 'mensajes',
    aliases: ['messages', 'msg', 'msgs', 'topmsg'],
    description: 'Muestra el top de usuarios con más mensajes en el grupo',
    groupOnly: true,
    adminOnly: false,
    execute: async (sock, message, args) => {
        try {
            const from = message.key.remoteJid;

            if (!fs.existsSync(MESSAGES_FILE)) {
                await sock.sendMessage(from, {
                    text: '📊 Aún no hay registros de mensajes.'
                }, { quoted: message });
                return;
            }

            const fileContent = fs.readFileSync(MESSAGES_FILE, 'utf8');
            if (!fileContent.trim()) {
                await sock.sendMessage(from, {
                    text: '📊 Aún no hay registros de mensajes.'
                }, { quoted: message });
                return;
            }

            const data = JSON.parse(fileContent);
            
            // Verificar si hay datos para este grupo
            if (!data[from] || Object.keys(data[from]).length === 0) {
                await sock.sendMessage(from, {
                    text: '📊 Aún no hay registros de mensajes en este grupo.'
                }, { quoted: message });
                return;
            }

            // Obtener mensajes del grupo actual
            const groupMessages = data[from];
            const sortedUsers = Object.entries(groupMessages)
                .sort(([, a], [, b]) => b - a);

            const top10 = sortedUsers.slice(0, 10);
            
            let text = `📊 *TOP MENSAJES DEL GRUPO* 📊\n\n`;
            const mentions = [];

            top10.forEach(([userId, count], index) => {
                const medal = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `${index + 1}.`;
                text += `${medal} @${userId.split('@')[0]} - *${count.toLocaleString()}* msgs\n`;
                mentions.push(userId);
            });

            // Añadir información del usuario que ejecuta el comando si no está en el top 10
            const senderId = message.key.participant || message.key.remoteJid;
            const userRank = sortedUsers.findIndex(([id]) => id === senderId);
            
            if (userRank >= 10) {
                const userCount = groupMessages[senderId] || 0;
                text += `\n...\n${userRank + 1}. @${senderId.split('@')[0]} - *${userCount.toLocaleString()}* msgs`;
                mentions.push(senderId);
            }

            await sock.sendMessage(from, {
                text: text,
                mentions: mentions
            }, { quoted: message });

        } catch (error) {
            console.error('Error en comando mensajes:', error);
            await sock.sendMessage(message.key.remoteJid, {
                text: '❌ Ocurrió un error al obtener los mensajes.'
            }, { quoted: message });
        }
    }
};
