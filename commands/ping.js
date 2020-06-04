const { MessageEmbed } = require("discord.js")
const { getColor } = require("../utils.js")

module.exports = {
    name: "ping",
    description: "Glitch's Ping",
    category: "info",
    run: async (message, args) => {

        let color = getColor(message.member)

        let embed = new MessageEmbed()
        .setTitle("<a:pingpong:717076279018651710> Pong!")
        .setColor(color)
        .setDescription('`' + `${Date.now() - message.createdTimestamp}` + ' ms`')
        .setTimestamp()
        .setFooter(message.member.displayName, message.member.user.displayAvatarURL());

        message.channel.send(embed)
   }
}