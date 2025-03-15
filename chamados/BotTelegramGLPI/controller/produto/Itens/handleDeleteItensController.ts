import { Scenes, Markup } from 'telegraf';
import { MyContext } from '../../../src/types/MyContext';
import { DeleteItens } from '../../../src/produto/itens/deleteItens';

const { BaseScene, Stage } = Scenes;

const handleDeleteItem = new BaseScene<MyContext>('deleteItem');
handleDeleteItem.enter(async (ctx) =>{
  try {
    const IdItem = ctx.session.idItem || 1
    const deleteItem = new DeleteItens()
    const execute = await deleteItem.execute({IdItem})
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
      'Houve um erro ao Deletar o Produto. Tente novamente mais tarde. '+error, {
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
export default handleDeleteItem