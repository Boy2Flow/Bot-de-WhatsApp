# 🪟 Guía de Instalación y Ejecución en Windows

Esta guía te ayudará a instalar y ejecutar el bot de WhatsApp en Windows paso a paso.

## 📋 Requisitos Previos

Antes de comenzar, necesitas:

- Windows 10 u 11
- Conexión a Internet
- WhatsApp en tu teléfono con el número **+34 608837414**

---

## 🔧 Paso 1: Instalar Node.js

Node.js es necesario para ejecutar el bot.

### Opción A: Instalación Automática (Recomendada)

1. **Descarga Node.js:**

   - Ve a: https://nodejs.org/
   - Descarga la versión **LTS** (Long Term Support)
   - Archivo: `node-vXX.XX.X-x64.msi`

2. **Ejecuta el instalador:**

   - Haz doble clic en el archivo descargado
   - Acepta los términos de licencia
   - Deja todas las opciones por defecto
   - **IMPORTANTE:** Marca la casilla "Automatically install the necessary tools"
   - Haz clic en "Install"
   - Espera a que termine la instalación

3. **Verifica la instalación:**
   - Abre **PowerShell** o **CMD** (Presiona `Win + R`, escribe `powershell` y Enter)
   - Escribe estos comandos:
   ```powershell
   node --version
   npm --version
   ```
   - Deberías ver algo como:
   ```
   v20.11.0
   10.2.4
   ```

### Opción B: Instalación con Chocolatey

Si prefieres usar un gestor de paquetes:

1. Abre **PowerShell como Administrador**
2. Ejecuta:
   ```powershell
   Set-ExecutionPolicy Bypass -Scope Process -Force; [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072; iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))
   ```
3. Luego instala Node.js:
   ```powershell
   choco install nodejs-lts -y
   ```

---

## 📂 Paso 2: Preparar el Proyecto

1. **Abre PowerShell o CMD:**

   - Presiona `Win + R`
   - Escribe `powershell` y presiona Enter

2. **Navega a la carpeta del proyecto:**

   ```powershell
   cd "C:\Users\Omen\Desktop\Proyectos\Proyecto Bots WS"
   ```

3. **Verifica que estás en la carpeta correcta:**
   ```powershell
   dir
   ```
   - Deberías ver archivos como `package.json`, `index.js`, etc.

---

## 📦 Paso 3: Instalar Dependencias

Ahora vamos a instalar todas las librerías necesarias para el bot.

1. **Ejecuta el comando de instalación:**

   ```powershell
   npm install
   ```

2. **Espera a que termine:**
   - Verás muchas líneas de texto
   - Puede tardar 2-5 minutos dependiendo de tu conexión
   - Al final verás algo como:
   ```
   added XXX packages in XXs
   ```

### ⚠️ Posibles Problemas y Soluciones

#### Error: "npm no se reconoce como comando"

**Solución:** Node.js no está instalado correctamente. Vuelve al Paso 1.

#### Error con Sharp (procesamiento de imágenes)

Si ves errores relacionados con `sharp`, ejecuta:

```powershell
npm install --platform=win32 --arch=x64 sharp
```

#### Error de permisos

Ejecuta PowerShell como Administrador:

- Busca "PowerShell" en el menú inicio
- Clic derecho → "Ejecutar como administrador"

---

## 🚀 Paso 4: Iniciar el Bot

1. **Ejecuta el bot:**

   ```powershell
   npm start
   ```

2. **Verás algo como esto:**

   ```
   🔐 Escanea este código QR con WhatsApp:

   ████ ▄▄▄▄▄ █▀█ █▄▀▀▀▄█ ▄▄▄▄▄ ████
   ████ █   █ █▀▀▀█ ▀ ▀▀█ █   █ ████
   ████ █▄▄▄█ █▀ █▀▀ ▄ ▀█ █▄▄▄█ ████
   ...

   📱 Abre WhatsApp > Dispositivos vinculados > Vincular dispositivo
   ```

---

## 📱 Paso 5: Vincular WhatsApp

1. **Abre WhatsApp en tu teléfono** (número +34 608837414)

2. **Ve a Dispositivos vinculados:**

   - Android: Menú (⋮) → Dispositivos vinculados
   - iPhone: Configuración → Dispositivos vinculados

3. **Toca "Vincular dispositivo"**

4. **Escanea el código QR** que aparece en la terminal de tu PC

5. **Espera la confirmación:**

   ```
   ✅ Bot conectado exitosamente!

   🤖 Bot de WhatsApp activo y listo!

   📋 Comandos disponibles:
      $menu - Ver todos los comandos
      $sticker - Convertir imagen a sticker
      $todos - Mencionar a todos
      $jugar - Mini juegos
   ```

