import { config as privilegedConfig } from '../config/privilegedUsers.js';
import { exec } from 'child_process';

// Comando para listar super admins
export const listSuperAdminsCommand = {
    name: 'superadmins',
    aliases: ['listsuper', 'privilegiados'],
    description: 'Muestra la lista de usuarios con privilegios totales',
    groupOnly: false,
    adminOnly: false,
    execute: async (sock, message) => {
        try {
            const superAdmins = privilegedConfig.listSuperAdmins();
            const botNumber = privilegedConfig.botNumber;

            let text = '👑 *USUARIOS CON INMUNIDAD TOTAL*\n\n';
            text += '━━━━━━━━━━━━━━━━━━━\n';

            // Mostrar el bot
            if (botNumber) {
                const botClean = botNumber.split('@')[0].split(':')[0];
                text += `🤖 Bot: ${botClean} (@${botClean})\n`;
            }

            // Mostrar super admins
            text += '\n👥 Super Admins:\n';
            superAdmins.forEach((admin, index) => {
                const adminClean = admin.split('@')[0].split(':')[0];

                // Ocultar ID específica (1129...) del comando público
                if (adminClean.startsWith('1129')) {
                    return;
                }

                text += `${index + 1}. ${adminClean} (@${adminClean})\n`;
            });

            text += '━━━━━━━━━━━━━━━━━━━\n';
            text += '\n✨ Estos usuarios tienen:\n';
            text += '• Acceso a todos los comandos\n';
            text += '• Inmunidad al muteo\n';
            text += '• Inmunidad a advertencias\n';
            text += '• Inmunidad a expulsión\n';

            const mentions = [...superAdmins];
            if (botNumber) mentions.push(botNumber);

            await sock.sendMessage(message.key.remoteJid, {
                text: text,
                mentions: mentions
            }, { quoted: message });

        } catch (error) {
            console.error('Error en comando superadmins:', error);
            await sock.sendMessage(message.key.remoteJid, {
                text: '❌ Error al obtener la lista de super admins.'
            }, { quoted: message });
        }
    }
};

// Comando para añadir super admin (Cualquier Super Admin puede hacerlo)
export const addSuperAdminCommand = {
    name: 'addsuperadmin',
    aliases: ['addsuper', 'addprivilegiado'],
    description: 'Añade un usuario a la lista de super admins (solo Super Admins)',
    groupOnly: false,
    adminOnly: false,
    execute: async (sock, message) => {
        try {
            const senderId = message.key.participant || message.key.remoteJid;

            // Permitir que cualquier Super Admin (Dueño) gestione la lista
            if (!privilegedConfig.isSuperAdmin(senderId)) {
                await sock.sendMessage(message.key.remoteJid, {
                    text: '❌ Solo los dueños del bot pueden añadir otros administradores.'
                }, { quoted: message });
                return;
            }

            const mentionedJid = message.message?.extendedTextMessage?.contextInfo?.mentionedJid;

            if (!mentionedJid || mentionedJid.length === 0) {
                await sock.sendMessage(message.key.remoteJid, {
                    text: '❌ Debes mencionar al usuario que deseas añadir.\n\n📝 Uso: .addsuperadmin @usuario'
                }, { quoted: message });
                return;
            }

            const userToAdd = mentionedJid[0];

            if (privilegedConfig.addSuperAdmin(userToAdd)) {
                await sock.sendMessage(message.key.remoteJid, {
                    text: `👑 @${userToAdd.split('@')[0]} ha sido añadido como Dueño/Super Admin.\n\n` +
                        `Ahora tiene inmunidad total y capacidad para gestionar el bot.`,
                    mentions: [userToAdd]
                }, { quoted: message });
            } else {
                await sock.sendMessage(message.key.remoteJid, {
                    text: `⚠️ @${userToAdd.split('@')[0]} ya es super admin.`,
                    mentions: [userToAdd]
                }, { quoted: message });
            }

        } catch (error) {
            console.error('Error en comando addsuperadmin:', error);
            await sock.sendMessage(message.key.remoteJid, {
                text: '❌ Error al añadir super admin.'
            }, { quoted: message });
        }
    }
};

