const
  [
    clear,
    clc,
    Board,
    Score,
  ] = [
      require(`clear`),
      require(`cli-color`),
      require(`./Components/Board`),
      require(`./Score`),
    ];

class Game {
  constructor(players, sim, stats) {
    this.board = new Board();
    this.players = players;
    this.init();
    this.moveNum = 0;
    sim ? this.sim(stats) : this.play();
  }
  init() {
    this.players.forEach((player) => {
      for (let row = player.color ? 0 : 6; row < (player.color ? 4 : 10); row++) {
        for (let col = 0; col < this.board.length; col++) {
          this.board.place(player, [player.getPiece(), row, col]);
        }
      }
    });
  }
  play() {
    let [i, j] = [0, 1],
      p = this.players;
    Exit: while (true) {
      if (this.board.canMoveSet(p[i])) {
        this.printGame(p[i].name, false);
        while (!this.board.move(p[i], p[j]));
      } else {
        this.printGame(p[j].colorStr(`${p[j].name} ${clc.blueBright(`has won the game by SUBMISSION`)}`), true);
        break Exit;
      }
      if (p[i].win) {
        this.printGame(p[i].colorStr(`${p[i].name} ${clc.blueBright(`has won the game by CAPTURE`)}`), true);
        break Exit;
      }
      [i, j] = [j, i];
    }
  }
  sim(stats) {
    let [i, j] = [0, 1],
      p = this.players;
    Exit: while (true) {
      if (this.board.canMoveSet(p[i])) {
        while (!this.board.move(p[i], p[j]));
      } else {
        if (p[j].color == stats.playerStats.p0.color) {
          stats.playerStats.p0.submissions++;
        } else {
          stats.playerStats.p1.submissions++;
        }
        break Exit;
      }
      if (p[i].win) {
        if (p[i].color == stats.playerStats.p0.color) {
          stats.playerStats.p0.captures++;
        } else {
          stats.playerStats.p1.captures++;
        }
        break Exit;
      }
      [i, j] = [j, i];
    }
  }
  printGame(playerName, win) {
    clear();
    console.log(`${playerName}@${this.moveNum}`);
    this.moveNum++;
    let redRank,
      blueRank,
      eq,
      stats = [],
      p = this.players;
    Score.pieces.forEach((e, i) => {
      blueRank = p[0].numPerRank[i];
      redRank = p[1].numPerRank[i];
      eq = blueRank == redRank ? '=' : blueRank > redRank ? '>' : '<';
      stats.push(
        `\t  ${e[1]} [ ${clc.cyanBright(blueRank)} ${eq} ${clc.redBright(
          redRank,
        )} ]`,
      );
    });
    this.board.printBoard(stats, win);
  }
}
module.exports = Game;