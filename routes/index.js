const express = require('express');
// var cheerio = require('cheerio');
const firebase = require('firebase');
const _ = require('lodash');
const async = require('async');
const router = express.Router();

const ref = firebase.database().ref();

/* GET home page. */
router.get('/', (req, res, next) => {

  // ref.child('sets')
  //   .once('value')
  //   .then((snapshot) => {
  //     const setValues = snapshot.val();
  //     if (!setValues) res.status(204).send();
  //     return { sets: setValues };
  //   })
  //   .then(({ sets }) => new Promise((resolve, reject) => {
  //     async.map(_.keys(sets), (set, callback) => {
  //       sets[set].users
  //     }, (err, results) => {

  //     })
  //   }))

  // sets
  // 해당 user 정보 가져오기
  // 푼문제, 안푼문제 그리기
  
  ref.child('users')
    .once('value')
    .then((snapshot) => {
      const users = snapshot.val();
      let data = {};
      for(let user in users) {
        data[user] = users[user];
        data[user].problems = [];
        for(let p of users[user].problems) {
          data[user].problems.push(p.no);
        }
      }
      return({ data, users });
    })
    .then(({ data, users }) => {
      return new Promise((resolve, reject) => {
        ref.child('sets')
          .limitToFirst(1)
          .once('value')
          .then((snapshot) => {
            const setValues = snapshot.val();
            for(var shot in setValues) {
              sets = setValues[shot];
            }
            console.log(setValues);
            console.log(sets);
            resolve({ data, users, sets });
          })
          .catch((err) => { reject({ err }); });
      });
    })
    .then(({ data, users, sets }) => {
      let problems = [];
  
      // 세트의 유저
      for(var u in sets.users) {
        // 세트의 문제
        problems.push([]);
        for(var p in sets.problems) {
          var tmp = 0;
          for(var i in data[sets.users[u]].problems) {
            if(sets.problems[p] == data[sets.users[u]].problems[i]) {
              tmp = 1;
              break;
            }
          }
          console.log(sets.users[u], sets.problems[p], tmp);
          problems[problems.length-1].push(tmp);
        }
      }
      return ({ data, users, sets, problems });
    })
    .then(({ data, users, sets, problems }) => {
      let sources = [];
      // count problems
      for(var p of problems) {
        console.log(problems)
        console.log(p);
        var sum = p.reduce((a, b) => a + b, 0);
        var max = p.length;
        sources.push([sum, max]);
      }
      return ({ data, users, sets, problems, sources });
    })
    .then(({ data, users, sets, problems, sources }) => {
      console.log(sets);
      res.render('index', {
        title: '디프만 알고리즘 스터디',
        name: sets.name,
        users: sets.users,
        problems,
        sources,
        sets,
      });
    })
    .catch(({ err }) => { res.status(500).json(err); });
});

module.exports = router;
