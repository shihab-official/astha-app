// import * as fs from 'fs';
const fs = require('fs');
const path = require('path');
const moment = require('moment');
const root = path.resolve(`${path.resolve('.')}/content`);

const initStorage = (user) => {
  try {
    if (!fs.existsSync(`${root}/${user.email}`)) {
      fs.mkdirSync(`${root}/${user.email}`, {
        recursive: true,
      });
    }
    if (!fs.existsSync(`${root}/${user.email}.json`)) {
      fs.writeFile(`${root}/${user.email}.json`, JSON.stringify(user), (err) => {
        console.error(err);
      });
    }
  } catch (err) {
    console.error(err);
  }
};

const getUsers = () => {
  try {
    return fs.readdirSync(root, { withFileTypes: true })
      .filter((file) => !file.isDirectory())
      .sort((a, b) => a - b)
      .map((file) => {
        try {
          return JSON.parse(fs.readFileSync(`${root}\\${file.name}`, {encoding:'utf8', flag:'r'}));
        } catch (error) {
          console.error(error);
          return {};
        }
      });
  } catch (err) {
    console.error(err);
  }
};

const getUser = (email) => {};

const getLog = (email) => {
  try {
    const dir = `${root}\\${email}`;
    return fs.readdirSync(dir, { withFileTypes: true })
      .filter((file) => !file.isDirectory())
      // .sort((a, b) => b - a)
      .sort().reverse()
      .map((file) => {
        try {
          return {
            date: moment(file.name, 'YYYYMMDD').format('DD-MMM-YYYY'),
            content: fs.readFileSync(`${dir}\\${file.name}`, {encoding:'utf8', flag:'r'})
          };
        } catch (error) {
          console.error(error);
          return {};
        }
      });
  } catch (err) {
    console.error(err);
  }
};

const setLog = (logData) => {
  try {
    fs.writeFileSync(`${root}\\${logData.email}\\${logData.date}`, logData.log, {encoding:'utf8', flag:'a+'});
  } catch (err) {
    console.error(err);
  }
};

module.exports = { initStorage, getUsers, getUser, getLog, setLog };
