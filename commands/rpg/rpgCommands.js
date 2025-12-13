import { RACES, MONSTERS, LOCATIONS, AFFLICTIONS } from './rpgData.js';
import { getPlayer, createPlayer, updatePlayer, gainXp } from './rpgCore.js';

// Helper para calcular daño PvP
function calculatePvpDamage(attacker, defender) {
    const weapon = attacker.equipped?.weapon;
    let weaponDmg = weapon?.stats?.damage || 0;

    // Stats base
    let baseDmg = 0;
    if (weapon?.subtype === 'staff') {
        baseDmg = Math.floor(attacker.stats.int * 1.5);
        if (weapon.stats.magicDamage) weaponDmg += weapon.stats.magicDamage;
    } else {
        baseDmg = Math.floor(attacker.stats.str * 1.5);
    }

    // Hechizo
    const spell = attacker.equipped?.spell;
    let spellDmg = 0;
    if (spell) {
        let baseSpellDmg = spell.stats.magicDamage || 0;
        if (spell.subtype === 'summon' && spell.stats.summonDamage) {
            baseSpellDmg = spell.stats.summonDamage;
        }
        spellDmg = baseSpellDmg + Math.floor(attacker.stats.int * 2);
    }

    const totalDmg = baseDmg + weaponDmg + spellDmg + Math.floor(Math.random() * 5);

    // Defensa
    const armor = defender.equipped?.armor;
    let defense = armor?.stats?.defense || 0;
    if (armor?.stats?.magicDef) defense += Math.floor(armor.stats.magicDef / 2);

    // Reducción
    return Math.max(1, totalDmg - Math.floor(defense / 2));
}

