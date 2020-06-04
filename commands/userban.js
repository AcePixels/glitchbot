const { banned } = require("../banned.json");

module.exports = {
    name: "userban",
    description: "ban a user from the bot",
    category: "none",
    run: async (message, args) => {

        if (message.member.user.id != "608127385120014386") {
            return
        }

        if (args.length == 0) {
            message.react('716318362644381757')
        }

        let target;

        if (message.mentions.members.first()) {
            target = message.mentions.members.first().id;
        } else {
            target = args[0]
        }

        if (banned.includes(target)) {
            return message.react('716318362644381757')
        }

        banned.push(target);

        let value = {
            "banned": banned
        };

        const fs = require("fs");
        jsonData = JSON.stringify(value);

        fs.writeFileSync("./banned.json", jsonData, function(err) {
            if (err) console.log(err);
        });

        message.react('716318362719879288')

    }
};