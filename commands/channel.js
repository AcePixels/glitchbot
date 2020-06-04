const { MessageEmbed } = require("discord.js")
const { getColor } = require("../utils.js")

const cooldown = new Map()

module.exports = {
    name: "channel",
    description: "create, delete and modify channels",
    category: "moderation",
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

        if (!message.member.hasPermission("MANAGE_CHANNELS")) {
            return
        }

        if (!message.guild.me.hasPermission("MANAGE_CHANNELS")) {
            return message.channel.send("<a:1603_Animated_Cross:716318362644381757> I am lacking permission: 'MANAGE_CHANNELS")
        }

        const color = getColor(message.member);

        if (args.length == 0) {

            const embed = new MessageEmbed()
                .setTitle("Channel Help")
                .setColor(color)
                .addField("Usage", "/channel create <name(s)>\n" +
                    "/channel delete <#channel(s)>\n" +
                    "/channel rename <#channel> <name>\n" +
                    "/channel nsfw <#channel>")
                .addField("Help", "you can create/delete multiple channels at the same time, examples on this can be seen below")
                .addField("Examples", "/channel create channel\n" +
                    "/channel create channel1 channel2 channel3\n" +
                    "/channel delete #channel1 #channel2 #channel3")
                .setFooter("Created By Jeremy#6414")

            return message.channel.send(embed).catch(() => message.channel.send("<a:1603_Animated_Cross:716318362644381757> /channel <**c**reate/**del**ete/**r**ename/nsfw> <channel> (name)"))   
        }

        

        if (args[0] == "create" || args[0] == "c") {
            if (args.length == 1) {
                return message.channel.send("<a:1603_Animated_Cross:716318362644381757> /channel **c**reate <name1 name2>\nexample: $channel c channel1 channel2")
            }
            args.shift()

            let channels = ""

            for (arg of args) {
                const newChannel = await message.guild.channels.create(arg)
                channels = channels + "**" + newChannel.toString() + "** <a:6093_Animated_Checkmark:716318362719879288>"
            }

            const embed = new MessageEmbed()
                    .setTitle("Channel")
                    .setDescription(channels)
                    .setColor(color)
                    .setTimestamp()
                    .setFooter(message.member.displayName, message.member.user.displayAvatarURL());
            return message.channel.send(embed)
        }

        if (args[0] == "delete" || args[0] == "del") {
            if (args.length == 1) {
                return message.channel.send("<a:1603_Animated_Cross:716318362644381757> /channel **del**ete <channel>")
            }

            args.shift()

            let count = 0

            message.mentions.channels.forEach(async channel => {
                count++
                await channel.delete().catch(() => {
                    return message.channel.send("<a:1603_Animated_Cross:716318362644381757> Unable to delete " + channel.name)
                })
            })

            const embed = new MessageEmbed()
                .setTitle("Channel")
                .setDescription("<a:6093_Animated_Checkmark:716318362719879288> **" + count + "** channels deleted")
                .setColor(color)
                .setTimestamp()
                .setFooter(message.member.displayName, message.member.user.displayAvatarURL());
            return message.channel.send(embed).catch()
        }

        if (args[0] == "rename" || args[0] == "r") {
            if (!args.length >= 3) {
                return message.channel.send("<a:1603_Animated_Cross:716318362644381757> /channel **r**ename <channel> <name>")
            }
            const channel = message.mentions.channels.first()

            if (!channel) {
                return message.channel.send("<a:1603_Animated_Cross:716318362644381757> Invalid channel")
            }

            args.shift()
            args.shift()

            const name = args.join("-")

            await channel.edit({name: name}).then(() => {
            }).catch(() => {
                return message.channel.send("<a:1603_Animated_Cross:716318362644381757> Unable to rename channel")
            })
            const embed = new MessageEmbed()
                .setTitle("Channel | " + message.member.user.username)
                .setDescription("<a:6093_Animated_Checkmark:716318362719879288> Channel renamed to " + name)
                .setColor(color)
                .setFooter("Created By Jeremy#6414")
            return message.channel.send(embed)
        }

        if (args[0] == "nsfw") {
            if (args.length != 2) {
                return message.channel.send("<a:1603_Animated_Cross:716318362644381757> /channel nsfw <channel>")
            }

            const channel = message.mentions.channels.first()

            if (!channel) {
                return message.channel.send("<a:1603_Animated_Cross:716318362644381757> Invalid channel")
            }

            let perms = true

            if (!channel.nsfw) {
                await channel.edit({nsfw: true}).catch(() => {
                    perms = false
                    return message.channel.send("<a:1603_Animated_Cross:716318362644381757> Unable to edit that channel")
                })
                if (!perms) {
                    return
                }
                const embed = new MessageEmbed()
                    .setTitle("Channel | " + message.member.user.username)
                    .setDescription(channel.toString() + "\n\n<a:6093_Animated_Checkmark:716318362719879288> Channel is now NSFW")
                    .setColor(color)
                    .setFooter("Created By Jeremy#6414")
                return message.channel.send(embed)
            } else {
                await channel.edit({nsfw: false}).catch(() => {
                    perms = false
                    return message.channel.send("<a:1603_Animated_Cross:716318362644381757> Unable to edit that channel")
                })
                if (!perms) {
                    return
                }
                const embed = new MessageEmbed()
                    .setTitle("Channel")
                    .setDescription(channel.toString() + "\n\n<a:6093_Animated_Checkmark:716318362719879288> Channel is no longer nsfw")
                    .setColor(color)
                    .setFooter("Created By Jeremy#6414")
                return message.channel.send(embed)
            }
        }

        return message.channel.send("<a:1603_Animated_Cross:716318362644381757> /channel <**c**reate/**del**ete/**r**ename/nsfw> <channel> (name)")
    }
}