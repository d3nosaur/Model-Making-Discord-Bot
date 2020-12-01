const { PermissionOverwrites } = require('discord.js');
const CommandHandler = require('../CommandHandler.js'), BaseFunctions = require('../BaseFunctions.js');

/**
 * Makes channel this message was sent in an archived channel
 */
CommandHandler.RegisterNewCommand('archive', ['Senior Model Maker', 'Head Model Maker', 'Affairs Clearance'], (msg) => {
    BaseFunctions.ArchiveChannel(msg.channel)
}, 'Moves the channel the command\'s message was sent in to the archives, removes general permissions', '!archive', 'Deno: !archive');