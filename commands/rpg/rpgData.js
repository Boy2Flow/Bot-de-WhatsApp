export const CLASSES = {
    mage: {
        name: 'Hechicero',
        description: 'Maestro de las artes arcanas. Puede lanzar poderosos hechizos.',
        bonus: { int: 5, mana: 50 },
        spells: {
            fireball: { name: 'Bola de Fuego', damage: 30, manaCost: 20, description: 'Lanza una bola de fuego devastadora' },
            icespike: { name: 'Estaca de Hielo', damage: 25, manaCost: 15, description: 'Congela al enemigo con una estaca de hielo' },
            lightning: { name: 'Rayo', damage: 35, manaCost: 25, description: 'Invoca un rayo del cielo' },
            heal: { name: 'Curación', heal: 40, manaCost: 30, description: 'Restaura puntos de vida' }
        },
        attackType: 'magic'
    },
    archer: {
        name: 'Arquero',
        description: 'Experto en combate a distancia. Inmune a robos.',
        bonus: { agi: 5, critChance: 0.25 },
        abilities: ['no_steal', 'ranged_attack', 'critical_shot'],
        attackType: 'ranged'
    },
    warrior: {
        name: 'Guerrero',
        description: 'Combatiente cuerpo a cuerpo. Ataques letales pero arriesgados.',
        bonus: { str: 6, vit: 3 },
        abilities: ['heavy_strike', 'berserker_rage'],
        attackType: 'melee',
        damageMultiplier: 2.0,
        riskFactor: 1.5 // Recibe más daño
    },
    assassin: {
        name: 'Asesino',
        description: 'Maestro del sigilo. Puede robar oro de enemigos caídos.',
        bonus: { agi: 4, str: 2 },
        abilities: ['steal_gold', 'backstab', 'poison'],
        attackType: 'stealth',
        stealChance: 0.5 // 50% de robar oro extra
    }
};

export const RACES = {
    human: {
        name: 'Humano',
        description: 'Equilibrado y versátil. Adaptable a cualquier situación.',
        stats: { str: 5, agi: 5, int: 5, vit: 5 },
        image: 'https://i.pinimg.com/originals/b6/d9/36/b6d93666576402444d4719d363297b47.jpg'
    },
    orc: {
        name: 'Orco',
        description: 'Feroz y fuerte. Gran vitalidad y fuerza bruta.',
        stats: { str: 8, agi: 3, int: 2, vit: 7 },
        image: 'https://i.pinimg.com/736x/25/11/27/251127763654c606d649d56b4655450f.jpg'
    },
    wood_elf: {
        name: 'Elfo del Bosque',
        description: 'Ágil y certero. Maestro del arco y la naturaleza.',
        stats: { str: 3, agi: 8, int: 5, vit: 4 },
        image: 'https://i.pinimg.com/originals/4d/30/50/4d30500d072551532104e0d928236528.jpg'
    },
    high_elf: {
        name: 'Alto Elfo',
        description: 'Sabio y mágico. Gran poder arcano pero frágil.',
        stats: { str: 2, agi: 4, int: 9, vit: 3 },
        image: 'https://i.pinimg.com/originals/e1/90/13/e19013490749007204558509065476d0.jpg'
    },
    dark_elf: {
        name: 'Elfo Oscuro',
        description: 'Sigiloso y letal. Experto en magia oscura y asesinato.',
        stats: { str: 4, agi: 7, int: 7, vit: 4 },
        image: 'https://i.pinimg.com/originals/1a/00/63/1a006395353051560505495505555555.jpg'
    },
    nord: {
        name: 'Nórdico',
        description: 'Resistente al frío y gran guerrero. Honor y gloria.',
        stats: { str: 7, agi: 4, int: 3, vit: 6 },
        image: 'https://i.pinimg.com/originals/55/55/55/55555555555555555555555555555555.jpg'
    },
    dwarf: {
        name: 'Enano',
        description: 'Robusto y resistente. Maestro forjador y minero.',
        stats: { str: 6, agi: 3, int: 4, vit: 8 },
        image: 'https://i.pinimg.com/originals/60/60/60/60606060606060606060606060606060.jpg'
    }
};

export const FACTIONS = {
    blue_arrows: {
        name: 'Flechas Azules del Norte',
        description: 'Guerreros honorables que protegen las tierras heladas.',
        bonus: { str: 2, vit: 1 },
        enemy: 'red_crowns'
    },
    red_crowns: {
        name: 'Coronas Rojas del Sur',
        description: 'Estrategas brillantes que dominan las tierras cálidas.',
        bonus: { int: 2, agi: 1 },
        enemy: 'blue_arrows'
    },
    neutral: {
        name: 'Sin Facción',
        description: 'No perteneces a ninguna facción militar.',
        bonus: {},
        enemy: null
    }
};

