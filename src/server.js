require('dotenv').config();
const config = require('config');

const http = require('http');
const Koa = require('koa');

const app = new Koa();
const server = http.createServer(app.callback());

const Keygrip = require('keygrip');

global.__PROD__ = 'production';
global.__DEV__ = 'development';

app.proxy = false;
app.keys = new Keygrip([config.secretOrKey], 'sha256');

app.use(require('./middlewares/headers-setter'));
app.use(require('./middlewares/log'));
app.use(require('./middlewares/error'));
app.use(require('./middlewares/static'));
app.use(require('./middlewares/ratelimiter'));
app.use(require('./middlewares/cors'));
app.use(require('./middlewares/logger'));

require('./modules/auth')(app);
require('./modules/user')(app);

server.listen(config.port, () => {
  console.log('\x1b[36m', `Server running at: http://localhost:${config.port}/`);
  console.log('\x1b[36m', 'Mode:', '\x1b[33m', global.__DEV__);
});
