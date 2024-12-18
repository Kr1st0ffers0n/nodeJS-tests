import passport from 'passport'
import { Strategy as LocalStrategy } from 'passport-local'
import bcrypt from 'bcryptjs'
import User from '../models/user/User.mjs'
import UsersDBService from '../models/user/UsersDBService.mjs'

//  !!!====== Не забути перед кодуванням встановити модуль
// !!!====== npm i passport та npm i passport-local 

// Налаштування локальної стратегії
passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      const user = await UsersDBService.findOne({ username }, {}, ['type'])
      if (!user) {
        return done(null, false, { message: 'Incorrect name.' })
      }
      const isMatch = await bcrypt.compare(password, user.password)
      if (!isMatch) {
        return done(null, false, { message: 'Incorrect password.' })
      }
      return done(null, user) // user додається до req об'єкта, тобто щоб отримати його в іншому файлі === req.user
    } catch (error) {
      return done(error)
    }
  })
)

// Серіалізація користувача
passport.serializeUser((user, done) => {
  done(null, user._id)
})

// Десеріалізація користувача
passport.deserializeUser(async (id, done) => {
  try {
    // const user = await User.findById(id)
    const user = await UsersDBService.findOne({ _id: id }, {}, ['type'])
    done(null, user)
  } catch (error) {
    done(error)
  }
})

export default passport
