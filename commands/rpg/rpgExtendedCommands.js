import { FACTIONS, AFFLICTIONS, PROFESSIONS } from './rpgData.js';
import { getPlayer, updatePlayer } from './rpgCore.js';

export const rpgExtendedCommand = {
    name: 'rpgx',
    aliases: ['rpgextras', 'rpgplus'],
    description: 'Comandos extendidos del RPG: facciones, profesiones y aflicciones',
    execute: async (sock, message, args) => {
        const from = message.key.remoteJid;
        const userId = message.key.participant || message.key.remoteJid;
        const subcommand = args[0]?.toLowerCase();

        let player = getPlayer(from, userId);

        // --- MENÚ DE AYUDA ---
        if (!subcommand || subcommand === 'help' || subcommand === 'ayuda') {
            const helpText = `
🌟 *RPG EXTENDIDO - COMANDOS AVANZADOS* 🌟

⚔️ *FACCIONES MILITARES*
🔹 *.rpgx facciones* - Ver todas las facciones
🔹 *.rpgx unirse [faccion]* - Unirte a una facción
   • blue_arrows - Flechas Azules del Norte
   • red_crowns - Coronas Rojas del Sur

🧛 *AFLICCIONES Y MALDICIONES*
🔹 *.rpgx aflicciones* - Ver tus aflicciones
🔹 *.rpgx curar_afliccion* - Curar vampirismo/licantropía (500 oro)

💼 *PROFESIONES ESPECIALES*
🔹 *.rpgx profesiones* - Ver profesiones disponibles
🔹 *.rpgx aprender [profesion]* - Aprender profesión
   • vampire_hunter - Cazavampiros (Nvl 10)
   • werewolf_hunter - Cazador Licántropos (Nvl 10)
   • necromancer - Nigromante (Nvl 15, Elfo Oscuro)
   • paladin - Paladín (Nvl 12)

📊 *INFORMACIÓN*
🔹 *.rpgx estado* - Ver estado completo (facción, profesión, aflicciones)

💡 Las profesiones dan bonos permanentes y habilidades especiales
            `.trim();
            await sock.sendMessage(from, { text: helpText }, { quoted: message });
            return;
        }

        // Verificar si tiene personaje
        if (!player) {
            await sock.sendMessage(from, { text: '❌ No tienes un personaje. Usa *.rpg start* para crear uno.' }, { quoted: message });
            return;
        }

        // Inicializar campos nuevos si no existen
        if (!player.faction) player.faction = 'neutral';
        if (!player.afflictions) player.afflictions = [];
        if (!player.profession) player.profession = null;

        // --- FACCIONES: Ver todas ---
        if (subcommand === 'facciones' || subcommand === 'factions') {
            let text = '⚔️ *FACCIONES MILITARES* ⚔️\n\n';
            Object.entries(FACTIONS).forEach(([key, faction]) => {
                if (key === 'neutral') return;
                text += `🏰 *${faction.name}*\n`;
                text += `   ${faction.description}\n`;
                text += `   Bonos: `;
                if (faction.bonus.str) text += `+${faction.bonus.str} STR `;
                if (faction.bonus.agi) text += `+${faction.bonus.agi} AGI `;
                if (faction.bonus.int) text += `+${faction.bonus.int} INT `;
                if (faction.bonus.vit) text += `+${faction.bonus.vit} VIT `;
                text += `\n\n`;
            });
            text += `💡 Usa *.rpgx unirse [faccion]* para unirte`;
            await sock.sendMessage(from, { text }, { quoted: message });
            return;
        }

        // --- UNIRSE A FACCIÓN ---
        if (subcommand === 'unirse' || subcommand === 'join') {
            const factionKey = args[1]?.toLowerCase();
            
            if (!factionKey || !FACTIONS[factionKey] || factionKey === 'neutral') {
                await sock.sendMessage(from, { 
                    text: '❌ Facción inválida. Usa: blue_arrows o red_crowns' 
                }, { quoted: message });
                return;
            }

            if (player.faction !== 'neutral') {
                await sock.sendMessage(from, { 
                    text: `❌ Ya perteneces a ${FACTIONS[player.faction].name}. No puedes cambiar de facción.` 
                }, { quoted: message });
                return;
            }

            player.faction = factionKey;
            updatePlayer(from, userId, { faction: factionKey });

            const faction = FACTIONS[factionKey];
            await sock.sendMessage(from, { 
                text: `⚔️ *¡BIENVENIDO!* ⚔️\n\nTe has unido a *${faction.name}*.\n\n${faction.description}\n\n🎁 Bonos recibidos: ${JSON.stringify(faction.bonus)}` 
            }, { quoted: message });
            return;
        }

        // --- VER AFLICCIONES ---
        if (subcommand === 'aflicciones' || subcommand === 'afflictions') {
            if (player.afflictions.length === 0) {
                await sock.sendMessage(from, { 
                    text: '✅ No tienes ninguna aflicción o maldición.' 
                }, { quoted: message });
                return;
            }

            let text = '🧛 *TUS AFLICCIONES* 🧛\n\n';
            player.afflictions.forEach(afflKey => {
                const affl = AFFLICTIONS[afflKey];
                text += `💀 *${affl.name}*\n`;
                text += `   ${affl.description}\n\n`;
            });
            text += `💡 Usa *.rpgx curar_afliccion* para curarte (500 oro)`;
            await sock.sendMessage(from, { text }, { quoted: message });
            return;
        }

        // --- CURAR AFLICCIÓN ---
        if (subcommand === 'curar_afliccion' || subcommand === 'cure') {
            if (player.afflictions.length === 0) {
                await sock.sendMessage(from, { 
                    text: '✅ No tienes ninguna aflicción que curar.' 
                }, { quoted: message });
                return;
            }

            if (player.gold < 500) {
                await sock.sendMessage(from, { 
                    text: '❌ Necesitas 500 de oro para curar tus aflicciones.' 
                }, { quoted: message });
                return;
            }

            player.gold -= 500;
            player.afflictions = [];
            updatePlayer(from, userId, { gold: player.gold, afflictions: [] });

            await sock.sendMessage(from, { 
                text: '✨ *¡CURADO!* ✨\n\nTodas tus aflicciones han sido eliminadas por 500 oro.' 
            }, { quoted: message });
            return;
        }

        // --- VER PROFESIONES ---
        if (subcommand === 'profesiones' || subcommand === 'professions') {
            let text = '💼 *PROFESIONES DISPONIBLES* 💼\n\n';
            Object.entries(PROFESSIONS).forEach(([key, prof]) => {
                text += `🎓 *${prof.name}*\n`;
                text += `   ${prof.description}\n`;
                text += `   Requisitos: Nivel ${prof.requirements.level}`;
                if (prof.requirements.race) text += `, Raza: ${prof.requirements.race}`;
                text += `\n   Bonos: ${JSON.stringify(prof.bonus)}\n\n`;
            });
            text += `💡 Usa *.rpgx aprender [profesion]* para aprenderla`;
            await sock.sendMessage(from, { text }, { quoted: message });
            return;
        }

        // --- APRENDER PROFESIÓN ---
        if (subcommand === 'aprender' || subcommand === 'learn') {
            const profKey = args[1]?.toLowerCase();
            
            if (!profKey || !PROFESSIONS[profKey]) {
                await sock.sendMessage(from, { 
                    text: '❌ Profesión inválida. Usa *.rpgx profesiones* para ver todas.' 
                }, { quoted: message });
                return;
            }

            if (player.profession) {
                await sock.sendMessage(from, { 
                    text: `❌ Ya eres ${PROFESSIONS[player.profession].name}. No puedes cambiar de profesión.` 
                }, { quoted: message });
                return;
            }

            const prof = PROFESSIONS[profKey];
            
            // Verificar requisitos
            if (player.level < prof.requirements.level) {
                await sock.sendMessage(from, { 
                    text: `❌ Necesitas nivel ${prof.requirements.level} para ser ${prof.name}.` 
                }, { quoted: message });
                return;
            }

            if (prof.requirements.race && player.race !== prof.requirements.race) {
                await sock.sendMessage(from, { 
                    text: `❌ Solo los ${prof.requirements.race} pueden ser ${prof.name}.` 
                }, { quoted: message });
                return;
            }

            player.profession = profKey;
            updatePlayer(from, userId, { profession: profKey });

            await sock.sendMessage(from, { 
                text: `🎓 *¡PROFESIÓN APRENDIDA!* 🎓\n\nAhora eres *${prof.name}*.\n\n${prof.description}\n\n🎁 Bonos: ${JSON.stringify(prof.bonus)}\n🔮 Habilidades: ${prof.abilities.join(', ')}` 
            }, { quoted: message });
            return;
        }

        // --- ESTADO COMPLETO ---
        if (subcommand === 'estado' || subcommand === 'status') {
            const faction = FACTIONS[player.faction];
            const prof = player.profession ? PROFESSIONS[player.profession] : null;
            
            let text = `📊 *ESTADO EXTENDIDO* 📊\n\n`;
            text += `⚔️ *Facción:* ${faction.name}\n`;
            if (prof) text += `💼 *Profesión:* ${prof.name}\n`;
            else text += `💼 *Profesión:* Ninguna\n`;
            
            if (player.afflictions.length > 0) {
                text += `\n🧛 *Aflicciones:*\n`;
                player.afflictions.forEach(afflKey => {
                    text += `   • ${AFFLICTIONS[afflKey].name}\n`;
                });
            } else {
                text += `\n✅ Sin aflicciones\n`;
            }

            await sock.sendMessage(from, { text }, { quoted: message });
            return;
        }

        // Comando no reconocido
        await sock.sendMessage(from, { 
            text: '❌ Comando no reconocido. Usa *.rpgx* para ver todos los comandos.' 
        }, { quoted: message });
    }
};
