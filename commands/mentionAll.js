
// Comandos de mención (SOLO ADMINISTRADORES)

// 1. Comando .everyone (Antiguo .tag): Menciona a todos con lista visible
const everyoneCommand = {
    name: 'everyone',
    aliases: ['tagall', 'all'],
    description: 'Menciona a todos los miembros del grupo con una lista (solo administradores)',
    groupOnly: true,
    adminOnly: true,
    execute: async (sock, message, args) => {
        try {
            const from = message.key.remoteJid;
            
            // Obtener metadata del grupo
            const groupMetadata = await sock.groupMetadata(from);
            const participants = groupMetadata.participants;

            // Crear lista de menciones
            const mentions = participants.map(p => p.id);
            
            // Crear mensaje personalizado
            const customMessage = args.join(' ') || '📢 ¡Atención a todos!';
            
            // Crear texto con todas las menciones
            let text = `${customMessage}\n\n`;
            text += '━━━━━━━━━━━━━━━━━━━\n';
            
            participants.forEach((participant, index) => {
                text += `${index + 1}. @${participant.id.split('@')[0]}\n`;
            });
            
            text += '━━━━━━━━━━━━━━━━━━━\n';
            text += `\n👥 Total: ${participants.length} miembros`;

            // Enviar mensaje con menciones
            const sentMessage = await sock.sendMessage(from, {
                text: text,
                mentions: mentions
            });

            // Borrar el mensaje original del usuario
            setTimeout(async () => {
                try {
                    await sock.sendMessage(from, {
                        delete: message.key
                    });
                } catch (deleteError) {
                    console.log('⚠️ No se pudo eliminar el mensaje original:', deleteError.message);
                }
            }, 1000);

            // Borrar el mensaje del bot (la lista) después de unos segundos
            setTimeout(async () => {
                try {
                    if (sentMessage && sentMessage.key) {
                        await sock.sendMessage(from, {
                            delete: sentMessage.key
                        });
                    }
                } catch (botDeleteError) {
                    console.log('⚠️ No se pudo eliminar el mensaje del bot:', botDeleteError.message);
                }
            }, 5000); // 5 segundos para que dé tiempo a leer la lista

        } catch (error) {
            console.error('Error al mencionar a todos:', error);
            await sock.sendMessage(message.key.remoteJid, {
                text: '❌ Error al mencionar a todos los miembros.'
            }, { quoted: message });
        }
    }
};

// 2. Comando .tag (Nuevo): Mención fantasma (Hidetag)
const tagCommand = {
    name: 'tag',
    aliases: ['hidetag', 'aviso'],
    description: 'Menciona a todos de forma oculta (Ghost Mention)',
    groupOnly: true,
    adminOnly: true,
    execute: async (sock, message, args) => {
        try {
            const from = message.key.remoteJid;
            const groupMetadata = await sock.groupMetadata(from);
            const participants = groupMetadata.participants;
            const mentions = participants.map(p => p.id);

            const text = args.join(' ');
            
            if (!text) {
                await sock.sendMessage(from, { text: '⚠️ Escribe un mensaje para enviar.' }, { quoted: message });
                return;
            }

            // Enviar mensaje con menciones ocultas
            // El truco es pasar 'mentions' con todos los IDs, pero no poner los @tags en el texto
            const sentMessage = await sock.sendMessage(from, {
                text: text,
                mentions: mentions
            });



            // Borrar el mensaje del bot (según petición)
            // Esto hará que llegue la notificación pero el mensaje desaparezca poco después
            setTimeout(async () => {
                try {
                    if (sentMessage && sentMessage.key) {
                        await sock.sendMessage(from, { delete: sentMessage.key });
                    }
                } catch (e) {
                    console.log('Error borrando mensaje bot:', e);
                }
            }, 2000); // 2 segundos

        } catch (error) {
            console.error('Error en hidetag:', error);
        }
    }
};

export const mentionCommands = [everyoneCommand, tagCommand];
