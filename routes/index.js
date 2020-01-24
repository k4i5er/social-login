const express = require('express');
const router = express.Router();
const passport = require('../config/passport')
const uploadCloud = require('../config/cloudinary')
const Pic = require('../models/Pic')

/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index');
});

router.get('/profile', (req, res, next) => {
  console.log(req.user)
})

router.post('/upload', uploadCloud.single('photo'), async (req, res, next) => {
  const { url, originalname } = req.file
  const { caption } = req.body
  const newPic = await Pic.create({ caption, photos: { url, name: originalname } })
  res.render('uploaded-pic', newPic)
})

router.get('/upload', (req, res, next) => {
  res.render('upload-pic')
})

router.get('/google/redirect', passport.authenticate('google', { scope: 'email' }), (req, res, next) => {
  console.log(`g user >>> ${req.user}`)
  res.render('profile', req.user)
})

router.get('/facebook/redirect', passport.authenticate('facebook', { scope: 'email' }, (req, res, next) => {
  console.log(`fb user >>> ${req.user}`)
  res.render('profile', req.user)
}))

module.exports = router;
