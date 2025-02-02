const express = require('express');
const cors = require('cors');
const config = require('./config/config');
const chatRoutes = require('./routes/chatRoutes');

const app = express();

// CORS configuration
const corsOptions = {
  origin: '*', // В продакшені тут має бути конкретний домен
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.static('public'));

// Додаємо логування запитів
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} ${req.method} ${req.url}`);
  next();
});

// Routes
app.use('/api', chatRoutes);

// Serve static files
app.get('/', (req, res) => {
  console.log('Отримано запит на головну сторінку');
  res.sendFile('index.html', { root: './public' });
});

// Error handling
app.use((err, req, res, next) => {
  console.error('Помилка сервера:', err);
  res.status(500).json({ 
    error: 'Внутрішня помилка сервера',
    success: false,
    details: err.message
  });
});

// Start server
const server = app.listen(config.server.port, () => {
  console.log(`🚀 Сервер запущено на порту ${config.server.port}`);
  console.log('📁 Статичні файли обслуговуються з:', './public');
  console.log('🌐 API доступне за адресою:', `/api`);
}); 