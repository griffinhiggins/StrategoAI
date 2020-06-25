const [
  clear,
  clc,
  fs,
  Board,
  Data,
  HardLogicPlayer,
  RegularPlayer,
  RandomPlayer,
] = [
  require(`clear`),
  require(`cli-color`),
  require('fs'),
  require(`./components/Board`),
  require(`./Data/Data`),
  require(`./players/HardLogicPlayer`),
  require(`./players/RegularPlayer`),
  require(`./players/RandomPlayer`),
];
let blue = false,
  red = true,
  stats = {
    playerStats: {
      p0: {
        color: blue,
        name: null,
        captures: 0,
        submissions: 0,
      },
      p1: {
        color: red,
        name: null,
        captures: 0,
        submissions: 0,
      },
    },
    flagStats: {
      games: 0,
      board: [
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      ],
    },
  };

class Game {
  constructor(players, sim) {
    this.board = new Board();
    this.players = players;
    this.init();
    sim ? this.sim() : this.play();
  }
  init() {
    this.players.forEach((player) => {
      for (
        let row = player.color ? 0 : 6;
        row < (player.color ? 4 : 10);
        row++
      ) {
        for (let col = 0; col < this.board.length; col++) {
          this.board.place(player, [player.getPiece(), row, col]);
        }
      }
    });
  }
  test() {
    let p = this.players;

    //*TEST: orig rank = 3 || 4 && dest rank ==  1 --> PASS
    this.board.place(p[1], [p[1].getPieceByRank(8), 3, 6]);
    this.board.place(p[1], [p[1].getPieceByRank(7), 3, 8]);
    this.board.place(p[1], [p[1].getPieceByRank(2), 4, 1]);
    this.board.place(p[1], [p[1].getPieceByRank(8), 2, 1]);
    this.board.place(p[1], [p[1].getPieceByRank(3), 3, 0]);
    this.board.place(p[0], [p[0].getPieceByRank(5), 3, 1]);
    this.board.place(p[0], [p[0].getPieceByRank(7), 3, 7]);
    this.board.board[3][8].showRank = true;
    this.board.board[3][0].showRank = true;
    this.board.board[4][1].showRank = true;
    this.board.board[3][6].showRank = true;
    this.board.board[2][1].showRank = true;

    //!TEST IF A SPY HITS A BOMB THAT IT changes the showRank to true
  }
  play() {
    let [i, j] = [0, 1],
      p = this.players;
    Exit: while (true) {
      if (this.board.canMoveSet(p[i])) {
        this.print(p[i].name, false);
        while (!this.board.move(p[i], p[j]));
      } else {
        this.print(
          p[j].colorStr(
            `${p[j].name} ${clc.blueBright(`has won the game by SUBMISSION`)}`,
          ),
          true,
        );
        break Exit;
      }
      if (p[i].win) {
        this.print(
          p[i].colorStr(
            `${p[i].name} ${clc.blueBright(`has won the game by CAPTURE`)}`,
          ),
          true,
        );
        break Exit;
      }
      [i, j] = [j, i];
    }
  }
  sim() {
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
    this.flagStats();
  }
  print(playerName, win) {
    clear();
    console.log(playerName);
    let redRank,
      blueRank,
      eq,
      stats = [],
      p = this.players;
    Data.pieces.forEach((e, i) => {
      blueRank = p[0].numPerRank[i];
      redRank = p[1].numPerRank[i];
      eq = blueRank == redRank ? '=' : blueRank > redRank ? '>' : '<';
      stats.push(
        `\t  ${e[1]} [ ${clc.cyanBright(blueRank)} ${eq} ${clc.redBright(
          redRank,
        )} ]`,
      );
    });
    this.board.print(stats, win);
  }
  flagStats() {
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

function setFlagData() {
  let file = './Data/flagPlacement.json',
    data = require(file);

  stats.flagStats.board.forEach((r, i) => {
    r.forEach((c, j) => {
      data.board[i][j] = c;
    });
  });

  data.games += stats.flagStats.games;
  fs.writeFileSync(file, JSON.stringify(data));
}

function performace(numSim) {
  let game,
    i = 0;

  console.log(`RUNNING...`);
  while (i < numSim) {
    if (i % 100 == 0) {
      console.log(i);
    }
    stats.playerStats.p0.name = 'RandomPlayer';
    stats.playerStats.p1.name = 'HardLogicPlayer';
    game = new Game(
      [
        new RandomPlayer(stats.playerStats.p0.name, stats.playerStats.p0.color),
        new HardLogicPlayer(
          stats.playerStats.p1.name,
          stats.playerStats.p1.color,
        ),
      ],
      true,
    );
    i++;
  }
  stats.playerStats.p0.total =
    stats.playerStats.p0.captures + stats.playerStats.p0.submissions;
  stats.playerStats.p1.total =
    stats.playerStats.p1.captures + stats.playerStats.p1.submissions;

  console.table(stats.playerStats);
  setFlagData();
}

function play(players) {
  game = new Game(players, false);
}

function main() {
  // performace(600);
  // play([new RegularPlayer(`Griffin`, false), new HardLogicPlayer(`HardLogicPlayer`, true)]);
  play([
    new HardLogicPlayer(`HardLogicPlayer`, false),
    new RandomPlayer(`RandomPlayer`, true),
  ]);
}

main();
