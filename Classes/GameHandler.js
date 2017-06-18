const fs = require("fs");
const PATH = './DATA/UserData.json';
const STATSHANDLER = require("./PlayerStatsHandler.js");
const SKILLSHANDLER = require("./SkillsHandler.js");
const INVENTORYHANDLER = require("./InventoryHandler.js");
var gameConfig = null;
var uiConfig = null;
var itemConfig = null;

class GameHandler {
	constructor(){
		// Declaring variables
		this.data = null;
		this.globalConfig = null;
		gameConfig = JSON.parse(fs.readFileSync("./Data/GameConfig.json", 'utf8'));
		uiConfig = JSON.parse(fs.readFileSync("./Data/UIConfig.json", 'utf8'));
		itemConfig = JSON.parse(fs.readFileSync("./Data/ItemConfig.json", 'utf8'));
	}
	
	Init(globalConfig){
		this.globalConfig = globalConfig;
		INVENTORYHANDLER.Init(itemConfig);
		STATSHANDLER.Init();
		SKILLSHANDLER.Init(gameConfig, STATSHANDLER, itemConfig, INVENTORYHANDLER);
	}
	
	SanityCheck(message, timestamp){
		// Check user data exists
		if (STATSHANDLER.CheckIfUserExists(message.author.id) == true){
			// Do any actions that need to be checked every time...
			// Check for stamina regen.
			this.CheckForStaminaRegen(message, timestamp);		
			return true;
		}
		else{
			message.channel.sendMessage("Character '"+message.author.username+"' does not exist. Please create a new character by typing '"+this.globalConfig.prefix+"newgame'");
			return false;
		}
	}
	
	CheckForStaminaRegen(message, timestamp){
		// Check if user has regeneration active.
		if (STATSHANDLER.GetStat(message.author.id, "allowStaminaRegen") == true){
			// We have regen. Get difference between now and when the regen was started. In milliseconds.
			var difference = message.createdTimestamp - STATSHANDLER.GetStat(message.author.id, "staminaRegenStartTimestamp");
			// If the difference is greater than recharge rate, recharge based on time.
			if (difference >= gameConfig.staminaRechargeRate){
				// Check how much we need to recharge.
				var staminaGain = Math.floor(difference / gameConfig.staminaRechargeRate)
				var timeRemainder = difference % gameConfig.staminaRechargeRate;
				// Recharge stamina by the difference.
				STATSHANDLER.AddStat(message.author.id, "stamina", staminaGain);
				// Now if stamina reaches max, end regeneration and cap.
				if (STATSHANDLER.CheckForStatCap(message.author.id, "stamina", "maxStamina") == true){
					// We capped. disable regen
					STATSHANDLER.SetStat(message.author.id, "allowStaminaRegen", false);
				}
				// Update regen timestamp so we no longer use old values to calculate the remaining stamina but add back on the unused time.
				STATSHANDLER.SetStat(message.author.id, "staminaRegenStartTimestamp", (message.createdTimestamp - timeRemainder));
			}
		}
	}
	
	// This function checks if the user has the required stamina and will return true if there is enough after consuming stamina.
	// Every action will require stamina and therfore if it is true, the action will run. 
	CheckRequiredStamina(message, staminaRequired){
		if (STATSHANDLER.GetStat(message.author.id, "stamina") >= staminaRequired){
			// Action will run. Trigger regeneration if stamina is no longer full.
			this.TriggerStaminaRegen(message);
			STATSHANDLER.SetStat(message.author.id, "timestampOfLastAction", message.createdTimestamp);
			STATSHANDLER.RemoveStat(message.author.id, "stamina", staminaRequired);
			return true;
		}
		else{
			return false;
		}
	}
	
	// This function will trigger the stamina regeneration for the current user.
	TriggerStaminaRegen(message){
		// If energy is full, we must log the time this switch was flipped.
		if (STATSHANDLER.GetStat(message.author.id, "allowStaminaRegen") == false){
			STATSHANDLER.SetStat(message.author.id, "staminaRegenStartTimestamp", message.createdTimestamp);
		}
		STATSHANDLER.SetStat(message.author.id, "allowStaminaRegen", true);
	
	}
	
	// STATS HANDLER CLASS STUFF
	
