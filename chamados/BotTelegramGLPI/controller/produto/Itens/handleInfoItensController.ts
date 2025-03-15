import { Scenes, Markup } from 'telegraf';
import { MyContext } from '../../../src/types/MyContext';
import { FindAllInfoFromItem } from '../../../src/produto/itens/findIntensInfo';

const { BaseScene, Stage } = Scenes;

type ItemType = {
  id: number;
  name: string;
  imagePath?: string;
  link?: string;
  price?: number;
  sales?: number;
  category?: { name: string };
  subCategory?: { name: string };
};

const handleListItem = new BaseScene<MyContext>('infoItem');
handleListItem.enter(async (ctx) => {
  try {
    const idItem = ctx.session.idItem || 1;
    const findAllItemFromItem = new FindAllInfoFromItem();
    
    // Garantir que a tipagem está correta
    const execute = await findAllItemFromItem.execute({ idItem }) as { 
      sucess?: boolean; 
      find?: ItemType | ItemType[] | null;
    };

    console.log("Retorno do execute:", execute);

    // Se find for um objeto único, transformá-lo em array
    const findArray = Array.isArray(execute.find) ? execute.find : [execute.find];

    console.log("Itens encontrados:", findArray);

    // Formatar a resposta no estilo HTML
    const formattedMessage = findArray
      .map((item) => `
          <strong>📦 ${item.name}</strong>
          <b>🏷️ Subcategoria: ${item.subCategory ? item.subCategory.name : 'N/A'}</b>
          <b>💰 Preço: R$${item.price?.toFixed(2) || 'N/A'}</b>
          <b>🔗 <a href="${item.link || '#'}">Ver Produto</a></b>
          <b>🖼️ <a href="${item.imagePath || '#'}">Clique aqui</a></b>
      `)
      .join('\n\n');

    // Enviar a mensagem formatada
    await ctx.reply(formattedMessage, {
      parse_mode: 'HTML', // Usando HTML ao invés de Markdown
      reply_markup: Markup.inlineKeyboard([
        [{ text: 'Voltar', callback_data: 'voltar_inicial' }],
      ]).reply_markup,
    });

    ctx.scene.leave();
    await ctx.deleteMessage();
  } catch (error) {
    console.error('Erro ao listar o produto:', error);
    await ctx.reply('Erro ao listar o produto. Tente novamente.');
    ctx.scene.leave();
  }
});

export default handleListItem;
