import { getAudioUrl } from 'google-tts-api';

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

            // Nota: La API gratuita de Google TTS tiene voces limitadas.
            // Intentamos usar 'es' que es estándar.
            // Para obtener una voz "masculina" específica gratis y estable es difícil sin API keys.
            // Sin embargo, configuraremos lo mejor posible.
            const url = getAudioUrl(text, {
                lang: 'es',
                slow: false,
                host: 'https://translate.google.com',
            });

            await sock.sendMessage(from, {
                audio: { url: url },
                mimetype: 'audio/mp4',
                ptt: true // Enviar como nota de voz (oculta el reproductor de audio)
            }, { quoted: message });

        } catch (error) {
            console.error('Error enviando voz:', error);
            const from = message.key.remoteJid;
            sock.sendMessage(from, {
                text: '❌ Hubo un error al generar el audio.'
            }, { quoted: message });
        }
    }
};
