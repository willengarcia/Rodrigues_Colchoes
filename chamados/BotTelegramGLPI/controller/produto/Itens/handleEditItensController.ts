import { Scenes, Markup } from 'telegraf';
import { MyContext } from '../../../src/types/MyContext';
import { EditItens } from '../../../src/produto/itens/editItens';

const { BaseScene, Stage } = Scenes;

const handleEditItem = new BaseScene<MyContext>('editItem');
handleEditItem.enter(async (ctx) =>{
  await ctx.reply('Digite os novos dados para o Produto que selecionou no seguinte formato: \n Nome \n Preco \n Link \n Imagem \n')
})
handleEditItem.on('text', async (ctx) =>{
  const [nameItem, price, link, imagePath] = ctx.message.text.trim().split(/\r?\n/);
  const idItem = ctx.session.idItem || 1;
  // Verifica se o nome da subcategoria é válido
  if (!nameItem || nameItem.trim().length === 0) {
    await ctx.reply('O nome não pode estar vazio. Tente novamente.');
    return;
  }

  try {
    // Chama o método para editar a subcategoria
    const editItem = new EditItens();
    await editItem.execute({
      nameItem,
      idItem,
      price,
      link,
      imagePath})

    // Responde com a confirmação de sucesso
    await ctx.reply(`Produto "${nameItem}" editado com sucesso!`, {
      reply_markup: {
        inline_keyboard: [
          [{ text: 'Voltar', callback_data: 'voltar_inicial' }],
        ],
      },
    });
  } catch (error) {
    console.error('Erro ao editar o Produto:', error);
    await ctx.reply(
      'Houve um erro ao editar o Produto. Tente novamente mais tarde.'
    );
  }
})
export default handleEditItem