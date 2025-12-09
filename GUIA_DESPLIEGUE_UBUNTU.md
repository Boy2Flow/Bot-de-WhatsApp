# 🚀 Guía de Despliegue del Bot en Ubuntu Server

Esta guía te ayudará a copiar y ejecutar tu bot de WhatsApp en un servidor Ubuntu.

## 📋 Requisitos Previos

- Servidor Ubuntu con acceso SSH
- Conexión a internet en el servidor
- Usuario con permisos sudo

---

## 🔧 PASO 1: Preparar el Servidor Ubuntu

### 1.1 Conectarse al servidor

```bash
ssh usuario@IP_DEL_SERVIDOR
```

### 1.2 Actualizar el sistema

```bash
sudo apt update
sudo apt upgrade -y
```

### 1.3 Instalar Node.js y npm

```bash
# Instalar Node.js 20.x (versión LTS recomendada)
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Verificar instalación
node --version
npm --version
```

### 1.4 Instalar dependencias del sistema necesarias

```bash
# Para Sharp (procesamiento de imágenes)
sudo apt install -y build-essential libvips-dev

# Para Git (opcional, para clonar repositorios)
sudo apt install -y git

# Para screen o tmux (mantener el bot corriendo)
sudo apt install -y screen
```

---

## 📦 PASO 2: Copiar el Bot al Servidor

### Opción A: Usando SCP (desde tu PC Windows)

Abre PowerShell en tu PC Windows y ejecuta:

```powershell
# Navegar a la carpeta del proyecto
cd C:\Users\Omen\Desktop\Proyectos\Proyecto_Bots_WS

# Copiar todo el proyecto al servidor (reemplaza usuario e IP)
scp -r . usuario@IP_SERVIDOR:/home/usuario/bot-whatsapp
```

### Opción B: Usando WinSCP o FileZilla

1. Descarga WinSCP: https://winscp.net/
2. Conecta al servidor usando:
   - Host: IP del servidor
   - Usuario: tu usuario
   - Contraseña: tu contraseña
3. Arrastra la carpeta completa del bot al servidor

### Opción C: Crear un archivo comprimido y subirlo

En PowerShell (Windows):

```powershell
# Comprimir el proyecto
Compress-Archive -Path "C:\Users\Omen\Desktop\Proyectos\Proyecto_Bots_WS\*" -DestinationPath "C:\Users\Omen\Desktop\bot.zip"

# Luego sube bot.zip usando SCP
scp C:\Users\Omen\Desktop\bot.zip usuario@IP_SERVIDOR:/home/usuario/
```

En el servidor Ubuntu:

```bash
# Descomprimir
cd /home/usuario
unzip bot.zip -d bot-whatsapp
cd bot-whatsapp
```

---

## 🔨 PASO 3: Instalar Dependencias en el Servidor

```bash
# Navegar a la carpeta del bot
cd /home/usuario/bot-whatsapp

# Instalar dependencias
npm install

# Si hay errores con Sharp, reinstalarlo
npm rebuild sharp
```

---

## ⚙️ PASO 4: Configurar el Bot

### 4.1 Verificar archivos de configuración

```bash
# Listar archivos
ls -la

# Asegurarse de que existen estos archivos JSON:
# - economy.json
# - messages.json
# - marriages.json
# etc.
```

### 4.2 Limpiar sesión anterior (si existe)

```bash
# Eliminar carpeta de autenticación anterior
rm -rf auth_info
```

---

## 🚀 PASO 5: Ejecutar el Bot

### Opción A: Ejecución Simple (para pruebas)

```bash
npm start
```

Esto mostrará el código QR en la terminal. **PROBLEMA**: No podrás ver el QR fácilmente en SSH.

### Opción B: Ejecutar con Screen (RECOMENDADO)

Screen permite que el bot siga corriendo aunque cierres la conexión SSH.

```bash
# Crear una sesión de screen
screen -S whatsapp-bot

# Dentro de screen, ejecutar el bot
npm start

# Para salir de screen sin detener el bot:
# Presiona: Ctrl + A, luego D

# Para volver a la sesión:
screen -r whatsapp-bot

# Para listar sesiones activas:
screen -ls

# Para detener el bot:
# Vuelve a la sesión con screen -r whatsapp-bot
# Luego presiona Ctrl + C
```

### Opción C: Ejecutar como servicio systemd (PRODUCCIÓN)

Crear archivo de servicio:

```bash
sudo nano /etc/systemd/system/whatsapp-bot.service
```

Contenido del archivo:

```ini
[Unit]
Description=WhatsApp Bot Multifuncional
After=network.target

[Service]
Type=simple
User=TU_USUARIO
WorkingDirectory=/home/TU_USUARIO/bot-whatsapp
ExecStart=/usr/bin/node index.js
Restart=always
RestartSec=10
StandardOutput=journal
StandardError=journal

[Install]
WantedBy=multi-user.target
```

Activar y ejecutar el servicio:

