const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');

// Маршрут для обробки повідомлень
router.post('/message', chatController.handleMessage.bind(chatController));

// Маршрут для очищення історії чату
router.post('/clear-history', chatController.clearHistory.bind(chatController));

// Маршрут для озвучування тексту
router.post('/text-to-speech', chatController.textToSpeech.bind(chatController));

module.exports = router; 