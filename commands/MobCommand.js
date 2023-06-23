const mobs = require('./mobs.json');

export class MobCommand extends Command () {
    cmd() {
        const rand = Math.floor(Math.random() * mobs.length)
        const mob_name = mobs[rand]
    
        return `mob ${mob_name} 1 ${player_name}`
    }
}