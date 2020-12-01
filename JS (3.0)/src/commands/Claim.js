const CommandHandler = require('../CommandHandler.js'), BaseFunctions = require('../BaseFunctions.js');

/**
 * Displays a message if the bot is alive
 */
CommandHandler.RegisterNewCommand('claim', ['Model Maker', 'Senior Model Maker', 'Head Model Maker'], (msg) => {
	const channel = msg.channel;

	if(!channel.name.startsWith('commission-ticket')) {
		BaseFunctions.EasyEmbedSend(channel, 'Command Error', 'Command was not sent in an commission ticket.');
		return;
	} else if(channel.parent.name == 'Claimed Commission Tickets') {
		BaseFunctions.EasyEmbedSend(channel, 'Command Error', 'Ticket has already been claimed.');
		return;
	}

	let ticketCreator;
	channel.members.forEach(member => {
		if(member.user == undefined || member.user.username == undefined) return;

		if(member.user.username.toLowerCase() == channel.name.substr(channel.name.length - member.user.username.length).toLowerCase()) {
			ticketCreator = member.user;
		}
	})

	const category = BaseFunctions.GetCategory(msg.guild, 'Claimed Commission Tickets');

	if(category != false) {
        BaseFunctions.EasyEmbedSend(channel, 'Commission Ticket', 'This ticket has been claimed by **' + msg.author.username + '**\n\nWhen this ticket is finished, ask the model maker to use !finish to finish the ticket process\nIf you would like to switch model makers, enter !unclaim into this channel');

        channel.setParent(category);
        channel.edit({permissionOverwrites: [{
            id: '493222560453099520',
			deny: ['VIEW_CHANNEL', 'SEND_MESSAGES', 'READ_MESSAGE_HISTORY'],
        }, {
			id: '729544201502457918',
			allow: ['VIEW_CHANNEL', 'SEND_MESSAGES', 'READ_MESSAGE_HISTORY'],
		}, {
			id: '493502129915559936',
			allow: ['VIEW_CHANNEL', 'SEND_MESSAGES', 'READ_MESSAGE_HISTORY'],
		}, {
			id: msg.author.id,
			allow: ['VIEW_CHANNEL', 'SEND_MESSAGES', 'READ_MESSAGE_HISTORY'],
		}, {
			id: ticketCreator.id,
			allow: ['VIEW_CHANNEL', 'SEND_MESSAGES', 'READ_MESSAGE_HISTORY'],
		}]});
        channel.setPosition(category.children.keyArray().length+1)
    } else {
        BaseFunctions.EasyEmbedSend(channel, 'Commission Error', 'Can not find category called "Claimed Commission Tickets"');
    }
}, 'Claims the commission that the message was sent in.', '!claim', 'Deno: !claim');