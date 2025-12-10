import { downloadMediaMessage } from '@whiskeysockets/baileys';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { getKey } from '../utils/keyManager.js';
import fs from 'fs';
import path from 'path';

export const transcribirCommand = {
    name: 'transcribir',
    aliases: ['trans', 'txt', 'stt'],
    description: 'Transcribe un mensaje de audio a texto usando IA.',
    execute: async (sock, message, args) => {
        const from = message.key.remoteJid;

        // 1. Obtener mensaje citado
        const quoted = message.message?.extendedTextMessage?.contextInfo?.quotedMessage;

        if (!quoted) {
            // Verificar si el propio mensaje es audio (poco probable con el comando .trans, usualmente es reply)
            return sock.sendMessage(from, { text: '⚠️ Debes responder a un audio con .trans' }, { quoted: message });
        }

        // 2. Verificar si es audio
        const audioMessage = quoted.audioMessage;
        if (!audioMessage) {
            return sock.sendMessage(from, { text: '⚠️ El mensaje respondido no es un audio.' }, { quoted: message });
        }

        // 3. Obtener API Key
        const apiKey = getKey('gemini');
        if (!apiKey) {
            return sock.sendMessage(from, {
                text: '❌ No hay API Key de Gemini configurada.\nUsa: *.setkey gemini [TU_API_KEY]*\nPuedes obtenerla gratis en Google AI Studio.'
            }, { quoted: message });
        }

        try {
            await sock.sendMessage(from, { text: '🎧 *Escuchando y transcribiendo...*' }, { quoted: message });

            // 4. Descargar audio
            // Construimos un objeto de mensaje falso compatible con downloadMediaMessage
            const msgToDownload = {
                key: {
                    remoteJid: from,
                    id: message.message.extendedTextMessage.contextInfo.stanzaId,
                    participant: message.message.extendedTextMessage.contextInfo.participant
                },
                message: quoted
            };

            const buffer = await downloadMediaMessage(
                msgToDownload,
                'buffer',
                {},
                {
                    logger: console,
                    reuploadRequest: sock.updateMediaMessage
                }
            );

            // 5. Enviar a Gemini
            const genAI = new GoogleGenerativeAI(apiKey);
            // Usamos modelo flash que es rápido y soporta audio
            const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

            const audioBase64 = buffer.toString('base64');

            // Usar el mimetype original es más seguro
            let mimeType = audioMessage.mimetype?.split(';')[0] || 'audio/ogg';

            // Corrección para Gemini (prefiere standard mimes)
            if (mimeType === 'audio/mp4') mimeType = 'audio/mp4'; // Whatsapp a veces manda audio/mp4 en iOS

            const result = await model.generateContent([
                "Transcribe el siguiente audio exactamente como suena. Si hay varias personas, indícalo. Si es música o ruido, descríbelo.",
                {
                    inlineData: {
                        mimeType: mimeType,
                        data: audioBase64
                    }
                }
            ]);

            const text = result.response.text();

            // 6. Enviar resultado
            await sock.sendMessage(from, {
                text: `📝 *TRANSCRIPCIÓN:*\n\n${text}`
            }, { quoted: message });

        } catch (error) {
            console.error('Error en transcripción:', error);

            // Manejo específico de errores
            let errorMsg = '❌ Error al transcribir.';
            if (error.message.includes('API key')) errorMsg = '❌ API Key inválida o expirada.';
            if (error.message.includes('MIME type')) errorMsg = '❌ Formato de audio no soportado por la IA.';

            await sock.sendMessage(from, { text: errorMsg }, { quoted: message });
        }
    }
};
