const [
    clc,
    Data
] = [
    require(`cli-color`),
    require(`./Data`)
];
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
            str,
            temp,
            bg = false,
            grid = `      0  1  2  3  4  5  6  7  8  9\t\tSCORE BOARD\n      -  -  -  -  -  -  -  -  -  -${stats[0]}\n`;
        for (let i = 0; i < 10; i++) {
            row = EMPTY;
            str = EMPTY;
            for (let j = 0; j < 10; j++) {
                temp = this.board[i][j];
                if (temp == EMPTY) {
                    str = `   `;
                } else if (temp.color == true && !temp.showRank && !win) {
                    str = ` ? `
                } else {
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
                row += (this.isMid(i, j)) ? ` X ` : temp.color ? bg ? clc.bgRedBright.black(str) : clc.redBright(str) : bg ? clc.bgCyanBright.black(str) : clc.cyanBright(str);
            }
            grid += `  ${i} -${row}- ${i}${stats[i+1]}\n`;
        }
        grid += `      -  -  -  -  -  -  -  -  -  -${stats[11]}\n      0  1  2  3  4  5  6  7  8  9`;
        console.log(grid);
    }
    place(player, placement) {
        let [rank, row, col] = placement.split(`,`).map(Number), piece = player.getPiece(rank);
        if ((piece == null) || !(this.inBounds(row, col)) || (player.color && row > 3) || (!player.color && row < 6)) {
            return;
        }
        if (this.board[row][col] == EMPTY) {
            this.board[row][col] = piece;
            this.board[row][col].setPosition(row, col);
        } else {
            let temp = this.board[row][col];
            this.board[col][row] = piece;
            player.inactive.push(temp);
            player.numPerRank[temp.rank]++;
        }
    }
    move(origPlayer, destPlayer, move) {
        let [orig, dest] = move,
        [row0, col0] = orig,
        [row1, col1] = dest;

        if (!this.inBounds(row0, col0) || !this.inBounds(row1, col1)) {
            console.log(clc.red.bold(`${row0,col0} or ${row1,col1} are not in bounds`));
            return false;
        } else {
            orig = this.board[row0][col0], dest = this.board[row1][col1];
        }
        if (orig == EMPTY) {
            console.log(clc.red.bold(`The piece you are trying to move at ${row0},${col0} doesn't exist`));
            return false;
        } else if (origPlayer.color != orig.color) {
            console.log(clc.red.bold(`The piece you are trying to move at ${row0},${col0} is not yours`));
            return false;
        } else if (orig.rank < 2) {
            console.log(clc.red.bold(`The piece you are trying to move at ${row0},${col0} is not a movable piece`));
            return false;
        } else if (row0 != row1 && col0 != col1) {
            console.log(clc.red.bold(`Pieces cannot be move diagonialy`));
            return false;
        } else if (orig.rank > 2 && (Math.abs(col0 - col1) > 1 || Math.abs(row0 - row1) > 1)) {
            console.log(clc.red.bold(`Only Scout's can move more than 1 space (scouts are the same as a castle in chess)`));
            return false;
        } else if (dest.color == orig.color) {
            console.log(clc.red.bold(`The piece you are trying to move at ${row0,col0} to ${row1,col1} is occupied by the same color piece`));
            return false;
        } else if (dest == EMPTY) {
            [this.board[row1][col1], this.board[row0][col0]] = [this.board[row0][col0], ``];
            orig.setPosition(row1, col1);
            return true;
        } else {
            if (orig.rank != 3 && dest.rank == 1) {
                origPlayer.kill(orig);
            } else if (orig.rank == 11 && dest.rank != 10) {
                origPlayer.kill(orig);
            } else if (orig.rank > dest.rank) {
                destPlayer.kill(dest);
                this.board[row1][col1] = orig;
                orig.setPosition(row1, col1);

                if (dest.rank == 0) {
                    orig.capturePiece = true;
                    origPlayer.win = true
                }

            } else if (orig.rank < dest.rank) {
                origPlayer.kill(orig);
            } else if (orig.rank == dest.rank) {
                origPlayer.kill(orig);
                destPlayer.kill(dest);
                this.board[row1][col1] = EMPTY;
            }
            this.board[row0][col0] = EMPTY;
            dest.showRank = true;
            orig.showRank = true;
            return true;
        }
    }
    inBounds(row, col) {
        let bounds = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
        return bounds[row] != undefined && bounds[col] != undefined && !this.isMid(row, col)
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
        if (!set.length) {
            return false;
        }
        player.moves = set;
        return true;
    }
    isMid(i, j) {
        return ([4, 5].includes(i) && [2, 3, 6, 7].includes(j));
    }
}
module.exports = Board;