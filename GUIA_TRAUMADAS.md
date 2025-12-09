# 💔 Lista de Traumadas

## Descripción

Sistema dedicado para gestionar una lista de "traumadas" en el grupo. Permite añadir, quitar y mencionar a todas las traumadas con comandos específicos.

## Comandos Disponibles

### `.addtraumada` - Añadir a la Lista

Añade un usuario a la lista de traumadas.

**Uso:**

```
.addtraumada @usuario
```

**Ejemplo:**

```
.addtraumada @María
```

**Requisitos:**

- Solo administradores
- Solo en grupos
- Debes mencionar al usuario

---

### `.removetraumada` - Quitar de la Lista

Quita un usuario de la lista de traumadas.

**Uso:**

```
.removetraumada @usuario
```

**Ejemplo:**

```
.removetraumada @María
```

**Requisitos:**

- Solo administradores
- Solo en grupos
- Debes mencionar al usuario

---

### `.traumadas` - Mostrar Lista

Muestra la lista completa de traumadas y las menciona a todas.

**Uso:**

```
.traumadas
```

**Resultado:**

```
💔 LISTA DE TRAUMADAS 💔

━━━━━━━━━━━━━━━━━━━
1. @María
2. @Ana
3. @Laura
━━━━━━━━━━━━━━━━━━━

👥 Total: 3 traumada(s)
```

**Requisitos:**

- Cualquier usuario puede usar este comando
- Solo en grupos

---

## 📝 Ejemplo de Uso Completo

```
# Paso 1: Añadir traumadas
Admin: .addtraumada @María
Bot: ✅ Usuario @María añadido a la lista de traumadas

Admin: .addtraumada @Ana
Bot: ✅ Usuario @Ana añadido a la lista de traumadas

Admin: .addtraumada @Laura
Bot: ✅ Usuario @Laura añadido a la lista de traumadas

# Paso 2: Ver la lista
Usuario: .traumadas
Bot: 💔 LISTA DE TRAUMADAS 💔
     1. @María
     2. @Ana
     3. @Laura
     👥 Total: 3 traumada(s)

# Paso 3: Quitar de la lista
Admin: .removetraumada @Ana
Bot: ✅ Usuario @Ana eliminado de la lista de traumadas

# Paso 4: Verificar cambios
Usuario: .traumadas
Bot: 💔 LISTA DE TRAUMADAS 💔
     1. @María
     2. @Laura
     👥 Total: 2 traumada(s)
```

---

## ⚙️ Características

✅ **Lista dedicada** - Sistema específico para traumadas
✅ **Persistencia** - Se guarda en `traumadas.json`
✅ **Por grupo** - Cada grupo tiene su propia lista
✅ **Menciones masivas** - Menciona a todas con un comando
✅ **Gestión fácil** - Añade y quita usuarios fácilmente
✅ **Acceso público** - Cualquiera puede ver la lista

---

## 💾 Almacenamiento

La lista se guarda en `traumadas.json`:

```json
{
  "grupo_id@g.us": [
    "usuario1@s.whatsapp.net",
    "usuario2@s.whatsapp.net",
    "usuario3@s.whatsapp.net"
  ]
}
```

---

## 🔐 Permisos

### Solo Administradores:

- `.addtraumada` - Añadir a la lista
- `.removetraumada` - Quitar de la lista

### Cualquier Usuario:

- `.traumadas` - Ver y mencionar la lista

---

## 💡 Consejos

1. **Gestión responsable**: Usa este comando de forma respetuosa
2. **Actualización**: Mantén la lista actualizada
3. **Verificación**: Usa `.traumadas` para ver quién está en la lista
4. **Limpieza**: Quita usuarios que ya no deban estar

---

## 🆘 Solución de Problemas

### No puedo añadir usuarios

**Solución:** Verifica que seas administrador del grupo

### La lista no aparece

**Solución:** Asegúrate de haber añadido al menos un usuario primero

### Error al mencionar

**Solución:** Verifica que los usuarios mencionados sigan en el grupo

---

## 🎯 Diferencia con .addlist

**`.addlist`** - Sistema genérico para múltiples listas

- Puedes crear listas con cualquier nombre
- Ejemplo: `.addlist vips @usuario`

**`.addtraumada`** - Sistema dedicado solo para traumadas

- Lista específica y dedicada
- Comandos más simples y directos
- Ejemplo: `.addtraumada @usuario`

---

**¡Listo!** Ahora puedes gestionar la lista de traumadas en tu grupo 💔
