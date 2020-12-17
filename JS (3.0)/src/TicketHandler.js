const BaseFunctions = require('./BaseFunctions.js');
const Functions = require('./BaseFunctions.js');

const TicketArray = {};

/**
 * Registers a Ticket into the system
 * @param {string} name The name of the ticket 
 * @param {function} callback What to run when the ticket is used, needs to return true to continue ticket
 * @param {int} pageamount Amount of pages
 * @param {array<string>} pages Array of content within pages
 * @param {string} emojiid ID of the emoji associated with the ticket
 * @param {array<string>} allowedroles Array of roles allowed to see the ticket, automatically includes the user that created it
 */
function RegisterNewTicket(name, callback, pageamount, pages, emojiid, allowedroles) {
	if(TicketArray[name]) { // If the ticket already exists, don't make it again
		Functions.ConsoleError('Ticket ' + name + ' can not be initialized due to it already existing.');
		return false;
	}

	TicketArray[name] = { // Save the ticket to the system
		callback: callback,
		pageamount: pageamount,
		pages: pages,
		emojiid: emojiid,
		allowedroles: allowedroles,
	};
	return true;
}

/**
 * Starts a ticket on a user
 * @param {user} user The user to begin the ticket with
 * @param {string} ticket The name of the ticket
 * @param {client} guild The discord guild
 */
function StartTicket(user, ticket, guild) {
	if(TicketArray[ticket]) { // If the ticket exists continue
		let category;

		guild.channels.cache.forEach(channel => { // Attempts to get the category to put the ticket into
			if(channel == null || channel.name == null) {
				return;
			}

			if(channel.name == ticket.charAt(0).toUpperCase() + ticket.slice(1) + ' Tickets' && channel.type == 'category') {
				category = channel;
			}
		});

		if(category == null) { // If the category finding does not work, return an error
			BaseFunctions.ConsoleError('Ticket creation failed');
			return false;
		}

		if(category != null) { // If the category finding works, continue
			const Embed = BaseFunctions.EasyEmbed(ticket.charAt(0).toUpperCase() + ticket.slice(1) + ' Ticket ' + user.username, TicketArray[ticket].pages[1].text, '#8943e6'); // Starting embed
			Embed.setFooter('Page: 1/' + TicketArray[ticket].pageamount);

			const Permissions = [];

			TicketArray[ticket].allowedroles.forEach(curID => { // Creates a permissions array with the custom permissions given
				Permissions.push({
					id: curID,
					allow: ['VIEW_CHANNEL', 'SEND_MESSAGES', 'READ_MESSAGE_HISTORY'],
				})
			})

			Permissions.push({ // Allows the user to use the channel
				id: user.id,
				allow: ['VIEW_CHANNEL', 'SEND_MESSAGES', 'READ_MESSAGE_HISTORY'],
			})

			Permissions.push({ // Does not allow the everyone role to use the channel
				id: '493222560453099520',
				deny: ['VIEW_CHANNEL', 'SEND_MESSAGES', 'READ_MESSAGE_HISTORY'],
			})

			const channel = guild.channels.create(ticket + '-ticket-' + user.username, { // Creates the channel
				type: 'text',
				topic: 'Used to get a Custom Class approved',
				parent: category.id,
				position: category.children.array().length,
				reason: user.username + ' created an ' + ticket.charAt(0).toUpperCase() + ticket.slice(1) + ' Ticket.',
				permissionOverwrites: Permissions
			}).then(channel => channel.send({embed: Embed})).then(message => message.react(guild.emojis.cache.get(TicketArray[ticket].emojiid)));
		}
		else
			Functions.ConsoleError('Start Ticket ' + ticket + ' failed, no category found.');
	}
	else
		Functions.ConsoleError('Start Ticket ' + ticket + ' failed.');
}

/**
 * Continues a Ticket (Called when a person reacts to a ticket response)
 * @param {user} user 
 * @param {string} ticket 
 * @param {message} message 
 * @param {DiscordClient} guild 
 */
async function ContinueTicket(user, ticket, message, guild) {
	const response = await TicketArray[ticket].callback(message) // Checks if the ticket's callback allows itself to continue
	if (!response) {
		return
	}

	const Page = parseInt(message.embeds[0].footer.text.substr(6, 1)) + 1 // Gets curren't page (I forgot about the function)

	const Embed = BaseFunctions.EasyEmbed(ticket.charAt(0).toUpperCase() + ticket.slice(1) + ' Ticket ' + user.username, TicketArray[ticket].pages[Page].text, '#8943e6'); // Creates the next embed
	Embed.setFooter('Page: ' + Page + '/' + TicketArray[ticket].pageamount)

	message.edit({embed: Embed})

	if(Page == TicketArray[ticket].pageamount) { // If it is the last page, remove the reactions
		message.reactions.removeAll()
	}
}

/**
 * Returns all registered tickets
 */
function GetRegisteredTickets() {
	return TicketArray;
}

/**
 * Handles all reactions that are recieved in the guild
 * @param {user} user The user that reacted
 * @param {reaction} reaction The reaction they gave
 * @param {DiscordClient} guild The guild that it happened in
 */
function HandleReactions(user, reaction, guild) {
	if(user == null || reaction == null) return;

	if(reaction.message.channel.name == 'ticket-center') { // Makes sure that the reaction is in the ticket channel
		for(const ticket in TicketArray) { // Checks if a ticket exists with that emoji id
			if(TicketArray[ticket].emojiid == reaction.emoji.id) {
				StartTicket(user, ticket, guild); // Start ticket
			}
		}
		reaction.users.remove(user.id) // Remove the reaction anyways if it is in ticket center
		return
	}

	if(reaction.message.embeds[0] == null)
		return;
		
	if(reaction.message.embeds[0].title.endsWith('Ticket ' + user.username) && reaction.emoji.id == TicketArray[reaction.message.channel.name.substr(0, reaction.message.channel.name.indexOf('-'))].emojiid) { // A bunch of junk to see if it's a ticket
		ContinueTicket(user, reaction.message.channel.name.substr(0, reaction.message.channel.name.indexOf('-')), reaction.message, guild)
		reaction.users.remove(user.id)
	}
}

/**
 * Returns the current page that the ticket is on
 * @param {message} msg The ticket message
 */
function GetTicketPage(msg) {
	for(const Embed in msg.embeds) {
		if(Embed.title.substring(Embed.title.length - 6, Embed.Title.Length - 2) == 'Page') {
			return Embed.title.substring(Embed.title.length - 1, 0);
		}
	}
}

module.exports = { // All functions available outside of this class
	RegisterNewTicket: RegisterNewTicket,
	StartTicket: StartTicket,
	GetRegisteredTickets: GetRegisteredTickets,
	HandleReactions: HandleReactions,
	GetTicketPage: GetTicketPage,
};