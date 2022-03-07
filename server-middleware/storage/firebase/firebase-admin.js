import moment from 'moment';

const db = require('./firebase-config')

module.exports = {
  initStorage: async (user) => {
    const docRef = await db.doc(`users/${user.email}`).get();
    if (docRef.exists) {
      return docRef.data();
    } else {
      await db.doc(`logs/${user.email}`).set({}, { merge: true });
      await db.doc(`users/${user.email}`).set(user, { merge: true });
      return user;
    }
  },

  getDataStore: () => {},

  getUsers: async () => {
    const usersCollection = await db.collection('users').get();
    const users = usersCollection.docs.map(user => user.data());
    return users;
  },

  getUser: async (email) => {
    const userInfo = await db.doc(`users/${email}`).get();
    return userInfo.data();
  },

  setUser: async (user) => {
    try {
      await db.doc(`users/${user.email}`).set(user, { merge: true });
      return {
        type: 'success',
        message: 'Profile updated.'
      };
    } catch (error) {
      console.error(error);
      return error;
    }
  },

  getUserLogs: async (email) => {
    const userInfo = await db.doc(`users/${email}`).get();
    const userLogs = await db.doc(`logs/${email}`).get();
    const logData = userLogs.data();
    const keys = Object.keys(logData);
    keys.sort();
    keys.reverse();

    const logs = [];
    keys.forEach((key, i) => {
      logs.push({
        date: moment(key, 'YYYYMMDD').format('DD-MMM-YYYY'),
        log: logData[key],
      });
    });
    return {
      user: userInfo.data(),
      logs: logs,
    };
  },

  getLogsByDate: async (dates) => {
    const userSnapshot = await db.collection('users').get();
    const logSnapshot = await db.collection('logs').get();

    let users = userSnapshot.docs.map((user) => user.data());

    let emails = [];
    const userLogs = logSnapshot.docs.map((log) => {
      emails.push(log.id);
      const logs = log.data();
      return logs;
    });

    users = users.map((user) => {
      const logs = userLogs[emails.indexOf(user.email)];
      const keys = Object.keys(logs),
        values = Object.values(logs);
      const filteredLogs = {};
      for (let idx, i = 0, l = dates.length; i < l; i++) {
        idx = keys.indexOf(dates[i]);
        filteredLogs[dates[i]] = values[idx] || {};
      }

      user.log = filteredLogs;
      return user;
    });

    return users;
  },

  setLog: async (logData) => {
    try {
      await db.doc(`logs/${logData.email}`).set(
        {
          [logData.date]: {
            work: {
              content: logData.log,
            },
          },
        },
        { merge: true }
      );
      return 'Log entry successful.';
    } catch (error) {
      console.error(error);
      return error;
    }
  },

  leaveApplication: async (leaveData) => {
    const dates = leaveData.dates.filter((date) => {
      return !date.weekend;
    });

    try {
      for (let date of dates) {
        await db.doc(`logs/${leaveData.email}`).set(
          {
            [date.code]: {
              leave: {
                option: leaveData.option,
                reason: leaveData.reason,
              },
            },
          },
          { merge: true }
        );
      }

      return 'Leave applied.';
    } catch (error) {
      console.error(error);
      return error;
    }
  },
};
