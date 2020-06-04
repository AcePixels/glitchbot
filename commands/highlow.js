const { MessageEmbed } = require("discord.js")
const { getColor } = require("../utils.js")
const { userExists, createUser, getBalance, updateBalance, formatBet, getVoteMulti } = require("../economy/utils.js")
const shuffle = require("shuffle-array")

const cooldown = new Map()
const games = new Map()

module.exports = {
    name: "highlow",
    description: "higher or lower game",
    category: "money",
    run: async (message, args) => {

        if (!message.guild.me.hasPermission("EMBED_LINKS")) {
            return message.channel.send("<a:1603_Animated_Cross:716318362644381757> I am lacking permission: 'EMBED_LINKS'");
        }

        if (!message.guild.me.hasPermission("MANAGE_MESSAGES")) {
            return message.channel.send("<a:1603_Animated_Cross:716318362644381757> I am lacking permission: 'MANAGE_MESSAGES'");
        }

        if (!userExists(message.member)) createUser(message.member)

        if (cooldown.has(message.member.id)) {
            const init = cooldown.get(message.member.id)
            const curr = new Date()
            const diff = Math.round((curr - init) / 1000)
            const time = 30 - diff

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

        const color = getColor(message.member)

        if (args.length == 0) {
            const embed = new MessageEmbed()
                .setTitle("Highlow Help")
                .setColor(color)
                .addField("Usage", "/highlow <bet>\n/highlow info")
                .addField("Game Rules", "You'll receive your first card and you have to predict whether the next card you pick up will be higher or lower in value than the card that you have, you can cash out after predicting correctly once.")
                .addField("Help", "**A**ce | value of 1\n**J**ack | value of 11\n" + 
                    "**Q**ueen | value of 12\n**K**ing | value of 13\n" +
                    "⬆ **higher** the next card will be higher in value than your current card\n" +
                    "⬇ **lower** the next card will be lower in value than your current card\n" +
                    "💰 **cash out** end the game and receive the current win\nmax win **26**x")
                .setFooter("Created By Jeremy#6414")

            return message.channel.send(embed).catch(() => message.channel.send("> <a:1603_Animated_Cross:716318362644381757> /highlow <bet>"))
        }

        if (args[0] == "info") {
            const embed = new MessageEmbed()
                .setTitle("Highlow Help")
                .setColor(color)
                .addField("Technical Info", "highlow works exactly how it would in real life\n" +
                    "When you create a game, a full 52 deck is shuffled in a random order\n" +
                    "For every new card you take, it is taken from the first in the deck (array) and then removed from the deck\n")
                .setFooter("Created By Jeremy#6414")
            
            return message.channel.send(embed).catch()
        }

        if (args[0] == "all") {
            args[0] = getBalance(message.member)
        }

        if (args[0] == "half") {
            args[0] = getBalance(message.member) / 2
        }

        if (parseInt(args[0])) {
            args[0] = formatBet(args[0])
        } else {
            return message.channel.send("<a:1603_Animated_Cross:716318362644381757> Invalid bet")
        }

        const bet = parseInt(args[0])

        if (bet <= 0) {
            return message.channel.send("<a:1603_Animated_Cross:716318362644381757> /highlow <bet>")
        }

        if (bet > getBalance(message.member)) {
            return message.channel.send("<a:1603_Animated_Cross:716318362644381757> You cannot afford this bet")
        }

        if (games.has(message.member.user.id)) {
            return message.channel.send("<a:1603_Animated_Cross:716318362644381757> You are already playing highlow")
        }

        cooldown.set(message.member.id, new Date())

        setTimeout(() => {
            cooldown.delete(message.member.id)
        }, 30000)

        updateBalance(message.member, getBalance(message.member) - bet)

        const id = Math.random()

        const newDeck = ["A♠", "2♠", "3♠", "4♠", "5♠", "6♠", "7♠", "8♠", "9♠", "10♠", "J♠", "Q♠", "K♠", 
            "A♣", "2♣", "3♣", "4♣", "5♣", "6♣", "7♣", "8♣", "9♣", "10♣", "J♣", "Q♣", "K♣", 
            "A♥️", "2♥️", "3♥️", "4♥️", "5♥️", "6♥️", "7♥️", "8♥️", "9♥️", "10♥️", "J♥️", "Q♥️", "K♥️",
            "A♦", "2♦", "3♦", "4♦", "5♦", "6♦", "7♦", "8♦", "9♦", "10♦", "J♦", "Q♦", "K♦"]
    
        
        const voteMulti = await getVoteMulti(message.member)
        
        games.set(message.member.user.id, {
            bet: bet,
            win: 0,
            deck: shuffle(newDeck),
            card: "",
            id: id,
            voted: voteMulti
        })

        setTimeout(() => {
            if (games.has(message.member.user.id) && games.get(message.member.user.id).id == id) {
                games.delete(message.member.user.id)
                return message.channel.send(message.member.user.toString() + " game expired")
            }
        }, 300000)

        newCard(message.member)

        const loadingEmbed = new MessageEmbed()
            .setTitle("loading.. | " + message.member.user.username)
            .setFooter("Created By Jeremy#6414")
            .setColor(color)

        const embed = new MessageEmbed()
            .setTitle("Highlow | " + message.member.user.username)
            .setDescription("**Bet** $" + bet.toLocaleString() + "\n**0**x ($0)")
            .setColor(color)
            .addField("Card", "| " + games.get(message.member.user.id).card + " |")
            .addField("Help", "⬆ higher | ⬇ lower | 💰 cash out")
            .setTimestamp()
            .setFooter(message.member.displayName, message.member.user.displayAvatarURL());
        
        message.channel.send(loadingEmbed).then(async m => {
            await m.react("⬆")
            await m.react("⬇")
            await m.react("💰")

            await m.edit(embed)
            playGame(message, m)
        })
    }
}

function newCard(member) {
    const deck = games.get(member.user.id).deck

    const choice = deck[0]

    deck.shift()

    games.set(member.user.id, {
        bet: games.get(member.user.id).bet,
        win: games.get(member.user.id).win,
        deck: deck,
        card: choice,
        id: games.get(member.user.id).id,
        voted: games.get(member.user.id).voted
    })
}

function getValue(member) {
    const card = games.get(member.user.id).card.toLowerCase()

    if (card.includes("k")) {
        return 13
    } else if (card.includes("q")) {
        return 12
    } else if (card.includes("j")) {
        return 11
    } else if (card.includes("a")) {
        return "1"
    } else {
        if (!parseInt(card.split()[0])) {
            return "ERROR"
        }
        return parseInt(card.split()[0])
    }
}

async function playGame(message, m) {
    const bet = games.get(message.member.user.id).bet
    let win = games.get(message.member.user.id).win
    let card = games.get(message.member.user.id).card
    const color = getColor(message.member)

    const newEmbed = new MessageEmbed()
        .setTitle("Highlow | " + message.member.user.username)
        .setColor(color)
        .setFooter("Created By Jeremy#6414")

    const lose = async () => {
        newEmbed.setColor("#e4334f")
        newEmbed.setDescription("**Bet** $" + bet.toLocaleString() + "\n**" + win + "**x ($" + Math.round(bet * win).toLocaleString() + ")" + "\n\n**You lose!!**")
        newEmbed.addField("card", "| " + card + " |")
        games.delete(message.member.user.id)
        await m.edit(newEmbed)
        return m.reactions.removeAll()
    }

    const win1 = async () => {

        let winnings = Math.round(bet * win)

        newEmbed.setColor("#5efb8f")
        if (games.get(message.member.user.id).voted > 0) {
            winnings = winnings + Math.round(winnings * games.get(message.member.user.id).voted)
            newEmbed.setDescription("**Bet** $" + bet.toLocaleString() + "\n" +
            "**" + win + "**x ($" + Math.round(bet * win).toLocaleString() + ")" +
                "\n\n**Winner!!**\n**You Win** $" + winnings.toLocaleString() + "\n" +
                "+**" + (games.get(message.member.user.id).voted * 100).toString() + "**% vote bonus")
        } else {
            newEmbed.setDescription("**Bet** $" + bet.toLocaleString() + "\n" +
            "**" + win + "**x ($" + Math.round(bet * win).toLocaleString() + ")" +
                "\n\n**Winner!!**\n**You Win** $" + winnings.toLocaleString())
        }
        newEmbed.addField("Card", "| " + card + " |")
        updateBalance(message.member, getBalance(message.member) + winnings)
        games.delete(message.member.user.id)
        await m.edit(newEmbed)
        return m.reactions.removeAll()
    }

    const draw = async () => {
        newEmbed.setColor("#E5FF00")
        newEmbed.setDescription("**Bet** $" + bet.toLocaleString() + "\n**" + win + "**x ($" + Math.round(bet * win).toLocaleString() + ")" + "\n\n**Draw!!**\nYou Win $" + bet.toLocaleString())
        newEmbed.addField("Card", "| " + card + " |")
        updateBalance(message.member, getBalance(message.member) + bet)
        games.delete(message.member.user.id)
        await m.edit(newEmbed)
        return m.reactions.removeAll()
    }

    if (win == 26) {
        return win1()
    }

    const filter = (reaction, user) => {
        return ["⬆", "⬇", "💰"].includes(reaction.emoji.name) && user.id == message.member.user.id
    }

    const reaction = await m.awaitReactions(filter, { max: 1, time: 300000, errors: ["time"] }).then(collected => {
        return collected.first().emoji.name
    }).catch()

    if (reaction == "⬆") {

        const oldCard = getValue(message.member)
        newCard(message.member)
        card = games.get(message.member.user.id).card
        const newCard1 = getValue(message.member)

        if (newCard1 > oldCard) {
            win = win + 1
            games.set(message.member.user.id, {
                bet: bet,
                win: win,
                deck: games.get(message.member.user.id).deck,
                card: games.get(message.member.user.id).card,
                id: games.get(message.member.user.id).id,
                voted: games.get(message.member.user.id).voted
            })

            newEmbed.setDescription("**Bet** $" + bet.toLocaleString() + 
                "\n**" + win + "**x ($" + Math.round(bet * win).toLocaleString() + ")")
            newEmbed.addField("Card", "| " + card + " |")
            await m.reactions.cache.get("⬆").users.remove(message.member)
            await m.edit(newEmbed)
            return playGame(message, m)
        } else if (newCard1 == oldCard) {
            newEmbed.setDescription("**Bet** $" + bet.toLocaleString() + 
                "\n**" + win + "**x ($" + Math.round(bet * win).toLocaleString() + ")")
            newEmbed.addField("Card", "| " + card + " |")
            await m.reactions.cache.get("⬆").users.remove(message.member)
            await m.edit(newEmbed)
            return playGame(message, m)
        } else {
            return lose()
        }

    } else if (reaction == "⬇") {
        const oldCard = getValue(message.member)
        newCard(message.member)
        card = games.get(message.member.user.id).card
        const newCard1 = getValue(message.member)

        if (newCard1 < oldCard) {
            win = win + 1
            games.set(message.member.user.id, {
                bet: bet,
                win: win,
                deck: games.get(message.member.user.id).deck,
                card: games.get(message.member.user.id).card,
                id: games.get(message.member.user.id).id,
                voted: games.get(message.member.user.id).voted
            })

            newEmbed.setDescription("**Bet** $" + bet.toLocaleString() + 
                "\n**" + win + "**x ($" + Math.round(bet * win).toLocaleString() + ")")
            newEmbed.addField("card", "| " + card + " |")
            await m.reactions.cache.get("⬇").users.remove(message.member)
            await m.edit(newEmbed)
            return playGame(message, m)
        } else if (newCard1 == oldCard) {
            newEmbed.setDescription("**Bet** $" + bet.toLocaleString() + 
                "\n**" + win + "**x ($" + Math.round(bet * win).toLocaleString() + ")")
            newEmbed.addField("Card", "| " + card + " |")
            await m.reactions.cache.get("⬇").users.remove(message.member)
            await m.edit(newEmbed)
            return playGame(message, m)
        } else {
            return lose()
        }
    } else if (reaction == "💰") {
        if (win < 1) {
            await m.reactions.cache.get("💰").users.remove(message.member)
            return playGame(message, m)
        } else if (win == 1) {
            return draw()
        } else {
            return win1()
        }
    } else {
        games.delete(message.member.user.id)
        return m.reactions.removeAll()
    }
}