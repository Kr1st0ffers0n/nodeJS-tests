const googleAIService = require('../services/googleAIService');
const elevenLabsService = require('../services/elevenLabsService');

class ChatController {
  async handleMessage(req, res) {
    try {
      console.log('Отримано повідомлення:', req.body);
      
      const { message, language } = req.body;

      if (!message) {
        console.log('Помилка: порожнє повідомлення');
        return res.status(400).json({ 
          error: 'Повідомлення не може бути порожнім',
          success: false 
        });
      }

      console.log('Генеруємо відповідь...');
      const response = await googleAIService.generateResponse(message, language);
      console.log('Відповідь згенеровано:', response);
      
      res.json({ 
        response,
        success: true
      });
    } catch (error) {
      console.error('Chat Controller Error:', error);
      
      // Визначаємо тип помилки
      let statusCode = 500;
      let errorMessage = 'Внутрішня помилка сервера';
      
      if (error.message.includes('API key')) {
        statusCode = 401;
        errorMessage = 'Помилка автентифікації';
      } else if (error.message.includes('rate limit')) {
        statusCode = 429;
        errorMessage = 'Перевищено ліміт запитів';
      } else if (error.message.includes('Safety')) {
        statusCode = 400;
        errorMessage = 'Повідомлення не відповідає правилам безпеки';
      }
      
      res.status(statusCode).json({ 
        error: errorMessage,
        success: false,
        details: error.message
      });
    }
  }

  async clearHistory(req, res) {
    try {
      console.log('Очищення історії чату...');
      googleAIService.clearHistory();
      console.log('Історію чату очищено');
      
      res.json({ 
        message: 'Історію чату очищено',
        success: true 
      });
    } catch (error) {
      console.error('Clear History Error:', error);
      res.status(500).json({ 
        error: 'Помилка при очищенні історії',
        success: false 
      });
    }
  }

  async textToSpeech(req, res) {
    try {
      console.log('Отримано запит на озвучування:', req.body);
      const { text } = req.body;

      if (!text) {
        return res.status(400).json({
          error: 'Текст не може бути порожнім',
          success: false
        });
      }

      console.log('Генеруємо аудіо...');
      const audioBuffer = await elevenLabsService.textToSpeech(text);
      console.log('Аудіо згенеровано');

      res.set({
        'Content-Type': 'audio/mpeg',
        'Content-Length': audioBuffer.length
      });

      res.send(audioBuffer);
    } catch (error) {
      console.error('Text-to-Speech Error:', error);
      res.status(500).json({
        error: 'Помилка при генерації аудіо',
        success: false,
        details: error.message
      });
    }
  }
}

module.exports = new ChatController(); 