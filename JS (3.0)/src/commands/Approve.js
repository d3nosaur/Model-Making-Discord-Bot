const CommandHandler = require('../CommandHandler.js'), BaseFunctions = require('../BaseFunctions.js');

/**
 * Approves a Ticket
 */
CommandHandler.RegisterNewCommand('approve', ['Senior Model Maker', 'Head Model Maker', 'Affairs Clearance'], (msg) => {
	const curChannel = msg.channel;
	const approvalChannel = BaseFunctions.GetChannel(curChannel.parent, 'approved-tickets');

	if(!curChannel.name.startsWith('approval-ticket')) {
		BaseFunctions.EasyEmbedSend(curChannel, 'Command Error', 'Command was not sent in an approval ticket.');
		return;
	}

	if(!approvalChannel) {
		BaseFunctions.EasyEmbedSend(curChannel, 'Approval Ticket', 'Can not find approval channel');
		return false;
	}

	BaseFunctions.EasyEmbedSend(approvalChannel, 'Approval Ticket', curChannel.name + ' has been approved by ' + msg.author.username);
	BaseFunctions.ArchiveChannel(curChannel);

	const userEmbed = BaseFunctions.EasyEmbed('Approval Ticket', 'Your approval ticket has been approved by ' + msg.author.username, '#6ad164')

	curChannel.members.forEach(member => {
		if(member.user == undefined || member.user.username == undefined) return;

		if(member.user.username.toLowerCase() == curChannel.name.substr(curChannel.name.length - member.user.username.length).toLowerCase()) {
			member.user.send(userEmbed);
		}
	})
}, 'Approves the ticket that the message was sent in', '!approve', 'Deno: !approve');