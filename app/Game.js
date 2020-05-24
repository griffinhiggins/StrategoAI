const [
    clear,
    clc,
    Board,
    Data,
    HardLogicPlayer,
    RegularPlayer,
    RandomPlayer
] = [
    require(`clear`),
    require(`cli-color`),
    require(`./components/Board`),
    require(`./Data/Data`),
    require(`./players/HardLogicPlayer`),
    require(`./players/RegularPlayer`),
    require(`./players/RandomPlayer`)
],
blue = false, red = true,
    stats = {
        p0: {
            color: blue,
            name: null,
            captures: 0,
            submissions: 0

        },
        p1: {
            color: red,
            name: null,
            captures: 0,
            submissions: 0
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
            for (let row = ((player.color) ? 0 : 6); row < ((player.color) ? 4 : 10); row++) {
                for (let col = 0; col < this.board.length; col++) {
                    this.board.place(player, [player.getPiece(), row, col]);
                }
            }
        });
    }
    test() {
        let p = this.players;
        //?KEEP THESE 2's so the game doesnt end
        // this.board.place(p[1], [p[1].getPieceByRank(1), 0, 0]);
        // this.board.place(p[0], [p[0].getPieceByRank(1), 9, 9]);

        //*TEST: orig rank == dest rank --> PASS
        // this.board.place(p[1], [p[1].getPieceByRank(8), 3, 0]);
        // this.board.place(p[0], [p[0].getPieceByRank(8), 4, 0]);
        // this.board.place(p[1], [p[1].getPieceByRank(8), 3, 1]);
        // this.board.place(p[0], [p[0].getPieceByRank(8), 4, 1]);

        //*TEST: orig rank (< || >) dest rank --> PASS
        // this.board.place(p[1], [p[1].getPieceByRank(5), 3, 0]);
        // this.board.place(p[0], [p[0].getPieceByRank(8), 4, 0]);
        // this.board.place(p[1], [p[1].getPieceByRank(5), 3, 1]);
        // this.board.place(p[0], [p[0].getPieceByRank(8), 4, 1]);

        //*TEST: orig rank = 3 || 4 && dest rank ==  1 --> PASS
        this.board.place(p[1], [p[1].getPieceByRank(5), 3, 6]);
        this.board.place(p[1], [p[1].getPieceByRank(2), 4, 1]);
        this.board.place(p[1], [p[1].getPieceByRank(8), 2, 1]);
        this.board.place(p[0], [p[0].getPieceByRank(5), 3, 1]);
        this.board.place(p[0], [p[0].getPieceByRank(7), 3, 7]);
        // this.board.board[4][1].showRank = true;
        // this.board.board[3][6].showRank = true;

        //*TEST: orig rank = 11  dest rank ==  4 || 10 --> PASS
        // this.board.place(p[1], [p[1].getPieceByRank(11), 3, 0]);
        // this.board.place(p[0], [p[0].getPieceByRank(4), 4, 0]);
        // this.board.place(p[0], [p[0].getPieceByRank(10), 3, 1]);

        //!TEST IF A SPY HITS A BOMB THAT IT changes the showRank to true

    }
    play() {
        let [i, j] = [0, 1],
        p = this.players;
        Exit:
            while (true) {
                if (this.board.canMoveSet(p[i])) {
                    this.print(p[i].name, false);
                    while (!this.board.move(p[i], p[j]));
                } else {
                    this.print(p[j].colorStr(`${p[j].name} ${clc.blueBright(`has won the game by SUBMISSION`)}`), true);
                    break Exit;
                }
                if (p[i].win) {
                    this.print(p[i].colorStr(`${p[i].name} ${clc.blueBright(`has won the game by CAPTURE`)}`), true);
                    break Exit;
                }
                [i, j] = [j, i];
            }
    }
    sim() {
        let [i, j] = [0, 1],
        p = this.players;
        Exit:
            while (true) {
                if (this.board.canMoveSet(p[i])) {
                    while (!this.board.move(p[i], p[j]));
                } else {
                    (p[j].color == stats.p0.color) ? stats.p0.captures++: stats.p1.captures++;
                    break Exit;
                }
                if (p[i].win) {
                    (p[i].color == stats.p0.color) ? stats.p0.submissions++: stats.p1.submissions++;
                    break Exit;
                }
                [i, j] = [j, i];
            }
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
            eq = (blueRank == redRank) ? "=" : (blueRank > redRank) ? ">" : "<";
            stats.push(`\t  ${e[1]} [ ${clc.cyanBright(blueRank)} ${eq} ${clc.redBright(redRank)} ]`)
        });
        this.board.print(stats, win);
    }
}

function performace(numSim) {
    let game,
        i = 0;
    console.log(`RUNNING...`);


    while (i < numSim) {
        if (i % 10 == 0) {
            console.log(i);
        }
        stats.p0.name = 'RandomPlayer';
        stats.p1.name = 'HardLogicPlayer';
        game = new Game([
            new RandomPlayer(stats.p0.name, stats.p0.color),
            new HardLogicPlayer(stats.p1.name, stats.p1.color)
        ], true);
        i++;
    }

    stats.p0.total = stats.p0.captures + stats.p0.submissions;
    stats.p1.total = stats.p1.captures + stats.p1.submissions;


    // stats.total.captures = stats.p0.captures + stats.p1.captures;
    // stats.total.submissions = stats.p0.submissions + stats.p1.submissions;
    // stats.total.total = stats.total.captures + stats.total.submissions;

    // stats.total.captureRatio = Math.floor((stats.total.captures / stats.total.total) * 100);
    // stats.total.submissionRatio = Math.floor((stats.total.submissions / stats.total.total) * 100);

    // stats.p0.captureRatio = Math.floor((stats.p0.captures / stats.total.total) * 100);
    // stats.p1.captureRatio = Math.floor((stats.p1.captures / stats.total.total) * 100);

    // stats.p0.submissionRatio = Math.floor((stats.p0.submissions / stats.total.total) * 100);
    // stats.p1.submissionRatio = Math.floor((stats.p1.submissions / stats.total.total) * 100);

    console.table(stats);
    // console.log(stats);
}

function play(players) {
    game = new Game(players, false);
}

function main() {
    performace(100);
    // play([
    //     new HardLogicPlayer(`HardLogicPlayer1`, false),
    //     new HardLogicPlayer(`HardLogicPlayer2`, true)
    // ]);
    // play([new HardLogicPlayer(`HardLogicPlayer1`, false),
    //     new RegularPlayer(`RegularPlayer2`, true)
    // ]);
    // play([new HardLogicPlayer(`HardLogicPlayer`, false),
    //     new RandomPlayer(`RandomPlayer`, true)
    // ]);
}

main();

// performace @ 1000 games
// ┌─────────┬───────┬───────────────────┬──────────────┬─────────────────┬───────┬──────────┬─────────────┐
// │ (index) │ color │       name        │ captureRatio │ submissionRatio │ total │ captures │ submissions │
// ├─────────┼───────┼───────────────────┼──────────────┼─────────────────┼───────┼──────────┼─────────────┤
// │   p0    │ false │  'RandomPlayer'   │      0       │       42        │  427  │    3     │     424     │
// │   p1    │ true  │ 'HardLogicPlayer' │      57      │        0        │  573  │   573    │      0      │
// │  total  │ null  │      'Total'      │      57      │       42        │ 1000  │   576    │     424     │
// └─────────┴───────┴───────────────────┴──────────────┴─────────────────┴───────┴──────────┴─────────────┘