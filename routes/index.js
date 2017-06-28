var express = require('express');
var router = express.Router();
var request = require('request');
var htmlparser = require('htmlparser2');
var select = require('soupselect').select;


/* GET home page. */
router.get('/', function(req, res, next) {
  // request('http://www.google.com', function (error, response, body) {
  request('https://www.acmicpc.net/user/junhaesung', function (error, response, body) {
    // console.log('error:', error); // Print the error if one occurred
    // console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
    // console.log('body:', body); // Print the HTML for the Google homepage.
    console.log('hello!');
    parseHTML(body);

  });

  res.render('index', { title: 'Express' });
});

function parseHTML(body) {
  var handler = new htmlparser.DomHandler(function (error, dom) {
    if (error)
    	console.log(error);
    else {
      var sel = select(dom, 'body div div div div div div div div div div span a');
    }
  });
  var parser = new htmlparser.Parser(handler);
  parser.write(body);
  parser.end();
}

module.exports = router;
