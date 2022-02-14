// import * as fs from 'fs';
const fs = require('fs');
const path = require('path');

const initStorage = (dir, user) => {
  try {
    const fullPath = path.resolve(`${path.resolve('.')}/${dir}/${user.email}`);
    if (!fs.existsSync(fullPath)) {
      fs.mkdirSync(fullPath, {
        recursive: true,
      });
    }
    if (!fs.existsSync(`${fullPath}/user.json`)) {
      fs.writeFile(`${fullPath}/user.json`, JSON.stringify(user), (err) => {
        console.error(err);
      });
    }
  } catch (err) {
    console.error(err);
  }
};
module.exports = { initStorage };
