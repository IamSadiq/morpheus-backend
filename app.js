const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require('mongoose');

const indexRouter = require('./routes/index');
const loginAuth = require('./routes/auth/auth-login');
const UserRouter = require('./routes/users/user-ctrl');

var app = express();

mongoose.connect('mongodb://localhost/farmwit', { useMongoClient: true });
// mongoose.connect('mongodb://abubakr:flo007@ds131963.mlab.com:31963/flo', { useMongoClient: true });

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(cors()); // enable cross-origin resource sharing
app.use(logger('dev'));
app.use(express.json());

// create application/x-www-form-urlencoded parser
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/auth', loginAuth);
app.use('/users', UserRouter);

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


module.exports = app;
