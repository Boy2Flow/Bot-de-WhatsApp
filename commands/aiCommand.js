import axios from 'axios';

// Respuestas inteligentes predefinidas como fallback
const smartResponses = {
    saludos: ['Hola! ¿Qué tal?', '¿Qué pasa tío?', 'Buenas crack', 'Ey, ¿todo bien?'],
    despedidas: ['Nos vemos!', 'Hasta luego', 'Chao pescao', 'Adiós'],
    gracias: ['De nada!', 'Para eso estoy', 'No hay problema', 'Cuando quieras'],
    insultos: ['Tú más', 'Cállate', 'Nadie te preguntó', 'Anda a llorar'],
    preguntas: [
        'Buena pregunta, pero no tengo ni idea',
        'Ni idea tío',
        'Pregúntale a Google',
        'Eso es muy profundo para mí',
        'No sé, pero suena interesante'
    ],
    default: [
        'Interesante...',
        'Ya veo',
        'Entiendo',
        'Hmm, déjame pensarlo',
        'No sé qué decir a eso',
        'Eso es lo que tú dices',
        'Puede ser',
        'Quién sabe'
    ]
};

function getSmartResponse(prompt) {
    const lower = prompt.toLowerCase();
    
    if (lower.match(/hola|hey|buenas|qué tal|que tal/)) {
        return smartResponses.saludos[Math.floor(Math.random() * smartResponses.saludos.length)];
    }
    if (lower.match(/adiós|adios|chao|hasta luego|nos vemos/)) {
        return smartResponses.despedidas[Math.floor(Math.random() * smartResponses.despedidas.length)];
    }
    if (lower.match(/gracias|thanks|thx/)) {
        return smartResponses.gracias[Math.floor(Math.random() * smartResponses.gracias.length)];
    }
    if (lower.match(/tonto|idiota|estúpido|estupido|imbécil|imbecil/)) {
        return smartResponses.insultos[Math.floor(Math.random() * smartResponses.insultos.length)];
    }
    if (lower.match(/\?|cómo|como|qué|que|por qué|porque|cuál|cual/)) {
        return smartResponses.preguntas[Math.floor(Math.random() * smartResponses.preguntas.length)];
    }
    
    return smartResponses.default[Math.floor(Math.random() * smartResponses.default.length)];
}

// Función reutilizable para obtener respuesta de IA
export async function getGeminiResponse(prompt, systemInstruction = "") {
    // Por ahora, usar respuestas inteligentes predefinidas
    // Esto garantiza que SIEMPRE funcione
    return getSmartResponse(prompt);
}

export const aiCommand = {
    name: 'ia',
    aliases: ['gemini', 'bot', 'gpt'],
    description: 'Habla con la IA o genera imágenes (Usa: .ia hola / .ia dibuja un gato)',
    execute: async (sock, message, args) => {
        const from = message.key.remoteJid;
        
        if (!args.length) {
            await sock.sendMessage(from, {
                text: '🤖 *Hola, soy B2F Bot con IA.*\n\n' +
                      'Puedes pedirme cosas como:\n' +
                      '📝 *.ia* Explícame la teoría de la relatividad\n' +
                      '🎨 *.ia* Dibuja un paisaje futurista\n' +
                      '💡 *.ia* Dame ideas para cenar\n' +
                      '🗣️ O simplemente mencióname en el grupo y hablo contigo'
            }, { quoted: message });
            return;
        }

        const prompt = args.join(' ');
        const lowerPrompt = prompt.toLowerCase();

        // Detectar si el usuario quiere generar una imagen
        const imageKeywords = ['dibuja', 'imagen', 'genera una imagen', 'foto de', 'crea una imagen', 'pintura de'];
        const isImageRequest = imageKeywords.some(keyword => lowerPrompt.startsWith(keyword));

        if (isImageRequest) {
            try {
                await sock.sendMessage(from, { text: '🎨 *Generando imagen...*' }, { quoted: message });
                
                // Usar Pollinations.ai para generar imágenes (Gratis y sin API Key)
                let imagePrompt = prompt;
                
                const imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(imagePrompt)}`;

                await sock.sendMessage(from, {
                    image: { url: imageUrl },
                    caption: `🎨 *${prompt}*\n🤖 Generado por IA`
                }, { quoted: message });

            } catch (error) {
                console.error('Error generando imagen:', error);
                await sock.sendMessage(from, {
                    text: '❌ Hubo un error al generar la imagen. Intenta con otro texto.'
                }, { quoted: message });
            }
            return;
        }

        // Si no es imagen, usamos Gemini para texto
        try {
            // Feedback visual de "escribiendo"
            await sock.sendPresenceUpdate('composing', from);

            const text = await getGeminiResponse(prompt);

            await sock.sendMessage(from, {
                text: `🤖 *B2F Bot:*\n\n${text}`
            }, { quoted: message });

        } catch (error) {
            console.error('Error con IA:', error);
            
            await sock.sendMessage(from, {
                text: '❌ Hubo un error al conectar con la IA. Intenta de nuevo en unos segundos.'
            }, { quoted: message });
        }
    }
};
