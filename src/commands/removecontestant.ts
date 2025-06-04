//Each game requires contestants. By default each game will have the original 24 contestants from the hunger games, but can be swapped in for custom people or actual discord users in the server.
//<gameid> (user|custom) [name] [image] [district]

//  Table:
//  contestantid: string
//  gameid: string
//  district: int
//  name : string
//  imageurl : string
//  dead : boolean
//  
import {ChatInputCommandInteraction, EmbedBuilder, MessageFlags, SlashCommandBuilder, SlashCommandStringOption, SlashCommandSubcommandBuilder, SlashCommandUserOption} from "discord.js";
import * as https from 'https'
import * as http from 'http'
import * as url from 'url'
import pool from "../mysql";
import { FieldPacket, OkPacket, QueryResult, ResultSetHeader, RowDataPacket } from "mysql2";
import { Contestant } from "../db/objects";

module.exports = {
    embed: new EmbedBuilder()
    .setTitle('removecontestant')
    .setDescription('All the items you have in your inventory.'),
    data: new SlashCommandBuilder()
        .setName('removecontestant')
        .setDescription('Remove a contestant from a game')
        .addStringOption( new SlashCommandStringOption()
            .setName("name")
            .setDescription("The name of the contestant you want to remove.")
            .setRequired(true))
        .addStringOption( new SlashCommandStringOption()
                .setName("game")
                .setDescription("The ID of the game you want to remove from")
                .setRequired(true)),
    async execute(interaction: ChatInputCommandInteraction) {
        //If user, grab their nickname and profile picture.
        let name = interaction.options.getString('name')!

        let game = interaction.options.getString('game')!
        let guildId = interaction.guildId!
        //Check that game ID is valid
        const gameInfo: [RowDataPacket[], FieldPacket[]] = await pool.query(`SELECT * FROM game WHERE id = ? AND guildid = ? AND userid = ?`,[game,guildId,interaction.user.id])

        if(gameInfo[0].length < 1) {
           interaction.reply({content:`No game with ID ${game} found.`, flags:MessageFlags.Ephemeral})
           return;
        }

        const contestants: [Contestant[],FieldPacket[]] = await pool.query(`SELECT * FROM contestant WHERE name = ? and gameid = ?`,[name,game])

        if(contestants[0].length < 1) {
            interaction.reply({content: `No contestant with that name is in game ${game}`, flags:MessageFlags.Ephemeral})
            return;
        }

        const deleted: [ResultSetHeader,FieldPacket[]] = await pool.query(`DELETE FROM contestant WHERE contestantid = ?`, [contestants[0][0].contestantid])

        if(deleted[0].affectedRows < 0) {
          interaction.reply({content:`Failed to delete that contestant. Please try again.`, flags:MessageFlags.Ephemeral})
        } else {
          interaction.reply({content:`Deleted contestant ${name} from game \`${game}\``})
        }
    },
};