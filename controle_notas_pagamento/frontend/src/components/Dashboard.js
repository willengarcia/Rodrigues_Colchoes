import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../../src/Dashboard.css';

const Dashboard = () => {
  const [data, setData] = useState({});

  useEffect(() => {
    setData({
      pending: 5,
      approved: 10,
      paid: 3,
    });
  }, []);

  return (
    <div className="dashboard-container">
      <h1>Dashboard</h1>
      <div className="dashboard-summary">
        <div>
          <h2>Pendentes: {data.pending}</h2>
        </div>
        <div>
          <h2>Aprovados: {data.approved}</h2>
        </div>
        <div>
          <h2>Pagos: {data.paid}</h2>
        </div>
      </div>
      <Link to="/notas">Gerenciar Notas</Link>
    </div>
  );
};

export default Dashboard;
