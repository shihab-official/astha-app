// import * as fs from 'fs';
const fs = require('fs');
const path = require('path');

const initStorage = (dir) => {
  try {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(path.resolve(`${path.resolve('.')}/${dir}`), {
        recursive: true,
      });
    }
  } catch (err) {
    console.error(err);
  }
};
module.exports = { initStorage };
