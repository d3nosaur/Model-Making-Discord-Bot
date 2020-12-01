const Discord = require('discord.js'), CommandHandler = require('./src/CommandHandler.js'), TicketHandler = require('./src/TicketHandler.js');
const BaseFunctions = require('./src/BaseFunctions.js');
const Client = new Discord.Client({ partials: ["MESSAGE", "CHANNEL", "REACTION"] });

Client.once('ready', () => {
	console.log('Ready!');
});

Client.login(''); // Input login code

// Commands
require('./src/commands/HelpCommand.js');
require('./src/commands/BotAliveCommand.js');
require('./src/commands/QuestionCommand.js');
require('./src/commands/CreateEmbed.js');
//require('./src/commands/PurgeOldTickets.js');
require('./src/commands/Archive.js');
require('./src/commands/Approve.js');
require('./src/commands/Claim.js');
require('./src/commands/Unclaim.js');
// Tickets
require('./src/tickets/ApprovalTicket.js');
require('./src/tickets/CommissionTicket.js');
require('./src/tickets/UploadTicket.js')

Client.on('message', message => { // Command Handler
	CommandHandler.HandleMessage(Client, message);
});

Client.on("messageReactionAdd", async (reaction, user) => { // Ticket Handler
    if (user.bot)
        return;

    if (reaction.partial) {
        try {
            await reaction.fetch();
        }
        catch (error) {
            BaseFunctions.ConsoleError('Something went wrong when fetching the message: ', error);
            return;
        }
    }

    //reaction.message.react(reaction.emoji);
	TicketHandler.HandleReactions(user, reaction, reaction.message.guild);
});