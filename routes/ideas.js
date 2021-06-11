// // ./routes/auth.js
// const express = require('express');
// const router = express.Router();
// const passport = require('passport');


// //db
// const path = require('path');
// const db_config = require('../config/database.js');
// const conn = db_config.init();
// db_config.connect(conn);


// const express = require('express');
// const router = express.Router();
// const Idea = require('../models/Idea');
// const {ensureAuthenticated} = require('../libs/auth');

//   router.get('/', ensureAuthenticated, (req, res) => {
//     Idea.find({user: req.user.id}).sort({date: 'desc'}).then(ideas => {
//       res.render('ideas/index', {ideas, user: req.user.name});
//     }).catch(err => console.log(err));
//   });

//   router.get('/add', ensureAuthenticated, (req, res) => {
//     res.render('ideas/add');
//   });

//   router.get('/edit/:id', ensureAuthenticated, (req, res) => {
//     Idea.findById(req.params.id).then(idea => {
//       if (idea.user != req.user.id) {
//         console.log('Not authorized!');
//         res.redirect('/ideas');
//         return;
//       }
//       res.render('ideas/edit', {idea});
//     }).catch(err => console.log(err));
//   });

//   // post
//   router.post('/', (req, res) => {
//     let errors = [];
//     if (!req.body.title)
//       errors.push({text: 'Please add a title'});
//     if (!req.body.details)
//       errors.push({text: 'Please add a detail'});

//     if (errors.length > 0) {
//       res.render('ideas/add', {
//         errors,
//         title: req.body.title,
//         details: req.body.details
//       });
//     } else {
//       Idea.create({title: req.body.title, details: req.body.details, user: req.user.id}).then(() => {
//         console.log('Idea created!');
//         res.redirect('/ideas');
//       }).catch(err => console.log(err));
//     }
//   });

//   // update process
//   router.put('/:id', (req, res) => {
//     Idea.findByIdAndUpdate(req.params.id, req.body).then(idea => {
//       console.log(`${idea.title} updated!`);
//       res.redirect('/ideas');
//     }).catch(err => console.log(err));
//   });

//   // remove process
//   router.delete('/:id', (req, res) => {
//     Idea.findByIdAndRemove(req.params.id).then(() => {
//       console.log(`Idea deleted!`);
//       res.redirect('/ideas');
//     }).catch(err => console.log(err));
//   });

// module.exports = router;


// ./routes/auth.js
const express = require('express');
const router = express.Router();
// const passport = require('passport');


//db
const path = require('path');
const db_config = require('../config/database.js');
const conn = db_config.init();
db_config.connect(conn);


// const app = express()

// app.use(bodyParser.urlencoded({
//   extended: false
// }))

// app.listen(52273, function () {
//   console.log('Server is running at : http://127.0.0.1:52273')
// })

router.get('/', function (req, res) {
  // fs.readFile('list.ejs', 'utf8', function (err, data) {
  //   client.query('select * from MusicList', function (err, results) {
  //     if (err) {
  //       res.send(err)
  //     } else {
  //       res.send(ejs.render(data, {
  //         data: results
  //       }))
  //     }
  //   })
  // })

  res.render('testam.ejs');
})

router.get('/ideas/delete/:id', function (req, res) {
  client.query('delete from MusicList where id=?', [req.params.id], function () {
    res.redirect('/')
  })
})

router.get('/insert', function (req, res) {
  fs.readFile('insert.html', 'utf8', function (err, data) {
    res.send(data)
  })
})

router.post('/insert', function (req, res) {

})

router.get('/edit/:id', function (req, res) {

})

router.post('/edit/:id', function (req, res) {

})

module.exports = router;