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

	CommandArraySorted = {
		["General"]: [],
		["Admin"]: [],
		["Model Making"]: [],
		["Games"]: [],
	};
	for(const command in CommandArray) {
		if(!CommandArray[command].category in CommandArraySorted) {
			ComamndArraySorted[CommandArray[command].category] = {};
		}
		CommandArraySorted[CommandArray[command].category].push(command);
		//console.log(command)
	}

	for(const curArray in CommandArraySorted) {
		let finalMessage = "";
		for(let curCommand in CommandArraySorted[curArray]) {
			curCommand = CommandArraySorted[curArray][curCommand]
			finalMessage += "**" + curCommand + "**\nDescription: " + CommandArray[curCommand].description + "\nPermissions Required: " + CommandArray[curCommand].RolesRequired + "\nUsage: " + CommandArray[curCommand].usage + "\n\n"
		}
		helpEmbed.addField(curArray, finalMessage, true)
	}

	/*for (const command in CommandArray) { // Adds a field for each command
		if (typeof CommandArray[command].description !== 'string')
			helpEmbed.addField(command, 'No description provided.');
		else {
			helpEmbed.addField(command, CommandArray[command].description + '\nPermissions Required: ' + CommandArray[command].RolesRequired);
		}
	}*/

	msg.channel.send(helpEmbed);
}, 'Displays information on all of Frederick\'s commands.', '!help', 'Deno: !help', "General");