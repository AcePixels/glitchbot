const { stripIndents } = require('common-tags');
const request = require('node-superfetch');
const { shuffle, list } = require('../utility.js');
const types = ['multiple', 'boolean'];
const difficulties = ['easy', 'medium', 'hard'];
const choices = ['A', 'B', 'C', 'D'];

module.exports = {
    name: 'quiz',
    description: 'pick what type of quiz you want (multiple, boolean), then pick what level of difficulty you want (easy, medium, hard).',
    category: 'fun',
    run: async (message, args) => {
        if (args.length < 2) {
            return message.reply(`Please follow the format: /quiz <type(multiple, boolean)> <difficulty>`);
        }

        let type = args[0];
        let difficulty = args[1];

        try {
			const { body } = await request
				.get('https://opentdb.com/api.php')
				.query({
					amount: 1,
					type,
					encode: 'url3986',
					difficulty
				});
			if (!body.results) return message.reply('Oh no, a question could not be fetched. Try again later!');
			const answers = body.results[0].incorrect_answers.map(answer => decodeURIComponent(answer.toLowerCase()));
			const correct = decodeURIComponent(body.results[0].correct_answer.toLowerCase());
			answers.push(correct);
			const shuffled = shuffle(answers);
			await message.reply(stripIndents`
				**You have 15 seconds to answer this question.**
				${decodeURIComponent(body.results[0].question)}
				${shuffled.map((answer, i) => `**${choices[i]}**. ${answer}`).join('\n')}
			`);
			const filter = res => res.author.id === message.author.id && choices.includes(res.content.toUpperCase());
			const messages = await message.channel.awaitMessages(filter, {
				max: 1,
				time: 15000
			});
			if (!messages.size) return message.reply(`Sorry, time is up! It was ${correct}.`);
			const win = shuffled[choices.indexOf(messages.first().content.toUpperCase())] === correct;
			if (!win) return message.reply(`Nope, sorry, it's ${correct}.`);
			return message.reply('Nice job! 10/10! You deserve some cake!');
		} catch (err) {
			return message.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}

    }
}