const [
    Piece,
    Data,
    clc,
    prompt
] = [
    require(`../components/Piece`),
    require(`../Data/Data`),
    require(`cli-color`),
    require(`prompt-sync`)({
        history: require(`prompt-sync-history`)(`moves.txt`, 10),
        sigint: true
    })
];
class Player {
    constructor(name, color) {
        this.color = color;
        this.name = this.colorStr((name == ``) ? prompt(`What is your name? `) : name);
        this.inactive = [];
        this.numPerRank = [];
        this.moves = [];
        this.win = false;
        this.flag = [];
        this.init();
    }
    init() {
        Data.pieces.forEach((e, i) => {
            let [num, name] = e;
            this.numPerRank.push(num);
            for (let j = 0; j < num; j++) {
                this.inactive.push(new Piece(i, name, this.color));
            }
        });
    }
    getPieceByRank(rank) {
        for (let i = 0; i < this.inactive.length; i++) {
            if (this.inactive[i].rank == rank) {
                let temp = this.inactive[i];
                this.inactive.splice(i, 1);
                return temp;
            }
        }
        return null
    }
    removePiece(piece) {
        this.inactive.push(piece);
        this.numPerRank[piece.rank]--;
    }
    colorStr(str) {
        return (this.color) ? clc.redBright(str) : clc.cyanBright(str);
    }
}
module.exports = Player;