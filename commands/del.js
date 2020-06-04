const cooldown = new Map();

module.exports = {
    name: "del",
    description: "bulk delete/purge messages",
    category: "moderation",
    run: async (message, args) => {

        if (!message.member.hasPermission("MANAGE_MESSAGES")) {
            return
        } 

        if (!message.guild.me.hasPermission("MANAGE_MESSAGES")) {
            return message.channel.send("<a:1603_Animated_Cross:716318362644381757> I am lacking permission: 'MANAGE_MESSAGES'");
        }

        if (cooldown.has(message.member.id)) {
            const init = cooldown.get(message.member.id)
            const curr = new Date()
            const diff = Math.round((curr - init) / 1000)
            const time = 30 - diff

            const minutes = Math.floor(time / 60)
            const seconds = time - minutes * 60

            let remaining

            if (minutes != 0) {
                remaining = `${minutes}m${seconds}s`
            } else {
                remaining = `${seconds}s`
            }
            return message.channel.send("<a:1603_Animated_Cross:716318362644381757> Still on cooldown for " + remaining);
        }

        if (isNaN(args[0]) || parseInt(args[0]) <= 0) {
            return message.channel.send("<a:1603_Animated_Cross:716318362644381757> /del <amount>");
        }

        let amount = parseInt(args[0]) + 1

        if (!message.member.hasPermission("ADMINISTRATOR")) {
            if (amount > 1000) {
                amount = 1000
            }
            cooldown.set(message.member.id, new Date());

            setTimeout(() => {
                cooldown.delete(message.member.id);
            }, 30000);
        }
        
        if (amount <= 100) {
            await message.channel.bulkDelete(amount).catch(() => {
                message.channel.send("<a:1603_Animated_Cross:716318362644381757> Unable to delete " + amount + " messages").then(m => m.delete({timeout: 5000}))
                return
            })
        } else {
            const amount1 = amount
            let fail = false
            if (amount > 10000) {
                amount = 10000
            }

            for (let i = 0; i < (amount1 / 100); i++) {
                if (amount <= 100) {
                    await message.channel.bulkDelete(amount).catch(() => {
                        message.channel.send("<a:1603_Animated_Cross:716318362644381757> Unable to delete " + amount + " messages").then(m => m.delete({timeout: 5000}))
                        fail = true
                    })
                    break
                }

                await message.channel.bulkDelete(100).catch(() => {
                    message.channel.send("<a:1603_Animated_Cross:716318362644381757> Unable to delete " + amount + " messages").then(m => m.delete({timeout: 5000}))
                    fail = true
                })
                if (fail) {
                    break
                }
                amount = amount - 100
            }
        }

    }
}