const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require('mongoose');
const cors = require('cors');

const indexRouter = require('./routes/index');
const loginAuth = require('./routes/auth/auth-login');
const UserRouter = require('./routes/users/user-ctrl');

const TaskRouter = require('./routes/tasks/task-ctrl');
const FieldRouter = require('./routes/fields/field-ctrl');
const ExpenseRouter = require('./routes/expenses/expense-ctrl');
const IncomeRouter = require('./routes/incomes/income-ctrl');

var app = express();

mongoose.connect('mongodb://localhost/farmwit', { useMongoClient: true, useNewUrlParser: true });
// mongoose.connect('mongodb://<dbuser>:<dbpassword>@ds030607.mlab.com:30607/farmwit', { useMongoClient: true, useNewUrlParser: true });

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

app.use('/tasks', TaskRouter);
app.use('/fields', FieldRouter);
app.use('/expenses', ExpenseRouter);
app.use('/incomes', IncomeRouter);

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
