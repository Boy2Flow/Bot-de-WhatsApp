import fs from 'fs';
import path from 'path';

// Archivo para almacenar la lista de maricones
const MARICONES_FILE = path.join(process.cwd(), 'maricones.json');

// Inicializar archivo si no existe
if (!fs.existsSync(MARICONES_FILE)) {
    fs.writeFileSync(MARICONES_FILE, JSON.stringify({}));
}

// Cargar lista de maricones
function loadMaricones() {
    try {
        const data = fs.readFileSync(MARICONES_FILE, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error al cargar maricones:', error);
        return {};
    }
}

// Guardar lista de maricones
function saveMaricones(maricones) {
    try {
        fs.writeFileSync(MARICONES_FILE, JSON.stringify(maricones, null, 2));
    } catch (error) {
        console.error('Error al guardar maricones:', error);
    }
}

// Comando .addmaricon - Añadir a la lista de maricones
export const addMariconCommand = {
    name: 'addmaricon',
    aliases: ['añadirmaricon', 'agregarmaricon'],
    description: 'Añade un usuario a la lista de maricones',
    groupOnly: true,
    adminOnly: true,
    execute: async (sock, message, args) => {
        try {
            const from = message.key.remoteJid;
            
            // Verificar si se mencionó a alguien
            const mentionedJid = message.message?.extendedTextMessage?.contextInfo?.mentionedJid;
            
            if (!mentionedJid || mentionedJid.length === 0) {
                await sock.sendMessage(from, {
                    text: '❌ Debes mencionar al usuario que deseas añadir.\n\n📝 Uso: .addmaricon @usuario'
                }, { quoted: message });
                return;
            }
            
            const userToAdd = mentionedJid[0];
            const maricones = loadMaricones();
            
            // Inicializar array para el grupo si no existe
            if (!maricones[from]) {
                maricones[from] = [];
            }
            
            // Verificar si el usuario ya está en la lista
            if (maricones[from].includes(userToAdd)) {
                await sock.sendMessage(from, {
                    text: `⚠️ El usuario @${userToAdd.split('@')[0]} ya está en la lista de maricones.`,
                    mentions: [userToAdd]
                }, { quoted: message });
                return;
            }
            
            // Añadir usuario a la lista
            maricones[from].push(userToAdd);
            saveMaricones(maricones);
            
            await sock.sendMessage(from, {
                text: `✅ Usuario @${userToAdd.split('@')[0]} añadido a la lista de maricones.\n\n` +
                      `👥 Total en la lista: ${maricones[from].length}\n\n` +
                      `Para ver la lista usa: .maricones`,
                mentions: [userToAdd]
            }, { quoted: message });

        } catch (error) {
            console.error('Error en comando addmaricon:', error);
            await sock.sendMessage(message.key.remoteJid, {
                text: '❌ Error al añadir usuario a la lista de maricones.'
            }, { quoted: message });
        }
    }
};

// Comando .removemaricon - Quitar de la lista de maricones
export const removeMariconCommand = {
    name: 'removemaricon',
    aliases: ['quitarmaricon', 'removermaricon'],
    description: 'Quita un usuario de la lista de maricones',
    groupOnly: true,
    adminOnly: true,
    execute: async (sock, message, args) => {
        try {
            const from = message.key.remoteJid;
            
            const mentionedJid = message.message?.extendedTextMessage?.contextInfo?.mentionedJid;
            
            if (!mentionedJid || mentionedJid.length === 0) {
                await sock.sendMessage(from, {
                    text: '❌ Debes mencionar al usuario que deseas quitar.\n\n📝 Uso: .removemaricon @usuario'
                }, { quoted: message });
                return;
            }
            
            const userToRemove = mentionedJid[0];
            const maricones = loadMaricones();
            
            // Verificar si la lista existe
            if (!maricones[from] || maricones[from].length === 0) {
                await sock.sendMessage(from, {
                    text: '⚠️ La lista de maricones está vacía.'
                }, { quoted: message });
                return;
            }
            
            // Verificar si el usuario está en la lista
            if (!maricones[from].includes(userToRemove)) {
                await sock.sendMessage(from, {
                    text: `⚠️ El usuario @${userToRemove.split('@')[0]} no está en la lista de maricones.`,
                    mentions: [userToRemove]
                }, { quoted: message });
                return;
            }
            
            // Quitar usuario de la lista
            maricones[from] = maricones[from].filter(user => user !== userToRemove);
            saveMaricones(maricones);
            
            await sock.sendMessage(from, {
                text: `✅ Usuario @${userToRemove.split('@')[0]} eliminado de la lista de maricones.`,
                mentions: [userToRemove]
            }, { quoted: message });

        } catch (error) {
            console.error('Error en comando removemaricon:', error);
            await sock.sendMessage(message.key.remoteJid, {
                text: '❌ Error al quitar usuario de la lista de maricones.'
            }, { quoted: message });
        }
    }
};

// Comando .maricones - Mostrar lista de maricones
export const mariconesCommand = {
    name: 'maricones',
    aliases: ['listamaricones', 'vermaricones'],
    description: 'Muestra la lista de maricones y los menciona',
    groupOnly: true,
    adminOnly: false,
    execute: async (sock, message, args) => {
        try {
            const from = message.key.remoteJid;
            const maricones = loadMaricones();
            
            // Verificar si hay maricones en este grupo
            if (!maricones[from] || maricones[from].length === 0) {
                await sock.sendMessage(from, {
                    text: '✅ No hay maricones en la lista de este grupo.\n\n💡 Añade con: .addmaricon @usuario'
                }, { quoted: message });
                return;
            }
            
            // Crear mensaje con la lista
            let text = '🏳️‍🌈 *LISTA DE MARICONES* 🏳️‍🌈\n\n';
            text += '━━━━━━━━━━━━━━━━━━━\n';
            
            maricones[from].forEach((userId, index) => {
                text += `${index + 1}. @${userId.split('@')[0]}\n`;
            });
            
            text += '━━━━━━━━━━━━━━━━━━━\n';
            text += `\n👥 Total: ${maricones[from].length} maricón(es)`;
            
            await sock.sendMessage(from, {
                text: text,
                mentions: maricones[from]
            }, { quoted: message });

        } catch (error) {
            console.error('Error en comando maricones:', error);
            await sock.sendMessage(message.key.remoteJid, {
                text: '❌ Error al mostrar la lista de maricones.'
            }, { quoted: message });
        }
    }
};

export const mariconesCommands = [
    addMariconCommand,
    removeMariconCommand,
    mariconesCommand
];
