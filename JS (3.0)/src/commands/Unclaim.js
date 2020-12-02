const CommandHandler = require('../CommandHandler.js'), BaseFunctions = require('../BaseFunctions.js');

/**
 * Doesn't Work
 */
CommandHandler.RegisterNewCommand('unclaim', ['Everyone'], (msg) => {
	const channel = msg.channel;

	if(msg.author.username.toLowerCase() == channel.name.substr(channel.name.length - msg.author.username.length).toLowerCase() || msg.author.roles.cache.has('729544201502457918') || msg.author.roles.cache.has('493223081746235393') || msg.author.roles.cache.has('509890300467216387')) {
		const category = BaseFunctions.GetCategory(msg.guild, 'Commission Tickets');
		channel.setParent(category);

		let permissions = channel.permissionOverwrites.array();
		permissions.push({
			id: '493223241691955232',
			allow: ['VIEW_CHANNEL', 'SEND_MESSAGES', 'READ_MESSAGE_HISTORY'],
		})

		channel.edit({permissionOverwrites: permissions})

		BaseFunctions.EasyEmbedSend(channel, 'Commission Ticket', 'This commission has been unclaimed.')
	} else {
		BaseFunctions.EasyEmbedSend(channel, 'Command Error', 'You do not have the required permissions in this channel to use this command.')
	}
}, 'Unclaims the commission ticket that the message was sent in, only useable by Senior Model Maker+/The person that made the ticket.', '!unclaim', 'Deno: !unclaim');