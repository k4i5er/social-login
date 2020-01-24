const router = require('express').Router()
const passport = require('../config/passport')
const nodemailer = require('nodemailer')

// Routes prefix: /auth

router.get('/google', passport.authenticate('google', {
  scope: [
    'profile',
    'email'
  ]
}))

router.get('/facebook', passport.authenticate('facebook', {
  scope: [
    'public_profile'
  ]
}))

// Mail send config
router.get('/sendmail', async (req, res, next) => {
  const port = req.app.settings.port || process.env.PORT
  const host = req.protocol + '://' + req.hostname + (port == 80 || port == 443 ? '' : ':' + port)
  const name = 'Dummy'
  const lastName = 'Doe'
  const html = `
    < h2 > Email test</h2>
      <p>Wassup dog!</p>
    `
  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: process.env.EMAIL,
      pass: process.env.EMAIL_PWD
    }
  })
  const info = await transporter.sendMail({
    from: `El mero chingón <${process.env.EMAIL}>`,
    to: 'cesar.lpz@uagrovirtual.mx',
    subject: 'Correo de prueba',
    text: '¡Qué pp!',
    html
  })
  res.render('email-success')
})



module.exports = router