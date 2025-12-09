# 🏦 SISTEMA DE ECONOMÍA POR GRUPO

## ✅ CAMBIOS IMPLEMENTADOS

El sistema de economía ahora es **completamente independiente por grupo**. Esto significa:

### 📊 Antes vs Ahora

**ANTES (Economía Global):**

```json
{
  "34612345678@s.whatsapp.net": {
    "balance": 5000,
    "bank": 2000
  }
}
```

👉 El usuario tenía el mismo dinero en TODOS los grupos

**AHORA (Economía por Grupo):**

```json
{
  "120363123456789@g.us": {
    "34612345678@s.whatsapp.net": {
      "balance": 5000,
      "bank": 2000
    }
  },
  "120363987654321@g.us": {
    "34612345678@s.whatsapp.net": {
      "balance": 1000,
      "bank": 500
    }
  }
}
```

👉 El usuario tiene balances DIFERENTES en cada grupo

---

## 🎯 CARACTERÍSTICAS

### 1️⃣ **Economías Separadas**

- Cada grupo tiene su propia economía independiente
- El dinero ganado en un grupo NO afecta a otros grupos
- Los inventarios son independientes por grupo
- Los cooldowns son independientes por grupo

### 2️⃣ **Rankings por Grupo**

- El comando `.top` muestra el ranking del grupo actual
- Cada grupo tiene su propio top 10
- El nombre del grupo se muestra en el ranking

### 3️⃣ **Balance por Grupo**

- El comando `.bal` muestra:
  - El nombre del grupo actual
  - Tu balance en ESE grupo específico
  - Un mensaje indicando que la economía es independiente

### 4️⃣ **Transferencias Limitadas**

- Solo puedes transferir dinero a usuarios del MISMO grupo
- No se puede transferir dinero entre grupos diferentes

### 5️⃣ **Comandos de Admin por Grupo**

- `.addmoney` - Añade dinero en el grupo actual
- `.removemoney` - Quita dinero en el grupo actual
- `.setmoney` - Establece balance en el grupo actual
- `.reseteco` - Resetea economía en el grupo actual
- `.checkbal` - Ver balance en el grupo actual

---

## 📝 EJEMPLOS DE USO

### Ejemplo 1: Usuario en 2 Grupos

**Grupo A: "Amigos"**

```
Usuario: Juan
Balance: 10,000 S Coins
Banco: 5,000 S Coins
Items: 🛡️ ⛏️
```

**Grupo B: "Trabajo"**

```
Usuario: Juan
Balance: 500 S Coins
Banco: 0 S Coins
Items: (ninguno)
```

👉 Juan tiene economías completamente separadas en cada grupo

### Ejemplo 2: Ranking

**Grupo A - Top 3:**

```
1. @Juan - 15,000 S Coins
2. @María - 8,000 S Coins
3. @Pedro - 3,000 S Coins
```

**Grupo B - Top 3:**

```
1. @Carlos - 20,000 S Coins
2. @Ana - 12,000 S Coins
3. @Juan - 500 S Coins
```

👉 Los rankings son completamente independientes

---

## 🔧 COMANDOS AFECTADOS

Todos estos comandos ahora funcionan por grupo:

### Comandos de Usuario:

- `.bal` / `.balance` - Ver saldo del grupo actual
- `.claim` - Reclamar en el grupo actual
- `.work` - Trabajar en el grupo actual
- `.crime` - Crimen en el grupo actual
- `.slut` - Trabajo en el grupo actual
- `.rob` - Robar en el grupo actual
- `.gamble` - Apostar en el grupo actual
- `.slot` - Slots en el grupo actual
- `.buy` - Comprar en el grupo actual
- `.mine` - Minar en el grupo actual
- `.ruleta` - Ruleta en el grupo actual
- `.pay` - Pagar en el grupo actual
- `.top` - Ranking del grupo actual
- `.deposit` - Depositar en el grupo actual
- `.withdraw` - Retirar en el grupo actual

### Comandos de Admin:

- `.addmoney` - Dar dinero en el grupo actual
- `.removemoney` - Quitar dinero en el grupo actual
- `.setmoney` - Establecer balance en el grupo actual
- `.checkbal` - Ver balance en el grupo actual
- `.reseteco` - Resetear en el grupo actual

---

## ⚠️ IMPORTANTE

### Migración de Datos

Si ya tenías datos de economía anteriores, se perderán al usar el nuevo sistema.
El archivo `economy.json` ahora tiene una estructura diferente.

### Backup Recomendado

Si quieres conservar los datos antiguos:

1. Haz una copia de `economy.json` antes de iniciar el bot
2. Guárdala como `economy_backup.json`

### Reinicio del Bot

Para aplicar los cambios:

```
.reload
```

---

## 🎮 VENTAJAS

✅ **Separación de Contextos**: La economía de un grupo de amigos no se mezcla con la de trabajo
✅ **Competencia Justa**: Cada grupo tiene su propia competencia
✅ **Flexibilidad**: Puedes ser rico en un grupo y pobre en otro
✅ **Privacidad**: Tu dinero en un grupo no es visible en otros
✅ **Escalabilidad**: Cada grupo es independiente

---

## 📞 SOPORTE

Si encuentras algún problema:

1. Verifica que el bot esté actualizado
2. Usa `.reload` para reiniciar
3. Revisa los logs en la consola

---

**Fecha de Implementación**: 2025-12-01
**Versión**: 2.0 - Economía por Grupo
