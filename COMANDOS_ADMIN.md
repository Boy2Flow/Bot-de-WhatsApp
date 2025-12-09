# 🛡️ Comandos de Administrador - Guía Completa

## 📋 Ver Todos los Comandos de Admin

```
$admin
```

Muestra el menú completo con todos los comandos de administrador disponibles.

---

## 👥 GESTIÓN DE MIEMBROS

### Expulsar Miembro

```
$kick @usuario
```

**Aliases:** `$expulsar`, `$ban`  
**Descripción:** Expulsa a un miembro del grupo.  
**Ejemplo:** `$kick @123456789`

### Añadir Miembro

```
$add [número]
```

**Aliases:** `$añadir`, `$agregar`  
**Descripción:** Añade un nuevo miembro al grupo.  
**Ejemplo:** `$add 34612345678`

### Promover a Administrador

```
$promote @usuario
```

**Aliases:** `$promover`, `$admin`  
**Descripción:** Convierte a un miembro en administrador.  
**Ejemplo:** `$promote @123456789`

### Quitar Administrador

```
$demote @usuario
```

**Aliases:** `$degradar`, `$removeadmin`  
**Descripción:** Quita los permisos de administrador a un usuario.

- 🔗 ID del grupo

### Lista de Administradores

```
$admins
```

**Aliases:** `$adminlist`, `$listadmin`  
**Descripción:** Muestra todos los administradores del grupo.  
**Nota:** Este comando puede ser usado por cualquier miembro.

**Muestra:**

- 👑 Super administradores
- 🛡️ Administradores normales
- Total de administradores

### Obtener Link del Grupo

```
$link
```

**Aliases:** `$linkgrupo`, `$grouplink`  
**Descripción:** Obtiene el enlace de invitación del grupo.

### Resetear Link del Grupo

```
$resetlink
```

**Aliases:** `$revokelink`, `$nuevolink`  
**Descripción:** Genera un nuevo enlace de invitación.  
**Nota:** El enlace anterior dejará de funcionar.

---

## 🎯 EJEMPLOS DE USO COMPLETO

### Escenario 1: Nuevo Administrador

```
1. $promote @usuario
2. $admins (verificar que se añadió)
```

### Escenario 2: Limpiar Grupo

```
1. $grupo cerrar (cerrar el grupo)
2. $kick @spammer (expulsar usuarios problemáticos)
3. $grupo abrir (abrir nuevamente)
```

### Escenario 3: Anuncio Importante

```
1. $hidetag ⚠️ IMPORTANTE: Leer el siguiente mensaje
2. (Enviar el mensaje importante)
```

### Escenario 4: Reorganizar Grupo

```
1. $nombre Grupo Actualizado 2024
2. $descripcion Nueva descripción del grupo
3. $resetlink (nuevo enlace de invitación)
4. $todos Se ha actualizado el grupo
```

---

## ⚠️ REQUISITOS

Para usar estos comandos necesitas:

1. ✅ Ser **administrador** del grupo
2. ✅ El **bot debe ser administrador** del grupo
3. ✅ Estar en un **grupo** (no funcionan en chats privados)

---

## 🔐 PERMISOS NECESARIOS

El bot necesita los siguientes permisos de administrador:

- ✅ Añadir/Eliminar participantes
- ✅ Cambiar información del grupo
- ✅ Enviar mensajes
- ✅ Eliminar mensajes

**Para dar permisos al bot:**

1. Abre la información del grupo
2. Toca en el bot
3. Selecciona "Convertir en administrador"

---

## 💡 CONSEJOS

1. **Usa $admin** para ver todos los comandos rápidamente
2. **$hidetag** es útil para notificaciones sin spam visual
3. **$delete** mantiene el grupo limpio de mensajes inapropiados
4. **$grupo cerrar** es útil durante anuncios importantes
5. **$resetlink** si el enlace del grupo se ha compartido públicamente

---

## 🆘 SOLUCIÓN DE PROBLEMAS

### "Error al ejecutar el comando"

- Verifica que el bot sea administrador
- Verifica que tú seas administrador

### "No se pudo eliminar el mensaje"

- Solo se pueden eliminar mensajes recientes
- El bot debe tener permisos de administrador

### "Error al añadir usuario"

- Verifica que el número sea correcto
- El usuario debe tener WhatsApp
- El usuario no debe haber bloqueado el bot

---

## 🔇 SISTEMA DE MUTEO

### Mutear Usuario

```
.mute @usuario
```

**Aliases:** `.silenciar`, `.mutear`  
**Descripción:** Silencia a un usuario. Todos sus mensajes serán eliminados automáticamente.  
**Ejemplo:** `.mute @123456789`

**Funcionamiento:**

- El usuario es añadido a la lista de muteados
- Todos sus mensajes son eliminados automáticamente
- El muteo es persistente (se mantiene aunque el bot se reinicie)
- Solo afecta al grupo donde se ejecutó el comando

### Desmutear Usuario

```
.unmute @usuario
```

**Aliases:** `.desmutear`, `.unmutear`  
**Descripción:** Quita el silencio a un usuario previamente muteado.  
**Ejemplo:** `.unmute @123456789`

### Lista de Muteados

```
.mutelist
```

**Aliases:** `.listamuteados`, `.mutedlist`  
**Descripción:** Muestra todos los usuarios muteados en el grupo.

**Muestra:**

- 🔇 Lista numerada de usuarios muteados
- 👥 Total de usuarios muteados

---

## 📝 NOTAS IMPORTANTES

- ⚠️ **Todos estos comandos son SOLO para administradores**
- ⚠️ El bot debe ser administrador para ejecutar la mayoría de comandos
- ⚠️ Algunos comandos borran automáticamente tu mensaje original
- ✅ Usa los comandos responsablemente
- ✅ El comando `$admins` puede ser usado por cualquier miembro
- 🔇 Los usuarios muteados no pueden enviar mensajes (se borran automáticamente)

---

**¿Necesitas ayuda?** Usa `$help` para ver la guía general o `$admin` para ver el menú de administrador.
