const { MessageEmbed } = require("discord.js")
const { redditImage, getColor } = require("../utils.js")
const fetch = require("node-fetch")

const cooldown = new Map()

module.exports = {
    name: "reddit",
    description: "get a random image from any subreddit",
    category: "info",
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

        if (args.length == 0) {
            return message.channel.send("<a:1603_Animated_Cross:716318362644381757> /reddit <subreddit>")
        }

        cooldown.set(message.member.id, new Date());

        setTimeout(() => {
            cooldown.delete(message.member.id);
        }, 5000);

        let allowed

        try {
            const res = await fetch("https://www.reddit.com/r/" + args[0] + ".json?limit=100").then(a => a.json())

            allowed = res.data.children.filter(post => !post.data.is_self)

        } catch (e) {
            return message.channel.send("<a:1603_Animated_Cross:716318362644381757> Invalid subreddit")
        }

        const chosen = allowed[Math.floor(Math.random() * allowed.length)]

        if (!chosen) {
            return message.channel.send("<a:1603_Animated_Cross:716318362644381757> Unable to find image")
        }

        if (chosen.data.over_18 && !message.channel.nsfw) {
            return message.channel.send("<a:1603_Animated_Cross:716318362644381757> This content is NSFW!")
        }

        const a = await redditImage(chosen, allowed)

        const image = a.split("|")[0]
        const title = a.split("|")[1]
        let url = a.split("|")[2]
        const author = a.split("|")[3]

        url = "https://reddit.com" + url

        if (image == "lol") {
            return message.channel.send("<a:1603_Animated_Cross:716318362644381757> Unable to find image")
        }

        const color = getColor(message.member);

        const subreddit = args[0]

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