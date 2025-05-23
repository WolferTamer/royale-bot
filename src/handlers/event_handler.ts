import { Client } from "discord.js";
import * as fs from 'node:fs';
import * as path from 'node:path';
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}


module.exports = async (client: Client) => {
    const eventsPath = path.join(__dirname, '../events');
    const eventFiles = fs.readdirSync(eventsPath).filter((file:any) => file.endsWith('.js') || file.endsWith('ts'));

    //reads every file in /events/ and adds the .on/.once registers to them
    for (const file of eventFiles) {
        const filePath = path.join(eventsPath, file);
        const event = require(filePath);
        if (event.once) {
            client.once(event.name, (...args) => event.execute(...args));
        } else {
            client.on(event.name, (...args) => event.execute(...args));
        }
    }
};