	GetTriggerSave(){
		return STATSHANDLER.GetTriggerSave();
	}
	
	SetTriggerSave(trigger){
		STATSHANDLER.SetTriggerSave(trigger);
	}
	
	Write(){
		STATSHANDLER.Write();
	}
	
	// GAME COMMANDS
	// This command is to create a character.
	CreateNewCharacter(message, timestamp){
		if (STATSHANDLER.CheckIfUserExists(message.author.id) == true){
			message.channel.sendMessage("Character '"+message.author.username+"' already exists.");
		}
		else{
			message.channel.sendMessage("Character '"+message.author.username+"' created You can now start your adventure!");
			STATSHANDLER.CreateNewUser(message.author.id, timestamp);
		}
	}
	
	DisplayGameCommands(message){
		var stringUI = "";
		stringUI += "```\n";
		stringUI += "████████████████████████████████████████\n            ＣＯＭＭＡＮＤＳ\n████████████████████████████████████████\n\n";
		stringUI += this.globalConfig.prefix + "cmd      : Show this menu.\n";
		stringUI += this.globalConfig.prefix + "newgame  : Start a new character if does not exist.\n";
		stringUI += this.globalConfig.prefix + "stats    : Show player statistics.\n";
		stringUI += this.globalConfig.prefix + "inv      : Show player inventory.\n";
		stringUI += "\n";
		stringUI += this.globalConfig.prefix + "chop     : Use Woodcutting skill to cut some trees.\n";
		stringUI += this.globalConfig.prefix + "farm     : Use Farming skill to farm some land.\n";
		stringUI += this.globalConfig.prefix + "fish     : Use Fishing skill to catch some fish.\n";
		stringUI += this.globalConfig.prefix + "forage   : Use Foraging skill to pick some plants.\n";
		stringUI += this.globalConfig.prefix + "plant    : Use Planting skill to plant some seeds.\n";
		stringUI += this.globalConfig.prefix + "mine     : Use Mining skill to mine some rocks.";
		stringUI += "```";
		message.channel.sendMessage(stringUI);
	}
	
