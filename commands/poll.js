const { MessageEmbed } = require("discord.js");
const { getColor } = require("../utils.js")

const cooldown = new Map();

module.exports = {
    name: "poll",
    description: "create a poll",
    category: "moderation",
    run: async (message, args) => {

        if (!message.member.hasPermission("MANAGE_MESSAGES")) {
            return 
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
            return message.channel.send("Still on cooldown for " + remaining );
        }
        
        let color = getColor(message.member);

        if (args.length == 0) {

            const embed = new MessageEmbed()
                .setTitle("Poll Help")
                .setColor(color)
                .addField("Usage", "/poll <title> | (text) | (hex color)")
                .addField("Help", "**<>** required | **()** optional\n" +
                    "After creation your message will be deleted and an embed will be created with your text and color if given\n" +
                    "The emojis used for the reactions will be <a:6093_Animated_Checkmark:716318362719879288> and <a:1603_Animated_Cross:716318362644381757>")
                    .addField("examples", "/poll hello\n" +
                    "/poll title | description\n" +
                    "/poll title | description | #13c696")

            return message.channel.send(embed).catch(() => message.channel.send("/poll <title> | (text) | (hex color)"))
        }

        cooldown.set(message.member.id, new Date());
        setTimeout(() => {
            cooldown.delete(message.member.id);
        }, 10000);

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

        
        message.channel.send(embed).then(async m => {
            message.delete()
            await m.react('716318362719879288')
            await m.react('716318362644381757')
        })

    }
};