const app = require('./express');
const { unicode, color } = require('./utilities/style-log');
const { initStorage, getLogsByDate, getUserLogs, setLog, leaveApplication, getDataStore } = require('./utilities/storage');

app.post('/data-store', (req, res) => {
  res.json(getDataStore());
});

app.post('/api/data-store', (req, res) => {
  initStorage(req.body);
  res.json(color.green(`${unicode.check}`) + ' Storage initialized.');
});

app.get('/api/logs', (req, res) => {
  res.json(getLogsByDate(req.query.range));
});

app.get('/api/log', (req, res) => {
  res.json(getUserLogs(req.query.email));
});

app.post('/api/log', (req, res) => {
  res.json(setLog(req.body));
});

app.post('/api/leave-application', (req, res) => {
  res.json(leaveApplication(req.body));
});

module.exports = app;
