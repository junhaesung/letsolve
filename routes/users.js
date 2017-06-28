var express = require('express');
var router = express.Router();
var firebase = require('firebase');

router.get('/', function(req, res, next) {
  var ref = firebase.database().ref('/users');
  ref.once('value', function(snapshot) {
    console.log(snapshot.val());
    res.status(200).json(snapshot.val());
  })
  .catch(function(error) {
    res.status(500).send(error);
  });
});

router.get('/:id', function(req, res, next) {
  var ref = firebase.database().ref('/users/' + req.params.id);

  ref.once('value', function(snapshot) {
    console.log(snapshot.val());
    res.status(200).json(snapshot.val());
  })
  .catch(function(error) {
    res.status(500).send(error);
  });
});

router.post('/', function(req, res, next) {
  // req.body.bid, req.body.name
  var data = req.body;
  data.problems = [];
  console.log(data);

  firebase.database().ref('/users')
  .push(data)
  .then(function(result) {
    console.log(result);
    res.status(200).send('success');
  })
  .catch(function(error) {
    res.status(500).send(error);
  });
});

router.put('/', function(req, res, next) {
  res.status(200).send('success');
});


module.exports = router;
