module.exports = {
  name: "donate",
  category: 'redeems',
  description: "get redeems",
  usage: '.donate',
  run: async(client, message, args) => {
    message.channel.send("Check your DMs for donation link")
    return message.author.send("You can donate to the development of the bot using this link: https://www.paypal.me/daxly. To claim your rewards, join our support server using `.invite` in any server with the bot, then DM Utkarsh Kumar (ID 420525168381657090) to claim your rewards.")
  }
}
