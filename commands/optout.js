const { list } = require("../optout.json");

const cooldown = new Set();

module.exports = {
    name: "optout",
    description: "optout of dms from the bot",
    category: "info",
    run: async (message, args) => {

        if (cooldown.has(message.member.id)) {
            message.delete().catch();
            return message.channel.send("<a:1603_Animated_Cross:716318362644381757> Still on cooldown").then(m => m.delete(1000));
        }

        cooldown.add(message.member.id);

        setTimeout(() => {
            cooldown.delete(message.member.id);
        }, 30000);

        if (list.includes(message.member.user.id)) {
            return message.channel.send("<a:1603_Animated_Cross:716318362644381757> You are already opted out of bot DM's - use /optin to opt in");
        }

        list.push(message.member.user.id);

        let value = {
            "list": list
        };

        const fs = require("fs");
        jsonData = JSON.stringify(value);

        fs.writeFileSync("./optout.json", jsonData, function(err) {
            if (err) console.log(err);
        });

        message.channel.send("<a:6093_Animated_Checkmark:716318362719879288> You will no longer recieve bot DM's");
    }
};