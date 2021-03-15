const Discord = require('discord.js'), CommandHandler = require('../CommandHandler.js'), BaseFunctions = require('../BaseFunctions.js');

module.exports = (client) => {
    const curGames = {}

    const clearBoard = (guild) => {
        curGames[guild] = {
            active: false,
            ply1: null,
            ply2: null,
            lastmessage: null,
            board: [0,0,0,0,0,0,0,0,0],
            timer: null,
            curSpot: 0,
            accepted: false,
            nextTurn: 1,
        }
    }

    client.guilds.cache.array().forEach(guild => {
        clearBoard(guild)
    });

    const getEmojiType = (value) => {
        switch(value) {
            case 0:
                return ":black_large_square:"
            case 1:
                return ":x:"
            case 2:
                return ":o:"
            case 3:
                return ":grey_question:"
        }
    }

    const sendBoard = (guild, channel) => {
        const boardEmbed = new Discord.MessageEmbed() // Creates an embed
            .setTitle('Tic Tac Toe')
            .setColor('#a430fc')
            .setDescription('Match between ' + curGames[guild].ply1.user.username + " (:x:) and " + curGames[guild].ply2.user.username + " (:o:)");
        
        if(curGames[guild].nextTurn == 1) {
            boardEmbed.addField("Instructions", "Move :grey_question: with the arrow to where you want to place your piece,\nif you want to place, press :white_check_mark:.\n\n**" + curGames[guild].ply1.user.username + "** is up next")
        } else {
            boardEmbed.addField("Instructions", "Move :grey_question: with the arrow to where you want to place your piece,\nif you want to place, press :white_check_mark:.\n\n**" + curGames[guild].ply2.user.username + "** is up next")
        }
        
        let board = curGames[guild].board
        board[curGames[guild].curSpot] = 3
        const message = getEmojiType(board[0]) + getEmojiType(board[1]) + getEmojiType(board[2]) + "\n" + getEmojiType(board[3]) + getEmojiType(board[4]) + getEmojiType(board[5]) + "\n" + getEmojiType(board[6]) + getEmojiType(board[7]) + getEmojiType(board[8])

        curGames[guild].lastmessage.delete()

        channel.send(message, boardEmbed)
            .then(function(message) {
                curGames[guild].lastmessage = message
                message.react('▶')
                message.react('✅')
            })
    }

    const evaluatePlace = (guild, channel) => { // returns 0:active, 1:ply1 won, 2:ply2 won, 3:draw
        const board = curGames[guild].board
        for(var i=0; i<3; i++) {
            if(board[0+(i*3)] == board[1+(i*3)] && board[1+(i*3)] == board[2+(i*3)] && board[0+(i*3)] != 0) {
                return board[0+(i*3)]
            } else if(board[i] == board[i+3] && board[i+3] == board[i+6] && board[i] != 0) {
                return board[i]
            }
        }
        if(board[0] == board[4] && board[4] == board[8] && board[0] != 0) {
            return board[0]
        } else if(board[2] == board[4] && board[4] == board[6] && board[2] != 0) {
            return board[2]
        }

        let isDraw = true
        for(var j=0; j<9; j++) {
            if(board[j] == 0) {
                isDraw = false
                break
            }
        }

        if(isDraw) {
            return 3
        } else {
            return 0
        }
    }

    const doPlace = (guild, channel) => {
        if(curGames[guild].nextTurn == 1) {
            curGames[guild].board[curGames[guild].curSpot] = 1
            curGames[guild].nextTurn = 2
        } else {
            curGames[guild].board[curGames[guild].curSpot] = 2
            curGames[guild].nextTurn = 1
        }
        
        const board = curGames[guild].board
        switch(evaluatePlace(guild, channel)) {
            case 0:
                movePlacer(guild, channel, curGames[guild].curSpot)
                break
            case 1:
                curGames[guild].lastmessage.delete()
                channel.send(getEmojiType(board[0]) + getEmojiType(board[1]) + getEmojiType(board[2]) + "\n" + getEmojiType(board[3]) + getEmojiType(board[4]) + getEmojiType(board[5]) + "\n" + getEmojiType(board[6]) + getEmojiType(board[7]) + getEmojiType(board[8]))
                BaseFunctions.EasyEmbedSend(channel, "Tic Tac Toe", "**" + curGames[guild].ply1.user.username + "** has beaten **" + curGames[guild].ply2.user.username + "** in Tic Tac Toe.")
                clearBoard(guild)
                break
            case 2:
                curGames[guild].lastmessage.delete()
                channel.send(getEmojiType(board[0]) + getEmojiType(board[1]) + getEmojiType(board[2]) + "\n" + getEmojiType(board[3]) + getEmojiType(board[4]) + getEmojiType(board[5]) + "\n" + getEmojiType(board[6]) + getEmojiType(board[7]) + getEmojiType(board[8]))
                BaseFunctions.EasyEmbedSend(channel, "Tic Tac Toe", "**" + curGames[guild].ply2.user.username + "** has beaten **" + curGames[guild].ply1.user.username + "** in Tic Tac Toe.")
                clearBoard(guild)
                break
            case 3:
                curGames[guild].lastmessage.delete()
                channel.send(getEmojiType(board[0]) + getEmojiType(board[1]) + getEmojiType(board[2]) + "\n" + getEmojiType(board[3]) + getEmojiType(board[4]) + getEmojiType(board[5]) + "\n" + getEmojiType(board[6]) + getEmojiType(board[7]) + getEmojiType(board[8]))
                BaseFunctions.EasyEmbedSend(channel, "Tic Tac Toe", "This game ended in a draw.")
                clearBoard(guild)
                break
        }
    }

    const movePlacer = (guild, channel, curSpot) => {
        for(var i=curSpot+1; i<10; i++) {
            if(i==9) {
                movePlacer(guild, channel, -1)
                return;
            }else if(curGames[guild].board[i] == 0) {
                if(curGames[guild].board[curGames[guild].curSpot] == 3) {
                    curGames[guild].board[curGames[guild].curSpot] = 0
                }

                curGames[guild].board[i] = 3
                curGames[guild].curSpot = i
                sendBoard(guild, channel)
                return
            }
        }
    }

    client.on("messageReactionAdd", async (reaction, user) => {
        if(user.bot)
            return;

        if (reaction.partial) { 
            try {
                await reaction.fetch();
            }
            catch (error) {
                BaseFunctions.ConsoleError('Something went wrong when fetching the message: ', error);
                return;
            }
        }
        
        for(const guild in curGames) {
            if(curGames[guild] == null || curGames[guild].lastmessage == null || reaction == null || reaction.message == null)
                continue;

            if(curGames[guild].lastmessage.id == reaction.message.id) {
                curGames[guild].timer = Date.now()
                if(curGames[guild].accepted == false) { // The message thats being reacted to is the invite message
                    if(user.id == curGames[guild].ply2.id) { // Right user
                        if(reaction.emoji.identifier == '%E2%9C%85') { // Accepted
                            curGames[guild].accepted = true
                            sendBoard(guild, reaction.message.channel)
                        } else if(reaction.emoji.identifier == '%E2%9D%8C') { // Denied
                            curGames[guild].lastmessage.delete()
                            clearBoard(guild)
                            BaseFunctions.EasyEmbedSend(reaction.message.channel, "Tic Tac Toe", "The match has been declined")
                        } else { // Not an answer
                            reaction.users.remove(user.id)
                        }
                    } else { // Wrong user
                        reaction.users.remove(user.id)
                    }
                } else { // Game is active
                    let playerID = null
                    if(curGames[guild].nextTurn == 1) {
                        playerID = curGames[guild].ply1.id
                    } else {
                        playerID = curGames[guild].ply2.id
                    }

                    if(user.id == playerID) { // Its the correct user
                        if(reaction.emoji.identifier == '%E2%9C%85') {
                            doPlace(guild, reaction.message.channel)
                        } else if(reaction.emoji.identifier == '%E2%96%B6') {
                            movePlacer(guild, reaction.message.channel, curGames[guild].curSpot)
                        } else {
                            reaction.users.remove(user.id)
                        }
                    } else {
                        reaction.users.remove(user.id)
                    }
                }
                return;
            } 
        }
    })

    CommandHandler.RegisterNewCommand("tictactoe", ['Everyone'], (msg) => {
        const {content, channel, guild} = msg;

        if(curGames[guild].active) {
            if(Date.now() - curGames[guild].timer >= 30000) {
                clearBoard(guild)
            } else {
                BaseFunctions.EasyEmbedSend(channel, 'Command Error', 'There is already an active game in this guild.');
                return
            }
        }

        const split = content.trim().split(" ")

        if(split.length !== 2) {
            BaseFunctions.EasyEmbedSend(channel, 'Syntax Error', 'Incorrect Syntax, corrent syntax is: !tictactoe <@Player>');
            return
        }
        
        const target = msg.mentions.users.first()
        if(!target) {
            BaseFunctions.EasyEmbedSend(channel, 'Syntax Error', 'Did not provide a user to mute, corrent syntax is: !tictactoe <@Player>');
            return
        }
        if(target.bot) {
            BaseFunctions.EasyEmbedSend(channel, 'Syntax Error', 'Robots do not like this game');
            return
        }
        if(target == msg.author) {
            BaseFunctions.EasyEmbedSend(channel, 'Syntax Error', 'You need friends to play this game');
            return
        }

        const id = target.id
    
        const targetMember = guild.members.cache.get(id)

        curGames[guild].active = true
        curGames[guild].ply1 = guild.members.cache.get(msg.author.id)
        curGames[guild].ply2 = targetMember
        curGames[guild].timer = Date.now()

        BaseFunctions.EasyEmbedSend(channel, "Tic Tac Toe", "<@" + id + "> You have been challenged to a Tic Tac Toe match\nReact with :white_check_mark: to accept or :x: to deny.")
            .then(function(message) {
                curGames[guild].lastmessage = message
                message.react('✅')
                message.react('❌')
            })
    }, "Starts a game of Tic Tac Toe", "!tictactoe <opponent>", "Deno: !tictactoe @Sim", "Games")
}