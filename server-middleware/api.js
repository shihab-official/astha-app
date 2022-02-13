const app = require('./express');
const { initStorage } = require('./utilities/storage');
const { unicode, color } = require('./utilities/style-log');

app.post('/data-store', (req, res) => {
  initStorage(`/content/work-update/${req.body.email}`);
  console.log(color.red(`${unicode.cross}`) + ' Storage initialized.');
  res.json(color.green(`${unicode.check}`) + ' Storage initialized.');
});

module.exports = app;
