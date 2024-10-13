import '../../styles/waiter-public.css'
import { useParams } from "react-router-dom";
import React, { useEffect, useState } from 'react';
import { socket } from '../../socket'
import { getVisitorId } from '../../services/controller/visitorController';

function ToggleService() {
    const { waiterSlug } = useParams();
    const [serviceStatus, setServiceStatus] = useState('');

    useEffect(() => {
        socket.on('connect', () => {
            if(socket.id) {
                socket.emit('new-service-request-customer', waiterSlug, {name: 'Mateus', socket_id: socket.id, visitor_id: getVisitorId()});
                setServiceStatus('requested');
            }
        })

        socket.on('service-start-customer', (waiterId) => {
            socket.emit('customer-initiate-session', waiterId);
            setServiceStatus('initiated');
        })

        socket.on('service-refused-customer', () => {
            socket.disconnect();
            setServiceStatus('');
        })

        return () => {
            socket.off('connect');
            socket.off('service-start-customer');
            socket.off('service-refused-waiter');
          };

    }, [waiterSlug])

    function serviceChange() {
        if (serviceStatus === 'initiated') {
            socket.disconnect();
            setServiceStatus('');
        } else {
            socket.connect();
        }
    }

    return (
        <button 
            onClick={serviceChange} 
            className= {`btn-toggle-service ${serviceStatus}`}
            disabled = {serviceStatus === 'requested'}
            >
            {serviceStatus === '' || serviceStatus === 'requested' ? 'Iniciar Atendimento' : 'Encerrar Atendimento'}
        </button>
    )
}

export default ToggleService