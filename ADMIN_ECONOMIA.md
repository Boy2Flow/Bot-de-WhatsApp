# 🛡️ COMANDOS DE ADMIN - ECONOMÍA

## Fecha: 2025-11-28

### 📋 Descripción

Comandos exclusivos para administradores del grupo que permiten gestionar la economía de los usuarios.

---

## 🔐 Requisitos

- ⚠️ **Solo Administradores** del grupo pueden usar estos comandos
- 📱 Deben usarse en **grupos** (no funcionan en chats privados)
- 👤 Requieren mencionar al usuario objetivo con `@`

---

## 💰 Comandos Disponibles

### **1. Dar Dinero**

```
.addmoney [cantidad] @usuario
.dardinero [cantidad] @usuario
.givemoney [cantidad] @usuario
```

**Descripción:**

- Añade dinero a la cartera del usuario mencionado
- El dinero se suma al balance actual

**Ejemplos:**

```
.addmoney 5000 @usuario
.dardinero 10000 @usuario
```

**Resultado:**

```
✅ DINERO AÑADIDO

💰 Cantidad: 5,000 S Coins 🪙
👤 Usuario: @usuario

👛 Nueva cartera: 15,000 S Coins 🪙
```

---

### **2. Quitar Dinero**

```
.removemoney [cantidad] @usuario
.quitardinero [cantidad] @usuario
.takemoney [cantidad] @usuario
```

**Descripción:**

- Quita dinero de la cartera del usuario
- El balance no puede ser negativo (mínimo 0)

**Ejemplos:**

```
.removemoney 1000 @usuario
.quitardinero 500 @usuario
```

**Resultado:**

```
✅ DINERO REMOVIDO

💸 Cantidad: 1,000 S Coins 🪙
👤 Usuario: @usuario

👛 Nueva cartera: 4,000 S Coins 🪙
```

---

### **3. Establecer Balance**

```
.setmoney [cantidad] @usuario
.establecerdinero [cantidad] @usuario
.setbal [cantidad] @usuario
```

**Descripción:**

- Establece el balance exacto de la cartera
- Reemplaza el balance actual por la cantidad especificada
- No afecta el banco

**Ejemplos:**

```
.setmoney 10000 @usuario
.setbal 0 @usuario
```

**Resultado:**

```
✅ DINERO ESTABLECIDO

👤 Usuario: @usuario
👛 Cartera: 10,000 S Coins 🪙
🏦 Banco: 5,000 S Coins 🪙
```

---

### **4. Ver Balance de Usuario**

```
.checkbal @usuario
.verbalance @usuario
.checkbalance @usuario
```

**Descripción:**

- Muestra el balance completo de cualquier usuario
- Incluye cartera, banco, total e inventario
- Útil para auditorías

**Ejemplos:**

```
.checkbal @usuario
.verbalance @usuario
```

**Resultado:**

```
🔍 BALANCE DE USUARIO

👤 Usuario: @usuario

👛 Cartera: 5,000 S Coins 🪙
🏦 Banco: 15,000 S Coins 🪙
━━━━━━━━━━━━━━━━━━
💎 Total: 20,000 S Coins 🪙

🎒 Items: 🛡️ ⛏️ 💍
```

---

### **5. Resetear Economía**

```
.reseteco @usuario
.reseteconomia @usuario
.resetuser @usuario
```

**Descripción:**

- Resetea **completamente** la economía del usuario
- Pone cartera y banco a 0
- Elimina todo el inventario
- Resetea todos los cooldowns

**⚠️ ADVERTENCIA:** Esta acción es irreversible

**Ejemplos:**

```
.reseteco @usuario
.reseteconomia @usuario
```

**Resultado:**

```
🔄 ECONOMÍA RESETEADA

👤 Usuario: @usuario

✅ Balance, banco e inventario reseteados a 0
```

---

## 📊 Casos de Uso

### **Caso 1: Recompensar Evento**

```
Organizaste un evento y quieres premiar al ganador:
.addmoney 10000 @ganador
```

### **Caso 2: Penalizar Trampa**

```
Detectaste que alguien hizo trampa:
.removemoney 5000 @tramposo
O más severo:
.reseteco @tramposo
```

### **Caso 3: Corregir Error**

```
Alguien reportó un bug que le dio dinero extra:
.setmoney 5000 @usuario
(Establece el balance correcto)
```

### **Caso 4: Auditoría**

```
Quieres verificar si alguien tiene mucho dinero:
.checkbal @sospechoso
```

### **Caso 5: Nuevo Inicio**

```
Un usuario quiere empezar de cero:
.reseteco @usuario
```

---

## 🎯 Mejores Prácticas

### **✅ Hacer:**

- Usar `.checkbal` antes de modificar balances
- Documentar cambios importantes (captura de pantalla)
- Avisar al usuario cuando modifiques su economía
- Usar `.setmoney` para correcciones precisas
- Usar `.addmoney` para recompensas

### **❌ Evitar:**

- Abusar de los comandos sin razón
- Dar cantidades excesivas que rompan la economía
- Usar `.reseteco` sin advertir al usuario
- Modificar balances sin justificación

---

## 🔒 Seguridad

### **Protecciones Implementadas:**

1. ✅ Solo administradores pueden usar estos comandos
2. ✅ Requieren mención explícita del usuario
3. ✅ Validación de cantidades (no negativas)
4. ✅ Confirmación visual de cada acción
5. ✅ El balance no puede ser negativo

### **Limitaciones:**

- ❌ No se puede dar dinero directamente al banco
- ❌ No se puede modificar inventario (solo resetear)
- ❌ No se puede modificar cooldowns individualmente

---

## 💡 Tips

### **Para dar dinero al banco:**

```
1. .addmoney 10000 @usuario (da a cartera)
2. El usuario hace: .deposit all (mueve a banco)
```

### **Para verificar economía del grupo:**

```
Usa .top para ver el ranking
Luego .checkbal en usuarios sospechosos
```

### **Para eventos:**

```
Crea un sistema de puntos:
- 1er lugar: .addmoney 5000
- 2do lugar: .addmoney 3000
- 3er lugar: .addmoney 1000
```

---

## 📝 Registro de Cambios

Es recomendable llevar un registro de modificaciones importantes:

```
Fecha: 2025-11-28
Admin: @admin
Acción: .addmoney 10000 @usuario
Razón: Ganó torneo de trivia
```

---

## ⚠️ Notas Importantes

1. **Impacto en la Economía:**

   - Dar mucho dinero puede inflar la economía
   - Mantén un balance razonable

2. **Transparencia:**

   - Informa a los usuarios sobre cambios
   - Evita favoritismos

3. **Responsabilidad:**

   - Estos comandos tienen mucho poder
   - Úsalos con responsabilidad

4. **Backup:**
   - El archivo `economy.json` guarda todo
   - Haz copias de seguridad periódicas

---

**¡Usa estos comandos sabiamente para mantener una economía justa y divertida! 🛡️💰**
