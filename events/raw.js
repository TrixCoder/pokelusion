const { Emoji, MessageReaction, Client, MessageEmbed } = require('discord.js');
const GiveawaySchema = require('../models/Giveaway');
const events = {
	MESSAGE_REACTION_ADD: 'messageReactionAdd',
	MESSAGE_REACTION_REMOVE: 'messageReactionRemove'
};
module.exports = async(client, event) => {
		if (!Object.hasOwnProperty.call(events, event.t)) return;

		const { d: data } = event;
		const user = client.users.cache.get(data.user_id);
		const channel = client.channels.cache.get(data.channel_id);

		const message = await channel.messages.fetch(data.message_id);
		const member = message.guild.members.cache.get(user.id);

		const emojiKey = (data.emoji.id) ? `${data.emoji.name}:${data.emoji.id}` : data.emoji.name;
		let reaction = message.reactions.cache.get(emojiKey);

		if (!reaction) {
			const emoji = new Emoji(client, data.emoji);
			reaction = new MessageReaction(client, emoji, message);
        }
        
		if (member.id !== client.user.id) {
            if (event.t === 'MESSAGE_REACTION_ADD') {
                if ((reaction.emoji.name === '🎉') || (reaction.emoji.toString() === '🎉') || (reaction.emoji.id === '🎉')) {
                    const result = await GiveawaySchema.findOne({id: message.guild.id, enabled: true, channel: channel.id, msgId: message.id});

                    if(!result || result.role == null) return;
                    let SucessEmbed = new MessageEmbed()
                    .setAuthor(`✅ Entry Approved ✅`, user.avatarURL({format: "png", dynamic: true}))
                    .setDescription(`Your entry to this [GIVEAWAY](${message.url}) has been approved.`)
                    .setFooter(client.config.footer(), client.user.avatarURL({format: "png", dynamic: true}))

                    /*if(result.req[0] == undefined && result.req[1] == undefined) {
                        return message.channel.send(embed);
                    } */
                    let role = message.guild.roles.cache.get(result.role);

                    if(!role) {
                        return message.guild.owner.send(`Hey. The giveaway [LINK](${message.url})'s role requirement role is missing. Please end the giveaway to not face any issue.`).catch(e => {});
                    }

                    let embed = new MessageEmbed()
                    .setAuthor(`❌ Entry Denied ❌`, user.avatarURL({format: "png", dynamic: true}))
                    .setFooter(client.config.footer(), client.user.avatarURL({format: "png", dynamic: true}))
                    if(!member.roles.cache.has(role.id)) {

                            await reaction.users.remove(user.id);
                            embed.setDescription(`You must have the role ${role.name} in the server in order to enter the [Giveaway](${message.url}).`);
                            return user.send(embed).catch(() => {});

                    } 

                    /*if(result.req[1] !== undefined) {
                        let data = result.req[1]
                        let guild = client.guilds.cache.get(data.id);
                        if(!guild) return message.guild.owner.send(`Hey. The giveaway [LINK](${message.url})'s server requirement doesn't exist. Either they removed me or the server maybe deleted. Please end the giveaway to not face any issue.`).catch(e => {});

                        if(!guild.members.cache.get(user.id)) {
                            await reaction.users.remove(user.id);
                            embed.setDescription(`You must be in ${guild.name} in order to join the giveaway. Join with this link [LINK](${data.link})`);
                            return user.send(embed).catch(() => {});

                        }

                    } */

                    return user.send(SucessEmbed).catch(() => {}); 

            }

        } 
    }
}