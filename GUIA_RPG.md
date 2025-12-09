# 🎮 JUEGO RPG DE FANTASÍA

## Descripción

Sistema completo de juego de rol con razas, combate, exploración y progresión de personajes.

## Razas Disponibles

### 🧑 Humano (human)

- **Descripción**: Equilibrado y versátil. Adaptable a cualquier situación.
- **Stats**: Fuerza 5, Agilidad 5, Inteligencia 5, Vitalidad 5

### 🗡️ Orco (orc)

- **Descripción**: Feroz y fuerte. Gran vitalidad y fuerza bruta.
- **Stats**: Fuerza 8, Agilidad 3, Inteligencia 2, Vitalidad 7

### 🏹 Elfo del Bosque (wood_elf)

- **Descripción**: Ágil y certero. Maestro del arco y la naturaleza.
- **Stats**: Fuerza 3, Agilidad 8, Inteligencia 5, Vitalidad 4

### ✨ Alto Elfo (high_elf)

- **Descripción**: Sabio y mágico. Gran poder arcano pero frágil.
- **Stats**: Fuerza 2, Agilidad 4, Inteligencia 9, Vitalidad 3

### 🌑 Elfo Oscuro (dark_elf)

- **Descripción**: Sigiloso y letal. Experto en magia oscura y asesinato.
- **Stats**: Fuerza 4, Agilidad 7, Inteligencia 7, Vitalidad 4

### ❄️ Nórdico (nord)

- **Descripción**: Resistente al frío y gran guerrero. Honor y gloria.
- **Stats**: Fuerza 7, Agilidad 4, Inteligencia 3, Vitalidad 6

## Comandos

### `.rpg start [raza]`

Crea tu personaje eligiendo una raza.

- Ejemplo: `.rpg start orc`
- Si no especificas raza, muestra todas las opciones

### `.rpg perfil` / `.rpg stats`

Muestra tu perfil completo:

- Nivel y experiencia
- HP y Mana
- Estadísticas
- Oro e inventario
- Ubicación actual

### `.rpg explorar` / `.rpg explore`

Busca aventuras en tu ubicación actual:

- 60% de probabilidad de encontrar un enemigo
- 20% de probabilidad de encontrar oro
- 20% de probabilidad de no encontrar nada

### `.rpg atacar` / `.rpg fight`

Ataca al enemigo actual en combate:

- Haces daño basado en tu Fuerza
- El enemigo contraataca
- Si ganas, obtienes XP y oro
- Si pierdes, mueres

### `.rpg curar` / `.rpg heal`

Recupera toda tu salud:

- Cuesta 10 de oro (gratis si estás muerto)
- Te devuelve al máximo de HP
- Te revive si estabas muerto

## Sistema de Combate

1. **Explorar** hasta encontrar un enemigo
2. **Atacar** repetidamente hasta derrotarlo o morir
3. El daño del jugador = Fuerza × 1.5 + aleatorio(0-5)
4. El daño del enemigo = Ataque del monstruo
5. Al ganar: recibes XP y oro
6. Al perder: mueres y necesitas curarte

## Sistema de Nivel

- Comienzas en nivel 1 con 0 XP
- Necesitas 100 XP para nivel 2
- Cada nivel requiere 50% más XP que el anterior
- Al subir de nivel:
  - Todas tus stats aumentan +1
  - Tu HP y Mana máximos se recalculan
  - Te curas completamente

## Monstruos

- **Rata Gigante** (Nvl 1): 20 HP, 3 ATK, 10 XP
- **Goblin** (Nvl 2): 35 HP, 5 ATK, 20 XP
- **Lobo Huargo** (Nvl 3): 50 HP, 8 ATK, 35 XP
- **Orco Bandido** (Nvl 5): 80 HP, 12 ATK, 60 XP
- **Troll de Cueva** (Nvl 8): 150 HP, 20 ATK, 150 XP
- **Dragón Joven** (Nvl 15): 500 HP, 50 ATK, 1000 XP

## Consejos

1. **Elige bien tu raza**: Los orcos son buenos para principiantes (mucha vida)
2. **Guarda oro**: Necesitarás curarte después de combates difíciles
3. **Sube de nivel**: Cada nivel te hace significativamente más fuerte
4. **Explora con cuidado**: Puedes encontrar enemigos muy fuertes aleatoriamente

## Datos Guardados

- Cada grupo tiene sus propios personajes independientes
- Los datos se guardan en `rpg_data.json`
- Tu progreso persiste entre sesiones
- Puedes tener un personaje por grupo
