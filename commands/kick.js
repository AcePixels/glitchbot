const { MessageEmbed } = require("discord.js")
const { getColor } = require("../utils.js")

module.exports = {
    name: "kick",
    description: "kick one or more users",
    category: "moderation",
    run: async (message, args) => {

        if (!message.member.hasPermission("KICK_MEMBERS")) {
            return 
        }

        if (!message.guild.me.hasPermission("KICK_MEMBERS")) {
            return message.channel.send("<a:1603_Animated_Cross:716318362644381757> I am lacking permission: 'KICK_MEMBERS'");
        }

        const color = getColor(message.member);

        if (message.mentions.members.first() == null || args.length == 0) {

            const embed = new MessageEmbed()
                .setTitle("Kick Help")
                .setColor(color)
                .addField("Usage", "/kick <@user(s)> (reason) [-s]")
                .addField("Help", "**<>** required | **()** optional | **[]** parameter\n" + "**<@users>** you can kick one or more members in one command (must tag them)\n" +
                    "**(reason)** reason for the kick, will be given to all kicked members\n" +
                    "**[-s]** if used, command message will be deleted and the output will be sent to moderator as a DM if possible")
                .addField("Examples", "/kick @member hacking\n/kick @member @member2 @member3 hacking\n/kick @member hacking -s")
                .setFooter("Created By Jeremy#6414")

            return message.channel.send(embed).catch(() => message.channel.send("> <a:1603_Animated_Cross:716318362644381757> /kick <@user(s)> (reason) [-s]"))
        }

        const members = message.mentions.members
        let reason = message.member.user.tag + " | | "

        if (args.length != members.size) {
            for (let i = 0; i < members.size; i++) {
                args.shift()
            }
            reason = reason + args.join(" ")
        } else {
            reason = reason + "no reason specified"
        }

        let count = 0
        let failed = []

        for (member of members.keyArray()) {
            const targetHighestRole = members.get(member).roles.highest
            const memberHighestRole = message.member.roles.highest

            if (targetHighestRole.position > memberHighestRole.position && message.guild.owner.user.id != message.member.user.id) {
                failed.push(members.get(member).user.tag)
            } else {
                await members.get(member).kick(reason).then(() => {
                    count++
                }).catch(() => {
                    failed.push(members.get(member).user.tag)
                })
            }
        }

        if (count == 0) {
            return message.channel.send("<a:1603_Animated_Cross:716318362644381757> I was unable to kick that user!")
        }

        const embed = new MessageEmbed()
            .setTitle("Kick")
            .setDescription("<a:6093_Animated_Checkmark:716318362719879288> **" + count + "** member(s) kicked for: " + reason.split("| | ")[1])
            .setColor(color)
            .setTimestamp()
            .setFooter(message.member.displayName, message.member.user.displayAvatarURL());

        if (failed.length != 0) {
            embed.addField("Error", "Unable to kick: " + failed.join(", "))
        }

        if (args.join(" ").includes("-s")) {
            message.delete()
            return message.member.send(embed).catch()
        } else {
            return message.channel.send(embed)
        }
    }
}