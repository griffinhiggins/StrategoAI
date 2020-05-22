const Player = require(`./Player`);

class HardLogicPlayer extends Player {
    constructor(name, color) {
        super(name, color);
    }
    move(board) {
        let move = this.moves[Math.floor(Math.random() * this.moves.length)],
            orig = move.orig,
            dest = null,
            [row0, col0] = orig,
            row1, col1, rank;

        move.dests.forEach((d) => {
            [row1, col1] = d;
            if (board[row1][col1] != ``) {
                rank = board[row1][col1].getRank();
                if (rank != null && rank > board[row0][col0].rank) {
                    return [orig, dest];
                }
            };
        });
        return [orig, move.dests[Math.floor(Math.random() * move.dests.length)]];
    }
    getPiece() {
        let i = Math.floor(Math.random() * this.inactive.length),
            temp = this.inactive[i];
        this.inactive.splice(i, 1);
        return temp;
    }
}
module.exports = HardLogicPlayer;