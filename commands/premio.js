import fs from 'fs';
import path from 'path';
import { config as privilegedConfig } from '../config/privilegedUsers.js';

const ECONOMY_FILE = path.join(process.cwd(), 'economy.json');

// Obtener grupo (crear si no existe)
const getGroup = (data, groupId) => {
    if (!data[groupId]) {
        data[groupId] = {};
    }
    return data[groupId];
};

const loadEconomy = () => {
    try {
        if (!fs.existsSync(ECONOMY_FILE)) return {};
        return JSON.parse(fs.readFileSync(ECONOMY_FILE, 'utf8'));
    } catch (error) {
        console.error('Error loading economy:', error);
        return {};
    }
};

const saveEconomy = (data) => {
    try {
        fs.writeFileSync(ECONOMY_FILE, JSON.stringify(data, null, 2));
    } catch (error) {
        console.error('Error saving economy:', error);
    }
};

const formatMoney = (amount) => {
    return `${amount.toLocaleString()} S Coins 🪙`;
};

export const premioCommand = {
    name: 'premio',
    aliases: ['giveaway', 'sorteo'],
    description: 'Da un premio aleatorio a un usuario activo (con dinero)',
    execute: async (sock, message, args) => {
        const from = message.key.remoteJid;
        const senderId = message.key.participant || message.key.remoteJid;

        // Verificar si es super admin
        if (!privilegedConfig.isSuperAdmin(senderId)) {
            await sock.sendMessage(message.key.remoteJid, {
                text: '⛔ Solo el dueño del bot puede usar este comando.'
            }, { quoted: message });
            return;
        }

        const economy = loadEconomy();
        const groupData = getGroup(economy, from);

        // Filtrar usuarios elegibles del grupo actual
        const eligibleUsers = Object.entries(groupData).filter(([id, data]) => {
            const total = (data.balance || 0) + (data.bank || 0);

            // Verificar si ha jugado (tiene actividad registrada)
            const hasPlayed = (
                (data.lastClaim && data.lastClaim > 0) ||
                (data.lastWork && data.lastWork > 0) ||
                (data.lastRob && data.lastRob > 0) ||
                (data.lastCrime && data.lastCrime > 0) ||
                (data.lastSlut && data.lastSlut > 0) ||
                (data.lastMine && data.lastMine > 0) ||
                (data.jobCooldowns && Object.keys(data.jobCooldowns).length > 0) ||
                (data.inventory && data.inventory.length > 0)
            );

            // Condiciones:
            // 1. Tiene dinero (total > 0)
            // 2. Ha jugado (tiene actividad)
            // 3. No es dinero infinito
            // 4. No es super admin
            return total > 0 && hasPlayed && total !== Infinity && !privilegedConfig.isSuperAdmin(id);
        });

        if (eligibleUsers.length === 0) {
            await sock.sendMessage(message.key.remoteJid, {
                text: '❌ No hay usuarios elegibles (con dinero y actividad) para el premio en este grupo.'
            }, { quoted: message });
            return;
        }

        // Seleccionar ganador aleatorio
        const randomIndex = Math.floor(Math.random() * eligibleUsers.length);
        const [winnerId, winnerData] = eligibleUsers[randomIndex];

        // Definir premio (Cantidad media: entre 25k y 50k)
        const prizeAmount = Math.floor(Math.random() * (50000 - 25000 + 1)) + 25000;

        // Dar premio
        groupData[winnerId].balance = (groupData[winnerId].balance || 0) + prizeAmount;

        saveEconomy(economy);

        // Mensaje de felicitación
        const text = `🎉 *¡TENEMOS UN GANADOR!* 🎉\n\n` +
            `¡Felicidades @${winnerId.split('@')[0]}! 🥳\n` +
            `Has sido elegido aleatoriamente entre ${eligibleUsers.length} participantes activos.\n\n` +
            `💰 *PREMIO:* ${formatMoney(prizeAmount)}\n` +
            `💸 *Nuevo Balance:* ${formatMoney(groupData[winnerId].balance)}`;

        await sock.sendMessage(message.key.remoteJid, {
            text: text,
            mentions: [winnerId]
        }, { quoted: message });
    }
};
