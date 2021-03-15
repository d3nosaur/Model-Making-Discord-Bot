const redis = require('./../redis'), Discord = require('discord.js'), BaseFunctions = require('./BaseFunctions.js');

module.exports = (client) => {
    redis.expire(message => {
        if(message.startsWith('trust-')) {
            const split = message.split('-')

            const memberId = split[1]
            const guildId = split[2]

            const guild = client.guilds.cache.get(guildId)
            const member = guild.members.cache.get(memberId)

            giveRole(member)
        }
    })

    const addAllUsers = async (guild) => {
        guild.members.fetch()
            .then(async memberList => {
                memberList.forEach(member => {
                    startShit(member.user, guild)
                });
            })
    }

    const startShit = async (user, guild) => {
        const redisClient = await redis()
        try {
            const redisKey = 'trust-'.concat(user.id, "-", guild.id)

            redisClient.set(redisKey, 'true', 'EX', 2592000)
        } finally {
            redisClient.quit()
        }
    }

    const getRole = (guild) => {
        return guild.roles.cache.find((role) => role.name === 'Trusted')
    }

    const giveRole = async member => {
        const role = getRole(member.guild)
        if(role) {
            member.roles.add(role)
            console.log('Trusted ' + member.id)
        } else {
            console.log('Could not find trusted role')
        }
    }

    async function onJoin(member) {
        const {id, guild} = member

        const redisClient = await redis()
        try {
            redisClient.get('trust-'.concat(id, "-", guild.id), (err, result) => {
                if(err) {
                    console.error('Redis GET error:', err)
                } else if(result == null) {
                    startShit(member, guild)
                }
            })
        } finally {
            redisClient.quit()
        }
    }

    client.on('guildMemberAdd', (member) => {
        onJoin(member)
    })

    //client.guilds.fetch('788595011742597140')
    //    .then(guild => addAllUsers(guild))
}