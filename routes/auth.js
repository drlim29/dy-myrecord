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

module.exports = router;