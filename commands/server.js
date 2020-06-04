const { MessageEmbed } = require("discord.js");;
const { formatDate, getColor } = require("../utils.js");
const { getPeaks } = require("../guilds/utils.js")

module.exports = {
    name: "server",
    description: "view information about current server",
    category: "info",
    run: async (message, args) => {

        const server = message.guild;

        if (!server.me.hasPermission("EMBED_LINKS")) {
            return message.channel.send("<a:1603_Animated_Cross:716318362644381757> I am lacking permission: 'EMBED_LINKS'");
        }

        const created = formatDate(server.createdAt).toLowerCase();
        const members = server.members.cache
        const users = members.filter(member => !member.user.bot)
        const bots = members.filter(member => member.user.bot)
        const online = users.filter(member => member.presence.status != "offline")
        
        const color = getColor(message.member);

        if (args.length == 1 && args[0] == "-id") {
            const embed = new MessageEmbed()
                .setTitle(server.name)
                .setColor(color)
                .setDescription("`" + server.id + "`")
                .setTimestamp()
                .setFooter(message.member.displayName, message.member.user.displayAvatarURL());
            
            return message.channel.send(embed).catch(() => {
                return message.channel.send("<a:1603_Animated_Cross:716318362644381757> I may be lacking permission: 'EMBED_LINKS'");
            });
        }
           
        if (args.length == 1 && args[0] == "-m") {
            const embed = new MessageEmbed()
                .setThumbnail(server.iconURL({format: "png", dynamic: true, size: 128}))
                .setColor(color)
                .setTitle(server.name)

                .addField("Member Info", "**Humans** " + users.size.toLocaleString() + "\n" +
                    "**Bots** " + bots.size.toLocaleString() + "\n" + 
                    "**Online** " + online.size.toLocaleString() + "\n" +
                    "**Member peak** " + getPeaks(message.guild).members.toLocaleString() + "\n" + 
                    "**Online peak** " + getPeaks(message.guild).onlines.toLocaleString())

                .setTimestamp()
                .setFooter(message.member.displayName, message.member.user.displayAvatarURL());

            return message.channel.send(embed).catch(() => {
                return message.channel.send("<a:1603_Animated_Cross:716318362644381757> I may be lacking permission: 'EMBED_LINKS'");
            });
        }

         

        const embed = new MessageEmbed()
            .setThumbnail(server.iconURL({format: "png", dynamic: true, size: 128}))
            .setColor(color)
            .setTitle(server.name)
            
            .addField("info", "**Owner** " + server.owner.user.tag + "\n" +
                "**Created** " + created + "\n" +
                "**Region** " + server.region, true)

            .addField("info", "**roles** " + server.roles.cache.size + "\n" + 
                "**Channels** " + server.channels.cache.size + "\n" +
                "**ID** " + server.id, true)

            .addField("member info", "**humans** " + users.size.toLocaleString() + "\n" +
                "**Bots** " + bots.size.toLocaleString() + "\n" + 
                "**Online** " + online.size.toLocaleString() + "\n" +
                "**Member peak** " + getPeaks(message.guild).members.toLocaleString() + "\n" + 
                "**Online peak** " + getPeaks(message.guild).onlines.toLocaleString())

            .setTimestamp()
            .setFooter(message.member.displayName, message.member.user.displayAvatarURL());

        message.channel.send(embed).catch(() => {
             return message.channel.send("<a:1603_Animated_Cross:716318362644381757> I may be lacking permission: 'EMBED_LINKS'");
        });
    }
};