import { Scenes, Markup } from 'telegraf';
import { MyContext } from '../../../src/types/MyContext';
import { FindAllItemToSubcategory } from '../../../src/produto/itens/findAllItensToSubcategory';

const { BaseScene, Stage } = Scenes;

const handleListItem = new BaseScene<MyContext>('listItem');
handleListItem.enter(async (ctx) => {
  try {
    const idSubcategoryReference = ctx.session.subcategoryId || 1;
    const findAllProdutoToSubcategory  = new FindAllItemToSubcategory();
    const execute = await findAllProdutoToSubcategory.execute({idSubcategoryReference})
    if (!execute.find || execute.find.length === 0) {
      await ctx.reply('Nenhum produto encontrada no momento.', {
        reply_markup: Markup.inlineKeyboard([
          [
            {text: 'Voltar', callback_data:'voltar_inicial'}
          ]
        ]).reply_markup,
      });
      ctx.scene.leave();
      return;
    }
    console.log(execute.find)
    // Gera os botões das categorias
    const ItemButtons = execute.find.map((item) => [
      {
        text: item.name,
        callback_data: `option_itens_${item.id}`,
      },
    ]);
    // Adiciona botão de voltar
    ItemButtons.push([{ text: 'Voltar', callback_data: 'voltar_inicial' }]);
    await ctx.reply('Selecione um Produto',  {
      reply_markup: Markup.inlineKeyboard([...ItemButtons]).reply_markup,
    })
    ctx.scene.leave();
    await ctx.deleteMessage();
  } catch (error) {
    console.error('Erro ao adicionar Listar o Produto:', error);
    await ctx.reply('Erro ao Listar o Produto. Tente novamente.');
    ctx.scene.leave();
  }
})
export default handleListItem