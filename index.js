const chokidar = require('chokidar');
var fs = require('fs');
const { Client, Events, GatewayIntentBits } = require('discord.js');
const { token, consoleChannel, generalChannel, playerName } = require('./config.json');
const triggers = require('./triggers.json');

const vaOutPath = "./readfromme.txt"

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.once(Events.ClientReady, c => {
	console.log(`Ready! Logged in as ${c.user.tag}`);
});

var text = ""
const watcher = chokidar.watch(vaOutPath)
watcher.on('change', (event, path) => {
    fs.readFile(vaOutPath, 'utf8', function(err, data){
        data = data.trim()
        if (text === data) return

        text = data
    
        if (text.length < 1) return
    
        console.log(`The textfile reads: ${text}`)

        let [word, trigger] = text.split("|")

        // if (!triggers.hasOwnProperty(text)) return console.log(`Not a defined trigger: ${text}`)

        client.channels.fetch(consoleChannel)
            .then(channel => {
                // console.log(channel)
                channel.send(getCommand(trigger))
            })
            .catch(console.error)
       
        client.channels.fetch(generalChannel)
            .then(channel => {
                // console.log(channel)
                let msg = `${word} `.repeat(12)
                channel.send(`${msg}`)
            })
            .catch(console.error)

        text = ""

        fs.writeFile(vaOutPath, "", (err) => {
            if (err) return console.log(err)
            else console.log("File is now blank")
        })
    })

    
});

function getCommand(t) {
    let trigger = triggers[t]
    let command = trigger.replace(/player_name/g, playerName)
    return command
}

client.login(token);