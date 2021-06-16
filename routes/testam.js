// ./routes/auth.js
const express = require('express');
const router = express.Router();

//db
const path = require('path');
const db_config = require('../config/database.js');
const conn = db_config.init();
db_config.connect(conn);

router.get('/', function (req, res) {
  console.log("================");
  let sessInfo = {};
  if (typeof req.user !== "undefined") {
    sessInfo = parseSession(req.user);
  }

  //select Query
  const sqlSelect = 'SELECT * FROM testament WHERE account_seq = ?';
  const paramsSelect = [sessInfo.account_seq];  //세션에서 가져온 account_seq값
  
  //쿼리실행
  conn.query(sqlSelect, paramsSelect, (err, rows, testamInfo) => { //callback함수 (쿼리 실행 뒤에 실행 프로세스)
    console.log(rows, 'rows');
    // console.log(testamentInfo, 'testamentInfo');

    if (err) {
        console.log(err, 'Select 실패');
        return done(err);
    }

    //가져온 데이터로 render
    res.render('testamInfo', {sess:sessInfo, data : rows});
  });
  // res.render('testamInfo.ejs');
})

//insert등록
router.post('/sqlInsert', function (req, res) {

  let sessInfo = {};
  if (typeof req.user !== "undefined") {
    sessInfo = parseSession(req.user);
  }

  //Insert Query
  const sqlInsert = 'INSERT INTO testament(account_id, title, content, date) VALUE (?,?,?,?)';
  const paramsSelect = [sessInfo.account_seq];  //세션에서 가져온 account_seq값
  
  //쿼리실행
  conn.query(sqlInsert, paramsSelect, (err, rows, fields) => { //callback함수 (쿼리 실행 뒤에 실행 프로세스)
    console.log(rows, 'rows');
    // console.log(testamentInfo, 'testamentInfo');

    if (err) {
        console.log(err, 'insert 실패');
        return done(err);
    }

    //가져온 데이터로 render
    res.redirect('testamInfo', {sess:sessInfo, data : rows});

  });
  // res.render('testam.ejs');
})
// router.get('/ideas/delete/:id', function (req, res) {
//   client.query('delete from MusicList where id=?', [req.params.id], function () {
//     res.redirect('/')
//   })
// })

// router.get('/insert', function (req, res) {
//   fs.readFile('insert.html', 'utf8', function (err, data) {
//     res.send(data)
//   })
// })

// router.post('/insert', function (req, res) {

// })

// router.get('/edit/:id', function (req, res) {

// })

// router.post('/edit/:id', function (req, res) {

// })

//세션 파싱
function parseSession(sess)
{
    sessInfo = JSON.parse(JSON.stringify(sess));
    sessInfo = sessInfo[0];
    return sessInfo;
}

module.exports = router;