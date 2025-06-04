import { APIEmbedField, ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder, SlashCommandStringOption } from "discord.js";
import pool from "../mysql";
import { FieldPacket, RowDataPacket } from "mysql2";
import {Game, Contestant} from '../db/objects'

module.exports = {
    embed: new EmbedBuilder()
    .setTitle('game')
    .setDescription('Create a new Royale game.'),
    data: new SlashCommandBuilder()
        .setName('game')
        .setDescription('View a game you\'ve made')
        .addStringOption(new SlashCommandStringOption()
            .setName('id')
            .setDescription('Id of the game')
            .setMaxLength(8)
            .setMinLength(1)
            .setRequired(true)),
        
    async execute(interaction: ChatInputCommandInteraction) {
        const gameId = interaction.options.getString('id')!
        const userId = interaction.user.id
        let gameRes : [Game[],FieldPacket[]] = await pool.query<Game[]>('SELECT * FROM game WHERE id = ? AND userid = ?', [gameId,userId])
        
        if(gameRes[0].length > 0) {
            let contestantRes : [Contestant[], FieldPacket[]] = await pool.query<Contestant[]>('SELECT * FROM contestant WHERE gameid = ?', [gameId])
            
            let maxDistrict = 0
            for(let i of contestantRes[0]) {
                if(i.district > maxDistrict) {
                    maxDistrict = i.district
                }
            }
            let contestants = new Array<[string]>(maxDistrict-1)
            for(let i of contestantRes[0]) {
                if(!contestants[i.district-1] ) {
                    contestants[i.district-1] = [i.name]
                } else {
                    contestants[i.district-1].push(i.name)
                }
            }

            let fields : APIEmbedField[] = []
            for(let i = 0; i < contestants.length; i++) {
                let district = contestants[i]
                if(district.length > 0) {
                    let str = district[0]
                    for(let j = 1; j < district.length; j++) {
                        str += ` and ${district[j]}`
                    }

                    fields.push({name:`District ${i}`, value:str, inline:true})
                }
            }

            let game = gameRes[0][0]
            let embed = new EmbedBuilder()
                .setTitle(`Game ${game.gameName}`)
                .setColor(0x0000FF)
                .addFields(fields)
                .setFooter({text: `ID ${gameId}`})
            interaction.reply({embeds:[embed]})
        } else {
            interaction.reply({content:`Failed to find game ${gameId}`})
        }
    }
}