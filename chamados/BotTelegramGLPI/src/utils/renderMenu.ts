import { Markup } from 'telegraf';
import { MyContext } from '../types/MyContext';
import { AddClient } from '../client/addClient';

export const renderInitialMenu = async (ctx: MyContext) => {
  const userName = ctx.session.userName;
  const userId = ctx.session.idUser;
  const message = await ctx.reply(`Olá ${userName ?? 'Usuário'}, escolha uma ação:`, {
    reply_markup: Markup.inlineKeyboard([
        [{ text: 'Adicionar Categoria', callback_data: 'add_categoria' }],
        [{ text: 'Listar Categoria', callback_data: 'list_categoria' }],
    ]).reply_markup,
  });
  ctx.session.idSentMessage = message.message_id;
  const addClient = new AddClient()
  const execute = await addClient.execute({username:userName, email:null, userId:userId})
  await ctx.deleteMessage();
};
