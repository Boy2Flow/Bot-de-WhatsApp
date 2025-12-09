# 🔇 Sistema de Muteo

## Descripción

El sistema de muteo permite a los administradores silenciar usuarios en grupos de WhatsApp. Cuando un usuario está muteado, todos sus mensajes son eliminados automáticamente por el bot.

## Comandos Disponibles

### `.mute` - Mutear Usuario

Silencia a un usuario mencionado. Todos sus mensajes serán eliminados automáticamente.

**Uso:**

```
.mute @usuario
```

**Aliases:**

- `.silenciar`
- `.mutear`

**Requisitos:**

- Solo administradores
- Solo en grupos
- Debes mencionar al usuario

**Ejemplo:**

```
.mute @Juan
```

---

### `.unmute` - Desmutear Usuario

Quita el silencio a un usuario previamente muteado.

**Uso:**

```
.unmute @usuario
```

**Aliases:**

- `.desmutear`
- `.unmutear`

**Requisitos:**

- Solo administradores
- Solo en grupos
- Debes mencionar al usuario

**Ejemplo:**

```
.unmute @Juan
```

---

### `.mutelist` - Lista de Muteados

Muestra todos los usuarios que están actualmente muteados en el grupo.

**Uso:**

```
.mutelist
```

**Aliases:**

- `.listamuteados`
- `.mutedlist`

**Requisitos:**

- Solo administradores
- Solo en grupos

---

## Funcionamiento

1. **Mutear un usuario:**

   - Un administrador usa `.mute @usuario`
   - El usuario es añadido a la lista de muteados del grupo
   - El bot confirma el muteo

2. **Eliminación automática:**

   - Cada vez que el usuario muteado envía un mensaje
   - El bot lo detecta automáticamente
   - El mensaje es eliminado inmediatamente
   - Se registra en los logs del bot

3. **Desmutear un usuario:**
   - Un administrador usa `.unmute @usuario`
   - El usuario es removido de la lista de muteados
   - El usuario puede volver a enviar mensajes normalmente

## Almacenamiento

Los usuarios muteados se guardan en el archivo `mutedUsers.json` con la siguiente estructura:

```json
{
  "grupo_id@g.us": ["usuario1@s.whatsapp.net", "usuario2@s.whatsapp.net"]
}
```

- Cada grupo tiene su propia lista de usuarios muteados
- Los muteos son persistentes (se mantienen aunque el bot se reinicie)
- El archivo se crea automáticamente si no existe

## Permisos

- ✅ Solo administradores pueden usar estos comandos
- ✅ Solo funciona en grupos
- ✅ Los usuarios muteados pueden ser cualquier miembro del grupo
- ⚠️ No se puede mutear a administradores del bot (opcional, puedes implementarlo)

## Notas Importantes

1. **Persistencia:** Los muteos se mantienen incluso si el bot se reinicia
2. **Por grupo:** Cada grupo tiene su propia lista de muteados independiente
3. **Logs:** Cada mensaje eliminado se registra en los logs del bot
4. **Rendimiento:** El sistema verifica cada mensaje antes de procesarlo
5. **Privacidad:** El archivo `mutedUsers.json` está en `.gitignore`

## Solución de Problemas

### El bot no elimina los mensajes

- Verifica que el bot sea administrador del grupo
- Asegúrate de que el usuario esté correctamente muteado (usa `.mutelist`)

### Error al mutear

- Verifica que mencionaste correctamente al usuario
- Asegúrate de ser administrador del grupo

### Los muteos no se guardan

- Verifica los permisos de escritura en el directorio del bot
- Revisa los logs del bot para ver errores

## Integración con otros comandos

El sistema de muteo está integrado en el `messageHandler.js` y se ejecuta **antes** de procesar cualquier comando, asegurando que los usuarios muteados no puedan usar ningún comando del bot.