// Lógica principal de atacar/combate (reutilizable)
async function processAttack(sock, message, args, player) {
    const from = message.key.remoteJid;
    const userId = message.key.participant || message.key.remoteJid;

    // --- LÓGICA PVP ---
    const mentionedJid = message.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0];
    const pvpAction = args[0]?.toLowerCase(); // aceptar, denegar, etc.

    // 1. Iniciar Desafío (.atacar @usuario)
    if (mentionedJid) {
        if (mentionedJid === userId) {
            await sock.sendMessage(from, { text: '❌ No puedes atacarte a ti mismo.' }, { quoted: message });
            return;
        }

        const target = getPlayer(from, mentionedJid);
        if (!target) {
            await sock.sendMessage(from, { text: '❌ El usuario mencionado no tiene personaje RPG o no existe.' }, { quoted: message });
            return;
        }

        if (player.hp <= 0 || target.hp <= 0) {
            await sock.sendMessage(from, { text: '❌ Uno de los jugadores está muerto.' }, { quoted: message });
            return;
        }

        // Guardar desafío en memoria
        if (!global.pvpChallenges) global.pvpChallenges = {};
        global.pvpChallenges[mentionedJid] = userId;

        const text = `⚔️ *¡DESAFÍO PVP!* ⚔️\n\n@${userId.split('@')[0]} ha desafiado a @${mentionedJid.split('@')[0]} a un duelo a muerte.\n\n🛡️ *Para aceptar:* .atacar aceptar\n🏳️ *Para rechazar:* .atacar denegar`;
        await sock.sendMessage(from, { text, mentions: [userId, mentionedJid] }, { quoted: message });
        return;
    }

    // 2. Aceptar Desafío (.atacar aceptar)
    if (pvpAction === 'aceptar' || pvpAction === 'accept') {
        if (!global.pvpChallenges || !global.pvpChallenges[userId]) {
            await sock.sendMessage(from, { text: '❌ No tienes ningún desafío pendiente.' }, { quoted: message });
            return;
        }

        const challengerId = global.pvpChallenges[userId];
        const challenger = getPlayer(from, challengerId);
        const defender = player;

        delete global.pvpChallenges[userId];

        if (!challenger || challenger.hp <= 0) {
            await sock.sendMessage(from, { text: '❌ El desafiante ya no está disponible.' }, { quoted: message });
            return;
        }

        // --- SIMULACIÓN DE COMBATE PVP ---
        let log = `⚔️ *DUELO: ${challengerId.split('@')[0]} vs ${userId.split('@')[0]}* ⚔️\n\n`;
        let turn = 1;
        let p1 = { ...challenger, id: challengerId };
        let p2 = { ...defender, id: userId };

        while (p1.hp > 0 && p2.hp > 0 && turn <= 10) {
            // Turno P1 -> P2
            let dmg1 = calculatePvpDamage(p1, p2);
            p2.hp -= dmg1;
            log += `👊 *R${turn}*: @${p1.id.split('@')[0]} hace ${dmg1} daño.\n`;

            if (p2.hp <= 0) break;

            // Turno P2 -> P1
            let dmg2 = calculatePvpDamage(p2, p1);
            p1.hp -= dmg2;
            log += `🛡️ *R${turn}*: @${p2.id.split('@')[0]} devuelve ${dmg2} daño.\n`;

            turn++;
        }

        // Resultado
        let winner = null;
        let loser = null;

        if (p1.hp <= 0 && p2.hp <= 0) {
            log += `\n💀 *¡EMPATE MORTAL!* Ambos han caído.`;
            updatePlayer(from, challengerId, { hp: 1, state: 'idle' });
            updatePlayer(from, userId, { hp: 1, state: 'idle' });
        } else if (p1.hp <= 0) {
            winner = defender;
            loser = challenger;
            log += `\n🏆 *¡VICTORIA para @${userId.split('@')[0]}!*`;
        } else {
            winner = challenger;
            loser = defender;
            log += `\n🏆 *¡VICTORIA para @${challengerId.split('@')[0]}!*`;
        }

        if (winner && loser) {
            const xpW = 150;
            const xpL = 50;
            const lostGold = Math.floor(loser.gold * 0.1);
            loser.gold -= lostGold;
            winner.gold += lostGold;

            const { leveledUp: lvlW } = gainXp(from, (winner === challenger ? challengerId : userId), xpW);
            gainXp(from, (loser === challenger ? challengerId : userId), xpL);

            updatePlayer(from, (winner === challenger ? challengerId : userId), { gold: winner.gold });
            updatePlayer(from, (loser === challenger ? challengerId : userId), { hp: 0, state: 'dead', gold: loser.gold });

            log += `\n\n💰 Botín: ${lostGold} oro robado.`;
            log += `\n✨ XP: Ganador +${xpW} | Perdedor +${xpL}`;
            if (lvlW) log += `\n🆙 ¡El ganador subió de nivel!`;
        }

        await sock.sendMessage(from, { text: log, mentions: [challengerId, userId] }, { quoted: message });
        return;
    }

    // 3. Rechazar Desafío
    if (pvpAction === 'denegar' || pvpAction === 'deny') {
        if (!global.pvpChallenges || !global.pvpChallenges[userId]) {
            await sock.sendMessage(from, { text: '❌ No tienes desafíos.' }, { quoted: message });
            return;
        }
        delete global.pvpChallenges[userId];
        await sock.sendMessage(from, { text: '🏳️ Desafío rechazado cobardemente.' }, { quoted: message });
        return;
    }

    // --- LÓGICA PVE ---
    if (player.state !== 'fighting' || !player.currentEnemy) {
        await sock.sendMessage(from, { text: '❌ No hay enemigo. Usa .rpg explorar o etiqueta a alguien para PvP.' }, { quoted: message });
        return;
    }

    const enemy = player.currentEnemy;

    const weapon = player.equipped?.weapon;
    let weaponDmg = weapon?.stats?.damage || 0;

    let statScaling = 0;
    if (weapon?.subtype === 'staff') {
        statScaling = Math.floor(player.stats.int * 1.5);
        if (weapon.stats.magicDamage) weaponDmg += weapon.stats.magicDamage;
    } else {
        statScaling = Math.floor(player.stats.str * 1.5);
    }

    const spell = player.equipped?.spell;
    let spellDmg = 0;
    let spellMsg = '';

    if (spell) {
        let baseSpellDmg = spell.stats.magicDamage || 0;
        let isSummon = false;

        if (spell.subtype === 'summon' && spell.stats.summonDamage) {
            baseSpellDmg = spell.stats.summonDamage;
            isSummon = true;
        }

        spellDmg = baseSpellDmg + Math.floor(player.stats.int * 2);

        if (isSummon) {
            spellMsg = `\n👻 *${spell.name}*: +${spellDmg} daño (Invocación)`;
        } else {
            spellMsg = `\n🔥 *${spell.name}*: +${spellDmg} daño mágico`;
        }
    }

    const playerDmg = statScaling + weaponDmg + spellDmg + Math.floor(Math.random() * 5);
    enemy.currentHp -= playerDmg;

    let battleLog = `🗡️ Atacas: ${playerDmg} daño total${spellMsg}\n`;

    if (enemy.currentHp <= 0) {
        const { player: updatedPlayer, leveledUp } = gainXp(from, userId, enemy.xp);
        updatedPlayer.gold += enemy.level * 5;
        updatedPlayer.state = 'idle';
        updatedPlayer.currentEnemy = null;
        updatePlayer(from, userId, updatedPlayer);

        battleLog += `\n🎉 ¡VICTORIA!\n+${enemy.xp} XP | +${enemy.level * 5} oro`;
        if (leveledUp) battleLog += `\n\n🆙 ¡NIVEL ${updatedPlayer.level}!`;

        await sock.sendMessage(from, { text: battleLog }, { quoted: message });
        return;
    }

    const armor = player.equipped?.armor;
    let defense = armor?.stats?.defense || 0;
    if (armor?.stats?.magicDef) defense += Math.floor(armor.stats.magicDef / 2);

    let enemyAttack = enemy.atk;
    const damageTaken = Math.max(1, enemyAttack - Math.floor(defense / 2));
    player.hp -= damageTaken;

    if (enemy.canInfect && Math.random() < 0.2) {
        const afflictionKey = enemy.canInfect;
        if (!player.afflictions) player.afflictions = [];
        if (!player.afflictions.includes(afflictionKey)) {
            player.afflictions.push(afflictionKey);
            const affData = AFFLICTIONS[afflictionKey];
            battleLog += `\n\n⚠️ *¡MALDICIÓN OCURRIDA!*\n¡Has contraído: *${affData.name}*!`;
            updatePlayer(from, userId, { afflictions: player.afflictions });
        }
    }

    battleLog += `👹 Enemigo ataca: ${damageTaken} daño (🛡️-${Math.floor(defense / 2)})\n\n❤️ Tu HP: ${player.hp}/${player.maxHp}\n💔 Enemigo: ${enemy.currentHp}/${enemy.hp}`;

    if (player.hp <= 0) {
        player.hp = 0;
        player.state = 'dead';
        player.currentEnemy = null;
        updatePlayer(from, userId, player);
        battleLog += `\n\n💀 ¡MUERTO! Usa .rpg curar`;
    } else {
        updatePlayer(from, userId, { currentEnemy: enemy, hp: player.hp });
    }

    await sock.sendMessage(from, { text: battleLog }, { quoted: message });
}

