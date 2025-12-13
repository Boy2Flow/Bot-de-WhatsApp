import { getMenuImage, sendMessageWithImage } from '../utils/imageManager.js';

export const menuCommand = {
   name: 'menu',
   aliases: ['comandos', 'ayuda'],
   description: 'Muestra todos los comandos disponibles',
   execute: async (sock, message) => {
      const menuText = `
╔═══════════════════════════╗
║   🤖    Siri BOT     🤖  ║
╚═══════════════════════════╝
*Soporte y uso de comandos y juegos en:*
https://chat.whatsapp.com/GfbbXC9E7Ly2jPrOijxypk

┏━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃  ⚔️ SISTEMA RPG          ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━┛

🔹 *.rpg start [raza]* - Iniciar
   (human, orc, elf, etc)
🔹 *.rpg perfil* - Ver stats/equipo
🔹 *.rpg explorar* - Buscar monstruos
🔹 *.rpg atacar* - Luchar
🔹 *.rpg curar* - Sanar HP/Mana
🔹 *.entrenar* - Ganar XP (5 min)

🎒 INVENTARIO Y MERCADO:
🔹 *.inv* - Ver mochila
🔹 *.mercado* - Tienda de ítems
🔹 *.comprar [item]* - Comprar
🔹 *.equipar [item]* - Usar equipo
🔹 *.desequipar [item]* - Quitar equipo

🧙‍♂️ CLASES Y MAGIA:
🔹 *.clase* - Ver/Elegir clase
🔹 *.hechizo [nombre]* - Lanzar magia

┏━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃  💕 AMOR Y FAMILIA       ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━┛

🔹 *.amor* - Ver menú de amor
🔹 *.casar @u1 @u2* - Matrimonio
🔹 *.divorciar @user* - Divorcio
🔹 *.mimatrimonio* - Ver mi pareja
🔹 *.rosa @user* - Dedicar rosa 🌹

┏━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃  💰 ECONOMÍA (S COINS)  ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━┛

🔹 *.economia* - VER MENÚ COMPLETO
   💰 Todos los juegos y opciones

💵 BÁSICOS:
🔹 *.bal* - Ver saldo
🔹 *.claim* - Reclamar (3 min)
🔹 *.work* - Trabajar
🔹 *.pay [cant] @user* - Pagar

🏦 BANCO Y TIENDA:
🔹 *.deposit* / *.withdraw* - Banco
🔹 *.rob @user* - Robar
🔹 *.shop* / *.buy* - Tienda Global

🎰 JUEGOS DE AZAR:
🔹 *.gamble* / *.roulette* / *.slot*

┏━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃  🤖 INTELIGENCIA ARTIFICIAL ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━┛

🔹 *.ia [texto]* - Chat con Gemini
   Aliases: .gemini, .bot, .gpt
🔹 *.ia dibuja [texto]* - Generar imagen

┏━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃  ⏰ RECORDATORIOS & VOZ  ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━┛

🔹 *.alarma HH:MM [msg]* - Alarma
🔹 *.recordar DD/MM HH:MM [msg]*
🔹 *.misrecordatorios* - Ver lista
🔹 *.delrecordatorio [num]* - Borrar

🎧 AUDIO:
🔹 *.voz [texto]* - Texto a voz
🔹 *.transcribir* - Audio a texto
   (Responde a un audio)

┏━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃  🛡️ PANEL ADMINISTRADOR  ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━┛

🔹 *.admin* - Ver comandos admin
🔹 *.kick* / *.add* / *.promote*
🔹 *.mute* / *.warn* / *.ban*
🔹 *.grupo [abrir/cerrar]*
🔹 *.delete* / *.limpiar*
🔹 *.tag* / *.everyone*

┏━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃  📋 LISTAS Y GRUPOS      ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━┛

🔹 *.interacciones* - Besos, abrazos...
🔹 *.sticker* - Crear sticker
🔹 *.mensajes* - Top activos
🔹 *.inactivos* - Fantasmas
🔹 *.ig @user* - Instagram
🔹 *.solteras* - Lista de solteras
🔹 *.traumadas* - Lista traumadas
🔹 *.maricones* - Lista maricones
🔹 *.pajeros* - Lista pajeros

┏━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃  🤪 DIVERSIÓN EXTRA      ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━┛

🔹 *.troll* - Imagen troll random
🔹 *.suicidio* - (No lo hagas)
🔹 *.ppt* - Piedra, Papel, Tijera
🔹 *.trivia* / *.adivina*
🔹 *.dado* / *.moneda*

┏━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃  ℹ️ INFORMACIÓN          ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━┛

💡 *Tip:* Puedes usar los comandos
   con o sin mayúsculas

📊 *Total:* 90+ comandos disponibles

🤖 *Dueño del bot 💚 https://www.instagram.com/boy2flow_ 💚*
📱 *Versión:* 2.1.0

╔═══════════════════════════╗
║  ¡Disfruta del bot! 🎉    ║
╚═══════════════════════════╝
        `.trim();

      // Obtener imagen del menú
      const menuImage = getMenuImage();

      // Enviar menú con imagen
      const sentMsg = await sendMessageWithImage(sock, message.key.remoteJid, menuText, menuImage);

      // Auto-borrar después de 30 segundos (mensaje largo)
      setTimeout(async () => {
         try {
            await sock.sendMessage(message.key.remoteJid, { delete: sentMsg.key });
         } catch (error) {
            // Ignorar errores
         }
      }, 30000);
   }
};

