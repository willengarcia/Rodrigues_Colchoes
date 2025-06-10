import { BrowserRouter, Routes, Route } from "react-router-dom";
import FormularioPedido from "./Inauguracao/DadosClientes";
import Lojas from "./consulta/Consulta";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<FormularioPedido />} />
        <Route path="/lojas" element={<Lojas />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

