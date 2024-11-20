import '../../styles/waiter-public.css'
import { useParams } from "react-router-dom";
import React, { useEffect, useLayoutEffect, useState } from 'react';
import { socket } from '../../socket'
import { getVisitorId } from '../../services/controller/visitorController';

function ToggleService({ reviewState }) {
    const { waiterSlug } = useParams();
    const [serviceStatus, setServiceStatus] = useState('idle');
    const [loading, setLoading] = useState(false);
    const [customerName, setCustomerName] = useState('');
    const [popup, setPopup] = useState(false);

    useLayoutEffect(() => {
        const lastConnectedSession = localStorage.getItem('lastConnectedSession')
        const lastRequestedService = sessionStorage.getItem('serviceRequest')
        const lastCustomerName = sessionStorage.getItem('customerName')

        if(lastRequestedService) {
            socket.connect()
        }

        if(lastConnectedSession) {
            socket.connect()
            socket.emit('customer-reconnected', waiterSlug)
            setServiceStatus('initiated')
        }

        if(!lastCustomerName) {
            setPopup(true)
            return
        }

        if(lastCustomerName) {
            setCustomerName(lastCustomerName)
        }

    }, [waiterSlug, serviceStatus])

    useEffect(() => {
        socket.on('connect', () => {
            const lastConnectedSession = localStorage.getItem('lastConnectedSession')
            if(socket.id && lastConnectedSession === null) {
                setLoading(true)
                setServiceStatus('requested');
                socket.emit('new-service-request-customer', waiterSlug, {name: customerName, socket_id: socket.id, visitor_id: getVisitorId(), table_id: 0});
                sessionStorage.setItem('serviceRequest', socket.id)
            }
        });

        socket.on('disconnect', (reason) => {
            //console.log(reason)
            //console.log(socket)
            sessionStorage.removeItem('serviceRequest')
            setLoading(false)
        });

        socket.on('service-start-customer', (waiterId) => {
            setServiceStatus('initiated');
            socket.emit('customer-initiate-session', waiterId);
            localStorage.setItem('lastConnectedSession', socket.id);
            sessionStorage.removeItem('serviceRequest');
            setLoading(false);
        });

        socket.on('service-refused-customer', () => {
            setServiceStatus('idle');
            localStorage.removeItem('lastConnectedSession');
            socket.disconnect();
        });

        socket.on('proceed-to-review-customer', () => {
            console.log('Proceed to Review');
            reviewState(true);
            localStorage.removeItem('lastConnectedSession');
            socket.disconnect();
          });

        return () => {
            socket.off('connect');
            socket.off('service-start-customer');
            socket.off('service-refused-customer');
            socket.off('proceed-to-review-customer');
          };

    }, [waiterSlug, customerName]) // eslint-disable-line 

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
            setServiceStatus('idle');
            reviewState(true);
            socket.emit('service-request-expired-customer', waiterSlug, getVisitorId());
            localStorage.removeItem('lastConnectedSession');
            socket.disconnect();

        } else {
            socket.connect();
        }
    };

    function callWaiter() {
        socket.emit('customer-call', waiterSlug);
    };

    function handleSetCustomerName(e) {
        e.preventDefault();

        console.log(customerName)
        sessionStorage.setItem('customerName', customerName);
        setPopup(false);
    }

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

            {popup && <div className='popup-overlay'>
                <div className='customer-name-selection'>
                    <form onSubmit={handleSetCustomerName}>
                        <label>Como deseja ser chamado(a)?</label>
                        <input 
                            name='name' 
                            type='text' 
                            id='name'
                            value={customerName}
                            onChange={(e) => setCustomerName(e.target.value)}
                        />
                        <button>Confirmar</button>
                    </form>
                </div>
            </div>}

            {loading && <div className="loader-container"><div className="loader"/></div>}
        </>
    )
}

export default ToggleService