import {ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder} from "discord.js";
module.exports = {
    embed: new EmbedBuilder()
    .setTitle('inventory')
    .setDescription('All the items you have in your inventory.'),
	data: new SlashCommandBuilder()
		.setName('inventory')
		.setDescription('Look at all your items'),
	async execute(interaction: ChatInputCommandInteraction) {
        interaction.reply({content:"Test Message!"})
	},
};