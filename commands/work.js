const { workMessages } = require("../lists.json")
const { getBalance, updateBalance, userExists, createUser } = require("../economy/utils.js")
const { MessageEmbed } = require("discord.js")

const cooldown = new Map()

module.exports = {
    name: "work",
    description: "work a random job and safely earn a percentage of cash in your wallet",
    category: "money",
    run: async (message, args) => {

        if (cooldown.has(message.member.id)) {
            const init = cooldown.get(message.member.id)
            const curr = new Date()
            const diff = Math.round((curr - init) / 1000)
            const time = 1800 - diff

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

        if (!userExists(message.member)) createUser(message.member)

        if (getBalance(message.member) <= 0) {
            return message.channel.send("<a:1603_Animated_Cross:716318362644381757> You need money to work")
        }

        cooldown.set(message.member.id, new Date());

        setTimeout(() => {
            cooldown.delete(message.member.id);
        }, 1800000);

        let earnedMax = 14

        if (getBalance(message.member) <= 500000) earnedMax = 24

        const earnedPercent = Math.floor(Math.random() * earnedMax) + 1
        let earned = Math.round((earnedPercent / 100) * getBalance(message.member))

        if (getBalance(message.member) >= 2000000) {
            const base = 25000
            const bonus = Math.floor(Math.random() * 75000)
            const total = base + bonus

            earned = total
        }

        const work = workMessages[Math.floor(Math.random() * workMessages.length)]

        updateBalance(message.member, getBalance(message.member) + earned)


        const embed = new MessageEmbed()
            .setColor("#5efb8f")
            .setTitle("Work")
            .setDescription(work)

            .setTimestamp()
            .setFooter(message.member.displayName, message.member.user.displayAvatarURL());
        
        message.channel.send(embed).then(m => {
            

            if (getBalance(message.member) >= 2000000) {
                embed.setDescription(work + "\n\n+$**" + earned.toLocaleString() + "**")
            } else {
                embed.setDescription(work + "\n\n+$**" + earned.toLocaleString() + "** (" + earnedPercent + "%)")
            }

            setTimeout(() => {
                m.edit(embed)
            }, 1500)

        }).catch(() => {
            return message.channel.send("<a:1603_Animated_Cross:716318362644381757> I may be lacking permission: 'EMBED_LINKS'");
        });

    }
}