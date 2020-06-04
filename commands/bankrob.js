const { getColor } = require("../utils.js")
const { getBalance, createUser, updateBalance, userExists } = require("../economy/utils.js")
const Discord = require("discord.js")
const { MessageEmbed } = require("discord.js")
const shuffle = require("shuffle-array")

const cooldown = new Map()

module.exports = {
    name: "bankrob",
    description: "rob a bank for a high reward/high risk",
    category: "money",
    run: async (message, args) => {

        if (!userExists(message.member)) createUser(message.member)

        if (getBalance(message.member) < 1000) {
            return await message.channel.send("<a:1603_Animated_Cross:716318362644381757> You must have atleast $1,000!")
        }

        const bankWorth = new Discord.Collection()

        bankWorth.set("Glitch Bank", Math.round(getBalance(message.member) * 2))
        bankWorth.set("Central Bank", Math.round(getBalance(message.member) * 1.7))
        bankWorth.set("Bank Of America", Math.round(getBalance(message.member) * 2.5))
        bankWorth.set("Lloyds", Math.round(getBalance(message.member) * 1.5))
        bankWorth.set("SRC", Math.round(getBalance(message.member) * 1.8))
        bankWorth.set("Fleeca", Math.round(getBalance(message.member) * 1.1))
        bankWorth.set("MazeBank", Math.round(getBalance(message.member) * 2))

        const color = getColor(message.member);

        if (args[0] == "status") {
            let bankList = ""

            for (bank1 of bankWorth.keys()) {
                bankList = bankList + "**" + bank1 + "** $" + bankWorth.get(bank1).toLocaleString() + "\n"
            }

            bankList = bankList + "The most you can recieve on one robbery is 50% of the bank's balance"

            const embed = new MessageEmbed()
                .setTitle("Current Bank Balances")
                .setColor(color)
                .setDescription(bankList)
                .setTimestamp()
                .setFooter(message.member.displayName, message.member.user.displayAvatarURL());
            
            
            return message.channel.send(embed).catch(() => {
                return message.channel.send("<a:1603_Animated_Cross:716318362644381757> I may be lacking permission: 'EMBED_LINKS'");
            });
        }

        if (cooldown.has(message.member.id)) {
            const init = cooldown.get(message.member.id)
            const curr = new Date()
            const diff = Math.round((curr - init) / 1000)
            const time = 600 - diff

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
        }, 600000);

        const banks = ["Glitch Bank", "Central Bank", "Bank Of America", "Lloyds", "SRC", "Fleeca", "MazeBank"]

        const bank = shuffle(banks)[Math.floor(Math.random() * banks.length)]
        const amount = Math.floor(Math.random() * 60) + 15
        const caught = Math.floor(Math.random() * 15)

        let robberySuccess = true
        let robbedAmount = 0

        let percentLost
        let amountLost

        if (caught <= 10) {
            robberySuccess = false

            percentLost = Math.floor(Math.random() * 50) + 10
            amountLost = Math.round((percentLost / 100) * getBalance(message.member))

            updateBalance(message.member, getBalance(message.member) - amountLost)
        } else {
            robberySuccess = true

            robbedAmount = Math.round((amount / 100) * bankWorth.get(bank))
            
            updateBalance(message.member, getBalance(message.member) + robbedAmount)
        }

        const embed = new MessageEmbed()
            .setColor(color)
            .setTitle("Bank Robbery | " + message.member.user.username)
            .setDescription("Robbing " + bank + "..")
            .setTimestamp()
            .setFooter(message.member.displayName, message.member.user.displayAvatarURL());
        
        message.channel.send(embed).then(m => {
            
            if (robberySuccess) {
                embed.addField("<a:6093_Animated_Checkmark:716318362719879288> **Success!!**", "**You Stole** $" + robbedAmount.toLocaleString() + " (" + amount + "%) from **" + bank + "**")
                embed.setColor("#5efb8f")
            } else {
                embed.addField("<a:1603_Animated_Cross:716318362644381757> **You Were Caught!!**", "**You Lost** $" + amountLost.toLocaleString() + " (" + percentLost + "%)")
                embed.setColor("#e4334f")
            }

            setTimeout(() => {
                m.edit(embed)
            }, 1500)


        }).catch(() => {
            return message.channel.send("<a:1603_Animated_Cross:716318362644381757> I may be lacking permission: 'EMBED_LINKS'");
        });

        

    }
}