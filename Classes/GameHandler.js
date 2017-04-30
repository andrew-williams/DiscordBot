const fs = require("fs");
const PATH = './DATA/points.json';

class GameHandler {
	constructor(){
		// Declaring variables
		this.points = null;
		this.globalConfig = null;
	}
	
	Init(globalConfig){
		console.log("********** Initializing Game Handler.js **********");
		// Assign global configuration
		this.globalConfig = globalConfig;
		// Assigning the points to the json file.
		this.points = JSON.parse(fs.readFileSync(PATH, 'utf8'));
		console.log("********** GameHandler.js Init Complete **********")
	}
	
	/*
		message = Discord Message Handler
	*/
	Test(message){
		// if the points don't exist, init to 0;
		if (!this.points[message.author.id]) this.points[message.author.id] = {
			points: 0,
			level: 0
		};
		
		let userData = this.points[message.author.id];
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
		
		// And then, we save the edited file.
		fs.writeFile(PATH, JSON.stringify(this.points), (err) => {
			if (err) console.error(err)
		});
	}
	
	// Function To Set New Game Configuration
	RefreshConfig(config){
		this.globalConfig = config;
	}
	
	// Function to display user statistics.
	Stats(message){
		message.channel.sendMessage("", this.globalConfig.statsUI);
	}
}

module.exports = new GameHandler();