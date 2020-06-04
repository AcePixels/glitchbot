const { MessageEmbed } = require("discord.js")
const { getMember, getColor } = require("../utils");

const cooldown = new Map()

module.exports = {
    name: "ddos",
    description: "ddos someone (fake)",
    category: "fun",
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
            return message.channel.send("<a:1603_Animated_Cross:716318362644381757> /ddos <user>")
        }

        let member;

        if (args.length == 0) {
            member = message.member;
        } else {
            if (!message.mentions.members.first()) {
                member = getMember(message, args[0]);
            } else {
                member = message.mentions.members.first();
            }
        }

        if (!member) {
            return message.channel.send("<a:1603_Animated_Cross:716318362644381757> Invalid user");
        }

        const ip = `${randNumber()}.${randNumber()}.${randNumber()}.${randNumber()}`
        const port = `${randPort()}`

        const color = getColor(message.member);

        const embed = new MessageEmbed()
            .setTitle("DDoS tool | " + message.member.user.username)
            .setColor(color)
            .setFooter("Created By Jeremy#6414")
            .setDescription(member.user.toString() + "\n\n" +
                "**IP** *obtaining..*" + "\n" +
                "**Port** *waiting...*" + "\n\n" +
                "**Status** *online*")
        
        return message.channel.send(embed).then(m => {
            embed.setDescription(member.user.toString() + "\n\n" +
                `**IP** *${ip}*` + "\n" +
                "**Port** *scanning..*" + "\n\n" +
                "**Status** *online*")
            
            setTimeout(() => {
                m.edit(embed).then(() => {
                    embed.setDescription(member.user.toString() + "\n\n" +
                        `**IP** *${ip}*` + "\n" +
                        `**Port** *${port}*` + "\n\n" +
                        "**Status** *online*")
                    
                    setTimeout(() => {
                        m.edit(embed).then(() => {
                            embed.setDescription(member.user.toString() + "\n\n" +
                                `**IP** *${ip}*` + "\n" +
                                `**Port** *${port}*` + "\n\n" +
                                "**Status** *offline*")
                            embed.setColor("#e4334f")
                            
                            setTimeout(() => {
                                m.edit(embed)
                            }, 1000)
                        })
                    }, 1000)
                })
            }, 1000)
        }).catch(() => {
            return message.channel.send("<a:1603_Animated_Cross:716318362644381757> I may be lacking permission: 'EMBED_LINKS'");
        });

    }
}

function randNumber() {
    return Math.floor(Math.random() * 254) + 1
}

function randPort() {
    return Math.floor(Math.random() * 25565)
}