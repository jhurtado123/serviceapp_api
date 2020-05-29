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
let hbs = require('hbs');
const extend = require('handlebars-extend-block');
const indexRouter = require('./routes/api/index');
const profileRouter = require('./routes/api/profile');
const authRouter = require("./routes/api/auth");
const adRouter = require('./routes/api/ad');
const searchRouter = require('./routes/api/search');
const categoryRouter = require('./routes/api/categories');
const chatRouter = require('./routes/api/chat');
const appointmentsRouter = require('./routes/api/appointment');
const settingsRouter = require('./routes/api/setting');
const favoritesRouter = require('./routes/api/favorites');
const autMiddleware = require('./middlewares/authMiddleware');
const appointmentMiddleware = require('./middlewares/appointmentMiddelware');
const adminRouter = require('./routes/admin/index');
const userAdminRouter = require('./routes/admin/users');
const adAdminRouter = require('./routes/admin/ads');
const categoriesAdminRouter = require('./routes/admin/categories');
const mediationsAdminRouter = require('./routes/admin/mediations');
const levelsAdminRouter = require('./routes/admin/levels');
const settingsAdminRouter = require('./routes/admin/settings');


hbs = extend(hbs);


mongoose
  .connect(process.env.MONGODB_URI, {useNewUrlParser: true})
  .then(x => {
    console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`)
  })
  .catch(err => {
    console.error('Error connecting to mongo', err)
  });

const app = module.exports = express();

app.use(
  cors({
    credentials: true,
    origin: [process.env.FRONTEND_DOMAIN],
  })
);


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

require('express-dynamic-helpers-patch')(app);

hbs.registerPartials(path.join(__dirname, '/views/partials'));


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(
  session({
    store: new MongoStore({
      mongooseConnection: mongoose.connection,
      ttl: 24 * 60 * 60,
    }),
    secret: "serkens",
    resave: false,
    saveUninitialized: true,
    name: 'serkens',
    cookie: {
      maxAge: 24 * 60 * 60 * 1000
    },
  })
);

app.use('/', authRouter);
app.use('/profile', appointmentMiddleware.changeAppointmentStatusIfFinished, profileRouter);
app.use('/categories', appointmentMiddleware.changeAppointmentStatusIfFinished, categoryRouter);
app.use('/search',appointmentMiddleware.changeAppointmentStatusIfFinished , searchRouter);
app.use('/favorites', appointmentMiddleware.changeAppointmentStatusIfFinished, favoritesRouter);

app.use('/appointments', appointmentMiddleware.changeAppointmentStatusIfFinished, appointmentsRouter);
app.use('/ad', appointmentMiddleware.changeAppointmentStatusIfFinished, adRouter);
app.use('/chats', appointmentMiddleware.changeAppointmentStatusIfFinished, chatRouter);
app.use('/settings', appointmentMiddleware.changeAppointmentStatusIfFinished, settingsRouter);


app.dynamicHelpers({
  currentUser: function (req, res) {
    return req.session.currentUser;
  },
});
app.use('/admin', autMiddleware.checkIsGrantedRoleAdmin, adminRouter);
app.use('/admin/users', autMiddleware.checkIsGrantedRoleAdmin, userAdminRouter);
app.use('/admin/ads', autMiddleware.checkIsGrantedRoleAdmin, adAdminRouter);
app.use('/admin/categories', autMiddleware.checkIsGrantedRoleAdmin, categoriesAdminRouter);
app.use('/admin/mediations', autMiddleware.checkIsGrantedRoleAdmin, mediationsAdminRouter);
app.use('/admin/levels', autMiddleware.checkIsGrantedRoleAdmin, levelsAdminRouter);
app.use('/admin/settings', autMiddleware.checkIsGrantedRoleAdmin, settingsAdminRouter);

require('./middlewares/appHbsHelpers')(hbs);


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
