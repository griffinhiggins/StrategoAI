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
        // this.print(p[j].colorStr(`${p[j].name} ${clc.blueBright(`has won the game by SUBMISSION`)}`), true);
        if (p[j].color == stats.playerStats.p0.color) {
          stats.playerStats.p0.submissions++;
        } else {
          stats.playerStats.p1.submissions++;
        }
        break Exit;
      }
      if (p[i].win) {
        // this.print(p[i].colorStr(`${p[i].name} ${clc.blueBright(`has won the game by CAPTURE`)}`), true);
        if (p[i].color == stats.playerStats.p0.color) {
          stats.playerStats.p0.captures++;
        } else {
          stats.playerStats.p1.captures++;
        }
        break Exit;
      }
      [i, j] = [j, i];
    }
    // console.log(stats.playerStats.p0.captures, stats.playerStats.p0.submissions, stats.playerStats.p1.captures, stats.playerStats.p1.submissions);
    this.flagStats(stats);
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
  flagStats(stats) {
    if (this.players[0].win) {
      stats.flagStats.board[this.players[0].flag[0]][this.players[0].flag[1]]++;
      stats.flagStats.board[this.players[1].flag[0]][
        this.players[1].flag[1]
      ] -= 2;
    } else {
      stats.flagStats.board[this.players[1].flag[0]][this.players[1].flag[1]]++;
      stats.flagStats.board[this.players[0].flag[0]][
        this.players[0].flag[1]
      ] -= 2;
    }
    stats.flagStats.games++;
  }
}
module.exports = Game;








// test() {
//   // let p = this.players;
//   // TEST: orig rank = 3 || 4 && dest rank ==  1 --> PASS
//   // this.board.place(p[1], [p[1].getPieceByRank(8), 3, 6]);
//   // this.board.place(p[1], [p[1].getPieceByRank(7), 3, 8]);
//   // this.board.place(p[1], [p[1].getPieceByRank(2), 4, 1]);
//   // this.board.place(p[1], [p[1].getPieceByRank(8), 2, 1]);
//   // this.board.place(p[1], [p[1].getPieceByRank(3), 3, 0]);
//   // this.board.place(p[0], [p[0].getPieceByRank(5), 3, 1]);
//   // this.board.place(p[0], [p[0].getPieceByRank(7), 3, 7]);
//   // this.board.board[3][8].showRank = true;
//   // this.board.board[3][0].showRank = true;
//   // this.board.board[4][1].showRank = true;
//   // this.board.board[3][6].showRank = true;
//   // this.board.board[2][1].showRank = true;
//   //!TEST IF A SPY HITS A BOMB THAT IT changes the showRank to true
// }

// function setFlagScore() {
//   let file = './Score/flagPlacement.json',
//     Score = require(file);

//   stats.flagStats.board.forEach((r, i) => {
//     r.forEach((c, j) => {
//       Score.board[i][j] = c;
//     });
//   });

//   Score.games += stats.flagStats.games;
//   fs.writeFileSync(file, JSON.stringify(Score));
// }