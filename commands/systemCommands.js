import fs from 'fs';
let isBotActive = true;

export const getBotStatus = () => isBotActive;
export const setBotStatus = (status) => { isBotActive = status; };

// Comando .stop
export const stopCommand = {
    name: 'stop',
    description: 'Detiene el bot (ignora todos los comandos excepto .start)',
    execute: async (sock, message, args) => {
        if (!isBotActive) {
            await sock.sendMessage(message.key.remoteJid, { text: '⚠️ El bot ya está detenido.' }, { quoted: message });
            return;
        }
        setBotStatus(false);
        await sock.sendMessage(message.key.remoteJid, { text: '🛑 *BOT DETENIDO*\n\nEl bot dejará de responder a comandos.\nUsa *.start* para reactivarlo.' }, { quoted: message });
    }
};

// Comando .start
export const startCommand = {
    name: 'start',
    description: 'Reactiva el bot',
    execute: async (sock, message, args) => {
        if (isBotActive) {
            await sock.sendMessage(message.key.remoteJid, { text: '⚠️ El bot ya está activo.' }, { quoted: message });
            return;
        }
        setBotStatus(true);
        await sock.sendMessage(message.key.remoteJid, { text: '✅ *BOT REACTIVADO*\n\nTodos los sistemas operativos.' }, { quoted: message });
    }
};



// Comando .reload
export const reloadCommand = {
    name: 'reload',
    aliases: ['reiniciar', 'restart'],
    description: 'Reinicia el proceso del bot',
    execute: async (sock, message, args) => {
        await sock.sendMessage(message.key.remoteJid, { text: '🔄 *REINICIANDO SISTEMA...*\n\nEl bot volverá en unos segundos.' }, { quoted: message });
        
        // Guardar estado de reinicio para avisar al volver
        try {
            fs.writeFileSync('restart_pending.json', JSON.stringify({ 
                chatId: message.key.remoteJid,
                timestamp: Date.now()
            }));
        } catch (err) {
            console.error('Error guardando estado de reinicio:', err);
        }

        // Esperar 1 segundo para que se envíe el mensaje y luego salir
        setTimeout(() => {
            console.log('🔄 Reiniciando proceso por comando .reload...');
            process.exit(1); // Salir con código 1 para forzar reinicio en launcher
        }, 1000);
    }
};

export const systemCommands = [stopCommand, startCommand, reloadCommand];
