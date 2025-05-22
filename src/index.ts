import 'dotenv/config'
import {Client} from 'discord.js'

const client = new Client({
    'intents':['Guilds','GuildMessages','GuildMembers','MessageContent']
})

client.on('ready', (c) => {
    console.log(`${c.user.username} is online.`);
})

console.log(process.env.DISCORD_TOKEN)