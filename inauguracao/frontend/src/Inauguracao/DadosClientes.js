import React, { useState, useRef, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import "../../src/App.css"

function FormularioPedido() {
  const [form, setForm] = useState({
    codVendedor:'',
    nome: '',
    cpf: '',
    email: '',
    endereco: '',
    cep: '',
    cv: '',
    auto:'',
    formaPagamento:'',
    travesseiro: '',
    sanduicheiraElgin: '',
    sanduicheiraMystic: ''
  });

  const [subtotal, setSubtotal] = useState(0);
  const [qrCodeData, setQrCodeData] = useState(null);
  const [showQRCode, setShowQRCode] = useState(false);
  const isCPFValid = cpf => /^\d{11}$/.test(cpf);
  const qrRef = useRef();

  useEffect(() => {
    const fetchEndereco = async () => {
      const cep = form.cep.replace(/\D/g, '');
      if (cep.length === 8) {
        try {
          const res = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
          const data = await res.json();
          if (!data.erro) {
            setForm(prev => ({
              ...prev,
              endereco: `${data.logradouro}, ${data.bairro}, ${data.localidade} - ${data.uf}`
            }));
          }
        } catch (error) {
          console.error('Erro ao buscar CEP:', error);
        }
      }
    };

    fetchEndereco();
  }, [form.cep]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    if (type === 'checkbox') {
      let itemCode = null;

      if (name === 'travesseiro') itemCode = '140144';
      else if (name === 'sanduicheiraElgin') itemCode = '133729';
      else if (name === 'sanduicheiraMystic') itemCode = '133444';

      setForm(prev => ({
        ...prev,
        [name]: checked ? itemCode : ''
      }));

      const price = 4.99;
      const newSubtotal = checked ? subtotal + price : subtotal - price;
      setSubtotal(newSubtotal);
      return;
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isCPFValid(form.cpf)) {
      alert('CPF inválido. Deve conter 11 números.');
      return;
    }

    const exigeCodigo = form.formaPagamento === 'CRÉDITO' || form.formaPagamento === 'DÉBITO';
    if (exigeCodigo && (!form.cv.trim() || !form.auto.trim())) {
      alert('Preencha o Código de Verificação e o Código de Autorização.');
      return;
    }

    const pedidoData = {
      ...form,
      subtotal: subtotal.toFixed(2),
      data: new Date().toLocaleString()
    };
    
    const base64 = btoa(JSON.stringify(pedidoData));
    const url = `https://willengarcia.github.io/html-css/LeitorQrCodeClean/visualizador.html?dados=${encodeURIComponent(base64)}`;
    setQrCodeData(url);
    setShowQRCode(true);
    
    
  };

  const baixarQRCode = () => {
  const svg = qrRef.current.querySelector('svg');
  const svgData = new XMLSerializer().serializeToString(svg);
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  const img = new Image();

  const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(svgBlob);

  img.onload = () => {
    canvas.width = img.width;
    canvas.height = img.height;
    ctx.drawImage(img, 0, 0);
    URL.revokeObjectURL(url);

    const pngUrl = canvas.toDataURL('image/png');
    const downloadLink = document.createElement('a');
    downloadLink.href = pngUrl;
    downloadLink.download = 'qrcode.png';
    downloadLink.click();
  };

  img.src = url;
};


  return (
    <div className="form-container">
      {!showQRCode ? (
        <>
          <img src='./logoGrande.png' className='logo'></img>
          <h2 className="form-title">Formulário de Pedido</h2>
          <form onSubmit={handleSubmit} className='formulario'>
            <input
              type="text"
              name="codVendedor"
              placeholder="Código do Vendedor"
              value={form.codVendedor}
              onChange={handleChange}
              className="form-input"
              required
            />
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
              name="cep"
              placeholder="CEP"
              value={form.cep}
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
              name="cv"
              placeholder="Código de Verificação - Crédito/Débito"
              value={form.cv}
              onChange={handleChange}
              className={`form-input ${['CRÉDITO', 'DÉBITO'].includes(form.formaPagamento) && !form.cv ? 'input-required' : ''}`}
            />
            <input
              type="text"
              name="auto"
              placeholder="Código de Autorização - Crédito/Débito"
              value={form.auto}
              onChange={handleChange}
              className={`form-input ${['CRÉDITO', 'DÉBITO'].includes(form.formaPagamento) && !form.auto ? 'input-required' : ''}`}
            />

            <select name="formaPagamento"
            value={form.formaPagamento}
            onChange={handleChange}
            className='pagamentos'
            required>
              <option value={''} defaultChecked>
                Escolha uma forma de pagamento
              </option>
              <option value={'DINHEIRO'}>
                DINHEIRO
              </option>
              <option value={'PIX'}>
                PIX
              </option>
              <option value={'CRÉDITO'}>
                CRÉDITO
              </option>
              <option value={'DÉBITO'}>
                DÉBITO
              </option>
            </select>

            <div className="form-checkbox-group">
              <label>
                <input
                  type="checkbox"
                  name="travesseiro"
                  checked={!!form.travesseiro}
                  onChange={handleChange}
                />
                Travesseiro (R$ 4,99)
              </label>
              <label>
                <input
                  type="checkbox"
                  name="sanduicheiraElgin"
                  checked={!!form.sanduicheiraElgin}
                  onChange={handleChange}
                />
                Sanduicheira Elgin (R$ 4,99)
              </label>
              <label>
                <input
                  type="checkbox"
                  name="sanduicheiraMystic"
                  checked={!!form.sanduicheiraMystic}
                  onChange={handleChange}
                />
                Sanduicheira Mystic (R$ 4,99)
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
          <img src='./logoGrande.png' className='logo'></img>
          <h2 className="form-title">Seu Pedido foi Registrado!</h2>
          <div className="qr-code-wrapper" ref={qrRef}>
            <QRCodeSVG 
              value={qrCodeData} 
              size={230}
              level="H"
              bgColor="#ffffff"  
              fgColor="#000000"     
              includeMargin={true}  
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
          <button 
            className="form-button"
            onClick={baixarQRCode}
          >
            Baixar QR Code
          </button>

          <button 
            className="form-button"
            onClick={() => window.print()}
          >
            Imprimir QR Code
          </button>
        </div>
      )}
    </div>
  );
}

export default FormularioPedido;