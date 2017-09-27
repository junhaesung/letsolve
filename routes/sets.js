const express = require('express');
const router = express.Router();
const firebase = require('firebase');
const request = require('request');
const htmlparser = require('htmlparser2');
const select = require('soupselect').select;
const _ = require('lodash');

router.get('/', (req, res) => {
  firebase.database().ref('sets')
    .once('value')
    .then((snapshot) => { res.status(200).json(snapshot.val()); })
    .catch((error) => { res.status(500).json(error); });
});

// router.get('/:id', function(req, res, next) {
//   var ref = firebase.database().ref('sets/' + id)
//
//   ref.once('value', function(snapshot) {
//     console.log(snapshot.val());
//     res.status(200).json(snapshot.val());
//   })
//   .catch(function(error) {
//     res.status(500).send(error);
//   });
// });

router.post('/', (req, res, next) => {
  const { name, users, problems } = req.body;

  if (!name)
    res.status(400).json({ status: 'MISSING_SET_NAME' });
  if (!users)
    res.status(400).json({ status: 'MISSING_SET_USERS' });
  if (!problems)
    res.status(400).json({ status: 'MISSING_SET_PROBLEMS' });

  firebase.database().ref('sets')
    .push({ name, users, problems })
    .then((snapshot) => {
      res.status(201).json({
        status: 'Created',
        sets: snapshot.val(),
      });
    })
    .catch((error) => { res.status(500).json(error); });
});

// router.put('/:id', function(req, res, next) {
//   var url = 'https://www.acmicpc.net/user/' + req.params.id;
//   request(url, function (error, response, body) {
//     var problems = parseHTML(body);
//     console.log(problems);
//     var ref = firebase.database().ref('sets')
//     ref.child(req.params.id).child('problems').set(problems)
//     .then(function() {
//       res.status(200).send('success');
//     })
//     .catch(function(error) {
//       res.status(500).send(error);
//     });
//   });
// });

router.delete('/:id', function(req, res, next) {
  const { id } = req.body;
  if (!id)
    res.status(400).json({ status: 'MISSING_SET_ID' });

  firebase.database().ref('sets')
    .child(id)
    .remove()
    .then((result) => { res.status(204).send(); })
    .catch((error) => { res.status(500).send(error); });
});

module.exports = router;
