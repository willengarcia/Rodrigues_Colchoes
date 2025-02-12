import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';  // Importa a página Home
import Notas from './pages/Notas'; // Exemplo de outra página
import Financeiro from './pages/Financeiro'; // Exemplo de outra página

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} /> {/* Página Home */}
        <Route path="/notas" element={<Notas />} /> {/* Página Notas */}
        <Route path="/financeiro" element={<Financeiro />} /> {/* Página Financeiro */}
        {/* Adicione outras rotas conforme necessário */}
      </Routes>
    </Router>
  );
}

export default App;
