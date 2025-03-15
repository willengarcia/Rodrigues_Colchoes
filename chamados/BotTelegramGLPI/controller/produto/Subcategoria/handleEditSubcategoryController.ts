import { Scenes, Markup } from 'telegraf';
import { MyContext } from '../../../src/types/MyContext';
import { stage } from '../../../src/config/botConfig';
import { EditSubCategory } from '../../../src/produto/subcategoria/editSubCategory';

const { BaseScene, Stage } = Scenes;

const handleEditSubcategory = new BaseScene<MyContext>('editSubcategory');
handleEditSubcategory.enter(async (ctx) =>{
  await ctx.reply('Digite o novo nome para subcategoria que selecionou!')
})
handleEditSubcategory.on('text', async (ctx) =>{
  const nameSubCategory = (ctx.message as any).text;
  const idSubCategory = ctx.session.subcategoryId || 1;
  // Verifica se o nome da subcategoria é válido
  if (!nameSubCategory || nameSubCategory.trim().length === 0) {
    await ctx.reply('O nome não pode estar vazio. Tente novamente.');
    return;
  }

  try {
    // Chama o método para editar a subcategoria
    const editSubCategory = new EditSubCategory();
    await editSubCategory.execute({ idSubCategory, nameSubCategory })

    // Responde com a confirmação de sucesso
    await ctx.reply(`Subcategoria "${nameSubCategory}" editada com sucesso!`, {
      reply_markup: {
        inline_keyboard: [
          [{ text: 'Voltar', callback_data: 'voltar_inicial' }],
        ],
      },
    });

    console.log('Subcategoria alterada: ' + idSubCategory);
  } catch (error) {
    console.error('Erro ao editar a subcategoria:', error);
    await ctx.reply(
      'Houve um erro ao editar a subcategoria. Tente novamente mais tarde.'
    );
  }
})
export default handleEditSubcategory