const Discord = require('discord.js');

/**
 * Creates and Sends an embed.
 * @param {channel} channel The channel to send this embed.
 * @param {string} header Header of the embed.
 * @param {string} text Description in the embed.
 */
function EasyEmbedSend(channel, header, text) {
	const Embed = EasyEmbed(header, text, '#a430fc');
	channel.send(Embed);
}

/**
 * Sends an error to console.
 * @param {args} args All arguments to enter into the error.
 */
function ConsoleError(...args) {
	console.log('[ERROR] ' + args);
}

/**
 * Creates and returns an embed.
 * @param {string} header Header of the embed.
 * @param {string} text Description in the embed.
 * @param {string} color Hex Value for the Color.
 */
function EasyEmbed(header, text, color) {
	const Embed = new Discord.MessageEmbed()
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
	let result = false;
	roles.forEach(element => {
		if(user.roles.cache.some(role => role.name.toLowerCase() === element.toLowerCase())) {
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
	let category;

	guild.channels.cache.forEach(channel => { // Attempts to get the category to put the ticket into
		if(channel == null || channel.name == null) {
			return;
		}

		if(channel.name == name) {
			category = channel;
		}
	});

	if(category) {
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
	let channel;

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
	const category = GetCategory(channel.guild, 'archive')

    if(category != false) {
        EasyEmbedSend(channel, 'Archive', 'Moving this channel to the Archived Section');

        channel.setParent(category);
        channel.edit({permissionOverwrites: [{
            id: '493222560453099520',
			deny: ['VIEW_CHANNEL', 'SEND_MESSAGES', 'READ_MESSAGE_HISTORY'],
        }]});
        channel.setPosition(category.children.keyArray().length+1)
    } else {
        EasyEmbedSend(channel, 'Archive Command', 'Can not find category called "archive"');
    }
}

module.exports = {
	EasyEmbedSend: EasyEmbedSend,
	ConsoleError: ConsoleError,
	EasyEmbed: EasyEmbed,
	HasRole: HasRole,
	GetCategory: GetCategory,
	GetChannel: GetChannel,
	ArchiveChannel: ArchiveChannel,
};