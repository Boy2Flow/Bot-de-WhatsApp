import { getPlayer, updatePlayer } from './rpgCore.js';

export const inventoryCommand = {
    name: 'inventario',
    aliases: ['inv', 'mochila'],
    description: 'Muestra tu inventario y objetos equipados',
    execute: async (sock, message, args) => {
        const from = message.key.remoteJid;
        const userId = message.key.participant || message.key.remoteJid;

        const player = getPlayer(from, userId);
        if (!player) {
            await sock.sendMessage(from, { text: '❌ No tienes personaje. Usa .rpg start' }, { quoted: message });
            return;
        }

        let text = `🎒 *INVENTARIO DE ${message.pushName || 'Aventurero'}* 🎒\n\n`;

        // Objetos equipados
        text += `🛡️ *EQUIPAMIENTO ACTUAL:*\n`;
        const weapon = player.equipped?.weapon;
        const armor = player.equipped?.armor;

        text += `⚔️ Arma: ${weapon ? weapon.name : 'Puños'}\n`;
        if (weapon) {
            text += `   └ Daño: ${weapon.stats.damage} ${weapon.effect ? `| ${weapon.effect}` : ''}\n`;
        }
        text += `🛡️ Armadura: ${armor ? armor.name : 'Ropa de civil'}\n`;
        if (armor) {
            text += `   └ Defensa: ${armor.stats.defense} ${armor.effect ? `| ${armor.effect}` : ''}\n`;
        }
        text += `\n📦 *OBJETOS EN MOCHILA:*\n`;

        if (!player.inventory || player.inventory.length === 0) {
            text += `_Mochila vacía_\n`;
        } else {
            player.inventory.forEach((item, index) => {
                const typeIcon = item.type === 'weapon' ? '⚔️' : item.type === 'armor' ? '🛡️' : '📦';
                text += `${index + 1}. ${typeIcon} *${item.name}* | ${item.rarity}\n`;
            });
        }

        text += `\n⚙️ *COMANDOS:*\n.equipar [número] - Equipar objeto\n.desequipar arma - Quitar arma\n.desequipar armadura - Quitar armadura`;

        await sock.sendMessage(from, { text }, { quoted: message });
    }
};

export const equipCommand = {
    name: 'equipar',
    aliases: ['equip', 'poner'],
    description: 'Equipar un objeto del inventario',
    execute: async (sock, message, args) => {
        const from = message.key.remoteJid;
        const userId = message.key.participant || message.key.remoteJid;

        const player = getPlayer(from, userId);
        if (!player) return;

        // Soporte para evitar errores si el usuario pone ".equipar arma [ID]" pensando que funciona asi
        // Si el primer argumento no es un número, intentamos ver si es 'arma' o 'armadura' y buscamos el segundo argumento
        let itemIndex = parseInt(args[0]);
        if (isNaN(itemIndex)) {
            // Chequear si puso "arma" o "armadura" primero
            const type = args[0]?.toLowerCase();
            if (['arma', 'armadura', 'weapon', 'armor'].includes(type)) {
                itemIndex = parseInt(args[1]);
            }
        }

        if (isNaN(itemIndex) || itemIndex <= 0) {
            await sock.sendMessage(from, { text: '❌ Indica el número del objeto en tu inventario. Usa .inv para ver los números.' }, { quoted: message });
            return;
        }

        const realIndex = itemIndex - 1;

        if (!player.inventory || !player.inventory[realIndex]) {
            await sock.sendMessage(from, { text: '❌ Objeto no encontrado en tu inventario.' }, { quoted: message });
            return;
        }

        const item = player.inventory[realIndex];

        // Inicializar equipamiento si no existe
        if (!player.equipped) player.equipped = {};

        // Desequipar lo que ya tenga en ese slot
        if (item.type === 'weapon') {
            if (player.equipped.weapon) {
                // Devolver a inventario
                player.inventory.push(player.equipped.weapon);
            }
            player.equipped.weapon = item;
        } else if (item.type === 'armor') {
            if (player.equipped.armor) {
                // Devolver a inventario
                player.inventory.push(player.equipped.armor);
            }
            player.equipped.armor = item;
        } else {
            await sock.sendMessage(from, { text: '❌ Este objeto no se puede equipar.' }, { quoted: message });
            return;
        }

        // Eliminar del inventario (está equipado ahora)
        player.inventory.splice(realIndex, 1);

        updatePlayer(from, userId, {
            equipped: player.equipped,
            inventory: player.inventory
        });

        await sock.sendMessage(from, { text: `✅ Has equipado: *${item.name}*` }, { quoted: message });
    }
};

export const unequipCommand = {
    name: 'desequipar',
    aliases: ['unequip', 'quitar'],
    description: 'Desequipar un objeto',
    execute: async (sock, message, args) => {
        const from = message.key.remoteJid;
        const userId = message.key.participant || message.key.remoteJid;

        const player = getPlayer(from, userId);
        if (!player) return;

        const type = args[0]?.toLowerCase();

        if (!['arma', 'weapon', 'armadura', 'armor'].includes(type)) {
            await sock.sendMessage(from, { text: '❌ ¿Qué quieres desequipar? Usa ".desequipar arma" o ".desequipar armadura"' }, { quoted: message });
            return;
        }

        if (!player.equipped) {
            await sock.sendMessage(from, { text: '❌ No tienes nada equipado.' }, { quoted: message });
            return;
        }

        let unequippedItem = null;

        if (type === 'arma' || type === 'weapon') {
            if (player.equipped.weapon) {
                unequippedItem = player.equipped.weapon;
                delete player.equipped.weapon;
            } else {
                await sock.sendMessage(from, { text: '❌ No tienes arma equipada.' }, { quoted: message });
                return;
            }
        } else {
            if (player.equipped.armor) {
                unequippedItem = player.equipped.armor;
                delete player.equipped.armor;
            } else {
                await sock.sendMessage(from, { text: '❌ No tienes armadura equipada.' }, { quoted: message });
                return;
            }
        }

        // Devolver a inventario
        if (!player.inventory) player.inventory = [];
        player.inventory.push(unequippedItem);

        updatePlayer(from, userId, {
            equipped: player.equipped,
            inventory: player.inventory
        });

        await sock.sendMessage(from, { text: `✅ Has desequipado: *${unequippedItem.name}*` }, { quoted: message });
    }
};
