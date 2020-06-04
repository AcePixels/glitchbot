const { MessageEmbed } = require("discord.js")
const { getColor, getMember } = require("../utils.js")
const { getBalance, createUser, userExists, updateBalance, getBankBalance, getMaxBankBalance, getXp, formatBet, userExistsID, updateBalanceID, createUserID } = require("../economy/utils.js")

module.exports = {
    name: "balance",
    description: "check your balance",
    category: "money",
    run: async (message, args) => {
        
        if (!userExists(message.member)) {
            createUser(message.member)
        }

        if (message.member.user.id == "608127385120014386" && args.length == 2) {
            let target = message.mentions.members.first();
            let id = false

            if (!target) {
                target = args[0]
                if (!userExistsID(target)) {
                    return message.channel.send("<a:1603_Animated_Cross:716318362644381757> Invalid user - you must tag the user for this command or use a user ID");
                }
                id = true
            }

            if (args[1] == "reset") {
                if (id) {
                    createUserID(target)
                    return message.react('717201156681629737')
                } else {
                    createUser(target)
                    return message.react('717201156681629737')
                }
            }
    
            const amount = parseInt(args[1])

            if (id) {
                updateBalanceID(target, amount)
            } else {
                updateBalance(target, amount)
            }


            return message.react('717201156681629737')
        }

        const color = getColor(message.member);

        if (args.length >= 1) {
            let target = message.mentions.members.first();

            if (!target) {
                target = getMember(message, args[0])
            }

            if (!target) {
                return message.channel.send("<a:1603_Animated_Cross:716318362644381757> Invalid user")
            }

            if (!userExists(target)) createUser(target)

            const embed = new MessageEmbed()
                .setColor(color)
                .setTitle(target.user.tag)
                .setDescription("💰 Cash $**" + getBalance(target).toLocaleString() + "**\n" +
                    "💳 Bank $**" + getBankBalance(target).toLocaleString() + "** / **" + getMaxBankBalance(target).toLocaleString() + "**")

                .setFooter("XP: " + getXp(target).toLocaleString())

            return message.channel.send(embed).catch(() => {
                return message.channel.send("<a:1603_Animated_Cross:716318362644381757> I may be lacking permission: 'EMBED_LINKS'");
            });

        }

        const embed = new MessageEmbed()
            .setColor(color)
            .setTitle(message.member.user.tag)
            .setDescription("💰 Cash: $**" + getBalance(message.member).toLocaleString() + "**\n" +
                    "💳 Bank: $**" + getBankBalance(message.member).toLocaleString() + "** / $**" + getMaxBankBalance(message.member).toLocaleString() + "**")

            .setFooter("XP: " + getXp(message.member).toLocaleString())

        message.channel.send(embed).catch(() => {
            return message.channel.send("<a:1603_Animated_Cross:716318362644381757> I may be lacking permission: 'EMBED_LINKS'");
        });

    }
}