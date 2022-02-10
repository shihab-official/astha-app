const app = require("./express");

app.post('/create-directory', (req, res) => {
  res.json(req.body);
});

module.exports = app;