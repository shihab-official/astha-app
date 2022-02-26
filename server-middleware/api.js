const app = require('./express');
const { initStorage, getLogsByDate, getUserLogs, setLog, leaveApplication, getDataStore } = require('./utilities/storage');

app.get('/storage', (req, res) => {
  res.send(getDataStore());
});

app.post('/api/init-storage', (req, res) => {
  res.json(initStorage(req.body));
});

app.get('/api/user-logs', (req, res) => {
  res.json(getLogsByDate(req.query.range));
});

app.get('/api/user-log', (req, res) => {
  res.json(getUserLogs(req.query.email));
});

app.post('/api/post-log', (req, res) => {
  res.json(setLog(req.body));
});

app.post('/api/leave-application', (req, res) => {
  res.json(leaveApplication(req.body));
});

module.exports = app;
