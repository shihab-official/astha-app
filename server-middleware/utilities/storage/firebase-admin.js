import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import moment from 'moment';

initializeApp({
  credential: cert({
    type: 'service_account',
    project_id: 'app-directory-339611',
    private_key_id: 'f67aea1c027cf329ff50306c25dba8548a9c7e6f',
    private_key:
      '-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDKhf0sed/GVB14\n9iJQHKAQblNW/pfpIUCS1PKYjfk6SXn6tbBbZHXiyl83QSqwV/PUSH7GRmp/UDOK\nU4sosrVaEzSuQheaVFxptpnPQqJxPtb3BL5VxPep47iN98Rvhl/FSND6/2ZE4ZNm\nk/bdlknPrL8aXZYAb2hiHR2pA8GkMX6+1I7UeHzBnkhoWNfm2uYQxppLX3rqpTzE\nhUItinUdbmB+sWD/IBUEVNtw78f3H2u/4tl+2DXVbViOtwpwxyesGuQ86xFFQVav\nVNTZGs2gWSg6grY5Q8+bl/nKwPfpSiKO2WKgsGgc1j3WU2cBE3ybHyY1mUnLdVNm\nCiuSblY/AgMBAAECggEAE4x3cbGZ7hT0e1aW3VDGCo/7r2wH0dMJ3qJ7gEpEAmJR\nSef7y/aYgnmyUy0RJ9B1ksokopLteLiPIQ0LY7RMWRN9hEyQ5q659OJRWnY+I9xC\n97kXfkPy/A0lJV8DMRixaeOreG7quj9j8QTbUWxOV6N/FtZtwkD+vGm/ES9xo52P\nYpXDcAJT69G+6zoUGN7lDZtsZ7WY922vf24KWRckQSqctgtkagubPYCvkEfQo9xG\nsRzHI7uic4oXF5EtPBNQz34EMQ+8zNtHeWQl2VtMm34vLfkaOxqMTepa2dKTmxZo\nWnwg3S6evdtGovNWbc7Ds34dmGapFGrcpZpvGoU5kQKBgQD0h7GmPhBcKQX5rVf4\nE35RxPcJ417uk9hf0fd7DNWJFgS/qpsqm7dPaJ0uRBk5Zhyt2PKFyXnnb6Cv6ftN\n49orNlOYyPg0bD3D3SLCPKg84PfBXButefmyijhvRROCPi7IadWorMiLfIPLlIt+\n6EvQkCsKgqJdQCiD3L1rBpqGqwKBgQDUBeGC8PvB0HRC396qc1Tkud094wZEbTFt\nxwdu8WFCx5mgzUiypcaa/bvXi+HFDKTAwnVLWfXkPkfmAbe8/EVpxYw5cQmxMwLp\no1lbeTGoBmj7ip9bdI3hevfAGDHQFlikpn4L9/kvZ4EgVzrcUJPP4w9CNCC1OKq7\n7lhMHzK+vQKBgQCWy6NbEIUIQGgl66cHHgZVKLDrkSK238ecd6A1atm4OzLce7pK\nkVJ/DtV3dZlUk0r2ToZoyLF7bpRaR2GpS+z7nvn4i168/U8tnQ5VWBCr0lQXEtUi\nqsi4OJLK039PX0d8Yf/XkA3wLu4bulQ4A8rVKELSrXKxLOKPRq4s9RqQFwKBgBXx\nseB6jqQFrjLJtuMPYsb1kbd5CsoEPyxsgBF0fCuMOxNQi+ipjb+26T0q5igd4eNt\nfPRakD+aTpi4rsqplYmX/6ZmU6l6bR+/X10/UutgFneKZmnxy0l+D6xbFLTDy1Ln\nRH56oNjOLqgpPxdUY6gNiSPB/2yiO9GNnqfqRrdFAoGABqjpSDkbnowCHRINJjV/\nci+37Mg/zD+2+KicCvR7wLmL4Rh78KpNqalwqx1kRclQ2VlyyZwgGuoxFmdp7/mA\n6HpLSU/1mgEdISROiaiOEdYQz7TP/h2tWPHHNWNKb9J7mD41UyHwpP7dgFXlXen3\nIJRU/ikIRbNZjiimtu32wAQ=\n-----END PRIVATE KEY-----\n',
    client_email:
      'firebase-adminsdk-4imms@app-directory-339611.iam.gserviceaccount.com',
    client_id: '116473248004965698102',
    auth_uri: 'https://accounts.google.com/o/oauth2/auth',
    token_uri: 'https://oauth2.googleapis.com/token',
    auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
    client_x509_cert_url:
      'https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-4imms%40app-directory-339611.iam.gserviceaccount.com',
  }),
  databaseURL: 'https://app-directory-339611-default-rtdb.firebaseio.com',
});

const db = getFirestore();

module.exports = {
  initStorage: async (user) => {
    await db.doc(`logs/${user.email}`).set({});
    await db.doc(`users/${user.email}`).set(user);
  },

  getDataStore: () => {},

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
      logs: logs
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
    const result = await db.doc(`logs/${logData.email}`).set(logData.log);
    if (result._writeTime) {
      return 'Log entry successful.';
    }
  },

  leaveApplication: (leaveData) => {},
};
