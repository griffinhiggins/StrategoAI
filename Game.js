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
    require(`./components/RandomPlayer`),
    require(`./components/Data`)
];
class Game {
    constructor() {
        this.board = new Board();
        this.players = [new RandomPlayer(`RandomPlayer1`, false), new RandomPlayer(`RandomPlayer2`, true)];
        this.init();
        this.play();
    }
    init() {
        this.players.forEach((player) => {
            for (let row = ((player.color) ? 0 : 6); row < ((player.color) ? 4 : 10); row++) {
                for (let col = 0; col < this.board.length; col++) {
                    this.board.place(player, `${player.getRandomPiece()},${row},${col}`);
                }
            }
        });
    }
    play() {
        let i = 0,
            p = this.players,
            orig,
            dest,
            winner,
            str = clc.blueBright(`Capture`);
        exit:
            while (true) {
                do {
                    if (p[i].win) {
                        str = clc.blueBright(`Capture`);
                        break exit;
                    }
                    if (this.board.canMoveSet(p[i])) {
                        this.print(false);
                        console.log(p[i].name);
                        [orig, dest] = p[i].moveRandom();
                    } else {
                        str = clc.blueBright(`Submission`);
                        i = Math.abs(i - 1);
                        break exit;
                    }
                }
                while (!this.board.move(p[i], p[Math.abs(i - 1)], [orig, dest]));
                i = Math.abs(i - 1);
            }
        this.print(true);
        console.log(p[i].colorStr(`${p[i].name} has won the game by ${str}`));
    }
    print(win) {
        clear();
        let stats = [],
            p = this.players;
        Data.pieces.forEach((e, i) => {
            stats.push(`\t  ${e[1]} [${clc.redBright(p[1].numPerRank[i])} : ${clc.cyanBright(p[0].numPerRank[i])}]`);
        });
        this.board.print(stats, win);
    }
}
let game = new Game();