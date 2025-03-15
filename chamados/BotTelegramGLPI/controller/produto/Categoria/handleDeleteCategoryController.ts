import { Scenes, Markup } from 'telegraf';
import { MyContext } from '../../../src/types/MyContext';
import { stage } from '../../../src/config/botConfig';
import { DeleteCategory } from '../../../src/produto/categoria/deleteCategory';

const { BaseScene, Stage } = Scenes;

const handleDeleteCategory = new BaseScene<MyContext>('deleteCategory');
handleDeleteCategory.enter(async (ctx) =>{
  try {
    const idCategoryReference = ctx.session.categoryId || 1
    const deleteCategory = new DeleteCategory()
    const execute = await deleteCategory.execute({idCategory:idCategoryReference})
    if(execute.sucess === false){
      await ctx.reply(
        `${execute.message}`, {
          reply_markup: {
            inline_keyboard: [
              [
                { text: 'Voltar', callback_data: 'voltar_inicial' },
              ],
            ],
          },
        }
      );
      return;
    }else{
      await ctx.reply(
       `${execute.message}`, {
        reply_markup: {
          inline_keyboard: [
            [
              { text: 'Voltar', callback_data: 'voltar_inicial' },
            ],
          ],
        },
      }
      );
    }
  } catch (error) {
    await ctx.reply(
      'Houve um erro ao editar a subcategoria. Tente novamente mais tarde. '+error, {
        reply_markup: {
          inline_keyboard: [
            [
              { text: 'Voltar', callback_data: 'voltar_inicial' },
            ],
          ],
        },
      }
    );
  }
})
export default handleDeleteCategory