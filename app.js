const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const axios = require('axios');
const app = express();
const expressLayouts = require('express-ejs-layouts')
const session = require('express-session')


//set templating engine
app.use(expressLayouts);
app.set('layout', './layouts/layout')
app.set('view engine','ejs')

// router files
const indexRouter = require('./routes/index');
const apiRouter = require('./routes/api')
const loginRouter = require('./routes/login.js')
const signupRouter = require('./routes/signup.js')

const PORT = process.env.PORT || 3000;

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// session setup
app.use(session({
  cookie: {
    maxAge: 1000 * 60 * 60, // 1 hour
    // secure: false // must be true if served via HTTPS & false if served via HTTP
  },
  name: 'cookie',
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}))

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


// routers
app.use('/', indexRouter);
app.use('/api', apiRouter);
app.use('/login', loginRouter);
app.use('/signup', signupRouter);



axios.defaults.baseURL = 'https://api.themoviedb.org/3' 

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
  res.render('pages/error');
});

// app.listen(PORT, () => {
//   console.log(`App listening at ${PORT}`)
// })



module.exports = app;
