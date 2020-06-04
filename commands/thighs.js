const { MessageEmbed } = require("discord.js")
const { redditImage, getColor } = require("../utils.js")

const cooldown = new Map()

module.exports = {
    name: "thighs",
    description: "get a random thighs image",
    category: "nsfw",
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

        if (!message.channel.nsfw) {
            return message.channel.send("<a:1603_Animated_Cross:716318362644381757> You must do this in an nsfw channel")
        }

        const { thighsCache } = require("../utils.js")

        if (thighsCache.size <= 2) {
            return message.channel.send("<a:1603_Animated_Cross:716318362644381757> Please wait a couple more seconds..")
        }

        cooldown.set(message.member.id, new Date());

        setTimeout(() => {
            cooldown.delete(message.member.id);
        }, 5000);

        const thighsLinks = Array.from(thighsCache.keys())

        const subredditChoice = thighsLinks[Math.floor(Math.random() * thighsLinks.length)]

        const allowed = await thighsCache.get(subredditChoice)

        const chosen = allowed[Math.floor(Math.random() * allowed.length)]

        const a = await redditImage(chosen, allowed)

        if (a == "lol") {
            return message.channel.send("<a:1603_Animated_Cross:716318362644381757> Unable to find thighs image")
        }

        const image = a.split("|")[0]
        const title = a.split("|")[1]
        let url = a.split("|")[2]
        const author = a.split("|")[3]

        url = "https://reddit.com" + url

        const color = getColor(message.member);

        const subreddit = subredditChoice.split("r/")[1].split(".json")[0]

        const embed = new MessageEmbed()
            .setColor(color)
            .setTitle(title)
            .setAuthor("u/" + author + " | r/" + subreddit)
            .setURL(url)
            .setImage(image)
            .setTimestamp()
            .setFooter(message.member.displayName, message.member.user.displayAvatarURL());

        message.channel.send(embed).catch(() => {
            return message.channel.send("<a:1603_Animated_Cross:716318362644381757> I may be missing permission: 'EMBED_LINKS'")
        })

    }
}