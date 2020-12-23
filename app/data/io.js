const fs = require('fs');

module.exports = {
    read: (file) => JSON.parse(fs.readFileSync(file)),
    write: (file, data) => fs.writeFileSync(file, JSON.stringify(data, null, 2))
};