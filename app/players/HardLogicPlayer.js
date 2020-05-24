const Player = require(`./Player`);
class HardLogicPlayer extends Player {
    constructor(name, color) {
        super(name, color);
    }
    move(board) {
        // console.log(`\nPRE-PRUNING...`);
        // this.moves.forEach((e) => {
        //     console.log(e);
        // });
        let orig,
            dest,
            temp = null,
            bestMove = Infinity,
            empty,
            // inDanger = false,
            diff,
            rank,
            row0,
            col0,
            row1,
            col1;
        this.moves = this.moves.filter(m => {
            [row0, col0] = m.orig;
            orig = board[row0][col0];
            m.dests = m.dests.filter(d => {
                [row1, col1] = d;
                dest = board[row1][col1];
                if (dest == ``) {
                    empty = [
                        [row0, col0],
                        [row1, col1]
                    ];
                    return true;
                } else if ((rank = dest.getRank()) == null) {
                    return false
                } else {
                    if (orig.rank > rank && rank != 1) {
                        bestMove = diff;
                        temp = [
                            [row0, col0],
                            [row1, col1]
                        ];
                    }
                    // else {
                    //     inDanger = true;
                    //     return false;
                    // }
                }
                return true
            });
            if (m.dests.length > 0) {
                return true;
            }
        });
        // if (inDanger) {

        // }
        // console.log(`\POST-PRUNING...`);
        // this.moves.forEach((e) => {
        //     console.log(e);
        // });
        return (temp != null) ? temp : this.moveRandom(board);
    }
    moveRandom(board) {
        let move = this.moves[Math.floor(Math.random() * this.moves.length)],
            orig = move.orig,
            dest = move.dests[Math.floor(Math.random() * move.dests.length)];
        return [orig, dest];
    }
    getPiece() {
        let i = Math.floor(Math.random() * this.inactive.length),
            temp = this.inactive[i];
        this.inactive.splice(i, 1);
        return temp;
    }
}
module.exports = HardLogicPlayer;