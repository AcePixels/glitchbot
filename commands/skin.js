const { MessageEmbed } = require("discord.js")
const fetch = require("node-fetch")
const { getColor } = require("../utils.js")

const cooldown = new Map()

module.exports = {
    name: "skin",
    description: "view the skin of a minecraft account",
    category: "fun",
    run: async (message, args) => {

        if (!message.guild.me.hasPermission("EMBED_LINKS")) {
            return message.channel.send("<a:1603_Animated_Cross:716318362644381757> I am lacking permission: 'EMBED_LINKS'");
        }

        if (args.length == 0) {
            return message.channel.send("<a:1603_Animated_Cross:716318362644381757> /skin <account>");
        }

        if (cooldown.has(message.member.id)) {
            const init = cooldown.get(message.member.id)
            const curr = new Date()
            const diff = Math.round((curr - init) / 1000)
            const time = 10 - diff

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
        }, 10000);

        const username = args[0]

        const uuidURL = "https://api.mojang.com/users/profiles/minecraft/" + username
        let uuid

        try {
            uuid = await fetch(uuidURL).then(uuidURL => uuidURL.json())
        } catch (e) {
            return message.channel.send("<a:1603_Animated_Cross:716318362644381757> Invalid account");
        }

        const skinIMG = `https://visage.surgeplay.com/full/${uuid.id}.png`

        const color = getColor(message.member);

        const embed = new MessageEmbed()
            .setTitle(uuid.name)
            .setURL("https://namemc.com/profile/" + username)
            .setDescription(`[Download](https://mc-heads.net/download/${uuid.id})`)
            .setColor(color)
            .setImage(skinIMG)
            .setTimestamp()
            .setFooter(message.member.displayName, message.member.user.displayAvatarURL());
        
        return message.channel.send(embed).catch(() => {
            return message.channel.send("<a:1603_Animated_Cross:716318362644381757> I may be lacking permission: 'EMBED_LINKS'");
        })

    }
}