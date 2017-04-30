// Core Discord File To Run
'use strict'

// Declare Variables
const DISCORD = require("discord.js");
const GAMEHANDLER = require("./Classes/GameHandler.js");
const fs = require("fs"); // File System for modifying configuration

class Main {
	
	constructor(){
		// Create Variables
		this.client = new DISCORD.Client();
		this.globalConfig = JSON.parse(fs.readFileSync("./Data/GlobalConfig.json", 'utf8'));//require("./Data/GlobalConfig.json");
	
		// Check for config.
		try {
			var config = require('./config.json');   
		}
		catch (ex)
		{
			// Do nothing.
		}
		
		this.client.login(config.token || process.env.distoken);
		
		// Once everything is on and good to go, lets try clean code.
		// Load game stats
		GAMEHANDLER.Init(this.globalConfig);
		
		// Bot Loaded
		this.client.on('ready', () => {
			console.log('I am ready!');
		});
		
		// On message Check
		this.client.on("message", (message) => {
			if (!message.content.startsWith(this.globalConfig.prefix)) return; // Check for prefix before doing anything...
			if (message.author.bot) return; // always ignore bots!
			
			
			if(message.content.startsWith(this.globalConfig.prefix + "Hello")){
				//Test(message);
				message.channel.sendMessage("Hello World.");
			}
			else if (message.content.startsWith(this.globalConfig.prefix + "TestJson")){
				GAMEHANDLER.Test(message);
			}
			else if (message.content.startsWith(this.globalConfig.prefix + "TestEmbed")){
				GAMEHANDLER.Stats(message);
			}
			else if (message.content.startsWith(this.globalConfig.prefix + "RefreshConfig")){
				message.channel.sendMessage("Attempting to refresh configuration.");
				this.globalConfig = JSON.parse(fs.readFileSync("./Data/GlobalConfig.json", 'utf8'));//require("./Data/GlobalConfig.json");
				GAMEHANDLER.RefreshConfig(this.globalConfig);
				message.channel.sendMessage("Refresh configuration successful.");
			}
						
			/*else if (message.content.match("Shutdown")){
				message.channel.sendMessage("Bot Shutting Down...");
				process.exit(0);
			}*/
			/*else if (message.content.match("TestJson")){
				// if the points don't exist, init to 0;
				if (!points[message.author.id]) points[message.author.id] = {
					points: 0,
					level: 0
				};
				let userData = points[message.author.id];
				userData.points++;
				let curLevel = Math.floor(0.1 * Math.sqrt(userData.points));
				if (curLevel > userData.level) {
					// Level up!
					userData.level = curLevel;
					message.reply(`You've leveled up to level **${curLevel}**! Ain't that dandy?`);
				}
				
				//if (message.content.startsWith(prefix + "level")) {
				//if (message.content.startsWith(prefix + "level")) {
					message.reply(`You are currently level ${userData.level}, with ${userData.points} points.`);
				//}

				// And then, we save the edited file.
				//fs.writeFile('./points.json', JSON.stringify(points), (err) => {
				fs.writeFile(PATH, JSON.stringify(points), (err) => {
				if (err) console.error(err)
				});
				
			}
			
			*/
		});

		
	}
	
}
var main = new Main();
/*Init();

function Init(){
	console.log("Attempting to Init...");
	const Main = require ('./Main.js');
	Main.lala();
	
	var test = new (TestClass(ca));
	
}
*/


/*

var Discord = require("discord.js");
var client = new Discord.Client();




client.login(config.token || process.env.distoken);

// Once everything is on and good to go, lets try clean code.

client.on('ready', () => {
    console.log('I am ready!');
});
client.on("message", (message) => {
	if(message.content.startsWith("Leon")){
		Test(message);
	}
		
	
		//message.channel.sendMessage("Hello World.");
	
});

function Test(message){
	message.channel.sendMessage("Test");
}
*/