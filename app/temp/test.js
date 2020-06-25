// const
//     fs = require('fs'),
//     file = './Data/flagPlacement.json';

// fs.writeFileSync(file, JSON.stringify({
//     games: 0,
//     board: [
//         [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
//         [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
//         [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
//         [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
//         [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
//         [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
//         [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
//         [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
//         [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
//         [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
//     ]
// }));

// let raw = require(file);
// let data = JSON.parse(raw);
// data[0][0]++;

// console.log(data.games);
// fs.writeFileSync(file, data);
// data = require(file);
// console.log(data);




let a = [1, 2, 3, 4, 5, 6];


a.forEach(e => {
    if (e == 4) {
        break EXIT:
    }
    console.log(e);
})
// a.sort((i, j) => j - i);
// console.log(a);