const { Duration, DateTime } = require('luxon');

const earlySkyOffset = Duration.fromObject({ minutes: -32, seconds: -10});
const eruptionOffset = Duration.fromObject({ minutes: 7});
const landOffset = Duration.fromObject({ minutes: 8, seconds: 40});
const endOffset = Duration.fromObject({ hours: 4});

const blackShardInterval = Duration.fromObject({ hours: 8});
const redShardInterval = Duration.fromObject({ hours: 6});

const realms = ['prarie', 'forest', 'valley', 'wasteland', 'vault'];
const realmsFull = ['Daylight Prarie', 'Hidden Forest', 'Valley of Triumph', 'Golden Wasteland', 'Vault of Knowledge'];
const realmsNick = ['Prarie', 'Forest', 'Valley', 'Wasteland', 'Vault'];

const shardsInfo = [
    {
        noShardWkDay: [6, 7],
        interval: blackShardInterval,
        offset: Duration.fromObject({
            hours: 1,
            minutes: 50,
        }),
        maps: ['prairie.butterfly', 'forest.brook', 'valley.rink', 'wasteland.temple', 'vault.starlight'],
    },
    {
        noShardWkDay: [7, 1],
        interval: blackShardInterval,
        offset: Duration.fromObject({
            hours: 2,
            minutes: 10
        }),
        maps: ['prairie.village', 'forest.boneyard', 'valley.rink', 'wasteland.battlefield', 'vault.starlight']
    },
    {
        noShardWkDay: [1,2],
        interval: redShardInterval,
        offset: Duration.fromObject({
            hours:7,
            minutes: 40
        }),
        maps: ['prairie.cave', 'forest.end', 'valley.dreams', 'wasteland.graveyard', 'vault.jelly'],
        defRewardAC: 2
    },
    {
        noShardWkDay: [2, 3],
        interval: redShardInterval,
        offset: Duration.fromObject({
            hours: 2,
            minutes: 20
        }),
        maps: ['prairie.bird', 'forest.tree', 'valley.dreams', 'wasteland.crab', 'vault.jelly'],
        defRewardAC: 2.5,
    },
    {
        noShardWkDay: [3, 4],
        interval: redShardInterval,
        offset: Duration.fromObject({
            hours: 3,
            minutes: 30
        }),
        maps: ['prairie.island', 'forest.sunny', 'valley.hermit', 'wasteland.ark', 'vault.jelly'],
        defRewardAC: 3.5,
    },
];

const overrideRewardAC = {
    'forest.end': 2.5,
    'valley.dreams': 2.5,
    'forest.tree': 3.5,
    'vault.jelly': 3.5
};