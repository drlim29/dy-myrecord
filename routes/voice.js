//express , router 사용
const express = require('express');
const router = express.Router();

//db 연결
const path = require('path');
const db_config = require('../config/database.js');
const conn = db_config.init();
db_config.connect(conn);

//녹음파일 리스트 /voice/
router.get('/', function (req, res) {
  let sessInfo = {};

  //사용자 고유값 읽기
  if (typeof req.user !== "undefined") {
    sessInfo = parseSession(req.user);
  }

  //Query & Parameter setting
  let sqlQuery="SELECT * FROM content_voice WHERE account_seq=?;"
  paramsSelect=[sessInfo.account_id]

  conn.query(sqlQuery, paramsSelect, (err, result, fields) => {
    if(sessInfo.account_id !== undefined) {
      console.log("-----Voice ContentList Page Load-----")
      res.render('voiceContentList', {sess: sessInfo, data: result});
    }
    else {
      res.render("login",{sess: sessInfo})
    }
  });

})

//데이터베이스 삽입
router.get('/recordInsert', function (req, res) {
  let {voice, title, content} = req.query

  //사용자 고유값 읽기
  let sessInfo = {};
  if (typeof req.user !== "undefined") {
    sessInfo = parseSession(req.user);                    
  }

  //현재시간
  let today = new Date()
  let year = today.getFullYear();                         // 년도
  let month = today.getMonth() + 1;                       // 월
  let date = today.getDate()
  let reporting_date=year + '/' + month + '/' + date

  //Query setting
  let sqlQuery="INSERT INTO content_voice(account_seq, title, content, voice, reporting_date) VALUE (?,?,?,?,?)"
  let paramsSelect = [sessInfo.account_id, title, content, voice, reporting_date];
  //Query
  conn.query(sqlQuery, paramsSelect, (err, results, fields) => {
    if (error) {
      console.log("-----Voice Content insert-----")
    }
    console.log("-----Voice Content insert: Failed-----")
  });
  res.redirect("/voice");
})

//녹음파일 세부정보
router.get('/voiceContentInfo/:content_seq', function (req, res) {
  let content_seq = req.params.content_seq;
  let sessInfo = {};

  //사용자 고유값 읽기
  if (typeof req.user !== "undefined") {
    sessInfo = parseSession(req.user);                    
  }

  //Query & Parameter setting
  const sqlQuery="SELECT * FROM content_voice WHERE content_seq=?"
  const paramsSelect=[content_seq]
  conn.query(sqlQuery, paramsSelect, (err, result, fields) => {
      if(err) throw err;
      else{
        if(req.user != "undefined") {
          console.log("-----Voice ContentInfo Page Load-----")
          res.render('voiceContentInfo', {title: "Voice ContentInfo", data: result , sess: sessInfo});
        }
        else {
          console.log("-----Voice ContentInfo Page Load: Failed-----")
          res.redirect("/voice");
        }
      }
  })
})


//컨텐츠 수정
router.get('/ContentInfoUpdate/', function (req, res) {
  let {content_seq, title, content} = req.query
  let sessInfo = {};
  
  //사용자 고유값 읽기
  if (typeof req.user !== "undefined") {
    sessInfo = parseSession(req.user);
  }

  //Query & Parameter setting
  let sqlQuery="UPDATE content_voice SET title=?, content=? WHERE content_seq=?"
  let paramsSelect = [title, content, content_seq];

  conn.query(sqlQuery, paramsSelect, (err, result, fields) => {
      if(err) throw err;
      else{
        if(req.user != "undefined") {
          console.log("-----Voice ContentInfo Update-----")
        }
        else {
          console.log("-----Voice ContentInfo Update: Failed-----")
        }
        res.redirect("/voice");
      }
  })
});

//컨텐츠 삭제
router.get('/ContentInfoDelete/:content_seq', function (req, res) {
  let {content_seq} = req.query;
  let sessInfo = {};

  //사용자 고유값 읽기
  if (typeof req.user !== "undefined") {
    sessInfo = parseSession(req.user);                    //사용자 고유값 읽기
  }
  
  //Query & Parameter setting
  let sqlQuery="DELETE FROM content_voice WHERE content_seq=?"
  let paramsSelect = [content_seq];
  //Query
  conn.query(sqlQuery, paramsSelect, (err, result, fields) => {
      if(err) throw err;
      else{
        if(req.user != "undefined") {
          console.log("-----Voice Content delete-----")
          res.redirect("/voice");
        }
        else {
          console.log("-----Voice Content delete: Failed-----")
          res.redirect("/voice")
        }
      }
  })
})



//녹음 페이지
router.get('/record/:account_seq', function (req, res) {
  let sessInfo = {};

  //사용자 고유값 읽기
  if (typeof req.user !== "undefined") {
    sessInfo = parseSession(req.user);                    
  }
  let account_seq = req.params.account_seq;
  res.render('voiceRecord', {data: account_seq , sess:sessInfo});
})




//세션 파싱
function parseSession(sess)
{
  if (typeof sess === 'undefined' || sess.length === 0) return {};

    sessInfo = JSON.parse(JSON.stringify(sess));
    sessInfo = sessInfo[0];
    return sessInfo;
}

module.exports = router;