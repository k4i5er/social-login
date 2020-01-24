// Para mñana:
// Multer, cloudinary, nodemailer, deploy heroku, mongo atlas, 
// Opcional si hay neuronas vivas: flash messages, websockets

// hotel sn cristobal 
// coahuila manuel acuña.

const passport = require('passport')
const User = require('../models/User')
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy
const FacebookStrategy = require('passport-facebook')
// const LocalStrategy = require('passport-local').Strategy

// passport.use(User.createStrategy())

passport.serializeUser((user, done) => {
  done(null, user.id)
})

passport.deserializeUser(async (id, done) => {
  const user = await User.findById(id)
  done(null, user)
})

// Google Login Strategy
passport.use(
  new GoogleStrategy(
    {
      callbackURL: '/google/redirect',
      clientID: process.env.G_CLIENT_ID,
      clientSecret: process.env.G_CLIENT_SECRET,
      profileFields: ['id', 'displayName', 'name', 'email']
    },
    async (accessToken, refreshToken, profile, done) => {
      console.log(`This is the fuckin' user's profile >>> Name:${profile._json.name},  Email:${profile._json.email} Profile JSON:${Object.keys(profile._json)}`)
      const currentUser = await User.findOne({ googleId: profile.id })
      if (currentUser) {
        done(null, currentUser)
      } else {
        const newUser = await new User(
          {
            email: profile._json.email,
            googleId: profile.id,
            name: profile._json.given_name,
            lastName: profile._json.family_name
          }
        ).save()
        done(null, newUser)
      }      
    }
  )
)

// Facebook Login Strategy
passport.use(
  new FacebookStrategy(
    {
      callbackURL: '/facebook/redirect',
      clientID: process.env.FB_CLIENT_ID,
      clientSecret: process.env.FB_CLIENT_SECRET,
      profileFields: ['id', 'displayName', 'name', 'email']
    },
    async (accessToken, refreshToken, profile, done) => {
      console.log(`This is fuckin' FB Profile >>>> ${(profile.displayName)}`)
      const currentUser = profile
      done(null, currentUser)
    }
  )
)

module.exports = passport