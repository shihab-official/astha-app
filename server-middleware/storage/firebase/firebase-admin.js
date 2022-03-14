import moment from 'moment';

const db = require('./firebase-config');

module.exports = {
  initStorage: async (user) => {
    const docRef = await db.doc(`users/${user.id}`).get();
    if (docRef.exists) {
      return {
        newUser: false,
        user: docRef.data(),
      };
    } else {
      await db.doc(`logs/${user.id}`).set({}, { merge: true });
      await db.doc(`users/${user.id}`).set(user, { merge: true });
      return {
        newUser: true,
        user,
      };
    }
  },

  getUsers: async () => {
    const usersCollection = await db.collection(`users`).get();
    const users = usersCollection.docs.map((user) => {
      const data = user.data();
      return { ...data, dob: data.dob?.slice(0, -5) };
    });

    return users;
  },

  getUser: async (id) => {
    const adminUsers = await db
      .collection('users')
      .where('admin', '==', true)
      .get();
    const userInfo = await db.doc(`users/${id}`).get();
    return { user: userInfo.data(), adminCount: adminUsers.size };
  },

  setUser: async (user) => {
    try {
      await db.doc(`users/${user.id}`).set(user, { merge: true });
      return {
        type: 'success',
        message: 'Profile updated.',
      };
    } catch (error) {
      console.error(error);
      return error;
    }
  },

  getUserLogs: async (id) => {
    const userInfo = await db.doc(`users/${id}`).get();
    const userLogs = await db.doc(`logs/${id}`).get();
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
    const userSnapshot = await db.collection(`users`).get();
    const logSnapshot = await db.collection(`logs`).get();

    let users = userSnapshot.docs.map((user) => user.data());

    let userIDs = [];
    const userLogs = logSnapshot.docs.map((log) => {
      userIDs.push(log.id);
      const logs = log.data();
      return logs;
    });

    users = users.map((user) => {
      const logs = userLogs[userIDs.indexOf(user.id)];
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
      const leaveData = await db.doc(`logs/${logData.id}`).get();

      await db.doc(`logs/${logData.id}`).set(
        {
          [logData.date]: {
            work: {
              content: logData.log,
            },
          },
        },
        { merge: leaveData.data()[logData.date]?.leave?.option !== 2 }
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
        await db.doc(`logs/${leaveData.id}`).set(
          {
            [date.code]: {
              leave: {
                option: leaveData.option,
                reason: leaveData.reason,
              },
            },
          },
          { merge: leaveData.option !== 2 }
        );
      }

      return 'Leave applied.';
    } catch (error) {
      console.error(error);
      return error;
    }
  },

  getLeaveInfo: async () => {
    const usersCollection = await db.collection(`users`).get();
    const leaveSnapshot = await db.collection(`logs`).get();

    const year = {
      start: moment().startOf('year').format('YYYYMMDD'),
      end: moment().endOf('year').format('YYYYMMDD'),
    };
    let filteredLogs = [];

    leaveSnapshot.docs.forEach((user) => {
      const dates = [],
        info = [],
        userInfo = usersCollection.docs.find((u) => u.id == user.id).data();

      Object.entries(user.data()).forEach((log) => {
        if (+log[0] >= year.start && +log[0] <= year.end && log[1].leave) {
          dates.push(+log[0]);
          info.push({
            ...log[1].leave,
            id: userInfo.id,
            name: userInfo.short_name,
          });
        }
      });

      filteredLogs.push([dates, info]);
    });
    return filteredLogs.filter((log) => log[1].length > 0);
  },

  getHolidays: async () => {
    const holidaySnapshot = (await db.doc(`calendar/holidays`).get()).data();

    const holidays = Object.entries(holidaySnapshot).sort(
      (a, b) => a[0] - b[0]
    );

    return holidays.map((h) => ({ ...h[1], id: h[0] }));
  },

  setHolidays: async (holidayArr) => {
    const holidays = {};
    holidayArr.forEach((holiday) => {
      const id = holiday.id;
      delete holiday.id;
      holidays[id] = holiday;
    });

    try {
      await db.doc(`calendar/holidays`).set(holidays);
      return 'Holiday list updated.';
    } catch (error) {
      console.error(error);
      return error;
    }
  },
};
