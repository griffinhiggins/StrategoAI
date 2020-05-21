const clc = require(`cli-color`);
const EMPTY = ``;
class Board {
    constructor() {
        this.board = [
            [EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY],
            [EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY],
            [EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY],
            [EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY],
            [EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY],
            [EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY],
            [EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY],
            [EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY],
            [EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY],
            [EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY]
        ];
        this.length = 10;
    }
    print(stats, win) {
        let row,
            grid = `      0  1  2  3  4  5  6  7  8  9\t\tSCORE BOARD\n      -  -  -  -  -  -  -  -  -  -${stats[0]}\n`;
        for (let i = 0; i < 10; i++) {
            row = EMPTY;
            for (let j = 0; j < 10; j++) {
                row += this.getSym(i, j, win);
            }
            grid += `  ${i} -${row}- ${i}${stats[i+1]}\n`;
        }
        grid += `      -  -  -  -  -  -  -  -  -  -${stats[11]}\n      0  1  2  3  4  5  6  7  8  9`;
        console.log(grid);
    }
    getSym(i, j, win) {
        let str,
            temp = this.board[i][j]
        if (temp == EMPTY) {
            str = `   `;
        } else if (this.isMid(i, j)) {
            str = ` X `;
        }
        // else if (temp.color == true && !temp.showRank && !win) {
        //     str = ` ? `
        // } 
        else {
            switch (temp.rank) {
                case 0:
                    str = ` F `;
                    break;
                case 1:
                    str = ` B `;
                    break;
                case 10:
                    str = ` M `;
                    break;
                case 11:
                    str = ` S `;
                    break;
                default:
                    str = ` ${temp.rank} `;
            }
        }
        return (temp.capturePiece) ? clc.blueBright(str) : (temp.color) ? clc.redBright(str) : clc.cyanBright(str);
    }
    place(player, placement) {
        let [piece, row, col] = placement;
        if (this.board[row][col] == EMPTY) {
            this.board[row][col] = piece;
            piece.setPosition(row, col);
        } else {
            let temp = this.board[row][col];
            this.board[col][row] = piece;
            player.inactive.push(temp);
            player.numPerRank[temp.rank]++;
        }
    }
    move(origPlayer, destPlayer, move) {
        let [
            [row0, col0],
            [row1, col1]
        ] = move,
        orig = this.board[row0][col0], dest = this.board[row1][col1];
        if (dest == EMPTY) {
            [this.board[row1][col1], this.board[row0][col0]] = [orig, dest];
            orig.setPosition(row1, col1);
        } else {
            if (orig.rank != 3 && dest.rank == 1) {
                origPlayer.removePiece(orig);
            } else if (orig.rank == 11 && dest.rank != 10) {
                origPlayer.removePiece(orig);
            } else if (orig.rank > dest.rank) {
                destPlayer.removePiece(dest);
                this.board[row1][col1] = orig;
                orig.setPosition(row1, col1);
                if (dest.rank == 0) {
                    orig.capturePiece = true;
                    origPlayer.win = true
                    this.board[row0][col0] = EMPTY;
                    dest.showRank = true;
                    orig.showRank = true;
                    return true;
                }
            } else if (orig.rank < dest.rank) {
                origPlayer.removePiece(orig);
            } else if (orig.rank == dest.rank) {
                origPlayer.removePiece(orig);
                destPlayer.removePiece(dest);
                this.board[row1][col1] = EMPTY;
            }
            this.board[row0][col0] = EMPTY;
            dest.showRank = true;
            orig.showRank = true;
        }
        return false;
    }
    inBounds(row, col) {
        let bounds = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
        return bounds[row] != undefined && bounds[col] != undefined && !this.isMid(row, col)
    }
    isMid(i, j) {
        return ([4, 5].includes(i) && [2, 3, 6, 7].includes(j));
    }
    canMoveSet(player) {
        let temp, move, set = [];
        for (let i = 0; i < this.board.length; i++) {
            for (let j = 0; j < this.board.length; j++) {
                move = [];
                temp = this.board[i][j];
                if (temp != EMPTY && temp.rank > 1 && temp.color == player.color) {
                    if (this.inBounds(i - 1, j)) {
                        if (this.board[i - 1][j] == EMPTY || this.board[i - 1][j].color != this.board[i][j].color) {
                            move.push([i - 1, j]);
                        }
                    }
                    if (this.inBounds(i + 1, j)) {
                        if (this.board[i + 1][j] == EMPTY || this.board[i + 1][j].color != this.board[i][j].color) {
                            move.push([i + 1, j]);
                        }
                    }
                    if (this.inBounds(i, j - 1)) {
                        if (this.board[i][j - 1] == EMPTY || this.board[i][j - 1].color != this.board[i][j].color) {
                            move.push([i, j - 1]);
                        }
                    }
                    if (this.inBounds(i, j + 1)) {
                        if (this.board[i][j + 1] == EMPTY || this.board[i][j + 1].color != this.board[i][j].color) {
                            move.push([i, j + 1]);
                        }
                    }
                    if (move.length) {
                        set.push({
                            coordinate: temp.getPosition(),
                            move: move
                        });
                    }
                }
            }
        }
        player.moves = set;
        return set.length;
    }
}
module.exports = Board;