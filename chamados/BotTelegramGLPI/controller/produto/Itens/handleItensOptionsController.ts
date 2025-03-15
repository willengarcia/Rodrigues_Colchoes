import { Scenes, Markup } from 'telegraf';
import { MyContext } from '../../../src/types/MyContext';

const { BaseScene, Stage } = Scenes;

const handleItemOptions = new BaseScene<MyContext>('itemOptions');
handleItemOptions.enter(async (ctx) => {
  try {
    const idItem = ctx.session.idItem; 
    await ctx.reply(`Olá ${ctx.session?.userName ?? 'Usuário'}, escolha uma ação para o Produto:`, {
      reply_markup: Markup.inlineKeyboard(
        [
          [{ text: 'Editar produto', callback_data: `edit_produto_${idItem}` }],
          [{ text: 'Deletar produto', callback_data: `delete_produto_${idItem}` }],
          [{ text: 'Infor produto', callback_data: `info_produto_${idItem}` }],
          [{ text: 'Voltar', callback_data: 'voltar_inicial' }],
        ]
      ).reply_markup,
    });
    ctx.scene.leave();
    await ctx.deleteMessage();
  } catch (error) {
    console.error('Erro ao listar opções:', error);
    await ctx.reply('Erro ao listar as opções. Tente novamente.');
    ctx.scene.leave();
  }
});
export default handleItemOptions