import { Client, REST, Routes } from "discord.js";
import * as fs from 'node:fs';
import * as path from 'node:path';
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}


module.exports = async (client: Client) => {
    let commands: any = [];

    const foldersPath = path.join(__dirname, '../commands');
    const commandFiles = fs.readdirSync(foldersPath);
    
    //Goes through every file in src/commands/ and adds it to the list. 

    for (const file of commandFiles) {
        const filePath = path.join(foldersPath, file);
        const command = require(filePath);
        // Set a new item in the Collection with the key as the command name and the value as the exported module
        if ('data' in command && 'execute' in command) {
            client.commands.set(command.data.name, command);
            commands.push(command.data.toJSON());
        } else {
            console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
        }
    }
    if(!process.env.DISCORD_TOKEN) {
        console.error(`[ERROR] No discord token is defined, stopping application.`)
        process.exit(1)
    }
    const rest = new REST().setToken(process.env.DISCORD_TOKEN!);

    // and deploy your commands!
    //Registers both the application and guild commands. Guild commands are registered in a specific server.
    (async () => {
        try {
            console.log(`Started refreshing ${commands.length} application (/) commands.`);

            // The put method is used to fully refresh all commands in the guild with the current set
            if(!process.env.CLIENT) {
                console.error(`[ERROR] No discord client is defined, stopping application.`)
                process.exit(1)
            }
            if(!process.env.GUILD) {
                console.error(`[WARNING] No discord guild is defined, no server-level test commands will be added.`)
                
            } else {
                var data : any = await rest.put(
                    Routes.applicationGuildCommands(process.env.CLIENT!, process.env.GUILD!),
                    { body: commands },
                );
                console.log(`Successfully reloaded ${data.length} guild (/) commands.`);
            }
            const globalData: any = await rest.put(
                Routes.applicationCommands(process.env.CLIENT!),
                { body: commands },
            );
            console.log(`Successfully reloaded ${globalData.length} application (/) commands.`);
        } catch (error) {
            // And of course, make sure you catch and log any errors!
            console.error(error);
        }
    })();
};