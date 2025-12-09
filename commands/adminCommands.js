import { getAdminImage, sendMessageWithImage } from '../utils/imageManager.js';
import { config as privilegedConfig } from '../config/privilegedUsers.js';


// Comando para ver todos los comandos de administrador
export const adminMenuCommand = {
    name: 'admin',
    aliases: ['adminmenu', 'adm'],
    description: 'Muestra todos los comandos de administrador',
    groupOnly: true,
    adminOnly: true,
    execute: async (sock, message) => {
        const adminMenuText = `
╔═══════════════════════════════╗
║   🛡️ PANEL DE ADMINISTRADOR   ║
╚═══════════════════════════════╝

┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃  👥 GESTIÓN DE MIEMBROS      ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

🔹 *.kick @usuario* - Expulsar miembro
🔹 *.add [número]* - Añadir miembro
🔹 *.promote @usuario* - Dar admin
🔹 *.demote @usuario* - Quitar admin

┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃  ⚠️ MODERACIÓN               ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

🔹 *.warn @usuario* - Advertir usuario
🔹 *.warns @usuario* - Ver advertencias
🔹 *.unwarn @usuario* - Quitar advertencia
🔹 *.clearwarns @usuario* - Limpiar warns

🔹 *.mute @usuario* - Silenciar usuario
🔹 *.unmute @usuario* - Desilenciar
🔹 *.mutelist* - Ver silenciados

🔹 *.delete* - Borrar mensaje (responder)

┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃  📢 MENCIONES Y ANUNCIOS     ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

🔹 *.todos [mensaje]* - Mencionar a todos
🔹 *.hidetag [mensaje]* - Mención oculta
🔹 *.dmall [mensaje]* - DM a todos (con delay)
🔹 *.broadcast [mensaje]* - Anuncio global

┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃  🎮 LISTAS PERSONALIZADAS    ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

🔹 *.addtraumada @usuario* - Añadir traumada
🔹 *.removetraumada @usuario* - Quitar

🔹 *.addmaricon @usuario* - Añadir maricón
🔹 *.removemaricon @usuario* - Quitar

🔹 *.addpajero @usuario* - Añadir pajero
🔹 *.removepajero @usuario* - Quitar

🔹 *.addlista [nombre] @user* - Lista custom
🔹 *.removelista [nombre] @user* - Quitar
🔹 *.clearlista [nombre]* - Limpiar lista

┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃  💰 ECONOMÍA (ADMIN)         ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

🔹 *.addmoney [cant] @user* - Dar dinero
🔹 *.removemoney [cant] @user* - Quitar
🔹 *.setmoney [cant] @user* - Establecer
🔹 *.checkbal @user* - Ver balance
🔹 *.reseteco @user* - Resetear economía

┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃  ⚙️ CONFIGURACIÓN GRUPO      ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

🔹 *.grupo abrir/cerrar* - Abrir/cerrar grupo
🔹 *.nombre [texto]* - Cambiar nombre
🔹 *.descripcion [texto]* - Cambiar desc
🔹 *.link* - Link del grupo
🔹 *.resetlink* - Resetear link

🔹 *.config* - Configurar bot
🔹 *.config disable [cmd]* - Desactivar cmd
🔹 *.config enable [cmd]* - Activar cmd
🔹 *.config promote @user* - Mod del bot
🔹 *.config demote @user* - Quitar mod

┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃  📊 INFORMACIÓN              ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

🔹 *.infogrupo* - Info del grupo
🔹 *.admins* - Lista de admins
🔹 *.mensajes* - Contador mensajes
🔹 *.limpiar [cant]* - Borrar mensajes

┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃  🔧 SISTEMA (SUPER ADMIN)    ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

🔹 *.mantenimiento* - Modo mantenimiento
🔹 *.stop* - Detener bot
🔹 *.start* - Iniciar bot
🔹 *.reload* - Reiniciar bot

╔═══════════════════════════════╗
║  Usa .menu para ver todos     ║
║  los comandos del bot          ║
╚═══════════════════════════════╝
        `.trim();

        // Obtener imagen de admin
        const adminImage = getAdminImage();

        // Enviar panel de admin con imagen
        const sentMsg = await sendMessageWithImage(sock, message.key.remoteJid, adminMenuText, adminImage);

        // Auto-borrar después de 5 segundos
        setTimeout(async () => {
            try {
                await sock.sendMessage(message.key.remoteJid, { delete: sentMsg.key });
            } catch (error) {
                // Ignorar errores
            }
        }, 5000);
    }
};

