# 🤖 Bot de WhatsApp "Siri BOT"

Este es un bot de WhatsApp avanzado y multifuncional construido con **Node.js** y la librería **Baileys**. Incluye sistemas completos de RPG, economía, inteligencia artificial, administración de grupos, y entretenimiento.

## � Redes Sociales del Creador
- 💚 **Instagram**: [https://www.instagram.com/boy2flow_](https://www.instagram.com/boy2flow_)
- 💻 **GitHub**: [https://github.com/Boy2Flow](https://github.com/Boy2Flow)

---

## ✨ Características Principales

- **⚔️ Sistema RPG Completo**: Clases, combate, monstruos, inventario, mercado y habilidades.
- **💰 Economía Avanzada**: Moneda global (S Coins), banco, robos, tienda, y juegos de azar.
- **🛡️ Administración Potente**: Herramientas completas para gestionar grupos, usuarios y moderación.
- **🤖 Inteligencia Artificial**: Integración con Google Gemini para chat y generación de imágenes.
- **💕 Sistema Social**: Matrimonios, interacciones (besos, abrazos), y listas de usuarios.
- **🔧 Utilidades**: Stickers, convertidor de voz a texto, texto a voz, recordatorios y más.
- **🎮 Minijuegos**: Piedra papel o tijera, trivia, adivinanzas, dados.

---

## 🚀 Instalación y Uso

### Requisitos
- Node.js 18 o superior
- npm (Node Package Manager)
- Un número de WhatsApp para vincular

### Pasos
1. **Clonar el repositorio:**
   ```bash
   git clone <url-del-repo>
   cd Bot_whatsap
   ```

2. **Instalar dependencias:**
   ```bash
   npm install
   ```

3. **Iniciar el bot:**
   - **Modo normal:**
     ```bash
     npm start
     ```
   - **Modo persistente (Segundo plano):**
     ```bash
     ./start-background.sh
     ```
     *(Asegúrate de dar permisos de ejecución: `chmod +x start-background.sh`)*

4. **Vincular WhatsApp:**
   - Escanea el código QR que aparecerá en la terminal usando la opción "Dispositivos vinculados" de tu WhatsApp.

---

## � Comandos Disponibles

El prefijo por defecto es **`.`** (punto).

### ⚔️ Sistema RPG (`.rpg`)
Un juego de rol completo integrado en el chat.
- `.rpg start [raza]` - Inicia tu aventura (human, orc, elf, mage).
- `.rpg perfil` - Muestra tus estadísticas, nivel, experiencia y equipamiento.
- `.rpg explorar` - Busca monstruos para combatir.
- `.rpg atacar` - Ataca al monstruo actual.
- `.rpg curar` - Restaura tu salud y maná.
- `.clase` - Muestra o selecciona tu clase.
- `.hechizo [nombre]` - Lanza un hechizo en combate.
- `.entrenar` - Gana experiencia (cooldown de 5 min).
- `.inv` - Muestra tu inventario.
- `.mercado` - Abre la tienda de armas, armaduras y pociones.
- `.comprar [objeto/ID]` - Compra un ítem del mercado.
- `.equipar [objeto]` - Equipa un arma o armadura.
- `.desequipar [objeto]` - Desequipa un objeto.

### 💰 Economía (`.economia`)
Sistema monetario global.
- `.bal` - Ver tu saldo actual.
- `.claim` - Reclamar monedas diarias/horarias.
- `.work` - Trabajar para ganar monedas.
- `.pay [cantidad] @usuario` - Transferir dinero a otro usuario.
- `.deposit [cantidad]` - Guardar dinero en el banco.
- `.withdraw [cantidad]` - Retirar dinero del banco.
- `.rob @usuario` - Intentar robar a un usuario (¡cuidado con la policía!).
- `.shop` / `.buy` - Tienda global de ítems de economía.
- `.gamble [cantidad]` / `.roulette` / `.slot` - Juegos de apuestas.
- `.topmensajes` - Ranking de usuarios con más mensajes.

### 🤖 Inteligencia Artificial
- `.ia [texto]` / `.gemini` / `.bot` - Chatea con la IA (Google Gemini).
- `.ia dibuja [prompt]` - Genera una imagen basada en tu descripción.

### 🛡️ Administración (Solo Admins)
- `.admin` - Muestra el panel completo de comandos de administrador.
- `.kick @usuario` - Expulsar a un usuario.
- `.add [numero]` - Añadir a un usuario (ej: 34612345678).
- `.promote @usuario` - Dar permisos de administrador.
- `.demote @usuario` - Quitar permisos de administrador.
- `.mute @usuario` - Silenciar a un usuario para que no pueda hablar.
- `.unmute @usuario` - Permitir hablar de nuevo.
- `.warn @usuario` - Dar una advertencia.
- `.ban` - Banear usuario.
- `.todos [mensaje]` / `.tag` - Mencionar a todos los miembros.
- `.hidetag [mensaje]` - Mención fantasma (notifica sin mostrar lista).
- `.delete` - Borrar un mensaje (respondiendo al mensaje).
- `.limpiar` - Limpiar el chat.
- `.grupo [abrir/cerrar]` - Bloquear o desbloquear el chat.
- `.link` - Obtener el enlace de invitación.
- `.resetlink` - Revocar y generar nuevo enlace.
- `.sistema [on/off]` - Activar/desactivar el bot.

### � Social e Interacciones
- `.casar @usuario` - Proponer matrimonio.
- `.divorciar @usuario` - Divorciarse.
- `.mimatrimonio` - Ver estado civil y fecha de boda.
- `.rosa @usuario` - Dedicar una rosa.
- **Interacciones**:
  - `.kiss @usuario` - Besar.
  - `.hug @usuario` - Abrazar.
  - `.pat @usuario` - Acariciar.
  - `.slap @usuario` - Dar una cachetada.
  - `.fuck @usuario` (NSFW)
  - `.spank` / `.lick` / `.bite`
- **Listas de diversión**:
  - `.solteras`, `.traumadas`, `.maricones`, `.pajeros`, `.inactivos`.
- `.ig @usuario` - Ver Instagram de un usuario.

### 🔧 Utilidades
- `.sticker` - Convierte imagen/video/gif a sticker.
- `.voz [texto]` - Convierte texto a nota de voz.
- `.transcribir` - Convierte nota de voz a texto (responder al audio).
- `.alarma HH:MM [mensaje]` - Configura una alarma.
- `.recordar DD/MM HH:MM [mensaje]` - Configura un recordatorio.
- `.ping` - Ver estado y latencia del bot.
- `.info` - Información del sistema.

### 🎮 Juegos y Diversión
- `.ppt [piedra/papel/tijera]` - Juega contra el bot.
- `.trivia` - Preguntas de cultura general.
- `.adivina` - Juego de adivinar el número.
- `.dado` - Lanza un dado.
- `.moneda` - Cara o cruz.
- `.troll` - Envía una imagen troll random.

---

## ⚙️ Configuración Avanzada

### Automtización
- **Copia de seguridad**: El bot realiza copias de seguridad automáticas (configurado en `sync.sh`).
- **Persistencia**: El archivo `uptime.json` mantiene el tiempo de actividad entre reinicios.
- **Auto-borrado**: Los mensajes largos y comandos de backup se borran automáticamente para mantener la limpieza.

### Estructura de Archivos
- `commands/`: Contiene la lógica de todos los comandos.
- `handlers/`: Manejadores de eventos (mensajes, bienvenidas).
- `rpg_data.json` / `economy.json`: Bases de datos locales.
- `auth_info/`: Sesión de WhatsApp (¡No compartir!).

## 🤝 Contribuciones
Si encuentras un error o quieres sugerir una función, contacta al creador o abre un Issue en el repositorio.

---
**Creado con ❤️ por Boy2Flow**
