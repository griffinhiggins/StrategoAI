const Player = require(`./Player`);

class HardLogicPlayer extends Player {
    constructor(name, color) {
        super(name, color);
    }
    move() {
        return [orig, dest];
    }
    getPiece() {
        return this.inactive[Math.floor(Math.random() * this.inactive.length)];
    }
}
module.exports = HardLogicPlayer;