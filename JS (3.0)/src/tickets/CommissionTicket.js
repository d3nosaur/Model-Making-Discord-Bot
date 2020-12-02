const TicketHandler = require('../TicketHandler.js'), BaseFunctions = require('../BaseFunctions.js');

const pages = {};

pages[1] = {
	text: 'This is the ticket for requesting a specialized model to be made for your Custom Class/Ship, \n\n**By continuing you are agreeing to the Terms of Service**.\n\n*React to this message to continue*',
};
pages[2] = {
	text: 'Custom Ship or Custom Class?\n\n *React to this message after you wrote your response.*',
};
pages[3] = {
	text: 'Give me a basic description as to what you want (Preferably with pictures). \n\n*React to this message after you wrote your response.*',
};
pages[4] = {
	text: 'What is the budget for this model? \n\n*React to this message after you wrote your response.*',
};
pages[5] = {
	text: 'Do you have a preferred Model Maker? \n\n*React to this message after you wrote your response.*',
};
pages[6] = {
	text: 'Your answers have been sent to the Model Makers.',
};

TicketHandler.RegisterNewTicket('commission', (msg) => { // Approval Ticket has descriptions
	return true
}, 6, pages, '720828275005587476', ['493223081746235393', '729544201502457918', '493502129915559936', '493223241691955232']);