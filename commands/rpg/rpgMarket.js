import fs from 'fs';
import path from 'path';
import { getPlayer, updatePlayer } from './rpgCore.js';

const MARKET_FILE = path.join(process.cwd(), 'rpg_market.json');

// --- CONFIGURACIÓN DE OBJETOS ---

const ITEM_PREFIXES = [
    'Viejo', 'Común', 'Reforzado', 'Magico', 'Antiguo', 'Legendario', 'Mítico'
];

const WEAPON_TYPES = {
    staff: { names: ['Bastón', 'Vara', 'Cetro'], stat: 'int', bonusKey: 'magicDmg', effectType: 'elemental' },
    sword: { names: ['Espada', 'Sable', 'Hoja'], stat: 'str', bonusKey: 'physDmg', effectType: 'critical' },
    greatsword: { names: ['Mandoble', 'Gran Espada', 'Claymore'], stat: 'str', bonusKey: 'physDmg', effectType: 'raw_damage' },
    bow: { names: ['Arco', 'Ballesta', 'Arco Largo'], stat: 'agi', bonusKey: 'rangedDmg', effectType: 'speed' }
};

const ARMOR_TYPES = {
    chest: { names: ['Pechera', 'Cota', 'Túnica'], stat: 'vit' },
    helmet: { names: ['Casco', 'Capucha', 'Yelmo'], stat: 'vit' }
};

const ELEMENTS = ['Fuego', 'Hielo', 'Rayo', 'Viento', 'Tierra', 'Oscuridad', 'Luz'];

const ENCHANTMENTS = [
    { name: 'Resistencia Mágica', key: 'magicRes', min: 5, max: 15 },
    { name: 'Regeneración de Maná', key: 'manaRegen', min: 2, max: 10 },
    { name: 'Defensa Mágica', key: 'magicDef', min: 3, max: 12 },
    { name: 'Robo de Vida', key: 'lifesteal', min: 1, max: 5 },
    { name: 'Golpe Crítico', key: 'critChance', min: 5, max: 20 }
];

// --- FUNCIONES DE GENERACIÓN ---

function getRandomElement(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}


function generateRandomItem(forceType = null) {
    const isWeapon = forceType ? forceType === 'weapon' : Math.random() < 0.6;
    const rarity = Math.random();

    let qualityMultiplier = 1;
    let qualityName = 'Común';
    let costMultiplier = 1;

    if (rarity > 0.95) { qualityMultiplier = 2.5; qualityName = 'Legendario'; costMultiplier = 5; }
    else if (rarity > 0.85) { qualityMultiplier = 1.8; qualityName = 'Épico'; costMultiplier = 3; }
    else if (rarity > 0.70) { qualityMultiplier = 1.4; qualityName = 'Raro'; costMultiplier = 2; }
    else if (rarity > 0.40) { qualityMultiplier = 1.1; qualityName = 'Inusual'; costMultiplier = 1.5; }

    const item = {
        id: Math.random().toString(36).substr(2, 9),
        rarity: qualityName
    };

    if (isWeapon) {
        const typeKey = getRandomElement(Object.keys(WEAPON_TYPES));
        const typeData = WEAPON_TYPES[typeKey];
        const baseName = getRandomElement(typeData.names);

        item.type = 'weapon';
        item.subtype = typeKey;

        // Stats base
        const baseDmg = Math.floor((Math.random() * 10 + 10) * qualityMultiplier);
        item.stats = { damage: baseDmg };

        // Efectos especiales según tipo
        if (typeKey === 'staff') {
            const element = getRandomElement(ELEMENTS);
            const magicBonus = Math.floor((Math.random() * 8 + 5) * qualityMultiplier);
            item.name = `${baseName} de ${element} ${qualityName}`;
            item.effect = `+${magicBonus} Daño de ${element}`;
            item.stats.magicDamage = magicBonus;
            item.stats.element = element;
        } else if (typeKey === 'greatsword') {
            const physBonus = Math.floor((Math.random() * 10 + 8) * qualityMultiplier);
            item.name = `${baseName} Pesado ${qualityName}`;
            item.effect = `+${physBonus} Daño Físico`;
            item.stats.physDamage = physBonus;
        } else {
            item.name = `${baseName} ${qualityName}`;
        }

        item.price = Math.floor(baseDmg * 15 * costMultiplier);

    } else {
        const typeKey = getRandomElement(Object.keys(ARMOR_TYPES));
        const typeData = ARMOR_TYPES[typeKey];
        const baseName = getRandomElement(typeData.names);

        item.type = 'armor';
        item.subtype = typeKey;

        // Stats base
        const baseDef = Math.floor((Math.random() * 8 + 5) * qualityMultiplier);
        item.stats = { defense: baseDef };

        // Encantamientos aleatorios
        const enchant = getRandomElement(ENCHANTMENTS);
        const enchantVal = Math.floor((Math.random() * (enchant.max - enchant.min) + enchant.min) * qualityMultiplier);

        item.name = `${baseName} de ${enchant.name}`;
        item.effect = `+${enchantVal} ${enchant.name}`;
        item.stats[enchant.key] = enchantVal;

        item.price = Math.floor(baseDef * 12 * costMultiplier);
    }

    return item;
}

