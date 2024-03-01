const { Client, GatewayIntentBits, ActivityType } = require('discord.js')
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

client.on('messageCreate', (message) => {
    if (message.author.bot) return

    const content = message.content.trim

    if(message.content === (commandPrefix + 'Shard')) {
        shardCommandHandler(message)
    }

    if(message.content === (commandPrefix + 'hi')){
        message.reply("Hi!")
    }
})

function shardCommandHandler(message) {
    const now = new Date();
    const shardInfo = getShardInfo(now)

    const start1 = `<t:${Math.floor(shardInfo.occurrences[0].start / 1000)}:T>`;
    const start2 = `<t:${Math.floor(shardInfo.occurrences[1].start / 1000)}:T>`;
    const start3 = `<t:${Math.floor(shardInfo.occurrences[2].start / 1000)}:T>`;

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

    const start1 = shardInfo.occurrences[0].start.setZone(timeZone).toLocaleString(DateTime.TIME_WITH_SECONDS)
    const start2 = shardInfo.occurrences[1].start.setZone(timeZone).toLocaleString(DateTime.TIME_WITH_SECONDS)
    const start3 = shardInfo.occurrences[2].start.setZone(timeZone).toLocaleString(DateTime.TIME_WITH_SECONDS)

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