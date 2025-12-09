# 🐧 Guía de Inicio - Linux

Esta guía te ayudará a iniciar el bot de WhatsApp en Linux de manera fácil y rápida.

## 📋 Requisitos Previos

Antes de iniciar el bot, asegúrate de tener instalado:

- **Node.js 18 o superior**
- **npm** (viene con Node.js)

### Verificar instalación

```bash
node -v    # Debe mostrar v18.x.x o superior
npm -v     # Debe mostrar la versión de npm
```

### Instalar Node.js (si no lo tienes)

```bash
# Ubuntu/Debian
sudo apt update
sudo apt install nodejs npm

# Fedora
sudo dnf install nodejs npm

# Arch Linux
sudo pacman -S nodejs npm
```

## 🚀 Métodos de Inicio

### Método 1: Inicio Normal (Recomendado para primera vez)

Este método muestra el código QR directamente en la terminal:

```bash
# Dar permisos de ejecución
chmod +x start.sh

# Iniciar el bot
./start.sh
```

**Ventajas:**
- ✅ Ves el código QR inmediatamente
- ✅ Ves los logs en tiempo real
- ✅ Fácil de detener con Ctrl+C

**Desventajas:**
- ❌ Se detiene si cierras la terminal

### Método 2: Inicio en Segundo Plano

Este método ejecuta el bot en segundo plano (continúa aunque cierres la terminal):

```bash
# Dar permisos de ejecución
chmod +x start-background.sh stop.sh status.sh

# Iniciar el bot en segundo plano
./start-background.sh

# Ver logs en tiempo real
tail -f logs/bot.log

# Verificar estado
./status.sh

# Detener el bot
./stop.sh
```

**Ventajas:**
- ✅ El bot sigue ejecutándose aunque cierres la terminal
- ✅ Los logs se guardan en archivos
- ✅ Fácil de gestionar

**Desventajas:**
- ❌ No ves el QR directamente (debes revisar los logs)

### Método 3: Inicio Manual con npm

```bash
# Instalar dependencias (solo la primera vez)
npm install

# Iniciar el bot
npm start
```

## 📱 Vincular WhatsApp

1. **Inicia el bot** con cualquiera de los métodos anteriores
2. **Espera el código QR** (aparecerá en la terminal o en logs/bot.log)
3. **Abre WhatsApp** en tu teléfono
4. Ve a: **Configuración → Dispositivos vinculados**
5. Toca **"Vincular un dispositivo"**
6. **Escanea el código QR** que aparece en la terminal

También se generará una imagen `whatsapp_qr.png` que puedes abrir:

```bash
# Ver la imagen del QR
xdg-open whatsapp_qr.png
```

## 🛠️ Comandos Útiles

### Ver logs en tiempo real
```bash
tail -f logs/bot.log
```

### Ver estado del bot
```bash
./status.sh
```

### Detener el bot
```bash
# Si está en segundo plano
./stop.sh

# Si está en primer plano
Ctrl+C
```

### Reiniciar el bot
```bash
./stop.sh && ./start-background.sh
```

### Limpiar sesión (si hay problemas)
```bash
# Detener el bot primero
./stop.sh

# Limpiar sesión
rm -rf auth_info/

# Iniciar de nuevo
./start.sh
```

## 🔧 Solución de Problemas

### Error: "Permission denied"

```bash
chmod +x start.sh start-background.sh stop.sh status.sh
```

### Error: "Node.js no está instalado"

Instala Node.js siguiendo las instrucciones de la sección "Requisitos Previos"

### Error: "Cannot find module"

```bash
npm install
```

### El bot se desconecta constantemente

1. Verifica tu conexión a Internet
2. Asegúrate de que no haya otra sesión de WhatsApp Web abierta
3. Limpia la sesión y vuelve a escanear el QR:

```bash
./stop.sh
rm -rf auth_info/
./start.sh
```

### No aparece el código QR

1. Verifica los logs:
```bash
tail -f logs/bot.log
```

2. O abre la imagen generada:
```bash
xdg-open whatsapp_qr.png
```

## 🚀 Inicio Automático al Arrancar el Sistema

### Usando systemd (recomendado)

1. Crea un archivo de servicio:

```bash
sudo nano /etc/systemd/system/whatsapp-bot.service
```

2. Pega este contenido (ajusta las rutas):

```ini
[Unit]
Description=WhatsApp Bot
After=network.target

[Service]
Type=simple
User=b2f
WorkingDirectory=/home/b2f/Bot_whatsap
ExecStart=/usr/bin/npm start
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
```

3. Habilita e inicia el servicio:

```bash
sudo systemctl daemon-reload
sudo systemctl enable whatsapp-bot
sudo systemctl start whatsapp-bot
```

4. Comandos útiles del servicio:

```bash
# Ver estado
sudo systemctl status whatsapp-bot

# Ver logs
sudo journalctl -u whatsapp-bot -f

# Reiniciar
sudo systemctl restart whatsapp-bot

# Detener
sudo systemctl stop whatsapp-bot
```

## 📊 Monitoreo

### Ver uso de recursos

```bash
./status.sh
```

### Ver logs completos

```bash
cat logs/bot.log
```

### Ver solo errores

```bash
grep -i error logs/bot.log
```

## 🎯 Comandos del Bot

Una vez que el bot esté conectado, puedes usar estos comandos en WhatsApp:

- `$menu` - Ver todos los comandos
- `$admin` - Ver comandos de administrador
- `$help` - Ayuda detallada
- `$info` - Información del bot

## 📝 Notas Importantes

- ⚠️ **No compartas** la carpeta `auth_info/` con nadie
- 🔒 Mantén el bot actualizado: `npm update`
- 📁 Los logs se guardan en `logs/bot.log`
- 🔄 El bot se reconecta automáticamente si se desconecta
- 👑 El bot debe ser **administrador** del grupo para usar comandos de admin

## 🆘 Soporte

Si tienes problemas:

1. Revisa esta guía
2. Verifica los logs: `tail -f logs/bot.log`
3. Limpia la sesión y vuelve a intentar
4. Verifica que Node.js esté actualizado

---

**¡Disfruta tu bot de WhatsApp! 🎉**
