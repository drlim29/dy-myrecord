const http = require('http');
const express = require('express');

const router = express.Router();
const path = require('path');
const ejs = require('ejs');
const passport = require('passport');
const KakaoStrategy = require('passport-kakao').Strategy;
const auth_config  = require('./config/auth_config.json');

//db 
const db_config = require('./config/database.js');
const conn = db_config.init();
db_config.connect(conn);

// var sql = `SELECT * FROM auth`;
// conn.query(sql, function(err,rows, fields){
//     if(err){
//         console.log(err);
//     }else{
//         console.log(rows);
        
//     }
// })


//express정보
const app = express();
const server = http.createServer(app);
const hostname = '127.0.0.1';
const port = 3000;

//TODO : LOGGER
//웹개발실무-Lect09-Node_ejs-pdf(1).pdf : p26
/*

*/

const bodyParser = require('body-parser');
const static = require('serve-static');
app.use(bodyParser.urlencoded({extended:false})); //application/x-www-form-urlencoded 파싱
app.use(bodyParser.json());                       //application/json 으로 파싱

//public 폴더에 있는 js, css, img 사용을 위하여 로드
app.use(express.static(path.join(__dirname, "public")))


// app.use(require('serve-static')(__dirname + '/../../public'));
// app.use(require('cookie-parser')());
// app.use(require('body-parser').urlencoded({ extended: true }));
app.use(require('express-session')({
  secret: 'keyboard cat',
  resave: true,
  saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());


//passport.serializeUser() - 로그인 성공시 호출
passport.serializeUser((user, done) => { // Strategy 성공 시 호출됨
  console.log('---------user - serialize--------------')
  return done(null, user.id); // 여기의 user._id가 req.session.passport.user에 저장
});

//passport.deserializeUser() - 페이지를 방문할 때마다 콜백함수 실행 (페이지접속 유저가 유효한 유저인지 체크)
passport.deserializeUser(async (id, done) => { // 매개변수 id는 req.session.passport.user에 저장된 값
  try {
      console.log(id, '----------------user-deserializeUser------')
      const sql = 'SELECT * FROM auth WHERE account_id = ?';
// console.log(id, 'deserial- id');
      const params = [id];
// console.log(sql, id);
      conn.query(sql, params, await function(err,rows, authInfo){
          if(err){
              console.log(err, '로그인유지 실패');
              return done(err, rows); 
          } else {
              console.log('로그인유지');
              return done(null, rows)
          }
      });
  } catch (e) {
      console.error(e);
      return done(e);
  }
});

//passport 적용
passport.use(
  new KakaoStrategy({
      clientID : auth_config.clientID,
      clientSecret: auth_config.clientSecret, // clientSecret을 사용하지 않는다면 넘기지 말거나 빈 스트링을 넘길 것
      callbackURL : auth_config.callbackURL,
      // session: true,
  }, async (accessToken, refreshToken, profile, done) => {

      chkLogin(Object.assign(profile, {accessToken:accessToken, refreshToken:refreshToken}), done);
  }
));



function chkLogin(info, done) {

  const sqlSelect = 'SELECT * FROM auth WHERE account_id = ?';
  const paramsSelect = [info.id];
  conn.query(sqlSelect, paramsSelect, (err, rows, authInfo) => {
      if (err) {
          console.log(err, '로그인실패');
          return done(err);
      }

      if (!authInfo) {
          //계정정보가 없으면 등록
          const sqlCreate = 'INSERT INTO auth (`media_seq`, `status`, `account_id`, `email`, `access_token`,`refresh_token`, `expire_time`, `create_date`, `update_date`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ? )'+
                              ' ON DUPLICATE KEY UPDATE '+
                              '    access_token = ?,'+
                              '    expire_time = ?,'+
                              '    update_date = ?';
          const paramsCreate = [1, '', info.id, info._json.kakao_account.email, info.accessToken,
                          info.refreshToken, 0, new Date(), new Date(),
                          info.accessToken, 0, new Date()];
          conn.query(sqlCreate, paramsCreate, (err, rows, fields) => {
              if (err) {
                  console.log(err);
                  return done(err);
              } else {
                  console.log(rows);
                  return done(err, rows);
              }
          });

          return done(err, rows);
      } else {
          //기존 있는 데이터
          console.log('기존에 등록된 데이터');
          console.log(info, 'info');
          return done(err, info);
      }
  });
}


//ejs engine 사용
app.set('view engine', 'ejs');
app.set('views', './views');



// 루트접근시 index render
app.get('/', (req, res) => {
  console.log(req.user, 'req.user')
  let sessInfo = {};
  if (typeof req.user !== "undefined") {
    sessInfo = req.user;
  }
  res.render('index', {sess:sessInfo});
})

// login
app.get('/login', (req, res)=> {
  res.render('login.ejs');
});

// testament
app.get('/testament', (req, res)=> {
  res.render('testament.ejs');
});

//router
const auth = require('./routes/auth');
const ideas = require('./routes/ideas');

//router user
app.use('/auth', auth);
app.use('/ideas', ideas);



server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});