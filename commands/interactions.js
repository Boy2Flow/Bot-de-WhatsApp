// Comandos de interacción con imágenes
import { getInteractionImage, getInteractionsImage, sendMessageWithImage } from '../utils/imageManager.js';

// Función auxiliar para enviar interacción con imagen
const sendInteraction = async (sock, from, text, mentions, interactionType) => {
    try {
        console.log(`\n🎭 === INICIANDO INTERACCIÓN: ${interactionType} ===`);
        console.log(`📍 Chat ID: ${from}`);
        console.log(`👥 Menciones:`, mentions);
        
        // Obtener imagen para este tipo de interacción
        const image = getInteractionImage(interactionType);
        
        console.log(`🖼️ Imagen obtenida: ${image || 'ninguna'}`);
        
        // Enviar con imagen
        console.log(`📤 Enviando mensaje...`);
        const result = await sendMessageWithImage(sock, from, text, image, mentions);
        
        console.log(`✅ Mensaje enviado exitosamente`);
        console.log(`🎭 === FIN INTERACCIÓN ===\n`);
        
        return result;
    } catch (error) {
        console.error(`❌ Error al enviar interacción ${interactionType}:`, error);
        console.error('Stack trace:', error.stack);
        
        // Intentar enviar solo texto como último recurso
        try {
            console.log('🔄 Intentando enviar solo texto...');
            await sock.sendMessage(from, {
                text: text,
                mentions: mentions
            });
            console.log('✅ Texto enviado como fallback');
        } catch (fallbackError) {
            console.error('❌ Error incluso enviando texto:', fallbackError);
        }
    }
};


// Comando: Fuck
export const fuckCommand = {
    name: 'fuck',
    aliases: ['follar', 'f'],
    description: 'Interacción NSFW - Fuck',
    groupOnly: false,
    adminOnly: false,
    execute: async (sock, message) => {
        try {
            const mentioned = message.message?.extendedTextMessage?.contextInfo?.mentionedJid;
            const sender = message.key.participant || message.key.remoteJid;
            const from = message.key.remoteJid;

            if (!mentioned || mentioned.length === 0) {
                await sock.sendMessage(from, {
                    text: '❌ Debes mencionar a alguien.\n\nEjemplo: $fuck @usuario'
                }, { quoted: message });
                return;
            }

            const target = mentioned[0];
            const text = `🔞 *@${sender.split('@')[0]}* se está follando a *@${target.split('@')[0]}* 🔥`;

            await sendInteraction(sock, from, text, [sender, target], 'fuck');

        } catch (error) {
            console.error('Error en comando fuck:', error);
        }
    }
};

// Comando: Kiss
export const kissCommand = {
    name: 'kiss',
    aliases: ['beso', 'besar'],
    description: 'Interacción - Kiss',
    groupOnly: false,
    adminOnly: false,
    execute: async (sock, message) => {
        try {
            const mentioned = message.message?.extendedTextMessage?.contextInfo?.mentionedJid;
            const sender = message.key.participant || message.key.remoteJid;
            const from = message.key.remoteJid;

            if (!mentioned || mentioned.length === 0) {
                await sock.sendMessage(from, {
                    text: '❌ Debes mencionar a alguien.\n\nEjemplo: $kiss @usuario'
                }, { quoted: message });
                return;
            }

            const target = mentioned[0];
            const text = `💋 *@${sender.split('@')[0]}* le dio un beso a *@${target.split('@')[0]}* 😘`;

            await sendInteraction(sock, from, text, [sender, target], 'kiss');

        } catch (error) {
            console.error('Error en comando kiss:', error);
        }
    }
};

// Comando: Slap
export const slapCommand = {
    name: 'slap',
    aliases: ['cachetada', 'bofetada'],
    description: 'Interacción - Slap',
    groupOnly: false,
    adminOnly: false,
    execute: async (sock, message) => {
        try {
            const mentioned = message.message?.extendedTextMessage?.contextInfo?.mentionedJid;
            const sender = message.key.participant || message.key.remoteJid;
            const from = message.key.remoteJid;

            if (!mentioned || mentioned.length === 0) {
                await sock.sendMessage(from, {
                    text: '❌ Debes mencionar a alguien.\n\nEjemplo: $slap @usuario'
                }, { quoted: message });
                return;
            }

            const target = mentioned[0];
            const text = `👋 *@${sender.split('@')[0]}* le dio una cachetada a *@${target.split('@')[0]}* 💥`;

            await sendInteraction(sock, from, text, [sender, target], 'slap');

        } catch (error) {
            console.error('Error en comando slap:', error);
        }
    }
};

// Comando: Hug
export const hugCommand = {
    name: 'hug',
    aliases: ['abrazo', 'abrazar'],
    description: 'Interacción - Hug',
    groupOnly: false,
    adminOnly: false,
    execute: async (sock, message) => {
        try {
            const mentioned = message.message?.extendedTextMessage?.contextInfo?.mentionedJid;
            const sender = message.key.participant || message.key.remoteJid;
            const from = message.key.remoteJid;

            if (!mentioned || mentioned.length === 0) {
                await sock.sendMessage(from, {
                    text: '❌ Debes mencionar a alguien.\n\nEjemplo: $hug @usuario'
                }, { quoted: message });
                return;
            }

            const target = mentioned[0];
            const text = `🤗 *@${sender.split('@')[0]}* abrazó a *@${target.split('@')[0]}* ❤️`;

            await sendInteraction(sock, from, text, [sender, target], 'hug');

        } catch (error) {
            console.error('Error en comando hug:', error);
        }
    }
};

