const app = require('./express');
const { unicode, color } = require('./utilities/style-log');
const { initStorage, getUsers, getLogsByDate, getUserLogs, setLog } = require('./utilities/storage');

app.post('/api/data-store', (req, res) => {
  initStorage(req.body);
  res.json(color.green(`${unicode.check}`) + ' Storage initialized.');
});

app.get('/api/users', (req, res) => {
  res.json(getUsers());
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

module.exports = app;