export const AFFLICTIONS = {
    vampirism: {
        name: 'Vampirismo',
        description: 'Maldición de la noche. Más fuerte de noche, débil de día.',
        effects: {
            str: 3,
            agi: 2,
            dayPenalty: -2, // Penalización durante el día
            bloodThirst: true // Necesita sangre
        }
    },
    lycanthropy: {
        name: 'Licantropía',
        description: 'Maldición de la luna. Te transformas en bestia.',
        effects: {
            str: 4,
            vit: 2,
            int: -2,
            fullMoonBonus: 5
        }
    }
};

export const PROFESSIONS = {
    vampire_hunter: {
        name: 'Cazavampiros',
        description: 'Especialista en eliminar criaturas de la noche.',
        requirements: { level: 10 },
        bonus: { str: 2, agi: 2 },
        abilities: ['holy_water', 'silver_stake']
    },
    werewolf_hunter: {
        name: 'Cazador de Licántropos',
        description: 'Experto en rastrear y eliminar hombres lobo.',
        requirements: { level: 10 },
        bonus: { agi: 3, int: 1 },
        abilities: ['silver_bullets', 'wolfsbane']
    },
    necromancer: {
        name: 'Nigromante',
        description: 'Maestro de la magia oscura y los muertos vivientes.',
        requirements: { level: 15, race: 'dark_elf' },
        bonus: { int: 4 },
        abilities: ['raise_dead', 'life_drain']
    },
    paladin: {
        name: 'Paladín',
        description: 'Guerrero sagrado que combate el mal.',
        requirements: { level: 12 },
        bonus: { str: 2, vit: 2 },
        abilities: ['divine_shield', 'holy_strike']
    }
};

export const MONSTERS = [
    { name: 'Rata Gigante', level: 1, hp: 20, atk: 3, xp: 10, image: 'https://img.freepik.com/premium-photo/giant-rat-dungeons-dragons-style-art_906744-123.jpg' },
    { name: 'Goblin', level: 2, hp: 35, atk: 5, xp: 20, image: 'https://i.pinimg.com/originals/30/30/30/30303030303030303030303030303030.jpg' },
    { name: 'Lobo Huargo', level: 3, hp: 50, atk: 8, xp: 35, image: 'https://i.pinimg.com/originals/40/40/40/40404040404040404040404040404040.jpg' },
    { name: 'Orco Bandido', level: 5, hp: 80, atk: 12, xp: 60, image: 'https://i.pinimg.com/originals/50/50/50/50505050505050505050505050505050.jpg' },
    { name: 'Vampiro Menor', level: 7, hp: 100, atk: 15, xp: 100, canInfect: 'vampirism', image: 'https://i.pinimg.com/originals/55/55/55/55555555555555555555555555555555.jpg' },
    { name: 'Hombre Lobo', level: 8, hp: 120, atk: 18, xp: 120, canInfect: 'lycanthropy', image: 'https://i.pinimg.com/originals/56/56/56/56565656565656565656565656565656.jpg' },
    { name: 'Troll de Cueva', level: 8, hp: 150, atk: 20, xp: 150, image: 'https://i.pinimg.com/originals/60/60/60/60606060606060606060606060606060.jpg' },
    { name: 'Vampiro Antiguo', level: 12, hp: 250, atk: 30, xp: 300, canInfect: 'vampirism', image: 'https://i.pinimg.com/originals/65/65/65/65656565656565656565656565656565.jpg' },
    { name: 'Dragón Joven', level: 15, hp: 500, atk: 50, xp: 1000, image: 'https://i.pinimg.com/originals/70/70/70/70707070707070707070707070707070.jpg' }
];

export const LOCATIONS = {
    town: { name: 'Pueblo de Inicio', description: 'Un lugar seguro para descansar.', danger: 0 },
    forest: { name: 'Bosque Sombrío', description: 'Árboles antiguos y criaturas acechando.', danger: 1 },
    cave: { name: 'Cueva Húmeda', description: 'Oscuridad y ecos lejanos.', danger: 2 },
    mountain: { name: 'Pico Nevado', description: 'Frío extremo y bestias feroces.', danger: 3 },
    crypt: { name: 'Cripta Maldita', description: 'Hogar de vampiros y no-muertos.', danger: 4 },
    battlefield: { name: 'Campo de Batalla', description: 'Donde las facciones luchan por el control.', danger: 3 }
};
