import fs from 'fs';
import path from 'path';
import { config as privilegedConfig } from '../config/privilegedUsers.js';

// Archivo para almacenar las advertencias
const WARNS_FILE = path.join(process.cwd(), 'warns.json');

// Inicializar archivo si no existe
if (!fs.existsSync(WARNS_FILE)) {
    fs.writeFileSync(WARNS_FILE, JSON.stringify({}));
}

// Cargar advertencias
function loadWarns() {
    try {
        const data = fs.readFileSync(WARNS_FILE, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error al cargar advertencias:', error);
        return {};
    }
}

// Guardar advertencias
function saveWarns(warns) {
    try {
        fs.writeFileSync(WARNS_FILE, JSON.stringify(warns, null, 2));
    } catch (error) {
        console.error('Error al guardar advertencias:', error);
    }
}

// Comando .warn - Advertir a un usuario
export const warnCommand = {
    name: 'warn',
    aliases: ['advertir', 'aviso'],
    description: 'Advierte a un usuario (3 advertencias = expulsión automática)',
    groupOnly: true,
    adminOnly: true,
    execute: async (sock, message, args) => {
        try {
            const from = message.key.remoteJid;
            
            // Verificar si se mencionó a alguien
            const mentionedJid = message.message?.extendedTextMessage?.contextInfo?.mentionedJid;
            
            if (!mentionedJid || mentionedJid.length === 0) {
                await sock.sendMessage(from, {
                    text: '❌ Debes mencionar al usuario que deseas advertir.\n\n📝 Uso: .warn @usuario [razón]'
                }, { quoted: message });
                return;
            }

            const userToWarn = mentionedJid[0];
            
            // VERIFICAR INMUNIDAD - No se puede advertir a usuarios privilegiados
            if (privilegedConfig.isSuperAdmin(userToWarn)) {
                await sock.sendMessage(from, {
                    text: `👑 No puedes advertir a @${userToWarn.split('@')[0]}\n\n` +
                          `Este usuario tiene inmunidad total.`,
                    mentions: [userToWarn]
                }, { quoted: message });
                return;
            }

            const reason = args.join(' ') || 'Sin razón especificada';

            
            // Cargar advertencias
            const warns = loadWarns();
            
            // Inicializar estructura para el grupo si no existe
            if (!warns[from]) {
                warns[from] = {};
            }
            
            // Inicializar array de advertencias para el usuario si no existe
            if (!warns[from][userToWarn]) {
                warns[from][userToWarn] = [];
            }
            
            // Añadir nueva advertencia
            const warnData = {
                reason: reason,
                date: new Date().toISOString(),
                timestamp: Date.now()
            };
            
            warns[from][userToWarn].push(warnData);
            const warnCount = warns[from][userToWarn].length;
            
            // Guardar advertencias
            saveWarns(warns);
            
            // Verificar si el usuario debe ser expulsado (3 advertencias)
            if (warnCount >= 3) {
                try {
                    await sock.groupParticipantsUpdate(from, [userToWarn], 'remove');
                    
                    await sock.sendMessage(from, {
                        text: `⚠️ *USUARIO EXPULSADO*\n\n` +
                              `Usuario: @${userToWarn.split('@')[0]}\n` +
                              `Razón: Alcanzó 3 advertencias\n` +
                              `Última advertencia: ${reason}\n\n` +
                              `🔴 El usuario ha sido expulsado automáticamente del grupo.`,
                        mentions: [userToWarn]
                    }, { quoted: message });
                    
                    // Limpiar advertencias del usuario expulsado
                    delete warns[from][userToWarn];
                    saveWarns(warns);
                    
                } catch (kickError) {
                    console.error('Error al expulsar usuario:', kickError);
                    await sock.sendMessage(from, {
                        text: `⚠️ El usuario @${userToWarn.split('@')[0]} alcanzó 3 advertencias pero no pudo ser expulsado.\n\n` +
                              `Verifica que el bot sea administrador del grupo.`,
                        mentions: [userToWarn]
                    }, { quoted: message });
                }
            } else {
                // Enviar mensaje de advertencia
                const warnsLeft = 3 - warnCount;
                await sock.sendMessage(from, {
                    text: `⚠️ *ADVERTENCIA ${warnCount}/3*\n\n` +
                          `Usuario: @${userToWarn.split('@')[0]}\n` +
                          `Razón: ${reason}\n\n` +
                          `🔔 Advertencias restantes: ${warnsLeft}\n` +
                          `⚠️ Al llegar a 3 advertencias serás expulsado automáticamente.`,
                    mentions: [userToWarn]
                }, { quoted: message });
            }

        } catch (error) {
            console.error('Error en comando warn:', error);
            await sock.sendMessage(message.key.remoteJid, {
                text: '❌ Error al advertir al usuario.'
            }, { quoted: message });
        }
    }
};

// Comando .warns - Ver advertencias de un usuario
export const warnsCommand = {
    name: 'warns',
    aliases: ['advertencias', 'veradvertencias'],
    description: 'Muestra las advertencias de un usuario',
    groupOnly: true,
    adminOnly: true,
    execute: async (sock, message, args) => {
        try {
            const from = message.key.remoteJid;
            
            // Verificar si se mencionó a alguien
            const mentionedJid = message.message?.extendedTextMessage?.contextInfo?.mentionedJid;
            
            if (!mentionedJid || mentionedJid.length === 0) {
                await sock.sendMessage(from, {
                    text: '❌ Debes mencionar al usuario para ver sus advertencias.\n\n📝 Uso: .warns @usuario'
                }, { quoted: message });
                return;
            }

            const userId = mentionedJid[0];
            const warns = loadWarns();
            
            // Verificar si el usuario tiene advertencias
            if (!warns[from] || !warns[from][userId] || warns[from][userId].length === 0) {
                await sock.sendMessage(from, {
                    text: `✅ El usuario @${userId.split('@')[0]} no tiene advertencias.`,
                    mentions: [userId]
                }, { quoted: message });
                return;
            }
            
            // Crear lista de advertencias
            const userWarns = warns[from][userId];
            let text = `⚠️ *ADVERTENCIAS DE @${userId.split('@')[0]}*\n\n`;
            text += '━━━━━━━━━━━━━━━━━━━\n';
            
            userWarns.forEach((warn, index) => {
                const date = new Date(warn.date).toLocaleString('es-ES');
                text += `\n${index + 1}. 📅 ${date}\n`;
                text += `   📝 ${warn.reason}\n`;
            });
            
            text += '\n━━━━━━━━━━━━━━━━━━━\n';
            text += `\n⚠️ Total: ${userWarns.length}/3 advertencias`;
            text += `\n🔔 Advertencias restantes: ${3 - userWarns.length}`;
            
            await sock.sendMessage(from, {
                text: text,
                mentions: [userId]
            }, { quoted: message });

        } catch (error) {
            console.error('Error en comando warns:', error);
            await sock.sendMessage(message.key.remoteJid, {
                text: '❌ Error al obtener las advertencias.'
            }, { quoted: message });
        }
    }
};

// Comando .unwarn - Quitar una advertencia
export const unwarnCommand = {
    name: 'unwarn',
    aliases: ['quitaradvertencia', 'removewarning'],
    description: 'Quita la última advertencia de un usuario',
    groupOnly: true,
    adminOnly: true,
    execute: async (sock, message, args) => {
        try {
            const from = message.key.remoteJid;
            
            // Verificar si se mencionó a alguien
            const mentionedJid = message.message?.extendedTextMessage?.contextInfo?.mentionedJid;
            
            if (!mentionedJid || mentionedJid.length === 0) {
                await sock.sendMessage(from, {
                    text: '❌ Debes mencionar al usuario para quitar su advertencia.\n\n📝 Uso: .unwarn @usuario'
                }, { quoted: message });
                return;
            }

            const userId = mentionedJid[0];
            const warns = loadWarns();
            
            // Verificar si el usuario tiene advertencias
            if (!warns[from] || !warns[from][userId] || warns[from][userId].length === 0) {
                await sock.sendMessage(from, {
                    text: `⚠️ El usuario @${userId.split('@')[0]} no tiene advertencias para quitar.`,
                    mentions: [userId]
                }, { quoted: message });
                return;
            }
            
            // Quitar la última advertencia
            const removedWarn = warns[from][userId].pop();
            
            // Si no quedan advertencias, eliminar el usuario del objeto
            if (warns[from][userId].length === 0) {
                delete warns[from][userId];
            }
            
            // Guardar cambios
            saveWarns(warns);
            
            const remainingWarns = warns[from][userId]?.length || 0;
            
            await sock.sendMessage(from, {
                text: `✅ *ADVERTENCIA ELIMINADA*\n\n` +
                      `Usuario: @${userId.split('@')[0]}\n` +
                      `Advertencia eliminada: ${removedWarn.reason}\n\n` +
                      `⚠️ Advertencias restantes: ${remainingWarns}/3`,
                mentions: [userId]
            }, { quoted: message });

        } catch (error) {
            console.error('Error en comando unwarn:', error);
            await sock.sendMessage(message.key.remoteJid, {
                text: '❌ Error al quitar la advertencia.'
            }, { quoted: message });
        }
    }
};

// Comando .warnlist - Ver todos los usuarios con advertencias
export const warnListCommand = {
    name: 'warnlist',
    aliases: ['listaadvertencias', 'warninglist'],
    description: 'Muestra todos los usuarios con advertencias en el grupo',
    groupOnly: true,
    adminOnly: true,
    execute: async (sock, message, args) => {
        try {
            const from = message.key.remoteJid;
            const warns = loadWarns();
            
            // Verificar si hay advertencias en este grupo
            if (!warns[from] || Object.keys(warns[from]).length === 0) {
                await sock.sendMessage(from, {
                    text: '✅ No hay usuarios con advertencias en este grupo.'
                }, { quoted: message });
                return;
            }
            
            // Crear lista de usuarios con advertencias
            let text = '⚠️ *USUARIOS CON ADVERTENCIAS*\n\n';
            text += '━━━━━━━━━━━━━━━━━━━\n';
            
            const usersWithWarns = Object.keys(warns[from]);
            const mentions = [];
            
            usersWithWarns.forEach((userId, index) => {
                const warnCount = warns[from][userId].length;
                const lastWarn = warns[from][userId][warnCount - 1];
                text += `\n${index + 1}. @${userId.split('@')[0]}\n`;
                text += `   ⚠️ Advertencias: ${warnCount}/3\n`;
                text += `   📝 Última: ${lastWarn.reason}\n`;
                mentions.push(userId);
            });
            
            text += '\n━━━━━━━━━━━━━━━━━━━\n';
            text += `\n👥 Total: ${usersWithWarns.length} usuario(s) con advertencias`;
            
            await sock.sendMessage(from, {
                text: text,
                mentions: mentions
            }, { quoted: message });

        } catch (error) {
            console.error('Error en comando warnlist:', error);
            await sock.sendMessage(message.key.remoteJid, {
                text: '❌ Error al obtener la lista de advertencias.'
            }, { quoted: message });
        }
    }
};

export const warnCommands = [
    warnCommand,
    warnsCommand,
    unwarnCommand,
    warnListCommand
];
