const fs = require("fs");
const PATH = './DATA/UserData.json';
var gameConfig = null;
var uiConfig = null;

class GameHandler {
	constructor(){
		// Declaring variables
		this.data = null;
		this.globalConfig = null;
		this.triggerSave = false;
		gameConfig = JSON.parse(fs.readFileSync("./Data/GameConfig.json", 'utf8'));
		uiConfig = JSON.parse(fs.readFileSync("./Data/UIConfig.json", 'utf8'));
	}
	
	Init(globalConfig){
		console.log("********** Initializing Game Handler.js **********");
		// Assign global configuration
		this.globalConfig = globalConfig;
		// Assigning the points to the json file.
		this.data = JSON.parse(fs.readFileSync(PATH, 'utf8'));
		console.log("********** GameHandler.js Init Complete **********")
	}
	
	UpdateUserData(message){
		// if the user data don't exist, create user data
		if (!this.data[message.author.id]) this.data[message.author.id] = {
			points: 0,
			level: 0,
			timestampOfLastAction: 0,
			//game stuff
			stamina: gameConfig.startingStamina,
			maxStamina: gameConfig.startingMaxStamina,
			// Stamina recharge data
			allowStaminaRegen: false, // True to allow regeneration, only when stamina is not full.
			staminaRegenStartTimestamp: 0 // The start time of when the allowStaminaRegen flag being set to true.
		}
		else {}
	}
	
	// Function To Set New Game Configuration
	RefreshConfig(config){
		this.globalConfig = config;
	}
	RefreshUserData(){
		this.data = JSON.parse(fs.readFileSync(PATH, 'utf8'));
	}
	
	// Function to display user statistics.
	Stats(message){
		let userData = this.data[message.author.id];
		var stringUI = JSON.stringify(uiConfig.statsUI);
		var stringUIReplace = stringUI.replace(".username.", message.author.username).replace(".stamina.", userData.stamina).replace(".maxStamina.", userData.maxStamina);
		var jsonUI = JSON.parse(stringUIReplace);
		message.channel.sendMessage(jsonUI)
	}
	
	TestAction(message, timestamp){
		// Check user data
		this.UpdateUserData(message);
		// Check for stamina regen.
		this.CheckForStaminaRegen(message, timestamp);
		// Check if we have the required stamina
		var hasRequiredStamina = (this.CheckRequiredStamina(message, 5));
		let userData = this.data[message.author.id];
		if (hasRequiredStamina){
			message.channel.sendMessage("You Spent 5 Energy To Do A Test Action! You Now Have 【"+userData.stamina+"／"+userData.maxStamina+"】 Stamina.");
		}
		else{
			message.channel.sendMessage("You do not have enough stamina to perform this action! You need 5 Stamina To Do A Test Action! You Have 【"+userData.stamina+"／"+userData.maxStamina+"】 Stamina.");
		}
	}
	
	CheckForStaminaRegen(message, timestamp){
		let userData = this.data[message.author.id];
		// Check if user has regeneration active.
		if (userData.allowStaminaRegen == true){
			// We have regen. Get difference between now and when the regen was started. In milliseconds.
			var difference = message.createdTimestamp - userData.staminaRegenStartTimestamp;
			// If the difference is greater than recharge rate, recharge based on time.
			if (difference >= gameConfig.staminaRechargeRate){
				// Check how much we need to recharge.
				var staminaGain = Math.floor(difference / gameConfig.staminaRechargeRate)
				var timeRemainder = difference % gameConfig.staminaRechargeRate;
				// Recharge stamina by the difference.
				userData.stamina = userData.stamina + staminaGain;
				// Now if stamina reaches max, end regeneration and cap.
				if (userData.stamina > userData.maxStamina){
					userData.stamina = userData.maxStamina;
					userData.allowStaminaRegen = false;
				}
				// Update regen timestamp so we no longer use old values to calculate the remaining stamina but add back on the unused time.
				userData.staminaRegenStartTimestamp = message.createdTimestamp - timeRemainder;
				// Trigger save to happen as the user data has changed and is ready to be saved to disk.
				this.SetTriggerSave(true);
			}
		}
	}
	
	// This function checks if the user has the required stamina and will return true if there is enough after consuming stamina.
	// Every action will require stamina and therfore if it is true, the action will run. 
	CheckRequiredStamina(message, staminaRequired){
		let userData = this.data[message.author.id];
		if (userData.stamina >= staminaRequired){
			// Action will run. Trigger regeneration if stamina is no longer full.
			this.TriggerStaminaRegen(message);
			userData.timestampOfLastAction = message.createdTimestamp;
			userData.stamina = userData.stamina - staminaRequired;
			this.SetTriggerSave(true);
			return true;
		}
		else{
			return false;
		}
	}
	
	// This function will trigger the stamina regeneration for the current user.
	TriggerStaminaRegen(message){
		let userData = this.data[message.author.id];
		// If energy is full, we must log the time this switch was flipped.
		if (userData.allowStaminaRegen == false){
			userData.staminaRegenStartTimestamp = message.createdTimestamp;
		}
		userData.allowStaminaRegen = true;
	
	}
	
	Write(){
		// And then, we save the edited file.
		fs.writeFile(PATH, JSON.stringify(this.data), (err) => {
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
	
	// Old functions
	
	/*
	CheckCooldown(message, timestamp){
		let userData = this.data[message.author.id];
		var difference = timestamp - userData.timestampOfLastAction;
		if ((difference >= this.globalConfig.testCooldown) || (difference < 0)){
			// We surpassed cooldown.
			userData.timestampOfLastAction = timestamp;			
			this.Write();
			return true;
		}
		else{
			var cooldownRemaining = Math.floor((this.globalConfig.testCooldown - difference) / 1000);
			message.channel.sendMessage("Please Wait '"+cooldownRemaining+"' seconds.");
			return false;
		}
	}
	*/
	/*
		message = Discord Message Handler
	*/
	/*Test(message){
		// if the points don't exist, init to 0;
		if (!this.data[message.author.id]) this.data[message.author.id] = {
			points: 0,
			level: 0,
			energy: 10,
			timestampOfLastAction: 69
		};
		
		let userData = this.data[message.author.id];
		userData.points++;
		let curLevel = Math.floor(0.1 * Math.sqrt(userData.points));
		if (curLevel > userData.level) {
			// Level up!
			userData.level = curLevel;
			message.reply(`You've leveled up to level **${curLevel}**! Ain't that dandy?`);
		}

		//if (message.content.startsWith(prefix + "level")) {
		//if (message.content.startsWith(prefix + "level")) {
			message.reply(`You are currently level ${userData.level}, with ${userData.points} points.`);
		//}
		
		Write();
	}
	*/
}

module.exports = new GameHandler();