import React from 'react';
import WaiterProfile from '../../components/waiter-public/WaiterProfile';

const WaiterPublicPage = () => {
  return (
    <div>
      <h1>Página Pública do Garçom</h1>
      {/* Componente do perfil do garçom na versão pública */}
      <WaiterProfile />
    </div>  
  );
};

export default WaiterPublicPage;
