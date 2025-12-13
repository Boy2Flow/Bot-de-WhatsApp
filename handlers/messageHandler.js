import { commands } from '../commands/index.js';
import { logger } from '../utils/logger.js';
import { getMaintenanceStatus, getMaintenanceMessage } from '../commands/maintenance.js';
import { isUserMuted } from '../commands/muteCommand.js';
import { isPajero } from '../commands/pajeroCommand.js';
import { getBotStatus } from '../commands/systemCommands.js';
import { getGeminiResponse } from '../commands/aiCommand.js';
import { groupConfig } from '../utils/groupConfigManager.js';
import { config as privilegedConfig } from '../config/privilegedUsers.js';
import { checkLevelUp } from '../commands/levelSystem.js';
import fs from 'fs';
import path from 'path';

// Archivo para logs de mensajes
const MESSAGES_FILE = path.join(process.cwd(), 'messages.json');

function trackMessage(groupId, userId) {
    try {
        let data = {};
        if (fs.existsSync(MESSAGES_FILE)) {
            const fileContent = fs.readFileSync(MESSAGES_FILE, 'utf8');
            if (fileContent.trim()) {
                try {
                    data = JSON.parse(fileContent);
                } catch (e) {
                    data = {};
                }
            }
        }

        // Asegurar que data es un objeto
        if (!data || typeof data !== 'object') {
            data = {};
        }

        // Migración/Corrección: Si el valor del grupo es un número (formato antiguo) o no es objeto, reiniciarlo
        if (data[groupId] && typeof data[groupId] !== 'object') {
            data[groupId] = {};
        }

        // Inicializar grupo si no existe
        if (!data[groupId]) {
            data[groupId] = {};
        }

        // Inicializar contador del usuario en el grupo
        if (!data[groupId][userId]) {
            data[groupId][userId] = 0;
        }

        data[groupId][userId]++;

        fs.writeFileSync(MESSAGES_FILE, JSON.stringify(data, null, 2));

        return data[groupId][userId];
    } catch (error) {
        console.error('Error tracking message:', error);
        return 0;
    }
}

// Cache para metadata de grupos (reduce llamadas a la API)
const groupMetadataCache = new Map();
const CACHE_TTL = 300000; // 5 minutos

async function getGroupMetadataOptimized(sock, groupId) {
    const cached = groupMetadataCache.get(groupId);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
        return cached.data;
    }

    const metadata = await sock.groupMetadata(groupId);
    groupMetadataCache.set(groupId, { data: metadata, timestamp: Date.now() });
    return metadata;
}

