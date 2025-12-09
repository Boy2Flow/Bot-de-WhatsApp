import fs from 'fs';
import path from 'path';

// Archivo para almacenar las listas personalizadas
const LISTS_FILE = path.join(process.cwd(), 'customLists.json');

// Inicializar archivo si no existe
if (!fs.existsSync(LISTS_FILE)) {
    fs.writeFileSync(LISTS_FILE, JSON.stringify({}));
}

// Cargar listas
function loadLists() {
    try {
        const data = fs.readFileSync(LISTS_FILE, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error al cargar listas:', error);
        return {};
    }
}

// Guardar listas
function saveLists(lists) {
    try {
        fs.writeFileSync(LISTS_FILE, JSON.stringify(lists, null, 2));
    } catch (error) {
        console.error('Error al guardar listas:', error);
    }
}

// Comando .addlist - Añadir usuario a una lista
export const addListCommand = {
    name: 'addlist',
    aliases: ['addlista', 'añadirlista', 'agregarlist'],
    description: 'Añade un usuario a una lista personalizada',
    groupOnly: true,
    adminOnly: true,
    execute: async (sock, message, args) => {
        try {
            const from = message.key.remoteJid;
            
            // Verificar que se proporcionó el nombre de la lista
            if (!args[0]) {
                await sock.sendMessage(from, {
                    text: '❌ Debes especificar el nombre de la lista.\n\n📝 Uso: .addlist [nombre] @usuario\n💡 Ejemplo: .addlist maricones @usuario'
                }, { quoted: message });
                return;
            }
            
            const listName = args[0].toLowerCase();
            
            // Verificar si se mencionó a alguien
            const mentionedJid = message.message?.extendedTextMessage?.contextInfo?.mentionedJid;
            
            if (!mentionedJid || mentionedJid.length === 0) {
                await sock.sendMessage(from, {
                    text: '❌ Debes mencionar al usuario que deseas añadir.\n\n📝 Uso: .addlist [nombre] @usuario'
                }, { quoted: message });
                return;
            }
            
            const userToAdd = mentionedJid[0];
            const lists = loadLists();
            
            // Inicializar estructura para el grupo si no existe
            if (!lists[from]) {
                lists[from] = {};
            }
            
            // Inicializar array para la lista si no existe
            if (!lists[from][listName]) {
                lists[from][listName] = [];
            }
            
            // Verificar si el usuario ya está en la lista
            if (lists[from][listName].includes(userToAdd)) {
                await sock.sendMessage(from, {
                    text: `⚠️ El usuario @${userToAdd.split('@')[0]} ya está en la lista "${listName}".`,
                    mentions: [userToAdd]
                }, { quoted: message });
                return;
            }
            
            // Añadir usuario a la lista
            lists[from][listName].push(userToAdd);
            saveLists(lists);
            
            await sock.sendMessage(from, {
                text: `✅ Usuario @${userToAdd.split('@')[0]} añadido a la lista "${listName}".\n\n` +
                      `👥 Total en la lista: ${lists[from][listName].length}\n\n` +
                      `Para ver la lista usa: .showlist ${listName}`,
                mentions: [userToAdd]
            }, { quoted: message });

        } catch (error) {
            console.error('Error en comando addlist:', error);
            await sock.sendMessage(message.key.remoteJid, {
                text: '❌ Error al añadir usuario a la lista.'
            }, { quoted: message });
        }
    }
};

// Comando .removelist - Quitar usuario de una lista
export const removeListCommand = {
    name: 'removelist',
    aliases: ['removelista', 'quitarlista', 'removerlista'],
    description: 'Quita un usuario de una lista personalizada',
    groupOnly: true,
    adminOnly: true,
    execute: async (sock, message, args) => {
        try {
            const from = message.key.remoteJid;
            
            if (!args[0]) {
                await sock.sendMessage(from, {
                    text: '❌ Debes especificar el nombre de la lista.\n\n📝 Uso: .removelist [nombre] @usuario'
                }, { quoted: message });
                return;
            }
            
            const listName = args[0].toLowerCase();
            const mentionedJid = message.message?.extendedTextMessage?.contextInfo?.mentionedJid;
            
            if (!mentionedJid || mentionedJid.length === 0) {
                await sock.sendMessage(from, {
                    text: '❌ Debes mencionar al usuario que deseas quitar.\n\n📝 Uso: .removelist [nombre] @usuario'
                }, { quoted: message });
                return;
            }
            
            const userToRemove = mentionedJid[0];
            const lists = loadLists();
            
            // Verificar si la lista existe
            if (!lists[from] || !lists[from][listName]) {
                await sock.sendMessage(from, {
                    text: `⚠️ La lista "${listName}" no existe.`
                }, { quoted: message });
                return;
            }
            
            // Verificar si el usuario está en la lista
            if (!lists[from][listName].includes(userToRemove)) {
                await sock.sendMessage(from, {
                    text: `⚠️ El usuario @${userToRemove.split('@')[0]} no está en la lista "${listName}".`,
                    mentions: [userToRemove]
                }, { quoted: message });
                return;
            }
            
            // Quitar usuario de la lista
            lists[from][listName] = lists[from][listName].filter(user => user !== userToRemove);
            
            // Si la lista queda vacía, eliminarla
            if (lists[from][listName].length === 0) {
                delete lists[from][listName];
            }
            
            saveLists(lists);
            
            await sock.sendMessage(from, {
                text: `✅ Usuario @${userToRemove.split('@')[0]} eliminado de la lista "${listName}".`,
                mentions: [userToRemove]
            }, { quoted: message });

        } catch (error) {
            console.error('Error en comando removelist:', error);
            await sock.sendMessage(message.key.remoteJid, {
                text: '❌ Error al quitar usuario de la lista.'
            }, { quoted: message });
        }
    }
};

// Comando .showlist - Mostrar una lista
export const showListCommand = {
    name: 'showlist',
    aliases: ['verlista', 'mostrarlist'],
    description: 'Muestra y menciona a todos los usuarios de una lista',
    groupOnly: true,
    adminOnly: false,
    execute: async (sock, message, args) => {
        try {
            const from = message.key.remoteJid;
            
            if (!args[0]) {
                await sock.sendMessage(from, {
                    text: '❌ Debes especificar el nombre de la lista.\n\n📝 Uso: .showlist [nombre]\n💡 Ejemplo: .showlist maricones'
                }, { quoted: message });
                return;
            }
            
            const listName = args[0].toLowerCase();
            const lists = loadLists();
            
            // Verificar si la lista existe
            if (!lists[from] || !lists[from][listName] || lists[from][listName].length === 0) {
                await sock.sendMessage(from, {
                    text: `⚠️ La lista "${listName}" no existe o está vacía.`
                }, { quoted: message });
                return;
            }
            
            const users = lists[from][listName];
            
            // Crear mensaje con la lista
            let text = `📋 *LISTA DE ${listName.toUpperCase()}*\n\n`;
            text += '━━━━━━━━━━━━━━━━━━━\n';
            
            users.forEach((userId, index) => {
                text += `${index + 1}. @${userId.split('@')[0]}\n`;
            });
            
            text += '━━━━━━━━━━━━━━━━━━━\n';
            text += `\n👥 Total: ${users.length} usuario(s)`;
            
            await sock.sendMessage(from, {
                text: text,
                mentions: users
            }, { quoted: message });

        } catch (error) {
            console.error('Error en comando showlist:', error);
            await sock.sendMessage(message.key.remoteJid, {
                text: '❌ Error al mostrar la lista.'
            }, { quoted: message });
        }
    }
};

// Comando .lists - Ver todas las listas del grupo
export const listsCommand = {
    name: 'lists',
    aliases: ['listas', 'verlist'],
    description: 'Muestra todas las listas del grupo',
    groupOnly: true,
    adminOnly: false,
    execute: async (sock, message, args) => {
        try {
            const from = message.key.remoteJid;
            const lists = loadLists();
            
            // Verificar si hay listas en este grupo
            if (!lists[from] || Object.keys(lists[from]).length === 0) {
                await sock.sendMessage(from, {
                    text: '📋 No hay listas creadas en este grupo.\n\n💡 Crea una con: .addlist [nombre] @usuario'
                }, { quoted: message });
                return;
            }
            
            // Crear lista de todas las listas
            let text = '📋 *LISTAS DEL GRUPO*\n\n';
            text += '━━━━━━━━━━━━━━━━━━━\n';
            
            const listNames = Object.keys(lists[from]);
            
            listNames.forEach((listName, index) => {
                const count = lists[from][listName].length;
                text += `\n${index + 1}. *${listName}*\n`;
                text += `   👥 ${count} usuario(s)\n`;
            });
            
            text += '\n━━━━━━━━━━━━━━━━━━━\n';
            text += `\n📊 Total: ${listNames.length} lista(s)\n\n`;
            text += '💡 Usa .showlist [nombre] para ver una lista';
            
            await sock.sendMessage(from, {
                text: text
            }, { quoted: message });

        } catch (error) {
            console.error('Error en comando lists:', error);
            await sock.sendMessage(message.key.remoteJid, {
                text: '❌ Error al obtener las listas.'
            }, { quoted: message });
        }
    }
};

// Comando .deletelist - Eliminar una lista completa
export const deleteListCommand = {
    name: 'deletelist',
    aliases: ['clearlista', 'borrarlista', 'eliminarlista'],
    description: 'Elimina una lista completa',
    groupOnly: true,
    adminOnly: true,
    execute: async (sock, message, args) => {
        try {
            const from = message.key.remoteJid;
            
            if (!args[0]) {
                await sock.sendMessage(from, {
                    text: '❌ Debes especificar el nombre de la lista.\n\n📝 Uso: .deletelist [nombre]'
                }, { quoted: message });
                return;
            }
            
            const listName = args[0].toLowerCase();
            const lists = loadLists();
            
            // Verificar si la lista existe
            if (!lists[from] || !lists[from][listName]) {
                await sock.sendMessage(from, {
                    text: `⚠️ La lista "${listName}" no existe.`
                }, { quoted: message });
                return;
            }
            
            const userCount = lists[from][listName].length;
            
            // Eliminar la lista
            delete lists[from][listName];
            saveLists(lists);
            
            await sock.sendMessage(from, {
                text: `✅ Lista "${listName}" eliminada.\n\n🗑️ Se eliminaron ${userCount} usuario(s).`
            }, { quoted: message });

        } catch (error) {
            console.error('Error en comando deletelist:', error);
            await sock.sendMessage(message.key.remoteJid, {
                text: '❌ Error al eliminar la lista.'
            }, { quoted: message });
        }
    }
};

export const customListCommands = [
    addListCommand,
    removeListCommand,
    showListCommand,
    listsCommand,
    deleteListCommand
];
