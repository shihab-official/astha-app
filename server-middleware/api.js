const app = require('./express');
const { initStorage, getLogsByDate, getUsers, getUser, setUser, getUserLogs, setLog, leaveApplication, getDataStore } = require('./storage/firebase/firebase-admin');

app.get('/storage', (req, res) => {
  res.send(getDataStore());
});

app.post('/api/init-storage', async (req, res) => {
  res.json(await initStorage(req.body));
});

app.get('/api/users', async (req, res) => {
  res.json(await getUsers());
});

app.get('/api/user', async (req, res) => {
  res.json(await getUser(req.query.email));
});

app.post('/api/user', async (req, res) => {
  res.json(await setUser(req.body));
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
