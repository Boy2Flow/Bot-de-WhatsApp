import fs from 'fs';
import path from 'path';
import { config as privilegedConfig } from '../config/privilegedUsers.js';

// Archivo para almacenar la lista de solteras
const SOLTERAS_FILE = path.join(process.cwd(), 'solteras.json');

// Inicializar archivo si no existe
if (!fs.existsSync(SOLTERAS_FILE)) {
    fs.writeFileSync(SOLTERAS_FILE, JSON.stringify({}));
}

// Cargar solteras
function loadSolteras() {
    try {
        const data = fs.readFileSync(SOLTERAS_FILE, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error al cargar solteras:', error);
        return {};
    }
}

// Guardar solteras
function saveSolteras(data) {
    try {
        fs.writeFileSync(SOLTERAS_FILE, JSON.stringify(data, null, 2));
    } catch (error) {
        console.error('Error al guardar solteras:', error);
    }
}

// Comando .soltera - Añadir a la lista (Solo Dueño)
export const addSolteraCommand = {
    name: 'soltera',
    aliases: ['addsoltera', 'nuevaSoltera'],
    description: 'Añade una usuaria a la lista de solteras (Solo Dueño)',
    groupOnly: true,
    execute: async (sock, message, args) => {
        const from = message.key.remoteJid;
        
        // Obtener ID del remitente y limpiar el número
        const senderJid = message.key.participant || message.key.remoteJid;
        const senderNumber = senderJid.split('@')[0].replace(/[^0-9]/g, '');
        
        // Verificar si es el dueño
        if (!privilegedConfig.isSuperAdmin(senderJid)) {
            await sock.sendMessage(from, { 
                text: '⛔ Solo el dueño del bot puede declarar a una soltera oficial.' 
            }, { quoted: message });
            return;
        }

        // Verificar mención
        const mentionedJid = message.message?.extendedTextMessage?.contextInfo?.mentionedJid;
        
        if (!mentionedJid || mentionedJid.length === 0) {
            await sock.sendMessage(from, { 
                text: '❌ Debes mencionar a la futura soltera.\n\n📝 Uso: .soltera @user' 
            }, { quoted: message });
            return;
        }

        const targetUser = mentionedJid[0];
        const solteras = loadSolteras();

        // Inicializar grupo si no existe
        if (!solteras[from]) {
            solteras[from] = [];
        }

        // Verificar si ya está en la lista
        if (solteras[from].includes(targetUser)) {
            await sock.sendMessage(from, {
                text: `⚠️ La usuaria @${targetUser.split('@')[0]} ya está en la lista de solteras.`,
                mentions: [targetUser]
            }, { quoted: message });
            return;
        }

        // Añadir a la lista
        solteras[from].push(targetUser);
        saveSolteras(solteras);

        // Mensaje gracioso/obsceno
        const anuncio = `
💃 *¡NUEVA SOLTERA EN EL ÁREA!* 💃

🔥 Atención a todos los presentes 🔥

La usuaria @${targetUser.split('@')[0]} ha sido declarada oficialmente:

✨ *SOLTERA, GUARRA Y DESESPERADA* ✨

📢 *"Busco hombre ibérico, empotrador y con buena herramienta para destrozarme el... corazón"* 😈🍆

⚠️ Interesados formen fila de a uno.
🚫 Abstenerse pito-cortos.

💘 ¡A CAZAR SE HA DICHO! 💘
        `.trim();

        await sock.sendMessage(from, {
            text: anuncio,
            mentions: [targetUser]
        });
    }
};

// Comando .solteras - Ver lista
export const listSolterasCommand = {
    name: 'solteras',
    aliases: ['listsolteras', 'listasolteras'],
    description: 'Muestra la lista de solteras del grupo',
    groupOnly: true,
    execute: async (sock, message, args) => {
        const from = message.key.remoteJid;
        const solteras = loadSolteras();

        if (!solteras[from] || solteras[from].length === 0) {
            await sock.sendMessage(from, {
                text: '🤷‍♀️ No hay solteras registradas en este grupo (o todas están casadas).'
            }, { quoted: message });
            return;
        }

        let text = '💃 *LISTA DE SOLTERAS DISPONIBLES* 💃\n\n';
        text += '━━━━━━━━━━━━━━━━━━━━━━━━━━\n';
        
        solteras[from].forEach((user, index) => {
            text += `${index + 1}. 🔥 @${user.split('@')[0]}\n`;
        });
        
        text += '━━━━━━━━━━━━━━━━━━━━━━━━━━\n';
        text += '\n😈 ¡Aprovechen ofertas limitadas! 😈';

        await sock.sendMessage(from, {
            text: text,
            mentions: solteras[from]
        }, { quoted: message });
    }
};

// Comando .removesoltera - Quitar de la lista (Solo Dueño)
export const removeSolteraCommand = {
    name: 'removesoltera',
    aliases: ['quitsoltera', 'unsoltera'],
    description: 'Saca a una usuaria de la lista de solteras (Solo Dueño)',
    groupOnly: true,
    execute: async (sock, message, args) => {
        const from = message.key.remoteJid;
        
        // Verificar dueño
        const senderJid = message.key.participant || message.key.remoteJid;
        const senderNumber = senderJid.split('@')[0].replace(/[^0-9]/g, '');
        if (!privilegedConfig.isSuperAdmin(senderJid)) {
            await sock.sendMessage(from, { text: '⛔ Solo el dueño administra el ganado.' }, { quoted: message });
            return;
        }

        const mentionedJid = message.message?.extendedTextMessage?.contextInfo?.mentionedJid;
        
        if (!mentionedJid || mentionedJid.length === 0) {
            await sock.sendMessage(from, { text: '❌ Menciona a quien quieres sacar de la lista.' }, { quoted: message });
            return;
        }

        const targetUser = mentionedJid[0];
        const solteras = loadSolteras();

        if (!solteras[from] || !solteras[from].includes(targetUser)) {
            await sock.sendMessage(from, { text: '⚠️ Esa usuaria no está en la lista.' }, { quoted: message });
            return;
        }

        solteras[from] = solteras[from].filter(u => u !== targetUser);
        saveSolteras(solteras);

        await sock.sendMessage(from, {
            text: `✅ @${targetUser.split('@')[0]} ha sido retirada de la lista de solteras. (¿Ya encontró a su empotrador? 🤔)`,
            mentions: [targetUser]
        }, { quoted: message });
    }
};

export const solterasCommands = [
    addSolteraCommand,
    listSolterasCommand,
    removeSolteraCommand
];
