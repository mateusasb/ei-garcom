import React, { useState, useLayoutEffect, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { socket } from '../../socket'
import '../../styles/waiter-private.css'

const ManagementPanel = () => {
  const { waiterSlug } = useParams();
  const [sessionStart, setSessionStart] = useState()
  const [serviceRequests, setServiceRequests] = useState([]);

  useLayoutEffect(() => {
    setSessionStart(true)
    socket.connect()

  }, [sessionStart])

  useEffect(() => {
    socket.on('connect', () => {
        socket.emit('waiter-initiate-session', waiterSlug)
    });

    socket.on('customer-call', () => {
      alert('Cliente Chamando')
    })

    socket.on('new-service-request-waiter', (customerInfo) => {
      setServiceRequests((prevRequests) => {
        const alreadyExists = prevRequests.findIndex((req) => req.visitor_id  === customerInfo.visitor_id)

        if(alreadyExists === -1) {
          return [...prevRequests, customerInfo];
        } else {
          prevRequests[alreadyExists].socket_id = customerInfo.socket_id
          return prevRequests;
        }
      })

    });

    socket.on('service-request-expired-waiter', (customerSocket) => {
      setServiceRequests((prevRequests) => prevRequests.filter((req) => req.socket_id !== customerSocket));
    })

    return () => {
      socket.off('connect');
      socket.off('customer-call');
      socket.off('new-service-request-waiter');
      socket.off('service-request-expired-waiter');
    };

  }, [waiterSlug])

  function handleAcceptService(requestId, socketId) {
    setServiceRequests((prevRequests) => prevRequests.filter((req) => req.visitor_id !== requestId));
    socket.emit('service-start-waiter', waiterSlug, socketId)
  };

  function handleRejectService(requestId, socketId) {
    setServiceRequests((prevRequests) => prevRequests.filter((req) => req.visitor_id !== requestId));
    socket.emit('service-refused-waiter', socketId)
  };

  return (
    <div className="waiter-management-panel">
      
      {/* Lista de cards de novos atendimentos */}
      {serviceRequests.length === 0 ? (
        <div></div>
      ) : (
      <ul className="service-request-cards">
        {serviceRequests.map((request) => (
          <li key={request.visitor_id} id="card">
            
            <h3>Nova Solicitação</h3>
            <p>{request.name} deseja iniciar um atendimento com você. Aceitar?</p>
            
            <div className="waiter-action-buttons">
              
              <button onClick={() => handleAcceptService(request.visitor_id, request.socket_id)} id="btn-yes">Sim</button>
              <button onClick={() => handleRejectService(request.visitor_id, request.socket_id)} id="btn-no">Não</button>
            
            </div>
          </li>
        ))}
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
