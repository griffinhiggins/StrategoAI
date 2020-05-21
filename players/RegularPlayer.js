const Player = require(`./Player`);

class RegularPlayer extends Player {
    constructor(name, color) {
        super(name, color);
    }
    move() {
        let orig = this.getOrig(),
            dest = getDest(orig);
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
    getPiece(rank) {
        for (let i = 0; i < this.inactive.length; i++) {
            if (this.inactive[i].rank == rank) {
                let temp = this.inactive[i];
                this.inactive.splice(i, 1);
                return temp;
            }
        }
        return null
    }
}
module.exports = RegularPlayer;