function generateMarket() {
    const items = [];
    // Generar 20 armas
    for (let i = 0; i < 20; i++) {
        items.push(generateRandomItem('weapon'));
    }
    // Generar 20 armaduras
    for (let i = 0; i < 20; i++) {
        items.push(generateRandomItem('armor'));
    }

    const marketData = {
        lastRefresh: Date.now(),
        items: items
    };

    fs.writeFileSync(MARKET_FILE, JSON.stringify(marketData, null, 2));
    return marketData;
}

function getMarket() {
    let marketData = {};

    if (fs.existsSync(MARKET_FILE)) {
        try {
            marketData = JSON.parse(fs.readFileSync(MARKET_FILE, 'utf8'));
        } catch (e) {
            return generateMarket();
        }
    } else {
        return generateMarket();
    }

    // Comprobar si ha pasado 1 hora (3600000 ms)
    const ONE_HOUR = 60 * 60 * 1000;
    if (Date.now() - marketData.lastRefresh > ONE_HOUR) {
        return generateMarket();
    }

    return marketData;
}

export const marketCommand = {
    name: 'mercado',
    aliases: ['market', 'tienda', 'shop'],
    description: 'Mercado de objetos RPG (Se actualiza cada hora)',
    execute: async (sock, message, args) => {
        const from = message.key.remoteJid;
        const market = getMarket();
        const category = args[0]?.toLowerCase();

        let filteredItems = [];
        let title = '';
        let showIndex = false;

        if (category === 'armas' || category === 'weapons' || category === 'arma') {
            // Primeros 20 son armas
            filteredItems = market.items.slice(0, 20);
            title = '⚔️ ARMAS DISPONIBLES';
            showIndex = true;
        } else if (category === 'armaduras' || category === 'armor' || category === 'armors' || category === 'armadura') {
            // Siguientes 20 son armaduras
            filteredItems = market.items.slice(20, 40);
            title = '🛡️ ARMADURAS DISPONIBLES';
            showIndex = true;
        } else {
            // Menú principal
            const text = `🏪 *MERCADO NEGRO* 🏪\n_Productos nuevos cada hora_\n\n📦 *CATÁLOGO:*\n\n⚔️ *Armas*: Usa *.mercado armas*\n🛡️ *Armaduras*: Usa *.mercado armaduras*\n\n🛒 *COMPRA:*\n.comprar arma [ID] (1-20)\n.comprar armadura [ID] (1-20)\n\n🎒 *GESTION:*\n.inv - Ver inventario\n.equipar [num] - Usar objeto\n.desequipar [tipo] - Quitar objeto`;
            await sock.sendMessage(from, { text }, { quoted: message });
            return;
        }

        let text = `🏪 *${title}* 🏪\n\n`;

        filteredItems.forEach((item, index) => {
            // ID local (1-20)
            const localId = index + 1;

            text += `📦 *ID: ${localId}* | ${item.name}\n`;
            text += `   📝 ${item.rarity}\n`;
            if (item.stats.damage) text += `   ⚔️ Daño: ${item.stats.damage}\n`;
            if (item.stats.defense) text += `   🛡️ Defensa: ${item.stats.defense}\n`;
            if (item.effect) text += `   ✨ ${item.effect}\n`;
            text += `   💰 ${item.price} oro\n\n`;
        });

        if (category.startsWith('arm')) {
            text += `🛒 Para comprar: *.comprar arma [ID]*`;
        } else {
            text += `🛒 Para comprar: *.comprar armadura [ID]*`;
        }

        await sock.sendMessage(from, { text }, { quoted: message });
    }
};

