const { MessageEmbed } = require("discord.js")
const { getColor } = require("../utils.js")

module.exports = {
    name: "discords",
    description: "displays Jeremy's Favorite Servers",
    category: "info",
    run: async (message, args) => {

        const color = getColor(message.member)

        let embed = new MessageEmbed()
        .setTitle("Discord Servers To Check Out")
        .setColor(color)
        .addField("<a:1603_Animated_Cross:716318362644381757> No servers are currently available!")

        message.channel.send(embed)
   }
}