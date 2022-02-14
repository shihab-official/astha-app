const app = require('./express');
const { initStorage, getUsers } = require('./utilities/storage');
const { unicode, color } = require('./utilities/style-log');

app.post('/api/data-store', (req, res) => {
  initStorage(req.body);
  res.json(color.green(`${unicode.check}`) + ' Storage initialized.');
});

app.get('/api/users', (req, res) => {
  console.log(getUsers());
  res.json(getUsers());
});

module.exports = app;
