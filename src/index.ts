import 'dotenv/config'
import {Client, Collection, IntentsBitField} from 'discord.js'
import './mysql'

declare module "discord.js" {
  export interface Client {
    commands: Collection<any, any>;
    events: Collection<any, any>;
    cooldowns: Collection<any,any>;
  }
}

const client = new Client({
    'intents':[IntentsBitField.Flags.Guilds,IntentsBitField.Flags.GuildMessages]
})

client.commands = new Collection()
client.cooldowns = new Collection()
client.events = new Collection()

client.on('ready', (c) => {
    console.log(`${c.user.username} is online.`);
    ['command_handler', 'event_handler'].forEach(handler => {
        require(`./handlers/${handler}`)(client);
    })
})

client.login(process.env.DISCORD_TOKEN)
console.log(process.env.DISCORD_TOKEN)

