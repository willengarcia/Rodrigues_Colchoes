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
      await message.reply('📋 Agora, escolha a *categoria* do seu problema:\n' + categorias.map((c, i) => `👉 *${i + 1}.* ${c}`).join('\n'));
      return;
    }
  
    if (!userChoices[from].categoria) {
      const categoriaIndex = parseInt(incomingMsg) - 1;
      if (categoriaIndex >= 0 && categoriaIndex < categorias.length) {
        userChoices[from].categoria = categorias[categoriaIndex];
        await message.reply('📝 Perfeito! Agora, descreva o problema que você está enfrentando.');
      } else {
        await message.reply('⚠️ Opção inválida. Escolha um número entre *1* e *' + categorias.length + '*');
      }
      return;
    }
  
    if (!userChoices[from].descricao) {
      userChoices[from].descricao = incomingMsg;
      await message.reply('📷 Deseja enviar uma imagem do problema? *Responda com Sim ou Não*');
      return;
    }
  
    if (!userChoices[from].imagem && (incomingMsg.toLowerCase() === 'sim' || incomingMsg.toLowerCase() === 'não')) {
      userChoices[from].imagem = incomingMsg.toLowerCase() === 'sim';
      if (userChoices[from].imagem) {
        await message.reply('📸 Envie agora a imagem do problema.');
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
        await message.reply('❌ Erro ao conectar ao sistema de chamados. Tente novamente mais tarde.');
        return;
      }
  
      const user = await getUserIdByFilial(userChoices[from].filial, sessionToken);
      if (!user) {
        await message.reply('Filial não encontrada. Por favor, refaça o chamado');
        return;
      }
  
      const chamado = await createTicket({ ...userChoices[from], from }, sessionToken);
      if (!chamado) {
        await message.reply('❌ Não conseguimos criar seu chamado. Tente novamente.');
        return;
      }
  
      await setTicketRequester(chamado.id, user["2"], sessionToken);
  
      if (userChoices[from].filePath) {
        console.log("Caminho do arquivo: ", userChoices[from].filePath);
        await uploadImageToTicket(chamado.id, userChoices[from].filePath, sessionToken);
      }
      await message.reply(`✅ *Chamado criado com sucesso!*\n\n🆔 *ID:* ${chamado.id}\n🧑‍💻 *Nome:* ${userChoices[from].nome}\n📞 *Número:* ${from.split('@c.us')}\n🏢 *Filial:* ${userChoices[from].filial}\n📂 *Categoria:* ${userChoices[from].categoria}\n📖 *Descrição:* ${userChoices[from].descricao}\n\n🔍 Acompanhe o chamado no suporte!`);
      delete userChoices[from];
    } catch (error) {
      console.error('Erro ao criar chamado:', error.response?.data || error.message);
      await message.reply('❌ Erro ao criar seu chamado.');
    }
  });