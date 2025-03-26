import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import "../../src/App.css";

const produtosDisponiveis = [
  { codigo: '001', descricao: 'Travesseiro', preco: 4.99 },
  { codigo: '002', descricao: 'Sanduicheira', preco: 4.99 },
  { codigo: '003', descricao: 'Ferro de Passar', preco: 9.99 },
  { codigo: '004', descricao: 'Liquidificador', preco: 19.99 }
];

function FormularioPedido() {
  const [form, setForm] = useState({
    nome: '',
    cpf: '',
    email: '',
    endereco: '',
    cep: '',
    produtoPesquisa: '',
    produtosSelecionados: []
  });

  const [subtotal, setSubtotal] = useState(0);
  const [qrCodeData, setQrCodeData] = useState(null);
  const [showQRCode, setShowQRCode] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectProduct = (produto) => {
    setForm(prev => ({
      ...prev,
      produtosSelecionados: [...prev.produtosSelecionados, produto],
      produtoPesquisa: ''
    }));
    setSubtotal(prev => prev + produto.preco);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const pedidoData = {
      ...form,
      subtotal: subtotal.toFixed(2),
      data: new Date().toLocaleString()
    };
    
    const dataString = JSON.stringify(pedidoData, null, 2);
    setQrCodeData(dataString);
    setShowQRCode(true);
    console.log('Dados do pedido:', pedidoData);
  };

  const produtosFiltrados = form.produtoPesquisa
    ? produtosDisponiveis.filter(produto => 
        produto.descricao.toLowerCase().includes(form.produtoPesquisa.toLowerCase()) ||
        produto.codigo.includes(form.produtoPesquisa)
      )
    : [];

  return (
    <div className="form-container">
      {!showQRCode ? (
        <>
          <h2 className="form-title">Formulário de Pedido</h2>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              name="nome"
              placeholder="Nome Completo"
              value={form.nome}
              onChange={handleChange}
              className="form-input"
              required
            />
            <input
              type="text"
              name="cpf"
              placeholder="CPF"
              value={form.cpf}
              onChange={handleChange}
              className="form-input"
              required
            />
            <input
              type="email"
              name="email"
              placeholder="E-mail"
              value={form.email}
              onChange={handleChange}
              className="form-input"
              required
            />
            <input
              type="text"
              name="endereco"
              placeholder="Endereço"
              value={form.endereco}
              onChange={handleChange}
              className="form-input"
              required
            />
            <input
              type="text"
              name="cep"
              placeholder="CEP"
              value={form.cep}
              onChange={handleChange}
              className="form-input"
              required
            />
            
            <input
              type="text"
              name="produtoPesquisa"
              placeholder="Pesquise pelo nome ou código"
              value={form.produtoPesquisa}
              onChange={handleChange}
              className="form-input"
            />
            
            {produtosFiltrados.length > 0 && (
              <ul className="product-list">
                {produtosFiltrados.map(produto => (
                  <li key={produto.codigo} onClick={() => handleSelectProduct(produto)}>
                    {produto.descricao} - R$ {produto.preco.toFixed(2)}
                  </li>
                ))}
              </ul>
            )}
            
            <ul className="selected-products">
              {form.produtosSelecionados.map((produto, index) => (
                <li key={index}>{produto.descricao} - R$ {produto.preco.toFixed(2)}</li>
              ))}
            </ul>
            
            <p className="form-subtotal">Subtotal: R$ {subtotal.toFixed(2)}</p>
            <button type="submit" className="form-button">
              Enviar Pedido
            </button>
          </form>
        </>
      ) : (
        <div className="qr-code-container">
          <h2 className="form-title">Seu Pedido foi Registrado!</h2>
          <div className="qr-code-wrapper">
          <QRCodeSVG 
            value={qrCodeData} 
            size={256}
            level="H"
            />
          </div>
          <p className="qr-code-instruction">
            Escaneie este QR Code para ver os detalhes do seu pedido
          </p>
          <button 
            className="form-button"
            onClick={() => setShowQRCode(false)}
          >
            Voltar ao Formulário
          </button>
        </div>
      )}
    </div>
  );
}

export default FormularioPedido;
