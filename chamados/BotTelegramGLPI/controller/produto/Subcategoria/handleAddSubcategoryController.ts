import { Scenes, Markup } from 'telegraf';
import { MyContext } from '../../../src/types/MyContext';
import { stage } from '../../../src/config/botConfig';
import { AddSubCategory } from '../../../src/produto/subcategoria/addSubcategory';

const { BaseScene, Stage } = Scenes;

const handleAddSubCategory = new BaseScene<MyContext>('addSubcategory');
handleAddSubCategory.enter(async (ctx) => {
  const message = await ctx.reply('Por favor, envie o nome da nova subcategoria:');
  setTimeout(async () => {
    try {
      await ctx.deleteMessage(message.message_id);
    } catch (error) {
      console.error('Erro ao deletar a mensagem:', error);
    }
  }, 5000);
});
handleAddSubCategory.on('text', async (ctx) =>{
  const idCategoryReference = ctx.session.categoryId || 1;
  const nameSubCategory = ctx.message.text.trim();
  try {
    // Lógica para adicionar subcategoria
    const addSubCategory = new AddSubCategory();
    const execute = await addSubCategory.execute({
      nameSubCategory,
      idCategoryReference,
    });

    // Envia a resposta ao usuário
    const message = execute.sucess
      ? `Subcategoria "${nameSubCategory}" adicionada com sucesso!`
      : `Subcategoria já existe. Nome: ${execute.name}`;

    await ctx.reply(message, {
      reply_markup: Markup.inlineKeyboard([
        [
          {text: 'Voltar', callback_data: 'voltar_inicial'}
        ]
      ]).reply_markup,
    });
    ctx.scene.leave();
    await ctx.deleteMessage();
  } catch (error) {
    console.error('Erro ao adicionar subcategoria:', error);
    await ctx.reply('Erro ao adicionar a subcategoria. Tente novamente.');
    ctx.scene.leave();
  }
});
export default handleAddSubCategory