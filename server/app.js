var createError = require('http-errors');
var express = require('express');
var path = require('path');
var escape = require('escape-html');
var app = express();

// view engine setup
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'ejs');

// setup logger
app.use(require('morgan')('dev'));

// parses incoming request cookies
app.use(require('cookie-parser')());

// ==============================================================================
// FOR THE WEB
// serving static files
app.use('/web', express.static(path.join(__dirname, 'web')));

// ==============================================================================
// FOR THE API
// parses incoming requests with JSON
// parses incoming requests with urlencoded
// then run the api things
app.use('/api', require('./api'));

// ==============================================================================

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
    // only providing error in development
    let error_page = '<!DOCTYPE html><html><head><title>' + escape(err.message) + '</title></head><body><h1>' + escape(err.message) + '</h1>' +
        ((req.app.get('env') === 'development') ? ('<h2>' + escape(err.status) + '</h2><pre>' + escape(err.stack) + '</pre>') : '') +
        '</body></html>';

    res.status(err.status || 500);
    res.send(error_page);
    res.end();
});

module.exports = app;