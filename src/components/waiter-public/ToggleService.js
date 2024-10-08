import '../../styles/waiter-public.css'
import { useParams } from "react-router-dom";
import React, { useEffect, useState } from 'react';
import { socket } from '../../socket'
import { getVisitorId } from '../../services/controller/visitorController';

function ToggleService() {
    const { waiterSlug } = useParams();
    const [serviceStart, setServiceStart] = useState(false);

    useEffect(() => {
        if (serviceStart) {
            socket.connect()
        } else {
            socket.disconnect()
        }

        return () => {
            socket.disconnect();
        };
        
    }, [serviceStart]);

    useEffect(() => {
        socket.on('connect', () => {
            if(socket.id) {
                socket.emit('new-service-request-customer', waiterSlug, {name: 'Mateus', socket_id: socket.id, visitor_id: getVisitorId()});
            }
        })

        socket.on('service-start-customer', (waiterId) => {
            socket.emit('customer-initiate-session', waiterId);
        })

        return () => {
            socket.off('connect');
            socket.off('disconnect');
            socket.off('service-start-customer');
          };

    }, [waiterSlug])

    function serviceChange() {
        setServiceStart(!serviceStart);
    };

    return (
        <button 
            onClick={serviceChange} 
            className= {`btn-toggle-service ${serviceStart ? 'end' : ''}`}>
            {serviceStart ? 'Encerrar' : 'Iniciar'} Atendimento
        </button>
    )
}

export default ToggleService