const fs = require("fs");
const PATH = './DATA/UserData.json';

class PlayerStatsHandler {
	constructor(){
		// Declaring variables
		this.data = null;
		this.gameConfig = null;
		this.triggerSave = false;
	}
	
	Init(){
		// Assigning the points to the json file.
		this.gameConfig = JSON.parse(fs.readFileSync("./Data/GameConfig.json", 'utf8'));
		this.data = JSON.parse(fs.readFileSync(PATH, 'utf8'));
	}
	
	Write(){
		// And then, we save the edited file.
		fs.writeFile(PATH, JSON.stringify(this.data, null, 2), (err) => {
			if (err){
				console.error(err);
			} 
			else{
				console.log("Write To File Success");
			}
		});
	}
	
	GetTriggerSave(){
		return this.triggerSave;
	}
	
	SetTriggerSave(trigger){
		this.triggerSave =  trigger;
	}
	
	SetStat(userid, statName, value){
		let userData = this.data[userid];
		userData[statName] = value;
		this.SetTriggerSave(true);
	}
	
	AddStat(userid, statName, value){
		let userData = this.data[userid];
		var newStat = userData[statName] + value;
		userData[statName] = newStat;
		this.SetTriggerSave(true);
	}
	
	RemoveStat(userid, statName, value){
		let userData = this.data[userid];
		var newStat = userData[statName] - value;
		userData[statName] = newStat;
		this.SetTriggerSave(true);
	}
	
	CheckForStatCap(userid, statName, maxStatName){
		let userData = this.data[userid];
		if (userData[statName] > userData[maxStatName]){
			userData[statName] = userData[maxStatName];
			this.SetTriggerSave(true);
			return true;
		}
		else{
			return false;
		}
	}
	
	GetStat(userid, statName){
		let userData = this.data[userid];
		return userData[statName];
	}
	
	CheckIfUserExists(userid){
		if (!this.data[userid]){
			return false;
		}
		else{
			return true;
		}
	}
	
	GetRandomFromRange(statName){
		var min = this.gameConfig[statName + "_base_exp_gain_min"];
		var max = this.gameConfig[statName + "_base_exp_gain_max"];
		var result = Math.ceil((Math.random() * (max - min)) + min);
		return result;
	}
	
	CheckIfLevelUp(userid, statName, statNameExp, statNameExpToLevel){
		let userData = this.data[userid];
		if ((userData[statNameExp] >= userData[statNameExpToLevel]) && (userData[statNameExpToLevel] != 0)){
			var remainder = userData[statNameExp] - userData[statNameExpToLevel];
			userData[statNameExp] = remainder;
			// old = 0.04, new = 0.25
			var oldBase = userData[statNameExpToLevel];
			var nextLevel = Math.ceil((oldBase * 0.25) + oldBase);
			userData[statNameExpToLevel] = nextLevel;
			userData[statName] = userData[statName] + 1;
			this.SetTriggerSave(true);
			return true;
		}
		else{
			return false;
		}
	}
	
	PrintLevelUpMessage(message, statNameArray){
		let userData = this.data[message.author.id];
		var messageToPrint = "Congratulations! You levelled ";
		for (var i = 0; i < statNameArray.length; i++) { 
			var statname = statNameArray[i];
			if (i > 0){
				messageToPrint += ", ";
			}
			messageToPrint += statname + " to " + userData[statname.toLowerCase()];
		}
		message.channel.sendMessage(messageToPrint);
	}
	
	CreateNewUser(userid, timestamp){
		/*this.data[userid] = {
			// util
			creationDate: timestamp,
			//game stuff
			stamina: 0,
			maxStamina: 0,
			// Stamina recharge data
			allowStaminaRegen: false, // True to allow regeneration, only when stamina is not full.
			staminaRegenStartTimestamp: 0 // The start time of when the allowStaminaRegen flag being set to true.
		}*/
		// Grab from template
		var template = this.gameConfig["playerTemplate"];
		template["creationDate"] = timestamp;
		template["staminaRegenStartTimestamp"] = 0;
		// Assign stats
		template["agility"] = this.gameConfig["agility_base_level"];
		template["charisma"] = this.gameConfig["charisma_base_level"];
		template["constitution"] = this.gameConfig["constitution_base_level"];
		template["dexterity"] = this.gameConfig["dexterity_base_level"];
		template["endurance"] = this.gameConfig["endurance_base_level"];
		template["insight"] = this.gameConfig["insight_base_level"];
		template["intelligence"] = this.gameConfig["intelligence_base_level"];
		template["luck"] = this.gameConfig["luck_base_level"];
		template["strength"] = this.gameConfig["strength_base_level"];
		template["vitality"] = this.gameConfig["vitality_base_level"];
		// Assign other stats based on the base stats
		template["agilityExpNext"] = this.gameConfig["base_exp_to_level"];
		template["charismaExpNext"] = this.gameConfig["base_exp_to_level"];
		template["constitutionExpNext"] = this.gameConfig["base_exp_to_level"];
		template["dexterityExpNext"] = this.gameConfig["base_exp_to_level"];
		template["enduranceExpNext"] = this.gameConfig["base_exp_to_level"];
		template["insightExpNext"] = this.gameConfig["base_exp_to_level"];
		template["intelligenceExpNext"] = this.gameConfig["base_exp_to_level"];
		template["luckExpNext"] = this.gameConfig["base_exp_to_level"];
		template["strengthExpNext"] = this.gameConfig["base_exp_to_level"];
		template["vitalityExpNext"] = this.gameConfig["base_exp_to_level"];
		template["health"] = this.gameConfig["vitality_base_effect"];
		template["maxHealth"] = this.gameConfig["vitality_base_effect"];
		template["maxInventorySpace"] = this.gameConfig["inventory_base_effect"];
		template["stamina"] = this.gameConfig["endurance_base_effect"];
		template["maxStamina"] = this.gameConfig["endurance_base_effect"];
		this.data[userid] = template;
		this.SetTriggerSave(true);
	}
	
}

module.exports = new PlayerStatsHandler();