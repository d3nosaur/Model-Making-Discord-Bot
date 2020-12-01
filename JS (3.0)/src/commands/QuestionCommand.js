/* eslint-disable no-mixed-spaces-and-tabs */
const Discord = require('discord.js'), CommandHandler = require('../CommandHandler.js');
const BaseFunctions = require('../BaseFunctions.js');

/**
 * Displays more information on commands
 */
CommandHandler.RegisterNewCommand('?', ['Everyone'], (msg) => {
    const CommandArray = CommandHandler.getRegisteredCommands(); // Gets all registered commands

    if(msg.content == "!?") { // If it does not have any arguments, displays information on the ? command
      const questionEmbed = new Discord.MessageEmbed()
        .setTitle("? Command")
        .setColor('#a430fc')
        .setDescription("**Description:** Displays extra information about commands \n **Usage:** !? help");

      msg.channel.send(questionEmbed);
      return;
    }

    const command = CommandArray[msg.content.substring(3, msg.content.length).toLowerCase()]; // Gets the extra arguments and tries to get a command based on them

    if(command == null) {
      BaseFunctions.EasyEmbedSend(msg.channel, 'Command Error', 'Can not find a command with that name')
      return false; // If the command is null, they didn't input a good argument
    }

    const helpEmbed = new Discord.MessageEmbed() // Sends a message with the command info
      .setTitle(msg.content.substring(3, msg.content.length).charAt(0).toUpperCase() + msg.content.substring(3, msg.content.length).slice(1) + " Command")
      .setColor('#a430fc')
      .setDescription("**Description:** " + command.description + "\n" + '**Usage:** ' + command.usage + "\n" + '**Examples:** ' + command.examples + "\n" + "**Roles Required**: " + command.RolesRequired);

	  msg.channel.send(helpEmbed);
}, "Displays extra information on certain commands", '!? botalive', 'Deno: !? botalive');