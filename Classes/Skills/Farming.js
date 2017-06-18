class Farming {
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
	//                                           FARMING
	// ░▒▒▓▓▓████████████████████████████████████████████████████████████████████████████████▓▓▓▒▒░
	
	// Farming
	Farm(message, timestamp){
		var item = "null farm";
		var charismaGain = this.statsHandler.GetRandomFromRange("charisma");
		this.statsHandler.AddStat(message.author.id, "charismaExp", charismaGain);		
		message.channel.sendMessage("You Farm "+item+"! (-1 Stamina, +"+charismaGain+" Charisma Exp).");
		var charismaLevel = this.statsHandler.CheckIfLevelUp(message.author.id, "charisma", "charismaExp", "charismaExpNext");
		var levelArray = [];
		if (charismaLevel == true){levelArray.push("Charisma");}
		if (levelArray.length > 0){
			this.statsHandler.PrintLevelUpMessage(message, levelArray);
		}
	}
	
}

module.exports = new Farming();