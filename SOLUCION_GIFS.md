# 🔧 SOLUCIÓN: GIFs no se cargan

## ❌ Problema

Los GIFs de interacciones no se están mostrando, solo aparece el texto.

## 🔍 Diagnóstico

He añadido logs de depuración para identificar el problema. Ahora cuando uses un comando de interacción, verás en la consola:

```
🔍 Buscando GIFs en: C:\...\interactions\kiss
📁 Archivos encontrados en kiss: [ 'kiss.gif' ]
✅ Seleccionado: kiss.gif
📎 Enviando media: kiss.gif (2.82 MB)
🎞️ Enviando GIF como video...
```

## 🛠️ Posibles Causas y Soluciones

### 1. ⚠️ GIF muy pesado (> 16 MB)

WhatsApp tiene un límite de **16 MB** por archivo.

**Solución:**

1. Abre https://ezgif.com/optimize
2. Sube el GIF
3. Reduce calidad/tamaño
4. Descarga el GIF optimizado
5. Reemplaza el archivo en `interactions/[tipo]/`

### 2. ⚠️ Formato incorrecto

Algunos GIFs pueden tener problemas de codificación.

**Solución:**

1. Abre https://ezgif.com/
2. Sube el GIF
3. Haz clic en "Optimize" o "Convert to MP4"
4. Descarga el archivo optimizado
5. Reemplaza el original

### 3. ⚠️ Permisos de archivo

El bot no puede leer el archivo.

**Solución:**

```powershell
# Verificar que el archivo existe
Test-Path "interactions/kiss/kiss.gif"

# Debería devolver: True
```

### 4. ⚠️ Ruta incorrecta

La carpeta o archivo no están en el lugar correcto.

**Solución:**
Verifica la estructura:

```
interactions/
├── kiss/
│   └── kiss.gif  ✅
├── hug/
│   └── hug.gif   ✅
└── slap/
    └── slap.gif  ✅
```

## 🎯 Pasos para Resolver

### Paso 1: Reiniciar el bot con logs

```powershell
node index.js
```

### Paso 2: Probar un comando

```
.kiss @alguien
```

### Paso 3: Revisar la consola

Busca estos mensajes:

**✅ Si funciona correctamente:**

```
🔍 Buscando GIFs en: C:\...\interactions\kiss
📁 Archivos encontrados en kiss: [ 'kiss.gif' ]
✅ Seleccionado: kiss.gif
📎 Enviando media: kiss.gif (2.82 MB)
🎞️ Enviando GIF como video...
```

**❌ Si hay error:**

```
⚠️ Carpeta no existe: kiss
```

→ La carpeta no existe, créala

```
⚠️ No hay archivos en carpeta kiss
```

→ La carpeta está vacía, añade GIFs

```
❌ Error enviando mensaje con media: ...
```

→ Hay un problema con el archivo

### Paso 4: Optimizar GIFs pesados

Si el GIF es > 5 MB:

1. **Opción A: Optimizar online**

   - https://ezgif.com/optimize
   - Sube el GIF
   - Reduce a 480p o 360p
   - Descarga optimizado

2. **Opción B: Convertir a MP4**
   - https://ezgif.com/gif-to-mp4
   - Sube el GIF
   - Convierte a MP4
   - Guarda como `.mp4` en la carpeta

## 📊 Tamaños Recomendados

| Calidad | Resolución | Tamaño | Uso         |
| ------- | ---------- | ------ | ----------- |
| Alta    | 720p       | 3-5 MB | Recomendado |
| Media   | 480p       | 1-3 MB | Óptimo      |
| Baja    | 360p       | < 1 MB | Rápido      |

## 🔄 Alternativa: Usar MP4

Los MP4 son más eficientes que GIF:

1. Convierte tus GIFs a MP4:

   - https://ezgif.com/gif-to-mp4

2. Guarda los MP4 en las carpetas:

   ```
   interactions/kiss/kiss.mp4
   ```

3. El bot los detectará automáticamente

## 💡 Recomendaciones

### Para mejores resultados:

- ✅ **Tamaño**: < 5 MB
- ✅ **Resolución**: 480p - 720p
- ✅ **Duración**: 2-5 segundos
- ✅ **FPS**: 15-30
- ✅ **Formato**: GIF o MP4

### Herramientas útiles:

- **EZGif**: https://ezgif.com/
  - Optimizar, redimensionar, convertir
- **CloudConvert**: https://cloudconvert.com/
  - Conversión de formatos
- **Giphy**: https://giphy.com/
  - Descargar GIFs optimizados

## 🚨 Si Nada Funciona

### Opción 1: Usar solo imágenes estáticas

Reemplaza los GIFs por imágenes PNG/JPG:

```
interactions/kiss/kiss.png
```

### Opción 2: Descargar GIFs más ligeros

Busca GIFs más pequeños:

- Tenor: https://tenor.com/ (opción "SD" o "MD")
- Giphy: https://giphy.com/ (opción "Small")

### Opción 3: Deshabilitar imágenes

Vacía las carpetas de interactions/ y el bot enviará solo texto.

## 📝 Ejemplo de Optimización

### Antes:

```
kiss.gif - 2.8 MB - 720p - 30 FPS
```

### Después:

```
kiss.gif - 1.2 MB - 480p - 20 FPS
```

**Cómo:**

1. Abre https://ezgif.com/optimize
2. Sube kiss.gif
3. Configuración:
   - Compression level: 35
   - Resize: 480p
   - Optimize: Yes
4. Descarga y reemplaza

## ✅ Verificación Final

Después de optimizar:

1. Reinicia el bot
2. Prueba el comando
3. Verifica los logs
4. Confirma que se envía el GIF

## 🎉 ¡Listo!

Con los logs ahora podrás ver exactamente qué está pasando y solucionar el problema.

**Comparte los logs de la consola si sigues teniendo problemas.**
