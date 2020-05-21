const Player = require(`./Player`);

class RandomPlayer extends Player {
    constructor(name, color) {
        super(name, color);
    }
    move() {
        let move = this.moves[Math.floor(Math.random() * this.moves.length)],
            orig = move.coordinate,
            dest = move.move[Math.floor(Math.random() * move.move.length)];
        return [orig, dest];
    }
    getPiece() {
        let i = Math.floor(Math.random() * this.inactive.length),
            temp = this.inactive[i];
        this.inactive.splice(i, 1);
        return temp;
    }
}
module.exports = RandomPlayer;