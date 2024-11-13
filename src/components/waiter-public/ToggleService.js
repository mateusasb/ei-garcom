import '../../styles/waiter-public.css'
import { useParams } from "react-router-dom";
import React, { useEffect, useLayoutEffect, useState } from 'react';
import { socket } from '../../socket'
import { getVisitorId } from '../../services/controller/visitorController';

function ToggleService() {
    const { waiterSlug } = useParams();
    const [serviceStatus, setServiceStatus] = useState('idle');

    useLayoutEffect(() => {
        const lastConnectedSession = localStorage.getItem('lastConnectedSession')
        const lastRequestedService = sessionStorage.getItem('serviceRequest')

        if(lastRequestedService) {
            socket.connect()
        }

        if(lastConnectedSession) {
            socket.connect()
            socket.emit('customer-reconnected', waiterSlug)
            setServiceStatus('initiated')
        }

    }, [waiterSlug])

    useEffect(() => {
        socket.on('connect', () => {
            const lastConnectedSession = localStorage.getItem('lastConnectedSession')
            if(socket.id && lastConnectedSession === null) {
                setServiceStatus('requested');
                socket.emit('new-service-request-customer', waiterSlug, {name: 'Mateus', socket_id: socket.id, visitor_id: getVisitorId()});
                sessionStorage.setItem('serviceRequest', socket.id)
            }
        });

        socket.on('disconnect', (reason) => {
            //console.log(reason)
            //console.log(socket)
            sessionStorage.removeItem('serviceRequest')
        });

        socket.on('service-start-customer', (waiterId) => {
            setServiceStatus('initiated');
            socket.emit('customer-initiate-session', waiterId);
            localStorage.setItem('lastConnectedSession', socket.id);
            sessionStorage.removeItem('serviceRequest');
        });

        socket.on('service-refused-customer', () => {
            setServiceStatus('idle');
            socket.disconnect();
        });

        return () => {
            socket.off('connect');
            socket.off('service-start-customer');
            socket.off('service-refused-customer');
          };

    }, [waiterSlug])

    useEffect(() => {
        if (serviceStatus !== 'requested') {
            return
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
            localStorage.removeItem('lastConnectedSession')
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