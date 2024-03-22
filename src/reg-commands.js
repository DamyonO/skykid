require('dotenv').config()
const {REST, Routes} = require('discord.js')

const botID = process.env.CLIENT_ID
const botToken = process.env.BOT_TOKEN

const rest = new REST().setToken(botToken)
const regCommand = async () => {
    try {
        await rest.put(Routes.applicationCommands(botID), {
            body : [
                {
                    name: 'shard',
                    description: 'Returns todays shard'
                },
                {
                    name: 'music',
                    description: 'Returns a random music sheet',
                    options: [
                        {
                            name: "genre",
                            description: "What genre of music",
                            required: false,
                            type: 3,
                            choices: [
                                {
                                    name: "Anime",
                                    value: "Anime"
                                },
                                {
                                    name: "Classical",
                                    value: "Classical"
                                },
                                {
                                    name: "Movies",
                                    value: "Movies"
                                },
                                {
                                    name: "Original",
                                    value: "Original"
                                },
                                {
                                    name: "Popular",
                                    value: "Popular"
                                },
                                {
                                    name: "Traditional",
                                    value: "Traditional"
                                },
                                {
                                    name: "Games",
                                    value: "Games"
                                },
                                {
                                    name: "Random",
                                    value: "Random"
                                }
                            ]
                        }

                    ]
                }
            ]
        })
    } catch (err) {
        console.error(err)
    }
}

regCommand()