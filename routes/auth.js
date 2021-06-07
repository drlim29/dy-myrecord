// ./routes/auth.js
const express = require('express');
const router = express.Router();
const passport = require('passport');


//db
const path = require('path');
const db_config = require('../config/database.js');
const conn = db_config.init();
db_config.connect(conn);


//kakao 로그인페이지 
router.get('/kakao', passport.authenticate('kakao', {
    successRedirect: '/',
    failureRedirect: '/login',
    session: true
  })
);


//kakao 로그아웃 ( 세션끊기 )
router.get('/kakao/logout', (req, res) => {
    req.logout();

    res.redirect("/");
});

// 3. /auth/kakao/callback으로 프로필 반환
router.get('/kakao/callback', passport.authenticate('kakao', {
    successRedirect: '/',
    failureRedirect: '/login',
    session:true
  }), (req, res) => {
      console.log('kakao로그인성공 callback');
    // console.log(req, 'kakao-callback-req')
    // console.log(res, 'kakao-callback-res')
    res.redirect('/');
  });


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

module.exports = router;