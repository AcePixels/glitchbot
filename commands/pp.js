const { MessageEmbed } = require("discord.js")
const { getMember, getColor } = require("../utils")

const cooldown = new Map()

module.exports = {
    name: "pp",
    description: "accurate prediction of your pp size",
    category: "nsfw",
    run: async (message, args) => {

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

        if (!message.channel.nsfw) {
            return message.channel.send("<a:1603_Animated_Cross:716318362644381757> You must do this in an NSFW channel")
        }

        cooldown.set(message.member.id, new Date());

        setTimeout(() => {
            cooldown.delete(message.member.id);
        }, 3000);

        let size = Math.floor(Math.random() * 15)
        let sizeMsg = "8"

        const bigInch = Math.floor(Math.random() * 40)

        if (bigInch == 7) {
            size = Math.floor(Math.random() * 30) + 15
        }

        for (let i = 0; i < size; i++) {
            sizeMsg = sizeMsg + "="
        }
        sizeMsg = sizeMsg + "D"

        const color = getColor(message.member);

        let member

        if (args.length == 0) {
            member = message.member
        } else {
            if (!message.mentions.members.first()) {
                member = getMember(message, args[0])
            } else {
                member = message.mentions.members.first()
            }

            if (!member) {
                member = message.member
            }
        }

        const embed = new MessageEmbed()
            .setColor(color)
            .setTitle("PP Predictor")
            .setDescription(member.user.toString() + "\n" + sizeMsg + "\n📏 " + size + " inches")

            .setTimestamp()
            .setFooter(message.member.displayName, message.member.user.displayAvatarURL());
        
        return message.channel.send(embed).catch(() => {
            return message.channel.send("<a:1603_Animated_Cross:716318362644381757> I may be lacking permission: 'EMBED_LINKS'");
        });
    }  
}