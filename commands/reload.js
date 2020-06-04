const { MessageEmbed } = require("discord.js")

module.exports = {
    name: "reload",
    description: "reload commands",
    category: "none",
    run: async (message, args) => {
        if (message.member.user.id != "608127385120014386") return
        const { reloadCommands, reloadCommand } = require("../nypsi.js")

        if (args.length == 0) {
            reloadCommands()
            message.react("716318362719879288")
            console.log("\x1b[32m[" + getTimeStamp() + "] commands reloaded\x1b[37m")
        } else {

            let msg = reloadCommand(args).split("<a:6093_Animated_Checkmark:716318362719879288>")
            msg = "```\n" + msg + "```"

            console.log(msg)

            const embed = new MessageEmbed()
                .setTitle("Reload")
                .setDescription(msg)
                .setFooter("Created By Jeremy#6414")
                .setColor("#60d16b")
            
            message.channel.send(embed)
        }
    }
}

function getTimeStamp() {
    const date = new Date();
    let hours = date.getHours().toString();
    let minutes = date.getMinutes().toString();
    let seconds = date.getSeconds().toString();

    if (hours.length == 1) {
        hours = "0" + hours;
    } 

    if (minutes.length == 1) {
        minutes = "0" + minutes;
    } 

    if (seconds.length == 1) {
        seconds = "0" + seconds;
    }

    const timestamp = hours + ":" + minutes + ":" + seconds;

    return timestamp
}