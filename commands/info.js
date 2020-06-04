const { MessageEmbed } = require("discord.js")

module.exports = {
    name: "info",
    description: "information about Glitch and the support server link",
    category: "info",
    run: async (message, args) => {

        let embed = new MessageEmbed()
        .setTitle("Glitch Info")
        .setDescription("[Click here to join the support server](https://discord.gg/ARHe55Y)")
        .addField("Info:", "Glitch is a discord bot created by **Jeremy#6414**, it features lots of fun commands including economy, fun, moderation, and cool games! if you would like to invite glitch to your server, try `/invite`!")
        .setTimestamp()
        .setFooter(message.member.displayName, message.member.user.displayAvatarURL());

        message.channel.send(embed)
   }
}