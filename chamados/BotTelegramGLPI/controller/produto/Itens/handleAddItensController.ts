import { Scenes, Markup } from 'telegraf';
import { MyContext } from '../../../src/types/MyContext';
import { AddItem } from '../../../src/produto/itens/addItens'
const { BaseScene, Stage } = Scenes;

const handleAddItem = new BaseScene<MyContext>('addItem');
handleAddItem.enter(async (ctx) => {
  const message = await ctx.reply('Por favor, envie o nome do Produto no seguinte formato: \n produto \n preco \n link \n foto')
});
handleAddItem.on('text', async (ctx) =>{
  const idSubcateogryReference = ctx.session.subcategoryId
  const [nameItem, price, link, imagePath] = ctx.message.text.trim().split(/\r?\n/);
  try {
    // Lógica para adicionar subcategoria
    const addItem = new AddItem();
    const execute = await addItem.execute({
      nameItem,
      price,
      link,
      imagePath,
      idSubcateogryReference
    });

    // Envia a resposta ao usuário
    const message = execute.sucess
      ? `Produto "${nameItem}" adicionado com sucesso!`
      : `Produto já existe. Nome: ${execute.name}`;

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
    console.error('Erro ao adicionar Produto:', error);
    await ctx.reply('Erro ao adicionar o Produto. Tente novamente.');
    ctx.scene.leave();
  }
});
export default handleAddItem