	// Function to display user statistics.
	Stats(message, timestamp){
		if (this.SanityCheck(message, timestamp) == true){
			var stringUI = "";//"{\"embed\": { \"description\" : \"";
			stringUI += "```\n";
			stringUI += "████████████████████████████████████████████████████████████████████████████████████████████\n";
			stringUI += "Name : " + message.author.username + "\n";
			stringUI += "╞══════════════════════════════════════════════════════════════════════════════════════════╡\n"
			stringUI += "Health       : 【" + STATSHANDLER.GetStat(message.author.id,"health")+"／"+STATSHANDLER.GetStat(message.author.id,"maxHealth")+"】- Mana : 【" + STATSHANDLER.GetStat(message.author.id,"mana") + "／"+STATSHANDLER.GetStat(message.author.id,"maxMana")+"】- Stamina : 【" + STATSHANDLER.GetStat(message.author.id,"stamina") + "／"+STATSHANDLER.GetStat(message.author.id,"maxStamina")+"】\n";
			stringUI += "Inventory    : 【"+ STATSHANDLER.GetStat(message.author.id,"inventorySpace")+"／"+STATSHANDLER.GetStat(message.author.id,"maxInventorySpace")+"】\n";
			stringUI += "Agility      : " + STATSHANDLER.GetStat(message.author.id,"agility") + " ≡ EXP 【"+STATSHANDLER.GetStat(message.author.id,"agilityExp")+"／"+STATSHANDLER.GetStat(message.author.id,"agilityExpNext")+"】\n"
			stringUI += "Charisma     : " + STATSHANDLER.GetStat(message.author.id,"charisma") + " ≡ EXP 【"+STATSHANDLER.GetStat(message.author.id,"charismaExp")+"／"+STATSHANDLER.GetStat(message.author.id,"charismaExpNext")+"】\n"
			stringUI += "Constitution : " + STATSHANDLER.GetStat(message.author.id,"constitution") + " ≡ EXP 【"+STATSHANDLER.GetStat(message.author.id,"constitutionExp")+"／"+STATSHANDLER.GetStat(message.author.id,"constitutionExpNext")+"】\n"
			stringUI += "Dexterity    : " + STATSHANDLER.GetStat(message.author.id,"dexterity") + " ≡ EXP 【"+STATSHANDLER.GetStat(message.author.id,"dexterityExp")+"／"+STATSHANDLER.GetStat(message.author.id,"dexterityExpNext")+"】\n"
			stringUI += "Endurance    : " + STATSHANDLER.GetStat(message.author.id,"endurance") + " ≡ EXP 【"+STATSHANDLER.GetStat(message.author.id,"enduranceExp")+"／"+STATSHANDLER.GetStat(message.author.id,"enduranceExpNext")+"】\n"
			stringUI += "Insight      : " + STATSHANDLER.GetStat(message.author.id,"insight") + " ≡ EXP 【"+STATSHANDLER.GetStat(message.author.id,"insightExp")+"／"+STATSHANDLER.GetStat(message.author.id,"insightExpNext")+"】\n"
			stringUI += "Intelligence : " + STATSHANDLER.GetStat(message.author.id,"intelligence") + " ≡ EXP 【"+STATSHANDLER.GetStat(message.author.id,"intelligenceExp")+"／"+STATSHANDLER.GetStat(message.author.id,"intelligenceExpNext")+"】\n"
			stringUI += "Luck         : " + STATSHANDLER.GetStat(message.author.id,"luck") + " ≡ EXP 【"+STATSHANDLER.GetStat(message.author.id,"luckExp")+"／"+STATSHANDLER.GetStat(message.author.id,"luckExpNext")+"】\n"
			stringUI += "Strength     : " + STATSHANDLER.GetStat(message.author.id,"strength") + " ≡ EXP 【"+STATSHANDLER.GetStat(message.author.id,"strengthExp")+"／"+STATSHANDLER.GetStat(message.author.id,"strengthExpNext")+"】\n"
			stringUI += "Vitality     : " + STATSHANDLER.GetStat(message.author.id,"vitality") + " ≡ EXP 【"+STATSHANDLER.GetStat(message.author.id,"vitalityExp")+"／"+STATSHANDLER.GetStat(message.author.id,"vitalityExpNext")+"】\n"
			stringUI += "████████████████████████████████████████████████████████████████████████████████████████████\n";
			stringUI += "```";
		//	stringUI += "\"}}";
			//var jsonUI = JSON.parse(stringUI);
			//message.channel.sendMessage(jsonUI)
			message.channel.sendMessage(stringUI);
		}
	}
	
	Inv(message, timestamp){
		if (this.SanityCheck(message, timestamp) == true){
			var inventory = STATSHANDLER.GetStat(message.author.id, "inventory");
			var stringUI = "";
			stringUI += "```\n";
			stringUI += "████████████████████████████████████████████████████████████████████████████████████████████\n";
			for (var i in inventory){
				stringUI += "" + INVENTORYHANDLER.GetItemData(i, "name") + " ｘ " + inventory[i] + "\n";
			}
			stringUI += "████████████████████████████████████████████████████████████████████████████████████████████\n";
			stringUI += "```";
			message.channel.sendMessage(stringUI)
		}
	}
	/*
	  var obj = validation_messages[key];
    for (var prop in obj) {
        // skip loop if the property is from prototype
        if(!obj.hasOwnProperty(prop)) continue;

        // your code
        alert(prop + " = " + obj[prop]);
    }
	*/
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
	// ░▒▒▓▓▓████████████████████████████████████████████████████████████████████████████████▓▓▓▒▒░
	//                                           SKILLS
	// ░▒▒▓▓▓████████████████████████████████████████████████████████████████████████████████▓▓▓▒▒░
	/*
	// Debug
	TestDebugAction(message, timestamp){
		if (this.SanityCheck(message, timestamp) == true){
			// Check if we have the required stamina
			var hasRequiredStamina = (this.CheckRequiredStamina(message, 1));
			if (hasRequiredStamina){
				message.channel.sendMessage("You Spent 1 Energy To Do A Test Action! You Now Have 【"+STATSHANDLER.GetStat(message.author.id, "stamina")+"／"+STATSHANDLER.GetStat(message.author.id, "maxStamina")+"】 Stamina.");
				SKILLSHANDLER.TestDebug(message, timestamp);
			}
			else{
				message.channel.sendMessage("You do not have enough stamina to perform this action! You need 5 Stamina To Do A Test Action! You Have 【"+STATSHANDLER.GetStat(message.author.id, "stamina")+"／"+STATSHANDLER.GetStat(message.author.id, "maxStamina")+"】 Stamina.");
			}
		}
	}
	*/
	// Farming
	Farm(message, timestamp){
		if (this.SanityCheck(message, timestamp) == true){
			// Check if we have the required stamina
			var hasRequiredStamina = (this.CheckRequiredStamina(message, 1));
			if (hasRequiredStamina){
				SKILLSHANDLER.Farm(message,timestamp);
			}
			else{
				message.channel.sendMessage("You do not have enough stamina to perform this action! You need 1 Stamina To Do A Test Action! You Have 【"+STATSHANDLER.GetStat(message.author.id, "stamina")+"／"+STATSHANDLER.GetStat(message.author.id, "maxStamina")+"】 Stamina.");
			}
		}
	}
	
