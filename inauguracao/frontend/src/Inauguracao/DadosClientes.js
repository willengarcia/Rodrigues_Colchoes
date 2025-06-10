import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { QRCodeSVG } from 'qrcode.react';
import "../../src/App.css"

function FormularioPedido() {
  const [form, setForm] = useState({
    loja:'',
    codVendedor:'',
    nome: '',
    cpf: '',
    email: '',
    endereco: '',
    cep: '',
    cv: '',
    auto:'',
    image: null,
    formaPagamento:'',
    travesseiro: '',
    sanduicheiraElgin: '',
    sanduicheiraMystic: '',
    qtdTravesseiro: ''
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

  useEffect(() => {
    const precoTravesseiro = 9.99;
    const precoSanduicheira = 9.99;

    let novoSubtotal = 0;

    if (form.travesseiro) {
      const quantidade = parseInt(form.qtdTravesseiro) || 0;
      novoSubtotal += precoTravesseiro * quantidade;
    }

    if (form.sanduicheiraElgin) {
      novoSubtotal += precoSanduicheira;
    }

    if (form.sanduicheiraMystic) {
      novoSubtotal += precoSanduicheira;
    }

    setSubtotal(novoSubtotal);
  }, [
    form.travesseiro,
    form.sanduicheiraElgin,
    form.sanduicheiraMystic,
    form.qtdTravesseiro
  ]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === 'checkbox') {
      let itemCode = '';

      if (name === 'travesseiro') itemCode = checked ? '140144' : '';
      else if (name === 'sanduicheiraElgin') itemCode = checked ? '133729' : '';
      else if (name === 'sanduicheiraMystic') itemCode = checked ? '133444' : '';

      setForm(prev => ({
        ...prev,
        [name]: itemCode
      }));
      return;
    }

    if (type === 'file') {
      setForm(prev => ({
        ...prev,
        [name]: e.target.files[0]
      }));
      return;
    }

    // Atualiza campos padrão (text, email, select, etc)
    setForm(prev => ({
      ...prev,
      [name]: value
    }));
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
    const formData = new FormData();
    formData.append("loja", form.loja.toUpperCase());
    formData.append("codVendedor", form.codVendedor);
    formData.append("nome", form.nome);
    formData.append("cpf", form.cpf);
    formData.append("email", form.email);
    formData.append("cep", form.cep);
    formData.append("endereco", form.endereco);
    formData.append("formaPagamento", form.formaPagamento);
    formData.append("cv", form.cv || "");
    formData.append("auto", form.auto || "");
    formData.append("qtdTravesseiro", form.qtdTravesseiro);
    if (form.travesseiro) formData.append("travesseiro", form.travesseiro);
    if (form.sanduicheiraElgin) formData.append("sanduicheiraElgin", form.sanduicheiraElgin);
    if (form.sanduicheiraMystic) formData.append("sanduicheiraMystic", form.sanduicheiraMystic);



    formData.append("subtotal", subtotal.toFixed(2));
    if (form.image) {
      formData.append("image", form.image);
    }

    // Chamada à API
    axios.post(`${process.env.REACT_APP_API_URL}/criarVenda`, formData)
    .then((response) => {
      console.log("Venda enviada com sucesso:", response.data);
    })
    .catch((error) => {
      console.error("Erro ao enviar a venda:", error);
    });

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

  const navigate = useNavigate();

  const consultarVenda = () => {
    navigate("/lojas");
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
              name="loja"
              placeholder="Código da Filial - Ex.: 3F"
              value={form.loja}
              onChange={handleChange}
              className="form-input"
              required
            />
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
            <input
              type="file"
              name="image"
              accept="image/*"
              onChange={handleChange}
              className="form-input"
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
              <option value={'CREDITO'}>
                CRÉDITO
              </option>
              <option value={'DEBITO'}>
                DÉBITO
              </option>
            </select>
            <select name="qtdTravesseiro"
              value={form.qtdTravesseiro}
              onChange={handleChange}
              className='pagamentos'
              required>
              <option value={''} defaultChecked>Quantidade travesseiro</option>
              <option value={'1'}>1</option>
              <option value={'2'}>2</option>
            </select>

            <div className="form-checkbox-group">
              <label>
                <input
                  type="checkbox"
                  name="travesseiro"
                  checked={form.travesseiro === '140144'}
                  onChange={handleChange}
                />
                Travesseiro (R$ 9,99)
              </label>
              <label>
                <input
                  type="checkbox"
                  name="sanduicheiraElgin"
                  checked={form.sanduicheiraElgin === '133729'}
                  onChange={handleChange}
                />
                Sanduicheira Elgin (R$ 9,99)
              </label>
              <label>
                <input
                  type="checkbox"
                  name="sanduicheiraMystic"
                  checked={form.sanduicheiraMystic === '133444'}
                  onChange={handleChange}
                />
                Sanduicheira Mystic (R$ 9,99)
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
          <button className="form-button" onClick={consultarVenda}>
            Consultar Venda
          </button>
        </div>
      )}
    </div>
  );
}

export default FormularioPedido;