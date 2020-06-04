const { MessageEmbed } = require("discord.js")
const Discord = require("discord.js")
const { getColor } = require("../utils.js")

const cooldown = new Map()

module.exports = {
    name: "lockdown",
    description: "lockdown a channel - prevents everyone from sending messages",
    category: "moderation",
    run: async (message, args) => {

        if (!message.member.hasPermission("MANAGE_CHANNELS") || !message.member.hasPermission("MANAGE_MESSAGES")) {
            return 
        }

        if (!message.guild.me.hasPermission("MANAGE_CHANNELS") || !message.guild.me.hasPermission("MANAGE_ROLES")) {
            return message.channel.send("<a:1603_Animated_Cross:716318362644381757> I am lacking permission: 'MANAGE_CHANNELS' or 'MANAGE_ROLES'")
        }

        if (cooldown.has(message.member.id)) {
            const init = cooldown.get(message.member.id)
            const curr = new Date()
            const diff = Math.round((curr - init) / 1000)
            const time = 3 - diff

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
        }, 3000);

        const color = getColor(message.member);

        let locked = false

        const role = message.guild.roles.cache.find(role => role.name == "@everyone")

        const a = message.channel.permissionOverwrites.get(role.id)

        if (!a) {
            locked = false
        } else if (!a.deny) {
            locked = false
        } else if (!a.deny.bitfield) {
            locked = false
        } else {
            const b = new Discord.Permissions(a.deny.bitfield).toArray()
            if (b.includes("SEND_MESSAGES")) {
                locked = true
            }
        }
        
        if (!locked) {
            await message.channel.updateOverwrite(role, {
                SEND_MESSAGES: false
            })

            const embed = new MessageEmbed()
                .setTitle("Lockdown")
                .setColor(color)
                .setDescription("<a:6093_Animated_Checkmark:716318362719879288> Lockdown enabled for **" + message.channel.name + "**")
                .setTimestamp()
                .setFooter(message.member.displayName, message.member.user.displayAvatarURL());

            return message.channel.send(embed)
        } else {
            await message.channel.updateOverwrite(role, {
                SEND_MESSAGES: null
            })
            const embed = new MessageEmbed()
                .setTitle("Lockdown")
                .setColor(color)
                .setDescription("<a:6093_Animated_Checkmark:716318362719879288> Lockdown disabled for **" + message.channel.name + "**")
                .setTimestamp()
                .setFooter(message.member.displayName, message.member.user.displayAvatarURL());

            return message.channel.send(embed)
        }

    }
}