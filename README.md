# Rodrigues_Colchoes
 GitHub destinado a projetos da Rodrigues Colhões
## Arvore de pasta e resumo
controle_notas_pagamento/
│── src/
│   ├── components/
│   │   ├── RegistroNota.js        # Formulário de registro de notas (Passo 1)
│   │   ├── SetorFiscal.js         # Verificação das notas (Passo 2)
│   │   ├── SetorFinanceiro.js     # Análise e pagamento (Passo 3)
│   │   ├── ListaProtocolos.js     # Exibição de protocolos
│   │   ├── Dashboard.js           # Tela principal com resumo
│   ├── pages/
│   │   ├── Home.js                # Página inicial
│   │   ├── Notas.js               # Página para gerenciar notas
│   │   ├── Financeiro.js          # Página do setor financeiro
│   ├── services/
│   │   ├── api.js                 # Comunicação com backend (API)
│   ├── context/
│   │   ├── AuthContext.js         # Contexto para autenticação
│   │   ├── NotasContext.js        # Contexto para gerenciamento de notas
│   ├── App.js                     # Roteamento e estrutura geral
│   ├── index.js                    # Renderização do React
│   ├── styles.css                   # Estilos globais
│   ├── routes.js                   # Rotas do sistema
│── package.json
│── .gitignore
│── README.md




## Regras

📌 1. Cadastro de Notas (RegistroNota.js)
Formulário com os campos obrigatórios e opcionais
Upload de nota fiscal e boleto
Geração de número de protocolo
Somente chefes dos setores podem aprovar
📌 2. Validação pelo Setor Fiscal (SetorFiscal.js)
Listagem das notas pendentes
Opção de anexar documentos adicionais
Aprovação/Rejeição para o próximo setor
📌 3. Setor Financeiro (SetorFinanceiro.js)
Verificação dos protocolos aprovados
Opção para efetuar pagamento
Atualização do status para "pago"
Upload do comprovante de pagamento
