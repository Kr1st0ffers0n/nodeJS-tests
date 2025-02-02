const { GoogleGenerativeAI } = require('@google/generative-ai');
const config = require('../config/config');
const axios = require('axios');

class GoogleAIService {
  constructor() {
    this.genAI = new GoogleGenerativeAI(config.google.apiKey);
    this.model = this.genAI.getGenerativeModel({ model: "gemini-pro" });
    this.chats = new Map(); // Зберігаємо окремі чати для кожного користувача
    this.websiteUrl = config.website.url;
  }

  // Перевірка доступності URL
  async isUrlValid(url) {
    try {
      const response = await axios.head(url);
      return response.status === 200;
    } catch (error) {
      console.error('URL validation error:', error.message);
      return false;
    }
  }

  // Перевірка та форматування посилань у тексті
  async validateAndFormatUrls(text) {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const urls = text.match(urlRegex) || [];
    
    for (const url of urls) {
      if (url.startsWith(this.websiteUrl)) {
        const isValid = await this.isUrlValid(url);
        if (!isValid) {
          // Якщо посилання недійсне, замінюємо його на базовий URL сайту
          text = text.replace(url, this.websiteUrl);
        }
      }
    }
    
    return text;
  }

  // Форматування тексту для Telegram (HTML)
  formatForTelegram(text) {
    // Замінюємо URL на клікабельні посилання
    text = text.replace(/(https?:\/\/[^\s]+)/g, '<a href="$1">$1</a>');
    
    // Додаємо базове HTML форматування
    text = text.replace(/\*\*(.*?)\*\*/g, '<b>$1</b>'); // **жирний текст**
    text = text.replace(/\*(.*?)\*/g, '<i>$1</i>'); // *курсив*
    
    return text;
  }

  async generateResponse(userId, userMessage) {
    try {
      // Отримуємо або створюємо новий чат для користувача
      if (!this.chats.has(userId)) {
        const chat = this.model.startChat();
        this.chats.set(userId, {
          chat,
          history: []
        });
        
        // Додаємо системний промпт для нового чату
        await chat.sendMessage(config.bot.systemPrompt);
      }

      const userChat = this.chats.get(userId);
      
      // Відправляємо повідомлення користувача
      const result = await userChat.chat.sendMessage(userMessage);
      let responseText = await result.response.text();

      // Перевіряємо та форматуємо посилання
      responseText = await this.validateAndFormatUrls(responseText);
      
      // Форматуємо текст для Telegram
      responseText = this.formatForTelegram(responseText);

      // Оновлюємо історію
      userChat.history.push({
        role: "user",
        message: userMessage
      });
      userChat.history.push({
        role: "bot",
        message: responseText
      });

      // Обмежуємо історію до останніх 10 повідомлень
      if (userChat.history.length > 20) {
        userChat.history = userChat.history.slice(-20);
      }

      return responseText;
    } catch (error) {
      console.error('Google AI API Error:', error);
      if (error.message.includes('API key')) {
        throw new Error('Помилка автентифікації API ключа');
      }
      throw new Error('Помилка при генерації відповіді: ' + error.message);
    }
  }

  // Метод для очищення історії конкретного користувача
  clearHistory(userId) {
    if (this.chats.has(userId)) {
      const chat = this.model.startChat();
      this.chats.set(userId, {
        chat,
        history: []
      });
    }
  }
}

module.exports = new GoogleAIService(); 