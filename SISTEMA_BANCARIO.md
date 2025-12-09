# 🏦 SISTEMA BANCARIO - S COINS

## Fecha: 2025-11-28

### 📋 Descripción

El sistema bancario permite a los usuarios proteger su dinero de robos guardándolo en el banco.

---

## 🎯 Características

### **Dos Balances Separados:**

1. **👛 Cartera (Wallet)**

   - Dinero que llevas contigo
   - Se usa para jugar, comprar, apostar
   - **PUEDE SER ROBADO** con `.rob`

2. **🏦 Banco (Bank)**
   - Dinero guardado de forma segura
   - **NO PUEDE SER ROBADO**
   - No se puede usar directamente para jugar

---

## 📝 Comandos Disponibles

### **Ver Balance**

```
.bal
.balance
.cartera
```

Muestra:

- 👛 Dinero en cartera
- 🏦 Dinero en banco
- 💎 Total combinado
- 🎒 Items del inventario

### **Depositar**

```
.deposit [cantidad]
.deposit all
```

- Guarda dinero de la cartera al banco
- Protege tu dinero de robos
- Ejemplo: `.deposit 5000`

### **Retirar**

```
.withdraw [cantidad]
.withdraw all
```

- Saca dinero del banco a la cartera
- Necesario para jugar/comprar
- Ejemplo: `.withdraw 1000`

---

## 🎮 Reglas del Sistema

### **✅ Puedes hacer con dinero de CARTERA:**

- ✅ Jugar (gamble, slot, roulette)
- ✅ Comprar items (.buy)
- ✅ Pagar a otros (.pay)
- ✅ Depositar en banco (.deposit)
- ❌ **Puede ser robado** (.rob)

### **🏦 Dinero en BANCO:**

- ✅ **100% Seguro** de robos
- ❌ No se puede usar directamente
- ✅ Debes retirarlo primero (.withdraw)

---

## 💡 Estrategias Recomendadas

### **Para Jugadores Activos:**

```
1. Gana dinero (.work, .claim, .mine)
2. Deposita lo que no vayas a usar (.deposit all)
3. Retira solo lo necesario para jugar
4. Vuelve a depositar las ganancias
```

### **Para Acumuladores:**

```
1. Guarda TODO en el banco
2. Solo retira para compras importantes
3. Mantén cartera vacía para evitar robos
```

### **Para Apostadores:**

```
1. Retira cantidad específica para apostar
2. Si ganas, deposita inmediatamente
3. Si pierdes, no retires más (evita perder todo)
```

---

## 🔒 Protección Contra Robos

### **Antes del Sistema Bancario:**

- ❌ Todo tu dinero podía ser robado
- ❌ Perdías hasta 30% en un robo exitoso

### **Con el Sistema Bancario:**

- ✅ Solo roban de tu cartera
- ✅ Banco 100% seguro
- ✅ Puedes tener cartera vacía = imposible robar

### **Ejemplo:**

```
Usuario A:
👛 Cartera: 500 coins
🏦 Banco: 50,000 coins

Si le roban:
- Máximo pierden: ~150 coins (30% de 500)
- Banco intacto: 50,000 coins
```

---

## 📊 Comandos Modificados

### **Comando .rob**

- Solo roba de la **cartera** de la víctima
- El banco NO puede ser robado
- Si la cartera tiene < 100 coins, no se puede robar

### **Comando .bal**

- Ahora muestra ambos balances
- Indica total combinado
- Sugiere usar .deposit

---

## 🎯 Casos de Uso

### **Caso 1: Proteger Ganancias**

```
Tienes 10,000 coins
.deposit all
→ Ahora: Cartera: 0 | Banco: 10,000
→ Nadie puede robarte
```

### **Caso 2: Jugar Seguro**

```
Banco: 20,000 coins
.withdraw 2000
→ Cartera: 2,000 | Banco: 18,000
.gamble 2000
→ Si pierdes, solo perdiste 2,000
→ Banco sigue con 18,000
```

### **Caso 3: Comprar Items**

```
Banco: 15,000 coins
.withdraw 10000
.buy pico
→ Pico comprado
.deposit all
→ Dinero restante seguro en banco
```

---

## ⚙️ Implementación Técnica

### **Estructura de Usuario:**

```javascript
{
  balance: 0,      // Cartera (wallet)
  bank: 0,         // Banco (bank)
  inventory: [],
  lastClaim: 0,
  // ... otros campos
}
```

### **Migración Automática:**

- Usuarios existentes: `bank` se inicializa en 0
- Todo el dinero actual queda en `balance` (cartera)
- Deben depositar manualmente si quieren protegerlo

---

## 🚀 Ventajas del Sistema

1. **Seguridad**: Protege ahorros de robos
2. **Estrategia**: Añade profundidad al juego
3. **Realismo**: Similar a bancos reales
4. **Balance**: Evita que jugadores ricos sean robados constantemente
5. **Decisiones**: Los jugadores deben decidir cuánto arriesgar

---

**¡Usa el banco sabiamente y protege tus S Coins! 🏦💰**
