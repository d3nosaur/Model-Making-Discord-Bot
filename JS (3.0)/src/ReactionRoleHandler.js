const Functions = require('./BaseFunctions.js');

const ReactionRoleArray = {};

function RegisterNewReactionRole(name, emojiid, messageid, roleid) {
    if(ReactionRoleArray[name]) {
        Functions.ConsoleError('Reaction Role ' + name + ' can not be initialized due to it already existing.');
		return false;
    }

    ReactionRoleArray[name] = {
        name: name,
        emojiid: emojiid,
        messageid: messageid,
        roleid: roleid,
    };
    return true;
}

function HandleReactions(user, reaction, guild) {
    if(user == null || reaction == null) {
        Functions.ConsoleError('Role Reaction ' + reaction.emoji.id + ' returned null.');
        return;
    }

    for(const reactionrole in ReactionRoleArray) {
        if(ReactionRoleArray[reactionrole].messageid == reaction.message.id) {
            if(ReactionRoleArray[reactionrole].emojiid != reaction.emoji.id) {
                reaction.users.remove(user.id);
                return;
            }
        }

        if(ReactionRoleArray[reactionrole].emojiid == reaction.emoji.id && ReactionRoleArray[reactionrole].messageid == reaction.message.id) {
            const member = guild.member(user);

            if(member == null)
                Functions.ConsoleError('Role Reaction User Null')

            member.roles.add(ReactionRoleArray[reactionrole].roleid, "Reaction Roles");
            
            console.log('Applying roles to user')
            return;
        }
    }
}

function HandleRemoveReactions(user, reaction, guild) {
    if(user == null || reaction == null) {
        Functions.ConsoleError('Reaction Remove ' + reaction.emoji.id + ' returned null.');
        return;
    }

    for(const reactionrole in ReactionRoleArray) {
        if(ReactionRoleArray[reactionrole].messageid == reaction.message.id) {
            if(ReactionRoleArray[reactionrole].emojiid != reaction.emoji.id) {
                reaction.users.remove(user.id);
                return;
            }
        }

        if(ReactionRoleArray[reactionrole].emojiid == reaction.emoji.id && ReactionRoleArray[reactionrole].messageid == reaction.message.id) {
            const member = guild.member(user);

            if(member == null)
                Functions.ConsoleError('Role Reaction User Null')

            member.roles.remove(ReactionRoleArray[reactionrole].roleid, "Reaction Roles");
            
            console.log('Removing Roles from User')
            return;
        }
    }
}

function GetRegisteredTickets() {
    return TicketArray;
}

module.exports = {
    RegisterNewReactionRole: RegisterNewReactionRole,
    GetRegisteredTickets: GetRegisteredTickets,
    HandleReactions: HandleReactions,
    HandleRemoveReactions: HandleRemoveReactions,
};