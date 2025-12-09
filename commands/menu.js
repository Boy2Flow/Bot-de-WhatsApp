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
┃  💰 ECONOMÍA (S COINS)  ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━┛

🔹 *.economia* - VER MENÚ COMPLETO
   💰 Todos los juegos y opciones

💵 BÁSICOS:
🔹 *.bal* - Ver saldo
🔹 *.claim* - Reclamar (3 min)
🔹 *.work* - Trabajar
🔹 *.pay [cant] @user* - Pagar

🏦 BANCO:
🔹 *.deposit [cant]* - Guardar dinero
🔹 *.withdraw [cant]* - Sacar dinero
   💡 El banco protege de robos

🎰 JUEGOS:
🔹 *.gamble [cant]* - Apostar (2x o nada)
🔹 *.slot* - Tragamonedas (100 coins)
🔹 *.roulette [cant]* - Ruleta rusa (x5 o muerte)

💰 RIESGOSOS:
🔹 *.rob @user* - Robar
🔹 *.crime* - Cometer un crimen
🔹 *.slut* - Trabajar en la calle

🛒 TIENDA:
🔹 *.shop* - Ver tienda
🔹 *.buy [item]* - Comprar item
🔹 *.mine* - Minar (requiere pico)

📊 RANKING:
🔹 *.leaderboard* - Top de ricos

┏━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃  🤖 INTELIGENCIA ARTIFICIAL ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━┛

🔹 *.ia [texto]* - Chat con Gemini
   Aliases: .gemini, .bot, .gpt
   Pregunta lo que quieras
   
🔹 *.ia dibuja [texto]* - Generar imagen
   Crea imágenes con IA

┏━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃  📋 COMANDOS GENERALES   ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━┛

🔹 *.menu* - Muestra este menú
🔹 *.help* - Ayuda detallada
🔹 *.info* - Información del bot

┏━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃  🛡️ PANEL ADMINISTRADOR  ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━┛

🔹 *.admin* - Ver comandos de admin
   ⚠️ Solo administradores
   📋 Gestión completa del grupo

👥 GESTIÓN DE MIEMBROS:
🔹 *.kick @user* - Expulsar
🔹 *.add [número]* - Añadir miembro
🔹 *.promote @user* - Dar admin
🔹 *.demote @user* - Quitar admin
🔹 *.admins* - Lista de admins

⚙️ CONFIGURACIÓN:
🔹 *.grupo [abrir/cerrar]* - Abrir/cerrar grupo
🔹 *.nombre [texto]* - Cambiar nombre
🔹 *.descripcion [texto]* - Cambiar descripción
🔹 *.link* - Obtener link del grupo
🔹 *.resetlink* - Generar nuevo link

🗑️ LIMPIEZA:
🔹 *.delete* - Borrar mensaje (responder)
🔹 *.limpiar [cant]* - Borrar mensajes

ℹ️ INFO:
🔹 *.infogrupo* - Info del grupo

🔧 SISTEMA:
🔹 *.mantenimiento* - Modo mantenimiento
   🔧 on/off/status

💰 ECONOMÍA (ADMIN):
🔹 *.addmoney [cant] @user* - Dar dinero
🔹 *.removemoney [cant] @user* - Quitar dinero
🔹 *.setmoney [cant] @user* - Establecer balance
🔹 *.checkbal @user* - Ver balance
🔹 *.reseteco @user* - Resetear economía

┏━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃  ⚙️ SISTEMA & DIFUSIÓN   ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━┛

🔹 *.ping* - Verificar latencia
   Comprueba la velocidad del bot

🔹 *.stop* - Detener bot
   ⚠️ Solo Super Admin

🔹 *.start* - Iniciar bot
   ⚠️ Solo Super Admin

🔹 *.reload* - Reiniciar bot
   ⚠️ Solo Super Admin

┏━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃  🔇 SISTEMA DE MUTEO     ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━┛

🔹 *.mute @usuario* - Silenciar usuario
   Borra automáticamente sus mensajes
   ⚠️ Solo administradores

🔹 *.unmute @usuario* - Desmutear usuario
   ⚠️ Solo administradores

