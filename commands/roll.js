module.exports = {
    name: "roll",
    description: "roll a dice",
    category: "fun",
    run: async (message, args) => {

        message.channel.send("🎲 **You rolled a " + Math.ceil(Math.random() * 6) + "**");

    }
};