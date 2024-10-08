import React, { useState, useLayoutEffect, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { socket } from '../../socket'
import '../../styles/waiter-private.css'

const ManagementPanel = () => {
  const { waiterSlug } = useParams();
  const [sessionStart, setSessionStart] = useState()
  const [newServiceRequest, setNewServiceRequest] = useState();

  useLayoutEffect(() => {
    setSessionStart(true)
    socket.connect()

  }, [sessionStart])

  useEffect(() => {
    socket.on('connect', () => {
        socket.emit('waiter-initiate-session', waiterSlug)
    });

    socket.on('disconnect', () => {
        setSessionStart(false)
    });

    socket.on('new-service-request-waiter', (customerInfo) => {
      setNewServiceRequest(customerInfo)
    });

    return () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.off('new-service-request');
    };

  }, [waiterSlug])

  function handleAcceptService() {
    setNewServiceRequest(null);
    console.log(newServiceRequest);
    socket.emit('service-start-waiter', waiterSlug, newServiceRequest.socket_id)
    console.log('Atendimento Aceito')
  };

  function handleRejectService() {
    setNewServiceRequest(null);
    console.log('Atendimento Recusado')
  };

  return (
    <div className="waiter-management-panel">
      
      {/* Card de novo atendimento */}
      {newServiceRequest && (
        <ul className="service-request-cards">
          <li id='card'>
            <h3>Nova Solicitação</h3>
            <p>Um cliente deseja iniciar um atendimento com você. Aceitar?</p>
            <div className='waiter-action-buttons'>
              <button onClick={handleAcceptService} id='btn-yes'>Sim</button>
              <button onClick={handleRejectService} id='btn-no'>Não</button>
            </div>
          </li>
        </ul>
      )}

      <h2>Painel de Gerenciamento</h2>
      <ul className='service-active-cards'>
        <li id='card'>
          {/* Aqui virão os atendimentos em curso */}
          <h3>Atendimento ativo</h3>
          <p>Cliente: João - Mesa 5</p>
          <div className='waiter-action-buttons'>
            <button id='btn-end-service'>Finalizar Atendimento</button>
            <button id='btn-change-table'>Atribuir Mesa</button>
          </div>
        </li>
      </ul>

    </div>
  );
};

export default ManagementPanel;
