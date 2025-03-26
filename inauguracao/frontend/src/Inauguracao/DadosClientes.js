import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import "../../src/App.css"

function FormularioPedido() {
  const [form, setForm] = useState({
    nome: '',
    cpf: '',
    email: '',
    endereco: '',
    cep: '',
    travesseiro: false,
    sanduicheira: false
  });

  const [subtotal, setSubtotal] = useState(0);
  const [qrCodeData, setQrCodeData] = useState(null);
  const [showQRCode, setShowQRCode] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // Atualiza subtotal
    if (type === 'checkbox') {
      const price = 4.99;
      const newSubtotal = checked ? subtotal + price : subtotal - price;
      setSubtotal(newSubtotal);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Prepara os dados para o QR Code
    const pedidoData = {
      ...form,
      subtotal: subtotal.toFixed(2),
      data: new Date().toLocaleString()
    };
    
    // Converte para string JSON
    const dataString = JSON.stringify(pedidoData, null, 2);
    setQrCodeData(dataString);
    setShowQRCode(true);
    
    // Aqui você poderia adicionar o envio para um backend
    console.log('Dados do pedido:', pedidoData);
  };

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
            
            <div className="form-checkbox-group">
              <label>
                <input
                  type="checkbox"
                  name="travesseiro"
                  checked={form.travesseiro}
                  onChange={handleChange}
                />
                Travesseiro (R$ 4,99)
              </label>
              <label>
                <input
                  type="checkbox"
                  name="sanduicheira"
                  checked={form.sanduicheira}
                  onChange={handleChange}
                />
                Sanduicheira (R$ 4,99)
              </label>
            </div>
            
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