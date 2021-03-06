var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongodb = require('mongodb');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

//몽고db 연결
function connectDB(){
  var databaseUrl = "mongodb://localhost:27017/testdb";

  //DB 연결

  mongodb.connect(databaseUrl, function(err, database){
    if(err) throw err;
    console.log('DB 연결 완료! : '+ databaseUrl);
    app.set('database', database.db('testdb'));  //보간
  });
}

connectDB();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
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

module.exports = app;
