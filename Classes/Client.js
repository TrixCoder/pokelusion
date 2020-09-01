const {Client, MessageEmbed, Message, Collection} = require("discord.js");
const Enmap = require("enmap");
const fs = require("fs");

module.exports = class Bot extends Client {
  constructor() {
    super({
      fetchAllMembers: true
    });
    this.config = require("./../config");
    this.Discord = require("discord.js");
    this.commands = new Enmap();
    this.aliases = new Enmap();
    this.aliashelp = [];
    this.channelCooldown = new Set();
    this.collector = new Collection();
        this.channelCooldown = new Set();
        this.pokeCooldown = new Map();	  

  }
  
   /**
     * 
     * @param {object} msg The message
     * @param {object} author The author
     * @param {string} title The title
     * @param {string} description The description
     * @param {array} fields The array with fields
     * @param {object} footer The footer
     * @param {string} thumbnail The thumbnail url
     * @param {string} image the image
     * @param {array} files the array files
     * @param {string} url the url
     * @returns MessageEmbed Class with provided data.
     */
    async embed(channel, author, title, description, color, fields, footer, thumbnail, image, files, url) {
        let embed = new MessageEmbed()

        if(author) {
            if(typeof author !== "object") throw new Error(`Title must be a object.`);
            embed.setAuthor(author.name, author.av)
        }

        if(title) {
            if(typeof title !== "string") throw new Error(`title must be a string.`);
            embed.setTitle(title);
        }

        if(description) {
            if(typeof description !== "string") throw new Error(`Description must be a string.`)
            embed.setDescription(description);
        }
        embed.setColor(color ? color : "#05f5fc")
      

        if(fields) {
            if(Array.isArray(fields)) {
            fields.forEach(r => {
                embed.addField(r.name, r.value,  (r.inline) ? r.inline : false);
            });
        }

        }
        if(footer) {
            if(typeof footer !== "object") throw new Error(`Footer must be a object`)
            embed.setFooter(footer.name, footer.av)
            .setTimestamp();
        }
        if(thumbnail) {
            if(typeof thumbnail !== "string") throw new Error(`Thumbnail is not a string.`);
            embed.setThumbnail(thumbnail);
        }
        if(image) {
            if(typeof image !== "string") throw new Error(`Image must be a string url.`);
            embed.setImage(image);

        }

        if(files) {
            if(Array.isArray(files)) {
                embed.attachFiles(files);
            }
        }

        return channel.send(embed);
    }
    /**
	 * Parse ms and returns a string
	 * @param {number} milliseconds The amount of milliseconds
	 * @returns The parsed milliseconds
	 */

    async convertMs(milliseconds){
		let roundTowardsZero = milliseconds > 0 ? Math.floor : Math.ceil;
		let days = roundTowardsZero(milliseconds / 86400000),
		hours = roundTowardsZero(milliseconds / 3600000) % 24,
		minutes = roundTowardsZero(milliseconds / 60000) % 60,
		seconds = roundTowardsZero(milliseconds / 1000) % 60;
		if(seconds === 0){
			seconds++;
		}
		let isDays = days > 0,
		isHours = hours > 0,
		isMinutes = minutes > 0;
		let pattern = 
		(!isDays ? "" : (isMinutes || isHours) ? "{days} days, " : "{days} days and ")+
		(!isHours ? "" : (isMinutes) ? "{hours} hours, " : "{hours} hours and ")+
		(!isMinutes ? "" : "{minutes} minutes and ")+
		("{seconds} seconds");
		let sentence = pattern
			.replace("{duration}", pattern)
			.replace("{days}", days)
			.replace("{hours}", hours)
			.replace("{minutes}", minutes)
			.replace("{seconds}", seconds);
		return sentence;
    }

    

    /**
     * 
     * @param {array} Array The array to shuffle; 
     * @returns Shuffled Array
     */
    shuffle(arr) {
        for (let i = arr.length; i; i--) {
            const j = Math.floor(Math.random() * i);
            [arr[i - 1], arr[j]] = [arr[j], arr[i - 1]];
        }
        return arr;
    }
    /**
     * 
     * @param {array} Array The Array to choose one random from; 
     * @returns random chosen one;
     */
    draw(list) {
        const shuffled = this.shuffle(list);
        return shuffled[Math.floor(Math.random() * shuffled.length)];
    }
  
}