```bash
# Recargar systemd
sudo systemctl daemon-reload

# Habilitar el servicio (se inicia automáticamente al arrancar)
sudo systemctl enable whatsapp-bot

# Iniciar el servicio
sudo systemctl start whatsapp-bot

# Ver estado
sudo systemctl status whatsapp-bot

# Ver logs
sudo journalctl -u whatsapp-bot -f

# Detener el servicio
sudo systemctl stop whatsapp-bot
```

---

## 📱 PASO 6: Escanear el Código QR

### Problema: No puedes ver el QR en SSH

**Solución 1: Usar el archivo QR generado**

El bot genera un archivo `whatsapp_qr.png`. Necesitas descargarlo a tu PC:

```bash
# En tu PC Windows (PowerShell):
scp usuario@IP_SERVIDOR:/home/usuario/bot-whatsapp/whatsapp_qr.png C:\Users\Omen\Desktop\qr.png
```

Luego abre `qr.png` y escanéalo con WhatsApp.

**Solución 2: Usar qrencode para ver el QR en terminal**

```bash
# Instalar qrencode
sudo apt install -y qrencode

# El bot ya genera el QR en terminal, pero si necesitas verlo mejor:
# Modifica el código o usa esta alternativa
```

**Solución 3: Usar un túnel SSH con X11 (avanzado)**

```bash
# Conectar con reenvío X11
ssh -X usuario@IP_SERVIDOR

# Instalar visor de imágenes
sudo apt install -y feh

# Ver la imagen
feh whatsapp_qr.png
```

---

## 🔍 PASO 7: Verificar que Funciona

### Verificar logs

```bash
# Si usas screen:
screen -r whatsapp-bot

# Si usas systemd:
sudo journalctl -u whatsapp-bot -f

# Ver archivos de log (si existen):
tail -f COMMAND_LOGS.txt
```

### Probar comandos

Envía un mensaje a un grupo donde esté el bot:

- `.menu`
- `.ping`
- `.status`

---

## 🛠️ SOLUCIÓN DE PROBLEMAS

### Error: "Cannot find module"

```bash
npm install
```

### Error con Sharp

```bash
npm rebuild sharp
# O reinstalar:
npm uninstall sharp
npm install sharp
```

### El bot se desconecta constantemente

- Verifica tu conexión a internet
- Asegúrate de que no hay otra sesión de WhatsApp Web activa
- Revisa los logs para ver el error específico

### No puedo ver el QR

- Descarga el archivo `whatsapp_qr.png` usando SCP
- O usa la solución de qrencode mencionada arriba

### El bot no responde a comandos

- Verifica que el bot esté conectado: revisa los logs
- Asegúrate de que estás usando el prefijo correcto (`.`)
- Verifica que el bot tenga permisos de administrador en el grupo

---

## 📊 MONITOREO Y MANTENIMIENTO

### Ver uso de recursos

```bash
# CPU y memoria
htop

# Espacio en disco
df -h

# Procesos de Node
ps aux | grep node
```

### Backup de datos

```bash
# Crear backup de archivos JSON
tar -czf backup-$(date +%Y%m%d).tar.gz *.json auth_info/

# Descargar backup a tu PC
scp usuario@IP_SERVIDOR:/home/usuario/bot-whatsapp/backup-*.tar.gz C:\Users\Omen\Desktop\
```

### Actualizar el bot

```bash
# Detener el bot
sudo systemctl stop whatsapp-bot
# O si usas screen: Ctrl+C en la sesión

# Subir nuevos archivos desde tu PC
# Luego en el servidor:
npm install  # Por si hay nuevas dependencias

# Reiniciar
sudo systemctl start whatsapp-bot
# O: npm start en screen
```

---

## 🎯 RESUMEN RÁPIDO

```bash
# 1. Instalar Node.js
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs build-essential libvips-dev screen

# 2. Copiar archivos (desde Windows)
scp -r C:\Users\Omen\Desktop\Proyectos\Proyecto_Bots_WS usuario@IP:/home/usuario/bot-whatsapp

# 3. En el servidor
cd /home/usuario/bot-whatsapp
npm install

# 4. Ejecutar con screen
screen -S whatsapp-bot
npm start

# 5. Descargar QR (desde Windows)
scp usuario@IP:/home/usuario/bot-whatsapp/whatsapp_qr.png C:\Users\Omen\Desktop\qr.png

# 6. Escanear QR con WhatsApp

# 7. Salir de screen sin detener el bot
# Ctrl + A, luego D
```

---

## 🔐 SEGURIDAD

### Firewall

```bash
# Permitir SSH
sudo ufw allow ssh

# Habilitar firewall
sudo ufw enable
```

### Actualizar regularmente

```bash
sudo apt update && sudo apt upgrade -y
```

### No compartir archivos de sesión

Los archivos en `auth_info/` contienen tu sesión de WhatsApp. **¡No los compartas!**

---

## 📞 SOPORTE

Si tienes problemas:

1. Revisa los logs: `sudo journalctl -u whatsapp-bot -f`
2. Verifica la conexión: `ping google.com`
3. Comprueba Node.js: `node --version`
4. Reinstala dependencias: `rm -rf node_modules && npm install`

---

**¡Listo! Tu bot debería estar funcionando en Ubuntu Server.** 🎉
