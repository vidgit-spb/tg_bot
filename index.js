const TelegramAPi = require ('node-telegram-bot-api');

const token = '1815757217:AAF_KLVC1LMO0sNYqa0KT-XUjA-jeO-eAKY';
const chats = {};

const gameOptions = {
    reply_markup: JSON.stringify({
        inline_keyboard: [
            [{text: '1', callback_data: '1'},{text: '2', callback_data: '2'},{text: '3', callback_data: '3'}],
            [{text: '4', callback_data: '4'},{text: '5', callback_data: '5'},{text: '6', callback_data: '6'}],
            [{text: '7', callback_data: '7'},{text: '8', callback_data: '8'},{text: '9', callback_data: '9'}],
            [{text: '4', callback_data: '0'}],
        ]
    })
}


const againOptions = {
    reply_markup: JSON.stringify({
        inline_keyboard: [
            [{text: 'Играть ещё раз', callback_data: '/again'}],
        
        ]
    })
}
const bot = new TelegramAPi(token, {polling: true});

bot.on('polling_error', console.log);

const startGame = async (chatId)=>{
    await bot.sendMessage(chatId, `Загадай число от 0 до 10` );
    const randomMath = Math.floor(Math.random() * 10);
    chats[chatId] = randomMath;
    await bot.sendMessage(chatId, 'Отгадывай',gameOptions);
}
const start = () =>{
    


bot.setMyCommands([
    {command: '/start', description: 'Начальное приветствие'},
    {command: '/info', description: 'Информация'},
    {command: '/game', description: 'Игра'},
])

  bot.on('message', async msg =>{
    const text = msg.text;
    const chatId = msg.chat.id;
    
    if (text === '/start'){
        await bot.sendSticker(chatId, 'https://tlgrm.ru/_/stickers/640/378/64037803-d6ce-34e3-ad93-f247ba1a719d/2.webp');
        return bot.sendMessage(chatId, 'Привет');
    }

    if (text === '/info'){
        return bot.sendMessage(chatId, `Тебя зовут ${msg.from.first_name}` );
    }

    if(text === '/game'){
         return startGame(chatId);

    }

    return bot.sendMessage(chatId,'Я тебя не понимаю')
})
}

bot.on('callback_query', msg => {
    const data = msg.data;
    const chatId = msg.message.chat.id;

    if(data == '/again'){
        return startGame(chatId);
       
    }
   
    if(data.toString() === chats[chatId]){
        return bot.sendMessage(chatId, `Ты угадал, поздравляю ${chats[chatId]}`,againOptions)
      
    }else{
        return bot.sendMessage(chatId, `Ты не угадал, я загадал ${chats[chatId]}`,againOptions)
        
    }
    
})

start();