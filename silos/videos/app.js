var dataLayer = require('./dataLayer.js');

var express = require('express');
var session = require('express-session');
const app = express();
const port = 5001;
var bodyParser = require('body-parser');
var parseurl = require('parseurl');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

app.use(express.static('public'));

app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true
  }))
   
  app.use(function (req, res, next) {
 
    next()
  })


dataLayer.init(function(){
    console.log("Connectiong to db");
    app.listen(process.env.PORT || 5001)
    console.log("App listening on port "+port);
});
