const CommandHandler = require('../CommandHandler.js'), BaseFunctions = require('../BaseFunctions.js');

/**
 * Puts an embed into the chat, copying the arguments
 */
CommandHandler.RegisterNewCommand('createembed', ['Discord Admin'], (msg) => {
    const colorX = msg.content.indexOf('<'), colorY = msg.content.indexOf('>'); // Finds the coords in the message of the color
    const color = msg.content.substring(colorX + 1, colorY);

    // Finds the coords in the message of the title
    const titleX = msg.content.substring(colorY, msg.content.length).indexOf('<') + colorY + 1, titleY = msg.content.substring(colorY + 1, msg.content.length).indexOf('>') + colorY + 1;
    const title = msg.content.substring(titleX, titleY);

    // Gets everything after the title
    const body = msg.content.substring(titleY + 1, msg.content.length);
    
    if(colorX == -1 || colorY == -1 || titleX == -1 || titleY == -1) { // Makes sure all of the values could be found
      BaseFunctions.EasyEmbedSend("Command Error", 'Failure to create embed, Embed name/color can not be found.');
      return false;
    }

    const embed = BaseFunctions.EasyEmbed(title, body, color); // Sends embed
    msg.channel.send(embed);
}, 'Creates an embed inside of the channel the message was sent in.', '!createembed <html color> <embed name> body', 'Deno: !createembed <#ff3b44> <Discord Info> This is the discord information');