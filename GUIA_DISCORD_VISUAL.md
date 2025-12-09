# 🎮 GUÍA VISUAL: Configurar Discord Rich Presence

## 📸 Vista Previa del Resultado

Así se verá tu bot en Discord (ver imagen: discord_preview_example.png)

---

## 🎯 PASO 1: Crear Aplicación en Discord

### 1.1 Ir al Developer Portal

```
🌐 https://discord.com/developers/applications
```

### 1.2 Crear Nueva Aplicación

```
┌─────────────────────────────────┐
│  [+ New Application]            │
└─────────────────────────────────┘
```

### 1.3 Nombrar la Aplicación

```
┌─────────────────────────────────────┐
│  Name: WhatsApp Bot Premium         │
│                                     │
│  [ Create ]                         │
└─────────────────────────────────────┘
```

### 1.4 Copiar Application ID

```
┌─────────────────────────────────────┐
│  APPLICATION ID                     │
│  1234567890123456789  [📋 Copy]    │
└─────────────────────────────────────┘
```

**⚠️ GUARDA ESTE ID - Lo necesitarás después**

---

## 🎨 PASO 2: Subir Imágenes

### 2.1 Ir a Rich Presence

```
Menú lateral:
├── General Information
├── OAuth2
├── Bot
└── 📍 Rich Presence
    └── Art Assets
```

### 2.2 Subir Logo Principal

```
┌─────────────────────────────────────┐
│  Add Image(s)                       │
│                                     │
│  📤 bot_logo_discord.png            │
│                                     │
│  Image Name: bot_logo               │
│                                     │
│  [ Upload ]                         │
└─────────────────────────────────────┘
```

**✅ Nombre exacto: `bot_logo`**

### 2.3 Subir Icono Pequeño

```
┌─────────────────────────────────────┐
│  Add Image(s)                       │
│                                     │
│  📤 whatsapp_icon_small.png         │
│                                     │
│  Image Name: whatsapp_icon          │
│                                     │
│  [ Upload ]                         │
└─────────────────────────────────────┘
```

**✅ Nombre exacto: `whatsapp_icon`**

### 2.4 Guardar Cambios

```
┌─────────────────────────────────────┐
│  [ Save Changes ]                   │
└─────────────────────────────────────┘
```

---

## ⚙️ PASO 3: Configurar el Bot

### 3.1 Abrir Terminal en la Carpeta del Bot

```powershell
cd C:\Users\Omen\Desktop\Proyectos\Proyecto_Bots_WS
```

### 3.2 Ejecutar Script de Configuración

```powershell
node setup_discord.js
```

### 3.3 Ingresar Application ID

```
╔═══════════════════════════════════════════╗
║  🎮 CONFIGURACIÓN DISCORD RICH PRESENCE  ║
╚═══════════════════════════════════════════╝

🔑 Ingresa tu Discord Application ID: 1234567890123456789
```

### 3.4 Ingresar URLs (Opcional)

```
📝 URLs para los botones (opcional):

📱 URL de GitHub: https://github.com/tuusuario/bot
💬 URL de Discord: https://discord.gg/tuservidor
```

### 3.5 Confirmación

```
✅ Configuración guardada exitosamente!

📋 Resumen:
   Client ID: 1234567890123456789
   GitHub URL: https://github.com/tuusuario/bot
   Discord URL: https://discord.gg/tuservidor

🚀 Próximos pasos:
1. Asegúrate de que Discord esté abierto
2. Reinicia el bot: node index.js
```

---

## 🚀 PASO 4: Iniciar el Bot

### 4.1 Asegurarse de que Discord esté Abierto

```
✅ Discord debe estar abierto en tu PC
```

### 4.2 Iniciar el Bot

```powershell
node index.js
```

### 4.3 Verificar Conexión

```
✅ Bot conectado exitosamente!
✅ Discord Rich Presence conectado

🤖 Bot de WhatsApp activo y listo!
```

---

## 🎯 PASO 5: Verificar en Discord

### 5.1 Ver tu Perfil

```
Discord → Tu perfil → Debajo de tu nombre
```

### 5.2 Deberías Ver:

```
┌─────────────────────────────────────┐
│  🤖 WhatsApp Bot Premium            │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│                                     │
│  ✅ Bot Conectado                   │
│  🟢 Online y operativo              │
│                                     │
│  📊 5 grupos | 1,234 mensajes       │
│                                     │
│  ⏱️ Activo desde hace 0h 1m         │
│                                     │
│  [ 📱 Ver en GitHub ]               │
│  [ 💬 Discord ]                     │
└─────────────────────────────────────┘
```

---

## 🎨 Personalización Rápida

### Cambiar Textos

