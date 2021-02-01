const redis = require('./../../redis'), Discord = require('discord.js'), CommandHandler = require('../CommandHandler.js'), BaseFunctions = require('../BaseFunctions.js');

module.exports = (client) => {
    redis.expire(message => {
        if(message.startsWith('muted-')) {
            const split = message.split('-')

            const memberId = split[1]
            const guildId = split[2]

            const guild = client.guilds.cache.get(guildId)
            const member = guild.members.cache.get(memberId)

            const role = getRole(guild)

            member.roles.remove(role)
        }
    })
    
    const getRole = (guild) => {
        return guild.roles.cache.find((role) => role.name === 'Muted')
    }

    const giveRole = async member => {
        const role = getRole(member.guild)
        if(role) {
            member.roles.add(role)
            console.log('Muted ' + member.id)
        } else {
            console.log('Could not find muted role')
        }
    }
    
    const onJoin = async member => {
        const {id, guild} = member
    
        const redisClient = await redis()
        try {
            redisClient.get('muted-'.concat(id, "-", guild.id), (err, result) => {
                if(err) {
                    console.error('Redis GET error:', err)
                } else if (result) {
                    giveRole(member)
                }
            })
        } finally {
            redisClient.quit()
        }
    }

    client.on('guildMemberAdd', (member) => {
        onJoin(member)
    })
    
    CommandHandler.RegisterNewCommand('mute', ['Discord Admin'], async (msg, client) => {
        const content = msg.content
        const channel = msg.channel
        const guild = msg.guild
    
        const split = content.trim().split(" ")
        
        if(split.length !== 4) {
            BaseFunctions.EasyEmbedSend(channel, 'Syntax Error', 'Incorrect Syntax, corrent syntax is: !mute <@Player> <duration> <duration type>');
            return
        }
    
        const duration = split[2]
        const type = split[3]
    
        if(isNaN(duration)) {
            BaseFunctions.EasyEmbedSend(channel, 'Syntax Error', 'Did not provide a number for duration, corrent syntax is: !mute <@Player> <duration> <duration type>');
            return
        }
    
        const durations = {
            s: 1,
            sec: 1,
            second: 1,
            m: 60,
            min: 60,
            minute: 60,
            h: 60*60,
            hour: 60*60,
            d: 60*60*24,
            day: 60*60*24,
            life: -1
        }
    
        if(!durations[type]) {
            BaseFunctions.EasyEmbedSend(channel, 'Syntax Error', 'Did not provide a valid duration type, corrent syntax is: !mute <@Player> <duration> <duration type>');
            return
        }
    
        const seconds = duration * durations[type]
        const target = msg.mentions.users.first()
    
        if(!target) {
            BaseFunctions.EasyEmbedSend(channel, 'Syntax Error', 'Did not provide a user to mute, corrent syntax is: !mute <@Player> <duration> <duration type>');
            return
        }
    
        const id = target.id
    
        const targetMember = guild.members.cache.get(id)
        giveRole(targetMember)
    
        const redisClient = await redis()
        try {
            const redisKey = 'muted-'.concat(id, "-", guild.id)
    
            if(seconds > 0) {
                redisClient.set(redisKey, 'true', 'EX', seconds)
            } else {
                redisClient.set(redisKey, 'true')
            }
        } finally {
            redisClient.quit()
        }
    
        BaseFunctions.EasyEmbedSend(channel, 'Command Info', 'Added ' + target.username + ' to the muted list');
    }, 'Mutes a player for the time given.', '!mute <@Player> <duration> <duration type>', 'Deno: !mute @Sim 1 h'); 
}