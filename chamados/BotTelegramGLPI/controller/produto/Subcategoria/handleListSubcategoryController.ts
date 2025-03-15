import { Scenes, Markup } from 'telegraf';
import { MyContext } from '../../../src/types/MyContext';
import { stage } from '../../../src/config/botConfig';
import { FindAllSubCategoryToCategory } from '../../../src/produto/subcategoria/findAllSubCategoryToCategory';

const { BaseScene, Stage } = Scenes;

const handleListSubCategory = new BaseScene<MyContext>('listSubcategory');
handleListSubCategory.enter(async (ctx) => {
  try {
    const idCategoryReference = ctx.session.categoryId || 1;
    const findAllSubToCategory  = new FindAllSubCategoryToCategory();
    const executeCategory = await findAllSubToCategory.execute({idCategoryReference});
    if (!executeCategory.find || executeCategory.find.length === 0) {
      await ctx.reply('Nenhuma categoria encontrada no momento.', {
        reply_markup: Markup.inlineKeyboard([
          [
            {text: 'Voltar', callback_data:'voltar_inicial'}
          ]
        ]).reply_markup,
      });
      ctx.scene.leave();
      return;
    }
    // Gera os botões das categorias
    const categoryButtons = executeCategory.find.map((category) => [
      {
        text: category.name,
        callback_data: `option_subcategoria_${category.id}`,
      },
    ]);
    // Adiciona botão de voltar
    categoryButtons.push([{ text: 'Voltar', callback_data: 'voltar_inicial' }]);
    await ctx.reply('Selecione uma Subcategoria',  {
      reply_markup: Markup.inlineKeyboard([...categoryButtons]).reply_markup,
    })
    ctx.scene.leave();
    await ctx.deleteMessage();
  } catch (error) {
    console.error('Erro ao adicionar Listar a Categoria:', error);
    await ctx.reply('Erro ao Listar a categoria. Tente novamente.');
    ctx.scene.leave();
  }
})
export default handleListSubCategory