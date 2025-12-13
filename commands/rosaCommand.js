import path from 'path';
import fs from 'fs';
import { sendMessageWithImage } from '../utils/imageManager.js';

export const rosaCommand = {
    name: 'rosa',
    aliases: ['flower', 'flor'],
    description: 'Envía una rosa al privado de la persona mencionada',
    groupOnly: true,
    execute: async (sock, message, args) => {
        const from = message.key.remoteJid;
        const sender = message.key.participant || message.key.remoteJid;

        // Verificar mención
        const mentionedJid = message.message?.extendedTextMessage?.contextInfo?.mentionedJid;

        if (!mentionedJid || mentionedJid.length === 0) {
            await sock.sendMessage(from, {
                text: '❌ Debes mencionar a alguien para enviarle una rosa.\n\nEjemplo: .rosa @usuario'
            }, { quoted: message });
            return;
        }

        const targetUser = mentionedJid[0];

        try {
            // 1. Borrar el mensaje del comando
            // Nota: Para borrar mensajes de otros, el bot debe ser admin. 
            // Si el bot no es admin, esto fallará silenciosamente o lanzará error.
            try {
                await sock.sendMessage(from, { delete: message.key });
            } catch (err) {
                console.log('No se pudo borrar el mensaje (quizás no soy admin)');
            }

            // 2. Preparar el envío de la rosa
            const imagePath = path.join(process.cwd(), 'imagenes_bot', 'rosa.png');

            if (!fs.existsSync(imagePath)) {
                console.error('No se encontró la imagen de la rosa en:', imagePath);
                await sock.sendMessage(from, { text: '❌ Error: No encuentro la rosa en mi inventario 😢' });
                return;
            }

            const senderName = message.pushName || sender.split('@')[0];
            const caption = `🌹 *¡Tienes una rosa!* 🌹\n\nDe parte de: *${senderName}*\n\n"Un pequeño detalle para alegrar tu día." ✨`;

            // 3. Enviar al privado del usuario mencionado
            await sendMessageWithImage(sock, targetUser, caption, imagePath);

            // Opcional: Confirmar al remitente (solo log o pequeño mensaje temporal, pero la idea es que sea secreto/limpio)
            // No enviaremos nada al grupo para mantenerlo limpio como pidió el usuario "se borre el mensaje del que lo haya enviado"
            console.log(`[ROSA] ${sender} envió una rosa a ${targetUser}`);

        } catch (error) {
            console.error('Error en comando rosa:', error);
            // Si falló algo crítico, avisar
            await sock.sendMessage(from, {
                text: '❌ Hubo un error al intentar enviar la rosa.'
            }, { quoted: message });
        }
    }
};
