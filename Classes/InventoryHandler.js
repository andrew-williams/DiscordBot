const fs = require("fs");

// The purpose of the Inventory handler is to only handle inventory.
// That means exactly what it means, nothing else. Give objects. Take objects. etc. Thats it.
// Functionality is handled elsewhere. This will make this class generic and therfore can be used anywhere I feel like.
// Takes an inventory data object which has an array of {item id + item amount} if greater than zero

class InventoryHandler {
	constructor(){
		this.itemConfig = null;
	}
	
	Init(itemConfig){
		this.itemConfig = itemConfig;
	}
	
	// ░▒▒▓▓▓████████████████████████████████████████████████████████████████████████████████▓▓▓▒▒░
	//                                          FUNCTIONS
	// ░▒▒▓▓▓████████████████████████████████████████████████████████████████████████████████▓▓▓▒▒░
	
	// inventory : The inventory object array
	// timestamp : unused for now but is there just in case
	// itemid : The item data id
	// itemamount : The amount to add or remove
	
	/* example land
	
	inventory : { } inside
	"itemid" : amount
	//console.log(Object.keys(inventory).length); <- this can be used to check how much inventory
	*/
	GiveItem(inventory, timestamp, itemid, itemamount){
		if ((inventory[itemid] == undefined) || (inventory[itemid] == null)){
			// Create slot
			inventory[itemid] = itemamount;
		}
		else{
			// Add to existing
			var newAmount = inventory[itemid] + itemamount;
			inventory[itemid] = newAmount;
		}
		return inventory;
	}
	
	TakeItem(inventory, timestamp, itemid, itemamount){
		if ((inventory[itemid] == undefined) || (inventory[itemid] == null)){
			// Return with no change because does not exist.
		}
		else{
			// Remove amount from inventory of item
			var newAmount = inventory[itemid] - itemamount;
			// Assign new value to inv if > 0 else delete
			if (newAmount > 0){
				inventory[itemid] = newAmount;
			}
			else{
				delete inventory[itemid];
			}
		}
		return inventory;
	}
	
	GetItemData(itemid, itemkey){
		var itemObject = this.itemConfig[itemid];
		return itemObject[itemkey];
	}
	
}

module.exports = new InventoryHandler();