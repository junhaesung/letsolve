var express = require('express');
var router = express.Router();
var firebase = require('firebase');
var request = require('request');
var htmlparser = require('htmlparser2');
var select = require('soupselect').select;

router.get('/', (req, res, next) => {
  firebase.database().ref('users')
    .once('value')
    .then((snapshot) => { res.status(200).json(snapshot.val()); })
    .catch((error) => { res.status(500).send(error); });
});

router.get('/:id', (req, res, next) => {
  firebase.database().ref('/users/' + id)
    .once('value')
    .then((snapshot) => { res.status(200).json(snapshot.val()); })
    .catch((error) => { res.status(500).send(error); });
});

// req.body.bid, req.body.name
router.post('/', (req, res, next) => {
  const { bid, name } = req.body;
  firebase.database().ref('users')
    .child(bid)
    .set({'name': name})
    .then(() => { res.status(200).send('success'); })
    .catch((error) => { res.status(500).send(error); });
});

router.put('/:id', (req, res, next) => {
  const { id } = req.body;
  const url = 'https://www.acmicpc.net/user/' + id;
  request(url, (error, response, body) => {
    const problems = parseHTML(body);
    console.log(problems);
    firebase.database().ref('/users')
      .child(id)
      .child('problems')
      .set(problems)
      .then(() => { res.status(200).send('success'); })
      .catch((error) => { res.status(500).send(error); });
  });
});

function parseHTML(body) {
  let problems = [];
  let handler = new htmlparser.DomHandler((error, dom) => {
    if (error) return null;

    console.log(body);
    // TODO:
    // 1. 틀린문제, 맞은문제 구분해야
    // result-ac
    // result-wa
    // 2. Tweet 같이 이상한거 붙는데, 없애기 -> 틀린문제인듯?
    let sel = select(dom, 'body div div div div div div div div div div span a');
    let prevNum = 0;
    let isEnded = false;
    for(var s of sel) {
      for(var c of s.children) {
        console.log(c);
        let currentNum = Number(c.data);
        if(!isNaN(c.data)) {
          if(prevNum > currentNum) {
            isEnded = true;
            break;
          }
          problems.push({no: c.data})
          prevNum = currentNum;
        } else {
          problems[problems.length-1].title = c.data;
        }
      }
      if(isEnded) break;
    }
  });
  let parser = new htmlparser.Parser(handler);
  parser.write(body);
  parser.end();
  return problems;
}

module.exports = router;
