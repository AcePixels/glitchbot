const request = require('superagent');
const {MessageEmbed} = require("discord.js");

module.exports = {
    name: 'advice',
    description: 'gives a random life advice',
    category: 'none',
    run: async (message, args) => {
        request
            .get('http://api.adviceslip.com/advice')
            .end((err, res) => {
                if (!err && res.status === 200) {
                    try {
                        JSON.parse(res.text)
                    } catch (e) {
                        return message.reply('An API Error Occurred :(');
                    }
                    const advice = JSON.parse(res.text)
                    const embed = new MessageEmbed()
                    .setColor("#6f00ff")
                    .setDescription(`**${advice.slip.advice}**`)
                    .setTimestamp()
                    .setTimestamp()
                    .setFooter(message.member.displayName, message.member.user.displayAvatarURL());

                    message.channel.send(embed)
                } else {
                console.error(`REST call failed: ${err}, status code: ${res.status}`)
                }
            });
    },
};