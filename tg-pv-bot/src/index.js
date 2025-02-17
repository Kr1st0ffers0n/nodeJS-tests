const { Telegraf, Markup } = require('telegraf');
const config = require('./config/config');
const googleAIService = require('./services/googleAIService');

// Створюємо екземпляр бота
const bot = new Telegraf(config.telegram.token);

// Обробка команди /start
bot.command('start', async (ctx) => {
  const welcomeMessage = `
Вітаю! 👋 

Я - віртуальний асистент компанії "Перша Віза". Я допоможу вам знайти роботу в Європі або відповім на ваші запитання щодо наших послуг.

Ось що я можу:
• 🔍 Пошук вакансій
• 🌍 Інформація про роботу в різних країнах
• 📄 Допомога з документами
• ❓ Відповіді на загальні питання

Оберіть опцію або просто напишіть ваше питання:
`;

  const keyboard = Markup.keyboard([
    ['🔍 Пошук вакансій', '🌍 Країни'],
    ['📄 Необхідні документи', '❓ Часті питання'],
    ['🧹 Очистити історію']
  ]).resize();

  await ctx.reply(welcomeMessage, keyboard);
});

// Обробка команди /help
bot.command('help', (ctx) => {
  const helpMessage = `
Ось список доступних команд:

/start - Почати спілкування
/help - Показати це повідомлення
/clear - Очистити історію чату

Ви також можете просто написати своє питання, і я спробую допомогти!
`;
  ctx.reply(helpMessage);
});

// Обробка команди /clear
bot.command('clear', async (ctx) => {
  const userId = ctx.from.id;
  googleAIService.clearHistory(userId);
  await ctx.reply('Історію чату очищено! 🧹');
});

// Обробка кнопки очищення історії
bot.hears('🧹 Очистити історію', async (ctx) => {
  const userId = ctx.from.id;
  googleAIService.clearHistory(userId);
  await ctx.reply('Історію чату очищено! 🧹');
});

// Обробка текстових повідомлень
bot.on('text', async (ctx) => {
  const userId = ctx.from.id;
  const userMessage = ctx.message.text;

  // Якщо це не службова команда
  if (!userMessage.startsWith('/')) {
    try {
      // Показуємо "друкує..."
      await ctx.sendChatAction('typing');

      // Отримуємо відповідь від AI
      const response = await googleAIService.generateResponse(userId, userMessage);

      // Відправляємо відповідь з HTML-форматуванням
      await ctx.reply(response, {
        parse_mode: 'HTML',
        disable_web_page_preview: false
      });
    } catch (error) {
      console.error('Error:', error);
      await ctx.reply('Вибачте, сталася помилка. Спробуйте ще раз або зверніться до адміністратора.');
    }
  }
});

// Обробка помилок
bot.catch((err, ctx) => {
  console.error(`Помилка для ${ctx.updateType}`, err);
  ctx.reply('Сталася помилка при обробці вашого запиту. Спробуйте ще раз.');
});

// Запуск бота
bot.launch()
  .then(() => {
    console.log('🤖 Бот успішно запущено!');
  })
  .catch((err) => {
    console.error('Помилка запуску бота:', err);
  });

// Включаємо плавне завершення роботи
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM')); 