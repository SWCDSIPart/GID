var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var expressValidator = require('express-validator');
var gid = require('./routes/gid');
var fintto = require('./routes/fintto');

var app = express();

var swaggerJSDoc = require('swagger-jsdoc');
var swaggerUi = require('swagger-ui-express');
// Swagger definition
// You can set every attribute except paths and swagger
// https://github.com/swagger-api/swagger-spec/blob/master/versions/2.0.md
var swaggerDefinition = {
  info: { // API informations (required)
    title: 'Fintto RESTful Server', // Title (required)
    version: '0.0.1', // Version (required)
    description: 'RESTful API for Fintto Application', // Description (optional)
  },
  host: '10.113.58.69:3000', // Host (optional)
  basePath: '/', // Base path (optional)
  schemes: ['http'],
};
// Options for the swagger docs
var options = {
  // Import swaggerDefinitions
  swaggerDefinition: swaggerDefinition,
  // Path to the API docs
  apis: ['./gid.yaml'],
};
// Initialize swagger-jsdoc -> returns validated swagger spec in json format
var swaggerSpec = swaggerJSDoc(options);

console.logCopy = console.log.bind(console);
console.log = function(data)
{
    var currentDate = '[' + new Date() + '] ';
    this.logCopy(currentDate, data);
};

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
app.use(expressValidator());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use('/', gid);
app.use('/', fintto);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
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
