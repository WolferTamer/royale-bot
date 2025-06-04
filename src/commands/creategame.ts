//This command will allow users to create a game, then start configuring it.
//<gameName>

//  Table:
//  id : string             # The custom id generated for each game. Preferrably less than 6 characters.
//  gameName : string       # The name given to the game by the user, not unique.
//  guildid : string        # The id of the guild this game was created for. Since you can reference specific users, this is required for each game.
//  autoprogress : boolean  # Whether the bot should continuously progress the game once it starts
//  progressCooldown: int   # Milliseconds of how often the bot should send an update (each update should be one day or one morning/evening at a time)
//  started: boolean        # Whether the game has started or not. If the game has not been started or interacted with for an hour it will be deleted.
//  teamtype: string        # District/Team/Solo, How teams work in this game. "discricts" refer to hunger-games style districts, where people in the same district tend to work together
//                            but there's still only one winner. Teams make it so all surviving members of a group win, meaning teammates will almost never harm eachother.
//                            Solo means there are no strict teams at all, and it's fully survival of the fittest.
//  events: boolean         # Whether special events will take place or not
//  userid: string          # The userid who created the game
import { FieldPacket, ResultSetHeader} from 'mysql2';
import pool from '../mysql'
import {ChatInputCommandInteraction, EmbedBuilder, MessageFlags, SlashCommandBuilder, SlashCommandStringOption, SlashCommandSubcommandBuilder} from "discord.js";
module.exports = {
    embed: new EmbedBuilder()
    .setTitle('creategame')
    .setDescription('Create a new Royale game.'),
    data: new SlashCommandBuilder()
        .setName('creategame')
        .setDescription('Create a new Royale game.')
        .addStringOption(new SlashCommandStringOption()
            .setName('name')
            .setDescription('The name of the game to create')
            .setMaxLength(40)
            .setMinLength(1)
            .setRequired(true)),
        
    async execute(interaction: ChatInputCommandInteraction) {
        const gameName = interaction.options.getString('name', true)
        const client = interaction.client
        if(!interaction.guild) {
            interaction.reply({content:"You can only use this command inside a server."})
            return;
        }
        const guildID = interaction.guild.id
        try {
            const gameId = Math.round((Math.pow(36, 7) - Math.random() * Math.pow(36, 6))).toString(36).slice(1);
            let gameresult: [ResultSetHeader,FieldPacket[]] = await pool.execute('INSERT INTO game (id, gameName, userid, guildid, autoprogress,progressCooldown,started) VALUES (?,?,?,?,?,?,?)',
                [gameId,gameName,interaction.user.id,guildID,false,0,false])
            if(gameresult[0].affectedRows > 0) {
                interaction.reply({content:`Created ${gameName} with id: \`${gameId}\``})
            } else {
                interaction.reply({content:`Failed to create game, please try again`, flags:MessageFlags.Ephemeral})
            }
        } catch(e) {
            console.log(e)
            interaction.reply({content:`Failed to create game, please try again`, flags:MessageFlags.Ephemeral})
        }
    },
};