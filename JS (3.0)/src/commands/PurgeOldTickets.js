const CommandHandler = require('../CommandHandler.js'), BaseFunctions = require('../BaseFunctions.js');


/**
 * Removes all of the channels in categories that include Finished
 */
CommandHandler.RegisterNewCommand('purgeoldtickets', ['Discord Admin'], (msg) => {
	msg.guild.channels.cache.forEach(channel => { // For each channel, check if the category it is in contains 'Finished', if it does, delete it.
        if(channel == null || channel.name == null || channel.parent == null || channel.type != 'text') {
            return;
        }

        if(channel.parent.name.includes('Finished')) {
            channel.delete('Purged by ' + msg.author.username);
        }
    });

    BaseFunctions.EasyEmbedSend(msg.channel, 'Bot Commands', 'Purged old tickets.');
}, 'Removes all of the finished tickets.', '!purgeoldtickets', 'Deno: !purgeoldtickets', "Model Making");