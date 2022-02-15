const app = require('./express');
const { unicode, color } = require('./utilities/style-log');
const { initStorage, getUsers, getLog } = require('./utilities/storage');

app.post('/api/data-store', (req, res) => {
  initStorage(req.body);
  res.json(color.green(`${unicode.check}`) + ' Storage initialized.');
});

app.get('/api/users', (req, res) => {
  res.json(getUsers());
});

app.get('/api/log', (req, res) => {
  res.json(getLog(req.query.email));
});

module.exports = app;
