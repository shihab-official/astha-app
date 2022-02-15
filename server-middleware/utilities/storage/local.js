// import * as fs from 'fs';
const fs = require('fs');
const path = require('path');
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
      .sort((a, b) => a - b)
      .map((file) => {
        try {
          return {
            date: file.name,
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
  console.log(logData);
  // try {
  //   const dir = `${root}\\${email}`;
  //   fs.writeFileSync(`${root}/${user.email}.json`, JSON.stringify(user));
  // } catch (err) {
  //   console.error(err);
  // }
};

module.exports = { initStorage, getUsers, getUser, getLog, setLog };
