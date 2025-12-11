import { CLASSES } from './rpgData.js';
import { getPlayer, updatePlayer, gainXp } from './rpgCore.js';

export const rpgClassCommand = {
    name: 'clase',
    aliases: ['class', 'rpgclass'],
    description: 'Sistema de clases del RPG',
    execute: async (sock, message, args) => {
        const from = message.key.remoteJid;
        const userId = message.key.participant || message.key.remoteJid;
        const subcommand = args[0]?.toLowerCase();

        let player = getPlayer(from, userId);

        // --- MENÚ DE AYUDA ---
        if (!subcommand || subcommand === 'help' || subcommand === 'ayuda') {
            const helpText = `
⚔️ *SISTEMA DE CLASES* ⚔️

📋 *CLASES DISPONIBLES*
🔹 *.clase elegir [clase]* - Elegir tu clase

🧙 *HECHICERO (mage)* - OP
   • Lanza hechizos devastadores
   • Hechizos: fireball, icespike, lightning, heal
   • Bonus: +5 INT, +50 Mana

🏹 *ARQUERO (archer)*
   • Ataque a distancia
   • Inmune a robos
   • 25% de crítico
   • Bonus: +5 AGI

⚔️ *GUERRERO (warrior)*
   • Daño x2 en ataques
   • Recibe x1.5 daño (riesgo)
   • Bonus: +6 STR, +3 VIT

🗡️ *ASESINO (assassin)*
   • Roba oro de enemigos muertos
   • Ataques sigilosos
   • Bonus: +4 AGI, +2 STR

💡 *COMANDOS DE COMBATE*
🔹 *.hechizo [nombre]* - Lanzar hechizo (solo hechicero)
   • fireball - Bola de fuego (30 dmg, 20 mana)
   • icespike - Estaca de hielo (25 dmg, 15 mana)
   • lightning - Rayo (35 dmg, 25 mana)
   • heal - Curación (+40 HP, 30 mana)

⚠️ Solo puedes elegir clase UNA VEZ
            `.trim();
            await sock.sendMessage(from, { text: helpText }, { quoted: message });
            return;
        }

        // Verificar si tiene personaje
        if (!player) {
            await sock.sendMessage(from, { text: '❌ No tienes un personaje. Usa *.rpg start* para crear uno.' }, { quoted: message });
            return;
        }

        // --- ELEGIR CLASE ---
        if (subcommand === 'elegir' || subcommand === 'choose') {
            const classKey = args[1]?.toLowerCase();

            if (player.class) {
                await sock.sendMessage(from, {
                    text: `❌ Ya eres ${CLASSES[player.class].name}. No puedes cambiar de clase.`
                }, { quoted: message });
                return;
            }

            if (!classKey || !CLASSES[classKey]) {
                await sock.sendMessage(from, {
                    text: '❌ Clase inválida. Usa: mage, archer, warrior, assassin'
                }, { quoted: message });
                return;
            }

            const selectedClass = CLASSES[classKey];
            player.class = classKey;

            // Aplicar bonos de clase
            if (selectedClass.bonus.str) player.stats.str += selectedClass.bonus.str;
            if (selectedClass.bonus.agi) player.stats.agi += selectedClass.bonus.agi;
            if (selectedClass.bonus.int) player.stats.int += selectedClass.bonus.int;
            if (selectedClass.bonus.vit) player.stats.vit += selectedClass.bonus.vit;
            if (selectedClass.bonus.mana) {
                player.maxMana += selectedClass.bonus.mana;
                player.mana += selectedClass.bonus.mana;
            }

            updatePlayer(from, userId, player);

            let text = `🎓 *¡CLASE ELEGIDA!* 🎓\n\nAhora eres *${selectedClass.name}*\n\n${selectedClass.description}\n\n`;

            if (classKey === 'mage') {
                text += `📚 *Hechizos Disponibles:*\n`;
                Object.entries(selectedClass.spells).forEach(([key, spell]) => {
                    text += `   • ${spell.name} - ${spell.description}\n`;
                });
            } else {
                text += `🎯 *Habilidades:* ${selectedClass.abilities.join(', ')}`;
            }

            await sock.sendMessage(from, { text }, { quoted: message });
            return;
        }

        // Comando no reconocido
        await sock.sendMessage(from, {
            text: '❌ Comando no reconocido. Usa *.clase* para ver todos los comandos.'
        }, { quoted: message });
    }
};

