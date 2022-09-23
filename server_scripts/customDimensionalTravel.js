console.info('Teleport has been loaded.')

const lostCityItem = "botania:quartz_blaze"
const lostCityBlock_first = "extcaves:lavastone"
const lostCityBlock_second = "ascpm:unity_sector_1_floor"
const lostCityLeavingItem = "ascpm:crowbar"
const lostCityLeavingBlock = "ascpm:vent_entrance"

//with this one you activate a specific block with a specific item

onEvent ("block.right_click", event => { //interact with any block
	if (event.hand == MAIN_HAND) { //use only the main hand 
		if (event.item.id == lostCityItem) { //using the correct item
			if (event.block.id == lostCityBlock_first) { //activator block
				event.player.tell(text.red("Right click again to confirm your desire to travel...")) //tell the player to click again so they dont accidentally travel to another dimension
				event.player.stages.add('confirmLCtravel') //tell the game the first click has been done
				event.block.set(lostCityBlock_second) //change the block to the second block
			}
			else if (event.block.id == lostCityBlock_second) { //if it's the second activator block
				if (event.player.stages.has('been.to.lost.city')) { //check if player has been before
					event.player.tell(text.red("You already know what to expect.")) //lets them know you know
					let lastLostCitiesLoc = event.player.persistentData.dimensionalTransportLastLostCitiesLoc 
					event.player.stages.remove('confirmLCtravel') //removes the confirmation, so player will have to click twice again in the future
					event.block.set('minecraft:air') //changes the block to air so it's one-use
					event.player.persistentData.dimensionalTransportLastOverworldLoc = `${event.block.x} ${event.block.y} ${event.block.z}`	//saves the current location to nbt data
					event.player.potionEffects.add("minecraft:nausea", 10 * 20, 0) //makes the player's head swimmy
					event.server.runCommandSilent(`execute at ${event.player.id} as ${event.player.id} run playsound block.portal.travel neutral @s ~ ~ ~ 100`) //plays the portal sound
					//event.player.tell(text.red(fromOverworldLoc)) //for testing purposes
					event.server.schedule(3 * SECOND, () => {	//waits three seconds
						event.player.tell(text.red("Preparing to travel.")) //lets the player know they're going
						event.server.runCommandSilent(`execute in lostcities:lostcity run tp ${event.player.id} ${lastLostCitiesLoc}`) //teleports them to the lost city
						event.player.stages.add('been.to.lost.city')
						event.item.count-- //removes the item
						event.cancel() //cancels the event
					})
				} else {
					event.player.tell(text.red("I hope you've prepared.")) //acknowledges this is your first time
					event.player.stages.remove('confirmLCtravel') //removes the confirmation, so player will have to click twice again in the future
					event.block.set('minecraft:air') //changes the block to air so it's one-use
					if (!event.player.persistentData.dimensionalTransportLastOverworldLoc) {
						event.player.persistentData.dimensionalTransportLastOverworldLoc = `${event.block.x} ${event.block.y} ${event.block.z}`	//saves the current location to nbt data
					}
					event.player.potionEffects.add("minecraft:nausea", 10 * 20, 0) //makes the player's head swimmy
					event.server.runCommandSilent(`execute at ${event.player.id} as ${event.player.id} run playsound block.portal.travel neutral @s ~ ~ ~ 100`) //plays the portal sound
					//event.player.tell(text.red(fromOverworldLoc)) //for testing purposes
					event.server.schedule(3 * SECOND, () => {	
						event.player.tell(text.red("Preparing to travel.")) //lets the player know they're going
						event.player.potionEffects.add("minecraft:slow_falling") //protects them from the impending drop
						event.server.runCommandSilent(`execute in lostcities:lostcity run tp ${event.player.id} 0 500 0`) //teleports them to the lost city
						event.player.stages.add('been.to.lost.city')
						event.item.count-- //removes the item
						event.cancel() //cancels the event
					})
				}
			}
		}
	}
})

onEvent ("block.right_click", event => {
	
	if (event.hand == MAIN_HAND) { //use only the main hand 
		if (event.item.id == lostCityLeavingItem) { //using the correct item
			let overworldLoc = event.player.persistentData.dimensionalTransportLastOverworldLoc //put overworld info into a var
			if (event.block.id == lostCityLeavingBlock) { //correct block
				if (event.player.stages.has('ready.to.leave.LC')) {
					event.player.tell(text.red("Billy will miss you..."))//confirms the player is leaving
					event.player.stages.remove('ready.to.leave.LC')	
					
					if (!event.player.persistentData.dimensionalTransportLastLostCitiesLoc) {
						event.player.persistentData.dimensionalTransportLastLostCitiesLoc = `${event.block.x} ${event.block.y} ${event.block.z}`	//saves the current location to nbt data						
					} else {
						event.player.persistentData.dimensionalTransportLastLostCitiesLoc = `${event.block.x} ${event.block.y} ${event.block.z}`	//saves the current location to nbt data

					}
					event.player.potionEffects.add("minecraft:nausea", 10 * 20, 0) //makes the player's head swimmy
					event.server.runCommandSilent(`execute at ${event.player.id} as ${event.player.id} run playsound block.portal.travel neutral @s ~ ~ ~ 100`)
					event.server.schedule(3 * SECOND, () => {	
						event.server.runCommandSilent(`execute in minecraft:overworld run tp ${event.player.id} ${overworldLoc}`) //teleports them to back to the overworld
						event.cancel() //cancels the event
					})
				} else {
					let blockXYZ = `${event.block.x} ${event.block.y} ${event.block.z}`
					event.server.runCommand(`execute in lostcities:lostcity run particle minecraft:ash ${blockXYZ} 0.2 0.2 0.2 500 3050`)
					event.server.runCommand(`execute in lostcities:lostcity run particle minecraft:explosion ${blockXYZ} 0.2 0.2 0.2 100 300`)
					event.server.runCommandSilent(`execute at ${event.player.id} as ${event.player.id} run playsound entity.generic.explode neutral @s ~ ~ ~ 100`)
					event.player.tell(text.red("Is it time to go home?")) //lets the player know they're going
					event.player.stages.add('ready.to.leave.LC')
				}
			//event.player.tell(text.green(overworldLoc))
		}
		}
	}
})
