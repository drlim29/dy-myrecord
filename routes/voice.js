const express = require('express');
const router = express.Router();

//db
const path = require('path');
const db_config = require('../config/database.js');
const conn = db_config.init();
db_config.connect(conn);

//녹음파일 리스트 출력
router.get('/', function (req, res) {
  let sessInfo = {};
  if (typeof req.user !== "undefined") {
    sessInfo = parseSession(req.user);
  }
  
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
/*
  let sessInfo = {};
  if (typeof req.user !== "undefined") {
    sessInfo = parseSession(req.user);
  }
  res.render('testam', {sess:sessInfo});
  // res.render('testam.ejs');
  */
})


//녹음파일 세부정보 출력
router.get('/voiceContentInfo/:content_seq', function (req, res) {
  let sessInfo = {};
  let content_seq = req.params.content_seq;
  
  if (typeof req.user !== "undefined") {
    sessInfo = parseSession(req.user);
  }
  //유저정보 불러오는 쿼리 사용
  //const sqlQuery="SELECT * FROM content_voice WHERE " 유저 테이블 생성 시 사용
  //임시 쿼리
  sqlQuery="SELECT * FROM content_voice WHERE content_seq=?"
  paramsSelect=[content_seq]
  console.log(sqlQuery)
  console.log(paramsSelect)
  conn.query(sqlQuery, paramsSelect, (err, result, fields) => {
      if(err) throw err;
      else{
        if(req.user != "undefined") {
          console.log("-----Voice ContentInfo Page Load-----")
          res.render('voiceContentInfo', {title: "Voice ContentInfo", data: result , sess: sessInfo});
        }
        else {
          res.redirect("/voice");
        }
      }
  })
})


//컨텐츠 수정
router.get('/ContentInfoUpdate/', function (req, res) {
  //Get Parameter
  let {content_seq, title, content} = req.query
  //Get Session
  let sessInfo = {};
  if (typeof req.user !== "undefined") {
    sessInfo = parseSession(req.user);
  }  

  //Query setting
  let sqlQuery="UPDATE content_voice SET title=?, content=? WHERE content_seq=?"
  //Parameter setting
  let paramsSelect = [title, content, content_seq];

  console.log(sqlQuery)
  conn.query(sqlQuery, paramsSelect, (err, result, fields) => {
      if(err) throw err;
      else{
        if(req.user != "undefined") {
          console.log("-----Voice ContentInfo Update-----")
          res.redirect("/voice");
        }
        else {
          res.redirect("/voice");
        }
      }
  })
});

//컨텐츠 삭제
router.post('/ContentInfoDelete/:content_seq', function (req, res) {
  let sessInfo = {};
  if (typeof req.user !== "undefined") {
    sessInfo = parseSession(req.user);
  }
  let content_seq = req.params.content_seq;


  //Query setting
  let sqlQuery="DELETE FROM content_voice WHERE content_seq=?"
  //Parameter setting
  let paramsSelect = [content_seq];
  console.log(sqlQuery)
  conn.query(sqlQuery, paramsSelect, (err, result, fields) => {
      if(err) throw err;
      else{
        if(req.user != "undefined") {
          console.log("-----Voice Content delete-----")
          res.redirect("/voice");
        }
        else {
          alert("오류가 발생했습니다.")
          res.redirect("/voice")
        }
      }

  })
})



//컨텐츠 생성페이지
router.get('/record/:account_seq', function (req, res) {
  let sessInfo = {};
  if (typeof req.user !== "undefined") {
    sessInfo = parseSession(req.user);
  }
  let account_seq = req.params.account_seq;
  //유저정보 불러오는 쿼리 사용
  //const sqlQuery="SELECT * FROM content_voice WHERE " 유저 테이블 생성 시 사용
  //임시 쿼리
  // sqlQuery="SELECT * FROM content_voice WHERE content_seq=?"
  // paramsSelect=[content_seq]
  // console.log(sqlQuery)
  // console.log(paramsSelect)
  // conn.query(sqlQuery, paramsSelect, (err, result, fields) => {
  //     if(err) throw err;
  //     else{
  //       if(req.user != "undefined") {
  //         console.log("-----Voice ContentInfo Page Load-----")
  //         res.render('voiceContentInfo', {title: "Temporary Title", data: result , sess: sessInfo});
  //       }
  //       else {
  //         res.redirect("/login")
  //       }
  //     }

  // })


  res.render('voiceRecord', {data: account_seq , sess:sessInfo});


})


//데이터베이스 삽입
router.get('/recordInsert', function (req, res) {
  //Get Parameter
  let {account_seq, voice, title, content} = req.query
  //session Setting
  let sessInfo = {};
  if (typeof req.user !== "undefined") {
    sessInfo = parseSession(req.user);
  }

  //입력시간
  let today = new Date()
  let year = today.getFullYear(); // 년도
  let month = today.getMonth() + 1;  // 월
  let date = today.getDate()
  let reporting_date=year + '/' + month + '/' + date
  console.log("Now date : "+reporting_date)


  //Query setting
  let sqlQuery="INSERT INTO content_voice(account_seq, title, content, voice, reporting_date) VALUE (?,?,?,?,?)"
  let paramsSelect = [account_seq, title, content, voice, reporting_date];
  
  conn.query(sqlQuery, paramsSelect, (error, results, fields) => {
    if (error) {
      console.log(error);
    }
    console.log(results);
  });
  
  res.redirect("/voice");
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