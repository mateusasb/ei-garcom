import '../../styles/waiter-public.css'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import { socket } from '../../socket'

function ToggleCallWaiter() {
    const { waiterSlug } = useParams();
    const [sessionStart, setSessionStart] = useState()

    useEffect(() => {
        socket.on('service-start-customer', () => {
            setSessionStart(true)
        })

    }, [])

    function callWaiter() {
        socket.emit('customer-call', waiterSlug); 
    }

    return (
        <button className="btn-call-waiter" onClick={callWaiter} disabled={!sessionStart}>Chamar Garçom</button>
    )
}

export default ToggleCallWaiter