// Comando para lanzar hechizos (solo hechiceros)
export const spellCommand = {
    name: 'hechizo',
    aliases: ['spell', 'cast'],
    description: 'Lanzar hechizos (solo hechiceros)',
    execute: async (sock, message, args) => {
        const from = message.key.remoteJid;
        const userId = message.key.participant || message.key.remoteJid;
        const spellKey = args[0]?.toLowerCase();

        let player = getPlayer(from, userId);

        if (!player) {
            await sock.sendMessage(from, { text: '❌ No tienes un personaje.' }, { quoted: message });
            return;
        }

        if (player.class !== 'mage') {
            await sock.sendMessage(from, { text: '❌ Solo los hechiceros pueden lanzar hechizos.' }, { quoted: message });
            return;
        }

        if (player.state !== 'fighting' || !player.currentEnemy) {
            await sock.sendMessage(from, { text: '❌ No estás en combate. Usa *.rpg explorar* primero.' }, { quoted: message });
            return;
        }

        const mageClass = CLASSES.mage;
        const spell = mageClass.spells[spellKey];

        if (!spell) {
            let text = '❌ Hechizo inválido. Hechizos disponibles:\n\n';
            Object.entries(mageClass.spells).forEach(([key, s]) => {
                text += `🔮 *${s.name}* (.hechizo ${key})\n   ${s.description} - ${s.manaCost} mana\n\n`;
            });
            await sock.sendMessage(from, { text }, { quoted: message });
            return;
        }

        if (player.mana < spell.manaCost) {
            await sock.sendMessage(from, {
                text: `❌ No tienes suficiente mana. Necesitas ${spell.manaCost}, tienes ${player.mana}.`
            }, { quoted: message });
            return;
        }

        player.mana -= spell.manaCost;
        const enemy = player.currentEnemy;

        let battleLog = '';

        // Hechizo de curación
        if (spellKey === 'heal') {
            player.hp = Math.min(player.hp + spell.heal, player.maxHp);
            battleLog = `✨ Lanzas *${spell.name}*\n💚 Recuperas ${spell.heal} HP\n\n❤️ Tu HP: ${player.hp}/${player.maxHp}\n✨ Mana: ${player.mana}/${player.maxMana}`;

            updatePlayer(from, userId, { hp: player.hp, mana: player.mana });
            await sock.sendMessage(from, { text: battleLog }, { quoted: message });
            return;
        }

        // Hechizos de daño
        enemy.currentHp -= spell.damage;
        battleLog = `🔮 Lanzas *${spell.name}*\n💥 Haces ${spell.damage} de daño mágico\n`;

        if (enemy.currentHp <= 0) {
            // Victoria
            const { player: updatedPlayer, leveledUp } = gainXp(from, userId, enemy.xp);
            updatedPlayer.gold += enemy.level * 5;
            updatedPlayer.state = 'idle';
            updatedPlayer.currentEnemy = null;
            updatedPlayer.mana = player.mana;
            updatePlayer(from, userId, updatedPlayer);

            battleLog += `\n🎉 *¡VICTORIA!* 🎉\nHas derrotado al ${enemy.name}.\nGanaste *${enemy.xp} XP* y *${enemy.level * 5} oro*.`;

            if (leveledUp) {
                battleLog += `\n\n🆙 *¡SUBISTE DE NIVEL!* Ahora eres nivel ${updatedPlayer.level}.`;
            }

            await sock.sendMessage(from, { text: battleLog }, { quoted: message });
            return;
        }

        // Turno del enemigo
        const enemyDmg = Math.max(1, enemy.atk);
        player.hp -= enemyDmg;

        battleLog += `👹 El *${enemy.name}* contraataca y te hace *${enemyDmg}* de daño.\n`;
        battleLog += `\n❤️ Tu HP: ${player.hp}/${player.maxHp}\n✨ Mana: ${player.mana}/${player.maxMana}\n💔 Enemigo HP: ${enemy.currentHp}/${enemy.hp}`;

        if (player.hp <= 0) {
            player.hp = 0;
            player.state = 'dead';
            player.currentEnemy = null;
            updatePlayer(from, userId, player);

            battleLog += `\n\n💀 *¡HAS MUERTO!* 💀\nUsa *.rpg curar* para revivir.`;
        } else {
            updatePlayer(from, userId, { currentEnemy: enemy, hp: player.hp, mana: player.mana });
        }

        await sock.sendMessage(from, { text: battleLog }, { quoted: message });
    }
};
