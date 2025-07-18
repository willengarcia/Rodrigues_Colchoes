require('dotenv').config();
const { Telegraf, Markup } = require('telegraf');
const axios = require('axios');
const he = require('he');

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);
const estadoUsuarios = {};

async function getSessionToken() {
  const { data } = await axios.get(`${process.env.GLPI_URL}/initSession`, {
    headers: {
      'App-Token': process.env.GLPI_APP,
      'Authorization': `user_token ${process.env.GLPI_TOKEN}`
    }
  });
  return data.session_token;
}

const STATUS_LABELS = {
  1: 'Novo',
  2: 'Em Atendimento',
  3: 'Pendente',
  4: 'Solucionado',
  5: 'Fechado',
  6: 'Não Solucionado'
};

const STATUS_FILTERS = {
  novo: 1,
  atendimento: 2,
  pendente: 3,
  solucionado: 4,
  fechado: 5,
  naosolucionado: [1, 2, 3]
};

const GRUPO_IDS = [11, 13, 19];
const USUARIO_IDS = [301, 250, 495, 298];

const ATRIBUIVEIS_INFO = [
  { id: 11, nome: 'Grupo Sistema' },
  { id: 19, nome: 'Grupo Infra Belém' },
  { id: 13, nome: 'Grupo Infra Manaus' },
  { id: 301, nome: 'Técnico Will' },
  { id: 250, nome: 'Técnico Carol' },
  { id: 495, nome: 'Técnico Beatriz' },
  { id: 298, nome: 'Técnico Diego' }
];

bot.start(async (ctx) => {
  estadoUsuarios[ctx.from.id] = { pagina: 0, filtro: null };
  await ctx.reply('📋 Escolha um filtro de status:', Markup.inlineKeyboard([
    [Markup.button.callback('🆕 Novo', 'filtro_novo')],
    [Markup.button.callback('🔧 Em Atendimento', 'filtro_atendimento')],
    [Markup.button.callback('⏳ Pendente', 'filtro_pendente')],
    [Markup.button.callback('✅ Solucionado', 'filtro_solucionado')],
    [Markup.button.callback('📁 Fechado', 'filtro_fechado')],
    [Markup.button.callback('❗ Não Solucionado', 'filtro_naosolucionado')]
  ]));
});

bot.action(/filtro_(.+)/, async (ctx) => {
  const filtro = ctx.match[1];
  estadoUsuarios[ctx.from.id] = { pagina: 0, filtro };
  await listarChamados(ctx);
});

async function listarChamados(ctx) {
    const { pagina, filtro } = estadoUsuarios[ctx.from.id];
    const offset = pagina * 5;
    const sessionToken = await getSessionToken();
    const filtroStatus = STATUS_FILTERS[filtro];

    const criteria = Array.isArray(filtroStatus)
    ? filtroStatus.map((status, i) => ({
        field: 12,
        searchtype: 'equals',
        value: status,
        link: i > 0 ? 'OR' : undefined
        }))
    : [{ field: 12, searchtype: 'equals', value: filtroStatus }];

    // 👉 Adiciona o filtro pela entidade DTI (ID = 2)
    criteria.push({
        field: 80, // Campo da entidade
        searchtype: 'equals',
        value: 2,
        link: 'AND'
    });


    const params = {
        range: `${offset}-${offset + 4}`,
        ...Object.fromEntries(criteria.map((c, i) => [`criteria[${i}][field]`, c.field])),
        ...Object.fromEntries(criteria.map((c, i) => [`criteria[${i}][searchtype]`, c.searchtype])),
        ...Object.fromEntries(criteria.map((c, i) => [`criteria[${i}][value]`, c.value])),
        ...Object.fromEntries(criteria.map((c, i) => c.link ? [`criteria[${i}][link]`, c.link] : []))
    };

    const { data } = await axios.get(`${process.env.GLPI_URL}/search/Ticket`, {
        headers: { 'Session-Token': sessionToken },
        params
    });

    const chamados = data.data;

    if (chamados.length === 0) {
        await ctx.reply('❌ Nenhum chamado encontrado.');
        return;
    }

    for (const chamado of chamados) {
        const id = chamado["2"];
        const titulo = chamado["1"];
        const status = chamado["12"];
        const dataCriacao = new Date(chamado["15"] * 1000).toLocaleDateString('pt-BR');
        const statusTexto = STATUS_LABELS[status] || "Desconhecido";

        await ctx.replyWithMarkdown(
        `🆔 ID: ${id}\n📄 Título: ${titulo}\n📅 Criado em: ${dataCriacao}\n📂 Status: ${statusTexto}`,
        Markup.inlineKeyboard([
            [Markup.button.callback("📋 Detalhes", `detalhes_${id}`)],
            [Markup.button.callback("👥 Atribuir Equipe", `abrir_atribuir_${id}`)],
            [Markup.button.callback("💬 Responder", `responder_${id}`)]
        ])
        );
    }

    await ctx.reply(`🔄 Página ${pagina + 1}`, Markup.inlineKeyboard([
        [Markup.button.callback("⬅️ Anterior", "anterior"), Markup.button.callback("➡️ Próxima", "proxima")]
    ]));
}

