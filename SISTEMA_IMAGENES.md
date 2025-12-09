# 🎨 SISTEMA DE IMÁGENES DEL BOT

## ✅ Implementado

El bot ahora incluye un sistema completo de imágenes para mejorar la experiencia visual.

## 📁 Estructura de Carpetas

```
Proyecto_Bots_WS/
├── imagenes_bot/          # Imágenes principales del bot
│   ├── bienvenida.png     # Imagen de bienvenida
│   ├── menu.png           # Imagen del menú principal
│   ├── admin.png          # Imagen del panel de admin
│   ├── economia.png       # Imagen de economía
│   ├── juegos.png         # Imagen de juegos
│   ├── amor.png           # Imagen de comandos de amor
│   └── rpg.png            # Imagen de RPG
└── Fotos_troll/           # Imágenes aleatorias (ya existente)
```

## 🎯 Comandos con Imágenes

### ✅ Ya implementados:

1. **Bienvenida** - Cuando alguien se une al grupo

   - Muestra imagen de bienvenida
   - Agrupa múltiples usuarios en un mensaje

2. **.menu** - Menú principal

   - Muestra imagen del menú
   - Lista todos los comandos

3. **.admin** - Panel de administrador
   - Muestra imagen del panel de admin
   - Lista comandos de administrador

### 📋 Próximos a implementar:

- `.economia` - Menú de economía con imagen
- `.amor` - Comandos de amor con imagen
- `.jugar` - Menú de juegos con imagen
- `.rpg` - Sistema RPG con imagen

## 🖼️ Imágenes Generadas

He creado 2 imágenes profesionales:

1. **bienvenida.png** - Banner de bienvenida colorido con robot
2. **menu.png** - Banner futurista para el menú de comandos

## 📝 Cómo Funciona

### Sistema Inteligente:

1. **Prioridad**: Busca primero en `imagenes_bot/`
2. **Fallback**: Si no encuentra, usa imágenes de `Fotos_troll/`
3. **Seguro**: Si no hay imagen, envía solo texto

### Ejemplo de Uso:

```javascript
import { getWelcomeImage, sendMessageWithImage } from "./utils/imageManager.js";

// Obtener imagen
const welcomeImage = getWelcomeImage();

// Enviar mensaje con imagen
await sendMessageWithImage(
  sock,
  chatId,
  "¡Bienvenido!",
  welcomeImage,
  mentions
);
```

## 🎨 Personalización

### Añadir tus propias imágenes:

1. Crea una imagen (recomendado 1920x1080 o 16:9)
2. Guárdala en `imagenes_bot/` con el nombre correspondiente:
   - `bienvenida.png` - Para bienvenidas
   - `menu.png` - Para el menú
   - `admin.png` - Para panel de admin
   - `economia.png` - Para economía
   - etc.

### Formatos soportados:

- ✅ PNG (recomendado)
- ✅ JPG/JPEG
- ✅ WebP

## 🔧 Funciones Disponibles

### En `utils/imageManager.js`:

```javascript
// Obtener imágenes específicas
getWelcomeImage(); // Imagen de bienvenida
getMenuImage(); // Imagen del menú
getAdminImage(); // Imagen de admin
getEconomyImage(); // Imagen de economía
getGamesImage(); // Imagen de juegos
getLoveImage(); // Imagen de amor
getRPGImage(); // Imagen de RPG

// Obtener imagen aleatoria
getRandomTrollImage(); // Imagen aleatoria de Fotos_troll/

// Enviar mensaje con imagen
sendMessageWithImage(sock, chatId, text, imagePath, mentions);
```

## 💡 Ventajas

✅ **Más atractivo** - Los mensajes son más visuales
✅ **Profesional** - Da una imagen más seria al bot
✅ **Personalizable** - Puedes usar tus propias imágenes
✅ **Seguro** - Funciona aunque no haya imágenes
✅ **Eficiente** - No afecta el rendimiento

## 🎯 Próximos Pasos

Para añadir imágenes a más comandos:

1. Genera o descarga la imagen que quieras
2. Guárdala en `imagenes_bot/` con el nombre apropiado
3. El bot automáticamente la usará

## 📊 Estado Actual

| Comando    | Imagen | Estado       |
| ---------- | ------ | ------------ |
| Bienvenida | ✅     | Implementado |
| .menu      | ✅     | Implementado |
| .admin     | ✅     | Implementado |
| .economia  | ⏳     | Pendiente    |
| .amor      | ⏳     | Pendiente    |
| .jugar     | ⏳     | Pendiente    |
| .rpg       | ⏳     | Pendiente    |

## 🚀 Uso

El sistema ya está activo. Solo necesitas:

1. **Reiniciar el bot**: `node index.js`
2. **Probar**: Únete a un grupo o usa `.menu`
3. **Personalizar**: Añade tus propias imágenes en `imagenes_bot/`

¡Disfruta de tu bot más visual! 🎉
