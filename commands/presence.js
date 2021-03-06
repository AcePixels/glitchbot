const { MessageEmbed } = require("discord.js")
const { getMember, getColor } = require("../utils.js");

module.exports = {
    name: "activity",
    description: "view active presences for a user",
    category: "info",
    run: async (message, args) => {
        if (!message.guild.me.hasPermission("EMBED_LINKS")) {
            return message.channel.send("<a:1603_Animated_Cross:716318362644381757> I am lacking permission: 'EMBED_LINKS'");
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

        const color = getColor(message.member);

        const embed = new MessageEmbed()
            .setColor(color)
            .setTitle(member.user.tag)
            .setDescription(member.user.toString())
            .setThumbnail(member.user.avatarURL({ format: "png", dynamic: true, size: 128 }))
            .setTimestamp()
            .setFooter(message.member.displayName, message.member.user.displayAvatarURL());

        if (member.presence.activities.length > 0) {
            let hasStatus = false
            let status = ""
            let hasGame = false
            let game = ""
            let hasSpotify = false
            let spotify = ""
            
            for (activity of member.presence.activities) {
                if (activity.name.toLowerCase() == "custom status" && activity.state != undefined) {
                    if (hasStatus) return

                    status = "**custom status** " + activity.state
                    hasStatus = true
                }

                if (activity.name.toLowerCase() == "spotify") {
                    if (hasSpotify) return

                    spotify = "**listening to** " + activity.details + " by " + activity.state
                    hasSpotify = true
                }

                if (!hasGame && activity.name.toLowerCase() != "custom status" && activity.name.toLowerCase() != "spotify") {
                    game = "**currently playing** " + activity.name
                    hasGame = true
                }
            }

            let status1 = ""
            if (hasStatus) {
                status1 = status1 + status + "\n"
            }
            if (hasSpotify) {
                status1 = status1 + spotify + "\n"
            }
            if (hasGame) {
                status1 = status1 + game
            }
            if (hasStatus || hasSpotify || hasGame) {
                embed.addField("status", status1)
            } else {
                return message.channel.send("<a:1603_Animated_Cross:716318362644381757> this user has no active presence")
            }
        } else {
            return message.channel.send("<a:1603_Animated_Cross:716318362644381757> this user has no active presence")
        }

        message.channel.send(embed)
    }
    
}