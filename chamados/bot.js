const { Client, LocalAuth } = require('whatsapp-web.js');
const axios = require('axios');
const categorias = ['Internet', 'Computador', 'Impressora', 'Sistema'];
let userChoices = {};
let timers = {}; 

const client = new Client({ authStrategy: new LocalAuth() });
client.on('qr', (qr) => console.log('QR RECEIVED', qr));
client.on('ready', () => console.log('Bot está pronto!'));

client.on('message', async (message) => {
  const incomingMsg = message.body.trim();
  const from = message.from;
  resetUserTimer(from, message);

  if (!userChoices[from]) {
    userChoices[from] = {};
    await message.reply('👋 Olá! Digite sua filial no formato *flXX* (ex: fl01, fl02).');
    return;
  }

  if (!userChoices[from].filial) {
    userChoices[from].filial = incomingMsg.toUpperCase();
    await message.reply('Digite seu nome e sobrenome completos.');
    return;
  }

  if (!userChoices[from].nome) {
    userChoices[from].nome = incomingMsg;
    await message.reply('Escolha a categoria do problema:' + categorias.map((c, i) => `${i + 1}. ${c}`).join('\n'));
    return;
  }

  if (!userChoices[from].categoria) {
    const categoriaIndex = parseInt(incomingMsg) - 1;
    if (categoriaIndex >= 0 && categoriaIndex < categorias.length) {
      userChoices[from].categoria = categorias[categoriaIndex];
      await message.reply('Descreva o problema que está enfrentando.');
    } else {
      await message.reply('Opção inválida. Escolha um número entre 1 e ' + categorias.length);
    }
    return;
  }

  if (!userChoices[from].descricao) {
    userChoices[from].descricao = incomingMsg;
    await message.reply('Deseja enviar uma imagem? Responda com *Sim* ou *Não*.');
    return;
  }

  if (!userChoices[from].imagem && (incomingMsg.toLowerCase() === 'sim' || incomingMsg.toLowerCase() === 'não')) {
    userChoices[from].imagem = incomingMsg.toLowerCase() === 'sim';
    if (userChoices[from].imagem) {
      await message.reply('Envie a imagem agora.');
      return;
    }
  }

  if (userChoices[from].imagem && message.hasMedia) {
    const media = await message.downloadMedia();
    userChoices[from].media = media;
    await message.reply('Imagem recebida! Criando chamado...');
  }

  try {
    const sessionToken = await getSessionToken();
    if (!sessionToken) {
      await message.reply('Erro ao autenticar no sistema de chamados.');
      return;
    }

    const user = await getUserIdByFilial(userChoices[from].filial, sessionToken);
    if (!user) {
      await message.reply('Filial não encontrada.');
      return;
    }

    // Criar o ticket sem definir users_id_requester inicialmente
    const chamado = await createTicket(userChoices[from], sessionToken);
    if (!chamado) {
      await message.reply('Erro ao criar chamado.');
      return;
    }

    // Aguardar 5 segundos antes de associar o requerente
    setTimeout(async () => {
      await setTicketRequester(chamado.id, user['2'], sessionToken);
      await message.reply(`✅ Chamado criado com sucesso! ID: ${chamado.id}`);
      delete userChoices[from];
    }, 5000); // Aguardar 5 segundos antes de executar a função setTicketRequester

  } catch (error) {
    console.error('Erro ao criar chamado:', error.response?.data || error.message);
    await message.reply('❌ Erro ao criar seu chamado.');
  }
});

function resetUserTimer(user, message) {
  if (timers[user]) clearTimeout(timers[user]);
  timers[user] = setTimeout(() => {
    message.reply('⏳ Tempo expirado. Reinicie enviando qualquer mensagem.');
    delete userChoices[user];
  }, 5 * 60 * 1000);
}

async function getSessionToken() {
  try {
    const response = await axios.get('https://suporte.rodriguescolchoes.com.br/apirest.php/initSession', {
      headers: {
        'Authorization': 'user_token 7pSjNh9fxrHuBtrOlVGtKOfLX4QeqGJvuIgqAPuT',
        'App-Token': '017KVE1WqVngF1AJMw8iy3c0j5XNOzZw8XG06IGC'
      }
    });
    return response.data.session_token;
  } catch (error) {
    console.error('Erro ao obter session_token:', error.response?.data || error.message);
    return null;
  }
}

async function getUserIdByFilial(filialName, sessionToken) {
  try {
    const response = await axios.get('https://suporte.rodriguescolchoes.com.br/apirest.php/search/User', {
      headers: { 'Session-Token': sessionToken },
      params: { 'criteria[0][field]': 1, 'criteria[0][searchtype]': 'contains', 'criteria[0][value]': filialName }
    });
    return response.data.data.length > 0 ? response.data.data[0] : null;
  } catch (error) {
    console.error('Erro ao buscar usuário:', error.response?.data || error.message);
    return null;
  }
}

async function createTicket(userData, sessionToken) {
  try {
    const response = await axios.post('https://suporte.rodriguescolchoes.com.br/apirest.php/Ticket', {
      input: {
        name: userData.categoria,
        content: `${userData.descricao}\n\nNome: ${userData.nome}\nNúmero: ${userData.filial}`,
        type: 2,
        priority: '2',
      }
    }, { headers: { 'Session-Token': sessionToken } });
    return response.data;
  } catch (error) {
    console.error('Erro ao criar chamado:', error.response?.data || error.message);
    return null;
  }
}

async function setTicketRequester(ticketId, userId, sessionToken) {
  try {
    // Atribui o usuário como requerente do ticket
    await axios.post('https://suporte.rodriguescolchoes.com.br/apirest.php/Ticket_User', {
      input: {
        tickets_id: ticketId,
        users_id: userId,
        type: 1 // Tipo 1 para requerente
      }
    }, {
      headers: {
        'Session-Token': sessionToken,
        'App-Token': '017KVE1WqVngF1AJMw8iy3c0j5XNOzZw8XG06IGC',
        'Authorization': 'user_token 7pSjNh9fxrHuBtrOlVGtKOfLX4QeqGJvuIgqAPuT'
      }
    });
  } catch (error) {
    console.log(error)
    console.error('Erro ao definir requerente:', error.response?.data || error.message);
  }
}


client.initialize();
