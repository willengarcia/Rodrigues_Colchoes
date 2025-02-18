const { Client, LocalAuth } = require('whatsapp-web.js');
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const request = require('request');
const FormData = require('form-data');
const categorias = ['Internet', 'Computador', 'Impressora', 'Sistema'];
let userChoices = {};
let timers = {}; 
const tempDir = path.join(__dirname, 'temp');

if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir);
}

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
    await message.reply('Escolha a categoria do problema:' + categorias.map((c, i) => `\n${i + 1}. ${c}`).join(''));
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
    try {
      const media = await message.downloadMedia();
      
      if (!media || !media.data || media.data.length === 0) {
        await message.reply('❌ Nenhuma imagem foi recebida ou houve erro ao processá-la.');
        return;
      }

      console.log("📸 Tamanho do arquivo recebido (base64):", media.data.length);

      // Caminho correto para salvar a imagem
      const imagePath = path.join(__dirname, 'temp', `${Date.now()}.jpeg`);

      console.log("📂 Salvando imagem em:", imagePath);

      // Salva a imagem garantindo que é um buffer correto
      const base64Data = media.data.replace(/^data:image\/\w+;base64,/, "");
      const imageBuffer = Buffer.from(base64Data, 'base64');
      fs.writeFileSync(imagePath, imageBuffer);

      console.log(`✅ Arquivo salvo com sucesso (${imageBuffer.length} bytes)`);

      // Associa o caminho do arquivo ao usuário
      userChoices[from].filePath = imagePath;

      // Exclui a imagem após 60 segundos
      setTimeout(() => {
          if (fs.existsSync(imagePath)) {
              fs.unlinkSync(imagePath);
              console.log(`🗑️ Arquivo temporário removido: ${imagePath}`);
          }
      }, 60000);

      await message.reply('✅ Imagem recebida! Criando chamado...');

    } catch (error) {
      console.error('❌ Erro ao processar a imagem:', error);
      await message.reply('❌ Erro ao baixar a imagem. Tente novamente.');
      return;
    }
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

    const chamado = await createTicket(userChoices[from], sessionToken);
    if (!chamado) {
      await message.reply('Erro ao criar chamado.');
      return;
    }

    await setTicketRequester(chamado.id, user["2"], sessionToken);

    if (userChoices[from].filePath) {
      console.log("Caminho do arquivo: ", userChoices[from].filePath);
      await uploadImageToTicket(chamado.id, userChoices[from].filePath, sessionToken);
    }

    await message.reply(`✅ Chamado criado com sucesso! ID: ${chamado.id}`);
    delete userChoices[from];
  } catch (error) {
    console.error('Erro ao criar chamado:', error.response?.data || error.message);
    await message.reply('❌ Erro ao criar seu chamado.');
  }
});

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
    console.log("ID da filial: ", response.data);
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
    console.log("ID do ticket: ", response.data.id);
    return response.data;
  } catch (error) {
    console.error('Erro ao criar chamado:', error.response?.data || error.message);
    return null;
  }
}

function resetUserTimer(user, message) {
  if (timers[user]) clearTimeout(timers[user]);
  timers[user] = setTimeout(() => {
    message.reply('⏳ Tempo expirado. Reinicie enviando qualquer mensagem.');
    delete userChoices[user];
  }, 5 * 60 * 1000);
}

async function uploadImageToTicket(ticketId, filePath, sessionToken) {
  const formData = new FormData();
  formData.append('uploadManifest', JSON.stringify({
    input: {
      name: 'Imagem do Chamado',
      _filename: [path.basename(filePath)]
    }
  }));
  
  // Lê o arquivo como um fluxo de dados (stream)
  const fileStream = fs.createReadStream(filePath);

  // Adiciona o arquivo ao FormData
  formData.append('filename[0]', fileStream, {
    filename: path.basename(filePath),
    contentType: 'image/jpeg' // ou 'image/png' se for o caso
  });

  // Configura os headers necessários
  const headers = {
    'Content-Type': 'multipart/form-data',
    'User-Agent': 'insomnia/10.3.1',
    'App-Token': '017KVE1WqVngF1AJMw8iy3c0j5XNOzZw8XG06IGC',
    'Authorization': 'user_token 7pSjNh9fxrHuBtrOlVGtKOfLX4QeqGJvuIgqAPuT',
    'Session-Token': sessionToken
  };

  try {
    // Envia a imagem para o GLPI
    const response = await axios.post(
      `https://suporte.rodriguescolchoes.com.br/apirest.php/Ticket/${ticketId}/Document`,
      formData,
      { headers: headers }
    );

    console.log('Resposta da API ao enviar imagem:', response.data);

    if (response.data.upload_result && response.data.upload_result.filename.length > 0) {
      console.log('✅ ID da imagem:', response.data.id);
      // Chama a função para vincular o documento ao ticket
      await linkDocumentToTicket(response.data.id, ticketId, sessionToken);
    } else {
      console.error('❌ Erro ao enviar imagem: resposta inesperada da API', response.data);
    }
  } catch (error) {
    console.error('❌ Erro ao enviar a imagem para o GLPI:', error.response?.data || error.message);
  }
}

async function linkDocumentToTicket(documentId, ticketId, sessionToken) {
  const requestBody = {
    "input": {
      "documents_id": documentId,
      "itemtype": "Ticket",
      "items_id": ticketId
    }
  };

  try {
    const response = await axios.post(
      `https://suporte.rodriguescolchoes.com.br/apirest.php/Document_Item`,
      requestBody,
      {
        headers: {
          'App-Token': '017KVE1WqVngF1AJMw8iy3c0j5XNOzZw8XG06IGC',
          'Authorization': 'user_token 7pSjNh9fxrHuBtrOlVGtKOfLX4QeqGJvuIgqAPuT',
          "Session-Token": sessionToken,
          "Content-Type": "application/json"
        }
      }
    );
    console.log('✅ Documento vinculado ao ticket com sucesso:', response.data);
  } catch (error) {
    console.error("❌ Erro ao vincular documento ao ticket:", error.response?.data || error.message);
  }
}

async function setTicketRequester(ticketId, userId, sessionToken) {
  try {
    await axios.post('https://suporte.rodriguescolchoes.com.br/apirest.php/Ticket_User', {
      input: {
        tickets_id: ticketId,
        users_id: userId,
        type: 1 
      }
    }, {
      headers: {
        'Session-Token': sessionToken,
        'App-Token': '017KVE1WqVngF1AJMw8iy3c0j5XNOzZw8XG06IGC',
        'Authorization': 'user_token 7pSjNh9fxrHuBtrOlVGtKOfLX4QeqGJvuIgqAPuT'
      }
    });
  } catch (error) {
    console.error('Erro ao definir requerente:', error.response?.data || error.message);
  }
}
client.initialize();