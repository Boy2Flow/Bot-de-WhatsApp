import fs from 'fs';
import path from 'path';

// Archivo para almacenar los usuarios marcados como pajeros
const PAJEROS_FILE = path.join(process.cwd(), 'pajeros.json');

// Inicializar archivo si no existe
if (!fs.existsSync(PAJEROS_FILE)) {
    fs.writeFileSync(PAJEROS_FILE, JSON.stringify({}));
}

// Cargar pajeros
function loadPajeros() {
    try {
        const data = fs.readFileSync(PAJEROS_FILE, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error al cargar pajeros:', error);
        return {};
    }
}

// Guardar pajeros
function savePajeros(pajeros) {
    try {
        fs.writeFileSync(PAJEROS_FILE, JSON.stringify(pajeros, null, 2));
    } catch (error) {
        console.error('Error al guardar pajeros:', error);
    }
}

// Verificar si un usuario es pajero
export function isPajero(groupId, userId) {
    const pajeros = loadPajeros();
    return pajeros[groupId]?.includes(userId) || false;
}

// Comando .pajero - Marcar usuario como pajero
export const pajeroCommand = {
    name: 'pajero',
    aliases: ['setpajero', 'marcarpajero'],
    description: 'Marca a un usuario como pajero (el bot le responderá cada vez que escriba)',
    groupOnly: true,
    adminOnly: true,
    execute: async (sock, message, args) => {
        try {
            const from = message.key.remoteJid;

            // Borrar el mensaje del comando para que sea silencioso
            try {
                await sock.sendMessage(from, { delete: message.key });
            } catch (error) {
                // Ignorar error si no se puede borrar (no es admin o tiempo expirado)
            }
            
            // Verificar si se mencionó a alguien
            const mentionedJid = message.message?.extendedTextMessage?.contextInfo?.mentionedJid;
            
            if (!mentionedJid || mentionedJid.length === 0) {
                await sock.sendMessage(from, {
                    text: '❌ Debes mencionar al usuario que deseas marcar.\n\n📝 Uso: .pajero @usuario'
                }, { quoted: message });
                return;
            }
            
            const userToMark = mentionedJid[0];
            const pajeros = loadPajeros();
            
            // Inicializar array para el grupo si no existe
            if (!pajeros[from]) {
                pajeros[from] = [];
            }
            
            // Verificar si ya está marcado
            if (pajeros[from].includes(userToMark)) {
                await sock.sendMessage(from, {
                    text: `⚠️ El usuario @${userToMark.split('@')[0]} ya está marcado como pajero.`,
                    mentions: [userToMark]
                }, { quoted: message });
                return;
            }
            
            // Añadir usuario a la lista
            pajeros[from].push(userToMark);
            savePajeros(pajeros);
            
            const sentMsg = await sock.sendMessage(from, {
                text: `✅ Usuario @${userToMark.split('@')[0]} marcado como pajero.\n\n` +
                      `🤖 El bot le responderá "pajero" cada vez que escriba.\n\n` +
                      `Para desactivar usa: .unpajero @usuario`,
                mentions: [userToMark]
            }, { quoted: message });

            // Borrar el mensaje de confirmación después de 3 segundos
            setTimeout(async () => {
                try {
                    await sock.sendMessage(from, { delete: sentMsg.key });
                } catch (error) {
                    // Ignorar error
                }
            }, 3000);

        } catch (error) {
            console.error('Error en comando pajero:', error);
            await sock.sendMessage(message.key.remoteJid, {
                text: '❌ Error al marcar usuario como pajero.'
            }, { quoted: message });
        }
    }
};

// Comando .unpajero - Desmarcar usuario como pajero
export const unpajeroCommand = {
    name: 'unpajero',
    aliases: ['quitarpajero', 'removepajero'],
    description: 'Desmarca a un usuario como pajero',
    groupOnly: true,
    adminOnly: true,
    execute: async (sock, message, args) => {
        try {
            const from = message.key.remoteJid;
            
            const mentionedJid = message.message?.extendedTextMessage?.contextInfo?.mentionedJid;
            
            if (!mentionedJid || mentionedJid.length === 0) {
                await sock.sendMessage(from, {
                    text: '❌ Debes mencionar al usuario que deseas desmarcar.\n\n📝 Uso: .unpajero @usuario'
                }, { quoted: message });
                return;
            }
            
            const userToUnmark = mentionedJid[0];
            const pajeros = loadPajeros();
            
            // Verificar si la lista existe
            if (!pajeros[from] || pajeros[from].length === 0) {
                await sock.sendMessage(from, {
                    text: '⚠️ No hay usuarios marcados como pajeros en este grupo.'
                }, { quoted: message });
                return;
            }
            
            // Verificar si el usuario está marcado
            if (!pajeros[from].includes(userToUnmark)) {
                await sock.sendMessage(from, {
                    text: `⚠️ El usuario @${userToUnmark.split('@')[0]} no está marcado como pajero.`,
                    mentions: [userToUnmark]
                }, { quoted: message });
                return;
            }
            
            // Quitar usuario de la lista
            pajeros[from] = pajeros[from].filter(user => user !== userToUnmark);
            savePajeros(pajeros);
            
            await sock.sendMessage(from, {
                text: `✅ Usuario @${userToUnmark.split('@')[0]} desmarcado como pajero.\n\n` +
                      `🤖 El bot ya no le responderá automáticamente.`,
                mentions: [userToUnmark]
            }, { quoted: message });

        } catch (error) {
            console.error('Error en comando unpajero:', error);
            await sock.sendMessage(message.key.remoteJid, {
                text: '❌ Error al desmarcar usuario como pajero.'
            }, { quoted: message });
        }
    }
};

// Comando .pajerolist - Ver lista de pajeros
export const pajeroListCommand = {
    name: 'pajerolist',
    aliases: ['listapajeros', 'verpajeros'],
    description: 'Muestra la lista de usuarios marcados como pajeros',
    groupOnly: true,
    adminOnly: false,
    execute: async (sock, message, args) => {
        try {
            const from = message.key.remoteJid;
            const pajeros = loadPajeros();
            
            // Verificar si hay pajeros en este grupo
            if (!pajeros[from] || pajeros[from].length === 0) {
                await sock.sendMessage(from, {
                    text: '✅ No hay usuarios marcados como pajeros en este grupo.'
                }, { quoted: message });
                return;
            }
            
            // Crear lista
            let text = '🔞 *LISTA DE PAJEROS* 🔞\n\n';
            text += '━━━━━━━━━━━━━━━━━━━\n';
            
            pajeros[from].forEach((userId, index) => {
                text += `${index + 1}. @${userId.split('@')[0]}\n`;
            });
            
            text += '━━━━━━━━━━━━━━━━━━━\n';
            text += `\n👥 Total: ${pajeros[from].length} pajero(s)`;
            
            await sock.sendMessage(from, {
                text: text,
                mentions: pajeros[from]
            }, { quoted: message });

        } catch (error) {
            console.error('Error en comando pajerolist:', error);
            await sock.sendMessage(message.key.remoteJid, {
                text: '❌ Error al obtener la lista de pajeros.'
            }, { quoted: message });
        }
    }
};

export const pajeroCommands = [
    pajeroCommand,
    unpajeroCommand,
    pajeroListCommand
];