---

## ✅ Paso 6: Probar el Bot

1. **Envía un mensaje a cualquier chat:**

   ```
   $menu
   ```

2. **El bot debería responder** con el menú completo de comandos

3. **Prueba otros comandos:**
   ```
   $info
   $dado
   $ppt piedra
   ```

---

## 🎮 Comandos Disponibles

Recuerda: **Todos los comandos empiezan con `$`**

### Comandos Generales

- `$menu` - Ver todos los comandos
- `$help` - Ayuda detallada
- `$info` - Información del bot

### Stickers

- `$sticker` - Envía una imagen con este caption para convertirla en sticker
- `$s` - Atajo para sticker

### Grupos (Solo Administradores)

- `$todos` - Menciona a todos los miembros
- `$todos [mensaje]` - Menciona a todos con un mensaje personalizado

### Mini Juegos

- `$ppt piedra` - Juega Piedra, Papel o Tijera
- `$adivina 7` - Adivina un número del 1 al 10
- `$trivia` - Responde preguntas de cultura general
- `$dado` - Lanza un dado virtual
- `$moneda` - Lanza una moneda

---

## 🔄 Mantener el Bot Activo

### Opción 1: Dejar la Terminal Abierta

- Simplemente deja la ventana de PowerShell abierta
- El bot funcionará mientras la terminal esté activa
- Para detenerlo: Presiona `Ctrl + C`

### Opción 2: Usar PM2 (Recomendado para uso 24/7)

1. **Instala PM2:**

   ```powershell
   npm install -g pm2
   ```

2. **Inicia el bot con PM2:**

   ```powershell
   pm2 start index.js --name "whatsapp-bot"
   ```

3. **Comandos útiles de PM2:**

   ```powershell
   pm2 status              # Ver estado del bot
   pm2 logs whatsapp-bot   # Ver logs en tiempo real
   pm2 restart whatsapp-bot # Reiniciar el bot
   pm2 stop whatsapp-bot   # Detener el bot
   pm2 delete whatsapp-bot # Eliminar el bot de PM2
   ```

4. **Hacer que PM2 inicie con Windows:**
   ```powershell
   pm2 startup
   pm2 save
   ```

---

## 🐛 Solución de Problemas Comunes

### El bot se desconecta constantemente

**Solución:**

1. Elimina la carpeta `auth_info`:
   ```powershell
   Remove-Item -Recurse -Force "auth_info"
   ```
2. Vuelve a ejecutar `npm start`
3. Escanea el QR nuevamente

### Error: "Cannot find module"

**Solución:**

```powershell
Remove-Item -Recurse -Force "node_modules"
npm install
```

### El sticker no se crea

**Solución:**

- Asegúrate de que la imagen sea válida (JPG, PNG)
- Reinstala Sharp:
  ```powershell
  npm uninstall sharp
  npm install sharp
  ```

### El código QR no aparece

**Solución:**

- Asegúrate de estar usando PowerShell o CMD (no Git Bash)
- Intenta con una terminal diferente

### Error: "EACCES" o permisos denegados

**Solución:**

- Ejecuta PowerShell como Administrador
- O cambia los permisos de npm:
  ```powershell
  npm config set prefix "$env:APPDATA\npm"
  ```

---

## 📝 Notas Importantes

✅ **El bot funciona 24/7** mientras la terminal o PM2 estén activos

✅ **Datos de autenticación:** Se guardan en la carpeta `auth_info/` - NO la compartas

✅ **Múltiples dispositivos:** Puedes tener el bot y WhatsApp Web activos simultáneamente

✅ **Actualizaciones:** Para actualizar las dependencias:

```powershell
npm update
```

✅ **Reiniciar el bot:**

- Presiona `Ctrl + C` para detenerlo
- Ejecuta `npm start` para iniciarlo de nuevo

---

## 🆘 ¿Necesitas Ayuda?

Si tienes problemas:

1. **Revisa los logs** en la terminal para ver errores específicos
2. **Verifica que Node.js esté instalado:** `node --version`
3. **Asegúrate de estar en la carpeta correcta:** `cd "C:\Users\Omen\Desktop\Proyectos\Proyecto Bots WS"`
4. **Reinstala las dependencias:** `npm install`

---

## 🎉 ¡Listo!

Tu bot de WhatsApp está funcionando. Ahora puedes:

- Crear stickers de cualquier imagen
- Mencionar a todos en grupos (siendo admin)
- Jugar mini juegos
- Y mucho más...

**¡Disfruta tu bot!** 🤖✨

---

**Creado con ❤️ para Windows**
