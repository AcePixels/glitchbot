const { MessageEmbed } = require("discord.js")
const { getColor } = require("../utils.js")

module.exports = {
    name: "unmute",
    description: "unmute one or more users",
    category: "moderation",
    run: async (message, args) => {
        if (!message.member.hasPermission("MANAGE_MESSAGES")) {
            return
        }

        if (!message.guild.me.hasPermission("MANAGE_ROLES") || !message.guild.me.hasPermission("MANAGE_CHANNELS")) {
            return message.channel.send("<a:1603_Animated_Cross:716318362644381757> I am lacking permissions for this command\npossibly: 'MANAGE_ROLES' or 'MANAGE_CHANNELS'")
        }

        const color = getColor(message.member)

        if (args.length == 0 || message.mentions.members.first() == null) {
            return message.channel.send("<a:1603_Animated_Cross:716318362644381757> /unmute <@user(s)>")
        }

        let muteRole = message.guild.roles.cache.find(r => r.name.toLowerCase() == "muted")

        if (!muteRole) {
            return message.channel.send("<a:1603_Animated_Cross:716318362644381757> There is no 'muted' role")
        }

        let count = 0

        for (member of message.mentions.members.keyArray()) {
            const m = message.mentions.members.get(member)

            if (m.roles.cache.has(muteRole.id)) {
                await m.roles.remove(muteRole).then(() => {
                    count++
                })
            }
        }

        const embed = new MessageEmbed()
            .setTitle("Unmute")
            .setDescription("<a:6093_Animated_Checkmark:716318362719879288> **" + count + "** member(s) unmuted")
            .setColor(color)
            .setTimestamp()
            .setFooter(message.member.displayName, message.member.user.displayAvatarURL());

        
        if (args.join(" ").includes("-s")) {
            message.delete()
            return message.member.send(embed).catch(() => {})
        } else {
            return message.channel.send(embed)
        }
    }
}