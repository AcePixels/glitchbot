const { MessageEmbed } = require("discord.js")

module.exports = {
    name: "beep",
    description: "*boop*",
    category: "fun",
    run: async (message, args) => {

        let embed = new MessageEmbed()
	      .setDescription("*Boop*")
        .setColor("RANDOM")
        .setTimestamp()
        .setFooter(message.member.displayName, message.member.user.displayAvatarURL());

        message.channel.send(embed)
   }
}
