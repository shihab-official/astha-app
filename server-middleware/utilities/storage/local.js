// import * as fs from 'fs';
const fs = require('fs');
const path = require('path');

const initStorage = (user) => {
  try {
    const fullPath = path.resolve(`${path.resolve('.')}/content/${user.email}`);
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

// const getUser

module.exports = { initStorage };
