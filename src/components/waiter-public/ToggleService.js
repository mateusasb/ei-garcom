import '../../styles/waiter-public.css'
import { useParams } from "react-router-dom";
import React, { useEffect, useState } from 'react';
import { socket } from '../../socket'

function ToggleService() {
    const { waiterSlug } = useParams();
    const [serviceStart, setServiceStart] = useState(false);
    console.log(waiterSlug);

    useEffect(() => {
        if (serviceStart) {
            socket.connect()
        } else {
            socket.disconnect()
        }
        
    }, [serviceStart]);

    function serviceChange() {
        socket.emit('new-service-request', ('novo pedido de atendimento'))
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