bot.action("proxima", async (ctx) => {
  const userId = ctx.from.id;
  estadoUsuarios[userId].pagina++;
  await listarChamados(ctx);
});

bot.action("anterior", async (ctx) => {
  const userId = ctx.from.id;
  if (estadoUsuarios[userId].pagina > 0) estadoUsuarios[userId].pagina--;
  await listarChamados(ctx);
});

bot.action(/detalhes_(\d+)/, async (ctx) => {
  const id = ctx.match[1];
  const sessionToken = await getSessionToken();

  try {
    const { data } = await axios.get(`${process.env.GLPI_URL}/Ticket/${id}`, {
      headers: { 'Session-Token': sessionToken }
    });

    const contentRaw = data.content || 'Sem descrição.';
    const contentLimpo = he.decode(contentRaw).replace(/<(\/?)\s*(div|p|br|img|span|a|strong|em|ul|li|table|tr|td)[^>]*>/gi, '').replace(/&nbsp;/g, ' ').trim();

    await ctx.replyWithHTML(`📄 <b>Chamado #${id}</b>\n\n📝 ${contentLimpo}`);
  } catch (error) {
    console.error(error);
    await ctx.reply('❌ Erro ao buscar detalhes do chamado.');
  }
});

const criarBotoesAtribuirEquipe = (ticketId) => {
  return Markup.inlineKeyboard(
    ATRIBUIVEIS_INFO.map((item) =>
      [Markup.button.callback(`${item.nome} (id ${item.id})`, `atribuir_${item.id}_${ticketId}`)]
    )
  );
};

bot.action(/abrir_atribuir_(\d+)/, async (ctx) => {
  const ticketId = ctx.match[1];
  try {
    await ctx.editMessageReplyMarkup(criarBotoesAtribuirEquipe(ticketId).reply_markup);
  } catch (error) {
    console.error(error);
    await ctx.reply('❌ Erro ao abrir menu de atribuição.');
  }
});

bot.action(/atribuir_(\d+)_(\d+)/, async (ctx) => {
  const destinoId = parseInt(ctx.match[1]);
  const ticketId = parseInt(ctx.match[2]);
  const sessionToken = await getSessionToken();

  const headers = {
    'Session-Token': sessionToken,
    'App-Token': process.env.GLPI_APP,
    'Authorization': `user_token ${process.env.GLPI_TOKEN}`,
    'Content-Type': 'application/json'
  };

  try {
    if (GRUPO_IDS.includes(destinoId)) {
      // Atribui grupo
      await axios.post(
        `${process.env.GLPI_URL}/Ticket/${ticketId}/Group_Ticket/`,
        {
          input: {
            tickets_id: ticketId,
            groups_id: destinoId,
            type: 2
          }
        },
        { headers }
      );
      await ctx.answerCbQuery(`✅ Grupo atribuído ao Ticket #${ticketId}`);
    } else if (USUARIO_IDS.includes(destinoId)) {
      // Atribui técnico
      await axios.post(
        `${process.env.GLPI_URL}/Ticket/${ticketId}/Ticket_User/`,
        { input: {tickets_id: ticketId, users_id: destinoId, type: 2} },
        { headers }
      );
      await ctx.answerCbQuery(`✅ Técnico atribuído ao Ticket #${ticketId}`);
    } else {
      await ctx.answerCbQuery('❌ ID não reconhecido.');
      return;
    }

    await ctx.editMessageReplyMarkup();
  } catch (error) {
    console.error('Erro ao atribuir:', error.response?.data || error.message);
    await ctx.answerCbQuery('❌ Erro ao atribuir. Tente novamente.', { show_alert: true });
  }
});

bot.launch().then(() => console.log("🤖 Bot do Telegram iniciado"));
