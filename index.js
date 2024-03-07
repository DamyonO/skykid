const { Client, GatewayIntentBits, ActivityType, EmbedBuilder, Embed } = require('discord.js')
const {getShardInfo} = require('./src/shard-calc');
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
                { name: 'sky.Music', value: 'Returns a random music sheet (WIP)'}
            )
        message.reply({embeds: [embed], ephemeral : true})
    }
    if (command === "music") {
        message.reply("WIP")
    }
})

function shardCommandHandler(message) {
    const now = new Date();
    const shardInfo = getShardInfo(now)

    const start1 = `<t:${Math.floor(shardInfo.occurrences[0].land / 1000)}:T>`;
    const start2 = `<t:${Math.floor(shardInfo.occurrences[1].land / 1000)}:T>`;
    const start3 = `<t:${Math.floor(shardInfo.occurrences[2].land / 1000)}:T>`;

    const end1 = `<t:${Math.floor(shardInfo.occurrences[0].end / 1000)}:T>`
    const end2 = `<t:${Math.floor(shardInfo.occurrences[1].end / 1000)}:T>`
    const end3 = `<t:${Math.floor(shardInfo.occurrences[2].end / 1000)}:T>`

    if (shardInfo.haveShard) {
        const reply = `**Daily Shard Info:**\n`
        + `Realm: ${shardInfo.realm}\n`
        + `Map: ${shardInfo.map}\n`
        + `Shard Type: ${shardInfo.isRed ? `Red` : `Black`}\n`
        + `Start Time 1: ${start1}\n`
        + `End Time 1: ${end1}\n`
        + `Start Time 2: ${start2}\n`
        + `End Time 2: ${end2}\n`
        + `Start Time 3: ${start3}\n`
        + `End Time 3: ${end3}\n`
        + `Reward AC: ${shardInfo.rewardAC ?? 'Not Specified'}`
    
        message.reply(reply);
      } else {
        message.reply("No shard today.");
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
        const message = `**Daily Shard Info:**\n`
        + `Realm: ${shardInfo.realm}\n`
        + `Map: ${shardInfo.map}\n`
        + `Shard Type: ${shardInfo.isRed ? `Red` : `Black`}\n`
        + `Start Time 1: ${start1}\n`
        + `End Time 1: ${end1}\n`
        + `Start Time 2: ${start2}\n`
        + `End Time 2: ${end2}\n`
        + `Start Time 3: ${start3}\n`
        + `End Time 3: ${end3}\n`
        + `Reward AC: ${shardInfo.rewardAC ?? 'Not Specified'}`

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