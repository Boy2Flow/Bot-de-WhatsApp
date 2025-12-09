import DiscordRPC from 'discord-rpc';
import { logger } from './logger.js';

// ID de la aplicación de Discord (necesitas crear una en https://discord.com/developers/applications)
const CLIENT_ID = '1447639717167497278';

let rpc = null;
let startTimestamp = new Date(); // ✨ Timestamp fijo desde el inicio de la aplicación
let isConnected = false;
let connectionAttempts = 0;
let maxAttempts = 3;
let isRetrying = false;
let isInitialized = false; // 🔒 Bandera para evitar múltiples inicializaciones
let botStats = {
    groups: 0,
    messages: 0,
    users: 0
};

/**
 * Inicializa Discord Rich Presence (solo una vez por sesión)
 */
export async function initDiscordPresence() {
    // Si ya está inicializado, no hacer nada
    if (isInitialized) {
        logger.info('ℹ️ Discord Rich Presence ya está inicializado');
        return;
    }
    
    // Si ya estamos reintentando, no hacer nada
    if (isRetrying) return;
    
    // Si ya alcanzamos el máximo de intentos, no reintentar
    if (connectionAttempts >= maxAttempts) {
        if (connectionAttempts === maxAttempts) {
            logger.warn('⚠️ Discord Rich Presence deshabilitado después de múltiples intentos');
            logger.warn('💡 El bot funcionará normalmente sin Discord Rich Presence');
            connectionAttempts++; // Incrementar para no mostrar este mensaje de nuevo
        }
        return;
    }

    connectionAttempts++;
    isRetrying = true;

    try {
        // Desactivar la reconexión automática de Discord RPC
        DiscordRPC.register(CLIENT_ID);
        
        // Crear cliente RPC sin reconexión automática
        rpc = new DiscordRPC.Client({ 
            transport: 'ipc'
        });

        // NO reiniciar el timestamp - usar el que se estableció al cargar el módulo

        // Evento cuando se conecta
        rpc.on('ready', () => {
            isConnected = true;
            isInitialized = true; // 🔒 Marcar como inicializado para evitar reinicios
            connectionAttempts = 0; // Resetear intentos al conectar exitosamente
            isRetrying = false;
            logger.success('✅ Discord Rich Presence conectado');
            
            // Si ya tenemos estadísticas (el bot ya arrancó), mostrarlas
            if (botStats.groups > 0) {
                updatePresence('Bot WhatsApp', `${botStats.groups} grupos activos`);
            } else {
                // Establecer presencia inicial
                updatePresence('Iniciando...', '🔄 Conectando a WhatsApp');
            }
        });

        // Manejar errores - NO reintentar automáticamente
        rpc.on('error', (error) => {
            // Silenciar errores de conexión si ya sabemos que Discord no está disponible
            if (connectionAttempts < maxAttempts) {
                logger.error('❌ Error en Discord RPC:', error.message);
            }
            isConnected = false;
            isRetrying = false;
        });

        // Manejar desconexión
        rpc.on('disconnected', () => {
            isConnected = false;
            isRetrying = false;
        });

        // Conectar al cliente de Discord con timeout
        const loginPromise = rpc.login({ clientId: CLIENT_ID });
        const timeoutPromise = new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Timeout')), 5000)
        );

        await Promise.race([loginPromise, timeoutPromise]);
        isRetrying = false;

    } catch (error) {
        isRetrying = false;
        
        if (connectionAttempts === 1) {
            logger.warn('⚠️ No se pudo conectar a Discord Rich Presence');
            logger.warn('💡 Asegúrate de que Discord esté abierto');
            logger.warn('💡 El bot funcionará normalmente sin Discord Rich Presence');
        }
        
        // Limpiar el cliente si falló
        if (rpc) {
            try {
                rpc.destroy();
            } catch (e) {
                // Ignorar errores al destruir
            }
            rpc = null;
        }
    }
}

/**
 * Actualiza el estado de Discord
 * @param {string} details - Línea principal
 * @param {string} state - Línea secundaria
 * @param {object} options - Opciones adicionales
 */
export function updatePresence(details, state, options = {}) {
    if (!rpc || !isConnected) return;

    try {
        const activity = {
            details: (details || 'Bot de WhatsApp').substring(0, 128),
            state: (state || 'Activo').substring(0, 128),
            startTimestamp: startTimestamp,
            largeImageKey: 'troll_logo',
            largeImageText: 'Bot WhatsApp',
            instance: false
        };

        rpc.setActivity(activity);
    } catch (error) {
        logger.error('Error actualizando presencia:', error.message);
    }
}

/**
 * Actualiza las estadísticas del bot
 * @param {object} stats - Estadísticas del bot
 */
export function updateBotStats(stats) {
    botStats = { ...botStats, ...stats };
    
    const details = `Bot Conectado`;
    const state = `${botStats.groups} grupos activos`;
    
    updatePresence(details, state);
}

/**
 * Establece el estado como "Conectado"
 */
export function setConnectedStatus() {
    updatePresence(
        'Bot Conectado',
        `${botStats.groups} grupos activos`
    );
}

/**
 * Establece el estado como "Desconectado"
 */
export function setDisconnectedStatus() {
    updatePresence(
        'Bot Desconectado',
        'Reconectando...'
    );
}

/**
 * Establece el estado como "Procesando"
 */
export function setProcessingStatus(action) {
    updatePresence(
        action,
        `${botStats.groups} grupos`
    );
}

/**
 * Cierra la conexión de Discord RPC
 */
export function closeDiscordPresence() {
    if (rpc && isConnected) {
        try {
            rpc.clearActivity();
            rpc.destroy();
            isConnected = false;
            isInitialized = false; // 🔓 Permitir reinicializar si se vuelve a abrir
            logger.info('Discord Rich Presence cerrado');
        } catch (error) {
            logger.error('Error cerrando Discord RPC:', error.message);
        }
    }
}

/**
 * Verifica si está conectado
 */
export function isDiscordConnected() {
    return isConnected;
}

// Exportar el cliente por si se necesita acceso directo
export { rpc };
