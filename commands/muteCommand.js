import fs from 'fs';
import path from 'path';
import { config as privilegedConfig } from '../config/privilegedUsers.js';

// Archivo para almacenar usuarios muteados
const MUTED_USERS_FILE = path.join(process.cwd(), 'mutedUsers.json');

// Inicializar archivo si no existe
if (!fs.existsSync(MUTED_USERS_FILE)) {
    fs.writeFileSync(MUTED_USERS_FILE, JSON.stringify({}));
}

// Cargar usuarios muteados
export function loadMutedUsers() {
    try {
        const data = fs.readFileSync(MUTED_USERS_FILE, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error al cargar usuarios muteados:', error);
        return {};
    }
}

// Guardar usuarios muteados
function saveMutedUsers(mutedUsers) {
    try {
        fs.writeFileSync(MUTED_USERS_FILE, JSON.stringify(mutedUsers, null, 2));
    } catch (error) {
        console.error('Error al guardar usuarios muteados:', error);
    }
}

// Verificar si un usuario está muteado en un grupo específico
export function isUserMuted(groupId, userId) {
    // Los usuarios privilegiados NUNCA están muteados
    if (privilegedConfig.isSuperAdmin(userId)) {
        return false;
    }
    
    const mutedUsers = loadMutedUsers();
    return mutedUsers[groupId]?.includes(userId) || false;
}

// Comando .mute
export const muteCommand = {
    name: 'mute',
    aliases: ['silenciar', 'mutear'],
    description: 'Silencia a un usuario (menciona al usuario para mutearlo)',
    groupOnly: true,
    adminOnly: true,
    execute: async (sock, message, args) => {
        try {
            const from = message.key.remoteJid;
            
            // Verificar si se mencionó a alguien
            const mentionedJid = message.message?.extendedTextMessage?.contextInfo?.mentionedJid;
            
            if (!mentionedJid || mentionedJid.length === 0) {
                await sock.sendMessage(from, {
                    text: '❌ Debes mencionar al usuario que deseas mutear.\n\n📝 Uso: .mute @usuario'
                }, { quoted: message });
                return;
            }

            const userToMute = mentionedJid[0];
            
            // VERIFICAR INMUNIDAD - No se puede mutear a usuarios privilegiados
            if (privilegedConfig.isSuperAdmin(userToMute)) {
                await sock.sendMessage(from, {
                    text: `👑 No puedes mutear a @${userToMute.split('@')[0]}\n\n` +
                          `Este usuario tiene inmunidad total.`,
                    mentions: [userToMute]
                }, { quoted: message });
                return;
            }
            
            const mutedUsers = loadMutedUsers();

            // Inicializar array si no existe
            if (!mutedUsers[from]) {
                mutedUsers[from] = [];
            }

            // Verificar si ya está muteado
            if (mutedUsers[from].includes(userToMute)) {
                await sock.sendMessage(from, {
                    text: `⚠️ El usuario @${userToMute.split('@')[0]} ya está muteado.`,
                    mentions: [userToMute]
                }, { quoted: message });
                return;
            }

            // Añadir usuario a la lista de muteados
            mutedUsers[from].push(userToMute);
            saveMutedUsers(mutedUsers);

            // Confirmar el muteo
            await sock.sendMessage(from, {
                text: `🔇 Usuario @${userToMute.split('@')[0]} ha sido muteado.\n\n` +
                      `Todos sus mensajes serán eliminados automáticamente.\n\n` +
                      `Para desmutearlo usa: .unmute @usuario`,
                mentions: [userToMute]
            }, { quoted: message });

        } catch (error) {
            console.error('Error en comando mute:', error);
            await sock.sendMessage(message.key.remoteJid, {
                text: '❌ Error al mutear al usuario.'
            }, { quoted: message });
        }
    }
};


// Comando .unmute
export const unmuteCommand = {
    name: 'unmute',
    aliases: ['desmutear', 'unmutear'],
    description: 'Desmutea a un usuario (menciona al usuario para desmutearlo)',
    groupOnly: true,
    adminOnly: true,
    execute: async (sock, message, args) => {
        try {
            const from = message.key.remoteJid;
            
            // Verificar si se mencionó a alguien
            const mentionedJid = message.message?.extendedTextMessage?.contextInfo?.mentionedJid;
            
            if (!mentionedJid || mentionedJid.length === 0) {
                await sock.sendMessage(from, {
                    text: '❌ Debes mencionar al usuario que deseas desmutear.\n\n📝 Uso: .unmute @usuario'
                }, { quoted: message });
                return;
            }

            const userToUnmute = mentionedJid[0];
            const mutedUsers = loadMutedUsers();

            // Verificar si el grupo tiene usuarios muteados
            if (!mutedUsers[from] || mutedUsers[from].length === 0) {
                await sock.sendMessage(from, {
                    text: '⚠️ No hay usuarios muteados en este grupo.'
                }, { quoted: message });
                return;
            }

            // Verificar si el usuario está muteado
            if (!mutedUsers[from].includes(userToUnmute)) {
                await sock.sendMessage(from, {
                    text: `⚠️ El usuario @${userToUnmute.split('@')[0]} no está muteado.`,
                    mentions: [userToUnmute]
                }, { quoted: message });
                return;
            }

            // Remover usuario de la lista de muteados
            mutedUsers[from] = mutedUsers[from].filter(user => user !== userToUnmute);
            saveMutedUsers(mutedUsers);

            // Confirmar el desmuteo
            await sock.sendMessage(from, {
                text: `🔊 Usuario @${userToUnmute.split('@')[0]} ha sido desmuteado.\n\n` +
                      `Ahora puede enviar mensajes normalmente.`,
                mentions: [userToUnmute]
            }, { quoted: message });

        } catch (error) {
            console.error('Error en comando unmute:', error);
            await sock.sendMessage(message.key.remoteJid, {
                text: '❌ Error al desmutear al usuario.'
            }, { quoted: message });
        }
    }
};

// Comando .mutelist
export const muteListCommand = {
    name: 'mutelist',
    aliases: ['listamuteados', 'mutedlist'],
    description: 'Muestra la lista de usuarios muteados en el grupo',
    groupOnly: true,
    adminOnly: true,
    execute: async (sock, message, args) => {
        try {
            const from = message.key.remoteJid;
            const mutedUsers = loadMutedUsers();

            // Verificar si hay usuarios muteados en este grupo
            if (!mutedUsers[from] || mutedUsers[from].length === 0) {
                await sock.sendMessage(from, {
                    text: '✅ No hay usuarios muteados en este grupo.'
                }, { quoted: message });
                return;
            }

            // Crear lista de usuarios muteados
            let text = '🔇 *USUARIOS MUTEADOS*\n\n';
            text += '━━━━━━━━━━━━━━━━━━━\n';
            
            mutedUsers[from].forEach((userId, index) => {
                text += `${index + 1}. @${userId.split('@')[0]}\n`;
            });
            
            text += '━━━━━━━━━━━━━━━━━━━\n';
            text += `\n👥 Total: ${mutedUsers[from].length} usuario(s) muteado(s)`;

            await sock.sendMessage(from, {
                text: text,
                mentions: mutedUsers[from]
            }, { quoted: message });

        } catch (error) {
            console.error('Error en comando mutelist:', error);
            await sock.sendMessage(message.key.remoteJid, {
                text: '❌ Error al obtener la lista de usuarios muteados.'
            }, { quoted: message });
        }
    }
};

export const muteCommands = [
    muteCommand,
    unmuteCommand,
    muteListCommand
];
