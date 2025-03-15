import { Markup } from 'telegraf';
import { MyContext } from '../types/MyContext';
import { renderInitialMenu } from './renderMenu';

export const welcomeMessage = async (ctx: MyContext) => {
  const userId = String(ctx.from?.id);
  const username = String(ctx.from?.first_name);
  ctx.session.userName = username;
  ctx.session.idUser = userId;

  if (userId === process.env.ID_USER || userId === '1000026242') {
    await renderInitialMenu(ctx);
  } else {
    const welcomeMsg = `
      <b>Olá, ${username}! Seja bem-vindo(a)!</b>
      <b>Você está no Sua Loja Aqui Bot</b>
      <b>Garantimos Acesso em Todos os Logins ✅</b>`;
    await ctx.reply(welcomeMsg, { parse_mode: 'HTML' });
    await ctx.replyWithPhoto('https://imgur.com/a/DKxJgp6');
    await ctx.reply('Escolha uma opção:', {
      reply_markup: Markup.inlineKeyboard([
        [
          { text: '📦 COMPRAR', callback_data: 'comprar' },
          { text: '💸 ADD SALDO', callback_data: 'add_saldo' },
        ],
      ]).reply_markup,
    });
  }
};
