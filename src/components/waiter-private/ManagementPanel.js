import React, { useState, useLayoutEffect, useEffect } from 'react';
import { useNavigate, useParams, useOutletContext } from 'react-router-dom';
import { socket } from '../../socket'
import { saveServiceRequests, removeServiceRequests, getCurrentRequests, getActiveServices, removeActiveServices, updateActiveService } from '../../services/controller/servicesController';
import { auth } from '../../firebase'
import { onAuthStateChanged } from 'firebase/auth';
import '../../styles/waiter-private.css'

const ManagementPanel = () => {
  const [requests, setRequests] = useState([]);
  const [services, setServices] = useState([]);
  const [waiterInfo, setWaiterInfo] = useState(null);
  const [changeTable, setChangeTable] = useState(false);
  const [tableId, setTableId] = useState(0);
  const { waiterSlug } = useParams();
  const { userData } = useOutletContext();
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        socket.disconnect();
        navigate('/login');
      } else {
        socket.connect();
      }
    });

    return () => unsubscribe();
  }, [auth]); // eslint-disable-line

  useLayoutEffect(() => {
    handleUserSessionStorage();

    if (auth.currentUser) {
      setServices(JSON.parse(localStorage.getItem('currentActiveServices')) || []);
      sessionStorage.setItem('userData', JSON.stringify(userData));
    }

    return () => {
      socket.disconnect();
      sessionStorage.removeItem('userData');
    };
  }, []); // eslint-disable-line

  useEffect(() => {
    socket.on('connect', () => {
      socket.emit('waiter-initiate-session', waiterSlug)
      setRequests(getCurrentRequests());
      setServices(getActiveServices());
    });

    socket.on('customer-call', () => {
      alert('Cliente Chamando')
    })

    socket.on('new-service-request-waiter', (customerInfo) => {
      saveServiceRequests(getCurrentRequests(), customerInfo)
      setRequests(getCurrentRequests());
    });

    socket.on('service-request-expired-waiter', (visitorId) => {
      removeServiceRequests(getCurrentRequests(), visitorId, false)
      setRequests(getCurrentRequests());
      setServices(getActiveServices());
    })

    return () => {
      socket.off('connect');
      socket.off('customer-call');
      socket.off('new-service-request-waiter');
      socket.off('service-request-expired-waiter');
    };

  }, [waiterSlug])

  function handleAcceptServiceRequest(visitorId, socketId) {
    const updatedRequests = removeServiceRequests(requests, visitorId, true);
    setRequests(updatedRequests);
    setServices(getActiveServices());
    socket.emit('service-start-waiter', waiterSlug, socketId)
  };

  function handleRejectServiceRequest(visitorId, socketId) {
    const updatedRequests = removeServiceRequests(requests, visitorId, false);
    setRequests(updatedRequests);
    setServices(getActiveServices());
    socket.emit('service-refused-waiter', socketId);
  };

  function handleEndActiveService(visitorId, socketId) {
    removeActiveServices(visitorId);
    setServices(getActiveServices());
    socket.emit('proceed-to-review', socketId);
    socket.emit('service-refused-waiter', socketId);
  }

  function handleUserSessionStorage() {
    let authUserData = sessionStorage ? JSON.parse(sessionStorage.getItem('userData')) : null;
    if (!authUserData) {
      sessionStorage.setItem('userData', JSON.stringify(userData));
      authUserData = JSON.parse(sessionStorage.getItem('userData'));
    }
    
    setWaiterInfo(authUserData);
  }

  function changeTableId(event, visitorId) {
    event.preventDefault();

    const currentService = services.find((serv) => serv.visitor_id = visitorId);
    if(currentService) {
      currentService.table_id = tableId;
      updateActiveService(currentService);
      setServices(getActiveServices());
      setChangeTable(!changeTable);
    }

  }

  const handleLogout = async () => {
    if(auth.currentUser) {
      try {
        console.log("Usuário deslogado com sucesso!");
        await auth.signOut();
      } catch(error) {
        console.error('Erro ao deslogar', error)
      }

    };
  };

  return (
    <div className="waiter-management-panel">
      <h1>{waiterInfo && `${waiterInfo.first_name} ${waiterInfo.last_name}`}</h1>

      <button onClick={handleLogout}>Logout</button>
      
      {/* Lista de cards de novos atendimentos */}
      {requests && requests.length === 0 ? (
        <div></div>
      ) : (
      <ul className="service-request-cards">
        {requests && requests.map((request) => (
          <li key={request.visitor_id} id="card">
            
            <h3>Nova Solicitação</h3>
            <p>{request.name} deseja iniciar um atendimento com você. Aceitar?</p>
            
            <div className="waiter-action-buttons">
              
              <button onClick={() => handleAcceptServiceRequest(request.visitor_id, request.socket_id)} id="btn-yes">Sim</button>
              <button onClick={() => handleRejectServiceRequest(request.visitor_id, request.socket_id)} id="btn-no">Não</button>
            
            </div>
          </li>
        ))}
      </ul>
      )}

      <h2>Painel de Gerenciamento</h2>
      {/* Aqui virão os atendimentos em curso */}
      {services && services.length === 0 ? (
        <div></div>
      ) : (
      <ul className='service-active-cards'>
        {services && services.map((service) => (
          <li key={service.visitor_id} id='card'>

            <h3>Atendimento ativo</h3>
            <p>Cliente: {service.name} - Mesa {service.table_id}</p>
            <div className='waiter-action-buttons'>
              <button id='btn-end-service' onClick={() => handleEndActiveService(service.visitor_id, service.socket_id)}>Finalizar Atendimento</button>
              <button 
                id='btn-change-table'
                hidden={changeTable}
                onClick={() => setChangeTable(!changeTable)}
              >
                Atribuir Mesa
              </button>
            </div>

            <div className='waiter-manage-table-id'>
              {changeTable && <form onSubmit={(e) => changeTableId(e, service.visitor_id)}> 
                <input 
                  name="table-id"
                  type="number"
                  min="0"
                  max="100"
                  onChange={(e) => setTableId(e.target.value)}
                /> 
                <button>Alterar Mesa</button> 
              </form>}
            </div>

          </li>
        ))}
      </ul>
      )}

    </div>
  );
};

export default ManagementPanel;
