var createError = require('http-errors');
var express = require('express');
var cors = require('cors');
var path = require('path');
var dotenv = require("dotenv");
var connectDB = require("./connectDB.js");
var bodyParser = require("body-parser");
var fileUpload = require("express-fileupload");
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var app = express();
const http = require("http").createServer(app);
const io = require('socket.io')(http, {
  cors: {
    origin: '*',
  },
});







app.use(cors());
dotenv.config();

connectDB();
// app.use(corsOptions());
app.use(fileUpload());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({
  extended: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

const port = process.env.PORT;

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});



http.listen(port, () => {
  console.log(`Working on ${port}`);
});

module.exports = app;
