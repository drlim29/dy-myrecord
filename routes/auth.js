// ./routes/auth.js

const express = require('express');
const router = express.Router();
// const ejs = require('ejs');

router.get('/', (req, res)=> {
    res.render('auth.ejs');
});

module.exports = router;