// Expulsar miembro
export const kickCommand = {
    name: 'kick',
    aliases: ['expulsar', 'ban'],
    description: 'Expulsa a un miembro del grupo',
    groupOnly: true,
    adminOnly: true,
    execute: async (sock, message) => {
        try {
            const from = message.key.remoteJid;
            const mentioned = message.message?.extendedTextMessage?.contextInfo?.mentionedJid;

            if (!mentioned || mentioned.length === 0) {
                await sock.sendMessage(from, {
                    text: '❌ Debes mencionar al usuario que quieres expulsar.\n\nEjemplo: .kick @usuario'
                }, { quoted: message });
                return;
            }

            // Verificar inmunidad
            const immuneUser = mentioned.find(user => privilegedConfig.isSuperAdmin(user));
            if (immuneUser) {
                await sock.sendMessage(from, {
                    text: `👑 No puedes expulsar a @${immuneUser.split('@')[0]}\n\nEste usuario tiene inmunidad total.`,
                    mentions: [immuneUser]
                }, { quoted: message });
                return;
            }

            await sock.groupParticipantsUpdate(from, mentioned, 'remove');


            await sock.sendMessage(from, {
                text: `✅ Usuario(s) expulsado(s) del grupo.`
            }, { quoted: message });

        } catch (error) {
            console.error('Error al expulsar:', error);
            await sock.sendMessage(message.key.remoteJid, {
                text: '❌ Error al expulsar al usuario. Asegúrate de que el bot sea administrador.'
            }, { quoted: message });
        }
    }
};

// Añadir miembro
export const addCommand = {
    name: 'add',
    aliases: ['añadir', 'agregar'],
    description: 'Añade un miembro al grupo',
    groupOnly: true,
    adminOnly: true,
    execute: async (sock, message, args) => {
        try {
            const from = message.key.remoteJid;

            if (!args[0]) {
                await sock.sendMessage(from, {
                    text: '❌ Debes proporcionar el número de teléfono.\n\nEjemplo: .add 34612345678'
                }, { quoted: message });
                return;
            }

            const number = args[0].replace(/[^0-9]/g, '');
            const userId = `${number}@s.whatsapp.net`;

            await sock.groupParticipantsUpdate(from, [userId], 'add');

            await sock.sendMessage(from, {
                text: `✅ Usuario añadido al grupo.`
            }, { quoted: message });

        } catch (error) {
            console.error('Error al añadir:', error);
            await sock.sendMessage(message.key.remoteJid, {
                text: '❌ Error al añadir al usuario. Verifica que el número sea correcto y que el bot sea administrador.'
            }, { quoted: message });
        }
    }
};

// Promover a admin
export const promoteCommand = {
    name: 'promote',
    aliases: ['promover', 'admin', 'dameadmin'],
    description: 'Promueve a un miembro a administrador (o a ti mismo)',
    groupOnly: true,
    adminOnly: true,
    execute: async (sock, message, args) => {
        try {
            const from = message.key.remoteJid;
            const sender = message.key.participant || message.key.remoteJid;
            let targets = message.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];

            // Si no hay menciones, verificar si quiere promoverse a sí mismo
            // Acepta: .promote me, .promote yo, .dameadmin, o .promote (sin args)
            if (targets.length === 0) {
                if (args.length === 0 || ['me', 'yo', 'mi'].includes(args[0]?.toLowerCase())) {
                    targets = [sender];
                } else {
                    await sock.sendMessage(from, {
                        text: '❌ Debes mencionar al usuario o escribir ".promote me" para darte admin a ti mismo.'
                    }, { quoted: message });
                    return;
                }
            }

            await sock.groupParticipantsUpdate(from, targets, 'promote');

            // Mensaje personalizado si es a uno mismo
            if (targets.includes(sender) && targets.length === 1) {
                await sock.sendMessage(from, {
                    text: '🫡 *A sus órdenes.* Ahora eres administrador del grupo.'
                }, { quoted: message });
            } else {
                await sock.sendMessage(from, {
                    text: `✅ Usuario(s) promovido(s) a administrador.`
                }, { quoted: message });
            }

        } catch (error) {
            console.error('Error al promover:', error);
            await sock.sendMessage(message.key.remoteJid, {
                text: '❌ Error al promover. Asegúrate de que el bot sea administrador.'
            }, { quoted: message });
        }
    }
};

