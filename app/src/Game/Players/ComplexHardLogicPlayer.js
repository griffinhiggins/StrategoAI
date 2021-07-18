const Player = require(`./Player`);
// const io = require(`../../Data/io`);
class ComplexHardLogicPlayer extends Player {
  constructor(name, color) {
    super(name, color);
  }
  move(board, destPlayerRanks) {
    let orig,
      dest,
      rank,
      row0,
      col0,
      row1,
      col1,
      danger = [];
    this.moves.forEach(m => {
      [row0, col0] = m.orig;
      orig = board[row0][col0];
      if (board.inBounds(row0 + 1, col0)) {
        if (board[row0 + 1][col0].getRank() != undefined) {

        }
      }
    });
  }
  getPercent(rank, destPlayerRanks) {
    let gtRank = 0,
      lteqRank = 0;
    destPlayerRanks.forEach((r, i) => {
      i <= rank ? (lteqRank += r) : (gtRank += r);
    });
    return Math.floor((gtRank / (gtRank + lteqRank)) * 100);
  }
  moveRand() {
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
module.exports = ComplexHardLogicPlayer;
