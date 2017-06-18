class Woodcutting {
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
	//                                         WOODCUTTING
	// ░▒▒▓▓▓████████████████████████████████████████████████████████████████████████████████▓▓▓▒▒░
	
	// Chop
	Chop(message, timestamp){
		var item = "null log";
		var enduranceGain = this.statsHandler.GetRandomFromRange("endurance");
		var constitutionGain = this.statsHandler.GetRandomFromRange("constitution");
		var vitalityGain = this.statsHandler.GetRandomFromRange("vitality");
		this.statsHandler.AddStat(message.author.id, "enduranceExp", enduranceGain);
		this.statsHandler.AddStat(message.author.id, "constitutionExp", constitutionGain);
		this.statsHandler.AddStat(message.author.id, "vitalityExp", vitalityGain);
		message.channel.sendMessage("You Chop "+item+"! (-1 Stamina, +"+enduranceGain+" Endurance Exp, +"+constitutionGain+" Constitution Exp, +"+vitalityGain+" Vitality Exp).");
		var enduranceLevel = this.statsHandler.CheckIfLevelUp(message.author.id, "endurance", "enduranceExp", "enduranceExpNext");
		var constitutionLevel = this.statsHandler.CheckIfLevelUp(message.author.id, "constitution", "constitutionExp", "constitutionExpNext");
		var vitalityLevel = this.statsHandler.CheckIfLevelUp(message.author.id, "vitality", "vitalityExp", "vitalityExpNext");
		var levelArray = [];
		if (enduranceLevel == true){levelArray.push("Endurance");}
		if (constitutionLevel == true){levelArray.push("Constitution");}
		if (vitalityLevel == true){levelArray.push("Vitality");}
		if (levelArray.length > 0){
			this.statsHandler.PrintLevelUpMessage(message, levelArray);
		}
	}
	
}

module.exports = new Woodcutting();