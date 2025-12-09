# 🎮 Configuración de Discord Rich Presence

## 📋 Pasos para configurar

### 1️⃣ Crear una aplicación en Discord

1. Ve a [Discord Developer Portal](https://discord.com/developers/applications)
2. Haz clic en **"New Application"**
3. Dale un nombre a tu aplicación (ej: "WhatsApp Bot")
4. Copia el **Application ID** (Client ID)

### 2️⃣ Configurar imágenes

1. En tu aplicación de Discord, ve a **"Rich Presence" > "Art Assets"**
2. Sube las siguientes imágenes:

   - **bot_logo** (512x512 px) - Logo principal del bot
   - **whatsapp_icon** (512x512 px) - Icono de WhatsApp

3. Guarda los cambios

### 3️⃣ Configurar el bot

1. Abre el archivo `utils/discordPresence.js`
2. Reemplaza `CLIENT_ID` con tu Application ID:

```javascript
const CLIENT_ID = "TU_APPLICATION_ID_AQUI";
```

### 4️⃣ Personalizar URLs (Opcional)

En el archivo `utils/discordPresence.js`, puedes cambiar los botones:

```javascript
buttons: [
  { label: "📱 GitHub", url: "https://github.com/tuusuario/bot" },
  { label: "💬 Discord", url: "https://discord.gg/tuservidor" },
];
```

## 🎨 Crear imágenes para Discord

### Opción 1: Usar imágenes existentes

- Logo del bot: 512x512 px, formato PNG
- Icono de WhatsApp: Descarga de [aquí](https://www.whatsapp.com/brand)

### Opción 2: Generar con IA

Puedo generar imágenes personalizadas para tu bot si lo deseas.

## 🚀 Uso

El sistema se activa automáticamente cuando inicias el bot. Mostrará:

- ✅ Estado de conexión
- 📊 Número de grupos
- 💬 Mensajes procesados
- ⏱️ Tiempo activo
- 🔗 Botones personalizados

## 🎯 Estados disponibles

El bot cambiará automáticamente entre estos estados:

- **Iniciando** - Cuando el bot se está conectando
- **Conectado** - Bot operativo
- **Desconectado** - Reconectando
- **Procesando** - Ejecutando comandos

## ⚙️ Funciones disponibles

```javascript
// Actualizar estadísticas
updateBotStats({
    groups: 5,
    messages: 1234,
    users: 150
});

// Cambiar estado manualmente
setConnectedStatus();
setDisconnectedStatus();
setProcessingStatus('Procesando comando');

// Actualizar presencia personalizada
updatePresence('Mi estado', 'Mi descripción', {
    buttons: [...]
});
```

## 🔧 Solución de problemas

### No aparece en Discord

1. Asegúrate de que Discord esté abierto
2. Verifica que el CLIENT_ID sea correcto
3. Revisa que las imágenes estén subidas en el Developer Portal

### Error de conexión

- Cierra y abre Discord
- Reinicia el bot
- Verifica que no haya otro proceso usando Discord RPC

## 📸 Ejemplo de cómo se ve

```
┌─────────────────────────────────┐
│  🤖 Bot WhatsApp Premium        │
│  ✅ Bot Conectado               │
│  🟢 Online y operativo          │
│                                 │
│  ⏱️ Activo desde hace 2h 30m    │
│                                 │
│  [📱 Ver en GitHub]             │
│  [💬 Discord]                   │
└─────────────────────────────────┘
```

## 🎨 Personalización avanzada

Puedes modificar completamente la apariencia editando `utils/discordPresence.js`:

- Cambiar textos
- Añadir más botones (máximo 2)
- Modificar imágenes
- Añadir estadísticas personalizadas

---

**Nota:** Discord Rich Presence solo funciona cuando Discord está abierto en tu PC.
