const { GoogleGenerativeAI } = require('@google/generative-ai');
const config = require('../config/config');
const axios = require('axios');

class GoogleAIService {
  constructor() {
    this.genAI = new GoogleGenerativeAI(config.google.apiKey);
    this.model = this.genAI.getGenerativeModel({ model: "gemini-pro" });
    this.chatHistory = [];
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

  async generateResponse(userMessage, language) {
    try {
      // Створюємо новий чат з історією
      const chat = this.model.startChat({
        history: this.chatHistory,
        generationConfig: {
          temperature: 0.7,
          topK: 1,
          topP: 1,
          maxOutputTokens: 2048,
        },
      });

      // Додаємо системний промпт, якщо історія порожня
      if (this.chatHistory.length === 0) {
        const systemResult = await chat.sendMessage(config.bot.systemPrompt);
        this.chatHistory.push({
          role: "user",
          parts: config.bot.systemPrompt,
        });
        this.chatHistory.push({
          role: "model",
          parts: await systemResult.response.text(),
        });
      }

      // Відправляємо повідомлення користувача
      const result = await chat.sendMessage(userMessage);
      let responseText = await result.response.text();

      // Перевіряємо та форматуємо посилання у відповіді
      responseText = await this.validateAndFormatUrls(responseText);

      // Оновлюємо історію
      this.chatHistory.push({
        role: "user",
        parts: userMessage,
      });
      this.chatHistory.push({
        role: "model",
        parts: responseText,
      });

      // Обмежуємо історію до останніх 10 повідомлень
      if (this.chatHistory.length > 10) {
        this.chatHistory = this.chatHistory.slice(-10);
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

  // Метод для очищення історії чату
  clearHistory() {
    this.chatHistory = [];
  }
}

module.exports = new GoogleAIService(); 