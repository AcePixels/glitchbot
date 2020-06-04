const { MessageEmbed } = require("discord.js");
const fetch = require("node-fetch");
const { getColor } = require("../utils.js")

const cooldown = new Map();

module.exports = {
    name: "instagram",
    description: "view stats for an instagram account",
    category: "fun",
    run: async (message, args) => {

        if (!message.guild.me.hasPermission("EMBED_LINKS")) {
            return message.channel.send("<a:1603_Animated_Cross:716318362644381757> I am lacking permission: 'EMBED_LINKS'");
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
        
        if (args.length == 0) {
            return message.channel.send("<a:1603_Animated_Cross:716318362644381757> /insagram <account>");
        }

        cooldown.set(message.member.id, new Date());

        setTimeout(() => {
            cooldown.delete(message.member.id);
        }, 10000);

        const name = args[0];

        const url = `https://instagram.com/${name}/?__a=1`;
        
        let res; 

        try {
            res = await fetch(url).then(url => url.json());
        } catch (e) {
            return message.channel.send("<a:1603_Animated_Cross:716318362644381757> Invalid account");
        }
        
        let account

        try {
            account = res.graphql.user;
        } catch {
            return message.channel.send("<a:1603_Animated_Cross:716318362644381757> Invalid account"); 
        }

        let title;

        if (account.is_private) {
            title = (account.username + " 🔒");
        } else if (account.is_verified) {
            title = (account.username + " <a:5918_black_tick:716318362375815279>");
        } else {
            title = account.username;
        }

        const color = getColor(message.member);

        let text = `**Name** ${account.full_name}`

        if (account.biography.length != 0) {
            text = text + `\n**Bio** ${account.biography}`
        }

        if (account.external_url != null) {
            text = text + `\n**link** ${account.external_url}`
        }

        text = text + `\n**followers** ${account.edge_followed_by.count.toLocaleString()}\n**following** ${account.edge_follow.count.toLocaleString()}`

        const embed = new MessageEmbed()
            .setColor(color)
            .setTitle(title)
            .setURL(`https://instagram.com/${name}`)
            .setThumbnail(account.profile_pic_url_hd)
            .setDescription(text)
            .setTimestamp()
            .setFooter(message.member.displayName, message.member.user.displayAvatarURL());

        message.channel.send(embed).catch(() => {
            return message.channel.send("<a:1603_Animated_Cross:716318362644381757> i may be lacking permission: 'EMBED_LINKS'");
        });
    }
};