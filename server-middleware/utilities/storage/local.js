// import * as fs from 'fs';
const fs = require('fs');
const path = require('path');
const moment = require('moment');
const root = path.resolve(`${path.resolve('.')}/content`);

module.exports = {
  initStorage: (user) => {
    try {
      if (!fs.existsSync(`${root}/${user.email}`)) {
        fs.mkdirSync(`${root}/${user.email}`, {
          recursive: true,
        });
      }
      if (!fs.existsSync(`${root}/${user.email}.json`)) {
        fs.writeFile(
          `${root}/${user.email}.json`,
          JSON.stringify(user),
          (err) => {
            console.error(err);
          }
        );
      }
    } catch (err) {
      console.error(err);
    }
  },

  getUserLogs: (email) => {
    try {
      const dir = `${root}\\${email}`;
      return {
        user: getUser(email),
        logs: fs
          .readdirSync(dir, { withFileTypes: true })
          .filter((file) => !file.isDirectory())
          // .sort((a, b) => b - a)
          .sort()
          .reverse()
          .map((file) => {
            try {
              return {
                date: moment(file.name, 'YYYYMMDD').format('DD-MMM-YYYY'),
                log: readUserLog(`${dir}\\${file.name}`),
              };
            } catch (error) {
              console.error(error);
              return {};
            }
          }),
      };
    } catch (err) {
      console.error(err);
    }
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
        `${root}\\${logData.email}\\${logData.date}`,
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
          `${root}\\${leaveData.email}\\${date.code}`,
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
        .readdirSync(root, { withFileTypes: true });
    } catch (err) {
      console.error(err);
    }
  }
};

const getUser = (email) => {
  try {
    return JSON.parse(fs.readFileSync(`${root}\\${email}.json`, {
      encoding: 'utf8',
      flag: 'r',
    }));
  } catch (error) {
    console.error(error);
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
  let log = null;
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
