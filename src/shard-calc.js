/*
    Code for the Shard Calculator comes from PlutoyDev on GitHub
    Translated by me for JS

    Sky Shard Web App Created by PlutoyDev: https://sky-shards.pages.dev/
    Source Code: https://github.com/PlutoyDev/sky-shards
*/

const { Duration, DateTime } = require('luxon');

const earlySkyOffset = Duration.fromObject({ minutes: -32, seconds: -10});
const eruptionOffset = Duration.fromObject({ minutes: 7});
const landOffset = Duration.fromObject({ minutes: 8, seconds: 40});
const endOffset = Duration.fromObject({ hours: 4});

const blackShardInterval = Duration.fromObject({ hours: 8});
const redShardInterval = Duration.fromObject({ hours: 6});

const realms = ['prairie', 'forest', 'valley', 'wasteland', 'vault'];
const realmsFull = ['Daylight Prariie', 'Hidden Forest', 'Valley of Triumph', 'Golden Wasteland', 'Vault of Knowledge'];
const realmsNick = ['Prairie', 'Forest', 'Valley', 'Wasteland', 'Vault'];

const shardsInfo = [
    {
        noShardWkDay: [6, 7],
        interval: blackShardInterval,
        offset: Duration.fromObject({
            hours: 1,
            minutes: 50,
        }),
        maps: ['Butterfly', 'Brook', 'Rink', 'Temple', 'Starlight'],
    },
    {
        noShardWkDay: [7, 1],
        interval: blackShardInterval,
        offset: Duration.fromObject({
            hours: 2,
            minutes: 10
        }),
        maps: ['Koi', 'Boneyard', 'Rink', 'Battlefield', 'Starlight']
    },
    {
        noShardWkDay: [1,2],
        interval: redShardInterval,
        offset: Duration.fromObject({
            hours:7,
            minutes: 40
        }),
        maps: ['Cave', 'End', 'Dreams', 'Graveyard', 'Jelly'],
        defRewardAC: 2
    },
    {
        noShardWkDay: [2, 3],
        interval: redShardInterval,
        offset: Duration.fromObject({
            hours: 2,
            minutes: 20
        }),
        maps: ['Bird', 'Tree', 'Dreams', 'Crab', 'Jelly'],
        defRewardAC: 2.5,
    },
    {
        noShardWkDay: [3, 4],
        interval: redShardInterval,
        offset: Duration.fromObject({
            hours: 3,
            minutes: 30
        }),
        maps: ['Island', 'Sunny', 'Hermit', 'Ark', 'Jelly'],
        defRewardAC: 3.5,
    },
];

const overrideRewardAC = {
    'End': 2.5,
    'Dreams': 2.5,
    'Tree': 3.5,
    'Jelly': 3.5
};

function getShardInfo(date) {
    const today = DateTime.fromJSDate(date, {zone : 'America/Los_Angeles'}).startOf('day')
    const [dayOfMth, dayOfWk] = [today.day, today.weekday]
    const isRed = dayOfMth % 2 === 1
    const realmIdx = (dayOfMth - 1) % 5
    const infoIndex = isRed ? (((dayOfMth - 1) / 2) % 3) + 2 : (dayOfMth / 2) % 2
    const { noShardWkDay, interval, offset, maps, defRewardAC } = shardsInfo[infoIndex]
    const haveShard = !noShardWkDay.includes(dayOfWk)
    const map = maps[realmIdx]
    const rewardAC = isRed ? overrideRewardAC[map] ?? defRewardAC : undefined
    let firstStart = today.plus(offset)
    if (dayOfWk === 7 && today.isInDST !== firstStart.isInDST) {
        firstStart = firstStart.plus({ hours: firstStart.isInDST ? -1 : 1})
    }
    const occurrences = Array.from({ length: 3 }, (_, i) => {
        const start = firstStart.plus(interval.mapUnits(x => x * i))
        const land = start.plus(landOffset)
        const end = start.plus(endOffset)
        return { start, land, end}
    })
    return {
        date,
        isRed,
        haveShard,
        offset,
        interval,
        lastEnd: occurrences[2].end,
        realm: realmsFull[realmIdx],
        map,
        rewardAC,
        occurrences,
    }
}

module.exports = {getShardInfo}