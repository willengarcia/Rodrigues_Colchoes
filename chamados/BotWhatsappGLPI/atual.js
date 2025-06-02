require('dotenv').config();
const { Client, LocalAuth } = require('whatsapp-web.js');
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const FormData = require('form-data');
const entidades = ['Manutenção', 'Financeiro', 'Informática'] 
const categoriaIDs = {
  'Internet': 100, 'Sistema': 23, 'Impressora': 43, 'Outros_Inf': 103,
  'Caixa': 97, 'Refaturamento': 98, 'Comprovantes': 99, 'Outros_Fin': 102,
  'Elétrica': 94, 'Hidráulica': 95, 'Porta enrolar/automática': 96, 'Outros_Mtn': 101
};
const categorias_DTI = ['Internet', 'Sistema', 'Impressora', 'Outros']
const categorias_DFN = ['Caixa', 'Refaturamento', 'Comprovantes', 'Outros']
const categorias_MTN = ['Elétrica', 'Hidráulica', 'Porta enrolar/automática', 'Outros']
const entidadesParaIds = {
  'Manutenção': 3,
  'Financeiro': 4,
  'Informática': 2
};
let userChoices = {};
let timers = {}; 
const tempDir = path.join(__dirname, 'temp');
if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir);
}
const client = new Client({ authStrategy: new LocalAuth() });
let sessionToken
client.on('qr', (qr) => console.log('QR RECEIVED', qr));
client.on('ready', () => console.log('Bot está pronto!'));
client.on('message', async (message) => {
  const incomingMsg = message.body.trim();
  const from = message.from;
  resetUserTimer(from, message);

  if (!userChoices[from]) {
    userChoices[from] = {};
    await message.reply('👋 Olá! Bem-vindo ao suporte da *Rodrigues Colchões* 🛏️\n\n✅ Para iniciar o atendimento, informe sua *filial* no formato *flXX* (ex: fl01, fl02).');
    return;
  }

  if (!userChoices[from].filial) {
    userChoices[from].filial = incomingMsg.toUpperCase();
    await message.reply('📛 Ótimo! Agora, digite seu *nome completo* (Exemplo: João Silva).');
    return;
  }

  if (!userChoices[from].nome) {
    userChoices[from].nome = incomingMsg;
    await message.reply('📋 Agora, escolha o departamento do problema:' + 
      entidades.map((c, i) => `👉 \n${i + 1}. ${c}`).join('')
    );
    return;
  }

  if (!userChoices[from].departamento) {
    const departamentoIndex = parseInt(incomingMsg) - 1;
    if (departamentoIndex >= 0 && departamentoIndex < entidades.length) {
      userChoices[from].departamento = entidades[departamentoIndex];

      let categorias;
      if (departamentoIndex === 0) categorias = categorias_MTN; // Manutenção
      else if (departamentoIndex === 1) categorias = categorias_DFN; // Financeiro
      else categorias = categorias_DTI; // Informática

      await message.reply('📋 Agora, escolha a *categoria* do seu problema:\n' + categorias.map((c, i) => `👉 *${i + 1}.* ${c}`).join('\n'));
    } else {
      await message.reply('Opção inválida. Escolha um número entre 1 e ' + entidades.length);
    }
    return;
  }

  if (!userChoices[from].categoria) {
    let categorias;
    if (userChoices[from].departamento === 'Manutenção') categorias = categorias_MTN;
    else if (userChoices[from].departamento === 'Financeiro') categorias = categorias_DFN;
    else categorias = categorias_DTI;
  
    const categoriaIndex = parseInt(incomingMsg) - 1;
    if (categoriaIndex >= 0 && categoriaIndex < categorias.length) {
      const categoriaEscolhida = categorias[categoriaIndex];
      userChoices[from].categoria = categoriaEscolhida;
      userChoices[from].categoriaId = categoriaIDs[categoriaEscolhida]; // Armazena o ID da categoria
      await message.reply('📝 Perfeito! Agora, descreva o problema que você está enfrentando.');
    } else {
      await message.reply('⚠️ Opção inválida. Escolha um número entre *1* e *' + categorias.length + '*');
    }
    return;
  }

  if (!userChoices[from].descricao) {
    userChoices[from].descricao = incomingMsg;
    await message.reply('📷 Deseja enviar uma imagem? Responda com *Sim* ou *Não*.');
    return;
  }

  if (!userChoices[from].imagem && (incomingMsg.toLowerCase() === 'sim' || incomingMsg.toLowerCase() === 'não')) {
    userChoices[from].imagem = incomingMsg.toLowerCase() === 'sim';
    if (userChoices[from].imagem) {
      await message.reply('📷 Envie a imagem agora.');
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
    sessionToken = await getSessionToken();
    if (!sessionToken) {
      await message.reply('Erro ao autenticar no sistema de chamados.');
      return;
    }

    const user = await getUserIdByFilial(userChoices[from].filial, sessionToken);
    if (!user) {
      await message.reply('Filial não encontrada. Por favor, refaça o chamado');
      return;
    } 

    // Cria o ticket
    const chamado = await createTicket({...userChoices[from], from}, userChoices[from].categoriaId, sessionToken);
    if (!chamado) {
      await message.reply('❌ Não conseguimos criar seu chamado. Tente novamente.');
      return;
    }

    // Vincula o requerente ao ticket
    await setTicketRequester(chamado.id, user["2"], sessionToken);

    // Faz o upload da imagem e vincula ao ticket, se houver
    if (userChoices[from].filePath) {
      console.log("Caminho do arquivo: ", userChoices[from].filePath);
      const entidadeId = entidadesParaIds[userChoices[from].departamento];
      await uploadImageToTicket(chamado.id, userChoices[from].filePath, sessionToken,entidadeId);
    }

    // Atualiza a entidade do ticket

    await message.reply(`✅ *Chamado criado com sucesso!*\n\n🆔 *ID:* ${chamado.id}\n🧑‍💻 *Nome:* ${userChoices[from].nome}\n📞 *Número:* ${from.split('@c.us')}\n🏢 *Filial:* ${userChoices[from].filial}\n📂 *Categoria:* ${userChoices[from].categoria}\n📖 *Descrição:* ${userChoices[from].descricao}\n\n🔍 Acompanhe o chamado no suporte!`);
    delete userChoices[from];
    
  } catch (error) {
    console.error('Erro ao criar chamado:', error.response?.data || error.message);
    await message.reply('❌ Erro ao criar seu chamado.');
  }finally{
    killSession(sessionToken)
  }
});

async function getSessionToken() {
  console.log(process.env.GLPI_URL)
  try {
    const response = await axios.get(`${process.env.GLPI_URL}/initSession`, {
      headers: {
        'App-Token': `${process.env.GLPI_APP}`,
        'Authorization': `user_token ${process.env.GLPI_TOKEN}`
      }
    });
    console.log('Pegou a sessão')
    return response.data.session_token;
  } catch (error) {
    console.error('Erro ao obter session_token:', error.response?.data || error.message);
    return null;
  }
}

async function getUserIdByFilial(filialName, sessionToken) {
  try {
    const response = await axios.get(`${process.env.GLPI_URL}/search/User`, {
      headers: { 'Session-Token': sessionToken },
      params: { 'criteria[0][field]': 1, 'criteria[0][searchtype]': 'contains', 'criteria[0][value]': filialName }
    });
    console.log("Pegou o Id da filial: ", response.data);
    return response.data.data.length > 0 ? response.data.data[0] : null;
  } catch (error) {
    console.error('Erro ao buscar usuário:', error.response?.data || error.message);
    return null;
  }
}

async function createTicket(userData, categoria_ID, sessionToken) {
  try {
    const response = await axios.post(`${process.env.GLPI_URL}/Ticket`, {
      input: {
        name: userData.categoria,
        content: `${userData.descricao}\n\nNome: ${userData.nome}\nFilial: ${userData.filial}\nContato: ${userData.from.replace('@c.us', '')}`,
        type: 2,
        priority: '2',
        itilcategories_id:categoria_ID
      }
    }, { headers: { 'Session-Token': sessionToken } });
    console.log("Pegou o Id do ticket: ", response.data.id);
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

async function uploadImageToTicket(ticketId, filePath, sessionToken, entidade) {
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
    'Content-Type': 'multipart/form-data; boundary=---011000010111000001101001',
    'User-Agent': 'insomnia/10.3.1',
    'App-Token': `${process.env.GLPI_APP}`,
    'Session-Token': sessionToken
  };

  try {
    // Envia a imagem para o GLPI
    const response = await axios.post(
    `${process.env.GLPI_URL}/Ticket/${ticketId}/Document`,
      formData,
      { headers: headers }
    );

    console.log('Resposta da API ao enviar imagem:', response.data);

    if (response.data.upload_result && response.data.upload_result.filename.length > 0) {
      console.log('✅ ID da imagem:', response.data.id);
      // Chama a função para vincular o documento ao ticket
      await linkDocumentToTicket(response.data.id, ticketId, sessionToken, entidade);
    } else {
      console.error('❌ Erro ao enviar imagem: resposta inesperada da API', response.data);
    }
  } catch (error) {
    console.error('❌ Erro ao enviar a imagem para o GLPI:', error.response?.data || error.message);
  }
}

async function linkDocumentToTicket(documentId, ticketId, sessionToken, entidade) {
  const requestBody = {
    "input": {
      "documents_id": documentId,
      "items_id": ticketId,
      "itemtype": "Ticket"
    }
  };

  try {
    const response = await axios.post(
      `${process.env.GLPI_URL}/Document_Item`,
      requestBody,
      {
        headers: {
          'App-Token': `${process.env.GLPI_APP}`,
          "Session-Token": sessionToken,
          "Content-Type": "application/json"
        }
      }
    );
    await setEntityTicket(ticketId, entidade, sessionToken)
    console.log(`Documento vinculado ao ticket ${ticketId}, e id de imagem ${documentId}, com a sessao: ${sessionToken}`);
  } catch (error) {
    console.error("❌ Erro ao vincular documento ao ticket:", error.response?.data || error.message);
  }
}

async function setTicketRequester(ticketId, userId, sessionToken) {
  try {
    await axios.post(`${process.env.GLPI_URL}/Ticket_User`, {
      input: {
        tickets_id: ticketId,
        users_id: userId,
        type: 1 
      }
    }, {
      headers: {
        'Session-Token': sessionToken,
        'App-Token': process.env.GLPI_APP,
        'Authorization': `user_token ${process.env.GLPI_TOKEN}` 
      }
    });
    console.log(`Vinculado o requerente ao ticket`)
  } catch (error) {
    console.error('Erro ao definir requerente:', error.response?.data || error.message);
  }
}

async function setEntityTicket(ticketId, entity_id, sessionToken) {
  try {
    await axios.put(`${process.env.GLPI_URL}/Ticket/${ticketId}`, {
      input: {
        entities_id: entity_id
      }
    }, {
      headers: {
        'Session-Token': sessionToken,
        'App-Token': process.env.GLPI_APP
      }
    });
    console.log(`Vinculado a entidade ${entity_id} ao chamado ${ticketId}`)
  } catch (error) {
    console.error('Erro ao definir requerente:', error.response?.data || error.message);
  }
}

async function killSession(sessionToken) {
  try {
      const response = await axios.get(`${process.env.GLPI_URL}/killSession`, {
          headers: {
              'Content-Type': 'application/json',
              'Session-Token': sessionToken,
              'App-Token': `${process.env.GLPI_APP}`
          }
      });
      
      console.log('Sessão encerrada com sucesso:', response.data);
      return response.data;
  } catch (error) {
      console.error('Erro ao encerrar a sessão:', error.response ? error.response.data : error.message);
  }
}

client.initialize();