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
    require(`./components/Data`),
    require(`./players/HardLogicPlayer`),
    require(`./players/RegularPlayer`),
    require(`./players/RandomPlayer`)
];
class Game {
    constructor(players) {
        this.board = new Board();
        this.players = players;
        this.init();
        this.run();
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
        this.board.place(p[1], [p[1].getPieceByRank(2), 0, 0]);
        this.board.place(p[0], [p[0].getPieceByRank(2), 9, 9]);

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
        // this.board.place(p[1], [p[1].getPieceByRank(1), 3, 0]);
        // this.board.place(p[0], [p[0].getPieceByRank(3), 4, 0]);
        // this.board.place(p[0], [p[0].getPieceByRank(4), 3, 1]);

        //*TEST: orig rank = 11  dest rank ==  4 || 10 --> PASS
        // this.board.place(p[1], [p[1].getPieceByRank(11), 3, 0]);
        // this.board.place(p[0], [p[0].getPieceByRank(4), 4, 0]);
        // this.board.place(p[0], [p[0].getPieceByRank(10), 3, 1]);


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
    run() {
        let [i, j] = [0, 1],
        p = this.players;
        Exit:
            while (true) {
                if (this.board.canMoveSet(p[i])) {
                    while (!this.board.move(p[i], p[j]));
                } else {
                    (p[j].name == p[0].name) ? stats.HLP.captures++: stats.RP.captures++;
                    break Exit;
                }
                if (p[i].win) {
                    (p[i].name == p[0].name) ? stats.HLP.submissions++: stats.RP.submissions++;
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

// console.time("TIME");
// let game = new Game([new RegularPlayer(`Player1`, blue), new RegularPlayer(`Player2`, red)]);
// let game = new Game([new RegularPlayer(`RegularPlayer`, blue), new RandomPlayer(`HardLogicPlayer `, red)]);
// let game = new Game([new RandomPlayer(`RandomPlayer`, blue), new RandomPlayer(`RandomPlayer`, red)]);
// let game = new Game([new HardLogicPlayer(`HardLogicPlayer`, blue), new HardLogicPlayer(`HardLogicPlayer `, red)]);

let [blue, red] = [false, true],
stats = {
        HLP: {
            captures: 0,
            submissions: 0,
            total: 0
        },
        RP: {
            captures: 0,
            submissions: 0,
            total: 0
        },
        total: {
            captures: 0,
            submissions: 0,
            total: 0
        }
    },
    i = 0,
    game
while (i < 1000) {
    console.log(i);
    game = new Game([new HardLogicPlayer(`HardLogicPlayer`, blue), new RandomPlayer(`RandomPlayer`, red)]);
    i++;
}
stats.HLP.total = stats.HLP.captures + stats.HLP.submissions;
stats.RP.total = stats.RP.captures + stats.RP.submissions;
stats.total.captures = (stats.HLP.captures >= stats.RP.captures) ? stats.RP.captures / stats.HLP.captures : stats.HLP.captures / stats.RP.captures;
stats.total.submissions = (stats.HLP.submissions >= stats.RP.submissions) ? stats.RP.submissions / stats.HLP.submissions : stats.HLP.submissions / stats.RP.submissions;
stats.total.total = (stats.HLP.total >= stats.RP.total) ? stats.RP.total / stats.HLP.total : stats.HLP.total / stats.RP.total;
console.log(stats);