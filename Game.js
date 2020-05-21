const [
    clear,
    clc,
    Board,
    RandomPlayer,
    Data
] = [
    require(`clear`),
    require(`cli-color`),
    require(`./components/Board`),
    require(`./players/RandomPlayer`),
    require(`./components/Data`)
];
class Game {
    constructor(players) {
        this.board = new Board();
        this.players = players;
        this.init();
        this.play();
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
    play() {
        let i = 0,
            p = this.players,
            str;
        Exit:
            while (true) {
                if (this.board.canMoveSet(p[i])) {
                    console.log(p[i].name);
                    this.print(false);
                    if (this.board.move(p[i], p[Math.abs(i - 1)], p[i].move())) {
                        console.log(p[i].name);
                        this.print(true);
                        str = clc.blueBright(`Capture`);
                        break Exit;
                    }
                } else {
                    i = Math.abs(i - 1);
                    console.log(p[i].name);
                    this.print(true);
                    str = clc.blueBright(`Submission`);
                    break Exit;
                }
                i = Math.abs(i - 1);
            }
        console.log(p[i].colorStr(`${p[i].name} has won the game by ${str}`));
    }
    print(win) {
        // clear();
        let stats = [],
            p = this.players;
        Data.pieces.forEach((e, i) => {
            stats.push(`\t  ${e[1]} [${clc.redBright(p[1].numPerRank[i])} : ${clc.cyanBright(p[0].numPerRank[i])}]`);
        });
        this.board.print(stats, win);
    }
}
let game = new Game([new RandomPlayer(`RandomPlayer1`, false), new RandomPlayer(`RandomPlayer2`, true)]);