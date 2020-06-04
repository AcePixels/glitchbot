const { getColor } = require("../utils.js")
const { getBalance, createUser, updateBalance, userExists, formatBet, getVoteMulti } = require("../economy/utils.js")
const { MessageEmbed } = require("discord.js")
const shuffle = require("shuffle-array")

const cooldown = new Map()

module.exports = {
    name: "rockpaperscissors",
    description: "play rock paper scissors",
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

        if (args.length == 0 || args.length == 1) {
            const embed = new MessageEmbed()
                .setTitle("Rock Paper Scissors Help")
                .setColor(color)
                .setFooter("Created By Jeremy#6414")
                .addField("Usage", "/rps <**r**ock/**p**aper/**s**cissors> <bet>")
                .addField("Help", "Rock Paper Scissors works exactly how this game does in real life\n" +
                    "**2.5**x multiplier for winning")


            return message.channel.send(embed).catch(() => message.channel.send("<a:1603_Animated_Cross:716318362644381757> /rps <rock/paper/scissors> <bet>"))
        }

        let choice = args[0]
        let memberEmoji = ""

        if (choice != "rock" && choice != "paper" && choice != "scissors" && choice != "r" && choice != "p" && choice != "s") {
            return message.channel.send("<a:1603_Animated_Cross:716318362644381757> /rps <rock/paper/scissors> <bet>")
        }

        if (choice == "r") choice = "rock"
        if (choice == "p") choice = "paper"
        if (choice == "s") choice = "scissors"

        if (choice == "rock") memberEmoji = "🗿"
        if (choice == "paper") memberEmoji = "📰"
        if (choice == "scissors") memberEmoji = "✂"

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
                return message.channel.send("<a:1603_Animated_Cross:716318362644381757> /rps <rock/paper/scissors> <bet>")
            }
        }

        const bet = (parseInt(args[1]))

        if (bet <= 0) {
            return message.channel.send("<a:1603_Animated_Cross:716318362644381757> /rps <rock/paper/scissors> <bet>")
        }

        if (bet > getBalance(message.member)) {
            return message.channel.send("<a:1603_Animated_Cross:716318362644381757> You cannot afford this bet")
        }

        cooldown.set(message.member.id, new Date())

        setTimeout(() => {
            cooldown.delete(message.member.id)
        }, 5000)

        updateBalance(message.member, getBalance(message.member) - bet)

        const values = ["rock", "paper", "scissors"]

        const index = values.indexOf(choice);

        if (index > -1) {
            values.splice(index, 1);
        }
        
        const winning = shuffle(values)[Math.floor(Math.random() * values.length)]
        let winningEmoji = ""

        if (winning == "rock") winningEmoji = "🗿"
        if (winning == "paper") winningEmoji = "📰"
        if (winning == "scissors") winningEmoji = "✂"

        let win = false
        let winnings = 0

        if (choice == "rock" && winning == "scissors") {
            win = true

            winnings = Math.round(bet * 2.5)
            updateBalance(message.member, getBalance(message.member) + winnings)
        } else if (choice == "paper" && winning == "rock") {
            win = true

            winnings = Math.round(bet * 2.5)
            updateBalance(message.member, getBalance(message.member) + winnings)
        } else if (choice == "scissors" && winning == "paper") {
            win = true

            winnings = Math.round(bet * 2.5)
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
                updateBalance(message.member, getBalance(message.member), + Math.round(winnings * voteMulti))
                winnings = winnings + Math.round(winnings * voteMulti)
            }
        }

        const embed = new MessageEmbed()
            .setColor(color)
            .setTitle("Rock Paper Scissors | " + message.member.user.username)
            .setDescription("*Rock..Paper..Scissors..* **Shoot!!**\n\n**You:** " + choice + " " + memberEmoji + "\n**Bet** $" + bet.toLocaleString())
            .setTimestamp()
            .setFooter(message.member.displayName, message.member.user.displayAvatarURL());
    
        message.channel.send(embed).then(m => {

            embed.setDescription("**Glitch:** " + winning + " " + winningEmoji + "\n\n**You:** " + choice + " " + memberEmoji + "\n**bet** $" + bet.toLocaleString())

            if (win) {

                if (voted) {
                    embed.addField("**Winner!!**", "**You Win** $" + winnings.toLocaleString() + "\n" +
                        "+**" + (voteMulti * 100).toString() + "**% vote bonus")
                } else {
                    embed.addField("**Winner!!**", "**You Win** $" + winnings.toLocaleString())
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