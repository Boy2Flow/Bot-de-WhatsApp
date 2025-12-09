import fs from 'fs';
import path from 'path';
import { RACES } from './rpgData.js';
import { config as privilegedConfig } from '../../config/privilegedUsers.js';

const RPG_FILE = path.join(process.cwd(), 'rpg_data.json');

// Cargar datos
function loadRPG() {
    if (!fs.existsSync(RPG_FILE)) return {};
    try {
        return JSON.parse(fs.readFileSync(RPG_FILE, 'utf8'));
    } catch (e) {
        return {};
    }
}

// Guardar datos
function saveRPG(data) {
    fs.writeFileSync(RPG_FILE, JSON.stringify(data, null, 2));
}

// Super usuarios que pueden usar comandos de admin
// Super usuarios gestionados en privilegedUsers.js

export const rpgAdminCommand = {
    name: 'rpgadmin',
    aliases: ['rpga', 'adminrpg'],
    description: 'Comandos de administrador para el RPG',
    adminOnly: true,
    execute: async (sock, message, args) => {
        const from = message.key.remoteJid;
        const userId = message.key.participant || message.key.remoteJid;
        const subcommand = args[0]?.toLowerCase();

        // Verificar si es super usuario
        if (!privilegedConfig.isSuperAdmin(userId)) {
            await sock.sendMessage(from, { 
                text: '⛔ Este comando es exclusivo del dueño del bot.' 
            }, { quoted: message });
            return;
        }

        // --- MENÚ DE AYUDA ---
        if (!subcommand || subcommand === 'help' || subcommand === 'ayuda') {
            const helpText = `
🛡️ *ADMIN RPG - PANEL DE CONTROL* 🛡️

📋 *GESTIÓN DE JUGADORES*
🔹 *.rpgadmin delete @user* - Borrar personaje
🔹 *.rpgadmin reset @user* - Resetear a nivel 1
🔹 *.rpgadmin setlevel @user [nivel]* - Cambiar nivel
🔹 *.rpgadmin addgold @user [cantidad]* - Dar oro
🔹 *.rpgadmin heal @user* - Curar jugador
🔹 *.rpgadmin revive @user* - Revivir jugador

📊 *INFORMACIÓN*
🔹 *.rpgadmin stats @user* - Ver stats completos
🔹 *.rpgadmin list* - Listar todos los jugadores
🔹 *.rpgadmin top* - Top 10 jugadores

🗑️ *LIMPIEZA*
🔹 *.rpgadmin cleargroup* - Borrar todos los datos del grupo
🔹 *.rpgadmin clearall* - Borrar TODA la base de datos

⚙️ *MODIFICACIÓN AVANZADA*
🔹 *.rpgadmin setstat @user [stat] [valor]* - Cambiar stat
   Stats: str, agi, int, vit
🔹 *.rpgadmin godmode @user* - Modo dios (stats máximos)

💡 Todos los comandos requieren permisos de super admin
            `.trim();
            await sock.sendMessage(from, { text: helpText }, { quoted: message });
            return;
        }

        const data = loadRPG();
        if (!data[from]) data[from] = {};

        // --- DELETE: Borrar personaje ---
        if (subcommand === 'delete' || subcommand === 'borrar') {
            const mentionedJid = message.message?.extendedTextMessage?.contextInfo?.mentionedJid;
            if (!mentionedJid || mentionedJid.length === 0) {
                await sock.sendMessage(from, { 
                    text: '❌ Menciona al usuario: .rpgadmin delete @usuario' 
                }, { quoted: message });
                return;
            }

            const targetId = mentionedJid[0];
            if (data[from][targetId]) {
                delete data[from][targetId];
                saveRPG(data);
                await sock.sendMessage(from, { 
                    text: `✅ Personaje de @${targetId.split('@')[0]} eliminado.`,
                    mentions: [targetId]
                }, { quoted: message });
            } else {
                await sock.sendMessage(from, { 
                    text: '❌ Ese usuario no tiene personaje.' 
                }, { quoted: message });
            }
            return;
        }

        // --- RESET: Resetear a nivel 1 ---
        if (subcommand === 'reset' || subcommand === 'resetear') {
            const mentionedJid = message.message?.extendedTextMessage?.contextInfo?.mentionedJid;
            if (!mentionedJid || mentionedJid.length === 0) {
                await sock.sendMessage(from, { 
                    text: '❌ Menciona al usuario: .rpgadmin reset @usuario' 
                }, { quoted: message });
                return;
            }

            const targetId = mentionedJid[0];
            const player = data[from][targetId];
            
            if (!player) {
                await sock.sendMessage(from, { 
                    text: '❌ Ese usuario no tiene personaje.' 
                }, { quoted: message });
                return;
            }

            const race = RACES[player.race];
            data[from][targetId] = {
                race: player.race,
                level: 1,
                xp: 0,
                xpToNext: 100,
                hp: race.stats.vit * 10,
                maxHp: race.stats.vit * 10,
                mana: race.stats.int * 10,
                maxMana: race.stats.int * 10,
                stats: { ...race.stats },
                inventory: [],
                gold: 0,
                location: 'town',
                state: 'idle'
            };
            saveRPG(data);

            await sock.sendMessage(from, { 
                text: `🔄 Personaje de @${targetId.split('@')[0]} reseteado a nivel 1.`,
                mentions: [targetId]
            }, { quoted: message });
            return;
        }

        // --- SETLEVEL: Cambiar nivel ---
        if (subcommand === 'setlevel' || subcommand === 'nivel') {
            const mentionedJid = message.message?.extendedTextMessage?.contextInfo?.mentionedJid;
            const level = parseInt(args[1]);

            if (!mentionedJid || mentionedJid.length === 0 || isNaN(level) || level < 1 || level > 100) {
                await sock.sendMessage(from, { 
                    text: '❌ Uso: .rpgadmin setlevel @usuario [nivel]\nNivel entre 1 y 100' 
                }, { quoted: message });
                return;
            }

            const targetId = mentionedJid[0];
            const player = data[from][targetId];
            
            if (!player) {
                await sock.sendMessage(from, { 
                    text: '❌ Ese usuario no tiene personaje.' 
                }, { quoted: message });
                return;
            }

            player.level = level;
            player.xp = 0;
            player.xpToNext = Math.floor(100 * Math.pow(1.5, level - 1));
            
            // Recalcular stats y HP/Mana
            const race = RACES[player.race];
            const statBonus = level - 1;
            player.stats.str = race.stats.str + statBonus;
            player.stats.agi = race.stats.agi + statBonus;
            player.stats.int = race.stats.int + statBonus;
            player.stats.vit = race.stats.vit + statBonus;
            
            player.maxHp = player.stats.vit * 10;
            player.hp = player.maxHp;
            player.maxMana = player.stats.int * 10;
            player.mana = player.maxMana;

            saveRPG(data);

            await sock.sendMessage(from, { 
                text: `📊 @${targetId.split('@')[0]} ahora es nivel ${level}.`,
                mentions: [targetId]
            }, { quoted: message });
            return;
        }

        // --- ADDGOLD: Dar oro ---
        if (subcommand === 'addgold' || subcommand === 'oro') {
            const mentionedJid = message.message?.extendedTextMessage?.contextInfo?.mentionedJid;
            const amount = parseInt(args[1]);

            if (!mentionedJid || mentionedJid.length === 0 || isNaN(amount)) {
                await sock.sendMessage(from, { 
                    text: '❌ Uso: .rpgadmin addgold @usuario [cantidad]' 
                }, { quoted: message });
                return;
            }

            const targetId = mentionedJid[0];
            const player = data[from][targetId];
            
            if (!player) {
                await sock.sendMessage(from, { 
                    text: '❌ Ese usuario no tiene personaje.' 
                }, { quoted: message });
                return;
            }

            player.gold += amount;
            saveRPG(data);

            await sock.sendMessage(from, { 
                text: `💰 @${targetId.split('@')[0]} recibió ${amount} de oro. Total: ${player.gold}`,
                mentions: [targetId]
            }, { quoted: message });
            return;
        }

        // --- HEAL: Curar jugador ---
        if (subcommand === 'heal' || subcommand === 'curar') {
            const mentionedJid = message.message?.extendedTextMessage?.contextInfo?.mentionedJid;
            
            if (!mentionedJid || mentionedJid.length === 0) {
                await sock.sendMessage(from, { 
                    text: '❌ Uso: .rpgadmin heal @usuario' 
                }, { quoted: message });
                return;
            }

            const targetId = mentionedJid[0];
            const player = data[from][targetId];
            
            if (!player) {
                await sock.sendMessage(from, { 
                    text: '❌ Ese usuario no tiene personaje.' 
                }, { quoted: message });
                return;
            }

            player.hp = player.maxHp;
            player.mana = player.maxMana;
            saveRPG(data);

            await sock.sendMessage(from, { 
                text: `💖 @${targetId.split('@')[0]} ha sido curado completamente.`,
                mentions: [targetId]
            }, { quoted: message });
            return;
        }

        // --- REVIVE: Revivir jugador ---
        if (subcommand === 'revive' || subcommand === 'revivir') {
            const mentionedJid = message.message?.extendedTextMessage?.contextInfo?.mentionedJid;
            
            if (!mentionedJid || mentionedJid.length === 0) {
                await sock.sendMessage(from, { 
                    text: '❌ Uso: .rpgadmin revive @usuario' 
                }, { quoted: message });
                return;
            }

            const targetId = mentionedJid[0];
            const player = data[from][targetId];
            
            if (!player) {
                await sock.sendMessage(from, { 
                    text: '❌ Ese usuario no tiene personaje.' 
                }, { quoted: message });
                return;
            }

            player.hp = player.maxHp;
            player.mana = player.maxMana;
            player.state = 'idle';
            player.currentEnemy = null;
            saveRPG(data);

            await sock.sendMessage(from, { 
                text: `⚡ @${targetId.split('@')[0]} ha sido revivido.`,
                mentions: [targetId]
            }, { quoted: message });
            return;
        }

        // --- LIST: Listar jugadores ---
        if (subcommand === 'list' || subcommand === 'lista') {
            const players = Object.entries(data[from] || {});
            
            if (players.length === 0) {
                await sock.sendMessage(from, { 
                    text: '📋 No hay jugadores en este grupo.' 
                }, { quoted: message });
                return;
            }

            let text = '📋 *JUGADORES DEL GRUPO*\n\n';
            players.forEach(([id, player]) => {
                const race = RACES[player.race];
                text += `👤 @${id.split('@')[0]}\n`;
                text += `   ${race.name} - Nvl ${player.level} - ${player.gold} oro\n\n`;
            });

            const mentions = players.map(([id]) => id);
            await sock.sendMessage(from, { text, mentions }, { quoted: message });
            return;
        }

        // --- TOP: Top jugadores ---
        if (subcommand === 'top' || subcommand === 'ranking') {
            const players = Object.entries(data[from] || {})
                .sort(([, a], [, b]) => b.level - a.level || b.xp - a.xp)
                .slice(0, 10);
            
            if (players.length === 0) {
                await sock.sendMessage(from, { 
                    text: '📋 No hay jugadores en este grupo.' 
                }, { quoted: message });
                return;
            }

            let text = '🏆 *TOP 10 JUGADORES RPG* 🏆\n\n';
            players.forEach(([id, player], index) => {
                const medal = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `${index + 1}.`;
                const race = RACES[player.race];
                text += `${medal} @${id.split('@')[0]} - ${race.name} Nvl ${player.level}\n`;
            });

            const mentions = players.map(([id]) => id);
            await sock.sendMessage(from, { text, mentions }, { quoted: message });
            return;
        }

        // --- GODMODE: Modo dios ---
        if (subcommand === 'godmode' || subcommand === 'dios') {
            const mentionedJid = message.message?.extendedTextMessage?.contextInfo?.mentionedJid;
            
            if (!mentionedJid || mentionedJid.length === 0) {
                await sock.sendMessage(from, { 
                    text: '❌ Uso: .rpgadmin godmode @usuario' 
                }, { quoted: message });
                return;
            }

            const targetId = mentionedJid[0];
            const player = data[from][targetId];
            
            if (!player) {
                await sock.sendMessage(from, { 
                    text: '❌ Ese usuario no tiene personaje.' 
                }, { quoted: message });
                return;
            }

            player.level = 100;
            player.stats.str = 999;
            player.stats.agi = 999;
            player.stats.int = 999;
            player.stats.vit = 999;
            player.maxHp = 9990;
            player.hp = 9990;
            player.maxMana = 9990;
            player.mana = 9990;
            player.gold = 999999;
            saveRPG(data);

            await sock.sendMessage(from, { 
                text: `⚡ *MODO DIOS ACTIVADO* ⚡\n\n@${targetId.split('@')[0]} ahora es invencible.`,
                mentions: [targetId]
            }, { quoted: message });
            return;
        }

        // --- CLEARGROUP: Borrar grupo ---
        if (subcommand === 'cleargroup' || subcommand === 'borrargrupo') {
            if (args[1] !== 'confirmar') {
                await sock.sendMessage(from, { 
                    text: '⚠️ *¡ADVERTENCIA!*\n\nEsto borrará TODOS los personajes del grupo.\n\nPara confirmar: .rpgadmin cleargroup confirmar' 
                }, { quoted: message });
                return;
            }

            delete data[from];
            saveRPG(data);

            await sock.sendMessage(from, { 
                text: '🗑️ Todos los datos RPG del grupo han sido eliminados.' 
            }, { quoted: message });
            return;
        }

        // --- CLEARALL: Borrar todo ---
        if (subcommand === 'clearall' || subcommand === 'borrartodo') {
            if (args[1] !== 'confirmar') {
                await sock.sendMessage(from, { 
                    text: '⚠️ *¡PELIGRO EXTREMO!*\n\nEsto borrará TODA la base de datos RPG de TODOS los grupos.\n\nPara confirmar: .rpgadmin clearall confirmar' 
                }, { quoted: message });
                return;
            }

            saveRPG({});

            await sock.sendMessage(from, { 
                text: '☢️ TODA la base de datos RPG ha sido eliminada.' 
            }, { quoted: message });
            return;
        }

        // Comando no reconocido
        await sock.sendMessage(from, { 
            text: '❌ Comando no reconocido. Usa *.rpgadmin* para ver todos los comandos.' 
        }, { quoted: message });
    }
};
