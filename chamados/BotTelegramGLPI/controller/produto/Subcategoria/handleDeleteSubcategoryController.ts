import { Scenes, Markup } from 'telegraf';
import { MyContext } from '../../../src/types/MyContext';
import { stage } from '../../../src/config/botConfig';
import { DeleteSubCategory } from '../../../src/produto/subcategoria/deleteSubCategory';

const { BaseScene, Stage } = Scenes;

const handleDeleteSubcategory = new BaseScene<MyContext>('deleteSubcategory');
handleDeleteSubcategory.enter(async (ctx) =>{
  try {
    const idSubCategory = ctx.session.subcategoryId || 1
    const deleteSubcategory = new DeleteSubCategory()
    const execute = await deleteSubcategory.execute({idSubCategory})
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
export default handleDeleteSubcategory