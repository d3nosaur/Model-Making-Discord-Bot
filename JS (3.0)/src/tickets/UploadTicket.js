const Discord = require('discord.js');
const TicketHandler = require('../TicketHandler.js'), BaseFunctions = require('../BaseFunctions.js');

const pages = {};

pages[1] = {
	text: 'This is the CC/CS upload request section. This bot will ask you some finalizing questions about your CC that will then be the information put into the server.\n\n*Ensure that everything you respond with is correct as after you have made a response it can not be edited without making a separate ticket. Along with this make sure that you keep your answers as one message, without creating any extra lines.*\n\n*React to this message to continue*',
};
pages[2] = {
	text: 'Is this a Custom Class or Custom Ship \n\n*React to this message after you wrote your response.*',
};
pages[3] = {
    text: 'What type of Custom Class/Ship is this? Example: Delta-7, Doom\'s unit ARF, 212th Jet Trooper\n\n*React to this message after you wrote your response.*'
}
pages[4] = {
	text: 'What is the normal name you go by in the community \n\n*React to this message after you wrote your response.*',
};
pages[5] = {
    text: 'What is the name that this custom class will go by\n\n*React to this message after you wrote your response.*'
}
pages[6] = {
	text: 'What will the description of your Custom Class be \n\n*React to this message after you wrote your response.*',
};
pages[7] = {
	text: 'What is the workshop link for your model \n\n*React to this message after you wrote your response.*',
};
pages[8] = {
	text: 'What is the MDL of your model (Can by obtained by going into Gmod Spawnmenu, Right Clicking the Model, and Clicking Copy to Clipboard) \n\n*React to this message after you wrote your response.*',
};
pages[9] = {
	text: 'Is this a rework, if so what is the original job \n\n*React to this message after you wrote your response.*',
};
pages[10] = {
	text: 'Your responses have been sent to the Developers',
};

// Warning, don't try to mess with the stuff below this unless you understand async threads a lot more than I do
function CalcResponse(msg, Responses, Answer) {
    if(Answer == undefined) return false

    let NumberText; // Turn the page number into the pages question

    switch(parseInt(msg.embeds[0].footer.text.substr(6, 1), 10) - 1) {
        case 1:
            NumberText = '1: Custom Class or Custom Ship'
            break;
        case 2:
            NumberText = '2: Type'
            break;
        case 3:
            NumberText = '3: Normal Name'
            break;
        case 4:
            NumberText = '4: Custom Class Name'
            break;
        case 5:
            NumberText = '5: Description'
            break;
        case 6:
            NumberText = '6: Workshop Link'
            break;
        case 7:
            NumberText = '7: MDL'
            break;
        case 8:
            NumberText = '8: Rework'
            break;
    }

    if(Responses == undefined) { // If responses doesnt exist, create it
        const Embed = new Discord.MessageEmbed() // Create the embed and add a field for the answer
            .setColor('#56c4f0')
            .setTitle('Responses')
            .setDescription('A List of the Responses for this Upload Ticket')
            .addFields(
                { name: NumberText, value: Answer.content},
            )
        msg.channel.send({embed: Embed}); // Send the embed

        Answer.delete(); // Delete the message for the answer

        return true // Continue to next page
    } else { // If the responses do exist
        const Embed = Responses.embeds[0]; // Grab the embed
        Embed.addField(NumberText, Answer.content) // Add the field for the answer
        Responses.edit({embed: Embed}); // Edit the embed

        Answer.delete(); // Delete the answer message

        return true // Continue
    }
}

TicketHandler.RegisterNewTicket('upload', async (msg) => { // Approval Ticket has descriptions | Upload Ticket is complicated because we need to log the answers
    if(msg.embeds[0].footer.text.substr(6, 1) == 1) return true // If its the first page don't need to log answer because there wont be an answer

    let Responses; // Overall Responses Message
    let Answer; // Answer to current question

    return await msg.channel.messages.fetch({ limit: 100 }).then( async (messages) => {
        messages.forEach(message => { // Try to find the responses message
            if(message.author.bot && message.embeds[0].title == 'Responses') {
                Responses = message
            }
            if(!message.author.bot) { // Find any answer that isnt from a bot, any one that applies here should be the answer
                Answer = message
            }
        });
        const response = CalcResponse(msg, Responses, Answer) // Edit responses message to include new answer
        return response
    });
}, 10, pages, '720828274980421742', ['493223081746235393', '729544201502457918', '493502129915559936']);