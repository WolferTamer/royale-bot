
import {ChatInputCommandInteraction, EmbedBuilder, MessageFlags, SlashCommandBuilder, SlashCommandStringOption, SlashCommandSubcommandBuilder, SlashCommandUserOption} from "discord.js";
import * as https from 'https'
import * as http from 'http'
import * as url from 'url'
import pool from "../mysql";
import { FieldPacket, ResultSetHeader, RowDataPacket } from "mysql2";

module.exports = {
    embed: new EmbedBuilder()
    .setTitle('addcontestant')
    .setDescription('All the items you have in your inventory.'),
    data: new SlashCommandBuilder()
        .setName('addcontestant')
        .setDescription('Add a contestant to a game')
        .addSubcommand(new SlashCommandSubcommandBuilder()
            .setName("user")
            .setDescription("Choose a user in your server to add to the game.")
            .addUserOption( new SlashCommandUserOption()
                .setName("user")
                .setDescription("The user you want to add as a contestant")
                .setRequired(true))
            .addStringOption( new SlashCommandStringOption()
                    .setName("game")
                    .setDescription("The ID of the game you want to add this too")
                    .setRequired(true)))
        .addSubcommand(new SlashCommandSubcommandBuilder()
            .setName("custom")
            .setDescription("Manually choose an image and name to add to the game.")
                .addStringOption( new SlashCommandStringOption()
                    .setName("name")
                    .setDescription("The name of the contestant")
                    .setRequired(true))
                .addStringOption( new SlashCommandStringOption()
                    .setName("img")
                    .setDescription("The url to the image you want to use for this contestant")
                    .setRequired(true))
                .addStringOption( new SlashCommandStringOption()
                    .setName("game")
                    .setDescription("The ID of the game you want to add this too")
                    .setRequired(true))),
    async execute(interaction: ChatInputCommandInteraction) {
        //If user, grab their nickname and profile picture.
        const subcommand = interaction.options.getSubcommand()
        let imageurl : string = ""
        let name : string = ""
        if(subcommand === "user") {
            let user = interaction.options.getUser('user')!
            imageurl = user.displayAvatarURL({extension:'png',size:64})!
            name = user.displayName
        } else {
            //Check that URL of img is valid
            name = interaction.options.getString('name')!
            imageurl = interaction.options.getString('img')!

            let isimg = await isImageUrl(imageurl)

            if (!isimg) {
                interaction.reply({content:'The image url you provided did not lead to an image. Please try again.', flags:MessageFlags.Ephemeral})
                return
            }
        }
        let game = interaction.options.getString('game')!
        let guildId = interaction.guildId!
        //Check that game ID is valid
        const gameInfo: [RowDataPacket[], FieldPacket[]] = await pool.query(`SELECT * FROM game WHERE id = ? AND guildid = ? AND userid = ?`,[game,guildId,interaction.user.id])

        if(gameInfo[0].length < 1) {
           interaction.reply({content:`No game with ID ${game} found.`, flags:MessageFlags.Ephemeral})
           return;
        }

        //INSERT contestant
        const contestantid = game+Math.round((Math.pow(36, 5) - Math.random() * Math.pow(36, 4))).toString(36).slice(1);
        const insert: [ResultSetHeader, FieldPacket[]] = await pool.execute(`INSERT INTO contestant (contestantid, gameid, district, name, imageurl, dead) VALUES (?,?,?,?,?,?)`, 
          [contestantid,game,1,name,imageurl,false])
        if(insert[0].affectedRows < 0) {
          interaction.reply({content:`Failed to create contestant, please try again.`, flags:MessageFlags.Ephemeral})
        } else {
          interaction.reply({content:`Created contestant ${name} for game \`${game}\``})
        }
    },
};

async function isImageUrl(inputUrl: string) {
  try {
    const parsedUrl = new url.URL(inputUrl);
    const protocol = parsedUrl.protocol === 'https:' ? https : http;

    const options = {
      method: 'HEAD',
    };

    return new Promise((resolve, reject) => {
      const req = protocol.request(inputUrl, options, (res) => {
        if (res.statusCode! >= 200 && res.statusCode! < 300) {
          const contentType = res.headers['content-type'];
          resolve(contentType && contentType.startsWith('image/'));
        } else {
          resolve(false);
        }
      });

      req.on('error', (error) => {
        reject(error);
      });

      req.end();
    });
  } catch (error) {
    return false;
  }
}