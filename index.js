const { Client, GatewayIntentBits, ActivityType, EmbedBuilder, Embed } = require('discord.js')
const {getShardInfo} = require('./src/shard-calc');
const{ infographs } = require('./src/infographics')
const { randomMusic } = require('./src/random-music')
const { time } = require('console');
const {Duration, DateTime} = require('luxon')

require('dotenv').config()

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.MessageContent,
    ]
})

const channelId = '1212872556626055278';
const timeZone = 'America/Los_Angeles';
const commandPrefix = "sky."

client.on('ready', (c) => {
    console.log(`Logged in as ${c.user.username}`);

    client.user.setActivity({
        name: 'Sky: Children of the Light',
        type: ActivityType.Playing,
    })
    scheduleDailyPost()
})

client.on('messageCreate', async (message) => {
    if (message.author.bot || !message.content.startsWith(commandPrefix)) return

    const content = message.content.trim
    const args = message.content.slice(commandPrefix.length).trim().split(/ +/)
    const command = args.shift().toLowerCase();

    if (command === "music"){
        if(!args.length){
            const embed = new EmbedBuilder()
                .setTitle('How To Use the Music Command!')
                .setDescription('Want to learn some new music, but dont know where to begin? Use the Music command!\nsky.music Genre')
                .setColor(0x9769e0)
                .setFields(
                    { name: "🇯🇵 Anime", value: "sky.music Anime\nReturns a random song from an anime." },
                    { name: "🎻 Classical", value: "sky.music Classical\nReturns a random classical song." },
                    { name: "🎬 Movies", value: "sky.music Movies\nReturns a random song from a movie." },
                    { name: "🎼 Original", value: "sky.music Orifinal\nReturns a random player created song\nNote: There are only two as of right now." },
                    { name: "🎸 Popular", value: "sky.music Popular\nReturns a random modern 'Pop' song." },
                    { name: "🎊 Traditional" , value: "sky.music Traditional\nReturns a random traditional song" },
                    { name: "🎮 Games", value: "sky.music Games\nReturns a random song from a video game" },
                    { name: "❓ Random", value: "sky.music Random\nReturns a random song from any genre" }
                )
            return message.reply({embeds : [embed]})
        } else {
            const music = await randomMusic(args)
            if(music !== false){
                message.reply(`I think you'd enjoy learning [this song](${music})!`)
            } else {
                message.reply(`I couldn't find any songs with the Genre '${args}'`)
            }
        }
    }

    if (command === 'feedback'){
        if(!args.length){
            return message.reply('Please provide your feedback after the command, like this `sky.Feedback Your Feedback Here`')
        }

        const feedbackContent = args.join(' ')
        const ownerID = process.env.OWNER_ID

        const user = await client.users.fetch(ownerID)

        if(!user) {
            return message.reply('Unable to contact bot owner. Please try again later')
        }

        user.send(`New feedback from @${message.author.tag} (${message.author.id}):\n${feedbackContent}`)
            .then(() => {
                message.reply('Feedback submitted successfully! Thanks for your input.')
            })
            .catch((err) => {
                console.error(`Error sending feedback: ${err}`)
                message.reply("An error occured while trying to submit feedback. Please try again later")
            })
    }

    if(command === "shard") {
        shardCommandHandler(message)
    }

    if(command === "help"){
        const embed = new EmbedBuilder()
            .setColor(0xd47839)
            .setTitle('List of Commands')
            .setDescription('Here is a list of commands that you can use with your Skykid!')
            .addFields(
                { name: '\u200b', value: '\u200b'},
                { name: '`sky.Help`', value: 'Displays a list of commands'},
                { name: '`sky.Shard`', value: 'Displays the Shard for the day'},
                { name: '`sky.Music`', value: 'Returns a random music sheet'},
                { name: '`sky.Feedback Your Feedback Here`', values: "Allows you to submit feedback directly to me! Report bugs or send me ideas you'd like to see!"}
            )
        message.reply({embeds: [embed], ephemeral : true})
    }
})

