const axios = require("axios");

// Defina as configurações
const ticketId = 1723; // Substitua pelo ID do ticket correto
const documentId = 1085; // Substitua pelo ID do documento retornado
const sessionToken = "rmp0k46jd57dbj14r5bnq35pgp"; // Insira o token correto
const appToken = "017KVE1WqVngF1AJMw8iy3c0j5XNOzZw8XG06IGC";
const userToken = "user_token 7pSjNh9fxrHuBtrOlVGtKOfLX4QeqGJvuIgqAPuT";

// Corpo da requisição no formato esperado pela API do GLPI
const requestBody = {
    "input": {
      "documents_id": documentId,
      "itemtype": "Ticket",
      "items_id": ticketId
    }
};

// Fazendo a requisição para vincular o documento ao ticket
axios
  .post(
    `https://suporte.rodriguescolchoes.com.br/apirest.php/Document_Item`,
    requestBody, // Envia o corpo no formato de array de objetos
    {
      headers: {
        "App-Token": appToken,
        "Authorization": userToken,
        "Session-Token": sessionToken,
        "Content-Type": "application/json", // Define o tipo de conteúdo como JSON
      },
    }
  )
  .then((response) => {
    console.log("✅ Documento vinculado ao ticket com sucesso:", response.data);
  })
  .catch((error) => {
    console.error(
      "❌ Erro ao vincular documento ao ticket:",
      error.response?.data || error.message
    );
  });