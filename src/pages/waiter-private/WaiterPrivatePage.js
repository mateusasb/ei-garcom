import React from 'react';
import ManagementPanel from '../../components/waiter-private/ManagementPanel';

const WaiterPrivatePage = () => {
  return (
    <div>
      <h1>Página Privada do Garçom</h1>
      {/* Componente de gerenciamento dos atendimentos */}
      <ManagementPanel />
    </div>  
  );
};

export default WaiterPrivatePage;
