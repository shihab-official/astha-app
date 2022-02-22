const { Nuxt, Builder } = require("nuxt");
const { PORT } = require("./constants");
const app = require("express")();
const port = process.env.PORT || PORT;

// We instantiate Nuxt with the options
const config = require("./nuxt.config.js");
const nuxt = new Nuxt(config);

app.use(nuxt.render);

// Build only in dev mode
if (config.dev) {
  new Builder(nuxt).build();
}

// Listen the server
app.listen(port, () => {
  console.info(`Server is listening on port: ${port}`);
});
