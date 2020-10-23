const clc = require(`cli-color`);
const EMPTY = ``,
  [FLAG, BOMB, MINER, MARSHAL, SPY] = [0, 1, 3, 10, 11];

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
      [EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY],
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
      grid += `  ${i} -${row}- ${i}${stats[i + 1]}\n`;
    }
    grid += `      -  -  -  -  -  -  -  -  -  -${stats[11]}\n      0  1  2  3  4  5  6  7  8  9`;
    console.log(grid);
  }
  getSym(i, j, win) {
    let str,
      temp = this.board[i][j];
    if (this.isMid(i, j)) {
      return ` X `;
    } else if (temp == EMPTY) {
      return `   `;
    }
    //! UNCOMMENT IN PROD
    // else if (temp.color == true && !temp.showRank && !win) {
    //   str = ` ? `;
    // }
    //! UNCOMMENT IN PROD
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
    if (temp.capturePiece) {
      str = clc.bgBlueBright.black(str);
    } else if (temp.color) {
      if (!temp.showRank) {
        str = clc.redBright(str);
      } else {
        str = clc.bgRedBright.black(str);
      }
    } else {
      if (!temp.showRank) {
        str = clc.cyanBright(str);
      } else {
        str = clc.bgCyanBright.black(str);
      }
    }
    return str;
  }
  place(player, placement) {
    let [piece, row, col] = placement;
    if (this.board[row][col] == EMPTY) {
      this.board[row][col] = piece;
      piece.setPosition(row, col);
      if (piece.rank == FLAG) {
        player.flag = [row, col];
      }
    } else {
      let temp = this.board[row][col];
      this.board[col][row] = piece;
      player.inactive.push(temp);
      player.numPerRank[temp.rank]++;
    }
  }
  move(origPlayer, destPlayer) {
    let [[row0, col0], [row1, col1]] = origPlayer.move(
        this.board,
        destPlayer.numPerRank,
      ),
      orig = this.board[row0][col0],
      dest = this.board[row1][col1];

    if (!this.inBounds(row0, col0) || !this.inBounds(row1, col1)) {
      console.log(
        clc.red.bold(`${(row0, col0)} or ${(row1, col1)} are not in bounds`),
      );
      return false;
    } else {
      (orig = this.board[row0][col0]), (dest = this.board[row1][col1]);
    }
    if (orig == EMPTY) {
      console.log(
        clc.red.bold(
          `The piece you are trying to move at ${row0},${col0} doesn't exist`,
        ),
      );
      return false;
    } else if (origPlayer.color != orig.color) {
      console.log(
        clc.red.bold(
          `The piece you are trying to move at ${row0},${col0} is not yours`,
        ),
      );
      return false;
    } else if (orig.rank < 2) {
      console.log(
        clc.red.bold(
          `The piece you are trying to move at ${row0},${col0} is not a movable piece`,
        ),
      );
      return false;
    } else if (row0 != row1 && col0 != col1) {
      console.log(clc.red.bold(`Pieces cannot be move diagonialy`));
      return false;
    } else if (
      orig.rank > 2 &&
      (Math.abs(col0 - col1) > 1 || Math.abs(row0 - row1) > 1)
    ) {
      console.log(
        clc.red.bold(
          `Only Scout's can move more than 1 space (scouts are the same as a castle in chess)`,
        ),
      );
      return false;
    } else if (dest.color == orig.color) {
      console.log(
        clc.red.bold(
          `The piece you are trying to move at ${(row0, col0)} to ${
            (row1, col1)
          } is occupied by the same color piece`,
        ),
      );
      return false;
    } else if (dest == EMPTY) {
      [this.board[row1][col1], this.board[row0][col0]] = [orig, dest];
      orig.setPosition(row1, col1);
    } else {
      //!ATTACK
      //? ATTACK THE SAME RANK
      if (orig.rank == dest.rank) {
        origPlayer.removePiece(orig);
        destPlayer.removePiece(dest);
        [this.board[row0][col0], this.board[row1][col1]] = [EMPTY, EMPTY];
      }
      //? ATTACK WITH A SPY *SPECIAL CASE
      else if (orig.rank == SPY && dest.rank != MARSHAL) {
        origPlayer.removePiece(orig);
        this.board[row0][col0] = EMPTY;
      }
      //? ATTACK A MINE *SPECIAL CASE
      else if (orig.rank != MINER && dest.rank == BOMB) {
        origPlayer.removePiece(orig);
        this.board[row0][col0] = EMPTY;
      } //? ATTACK A LOWER RANK || SPY || FLAG
      else if ([SPY, FLAG].includes(dest.rank) || orig.rank > dest.rank) {
        destPlayer.removePiece(dest);
        [this.board[row0][col0], this.board[row1][col1]] = [EMPTY, orig];
        orig.setPosition(row1, col1);
        //? ATTACK A FLAG
        if (dest.rank == FLAG) {
          orig.capturePiece = true;
          origPlayer.win = true;
        }
      }
      //? ATTACK A HIGHER RANK
      else if (orig.rank < dest.rank) {
        origPlayer.removePiece(orig);
        this.board[row0][col0] = EMPTY;
      }
      dest.showRank = true;
      orig.showRank = true;
    }
    return true;
  }
  inBounds(row, col) {
    let bounds = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
    return (
      bounds[row] != undefined &&
      bounds[col] != undefined &&
      !this.isMid(row, col)
    );
  }
  isMid(i, j) {
    return [4, 5].includes(i) && [2, 3, 6, 7].includes(j);
  }
  canMoveSet(player) {
    let temp,
      dests,
      moves = [];
    for (let i = 0; i < this.board.length; i++) {
      for (let j = 0; j < this.board.length; j++) {
        dests = [];
        temp = this.board[i][j];
        if (temp != EMPTY && temp.rank > 1 && temp.color == player.color) {
          if (this.inBounds(i - 1, j)) {
            if (
              this.board[i - 1][j] == EMPTY ||
              this.board[i - 1][j].color != this.board[i][j].color
            ) {
              dests.push([i - 1, j]);
            }
          }
          if (this.inBounds(i + 1, j)) {
            if (
              this.board[i + 1][j] == EMPTY ||
              this.board[i + 1][j].color != this.board[i][j].color
            ) {
              dests.push([i + 1, j]);
            }
          }
          if (this.inBounds(i, j - 1)) {
            if (
              this.board[i][j - 1] == EMPTY ||
              this.board[i][j - 1].color != this.board[i][j].color
            ) {
              dests.push([i, j - 1]);
            }
          }
          if (this.inBounds(i, j + 1)) {
            if (
              this.board[i][j + 1] == EMPTY ||
              this.board[i][j + 1].color != this.board[i][j].color
            ) {
              dests.push([i, j + 1]);
            }
          }
          if (dests.length) {
            moves.push({
              orig: temp.getPosition(),
              dests: dests,
            });
          }
        }
      }
    }
    player.moves = moves;
    return moves.length;
  }
}
module.exports = Board;
