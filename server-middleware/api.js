const app = require('./express');
const firebase = require('./storage/firebase/firebase-admin');

app.post('/api/init-storage', async (req, res) => {
  res.json(await firebase.initStorage(req.body));
});

app.post('/api/create-user', async (req, res) => {
  res.json(await firebase.initStorage(req.body));
});

app.get('/api/users', async (req, res) => {
  res.json(await firebase.getUsers());
});

app.get('/api/user', async (req, res) => {
  res.json(await firebase.getUser(req.query.id));
});

app.post('/api/user', async (req, res) => {
  res.json(await firebase.setUser(req.body));
});

app.get('/api/user-logs', async (req, res) => {
  res.json(await firebase.getLogsByDate(req.query.range));
});

app.get('/api/user-log', async (req, res) => {
  res.json(await firebase.getUserLogs(req.query.id));
});

app.post('/api/post-log', async (req, res) => {
  res.json(await firebase.setLog(req.body));
});

app.post('/api/leave-application', async (req, res) => {
  res.json(await firebase.leaveApplication(req.body));
});

app.post('/api/cancel-leave', async (req, res) => {
  res.json(await firebase.cancelLeave(req.body));
});

app.get('/api/leave-info', async (req, res) => {
  res.json(await firebase.getLeaveInfo());
});

app.get('/api/holidays', async (req, res) => {
  res.json(await firebase.getHolidays());
});

app.post('/api/holidays', async (req, res) => {
  res.json(await firebase.setHolidays(req.body));
});

module.exports = app;
