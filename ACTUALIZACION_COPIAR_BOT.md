# 📋 ACTUALIZACIÓN: copiar_bot_limpio.ps1

## ✅ Cambios realizados

### 🗂️ **Archivos excluidos (nuevos):**

- `auth_backup*` - Backups de autenticación
- `auth_backups` - Carpeta de backups
- `whatsapp_qr.png` - Código QR generado
- `COMMAND_LOGS.txt` - Logs de comandos
- `bot_logo_discord*.png` - Imágenes de Discord generadas
- `whatsapp_icon_small*.png` - Iconos de Discord
- `discord_preview_example*.png` - Previews de Discord

### 📄 **Archivos JSON reseteados (nuevos):**

- `solteras.json` - Sistema de solteras
- `messages.json` - Contador de mensajes
- `marriages.json` - Sistema de matrimonios
- `divorces.json` - Historial de divorcios
- `rpg_data.json` - Datos del sistema RPG
- `groupConfig.json` - Configuración por grupo

### 🎮 **Limpieza de Discord Rich Presence:**

- Resetea el `CLIENT_ID` de Discord a valor por defecto
- Deja el archivo listo para configurar con nuevo Application ID

### 📚 **Documentación incluida en la copia:**

- README.md
- DISCORD_README.md
- GUIA_DISCORD_VISUAL.md
- SISTEMA_MUTEO.md
- GUIA_ECONOMIA.md
- GUIA_RPG.md
- Todos los archivos .md de guías

### 🎨 **Mejoras visuales:**

- Salida más profesional con emojis
- Instrucciones paso a paso mejoradas
- Lista de documentación incluida
- Formato más claro y organizado

## 🚀 Uso

```powershell
.\copiar_bot_limpio.ps1
```

## 📦 Resultado

La copia incluirá:

- ✅ Todo el código fuente
- ✅ Sistema de Discord Rich Presence (sin configurar)
- ✅ Todos los comandos y sistemas
- ✅ Documentación completa
- ✅ Archivos JSON vacíos/reseteados
- ❌ Sin datos privados (tokens, sesiones, datos de usuarios)
- ❌ Sin imágenes generadas temporales
- ❌ Sin logs ni backups

## 🔧 Configuración posterior

Después de copiar, el usuario deberá:

1. `npm install` - Instalar dependencias
2. (Opcional) Configurar Discord Rich Presence
3. `node index.js` - Iniciar el bot
4. Escanear QR de WhatsApp

---

**Fecha de actualización:** 2025-12-08
**Versión:** 2.0 (con Discord Rich Presence)
