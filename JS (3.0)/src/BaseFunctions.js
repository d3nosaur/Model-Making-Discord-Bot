const Discord = require('discord.js');

/**
 * Creates and Sends an embed.
 * @param {channel} channel The channel to send this embed.
 * @param {string} header Header of the embed.
 * @param {string} text Description in the embed.
 */
function EasyEmbedSend(channel, header, text) {
	const Embed = EasyEmbed(header, text, '#a430fc'); // Creates and sends embed to the channel specified
	channel.send(Embed);
}

/**
 * Sends an error to console.
 * @param {args} args All arguments to enter into the error.
 */
function ConsoleError(...args) {
	console.log('[ERROR] ' + args); // Not sure why I made this
}

/**
 * Creates and returns an embed.
 * @param {string} header Header of the embed.
 * @param {string} text Description in the embed.
 * @param {string} color Hex Value for the Color.
 */
function EasyEmbed(header, text, color) {
	const Embed = new Discord.MessageEmbed() // Creates and returns an embed
		.setColor(color)
		.setTitle(header)
		.setDescription(text);

	return Embed;
}

/**
 * Checks if user has one of an array of roles.
 * @param {user} user User to check.
 * @param {array<string>} roles Roles to check.
 */
function HasRole(user, roles) {
	let result = false; // Boolean for later on
	roles.forEach(element => { // Iterates over all of the roles in the server
		if(user.roles.cache.some(role => role.name.toLowerCase() === element.toLowerCase())) { // If the user has the current role, switch result to true
			result = true;
		}
	});

	return result;
}

/**
 * Attempts to find a category within the guild, returns false if it can not be found
 * @param {DiscordClient} guild 
 * @param {String} name 
 */
function GetCategory(guild, name) {
	let category; // Placeholder Variable

	guild.channels.cache.forEach(channel => { // Iterates over all of the channels (Includes Category Channels)
		if(channel == null || channel.name == null) { // If the channel is bugged disregard
			return;
		}

		if(channel.name == name) { // If the current channels name is the name we want then replace the placeholder variable with it
			category = channel;
		}
	});

	if(category) {  // If it found a category return the category, if not return false
		return category;
	} else {
		return false;
	}
}

/**
 * Attempts to find a channel within the category, returns false if it can not be found
 * @param {Category} category 
 * @param {String} name 
 */
function GetChannel(category, name) {
	let channel; // Same as GetCategory but iterates over a category instead of the server

	category.children.forEach(ichannel => {
		if(ichannel == null || ichannel.name == null) {
			return;
		}

		if(ichannel.name === name) {
			channel = ichannel;
		}
	})

	if(channel) {
		return channel;
	} else {
		return false;
	}
}

/**
 * Archives the channel
 * @param {TextChannel} channel 
 */
function ArchiveChannel(channel) {
	const category = GetCategory(channel.guild, 'archive') // Finds the category called "archive"

    if(category != false) { // If the category exists
        EasyEmbedSend(channel, 'Archive', 'Moving this channel to the Archived Section'); // Gives a warning message

        channel.setParent(category); // Moves the channel
        channel.edit({permissionOverwrites: [{ // Change the permissions to only allow admins
            id: '493222560453099520',
			deny: ['VIEW_CHANNEL', 'SEND_MESSAGES', 'READ_MESSAGE_HISTORY'],
        }]});
        channel.setPosition(category.children.keyArray().length+1)
    } else {
        EasyEmbedSend(channel, 'Archive Command', 'Can not find category called "archive"'); // Error Message
    }
}

module.exports = { // Exports
	EasyEmbedSend: EasyEmbedSend,
	ConsoleError: ConsoleError,
	EasyEmbed: EasyEmbed,
	HasRole: HasRole,
	GetCategory: GetCategory,
	GetChannel: GetChannel,
	ArchiveChannel: ArchiveChannel,
};