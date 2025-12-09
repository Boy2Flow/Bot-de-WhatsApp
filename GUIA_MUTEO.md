# 🚀 Guía Rápida - Comandos de Muteo

## Uso Básico

### 1️⃣ Mutear un usuario

Para silenciar a un usuario y que el bot borre automáticamente todos sus mensajes:

```
.mute @usuario
```

**Ejemplo en WhatsApp:**

1. Escribe `.mute` en el grupo
2. Menciona al usuario que quieres mutear (usando @)
3. Envía el mensaje
4. ✅ El bot confirmará que el usuario ha sido muteado

---

### 2️⃣ Ver quién está muteado

Para ver la lista de usuarios muteados en el grupo:

```
.mutelist
```

El bot mostrará:

- Lista de todos los usuarios muteados
- Total de usuarios muteados

---

### 3️⃣ Desmutear un usuario

Para quitar el silencio a un usuario:

```
.unmute @usuario
```

**Ejemplo en WhatsApp:**

1. Escribe `.unmute` en el grupo
2. Menciona al usuario que quieres desmutear (usando @)
3. Envía el mensaje
4. ✅ El usuario podrá enviar mensajes nuevamente

---

## 📱 Ejemplo Práctico

**Situación:** Un usuario está enviando spam en el grupo

**Solución:**

```
1. .mute @spammer
   → El bot confirma el muteo

2. El usuario intenta enviar mensajes
   → El bot los elimina automáticamente

3. Cuando el usuario se calme:
   .unmute @spammer
   → El usuario puede volver a participar
```

---

## ⚡ Comandos Alternativos

Puedes usar estos aliases:

**Para mutear:**

- `.mute @usuario`
- `.silenciar @usuario`
- `.mutear @usuario`

**Para desmutear:**

- `.unmute @usuario`
- `.desmutear @usuario`
- `.unmutear @usuario`

**Para ver la lista:**

- `.mutelist`
- `.listamuteados`
- `.mutedlist`

---

## ⚠️ Importante

✅ **Solo administradores** pueden usar estos comandos
✅ **El bot debe ser administrador** del grupo
✅ Los muteos son **persistentes** (se mantienen aunque el bot se reinicie)
✅ Cada grupo tiene su **propia lista** de muteados
✅ Los mensajes se eliminan **instantáneamente**

---

## 🔍 Verificación

Para verificar que el sistema funciona:

1. Mutea a un usuario de prueba: `.mute @usuario`
2. Pide al usuario que envíe un mensaje
3. El bot debe eliminar el mensaje automáticamente
4. Verifica la lista: `.mutelist`
5. Desmutea al usuario: `.unmute @usuario`

---

**¡Listo!** Ahora puedes mantener tu grupo limpio y ordenado 🎉
