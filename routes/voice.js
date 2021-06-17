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
  let sqlQuery="SELECT * FROM content_voice;" //WHERE account_id=?
  paramsSelect=[req.user]
  conn.query(sqlQuery, paramsSelect, (err, result, fields) => {
    /*
    if(err) throw err;
    else{
      console.log("else")
        if(req.user != "undefined") {
          var page = res.render('voiceContentList', {
              sess: sessInfo,
              data: result,
          });
          console.log("--Voice Content Page Load")
          res.render(page);
        }
       
        else {
          res.redirect("/login")
        }
    }*/
    if(req.user != "undefined") {
      console.log("-----Voice ContentList Page Load-----")
      res.render('voiceContentList', {sess: sessInfo, data: result});
    }
    else {
      res.redirect("/login",  {sess: sessInfo})
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
          res.render('voiceContentInfo', {title: "Temporary Title", data: result , sess: sessInfo});
        }
        else {
          res.redirect("/login")
        }
      }

  })
})
router.get('/record/:account_id', function (req, res) {
  let sessInfo = {};
  let account_id = req.params.account_id;

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
          res.render('voiceContentInfo', {title: "Temporary Title", data: result , sess: sessInfo});
        }
        else {
          res.redirect("/login")
        }
      }

  })
})
router.get('/record/:account_id', function (req, res) {






})

//데이터베이스 삽입
router.get('/recordInsert', function (req, res) {
  //Get Parameter
  let {account_id, reporting_date, voice, title, content} = req.query

  //Query setting
  let sqlQuery="INSERT INTO content_voice(account_id, title, content, voice, reporting_date) VALUE (?,?,?,?,?)"
  let paramsSelect = [account_id, title, content, voice, reporting_date];
  
  conn.query(sqlQuery, paramsSelect, (error, results, fields) => {
    if (error) {
      console.log(error);
    }
    console.log(results);
  });
  
  res.render("/voiceContentList", {sess:sessInfo});
})



router.get('/edit/:id', function (req, res) {

})

router.post('/edit/:id', function (req, res) {

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

/*


app.get('/record', (req, res) => {
  let sessInfo = {};
  
  res.render('voiceRecord');
})

app.get('/recordInsert', (req, res) => {
  //Get Parameter
  let {account_id, reporting_date, voice, title, content} = req.query
  console.log(req.query)
  //Query setting
  let sqlQuery="INSERT INTO content_voice(account_id, title, content, voice, reporting_date) VALUE (?,?,?,?,?)"
  let paramsSelect = [account_id, title, content, voice, reporting_date];
  
  conn.query(sqlQuery, paramsSelect, (error, results, fields) => {
    if (error) {
      console.log(error);
    }
    console.log(results);
  });
  
  res.redirect("/voiceContentList");
})

//완료
app.get('/recordDelete', (req, res) => {
  //파라메타 값 읽기
  let {content_seq} = req.query
  //Query setting
  let sqlQuery="DELETE FROM content_voice WHERE content_seq="+content_seq;
  //Query start
  conn.query(sqlQuery, function (error, results, fields) {
    if (error) {
      console.log(error);
    }
    console.log(results);
  });
  //redirect to voiceContentList page
  res.redirect("/voiceContentList");
})


app.get('/voiceContentList', (req, res) => {
  //Query setting
  let sqlQuery="SELECT * FROM content_voice WHERE account_id=?"
  //let paramsSelect = [req.user];
  //테스트용
  let paramsSelect=[1760576225];
  
  conn.query(sqlQuery, paramsSelect, (err, result, fields) => {
  let sessInfo = {};
  if (typeof req.user !== "undefined") {
    sessInfo = parseSession(req.user);
  }
  
      if(err) throw err;
      else{
          if(req.user != "undefined") {
            var page = res.render('voiceContentList', {
                title: "Temporary Title",
                data: result,
            });
            console.log("--Voice Content Page Load")
            res.end(page);
          }
          else {
            res.redirect("/login")
          }
      }
  });
});

app.get('/voiceContentInfo', (req, res) => {
  let {voiceContentID} = req.query;
  let sqlQuery = "SELECT * FROM content_voice WHERE content_seq="+voiceContentID+";";
  console.log(sqlQuery);
  conn.query(sqlQuery, function(err, result, fields){
    if(err) throw err;
    else{
      console.log(result[0].content);
      var page = res.render('voiceContentInfo', {
          title: "Temporary Title",
          data: result,
      });
      res.end(page);
    }
  });
});



*/
