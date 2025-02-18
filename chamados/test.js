const fs = require('fs');
const request = require('request');
const path = require('path');

const options = {
  method: 'POST',
  url: 'https://suporte.rodriguescolchoes.com.br/apirest.php/Ticket/1723/Document',
  qs: {'': ''},
  headers: {
    'Content-Type': 'multipart/form-data; boundary=---011000010111000001101001',
    'User-Agent': 'insomnia/10.3.1',
    'App-Token': '017KVE1WqVngF1AJMw8iy3c0j5XNOzZw8XG06IGC',
    Authorization: 'user_token 7pSjNh9fxrHuBtrOlVGtKOfLX4QeqGJvuIgqAPuT',
    'Session-Token': 'ohlgf6b31djqjcfgjc1jrl6jsa'
  },
  formData: {
    uploadManifest: '{"input": {"name": "Imagem do Chamado", "_filename": ["imagem.png"]}}',
    'filename[0]': {
      value: fs.createReadStream('C:\\Users\\rcti2\\Pictures\\Screenshots\\Captura de tela 2025-01-31 110312.png'),
      options: {
        filename: 'Captura de tela 2025-02-04 082849.png',
        contentType: 'image/png' // Definindo o tipo de conteúdo correto
      }
    }
  }
};

request(options, function (error, response, body) {
  if (error) {
    console.error("Erro:", error);
    return;
  }

  console.log("Resposta do servidor:", body);
});