export const rpgCommand = {
    name: 'rpg',
    aliases: ['rol', 'aventura', 'atacar'], // Agregado 'atacar' para que lo reconozca
    description: 'Juego de Rol de Fantasía y Combate',
    execute: async (sock, message, args) => {
        const from = message.key.remoteJid;
        const userId = message.key.participant || message.key.remoteJid;

        let subcommand = args[0]?.toLowerCase();
        let pvpArgs = args.slice(1);

        // Si el comando invocado fue directamente '.atacar' (verificamos si el first arg NO es 'start', 'perfil', etc.)
        // O si viene de un alias. Como el messageHandler pasa 'atacar' como commandName y args empieza con lo siguiente.
        // Pero rpgCommand.execute recibe (sock, message, args).
        // Si el usuario escribe .atacar @user -> commandName='atacar', args=['@user']
        // El handler busca command.name='rpg' OR alias='atacar'.
        // Entonces entra aquí.
        // Si args[0] es @user (empieza por @ o número), asumimos que es acción de atacar DIRECTA.

        const isDirectAttack = message.message?.conversation?.startsWith('.atacar') ||
            message.message?.extendedTextMessage?.text?.startsWith('.atacar') ||
            message.message?.conversation?.startsWith('.fight') ||
            message.message?.extendedTextMessage?.text?.startsWith('.fight');

        // Corrección de argumentos si se llamó directamente
        if (isDirectAttack) {
            // Si fue llamado como .atacar @user, args es ['@user'].
            // Queremos que subcommand sea 'atacar'.
            subcommand = 'atacar';
            pvpArgs = args; // pasamos todos los args a processAttack
        }

        let player = getPlayer(from, userId);

        // AYUDA COMPACTA SI NO HAY ARGS
        if (!subcommand && !isDirectAttack) {
            // ... (mostrar ayuda simplificada)
            subcommand = 'menu';
        }

        // --- MANEJO DE COMANDOS ---

        if (subcommand === 'menu' || subcommand === 'help' || subcommand === 'ayuda') {
            const helpText = `⚔️ *RPG MENU* ⚔️\n.rpg start [raza]\n.rpg perfil\n.rpg explorar\n.atacar @user\n.mercado\n.clase\n.train`;
            await sock.sendMessage(from, { text: helpText }, { quoted: message });
            return;
        }

        if (subcommand === 'start') {
            const raceKey = args[1]?.toLowerCase();
            if (!player && raceKey && RACES[raceKey]) {
                createPlayer(from, userId, raceKey);
                await sock.sendMessage(from, { text: '✅ Personaje creado.' }, { quoted: message });
            } else if (!player) {
                let text = '⚔️ *Elige Raza:*\n';
                Object.keys(RACES).forEach(k => text += `.rpg start ${k}\n`);
                await sock.sendMessage(from, { text }, { quoted: message });
            } else {
                await sock.sendMessage(from, { text: '❌ Ya tienes personaje.' }, { quoted: message });
            }
            return;
        }

        if (!player) {
            await sock.sendMessage(from, { text: '❌ Crea personaje con .rpg start' }, { quoted: message });
            return;
        }

        if (subcommand === 'atacar' || subcommand === 'fight' || subcommand === 'attack') {
            await processAttack(sock, message, pvpArgs, player);
            return;
        }

        if (subcommand === 'explorar') {
            if (player.state === 'fighting') return sock.sendMessage(from, { text: '⚔️ Estás en combate.' });
            if (player.hp <= 0) return sock.sendMessage(from, { text: '💀 Estás muerto.' });

            const roll = Math.random();
            if (roll < 0.6) {
                const m = MONSTERS[Math.floor(Math.random() * MONSTERS.length)];
                updatePlayer(from, userId, { state: 'fighting', currentEnemy: { ...m, currentHp: m.hp } });
                await sock.sendMessage(from, { text: `⚔️ *¡${m.name}!* (HP: ${m.hp})\nUsa .atacar` });
            } else {
                player.gold += 10;
                updatePlayer(from, userId, { gold: player.gold });
                await sock.sendMessage(from, { text: '💰 Encontraste 10 oro.' });
            }
            return;
        }

        if (subcommand === 'perfil') {
            await sock.sendMessage(from, { text: `📜 *${message.pushName}* (Lvl ${player.level})\n❤️ ${player.hp}/${player.maxHp} | 💰 ${player.gold}` });
            return;
        }

        if (subcommand === 'curar') {
            if (player.gold >= 10) {
                player.gold -= 10;
                player.hp = player.maxHp;
                player.mana = player.maxMana;
                player.state = 'idle';
                updatePlayer(from, userId, player);
                await sock.sendMessage(from, { text: '💖 Curado.' });
            } else {
                await sock.sendMessage(from, { text: '❌ Necesitas 10 oro.' });
            }
            return;
        }
    }
};