Edita `utils/discordPresence.js`:

```javascript
// Línea ~105
export function setConnectedStatus() {
  updatePresence(
    "🎉 ¡Mi Bot Está Activo!", // ← Cambia esto
    "💪 Trabajando 24/7", // ← Y esto
    {
      buttons: [
        { label: "🌐 Mi Web", url: "https://tuweb.com" },
        { label: "📧 Email", url: "mailto:tu@email.com" },
      ],
    }
  );
}
```

### Cambiar Botones

```javascript
// En cualquier función updatePresence
buttons: [
  { label: "🌐 Sitio Web", url: "https://tusitio.com" },
  { label: "📺 YouTube", url: "https://youtube.com/@tucanal" },
];
```

**⚠️ Máximo 2 botones permitidos por Discord**

---

## 🔧 Solución de Problemas

### ❌ No aparece en Discord

**Checklist:**

- [ ] Discord está abierto
- [ ] Application ID es correcto
- [ ] Esperaste 15 segundos después de iniciar
- [ ] El bot está conectado a WhatsApp

**Solución:**

```powershell
# Reiniciar Discord
# Cerrar Discord completamente
# Abrir Discord de nuevo
# Reiniciar el bot
node index.js
```

### ❌ Imágenes no se muestran

**Checklist:**

- [ ] Imágenes subidas en Art Assets
- [ ] Nombres exactos: `bot_logo` y `whatsapp_icon`
- [ ] Guardaste los cambios en Discord Developer Portal
- [ ] Esperaste 5 minutos (Discord tarda en actualizar)

### ❌ Error "Could not connect"

**Solución:**

```
1. Cierra Discord completamente
2. Abre Discord
3. Espera 10 segundos
4. Inicia el bot
```

### ❌ "Discord Presence no disponible"

**Esto es normal si:**

- Discord no está abierto
- Discord está en modo invisible
- Hay otro programa usando Discord RPC

**El bot funcionará igual**, solo no mostrará el estado.

---

## 📊 Estados del Bot

### 🔄 Al Iniciar

```
⚡ Iniciando...
🔄 Conectando a WhatsApp
```

### ✅ Conectado

```
✅ Bot Conectado
🟢 Online y operativo
📊 X grupos | Y mensajes
```

### ⚠️ Desconectado

```
⚠️ Bot Desconectado
🔴 Reconectando...
```

### ⚡ Procesando

```
⚡ Procesando comando
📊 X grupos activos
```

---

## 🎁 Archivos Incluidos

```
📁 Proyecto_Bots_WS/
│
├── 📄 utils/discordPresence.js      ← Sistema principal
├── 📄 setup_discord.js              ← Configuración rápida
├── 📄 DISCORD_README.md             ← Guía completa
├── 📄 DISCORD_PRESENCE.md           ← Documentación técnica
├── 📄 DISCORD_INSTALADO.md          ← Resumen de instalación
├── 📄 GUIA_DISCORD_VISUAL.md        ← Esta guía
│
└── 🖼️ Imágenes generadas:
    ├── bot_logo_discord.png         ← Logo principal
    ├── whatsapp_icon_small.png      ← Icono pequeño
    └── discord_preview_example.png  ← Vista previa
```

---

## 📝 Checklist Final

Antes de iniciar, asegúrate de:

- [ ] Crear aplicación en Discord Developer Portal
- [ ] Copiar Application ID
- [ ] Subir `bot_logo_discord.png` como `bot_logo`
- [ ] Subir `whatsapp_icon_small.png` como `whatsapp_icon`
- [ ] Guardar cambios en Discord
- [ ] Ejecutar `node setup_discord.js`
- [ ] Ingresar Application ID
- [ ] Discord está abierto
- [ ] Iniciar bot con `node index.js`
- [ ] Verificar estado en Discord

---

## 🎯 Resultado Final

Si todo está correcto, verás:

1. ✅ En la consola: "Discord Rich Presence conectado"
2. ✅ En Discord: Tu estado personalizado con logo
3. ✅ Estadísticas actualizándose en tiempo real
4. ✅ Botones funcionando al hacer clic

---

## 💡 Tips Finales

1. **Las imágenes pueden tardar** unos minutos en aparecer
2. **Reinicia Discord** si no ves cambios inmediatos
3. **Personaliza los textos** a tu gusto
4. **Comparte tu estado** con amigos
5. **Disfruta** de tu bot profesional

---

**¡Listo para impresionar en Discord!** 🎉

¿Problemas? Revisa:

- DISCORD_README.md (guía completa)
- DISCORD_PRESENCE.md (documentación técnica)
- DISCORD_INSTALADO.md (resumen de instalación)
