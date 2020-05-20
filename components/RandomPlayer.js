const Player = require(`./Player`);

class RandomPlayer extends Player {
    constructor(name, color) {
        super(name, color);
    }
    moveRandom() {
        let move = this.moves[Math.floor(Math.random() * this.moves.length)],
            orig = move.coordinate,
            dest = move.move[Math.floor(Math.random() * move.move.length)];
        return [orig, dest];
    }
}
module.exports = RandomPlayer;