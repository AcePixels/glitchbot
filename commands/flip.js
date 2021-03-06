const shuffle = require("shuffle-array")

module.exports = {
    name: "flip",
    description: "flip a coin",
    category: "fun",
    run: async (message, args) => {
        const headTails = ["Heads", "Tails"];

        const answer = shuffle(headTails)[Math.floor(Math.random() * headTails.length)];

        message.channel.send("**" + answer + "!**");
    }
};