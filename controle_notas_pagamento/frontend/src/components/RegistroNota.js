import React, { useState } from 'react';
import '../../src/RegistroNota.css'

const RegistroNota = ({ setorChefe }) => {
  const [formData, setFormData] = useState({
    numeroBoleto: '',
    numeroNotaFiscal: '',
    uf: '',
    fornecedor: '',
    valorBoleto: '',
    dataEmissao: '',
    dataVencimento: '',
    finalidadeServico: '',
    centroCusto: '',
    numeroFilial: '',
    numeroCliente: '',
    numeroConta: '',
    notaFiscalFile: null,
    boletoFile: null,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: files[0],
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Aqui você pode gerar o protocolo, salvar no backend ou fazer qualquer outra coisa.
    alert('Protocolo gerado!');
  };

  const generateProtocol = () => {
    return Math.floor(Math.random() * 1000000); // Simulando a geração de protocolo
  };

  return (
    <div className="form-container">
      <h2>Cadastro de Notas</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Numero do Boleto:</label>
          <input
            type="text"
            name="numeroBoleto"
            value={formData.numeroBoleto}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Numero da Nota Fiscal:</label>
          <input
            type="text"
            name="numeroNotaFiscal"
            value={formData.numeroNotaFiscal}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Unidade Federativa (UF):</label>
          <input
            type="text"
            name="uf"
            value={formData.uf}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Fornecedor:</label>
          <input
            type="text"
            name="fornecedor"
            value={formData.fornecedor}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Valor Total do Boleto:</label>
          <input
            type="number"
            name="valorBoleto"
            value={formData.valorBoleto}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Data de Emissão da Nota Fiscal:</label>
          <input
            type="date"
            name="dataEmissao"
            value={formData.dataEmissao}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Data de Vencimento do Boleto:</label>
          <input
            type="date"
            name="dataVencimento"
            value={formData.dataVencimento}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Finalidade do Serviço:</label>
          <input
            type="text"
            name="finalidadeServico"
            value={formData.finalidadeServico}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Centro de Custo:</label>
          <input
            type="text"
            name="centroCusto"
            value={formData.centroCusto}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Numero da Filial:</label>
          <input
            type="text"
            name="numeroFilial"
            value={formData.numeroFilial}
            onChange={handleChange}
            required
          />
        </div>

        {/* Campos Opcionais */}
        <div>
          <label>Numero do Cliente:</label>
          <input
            type="text"
            name="numeroCliente"
            value={formData.numeroCliente}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Numero da Conta:</label>
          <input
            type="text"
            name="numeroConta"
            value={formData.numeroConta}
            onChange={handleChange}
          />
        </div>

        {/* Upload dos arquivos */}
        <div>
          <label>Nota Fiscal (PDF, JPG, PNG):</label>
          <input
            type="file"
            name="notaFiscalFile"
            onChange={handleFileChange}
            required
          />
        </div>
        <div>
          <label>Boleto (PDF, JPG, PNG):</label>
          <input
            type="file"
            name="boletoFile"
            onChange={handleFileChange}
            required
          />
        </div>

        {/* Botão de Aprovação */}
        {setorChefe && (
          <div>
            <button type="submit">Aprovar Protocolo</button>
          </div>
        )}

        <div>
          <p>Protocolo Gerado: {generateProtocol()}</p>
        </div>
      </form>
    </div>
  );
};

export default RegistroNota;
