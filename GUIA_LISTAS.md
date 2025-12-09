# 📋 Sistema de Listas Personalizadas

## Descripción

El sistema de listas personalizadas te permite crear grupos de usuarios con nombres personalizados y mencionarlos todos juntos cuando quieras.

## Comandos Disponibles

### `.addlist` - Añadir Usuario a Lista

Añade un usuario a una lista personalizada. Si la lista no existe, se crea automáticamente.

**Uso:**

```
.addlist [nombre] @usuario
```

**Ejemplos:**

```
.addlist maricones @Juan
.addlist vips @Pedro
.addlist moderadores @Ana
```

**Requisitos:**

- Solo administradores
- Solo en grupos
- Debes mencionar al usuario

---

### `.removelist` - Quitar Usuario de Lista

Quita un usuario de una lista personalizada.

**Uso:**

```
.removelist [nombre] @usuario
```

**Ejemplo:**

```
.removelist maricones @Juan
```

**Requisitos:**

- Solo administradores
- Solo en grupos
- Debes mencionar al usuario

---

### `.showlist` - Mostrar y Mencionar Lista

Muestra todos los usuarios de una lista y los menciona.

**Uso:**

```
.showlist [nombre]
```

**Ejemplo:**

```
.showlist maricones
```

**Resultado:**

```
📋 LISTA DE MARICONES

━━━━━━━━━━━━━━━━━━━
1. @Juan
2. @Pedro
3. @Carlos
━━━━━━━━━━━━━━━━━━━

👥 Total: 3 usuario(s)
```

**Requisitos:**

- Cualquier usuario puede usar este comando
- Solo en grupos

---

### `.lists` - Ver Todas las Listas

Muestra todas las listas creadas en el grupo.

**Uso:**

```
.lists
```

**Resultado:**

```
📋 LISTAS DEL GRUPO

━━━━━━━━━━━━━━━━━━━

1. maricones
   👥 3 usuario(s)

2. vips
   👥 5 usuario(s)

3. moderadores
   👥 2 usuario(s)

━━━━━━━━━━━━━━━━━━━

📊 Total: 3 lista(s)

💡 Usa .showlist [nombre] para ver una lista
```

**Requisitos:**

- Cualquier usuario puede usar este comando
- Solo en grupos

---

### `.deletelist` - Eliminar Lista Completa

Elimina una lista completa con todos sus usuarios.

**Uso:**

```
.deletelist [nombre]
```

**Ejemplo:**

```
.deletelist maricones
```

**Requisitos:**

- Solo administradores
- Solo en grupos

---

## 📝 Ejemplos de Uso Completo

### Crear y Usar una Lista

```
1. Crear la lista añadiendo usuarios:
   .addlist maricones @Juan
   .addlist maricones @Pedro
   .addlist maricones @Carlos

2. Ver la lista:
   .showlist maricones

3. Añadir más usuarios:
   .addlist maricones @Luis

4. Quitar un usuario:
   .removelist maricones @Pedro

5. Ver todas las listas:
   .lists

6. Eliminar la lista completa:
   .deletelist maricones
```

### Múltiples Listas

```
# Crear lista de VIPs
.addlist vips @Admin1
.addlist vips @Admin2

# Crear lista de moderadores
.addlist moderadores @Mod1
.addlist moderadores @Mod2

# Crear lista personalizada
.addlist amigos @Amigo1
.addlist amigos @Amigo2

# Ver todas las listas
.lists

# Mencionar a los VIPs
.showlist vips
```

---

## 🎯 Casos de Uso

### 1. Lista de Moderadores

```
.addlist moderadores @Juan
.addlist moderadores @Ana
.showlist moderadores
```

### 2. Lista de Usuarios Problemáticos

```
.addlist problematicos @Spammer1
.addlist problematicos @Troll1
.showlist problematicos
```

### 3. Lista de Miembros Destacados

```
.addlist destacados @MejorMiembro
.addlist destacados @Colaborador
.showlist destacados
```

### 4. Cualquier Lista Personalizada

```
.addlist [nombre-que-quieras] @usuario
.showlist [nombre-que-quieras]
```

---

## 💾 Almacenamiento

Las listas se guardan en el archivo `customLists.json` con la siguiente estructura:

```json
{
  "grupo_id@g.us": {
    "maricones": ["usuario1@s.whatsapp.net", "usuario2@s.whatsapp.net"],
    "vips": ["usuario3@s.whatsapp.net"]
  }
}
```

- Cada grupo tiene sus propias listas independientes
- Las listas son persistentes (se mantienen aunque el bot se reinicie)
- El archivo se crea automáticamente si no existe

---

## ⚙️ Características

✅ **Listas ilimitadas** - Crea tantas listas como necesites
✅ **Nombres personalizados** - Usa cualquier nombre para tus listas
✅ **Persistencia** - Las listas se guardan automáticamente
✅ **Por grupo** - Cada grupo tiene sus propias listas
✅ **Menciones masivas** - Menciona a todos los usuarios de una lista
✅ **Gestión fácil** - Añade y quita usuarios fácilmente

---

## 🔐 Permisos

### Comandos de Administrador:

- `.addlist` - Solo administradores
- `.removelist` - Solo administradores
- `.deletelist` - Solo administradores

### Comandos Públicos:

- `.showlist` - Cualquier usuario
- `.lists` - Cualquier usuario

---

## 💡 Consejos

1. **Nombres descriptivos**: Usa nombres claros para tus listas
2. **Organización**: Crea listas para diferentes propósitos
3. **Limpieza**: Elimina listas que ya no uses con `.deletelist`
4. **Verificación**: Usa `.lists` para ver todas las listas activas
5. **Actualización**: Mantén las listas actualizadas quitando usuarios inactivos

---

## 🆘 Solución de Problemas

### No puedo añadir usuarios

- Verifica que seas administrador del grupo
- Asegúrate de mencionar correctamente al usuario

### La lista no aparece

- Verifica que escribiste correctamente el nombre
- Usa `.lists` para ver todas las listas disponibles

### Error al mostrar la lista

- Verifica que la lista tenga al menos un usuario
- Asegúrate de escribir correctamente el nombre

---

## 🎉 Ejemplo Completo

```
# Paso 1: Crear la lista
Admin: .addlist maricones @Juan
Bot: ✅ Usuario @Juan añadido a la lista "maricones"

# Paso 2: Añadir más usuarios
Admin: .addlist maricones @Pedro
Bot: ✅ Usuario @Pedro añadido a la lista "maricones"

Admin: .addlist maricones @Carlos
Bot: ✅ Usuario @Carlos añadido a la lista "maricones"

# Paso 3: Ver la lista
Usuario: .showlist maricones
Bot: 📋 LISTA DE MARICONES
     1. @Juan
     2. @Pedro
     3. @Carlos
     👥 Total: 3 usuario(s)

# Paso 4: Gestionar la lista
Admin: .removelist maricones @Pedro
Bot: ✅ Usuario @Pedro eliminado de la lista "maricones"

# Paso 5: Ver todas las listas
Usuario: .lists
Bot: 📋 LISTAS DEL GRUPO
     1. maricones (2 usuarios)
```

---

**¡Listo!** Ahora puedes crear y gestionar listas personalizadas en tus grupos 🎉
