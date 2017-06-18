const fs = require("fs");
const SKILL_MINING = require("./Skills/Mining.js");
const SKILL_WOODCUTTING = require("./Skills/Woodcutting.js");
const SKILL_FISHING = require("./Skills/Fishing.js");
const SKILL_FARMING = require("./Skills/Farming.js");
const SKILL_PLANTING = require("./Skills/Planting.js");
const SKILL_FORAGING = require("./Skills/Foraging.js");

class SkillsHandler {
	constructor(){
		// Declaring variables
		this.gameConfig = null;
		this.STATSHANDLER = null;
		this.itemConfig = null;
		this.INVENTORYHANDLER = null;
	}
	
	Init(gameConfig, statsHandler, itemConfig, inventoryHandler){
		this.gameConfig = gameConfig;
		this.itemConfig = itemConfig;
		this.STATSHANDLER = statsHandler;
		this.INVENTORYHANDLER = inventoryHandler;
		this.InitSkills();
	}
	
	InitSkills(){
		SKILL_MINING.Init(this.STATSHANDLER, this.itemConfig, this.INVENTORYHANDLER);
		SKILL_WOODCUTTING.Init(this.STATSHANDLER, this.itemConfig, this.INVENTORYHANDLER);
		SKILL_FISHING.Init(this.STATSHANDLER, this.itemConfig, this.INVENTORYHANDLER);
		SKILL_FARMING.Init(this.STATSHANDLER, this.itemConfig, this.INVENTORYHANDLER);
		SKILL_FORAGING.Init(this.STATSHANDLER, this.itemConfig, this.INVENTORYHANDLER);
		SKILL_PLANTING.Init(this.STATSHANDLER, this.itemConfig, this.INVENTORYHANDLER);
	}
	
	// ░▒▒▓▓▓████████████████████████████████████████████████████████████████████████████████▓▓▓▒▒░
	//                                           SKILLS
	// ░▒▒▓▓▓████████████████████████████████████████████████████████████████████████████████▓▓▓▒▒░
	
	// Mining
	Mine(message,timestamp){
		SKILL_MINING.Mine(message, timestamp);
		//this.STATSHANDLER.SetStat(message.author.id, "mana", 99);
	}
	
	// Woodcutting
	Chop(message,timestamp){
		SKILL_WOODCUTTING.Chop(message, timestamp);
	}
	
	// Fishing
	Fish(message,timestamp){
		SKILL_FISHING.Fish(message, timestamp);
	}
	
	// Foraging
	Forage(message,timestamp){
		SKILL_FORAGING.Forage(message, timestamp);
	}
	
	// Farming
	Farm(message,timestamp){
		SKILL_FARMING.Farm(message, timestamp);
	}
	
	// Planting
	Plant(message,timestamp){
		SKILL_PLANTING.Plant(message, timestamp);
	}
	/*
	TestAction(message, timestamp){
		if (this.SanityCheck(message, timestamp) == true){
			// Check if we have the required stamina
			var hasRequiredStamina = (this.CheckRequiredStamina(message, 5));
			if (hasRequiredStamina){
				message.channel.sendMessage("You Spent 5 Energy To Do A Test Action! You Now Have 【"+STATSHANDLER.GetStat(message.author.id, "stamina")+"／"+STATSHANDLER.GetStat(message.author.id, "maxStamina")+"】 Stamina.");
			}
			else{
				message.channel.sendMessage("You do not have enough stamina to perform this action! You need 5 Stamina To Do A Test Action! You Have 【"+STATSHANDLER.GetStat(message.author.id, "stamina")+"／"+STATSHANDLER.GetStat(message.author.id, "maxStamina")+"】 Stamina.");
			}
		}
	}
	*/
}

module.exports = new SkillsHandler();