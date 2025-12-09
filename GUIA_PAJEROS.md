# 🔞 Sistema de Pajeros

## Descripción

Este sistema permite marcar a usuarios específicos para que el bot les responda automáticamente "pajero" cada vez que envíen un mensaje en el grupo.

## Comandos Disponibles

### `.pajero` - Marcar Usuario

Marca a un usuario como pajero. El bot le responderá automáticamente cada vez que escriba.

**Uso:**

```
.pajero @usuario
```

**Ejemplo:**

```
.pajero @Juan
```

**Requisitos:**

- Solo administradores
- Solo en grupos
- Debes mencionar al usuario

---

### `.unpajero` - Desmarcar Usuario

Quita la marca de pajero a un usuario. El bot dejará de responderle automáticamente.

**Uso:**

```
.unpajero @usuario
```

**Ejemplo:**

```
.unpajero @Juan
```

**Requisitos:**

- Solo administradores
- Solo en grupos
- Debes mencionar al usuario

---

### `.pajerolist` - Ver Lista

Muestra todos los usuarios marcados como pajeros en el grupo.

**Uso:**

```
.pajerolist
```

**Resultado:**

```
🔞 LISTA DE PAJEROS 🔞

━━━━━━━━━━━━━━━━━━━
1. @Juan
2. @Pedro
━━━━━━━━━━━━━━━━━━━

👥 Total: 2 pajero(s)
```

**Requisitos:**

- Cualquier usuario puede usar este comando
- Solo en grupos

---

## ⚙️ Funcionamiento

1. **Marcado:** Cuando un administrador usa `.pajero @usuario`, el usuario se añade a la lista `pajeros.json`.
2. **Respuesta Automática:** El bot verifica cada mensaje nuevo. Si el remitente está en la lista de pajeros del grupo, el bot responde inmediatamente con el mensaje "pajero" mencionando al usuario.
3. **Persistencia:** La lista se guarda en un archivo, por lo que se mantiene aunque el bot se reinicie.
4. **Desmarcado:** Usando `.unpajero @usuario`, se elimina al usuario de la lista y el bot deja de responderle.

---

## 📝 Ejemplo de Uso

```
# Paso 1: Marcar como pajero
Admin: .pajero @Juan
Bot: ✅ Usuario @Juan marcado como pajero.
     🤖 El bot le responderá "pajero" cada vez que escriba.

# Paso 2: El usuario escribe
Juan: Hola grupo
Bot: pajero @Juan

Juan: ¿Cómo están?
Bot: pajero @Juan

# Paso 3: Ver lista
Usuario: .pajerolist
Bot: 🔞 LISTA DE PAJEROS 🔞
     1. @Juan

# Paso 4: Desmarcar
Admin: .unpajero @Juan
Bot: ✅ Usuario @Juan desmarcado como pajero.
```

---

## ⚠️ Notas Importantes

- El bot responderá a **CADA** mensaje que envíe el usuario marcado.
- Úsalo con moderación para evitar spam excesivo en el grupo.
- Si el usuario también está muteado (`.mute`), el sistema de muteo tiene prioridad (el mensaje se borra y no se responde "pajero").

---

**¡Diviértete trolleando!** 🔞
