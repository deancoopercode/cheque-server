//include the express.js library
var express = require('express')
var app = express()

var logicController = require('./src/logic.js');

//enable CORS - cross origin requests.
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

//route to convert our number
app.get('/convert/:id', function(req, res) {

  var result = logicController.convertNumber(req.params.id);
  res.status(200).json({result: result})

});


app.listen(8080)
