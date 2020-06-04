const { MessageEmbed } = require("discord.js");
const { getMember, getColor } = require("../utils");

module.exports = {
    name: "avatar",
    description: "get a person's avatar",
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

        let avatar = member.user.avatarURL({ format: "png", dynamic: true, size: 256 })

        const color = getColor(member);

        const embed = new MessageEmbed()
            .setTitle(member.user.tag)
            .setColor(color)
            .setImage(avatar)
            .setTimestamp()
            .setFooter(message.member.displayName, message.member.user.displayAvatarURL());

        message.channel.send(embed).catch(() => {
            return message.channel.send("<a:1603_Animated_Cross:716318362644381757> I may be lacking permission: 'EMBED_LINKS'");
        });

    }
};