	// Fishing
	Fish(message, timestamp){
		if (this.SanityCheck(message, timestamp) == true){
			// Check if we have the required stamina
			var hasRequiredStamina = (this.CheckRequiredStamina(message, 1));
			if (hasRequiredStamina){
				SKILLSHANDLER.Fish(message,timestamp);
			}
			else{
				message.channel.sendMessage("You do not have enough stamina to perform this action! You need 1 Stamina To Do A Test Action! You Have 【"+STATSHANDLER.GetStat(message.author.id, "stamina")+"／"+STATSHANDLER.GetStat(message.author.id, "maxStamina")+"】 Stamina.");
			}
		}
	}
	
	// Foraging
	Forage(message, timestamp){
		if (this.SanityCheck(message, timestamp) == true){
			// Check if we have the required stamina
			var hasRequiredStamina = (this.CheckRequiredStamina(message, 1));
			if (hasRequiredStamina){
				SKILLSHANDLER.Forage(message,timestamp);
			}
			else{
				message.channel.sendMessage("You do not have enough stamina to perform this action! You need 1 Stamina To Do A Test Action! You Have 【"+STATSHANDLER.GetStat(message.author.id, "stamina")+"／"+STATSHANDLER.GetStat(message.author.id, "maxStamina")+"】 Stamina.");
			}
		}
	}
	
	// Mining
	Mine(message, timestamp){
		if (this.SanityCheck(message, timestamp) == true){
			// Check if we have the required stamina
			var hasRequiredStamina = (this.CheckRequiredStamina(message, 1));
			if (hasRequiredStamina){
				SKILLSHANDLER.Mine(message,timestamp);
			}
			else{
				message.channel.sendMessage("You do not have enough stamina to perform this action! You need 1 Stamina To Do A Test Action! You Have 【"+STATSHANDLER.GetStat(message.author.id, "stamina")+"／"+STATSHANDLER.GetStat(message.author.id, "maxStamina")+"】 Stamina.");
			}
		}
	}
	
	// Planting
	Plant(message, timestamp){
		if (this.SanityCheck(message, timestamp) == true){
			// Check if we have the required stamina
			var hasRequiredStamina = (this.CheckRequiredStamina(message, 1));
			if (hasRequiredStamina){
				SKILLSHANDLER.Plant(message,timestamp);
			}
			else{
				message.channel.sendMessage("You do not have enough stamina to perform this action! You need 1 Stamina To Do A Test Action! You Have 【"+STATSHANDLER.GetStat(message.author.id, "stamina")+"／"+STATSHANDLER.GetStat(message.author.id, "maxStamina")+"】 Stamina.");
			}
		}
	}
	
	// Woodcutting
	Chop(message, timestamp){
		if (this.SanityCheck(message, timestamp) == true){
			// Check if we have the required stamina
			var hasRequiredStamina = (this.CheckRequiredStamina(message, 1));
			if (hasRequiredStamina){
				SKILLSHANDLER.Chop(message,timestamp);
			}
			else{
				message.channel.sendMessage("You do not have enough stamina to perform this action! You need 1 Stamina To Do A Test Action! You Have 【"+STATSHANDLER.GetStat(message.author.id, "stamina")+"／"+STATSHANDLER.GetStat(message.author.id, "maxStamina")+"】 Stamina.");
			}
		}
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