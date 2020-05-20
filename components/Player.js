const [
    Piece,
    Data,
    clc,
    prompt
] = [
    require(`./Piece`),
    require(`./Data`),
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
        this.win = false;
        this.moves = [];
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
    getPiece(rank) {
        for (let i = 0; i < this.inactive.length; i++) {
            if (this.inactive[i].rank == rank) {
                let temp = this.inactive[i];
                this.inactive.splice(i, 1);
                return temp;
            }
        }
        console.log(`RANK NOT FOUND`);
        return null
    }
    getRandomPiece() {
        return this.inactive[Math.floor(Math.random() * this.inactive.length)].rank;
    }
    getOrig() {
        return prompt(`Orig: `).split(`,`).map(Number);
    }
    getDest(orig) {
        let dest = prompt(`Dest: `),
            [row0, col0] = orig,
            row1, col1;
        switch (dest) {
            case `u`:
                row1 = row0 - 1;
                col1 = col0;
                break;
            case `d`:
                row1 = row0 + 1;
                col1 = col0;
                break;
            case `l`:
                row1 = row0;
                col1 = col0 - 1;
                break;
            case `r`:
                row1 = row0;
                col1 = col0 + 1;
                break;
            default:
                return dest.split(`,`).map(Number);
        }
        return [row1, col1]
    }
    kill(piece) {
        this.inactive.push(piece);
        this.numPerRank[piece.rank]--;
    }
    colorStr(str) {
        return (this.color) ? clc.redBright(str) : clc.cyanBright(str);
    }
}
module.exports = Player;