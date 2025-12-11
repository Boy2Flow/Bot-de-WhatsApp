import { RACES, MONSTERS, LOCATIONS, AFFLICTIONS } from './rpgData.js';
import { getPlayer, createPlayer, updatePlayer, gainXp } from './rpgCore.js';

export const rpgCommand = {
    name: 'rpg',
    aliases: ['rol', 'aventura'],
    description: 'Juego de Rol de Fantasía',
    execute: async (sock, message, args) => {
        const from = message.key.remoteJid;
        const userId = message.key.participant || message.key.remoteJid;
        const subcommand = args[0]?.toLowerCase();

        let player = getPlayer(from, userId);

        // AYUDA
        if (!subcommand || subcommand === 'help' || subcommand === 'ayuda' || subcommand === 'menu') {
            const helpText = `
⚔️ *GUÍA COMPLETA RPG* ⚔️

📋 *COMANDOS BÁSICOS*
🔹 *.rpg start [raza]* - Crear personaje
🔹 *.rpg perfil* - Ver estadísticas
🔹 *.rpg explorar* - Buscar aventuras
🔹 *.rpg atacar* - Atacar enemigo
🔹 *.rpg curar* - Recuperar salud (10 oro)

🧬 *RAZAS DISPONIBLES*
• human - Humano (equilibrado)
• orc - Orco (tanque fuerte)
• wood_elf - Elfo del Bosque (ágil)
• high_elf - Alto Elfo (mago)
• dark_elf - Elfo Oscuro (asesino)
• nord - Nórdico (guerrero)
• dwarf - Enano (resistente)

⚔️ *SISTEMA DE CLASES*
🔹 *.clase* - Ver clases disponibles
🔹 *.clase elegir [clase]* - Elegir clase

🎓 *Clases:*
• mage - Hechicero (OP, lanza hechizos)
• archer - Arquero (críticos, inmune a robos)
• warrior - Guerrero (daño x2, riesgo x1.5)
• assassin - Asesino (roba oro extra)

🔮 *HECHIZOS (Solo Hechicero)*
🔹 *.hechizo [nombre]* - Lanzar hechizo
• fireball - Bola de fuego (30 dmg)
• icespike - Estaca de hielo (25 dmg)
• lightning - Rayo (35 dmg)
• heal - Curación (+40 HP)

🌟 *SISTEMA EXTENDIDO*
🔹 *.rpgx* - Ver comandos avanzados
• Facciones militares
• Profesiones especiales
• Aflicciones y maldiciones

🛡️ *ADMIN (Solo Owner)*
🔹 *.rpgadmin* - Panel de administración
• Gestión de jugadores
• Modificar stats
• Borrar datos

💡 *CÓMO JUGAR*
1️⃣ Crea personaje: .rpg start [raza]
2️⃣ Elige clase: .clase elegir [clase]
3️⃣ Explora y combate: .rpg explorar
4️⃣ Sube de nivel y hazte poderoso

🎮 ¡Comienza tu aventura ahora!
            `.trim();
            await sock.sendMessage(from, { text: helpText }, { quoted: message });
            return;
        }

        // START
        if (subcommand === 'start' || subcommand === 'iniciar') {
            if (player) {
                await sock.sendMessage(from, { text: '❌ Ya tienes personaje.' }, { quoted: message });
                return;
            }

            const raceKey = args[1]?.toLowerCase();
            if (!raceKey || !RACES[raceKey]) {
                let text = '⚔️ Elige tu raza:\n\n';
                Object.entries(RACES).forEach(([key, race]) => {
                    text += `🔹 ${race.name} (.rpg start ${key})\n`;
                });
                await sock.sendMessage(from, { text }, { quoted: message });
                return;
            }

            player = createPlayer(from, userId, raceKey);
            const race = RACES[raceKey];
            await sock.sendMessage(from, { text: `✅ Personaje creado!\n\n🧬 ${race.name}\n⚔️ STR: ${race.stats.str} | 🏹 AGI: ${race.stats.agi}\n🧠 INT: ${race.stats.int} | 🛡️ VIT: ${race.stats.vit}\n\n🎮 Usa .rpg explorar` }, { quoted: message });
            return;
        }

        if (!player) {
            await sock.sendMessage(from, { text: '❌ No tienes personaje. Usa .rpg start' }, { quoted: message });
            return;
        }

        // PERFIL
        if (subcommand === 'perfil' || subcommand === 'stats') {
            const race = RACES[player.race];

            // Calcular stats totales con equipo
            const weapon = player.equipped?.weapon;
            const armor = player.equipped?.armor;

            const totalStr = player.stats.str + (weapon?.stats?.str || 0);
            const totalAgi = player.stats.agi + (weapon?.stats?.agi || 0);
            const totalInt = player.stats.int + (weapon?.stats?.int || 0);
            const totalVit = player.stats.vit + (armor?.stats?.vit || 0);

            let affText = '';
            if (player.afflictions && player.afflictions.length > 0) {
                const affNames = player.afflictions.map(k => AFFLICTIONS[k]?.name || k).join(', ');
                affText = `\n🦠 *Aflicciones:* ${affNames}`;
            }

            // Información de equipo
            let equipText = '\n\n🛡️ *EQUIPO:*';
            equipText += `\n⚔️ Arma: ${weapon ? `${weapon.name} (+${weapon.stats.damage} dmg)` : 'Ninguna'}`;
            equipText += `\n🛡️ Armadura: ${armor ? `${armor.name} (+${armor.stats.defense} def)` : 'Ninguna'}`;

            const text = `📜 *PERFIL*\n👤 ${message.pushName || 'Aventurero'}\n🧬 ${race.name}\n📊 Nivel ${player.level} (${player.xp}/${player.xpToNext} XP)\n\n❤️ HP: ${player.hp}/${player.maxHp}\n✨ Mana: ${player.mana}/${player.maxMana}\n💰 Oro: ${player.gold}\n\n⚔️ STR: ${totalStr} | 🏹 AGI: ${totalAgi}\n🧠 INT: ${totalInt} | 🛡️ VIT: ${totalVit}${affText}${equipText}`;
            await sock.sendMessage(from, { text }, { quoted: message });
            return;
        }

        // EXPLORAR
        if (subcommand === 'explorar' || subcommand === 'explore') {
            if (player.hp <= 0) {
                await sock.sendMessage(from, { text: '💀 Estás muerto. Usa .rpg curar' }, { quoted: message });
                return;
            }

            if (player.state === 'fighting') {
                await sock.sendMessage(from, { text: '⚔️ Ya estás en combate!' }, { quoted: message });
                return;
            }

            const roll = Math.random();

            if (roll < 0.6) {
                const monster = MONSTERS[Math.floor(Math.random() * MONSTERS.length)];
                updatePlayer(from, userId, {
                    state: 'fighting',
                    currentEnemy: { ...monster, currentHp: monster.hp }
                });

                await sock.sendMessage(from, { text: `⚔️ *¡ENEMIGO!*\n\n${monster.name} (Nvl ${monster.level})\n❤️ HP: ${monster.hp}\n⚔️ ATK: ${monster.atk}\n\n🎮 Usa .rpg atacar` }, { quoted: message });
            } else if (roll < 0.8) {
                const goldFound = Math.floor(Math.random() * 20) + 5;
                player.gold += goldFound;
                updatePlayer(from, userId, { gold: player.gold });
                await sock.sendMessage(from, { text: `💰 Encontraste ${goldFound} oro!` }, { quoted: message });
            } else {
                await sock.sendMessage(from, { text: '🍃 No encontraste nada.' }, { quoted: message });
            }
            return;
        }

        // ATACAR
        if (subcommand === 'atacar' || subcommand === 'fight' || subcommand === 'attack') {
            if (player.state !== 'fighting' || !player.currentEnemy) {
                await sock.sendMessage(from, { text: '❌ No hay enemigo. Usa .rpg explorar' }, { quoted: message });
                return;
            }

            const enemy = player.currentEnemy;

            // CÁLCULO DE DAÑO DEL JUGADOR
            // Base STR + Daño de Arma + Random
            const weapon = player.equipped?.weapon;
            let weaponDmg = weapon?.stats?.damage || 0;

            // Si es bastón mágico, usa INT en lugar de STR para el escalado
            let statScaling = 0;
            if (weapon?.subtype === 'staff') {
                statScaling = Math.floor(player.stats.int * 1.5);
                // Bonus de magia
                if (weapon.stats.magicDamage) weaponDmg += weapon.stats.magicDamage;
            } else {
                statScaling = Math.floor(player.stats.str * 1.5);
            }

            // Daño de Hechizo (Si está equipado)
            const spell = player.equipped?.spell;
            let spellDmg = 0;
            let spellMsg = '';

            if (spell) {
                // Escala con INT (x2) + Daño Base del Hechizo
                spellDmg = (spell.stats.magicDamage || 0) + Math.floor(player.stats.int * 2);
                spellMsg = `\n🔥 *${spell.name}*: +${spellDmg} daño mágico`;
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

                if (leveledUp) {
                    battleLog += `\n\n🆙 ¡NIVEL ${updatedPlayer.level}!`;
                }

                await sock.sendMessage(from, { text: battleLog }, { quoted: message });
                return;
            }

            // CÁLCULO DE DAÑO RECIBIDO
            // Defensa de armadura reduce daño
            const armor = player.equipped?.armor;
            let defense = armor?.stats?.defense || 0;

            // Bonus por defensa mágica si aplica (simplificado: defensa general por ahora)
            if (armor?.stats?.magicDef) defense += Math.floor(armor.stats.magicDef / 2);

            // Fórmula simple de reducción: Daño - (Defensa / 2)
            // Mínimo 1 de daño siempre
            let enemyAttack = enemy.atk;
            if (player.afflictions?.includes('vampirism')) {
                // Vampiros reciben menos daño físico pero más mágico (no implementado tipos de daño enemigo aún)
            }

            const damageTaken = Math.max(1, enemyAttack - Math.floor(defense / 2));
            player.hp -= damageTaken;

            // Lógica de Infección (Vampirismo / Licantropía)
            if (enemy.canInfect && Math.random() < 0.2) {
                const afflictionKey = enemy.canInfect;
                if (!player.afflictions) player.afflictions = [];

                if (!player.afflictions.includes(afflictionKey)) {
                    player.afflictions.push(afflictionKey);
                    const affData = AFFLICTIONS[afflictionKey];
                    battleLog += `\n\n⚠️ *¡MALDICIÓN OCURRIDA!*\n¡El ataque te ha infectado!\nHas contraído: *${affData.name}*\n_${affData.description}_`;

                    // Aseguramos guardar la nueva aflicción inmediatamente
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
            return;
        }

        // CURAR
        if (subcommand === 'curar' || subcommand === 'heal') {
            if (player.hp >= player.maxHp && player.mana >= player.maxMana && player.state !== 'dead') {
                await sock.sendMessage(from, { text: '✅ Ya estás al máximo de vida y maná' }, { quoted: message });
                return;
            }

            const cost = player.state === 'dead' ? 0 : 10;

            if (player.gold < cost) {
                await sock.sendMessage(from, { text: `❌ Necesitas ${cost} oro` }, { quoted: message });
                return;
            }

            player.gold -= cost;
            player.hp = player.maxHp;
            player.mana = player.maxMana; // Restablecer maná
            player.state = 'idle';
            player.currentEnemy = null;
            updatePlayer(from, userId, player);

            await sock.sendMessage(from, { text: `💖 Curado completamente y maná restaurado!` }, { quoted: message });
            return;
        }

        await sock.sendMessage(from, { text: '❌ Comando no reconocido. Usa .rpg' }, { quoted: message });
    }
};

export const trainCommand = {
    name: 'train',
    aliases: ['entrenar', 'training'],
    description: 'Entrena para ganar experiencia (Cada 5 min)',
    execute: async (sock, message, args) => {
        const from = message.key.remoteJid;
        const userId = message.key.participant || message.key.remoteJid;

        const player = getPlayer(from, userId);

        if (!player) {
            await sock.sendMessage(from, { text: '❌ No tienes personaje. Usa .rpg start para crear uno.' }, { quoted: message });
            return;
        }

        const now = Date.now();
        const cooldown = 5 * 60 * 1000; // 5 minutos
        const lastTrain = player.lastTrain || 0;
        const timeDiff = now - lastTrain;

        if (timeDiff < cooldown) {
            const remaining = cooldown - timeDiff;
            const minutes = Math.floor(remaining / 60000);
            const seconds = Math.floor((remaining % 60000) / 1000);
            await sock.sendMessage(from, { text: `⏳ *Estás agotado.*\nDebes descansar ${minutes}m ${seconds}s antes de volver a entrenar.` }, { quoted: message });
            return;
        }

        // Calcular XP ganada (Entre 100 y 300 + Nivel * 2)
        const xpGain = Math.floor(Math.random() * 201) + 100 + (player.level * 2);

        // Actualizar jugador
        updatePlayer(from, userId, { lastTrain: now });

        // Dar XP
        const { player: updatedPlayer, leveledUp } = gainXp(from, userId, xpGain);

        let msg = `🏋️ *ENTRENAMIENTO COMPLETADO*\n\n💪 Has ganado *${xpGain} XP*\n📊 Nivel: ${updatedPlayer.level}`;

        if (leveledUp) {
            msg += `\n\n🎉 *¡HAS SUBIDO DE NIVEL!*\nTodas tus estadísticas han aumentado.`;
        } else {
            msg += `\n📈 XP: ${updatedPlayer.xp}/${updatedPlayer.xpToNext}`;
        }

        await sock.sendMessage(from, { text: msg }, { quoted: message });
    }
};
