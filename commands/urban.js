const urban = require("relevant-urban")
const { MessageEmbed } = require("discord.js")
const { getColor } = require("../utils.js")

const cooldown = new Map()

module.exports = {
    name: "urban",
    description: "get a definition from urban dictionary",
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
            return message.channel.send("<a:1603_Animated_Cross:716318362644381757> /urban <definition>")
        }

        cooldown.set(message.member.id, new Date());

        setTimeout(() => {
            cooldown.delete(message.member.id);
        }, 5000);

        const result = await urban(args.join()).catch(() => {
            return message.channel.send("<a:1603_Animated_Cross:716318362644381757> Unknown definition")
        })

        if (!result.word) return

        const color = getColor(message.member);

        const embed = new MessageEmbed()
            .setTitle(result.word)
            .setDescription(result.definition + "\n\n" + result.example)
            .setColor(color)
            .setAuthor("Published By: " + result.author)
            .addField("👍", result.thumbsUp.toLocaleString(), true)
            .addField("👎", result.thumbsDown.toLocaleString(), true)
            .setURL(result.urbanURL)
            .setTimestamp()
            .setFooter(message.member.displayName, message.member.user.displayAvatarURL());

        message.channel.send(embed)
    }
}