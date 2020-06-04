const { list } = require("../optout.json");
const { banned } = require("../banned.json");

const cooldown = new Map();

module.exports = {
    name: "rickroll",
    description: "rickroll your friends",
    category: "fun",
    run: async (message, args) => {

        if (cooldown.has(message.member.id)) {
            const init = cooldown.get(message.member.id)
            const curr = new Date()
            const diff = Math.round((curr - init) / 1000)
            const time = 15 - diff

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
        }, 15000);

        if (args.length == 0) {
            return message.channel.send("<a:1603_Animated_Cross:716318362644381757> Invalid user");
        }

        let target;

        target = message.mentions.members.first();

        if (!target) {
            return message.channel.send("<a:1603_Animated_Cross:716318362644381757> Invalid user - you must tag the user for this command");
        }

        if (list.includes(message.member.user.id)) {
            return message.channel.send("<a:1603_Animated_Cross:716318362644381757> You have opted out of bot DM's, use /optin to be able to use this command");
        }

        if (list.includes(target.user.id)) {
            return message.channel.send("<a:1603_Animated_Cross:716318362644381757> This user has opted out of bot DM's");
        }

        if (banned.includes(target.user.id)) {
            return message.channel.send("<a:1603_Animated_Cross:716318362644381757> This user is banned from Glitch");
        }

        target.send("**Sent by " + message.member.user.tag + " in " + message.guild.name + "** use /optout to optout" + " https://youtu.be/dQw4w9WgXcQ").then( () => {
            message.channel.send("<a:6093_Animated_Checkmark:716318362719879288> Success");
        }).catch( () => {
            return message.channel.send("<a:1603_Animated_Cross:716318362644381757> I cannot message that user");
        });

    }
};