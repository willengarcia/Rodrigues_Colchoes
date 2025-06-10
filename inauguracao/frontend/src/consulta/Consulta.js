import React, { useEffect, useState } from "react";
import axios from "axios";
import './Loja.css'

function Lojas() {
  const [lojas, setLojas] = useState([]);
  const [vendas, setVendas] = useState(null);
  const [lojaSelecionada, setLojaSelecionada] = useState(null);

  useEffect(() => {
    async function buscarLojas() {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/lojas`);
        setLojas(res.data); // Exemplo esperado: [{ id: 1, nome: "Loja A" }, ...]
        console.log(res.data)
      } catch (error) {
        console.error("Erro ao buscar lojas:", error);
      }
    }
    buscarLojas();
  }, []);

  async function handleLojaSelecionada(loja) {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/lojas/${loja.loja}`);
      setLojaSelecionada(loja);
      setVendas(res.data);
    } catch (error) {
      console.error("Erro ao buscar vendas da loja:", error);
      setVendas([]);
    }
  }


  return (
    <div>
      <h2>Selecione uma Loja</h2>
      <div className="botoes-lojas">
        {lojas.map((loja) => (
          <button
            key={loja.id}
            className={lojaSelecionada?.id === loja.id ? "selecionada" : ""}
            onClick={() => handleLojaSelecionada(loja)}
          >
            {loja.loja}
          </button>
        ))}
      </div>

      {vendas !== null && (
        <div>
          <h3>Vendas da loja: {lojaSelecionada?.loja || "Nenhuma selecionada"}</h3>
          {vendas.length > 0 ? (
            <div style={{ display: "flex", flexWrap: "wrap", gap: "20px" }} className="cards-container">
              {vendas.map((venda) => (
                <div
                  key={venda.id}
                  style={{
                    border: "1px solid #ccc",
                    borderRadius: "10px",
                    padding: "15px",
                    width: "300px",
                    boxShadow: "2px 2px 8px rgba(0,0,0,0.1)",
                    backgroundColor: "#f9f9f9",
                  }}
                >
                  <p><strong>Cliente:</strong> {venda.nome}</p>
                  <p><strong>Email:</strong> {venda.email}</p>
                  <p><strong>CPF:</strong> {venda.cpf}</p>
                  <p><strong>CEP:</strong> {venda.cep}</p>
                  <p><strong>Endereço:</strong> {venda.endereco}</p>
                  <p><strong>Forma de Pagamento:</strong> {venda.formaPagamento}</p>
                  <p><strong>Subtotal:</strong> R$ {venda.subtotal.toFixed(2)}</p>
                  <p><strong>Status:</strong> {venda.status}</p>
                  <p><strong>Loja:</strong> {venda.loja}</p>
                  <p><strong>Código do Vendedor:</strong> {venda.codVendedor}</p>
                  <p><strong>Qtd Travesseiro:</strong> {venda.qtdTravesseiro}</p>
                  <p><strong>Sanduicheira Elgin:</strong> {venda.sanduicheiraElgin}</p>
                  <p><strong>Sanduicheira Mystic:</strong> {venda.sanduicheiraMystic}</p>
                  <p><strong>Travesseiro:</strong> {venda.travesseiro}</p>
                  <p><strong>Auto:</strong> {venda.auto}</p>
                  <p><strong>CV:</strong> {venda.cv}</p>
                  <p><strong>Criado em:</strong> {new Date(venda.createdAt).toLocaleString()}</p>
                  <p><strong>Atualizado em:</strong> {new Date(venda.updatedAt).toLocaleString()}</p>

                  {venda.linkImage && (
                    <div style={{ marginTop: "10px" }}>
                      <strong>Imagem:</strong><br />
                      <img
                        src={venda.linkImage}
                        alt={`Imagem do pedido ${venda.id}`}
                        style={{
                          width: "100%",
                          maxHeight: "200px",
                          objectFit: "cover",
                          borderRadius: "5px",
                        }}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p>Não há vendas para essa loja.</p>
          )}
        </div>
      )}

    </div>
  );
}

export default Lojas;
