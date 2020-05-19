const [
    clear,
    clc,
    Board,
    Player,
    Data
] = [
    require(`clear`),
    require(`cli-color`),
    require(`./components/Board`),
    require(`./components/Player`),
    require(`./components/Data`)
];
class Game {
    constructor() {
        this.board = new Board();
        this.players = [new Player(`player1`, false), new Player(`player2`, true)];
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
            orig, dest;
        while (!p[i].win) {
            do {

                this.print(p[i]);
                p[i].print(p[i].name);
                console.log(this.board.canMoveSet(p[i]));
                orig = p[i].getOrig();

                this.print(p[i]);
                p[i].print(p[i].name);
                dest = p[i].getDest();

            }
            while (!this.board.move(p[i], p[Math.abs(i - 1)], [orig, dest]));
            i = Math.abs(i - 1);
        }
        this.print();
        console.log(`\n${p[i].name} has won the game...\nWINNNER WINNER CHICKEN DINNER`);
    }
    print(player, orig) {
        clear();
        let stats = [],
            p = this.players;
        Data.pieces.forEach((e, i) => {
            stats.push(`\t  ${e[1]} [${clc.redBright(p[1].numPerRank[i])} : ${clc.cyanBright(p[0].numPerRank[i])}]`);
        });
        this.board.print(player, stats, orig);
    }
}
let game = new Game();





// init(player, color) {
// clear();
// player = new Player(null, color);
// while (player.inactive.length) {
//     clear();
//     this.board.print();
//     player.print();
//     this.board.place(player, prompt(`  Please enter rank & coordiantes: `));
// }
// this.board.print();
// }