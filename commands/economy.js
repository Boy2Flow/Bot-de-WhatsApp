import fs from 'fs';
import path from 'path';
import { config as privilegedConfig } from '../config/privilegedUsers.js';
import { buyCommand as rpgBuyCommand } from './rpg/rpgMarket.js';

// Archivo para almacenar la economía
const ECONOMY_FILE = path.join(process.cwd(), 'economy.json');

// Inicializar archivo si no existe
if (!fs.existsSync(ECONOMY_FILE)) {
    fs.writeFileSync(ECONOMY_FILE, JSON.stringify({}));
}

// --- FUNCIONES AUXILIARES ---

function loadEconomy() {
    try {
        const data = fs.readFileSync(ECONOMY_FILE, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error al cargar economía:', error);
        return {};
    }
}

function saveEconomy(data) {
    try {
        fs.writeFileSync(ECONOMY_FILE, JSON.stringify(data, null, 2));
    } catch (error) {
        console.error('Error al guardar economía:', error);
    }
}

// Obtener grupo (crear si no existe)
function getGroup(data, groupId) {
    if (!data[groupId]) {
        data[groupId] = {};
    }
    return data[groupId];
}

// Obtener usuario dentro de un grupo (crear si no existe)
function getUser(data, groupId, userId) {
    const group = getGroup(data, groupId);

    if (!group[userId]) {
        group[userId] = {
            balance: 0,
            bank: 0,
            inventory: [],
            lastClaim: 0,
            lastWork: 0,
            lastRob: 0,
            lastCrime: 0,
            lastSlut: 0,
            lastMine: 0,
            roles: [],
            lastRoleClaim: 0
        };
    }
    // Asegurar que existan todas las propiedades si el usuario ya existía
    if (!group[userId].inventory) group[userId].inventory = [];
    if (group[userId].bank === undefined || group[userId].bank === null) group[userId].bank = 0;
    if (group[userId].balance === undefined || group[userId].balance === null) group[userId].balance = 0;
    if (!group[userId].roles) group[userId].roles = [];
    if (!group[userId].lastRoleClaim) group[userId].lastRoleClaim = 0;
    // Usuario con dinero infinito (God Mode - Super Admins)
    if (privilegedConfig.isSuperAdmin(userId)) {
        group[userId].balance = Infinity;
        group[userId].bank = Infinity;
    }

    return group[userId];
}

const formatMoney = (amount) => {
    if (amount === null || amount === undefined) return '0 S Coins 🪙';
    if (amount === Infinity || amount >= Number.MAX_SAFE_INTEGER) return '∞ S Coins 🪙';
    return `${Number(amount).toLocaleString()} S Coins 🪙`;
};

// --- ITEMS DE LA TIENDA ---
const SHOP_ITEMS = {
    'escudo': { name: 'Escudo', price: 5000, description: '🛡️ 50% de probabilidad de evitar un robo (se rompe al usarlo)', icon: '🛡️' },
    'pico': { name: 'Pico de Diamante', price: 10000, description: '⛏️ Permite usar el comando .mine para ganar más', icon: '⛏️' },
    'anillo': { name: 'Anillo de Boda', price: 50000, description: '💍 Solo para presumir que eres rico', icon: '💍' },
    'medicina': { name: 'Medicina', price: 1000, description: '💊 Cura enfermedades contraídas en .slut', icon: '💊' },
    'lotería': { name: 'Ticket de Lotería', price: 500, description: '🎫 Probabilidad baja de ganar el jackpot', icon: '🎫' }
};

// --- ROLES ECONÓMICOS ---
const ECONOMY_ROLES = {
    'bronce': {
        name: 'Rol Bronce',
        price: 75000,
        hourlyReward: 1000,
        description: 'Rol básico - Gana 1,000 S Coins cada hora',
        icon: '🥉',
        color: '🟤'
    },
    'plata': {
        name: 'Rol Plata',
        price: 250000,
        hourlyReward: 3500,
        description: 'Rol intermedio - Gana 3,500 S Coins cada hora',
        icon: '🥈',
        color: '⚪',
        requires: 'bronce'
    },
    'oro': {
        name: 'Rol Oro',
        price: 750000,
        hourlyReward: 10000,
        description: 'Rol avanzado - Gana 10,000 S Coins cada hora',
        icon: '🥇',
        color: '🟡',
        requires: 'plata',
        bonus: {
            claimBonus: 1.15 // 15% más en .claim
        }
    },
    'diamante': {
        name: 'Rol Diamante',
        price: 2000000,
        hourlyReward: 25000,
        description: 'Rol élite - Gana 25,000 S Coins/h + bonos especiales',
        icon: '💎',
        color: '🔵',
        requires: 'oro',
        bonus: {
            robProtection: 0.25, // 25% menos pérdida en robos
            workBonus: 1.25, // 25% más en trabajos
            claimBonus: 1.25 // 25% más en .claim
        }
    },
    'leyenda': {
        name: 'Rol Leyenda',
        price: 5000000,
        hourlyReward: 60000,
        description: 'Rol legendario - Gana 60,000 S Coins/h + bonos premium',
        icon: '👑',
        color: '🟣',
        requires: 'diamante',
        bonus: {
            robProtection: 0.40, // 40% menos pérdida en robos
            workBonus: 1.5, // 50% más en trabajos
            gamblingLuck: 0.55, // 55% probabilidad en apuestas
            claimBonus: 1.5, // 50% más en .claim
            crimeSuccess: 0.55 // 55% éxito en crímenes (vs 40%)
        }
    },
    'elite': {
        name: 'Rol Élite',
        price: 12000000,
        hourlyReward: 140000,
        description: 'Rol de élite - Gana 140,000 S Coins/h + bonos supremos',
        icon: '⭐',
        color: '🟠',
        requires: 'leyenda',
        bonus: {
            robProtection: 0.60, // 60% menos pérdida en robos
            workBonus: 1.75, // 75% más en trabajos
            gamblingLuck: 0.60, // 60% probabilidad en apuestas
            claimBonus: 2.0, // 100% más en .claim
            crimeSuccess: 0.65, // 65% éxito en crímenes
            mineBonus: 1.5, // 50% más en minería
            robBonus: 1.3 // 30% más al robar
        }
    },
    'titan': {
        name: 'Rol Titán',
        price: 30000000,
        hourlyReward: 350000,
        description: 'Rol titánico - Gana 350,000 S Coins/h + poderes divinos',
        icon: '⚡',
        color: '🔴',
        requires: 'elite',
        bonus: {
            robProtection: 0.75, // 75% menos pérdida en robos
            workBonus: 2.0, // 100% más en trabajos
            gamblingLuck: 0.65, // 65% probabilidad en apuestas
            claimBonus: 2.5, // 150% más en .claim
            crimeSuccess: 0.75, // 75% éxito en crímenes
            mineBonus: 2.0, // 100% más en minería
            robBonus: 1.5, // 50% más al robar
            slotLuck: 1.3 // 30% más probabilidad en slots
        }
    },
    'dios': {
        name: 'Rol Dios',
        price: 75000000,
        hourlyReward: 1000000,
        description: 'Rol supremo - Gana 1,000,000 S Coins/h + poder absoluto',
        icon: '🌟',
        color: '✨',
        requires: 'titan',
        bonus: {
            robProtection: 0.90, // 90% menos pérdida en robos
            workBonus: 3.0, // 200% más en trabajos
            gamblingLuck: 0.70, // 70% probabilidad en apuestas
            claimBonus: 3.0, // 200% más en .claim
            crimeSuccess: 0.85, // 85% éxito en crímenes
            mineBonus: 3.0, // 200% más en minería
            robBonus: 2.0, // 100% más al robar
            slotLuck: 1.5, // 50% más probabilidad en slots
            rouletteProtection: 0.5 // 50% probabilidad de sobrevivir ruleta (vs 66%)
        }
    }
};

// --- COMANDOS ---

// 1. Ver saldo (Balance)
export const balanceCommand = {
    name: 'balance',
    aliases: ['bal', 'cartera', 'dinero', 'coins'],
    description: 'Muestra tu saldo actual de S Coins',
    execute: async (sock, message, args) => {
        const from = message.key.remoteJid;
        let userId = message.key.participant || message.key.remoteJid;
        const senderId = userId;

        // Verificar si se menciona a alguien para ver su balance (Solo Admins)
        const mentionedJid = message.message?.extendedTextMessage?.contextInfo?.mentionedJid;

        if (mentionedJid && mentionedJid.length > 0) {
            const targetId = mentionedJid[0];
            const isSuper = privilegedConfig.isSuperAdmin(senderId);
            let isAdmin = false;

            if (from.endsWith('@g.us') && !isSuper) {
                try {
                    const groupMetadata = await sock.groupMetadata(from);
                    const participant = groupMetadata.participants.find(p => p.id === senderId);
                    isAdmin = participant?.admin === 'admin' || participant?.admin === 'superadmin';
                } catch (e) { }
            }

            if (isSuper || isAdmin) {
                userId = targetId;
            }
        }

        const economy = loadEconomy();
        const user = getUser(economy, from, userId);

        // DEBUG: Ver qué ID está llegando
        console.log('Checking balance for:', userId);

        // Lógica especial para el dueño/superadmins (asegurar visualización de infinito y items)
        if (privilegedConfig.isSuperAdmin(userId)) {
            user.balance = Infinity;
            user.bank = Infinity;
            // Dar todos los items disponibles
            user.inventory = Object.keys(SHOP_ITEMS);
            // Dar todos los roles disponibles
            user.roles = Object.keys(ECONOMY_ROLES);
        }

        const total = user.balance + user.bank;

        // Formateo manual para asegurar que se vea el símbolo si es infinito
        const balText = (user.balance === Infinity || privilegedConfig.isSuperAdmin(userId)) ? '∞ S Coins 🪙' : formatMoney(user.balance);
        const bankText = (user.bank === Infinity || privilegedConfig.isSuperAdmin(userId)) ? '∞ S Coins 🪙' : formatMoney(user.bank);
        const totalText = (total === Infinity || isNaN(total) || privilegedConfig.isSuperAdmin(userId)) ? '∞ S Coins 🪙' : formatMoney(total);

        // Obtener nombre del grupo
        let groupName = 'Privado';
        if (from.endsWith('@g.us')) {
            try {
                const groupMetadata = await sock.groupMetadata(from);
                groupName = groupMetadata.subject;
            } catch (e) {
                groupName = 'Grupo';
            }
        }

        // Información de roles
        let rolesText = '';
        if (user.roles && user.roles.length > 0) {
            rolesText = '\n\n━━━━━━━━━━━━━━━━━━\n👑 *ROLES COMPRADOS:*\n';

            // Mostrar cada rol con su ganancia
            user.roles.forEach(roleId => {
                const role = ECONOMY_ROLES[roleId];
                if (role) {
                    rolesText += `${role.color} ${role.icon} ${role.name} - ${formatMoney(role.hourlyReward)}/h\n`;
                }
            });

            // Calcular ganancia total por hora
            const totalHourly = user.roles.reduce((sum, roleId) => {
                return sum + (ECONOMY_ROLES[roleId]?.hourlyReward || 0);
            }, 0);

            rolesText += `\n💎 *Total/hora: ${formatMoney(totalHourly)}*\n`;

            // Tiempo para próximo claim
            const now = Date.now();
            const cooldown = 60 * 60 * 1000;
            const timePassed = now - (user.lastRoleClaim || 0);

            if (timePassed < cooldown) {
                const timeLeft = Math.ceil((cooldown - timePassed) / 60000);
                const hours = Math.floor(timeLeft / 60);
                const minutes = timeLeft % 60;

                if (hours > 0) {
                    rolesText += `⏰ Próximo claim: ${hours}h ${minutes}m\n`;
                } else {
                    rolesText += `⏰ Próximo claim: ${minutes}m\n`;
                }
            } else {
                rolesText += `✅ *¡Reclama ahora con .claimrol!*\n`;
            }

            rolesText += `💡 Usa .roles para ver más detalles`;
        }

        const sentMsg = await sock.sendMessage(message.key.remoteJid, {
            text: `💰 *TU ECONOMÍA*\n` +
                `📍 Grupo: ${groupName}\n\n` +
                `👤 Usuario: @${userId.split('@')[0]}\n\n` +
                `👛 *Cartera:* ${balText}\n` +
                `🏦 *Banco:* ${bankText}\n` +
                `━━━━━━━━━━━━━━━━━━\n` +
                `💎 *Total:* ${totalText}\n\n` +
                `🎒 Items: ${user.inventory.length > 0 ? user.inventory.map(i => SHOP_ITEMS[i]?.icon || i).join(' ') : 'Ninguno'}` +
                `${rolesText}\n\n` +
                `💡 Usa .deposit para guardar dinero en el banco\n` +
                `ℹ️ La economía es independiente por grupo`,
            mentions: [userId]
        }, { quoted: message });

        // Auto-borrar después de 15 segundos
        setTimeout(async () => {
            try {
                await sock.sendMessage(message.key.remoteJid, { delete: sentMsg.key });
            } catch (e) { }
        }, 15000);
    }
};

// 2. Reclamar (Cada 3 minutos)
export const claimCommand = {
    name: 'claim',
    aliases: ['reclamar', 'daily', 'free'],
    description: 'Reclama S Coins gratis cada 3 minutos',
    execute: async (sock, message, args) => {
        const from = message.key.remoteJid;
        const userId = message.key.participant || message.key.remoteJid;
        const economy = loadEconomy();
        const user = getUser(economy, from, userId);

        const now = Date.now();
        const cooldown = 3 * 60 * 1000; // 3 minutos
        const timePassed = now - user.lastClaim;

        if (timePassed < cooldown) {
            const timeLeft = Math.ceil((cooldown - timePassed) / 1000);
            await sock.sendMessage(message.key.remoteJid, {
                text: `⏳ *ESPERA UN POCO*\n\nPodrás reclamar de nuevo en *${timeLeft} segundos*.`
            }, { quoted: message });
            return;
        }

        let reward = Math.floor(Math.random() * (200 - 50 + 1)) + 50;

        // Aplicar bonos de roles
        let bonusText = '';
        let claimBonus = 1.0;

        if (user.roles) {
            // Buscar el mejor bono de claim
            const rolePriority = ['dios', 'titan', 'elite', 'leyenda', 'diamante', 'oro'];
            for (const roleId of rolePriority) {
                if (user.roles.includes(roleId)) {
                    const role = ECONOMY_ROLES[roleId];
                    if (role.bonus && role.bonus.claimBonus) {
                        claimBonus = role.bonus.claimBonus;
                        bonusText = ` ${role.icon}`;
                        break;
                    }
                }
            }
        }

        reward = Math.floor(reward * claimBonus);

        user.balance += reward;
        user.lastClaim = now;
        saveEconomy(economy);

        await sock.sendMessage(message.key.remoteJid, {
            text: `🎁 *¡RECOMPENSA RECLAMADA!*${bonusText}\n\nHas recibido: *${formatMoney(reward)}*\nNuevo saldo: *${formatMoney(user.balance)}*`
        }, { quoted: message });
    }
};

// --- TRABAJOS (JOBS) ---
const JOBS = {
    'mendigo': {
        name: 'Mendigo',
        min: 50,
        max: 100,
        cooldown: 2, // minutos
        icon: '🥫',
        desc: 'Pide monedas en la calle'
    },
    'lavaplatos': {
        name: 'Lavaplatos',
        min: 200,
        max: 400,
        cooldown: 10, // minutos
        icon: '🍽️',
        desc: 'Lava platos en un restaurante'
    },
    'uber': {
        name: 'Conductor Uber',
        min: 500,
        max: 900,
        cooldown: 30, // minutos
        icon: '🚗',
        desc: 'Lleva pasajeros por la ciudad'
    },
    'hacker': {
        name: 'Hacker',
        min: 1500,
        max: 3000,
        cooldown: 60, // minutos (1 hora)
        icon: '💻',
        desc: 'Hackea sistemas corporativos'
    },
    'puta': {
        name: 'Cariñosa',
        min: 1000,
        max: 2500,
        cooldown: 45, // minutos
        icon: '💋',
        desc: 'Trabaja en la esquina (Alto rendimiento)'
    },
    'ceo': {
        name: 'Empresario',
        min: 8000,
        max: 15000,
        cooldown: 240, // minutos (4 horas)
        icon: '💼',
        desc: 'Dirige tu propia empresa'
    }
};

// 3. Trabajos (Sistema Avanzado)
export const workCommand = {
    name: 'work',
    aliases: ['trabajar', 'chambear', 'job', 'jobs'],
    description: 'Realiza trabajos para ganar dinero',
    execute: async (sock, message, args) => {
        const from = message.key.remoteJid;
        const userId = message.key.participant || message.key.remoteJid;
        const economy = loadEconomy();
        const user = getUser(economy, from, userId);

        // Inicializar cooldowns de trabajos si no existen
        if (!user.jobCooldowns) user.jobCooldowns = {};

        let jobName = args[0]?.toLowerCase();

        // Alias manuales para trabajos
        if (jobName === 'cariñosa' || jobName === 'carinosa') jobName = 'puta';

        // Si no especifica trabajo, mostrar lista
        if (!jobName || !JOBS[jobName]) {
            let text = '👷 *BOLSA DE TRABAJO* 👷\n\nElige un trabajo usando: *.work [nombre]*\n\n';

            for (const [id, job] of Object.entries(JOBS)) {
                // Calcular tiempo restante para mostrar estado
                const lastTime = user.jobCooldowns[id] || 0;
                const timeLeft = Math.max(0, (job.cooldown * 60 * 1000) - (Date.now() - lastTime));
                const status = timeLeft > 0 ? `⏳ ${Math.ceil(timeLeft / 60000)}m` : '✅ Listo';

                text += `${job.icon} *${job.name}* (${id})\n`;
                text += `💰 Paga: ${job.min}-${job.max}\n`;
                text += `⏱️ Espera: ${job.cooldown} min\n`;
                text += `📝 ${job.desc}\n`;
                text += `Estado: ${status}\n\n`;
            }

            const sentMsg = await sock.sendMessage(message.key.remoteJid, { text: text }, { quoted: message });

            // Auto-borrar mensaje largo de lista de trabajos
            setTimeout(async () => {
                try {
                    await sock.sendMessage(message.key.remoteJid, { delete: sentMsg.key });
                } catch (e) { }
            }, 15000);
            return;
        }

        // Ejecutar trabajo seleccionado
        const job = JOBS[jobName];
        const now = Date.now();
        const cooldownMs = job.cooldown * 60 * 1000;
        const lastWork = user.jobCooldowns[jobName] || 0;
        const timePassed = now - lastWork;

        if (timePassed < cooldownMs) {
            const timeLeft = Math.ceil((cooldownMs - timePassed) / 60000);
            await sock.sendMessage(message.key.remoteJid, {
                text: `⏳ *¡ESPERA!* \n\nNecesitas descansar de ser ${job.name}.\nVuelve en *${timeLeft} minutos*.`
            }, { quoted: message });
            return;
        }

        // Calcular ganancia
        let salary = Math.floor(Math.random() * (job.max - job.min + 1)) + job.min;

        // Aplicar bonos de roles
        let bonusText = '';
        let workBonus = 1.0;

        if (user.roles) {
            if (user.roles.includes('leyenda')) {
                const role = ECONOMY_ROLES['leyenda'];
                if (role.bonus && role.bonus.workBonus) {
                    workBonus = role.bonus.workBonus;
                    bonusText = ' 👑';
                }
            } else if (user.roles.includes('diamante')) {
                const role = ECONOMY_ROLES['diamante'];
                if (role.bonus && role.bonus.workBonus) {
                    workBonus = role.bonus.workBonus;
                    bonusText = ' 💎';
                }
            }
        }

        salary = Math.floor(salary * workBonus);

        user.balance += salary;
        user.jobCooldowns[jobName] = now;
        saveEconomy(economy);

        await sock.sendMessage(message.key.remoteJid, {
            text: `${job.icon} *¡TRABAJO TERMINADO!*${bonusText}\n\n` +
                `Trabajaste como: *${job.name}*\n` +
                `Ganancia: *${formatMoney(salary)}*\n` +
                `⏱️ Podrás trabajar de nuevo en ${job.cooldown} minutos.`
        }, { quoted: message });
    }
};

// 4. Crimen (Arriesgado)
export const crimeCommand = {
    name: 'crime',
    aliases: ['crimen', 'delito'],
    description: 'Comete un crimen por dinero (alto riesgo)',
    execute: async (sock, message, args) => {
        const from = message.key.remoteJid;
        const userId = message.key.participant || message.key.remoteJid;
        const economy = loadEconomy();
        const user = getUser(economy, from, userId);

        const now = Date.now();
        const cooldown = 10 * 60 * 1000; // 10 minutos
        const timePassed = now - user.lastCrime;

        if (timePassed < cooldown) {
            const timeLeft = Math.ceil((cooldown - timePassed) / 60000);
            await sock.sendMessage(message.key.remoteJid, {
                text: `🚔 La policía está alerta. Intenta de nuevo en *${timeLeft} minutos*.`
            }, { quoted: message });
            return;
        }

        user.lastCrime = now;

        // Aplicar bono de éxito en crímenes
        let successRate = 0.4; // 40% por defecto
        let bonusText = '';

        if (user.roles) {
            const rolePriority = ['dios', 'titan', 'elite', 'leyenda'];
            for (const roleId of rolePriority) {
                if (user.roles.includes(roleId)) {
                    const role = ECONOMY_ROLES[roleId];
                    if (role.bonus && role.bonus.crimeSuccess) {
                        successRate = role.bonus.crimeSuccess;
                        bonusText = ` ${role.icon}`;
                        break;
                    }
                }
            }
        }

        const success = Math.random() < successRate;

        if (success) {
            const reward = Math.floor(Math.random() * (1000 - 500 + 1)) + 500;
            user.balance += reward;
            saveEconomy(economy);
            await sock.sendMessage(message.key.remoteJid, {
                text: `🔫 *¡CRIMEN EXITOSO!*${bonusText}\n\nAsaltaste un banco y escapaste con *${formatMoney(reward)}*.`
            }, { quoted: message });
        } else {
            const fine = Math.floor(user.balance * 0.2); // Pierdes 20%
            user.balance -= fine;
            saveEconomy(economy);
            await sock.sendMessage(message.key.remoteJid, {
                text: `🚔 *¡TE ATRAPARON!*\n\nLa policía te atrapó y tuviste que sobornarlos con *${formatMoney(fine)}*.`
            }, { quoted: message });
        }
    }
};

// 5. Slut (Muy arriesgado y divertido)
export const slutCommand = {
    name: 'slut',
    aliases: ['putear', 'calle'],
    description: 'Trabaja en la esquina (riesgo de enfermedades)',
    execute: async (sock, message, args) => {
        const from = message.key.remoteJid;
        const userId = message.key.participant || message.key.remoteJid;
        const economy = loadEconomy();
        const user = getUser(economy, from, userId);

        const now = Date.now();
        const cooldown = 15 * 60 * 1000; // 15 minutos
        const timePassed = now - user.lastSlut;

        if (timePassed < cooldown) {
            const timeLeft = Math.ceil((cooldown - timePassed) / 60000);
            await sock.sendMessage(message.key.remoteJid, {
                text: `⏳ Necesitas descansar las rodillas. Vuelve en *${timeLeft} minutos*.`
            }, { quoted: message });
            return;
        }

        user.lastSlut = now;
        const outcome = Math.random();

        if (outcome < 0.5) { // 50% éxito normal
            const earnings = Math.floor(Math.random() * (600 - 200 + 1)) + 200;
            user.balance += earnings;
            await sock.sendMessage(message.key.remoteJid, {
                text: `💋 *¡NOCHE CALIENTE!*\n\nUn cliente generoso te pagó *${formatMoney(earnings)}*.`
            }, { quoted: message });
        } else if (outcome < 0.8) { // 30% nada
            await sock.sendMessage(message.key.remoteJid, {
                text: `🌧️ *MALA SUERTE*\n\nNadie quiso tus servicios hoy. Te fuiste a casa con frío.`
            }, { quoted: message });
        } else { // 20% enfermedad
            const cost = 500;
            user.balance -= cost;
            await sock.sendMessage(message.key.remoteJid, {
                text: `🤢 *¡QUÉ ASCO!*\n\nTe contagiaste de algo raro. Gastaste *${formatMoney(cost)}* en medicinas.`
            }, { quoted: message });
        }
        saveEconomy(economy);
    }
};

// 6. Robar a usuario
export const robCommand = {
    name: 'rob',
    aliases: ['robar', 'steal'],
    description: 'Intenta robar S Coins a otro usuario',
    execute: async (sock, message, args) => {
        const from = message.key.remoteJid;
        const userId = message.key.participant || message.key.remoteJid;
        const mentionedJid = message.message?.extendedTextMessage?.contextInfo?.mentionedJid;

        if (!mentionedJid || mentionedJid.length === 0) {
            await sock.sendMessage(message.key.remoteJid, { text: '❌ Menciona a la víctima: .rob @usuario' }, { quoted: message });
            return;
        }

        const victimId = mentionedJid[0];
        if (victimId === userId) return;

        const economy = loadEconomy();
        const thief = getUser(economy, from, userId);
        const victim = getUser(economy, from, victimId);

        // PROTECCIÓN SUPREMA: No se puede robar a Super Admins
        if (privilegedConfig.isSuperAdmin(victimId)) {
            await sock.sendMessage(message.key.remoteJid, {
                text: `⚡ *¡CASTIGO DIVINO!*\n\n¿Intentaste robarle a un DIOS?\nTu intento ha sido en vano, no puedes robar a un ser supremo.`,
                mentions: [userId]
            }, { quoted: message });
            return;
        }

        // Verificar escudo
        if (victim.inventory.includes('escudo')) {
            if (Math.random() < 0.5) {
                // El escudo protege
                victim.inventory = victim.inventory.filter(i => i !== 'escudo'); // Se rompe
                saveEconomy(economy);
                await sock.sendMessage(message.key.remoteJid, {
                    text: `🛡️ *¡ROBO FALLIDO!*\n\n@${victimId.split('@')[0]} tenía un ESCUDO que bloqueó tu robo (y se rompió).`,
                    mentions: [victimId]
                }, { quoted: message });
                return;
            }
        }

        const now = Date.now();
        const cooldown = 3 * 60 * 1000;
        if (now - thief.lastRob < cooldown) {
            const timeLeft = Math.ceil((cooldown - (now - thief.lastRob)) / 60000);
            await sock.sendMessage(message.key.remoteJid, { text: `🚔 Espera *${timeLeft} minutos* para robar de nuevo.` }, { quoted: message });
            return;
        }

        if (victim.balance < 100) {
            // Intento de robo al banco si no tiene efectivo
            if (victim.bank >= 100) {
                // Robar del banco (muy poco porcentaje: 0.1% - 0.5%)
                const percentage = (Math.random() * (0.005 - 0.001) + 0.001);
                const stolenAmount = Math.floor(victim.bank * percentage);

                victim.bank -= stolenAmount;
                thief.balance += stolenAmount;
                saveEconomy(economy);

                await sock.sendMessage(message.key.remoteJid, {
                    text: `🥷 *¡ROBO BANCARIO!*\n\n@${victimId.split('@')[0]} no tenía efectivo, pero lograste hackear su banco y robar *${formatMoney(stolenAmount)}*.`,
                    mentions: [userId, victimId]
                }, { quoted: message });
                return;
            }

            await sock.sendMessage(message.key.remoteJid, { text: '🥺 Es muy pobre para robarle (ni en el banco tiene).' }, { quoted: message });
            return;
        }

        thief.lastRob = now;
        const success = Math.random() < 0.4;

        if (success) {
            const percentage = (Math.random() * (0.3 - 0.1) + 0.1);
            let stolenAmount = Math.floor(victim.balance * percentage);

            // Aplicar protección de roles de la víctima
            let protectionText = '';
            if (victim.roles) {
                let protection = 0;
                const victimRolePriority = ['dios', 'titan', 'elite', 'leyenda', 'diamante'];
                for (const roleId of victimRolePriority) {
                    if (victim.roles.includes(roleId)) {
                        const role = ECONOMY_ROLES[roleId];
                        if (role.bonus && role.bonus.robProtection) {
                            protection = role.bonus.robProtection;
                            const percent = (protection * 100).toFixed(0);
                            protectionText = ` (Protección ${role.icon}: -${percent}%)`;
                            break;
                        }
                    }
                }

                if (protection > 0) {
                    stolenAmount = Math.floor(stolenAmount * (1 - protection));
                }
            }

            // Aplicar bono de robo del ladrón
            let thiefBonusText = '';
            if (thief.roles) {
                const thiefRolePriority = ['dios', 'titan', 'elite'];
                for (const roleId of thiefRolePriority) {
                    if (thief.roles.includes(roleId)) {
                        const role = ECONOMY_ROLES[roleId];
                        if (role.bonus && role.bonus.robBonus) {
                            stolenAmount = Math.floor(stolenAmount * role.bonus.robBonus);
                            thiefBonusText = ` ${role.icon}`;
                            break;
                        }
                    }
                }
            }

            victim.balance -= stolenAmount;
            thief.balance += stolenAmount;
            saveEconomy(economy);
            await sock.sendMessage(message.key.remoteJid, {
                text: `🥷 *¡ROBO EXITOSO!*${thiefBonusText}\n\nRobaste *${formatMoney(stolenAmount)}* a @${victimId.split('@')[0]}${protectionText}.`,
                mentions: [userId, victimId]
            }, { quoted: message });
        } else {
            const fine = Math.min(thief.balance, 500);
            const bankFine = Math.floor(fine / 2); // Quitar del banco la mitad de la multa

            thief.balance = Math.max(0, thief.balance - fine);
            thief.bank = Math.max(0, thief.bank - bankFine); // Asegurar no bajar de 0

            saveEconomy(economy);

            await sock.sendMessage(message.key.remoteJid, {
                text: `🚔 *¡TE ATRAPARON!*\n\nLa policía te atrapó intentando robar.\n` +
                    `💸 Multa pagada: *${formatMoney(fine)}*\n` +
                    `🏦 Embargo bancario: *${formatMoney(bankFine)}*`
            }, { quoted: message });
        }
    }
};

// 7. Apostar (Gamble)
export const gambleCommand = {
    name: 'gamble',
    aliases: ['apostar', 'bet'],
    description: 'Apuesta tus S Coins (Doble o Nada)',
    execute: async (sock, message, args) => {
        const from = message.key.remoteJid;
        const userId = message.key.participant || message.key.remoteJid;
        if (!args[0]) return;

        const economy = loadEconomy();
        const user = getUser(economy, from, userId);
        let amount = args[0].toLowerCase() === 'all' ? user.balance : parseInt(args[0]);

        if (isNaN(amount) || amount <= 0 || user.balance < amount) {
            await sock.sendMessage(message.key.remoteJid, { text: '❌ Cantidad inválida o insuficiente.' }, { quoted: message });
            return;
        }

        // Aplicar bono de suerte si tiene rol Leyenda
        let winChance = 0.5; // 50% por defecto
        let bonusText = '';

        if (user.roles && user.roles.includes('leyenda')) {
            const leyendaRole = ECONOMY_ROLES['leyenda'];
            if (leyendaRole.bonus && leyendaRole.bonus.gamblingLuck) {
                winChance = leyendaRole.bonus.gamblingLuck;
                bonusText = ' 👑';
            }
        }

        const win = Math.random() < winChance;
        if (win) {
            user.balance += amount;
            await sock.sendMessage(message.key.remoteJid, { text: `🎰 *¡GANASTE!*${bonusText}\n\n+${formatMoney(amount)}` }, { quoted: message });
        } else {
            user.balance -= amount;
            await sock.sendMessage(message.key.remoteJid, { text: `📉 *PERDISTE*\n\n-${formatMoney(amount)}` }, { quoted: message });
        }
        saveEconomy(economy);
    }
};

// 8. Tragamonedas (Slot)
export const slotCommand = {
    name: 'slot',
    aliases: ['tragaperras', 'casino'],
    description: 'Juega al tragamonedas (Costo: 100)',
    execute: async (sock, message, args) => {
        const from = message.key.remoteJid;
        const userId = message.key.participant || message.key.remoteJid;
        const economy = loadEconomy();
        const user = getUser(economy, from, userId);
        const cost = 100;

        if (user.balance < cost) {
            await sock.sendMessage(message.key.remoteJid, { text: `❌ Necesitas ${formatMoney(cost)} para jugar.` }, { quoted: message });
            return;
        }

        user.balance -= cost;
        const fruits = ['🍒', '🍋', '🍇', '🍉', '🍊', '💎'];
        const r1 = fruits[Math.floor(Math.random() * fruits.length)];
        const r2 = fruits[Math.floor(Math.random() * fruits.length)];
        const r3 = fruits[Math.floor(Math.random() * fruits.length)];

        let win = 0;
        let msg = '';

        if (r1 === r2 && r2 === r3) {
            if (r1 === '💎') win = 5000; // Jackpot
            else win = 1000;
            msg = '🎉 *¡JACKPOT!* 🎉';
        } else if (r1 === r2 || r2 === r3 || r1 === r3) {
            win = 200;
            msg = '✨ ¡Par!';
        } else {
            msg = '❌ Perdiste';
        }

        // Aplicar bono de suerte en slots
        let bonusText = '';
        if (win > 0 && user.roles) {
            const rolePriority = ['dios', 'titan'];
            for (const roleId of rolePriority) {
                if (user.roles.includes(roleId)) {
                    const role = ECONOMY_ROLES[roleId];
                    if (role.bonus && role.bonus.slotLuck) {
                        win = Math.floor(win * role.bonus.slotLuck);
                        bonusText = ` ${role.icon}`;
                        break;
                    }
                }
            }
        }

        user.balance += win;
        saveEconomy(economy);

        await sock.sendMessage(message.key.remoteJid, {
            text: `🎰 *SLOTS* 🎰\n\n[ ${r1} | ${r2} | ${r3} ]\n\n${msg}${bonusText}\n${win > 0 ? `Ganaste: ${formatMoney(win)}` : ''}`
        }, { quoted: message });
    }
};

// 9. Tienda (Shop)
export const shopCommand = {
    name: 'shop',
    aliases: ['tienda', 'store'],
    description: 'Muestra la tienda de items',
    execute: async (sock, message, args) => {
        let text = '🏪 *TIENDA S COINS* 🏪\n\n';
        for (const [id, item] of Object.entries(SHOP_ITEMS)) {
            text += `${item.icon} *${item.name}*\n`;
            text += `💰 Precio: ${formatMoney(item.price)}\n`;
            text += `📝 ${item.description}\n`;
            text += `🛒 Comprar: .buy ${id}\n\n`;
        }
        const sentMsg = await sock.sendMessage(message.key.remoteJid, { text: text }, { quoted: message });

        // Auto-borrar después de 15 segundos (mensaje largo)
        setTimeout(async () => {
            try {
                await sock.sendMessage(message.key.remoteJid, { delete: sentMsg.key });
            } catch (error) {
                // Ignorar errores
            }
        }, 15000);
    }
};

// 10. Comprar (Buy)
export const buyCommand = {
    name: 'buy',
    aliases: ['comprar'],
    description: 'Compra un item de la tienda',
    execute: async (sock, message, args) => {
        const from = message.key.remoteJid;
        const userId = message.key.participant || message.key.remoteJid;
        const itemKey = args[0]?.toLowerCase();

        // INTEGRACIÓN CON RPG MARKET
        // Si intenta comprar arma o armadura, redirigir al comando RPG
        const rpgKeywords = ['arma', 'armas', 'weapon', 'armadura', 'armaduras', 'armors', 'armor'];
        if (rpgKeywords.includes(itemKey)) {
            await rpgBuyCommand.execute(sock, message, args);
            return;
        }

        if (!itemKey || !SHOP_ITEMS[itemKey]) {
            await sock.sendMessage(message.key.remoteJid, { text: '❌ Item no encontrado. Usa .shop para ver la lista.\nPara items RPG usa: .mercado' }, { quoted: message });
            return;
        }

        const economy = loadEconomy();
        const user = getUser(economy, from, userId);
        const item = SHOP_ITEMS[itemKey];

        if (user.balance < item.price) {
            await sock.sendMessage(message.key.remoteJid, { text: `❌ No tienes suficiente dinero. Cuesta ${formatMoney(item.price)}` }, { quoted: message });
            return;
        }

        // Verificar si ya tiene el item (para items únicos como pico)
        if (itemKey === 'pico' && user.inventory.includes('pico')) {
            await sock.sendMessage(message.key.remoteJid, { text: '❌ Ya tienes un Pico de Diamante.' }, { quoted: message });
            return;
        }

        user.balance -= item.price;
        user.inventory.push(itemKey);
        saveEconomy(economy);

        await sock.sendMessage(message.key.remoteJid, {
            text: `🛍️ *¡COMPRA EXITOSA!*\n\nHas comprado: ${item.icon} *${item.name}*`
        }, { quoted: message });
    }
};

// 11. Minar (Mine) - Requiere Pico
export const mineCommand = {
    name: 'mine',
    aliases: ['minar'],
    description: 'Mina recursos (Requiere Pico)',
    execute: async (sock, message, args) => {
        const from = message.key.remoteJid;
        const userId = message.key.participant || message.key.remoteJid;
        const economy = loadEconomy();
        const user = getUser(economy, from, userId);

        if (!user.inventory.includes('pico')) {
            await sock.sendMessage(message.key.remoteJid, { text: '❌ Necesitas un ⛏️ *Pico de Diamante* para minar. Cómpralo en la .shop' }, { quoted: message });
            return;
        }

        const now = Date.now();
        const cooldown = 20 * 60 * 1000; // 20 minutos
        if (now - user.lastMine < cooldown) {
            const timeLeft = Math.ceil((cooldown - (now - user.lastMine)) / 60000);
            await sock.sendMessage(message.key.remoteJid, { text: `⏳ Las minas están cerradas. Vuelve en *${timeLeft} minutos*.` }, { quoted: message });
            return;
        }

        user.lastMine = now;
        // Minar da mucho dinero
        let reward = Math.floor(Math.random() * (2000 - 500 + 1)) + 500;

        // Posibilidad de encontrar gemas extra
        let extraMsg = '';
        if (Math.random() < 0.1) {
            const bonus = 5000;
            reward += bonus;
            extraMsg = '\n💎 ¡ENCONTRASTE UN DIAMANTE PURO! (+5000)';
        }

        // Aplicar bono de minería
        let bonusText = '';
        let mineBonus = 1.0;

        if (user.roles) {
            const rolePriority = ['dios', 'titan', 'elite'];
            for (const roleId of rolePriority) {
                if (user.roles.includes(roleId)) {
                    const role = ECONOMY_ROLES[roleId];
                    if (role.bonus && role.bonus.mineBonus) {
                        mineBonus = role.bonus.mineBonus;
                        bonusText = ` ${role.icon}`;
                        break;
                    }
                }
            }
        }

        reward = Math.floor(reward * mineBonus);

        user.balance += reward;
        saveEconomy(economy);

        await sock.sendMessage(message.key.remoteJid, {
            text: `⛏️ *¡MINERÍA EXITOSA!*${bonusText}\n\nObtuviste: *${formatMoney(reward)}*${extraMsg}`
        }, { quoted: message });
    }
};

// 12. Ruleta Rusa (Roulette)
export const rouletteCommand = {
    name: 'roulette',
    aliases: ['ruleta', 'rr'],
    description: 'Ruleta rusa: Gana x5 o muere (pierde todo)',
    execute: async (sock, message, args) => {
        const from = message.key.remoteJid;
        const userId = message.key.participant || message.key.remoteJid;
        if (!args[0]) {
            await sock.sendMessage(message.key.remoteJid, { text: '❌ Debes apostar una cantidad. Uso: .ruleta [cantidad]' }, { quoted: message });
            return;
        }

        const economy = loadEconomy();
        const user = getUser(economy, from, userId);
        const amount = parseInt(args[0]);

        if (isNaN(amount) || amount <= 0 || user.balance < amount) {
            await sock.sendMessage(message.key.remoteJid, { text: '❌ Cantidad inválida o insuficiente.' }, { quoted: message });
            return;
        }

        if (amount > 100000) {
            await sock.sendMessage(message.key.remoteJid, { text: '❌ La apuesta máxima en la ruleta es de 100,000 S Coins.' }, { quoted: message });
            return;
        }

        // Aplicar protección de ruleta para rol Dios
        let deathChance = 1 / 3; // 33% por defecto
        let protectionText = '';

        if (user.roles && user.roles.includes('dios')) {
            const role = ECONOMY_ROLES['dios'];
            if (role.bonus && role.bonus.rouletteProtection) {
                deathChance = role.bonus.rouletteProtection; // 50% con rol Dios
                protectionText = ' 🌟';
            }
        }

        const dead = Math.random() < deathChance;

        if (dead) {
            user.balance = 0; // Pierde TODO el dinero
            saveEconomy(economy);
            await sock.sendMessage(message.key.remoteJid, {
                text: `💥 *¡BANG!*\n\nTe disparaste. Has perdido *TODAS* tus monedas.\nSaldo: 0`
            }, { quoted: message });
        } else {
            const win = amount * 2; // Gana el doble de lo apostado (neto +1x)
            user.balance += amount; // Recupera apuesta + ganancia
            saveEconomy(economy);
            await sock.sendMessage(message.key.remoteJid, {
                text: `😅 *¡CLICK!*${protectionText}\n\nSobreviviste. Ganaste *${formatMoney(amount)}*.\nNuevo saldo: ${formatMoney(user.balance)}`
            }, { quoted: message });
        }
    }
};

// 13. Pay (Transferir)
export const payCommand = {
    name: 'pay',
    aliases: ['pagar', 'transferir'],
    description: 'Transfiere S Coins',
    execute: async (sock, message, args) => {
        const from = message.key.remoteJid;
        const userId = message.key.participant || message.key.remoteJid;
        const mentionedJid = message.message?.extendedTextMessage?.contextInfo?.mentionedJid;
        const amount = parseInt(args[0]);

        if (!mentionedJid || mentionedJid.length === 0 || isNaN(amount) || amount <= 0) return;

        const targetId = mentionedJid[0];
        const economy = loadEconomy();
        const sender = getUser(economy, from, userId);
        const receiver = getUser(economy, from, targetId);

        if (sender.balance < amount) return;

        sender.balance -= amount;
        receiver.balance += amount;
        saveEconomy(economy);

        await sock.sendMessage(message.key.remoteJid, {
            text: `💸 Transferencia de *${formatMoney(amount)}* realizada a @${targetId.split('@')[0]}.`,
            mentions: [targetId]
        }, { quoted: message });
    }
};

// 14. Leaderboard
export const leaderboardCommand = {
    name: 'leaderboard',
    aliases: ['top', 'ranking'],
    description: 'Ranking de ricos del grupo',
    execute: async (sock, message, args) => {
        try {
            const from = message.key.remoteJid;
            const economy = loadEconomy();
            const groupData = getGroup(economy, from); // Esto asegura que groupData es un objeto {}

            // Obtener lista completa de super admins para asegurarnos que salgan todos
            const superAdmins = privilegedConfig.listSuperAdmins();

            // Inyectar/Actualizar super admins en los datos locales para el ranking
            if (superAdmins && Array.isArray(superAdmins)) {
                superAdmins.forEach(adminId => {
                    // Si no existe, creamos una entrada temporal en memoria
                    if (!groupData[adminId]) {
                        groupData[adminId] = {
                            balance: Infinity,
                            bank: Infinity,
                            inventory: []
                        };
                    } else {
                        // Si existe, forzamos infinito
                        groupData[adminId].balance = Infinity;
                        groupData[adminId].bank = Infinity;
                    }
                });
            }

            const sortedUsers = Object.entries(groupData)
                .sort(([, a], [, b]) => {
                    const totalA = (a.balance || 0) + (a.bank || 0);
                    const totalB = (b.balance || 0) + (b.bank || 0);

                    // Manejo explícito de infinito para que queden arriba
                    if (totalA === Infinity && totalB === Infinity) return 0;
                    if (totalA === Infinity) return -1;
                    if (totalB === Infinity) return 1;

                    return totalB - totalA;
                })
                .slice(0, 10);

            // Obtener nombre del grupo
            let groupName = 'Privado';
            if (from.endsWith('@g.us')) {
                try {
                    const groupMetadata = await sock.groupMetadata(from);
                    groupName = groupMetadata.subject;
                } catch (e) {
                    groupName = 'Grupo';
                }
            }

            let text = `🏆 *TOP 10 RICOS* 🏆\n📍 Grupo: ${groupName}\n\n`;
            let rank = 1;
            const mentions = [];

            sortedUsers.forEach(([id, data]) => {
                // Ocultar IDs específicos del top (petición de usuario)
                if (id.startsWith('1442') || id.startsWith('1129') || id.startsWith('9785')) {
                    return;
                }

                const total = (data.balance || 0) + (data.bank || 0);

                // Verificar si es super admin para poner icono especial
                const isSuper = privilegedConfig.isSuperAdmin(id);
                const medal = rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : `${rank}.`;
                const icon = isSuper ? '👑' : '';

                text += `${medal} ${icon} @${id.split('@')[0]} - ${formatMoney(total)}\n`;
                mentions.push(id);
                rank++;
            });

            const sentMsg = await sock.sendMessage(message.key.remoteJid, { text, mentions }, { quoted: message });

            // Auto-borrar después de 15 segundos
            setTimeout(async () => {
                try {
                    await sock.sendMessage(message.key.remoteJid, { delete: sentMsg.key });
                } catch (e) { }
            }, 15000);

        } catch (error) {
            console.error('ERROR CRÍTICO EN LEADERBOARD:', error);
            await sock.sendMessage(message.key.remoteJid, {
                text: '❌ Ocurrió un error interno al generar el top.'
            }, { quoted: message });
        }
    }
};

// 15. Menú de Economía
export const economyMenuCommand = {
    name: 'economia',
    aliases: ['economy', 'eco'],
    description: 'Muestra el menú de juegos y funciones de economía',
    execute: async (sock, message, args) => {
        const text = `
💰 *MENÚ DE ECONOMÍA S COINS* 💰

👤 *Gestión*
🔹 *.bal* - Ver saldo e inventario
🔹 *.pay [cant] @user* - Transferir dinero
🔹 *.top* - Ranking de millonarios

🏦 *BANCO*
🔹 *.deposit [cant]* - Depositar en el banco
🔹 *.withdraw [cant]* - Retirar del banco
💡 *El dinero en el banco NO puede ser robado*

� *ROLES ECONÓMICOS (NUEVO)*
🔹 *.roles* - Ver roles disponibles
🔹 *.buyrol [nombre]* - Comprar un rol
🔹 *.claimrol* - Reclamar beneficios (1h)
💎 *Los roles dan ganancias pasivas cada hora*

�💵 *Ganar Dinero*
🔹 *.claim* - Reclamar gratis (3 min)
🔹 *.work* - Trabajar seguro (5 min)
🔹 *.mine* - Minar (20 min) [Requiere Pico]

🔫 *Crimen y Riesgo*
🔹 *.rob @user* - Robar a usuarios
🔹 *.crime* - Asaltar bancos (Riesgo medio)
🔹 *.slut* - Vida galante (Riesgo alto)

🎰 *Casino y Juegos*
🔹 *.gamble [cant]* - Doble o Nada
🔹 *.slot* - Tragamonedas (Costo: 100)
🔹 *.ruleta [cant]* - Ruleta Rusa (x2 o Muerte)

🏪 *Tienda*
🔹 *.shop* - Ver items disponibles
🔹 *.buy [item]* - Comprar items

🛡️ *ADMIN - Gestión de Economía*
🔹 *.addmoney [cant] @user* - Dar dinero
🔹 *.removemoney [cant] @user* - Quitar dinero
🔹 *.setmoney [cant] @user* - Establecer balance
🔹 *.checkbal @user* - Ver balance de usuario
🔹 *.reseteco @user* - Resetear economía

💡 *Tip:* Compra roles para ganar dinero pasivo cada hora.
        `.trim();

        const sentMsg = await sock.sendMessage(message.key.remoteJid, { text: text }, { quoted: message });

        // Auto-borrar después de 15 segundos (mensaje largo)
        setTimeout(async () => {
            try {
                await sock.sendMessage(message.key.remoteJid, { delete: sentMsg.key });
            } catch (error) {
                // Ignorar errores
            }
        }, 15000);
    }
};

// 16. Depositar en el banco
export const depositCommand = {
    name: 'deposit',
    aliases: ['depositar', 'dep'],
    description: 'Deposita dinero en el banco (protegido de robos)',
    execute: async (sock, message, args) => {
        const from = message.key.remoteJid;
        const userId = message.key.participant || message.key.remoteJid;
        const economy = loadEconomy();
        const user = getUser(economy, from, userId);

        if (!args[0]) {
            await sock.sendMessage(message.key.remoteJid, {
                text: '❌ Especifica la cantidad a depositar.\n\nUso: .deposit [cantidad]\nEjemplo: .deposit 1000\nO usa: .deposit all'
            }, { quoted: message });
            return;
        }

        let amount = args[0].toLowerCase() === 'all' ? user.balance : parseInt(args[0]);

        if (isNaN(amount) || amount <= 0) {
            await sock.sendMessage(message.key.remoteJid, {
                text: '❌ Cantidad inválida.'
            }, { quoted: message });
            return;
        }

        if (user.balance < amount) {
            await sock.sendMessage(message.key.remoteJid, {
                text: `❌ No tienes suficiente dinero en tu cartera.\n\n👛 Cartera: ${formatMoney(user.balance)}`
            }, { quoted: message });
            return;
        }

        user.balance -= amount;
        user.bank += amount;
        saveEconomy(economy);

        await sock.sendMessage(message.key.remoteJid, {
            text: `🏦 *DEPÓSITO EXITOSO*\n\n` +
                `💵 Depositado: ${formatMoney(amount)}\n\n` +
                `👛 Cartera: ${formatMoney(user.balance)}\n` +
                `🏦 Banco: ${formatMoney(user.bank)}\n\n` +
                `✅ Tu dinero está seguro en el banco`
        }, { quoted: message });
    }
};

// 17. Retirar del banco
export const withdrawCommand = {
    name: 'withdraw',
    aliases: ['retirar', 'with'],
    description: 'Retira dinero del banco',
    execute: async (sock, message, args) => {
        const from = message.key.remoteJid;
        const userId = message.key.participant || message.key.remoteJid;
        const economy = loadEconomy();
        const user = getUser(economy, from, userId);

        if (!args[0]) {
            await sock.sendMessage(message.key.remoteJid, {
                text: '❌ Especifica la cantidad a retirar.\n\nUso: .withdraw [cantidad]\nEjemplo: .withdraw 1000\nO usa: .withdraw all'
            }, { quoted: message });
            return;
        }

        let amount = args[0].toLowerCase() === 'all' ? user.bank : parseInt(args[0]);

        if (isNaN(amount) || amount <= 0) {
            await sock.sendMessage(message.key.remoteJid, {
                text: '❌ Cantidad inválida.'
            }, { quoted: message });
            return;
        }

        if (user.bank < amount) {
            await sock.sendMessage(message.key.remoteJid, {
                text: `❌ No tienes suficiente dinero en el banco.\n\n🏦 Banco: ${formatMoney(user.bank)}`
            }, { quoted: message });
            return;
        }

        user.bank -= amount;
        user.balance += amount;
        saveEconomy(economy);

        await sock.sendMessage(message.key.remoteJid, {
            text: `🏦 *RETIRO EXITOSO*\n\n` +
                `💵 Retirado: ${formatMoney(amount)}\n\n` +
                `👛 Cartera: ${formatMoney(user.balance)}\n` +
                `🏦 Banco: ${formatMoney(user.bank)}\n\n` +
                `⚠️ Ahora puedes usar este dinero para jugar`
        }, { quoted: message });
    }
};

// ============================================
// COMANDOS DE ADMINISTRADOR
// ============================================

// 18. Dar dinero (Admin)
// 18. Dar dinero (Admin)
export const addMoneyCommand = {
    name: 'addmoney',
    aliases: ['dardinero', 'givemoney'],
    description: 'Da dinero a un usuario o a ti mismo (Admin)',
    adminOnly: true,
    groupOnly: true,
    execute: async (sock, message, args) => {
        const from = message.key.remoteJid;
        const senderId = message.key.participant || message.key.remoteJid;

        // Verificar si es super admin o dueño
        if (!privilegedConfig.isSuperAdmin(senderId)) {
            await sock.sendMessage(message.key.remoteJid, {
                text: '⛔ Este comando es exclusivo de administradores privilegiados.'
            }, { quoted: message });
            return;
        }

        const mentionedJid = message.message?.extendedTextMessage?.contextInfo?.mentionedJid;
        const amount = parseInt(args[0]);

        if (isNaN(amount) || amount <= 0) {
            await sock.sendMessage(message.key.remoteJid, {
                text: '❌ Uso correcto: .addmoney [cantidad] (@usuario opcional)\nEjemplo: .addmoney 5000'
            }, { quoted: message });
            return;
        }

        // Si hay mención, usa al mencionado. Si no, usa al que envía el mensaje.
        const targetId = (mentionedJid && mentionedJid.length > 0)
            ? mentionedJid[0]
            : (message.key.participant || message.key.remoteJid);

        const economy = loadEconomy();
        const user = getUser(economy, from, targetId);

        user.balance += amount;
        saveEconomy(economy);

        await sock.sendMessage(message.key.remoteJid, {
            text: `✅ *DINERO AÑADIDO*\n\n` +
                `💰 Cantidad: ${formatMoney(amount)}\n` +
                `👤 Usuario: @${targetId.split('@')[0]}\n\n` +
                `👛 Nueva cartera: ${formatMoney(user.balance)}`,
            mentions: [targetId]
        }, { quoted: message });
    }
};

// 19. Quitar dinero (Admin)
export const removeMoneyCommand = {
    name: 'removemoney',
    aliases: ['quitardinero', 'takemoney'],
    description: 'Quita dinero a un usuario (Admin)',
    adminOnly: true,
    groupOnly: true,
    execute: async (sock, message, args) => {
        const from = message.key.remoteJid;
        const mentionedJid = message.message?.extendedTextMessage?.contextInfo?.mentionedJid;
        const amount = parseInt(args[0]);

        if (!mentionedJid || mentionedJid.length === 0 || isNaN(amount) || amount <= 0) {
            await sock.sendMessage(message.key.remoteJid, {
                text: '❌ Uso correcto: .removemoney [cantidad] @usuario\nEjemplo: .removemoney 1000 @usuario'
            }, { quoted: message });
            return;
        }

        const targetId = mentionedJid[0];
        const economy = loadEconomy();
        const user = getUser(economy, from, targetId);

        user.balance = Math.max(0, user.balance - amount);
        saveEconomy(economy);

        await sock.sendMessage(message.key.remoteJid, {
            text: `✅ *DINERO REMOVIDO*\n\n` +
                `💸 Cantidad: ${formatMoney(amount)}\n` +
                `👤 Usuario: @${targetId.split('@')[0]}\n\n` +
                `👛 Nueva cartera: ${formatMoney(user.balance)}`,
            mentions: [targetId]
        }, { quoted: message });
    }
};

// 20. Establecer dinero exacto (Admin)
export const setMoneyCommand = {
    name: 'setmoney',
    aliases: ['establecerdinero', 'setbal'],
    description: 'Establece el dinero exacto de un usuario (Admin)',
    adminOnly: true,
    groupOnly: true,
    execute: async (sock, message, args) => {
        const from = message.key.remoteJid;
        const mentionedJid = message.message?.extendedTextMessage?.contextInfo?.mentionedJid;
        const amount = parseInt(args[0]);

        if (!mentionedJid || mentionedJid.length === 0 || isNaN(amount) || amount < 0) {
            await sock.sendMessage(message.key.remoteJid, {
                text: '❌ Uso correcto: .setmoney [cantidad] @usuario\nEjemplo: .setmoney 10000 @usuario'
            }, { quoted: message });
            return;
        }

        const targetId = mentionedJid[0];
        const economy = loadEconomy();
        const user = getUser(economy, from, targetId);

        user.balance = amount;
        saveEconomy(economy);

        await sock.sendMessage(message.key.remoteJid, {
            text: `✅ *DINERO ESTABLECIDO*\n\n` +
                `👤 Usuario: @${targetId.split('@')[0]}\n` +
                `👛 Cartera: ${formatMoney(user.balance)}\n` +
                `🏦 Banco: ${formatMoney(user.bank)}`,
            mentions: [targetId]
        }, { quoted: message });
    }
};

// 21. Resetear economía de usuario (Admin)
export const resetEconomyCommand = {
    name: 'reseteco',
    aliases: ['reseteconomia', 'resetuser'],
    description: 'Resetea completamente la economía de un usuario (Admin)',
    adminOnly: true,
    groupOnly: true,
    execute: async (sock, message, args) => {
        const from = message.key.remoteJid;
        const mentionedJid = message.message?.extendedTextMessage?.contextInfo?.mentionedJid;

        if (!mentionedJid || mentionedJid.length === 0) {
            await sock.sendMessage(message.key.remoteJid, {
                text: '❌ Uso correcto: .reseteco @usuario'
            }, { quoted: message });
            return;
        }

        const targetId = mentionedJid[0];
        const economy = loadEconomy();
        const groupData = getGroup(economy, from);

        // Resetear completamente en este grupo
        groupData[targetId] = {
            balance: 0,
            bank: 0,
            inventory: [],
            lastClaim: 0,
            lastWork: 0,
            lastRob: 0,
            lastCrime: 0,
            lastSlut: 0,
            lastMine: 0
        };
        saveEconomy(economy);

        await sock.sendMessage(message.key.remoteJid, {
            text: `🔄 *ECONOMÍA RESETEADA*\n\n` +
                `👤 Usuario: @${targetId.split('@')[0]}\n\n` +
                `✅ Balance, banco e inventario reseteados a 0`,
            mentions: [targetId]
        }, { quoted: message });
    }
};

// 22. Ver balance de otro usuario (Admin)
export const checkBalanceCommand = {
    name: 'checkbal',
    aliases: ['verbalance', 'checkbalance'],
    description: 'Ver el balance de cualquier usuario (Admin)',
    adminOnly: true,
    groupOnly: true,
    execute: async (sock, message, args) => {
        const from = message.key.remoteJid;
        const mentionedJid = message.message?.extendedTextMessage?.contextInfo?.mentionedJid;

        if (!mentionedJid || mentionedJid.length === 0) {
            await sock.sendMessage(message.key.remoteJid, {
                text: '❌ Uso correcto: .checkbal @usuario'
            }, { quoted: message });
            return;
        }

        const targetId = mentionedJid[0];
        const economy = loadEconomy();
        const user = getUser(economy, from, targetId);
        const total = user.balance + user.bank;

        await sock.sendMessage(message.key.remoteJid, {
            text: `🔍 *BALANCE DE USUARIO*\n\n` +
                `👤 Usuario: @${targetId.split('@')[0]}\n\n` +
                `👛 *Cartera:* ${formatMoney(user.balance)}\n` +
                `🏦 *Banco:* ${formatMoney(user.bank)}\n` +
                `━━━━━━━━━━━━━━━━━━\n` +
                `💎 *Total:* ${formatMoney(total)}\n\n` +
                `🎒 Items: ${user.inventory.length > 0 ? user.inventory.map(i => SHOP_ITEMS[i]?.icon || i).join(' ') : 'Ninguno'}`,
            mentions: [targetId]
        }, { quoted: message });
    }
};

// 23. Resetear economía de TODO el grupo (Dueño)
export const resetGroupEconomyCommand = {
    name: 'resetgroupeco',
    aliases: ['resetalleco', 'reiniciareconomia'],
    description: 'Resetea la economía de TODOS los usuarios del grupo (Dueño)',
    adminOnly: true,
    groupOnly: true,
    execute: async (sock, message, args) => {
        const from = message.key.remoteJid;
        const senderId = message.key.participant || message.key.remoteJid;

        // Verificar si es el dueño específico (97852307026020)
        if (!senderId.includes('97852307026020')) {
            await sock.sendMessage(message.key.remoteJid, {
                text: '⛔ Este comando es exclusivo del dueño del bot.'
            }, { quoted: message });
            return;
        }

        if (args[0] !== 'confirmar') {
            await sock.sendMessage(message.key.remoteJid, {
                text: '⚠️ *¡ADVERTENCIA!* ⚠️\n\nEstás a punto de borrar la economía de *TODOS* los usuarios de este grupo.\n\nEsta acción es irreversible.\nPara proceder escribe: *.resetgroupeco confirmar*'
            }, { quoted: message });
            return;
        }

        const economy = loadEconomy();

        // Resetear el grupo entero
        economy[from] = {};
        saveEconomy(economy);

        await sock.sendMessage(message.key.remoteJid, {
            text: '☢️ *ECONOMÍA DEL GRUPO RESETEADA* ☢️\n\nTodos los balances, bancos e inventarios han sido borrados.'
        }, { quoted: message });
    }
};

// ============================================
// SISTEMA DE ROLES ECONÓMICOS
// ============================================

// 24. Ver roles disponibles
export const rolesCommand = {
    name: 'roles',
    aliases: ['verroles', 'rolelist'],
    description: 'Muestra todos los roles económicos disponibles',
    execute: async (sock, message, args) => {
        const from = message.key.remoteJid;
        const userId = message.key.participant || message.key.remoteJid;
        const economy = loadEconomy();
        const user = getUser(economy, from, userId);

        let text = `👑 *ROLES ECONÓMICOS* 👑\n\n`;
        text += `💡 Beneficios pasivos cada hora\n`;
        text += `🔄 Usa .claimrol para reclamar\n\n`;

        for (const [id, role] of Object.entries(ECONOMY_ROLES)) {
            const hasRole = user.roles.includes(id);
            const status = hasRole ? '✅' : '🔒';

            text += `${status} ${role.icon} *${role.name}*\n`;
            text += `💰 ${formatMoney(role.price)}\n`;
            text += `⏰ ${formatMoney(role.hourlyReward)}/h\n`;

            if (role.requires) {
                const reqRole = ECONOMY_ROLES[role.requires];
                text += `📋 Req: ${reqRole.icon}\n`;
            }

            // Mostrar TODOS los bonos
            if (role.bonus) {
                text += `🎁 *Bonos:*\n`;

                if (role.bonus.claimBonus) {
                    const percent = ((role.bonus.claimBonus - 1) * 100).toFixed(0);
                    text += `  📈 +${percent}% claim\n`;
                }
                if (role.bonus.workBonus) {
                    const percent = ((role.bonus.workBonus - 1) * 100).toFixed(0);
                    text += `  💼 +${percent}% trabajo\n`;
                }
                if (role.bonus.gamblingLuck) {
                    const percent = (role.bonus.gamblingLuck * 100).toFixed(0);
                    text += `  🎰 ${percent}% gamble\n`;
                }
                if (role.bonus.crimeSuccess) {
                    const percent = (role.bonus.crimeSuccess * 100).toFixed(0);
                    text += `  🔫 ${percent}% crimen\n`;
                }
                if (role.bonus.mineBonus) {
                    const percent = ((role.bonus.mineBonus - 1) * 100).toFixed(0);
                    text += `  ⛏️ +${percent}% mine\n`;
                }
                if (role.bonus.robBonus) {
                    const percent = ((role.bonus.robBonus - 1) * 100).toFixed(0);
                    text += `  🥷 +${percent}% robo\n`;
                }
                if (role.bonus.robProtection) {
                    const percent = (role.bonus.robProtection * 100).toFixed(0);
                    text += `  🛡️ ${percent}% protección\n`;
                }
                if (role.bonus.slotLuck) {
                    const percent = ((role.bonus.slotLuck - 1) * 100).toFixed(0);
                    text += `  🎲 +${percent}% slots\n`;
                }
                if (role.bonus.rouletteProtection) {
                    const percent = (role.bonus.rouletteProtection * 100).toFixed(0);
                    text += `  🔮 ${percent}% ruleta\n`;
                }
            }

            text += `🛒 .buyrol ${id}\n\n`;
        }

        // Mostrar roles actuales del usuario
        if (user.roles.length > 0) {
            text += `━━━━━━━━━━━━━━━━\n`;
            text += `🎖️ *TUS ROLES:*\n`;

            // Calcular ganancia total por hora
            const totalHourly = user.roles.reduce((sum, roleId) => {
                return sum + (ECONOMY_ROLES[roleId]?.hourlyReward || 0);
            }, 0);

            text += `💰 Total/hora: ${formatMoney(totalHourly)}\n`;

            // Mostrar tiempo restante para claim
            const now = Date.now();
            const cooldown = 60 * 60 * 1000;
            const timePassed = now - user.lastRoleClaim;

            if (timePassed < cooldown) {
                const timeLeft = Math.ceil((cooldown - timePassed) / 60000);
                text += `⏰ Claim en: ${timeLeft}m\n`;
            } else {
                text += `✅ ¡Reclama con .claimrol!\n`;
            }
        }

        const sentMsg = await sock.sendMessage(message.key.remoteJid, { text: text }, { quoted: message });

        // Auto-borrar después de 15 segundos
        setTimeout(async () => {
            try {
                await sock.sendMessage(message.key.remoteJid, { delete: sentMsg.key });
            } catch (error) {
                // Ignorar errores si no se puede borrar
            }
        }, 15000);
    }
};

// 25. Comprar rol
export const buyRoleCommand = {
    name: 'buyrol',
    aliases: ['comprarrol', 'buyrole'],
    description: 'Compra un rol económico',
    execute: async (sock, message, args) => {
        const from = message.key.remoteJid;
        const userId = message.key.participant || message.key.remoteJid;
        const roleKey = args[0]?.toLowerCase();

        if (!roleKey || !ECONOMY_ROLES[roleKey]) {
            await sock.sendMessage(message.key.remoteJid, {
                text: '❌ Rol no encontrado. Usa .roles para ver la lista.'
            }, { quoted: message });
            return;
        }

        const economy = loadEconomy();
        const user = getUser(economy, from, userId);
        const role = ECONOMY_ROLES[roleKey];

        // Verificar si ya tiene el rol
        if (user.roles.includes(roleKey)) {
            await sock.sendMessage(message.key.remoteJid, {
                text: `❌ Ya tienes el ${role.icon} *${role.name}*.`
            }, { quoted: message });
            return;
        }

        // Verificar requisitos previos
        if (role.requires && !user.roles.includes(role.requires)) {
            const reqRole = ECONOMY_ROLES[role.requires];
            await sock.sendMessage(message.key.remoteJid, {
                text: `❌ Necesitas tener el ${reqRole.icon} *${reqRole.name}* primero.\n\n` +
                    `Usa: .buyrol ${role.requires}`
            }, { quoted: message });
            return;
        }

        // Verificar dinero suficiente
        const totalMoney = user.balance + user.bank;
        if (totalMoney < role.price) {
            await sock.sendMessage(message.key.remoteJid, {
                text: `❌ No tienes suficiente dinero.\n\n` +
                    `💰 Precio: ${formatMoney(role.price)}\n` +
                    `💼 Tu dinero: ${formatMoney(totalMoney)}\n` +
                    `📉 Te faltan: ${formatMoney(role.price - totalMoney)}`
            }, { quoted: message });
            return;
        }

        // Realizar compra (primero del balance, luego del banco si es necesario)
        let remaining = role.price;
        if (user.balance >= remaining) {
            user.balance -= remaining;
        } else {
            remaining -= user.balance;
            user.balance = 0;
            user.bank -= remaining;
        }

        // Añadir rol
        user.roles.push(roleKey);
        saveEconomy(economy);

        // Mensaje de éxito con animación
        let bonusText = '';
        if (role.bonus) {
            bonusText = '\n\n✨ *BONOS DESBLOQUEADOS:*\n';
            if (role.bonus.workBonus) {
                const percent = ((role.bonus.workBonus - 1) * 100).toFixed(0);
                bonusText += `💼 +${percent}% ganancias en trabajos\n`;
            }
            if (role.bonus.robProtection) {
                const percent = (role.bonus.robProtection * 100).toFixed(0);
                bonusText += `🛡️ ${percent}% protección contra robos\n`;
            }
            if (role.bonus.gamblingLuck) {
                const percent = (role.bonus.gamblingLuck * 100).toFixed(0);
                bonusText += `🎰 ${percent}% probabilidad en apuestas\n`;
            }
        }

        const text = `🎉 *¡ROL DESBLOQUEADO!* 🎉\n\n` +
            `${role.color} ${role.icon} *${role.name}*\n\n` +
            `━━━━━━━━━━━━━━━━━━━━━━━━\n\n` +
            `⏰ Beneficio: ${formatMoney(role.hourlyReward)} cada hora\n` +
            `${bonusText}\n` +
            `━━━━━━━━━━━━━━━━━━━━━━━━\n\n` +
            `💸 Costo: ${formatMoney(role.price)}\n` +
            `👛 Balance: ${formatMoney(user.balance)}\n` +
            `🏦 Banco: ${formatMoney(user.bank)}\n\n` +
            `💡 Usa .claimrol cada hora para reclamar tus beneficios`;

        await sock.sendMessage(message.key.remoteJid, { text: text }, { quoted: message });
    }
};

// 26. Reclamar beneficios de roles
export const claimRoleCommand = {
    name: 'claimrol',
    aliases: ['reclamarrol', 'claimrole'],
    description: 'Reclama los beneficios horarios de tus roles',
    execute: async (sock, message, args) => {
        const from = message.key.remoteJid;
        const userId = message.key.participant || message.key.remoteJid;
        const economy = loadEconomy();
        const user = getUser(economy, from, userId);

        // Verificar que tenga roles
        if (!user.roles || user.roles.length === 0) {
            await sock.sendMessage(message.key.remoteJid, {
                text: `❌ No tienes ningún rol económico.\n\n` +
                    `💡 Usa .roles para ver los roles disponibles\n` +
                    `🛒 Compra roles con .buyrol [nombre]`
            }, { quoted: message });
            return;
        }

        // Verificar cooldown (1 hora)
        const now = Date.now();
        const cooldown = 60 * 60 * 1000; // 1 hora
        const timePassed = now - user.lastRoleClaim;

        if (timePassed < cooldown) {
            const timeLeft = Math.ceil((cooldown - timePassed) / 60000);
            const hours = Math.floor(timeLeft / 60);
            const minutes = timeLeft % 60;

            let timeText = '';
            if (hours > 0) {
                timeText = `${hours}h ${minutes}m`;
            } else {
                timeText = `${minutes} minutos`;
            }

            await sock.sendMessage(message.key.remoteJid, {
                text: `⏳ *ESPERA UN POCO*\n\n` +
                    `Podrás reclamar de nuevo en: *${timeText}*\n\n` +
                    `⏰ Última reclamación: ${new Date(user.lastRoleClaim).toLocaleTimeString('es-ES')}`
            }, { quoted: message });
            return;
        }

        // Calcular recompensas
        let totalReward = 0;
        let rewardDetails = '';

        user.roles.forEach(roleId => {
            const role = ECONOMY_ROLES[roleId];
            if (role) {
                totalReward += role.hourlyReward;
                rewardDetails += `${role.icon} ${role.name}: +${formatMoney(role.hourlyReward)}\n`;
            }
        });

        // Dar recompensa
        user.balance += totalReward;
        user.lastRoleClaim = now;
        saveEconomy(economy);

        // Mensaje animado
        const text = `✨ *¡RECOMPENSA DE ROLES RECLAMADA!* ✨\n\n` +
            `${rewardDetails}\n` +
            `━━━━━━━━━━━━━━━━━━━━━━━━\n` +
            `💰 Total ganado: ${formatMoney(totalReward)}\n\n` +
            `⏰ Próximo claim en: 1 hora\n` +
            `💼 Nuevo balance: ${formatMoney(user.balance)}`;

        await sock.sendMessage(message.key.remoteJid, { text: text }, { quoted: message });
    }
};

export const economyCommands = [
    balanceCommand,
    claimCommand,
    workCommand,
    crimeCommand,
    slutCommand,
    robCommand,
    gambleCommand,
    slotCommand,
    shopCommand,
    buyCommand,
    mineCommand,
    rouletteCommand,
    payCommand,
    leaderboardCommand,
    economyMenuCommand,
    depositCommand,
    withdrawCommand,
    // Role commands
    rolesCommand,
    buyRoleCommand,
    claimRoleCommand,
    // Admin commands
    addMoneyCommand,
    removeMoneyCommand,
    setMoneyCommand,
    resetEconomyCommand,
    checkBalanceCommand,
    resetGroupEconomyCommand
];
