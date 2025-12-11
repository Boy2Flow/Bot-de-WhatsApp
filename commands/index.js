import { menuCommand } from './menu.js';
import { stickerCommand } from './sticker.js';
import { mentionCommands } from './mentionAll.js';
import { gameCommands } from './games.js';
import { infoCommand } from './info.js';
import { helpCommand } from './help.js';
import { adminCommands } from './adminCommands.js';
import { maintenanceCommand } from './maintenance.js';
import { interactionCommands } from './interactions.js';
import { muteCommands } from './muteCommand.js';
import { warnCommands } from './warnCommand.js';
import { cleanCommands } from './cleanCommand.js';
import { customListCommands } from './customLists.js';
import { traumadasCommands } from './traumadasCommand.js';
import { mariconesCommands } from './mariconesCommand.js';
import { pajeroCommands } from './pajeroCommand.js';
import { economyCommands } from './economy.js';
import { systemCommands } from './systemCommands.js';
// import { broadcastCommands } from './broadcast.js';
import { aiCommand } from './aiCommand.js';
import { pingCommand } from './ping.js';
import { ipCommand } from './ip.js';
import { mensajesCommand } from './mensajes.js';
import { inactivosCommand } from './inactivos.js';
import { premioCommand } from './premio.js';
import { configCommand } from './groupConfig.js';
import { rpgCommand, trainCommand } from './rpg/rpgCommands.js';
import { rpgAdminCommand } from './rpg/rpgAdminCommands.js';
import { rpgExtendedCommand } from './rpg/rpgExtendedCommands.js';
import { rpgClassCommand, spellCommand } from './rpg/rpgClassCommands.js';
import { marketCommand, buyCommand } from './rpg/rpgMarket.js';
import { inventoryCommand, equipCommand, unequipCommand } from './rpg/rpgInventory.js';
import { trollCommand, suicideCommand } from './trollCommand.js';
import { marriageCommands } from './casarCommand.js';
import { solterasCommands } from './solterasCommand.js';
import { privilegedCommands } from './privilegedCommands.js';
import { superAdminMenuCommand } from './superAdminMenu.js';
import { addIgCommand, igCommand, delIgCommand } from './instagramCommand.js';
import { reminderCommand, listRemindersCommand, delReminderCommand, alarmaCommand, initReminderSystem } from './reminderCommand.js';
import { vozCommand } from './voz.js';
import { transcribirCommand } from './transcribir.js';
import { setKeyCommand } from './apiConfigCommand.js';

export const commands = [
    configCommand,
    premioCommand,
    mensajesCommand,
    inactivosCommand,
    aiCommand,
    pingCommand,
    ipCommand,
    menuCommand,
    stickerCommand,
    ...mentionCommands,
    maintenanceCommand,
    ...interactionCommands,
    ...adminCommands,
    ...muteCommands,
    ...warnCommands,
    ...cleanCommands,
    ...customListCommands,
    ...traumadasCommands,
    ...mariconesCommands,
    ...pajeroCommands,
    ...solterasCommands,
    ...economyCommands,
    ...systemCommands,
    // ...broadcastCommands,
    ...gameCommands,
    rpgCommand,
    trainCommand,
    rpgAdminCommand,
    rpgExtendedCommand,
    rpgClassCommand,
    spellCommand,
    marketCommand,
    buyCommand,
    inventoryCommand,
    equipCommand,
    unequipCommand,
    trollCommand,
    suicideCommand,
    ...marriageCommands,
    ...privilegedCommands,
    superAdminMenuCommand,
    addIgCommand,
    igCommand,
    delIgCommand,
    reminderCommand,
    listRemindersCommand,
    delReminderCommand,
    alarmaCommand,
    vozCommand,
    transcribirCommand,
    setKeyCommand,
    infoCommand,
    helpCommand
];