// Degradar admin
export const demoteCommand = {
    name: 'demote',
    aliases: ['degradar', 'removeadmin'],
    description: 'Quita los permisos de administrador',
    groupOnly: true,
    adminOnly: true,
    execute: async (sock, message) => {
        try {
            const from = message.key.remoteJid;
            const mentioned = message.message?.extendedTextMessage?.contextInfo?.mentionedJid;

            if (!mentioned || mentioned.length === 0) {
                await sock.sendMessage(from, {
                    text: '❌ Debes mencionar al usuario que quieres degradar.\n\nEjemplo: .demote @usuario'
                }, { quoted: message });
                return;
            }

            // Verificar inmunidad
            const immuneUser = mentioned.find(user => privilegedConfig.isSuperAdmin(user));
            if (immuneUser) {
                await sock.sendMessage(from, {
                    text: `👑 No puedes degradar a @${immuneUser.split('@')[0]}\n\nEste usuario tiene inmunidad total.`,
                    mentions: [immuneUser]
                }, { quoted: message });
                return;
            }

            await sock.groupParticipantsUpdate(from, mentioned, 'demote');


            await sock.sendMessage(from, {
                text: `✅ Permisos de administrador removidos.`
            }, { quoted: message });

        } catch (error) {
            console.error('Error al degradar:', error);
            await sock.sendMessage(message.key.remoteJid, {
                text: '❌ Error al degradar al usuario.'
            }, { quoted: message });
        }
    }
};

// Mención oculta (hidetag)
export const hidetagCommand = {
    name: 'hidetag',
    aliases: ['ht', 'notify'],
    description: 'Menciona a todos sin mostrar la lista',
    groupOnly: true,
    adminOnly: true,
    execute: async (sock, message, args) => {
        try {
            const from = message.key.remoteJid;
            const groupMetadata = await sock.groupMetadata(from);
            const participants = groupMetadata.participants;
            const mentions = participants.map(p => p.id);

            const text = args.join(' ') || '📢 Notificación del grupo';

            await sock.sendMessage(from, {
                text: text,
                mentions: mentions
            });

            // Borrar mensaje original
            try {
                await sock.sendMessage(from, { delete: message.key });
            } catch (e) { }

        } catch (error) {
            console.error('Error en hidetag:', error);
            await sock.sendMessage(message.key.remoteJid, {
                text: '❌ Error al enviar la notificación.'
            }, { quoted: message });
        }
    }
};

// Abrir/Cerrar grupo
export const groupCommand = {
    name: 'grupo',
    aliases: ['group', 'g'],
    description: 'Abre o cierra el grupo',
    groupOnly: true,
    adminOnly: true,
    execute: async (sock, message, args) => {
        try {
            const from = message.key.remoteJid;
            const action = args[0]?.toLowerCase();

            if (action === 'abrir' || action === 'open') {
                await sock.groupSettingUpdate(from, 'not_announcement');
                await sock.sendMessage(from, {
                    text: '✅ Grupo abierto. Todos pueden enviar mensajes.'
                }, { quoted: message });
            } else if (action === 'cerrar' || action === 'close') {
                await sock.groupSettingUpdate(from, 'announcement');
                await sock.sendMessage(from, {
                    text: '🔒 Grupo cerrado. Solo administradores pueden enviar mensajes.'
                }, { quoted: message });
            } else {
                await sock.sendMessage(from, {
                    text: '❌ Uso: .grupo abrir | .grupo cerrar'
                }, { quoted: message });
            }

        } catch (error) {
            console.error('Error al cambiar configuración:', error);
            await sock.sendMessage(message.key.remoteJid, {
                text: '❌ Error al cambiar la configuración del grupo.'
            }, { quoted: message });
        }
    }
};

