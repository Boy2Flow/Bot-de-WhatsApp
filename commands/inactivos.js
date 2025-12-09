import fs from 'fs';
import path from 'path';

const MESSAGES_FILE = path.join(process.cwd(), 'messages.json');

export const inactivosCommand = {
    name: 'inactivos',
    aliases: ['inactive', 'lurkers', 'fantasmas'],
    description: 'Muestra los miembros del grupo que no han enviado mensajes',
    groupOnly: true,
    adminOnly: false,
    execute: async (sock, message, args) => {
        try {
            const from = message.key.remoteJid;

            // Obtener metadata del grupo
            const groupMetadata = await sock.groupMetadata(from);
            const allMembers = groupMetadata.participants.map(p => p.id);

            // Leer datos de mensajes
            let groupMessages = {};
            if (fs.existsSync(MESSAGES_FILE)) {
                const fileContent = fs.readFileSync(MESSAGES_FILE, 'utf8');
                if (fileContent.trim()) {
                    const data = JSON.parse(fileContent);
                    groupMessages = data[from] || {};
                }
            }

            // Filtrar miembros inactivos (0 mensajes)
            const inactiveMembers = allMembers.filter(memberId => {
                const messageCount = groupMessages[memberId] || 0;
                return messageCount === 0;
            });

            if (inactiveMembers.length === 0) {
                await sock.sendMessage(from, {
                    text: '🎉 *¡INCREÍBLE!*\n\nTodos los miembros del grupo han enviado al menos un mensaje.\n\n✅ No hay usuarios inactivos.'
                }, { quoted: message });
                return;
            }

            // Construir mensaje
            let text = `👻 *USUARIOS INACTIVOS* 👻\n\n`;
            text += `📊 Total de inactivos: *${inactiveMembers.length}* de *${allMembers.length}* miembros\n\n`;
            text += `━━━━━━━━━━━━━━━━━━━━━━\n\n`;

            // Limitar a 50 usuarios para no saturar el mensaje
            const displayLimit = 50;
            const membersToShow = inactiveMembers.slice(0, displayLimit);
            
            membersToShow.forEach((memberId, index) => {
                text += `${index + 1}. @${memberId.split('@')[0]}\n`;
            });

            if (inactiveMembers.length > displayLimit) {
                text += `\n... y ${inactiveMembers.length - displayLimit} más`;
            }

            text += `\n━━━━━━━━━━━━━━━━━━━━━━\n`;
            text += `\n💡 *Tip:* Estos usuarios nunca han enviado mensajes desde que el bot empezó a contar.`;

            await sock.sendMessage(from, {
                text: text,
                mentions: membersToShow
            }, { quoted: message });

        } catch (error) {
            console.error('Error en comando inactivos:', error);
            await sock.sendMessage(message.key.remoteJid, {
                text: '❌ Ocurrió un error al obtener los usuarios inactivos.\n\n' +
                      'Asegúrate de que el bot tenga permisos para ver los miembros del grupo.'
            }, { quoted: message });
        }
    }
};
