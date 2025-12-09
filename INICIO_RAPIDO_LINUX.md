# 🚀 INICIO RÁPIDO - Bot de WhatsApp

## ⚡ Inicio en 3 pasos

### 1️⃣ Instalar dependencias (solo la primera vez)
```bash
npm install
```

### 2️⃣ Iniciar el bot
```bash
./start.sh
```

### 3️⃣ Escanear código QR
- Abre WhatsApp en tu teléfono
- Ve a: **Configuración → Dispositivos vinculados**
- Toca **"Vincular un dispositivo"**
- Escanea el código QR de la terminal

---

## 📋 Métodos de Inicio

### Método 1: Normal (ver QR en terminal)
```bash
./start.sh
```
- ✅ Ves el QR inmediatamente
- ❌ Se detiene si cierras la terminal

### Método 2: Segundo plano (continúa ejecutándose)
```bash
./start-background.sh    # Iniciar
./status.sh              # Ver estado
tail -f logs/bot.log     # Ver logs
./stop.sh                # Detener
```
- ✅ Sigue ejecutándose aunque cierres la terminal
- ✅ Logs guardados en archivos

---

## 🛠️ Comandos Útiles

```bash
./status.sh              # Ver estado del bot
./stop.sh                # Detener el bot
tail -f logs/bot.log     # Ver logs en tiempo real
npm start                # Inicio manual
```

---

## 🔧 Solución de Problemas

### Error: "Permission denied"
```bash
chmod +x start.sh start-background.sh stop.sh status.sh
```

### Limpiar sesión (si hay problemas de conexión)
```bash
./stop.sh
rm -rf auth_info/
./start.sh
```

### No aparece el código QR
```bash
# Ver la imagen generada
xdg-open whatsapp_qr.png

# O revisar los logs
tail -f logs/bot.log
```

---

## 📚 Documentación Completa

- **GUIA_INICIO_LINUX.md** - Guía completa de inicio en Linux
- **README.md** - Documentación general del bot
- **COMANDOS_ADMIN.md** - Comandos de administrador

---

## 🎯 Comandos del Bot en WhatsApp

Una vez conectado, usa estos comandos:

- `$menu` - Ver todos los comandos
- `$admin` - Comandos de administrador
- `$help` - Ayuda detallada
- `$sticker` - Crear stickers
- `$todos` - Mencionar a todos (solo admins)

---

**¡Listo! 🎉 Tu bot estará funcionando en segundos.**

Para más detalles, consulta **GUIA_INICIO_LINUX.md**
