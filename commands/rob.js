const { getColor, getMember } = require("../utils.js")
const { userExists, updateBalance, createUser, getBalance, hasPadlock, setPadlock } = require("../economy/utils.js")
const { MessageEmbed } = require("discord.js")
const { list } = require("../optout.json")

const cooldown = new Map();
const playerCooldown = new Set()

module.exports = {
    name: "rob",
    description: "rob other server members",
    category: "money",
    run: async (message, args) => {

        if (cooldown.has(message.member.user.id)) {
            const init = cooldown.get(message.member.user.id)
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
        
        const color = getColor(message.member);

        if (args.length == 0) {
            const embed = new MessageEmbed()
                .setTitle("Rob Help")
                .setColor(color)
                .setFooter("Created By Jeremy#6414")
                .addField("Usage", "/rob <user>")
                .addField("Help", "Robbing a user is a useful way for you to make money\nyou can rob a maximum of **45**% of their balance\n" +
                    "But there is also a chance that you get caught by the police or just flat out failing the robbery\n" +
                    "You can lose up to **30**% of your balance by failing a robbery")

            return message.channel.send(embed).catch(() => message.channel.send("<a:1603_Animated_Cross:716318362644381757> /rob <user>"))
        }

        if (!userExists(message.member)) createUser(message.member)

        let target = message.mentions.members.first()

        if (!target) {
            target = getMember(message, args[0])
        }

        if (!target) {
            return message.channel.send("<a:1603_Animated_Cross:716318362644381757> Invalid user")
        }

        if (target.user.bot) {
            return message.channel.send("<a:1603_Animated_Cross:716318362644381757> Invalid user")
        }

        if (message.member == target) {
            return message.channel.send("<a:1603_Animated_Cross:716318362644381757> You cant rob yourself")
        }

        if (!userExists(target) || getBalance(target) <= 500) {
            return message.channel.send("<a:1603_Animated_Cross:716318362644381757> This user doesnt have sufficient funds")
        }

        if (getBalance(message.member) < 750) {
            return message.channel.send("<a:1603_Animated_Cross:716318362644381757> You dont have sufficient funds")
        }

        cooldown.set(message.member.user.id, new Date());

        setTimeout(() => {
            try {
                cooldown.delete(message.member.user.id);
            } catch {}
        }, 600000);

        if (playerCooldown.has(target.user.id)) {
            const amount = Math.floor(Math.random() * 9) + 1
            const amountMoney = Math.round(getBalance(message.member) * (amount / 100))

            updateBalance(target, getBalance(target) + amountMoney)
            updateBalance(message.member, getBalance(message.member) - amountMoney)

            const embed = new MessageEmbed()
                .setColor(color)
                .setTitle("Robbery")
                .setDescription("Robbing " + target.user.toString() + "..")
                .setTimestamp()
                .setFooter(message.member.displayName, message.member.user.displayAvatarURL());

            target.send("**You were nearly robbed!!**\nYou were nearly robbed by **" + message.member.user.tag + "** in **" + message.guild.name + "** \n" +
                "Since you have been robbed recently, you were protected by a private security team and received $" + amountMoney)

            message.channel.send(embed).then(m => {
                embed.setColor("#e4334f")
                embed.addField("**Fail!!**", "**" + target.user.tag + "** Has been robbed recently and is protected by a private security team\n" +
                    "You were caught and paid $" + amountMoney.toLocaleString() + " (" + amount + "%)")
                
                setTimeout(() => {
                    m.edit(embed)
                }, 1000)
            })
            return
        }

        const amount = (Math.floor(Math.random() * 45) + 10)

        const caught = Math.floor(Math.random() * 15)

        let robberySuccess = true
        let robbedAmount = Math.round((amount / 100) * getBalance(target))

        let caughtByPolice = false
        let percentReturned
        let amountReturned

        if (hasPadlock(target)) {
            setPadlock(target, false)

            if (!list.includes(target.user.id)) {
                target.send("**Your padlock has saved you from a robbery!!**\nYou were nearly robbed by **" + message.member.user.tag + "** in **" + message.guild.name +"**\nYhey would have stolen a total of $**" + robbedAmount.toLocaleString() + "**\n*Your padlock is now broken*").catch(() => {
                    
                })
            }

            const embed = new MessageEmbed()
                .setColor(color)
                .setTitle("Robbery")
                .setDescription("Robbing " + target.user.toString() + "..")

                .setTimestamp()
                .setFooter(message.member.displayName, message.member.user.displayAvatarURL());
        
            message.channel.send(embed).then(m => {

                embed.setColor("#e4334f")
                embed.addField("**Fail!!**", "**" + target.user.tag + "** Had a padlock, which has now been broken")

                setTimeout(() => {
                    m.edit(embed)
                }, 1000)


            }).catch(() => {
                return message.channel.send("<a:1603_Animated_Cross:716318362644381757> I may be lacking permission: 'EMBED_LINKS'");
            });
            return
        }

        if (caught <= 3) {
            caughtByPolice = true
            robberySuccess = false

            percentReturned = (Math.floor(Math.random() * 20) + 10)

            amountReturned = Math.round((percentReturned / 100) * getBalance(message.member))

            if (!list.includes(target.user.id)) {
                target.send("**You were nearly robbed!!**\n**" + message.member.user.tag + "** tried to rob you in **" + message.guild.name +"** but they were caught by the police\nThe police have given you $**" + amountReturned.toLocaleString() + "** for your troubles\n*Use /optout to optout of bot DM's*").catch(() => {
                })
            }

            updateBalance(target, getBalance(target) + amountReturned)
            updateBalance(message.member, getBalance(message.member) - amountReturned)
        } else if (amount >= 45) {
            robberySuccess = false

            percentReturned = (Math.floor(Math.random() * 10) + 5)

            amountReturned = Math.round((percentReturned / 100) * getBalance(message.member))

            if (!list.includes(target.user.id)) {
                target.send("**You were nearly robbed!!**\n**" + message.member.user.tag + "** tried to rob you in **" + message.guild.name +"** but they failed\nYou have been given $**" + amountReturned.toLocaleString() + "** from their balance\n*Use /optout to optout of bot DM's*").catch(() => {
                })
            }

            updateBalance(message.member, getBalance(message.member) - amountReturned)
            updateBalance(target, getBalance(target) + amountReturned)
        }

        if (robberySuccess) {
            robbedAmount = Math.round((amount / 100) * getBalance(target))

            if (!list.includes(target.user.id)) {
                target.send("**You have been robbed!!**\nYou were robbed by **" + message.member.user.tag + "** in **" + message.guild.name + "**\nThey stole a total of $**" + robbedAmount.toLocaleString() + "**\n*Use /optout to optout of bot DM's*").catch(() => {

                })
            }

            playerCooldown.add(target.user.id)

            setTimeout(() => {
                playerCooldown.delete(target.user.id)
            }, 600000)

            updateBalance(target, getBalance(target) - robbedAmount)
            updateBalance(message.member, getBalance(message.member) + robbedAmount)
        }

        let embed = new MessageEmbed()
            .setColor(color)
            .setTitle("Robbery")
            .setDescription("Robbing " + target.user.toString() + "..")

            .setTimestamp()
            .setFooter(message.member.displayName, message.member.user.displayAvatarURL());
        
        message.channel.send(embed).then(m => {
            
            if (robberySuccess && !caughtByPolice) {
                embed.addField("**Success!!**", "**You stole** $" + robbedAmount.toLocaleString() + " (" + amount + "%)")
                embed.setColor("#5efb8f")
            } else if (caughtByPolice) {
                embed.setColor("#e4334f")
                embed.addField("**You were caught by the police!!**", "**" + target.user.tag + "** was given $" + amountReturned.toLocaleString() + " (" + percentReturned + "%)" +
                    "\nfrom your balance for their troubles")
            } else {
                embed.addField("**Fail!!**", "**You lost** $" + amountReturned.toLocaleString() + " (" + percentReturned + "%)")
                embed.setColor("#e4334f")
            }

            setTimeout(() => {
                m.edit(embed)
            }, 1000)


        }).catch(() => {
            return message.channel.send("<a:1603_Animated_Cross:716318362644381757> I may be lacking permission: 'EMBED_LINKS'");
        });
    }
}