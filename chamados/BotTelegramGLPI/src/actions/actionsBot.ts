import { bot } from '../config/botConfig';
import { renderInitialMenu } from '../utils/renderMenu';
import { MyContext } from '../types/MyContext';

// =================== Ações do Bot ===================

// Adiciona Categoria
bot.action('add_categoria', async (ctx: MyContext) => {
  if (ctx.session.idSentMessage) {
    await ctx.deleteMessage(ctx.session.idSentMessage);
  }
  ctx.scene.enter('addCategoria');
});

// Lista a Categoria
bot.action('list_categoria', async (ctx: MyContext) => {
  ctx.scene.enter('listCategoria');
});

// Mostra as opções da Categoria
bot.action(/categoria_options_(\d+)/, async (ctx: MyContext) => {
  const idCategoryReference = ctx.match[1];
  const userName = ctx.from.first_name+' '+ctx.from.last_name
  const userId = ctx.from.id
  if (!idCategoryReference) {
    console.error('ID da categoria não encontrado.');
    return;
  }

  ctx.session.categoryId = Number(idCategoryReference);
  ctx.session.idUser = String(userId)
  ctx.session.userName = userName
  ctx.scene.enter('categoryOptions');
});

// Adiciona Subcategoria
bot.action(/add_subcategoria_(\d+)/, async (ctx: MyContext) => {
  const idCategoryReference = ctx.match[1];
  const userName = ctx.from.first_name+' '+ctx.from.last_name
  ctx.session.userName = userName
  if (!idCategoryReference) {
    console.error('ID da categoria não encontrado.');
    return;
  }

  ctx.session.categoryId = Number(idCategoryReference);
  ctx.scene.enter('addSubcategory');
});

// Lista Subcategoria
bot.action(/list_subcategoria_(\d+)/, async (ctx: MyContext) => {
  const idCategoryReference = ctx.match[1];
  const userName = ctx.from.first_name+' '+ctx.from.last_name
  ctx.session.userName = userName
  if (!idCategoryReference) {
    console.error('ID da categoria não encontrado.');
    return;
  }

  ctx.session.categoryId = Number(idCategoryReference);
  ctx.scene.enter('listSubcategory');
});

// Mostrar opções da Subcategoria
bot.action(/option_subcategoria_(\d+)/, async (ctx: MyContext) => {
  const idSubCategoryReference = ctx.match[1];
  const userName = ctx.from.first_name+' '+ctx.from.last_name
  ctx.session.userName = userName
  if (!idSubCategoryReference) {
    console.error('ID da subcategoria não encontrado.');
    return;
  }

  ctx.session.subcategoryId = Number(idSubCategoryReference);
  ctx.scene.enter('subcategoryOptions');
});

// Editar Categoria
bot.action(/edit_categoria_(\d+)/, async (ctx: MyContext) => {
  const idCategoryReference = ctx.match[1];
  const userName = ctx.from.first_name+' '+ctx.from.last_name
  ctx.session.userName = userName
  if (!idCategoryReference) {
    console.error('ID da categoria não encontrado.');
    return;
  }

  ctx.session.categoryId = Number(idCategoryReference);
  ctx.scene.enter('editCategory');
});

// Editar Subcategoria
bot.action(/edit_subcategoria_(\d+)/, async (ctx: MyContext) => {
  const idSubCategoryReference = ctx.match[1];
  const userName = ctx.from.first_name+' '+ctx.from.last_name
  ctx.session.userName = userName
  if (!idSubCategoryReference) {
    console.error('ID da subcategoria não encontrada.');
    return;
  }

  ctx.session.subcategoryId = Number(idSubCategoryReference);
  ctx.scene.enter('editSubcategory');
});

// Deletar Categoria
bot.action(/delete_category_(\d+)/, async (ctx: MyContext) => {
  const idCategoryReference = ctx.match[1];
  const userName = ctx.from.first_name+' '+ctx.from.last_name
  ctx.session.userName = userName
  if (!idCategoryReference) {
    console.error('ID da categoria não encontrado.');
    return;
  }

  ctx.session.categoryId = Number(idCategoryReference);
  ctx.scene.enter('deleteCategory');
});

// Deletar Subcategoria
bot.action(/delete_subcategory_(\d+)/, async (ctx: MyContext) => {
  const idSubCategory = ctx.match[1];
  const userName = ctx.from.first_name+' '+ctx.from.last_name
  ctx.session.userName = userName
  if (!idSubCategory) {
    console.error('ID da subcategoria não encontrado.');
    return;
  }

  ctx.session.subcategoryId = Number(idSubCategory);
  ctx.scene.enter('deleteSubcategory');
});

// Adicionar Produto
bot.action(/add_produto_(\d+)/, async (ctx: MyContext) => {
  const idSubCategory = ctx.match[1];
  const userName = ctx.from.first_name+' '+ctx.from.last_name
  ctx.session.userName = userName
  if (!idSubCategory) {
    console.error('ID da categoria não encontrado.');
    return;
  }

  ctx.session.categoryId = Number(idSubCategory);
  ctx.scene.enter('addItem');
});

// Listar Produto
bot.action(/list_Produto_(\d+)/, async (ctx: MyContext) => {
  const idSubCategoryReference = ctx.match[1];
  const userName = ctx.from.first_name+' '+ctx.from.last_name
  ctx.session.userName = userName
  if (!idSubCategoryReference) {
    console.error('ID da categoria não encontrado.');
    return;
  }

  ctx.session.subcategoryId = Number(idSubCategoryReference);
  ctx.scene.enter('listItem');
});

// Mostrar opções do Produto
bot.action(/option_itens_(\d+)/, async (ctx: MyContext) => {
  const idItem = ctx.match[1];
  const userName = ctx.from.first_name+' '+ctx.from.last_name
  ctx.session.userName = userName
  if (!idItem) {
    console.error('ID da subcategoria não encontrado.');
    return;
  }

  ctx.session.idItem = Number(idItem);
  ctx.scene.enter('itemOptions');
});

// Editar Produto
bot.action(/edit_produto_(\d+)/, async (ctx: MyContext) => {
  const idSubCategoryReference = ctx.match[1];
  const userName = ctx.from.first_name+' '+ctx.from.last_name
  ctx.session.userName = userName
  if (!idSubCategoryReference) {
    console.error('ID da subcategoria não encontrada.');
    return;
  }

  ctx.session.subcategoryId = Number(idSubCategoryReference);
  ctx.scene.enter('editItem');
});

bot.action(/info_produto_(\d+)/, async (ctx: MyContext) => {
  const idItem = ctx.match[1];
  const userName = ctx.from.first_name+' '+ctx.from.last_name
  ctx.session.userName = userName
  if (!idItem) {
    console.error('ID do Item não encontrado.');
    return;
  }

  ctx.session.idItem = Number(idItem);
  ctx.scene.enter('infoItem');
});

// Deletar Produto
bot.action(/delete_produto_(\d+)/, async (ctx: MyContext) => {
  const IdItem = ctx.match[1];
  const userName = ctx.from.first_name+' '+ctx.from.last_name
  ctx.session.userName = userName
  if (!IdItem) {
    console.error('ID da categoria não encontrado.');
    return;
  }

  ctx.session.idItem = Number(IdItem);
  ctx.scene.enter('deleteItem');
});

// Voltar ao menu Inicial
bot.action('voltar_inicial', async (ctx: MyContext) => {
  try {
    await ctx.answerCbQuery();
    await renderInitialMenu(ctx);
  } catch (error) {
    console.error('Erro ao voltar ao menu inicial:', error);
  }
});
