import TelegramBot from "node-telegram-bot-api";
import dataBot from './values.js'

const bot = new TelegramBot(dataBot.token, { polling: true });

const mediaGroups = new Map();


bot.on('message', (msg) => {
    const chatId = msg.chat.id;
    const messageId = msg.message_id;

    if (msg.photo) {
        // Якщо це фото, перевіряємо на наявність галереї
        if (msg.media_group_id) {
            // Додаємо повідомлення до групи
            if (!mediaGroups.has(msg.media_group_id)) {
                mediaGroups.set(msg.media_group_id, []);
            }
            mediaGroups.get(msg.media_group_id).push({
                type: 'photo',
                media: msg.photo[msg.photo.length - 1].file_id // Використовуємо file_id
            });

            // Чекаємо на закінчення збору медіа (наприклад, 1 секунда)
            setTimeout(() => {
                const mediaGroup = mediaGroups.get(msg.media_group_id);
                if (mediaGroup) {
                    mediaGroups.delete(msg.media_group_id); // Очистка після пересилання
                    // Пересилаємо галерею
                    dataBot.targetIds.forEach(targetId => {
                        bot.sendMediaGroup(targetId, mediaGroup)
                            .then(() => console.log(`Галерея переслана на ID ${targetId}`))
                            .catch(err => console.error(`Помилка пересилання галереї на ID ${targetId}:`, err));
                    });
                }
            }, 1000);
        } else {
            // Якщо це окреме фото, пересилаємо одразу
            dataBot.targetIds.forEach(targetId => {
                bot.sendPhoto(targetId, msg.photo[msg.photo.length - 1].file_id)
                    .then(() => console.log(`Фото переслано на ID ${targetId}`))
                    .catch(err => console.error(`Помилка пересилання фото на ID ${targetId}:`, err));
            });
        }
    } else {
        // Якщо це не фото, пересилаємо як звичайне повідомлення
        dataBot.targetIds.forEach(targetId => {
            bot.forwardMessage(targetId, chatId, messageId)
                .then(() => console.log(`Повідомлення переслано на ID ${targetId}`))
                .catch(err => console.error(`Помилка пересилання повідомлення на ID ${targetId}:`, err));
        });
    }
});
