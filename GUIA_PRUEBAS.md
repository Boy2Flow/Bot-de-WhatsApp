# 🚀 Guía de Prueba del Bot

## ✅ Cambios Realizados

### 1. Sistema de Muteo Implementado

- ✅ Comando `.mute @usuario` - Silenciar usuarios
- ✅ Comando `.unmute @usuario` - Desmutear usuarios
- ✅ Comando `.mutelist` - Ver lista de muteados
- ✅ Eliminación automática de mensajes de usuarios muteados
- ✅ Base de datos persistente en `mutedUsers.json`

### 2. Sistema de Advertencias Implementado

- ✅ Comando `.warn @usuario [razón]` - Advertir usuarios
- ✅ Comando `.warns @usuario` - Ver advertencias
- ✅ Comando `.unwarn @usuario` - Quitar advertencia
- ✅ Comando `.warnlist` - Lista de usuarios con advertencias
- ✅ Expulsión automática a las 3 advertencias
- ✅ Base de datos persistente en `warns.json`

### 3. Comando de Limpieza Creado

- ✅ Comando `.limpiar [cantidad]` - Con explicación de limitaciones
- ⚠️ Nota: WhatsApp no permite borrar mensajes históricos masivamente

### 4. Errores Corregidos

- ✅ Template strings en `adminCommands.js` (`.{}` → `${}`)
- ✅ Prefijo de comando en `games.js` (`$ppt` → `.ppt`)
- ✅ Todos los comandos ahora usan el prefijo `.` correctamente

---

## 🧪 Cómo Probar el Bot

### Paso 1: Reiniciar el Bot

```powershell
# Detener el bot si está corriendo (Ctrl+C)

# Iniciar el bot
npm start
```

### Paso 2: Escanear el Código QR

1. Abre WhatsApp en tu teléfono
2. Ve a **Dispositivos vinculados**
3. Escanea el código QR que aparece en la terminal

### Paso 3: Configurar un Grupo de Prueba

1. Crea un grupo de prueba o usa uno existente
2. Añade el bot al grupo
3. **IMPORTANTE:** Haz al bot administrador del grupo
   - Toca en el nombre del grupo
   - Toca en el bot
   - Selecciona "Convertir en administrador"

---

## 🧪 Pruebas Recomendadas

### Prueba 1: Sistema de Muteo

```
1. En el grupo, escribe: .mute @usuario
   → El bot debe confirmar el muteo

2. Pide al usuario muteado que envíe un mensaje
   → El bot debe eliminar el mensaje automáticamente

3. Verifica la lista: .mutelist
   → Debe mostrar al usuario muteado

4. Desmutea al usuario: .unmute @usuario
   → El bot debe confirmar el desmuteo

5. El usuario debe poder enviar mensajes normalmente
```

### Prueba 2: Sistema de Advertencias

```
1. Advierte a un usuario: .warn @usuario Spam
   → Debe mostrar "Advertencia 1/3"

2. Advierte nuevamente: .warn @usuario Lenguaje inapropiado
   → Debe mostrar "Advertencia 2/3"

3. Verifica advertencias: .warns @usuario
   → Debe mostrar las 2 advertencias con fechas

4. Tercera advertencia: .warn @usuario Última advertencia
   → El usuario debe ser expulsado automáticamente

5. Verifica la lista: .warnlist
   → No debe aparecer el usuario expulsado
```

### Prueba 3: Comandos de Administración

```
1. Ver menú: .admin
   → Debe mostrar todos los comandos de admin

2. Info del grupo: .infogrupo
   → Debe mostrar nombre, descripción, miembros, etc.

3. Lista de admins: .admins
   → Debe mostrar todos los administradores

4. Link del grupo: .link
   → Debe generar el enlace de invitación

5. Mencionar a todos: .tag Prueba
   → Debe mencionar a todos los miembros
```

### Prueba 4: Comandos de Juegos

```
1. Piedra, papel o tijera: .ppt piedra
   → Debe jugar contra el bot

2. Adivina el número: .adivina 5
   → Debe decir si acertaste o no

3. Trivia: .trivia
   → Debe mostrar una pregunta
   → Responde: .trivia B

4. Dado: .dado
   → Debe lanzar un dado

5. Moneda: .moneda
   → Debe lanzar una moneda
```

### Prueba 5: Comandos de Interacción

```
1. Ver menú: .interacciones
   → Debe mostrar todos los comandos

2. Probar interacciones:
   .hug @usuario
   .kiss @usuario
   .slap @usuario
   → Debe enviar mensajes de interacción
```

---

## 🐛 Solución de Problemas

### El bot no elimina mensajes de usuarios muteados

**Causa:** El bot no es administrador
**Solución:** Haz al bot administrador del grupo

### El comando .warn no expulsa al usuario

**Causa:** El bot no es administrador
**Solución:** Haz al bot administrador del grupo

### Los comandos no responden

**Causa:** Prefijo incorrecto o comando mal escrito
**Solución:** Verifica que uses el prefijo `.` (punto)

### Error al iniciar el bot

**Causa:** Dependencias no instaladas
**Solución:**

```powershell
npm install
```

### El bot se desconecta constantemente

**Causa:** Problemas de conexión
**Solución:** Verifica tu conexión a internet y reinicia el bot

---

## 📊 Verificación de Archivos

Asegúrate de que estos archivos existan:

```
✅ commands/muteCommand.js
✅ commands/warnCommand.js
✅ commands/cleanCommand.js
✅ commands/adminCommands.js (modificado)
✅ commands/games.js (modificado)
✅ commands/index.js (modificado)
✅ handlers/messageHandler.js (modificado)
```

Los siguientes archivos se crearán automáticamente:

```
📝 mutedUsers.json (al usar .mute)
📝 warns.json (al usar .warn)
```

---

## 📝 Comandos Rápidos de Prueba

Copia y pega estos comandos en el grupo para probar:

```
# Menús
.menu
.admin
.interacciones

# Administración
.infogrupo
.admins
.link

# Muteo (menciona a alguien)
.mute @usuario
.mutelist
.unmute @usuario

# Advertencias (menciona a alguien)
.warn @usuario Prueba
.warns @usuario
.warnlist
.unwarn @usuario

# Juegos
.ppt piedra
.adivina 7
.trivia
.dado
.moneda

# Interacciones (menciona a alguien)
.hug @usuario
.kiss @usuario
```

---

## ✅ Checklist de Verificación

Antes de usar el bot en producción:

- [ ] El bot se conecta correctamente
- [ ] El bot es administrador del grupo
- [ ] El comando `.mute` funciona
- [ ] Los mensajes de usuarios muteados se eliminan
- [ ] El comando `.warn` funciona
- [ ] La expulsión automática a las 3 advertencias funciona
- [ ] Todos los comandos de admin funcionan
- [ ] Los juegos funcionan correctamente
- [ ] Las interacciones funcionan correctamente
- [ ] Los archivos JSON se crean automáticamente

---

## 🎉 ¡Listo!

Si todas las pruebas pasan, tu bot está completamente funcional y listo para usar.

**Documentación adicional:**

- `RESUMEN_COMANDOS.md` - Lista completa de comandos
- `SISTEMA_MUTEO.md` - Documentación técnica del muteo
- `GUIA_MUTEO.md` - Guía rápida de uso del muteo
- `COMANDOS_ADMIN.md` - Guía de comandos de administrador

---

**¿Problemas?** Revisa los logs del bot en la terminal para ver mensajes de error detallados.
