// Core Discord File To Run
'use strict'

// Declare Variables
const DISCORD = require("discord.js");
const GAMEHANDLER = require("./Classes/GameHandler.js");
const fs = require("fs"); // File System for modifying configuration

var UpdateTimer = null;

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
			
			UpdateTimer = setInterval (function (){
				// Check for saving flag...
				//console.log('ping ' + GAMEHANDLER.GetTriggerSave());
				if (GAMEHANDLER.GetTriggerSave() == true){
					GAMEHANDLER.SetTriggerSave(false);
					GAMEHANDLER.Write();
				}
			 }, this.globalConfig.saveInterval); // time between each interval in milliseconds
			
			
		});
		
		// On message Check
		this.client.on("message", (message) => {
			if (!message.content.startsWith(this.globalConfig.prefix)) return; // Check for prefix before doing anything...
			if (message.author.bot) return; // always ignore bots!
			
			
			if(message.content.startsWith(this.globalConfig.prefix + "Hello")){
				//Test(message);
				message.channel.sendMessage("Hello World.");
			}
			else if (message.content.startsWith(this.globalConfig.prefix + "RefreshConfig")){
				message.channel.sendMessage("Attempting to refresh configuration.");
				this.globalConfig = JSON.parse(fs.readFileSync("./Data/GlobalConfig.json", 'utf8'));//require("./Data/GlobalConfig.json");
				GAMEHANDLER.RefreshConfig(this.globalConfig);
				message.channel.sendMessage("Refresh configuration successful.");
			}
			else if (message.content.startsWith(this.globalConfig.prefix + "GetTime")){
				//message.channel.sendMessage("Time:"+this.client.uptime);
				GAMEHANDLER.TestAction(message, this.client.uptime);
			}	
			else if (message.content.startsWith(this.globalConfig.prefix + "TestInterval")){
				message.channel.sendMessage("ID:"+message.author.id + " sent at:"+message.createdTimestamp);
			}
			// FINAL COMMANDS
			// This command will check the player stats.
			else if (message.content.startsWith(this.globalConfig.prefix + "stats")){
				GAMEHANDLER.Stats(message);
			}
		});

		
	}
	
}
var main = new Main();