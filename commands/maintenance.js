// Sistema de mantenimiento global
let maintenanceMode = false;
let maintenanceMessage = 'El bot está en mantenimiento. Vuelve pronto! 🔧';

export const getMaintenanceStatus = () => maintenanceMode;
export const getMaintenanceMessage = () => maintenanceMessage;

// Comando para activar/desactivar mantenimiento (administradores de grupos)
export const maintenanceCommand = {
    name: 'mantenimiento',
    aliases: ['maintenance', 'mant'],
    description: 'Activa o desactiva el modo mantenimiento',
    groupOnly: true,
    adminOnly: true, // Solo administradores pueden usar este comando
    execute: async (sock, message, args) => {
        try {
            const action = args[0]?.toLowerCase();

            if (action === 'on' || action === 'activar') {
                maintenanceMode = true;
                const customMsg = args.slice(1).join(' ');
                if (customMsg) {
                    maintenanceMessage = customMsg;
                }

                await sock.sendMessage(message.key.remoteJid, {
                    text: `🔧 *MODO MANTENIMIENTO ACTIVADO*\n\nMensaje: ${maintenanceMessage}`
                }, { quoted: message });

            } else if (action === 'off' || action === 'desactivar') {
                maintenanceMode = false;

                await sock.sendMessage(message.key.remoteJid, {
                    text: '✅ *MODO MANTENIMIENTO DESACTIVADO*\n\nEl bot está funcionando normalmente.'
                }, { quoted: message });

            } else if (action === 'status' || action === 'estado') {
                const status = maintenanceMode ? '🔧 ACTIVADO' : '✅ DESACTIVADO';
                await sock.sendMessage(message.key.remoteJid, {
                    text: `📊 *ESTADO DEL MANTENIMIENTO*\n\nEstado: ${status}\nMensaje: ${maintenanceMessage}`
                }, { quoted: message });

            } else {
                await sock.sendMessage(message.key.remoteJid, {
                    text: '❌ Uso:\n\n' +
                          '.mantenimiento on [mensaje]\n' +
                          '.mantenimiento off\n' +
                          '.mantenimiento status\n\n' +
                          '⚠️ Solo administradores pueden usar este comando'
                }, { quoted: message });
            }

        } catch (error) {
            console.error('Error en comando mantenimiento:', error);
            await sock.sendMessage(message.key.remoteJid, {
                text: '❌ Error al ejecutar el comando de mantenimiento.'
            }, { quoted: message });
        }
    }
};
