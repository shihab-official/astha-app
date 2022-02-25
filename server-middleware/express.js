const app = require('express')();
const bodyParser = require('body-parser');
const { OAuth2Client } = require('google-auth-library');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const GOOGLE_CLIENT_ID = '404813405788-t9nfhnn1n8lqo8d438rk7je6fjsdajlu.apps.googleusercontent.com';

app.use('/api/*', async (req, res, next) => {
  const token = (req.header('authorization') || '').replace('Bearer ', '');
  const current_user_email = req.header('current-user-email');

  if (!token) {
    res.status(401);
    res.send('Unauthenticated request.');
    return;
  }
  const client = new OAuth2Client(GOOGLE_CLIENT_ID);

  try {
    const tokenInfo = await client.getTokenInfo(token);

    if (
      tokenInfo.aud !== GOOGLE_CLIENT_ID ||
      current_user_email !== tokenInfo.email
    ) {
      res.status(403);
      res.send('Unauthorized request.');
      return;
    }
    next();
  } catch (error) {
    res.status(error?.response?.status || 400);
    res.send(error?.response?.statusText || 'Invalid request.');
    console.error(error);
  }
});

module.exports = app;
