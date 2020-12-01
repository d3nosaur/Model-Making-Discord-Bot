const CommandHandler = require('../CommandHandler.js'), BaseFunctions = require('../BaseFunctions.js');

/**
 * Puts an embed into the chat, copying the arguments
 */
CommandHandler.RegisterNewCommand('createembed', ['Discord Admin'], (msg) => { // I'm not sure why this code is so scuffed but it works, I think it tries to get the rough position then gets the more accurate one after
    const colorX = msg.content.indexOf('<'), colorY = msg.content.indexOf('>'); 
    const color = msg.content.substring(colorX + 1, colorY);

    const titleX = msg.content.substring(colorY, msg.content.length).indexOf('<') + colorY + 1, titleY = msg.content.substring(colorY + 1, msg.content.length).indexOf('>') + colorY + 1;
    const title = msg.content.substring(titleX, titleY);

    const body = msg.content.substring(titleY + 1, msg.content.length);

    if(colorX == -1 || colorY == -1 || titleX == -1 || titleY == -1) {
      BaseFunctions.EasyEmbedSend("Command Error", 'Failure to create embed, Embed name/color can not be found.');
      return false;
    }

    const embed = BaseFunctions.EasyEmbed(title, body, color);
    msg.channel.send(embed);
}, 'Creates an embed inside of the channel the message was sent in.', '!createembed <html color> <embed name> body', 'Deno: !createembed <#ff3b44> <Discord Info> This is the discord information');