const TicketHandler = require('../TicketHandler.js'), BaseFunctions = require('../BaseFunctions.js');

const pages = {};

pages[1] = {
	text: 'This is the Custom Class/Ship approving section. This bot will ask you a couple of questions about your Custom Class/Ship then when a member of Affairs, Development, the Head Model Maker, or the DVL sees this you will get a response.\n\n*Getting a response shouldn\'t take longer than 3 days, if it does take longer, mention one of the people above*\n\n*React to this message if you are ready to begin*',
};
pages[2] = {
	text: 'Custom Ship or Custom Class? \n\n*React to this message after you wrote your response.*',
};
pages[3] = {
	text: 'What Job/Ship will this be based off of? \n\n*React to this message after you wrote your response.*',
};
pages[4] = {
	text: 'Give me a short description of you Custom Class/Ship (Including Pictures or a Workshop Addon). \n\n*React to this message after you wrote your response.*',
};
pages[5] = {
	text: 'Your responses have been sent to Affairs for approval',
};

TicketHandler.RegisterNewTicket('approval', (msg) => {
	return true
}, 5, pages, '720828274946867220', ['493223081746235393', '729544201502457918', '493502129915559936']);