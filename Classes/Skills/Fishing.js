class Fishing {
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
	//                                           FISHING
	// ░▒▒▓▓▓████████████████████████████████████████████████████████████████████████████████▓▓▓▒▒░
	
	// Fishing
	Fish(message, timestamp){
		var item = "nothing";
		var luckGain = this.statsHandler.GetRandomFromRange("luck");
		this.statsHandler.AddStat(message.author.id, "luckExp", luckGain);
		message.channel.sendMessage("You Fish "+item+"! (-1 Stamina, +"+luckGain+" Luck Exp).");
		var luckLevel = this.statsHandler.CheckIfLevelUp(message.author.id, "luck", "luckExp", "luckExpNext");
		var levelArray = [];
		if (luckLevel == true){levelArray.push("Luck");}
		if (levelArray.length > 0){
			this.statsHandler.PrintLevelUpMessage(message, levelArray);
		}
	}
	
}

module.exports = new Fishing();