const { MessageEmbed } = require("discord.js");
const { getMember, formatDate, getColor } = require("../utils.js");

module.exports = {
    name: "user",
    description: "view info about a user",
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
            if (args[0] == "-id") {
                member = message.member
            }
        }

        if (!member) {
            return message.channel.send("<a:1603_Animated_Cross:716318362644381757> Invalid user");
        }

        const color = getColor(member);

        if (args.join(" ").includes("-id")) {
            const embed = new MessageEmbed()
                .setTitle(member.user.tag)
                .setColor(color)
                .setDescription("`" + member.user.id + "`")
                .setTimestamp()
                .setFooter(message.member.displayName, message.member.user.displayAvatarURL());
            return message.channel.send(embed)
        }
        
        const joined = formatDate(member.joinedAt);
        const created = formatDate(member.user.createdAt);
        const roles = member.roles._roles

        let rolesText = ""

        roles.forEach(role => {
            rolesText = rolesText + role.toString() + " "
        })

        rolesText = rolesText.split("@everyone").join("")

        let username = member.user.tag

        if (username.includes("*")) {
            username = "`" + member.user.tag + "`"
        }

        const embed = new MessageEmbed()
            .setThumbnail(member.user.avatarURL({ format: "png", dynamic: true, size: 128 }))
            .setColor(color)
            .setTitle(member.user.tag)
            .setDescription(member.user.toString())
            
            .addField("Member User Info", `**Username** ${username}` +
            `\n**ID** ${member.user.id}` +
            `\n**Status** ${member.presence.status}`, true)

            .addField("Server User Info", "**Created** " + created.toString().toLowerCase() + "\n" + 
                "**Joined** " + joined.toString().toLowerCase() + "\n" + 
                "**Roles** " + member._roles.length, true)

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

                    spotify = "**Listening to** " + activity.details + " by " + activity.state
                    hasSpotify = true
                }

                if (!hasGame && activity.name.toLowerCase() != "custom status" && activity.name.toLowerCase() != "spotify") {
                    game = "**Currently Playing** " + activity.name
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
                embed.addField("activity", status1, true)
            }
        }

        message.channel.send(embed).catch(() => {
             return message.channel.send("<a:1603_Animated_Cross:716318362644381757> i may be lacking permission: 'EMBED_LINKS'");
        });
    }
};