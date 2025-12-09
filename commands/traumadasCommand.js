import fs from 'fs';
import path from 'path';

// Archivo para almacenar la lista de traumadas
const TRAUMADAS_FILE = path.join(process.cwd(), 'traumadas.json');

// Inicializar archivo si no existe
if (!fs.existsSync(TRAUMADAS_FILE)) {
    fs.writeFileSync(TRAUMADAS_FILE, JSON.stringify({}));
}

// Cargar lista de traumadas
function loadTraumadas() {
    try {
        const data = fs.readFileSync(TRAUMADAS_FILE, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error al cargar traumadas:', error);
        return {};
    }
}

// Guardar lista de traumadas
function saveTraumadas(traumadas) {
    try {
        fs.writeFileSync(TRAUMADAS_FILE, JSON.stringify(traumadas, null, 2));
    } catch (error) {
        console.error('Error al guardar traumadas:', error);
    }
}

// Comando .addtraumada - Añadir a la lista de traumadas
export const addTraumadaCommand = {
    name: 'addtraumada',
    aliases: ['añadirtraumada', 'agregartraumada'],
    description: 'Añade un usuario a la lista de traumadas',
    groupOnly: true,
    adminOnly: true,
    execute: async (sock, message, args) => {
        try {
            const from = message.key.remoteJid;
            
            // Verificar si se mencionó a alguien
            const mentionedJid = message.message?.extendedTextMessage?.contextInfo?.mentionedJid;
            
            if (!mentionedJid || mentionedJid.length === 0) {
                await sock.sendMessage(from, {
                    text: '❌ Debes mencionar al usuario que deseas añadir.\n\n📝 Uso: .addtraumada @usuario'
                }, { quoted: message });
                return;
            }
            
            const userToAdd = mentionedJid[0];
            const traumadas = loadTraumadas();
            
            // Inicializar array para el grupo si no existe
            if (!traumadas[from]) {
                traumadas[from] = [];
            }
            
            // Verificar si el usuario ya está en la lista
            if (traumadas[from].includes(userToAdd)) {
                await sock.sendMessage(from, {
                    text: `⚠️ El usuario @${userToAdd.split('@')[0]} ya está en la lista de traumadas.`,
                    mentions: [userToAdd]
                }, { quoted: message });
                return;
            }
            
            // Añadir usuario a la lista
            traumadas[from].push(userToAdd);
            saveTraumadas(traumadas);
            
            await sock.sendMessage(from, {
                text: `✅ Usuario @${userToAdd.split('@')[0]} añadido a la lista de traumadas.\n\n` +
                      `👥 Total en la lista: ${traumadas[from].length}\n\n` +
                      `Para ver la lista usa: .traumadas`,
                mentions: [userToAdd]
            }, { quoted: message });

        } catch (error) {
            console.error('Error en comando addtraumada:', error);
            await sock.sendMessage(message.key.remoteJid, {
                text: '❌ Error al añadir usuario a la lista de traumadas.'
            }, { quoted: message });
        }
    }
};

// Comando .removetraumada - Quitar de la lista de traumadas
export const removeTraumadaCommand = {
    name: 'removetraumada',
    aliases: ['quitartraumada', 'removertraumada'],
    description: 'Quita un usuario de la lista de traumadas',
    groupOnly: true,
    adminOnly: true,
    execute: async (sock, message, args) => {
        try {
            const from = message.key.remoteJid;
            
            const mentionedJid = message.message?.extendedTextMessage?.contextInfo?.mentionedJid;
            
            if (!mentionedJid || mentionedJid.length === 0) {
                await sock.sendMessage(from, {
                    text: '❌ Debes mencionar al usuario que deseas quitar.\n\n📝 Uso: .removetraumada @usuario'
                }, { quoted: message });
                return;
            }
            
            const userToRemove = mentionedJid[0];
            const traumadas = loadTraumadas();
            
            // Verificar si la lista existe
            if (!traumadas[from] || traumadas[from].length === 0) {
                await sock.sendMessage(from, {
                    text: '⚠️ La lista de traumadas está vacía.'
                }, { quoted: message });
                return;
            }
            
            // Verificar si el usuario está en la lista
            if (!traumadas[from].includes(userToRemove)) {
                await sock.sendMessage(from, {
                    text: `⚠️ El usuario @${userToRemove.split('@')[0]} no está en la lista de traumadas.`,
                    mentions: [userToRemove]
                }, { quoted: message });
                return;
            }
            
            // Quitar usuario de la lista
            traumadas[from] = traumadas[from].filter(user => user !== userToRemove);
            saveTraumadas(traumadas);
            
            await sock.sendMessage(from, {
                text: `✅ Usuario @${userToRemove.split('@')[0]} eliminado de la lista de traumadas.`,
                mentions: [userToRemove]
            }, { quoted: message });

        } catch (error) {
            console.error('Error en comando removetraumada:', error);
            await sock.sendMessage(message.key.remoteJid, {
                text: '❌ Error al quitar usuario de la lista de traumadas.'
            }, { quoted: message });
        }
    }
};

// Comando .traumadas - Mostrar lista de traumadas
export const traumadasCommand = {
    name: 'traumadas',
    aliases: ['listatraumadas', 'vertraumadas'],
    description: 'Muestra la lista de traumadas y las menciona',
    groupOnly: true,
    adminOnly: false,
    execute: async (sock, message, args) => {
        try {
            const from = message.key.remoteJid;
            const traumadas = loadTraumadas();
            
            // Verificar si hay traumadas en este grupo
            if (!traumadas[from] || traumadas[from].length === 0) {
                await sock.sendMessage(from, {
                    text: '✅ No hay traumadas en la lista de este grupo.\n\n💡 Añade con: .addtraumada @usuario'
                }, { quoted: message });
                return;
            }
            
            // Crear mensaje con la lista
            let text = '💔 *LISTA DE TRAUMADAS* 💔\n\n';
            text += '━━━━━━━━━━━━━━━━━━━\n';
            
            traumadas[from].forEach((userId, index) => {
                text += `${index + 1}. @${userId.split('@')[0]}\n`;
            });
            
            text += '━━━━━━━━━━━━━━━━━━━\n';
            text += `\n👥 Total: ${traumadas[from].length} traumada(s)`;
            
            await sock.sendMessage(from, {
                text: text,
                mentions: traumadas[from]
            }, { quoted: message });

        } catch (error) {
            console.error('Error en comando traumadas:', error);
            await sock.sendMessage(message.key.remoteJid, {
                text: '❌ Error al mostrar la lista de traumadas.'
            }, { quoted: message });
        }
    }
};

export const traumadasCommands = [
    addTraumadaCommand,
    removeTraumadaCommand,
    traumadasCommand
];
