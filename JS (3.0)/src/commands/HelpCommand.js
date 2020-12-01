const Discord = require('discord.js'), CommandHandler = require('../CommandHandler.js');

/**
 * Puts a message into chat with all of the commands listed
 */
CommandHandler.RegisterNewCommand('help', ['Everyone'], (msg) => {
	const CommandArray = CommandHandler.getRegisteredCommands(); // Gets all registered commands

	const helpEmbed = new Discord.MessageEmbed() // Creates an embed
		.setTitle('Commands')
		.setColor('#a430fc')
		.setDescription('Here is a list of all commands.');

	for (const command in CommandArray) { // Adds a field for each command
		if (typeof CommandArray[command].description !== 'string')
			helpEmbed.addField(command, 'No description provided.');
		else {
			helpEmbed.addField(command, CommandArray[command].description + '\nPermissions Required: ' + CommandArray[command].RolesRequired);
		}
	}

	msg.channel.send(helpEmbed);
}, 'Displays information on all of Frederick\'s commands.', '!help', 'Deno: !helps');