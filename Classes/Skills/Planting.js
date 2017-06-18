class Planting {
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
	//                                           PLANTING
	// ░▒▒▓▓▓████████████████████████████████████████████████████████████████████████████████▓▓▓▒▒░
	
	// Planting
	Plant(message, timestamp){
		var item = "null plant";
		var insightGain = this.statsHandler.GetRandomFromRange("insight");
		this.statsHandler.AddStat(message.author.id, "insightExp", insightGain);
		message.channel.sendMessage("You Plant "+item+"! (-1 Stamina, +"+insightGain+" Insight Exp).");
		var insightLevel = this.statsHandler.CheckIfLevelUp(message.author.id, "insight", "insightExp", "insightExpNext");
		var levelArray = [];
		if (insightLevel == true){levelArray.push("insight");}
		if (levelArray.length > 0){
			this.statsHandler.PrintLevelUpMessage(message, levelArray);
		}
	}
	
}

module.exports = new Planting();