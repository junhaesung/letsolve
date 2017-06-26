var express = require('express');
var router = express.Router();
var firebase = require('firebase');

/* GET users listing. */
router.get('/', function(req, res, next) {
  var name = req.query.name;
  var db = firebase.database();
  db.ref('/users/' + name );
  ref.once('value', function(snapshot) {
    console.log(snapshot.val());
  });
  res.status(200).send('success');
});


module.exports = router;
