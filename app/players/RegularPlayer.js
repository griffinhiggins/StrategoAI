const [Player, prompt] = [require(`./Player`), require(`prompt-sync`)({
    history: require(`prompt-sync-history`)(`moves.txt`, 10),
    sigint: true
})];

class RegularPlayer extends Player {
    constructor(name, color) {
        super(name, color);
    }
    move() {
        let orig = this.getOrig(),
            dest = this.getDest(orig);
        return [orig, dest];
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
    getPiece() {
        let i = Math.floor(Math.random() * this.inactive.length),
            temp = this.inactive[i];
        this.inactive.splice(i, 1);
        return temp;
    }
}
module.exports = RegularPlayer;