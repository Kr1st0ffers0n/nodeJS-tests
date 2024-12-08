import config from '../config/default.mjs'
// Імпортуємо необхідний модуль
import mongoose from 'mongoose'

// Встановлюємо глобальні проміси
mongoose.Promise = global.Promise
// Функція для підключення до MongoDB
export default async function () {
  try {
    await mongoose.connect(config.mongoURI, {
      dbName: config.databaseName, // Використовуємо ім'я бази з .env
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    console.log('Успішно підключено до MongoDB')
    console.log(`✅ Connected to database: ${mongoose.connection.db.databaseName}`);
  } catch (err) {
    console.error('Помилка підключення до MongoDB:', err)
    console.error(`❌ Error connecting to database: ${error.message}`);
  }
}
