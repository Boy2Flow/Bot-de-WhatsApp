import { logger } from '../utils/logger.js';

// Función para esperar (delay)
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const dmAllCommand = {
    name: 'dmall',
    aliases: ['broadcast', 'mensajeall', 'boadcast'],
    description: 'Envía un mensaje al privado a todos los miembros del grupo (PELIGRO DE BANEO)',
    groupOnly: true,
    adminOnly: true, // Solo admins pueden usarlo
    execute: async (sock, message, args) => {
        const from = message.key.remoteJid;
        const senderId = message.key.participant;

        // Mensaje FIJO a enviar (Edita esto para cambiar el mensaje)
        const messageToSend = `Entra al grupo 🔗 *LINK DEL GRUPO*

https://chat.whatsapp.com/EMrKiFee3Ap86pgf17IhjG`;

        try {
            // Obtener metadata del grupo
            const groupMetadata = await sock.groupMetadata(from);
            const participants = groupMetadata.participants;
            const totalMembers = participants.length;

            // Advertencia inicial
            await sock.sendMessage(from, {
                text: `⚠️ *INICIANDO* ⚠️\n\n` +
                      `👥 Miembros: ${totalMembers}\n` +
                      `⏱️ Tiempo estimado: ${Math.ceil((totalMembers * 5) / 60)} minutos\n\n` +
                      `🛑 *ADVERTENCIA:*Pene`
            }, { quoted: message });

            let successCount = 0;
            let failCount = 0;

            // Iterar sobre los miembros
            for (const participant of participants) {
                // No enviarse a sí mismo ni al bot
                if (participant.id === sock.user.id || participant.id === senderId) continue;

                try {
                    // Enviar mensaje al privado
                    await sock.sendMessage(participant.id, {
                        text: messageToSend
                    });
                    
                    successCount++;
                    logger.info(`✅ Mensaje enviado a ${participant.id}`);

                    // ESPERA DE 5 SEGUNDOS (CRÍTICO PARA EVITAR BANEO)
                    await sleep(5000);

                } catch (err) {
                    failCount++;
                    logger.error(`❌ Error enviando a ${participant.id}:`, err);
                }
            }

            // Reporte final
            await sock.sendMessage(from, {
                text: `✅ *DIFUSIÓN COMPLETADA*\n\n` +
                      `📨 Enviados: ${successCount}\n` +
                      `❌ Fallidos: ${failCount}`
            }, { quoted: message });

        } catch (error) {
            console.error('Error en dmall:', error);
            await sock.sendMessage(from, {
                text: '❌ Error al obtener los miembros del grupo.'
            }, { quoted: message });
        }
    }
};

export const broadcastCommands = [dmAllCommand];
