const { MessageEmbed } = require("discord.js");
const { getColor } = require("../utils.js")

const cooldown = new Map();

module.exports = {
    name: "embed",
    description: "create an embed message",
    category: "fun",
    run: async (message, args) => {


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

        let color = getColor(message.member);

        if (args.length == 0) {
            const embed = new MessageEmbed()
                .setTitle("Embed Help")
                .setColor(color)
                .addField("Usage", "/embed <title> | (text) | (hex color)")
                .addField("Help", "with this command you can create a simple embed message\n" +
                    "**<>** required | **()** optional\n")
                .addField("Examples", "/embed hello\n" +
                    "/embed hello | description\n" +
                    "/embed hello | description | #13c696")
                .setFooter("Created By Jeremy#6414")

            return message.channel.send(embed).catch(() => message.channel.send("<a:1603_Animated_Cross:716318362644381757> /embed <title> | (text) | (hex color)"))
        }

        let mode = ""

        if (!message.content.includes("|")) {
            mode = "title_only"
        } else if (args.join(" ").split("|").length == 2) {
            mode = "title_desc"
        } else if (args.join(" ").split("|").length == 3) {
            mode = "title_desc_color"
        }

        cooldown.set(message.member.id, new Date());
        setTimeout(() => {
            cooldown.delete(message.member.id);
        }, 10000);

        const title = args.join(" ").split("|")[0]
        let description
        
        if (mode.includes("desc")) {
            description = args.join(" ").split("|")[1]
        } 

        if (mode.includes("color")) {
            color = args.join(" ").split("|")[2]
        }

        const embed = new MessageEmbed()
            .setTitle(title)
            .setColor(color)
            .setTimestamp()
            .setFooter(message.member.displayName, message.member.user.displayAvatarURL());
        
        if (mode.includes("desc")) {
            embed.setDescription(description)
        }

        
        message.channel.send(embed).then(() => {
            message.delete()
        })

    }
};