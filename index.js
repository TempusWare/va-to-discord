const chokidar = require('chokidar');
var fs = require('fs');
const { Client, Events, GatewayIntentBits } = require('discord.js');
const { token, consoleChannel, generalChannel, playerName } = require('./config.json');
const triggers = require('./triggers.json');
const mobs = require('./mobs.json');

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

        commands.push(`say ${playerName} said ${word}`)
        
        let validTrigger = true

        switch (trigger) {
            case "kill":
                commands.push(`kill ${playerName}`)
                break;
            case "mob":
                let mob = getRandomMob()
                commands.push(`spawnmob ${mob} 1 ${playerName}`)
                commands.push(`say Spawning ${mob}`)
                break;
            default:
                validTrigger = false
                break;
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

function getCommands(t) {
    var messages = []

    const trigger = triggers[t]
    var command = trigger.replace(/player_name/g, playerName)
    messages.push(command)
    messages.push(`say ${playerName} said ${word}`)

    if (t === "mob") {
        const mob = getRandomMob()
        command = command.replace(/mob_name/g, mob)

        messages.push(`say Spawning ${mob}`)
    }

    return messages
}

function getRandomMob() {
    const rand = Math.floor(Math.random() * mobs.length)
    return mobs[rand]
}

client.login(token);