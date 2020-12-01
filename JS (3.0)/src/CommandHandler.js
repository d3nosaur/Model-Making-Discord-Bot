const Functions = require('./BaseFunctions.js');

const CommandArray = {};

/**
 * Registers a new command. If a command with same execution string exists. An error is thrown.
 * @param {string} name The command string needed to execute this command.
 * @param {Array<string>} RolesRequired Roles required to use this command, defaults to everyone.
 * @param {function} callback Callback function for when this command is executed.
 * @param {string|function} [description=] The description of what the command does. If a function is provided then it will be used as the help function when help info needs to be displayed.
 * @param {string} [usage=] The argument usage template.
 * @param {Array<string>} [examples=] Example(s) of how to use the command.
 */
function RegisterNewCommand(name, RolesRequired, callback, description, usage, examples) {
	if(CommandArray[name]) { // If command already exists, don't create command again
		Functions.ConsoleError('Command ' + name + ' can not be initialized due to it already existing.');
		return
	}

	CommandArray[name] = { // If command doesn't exist, create command
		RolesRequired: RolesRequired ? RolesRequired : ['everyone'],
		callback: callback,
		description: description ? description : 'No description provided.',
		usage: usage ? usage : 'No usage provided.',
		examples: examples ? examples : ['No examples provided.'],
	};
}

/**
 * Returns all registered commands.
 */
function getRegisteredCommands() {
	return CommandArray;
}

function ExecuteCommand(command, msg, client) {
	if(CommandArray[command]) // If command exists, run command (callback function)
		CommandArray[command].callback(msg, client);
	else
		Functions.ConsoleError('Execute Command ' + command + ' failed.');
}

/**
 * Handles a Message to be executed as a command.
 * @param {client} client Discord Client
 * @param {message} msg Message
 */
function HandleMessage(client, msg) { // Called on whenever someone types something
	const msgContent = msg.content;
	if (msgContent.startsWith('!')) { // If it is potentially a command
		let firstWordIndex = msgContent.indexOf(' '); // Grabs the command itself without any arguments
		if (firstWordIndex === -1)
			firstWordIndex = msgContent.length;

		const command = msgContent.substr(1, firstWordIndex - 1).toLowerCase(); // Turns the message into something readable

		if(!CommandArray[command]) { // Checks if command exists
			Functions.EasyEmbedSend(msg.channel, 'Command Error', 'Command does not exist!');
			return false;
		}

		if(msg.member.bot) { // Bots can't command
			Functions.ConsoleError('Bots can not run commands (' + msg.author + ': "' + msg.content + '" at ' + msg.createdAt);
			return false;
		}

		if(CommandArray[command].RolesRequired.includes('Everyone')) { // If the command allows anyone to use it, execute command
			ExecuteCommand(command, msg, client);
			return true;
		}

		if(Functions.HasRole(msg.member, CommandArray[command].RolesRequired)) { // If the person has one of the roles required, execute command
			ExecuteCommand(command, msg, client);
			return true;
		} else { // Person does not have permission to execute the command.
			Functions.EasyEmbedSend(msg.channel, 'Command Error', msg.author.username + ' does not have permission to execute this command.');
			return false;
		}
	}
	return false;
}

module.exports = { // Allows the useful functions to be used outside of this class
	HandleMessage: HandleMessage,
	getRegisteredCommands: getRegisteredCommands,
	RegisterNewCommand: RegisterNewCommand,
};
