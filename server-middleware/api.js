const app = require('./express');
const { initStorage, getLogsByDate, getUserLogs, setLog, leaveApplication, getDataStore } = require('./utilities/storage');

app.get('/storage', (req, res) => {
  res.send(getDataStore());
});

app.post('/api/init-storage', (req, res) => {
  res.json(initStorage(req.body));
});

app.get('/api/logs', (req, res) => {
  res.json(getLogsByDate(req.query.range));
});

app.get('/api/log', (req, res) => {
  console.log(req.params, req.query);
  res.json(getUserLogs(req.query.email));
});

app.post('/api/log', (req, res) => {
  res.json(setLog(req.body));
});

app.post('/api/leave-application', (req, res) => {
  res.json(leaveApplication(req.body));
});

module.exports = app;
