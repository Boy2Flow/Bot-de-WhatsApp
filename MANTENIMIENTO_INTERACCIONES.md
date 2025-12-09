# 🔧 Sistema de Mantenimiento y Comandos de Interacción

## 🔧 MODO MANTENIMIENTO

### Activar Mantenimiento

```bash
.mantenimiento on
.mantenimiento on El bot estará en mantenimiento hasta mañana
```

### Desactivar Mantenimiento

```bash
.mantenimiento off
```

### Ver Estado

### ❤️ Interacciones Normales

#### Kiss (Besar)

```bash
.kiss @usuario
```

**Resultado:** "@usuario1 le dio un beso a @usuario2 😘"

#### Hug (Abrazar)

```bash
.hug @usuario
```

**Resultado:** "@usuario1 abrazó a @usuario2 ❤️"

#### Pat (Acariciar)

```bash
.pat @usuario
```

**Resultado:** "@usuario1 acarició la cabeza de @usuario2 🥰"

#### Slap (Cachetada)

```bash
.slap @usuario
```

**Resultado:** "@usuario1 le dio una cachetada a @usuario2 💥"

---

### 🔞 Interacciones NSFW

#### Fuck (Follar)

```bash
.fuck @usuario
```

**Resultado:** "🔞 @usuario1 se está follando a @usuario2 🔥"

#### Spank (Nalgada)

```bash
.spank @usuario
```

**Resultado:** "🔞 @usuario1 le dio una nalgada a @usuario2 🍑"

#### Lick (Lamer)

```bash
.lick @usuario
```

**Resultado:** "🔞 @usuario1 está lamiendo a @usuario2 👅"

#### Bite (Morder)

```bash
.bite @usuario
```

**Resultado:** "🔞 @usuario1 mordió a @usuario2 😈"

---

## 📋 Ver Todas las Interacciones

```bash
.interacciones
```

Muestra un menú completo con todas las interacciones disponibles.

---

## 🎯 EJEMPLOS DE USO

### Escenario 1: Poner el bot en mantenimiento

```bash
# Activar mantenimiento
.mantenimiento on Actualizando el bot, vuelvo en 10 minutos

# Los usuarios verán:
🔧 MODO MANTENIMIENTO
Actualizando el bot, vuelvo en 10 minutos

# Desactivar cuando termines
.mantenimiento off
```

### Escenario 2: Interacciones en grupo

```bash
# Besar a alguien
.kiss @Juan

# Resultado en el grupo:
💋 María le dio un beso a Juan 😘

# Interacción NSFW
.fuck @Pedro

# Resultado:
🔞 Carlos se está follando a Pedro 🔥
```

---

## ⚙️ CARACTERÍSTICAS TÉCNICAS

### Sistema de Mantenimiento

- **Variable global:** Controla el estado del mantenimiento
- **Verificación automática:** Cada comando verifica el estado antes de ejecutarse
- **Excepción:** El comando de mantenimiento siempre funciona
- **Seguridad:** Solo el dueño del bot (número vinculado) puede activarlo

### Comandos de Interacción

- **Menciones:** Usa el sistema de menciones de WhatsApp
- **Flexible:** Funciona en grupos y chats privados
- **Emojis:** Cada acción tiene emojis apropiados
- **Aliases:** Múltiples formas de llamar cada comando

---

## 📝 NOTAS IMPORTANTES

1. **Mantenimiento:**

   - El bot seguirá conectado pero no responderá comandos
   - Útil para actualizaciones o mantenimiento
   - El mensaje es personalizable

2. **Interacciones:**

   - Requieren mencionar a un usuario
   - Funcionan en cualquier chat
   - Son solo texto (los GIFs se pueden agregar después)

3. **GIFs (Opcional):**
   - Los URLs de GIFs están en el código pero comentados
   - Puedes agregar tus propios GIFs de Tenor
   - Requiere descargar y enviar como video/sticker

---

## 🎨 PERSONALIZACIÓN

### Cambiar Mensajes de Interacción

Edita el archivo `commands/interactions.js`:

```javascript
// Ejemplo: Cambiar el mensaje de kiss
const text = `💋 *@${sender.split("@")[0]}* besó apasionadamente a *@${
  target.split("@")[0]
}* 😘`;
```

### Agregar Nuevas Interacciones

1. Copia un comando existente
2. Cambia el nombre y aliases
3. Personaliza el mensaje
4. Agrégalo al array `interactionCommands`

### Los comandos NSFW no aparecen

- Verifica que estén importados en `index.js`
- Reinicia el bot con `npm start`

---

## 📊 RESUMEN

**Comandos de Mantenimiento:** 1  
**Comandos de Interacción:** 8  
**Interacciones Normales:** 4  
**Interacciones NSFW:** 4

**Total de nuevos comandos:** 9

---

**¡Usa estos comandos responsablemente y diviértete! 🎉**
