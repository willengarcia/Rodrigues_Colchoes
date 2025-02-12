import React, { useState, useEffect } from 'react';
import '../../src/ListaProtocolo.css';

const ListaProtocolos = () => {
  const [protocolos, setProtocolos] = useState([]);

  useEffect(() => {
    setProtocolos([
      { id: 1, numero: '123', status: 'Pendente', fornecedor: 'Fornecedor A' },
      { id: 2, numero: '456', status: 'Aprovado', fornecedor: 'Fornecedor B' },
    ]);
  }, []);

  return (
    <div className="lista-protocolos-container">
      <h2>Lista de Protocolos</h2>
      <table>
        <thead>
          <tr>
            <th>Número</th>
            <th>Status</th>
            <th>Fornecedor</th>
            <th>Ação</th>
          </tr>
        </thead>
        <tbody>
          {protocolos.map((protocolo) => (
            <tr key={protocolo.id}>
              <td>{protocolo.numero}</td>
              <td>{protocolo.status}</td>
              <td>{protocolo.fornecedor}</td>
              <td>
                <button>Aprovar</button>
                <button>Rejeitar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ListaProtocolos;
