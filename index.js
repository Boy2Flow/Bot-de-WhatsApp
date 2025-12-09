import './utils/silencer.js'; // 🤫 Silenciador de logs (DEBE IR PRIMERO)
import makeWASocket, {
    DisconnectReason,
    useMultiFileAuthState,
    fetchLatestBaileysVersion
} from '@whiskeysockets/baileys';
import { Boom } from '@hapi/boom';
import pino from 'pino';
import qrcodeTerminal from 'qrcode-terminal';
import QRCode from 'qrcode';
import { handleMessage } from './handlers/messageHandler.js';
import { logger } from './utils/logger.js';
import fs from 'fs';
import path from 'path';
import { exec } from 'child_process';
import { getBotStatus } from './commands/systemCommands.js';
import {
    initDiscordPresence,
    updateBotStats,
    setConnectedStatus,
    setDisconnectedStatus,
    closeDiscordPresence
} from './utils/discordPresence.js';
import { getWelcomeImage, sendMessageWithImage } from './utils/imageManager.js';
import { config as privilegedConfig } from './config/privilegedUsers.js';



async function connectToWhatsApp() {
    const { state, saveCreds } = await useMultiFileAuthState('auth_info');
    const { version } = await fetchLatestBaileysVersion();

    const sock = makeWASocket({
        version,
        logger: pino({ level: 'silent' }),
        printQRInTerminal: false,
        auth: state,
        browser: ['Bot WhatsApp', 'Chrome', '1.0.0'],

        // ⚙️ Configuración optimizada para estabilidad
        syncFullHistory: false, // Mantener false para inicio rápido
        markOnlineOnConnect: true,
        generateHighQualityLinkPreview: true,

        // ⏱️ Timeouts aumentados para mayor estabilidad
        defaultQueryTimeoutMs: 120000, // 2 minutos (antes 60s)
        keepAliveIntervalMs: 30000,    // 30 segundos (antes 60s) - más frecuente
        connectTimeoutMs: 120000,      // 2 minutos (antes 60s)
        retryRequestDelayMs: 5000,

        // 🔄 Configuración de reconexión
        qrTimeout: 60000,              // Timeout para QR
        emitOwnEvents: false,          // No emitir eventos propios

        // 🛡️ Prevenir desconexiones por inactividad
        getMessage: async (key) => {
            // Retornar undefined para mensajes no encontrados
            return undefined;
        }
    });

    sock.ev.on('connection.update', async (update) => {
        const { connection, lastDisconnect, qr } = update;

        if (qr) {
            console.log('\n🔐 Generando código QR para WhatsApp...\n');

            // Generar QR en terminal
            qrcodeTerminal.generate(qr, { small: true });

            // Generar QR como imagen
            const qrPath = path.join(process.cwd(), 'whatsapp_qr.png');
            try {
                await QRCode.toFile(qrPath, qr, {
                    width: 500,
                    margin: 2,
                    color: {
                        dark: '#000000',
                        light: '#FFFFFF'
                    }
                });

                console.log('\n✅ Código QR generado exitosamente!');
                console.log(`📁 Ubicación: ${qrPath}`);
                console.log('\n📱 INSTRUCCIONES:');
                console.log('   1. Abre el archivo: whatsapp_qr.png');
                console.log('   2. Abre WhatsApp en tu teléfono');
                console.log('   3. Ve a: Configuración > Dispositivos vinculados');
                console.log('   4. Toca "Vincular un dispositivo"');
                console.log('   5. Escanea el código QR de la imagen\n');

                // Intentar abrir la imagen automáticamente
                const { exec } = await import('child_process');
                exec(`start "" "${qrPath}"`, (error) => {
                    if (error) {
                        console.log('💡 Abre manualmente el archivo whatsapp_qr.png');
                    } else {
                        console.log('🖼️  Abriendo imagen del QR...\n');
                    }
                });

            } catch (error) {
                console.error('❌ Error generando imagen QR:', error.message);
                console.log('💡 Usa el código QR de la terminal arriba ↑\n');
            }
        }

        if (connection === 'close') {
            // Validar que lastDisconnect existe
            if (!lastDisconnect) {
                logger.warn('⚠️  Conexión cerrada sin información de desconexión. Esperando...');
                return;
            }

            const statusCode = (lastDisconnect.error instanceof Boom)
                ? lastDisconnect.error.output.statusCode
                : null;

            const errorMsg = lastDisconnect.error?.message || '';

            // 🔍 DIAGNÓSTICO: Mostrar información detallada de la desconexión
            console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
            console.log('🔌 DESCONEXIÓN DETECTADA');
            console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
            console.log(`📊 Status Code: ${statusCode}`);
            console.log(`📝 Error Message: ${errorMsg}`);
            console.log(`🕐 Timestamp: ${new Date().toLocaleString()}`);

            // Mapear códigos de estado a mensajes legibles
            const disconnectReasons = {
                401: '❌ Sesión cerrada (logout)',
                408: '⏱️ Timeout de conexión',
                411: '🔄 Conflicto de sesión (otro dispositivo conectado)',
                428: '🔐 Conexión perdida',
                440: '📱 Dispositivo desconectado',
                500: '🔥 Error interno del servidor',
                503: '🚫 Servicio no disponible'
            };

            if (statusCode && disconnectReasons[statusCode]) {
                console.log(`💡 Razón: ${disconnectReasons[statusCode]}`);
            }

            // Detectar conflicto de sesión (código 411)
            if (statusCode === 411 || errorMsg.includes('conflict')) {
                console.log('\n⚠️  CONFLICTO DE SESIÓN DETECTADO');
                console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
                console.log('📱 Otro dispositivo está usando esta sesión de WhatsApp');
                console.log('💡 Soluciones:');
                console.log('   1. Cierra WhatsApp Web en otros navegadores');
                console.log('   2. Ve a WhatsApp > Dispositivos vinculados');
                console.log('   3. Cierra todas las sesiones excepto esta');
                console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
            }

            console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

            // Detectar errores de sesión corrupta
            if (errorMsg.includes('Bad MAC') ||
                errorMsg.includes('decrypt') ||
                errorMsg.includes('Session Error')) {
                logger.error('❌ Error de sesión detectado:', errorMsg);
                logger.warn('💡 Ejecuta: node fix_session.js para limpiar la sesión');
                logger.warn('⏸️  Deteniendo reconexión automática para evitar bucles...');
                return; // No reconectar automáticamente en errores de sesión
            }

            // Solo reconectar si NO es logout
            const shouldReconnect = statusCode !== DisconnectReason.loggedOut;

            if (shouldReconnect) {
                logger.info('🔄 Reconectando en 3 segundos...');
                setTimeout(() => connectToWhatsApp(), 3000);
            } else {
                logger.warn('🚪 Sesión cerrada (logout). No se reconectará automáticamente.');
            }

        } else if (connection === 'open') {
            logger.success('✅ Bot conectado exitosamente!');
            console.log('\n🤖 Bot de WhatsApp activo y listo!\n');
            console.log('📋 Comandos disponibles:');
            console.log('   .menu - Ver todos los comandos');
            console.log('   .admin - Ver comandos de administrador');
            console.log('   .sticker - Convertir imagen a sticker');
            console.log('   .todos - Mencionar a todos');
            console.log('   .jugar - Mini juegos');
            console.log('\n');

            // Actualizar Discord Rich Presence
            // Se actualiza más abajo cuando cargamos los grupos
            // setConnectedStatus();

            // Establecer el número del bot para inmunidad
            try {
                const botNumber = sock.user.id;
                privilegedConfig.setBotNumber(botNumber);
                console.log('👑 Inmunidad activada para el bot y usuarios privilegiados');
            } catch (e) {
                logger.error('Error estableciendo número del bot:', e);
            }

            // Actualizar estadísticas iniciales

            try {
                const groups = await sock.groupFetchAllParticipating();
                const groupCount = Object.keys(groups).length;

                // Cargar mensajes procesados
                let messageCount = 0;
                try {
                    const messagesData = JSON.parse(fs.readFileSync('messages.json', 'utf8'));
                    messageCount = Object.values(messagesData).reduce((sum, count) => sum + count, 0);
                } catch (e) { }

                updateBotStats({
                    groups: groupCount,
                    messages: messageCount,
                    users: 0
                });
            } catch (e) {
                logger.error('Error actualizando stats de Discord:', e);
            }

            // Verificar si venimos de un reinicio
            try {
                if (fs.existsSync('restart_pending.json')) {
                    const restartData = JSON.parse(fs.readFileSync('restart_pending.json'));

                    // Solo notificar si el reinicio fue hace menos de 2 minutos
                    if (Date.now() - restartData.timestamp < 120000) {
                        await sock.sendMessage(restartData.chatId, {
                            text: '✅ *¡BOT REINICIADO!*\n\nEl sistema está operativo nuevamente.'
                        });
                    }

                    fs.unlinkSync('restart_pending.json');
                }
            } catch (err) {
                logger.error('Error verificando reinicio:', err);
            }
        }
    });

    sock.ev.on('creds.update', saveCreds);

    // Manejo de errores de mensajes (decrypt, Bad MAC, etc.)
    sock.ev.on('messages.upsert', async ({ messages, type }) => {
        if (type === 'notify') {
            // Procesar mensajes en paralelo para máxima velocidad
            messages.forEach(message => {
                handleMessage(sock, message).catch(err => {
                    // Ignorar errores de descifrado (son normales en grupos grandes)
                    if (err.message?.includes('decrypt') || err.message?.includes('MAC')) {
                        // Silenciar estos errores comunes
                        return;
                    }
                    logger.error('Error procesando mensaje:', err);
                });
            });
        }
    });



    // Actualizar Rich Presence cuando se une a nuevos grupos
    sock.ev.on('groups.upsert', async (groups) => {
        try {
            const allGroups = await sock.groupFetchAllParticipating();
            const groupCount = Object.keys(allGroups).length;
            updateBotStats({ groups: groupCount });
            logger.info(`Stats actualizadas: ${groupCount} grupos`);
        } catch (e) {
            logger.error('Error actualizando stats de grupos:', e);
        }
    });

    sock.ev.on('group-participants.update', async (update) => {
        const { id, participants, action, actor } = update;

        // Actualizar contador de grupos si el bot es removido
        if (action === 'remove') {
            try {
                const botId = sock.user?.id?.split(':')[0];
                const isBotRemoved = participants.some(p => p.includes(botId));

                if (isBotRemoved) {
                    // Pequeño delay para asegurar que la API se actualice
                    setTimeout(async () => {
                        const allGroups = await sock.groupFetchAllParticipating();
                        const groupCount = Object.keys(allGroups).length;
                        updateBotStats({ groups: groupCount });
                        logger.info(`Bot removido de grupo. Total grupos: ${groupCount}`);
                    }, 2000);
                }
            } catch (e) {
                logger.error('Error actualizando stats de grupos al salir:', e);
            }
        }

        // DEBUG: Ver qué está pasando exactamente
        console.log(`[GROUP UPDATE] Acción: ${action} | Grupo: ${id} | Actor: ${actor} | Participantes: ${JSON.stringify(participants)}`);

        // --- SISTEMA DE PROTECCIÓN DIVINA PARA SUPER ADMINS ---
        if (action === 'demote' || action === 'remove') {
            for (const participant of participants) {
                // Verificar si es super admin con logging
                const isSuper = privilegedConfig.isSuperAdmin(participant);
                console.log(`[PROTECCIÓN] Check user ${participant}: Es Super Admin? ${isSuper}`);

                if (isSuper) {

                    // Preparar texto de actores
                    const victimClean = participant.split('@')[0];
                    const actorClean = actor ? actor.split('@')[0] : 'Desconocido';

                    const mentions = [participant];
                    let messageText = '';

                    if (actor) mentions.push(actor);

                    // CASO 1: Intentan quitarle admin (DEMOTE)
                    if (action === 'demote') {
                        console.log(`[PROTECCIÓN] 🚨 INTENTO DE DEGRADACIÓN DETECTADO contra ${victimClean}`);

                        try {
                            // 1. Devolver admin inmediatamente
                            await sock.groupParticipantsUpdate(id, [participant], 'promote');

                            // 2. Advertencia pública
                            messageText = `⚡ *PROTECCIÓN DIVINA ACTIVADA*\n\n` +
                                `👮‍♂️ *Agresor:* @${actorClean}\n` +
                                `👑 *Víctima:* @${victimClean}\n\n` +
                                `⚠️ *Acción:* Intentó quitar admin a un Creador.\n` +
                                `🛡️ *Resultado:* Rango restaurado inmediatamente.`;

                        } catch (error) {
                            console.error('[PROTECCIÓN] Fallo al restaurar admin:', error);
                        }
                    }

                    // CASO 2: Intentan expulsarlo (REMOVE)
                    if (action === 'remove') {
                        console.log(`[PROTECCIÓN] 🚨 INTENTO DE EXPULSIÓN DETECTADO contra ${victimClean}`);

                        // Si el actor es el propio usuario, es que se salió él mismo -> NO HACER NADA
                        if (actor && participant.includes(actor.split('@')[0])) {
                            console.log('[PROTECCIÓN] El usuario se salió voluntariamente. No se aplica protección.');
                            continue;
                        }

                        // JID limpio para la operación (CRÍTICO: Baileys necesita el JID base sin :device)
                        const userToRescue = participant.split(':')[0];

                        try {
                            // 1. Intentar volver a meter al grupo
                            console.log(`[PROTECCIÓN] Intentando añadir a: ${userToRescue}`);
                            const response = await sock.groupParticipantsUpdate(id, [userToRescue], 'add');
                            console.log(`[PROTECCIÓN] Respuesta de add: ${JSON.stringify(response)}`);

                            // Verificar si hubo error en la respuesta (algunos nodos devuelven status 403)
                            const status = response[0]?.status;
                            if (status && status !== '200') {
                                throw new Error(`WhatsApp rechazó la adición con status: ${status}`);
                            }

                            // 2. Advertencia pública de ÉXITO
                            messageText = `⚡ *PROTECCIÓN DIVINA ACTIVADA*\n\n` +
                                `👮‍♂️ *Agresor:* @${actorClean}\n` +
                                `👑 *Víctima:* @${victimClean}\n\n` +
                                `⚠️ *Acción:* Intentó expulsar a un Creador.\n` +
                                `🛡️ *Resultado:* Reincorporación automática ejecutada.`;

                        } catch (error) {
                            console.error('[PROTECCIÓN] Fallo al reincorporar super admin:', error.message);

                            // 2b. Advertencia pública de FALLO (pero notificación del intento)
                            messageText = `⚡ *PROTECCIÓN DIVINA ACTIVADA*\n\n` +
                                `👮‍♂️ *Agresor:* @${actorClean}\n` +
                                `👑 *Víctima:* @${victimClean}\n\n` +
                                `⚠️ *Acción:* Intentó expulsar a un Creador.\n` +
                                `❌ *Error:* No pude reincorporarlo automáticamente (Privacidad o error de API).\n` +
                                `📨 *Solución:* Enviando invitación privada...`;

                            // Intentar invitar si falla el add directo
                            try {
                                const inviteCode = await sock.groupInviteCode(id);
                                await sock.sendMessage(userToRescue, {
                                    text: `🛡️ *SISTEMA DE SEGURIDAD*\n\n` +
                                        `⚠️ *Intento de expulsión detectado*\n\n` +
                                        `👮‍♂️ *Agresor:* @${actorClean}\n` +
                                        `🏠 *Grupo:* ${id}\n\n` +
                                        `El sistema intentó reincorporarte pero tu configuración de privacidad lo impidió. Usa este enlace:\nhttps://chat.whatsapp.com/${inviteCode}`,
                                    mentions: [actor || '']
                                });
                            } catch (e) {
                                console.error('Error enviando invitación:', e);
                            }
                        }

                        // 3. Notificación Privada de Seguridad (Siempre)
                        try {
                            let groupSubject = id;
                            try {
                                const gMetadata = await sock.groupMetadata(id);
                                groupSubject = gMetadata.subject;
                            } catch (e) { }

                            await sock.sendMessage(userToRescue, {
                                text: `🛡️ *ALERTA DE SEGURIDAD*\n\n` +
                                    `Han intentado expulsarte de un grupo.\n\n` +
                                    `🏠 *Grupo:* ${groupSubject}\n` +
                                    `👮‍♂️ *Agresor:* @${actorClean}`,
                                mentions: [actor || '']
                            });
                        } catch (e) {
                            console.error('Error enviando alerta privada:', e);
                        }
                    }

                    // Enviar mensaje si se generó
                    if (messageText) {
                        await sock.sendMessage(id, { text: messageText, mentions: mentions });
                    }
                }
            }
        }

        // --- LÓGICA DE BIENVENIDA (SOLO SI EL BOT ESTÁ ACTIVO) ---
        if (action === 'add') {
            // Verificar si el bot está activo
            if (!getBotStatus()) return;

            // Agrupar todos los nuevos miembros en un solo mensaje
            if (participants.length > 0) {
                // Crear lista de menciones
                const mentions = participants.map(p => `@${p.split('@')[0]}`).join('\n');

                // Mensaje de bienvenida grupal
                const welcomeMessage = participants.length === 1
                    ? `👋 *¡Bienvenido/a al grupo!*\n\n${mentions}\n\n✨ Escribe *.menu* para ver todos los comandos disponibles.`
                    : `👋 *¡Bienvenidos al grupo!*\n\n${mentions}\n\n✨ Escribe *.menu* para ver todos los comandos disponibles.`;

                // Obtener imagen de bienvenida
                const welcomeImage = getWelcomeImage();

                // Enviar mensaje con imagen
                await sendMessageWithImage(sock, id, welcomeMessage, welcomeImage, participants);
            }
        }
    });

    return sock;
}

