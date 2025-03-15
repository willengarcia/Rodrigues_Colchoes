import { Scenes, Markup } from 'telegraf';
import { MyContext } from '../../../src/types/MyContext';
import { stage } from '../../../src/config/botConfig';

const { BaseScene, Stage } = Scenes;

const handleSubcategoryOptions = new BaseScene<MyContext>('subcategoryOptions');
handleSubcategoryOptions.enter(async (ctx) => {
  try {
    const idSubCategoryReference = ctx.session.subcategoryId; 
    await ctx.reply(`Olá ${ctx.session?.userName ?? 'Usuário'}, escolha uma ação para subcategoria:`, {
      reply_markup: Markup.inlineKeyboard(
        [
          [{ text: 'Adicionar Produto', callback_data: `add_produto_${idSubCategoryReference}` }],
          [{ text: 'Listar produto', callback_data: `list_Produto_${idSubCategoryReference}` }],
          [{ text: 'Editar subcategoria', callback_data: `edit_subcategoria_${idSubCategoryReference}` }],
          [{ text: 'Deletar subcategoria', callback_data: `delete_subcategory_${idSubCategoryReference}` }]
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
export default handleSubcategoryOptions