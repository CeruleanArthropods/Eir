var express = require('express');

//Creates and initializes an express application
var app = express();
var port = process.env.PORT || 3000;
app.listen(port);

//Passes app and express to middlewares
require('./config/middleware.js')(app, express);