export async function handleMessage(sock, message) {
    try {
        // Early returns para máxima velocidad
        if (message.key.fromMe) return;

        // Track message count
        const from = message.key.remoteJid;
        const senderJid = message.key.participant || message.key.remoteJid;
        let msgCount = 0;
        try {
            msgCount = trackMessage(from, senderJid);
            if (msgCount > 0) {
                // Verificar subida de nivel (no esperamos await para no bloquear)
                checkLevelUp(sock, from, senderJid, msgCount).catch(err => console.error('Error en checkLevelUp:', err));
            }
        } catch (e) {
            console.error('Error tracking message:', e);
        }

        const messageType = Object.keys(message.message || {})[0];
        if (!messageType) return;

        const isGroup = from.endsWith('@g.us');

        // Obtener texto de forma optimizada
        let text = '';
        const msg = message.message;

        if (messageType === 'conversation') {
            text = msg.conversation;
        } else if (messageType === 'extendedTextMessage') {
            text = msg.extendedTextMessage.text;
        } else if (messageType === 'imageMessage') {
            text = msg.imageMessage.caption || '';
        }

        // Early return si no hay texto
        if (!text) return;

        // Verificaciones de grupo (optimizado para grupos)
        if (isGroup) {
            const senderId = message.key.participant;

            // Verificar muteo (early return)
            if (isUserMuted(from, senderId)) {
                sock.sendMessage(from, { delete: message.key }).catch(() => { });
                return;
            }
        }

        // --- SISTEMA ANTI-MOROS (NASSAR) ---
        if (/\bna(s+)ar\b/i.test(text)) {
            const insults = [
                'Ese moro cabron',
                'Ese es un puto moro',
                'moro de mierda',
                'Nasarcalla moro',
                'Nasar vete a comer jamon... ah no espera'
            ];
            const randomInsult = insults[Math.floor(Math.random() * insults.length)];

            await sock.sendMessage(from, {
                text: randomInsult
            }, { quoted: message });
        }

        // --- SISTEMA ANTI-SPAM (ENLACES DE GRUPO) ---
        if (isGroup) {
            // Regex para detectar enlaces de invitación de WhatsApp
            const inviteLinkRegex = /(https?:\/\/)?chat\.whatsapp\.com\/[A-Za-z0-9]{20,}/gi;

            if (inviteLinkRegex.test(text)) {
                const senderId = message.key.participant;

                // Verificar si es super admin (inmune)
                const isSuperUser = privilegedConfig.isSuperAdmin(senderId);

                if (!isSuperUser) {
                    try {
                        const groupMetadata = await getGroupMetadataOptimized(sock, from);

                        // Verificar si el remitente es admin del grupo
                        const sender = groupMetadata.participants.find(p => p.id === senderId);
                        const isSenderAdmin = sender?.admin === 'admin' || sender?.admin === 'superadmin';

                        // Verificar si el BOT es admin (necesario para borrar y kickear)
                        // Construir ID del bot limpio (sin :device)
                        const botIdRaw = sock.user?.id?.split(':')[0];
                        const botMember = groupMetadata.participants.find(p => p.id.includes(botIdRaw));
                        const isBotAdmin = botMember?.admin === 'admin' || botMember?.admin === 'superadmin';

                        // Si el usuario NO es admin y el bot SÍ es admin -> ACTUAR
                        if (!isSenderAdmin && isBotAdmin) {
                            console.log(`[ANTI-SPAM] 🚫 Enlace detectado de ${senderId} en ${from}`);

                            // 1. Borrar mensaje
                            await sock.sendMessage(from, { delete: message.key });

                            // 2. Expulsar usuario
                            await sock.groupParticipantsUpdate(from, [senderId], 'remove');

                            // 3. Enviar mensaje de aviso
                            await sock.sendMessage(from, {
                                text: `🚫 *ANTI-SPAM DETECTADO*\n\n@${senderId.split('@')[0]} ha sido expulsado por enviar enlaces de otros grupos.\n\n_Aquí no permitimos spam._`,
                                mentions: [senderId]
                            });

                            return; // Detener procesamiento del mensaje
                        } else if (!isBotAdmin) {
                            console.log('[ANTI-SPAM] Detectado spam, pero el bot no es admin para actuar.');
                        }

                    } catch (e) {
                        console.error('Error en sistema anti-spam:', e);
                    }
                }
            }
        }

        // Early return si no es comando
        if (!text.startsWith('.')) return;

        const args = text.slice(1).trim().split(/ +/);
        const commandName = args.shift().toLowerCase();

        // Verificar estado del bot (optimizado)
        if (getBotStatus() === false && !['start', 'reload'].includes(commandName)) return;

        // Verificar permisos de sistema (early return)
        if (['stop', 'start', 'reload'].includes(commandName)) {
            const participant = message.key.participant || from;

            // Usar privilegedConfig para verificar permisos de sistema
            if (!privilegedConfig.isSuperAdmin(participant)) {
                sock.sendMessage(from, {
                    text: '⛔ No tienes permiso para usar este comando.'
                }, { quoted: message });
                return;
            }
        }

        // Buscar comando (optimizado con find)
        const command = commands.find(cmd =>
            cmd.name === commandName || (cmd.aliases && cmd.aliases.includes(commandName))
        );

        if (!command) {
            // Comentario: No enviamos mensaje de error siempre para no saturar, pero si es necesario se puede descomentar
            // sock.sendMessage(from, { text: `❌ Comando no encontrado.` }, { quoted: message });
            return;
        }

        // Verificar mantenimiento (early return)
        if (getMaintenanceStatus() && !['mantenimiento', 'maintenance', 'mant'].includes(commandName)) {
            // Permitir que Super Admins usen el bot incluso en mantenimiento
            const participant = message.key.participant || from;
            if (!privilegedConfig.isSuperAdmin(participant)) {
                sock.sendMessage(from, {
                    text: `🔧 *MODO MANTENIMIENTO*\n\n${getMaintenanceMessage()}`
                }, { quoted: message });
                return;
            }
        }

        // Verificar si requiere grupo
        if (command.groupOnly && !isGroup) {
            sock.sendMessage(from, {
                text: '❌ Este comando solo puede usarse en grupos.'
            }, { quoted: message });
            return;
        }

        // Verificar si el comando está desactivado en este grupo
        if (isGroup && groupConfig.isCommandDisabled(from, commandName)) {
            // Los super admins pueden usar comandos desactivados
            const participant = message.key.participant;
            if (!privilegedConfig.isSuperAdmin(participant)) {
                return;
            }
        }

        // Verificar admin (optimizado con cache)
        if (command.adminOnly && isGroup) {
            const participant = message.key.participant;
            const isSuperUser = privilegedConfig.isSuperAdmin(participant);

            // Verificar roles internos del bot (Moderadores configurados con .config)
            const botRole = groupConfig.getUserRole(from, participant);
            const isBotMod = botRole === 'mod' || botRole === 'admin';

            // Si NO es Super User Y NO es mod del bot, verificamos permisos de WhatsApp
            if (!isSuperUser && !isBotMod) {
                const groupMetadata = await getGroupMetadataOptimized(sock, from);
                const isAdmin = groupMetadata.participants.find(
                    p => p.id === participant
                )?.admin;

                if (!isAdmin) {
                    sock.sendMessage(from, {
                        text: '❌ Este comando solo puede ser usado por administradores del grupo.'
                    }, { quoted: message });
                    return;
                }
            }
        }

        // PROTECCIÓN: Evitar que usen comandos de admin contra usuarios privilegiados
        if (command.adminOnly && isGroup) {
            const mentionedJid = message.message?.extendedTextMessage?.contextInfo?.mentionedJid;
            if (mentionedJid && mentionedJid.length > 0) {
                const targetingPrivileged = mentionedJid.some(jid => privilegedConfig.isSuperAdmin(jid));
                const senderIsPrivileged = privilegedConfig.isSuperAdmin(message.key.participant);

                // Si intenta atacar a un usuario privilegiado y el atacante NO es privilegiado
                if (targetingPrivileged && !senderIsPrivileged) {
                    await sock.sendMessage(from, {
                        text: '👑 No puedes usar comandos de administración contra usuarios privilegiados.'
                    }, { quoted: message });
                    return;
                }
            }
        }

        // DEFINIR VARIABLES DE USUARIO PARA LOGGING Y EJECUCIÓN
        const userJid = isGroup ? message.key.participant : message.key.remoteJid;
        const userPhone = userJid.split('@')[0].replace(/[^0-9]/g, '');

        // --- SISTEMA DE LOGS ---
        try {
            const timestamp = new Date().toLocaleString('es-ES', { timeZone: 'Europe/Madrid' });
            const userName = message.pushName || 'Desconocido';
            let groupName = 'Privado';

            if (isGroup) {
                try {
                    const metadata = await getGroupMetadataOptimized(sock, from);
                    groupName = metadata.subject || from;
                } catch (e) {
                    groupName = from;
                }
            }

            const logLine = `[${timestamp}] 👤 ${userName} (${userPhone}) | 🏠 ${groupName} | 💻 .${commandName} ${args.join(' ')}\n`;

            const logFile = path.join(process.cwd(), 'COMMAND_LOGS.txt');

            fs.appendFile(logFile, logLine, (err) => {
                if (err) console.error('Error escribiendo log:', err);
            });

        } catch (error) {
            console.error('Error en sistema de logs:', error);
        }

        // --- LOGGING PARA DASHBOARD Y TERMINAL ---

        // 1. Para "Detected Commands" (Dashboard): Enviar TODOS los comandos
        console.log(`CMD_EXEC:${commandName}:${userPhone}:${message.pushName || 'Desconocido'}`);

        // 2. Para "System Terminal" (Consola visible): Solo mostrar si es admin o dueño
        const isSuper = privilegedConfig.isSuperAdmin(userJid);

        // Verificar si es admin del grupo
        let isAdmin = false;
        if (isGroup) {
            try {
                const groupMetadata = await getGroupMetadataOptimized(sock, from);
                const participant = groupMetadata.participants.find(p => p.id === userJid);
                isAdmin = participant?.admin === 'admin' || participant?.admin === 'superadmin';
            } catch (e) { }
        }

        if (isSuper || isAdmin) {
            console.log(`[ADMIN] Comando ejecutado por ${message.pushName || 'Desconocido'} (${userPhone}): .${commandName} ${args.join(' ')}`);
        }

        // Ejecutar comando
        command.execute(sock, message, args).catch(error => {
            logger.error('Error ejecutando comando:', error);
            sock.sendMessage(message.key.remoteJid, {
                text: '❌ Ocurrió un error al ejecutar el comando.'
            }, { quoted: message }).catch(() => { });
        });

    } catch (error) {
        logger.error('Error al manejar mensaje:', error);
    }
}
