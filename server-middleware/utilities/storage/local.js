// import * as fs from 'fs';
const fs = require('fs');
const path = require('path');
const moment = require('moment');
const root = `${path.resolve('.')}/content`;
const { unicode, color } = require('../style-log');

module.exports = {
  initStorage: (user) => {
    try {
      if (!fs.existsSync(`${root}/${user.email}`)) {
        fs.mkdirSync(`${root}/${user.email}`, {
          recursive: true,
        });
      }
      if (!fs.existsSync(`${root}/${user.email}.json`)) {
        fs.writeFileSync(
          `${root}/${user.email}.json`,
          JSON.stringify(user)
        );
      }
      return color.green(`${unicode.check}`) + ' Storage initialized.';
    } catch (err) {
      console.log(err);
      return err;
    }
  },

  getUserLogs: (email) => {
    const dir = `${root}/${email}`;
    const userLogs = {
      user: getUser(email),
      logs: []
    };

    try {
      userLogs.logs = fs
        .readdirSync(dir, { withFileTypes: true })
        .filter((file) => file.isFile())
        // .sort((a, b) => b - a)
        .sort()
        .reverse()
        .map((file) => {
          return {
            date: moment(file.name, 'YYYYMMDD').format('DD-MMM-YYYY'),
            log: readUserLog(`${dir}/${file.name}`),
          };
        });
    } catch (err) {
      console.error(err);
    }

    return userLogs;
  },

  getLogsByDate: (dates) => {
    const users = getUsers();
    for (let user of users) {
      user.log = {};
      for (let date of dates) {
        user.log[date] = readUserLog(`${root}/${user.email}/${date}`);
      }
    }
    return users;
  },

  setLog: (logData) => {
    try {
      fs.writeFileSync(
        `${root}/${logData.email}/${logData.date}`,
        JSON.stringify(logData.log),
        { encoding: 'utf8' }
      );
    } catch (err) {
      console.error(err);
    }
  },

  leaveApplication: (leaveData) => {
    const dates = leaveData.dates.filter((date) => {
      return !date.weekend;
    });
    const count = dates.length;
    for (let date of dates) {
      try {
        fs.writeFileSync(
          `${root}/${leaveData.email}/${date.code}`,
          JSON.stringify({
            type: 'leave',
            option: leaveData.option,
            reason: leaveData.reason,
            count: count,
            start: dates[0].code,
            end: dates[count - 1].code,
          }),
          { encoding: 'utf8' }
        );
      } catch (err) {
        console.error(err);
      }
    }
  },

  getDataStore: () => {
    try {
      return fs
        .readdirSync(root, { withFileTypes: true })
        .map((file) => ({ name: file.name, type: file.isFile() ? 'FILE' : 'DIR' }));
    } catch (err) {
      console.error(err);
    }
  }
};

const getUser = (email) => {
  try {
    return JSON.parse(fs.readFileSync(`${root}/${email}.json`, {
      encoding: 'utf8',
      flag: 'r',
    }));
  } catch (error) {
    console.error(error);
    return {};
  }
};

const getUsers = () => {
  try {
    return fs
      .readdirSync(root, { withFileTypes: true })
      .filter((file) => file.isFile())
      .sort((a, b) => a - b)
      .map((file) => {
        try {
          return getUser(file.name.replace('.json', ''));
        } catch (error) {
          console.error(error);
          return {};
        }
      });
  } catch (err) {
    console.error(err);
  }
};

const readUserLog = (path) => {
  let log = {};
  if (fs.existsSync(path)) {
    try {
      log = JSON.parse(
        fs.readFileSync(path, {
          encoding: 'utf8',
          flag: 'r',
        })
      );
    } catch (err) {
      console.error(err);
    }
  }
  return log;
};
