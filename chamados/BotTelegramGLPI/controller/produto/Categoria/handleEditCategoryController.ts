import { Scenes, Markup } from 'telegraf';
import { MyContext } from '../../../src/types/MyContext';
import { stage } from '../../../src/config/botConfig';
import { EditCategory } from '../../../src/produto/categoria/editCategory';

const { BaseScene, Stage } = Scenes;

const handleEditCategory = new BaseScene<MyContext>('editCategory');
handleEditCategory.enter(async (ctx) =>{
  await ctx.reply('Digite o novo nome para categoria que selecionou!')
})
handleEditCategory.on('text', async (ctx) =>{
  const newName = (ctx.message as any).text;
  const idCategoryReference = ctx.session.categoryId || 1;
  
  if (!newName || newName.trim().length === 0) {
    await ctx.reply('O nome da categoria não pode ser vazio. Tente novamente.');
    return;
  }

  try {
    const editCategory = new EditCategory();
    await editCategory.execute({ idCategoryReference, newName });
    await ctx.reply(`Categoria editada com sucesso!`, {
      reply_markup: {
        inline_keyboard: [
          [
            { text: 'Voltar', callback_data: 'voltar_inicial' },
          ],
        ],
      },
    });
  } catch (error) {
    console.error('Erro ao editar categoria:', error);
    await ctx.reply('Houve um erro ao editar a categoria. Tente novamente mais tarde.');
  }
})
export default handleEditCategory