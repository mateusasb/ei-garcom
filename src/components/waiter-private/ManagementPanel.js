import React, { useState, useLayoutEffect, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { socket } from '../../socket'

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
    <div>
      
      {/* Card de novo atendimento */}
      {newServiceRequest && (
        <div className="service-request-card">
          <h2>Nova Solicitação</h2>
          <p>Um cliente deseja iniciar um atendimento com você. Aceitar?</p>
          <button onClick={handleAcceptService}>Sim</button>
          <button onClick={handleRejectService}>Não</button>
        </div>
      )}

      <h2>Painel de Gerenciamento</h2>
      {/* Aqui virão os atendimentos em curso */}
      <p>Cliente: João - Mesa 5</p>
      <button>Finalizar Atendimento</button>

    </div>
  );
};

export default ManagementPanel;
