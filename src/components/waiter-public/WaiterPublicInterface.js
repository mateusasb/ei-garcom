import React from 'react';
import ToggleService from './ToggleService';
import WaiterPublicInfo from './WaiterPublicInfo';
import '../../styles/waiter-public.css'

const WaiterPublicInterface = (waiter) => {
  return (
    <>
      {/* Informações públicas do garçom */}
      <WaiterPublicInfo {...waiter}/>

      {/* Botões para interação do cliente */}
      <div className="action-buttons">
        
        <>
          <ToggleService/>
        </>  
      </div>
    </>
  );
};

export default WaiterPublicInterface;
