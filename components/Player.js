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
        this.name = (name == ``) ? prompt(`What is your name? `) : name;
        this.inactive = [];
        this.numPerRank = [];
        this.win = false;
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
        return prompt(`Orig: `);
    }
    getDest() {
        return prompt(`Dest: `)
    }
    kill(piece) {
        this.inactive.push(piece);
        this.numPerRank[piece.rank]--;
    }
    print(str) {
        console.log((this.color) ? clc.redBright(str) : clc.cyanBright(str));
    }
}
module.exports = Player;









// move() {

//     return [prompt(`Orig: `), prompt(`Dest: `)];
// }