🔹 *.mutelist* - Ver usuarios muteados

┏━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃  ⚠️ SISTEMA DE WARNS     ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━┛

🔹 *.warn @usuario [razón]* - Advertir
   3 warns = expulsión automática
   ⚠️ Solo administradores

🔹 *.warns @usuario* - Ver advertencias

🔹 *.unwarn @usuario* - Quitar warn
   ⚠️ Solo administradores

🔹 *.warnlist* - Lista de advertidos

┏━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃  📋 LISTAS PERSONALIZADAS┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━┛

🔹 *.addlist [nombre] @usuario*
   Añadir a lista personalizada
   ⚠️ Solo administradores

🔹 *.showlist [nombre]* - Mostrar lista
   Menciona a todos de la lista

🔹 *.lists* - Ver todas las listas

🔹 *.removelist [nombre] @usuario*
   Quitar de lista
   ⚠️ Solo administradores

🔹 *.deletelist [nombre]* - Borrar lista
   ⚠️ Solo administradores

┏━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃  💔 LISTA DE TRAUMADAS   ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━┛

🔹 *.addtraumada @usuario*
   Añadir a la lista
   ⚠️ Solo administradores

🔹 *.traumadas* - Ver lista
   Menciona a todas las traumadas

🔹 *.removetraumada @usuario*
   Quitar de la lista
   ⚠️ Solo administradores

┏━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃  🏳️‍🌈 LISTA DE MARICONES  ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━┛

🔹 *.addmaricon @usuario*
   Añadir a la lista
   ⚠️ Solo administradores

🔹 *.maricones* - Ver lista
   Menciona a todos los maricones

🔹 *.removemaricon @usuario*
   Quitar de la lista
   ⚠️ Solo administradores

┏━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃  🔞 SISTEMA DE PAJEROS   ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━┛

🔹 *.pajero @usuario*
   El bot le dirá "pajero" siempre
   ⚠️ Solo administradores

🔹 *.unpajero @usuario*
   Desactivar modo pajero
   ⚠️ Solo administradores

🔹 *.pajerolist* - Ver lista

┏━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃  🎨 STICKERS & MEDIA     ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━┛

🔹 *.sticker* - Convierte imagen a sticker
   Envía una imagen con el caption .sticker
🔹 *.s* - Atajo para .sticker

┏━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃  👥 COMANDOS DE GRUPO    ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━┛

🔹 *.tag [mensaje]* - Mención fantasma
   👻 Menciona a todos sin mostrar lista
   ⚠️ Solo administradores
   ✨ El mensaje se borra automáticamente

🔹 *.everyone [mensaje]* - Menciona a todos
   📋 Muestra lista completa de miembros
   ⚠️ Solo administradores

🔹 *.mensajes* - Top de usuarios activos
   📊 Muestra el ranking de mensajes

🔹 *.inactivos* - Usuarios sin mensajes
   👻 Lista de miembros que nunca escribieron
   Aliases: .inactive, .lurkers, .fantasmas

┏━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃  💫 INTERACCIONES        ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━┛

🔹 *.interacciones* - Ver todas
   ❤️ Kiss, Hug, Pat, Slap
   🔞 Fuck, Spank, Lick, Bite
   
   Ejemplo: .kiss @usuario

┏━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃  🎮 MINI JUEGOS          ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━┛

🔹 *.ppt* [piedra/papel/tijera]
   Juega Piedra, Papel o Tijera
   Ejemplo: .ppt piedra

🔹 *.adivina* [1-10]
   Adivina el número del 1 al 10
   Ejemplo: .adivina 7

🔹 *.trivia*
   Responde preguntas de trivia
   
🔹 *.dado*
   Lanza un dado virtual

🔹 *.moneda*
   Lanza una moneda (cara o cruz)

┏━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃  ℹ️ INFORMACIÓN          ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━┛

💡 *Tip:* Puedes usar los comandos
   con o sin mayúsculas

📊 *Total:* 70+ comandos disponibles

🤖 *Dueño del bot 💚 https://www.instagram.com/boy2flow_ 💚*
📱 *Versión:* 2.0.0

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

