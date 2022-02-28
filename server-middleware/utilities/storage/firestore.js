// Import the functions you need from the SDKs you need
const { initializeApp } = require("firebase/app");
import * as store from "firebase/firestore";
import {getFirestore, collection, addDoc } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Initialize Firebase with your web app's Firebase configuration
const firebaseApp = initializeApp({
  apiKey: "AIzaSyB-0uiZouNllKsPJaIJxGSq_8-RLKRCHM4",
  authDomain: "app-directory-339611.firebaseapp.com",
  databaseURL: "https://app-directory-339611-default-rtdb.firebaseio.com",
  projectId: "app-directory-339611",
  storageBucket: "app-directory-339611.appspot.com",
  messagingSenderId: "404813405788",
  appId: "1:404813405788:web:ee2c2303b3d70d2a415099"
});

const firestore = getFirestore(firebaseApp);

const usersCol = collection(firestore, 'test-users');

module.exports = {
  initStorage: (user) => {
    console.log('firestore');
    addDoc(usersCol, user)
  },

  getDataStore: () => {
  },

  getUserLogs: (email) => {
  },

  getLogsByDate: (dates) => {
  },

  setLog: (logData) => {
  },

  leaveApplication: (leaveData) => {
  }
};