async function shardCommandHandler(message) {
    const now = new Date();
    const shardInfo = getShardInfo(now)

    const start1 = `<t:${Math.floor(shardInfo.occurrences[0].land / 1000)}:T>`;
    const start2 = `<t:${Math.floor(shardInfo.occurrences[1].land / 1000)}:T>`;
    const start3 = `<t:${Math.floor(shardInfo.occurrences[2].land / 1000)}:T>`;

    const end1 = `<t:${Math.floor(shardInfo.occurrences[0].end / 1000)}:T>`
    const end2 = `<t:${Math.floor(shardInfo.occurrences[1].end / 1000)}:T>`
    const end3 = `<t:${Math.floor(shardInfo.occurrences[2].end / 1000)}:T>`
    if(shardInfo.haveShard){
        const image = await infographs(shardInfo.isRed, shardInfo.map)
        const reply = new EmbedBuilder()
            .setColor(shardInfo.isRed ? 0xFF0000 : 0x000000)
            .setTitle(`Todays Shard Is ${shardInfo.isRed ? 'Red' : 'Black'}`)
            .setDescription("Here is all the information you need in regard to the shard!")
            .addFields(
                { name: "Realm", value: `${shardInfo.realm}`},
                { name: "Map", value: `${shardInfo.realm}` },
                { name: "First Landing", value: `Lands At ${start1}\nEnds At ${end1}`},
                { name: "Second Landing", value: `Lands At ${start2}\nEnds At ${end2}`},
                { name: "Final Landing", value: `Lands At ${start3}\nEnds At${end3}`},
                { name: "Rewarded AC", value: `${shardInfo.rewardAC ?? 'Not Specified'}`}
            )
            .setImage(image)

        message.reply({embeds: [reply]})
    } else {
        const imgURL = 'https://media.discordapp.net/attachments/801778605486374943/1213760402303885332/Image_6.jpeg?ex=65f6a576&is=65e43076&hm=75fc1e10cc1ac25dba9e2893ceb91511e2a36c5922c475aa267639d0fb53eb67&=&format=webp&width=1390&height=1390'
        const replyOptions = {
            files: imgURL ? [imgURL] : []
        }

        message.reply(replyOptions)
    }

}

async function postDailyShardInfo() {
    const now = new Date();
    const shardInfo = getShardInfo(now)

    const channel = await client.channels.fetch(channelId)

    const start1 = shardInfo.occurrences[0].land.setZone(timeZone).toLocaleString(DateTime.TIME_WITH_SECONDS)
    const start2 = shardInfo.occurrences[1].land.setZone(timeZone).toLocaleString(DateTime.TIME_WITH_SECONDS)
    const start3 = shardInfo.occurrences[2].land.setZone(timeZone).toLocaleString(DateTime.TIME_WITH_SECONDS)

    const end1 = shardInfo.occurrences[0].end.setZone(timeZone).toLocaleString(DateTime.TIME_WITH_SECONDS)
    const end2 = shardInfo.occurrences[1].end.setZone(timeZone).toLocaleString(DateTime.TIME_WITH_SECONDS)
    const end3 = shardInfo.occurrences[2].end.setZone(timeZone).toLocaleString(DateTime.TIME_WITH_SECONDS)
    if(shardInfo.haveShard) {
        const image = await infographs(shardInfo.isRed, shardInfo.map)
        const message = new EmbedBuilder()
            .setColor(shardInfo.isRed ? 0xFF0000 : 0x000000)
            .setTitle(`Todays Shard Is ${shardInfo.isRed ? 'Red' : 'Black'}`)
            .setDescription("Here is all the information you need in regard to the shard!")
            .addFields(
                { name: "Realm", value: `${shardInfo.realm}`},
                { name: "Map", value: `${shardInfo.realm}` },
                { name: "First Landing", value: `Lands At ${start1}\nEnds At ${end1}`},
                { name: "Second Landing", value: `Lands At ${start2}\nEnds At ${end2}`},
                { name: "Final Landing", value: `Lands At ${start3}\nEnds At${end3}`},
                { name: "Rewarded AC", value: `${shardInfo.rewardAC ?? 'Not Specified'}`}
            )
            .setImage(image)

        channel.send(message);
    } else {
        channel.send("No shard today");
    }
}

function scheduleDailyPost() {
    const now = new Date();
    const nextDay = new Date(now);
    nextDay.setDate(now.getDate() + 1)
    nextDay.setHours(3, 0, 0, 0)

    const timeUntilNextDay = nextDay.getTime() - now.getTime()
    setTimeout(() => {
        postDailyShardInfo();

        scheduleDailyPost();
    }, timeUntilNextDay)
}

client.login(process.env.BOT_TOKEN)