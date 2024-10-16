import '../../styles/waiter-public.css'
import { useParams } from "react-router-dom";
import React, { useEffect, useLayoutEffect, useState } from 'react';
import { socket } from '../../socket'
import { getVisitorId } from '../../services/controller/visitorController';

function ToggleService() {
    const { waiterSlug } = useParams();
    const [serviceStatus, setServiceStatus] = useState('idle');

    useLayoutEffect(() => {
        const currentSession = localStorage.getItem('currentSession')
        if(currentSession !== null) {
            socket.connect()
            socket.emit('customer-reconnected', waiterSlug)
            setServiceStatus('initiated')
        }

    }, [waiterSlug])

    useEffect(() => {
        socket.on('connect', () => {
            const currentSession = localStorage.getItem('currentSession')
            if(socket.id && currentSession === null) {
                setServiceStatus('requested');
                socket.emit('new-service-request-customer', waiterSlug, {name: 'Mateus', socket_id: socket.id, visitor_id: getVisitorId()});
                localStorage.setItem('currentSession', socket.id)
            }
        })

        socket.on('service-start-customer', (waiterId) => {
            setServiceStatus('initiated');
            socket.emit('customer-initiate-session', waiterId);
            localStorage.setItem('currentSession', socket.id);
        })

        socket.on('service-refused-customer', () => {
            setServiceStatus('idle');
            socket.disconnect();
        })

        return () => {
            socket.off('connect');
            socket.off('service-start-customer');
            socket.off('service-refused-customer');
          };

    }, [waiterSlug])

    useEffect(() => {
        if (serviceStatus !== 'requested') {
            return;
        }
    
        const currentStatus = serviceStatus;
        const timeoutId = setTimeout(() => {
            if (currentStatus === 'requested') {
                socket.emit('service-request-expired-customer', waiterSlug, getVisitorId());
                socket.disconnect();
                setServiceStatus('idle');
            }
        }, 60000);
    
        return () => {
            clearTimeout(timeoutId)
        };
    
    }, [serviceStatus, waiterSlug]);

    function serviceToggle() {
        if (serviceStatus === 'initiated') {
            socket.emit('service-request-expired-customer', waiterSlug, getVisitorId());
            socket.disconnect();
            setServiceStatus('idle');
            localStorage.removeItem('currentSession')
        } else {
            socket.connect();
        }
    };

    function callWaiter() {
        socket.emit('customer-call', waiterSlug);
    };

    return (
        <>
            <button
                onClick={callWaiter}
                className='btn-call-waiter'
                disabled = {serviceStatus !== 'initiated'}
            > Chamar Garçom
            </button>

            <button 
                onClick={serviceToggle} 
                className= {`btn-toggle-service ${serviceStatus}`}
                disabled = {serviceStatus === 'requested'}
                >
                {serviceStatus === 'idle' || serviceStatus === 'requested' ? 'Iniciar Atendimento' : 'Encerrar Atendimento'}
            </button>
        </>
    )
}

export default ToggleService