// Comando: Spank
export const spankCommand = {
    name: 'spank',
    aliases: ['nalgada', 'azotar'],
    description: 'Interacción NSFW - Spank',
    groupOnly: false,
    adminOnly: false,
    execute: async (sock, message) => {
        try {
            const mentioned = message.message?.extendedTextMessage?.contextInfo?.mentionedJid;
            const sender = message.key.participant || message.key.remoteJid;
            const from = message.key.remoteJid;

            if (!mentioned || mentioned.length === 0) {
                await sock.sendMessage(from, {
                    text: '❌ Debes mencionar a alguien.\n\nEjemplo: $spank @usuario'
                }, { quoted: message });
                return;
            }

            const target = mentioned[0];
            const text = `🔞 *@${sender.split('@')[0]}* le dio una nalgada a *@${target.split('@')[0]}* 🍑`;

            await sendInteraction(sock, from, text, [sender, target], 'spank');

        } catch (error) {
            console.error('Error en comando spank:', error);
        }
    }
};

// Comando: Lick
export const lickCommand = {
    name: 'lick',
    aliases: ['lamer', 'lengua'],
    description: 'Interacción NSFW - Lick',
    groupOnly: false,
    adminOnly: false,
    execute: async (sock, message) => {
        try {
            const mentioned = message.message?.extendedTextMessage?.contextInfo?.mentionedJid;
            const sender = message.key.participant || message.key.remoteJid;
            const from = message.key.remoteJid;

            if (!mentioned || mentioned.length === 0) {
                await sock.sendMessage(from, {
                    text: '❌ Debes mencionar a alguien.\n\nEjemplo: $lick @usuario'
                }, { quoted: message });
                return;
            }

            const target = mentioned[0];
            const text = `🔞 *@${sender.split('@')[0]}* está lamiendo a *@${target.split('@')[0]}* 👅`;

            await sendInteraction(sock, from, text, [sender, target], 'lick');

        } catch (error) {
            console.error('Error en comando lick:', error);
        }
    }
};

// Comando: Bite
export const biteCommand = {
    name: 'bite',
    aliases: ['morder', 'mordida'],
    description: 'Interacción - Bite',
    groupOnly: false,
    adminOnly: false,
    execute: async (sock, message) => {
        try {
            const mentioned = message.message?.extendedTextMessage?.contextInfo?.mentionedJid;
            const sender = message.key.participant || message.key.remoteJid;
            const from = message.key.remoteJid;

            if (!mentioned || mentioned.length === 0) {
                await sock.sendMessage(from, {
                    text: '❌ Debes mencionar a alguien.\n\nEjemplo: $bite @usuario'
                }, { quoted: message });
                return;
            }

            const target = mentioned[0];
            const text = `🔞 *@${sender.split('@')[0]}* mordió a *@${target.split('@')[0]}* 😈`;

            await sendInteraction(sock, from, text, [sender, target], 'bite');

        } catch (error) {
            console.error('Error en comando bite:', error);
        }
    }
};

// Comando: Pat
export const patCommand = {
    name: 'pat',
    aliases: ['acariciar', 'palmadita'],
    description: 'Interacción - Pat',
    groupOnly: false,
    adminOnly: false,
    execute: async (sock, message) => {
        try {
            const mentioned = message.message?.extendedTextMessage?.contextInfo?.mentionedJid;
            const sender = message.key.participant || message.key.remoteJid;
            const from = message.key.remoteJid;

            if (!mentioned || mentioned.length === 0) {
                await sock.sendMessage(from, {
                    text: '❌ Debes mencionar a alguien.\n\nEjemplo: $pat @usuario'
                }, { quoted: message });
                return;
            }

            const target = mentioned[0];
            const text = `✨ *@${sender.split('@')[0]}* acarició la cabeza de *@${target.split('@')[0]}* 🥰`;

            await sendInteraction(sock, from, text, [sender, target], 'pat');

        } catch (error) {
            console.error('Error en comando pat:', error);
        }
    }
};

// Menú de comandos de interacción
export const interactionMenuCommand = {
    name: 'interacciones',
    aliases: ['interact', 'acciones'],
    description: 'Muestra todos los comandos de interacción',
    groupOnly: false,
    adminOnly: false,
    execute: async (sock, message) => {
        const menuText = `
╔═══════════════════════════════╗
║   💫 COMANDOS DE INTERACCIÓN  ║
╚═══════════════════════════════╝

┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃  ❤️ INTERACCIONES NORMALES   ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

🔹 *.kiss @usuario* - Besar
🔹 *.hug @usuario* - Abrazar
🔹 *.pat @usuario* - Acariciar
🔹 *.slap @usuario* - Cachetada

┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃  🔞 INTERACCIONES NSFW       ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

🔹 *.fuck @usuario* - Follar
🔹 *.spank @usuario* - Nalgada
🔹 *.lick @usuario* - Lamer
🔹 *.bite @usuario* - Morder

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

💡 *Cómo usar:*
Menciona al usuario con quien quieres
interactuar usando @

Ejemplo: .kiss @usuario

⚠️ Usa estos comandos responsablemente

╔═══════════════════════════════╗
║  Total: 8 interacciones       ║
╚═══════════════════════════════╝
        `.trim();

        // Obtener imagen del menú de interacciones
        const interactionsImage = getInteractionsImage();
        
        // Enviar menú con imagen
        await sendMessageWithImage(sock, message.key.remoteJid, menuText, interactionsImage);
    }
};

export const interactionCommands = [
    interactionMenuCommand,
    fuckCommand,
    kissCommand,
    slapCommand,
    hugCommand,
    spankCommand,
    lickCommand,
    biteCommand,
    patCommand
];
