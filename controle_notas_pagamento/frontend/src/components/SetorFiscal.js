import React, { useState } from 'react';
import '../../src/SetorFiscal.css';

const SetorFiscal = () => {
  // Dados simulados das notas pendentes (você pode substituir por dados reais vindo do backend)
  const [notasPendentes, setNotasPendentes] = useState([
    {
      protocolo: 123456,
      numeroNotaFiscal: 'NF001',
      fornecedor: 'Fornecedor A',
      status: 'Pendente',
      documentosAdicionais: [],
    },
    {
      protocolo: 123457,
      numeroNotaFiscal: 'NF002',
      fornecedor: 'Fornecedor B',
      status: 'Pendente',
      documentosAdicionais: [],
    },
  ]);
  
  const [documentoAdicional, setDocumentoAdicional] = useState(null);

  const handleFileChange = (e, protocolo) => {
    setDocumentoAdicional(e.target.files[0]);
    // Adiciona o documento à nota fiscal específica
    setNotasPendentes((prevNotas) =>
      prevNotas.map((nota) =>
        nota.protocolo === protocolo
          ? { ...nota, documentosAdicionais: [...nota.documentosAdicionais, e.target.files[0]] }
          : nota
      )
    );
  };

  const handleAprovar = (protocolo) => {
    setNotasPendentes((prevNotas) =>
      prevNotas.map((nota) =>
        nota.protocolo === protocolo
          ? { ...nota, status: 'Aprovada' }
          : nota
      )
    );
    alert('Nota aprovada!');
  };

  const handleRejeitar = (protocolo) => {
    setNotasPendentes((prevNotas) =>
      prevNotas.map((nota) =>
        nota.protocolo === protocolo
          ? { ...nota, status: 'Rejeitada' }
          : nota
      )
    );
    alert('Nota rejeitada!');
  };

  return (
    <div className="setor-fiscal-container">
      <h2>Validação do Setor Fiscal</h2>
      <h3>Notas Pendentes</h3>
      <ul>
        {notasPendentes
          .filter((nota) => nota.status === 'Pendente') // Exibe apenas notas pendentes
          .map((nota) => (
            <li key={nota.protocolo} className="nota">
              <p><strong>Protocolo:</strong> {nota.protocolo}</p>
              <p><strong>Nota Fiscal:</strong> {nota.numeroNotaFiscal}</p>
              <p><strong>Fornecedor:</strong> {nota.fornecedor}</p>

              {/* Documentos adicionais */}
              <div>
                <label>Anexar Documento Adicional:</label>
                <input
                  type="file"
                  onChange={(e) => handleFileChange(e, nota.protocolo)}
                />
              </div>

              <div>
                <h4>Documentos Adicionais:</h4>
                <ul>
                  {nota.documentosAdicionais.map((doc, index) => (
                    <li key={index}>{doc.name}</li>
                  ))}
                </ul>
              </div>

              {/* Ações de Aprovação/Rejeição */}
              <div className="actions">
                <button onClick={() => handleAprovar(nota.protocolo)} className="approve-btn">
                  Aprovar
                </button>
                <button onClick={() => handleRejeitar(nota.protocolo)} className="reject-btn">
                  Rejeitar
                </button>
              </div>
            </li>
          ))}
      </ul>
    </div>
  );
};

export default SetorFiscal;
