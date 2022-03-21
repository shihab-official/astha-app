import { FieldValue } from 'firebase-admin/firestore';
import moment from 'moment';

const db = require('./firebase-config');

module.exports = {
  initStorage: async (user) => {
    const docRef = await db.doc(`users/${user.id}`).get();
    if (docRef.exists) {
      const userInfo = docRef.data();
      const leaveOffsetResetDate = moment(userInfo.leave_offset_reset_date, 'DD-MMM-YYYY');

      if (moment().isSameOrAfter(leaveOffsetResetDate)) {
        userInfo.leave_offset = 0;
        userInfo.leaves_taken = 0;
        userInfo.leave_offset_reset_date = leaveOffsetResetDate.year(moment().year() + 1).format('DD-MMM-YYYY');
        
        await db.doc(`users/${user.id}`).set(userInfo, { merge: true });
      }

      return {
        newUser: false,
        user: userInfo,
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
      if (data.dob) {
        data.dob = data.dob.slice(0, -5);
      }
      return data;
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
    const currentYear = moment().year();
    let date = moment(user.joining_date, 'MMMM, YYYY').year(currentYear);
    if (date.isBefore(moment())) {
      date.year(currentYear + 1);
    }

    user.leave_offset_reset_date=date.format('DD-MMM-YYYY');

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
      if (Object.values(logData[key]).length > 0) {
        logs.push({
          date: moment(key, 'YYYYMMDD').format('DD-MMM-YYYY'),
          log: logData[key],
        });
      }
    });

    let userData = userInfo.data();
    userData = { ...userData, dob: userData.dob?.slice(0, -5) };

    return {
      user: userData,
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

      if (user.dob) {
        user.dob = user.dob?.slice(0, -5);
      }

      user.log = filteredLogs;
      return user;
    });

    return users;
  },

  setLog: async (logData) => {
    try {
      const leaveData = await db.doc(`logs/${logData.id}`).get();
      const data = {
        [logData.date]: {
          work: {
            content: logData.log,
          },
        },
      };

      if (leaveData.data()[logData.date]?.leave?.option === 2) {
        await db.doc(`logs/${logData.id}`).update(data);
      } else {
        await db.doc(`logs/${logData.id}`).set(data, { merge: true });
      }
      return 'Log entry successful.';
    } catch (error) {
      console.error(error);
      return error;
    }
  },

  leaveApplication: async (leaveData) => {
    const dates = leaveData.dates.filter((date) => {
      return !date.offDay;
    });
    let leaveCount = dates.length;

    leaveCount = leaveCount === 1 ? (leaveData.option < 2 ? 0.5 : 1) : leaveCount;
    
    const leaves = (await db.doc(`logs/${leaveData.id}`).get()).data();
    console.log(leaves);

    try {
      //let adjustment = 0;
      for (let date of dates) {
        const data = {
          [date.code]: {
            leave: {
              option: leaveData.option,
              reason: leaveData.reason,
            },
          },
        };
        const leave = leaves[date.code]?.leave;
        console.log(leave);
        if (leave) {
          leaveCount -= leave.option < 2 ? 0.5 : 1;
        }

        if (leaveData.option === 2) {
          await db.doc(`logs/${leaveData.id}`).update(data);
        } else {
          await db.doc(`logs/${leaveData.id}`).set(data, { merge: true });
        }
      }

      await db.doc(`users/${leaveData.id}`).update({
        leaves_taken: FieldValue.increment(leaveCount)
      });

      return leaveCount;
    } catch (error) {
      console.error(error);
      return error;
    }
  },

  cancelLeave: async (leave) => {
    try {
      await db.doc(`logs/${leave.userID}`).update({
        [leave.date]: leave.log
      });

      await db.doc(`users/${leave.userID}`).update({
        leaves_taken: FieldValue.increment(-leave.duration)
      });

      return 'Leave cancelled.';
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
    let leaveData = {},
      userInfo,
      day;

    leaveSnapshot.docs.forEach((user) => {
      userInfo = usersCollection.docs.find((u) => u.id == user.id).data();
      Object.entries(user.data()).forEach((log) => {
        if (+log[0] >= year.start && +log[0] <= year.end && log[1].leave) {
          day = moment(log[0]).format('DD-MMM-YYYY');
          if (!leaveData[day]) {
            leaveData[day] = [];
          }

          leaveData[day].push({
            type: 'leave',
            ...log[1].leave,
            id: userInfo.id,
            label: userInfo.short_name,
          });
        }
      });
    });
    return leaveData;
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
