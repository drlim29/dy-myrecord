// ./routes/auth.js
const express = require('express');
const router = express.Router();
const moment  = require('moment');

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
  
  if(sessInfo.account_id !== undefined) {
    //쿼리실행
    conn.query(sqlSelect, paramsSelect, (err, rows, testamInfo) => { //callback함수 (쿼리 실행 뒤에 실행 프로세스)
      console.log(rows, 'rows');

      if (err) {
          console.log(err, 'Select 실패');
          return done(err);
      }

      //가져온 데이터로 render
      res.render('testament/testamInfo', {sess:sessInfo, data : rows});
    });
  }
  else {
    res.render("auth/login",{sess: sessInfo})
  }
})

//Insert등록
router.post('/sqlInsert', function (req, res) {
  console.log('---------------------------');
  console.log(req.body, 'req.body.');

  let sessInfo = {};
  
  if (typeof req.user !== "undefined") {
    sessInfo = parseSession(req.user);
  }
  console.log(sessInfo, 'sessInfo');

  //Update - DUPLICATE KEY UPDATE
  const sqlUpsert = 'INSERT INTO testament(account_seq, title, content, date) VALUES(?, ?, ?, ?) ON DUPLICATE KEY UPDATE  title = ?, content = ?, date = ?';
  const paramsUpsert = [sessInfo.account_seq, req.body.title, req.body.content, moment().format('YYYY-MM-DD'),  req.body.title, req.body.content, moment().format('YYYY-MM-DD')];  //세션에서 가져온 account_seq값
  //쿼리실행
   conn.query(sqlUpsert, paramsUpsert, (err, rows, fields) => { //callback함수 (쿼리 실행 뒤에 실행 프로세스)
     console.log(rows, 'rows');

     if (err) {
         console.log(err, 'insert 실패');
         return done(err);
     }
    //가져온 데이터로 render
    res.redirect('/testam');
   });

  
})


//Delete
router.post('/delete', (req, res) => {
  const sqlDelete = 'DELETE FROM testament WHERE account_seq = ?';
  const paramsDelete = [sessInfo.account_seq];  //세션에서 가져온 account_seq값
  //쿼리실행
   conn.query(sqlDelete, paramsDelete, (err, rows, fields) => { //callback함수 (쿼리 실행 뒤에 실행 프로세스)
     console.log(rows, 'rows');

     if (err) {
         console.log(err, 'delete 실패');
         return done(err);
     }

    //가져온 데이터로 render
    res.redirect('/testam');
   });
});

//세션 파싱
function parseSession(sess)
{
    sessInfo = JSON.parse(JSON.stringify(sess));
    sessInfo = sessInfo[0];
    return sessInfo;
}

module.exports = router;