import React, { useState } from 'react';
import ToggleService from './ToggleService';
import WaiterPublicInfo from './WaiterPublicInfo';
import CustomerReview from './CustomerReview';
import { getVisitorId } from '../../services/controller/visitorController';
import { socket } from '../../socket';
import '../../styles/waiter-public.css'

const WaiterPublicInterface = (waiter) => {
  const [startReview, setStartReview] = useState(false)
  
  const updateReviewState = (bool) => {
    setStartReview(bool)
    localStorage.removeItem('lastConnectedSession');
    socket.emit('service-request-expired-customer', waiter.waiterData.waiter_slug, getVisitorId())
    socket.disconnect();
  }

  return (
    <div className='waiter-public-interface'>

      {/* Informações públicas do garçom */}
      <div className='waiter-public-info'>
        <WaiterPublicInfo {...waiter}/>
      </div>

      {/* Botões para interação do cliente */}
      {!startReview && <div className="customer-management-panel">
        <ToggleService reviewState={updateReviewState} />
      </div>
      }

      {/* Avaliação do cliente */}
      {startReview && <div className="waiter-public-review">
        <CustomerReview {...waiter}/>
      </div>}

    </div>
  );
};

export default WaiterPublicInterface;
