import { Scenes, Markup } from 'telegraf';
import { MyContext } from '../../../src/types/MyContext';
import { stage } from '../../../src/config/botConfig';

const { BaseScene, Stage } = Scenes;

const handleCategoryOptions = new BaseScene<MyContext>('categoryOptions');
handleCategoryOptions.enter(async (ctx) => {
  const userName = ctx.session.userName
  try {
    const idCategoryReference = ctx.session.categoryId; 
    await ctx.reply(`Olá ${userName ?? 'Usuário'}, escolha uma ação:`, {
      reply_markup: Markup.inlineKeyboard(
          [
            [{ text: 'Adicionar Subcategoria', callback_data: `add_subcategoria_${idCategoryReference}` }],
            [{ text: 'Listar Subcategorias', callback_data: `list_subcategoria_${idCategoryReference}` }],
            [{ text: 'Editar Categoria', callback_data: `edit_categoria_${idCategoryReference}` }],
            [{ text: 'Deletar Categoria', callback_data: `delete_category_${idCategoryReference}`}],
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

export default handleCategoryOptions