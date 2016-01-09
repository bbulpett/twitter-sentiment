var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var twitter = require('ntwitter');

var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();
var port = 3000;

// The "hello" route
app.get('/hello', function(req, res) {
  res.send("Hello world");
});

app.listen(port);
console.log("Server listening on port " + port);

// The "testSentiment" route
app.get('/testSentiment',
  function (req,res) {
    var response = "<HEAD>" +
      "<title>Twitter Sentiment Analysis</title>\n" +
          "</HEAD>\n" +
          "<BODY>\n" +
          "<P>\n" +
          "Welcome to the Twitter Sentiment Analysis app.  " +   
          "What phrase would you like to analzye?\n" +                
          "</P>\n" +
          "<FORM action=\"/testSentiment\" method=\"get\">\n" +
          "<P>\n" +
          "Enter a phrase to evaluate: <INPUT type=\"text\" name=\"phrase\"><BR>\n" +
          "<INPUT type=\"submit\" value=\"Send\">\n" +
          "</P>\n" +
          "</FORM>\n" +
          "</BODY>";
    var phrase = req.query.phrase;
    if(!phrase) {
      res.send(response);
    } else {
      sentiment(phrase, function (err, result) {
        response = 'sentiment(' + phrase + ') === ' + result.score;
        res.send(response);
      });
    }
  });

// Connect to Twitter
var tweeter = new twitter({
  consumer_key: 'foZdopLnng9OfAKFMmEdVDRcE',
  consumer_secret: 'toaXpJK3IlRkpwLqCZnson8KghSRyMJsRFvCC9Tr4QLp0uYfI7',
  access_token_key: '4220578361-NBTQmC4aNZXEiXHW6TCDOTx3FhxIRZUYNEb0K3N',
  access_token_secret: 'aFp4zGJkMuWrTnN4e9LzN4trGcpnpK6JLAqU4f6D29awE'

});

app.get('/twitterCheck', function (req, res) {
  tweeter.verifyCredentials(function (error, data) {
    res.send("Hello, " + data.name + ". I am in your twitters.");
  });
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;

