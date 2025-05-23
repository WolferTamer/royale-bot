import 'dotenv/config'
import {Client, Collection, IntentsBitField} from 'discord.js'
import * as mysql from 'mysql2/promise'
import updateTables from './db/initdb';

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

client.on('ready', (c) => {
    console.log(`${c.user.username} is online.`);
    ['command_handler', 'event_handler'].forEach(handler => {
        require(`./handlers/${handler}`)(client);
    })
})

try {
  const pool = mysql.createPool({
    connectionLimit:10,
    host:process.env.MYSQL_HOST ? process.env.MYSQL_HOST: 'localhost',
    user:process.env.MYSQL_USER ? process.env.MYSQL_USER: 'royale',
    password:process.env.MYSQL_PASSWORD ? process.env.MYSQL_PASSWORD: '',
    database:'royale'
  })
  //have to create tables, or alter them if they already exist.
  updateTables(pool)
  
} catch(e) {
  console.error("[ERROR] Failed to connect to the MySQL database, stopping.")
  process.exit(1)
}

client.login(process.env.DISCORD_TOKEN)
console.log(process.env.DISCORD_TOKEN)

