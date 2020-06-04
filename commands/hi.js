const { MessageEmbed } = require("discord.js")
const { getColor } = require("../utils.js")

module.exports = {
    name: "hi",
    description: "a friendly hello",
    category: "fun",
    run: async (message, args) => {

        let color = getColor(message.member);

        let embed = new MessageEmbed()
        .setColor(color)
        .setDescription("<a:YayMonkey:716318209602748516> Hi there! How are you?")

        message.channel.send(embed)
   }
}