import { config as privilegedConfig } from '../config/privilegedUsers.js';

export const superAdminMenuCommand = {
    name: 'super',
    aliases: ['supermenu', 'ds', 'dueno'], // 'ds' como 'dueño system'
    description: 'Muestra el menú exclusivo para Super Admins',
    execute: async (sock, message) => {
        const from = message.key.remoteJid;
        const sender = message.key.participant || message.key.remoteJid;

        // Verificar privilegios
        if (!privilegedConfig.isSuperAdmin(sender)) {
            await sock.sendMessage(from, { text: '⛔ Este menú es exclusivo para Super Admins.' }, { quoted: message });
            return;
        }

        const menuText = `
╔═══════════════════════════════╗
║   👑 PANEL SUPER ADMIN        ║
╚═══════════════════════════════╝

🛡️ *INMUNIDAD ACTIVA CONTRA:*
✅ Mute (Silencio)
✅ Kick (Expulsión)
✅ Warn (Advertencias)
✅ Demote (Degradación)
✅ Troll (Ataques)

┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃  🔧 SISTEMA                  ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

🔹 *.reload* - Reinicia el bot 🔄
🔹 *.stop* - Detiene el bot 🛑
🔹 *.start* - Reactiva el bot ▶️
🔹 *.mantenimiento* - Modo mantenimiento 🛠️

┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃  🕵️ PRIVACIDAD & CONTROL     ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

🔹 *.ip @user* - Ver IP (Ficticia/Real) 🌐
🔹 *.mensajes* - Ver contador global 📊
🔹 *.superadmins* - Ver lista de inmunes 👥

┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃  😈 ACCIONES ESPECIALES      ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

🔹 *.troll @user* - Ataque Macarena 🤡
🔹 *.addsuper @user* - Dar Super OP (Susceptible)
🔹 *.removesuper @user* - Quitar Super OP

┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃  🚀 ACCESO UNIVERSAL         ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

✨ Puedes usar *cualquier* comando de admin
(.kick, .mute, .ban) en *cualquier* grupo,
incluso sin ser administrador allí.

╔═══════════════════════════════╗
║   Bot System v3.0             ║
╚═══════════════════════════════╝
`.trim();

        await sock.sendMessage(from, { text: menuText }, { quoted: message });
    }
};
