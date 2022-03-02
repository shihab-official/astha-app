const app = require('./express');
const { initStorage, getLogsByDate, getUserLogs, setLog, leaveApplication, getDataStore } = require('./utilities/storage');

app.get('/storage', (req, res) => {
  res.send(getDataStore());
});

app.post('/api/init-storage', (req, res) => {
  res.json(initStorage(req.body));
});

app.get('/api/user-logs', async (req, res) => {
  res.json(await getLogsByDate(req.query.range));
});

app.get('/api/user-log', async (req, res) => {
  res.json(await getUserLogs(req.query.email));
});

app.post('/api/post-log', async (req, res) => {
  res.json(await setLog(req.body));
});

app.post('/api/leave-application', async (req, res) => {
  res.json(await leaveApplication(req.body));
});

module.exports = app;
