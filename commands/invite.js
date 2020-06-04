const { MessageEmbed } = require("discord.js")
const { getColor } = require("../utils.js")

module.exports = {
    name: "invite",
    description: "invite Glitch to your server",
    category: "info",
    run: async (message, args) => {

        let color = getColor(message.member);

        let embed = new MessageEmbed()
        .setTitle("Invite Glitch!")
        .setColor(color)
        .setDescription("<:invitelink:716318362061373501> [Click Here To Invite Glitch!](https://discord.com/api/oauth2/authorize?client_id=716538261572419625&permissions=8&scope=bot)")
        .setTimestamp()
        .setFooter(message.member.displayName, message.member.user.displayAvatarURL());

        message.channel.send(embed)
   }
}