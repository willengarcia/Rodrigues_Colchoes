import { bot } from './config/botConfig';
import './actions/actionsBot'
import { welcomeMessage } from './utils/welcomeMessage';

// Comando inicial
bot.start(welcomeMessage);

// Inicializa o bot
bot.launch();
console.log('Bot rodando...');
