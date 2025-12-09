# 🎮 Discord Rich Presence - Bot WhatsApp

## ✨ Características

Tu bot de WhatsApp ahora mostrará su estado en Discord en tiempo real con:

- 🟢 **Estado en vivo** - Conectado/Desconectado/Procesando
- 📊 **Estadísticas** - Grupos activos y mensajes procesados
- ⏱️ **Tiempo activo** - Cuánto tiempo lleva el bot funcionando
- 🔗 **Botones personalizados** - Enlaces a GitHub, Discord, etc.
- 🎨 **Imágenes personalizadas** - Logo del bot e icono de WhatsApp

## 🚀 Instalación Rápida

### Paso 1: Crear aplicación en Discord

1. Ve a [Discord Developer Portal](https://discord.com/developers/applications)
2. Haz clic en **"New Application"**
3. Nombra tu aplicación (ej: "WhatsApp Bot Premium")
4. Copia el **Application ID**

### Paso 2: Subir imágenes

1. En tu aplicación, ve a **"Rich Presence" > "Art Assets"**
2. Sube estas imágenes (están en la carpeta del proyecto):
   - **bot_logo** → `bot_logo_discord.png`
   - **whatsapp_icon** → `whatsapp_icon_small.png`

### Paso 3: Configurar

Ejecuta el script de configuración:

```bash
node setup_discord.js
```

Ingresa tu Application ID cuando te lo pida.

### Paso 4: ¡Listo!

Reinicia el bot y verás el estado en Discord:

```bash
node index.js
```

## 📸 Vista Previa

Así se verá en tu perfil de Discord:

```
┌─────────────────────────────────────┐
│  🤖 WhatsApp Bot Premium            │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━   │
│                                     │
│  ✅ Bot Conectado                   │
│  🟢 Online y operativo              │
│                                     │
│  📊 5 grupos | 1,234 mensajes       │
│                                     │
│  ⏱️ Activo desde hace 2h 30m        │
│                                     │
│  ┌─────────────────────────────┐   │
│  │  📱 Ver en GitHub           │   │
│  └─────────────────────────────┘   │
│  ┌─────────────────────────────┐   │
│  │  💬 Discord                 │   │
│  └─────────────────────────────┘   │
└─────────────────────────────────────┘
```

## 🎯 Estados del Bot

El bot cambiará automáticamente entre estos estados:

### 🔄 Iniciando

```
⚡ Iniciando...
🔄 Conectando a WhatsApp
```

### ✅ Conectado

```
✅ Bot Conectado
🟢 Online y operativo
📊 5 grupos | 1,234 mensajes
```

### ⚠️ Desconectado

```
⚠️ Bot Desconectado
🔴 Reconectando...
```

### ⚡ Procesando

```
⚡ Procesando comando
📊 5 grupos activos
```

## ⚙️ Configuración Manual

Si prefieres configurar manualmente, edita `utils/discordPresence.js`:

```javascript
// Cambiar el Client ID
const CLIENT_ID = "TU_APPLICATION_ID_AQUI";

// Personalizar botones
buttons: [
  { label: "📱 GitHub", url: "https://github.com/tuusuario/bot" },
  { label: "💬 Discord", url: "https://discord.gg/tuservidor" },
];
```

## 🎨 Personalización Avanzada

### Cambiar textos

Edita las funciones en `utils/discordPresence.js`:

```javascript
export function setConnectedStatus() {
  updatePresence(
    "🎉 ¡Mi Bot Está Activo!", // Texto principal
    "💪 Trabajando duro", // Texto secundario
    {
      /* opciones */
    }
  );
}
```

### Añadir más estadísticas

```javascript
updateBotStats({
  groups: 10,
  messages: 5000,
  users: 250,
  // Añade más campos personalizados
});
```

### Cambiar imágenes

1. Crea nuevas imágenes (512x512 px, PNG)
2. Súbelas al Discord Developer Portal
3. Usa los nombres que les diste:

```javascript
largeImageKey: 'mi_logo_personalizado',
smallImageKey: 'mi_icono_pequeño',
```

## 🔧 Solución de Problemas

### ❌ No aparece en Discord

**Solución:**

1. Asegúrate de que Discord esté abierto
2. Verifica que el CLIENT_ID sea correcto
3. Espera 15 segundos después de iniciar el bot

### ❌ Error "Could not connect"

**Solución:**

1. Cierra Discord completamente
2. Abre Discord de nuevo
3. Reinicia el bot

### ❌ Las imágenes no se muestran

**Solución:**

1. Verifica que las imágenes estén subidas en el Developer Portal
2. Asegúrate de usar los nombres exactos:
   - `bot_logo`
   - `whatsapp_icon`
3. Espera unos minutos (Discord puede tardar en actualizar)

### ❌ "Discord Presence no disponible"

**Solución:**
Esto es normal si Discord no está abierto. El bot funcionará igual, solo no mostrará el estado.

## 📝 API de Funciones

### `initDiscordPresence()`

Inicializa la conexión con Discord.

```javascript
await initDiscordPresence();
```

### `updatePresence(details, state, options)`

Actualiza el estado manualmente.

```javascript
updatePresence("Línea principal", "Línea secundaria", {
  buttons: [{ label: "Texto", url: "https://..." }],
});
```

### `updateBotStats(stats)`

Actualiza las estadísticas del bot.

```javascript
updateBotStats({
  groups: 5,
  messages: 1234,
  users: 150,
});
```

### `setConnectedStatus()`

Establece el estado como "Conectado".

### `setDisconnectedStatus()`

Establece el estado como "Desconectado".

### `closeDiscordPresence()`

Cierra la conexión con Discord.

## 🎁 Extras

### Actualización automática de estadísticas

El bot actualiza automáticamente:

- ✅ Número de grupos al conectarse
- ✅ Total de mensajes procesados
- ✅ Tiempo activo desde que inició

### Integración con comandos

Puedes actualizar el estado desde cualquier comando:

```javascript
import { updatePresence } from "../utils/discordPresence.js";

// En tu comando
updatePresence("⚡ Procesando", "Ejecutando comando especial");
```

## 📚 Recursos

- [Discord Developer Portal](https://discord.com/developers/applications)
- [Discord RPC Documentation](https://discord.com/developers/docs/rich-presence/how-to)
- [Guía de imágenes](./DISCORD_PRESENCE.md)

## 💡 Tips

1. **Usa imágenes de alta calidad** (512x512 px mínimo)
2. **Mantén los textos cortos** (máximo 128 caracteres)
3. **Actualiza las estadísticas periódicamente** para mostrar datos en tiempo real
4. **Personaliza los botones** con tus enlaces reales

---

**¿Necesitas ayuda?** Revisa el archivo `DISCORD_PRESENCE.md` para más detalles.