// Cambiar nombre del grupo
export const setNameCommand = {
    name: 'nombre',
    aliases: ['setname', 'name'],
    description: 'Cambia el nombre del grupo',
    groupOnly: true,
    adminOnly: true,
    execute: async (sock, message, args) => {
        try {
            const from = message.key.remoteJid;
            const newName = args.join(' ');

            if (!newName) {
                await sock.sendMessage(from, {
                    text: '❌ Debes proporcionar un nombre.\n\nEjemplo: .nombre Mi Grupo Cool'
                }, { quoted: message });
                return;
            }

            await sock.groupUpdateSubject(from, newName);
            await sock.sendMessage(from, {
                text: `✅ Nombre del grupo cambiado a: *${newName}*`
            }, { quoted: message });

        } catch (error) {
            console.error('Error al cambiar nombre:', error);
            await sock.sendMessage(message.key.remoteJid, {
                text: '❌ Error al cambiar el nombre del grupo.'
            }, { quoted: message });
        }
    }
};

// Cambiar descripción del grupo
export const setDescCommand = {
    name: 'descripcion',
    aliases: ['setdesc', 'desc'],
    description: 'Cambia la descripción del grupo',
    groupOnly: true,
    adminOnly: true,
    execute: async (sock, message, args) => {
        try {
            const from = message.key.remoteJid;
            const newDesc = args.join(' ');

            if (!newDesc) {
                await sock.sendMessage(from, {
                    text: '❌ Debes proporcionar una descripción.\n\nEjemplo: .descripcion Grupo de amigos'
                }, { quoted: message });
                return;
            }

            await sock.groupUpdateDescription(from, newDesc);
            await sock.sendMessage(from, {
                text: `✅ Descripción del grupo actualizada.`
            }, { quoted: message });

        } catch (error) {
            console.error('Error al cambiar descripción:', error);
            await sock.sendMessage(message.key.remoteJid, {
                text: '❌ Error al cambiar la descripción del grupo.'
            }, { quoted: message });
        }
    }
};

// Borrar mensaje
export const deleteCommand = {
    name: 'delete',
    aliases: ['del', 'borrar'],
    description: 'Borra un mensaje (responde al mensaje)',
    groupOnly: true,
    adminOnly: true,
    execute: async (sock, message) => {
        try {
            const quotedMessage = message.message?.extendedTextMessage?.contextInfo;

            if (!quotedMessage) {
                await sock.sendMessage(message.key.remoteJid, {
                    text: '❌ Debes responder al mensaje que quieres borrar.'
                }, { quoted: message });
                return;
            }

            const messageKey = {
                remoteJid: message.key.remoteJid,
                fromMe: false,
                id: quotedMessage.stanzaId,
                participant: quotedMessage.participant
            };

            await sock.sendMessage(message.key.remoteJid, { delete: messageKey });
            await sock.sendMessage(message.key.remoteJid, { delete: message.key });

        } catch (error) {
            console.error('Error al borrar mensaje:', error);
            await sock.sendMessage(message.key.remoteJid, {
                text: '❌ Error al borrar el mensaje.'
            }, { quoted: message });
        }
    }
};

// Info del grupo
export const groupInfoCommand = {
    name: 'infogrupo',
    aliases: ['groupinfo', 'gi'],
    description: 'Muestra información del grupo',
    groupOnly: true,
    adminOnly: true,
    execute: async (sock, message) => {
        try {
            const from = message.key.remoteJid;
            const groupMetadata = await sock.groupMetadata(from);

            const admins = groupMetadata.participants.filter(p => p.admin).length;
            const members = groupMetadata.participants.length;

            const infoText = `
╔═══════════════════════════╗
║   📊 INFORMACIÓN DEL GRUPO ║
╚═══════════════════════════╝

📌 *Nombre:* ${groupMetadata.subject}

📝 *Descripción:*
${groupMetadata.desc || 'Sin descripción'}

👥 *Participantes:* ${members}
🛡️ *Administradores:* ${admins}

📅 *Creado:* ${new Date(groupMetadata.creation * 1000).toLocaleDateString()}

🔗 *ID del Grupo:*
${from}
            `.trim();

            await sock.sendMessage(from, {
                text: infoText
            }, { quoted: message });

        } catch (error) {
            console.error('Error al obtener info:', error);
            await sock.sendMessage(message.key.remoteJid, {
                text: '❌ Error al obtener información del grupo.'
            }, { quoted: message });
        }
    }
};

