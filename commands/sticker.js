import { downloadMediaMessage } from '@whiskeysockets/baileys';
import sharp from 'sharp';
import { logger } from '../utils/logger.js';

export const stickerCommand = {
    name: 'sticker',
    aliases: ['s', 'stiker'],
    description: 'Convierte una imagen en sticker',
    execute: async (sock, message) => {
        try {
            const messageType = Object.keys(message.message || {})[0];
            
            // Verificar si el mensaje tiene una imagen
            let imageMessage = null;
            
            if (messageType === 'imageMessage') {
                imageMessage = message.message.imageMessage;
            } else if (message.message?.extendedTextMessage?.contextInfo?.quotedMessage?.imageMessage) {
                imageMessage = message.message.extendedTextMessage.contextInfo.quotedMessage.imageMessage;
            }

            if (!imageMessage) {
                await sock.sendMessage(message.key.remoteJid, {
                    text: '❌ Por favor, envía una imagen con el caption *.sticker* o responde a una imagen con *.sticker*'
                }, { quoted: message });
                return;
            }

            // Enviar mensaje de procesamiento
            await sock.sendMessage(message.key.remoteJid, {
                text: '⏳ Creando sticker...'
            }, { quoted: message });

            // Descargar la imagen
            const buffer = await downloadMediaMessage(
                { message: { imageMessage } },
                'buffer',
                {}
            );

            // Convertir a sticker usando sharp
            const stickerBuffer = await sharp(buffer)
                .resize(512, 512, {
                    fit: 'contain',
                    background: { r: 0, g: 0, b: 0, alpha: 0 }
                })
                .webp({ quality: 95 })
                .toBuffer();

            // Enviar el sticker
            await sock.sendMessage(message.key.remoteJid, {
                sticker: stickerBuffer
            }, { quoted: message });

            logger.success('✅ Sticker creado exitosamente');

        } catch (error) {
            logger.error('Error al crear sticker:', error);
            await sock.sendMessage(message.key.remoteJid, {
                text: '❌ Error al crear el sticker. Asegúrate de enviar una imagen válida.'
            }, { quoted: message });
        }
    }
};
