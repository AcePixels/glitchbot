const { getMember, getColor } = require("../utils.js")
const { getBalance, createUser, updateBalance, userExists, formatBet, getVoteMulti } = require("../economy/utils.js")
const { MessageEmbed } = require("discord.js")
const shuffle = require("shuffle-array")
const Discord = require("discord.js");

const cooldown = new Map();

const waiting = new Discord.Collection();


module.exports = {
    name: "coinflip",
    description: "flip a coin, double or nothing",
    category: "money",
    run: async (message, args) => {

        if (!userExists(message.member)) {
            createUser(message.member)
        }

        let color = getColor(message.member);

        if (args.length == 1) {

            if (args[0].toLowerCase() == "accept") {
                if (waiting.get(message.member.user.id)) {
    
                    if (!getMember(message, waiting.get(message.member.user.id).challenger)) return
    
                    const challenger = getMember(message, waiting.get(message.member.user.id).challenger)
                    const bet = waiting.get(message.member.user.id).bet
                    const choice = waiting.get(message.member.user.id).choice
    
                    waiting.delete(message.member.user.id)
    
                    if (getBalance(challenger) < bet || getBalance(message.member) < bet) {
                        return message.channel.send("<a:1603_Animated_Cross:716318362644381757> error placing bets")
                    }
    
                    updateBalance(challenger, getBalance(challenger) - bet)
                    updateBalance(message.member, getBalance(message.member) - bet)
    
                    const lols = ["Heads", "Tails"]
    
                    const choice1 = shuffle(lols)[Math.floor(Math.random() * lols.length)]
            
                    let winner
                    let loser
            
                    if (choice == choice1) {
                        winner = challenger.user.tag
                        color = challenger.displayHexColor
                        loser = message.member.user.tag
                        updateBalance(challenger, getBalance(challenger) + (bet * 2))
                    } else {
                        winner = message.member.user.tag
                        color = message.member.displayHexColor
                        loser = challenger.user.tag
                        updateBalance(message.member, getBalance(message.member) + (bet * 2))
                    }
                    
                    let choice2
    
                    if (choice == "Heads") {
                        choice2 = "Tails"
                    } else {
                        choice2 = "Heads"
                    }
            
            
                    let embed = new MessageEmbed()
                        .setColor(color)
                        .setTitle("Coinflip")
                        .setDescription("*Tossing..* " + "\n\n" + 
                            "**" + challenger.user.tag + "** " + choice + "\n" +
                            "**" + message.member.user.tag + "** " + choice2 + "\n\n" +
                            "**Bet** $" + bet.toLocaleString())
            
                        .setFooter(challenger.user.tag + " | Created By Jeremy#6414")
                    
                    message.channel.send(embed).then(m => {
            
                        embed.setDescription("**Landed On** " + choice1 + "\n\n" + 
                            "**" + challenger.user.tag + "** " + choice + "\n" +
                            "**" + message.member.user.tag + "** " + choice2 + "\n\n" +
                            "**Bet** $" + bet.toLocaleString())
                
                        setTimeout(() => {
                            m.edit(embed).then(() => {
    
                                embed.addField("**Winner**", winner + " +$" + bet.toLocaleString())
                                embed.addField("**Loser**", loser)
    
                                setTimeout(() => {
                                    m.edit(embed)
                                }, 1000)
                            })
                        }, 1500)
                    }).catch(() => {
                        return message.channel.send("<a:1603_Animated_Cross:716318362644381757> I may be lacking permission: 'EMBED_LINKS'");
                    });
                    return
                }
            }

        }

        if (cooldown.has(message.member.id)) {
            const init = cooldown.get(message.member.id)
            const curr = new Date()
            const diff = Math.round((curr - init) / 1000)
            const time = 10 - diff

            const minutes = Math.floor(time / 60)
            const seconds = time - minutes * 60

            let remaining

            if (minutes != 0) {
                remaining = `${minutes}m${seconds}s`
            } else {
                remaining = `${seconds}s`
            }
            return message.channel.send("<a:1603_Animated_Cross:716318362644381757> Still on cooldown for " + remaining );
        }

        if (args.length != 2 && args.length != 3) {
            const embed = new MessageEmbed()
                .setTitle("Coinflip Help")
                .setColor(color)
                .addField("Usage", "/coinflip <heads/tails> <bet>\n" +
                    "/coinflip <user> <heads/tails> <bet>")
                .addField("Help", "with coinflip you can play against the bot or against another user\n" +
                    "when playing against another user they must have enough money for the bet\n" +
                    "when playing against another user you will not receive a 20% vote bonus")
                .addField("Examples", "/coinflip heads 100\n/coinflip member tails 500")
                .setFooter("Created By Jeremy#6414")

            return message.channel.send(embed).catch(() => message.channel.send("<a:1603_Animated_Cross:716318362644381757> /coinflip <h/t> <bet> | /coinflip <user> <h/t> <bet>"))
        }

        if (args.length == 3) {

            let target = message.mentions.members.first()

            if (!target) {
                target = getMember(message, args[0])
            }

            if (!target) {
                return message.channel.send("<a:1603_Animated_Cross:716318362644381757> Invalid user");
            }

            if (message.member == target) {
                return message.channel.send("<a:1603_Animated_Cross:716318362644381757> Invalid user");
            }

            if (args[1].toLowerCase() == "t") args[1] = "tails"

            if (args[1].toLowerCase() == "h") args[1] = "heads"

            if (args[1].toLowerCase() != "tails" && args[1].toLowerCase() != "heads") {
                return message.channel.send("<a:1603_Animated_Cross:716318362644381757> /coinflip <h/t> <bet> | /coinflip <user> <h/t> <bet>")
            }

            if (args[2] == "all") {
                args[2] = getBalance(message.member)
            }
    
            if (args[2] == "half") {
                args[2] = getBalance(message.member) / 2
            }
    
            if (isNaN(args[2]) || parseInt(args[2]) <= 0) {
                if (!isNaN(formatBet(args[2]) || !parseInt(formatBet[args[2]]))) {
                    args[2] = formatBet(args[2])
                } else {
                    return message.channel.send("<a:1603_Animated_Cross:716318362644381757> /coinflip <h/t> <bet> | /coinflip <user> <h/t> <bet>")
                }
            }

            const bet = (parseInt(args[2]));

            if (bet <= 0) {
                return message.channel.send("<a:1603_Animated_Cross:716318362644381757> /coinflip <h/t> <bet> | /coinflip <user> <h/t> <bet>")
            }

            if (bet > getBalance(message.member)) {
                return message.channel.send("<a:1603_Animated_Cross:716318362644381757> You cannot afford this bet")
            }

            if (!userExists(target)) createUser(target)

            if (bet > getBalance(target)) {
                return message.channel.send("<a:1603_Animated_Cross:716318362644381757> They cannot afford this bet")
            }

            if (waiting.get(target.user.id)) {
                return message.channel.send("<a:1603_Animated_Cross:716318362644381757> They have already been invited to a game")
            }

            cooldown.set(message.member.id, new Date());

            setTimeout(() => {
                cooldown.delete(message.member.id);
            }, 10000);

            const id = Math.random()

            const obj = {
                challenger: message.member.user.id,
                choice: args[1].toLowerCase(),
                bet: bet,
                id: id
            }

            waiting.set(target.user.id, obj)

            setTimeout(() => {
                if (waiting.get(target.user.id) && waiting.get(target.user.id).id == id && waiting.get(target.user.id).challenger == message.member.user.id && waiting.get(target.user.id).choice == args[1].toLowerCase() && waiting.get(target.user.id).bet == bet) {
                    waiting.delete(target.user.id)
                    message.channel.send(target.user.toString() + " game expired")
                }
            }, 15000)

            return message.channel.send(target.user.toString() + " You have received a coinflip challenge from " + message.member.user.toString() + " worth $" + bet.toLocaleString() + "\nYou have 15 seconds to accept with /cf accept")

        }

        if (args[0].toLowerCase() == "t") args[0] = "tails"

        if (args[0].toLowerCase() == "h") args[0] = "heads"

        if (args[0].toLowerCase() != "tails" && args[0].toLowerCase() != "heads") {
            return message.channel.send("<a:1603_Animated_Cross:716318362644381757> /coinflip <h/t> <bet> | /coinflip <user> <h/t> <bet>")
        }

        if (args[1] == "all") {
            args[1] = getBalance(message.member)
        }

        if (args[1] == "half") {
            args[1] = getBalance(message.member) / 2
        }

        if (isNaN(args[1]) || parseInt(args[1]) <= 0) {
            if (!isNaN(formatBet(args[1]) || !parseInt(formatBet[args[1]]))) {
                args[1] = formatBet(args[1])
            } else {
                return message.channel.send("<a:1603_Animated_Cross:716318362644381757> /coinflip <h/t> <bet> | /coinflip <user> <h/t> <bet>")
            }
        }

        const bet = (parseInt(args[1]));

        if (bet <= 0) {
            return message.channel.send("<a:1603_Animated_Cross:716318362644381757> /coinflip <h/t> <bet> | /coinflip <user> <h/t> <bet>")
        }

        if (bet > getBalance(message.member)) {
            return message.channel.send("<a:1603_Animated_Cross:716318362644381757> you cannot afford this bet")
        }

        cooldown.set(message.member.id, new Date())

        setTimeout(() => {
            cooldown.delete(message.member.id);
        }, 10000);

        updateBalance(message.member, getBalance(message.member) - bet)

        const lols = ["Heads", "Tails"]

        const choice = shuffle(lols)[Math.floor(Math.random() * lols.length)]

        let win = false

        if (args[0] == choice) {
            win = true
            updateBalance(message.member, getBalance(message.member) + (bet * 2))
        }

        delete lols
        delete choice

        let voted = false
        let voteMulti = 0

        if (win) {
            voteMulti = await getVoteMulti(message.member)

            if (voteMulti > 0) {
                voted = true
            }

            if (voted) {
                updateBalance(message.member, getBalance(message.member) + Math.round((bet * 2) * voteMulti))
            }
        }

        const embed = new MessageEmbed()
            .setColor(color)
            .setTitle("Coinflip | " + message.member.user.username)
            .setDescription("*Tossing..*" + "\n\n" + 
                "**Side** " + args[0].toLowerCase() + "\n" +
                "**Bet** $" + bet.toLocaleString())
            .setTimestamp()
            .setFooter(message.member.displayName, message.member.user.displayAvatarURL());
        
        message.channel.send(embed).then(m => {

            embed.setDescription("**Landed On** " + choice + "\n\n" + 
                "**Side** " + args[0].toLowerCase() + "\n" +
                "**Bet** $" + bet.toLocaleString())
            
            if (win) {

                if (voted) {
                    embed.addField("**Winner!!**", "**You win** $" + Math.round(((bet * 2) + ((bet * 2) * voteMulti))).toLocaleString() + "\n" +
                        "+**" + (voteMulti * 100).toString() + "**% vote bonus")
                } else {
                    embed.addField("**Winner!!**", "**You win** $" + (bet * 2).toLocaleString())
                }

                embed.setColor("#5efb8f")
            } else {
                embed.addField("**Loser!!**", "**You lost** $" + bet.toLocaleString())
                embed.setColor("#e4334f")
            }
    
            setTimeout(() => {
                m.edit(embed)
            }, 1500)
    
    
        }).catch(() => {
            return message.channel.send("<a:1603_Animated_Cross:716318362644381757> I may be lacking permission: 'EMBED_LINKS'");
        });
    }
}