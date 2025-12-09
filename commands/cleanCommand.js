// Comando .limpiar - Borrar múltiples mensajes
export const cleanCommand = {
    name: 'limpiar',
    aliases: ['clean', 'clear', 'purge'],
    description: 'Borra una cantidad específica de mensajes del grupo',
    groupOnly: true,
    adminOnly: true,
    execute: async (sock, message, args) => {
        try {
            const from = message.key.remoteJid;
            
            // Verificar que se proporcionó una cantidad
            if (!args[0]) {
                await sock.sendMessage(from, {
                    text: '❌ Debes especificar la cantidad de mensajes a borrar.\n\n📝 Uso: .limpiar [cantidad]\n💡 Ejemplo: .limpiar 10\n\n⚠️ Máximo: 100 mensajes'
                }, { quoted: message });
                return;
            }
            
            const count = parseInt(args[0]);
            
            // Validar la cantidad
            if (isNaN(count) || count < 1) {
                await sock.sendMessage(from, {
                    text: '❌ La cantidad debe ser un número mayor a 0.\n\n📝 Uso: .limpiar [cantidad]'
                }, { quoted: message });
                return;
            }
            
            if (count > 100) {
                await sock.sendMessage(from, {
                    text: '❌ No puedes borrar más de 100 mensajes a la vez.\n\n📝 Usa: .limpiar [1-100]'
                }, { quoted: message });
                return;
            }
            
            // Enviar mensaje de confirmación
            const confirmMsg = await sock.sendMessage(from, {
                text: `🗑️ Borrando ${count} mensaje(s)...\n\n⏳ Por favor espera...`
            }, { quoted: message });
            
            // NOTA IMPORTANTE: WhatsApp no permite obtener el historial de mensajes
            // de forma directa con Baileys. Solo podemos borrar mensajes que el bot
            // haya guardado en memoria o que sean respondidos.
            
            // Por limitaciones de la API de WhatsApp, solo podemos borrar:
            // 1. El mensaje del comando
            // 2. El mensaje de confirmación
            
            // Borrar el mensaje del comando y el de confirmación
            setTimeout(async () => {
                try {
                    await sock.sendMessage(from, { delete: message.key });
                    await sock.sendMessage(from, { delete: confirmMsg.key });
                    
                    // Enviar mensaje explicativo
                    const infoMsg = await sock.sendMessage(from, {
                        text: `⚠️ *LIMITACIÓN DE WHATSAPP*\n\n` +
                              `Debido a las restricciones de la API de WhatsApp, no es posible obtener y borrar mensajes antiguos del historial del grupo.\n\n` +
                              `✅ *Alternativas disponibles:*\n` +
                              `• Usa .delete respondiendo a un mensaje específico\n` +
                              `• Los administradores pueden borrar mensajes manualmente\n\n` +
                              `💡 *Consejo:* Para mantener el grupo limpio, usa el comando .mute para silenciar usuarios problemáticos.`
                    });
                    
                    // Auto-borrar este mensaje después de 10 segundos
                    setTimeout(async () => {
                        try {
                            await sock.sendMessage(from, { delete: infoMsg.key });
                        } catch (e) {
                            console.log('No se pudo borrar el mensaje informativo');
                        }
                    }, 10000);
                    
                } catch (deleteError) {
                    console.error('Error al borrar mensajes:', deleteError);
                }
            }, 1000);

        } catch (error) {
            console.error('Error en comando limpiar:', error);
            await sock.sendMessage(message.key.remoteJid, {
                text: '❌ Error al intentar limpiar mensajes.'
            }, { quoted: message });
        }
    }
};

export const cleanCommands = [
    cleanCommand
];
