import TelegramBot from "node-telegram-bot-api";
import dataBot from './values.js'

const bot = new TelegramBot(dataBot.token, { polling: true });

bot.on('photo', (msg) => {
    const chatId = msg.chat.id; 
    const messageId = msg.message_id; 

    dataBot.targetIds.forEach(targetId => {
        bot.forwardMessage(targetId, chatId, messageId)
            .then(() => console.log(`Фото переслано на ID ${targetId}`))
            .catch(err => console.error(`Помилка пересилання на ID ${targetId}:`, err));
    });
});
