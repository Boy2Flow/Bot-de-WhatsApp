import { getAudioUrl } from 'google-tts-api';
import axios from 'axios';

export const vozCommand = {
    name: 'voz',
    aliases: ['voice', 'decir', 'say', 'hablar'],
    description: 'Envía un mensaje de voz con el texto especificado',
    execute: async (sock, message, args) => {
        try {
            const from = message.key.remoteJid;

            if (args.length === 0) {
                return sock.sendMessage(from, {
                    text: '⚠️ Debes escribir el mensaje que quieres que diga en audio.\nEjemplo: *.voz Hola guapo*'
                }, { quoted: message });
            }

            const text = args.join(' ');

            if (text.length > 200) {
                return sock.sendMessage(from, {
                    text: '❌ El mensaje es muy largo (máx 200 caracteres).'
                }, { quoted: message });
            }

            // Generar URL
            const url = getAudioUrl(text, {
                lang: 'es',
                slow: false,
                host: 'https://translate.google.com',
            });

            // Descargar buffer para asegurar integridad
            const response = await axios.get(url, { responseType: 'arraybuffer' });
            const buffer = Buffer.from(response.data);

            // Enviar como audio normal (ptt: false) para garantizar compatibilidad sin ffmpeg
            // ptt: true requiere codec OPUS que no podemos garantizar sin conversión
            await sock.sendMessage(from, {
                audio: buffer,
                mimetype: 'audio/mpeg',
                ptt: false
            }, { quoted: message });

        } catch (error) {
            console.error('Error enviando voz:', error);
            const from = message.key.remoteJid;
            sock.sendMessage(from, {
                text: '❌ Hubo un error al descargar/generar el audio.'
            }, { quoted: message });
        }
    }
};
