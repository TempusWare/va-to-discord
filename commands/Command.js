class Command {
    constructor(player_name) {
        this.player_name = player_name
    }
    cmd() {
        return `broadcast ${player_name}`
    }
}