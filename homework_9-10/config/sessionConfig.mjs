import session from 'express-session'
import MongoStore from 'connect-mongo'
import config from './default.mjs'

export default function setupSession(app) {
    app.use(
      session({
        secret: config.secretKey, 
        resave: false,
        saveUninitialized: false,
        cookie: {
          maxAge: 1000 * 60 * 60 * 24, // 1 день
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production', // Захищені куки у production
        },
        store: MongoStore.create({
          mongoUrl: config.mongoURI, 
          collectionName: 'sessions', 
        }),
      })
    )
  }
