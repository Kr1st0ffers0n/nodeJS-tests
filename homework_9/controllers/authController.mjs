import User from '../models/user.js'
import passport from 'passport'

class AuthController {
  static login(req, res, next) {
    passport.authenticate('local', (err, user, info) => {
      if (err) return next(err)
      if (!user) return res.status(400).json({ message: info.message })
      req.logIn(user, (err) => {
        if (err) return next(err)
        res.json(user)
      })
    })(req, res, next)
  }

  static logout(req, res) {
    req.logout()
    if (err) return res.status(500).json({ message: 'Logout failed' })
      res.json({ message: 'Logged out successfully' })
  }
}

export default AuthController
