export const helpCommand = {
    name: 'help',
    aliases: ['ayuda', 'h'],
    description: 'Muestra ayuda detallada sobre cómo usar el bot',
    execute: async (sock, message) => {
        const helpText = `
╔═══════════════════════════╗
║   📚 GUÍA DE USO DEL BOT  ║
╚═══════════════════════════╝
*Soporte y uso de comandos y juegos en:*
https://chat.whatsapp.com/DxbL55bwgOt8i7L4FWGdcX

🔰 *CÓMO USAR LOS COMANDOS*

Todos los comandos empiezan con *.*
Ejemplo: .menu, .sticker, .ppt

━━━━━━━━━━━━━━━━━━━━━━━━━

🛡️ *COMANDOS DE ADMINISTRADOR*

Para ver TODOS los comandos de administrador:
• .admin

Esto incluye:
✅ Expulsar/Añadir miembros
✅ Promover/Degradar administradores
✅ Configurar el grupo
✅ Moderar mensajes
✅ Y mucho más...

⚠️ Solo disponible para administradores

━━━━━━━━━━━━━━━━━━━━━━━━━

🎨 *CREAR STICKERS*

1️⃣ Envía una imagen
2️⃣ Añade el caption: .sticker
3️⃣ ¡Listo! Recibirás tu sticker

También puedes:
• Responder a una imagen con .sticker
• Usar el atajo .s

━━━━━━━━━━━━━━━━━━━━━━━━

👥 *MENCIONAR A TODOS*

🔐 Solo para administradores:
• .todos
• .todos [mensaje personalizado]

💡 El comando borra automáticamente tu mensaje
   después de mencionar a todos

Ejemplo:
.todos Reunión importante a las 5pm

━━━━━━━━━━━━━━━━━━━━━━━━

🎮 *JUGAR MINI JUEGOS*

🪨 *Piedra, Papel o Tijera:*
.ppt piedra
.ppt papel
.ppt tijera

🎲 *Adivina el número:*
.adivina 7

🧠 *Trivia:*
.trivia (para nueva pregunta)
.trivia B (para responder)

🎲 *Dado:*
.dado

🪙 *Moneda:*
.moneda

━━━━━━━━━━━━━━━━━━━━━━━━

💡 *CONSEJOS*

• Los comandos no distinguen mayúsculas
• Puedes usar alias (ej: .s en vez de .sticker)
• Algunos comandos solo funcionan en grupos
• Los juegos son instantáneos y divertidos

━━━━━━━━━━━━━━━━━━━━━━━━

❓ *¿NECESITAS MÁS AYUDA?*

Usa *.menu* para ver todos los comandos
Usa *.info* para información del bot

╔═══════════════════════════╗
║  ¡Disfruta del bot! 🎉    ║
╚═══════════════════════════╝
        `.trim();

        const sentMsg = await sock.sendMessage(message.key.remoteJid, {
            text: helpText
        }, { quoted: message });

        // Auto-borrar después de 5 segundos
        setTimeout(async () => {
            try {
                await sock.sendMessage(message.key.remoteJid, { delete: sentMsg.key });
            } catch (error) {
                // Ignorar errores
            }
        }, 5000);
    }
};
