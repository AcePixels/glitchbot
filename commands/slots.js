const { getColor } = require("../utils.js")
const { getBalance, createUser, getMultiplier, updateBalance, userExists, winBoard, formatBet, getVoteMulti } = require("../economy/utils.js")
const { MessageEmbed } = require("discord.js")

const reel1 = ["🍉", "🍉", "🍉", "🍉", "🍉", "🍇", "🍇", "🍇", "🍇", "🍊", "🍊", "🍊", "🍊", "🍋", "🍋", "🍒"]
const reel2 = ["🍉", "🍉", "🍉", "🍉", "🍉", "🍇", "🍇", "🍇", "🍇", "🍊", "🍊", "🍊", "🍋", "🍋", "🍋", "🍒"]
const reel3 = ["🍉", "🍉", "🍉", "🍉", "🍉", "🍉", "🍇", "🍇", "🍇", "🍇", "🍇", "🍊", "🍊", "🍊", "🍋", "🍋", "🍒", "🍒"]

const cooldown = new Map()

module.exports = {
    name: "slots",
    description: "play slots",
    category: "money",
    run: async (message, args) => {

        if (cooldown.has(message.member.id)) {
            const init = cooldown.get(message.member.id)
            const curr = new Date()
            const diff = Math.round((curr - init) / 1000)
            const time = 5 - diff

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

        if (!userExists(message.member)) {
            createUser(message.member)
        }

        const color = getColor(message.member);

        if (args.length == 0) {
            const embed = new MessageEmbed()
                .setTitle("Slots Help")
                .setColor(color)
                .setFooter("Created By Jeremy#6414")
                .addField("Usage", "/slots <bet>\n/slots info")
                .addField("Help", "You should know how a slot machine works..")
            return message.channel.send(embed).catch(() => message.channel.send("<a:1603_Animated_Cross:716318362644381757> /slots <bet> | /**slots info** shows additional info about winning"))
        }

        if (args.length == 1 && args[0] == "info") {

            const embed = new MessageEmbed()
                .setTitle("Additional Info")
                .setDescription(winBoard() + "\nHaving any two same fruits next to eachother gives a **1.5**x win")
                .setColor(color)
                .setTimestamp()
                .setFooter(message.member.displayName, message.member.user.displayAvatarURL());
            
            return message.channel.send(embed).catch(() => {
                return message.channel.send("<a:1603_Animated_Cross:716318362644381757> I may be lacking permission: 'EMBED_LINKS'");
            })
        }

        if (!args[0]) {
            return message.channel.send("<a:1603_Animated_Cross:716318362644381757> /slots <bet> | /**slots info** shows the winning board")
        }

        if (args[0] == "all") {
            args[0] = getBalance(message.member)
        }

        if (args[0] == "half") {
            args[0] = getBalance(message.member) / 2
        }

        if (isNaN(args[0]) || parseInt(args[0]) <= 0) {
            if (!isNaN(formatBet(args[0]) || !parseInt(formatBet[args[0]]))) {
                args[0] = formatBet(args[0])
            } else {
                return message.channel.send("<a:1603_Animated_Cross:716318362644381757> /slots <bet> | /**slots info** shows additional info")
            }
        }

        const bet = (parseInt(args[0]));

        if (bet <= 0) {
            return message.channel.send("<a:1603_Animated_Cross:716318362644381757> /slots <bet> | /**slots info** shows additional info")
        }

        if (bet > getBalance(message.member)) {
            return message.channel.send("<a:1603_Animated_Cross:716318362644381757> You cannot afford this bet")
        }

        cooldown.set(message.member.id, new Date());

        setTimeout(() => {
            cooldown.delete(message.member.id);
        }, 5000);

        updateBalance(message.member, getBalance(message.member) - bet)

        let one = reel1[Math.floor(Math.random() * reel1.length)]
        let two = reel2[Math.floor(Math.random() * reel2.length)]
        let three = reel3[Math.floor(Math.random() * reel3.length)]

        if (getBalance(message.member) < 1000000) {
            if (one != two && one != three && two != three) {
                const chance = Math.floor(Math.random() * 10)
                if (chance < 5) {
                    one = two
                }
            }
            if (two == three && one != two) {
                const chance = Math.floor(Math.random() * 10)
                if (chance < 4) {
                    one = two
                }
            }
            if (one == two && one != three) {
                const chance = Math.floor(Math.random() * 10)
                if (chance < 3) {
                    three = two
                }
            }
            if (one == two && one == three && one != "🍒" && one != "🍋") {
                const chance = Math.floor(Math.random() * 10)

                if (chance < 3) {
                    one == "🍋"
                    two == "🍋"
                    three == "🍋"
                } else if (chance < 2) {
                    one == "🍒"
                    two == "🍒"
                    three == "🍒"
                }
            }
        }

        let win = false
        let winnings = 0

        if (one == two && two == three) {
            const multiplier = getMultiplier(one)

            win = true
            winnings = Math.round(multiplier * bet)

            updateBalance(message.member, getBalance(message.member) + winnings)
        } else if (one == two) {
            win = true
            winnings = Math.round(bet * 1.2)

            updateBalance(message.member, getBalance(message.member) + winnings)
        }

        let voted = false
        let voteMulti = 0

        if (win) {
            voteMulti = await getVoteMulti(message.member)
    
            if (voteMulti > 0) {
                voted = true
            }

            if (voted) {
                updateBalance(message.member, getBalance(message.member) + Math.round(winnings * voteMulti))
                winnings = winnings + Math.round(winnings * voteMulti)
            }
        }
        

        const embed = new MessageEmbed()
            .setColor(color)
            .setTitle("Slot Machine")
            .setDescription("---------------\n" + one + " | " + two + " | " + three + "\n---------------\n**bet** $" + bet.toLocaleString())

            .setTimestamp()
            .setFooter(message.member.displayName, message.member.user.displayAvatarURL());
        
        message.channel.send(embed).then(m => {
            
            if (win) {

                if (voted) {
                    embed.addField("**Winner!!**", "**You Win** $" + winnings.toLocaleString() + "\n" +
                        "+**" + (voteMulti * 100).toString() + "**% vote bonus")
                } else {
                    embed.addField("**winner!!**", "**You Win** $" + winnings.toLocaleString())
                }

                embed.setColor("#5efb8f")
            } else {
                embed.addField("**Loser!!**", "**You Lost** $" + bet.toLocaleString())
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