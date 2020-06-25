class Piece {
  constructor(rank, name, color) {
    this.rank = rank;
    this.name = name;
    this.color = color;
    this.showRank = false;
    this.capturePiece = false;
    this.row = 0;
    this.col = 0;
  }
  getRank() {
    return this.showRank ? this.rank : null;
  }
  setPosition(row, col) {
    this.row = row;
    this.col = col;
  }
  getPosition() {
    return [this.row, this.col];
  }
}
module.exports = Piece;
