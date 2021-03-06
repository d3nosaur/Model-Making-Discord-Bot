const Discord = require('discord.js')

const CommandHandler = require('./src/CommandHandler.js')
const TicketHandler = require('./src/TicketHandler.js');
const ReactionRoleHandler = require('./src/ReactionRoleHandler.js')

const BaseFunctions = require('./src/BaseFunctions.js');
const Client = new Discord.Client({ partials: ["MESSAGE", "CHANNEL", "REACTION"], fetchAllMembers: true });
const config = require('./config.json')

Client.login(config.token); // Input login code

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
const Mute = require('./src/commands/Mute.js')
require('./src/commands/Unmute.js')
const TicTacToe = require('./src/commands/TicTacToe.js');

// Tickets
require('./src/tickets/ApprovalTicket.js');
require('./src/tickets/CommissionTicket.js');
require('./src/tickets/UploadTicket.js')

require('./src/reactionrole/MemberReaction.js')
require('./src/reactionrole/SneakPeakReaction.js')

const TrustedMember = require('./src/TrustedMember.js');

Client.on('message', message => { // Command Handler | Whenever someone sends a message it redirects the message to the Command Handler.
	CommandHandler.HandleMessage(Client, message);
});

Client.on('ready', async () => {
    console.log('The client is ready!')
  
    Mute(Client)
    TrustedMember(Client)
    TicTacToe(Client)
})

Client.on("messageReactionAdd", async (reaction, user) => { // Ticket Handler | Whenever someone reacts to a message it tells the Ticket Handler to handle it
    if (user.bot) // If a bot reacted, disregard
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
    //reaction.message.react(reaction.emoji); // Was used to initially give the tickets their reactions

    ReactionRoleHandler.HandleReactions(user, reaction, reaction.message.guild);
	TicketHandler.HandleReactions(user, reaction, reaction.message.guild); 
});

Client.on("messageReactionRemove", async (reaction, user) => {
    if(user.bot)
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
    //reaction.message.react(reaction.emoji); // Was used to initially give the tickets their reactions

    ReactionRoleHandler.HandleRemoveReactions(user, reaction, reaction.message.guild);  
})