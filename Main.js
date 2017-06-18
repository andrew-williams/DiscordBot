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
			var presenceData = new Object();
			presenceData["status"] = "dnd";
			this.client.user.setPresence(presenceData);
			this.client.user.setGame('%cmd For Commands');
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
			// FINAL COMMANDS
			// This command will check the player stats.
			else if (message.content.startsWith(this.globalConfig.prefix + "cmd")){
				GAMEHANDLER.DisplayGameCommands(message);
			}
			else if (message.content.startsWith(this.globalConfig.prefix + "newgame")){
				GAMEHANDLER.CreateNewCharacter(message, this.client.uptime);
			}
			else if (message.content.startsWith(this.globalConfig.prefix + "stats")){
				GAMEHANDLER.Stats(message);
			}
			else if (message.content.startsWith(this.globalConfig.prefix + "inv")){
				GAMEHANDLER.Inv(message);
			}
			else if (message.content.startsWith(this.globalConfig.prefix + "mine")){
				GAMEHANDLER.Mine(message, this.client.uptime);
			}
			else if (message.content.startsWith(this.globalConfig.prefix + "fish")){
				GAMEHANDLER.Fish(message, this.client.uptime);
			}
			else if (message.content.startsWith(this.globalConfig.prefix + "forage")){
				GAMEHANDLER.Forage(message, this.client.uptime);
			}
			else if (message.content.startsWith(this.globalConfig.prefix + "plant")){
				GAMEHANDLER.Plant(message, this.client.uptime);
			}
			else if (message.content.startsWith(this.globalConfig.prefix + "farm")){
				GAMEHANDLER.Farm(message, this.client.uptime);
			}
			else if (message.content.startsWith(this.globalConfig.prefix + "chop")){
				GAMEHANDLER.Chop(message, this.client.uptime);
			}
				
		});

		
	}
	
}
var main = new Main();