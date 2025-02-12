import React, { useState } from 'react';
import '../../src/SetorFinanceiro.css';

const SetorFinanceiro = () => {
  const [protocolosAprovados, setProtocolosAprovados] = useState([
    {
      protocolo: 123456,
      numeroNotaFiscal: 'NF001',
      fornecedor: 'Fornecedor A',
      status: 'Aprovada',
      comprovantePagamento: null,
    },
    {
      protocolo: 123457,
      numeroNotaFiscal: 'NF002',
      fornecedor: 'Fornecedor B',
      status: 'Aprovada',
      comprovantePagamento: null,
    },
  ]);
  
  const [comprovante, setComprovante] = useState(null);

  const handleFileChange = (e, protocolo) => {
    setComprovante(e.target.files[0]);
    // Adiciona o comprovante à nota fiscal específica
    setProtocolosAprovados((prevProtocolos) =>
      prevProtocolos.map((protocoloItem) =>
        protocoloItem.protocolo === protocolo
          ? { ...protocoloItem, comprovantePagamento: e.target.files[0] }
          : protocoloItem
      )
    );
  };

  const handlePagamento = (protocolo) => {
    setProtocolosAprovados((prevProtocolos) =>
      prevProtocolos.map((protocoloItem) =>
        protocoloItem.protocolo === protocolo
          ? { ...protocoloItem, status: 'Pago' }
          : protocoloItem
      )
    );
    alert('Pagamento efetuado com sucesso!');
  };

  return (
    <div className="setor-financeiro-container">
      <h2>Setor Financeiro - Efetuar Pagamento</h2>
      <h3>Protocolos Aprovados</h3>
      <ul>
        {protocolosAprovados
          .filter((protocolo) => protocolo.status === 'Aprovada') // Exibe apenas protocolos aprovados
          .map((protocolo) => (
            <li key={protocolo.protocolo} className="protocolo">
              <p><strong>Protocolo:</strong> {protocolo.protocolo}</p>
              <p><strong>Nota Fiscal:</strong> {protocolo.numeroNotaFiscal}</p>
              <p><strong>Fornecedor:</strong> {protocolo.fornecedor}</p>

              {/* Comprovante de Pagamento */}
              <div>
                <label>Upload do Comprovante de Pagamento:</label>
                <input
                  type="file"
                  onChange={(e) => handleFileChange(e, protocolo.protocolo)}
                />
              </div>

              <div>
                <h4>Comprovante de Pagamento:</h4>
                {protocolo.comprovantePagamento ? (
                  <p>{protocolo.comprovantePagamento.name}</p>
                ) : (
                  <p>Sem comprovante de pagamento anexado.</p>
                )}
              </div>

              {/* Ação para efetuar o pagamento */}
              <div className="actions">
                <button onClick={() => handlePagamento(protocolo.protocolo)} className="pay-btn">
                  Efetuar Pagamento
                </button>
              </div>
            </li>
          ))}
      </ul>
    </div>
  );
};

export default SetorFinanceiro;

