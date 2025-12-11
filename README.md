# 💚 REDES SOCIALES 💚

🔗 https://www.instagram.com/boy2flow_
🔗 https://github.com/Boy2Flow




# 🤖 Bot de WhatsApp Multifuncional

Bot completo de WhatsApp con múltiples funcionalidades: creación de stickers, menciones grupales, mini juegos, **comandos de administrador** y más.

## ✨ Características

### 🎨 Stickers

- Convierte cualquier imagen en sticker
- Soporte para imágenes enviadas directamente o citadas
- Procesamiento rápido con Sharp

### 🛡️ Comandos de Administrador (NUEVO)

- **14 comandos de administración completa**
- Gestión de miembros (expulsar, añadir, promover, degradar)
- Configuración del grupo (abrir/cerrar, nombre, descripción)
- Moderación (borrar mensajes)
- Información (admins, link del grupo, info completa)
- Menciones avanzadas (todos, hidetag)

### 👥 Menciones Grupales

- Menciona a todos los miembros del grupo
- Solo disponible para administradores
- Mensajes personalizados opcionales
- Borra automáticamente el mensaje del comando

### 🎮 Mini Juegos

- **Piedra, Papel o Tijera**: Juega contra el bot
- **Adivina el Número**: Adivina un número del 1 al 10
- **Trivia**: Responde preguntas de cultura general
- **Dado**: Lanza un dado virtual
- **Moneda**: Lanza una moneda (cara o cruz)

### 🔧 Otras Funciones

- Sistema de comandos con aliases
- Mensajes de bienvenida automáticos
- Información del bot y estadísticas
- Ayuda detallada para cada comando

## 📋 Requisitos

- Node.js 18 o superior
- npm o yarn
- Cuenta de WhatsApp 

## 🚀 Instalación

1. **Clona o descarga este repositorio**

2. **Instala las dependencias:**

```bash
npm install
```

3. **Inicia el bot:**

```bash
npm start
```

4. **Escanea el código QR:**

   - Abre WhatsApp en tu teléfono con el número 
   - Ve a **Dispositivos vinculados**
   - Toca **Vincular dispositivo**
   - Escanea el código QR que aparece en la terminal

5. **Convierte el bot en administrador del grupo** (para usar comandos de admin)

## 📱 Comandos Disponibles

**IMPORTANTE:** Todos los comandos empiezan con `$`

### Generales

- `$menu` - Muestra todos los comandos
- `$help` - Ayuda detallada
- `$info` - Información del bot

### 🛡️ Administrador (Solo Admins)

- `$admin` - **Ver todos los comandos de administrador**

**Comandos incluidos:**

# Obtener link

$link

````

### Juegos

```bash
# Piedra, Papel o Tijera
$ppt piedra

# Adivinar número
$adivina 7

# Trivia
$trivia
$trivia B
````

## 🛠️ Tecnologías Utilizadas

- **Baileys**: Librería de WhatsApp Web API
- **Sharp**: Procesamiento de imágenes
- **Node.js**: Runtime de JavaScript
- **QRCode Terminal**: Generación de códigos QR en terminal

## 📁 Estructura del Proyecto

```
whatsapp-bot/
├── commands/           # Todos los comandos del bot
│   ├── index.js       # Exporta todos los comandos
│   ├── menu.js        # Comando de menú
│   ├── sticker.js     # Creación de stickers
│   ├── mentionAll.js  # Mencionar a todos
│   ├── adminCommands.js # Comandos de administrador
│   ├── games.js       # Mini juegos
│   ├── info.js        # Información del bot
│   └── help.js        # Ayuda detallada
├── handlers/          # Manejadores de eventos
│   └── messageHandler.js
├── utils/             # Utilidades
│   └── logger.js      # Sistema de logs
├── auth_info/         # Datos de autenticación (generado automáticamente)
├── index.js           # Archivo principal
├── package.json       # Dependencias
├── README.md          # Este archivo
├── GUIA_WINDOWS.md    # Guía de instalación en Windows
├── COMANDOS_ADMIN.md  # Guía completa de comandos de admin
└── ADMIN_REFERENCIA.txt # Referencia rápida de comandos de admin
```

## ⚙️ Configuración Avanzada

### Modificar Comandos

Los comandos están en la carpeta `commands/`. Cada comando tiene:

- `name`: Nombre principal del comando
- `aliases`: Nombres alternativos
- `description`: Descripción del comando
- `groupOnly`: Si solo funciona en grupos
- `adminOnly`: Si solo lo pueden usar admins
- `execute`: Función que se ejecuta

### Añadir Nuevos Comandos

1. Crea un nuevo archivo en `commands/`
2. Exporta un objeto con la estructura de comando
3. Impórtalo en `commands/index.js`

### Cambiar el Prefijo de Comandos

El prefijo actual es `$`. Para cambiarlo:

1. Abre `handlers/messageHandler.js`
2. Busca la línea: `if (!text.startsWith('$')) return;`
3. Cambia `$` por el prefijo que prefieras

## 🔒 Seguridad

- Los datos de autenticación se guardan localmente en `auth_info/`
- No compartas la carpeta `auth_info/` con nadie
- El bot solo responde a comandos que empiezan con `$`
- El número de WhatsApp vinculado será el que uses para escanear el QR
- Los comandos de administrador solo funcionan si eres admin del grupo

## 🐛 Solución de Problemas

### El código QR no aparece

- Asegúrate de tener Node.js 18 o superior
- Verifica que todas las dependencias estén instaladas

### Error al crear stickers

- Verifica que Sharp esté correctamente instalado
- En Windows, puede requerir herramientas de compilación

### El bot se desconecta

- El bot se reconectará automáticamente
- Si persiste, elimina la carpeta `auth_info/` y vuelve a escanear el QR

### Los comandos de admin no funcionan

- Verifica que seas administrador del grupo
- Verifica que el bot sea administrador del grupo
- Solo funcionan en grupos, no en chats privados

## 📝 Notas

- El bot funciona 24/7 mientras el proceso de Node.js esté activo
- Para uso en producción, considera usar PM2 o similar
- Los juegos usan caché temporal (5 minutos)
- Puedes usar cualquier número de WhatsApp para vincular el bot
- **El bot debe ser administrador para usar comandos de admin**

## 📚 Documentación Adicional

- **GUIA_WINDOWS.md** - Guía completa de instalación en Windows
- **COMANDOS_ADMIN.md** - Documentación detallada de comandos de administrador
- **ADMIN_REFERENCIA.txt** - Referencia rápida de comandos de admin
- **INICIO_RAPIDO.txt** - Guía de inicio rápido

## 🤝 Contribuciones

¡Las contribuciones son bienvenidas! Siéntete libre de:

- Reportar bugs
- Sugerir nuevas funciones
- Mejorar el código existente

## 📄 Licencia

ISC License - Libre para uso personal y comercial

## 🎉 ¡Disfruta tu bot!

Si tienes alguna pregunta o problema, no dudes en abrir un issue.

---

**Creado con ❤️ usando Baileys y Node.js**

**Comandos totales:** 25+ comandos disponibles  
**Comandos de administrador:** 14 comandos  
**Mini juegos:** 5 juegos