export const buyCommand = {
    name: 'comprar',
    aliases: ['buy'],
    description: 'Comprar objeto del mercado',
    execute: async (sock, message, args) => {
        const from = message.key.remoteJid;
        const userId = message.key.participant || message.key.remoteJid;

        const type = args[0]?.toLowerCase(); // arma / armadura
        let localId = parseInt(args[1]);

        // Soporte legacy o directo (.comprar [ID GLOBAL]) - Opcional, pero mejor forzar la nueva sintaxis para evitar errores
        // Si el usuario pone solo numeros en el primer argumento, asumimos que intenta usar ID global, pero le guiaremos al nuevo sistema
        if (!isNaN(parseInt(type))) {
            await sock.sendMessage(from, { text: '❌ Usa el formato: .comprar arma [ID] o .comprar armadura [ID]' }, { quoted: message });
            return;
        }

        if (!localId || isNaN(localId)) {
            await sock.sendMessage(from, { text: '❌ Debes especificar el ID numérico. Ejemplo: .comprar arma 1' }, { quoted: message });
            return;
        }

        let realIndex = -1;

        if (type === 'arma' || type === 'weapon' || type === 'armas') {
            if (localId < 1 || localId > 20) {
                await sock.sendMessage(from, { text: '❌ El ID de arma debe ser entre 1 y 20.' }, { quoted: message });
                return;
            }
            realIndex = localId - 1; // 0-19
        } else if (type === 'armadura' || type === 'armor' || type === 'armaduras') {
            if (localId < 1 || localId > 20) {
                await sock.sendMessage(from, { text: '❌ El ID de armadura debe ser entre 1 y 20.' }, { quoted: message });
                return;
            }
            realIndex = localId - 1 + 20; // 20-39
        } else {
            await sock.sendMessage(from, { text: '❌ Tipo desconocido. Usa "arma" o "armadura".' }, { quoted: message });
            return;
        }

        const player = getPlayer(from, userId);
        if (!player) {
            await sock.sendMessage(from, { text: '❌ No tienes personaje. Usa .rpg start' }, { quoted: message });
            return;
        }

        const market = getMarket();
        const item = market.items[realIndex];

        if (!item) {
            await sock.sendMessage(from, { text: '❌ Error: Objeto no encontrado. Intenta de nuevo.' }, { quoted: message });
            return;
        }

        if (player.gold < item.price) {
            await sock.sendMessage(from, { text: `❌ No tienes suficiente oro. Necesitas ${item.price}.` }, { quoted: message });
            return;
        }

        // Realizar compra
        player.gold -= item.price;
        if (!player.inventory) player.inventory = [];
        player.inventory.push(item);

        updatePlayer(from, userId, { gold: player.gold, inventory: player.inventory });

        await sock.sendMessage(from, { text: `✅ ¡Has comprado *${item.name}* por ${item.price} oro!` }, { quoted: message });
    }
};
