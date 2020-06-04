const { userExists, updateBalance, getBalance, createUser } = require("../economy/utils.js")
const { getColor } = require("../utils.js")
const { MessageEmbed } = require("discord.js")

const cooldown = new Map();

module.exports = {
    name: "freemoney",
    description: "get $1k every 5 minutes",
    category: "money",
    run: async (message, args) => {

        if (cooldown.has(message.member.id)) {
            const init = cooldown.get(message.member.id)
            const curr = new Date()
            const diff = Math.round((curr - init) / 1000)
            const time = 300 - diff

            const minutes = Math.floor(time / 60)
            const seconds = time - minutes * 60

            let remaining

            if (minutes != 0) {
                remaining = `${minutes}m${seconds}s`
            } else {
                remaining = `${seconds}s`
            }
            return message.channel.send("<a:1603_Animated_Cross:716318362644381757> Still on cooldown for " + remaining );
        }

        cooldown.set(message.member.id, new Date());

        setTimeout(() => {
            cooldown.delete(message.member.id);
        }, 300000);

        if (!userExists(message.member)) createUser(message.member)

        updateBalance(message.member, getBalance(message.member) + 1000)

        const color = getColor(message.member)

        const embed = new MessageEmbed()
            .setTitle("<a:loading:717391210817388554> Freemoney")
            .setDescription("+$**1,000**")
            .setTimestamp()
            .setFooter(message.member.displayName, message.member.user.displayAvatarURL());
            .setColor(color)

        message.channel.send(embed).then(msg => {
            embed.setDescription("+$**1,000**\nNew Balance: $**" + getBalance(message.member).toLocaleString() + "**")
            embed.setColor("#5efb8f")
            setTimeout(() => {
                msg.edit(embed)
            }, 1000)
        })
    }
}