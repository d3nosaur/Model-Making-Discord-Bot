const CommandHandler = require('../CommandHandler.js'), BaseFunctions = require('../BaseFunctions.js');

/**
 * Displays a message if the bot is alive
 */
CommandHandler.RegisterNewCommand('botalive', ['Everyone'], (msg) => {
	BaseFunctions.EasyEmbedSend(msg.channel, 'Bot Status', 'I am alive.'); // Just sends an embed always, if the bot is dead it wont run this
}, 'Displays a message if the bot is alive.', '!botalive', 'Deno: !botalive', "General");