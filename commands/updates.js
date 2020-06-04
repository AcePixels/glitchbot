const { MessageEmbed } = require("discord.js")
const { getColor } = require("../utils.js")

module.exports = {
    name: "updates",
    description: "updates for Glitch",
    category: "info",
    run: async (message, args) => {

        let color = getColor(message.member);

        let embed = new MessageEmbed()
        .setTitle("Glitch Updates!")
        .setColor(color)
        .addField("<a:YayMonkey:716318209602748516> Updates:", "Fixed all of the footers for embeds making it display who requested it at what time instead of it displaying who created the bot!")
        .setTimestamp()
        .setFooter(message.member.displayName, message.member.user.displayAvatarURL());

        message.channel.send(embed)
   }
}