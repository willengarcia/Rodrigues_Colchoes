import { Scenes, Markup } from 'telegraf';
import { MyContext } from '../../../src/types/MyContext';
import { stage } from '../../../src/config/botConfig';
import { AddCategory } from '../../../src/produto/categoria/addCategory';

const { BaseScene, Stage } = Scenes;
// Define a cena para adicionar categoria
const handleAddCategory = new BaseScene<MyContext>('addCategoria');

handleAddCategory.enter(async (ctx) => {
  const message = await ctx.reply('Por favor, envie o nome da nova categoria:');
  setTimeout(async () => {
    try {
      await ctx.deleteMessage(message.message_id);
    } catch (error) {
      console.error('Erro ao deletar a mensagem:', error);
    }
  }, 5000);
});

handleAddCategory.on('text', async (ctx) => {
  const name = ctx.message.text.trim();
  try {
    const addCategory = new AddCategory();
    await addCategory.execute({ name });
    await ctx.reply(`Categoria "${name}" adicionada com sucesso!`, {
      reply_markup: Markup.inlineKeyboard([
        [{ text: 'Voltar', callback_data: 'voltar_inicial' }],
      ]).reply_markup,
    });
    ctx.scene.leave();
  } catch (error) {
    console.error('Erro ao adicionar categoria:', error);
    await ctx.reply('Erro ao adicionar a categoria. Tente novamente.');
    ctx.scene.leave();
  }
});
export default handleAddCategory
