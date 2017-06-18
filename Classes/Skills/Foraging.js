class Foraging {
	constructor(){
		this.itemConfig = null;
		this.statsHandler = null;
		this.inventoryHandler = null;
	}
	
	Init(statsHandler, itemConfig, inventoryHandler){
		this.itemConfig = itemConfig;
		this.statsHandler = statsHandler;
		this.inventoryHandler = inventoryHandler;
	}
	
	// ░▒▒▓▓▓████████████████████████████████████████████████████████████████████████████████▓▓▓▒▒░
	//                                           FORAGING
	// ░▒▒▓▓▓████████████████████████████████████████████████████████████████████████████████▓▓▓▒▒░
	
	// Forage
	Forage(message, timestamp){
		var item = "null herbs";
		var agilityGain = this.statsHandler.GetRandomFromRange("agility");
		var constitutionGain = this.statsHandler.GetRandomFromRange("constitution");
		var vitalityGain = this.statsHandler.GetRandomFromRange("vitality");
		this.statsHandler.AddStat(message.author.id, "agilityExp", agilityGain);
		this.statsHandler.AddStat(message.author.id, "constitutionExp", constitutionGain);
		this.statsHandler.AddStat(message.author.id, "vitalityExp", vitalityGain);
		message.channel.sendMessage("You Forage "+item+"! (-1 Stamina, +"+agilityGain+" Agility Exp, +"+constitutionGain+" Constitution Exp, +"+vitalityGain+" Vitality Exp).");
		var agilityLevel = this.statsHandler.CheckIfLevelUp(message.author.id, "agility", "agilityExp", "agilityExpNext");
		var constitutionLevel = this.statsHandler.CheckIfLevelUp(message.author.id, "constitution", "constitutionExp", "constitutionExpNext");
		var vitalityLevel = this.statsHandler.CheckIfLevelUp(message.author.id, "vitality", "vitalityExp", "vitalityExpNext");
		var levelArray = [];
		if (agilityLevel == true){levelArray.push("Agility");}
		if (constitutionLevel == true){levelArray.push("Constitution");}
		if (vitalityLevel == true){levelArray.push("Vitality");}
		if (levelArray.length > 0){
			this.statsHandler.PrintLevelUpMessage(message, levelArray);
		}
	}
	
}

module.exports = new Foraging();