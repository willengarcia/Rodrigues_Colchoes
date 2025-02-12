import React, { createContext, useState, useContext } from 'react';

const NotasContext = createContext();

export const useNotas = () => useContext(NotasContext);

export const NotasProvider = ({ children }) => {
  const [notas, setNotas] = useState([]);

  const adicionarNota = (nota) => {
    setNotas([...notas, nota]);
  };

  const listarNotas = () => {
    return notas;
  };

  return (
    <NotasContext.Provider value={{ notas, adicionarNota, listarNotas }}>
      {children}
    </NotasContext.Provider>
  );
};