// Lista de admins
export const adminsCommand = {
    name: 'admins',
    aliases: ['adminlist', 'listadmin'],
    description: 'Muestra la lista de administradores',
    groupOnly: true,
    adminOnly: false,
    execute: async (sock, message) => {
        try {
            const from = message.key.remoteJid;
            const groupMetadata = await sock.groupMetadata(from);

            const admins = groupMetadata.participants.filter(p => p.admin);

            let text = '🛡️ *ADMINISTRADORES DEL GRUPO*\n\n';
            text += '━━━━━━━━━━━━━━━━━━━\n';

            admins.forEach((admin, index) => {
                const role = admin.admin === 'superadmin' ? '👑' : '🛡️';
                text += `${index + 1}. ${role} @${admin.id.split('@')[0]}\n`;
            });

            text += '━━━━━━━━━━━━━━━━━━━\n';
            text += `\nTotal: ${admins.length} administradores`;

            const sentMsg = await sock.sendMessage(from, {
                text: text,
                mentions: admins.map(a => a.id)
            }, { quoted: message });

            // Auto-borrar después de 5 segundos
            setTimeout(async () => {
                try {
                    await sock.sendMessage(from, { delete: sentMsg.key });
                } catch (error) {
                    // Ignorar errores
                }
            }, 5000);

        } catch (error) {
            console.error('Error al listar admins:', error);
            await sock.sendMessage(message.key.remoteJid, {
                text: '❌ Error al obtener la lista de administradores.'
            }, { quoted: message });
        }
    }
};

// Obtener link del grupo
export const linkCommand = {
    name: 'link',
    aliases: ['linkgrupo', 'grouplink'],
    description: 'Obtiene el link de invitación del grupo',
    groupOnly: true,
    adminOnly: true,
    execute: async (sock, message) => {
        try {
            const from = message.key.remoteJid;
            const code = await sock.groupInviteCode(from);
            const link = `https://chat.whatsapp.com/${code}`;

            await sock.sendMessage(from, {
                text: `🔗 *LINK DEL GRUPO*\n\n${link}`
            }, { quoted: message });

        } catch (error) {
            console.error('Error al obtener link:', error);
            await sock.sendMessage(message.key.remoteJid, {
                text: '❌ Error al obtener el link del grupo.'
            }, { quoted: message });
        }
    }
};

// Resetear link del grupo
export const resetLinkCommand = {
    name: 'resetlink',
    aliases: ['revokelink', 'nuevolink'],
    description: 'Genera un nuevo link de invitación',
    groupOnly: true,
    adminOnly: true,
    execute: async (sock, message) => {
        try {
            const from = message.key.remoteJid;
            const code = await sock.groupRevokeInvite(from);
            const link = `https://chat.whatsapp.com/${code}`;

            await sock.sendMessage(from, {
                text: `✅ *LINK RESETEADO*\n\nNuevo link del grupo:\n${link}\n\n⚠️ El link anterior ya no funciona.`
            }, { quoted: message });

        } catch (error) {
            console.error('Error al resetear link:', error);
            await sock.sendMessage(message.key.remoteJid, {
                text: '❌ Error al resetear el link del grupo.'
            }, { quoted: message });
        }
    }
};

export const adminCommands = [
    adminMenuCommand,
    kickCommand,
    addCommand,
    promoteCommand,
    demoteCommand,
    hidetagCommand,
    groupCommand,
    setNameCommand,
    setDescCommand,
    deleteCommand,
    groupInfoCommand,
    adminsCommand,
    linkCommand,
    resetLinkCommand
];
