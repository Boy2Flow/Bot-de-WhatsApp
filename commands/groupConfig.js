import { groupConfig } from '../utils/groupConfigManager.js';

export const configCommand = {
    name: 'config',
    aliases: ['conf', 'configuracion'],
    description: 'Configura el bot para este grupo',
    groupOnly: true,
    adminOnly: true, // Only WA admins can change bot config initially
    execute: async (sock, message, args) => {
        const from = message.key.remoteJid;
        const subCommand = args[0]?.toLowerCase();
        
        if (!subCommand) {
            // Show status
            const disabled = groupConfig.config[from]?.disabledCommands || [];
            const roles = groupConfig.config[from]?.roles || {};
            const modCount = Object.values(roles).filter(r => r === 'mod').length;

            let text = `⚙️ *CONFIGURACIÓN DEL GRUPO*\n\n`;
            text += `🚫 *Comandos Desactivados:* ${disabled.length > 0 ? disabled.join(', ') : 'Ninguno'}\n`;
            text += `👮 *Moderadores del Bot:* ${modCount}\n\n`;
            text += `*Comandos disponibles:*\n`;
            text += `🔹 .config disable <comando>\n`;
            text += `🔹 .config enable <comando>\n`;
            text += `🔹 .config promote @usuario\n`;
            text += `🔹 .config demote @usuario`;

            await sock.sendMessage(from, { text }, { quoted: message });
            return;
        }

        switch (subCommand) {
            case 'disable':
            case 'desactivar':
                const cmdToDisable = args[1]?.toLowerCase();
                if (!cmdToDisable) {
                    await sock.sendMessage(from, { text: '❌ Especifica el comando a desactivar.' }, { quoted: message });
                    return;
                }
                if (['config', 'help', 'menu'].includes(cmdToDisable)) {
                    await sock.sendMessage(from, { text: '❌ No puedes desactivar comandos esenciales.' }, { quoted: message });
                    return;
                }
                if (groupConfig.disableCommand(from, cmdToDisable)) {
                    await sock.sendMessage(from, { text: `✅ Comando *${cmdToDisable}* desactivado en este grupo.` }, { quoted: message });
                } else {
                    await sock.sendMessage(from, { text: `⚠️ El comando ya estaba desactivado.` }, { quoted: message });
                }
                break;

            case 'enable':
            case 'activar':
                const cmdToEnable = args[1]?.toLowerCase();
                if (!cmdToEnable) {
                    await sock.sendMessage(from, { text: '❌ Especifica el comando a activar.' }, { quoted: message });
                    return;
                }
                if (groupConfig.enableCommand(from, cmdToEnable)) {
                    await sock.sendMessage(from, { text: `✅ Comando *${cmdToEnable}* activado nuevamente.` }, { quoted: message });
                } else {
                    await sock.sendMessage(from, { text: `⚠️ El comando no estaba desactivado.` }, { quoted: message });
                }
                break;

            case 'promote':
            case 'mod':
                const mentionedPromote = message.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0];
                if (!mentionedPromote) {
                    await sock.sendMessage(from, { text: '❌ Menciona al usuario para hacerlo moderador del bot.' }, { quoted: message });
                    return;
                }
                groupConfig.setUserRole(from, mentionedPromote, 'mod');
                await sock.sendMessage(from, { text: `✅ Usuario promovido a Moderador del Bot en este grupo.` }, { quoted: message });
                break;

            case 'demote':
            case 'unmod':
                const mentionedDemote = message.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0];
                if (!mentionedDemote) {
                    await sock.sendMessage(from, { text: '❌ Menciona al usuario para quitarle el rol.' }, { quoted: message });
                    return;
                }
                if (groupConfig.removeUserRole(from, mentionedDemote)) {
                    await sock.sendMessage(from, { text: `✅ Rol de Moderador del Bot removido.` }, { quoted: message });
                } else {
                    await sock.sendMessage(from, { text: `⚠️ El usuario no tenía roles asignados.` }, { quoted: message });
                }
                break;

            default:
                await sock.sendMessage(from, { text: '❌ Opción no válida. Usa .config para ver ayuda.' }, { quoted: message });
        }
    }
};