// Iniciar Discord Rich Presence (solo un intento)
initDiscordPresence().catch(err => {
    // Silenciar errores - ya se manejan internamente
});



// 🔄 SISTEMA DE BACKUP AUTOMÁTICO (Cada 30 minutos)
const BACKUP_INTERVAL = 30 * 60 * 1000; // 30 minutos
setInterval(() => {
    console.log('\n⏰ [SISTEMA] Iniciando respaldo automático de Git (30 mins)...');
    exec('bash sync.sh', (error, stdout, stderr) => {
        if (error) {
            console.error('❌ Error en respaldo automático:', error.message);
            return;
        }
        console.log('✅ [SISTEMA] Respaldo automático completado exitosamente.');
    });
}, BACKUP_INTERVAL);


// Iniciar el bot
connectToWhatsApp().catch(err => {
    logger.error('Error al iniciar el bot:', err);
    process.exit(1);
});

// Manejo de errores no capturados
process.on('uncaughtException', (err) => {
    logger.error('Uncaught Exception:', err);
});

process.on('unhandledRejection', (err) => {
    logger.error('Unhandled Rejection:', err);
});

// Cerrar Discord Presence al salir
process.on('SIGINT', () => {
    console.log('\n\n👋 Cerrando bot...');
    closeDiscordPresence();
    process.exit(0);
});

process.on('SIGTERM', () => {
    closeDiscordPresence();
    process.exit(0);
});
