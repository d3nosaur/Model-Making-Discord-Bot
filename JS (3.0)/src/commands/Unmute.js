const redis = require('./../../redis'), CommandHandler = require('../CommandHandler.js'), BaseFunctions = require('../BaseFunctions.js');

const getRole = (guild) => {
    return guild.roles.cache.find((role) => role.name === 'Muted')
}

CommandHandler.RegisterNewCommand('unmute', ['Discord Admin'], async (msg) => {
    const content = msg.content
    const guild = msg.guild
    const split = content.trim().split(" ")

    if(split.length !== 2) {
        BaseFunctions.EasyEmbedSend(channel, 'Syntax Error', 'Incorrect Syntax, corrent syntax is: !unmute <@Player>');
        return
    }

    const target = msg.mentions.users.first()
    const targetMember = guild.members.cache.get(target.id)

    BaseFunctions.EasyEmbedSend(msg.channel, 'Command Info', target.username + ' has been unmuted.');
    
    const redisClient = await redis()
    try {
        const redisKey = 'muted-'.concat(target.id, "-", guild.id)
        redisClient.set(redisKey, 'true', 'EX', 1)
    } finally {
        redisClient.quit()
    }
}, 'Unmutes a player.', '!unmute <player>', 'Deno: !unmute @Sim', "Admin");