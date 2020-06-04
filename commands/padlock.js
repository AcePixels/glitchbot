const { hasPadlock, setPadlock, getBalance, updateBalance, createUser, userExists, getPadlockPrice } = require("../economy/utils.js")
const { getTimestamp } = require("../utils.js")
const { MessageEmbed } = require("discord.js")

const cooldown = new Map()

module.exports = {
    name: "padlock",
    description: "buy a padlock to protect your wallet",
    category: "money",
    run: async (message, args) => {

        if (!userExists(message.member)) createUser(message.member)

        const embed = new MessageEmbed()
            .setTitle("Padlock")
            .setTimestamp()
            .setFooter(message.member.displayName, message.member.user.displayAvatarURL());
        
        const padlockPrice = getPadlockPrice()

        if (args.length == 1 && args[0].toLowerCase() == "buy") {
            if (hasPadlock(message.member)) {
                embed.setColor("#5efb8f")
                embed.setDescription("**Protected** 🔒\nYou Already have a padlock")
                return await message.channel.send(embed).catch()
            }

            if (getBalance(message.member) < padlockPrice) {
                return await message.channel.send("<a:1603_Animated_Cross:716318362644381757> You cannot currently afford a padlock")
            }

            if (cooldown.has(message.member.user.id)) {
                const init = cooldown.get(message.member.id)
                const curr = new Date()
                const diff = Math.round((curr - init) / 1000)
                const time = 60 - diff
    
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

            cooldown.set(message.member.user.id, new Date());

            setTimeout(() => {
                cooldown.delete(message.member.user.id);
            }, 60000);

            updateBalance(message.member, getBalance(message.member) - padlockPrice)
            setPadlock(message.member, true)
            return await message.channel.send("<a:6093_Animated_Checkmark:716318362719879288> You have successfully bought a padlock for $**" + padlockPrice.toLocaleString() + "**")
        } else {
            if (hasPadlock(message.member)) {
                embed.setColor("#5efb8f")
                embed.setDescription("**Protected** 🔒\nyou currently have a padlock")
                return await message.channel.send(embed).catch()
            } else {
                embed.setDescription("**Vulnerable** 🔓\nYou do not have a padlock\nYou can buy one for $**" + padlockPrice.toLocaleString() + "** with /padlock buy")
                embed.setColor("#e4334f")
                return await message.channel.send(embed).catch()
            }
        }
    }
}