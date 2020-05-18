const [
    clc,
    Data
] = [
    require(`cli-color`),
    require(`./Data`)
];
class Board {
    constructor() {
        this.board = [
            [` `, ` `, ` `, ` `, ` `, ` `, ` `, ` `, ` `, ` `],
            [` `, ` `, ` `, ` `, ` `, ` `, ` `, ` `, ` `, ` `],
            [` `, ` `, ` `, ` `, ` `, ` `, ` `, ` `, ` `, ` `],
            [` `, ` `, ` `, ` `, ` `, ` `, ` `, ` `, ` `, ` `],
            [` `, ` `, ` `, ` `, ` `, ` `, ` `, ` `, ` `, ` `],
            [` `, ` `, ` `, ` `, ` `, ` `, ` `, ` `, ` `, ` `],
            [` `, ` `, ` `, ` `, ` `, ` `, ` `, ` `, ` `, ` `],
            [` `, ` `, ` `, ` `, ` `, ` `, ` `, ` `, ` `, ` `],
            [` `, ` `, ` `, ` `, ` `, ` `, ` `, ` `, ` `, ` `],
            [` `, ` `, ` `, ` `, ` `, ` `, ` `, ` `, ` `, ` `]
        ];
        this.length = 10;
    }
    print(stats, orig) {
        // let row0, col0;
        // if (orig != undefined) {
        //     [
        //         row0,
        //         col0,
        //     ] = orig.split(`,`).map(Number),
        //         orig = (this.board[row0][col0] == ` `) ? undefined : this.board[row0][col0];
        // }

        console.log(`      0  1  2  3  4  5  6  7  8  9\t\tSCORE BOARD\n      -  -  -  -  -  -  -  -  -  -${stats[0]}`);
        for (let i = 0; i < 10; i++) {

            let row = ``,
                str = ``,
                temp,
                bg;

            for (let j = 0; j < 10; j++) {

                temp = this.board[i][j];


                // let bounds = (orig != undefined && orig.rank != 2) ? [i - 1, i + 1].includes(row0) && j == col0 || [j - 1, j + 1].includes(col0) && i == row0 : i == row0 || j == col0;
                // bg = bounds
                // if (temp.color != undefined && orig != undefined) {
                //     bg &= temp.color != orig.color
                // }

                if (temp != ` `) {
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
                } else {
                    str = `   `;
                }
                row += ([4, 5].includes(i) && [2, 3, 6, 7].includes(j)) ? ` X ` : (temp.color) ? ((bg) ? clc.bgRedBright.black(str) : clc.redBright(str)) : ((bg) ? clc.bgCyanBright.black(str) : clc.cyanBright(str));

            }
            console.log(`  ${i} -${row}- ${i}${stats[i+1]}`);
        }
        console.log(`      -  -  -  -  -  -  -  -  -  -${stats[11]}\n      0  1  2  3  4  5  6  7  8  9`);
    }
    place(player, placement) {
        let [
            rank,
            row,
            col
        ] = placement.split(`,`),
            piece = player.getPiece(rank);
        if (piece == null || !this.inBounds(row, col) || (player.color && row > 3) || (!player.color && row < 6)) {
            return;
        }
        if (this.board[row][col] === ` `) {
            this.board[row][col] = piece;
        } else {
            let temp = this.board[row][col];
            this.board[col][row] = piece;
            player.inactive.push(temp);
            player.numPerRank[temp.rank]++;
        }
        piece.setPosition(row, col);
    }
    move(origPlayer, destPlayer, move) {
        let [o, d] = move;
        let [
            row0,
            col0,
        ] = o.split(`,`).map(Number), row1 = 0, col1 = 0;
        switch (d) {
            case `u`:
                row1 = row0 - 1;
                col1 = col0;
                break;
            case `d`:
                row1 = row0 + 1;
                col1 = col0;
                break;
            case `l`:
                row1 = row0;
                col1 = col0 - 1;
                break;
            case `r`:
                row1 = row0;
                col1 = col0 + 1;
                break;
            default:
                [row1, col1] = d.split(`,`).map(Number);
        }
        if (!this.inBounds(row0, col0) || !this.inBounds(row1, col1)) {
            console.log(clc.red.bold(`${row0,col0} or ${row1,col1} are not in bounds`));
            return false;
        }
        let orig = this.board[row0][col0],
            dest = this.board[row1][col1];
        if (orig == ` `) {
            console.log(clc.red.bold(`The piece you are trying to move at ${o} doesn't exist`));
            return false;
        } else if (origPlayer.color ^ orig.color) {
            console.log(clc.red.bold(`The piece you are trying to move at ${o} is not yours`));
            return false;
        } else if (orig.rank < 2) {
            console.log(clc.red.bold(`The piece you are trying to move at ${o} is not a movable piece`));
            return false;
        }
        if (orig.validMove(row1, col1)) {
            if (dest == ` `) {
                this.board[row1][col1] = this.board[row0][col0];
                this.board[row1][col1].setPosition(row1, col1);
                this.board[row0][col0] = ` `;
                return true
            } else if (dest.color == orig.color) {
                console.log(clc.red.bold(`The piece you are trying to move at ${row0,col0} to ${row1,col1} is occupied by the same color piece`));
                return false;
            } else {
                if (dest.rank == 0) {
                    player.win = true;
                } else if (orig.rank != 3 && dest.rank == 1) {
                    destPlayer.kill(dest);
                } else if (orig.rank == 11 && dest.rank != 10) {
                    origPlayer.kill(orig);
                } else if (orig.rank > dest.rank) {
                    destPlayer.kill(dest);
                    this.board[row1][col1] = this.board[row0][col0];
                    this.board[row1][col1].setPosition(row1, col1);
                } else if (orig.rank < dest.rank) {
                    origPlayer.kill(orig);
                } else if (orig.rank == dest.rank) {
                    origPlayer.kill(orig);
                    destPlayer.kill(dest);
                    this.board[row1][col1] = ` `;
                }
                this.board[row0][col0] = ` `;
                return true;
            }
        }
        return false;

    }
    inBounds(row, col) {
        let bounds = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
        if ((bounds[row] === undefined || bounds[col] === undefined || ([4, 5].includes(row) && [2, 3, 6, 7].includes(col)))) {
            // console.log(clc.redBright(`INVALID MOVE: board[${row}][${col}]`));
            return false;
        }
        return true;
    }
}
module.exports = Board;