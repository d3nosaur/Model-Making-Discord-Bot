const CommandHandler = require('../CommandHandler.js'), BaseFunctions = require('../BaseFunctions.js');

/**
 * Approves a Ticket
 */
CommandHandler.RegisterNewCommand('approve', ['Senior Model Maker', 'Head Model Maker', 'Affairs Clearance'], (msg) => {
	const curChannel = msg.channel; // Get the channel the message was sent in
	const approvalChannel = BaseFunctions.GetChannel(curChannel.parent, 'approved-tickets'); // Get the approval ticket logs channel

	if(!curChannel.name.startsWith('approval-ticket')) { // If the message channel isn't an approval ticket return
		BaseFunctions.EasyEmbedSend(curChannel, 'Command Error', 'Command was not sent in an approval ticket.');
		return;
	}

	if(!approvalChannel) { // If the bot can't find the logs channel return
		BaseFunctions.EasyEmbedSend(curChannel, 'Approval Ticket', 'Can not find approval channel');
		return false;
	}

	BaseFunctions.EasyEmbedSend(approvalChannel, 'Approval Ticket', curChannel.name + ' has been approved by ' + msg.author.username); // Say that the ticket was approved

	const userEmbed = BaseFunctions.EasyEmbed('Approval Ticket', 'Your approval ticket has been approved by ' + msg.author.username, '#6ad164') // Create an embed saying that the ticket was approved

	curChannel.members.forEach(member => { // Iterate over all members that can see the channel
		if(member.user == undefined || member.user.username == undefined) return;

		if(member.user.username.toLowerCase() == curChannel.name.substr(curChannel.name.length - member.user.username.length).toLowerCase()) { // If the cur member is the one that created the ticket send them the approval message
			member.user.send(userEmbed);
		}
	})

	BaseFunctions.ArchiveChannel(curChannel); // Archive the approval ticket
}, 'Approves the ticket that the message was sent in', '!approve', 'Deno: !approve');