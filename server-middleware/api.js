const app = require('./express');
const { initStorage } = require('./utilities/storage');
const { unicode, color } = require('./utilities/style-log');

app.post('/data-store', (req, res) => {
  initStorage(req.body);
  res.json(color.green(`${unicode.check}`) + ' Storage initialized.');
});

module.exports = app;
