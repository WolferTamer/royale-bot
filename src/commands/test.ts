import {ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder} from "discord.js";
module.exports = {
    embed: new EmbedBuilder()
    .setTitle('test')
    .setDescription('A test function'),
	data: new SlashCommandBuilder()
		.setName('test')
		.setDescription('A test function'),
	async execute(interaction: ChatInputCommandInteraction) {
        interaction.reply({content:"Test Message!"})
	},
};