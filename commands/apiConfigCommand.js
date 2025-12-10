import { setKey } from '../utils/keyManager.js';
import { config as privilegedConfig } from '../config/privilegedUsers.js';

export const setKeyCommand = {
    name: 'setkey',
    description: 'Configura una API Key. Uso: .setkey [servicio] [key]',
    execute: async (sock, message, args) => {
        const from = message.key.remoteJid;
        const userId = message.key.participant || from;

        if (!privilegedConfig.isSuperAdmin(userId)) {
            await sock.sendMessage(from, { text: '⛔ Solo el dueño puede configurar las API Keys.' }, { quoted: message });
            return;
        }

        // Solo super admins pueden configurar esto (esto debería validarse en messageHandler, 
        // pero lo hacemos aquí también por seguridad)

        if (args.length < 2) {
            await sock.sendMessage(from, {
                text: '❌ Uso: .setkey [gemini|openai] [tu_api_key]'
            }, { quoted: message });
            return;
        }

        const service = args[0].toLowerCase();
        const key = args[1];

        if (!['gemini', 'openai'].includes(service)) {
            await sock.sendMessage(from, {
                text: '❌ Servicio no soportado. Usa "gemini" o "openai".'
            }, { quoted: message });
            return;
        }

        setKey(service, key);

        await sock.sendMessage(from, {
            text: `✅ API Key para *${service}* configurada correctamente.`
        }, { quoted: message });
    }
};
