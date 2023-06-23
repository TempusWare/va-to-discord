const chokidar = require('chokidar');
var fs = require('fs');
const { Client, Events, GatewayIntentBits } = require('discord.js');
const { token, consoleChannel, playerName } = require('./config.json');
const mobs = require('./mobs.json');
const entities = require('./entities.json');

const vaOutPath = "./readfromme.txt"

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.once(Events.ClientReady, c => {
	console.log(`Ready! Logged in as ${c.user.tag}`);
});

var text = ""
const watcher = chokidar.watch(vaOutPath)
watcher.on('change', (event, path) => {
    console.log(`Readfile changed. Text: ${text}`)
    fs.readFile(vaOutPath, 'utf8', function(err, data){
        console.log(`Readfile read: Text: ${text}, Data: ${data}`)
        
        data = data.trim()
        if (text === data) return

        text = data
    
        if (text.length < 1) return
    
        console.log(`The textfile reads: ${text}`)

        let [word, trigger] = text.split("|")

        text = ""

        fs.writeFile(vaOutPath, "", (err) => {
            if (err) return console.log(err)
            else console.log("File is now blank")
        })

        let commands = []

        // commands.push(`say ${playerName} said ${word}`)
        commands.push(`tellraw @a {"text": "${playerName} said ${word}", "color": "gray"}`)
        
        let validTrigger = true

        switch (trigger) {
            case "kill": {
                commands.push(`kill ${playerName}`)
            } break;
            case "mob":
            case "entity": { // Entities include all entities (boats, armour stands); not just creatures
                let mob = getRandomMob(trigger)
                commands.push(`spawnmob ${mob} 1 ${playerName}`)
                // commands.push(`say Spawning ${mob}`)
                commands.push(`tellraw @a {"text": "Spawning ${mob}", "color": "blue"}`)
            } break;
            case "mobs":
            case "entities": { // Entities include all entities (boats, armour stands); not just creatures
                let mob = getRandomMob(trigger)
                let amount = Math.round(Math.random() * 9 + 1)
                commands.push(`spawnmob ${mob} ${amount} ${playerName}`)
                // commands.push(`say Spawning ${amount} ${mob}${amount > 1 ? "s" : ""}`)
                commands.push(`tellraw @a {"text": "Spawning ${amount} ${mob}${amount > 1 ? "s" : ""}", "color": "blue"}`)
                } break;
            case "bees": {
                let mob = "bee"
                let amount = 36
                commands.push(`spawnmob ${mob} ${amount} ${playerName}`)
                commands.push(`tellraw @a {"text": "Spawning bees", "color": "yellow"}`)
            } break;
            default: {
                validTrigger = false
            } break;
        }

        if (!validTrigger) return console.log(`Not a defined trigger: ${trigger}`)

        sendToChannel(consoleChannel, commands)
    })
});

function sendToChannel(channelID, messages) {
    client.channels.fetch(channelID)
    .then(channel => {
        messages.forEach(msg => channel.send(msg))
    })
    .catch(console.error)
}

function getRandomMob(type) {
    const list = type === "mob" || type === "mobs" ? mobs : entities
    const rand = Math.floor(Math.random() * list.length)
    return list[rand]
}

client.login(token);