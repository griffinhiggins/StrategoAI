// const clc = require(`cli-color`);
class Piece {
    constructor(rank, name, color) {
        this.rank = rank;
        this.name = name;
        this.color = color;
        this.showRank = false;
        this.row = 0;
        this.col = 0;
    }
    setPosition(row, col) {
        this.row = row;
        this.col = col;
    }
    getPosition() {
        return [this.row, this.col];
    }
    // validMove(row, col) {
    //     if (this.rank > 2 && (Math.abs(this.col - col) > 1 || Math.abs(this.row - row) > 1)) {
    //         console.log(clc.red.bold(`Only scouts (2\`s) can move more than 1 space`));
    //         return false;
    //     }
    //     return true;
    // }
}
module.exports = Piece;