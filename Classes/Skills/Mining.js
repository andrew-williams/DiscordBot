class Mining {
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
	//                                           MINING
	// ░▒▒▓▓▓████████████████████████████████████████████████████████████████████████████████▓▓▓▒▒░
	
	// Debug
	DebugMine(message, timestamp){
		message.channel.sendMessage("mine2");
	}
	
	// Mining
	Mine(message, timestamp){
		var inventory = this.statsHandler.GetStat(message.author.id, "inventory");
		inventory = this.inventoryHandler.GiveItem(inventory, timestamp, "1", 1);
		var item = this.inventoryHandler.GetItemData("1", "name");
		this.statsHandler.SetStat(message.author.id, "inventory", inventory);
		var strengthGain = this.statsHandler.GetRandomFromRange("strength");
		var constitutionGain = this.statsHandler.GetRandomFromRange("constitution");
		var vitalityGain = this.statsHandler.GetRandomFromRange("vitality");
		this.statsHandler.AddStat(message.author.id, "strengthExp", strengthGain);
		this.statsHandler.AddStat(message.author.id, "constitutionExp", constitutionGain);
		this.statsHandler.AddStat(message.author.id, "vitalityExp", vitalityGain);
		message.channel.sendMessage("You Mine "+item+"! (-1 Stamina, +"+strengthGain+" Strength Exp, +"+constitutionGain+" Constitution Exp, +"+vitalityGain+" Vitality Exp).");
		var strengthLevel = this.statsHandler.CheckIfLevelUp(message.author.id, "strength", "strengthExp", "strengthExpNext");
		var constitutionLevel = this.statsHandler.CheckIfLevelUp(message.author.id, "constitution", "constitutionExp", "constitutionExpNext");
		var vitalityLevel = this.statsHandler.CheckIfLevelUp(message.author.id, "vitality", "vitalityExp", "vitalityExpNext");
		var levelArray = [];
		if (strengthLevel == true){levelArray.push("Strength");}
		if (constitutionLevel == true){levelArray.push("Constitution");}
		if (vitalityLevel == true){levelArray.push("Vitality");}
		if (levelArray.length > 0){
			this.statsHandler.PrintLevelUpMessage(message, levelArray);
		}
	}
	
}

module.exports = new Mining();