import React from 'react';
import { Link } from 'react-router-dom';
import '../../src/Home.css';

const Home = () => {
  return (
    <div className="home-container">
      <h1>Bem-vindo ao Sistema de Controle de Notas e Pagamentos</h1>
      <div>
        <Link to="/notas">Gerenciar Notas</Link>
        <Link to="/financeiro">Setor Financeiro</Link>
      </div>
    </div>
  );
};

export default Home;