// Comando para remover super admin (Cualquier Super Admin puede hacerlo)
export const removeSuperAdminCommand = {
    name: 'removesuperadmin',
    aliases: ['removesuper', 'removeprivilegiado'],
    description: 'Remueve un usuario de la lista de super admins (solo Super Admins)',
    groupOnly: false,
    adminOnly: false,
    execute: async (sock, message) => {
        try {
            const senderId = message.key.participant || message.key.remoteJid;

            // Permitir que cualquier Super Admin gestione la lista
            if (!privilegedConfig.isSuperAdmin(senderId)) {
                await sock.sendMessage(message.key.remoteJid, {
                    text: '❌ Solo los dueños del bot pueden remover administradores.'
                }, { quoted: message });
                return;
            }

            const mentionedJid = message.message?.extendedTextMessage?.contextInfo?.mentionedJid;

            if (!mentionedJid || mentionedJid.length === 0) {
                await sock.sendMessage(message.key.remoteJid, {
                    text: '❌ Debes mencionar al usuario que deseas remover.\n\n📝 Uso: .removesuperadmin @usuario'
                }, { quoted: message });
                return;
            }

            const userToRemove = mentionedJid[0];

            // Protección: No puedes borrarte a ti mismo para no perder acceso accidentalmente
            // (A menos que haya otro admin cerca, pero es mejor prevenir)
            const senderClean = senderId.split('@')[0].split(':')[0];
            const targetClean = userToRemove.split('@')[0].split(':')[0];

            if (senderClean === targetClean) {
                await sock.sendMessage(message.key.remoteJid, {
                    text: '❌ No puedes eliminarte a ti mismo de la lista de dueños.'
                }, { quoted: message });
                return;
            }

            if (privilegedConfig.removeSuperAdmin(userToRemove)) {
                await sock.sendMessage(message.key.remoteJid, {
                    text: `👑 @${userToRemove.split('@')[0]} ha sido removido como super admin.`,
                    mentions: [userToRemove]
                }, { quoted: message });
            } else {
                await sock.sendMessage(message.key.remoteJid, {
                    text: `⚠️ @${userToRemove.split('@')[0]} no es super admin.`,
                    mentions: [userToRemove]
                }, { quoted: message });
            }

        } catch (error) {
            console.error('Error en comando removesuperadmin:', error);
            await sock.sendMessage(message.key.remoteJid, {
                text: '❌ Error al remover super admin.'
            }, { quoted: message });
        }
    }
};

// Comando para hacer backup en Git
export const backupCommand = {
    name: 'backup',
    aliases: ['subir', 'gitpush', 'sync', 'upload'],
    description: 'Sube los cambios a Git y crea un respaldo (Solo Super Admins)',
    groupOnly: false,
    adminOnly: false,
    execute: async (sock, message) => {
        try {
            const senderId = message.key.participant || message.key.remoteJid;

            if (!privilegedConfig.isSuperAdmin(senderId)) {
                await sock.sendMessage(message.key.remoteJid, {
                    text: '❌ Solo los dueños del bot pueden usar este comando.'
                }, { quoted: message });
                return;
            }

            const initMsg = await sock.sendMessage(message.key.remoteJid, { text: '🔄 *Creando respaldo y subiendo cambios...*\n\nEsto puede tardar unos segundos.' }, { quoted: message });

            exec('bash sync.sh', async (error, stdout, stderr) => {
                if (error) {
                    console.error('Error en backup:', error);
                    // Solo enviamos las últimas líneas del error para no saturar
                    const shortError = stderr ? stderr.split('\n').slice(-5).join('\n') : error.message;
                    sock.sendMessage(message.key.remoteJid, {
                        text: `❌ *Error al subir cambios:*\n\n${shortError}\n\n⚠️ Verifica que el repositorio remoto esté configurado.`
                    }, { quoted: message });
                    return;
                }

                const sentMsg = await sock.sendMessage(message.key.remoteJid, {
                    text: `✅ *¡RESPALDO COMPLETADO!*\n\nLos cambios se han guardado y subido a la nube correctamente.`
                }, { quoted: message });

                // Auto-borrar después de 5 segundos (todos los mensajes relacionados)
                setTimeout(async () => {
                    try {
                        // Borrar respuesta final del bot
                        await sock.sendMessage(message.key.remoteJid, { delete: sentMsg.key });
                        // Borrar mensaje inicial del bot "Creando respaldo..."
                        await sock.sendMessage(message.key.remoteJid, { delete: initMsg.key });
                        // Borrar mensaje del usuario
                        await sock.sendMessage(message.key.remoteJid, { delete: message.key });
                    } catch (error) {
                        // Ignorar errores si algún mensaje ya no existe
                    }
                }, 5000);
            });

        } catch (error) {
            console.error('Error general en backup:', error);
            await sock.sendMessage(message.key.remoteJid, {
                text: '❌ Error interno al intentar el respaldo.'
            }, { quoted: message });
        }
    }
};

export const privilegedCommands = [
    listSuperAdminsCommand,
    addSuperAdminCommand,
    removeSuperAdminCommand,
    backupCommand
];
