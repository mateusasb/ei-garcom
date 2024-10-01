import React from 'react';
import ToggleService from './ToggleService';
import ToggleCallWaiter from './ToggleCallWaiter';
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
          <ToggleCallWaiter />
        </>
        
        <>
          <ToggleService />
        </>  
      </div>
    </>
  );
};

export default WaiterPublicInterface;
