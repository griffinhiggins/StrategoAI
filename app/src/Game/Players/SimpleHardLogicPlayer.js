const Player = require(`./Player`);
// const io = require(`../../../Data/io`);
class SimpleHardLogicPlayer extends Player {
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
      actions = {
        lose: [],
        win: [],
        empty: [],
        draw: [],
        unknown: [],
      };

    this.moves.forEach(m => {
      [row0, col0] = m.orig;
      orig = board[row0][col0];

      m.dests.forEach(d => {
        [row1, col1] = d;
        dest = board[row1][col1];
        if (dest == ``) {
          actions.empty.push({
            orig: [row0, col0],
            dest: [row1, col1],
            score: 0,
          });
        } else if ((rank = dest.getRank()) == null) {
          actions.unknown.push({
            orig: [row0, col0],
            dest: [row1, col1],
            score: this.getPercent(orig.rank, destPlayerRanks), //have a function that predicts what the peice rank is
          });
        } else if (orig.rank > rank) {
          actions.win.push({
            orig: [row0, col0],
            dest: [row1, col1],
            score: rank,
          });
        } else if (orig.rank < rank) {
          actions.lose.push({
            orig: [row0, col0],
            dest: [row1, col1],
            score: orig.rank,
          });
        } else {
          actions.draw.push({
            orig: [row0, col0],
            dest: [row1, col1],
            score: 0,
          });
        }
      });
    });
    actions.win.sort((i, j) => j.score - i.score);
    actions.lose.sort((i, j) => j.score - i.score);

    // let data = io.read(`../Data/actions.json`);
    // data.push(actions);
    // io.write(`../Data/actions.json`, data);

    let temp = null,
      score = 0;

    if (actions.lose.length) {
      if (actions.win.length) {
        actions.lose.forEach((l) => {
          actions.win.forEach((w) => {
            if (JSON.stringify(l.orig) === JSON.stringify(w.orig) && l.score + w.score > score) {
              score = l.score + w.score;
              temp = [w.orig, w.dest];
            }
          });
        });
      }
      if (actions.empty.length) {
        actions.lose.forEach((l) => {
          actions.empty.forEach((e) => {
            if (JSON.stringify(l.orig) === JSON.stringify(e.orig) && l.score + e.score > score) {
              score = l.score + e.score;
              temp = [e.orig, e.dest];
            }
          });
        });
      }
      if (actions.unknown.length) {
        actions.lose.forEach((l) => {
          actions.unknown.forEach((u) => {
            if (JSON.stringify(l.orig) === JSON.stringify(u.orig) && l.score + u.score > score) {
              score = l.score + u.score;
              temp = [u.orig, u.dest];
            }
          });
        });
      }
      if (actions.draw.length) {
        actions.lose.forEach((l) => {
          actions.draw.forEach((d) => {
            if (JSON.stringify(l.orig) === JSON.stringify(d.orig) && l.score + d.score > score) {
              score = l.score + d.score;
              temp = [d.orig, d.dest];
            }
          });
        });
      }
      return temp == null ? [actions.lose[actions.lose.length - 1].orig, actions.lose[actions.lose.length - 1].dest] : temp;
    }
    if (actions.win.length) {
      return [actions.win[0].orig, actions.win[0].dest];
    }
    if (actions.empty.length) {
      let num = Math.floor(Math.random() * actions.empty.length);
      return [actions.empty[num].orig, actions.empty[num].dest];
    }
    if (actions.unknown.length) {
      let num = Math.floor(Math.random() * actions.unknown.length);
      return [actions.unknown[num].orig, actions.unknown[num].dest];
    }
    if (actions.draw.length) {
      let num = Math.floor(Math.random() * actions.draw.length);
      return [actions.draw[num].orig, actions.draw[num].dest];
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
module.exports = SimpleHardLogicPlayer;
