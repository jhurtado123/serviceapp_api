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
const usersRouter = require('./routes/api/users');
const authRouter = require("./routes/api/auth");


mongoose
  .connect(process.env.MONGODB_URI, {useNewUrlParser: true})
  .then(x => {
    console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`)
  })
  .catch(err => {
    console.error('Error connecting to mongo', err)
  });

const app = express();
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
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

app.listen(process.env.PORT, ()=> {console.log('running in port 3000')});

module.exports = app;