export const attackCommand = {
    name: 'atacar',
    aliases: ['fight', 'attack'],
    description: 'Atacar enemigo o jugador',
    execute: async (sock, message, args) => {
        // Redirige al comando principal pero forzando la acción
        // Esto es necesario para que el handler lo encuentre como comando independiente
        const from = message.key.remoteJid;
        const userId = message.key.participant || message.key.remoteJid;
        const player = getPlayer(from, userId);

        if (!player) {
            await sock.sendMessage(from, { text: '❌ Crea un personaje con .rpg start' }, { quoted: message });
            return;
        }

        await processAttack(sock, message, args, player);
    }
};

export const trainCommand = {
    name: 'train',
    aliases: ['entrenar'],
    description: 'Entrenar XP',
    execute: async (sock, message, args) => {
        const from = message.key.remoteJid;
        const userId = message.key.participant || message.key.remoteJid;
        const player = getPlayer(from, userId);
        if (!player) return;

        const now = Date.now();
        if (now - (player.lastTrain || 0) < 300000) {
            return sock.sendMessage(from, { text: '⏳ Espera un poco.' });
        }

        const xp = 100 + player.level * 2;
        updatePlayer(from, userId, { lastTrain: now });
        const { leveledUp } = gainXp(from, userId, xp);
        await sock.sendMessage(from, { text: `💪 +${xp} XP${leveledUp ? ' | 🆙 LEVEL UP!' : ''}` });
    }
};
