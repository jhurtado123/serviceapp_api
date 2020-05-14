require('dotenv').config();
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const session = require("express-session");
const MongoStore = require("connect-mongo")(session);
const logger = require('morgan');
const mongoose = require('mongoose');
const cors = require('cors');
const indexRouter = require('./routes/api/index');
const profileRouter = require('./routes/api/profile');
const authRouter = require("./routes/api/auth");
const adRouter = require('./routes/api/ad');
const searchRouter = require('./routes/api/search');
const categoryRouter = require('./routes/api/categories');
const chatRouter = require('./routes/api/chat');
const autMiddleware = require('./middlewares/authMiddleware');

mongoose
  .connect(process.env.MONGODB_URI, {useNewUrlParser: true})
  .then(x => {
    console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`)
  })
  .catch(err => {
    console.error('Error connecting to mongo', err)
  });

const app = module.exports = express();
app.io = require('socket.io')();

app.use(
  cors({
    credentials: true,
    origin: [process.env.FRONTEND_DOMAIN],
  })
);


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(
  session({
    store: new MongoStore({
      mongooseConnection: mongoose.connection,
      ttl: 24 * 60 * 60, // 1 day
    }),
    secret: "serkens",
    resave: true,
    saveUninitialized: false,
    name: 'serkens',
    cookie: {
      maxAge: 24 * 60 * 60 * 1000
    },
  })
);
app.use('/', authRouter);
app.use('/profile', profileRouter);
app.use('/categories', categoryRouter);
app.use('/search', searchRouter);

app.use('/ad', adRouter);
app.use('/chats', chatRouter);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use((err, req, res, next) => {
  // always log the error
  console.error('ERROR', req.method, req.path, err);

  // only render if the error ocurred before sending the response
  if (!res.headersSent) {
    res.status(500).json({ code: 'unexpected', error: err });
  }
});

module.exports = app;
