var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
/* import flash */
const flash = require("connect-flash");
/* import session */
const session = require("express-session");

const mongoose = require('mongoose');
const methodOverride = require('method-override');
// mongoose.connect('mongodb://127.0.0.1:27017/db_mahasiswa', {
//   // untuk pengertian fungsi dibawah ini di dokumentasi resminya sangat dijelaskan, jangan lupa dibaca.
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
//   // useCreateIndex: true,
//   // useFindAndModify: false,
// })
// .then(()=>console.log('MongoDB connected')).catch(err=>console.log(err));

const db = require('./configs/mongodb').mongoURI;
mongoose.connect(db, 
{ 
    useNewUrlParser: true,
    useUnifiedTopology: true
    // useCreateIndex: true
    // useFindAndModify: false
})
.then(()=>console.log('MongoDB connected')).catch(err=>console.log(err));

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const mahasiswaRouter = require('./routes/mahasiswa');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
// menggunakan method-override
app.use(methodOverride("_method"));
// menggunakan session
app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 6000 }
  })
);
/* menggunakan flash */
app.use(flash());

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/mahasiswa', mahasiswaRouter);

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
