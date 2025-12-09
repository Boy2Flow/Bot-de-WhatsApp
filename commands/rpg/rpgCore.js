import fs from 'fs';
import path from 'path';
import { RACES, MONSTERS, LOCATIONS } from './rpgData.js';

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

// Obtener jugador (o crear si no existe)
export function getPlayer(groupId, userId) {
    const data = loadRPG();
    if (!data[groupId]) data[groupId] = {};
    
    if (!data[groupId][userId]) {
        // Jugador nuevo (sin registrar)
        return null;
    }
    
    return data[groupId][userId];
}

// Crear nuevo jugador
export function createPlayer(groupId, userId, raceKey) {
    const data = loadRPG();
    if (!data[groupId]) data[groupId] = {};

    const race = RACES[raceKey];
    if (!race) return null;

    data[groupId][userId] = {
        race: raceKey,
        level: 1,
        xp: 0,
        xpToNext: 100,
        hp: race.stats.vit * 10,
        maxHp: race.stats.vit * 10,
        mana: race.stats.int * 10,
        maxMana: race.stats.int * 10,
        stats: { ...race.stats }, // Copia de stats base
        inventory: [],
        gold: 0,
        location: 'town',
        state: 'idle' // idle, fighting, dead
    };

    saveRPG(data);
    return data[groupId][userId];
}

// Actualizar jugador
export function updatePlayer(groupId, userId, updates) {
    const data = loadRPG();
    if (!data[groupId] || !data[groupId][userId]) return null;

    data[groupId][userId] = { ...data[groupId][userId], ...updates };
    saveRPG(data);
    return data[groupId][userId];
}

// Ganar XP
export function gainXp(groupId, userId, amount) {
    const data = loadRPG();
    const player = data[groupId][userId];
    
    player.xp += amount;
    let leveledUp = false;

    // Subir de nivel
    while (player.xp >= player.xpToNext) {
        player.xp -= player.xpToNext;
        player.level++;
        player.xpToNext = Math.floor(player.xpToNext * 1.5);
        
        // Mejorar stats
        player.stats.str += 1;
        player.stats.agi += 1;
        player.stats.int += 1;
        player.stats.vit += 1;
        
        // Recalcular HP/Mana
        player.maxHp = player.stats.vit * 10;
        player.hp = player.maxHp;
        player.maxMana = player.stats.int * 10;
        player.mana = player.maxMana;
        
        leveledUp = true;
    }

    saveRPG(data);
    return { player, leveledUp };
}
