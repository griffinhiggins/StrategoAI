const Player = require(`./Player`);
class HardLogicPlayer extends Player {
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
      moves = {
        lose: [],
        win: [],
        empty: [],
        draw: [],
        unknown: [],
      },
      elements = 0,
      total = 0;

    this.moves.forEach((m) => {
      [row0, col0] = m.orig;
      orig = board[row0][col0];

      m.dests.forEach((d) => {
        [row1, col1] = d;
        dest = board[row1][col1];

        if (dest == ``) {
          moves.empty.push({
            orig: [row0, col0],
            dest: [row1, col1],
            score: 0,
          });
        } else if ((rank = dest.getRank()) == null) {
          moves.unknown.push({
            orig: [row0, col0],
            dest: [row1, col1],
            score: this.getPercent(orig.rank, destPlayerRanks), //have a function that predicts what the peice rank is
          });
        } else if (orig.rank > rank) {
          moves.win.push({
            orig: [row0, col0],
            dest: [row1, col1],
            score: rank,
          });
        } else if (orig.rank < rank) {
          moves.lose.push({
            orig: [row0, col0],
            dest: [row1, col1],
            score: orig.rank,
          });
        } else {
          moves.draw.push({
            orig: [row0, col0],
            dest: [row1, col1],
            score: 0,
          });
        }
      });
    });

    moves.win.sort((i, j) => j.score - i.score);
    moves.lose.sort((i, j) => j.score - i.score);

    // console.log(moves);

    let temp = null,
      score = 0,
      found = false,
      set = null;

    if (moves.lose.length) {
      if (moves.win.length) {
        moves.lose.forEach((l) => {
          moves.win.forEach((w) => {
            if (
              JSON.stringify(l.orig) === JSON.stringify(w.orig) &&
              l.score + w.score > score
            ) {
              score = l.score + w.score;
              temp = [w.orig, w.dest];
            }
          });
        });
      }
      if (moves.empty.length) {
        moves.lose.forEach((l) => {
          moves.empty.forEach((e) => {
            if (
              JSON.stringify(l.orig) === JSON.stringify(e.orig) &&
              l.score + e.score > score
            ) {
              score = l.score + e.score;
              temp = [e.orig, e.dest];
            }
          });
        });
      }
      if (moves.unknown.length) {
        moves.lose.forEach((l) => {
          moves.unknown.forEach((u) => {
            if (
              JSON.stringify(l.orig) === JSON.stringify(u.orig) &&
              l.score + u.score > score
            ) {
              score = l.score + u.score;
              temp = [u.orig, u.dest];
            }
          });
        });
      }
      if (moves.draw.length) {
        moves.lose.forEach((l) => {
          moves.draw.forEach((d) => {
            if (
              JSON.stringify(l.orig) === JSON.stringify(d.orig) &&
              l.score + d.score > score
            ) {
              score = l.score + d.score;
              temp = [d.orig, d.dest];
            }
          });
        });
      }
      return temp == null
        ? [
            moves.lose[moves.lose.length - 1].orig,
            moves.lose[moves.lose.length - 1].dest,
          ]
        : temp;
    }
    if (moves.win.length) {
      return [moves.win[0].orig, moves.win[0].dest];
    }
    if (moves.empty.length) {
      let num = Math.floor(Math.random() * moves.empty.length);
      return [moves.empty[num].orig, moves.empty[num].dest];
    }
    if (moves.unknown.length) {
      let num = Math.floor(Math.random() * moves.unknown.length);
      return [moves.unknown[num].orig, moves.unknown[num].dest];
    }
    if (moves.draw.length) {
      let num = Math.floor(Math.random() * moves.draw.length);
      return [moves.draw[num].orig, moves.draw[num].dest];
    }

    return this.moveRand();
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
module.exports = HardLogicPlayer;
